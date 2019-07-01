import { Archive, ARCHIVE_DATE_FORMAT } from "../../../business/models/archive";
import { inject, observable } from "aurelia-framework";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { LabelService } from "../../../business/services/labelService";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { JobService } from "../../../business/services/jobService";
import { IValidationService } from "../../../business/services/interfaces/IValidationService";
import { ValidationService } from "../../../business/services/validationService";
import { IBusinessRuleService } from "../../../business/services/interfaces/IBusinessRuleService";
import { BusinessRuleService } from "../../../business/services/businessRuleService";
import { CatalogService } from "../../../business/services/catalogService";
import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";
import { EditableViewModel } from "../../models/editableViewModel";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { EngineerService } from "../../../business/services/engineerService";
import { DialogService } from "aurelia-dialog";
import { ArchiveService } from "../../../business/services/archiveService";
import * as moment from "moment";
import { ArchiveModel } from "./viewModels/archiveModel";
import { JobState } from "../../../business/models/jobState";
import { StringHelper } from "../../../../common/core/stringHelper";
import { ObjectHelper } from "../../../../common/core/objectHelper";
import { EngineerState } from "../../elements/engineerState";
import { IActivityCmpnentVstStatus } from "../../../business/models/reference/IActivityCmpnentVstStatus";
import { IArchiveService } from "../../../business/services/interfaces/IArchiveService";
import { ArchiveJobStateModel } from "./viewModels/archiveJobStateModel";
import { ArchiveConstants } from "../../../business/services/constants/archiveConstants";
import { DateHelper } from "../../../core/dateHelper";

@inject(JobService, EngineerService, LabelService, EventAggregator, ValidationService, BusinessRuleService,
    CatalogService, DialogService, ArchiveService)
export class Archives extends EditableViewModel {

    public minDate: Date;
    public maxDate: Date;
    @observable
    public archiveDate: Date;
    public archiveModel: ArchiveModel[];
    public engineerStateLabels: { [key: string]: string };
    public engineerStateBusinessRules: { [key: string]: string };
    private _archiveService: IArchiveService;
    private _taskStates: IActivityCmpnentVstStatus[];
    private _subscription: Subscription;

    public constructor(jobService: IJobService,
        engineerService: IEngineerService,
        labelService: ILabelService,
        eventAggregator: EventAggregator,
        validationService: IValidationService,
        businessRulesService: IBusinessRuleService,
        catalogService: ICatalogService,
        dialogService: DialogService,
        archiveService: IArchiveService) {

        super(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService);
        this._archiveService = archiveService;
        this.archiveModel = [];
        this.minDate = new Date();
        this.maxDate = new Date();
    }

    public activateAsync(): Promise<any> {
        return this.populateTaskStates()
            .then(() => this.populateEngineerLabels())
            .then(() => this.populateEngineerBusinessRules())
            .then(() => this.setInitialDates())
            .then(() => this.getTimesheetData(new Date()))
            .then(archives => this.mapToModel(this.archiveDate, archives))
            .then(() => this._subscription = this._eventAggregator.subscribe(ArchiveConstants.ARCHIVE_UPDATED, () => this.rePopulate()))
            .then(() => this.showContent());
    }

    public deactivateAsync(): Promise<void> {
        if (this._subscription) {
            this._subscription.dispose();
            this._subscription = undefined;
        }
        return Promise.resolve();
    }

    public archiveDateChanged(newDate: Date, oldDate: Date): Promise<void> {
        if (newDate) {
            return this.getTimesheetData(newDate).then((archive) => {
                return this.mapToModel(newDate, archive);
            });
        }

        this.archiveModel = [];
        return Promise.resolve();
    }

    public toggleJobs(archive: ArchiveModel): void {
        if (archive) {
            archive.showJobs = !archive.showJobs;
        }
    }

    private rePopulate(): Promise<void> {
        this.archiveDate = new Date();
        this.archiveModel = [];
        return this.getTimesheetData(this.archiveDate).then(archives =>
            this.mapToModel(this.archiveDate, archives));
    }

    private async getTimesheetData(date: Date): Promise<Archive[]> {
        // tslint:disable-next-line:no-unnecessary-local-variable
        const result = await this._archiveService.getArchiveByDate(moment(date).format(ARCHIVE_DATE_FORMAT));
        return result;
    }

    private setInitialDates(): Promise<void> {
        return this._archiveService.getEarliestDate().then((date) => {
            this.minDate = date;
            this.archiveDate = new Date();
            return;
        });

    }

    private populateTaskStates(): Promise<void> {
        return this._catalogService.getActivityComponentVisitStatuses().then(states => {
            this._taskStates = states;
        });
    }

    private populateEngineerLabels(): Promise<void> {
        return this._labelService.getGroup(StringHelper.toCamelCase(ObjectHelper.getClassName(EngineerState)))
            .then(labels => {
                this.engineerStateLabels = labels;
            });
    }

    private populateEngineerBusinessRules(): Promise<void> {
        return this._businessRuleService.getRuleGroup(StringHelper.toCamelCase(ObjectHelper.getClassName(EngineerService)))
            .then(rules => {
                this.engineerStateBusinessRules = rules;
            });
    }

    private mapToModel(currentDate: Date, archives: Archive[]): void {
        this.archiveModel = [];

        if (!archives) {
            return;
        }

        for (let i: number = 0; i < archives.length; i++) {

            const businessModel = archives[i];

            if (!businessModel) {
                break;
            }

            const viewModel: ArchiveModel = new ArchiveModel();

            viewModel.id = businessModel.id;
            viewModel.engineerId = businessModel.engineerId;
            viewModel.jobId = businessModel.jobId;
            viewModel.details = businessModel.details;
            viewModel.customerName = businessModel.customerName;
            viewModel.shortAddress = businessModel.address;

            const nextBusinessModel = archives[i + 1];

            this.setEngineerStates(viewModel, businessModel, nextBusinessModel);
            this.setJobStates(viewModel, businessModel);
            this.archiveModel.push(viewModel);
        }
    }

    /**
     * calculating time duration from start of first status and end of previous status
     */

    private async setEngineerStates(viewModel: ArchiveModel, archiveCurrent: Archive, archiveNext: Archive): Promise<void> {

        if (!archiveCurrent) {
            return;
        }

        viewModel.engineerStatus = await this._engineerService.getEngineerStateText(archiveCurrent.engineerStatus);
        viewModel.start = DateHelper.getHourMinutes(archiveCurrent.timestamp);

        // if this is the last state then use completed time to calculate duration
        if (archiveCurrent.jobStates) {
            const completedTime = archiveCurrent.jobStates.find(x => x.state === JobState.complete);
            if (completedTime) {
                viewModel.end = DateHelper.getHourMinutes(completedTime.timestamp);
                viewModel.duration = DateHelper.getDurationMinutes(archiveCurrent.timestamp, completedTime.timestamp, 0);
            } else {
                if (archiveNext && archiveNext.timestamp) {
                    viewModel.end = DateHelper.getHourMinutes(archiveNext.timestamp);
                    viewModel.duration = DateHelper.getDurationMinutes(archiveCurrent.timestamp, archiveNext.timestamp, 0);
                }
            }
        } else {
            if (archiveNext && archiveNext.timestamp) {
                viewModel.end = DateHelper.getHourMinutes(archiveNext.timestamp);
                viewModel.duration = DateHelper.getDurationMinutes(archiveCurrent.timestamp, archiveNext.timestamp, 0);
            }
        }
    }

    /*
    converting business data into presentation data.For persenation it requires start time, end time,
    total duration and job status text (not enum).
     */
    private setJobStates(viewModel: ArchiveModel, businessModel: Archive): void {

        if (!businessModel.jobStates || businessModel.jobStates.length === 0) {
            return;
        }

        if ((businessModel.jobStates.find(x => x.state === JobState.done))
            || (businessModel.jobStates.find(x => x.state === JobState.complete))) {
            viewModel.start = DateHelper.getHourMinutes(businessModel.jobStates[0].timestamp);
            viewModel.end = DateHelper.getHourMinutes(businessModel.jobStates[businessModel.jobStates.length - 1].timestamp);
            viewModel.duration = DateHelper.getDurationMinutes(moment(viewModel.start, "HH:mm").toDate(),
                moment(viewModel.end, "HH:mm").toDate(), 0);
        }

        viewModel.jobStates = [];

        for (let i: number = 0; i < businessModel.jobStates.length; i++) {

            const currentJobState = businessModel.jobStates[i];
            if (currentJobState.state === JobState.done || currentJobState.state === JobState.complete) {
                break;
            }

            const { timestamp: prevTimestamp, state } = currentJobState;

            let jobStatus = new ArchiveJobStateModel();
            jobStatus.state = this.mapToJobState(state);
            jobStatus.start = DateHelper.getHourMinutes(prevTimestamp);

            const nextJobState = businessModel.jobStates[i + 1];

            if (nextJobState && nextJobState.timestamp) {
                const { timestamp: nextTimestamp } = nextJobState;
                // when engineer do not finish the job on same day and finished next day or day after
                const isEndSameDay = DateHelper.isSameDay(prevTimestamp, nextTimestamp);
                if (isEndSameDay) {
                    jobStatus.end = DateHelper.getHourMinutes(nextTimestamp);
                } else {
                    jobStatus.end = DateHelper.getHourMinutes(nextTimestamp) + ` (${moment(nextTimestamp).format("DD-MMM")})`;
                }

                jobStatus.duration = DateHelper.getDurationMinutes(moment(jobStatus.start, "HH:mm").toDate(), moment(jobStatus.end, "HH:mm").toDate(), 0);
            }

            viewModel.jobStates.push(jobStatus);
        }

        // map tasks
        this.setTaskItems(viewModel, businessModel);
    }

    private setTaskItems(viewModel: ArchiveModel, businessModel: Archive): void {
        if (!businessModel.taskItems) {
            return;
        }
        viewModel.taskItems = [];
        businessModel.taskItems.forEach(task => {
            task.visitStatus = this.mapToTaskState(task.visitStatus);
            viewModel.taskItems.push(task);
        });
    }

    private mapToJobState(jobState: JobState): string {
        switch (jobState) {
            case JobState.arrived:
                return this.getLabel("jobStatusArrived");
            case JobState.complete:
                return this.getLabel("jobStatusCompleted");
            case JobState.deSelect:
                return this.getLabel("jobStatusDeSelected");
            case JobState.done:
                return this.getLabel("jobStatusDone");
            case JobState.enRoute:
                return this.getLabel("jobStatusEnRoute");
            case JobState.idle:
                return "";
        }
    }

    private mapToTaskState(tstate: string): string {
        let state = this._taskStates.find(x => x.status === tstate);
        if (state) {
            return state.statusDescription;
        }
        return tstate;
    }
}
