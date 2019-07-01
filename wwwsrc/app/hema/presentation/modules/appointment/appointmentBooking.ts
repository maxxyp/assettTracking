import { TaskTimeDurationModel } from "./viewModels/taskTimeDurationModel";
import { inject } from "aurelia-framework";
import { Router } from "aurelia-router";
import * as moment from "moment";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { LabelService } from "../../../business/services/labelService";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { JobService } from "../../../business/services/jobService";
import { IValidationService } from "../../../business/services/interfaces/IValidationService";
import { ValidationService } from "../../../business/services/validationService";
import { IBusinessRuleService } from "../../../business/services/interfaces/IBusinessRuleService";
import { BusinessRuleService } from "../../../business/services/businessRuleService";
import { CatalogService } from "../.././../business/services/catalogService";
import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";
import { EditableViewModel } from "../../models/editableViewModel";
import { DataState } from "../../../business/models/dataState";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { EngineerService } from "../../../business/services/engineerService";
import { IAppointmentBookingService } from "../../../business/services/interfaces/IAppointmentBookingService";
import { AppointmentBookingService } from "../../../business/services/appointmentBookingService";
import { DialogService } from "aurelia-dialog";
import { Appointment } from "../../../business/models/appointment";
import { AppointmentDurationItem } from "../../../business/models/appointmentDurationItem";
import { Job } from "../../../business/models/job";
import { Task } from "../../../business/models/task";
import { IAppointmentBand } from "../../../business/models/reference/IAppointmentBand";
import { JobState } from "../../../business/models/jobState";
import { BindingEngine } from "aurelia-binding";
import { DateHelper } from "../../../core/dateHelper";
import { IDynamicRule } from "../../../business/services/validation/IDynamicRule";

@inject(JobService, EngineerService, LabelService, Router,
    EventAggregator, ValidationService, BusinessRuleService, CatalogService,
    BindingEngine, AppointmentBookingService, DialogService)
export class AppointmentBooking extends EditableViewModel {

    public minDate: Date;
    public maxDate: Date;

    public hasParts: boolean;
    public hasAppointment: boolean;

    public normalAccessInformation: string;
    public promisedDate: Date;
    public promisedTimeSlot: string;
    public generalAccessInformation: string;
    public accessInformation: string;
    public preferredEngineer: string;
    public estimatedDurationOfAppointment: TaskTimeDurationModel[];
    public promisedTimeSlotCatalog: IAppointmentBand[];
    public canBook: boolean;
    public preferredEngineerIdPlaceholder: string;
    public estimatedDurationOfAppointmentMaxValue: number;
    public estimatedDurationOfAppointmentMaxLength: number;
    public estimatedDurationOfAppointmentPlaceholder: string;

    public isTodaysDateAvailable: boolean;

    private _job: Job;
    private _appointmentBookingService: IAppointmentBookingService;
    private _promiseDateWarningThreshold: number;
    private _cutOffTime: string;
    private _showAppointmentRemovedInfo: boolean;
    private _router: Router;
    private _appointmentAllowedActivityStatus: string[];
    private _appointmentBookingSubscriptions: Subscription[];
    private _bindingEngine: BindingEngine;
    private _estimatedEndTimeInMinutes: number;
    private _partsRequiredStatus: string;

    public constructor(jobService: IJobService,
        engineerService: IEngineerService,
        labelService: ILabelService,
        router: Router,
        eventAggregator: EventAggregator,
        validationService: IValidationService,
        businessRulesService: IBusinessRuleService,
        catalogService: ICatalogService,
        bindingEngine: BindingEngine,
        appointmentBookingService: IAppointmentBookingService,
        dialogService: DialogService) {
        super(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService);
        this._appointmentBookingService = appointmentBookingService;
        this.hasAppointment = false;
        this._showAppointmentRemovedInfo = true;
        this._router = router;
        this.isTodaysDateAvailable = false;
        this._bindingEngine = bindingEngine;
        this._appointmentBookingSubscriptions = [];
        this.estimatedDurationOfAppointmentMaxValue = 0;
    }

    public activateAsync(params: { jobId: string }): Promise<any> {
        this.jobId = params.jobId;
        return this.loadBusinessRules()
            .then(() => this.buildBusinessRules())
            .then(() => this.loadCatalogs())
            .then(() => this.checkJobHasParts())
            .then(() => this.load())
            .then(() => this.buildValidationRules())
            .then(() => this.showContent());
    }

    public navigateToJob(): void {
        if (this._job.state === JobState.done) {
            this._router.navigateToRoute("doneJob", { jobId: this._job.id });
        } else {
            this._router.navigateBack();
        }
    }

    public promisedDateChanged(date: Date): void {
        this.warnPromisedDateThreshold(date);
    }

    public promisedTimeSlotChanged(timeSlot: string): Promise<void> {
        let startTime: number = 0;
        if (timeSlot) {
            if (this.businessRules[timeSlot]) {
                startTime = this.getBusinessRule<number>(timeSlot);
            } else {
                startTime = parseInt(timeSlot, 10);
            }
            this.estimatedDurationOfAppointmentMaxValue = DateHelper.getEstimatedDurationOfAppointmentMaxValue(startTime, this._estimatedEndTimeInMinutes);

            return this.validateAllRules();
        }
        return Promise.resolve();
    }

    public deactivateAsync(): Promise<void> {
        this.clearSubscriptions();
        return Promise.resolve();
    }
    public saveAppointment(): Promise<void> {
        let finalDataState = this.getFinalDataState();
        if (finalDataState !== DataState.valid) { return Promise.resolve(); }

        let appointment: Appointment = new Appointment();
        appointment.jobId = this.jobId;
        appointment.accessInformation = this.accessInformation;
        appointment.generalAccessInformation = this.generalAccessInformation;
        appointment.normalAccessInformation = this.normalAccessInformation;
        appointment.preferredEngineer = this.preferredEngineer;
        appointment.promisedDate = this.promisedDate;
        appointment.promisedTimeSlot = this.promisedTimeSlot;
        appointment.estimatedDurationOfAppointment = [];
        this.estimatedDurationOfAppointment.forEach(x => {
            let item = new AppointmentDurationItem();
            item.taskId = x.taskId;
            item.duration = x.duration;
            item.specialRequirement = x.specialRequirement;
            appointment.estimatedDurationOfAppointment.push(item);
        });
        appointment.dataState = finalDataState;
        this.hasAppointment = true;
        return this._appointmentBookingService.save(appointment);
    }
    protected loadModel(): Promise<void> {
        this.isNew = true;
        this.clearSubscriptions();

        return Promise.all([this._jobService.getJob(this.jobId), this._engineerService.getCurrentEngineer()])
            .then(([job, engineer]) => {
                this._job = job;
                this.setState(job);

                if (this._job && this.canBook) {
                    this.initDate();
                    this.setObservables();

                    if (this._job.appointment) {
                        this.hasAppointment = true;
                        this.accessInformation = this._job.appointment.accessInformation;
                        this.generalAccessInformation = this._job.appointment.generalAccessInformation;
                        this.normalAccessInformation = this._job.appointment.normalAccessInformation;
                        this.promisedDate = moment(this._job.appointment.promisedDate).toDate();
                        this.promisedTimeSlot = this._job.appointment.promisedTimeSlot;
                        this.estimatedDurationOfAppointment = [];
                        this.preferredEngineer = this._job.appointment.preferredEngineer;
                        this.setInitialDataState(this._job.appointment.dataStateId, this._job.appointment.dataState);
                        this.setTaskTimeDurations(this._job.tasks, this._job.appointment);
                    } else {
                        this.preferredEngineer = engineer.id;
                        this.initFields();
                    }
                }
            });
    }

    protected clearModel(): Promise<void> {
        return this._appointmentBookingService.removeAppointment(this.jobId)
            .then(() => this.init())
            .then(() => this.initDate())
            .then(() => {
                if (this._showAppointmentRemovedInfo) {
                    this.showInfo(this.getLabel("appointmentNotificationTitle"), this.getLabel("appointmentRemoved"));
                }
                this.hasAppointment = false;
                this.clearFields();
            });
    }

    protected showSaveToast(finalDataState: DataState): void {
        if (finalDataState === DataState.valid) {
            this.showSuccess(this.getLabel("appointmentNotificationTitle"), this.getLabel("appointmentSaved"));
        } else {
            this.showDanger(this.getLabel("appointmentNotificationTitle"), this.getLabel("appointmentNotSaved"));
        }
    }

    protected clearFields(): void {
        this.promisedDate = undefined;
        this.preferredEngineer = undefined;
        this.accessInformation = undefined;
        this.promisedTimeSlot = undefined;
        this.estimatedDurationOfAppointmentMaxValue = undefined;
        this.setTaskTimeDurations(this._job.tasks, this._job.appointment);
    }

    private initFields(): void {
        this.hasAppointment = false;
        this.init();
        this.setTaskTimeDurations(this._job.tasks, null);
        this.promisedTimeSlot = undefined;
        this.setNewDataState("appointment");
    }

    private buildBusinessRules(): Promise<void> {
        this._promiseDateWarningThreshold = this.getBusinessRule<number>("promiseDateWarningThreshold");
        this._cutOffTime = this.getBusinessRule<string>("cutOffTime");
        this.preferredEngineerIdPlaceholder = this.getBusinessRule<string>("preferredEngineerIdPlaceholder");
        this._appointmentAllowedActivityStatus = this.getBusinessRule<string>("appointmentAllowedActivityStatus").split(",");
        this.estimatedDurationOfAppointmentPlaceholder = this.getBusinessRule<string>("estimatedDurationOfAppointmentPlaceholder");
        this.estimatedDurationOfAppointmentMaxLength = this.getBusinessRule<number>("estimatedDurationOfAppointmentMaxLength");
        this._estimatedEndTimeInMinutes = this.getBusinessRule<number>("estimatedEndTimeInMinutes");

        return this._businessRuleService.getQueryableRuleGroup("taskItem").then((taskItemRuleGroup) => {
            this._partsRequiredStatus = taskItemRuleGroup.getBusinessRule<string>("activityPartsRequiredStatus");
       });
    }

    private buildValidationRules(): Promise<void> {
        let estimatedDurationRules: IDynamicRule[] = [];

        let otherRules: IDynamicRule[] = [
            {
                property: "promisedDate", condition: () => this.canBook
            },
            {
                property: "promisedTimeSlot", condition: () => this.canBook,
            },
            {
                property: "preferredEngineer", condition: () => !!this.preferredEngineer
            }
        ];

        if (this.estimatedDurationOfAppointment && this.estimatedDurationOfAppointment.length > 0) {
            this.estimatedDurationOfAppointment.forEach((app, index) => {
                estimatedDurationRules.push(
                    {
                        property: "estimatedDurationOfAppointment[" + index + "].duration",
                        groups: ["estimatedDurationOfAppointment[" + index + "]"],
                        condition: () => this.estimatedDurationOfAppointment[index].duration && this.promisedTimeSlot ? true : false,
                        passes: [
                            {
                                test: () => this.estimatedDurationOfAppointment[index].duration > this.estimatedDurationOfAppointmentMaxValue ? false : true,
                                message: () => this.getParameterisedLabel("estimatedDurationMaxValueError", [this.estimatedDurationOfAppointmentMaxValue])
                            }
                        ]
                    }
                );
            });
        }

        return this.buildValidation(otherRules.concat(estimatedDurationRules));
    }

    private loadCatalogs(): Promise<void> {
        return Promise.all([
            this._catalogService.getAppointmentBands()
        ]).then(([promisedTimeSlotCatalog]) => {
            if (promisedTimeSlotCatalog) {
                this.promisedTimeSlotCatalog = promisedTimeSlotCatalog;
            }
        });
    }

    private init(): Promise<void> {
        if (this.promisedTimeSlotCatalog && this.promisedTimeSlotCatalog[0]) {
            this.promisedTimeSlot = this.promisedTimeSlotCatalog[0].appointmentBandCode;
        }

        return this._appointmentBookingService.getGeneralAccessInformation(this.jobId)
            .then((value) => {
                this.generalAccessInformation = value;
            });
    }

    private checkJobHasParts(): Promise<void> {
        return this._appointmentBookingService.hasParts(this.jobId).then((val) => {
            this.hasParts = val;
        });
    }

    private warnPromisedDateThreshold(promisedDate: Date): void {
        if (promisedDate) {
            let date1 = moment(promisedDate);
            let date2 = moment();
            let noOfDays = date1.diff(date2, "days");

            if (noOfDays >= this._promiseDateWarningThreshold) {
                this.showWarning(this.getLabel("promisedDate"), this.getParameterisedLabel("promiseDateWarningThresholdWarning", [this._promiseDateWarningThreshold]));
            }
        }
    }

    private setState(job: Job): void {
        if (job && job.tasks) {
            if (this._job.tasks.find(x => this._appointmentAllowedActivityStatus.some((el) => el === x.status))) {
                this.canBook = true;
            } else {
                this.canBook = false;
            }
        }
    }

    private setTaskTimeDurations(tasks: Task[], appointment?: Appointment): void {
        this.estimatedDurationOfAppointment = [];
        tasks.filter(task => this._appointmentAllowedActivityStatus.indexOf(task.status) !== -1)
            .forEach(x => {
                if (x) {
                    let time: TaskTimeDurationModel = new TaskTimeDurationModel();
                    time.taskId = x.id;
                    time.jobType = x.jobType;
                    time.applianceType = x.applianceType;
                    if (appointment) {
                        let appointmentDuration = appointment.estimatedDurationOfAppointment.find(y => y.taskId === x.id);
                        if (appointmentDuration) {
                            time.duration = appointmentDuration.duration;
                            time.specialRequirement = appointmentDuration.specialRequirement;
                        }
                    } else {
                        time.duration = undefined;
                        time.specialRequirement = undefined;
                    }

                    this.estimatedDurationOfAppointment.push(time);
                }
            });
    }

    private initDate(): void {
        let todaysDate =  DateHelper.getTodaysDate();
        let isPartsRequired = this._job.tasks.some(t => t.status === this._partsRequiredStatus);

        if (this._job && this._job.appointment && this._job.appointment.promisedDate) {
            this.minDate = this._job.appointment.promisedDate;
        } else {        
            if (!this.hasParts && !isPartsRequired) {
                this.minDate =  todaysDate;
            } else {
                if (this._appointmentBookingService.checkCutOffTimeExceededWithParts(moment(todaysDate).toDate(), moment(todaysDate).toDate(), this._cutOffTime)) {
                    this.minDate = this._appointmentBookingService.getNexAppointmentDateWithParts(moment(todaysDate).add(2, "days").toDate());
                } else {
                    this.minDate = moment(todaysDate).add(1, "days").toDate();
                }
            }
        }

        this.isTodaysDateAvailable = moment(todaysDate).isSame(moment(this.minDate));
    }

    private setObservables(): void {
        let sub1 = this._bindingEngine.propertyObserver(this, "promisedDate")
            .subscribe(newValue => this.promisedDateChanged(newValue));
        this._appointmentBookingSubscriptions.push(sub1);

        let sub2 = this._bindingEngine.propertyObserver(this, "promisedTimeSlot")
            .subscribe(newValue => this.promisedTimeSlotChanged(newValue));
        this._appointmentBookingSubscriptions.push(sub2);

    }

    private clearSubscriptions(): void {
        if (this._appointmentBookingSubscriptions.length > 0) {
            this._appointmentBookingSubscriptions.forEach(s => s.dispose());
            this._appointmentBookingSubscriptions = [];
        }
    }
}
