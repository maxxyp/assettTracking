import { CatalogService } from "../../../business/services/catalogService";
import { BusinessRuleService } from "../../../business/services/businessRuleService";
import { JobService } from "../../../business/services/jobService";
import { EngineerService } from "../../../business/services/engineerService";
import { LabelService } from "../../../business/services/labelService";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { ValidationService } from "../../../business/services/validationService";
import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { IValidationService } from "../../../business/services/interfaces/IValidationService";
import { IBusinessRuleService } from "../../../business/services/interfaces/IBusinessRuleService";
import { inject } from "aurelia-dependency-injection";
import { IApplianceService } from "../../../business/services/interfaces/IApplianceService";
import { ApplianceService } from "../../../business/services/applianceService";
import { TaskService } from "../../../business/services/taskService";
import { ITaskService } from "../../../business/services/interfaces/ITaskService";
import { Router } from "aurelia-router";
import { BindingEngine, computedFrom } from "aurelia-binding";
import { Task } from "../../../business/models/task";
import { ChargeServiceConstants } from "../../../business/services/constants/chargeServiceConstants";
import { ChargeCatalogHelperService } from "../../../business/services/charge/chargeCatalogHelperService";
import { IChargeCatalogHelperService } from "../../../business/services/interfaces/charge/IChargeCatalogHelperService";
import { EditableViewModel } from "../../models/editableViewModel";
import { Job } from "../../../business/models/job";
import { ObjectHelper } from "../../../../common/core/objectHelper";
import { IFieldActivityType } from "../../../business/models/reference/IFieldActivityType";
import { IActionType } from "../../../business/models/reference/IActionType";
import { BusinessException } from "../../../business/models/businessException";
import { Threading } from "../../../../common/core/threading";
import { Appliance } from "../../../business/models/appliance";
import * as moment from "moment";
import { TaskConstants } from "../../constants/taskConstants";
import { JobServiceConstants } from "../../../business/services/constants/jobServiceConstants";
import { IChargeType } from "../../../business/models/reference/IChargeType";
import { ChargeService } from "../../../business/services/charge/chargeService";
import { IChargeService } from "../../../business/services/interfaces/charge/IChargeService";

@inject(CatalogService, JobService, EngineerService, LabelService, EventAggregator, DialogService,
    ValidationService, BusinessRuleService, ApplianceService, TaskService, Router, BindingEngine, ChargeCatalogHelperService, ChargeService)

export class TaskAppliance extends EditableViewModel {
    // .DF_1681 we need to stop multiple submissions of the same new record
    public isCompleteTriggeredAlready: boolean;
    public appliances: Appliance[];
    public selectedApplianceId: string;
    public selectedApplianceDescription: string;

    public actionTypes: IActionType[];
    public selectedActionType: string;

    public chargeTypes: IChargeType[];
    public selectedChargeText: string;
    public selectedChargeType: string;
    public chargeTypeErrorMsg: string;
    public actionTypeErrorMsg: string;

    public task: Task;
    public isNewTask: boolean;
    public isFirstVisitActivity: boolean;
    public showActionTypesLoading: boolean;
    public showChargeTypesLoading: boolean;
    public noChargeRulesFound: boolean;

    protected _applianceService: IApplianceService;
    protected _taskService: ITaskService;

    protected _router: Router;
    protected _fmtFieldActivityType: string;

    protected _newTaskId: string;
    protected _visitNumber: number;
    protected _selectedApplianceType: string;
    protected _validNewWorkInd: string;
    protected _job: Job;

    private _bindingEngine: BindingEngine;
    private _rfaSubscriptions: Subscription[];
    private _firstVisitRestrictions: string[];
    private _firstVisitJobCode: string;
    private _chargeRulesDateFormat: string;
    private _chargeCatalogHelper: IChargeCatalogHelperService;
    private _chargeMethodCodeLength: number;
    private _firstVisitSequence: number;
    private _businessRulesService: IBusinessRuleService;
    private _chargeService: IChargeService;

    constructor(catalogService: ICatalogService,
                jobService: IJobService,
                engineerService: IEngineerService,
                labelService: ILabelService,
                eventAggregator: EventAggregator,
                dialogService: DialogService,
                validationService: IValidationService,
                businessRulesService: IBusinessRuleService,
                applianceService: IApplianceService,
                taskService: ITaskService,
                router: Router,
                bindingEngine: BindingEngine,
                chargeCatalogHelper: IChargeCatalogHelperService,
                chargeService: IChargeService) {
        super(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService);
        this._businessRulesService = businessRulesService;
        this._bindingEngine = bindingEngine;
        this._applianceService = applianceService;
        this._taskService = taskService;
        this.actionTypes = [];
        this._router = router;
        this._visitNumber = 1;
        this._rfaSubscriptions = [];
        this.isNewTask = false;
        this._chargeCatalogHelper = chargeCatalogHelper;
        this.isFirstVisitActivity = true;
        this.showActionTypesLoading = false;
        this.showChargeTypesLoading = false;
        this._chargeService = chargeService;
        this.noChargeRulesFound = false;
    }

    public saveTask(): Promise<void> {
        if (this.isNew) {
            return this.createNew();
        } else {
            return this.updateExisting();
        }
    }

    public activateAsync(params: { jobId: string, taskId: string }): Promise<void> {
        this.jobId = params.jobId;
        this.isNew = true; // .DF_1697
        return this.loadBusinessRules()
            .then(() => this.buildBusinessRules())
            .then(() => this.populateErrorMessage())
            .then(() => this.buildCustomBusinessRules())
            .then(() => this.loadJob(params.jobId))
            .then(() => this.populateAppliances(params.jobId))
            .then(() => params.taskId ? this.loadExistingTask(params.jobId, params.taskId) : this.loadNewTask(params.jobId))
            .then(() => this.filterAppliances())
            .then(() => this.populate())
            // had to set obervable manually
            // becouse known issue with dropdown
            .then(() => this.setObservables())
            .then(() => this.showContent());
    }

    public deactivateAsync(): Promise<void> {
        this.removeObservables();
        return Promise.resolve();
    }

    public selectedApplianceIdChanged(newValue: string, oldValue: string): Promise<void> {
        if (newValue) {
            this.showActionTypesLoading = true;
            this.actionTypes = [];
            this.selectedActionType = undefined;
            this.chargeTypes = [];
            this.selectedChargeType = undefined;
            if (this.appliances) {
                let app = this.appliances.find(x => x.id === newValue);
                if (app) {
                    this._selectedApplianceType = app.applianceType;
                    this.selectedApplianceDescription = app.description;
                    return this._catalogService.getFieldActivityType(app.applianceType)
                        .then((fieldActivityTypes) => this.populateActionTypes(fieldActivityTypes))
                        .then((actionTypes) => this.actionTypes = actionTypes)
                        .then(() => {
                            this.showActionTypesLoading = false;
                            return Promise.resolve();
                        });
                }
                this.showActionTypesLoading = false;
                return Promise.resolve();
            }
            this.showActionTypesLoading = false;
            return Promise.resolve();
        }
        return Promise.resolve();
    }

    public selectedActionTypeChanged(newValue: string, oldValue: string): Promise<void> {
        this.showChargeTypesLoading = true;
        this.chargeTypes = [];
        if (newValue && this._selectedApplianceType && this.actionTypes) {
            this.selectedChargeType = undefined;
            this.chargeTypes = [];
            let at = this.actionTypes.find(x => x.jobType === newValue);
            if (at) {
                this._logger.info("looking for charge rule", newValue, this._selectedApplianceType);
                return this.populateChargeTypes(this._selectedApplianceType, newValue)
                    .then((chargeTypes) => {
                        this.chargeTypes = chargeTypes;
                        if (this.chargeTypes && this.chargeTypes.length === 1) {
                            this.selectedChargeType = this.chargeTypes[0].chargeType;
                            this.selectedChargeText = this.chargeTypes[0].chargeType + " - " + this.chargeTypes[0].chargeTypeDescription;
                        }
                        this.showChargeTypesLoading = false;
                    });
            }
            this.showChargeTypesLoading = false;
            return Promise.resolve();
        }
        this.showChargeTypesLoading = false;
        return Promise.resolve();
    }

    public async selectedChargeTypeChanged(newValue: string, oldValue: string): Promise<void> {

        if (!this.selectedChargeType) {
            return;
        }

        this.showChargeTypesLoading = true;

        const jobType = this.selectedActionType;
        const applianceType = this._selectedApplianceType;
        const chargeType = this.selectedChargeType;
        const crdf = this._chargeRulesDateFormat;
        const cmcl = this._chargeMethodCodeLength;

        try {
            const chargeRules = await this._chargeCatalogHelper.getJobCodeChargeRule(jobType, applianceType, chargeType, crdf, cmcl);
            this.noChargeRulesFound = chargeRules === undefined;
            this.showChargeTypesLoading = false;
        } catch (ex) {
            this.noChargeRulesFound = true;
            this.showChargeTypesLoading = false;
        }
    }

    public resetViewModel(): Promise<void> {
        this.selectedApplianceId = undefined;
        this._selectedApplianceType = undefined;
        this.selectedApplianceDescription = undefined;
        this.actionTypes = [];
        this.selectedActionType = undefined;
        this.chargeTypes = [];
        this.selectedChargeType = undefined;
        return this.populateAppliances(this.jobId).then(() => this.filterAppliances());
    }

    public cancel(): boolean {
        if (this.task && this.task.id) {
            return this._router.navigateToRoute("activity", {taskId: this.task.id});
        }
        return this._router.navigateToRoute("activities");
    }

    // so could be that we have no charge types for appliance and job type, or there could be a charge type but
    // we cannot find any charge rules associated for the region (see DF_1881)

    @computedFrom("chargeTypes")
    public get noChargeRuleMessage() : string {
        return `${this.chargeTypes && this.chargeTypes.length > 0 ? "No charge rules found for your region" : "No charge types found"}`;
    }

    protected populateAppliances(jobId: string): Promise<void> {
        this.appliances = [];
        return this._applianceService.getAppliances(jobId)
            .then((appliances) => {
                this.appliances = appliances.filter(x => !x.parentId);
                this.appliances.forEach(x => {
                    if (x.description === undefined || x.description === null) {
                        x.description = "";
                    }
                    if (x.locationDescription === undefined || x.locationDescription === null) {
                        x.locationDescription = "";
                    }
                });
            });
    }

    private buildBusinessRules(): void {
        this._fmtFieldActivityType = this.getBusinessRule<string>("fmtFieldActivityType");
        this._validNewWorkInd = this.getBusinessRule<string>("validNewWorkInd");
    }

    private buildCustomBusinessRules(): Promise<void> {
        let taskItemBusinessRules = this._businessRuleService.getQueryableRuleGroup("taskItem");
        let taskApplianceBusinessRules = this._businessRuleService.getQueryableRuleGroup("taskAppliance");
        let chargeServiceBusinessRules = this._businessRuleService.getQueryableRuleGroup("chargeService");

        return Promise.all([taskItemBusinessRules, taskApplianceBusinessRules, chargeServiceBusinessRules])
            .then(([taskItemBusinessRuleGroup, taskApplianceBusinessRuleGroup, chargeServiceBusinessRuleGroup]) => {
                this._firstVisitJobCode = taskItemBusinessRuleGroup.getBusinessRule<string>("firstVisitJob");
                this._chargeRulesDateFormat = chargeServiceBusinessRuleGroup.getBusinessRule<string>("chargeRulesDateFormat");
                this._chargeMethodCodeLength = chargeServiceBusinessRuleGroup.getBusinessRule<number>("chargeMethodCodeLength");

                let firstVisitRestrictionsString = taskApplianceBusinessRuleGroup.getBusinessRule<string>("firstVisitRestrictions");
                if (firstVisitRestrictionsString) {
                    this._firstVisitRestrictions = firstVisitRestrictionsString.split(",");
                }
                this._firstVisitSequence = taskApplianceBusinessRuleGroup.getBusinessRule<number>("firstVisitSequence");
            });
    }

    private loadNewTask(jobId: string): Promise<void> {
        this.isNewTask = true;
        this.isNew = true;
        return this._taskService.getTasksAndCompletedTasks(jobId).then((tasks) => {
            let newTaskId = Task.getNextTaskId(tasks);
            if (!newTaskId) {
                throw new BusinessException(this, "loadNewTask", "Unable to generate next task id for job {0}", [jobId], null);
            }
            this._newTaskId = newTaskId;
            this._visitNumber = 1;
        });
    }

    private loadExistingTask(jobId: string, taskId: string): Promise<void> {
        this.isNew = false;
        return this._jobService.getJob(jobId).then((job) => {
            if (job && job.tasks) {
                this.task = job.tasks.find(x => x.id === taskId);
                if (this.task) {
                    // this is becouse this.task.isNewRFA is an absolute truth.
                    this.isNewTask = this.task.isNewRFA;
                    this.isFirstVisitActivity = this.task.sequence !== undefined ? this.task.sequence === this._firstVisitSequence : this.isFirstVisitActivity;
                    this.filterAppliances();
                    return this.selectedApplianceIdChanged(this.task.applianceId, undefined)
                        .then(() => this.selectedActionTypeChanged(this.task.jobType, undefined))
                        .then(() => this.selectedChargeTypeChanged(this.task.chargeType, undefined));
                }
                return Promise.resolve();
            }
            return Promise.resolve();
        });
    }

    private async populateChargeTypes(applianceType: string, jobType: string): Promise<IChargeType[]> {

        try {
            return await this._chargeCatalogHelper.getChargeTypesByApplianceJob(applianceType, jobType,
                this._chargeRulesDateFormat, this._chargeMethodCodeLength);
        } catch (err) {
            this._logger.error(err);
            this.showChargeTypesLoading = false;
            this.noChargeRulesFound = true;
            return [];
            // throw (err);
        }
    }

    private populateActionTypes(fieldActivityTypes: IFieldActivityType[]): Promise<IActionType[]> {
        let result: IActionType[] = [];
        if (fieldActivityTypes) {
            let actionTypePromises: Promise<IActionType[]>[] = [];
            actionTypePromises = fieldActivityTypes.map((val) => this.getActionTypePromise(val));
            return Promise.all(actionTypePromises)
                .then((actTypes: IActionType[][]) => {
                    if (actTypes) {
                        result = actTypes.reduce<IActionType[]>((acc, val) => (val && val[0]) ? acc.concat(val[0]) : acc, []);
                    }
                    return Promise.resolve(result);
                });
        } else {
            return Promise.resolve(result);
        }
    }

    private getActionTypePromise(fieldActivityType: IFieldActivityType): Promise<IActionType[]> {
        const endDate = moment(fieldActivityType.fieldActivityTypeEndDate, this._fmtFieldActivityType);
        const startDate = moment(fieldActivityType.fieldActivityTypeStartDate, this._fmtFieldActivityType);
        if (moment().isBetween(startDate, endDate)) {
            if (this.isNewTask) {
                // only restrict action types when its new task created from field app
                if (fieldActivityType.validNewWorkIndicator === this._validNewWorkInd) {
                    return this._catalogService.getActionType(fieldActivityType.jobType);
                }
                return undefined;
            }
            return this._catalogService.getActionType(fieldActivityType.jobType);
        }
        return undefined;
    }

    private setObservables(): void {
        // dont get chance to set value (into dropdown control)
        // so wait for next digest cycle
        // this needs to be fixed in dropdown
        Threading.nextCycle(() => {
            let sub1 = this._bindingEngine.propertyObserver(this, "selectedApplianceId")
                .subscribe((newValue: string, oldValue: string) => this.selectedApplianceIdChanged(newValue, oldValue));
            this._rfaSubscriptions.push(sub1);
            let sub2 = this._bindingEngine.propertyObserver(this, "selectedActionType")
                .subscribe((newValue: string, oldValue: string) => this.selectedActionTypeChanged(newValue, oldValue));
            this._rfaSubscriptions.push(sub2);
            let sub3 = this._bindingEngine.propertyObserver(this, "selectedChargeType")
                .subscribe((newValue: string, oldValue: string) => this.selectedChargeTypeChanged(newValue, oldValue));
            this._rfaSubscriptions.push(sub3);
        });
    }

    private removeObservables(): void {
        if (this._rfaSubscriptions) {
            this._rfaSubscriptions.forEach(x => {
                if (x) {
                    x.dispose();
                    x = null;
                }
            });
            this._rfaSubscriptions = [];
        } else {
            this._rfaSubscriptions = [];
        }
    }

    private populate(): void {
        if (this.task) {
            if (this.appliances) {
                if (this.appliances.find(x => x.id === this.task.applianceId)) {
                    this.selectedApplianceId = this.task.applianceId;
                }
                if (this.task.applianceType) {
                    if (this.appliances.find(x => x.applianceType === this.task.applianceType)) {
                        this._selectedApplianceType = this.task.applianceType;
                    }
                }
            }
            if (this.actionTypes) {
                if (this.actionTypes.find(x => x.jobType === this.task.jobType)) {
                    this.selectedActionType = this.task.jobType;
                }
            }
            if (this.chargeTypes) {
                if (this.chargeTypes.find(x => x.chargeType === this.task.chargeType)) {
                    this.selectedChargeType = this.task.chargeType;
                }
            }
        }
    }

    private loadJob(jobId: string): Promise<void> {
        return this._jobService.getJob(jobId).then((job) => {
            this._job = job;
        });
    }

    private filterAppliances(): void {
        if (this.isNewTask === false) {
            if (this.task && this._firstVisitJobCode && this.appliances) {
                if (this.task.jobType === this._firstVisitJobCode) {
                    this.appliances = this.appliances.filter(x => !x.parentId && this._firstVisitRestrictions.find(fv => fv !== x.applianceType));
                }
            }
        }
    }

    private populateErrorMessage(): Promise<void> {
        return this._labelService.getGroup("newTask")
            .then((labels) => {
                this.chargeTypeErrorMsg = ObjectHelper.getPathValue(labels, "chargeTypeInvalidErrorMsg");
                this.actionTypeErrorMsg = ObjectHelper.getPathValue(labels, "actionTypeInvalidErrorMsg");
            });
    }

    private createNew(): Promise<void> {
        if (this.isCompleteTriggeredAlready) {
            return Promise.resolve();
        }
        this.isCompleteTriggeredAlready = true;
        let task: Task = new Task(true, true);
        task.chargeType = this.selectedChargeType;
        task.applianceType = this._selectedApplianceType;
        task.applianceId = this.selectedApplianceId;
        task.jobType = this.selectedActionType;
        task.activities = [];
        task.previousVisits = [];
        task.sequence = this._visitNumber;
        task.id = this._newTaskId;
        task.fieldTaskId = Task.getFieldTaskId(this._newTaskId);

        return this._businessRulesService.getQueryableRuleGroup("chargeService")
            .then(ruleGroup => ruleGroup.getBusinessRule<string>("noChargePrefix"))
            .then(noChargePrefix => {

                task.isCharge = Task.isChargeableTask(this.selectedChargeType, noChargePrefix);

                return this._taskService.createTask(this.jobId, task)
                    .then(() => this._taskService.updateTaskAppliance(this.jobId,
                        task.id,
                        this._selectedApplianceType,
                        this.selectedApplianceId,
                        this.selectedActionType,
                        this.selectedChargeType)
                    )
                    .then(() => {
                        this.notifyDataStateChanged();
                        return this._chargeService.startCharges(this.jobId);
                    })
                    .then(() => {
                        this.showInfo(this.getLabel("objectName"), this.getLabel("taskSaved"));
                        this._router.navigateToRoute("activities");
                    });
            });
    }

    private updateExisting(): Promise<void> {
        if (this.appliances) {
            let app = this.appliances.find(x => x.id === this.selectedApplianceId);
            if (app) {
                this._selectedApplianceType = app.applianceType;
            }
        }

        const isApplianceTypeChanged = this.task.applianceId !== this.selectedApplianceId;
        const isActionTypeChanged = this.task.jobType !== this.selectedActionType;
        const isChargeTypeChanged = this.task.chargeType !== this.selectedChargeType;

        return this.validateAllRules()
            .then(() => this._taskService.updateTaskAppliance(this.jobId,
                this.task.id,
                this._selectedApplianceType,
                this.selectedApplianceId,
                this.selectedActionType,
                this.selectedChargeType))
            .then((task) => this._eventAggregator.publish(TaskConstants.UPDATE_DATA_STATE, task))
            .then(() => this._eventAggregator.publish(JobServiceConstants.JOB_DATA_STATE_CHANGED))
            .then(() => this._eventAggregator.publish(ChargeServiceConstants.CHARGE_UPDATE_START, this.jobId))
            .then(() => {
                if (isApplianceTypeChanged) {
                    this.showInfo(this.getLabel("objectName"), this.getLabel("applianceTypeChanged"));
                }

                if (isActionTypeChanged) {
                    this.showInfo(this.getLabel("objectName"), this.getLabel("actionTypeChanged"));
                }

                if (isChargeTypeChanged) {
                    this.showInfo(this.getLabel("objectName"), this.getLabel("chargeTypeChanged"));
                }
            })
            .then(() => this._router.navigateToRoute("activity", {taskId: this.task.id}))
            .then(() => Promise.resolve());

    }

}
