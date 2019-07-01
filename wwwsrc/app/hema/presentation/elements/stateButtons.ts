/// <reference path="../../../../typings/app.d.ts" />
import * as Logging from "aurelia-logging";
import { customElement, bindable, bindingMode, inject } from "aurelia-framework";
import { IconButtonListItem } from "../../../common/ui/elements/models/iconButtonListItem";
import { JobService } from "../../business/services/jobService";
import { IJobService } from "../../business/services/interfaces/IJobService";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { JobState } from "../../business/models/jobState";
import { EngineerService } from "../../business/services/engineerService";
import { IEngineerService } from "../../business/services/interfaces/IEngineerService";
import { JobServiceConstants } from "../../business/services/constants/jobServiceConstants";
import { AppConstants } from "../../../appConstants";
import { Router } from "aurelia-router";
import { ArchiveService } from "../../business/services/archiveService";
import { IArchiveService } from "../../business/services/interfaces/IArchiveService";
import { LabelService } from "../../business/services/labelService";
import { ILabelService } from "../../business/services/interfaces/ILabelService";
import { StringHelper } from "../../../common/core/stringHelper";
import { ObjectHelper } from "../../../common/core/objectHelper";
import { Guid } from "../../../common/core/guid";
import { IToastItem } from "../../../common/ui/elements/models/IToastItem";
import { BaseException } from "../../../common/core/models/baseException";
import { ViewService } from "../services/viewService";
import { ReferenceDataService } from "../../business/services/referenceDataService";
import { IReferenceDataService } from "../../business/services/interfaces/IReferenceDataService";
import { DialogService } from "aurelia-dialog";
import { ErrorDialogModel } from "../../../common/ui/dialogs/models/errorDialogModel";
import { ErrorDialog } from "../../../common/ui/dialogs/errorDialog";
import { WindowHelper } from "../../core/windowHelper";
import { AnalyticsConstants } from "../../../common/analytics/analyticsConstants";
import * as moment from "moment";
import { Confirmation } from "../modules/confirmation/confirmation";
import { ModalBusyService } from "../../../common/ui/services/modalBusyService";
import { IModalBusyService } from "../../../common/ui/services/IModalBusyService";
import { Job } from "../../business/models/job";
import { ChargeService } from "../../business/services/charge/chargeService";
import { IChargeService } from "../../business/services/interfaces/charge/IchargeService";
import { IBusinessRuleService } from "../../business/services/interfaces/IBusinessRuleService";
import { BusinessRuleService } from "../../business/services/businessRuleService";
@customElement("state-buttons")
@inject(JobService, EngineerService, EventAggregator, Router, ArchiveService, LabelService, ViewService,
        ReferenceDataService, DialogService, ModalBusyService, ChargeService, BusinessRuleService)
export class StateButtons {

    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public jobId: string;

    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public requestedState: number;

    public possibleStates: IconButtonListItem[];
    public engineerService: IEngineerService;

    private _jobService: IJobService;
    private _eventAggregator: EventAggregator;

    private _subscriptions: Subscription[];

    private _archiveService: IArchiveService;
    private _router: Router;
    private _labelService: ILabelService;
    private _viewService: ViewService;
    private _referenceDataService: IReferenceDataService;
    private _dialogService: DialogService;
    private _businessRuleService: IBusinessRuleService;

    private _logger: Logging.Logger;
    private _modalBusyService: IModalBusyService;
    private _labels: { [key: string]: string };
    private _modalStartTime: number;
    private _chargeService: IChargeService;

    constructor(jobService: IJobService,
        engineerService: IEngineerService,
        eventAggregator: EventAggregator,
        router: Router,
        archiveService: IArchiveService,
        labelService: ILabelService,
        viewService: ViewService,
        referenceDataService: IReferenceDataService,
        dialogService: DialogService,
        modalBusyService: IModalBusyService,
        chargeService: IChargeService,
        businessRuleService: IBusinessRuleService) {
        this._jobService = jobService;
        this.engineerService = engineerService;
        this._eventAggregator = eventAggregator;
        this._router = router;
        this._archiveService = archiveService;
        this._labelService = labelService;
        this._viewService = viewService;
        this._referenceDataService = referenceDataService;
        this._dialogService = dialogService;

        this.possibleStates = [];
        this._subscriptions = [];

        this.updateState();
        this.updateDataState();

        this._logger = Logging.getLogger("StateButtons");
        this._modalBusyService = modalBusyService;
        this._chargeService = chargeService;
        this._businessRuleService = businessRuleService;
    }

    public attached(): void {
        this._subscriptions.push(this._eventAggregator.subscribe(JobServiceConstants.JOB_STATE_CHANGED, () => this.updateState()));
        this._subscriptions.push(this._eventAggregator.subscribe(JobServiceConstants.JOB_DATA_STATE_CHANGED, () => this.updateDataState()));
        this._subscriptions.push(this._eventAggregator.subscribe(JobServiceConstants.JOB_COMPLETION_REFRESH, () => this.showHideJobCompletionProgressModal(false)));

        this._labelService.getGroup(StringHelper.toCamelCase(ObjectHelper.getClassName(this)))
            .then(labels => {
                this._labels = labels;
            });
    }

    public detached(): void {
        this._subscriptions.forEach(s => s.dispose());
        this._subscriptions = [];
    }

    public jobIdChanged(): void {
        this.updateState();
    }

    public requestedStateChanged(newValue: number, oldValue: number): Promise<void> {

        return this._jobService.getJobState(this.jobId)
            .then(state => {
                if (state.value === newValue) {
                    return Promise.resolve();
                }

                this.addToAnalytics(newValue);

                let p: Promise<boolean> = Promise.resolve(true);

                if (newValue === JobState.enRoute) {
                    p = this.ensureEngineerWorkingIsSet()
                        .then(() => {
                            return this.refreshAppIfReferenceDataIsOutOfDate();
                        });
                } else if (newValue === JobState.complete) {
                    p = this.ensureJobSavedAndRunCompleteChecks()
                        .then(async completeJobChecksPassed => {
                            if (!completeJobChecksPassed) {
                                this.requestedState = oldValue;
                            } else {
                                await this.showHideJobCompletionProgressModal(true);

                                let job = await this._jobService.getJob(this.jobId);
                                // the below is to handle the scenario where the user is pressing complete button without visiting any tabs after relaunching the app
                                // rebuild the charge model as it is not getting seriallized properly when the above instance take place
                                if (job && Job.isIncompleteSerialization(job)) {
                                    await this._chargeService.startCharges(this.jobId);
                                }
                            }
                            return completeJobChecksPassed;
                        });
                }

                return p.then(okToSetState => okToSetState
                    ? this._jobService.setJobState(this.jobId, newValue)
                        .then(() => this.addToArchive(this.jobId, newValue))
                    : null);
            });
    }

    private addToAnalytics(state: number): void {
        if (state && this.jobId) {
            try {
                this._eventAggregator.publish(AnalyticsConstants.ANALYTICS_EVENT, {
                    category: AnalyticsConstants.JOB_STATE + " : " + this.jobId,
                    action: JobState[state],
                    label: moment().format(AnalyticsConstants.DATE_TIME_FORMAT),
                    metric: AnalyticsConstants.METRIC
                });
            } catch {
                // do nothing
            }
        }
    }

    private ensureEngineerWorkingIsSet(): Promise<void> {
        return this.engineerService.isWorking()
            /* undefined means go to working mode instead of a specific status */
            .then(isWorking => isWorking ? null : this.engineerService.setStatus(undefined));
    }

    private ensureJobSavedAndRunCompleteChecks(): Promise<boolean> {
        return this._viewService.saveAll()
            .then(() => this.checkIsAllDataStateValid())
            .then(isValidSoFar => isValidSoFar ? this.checkIsAppointmentSetAndRedirect() : false)
            .then(isValidSoFar => isValidSoFar ? this.checkIfJobFinishTimeNeedsToBeUpdated() : false);
    }

    private checkIsAppointmentSetAndRedirect(): Promise<boolean> {
        return this._jobService.requiresAppointment(this.jobId)
            .then(requiresAppt => {
                if (requiresAppt) {
                    this.showPrompt("bookAppointmentTitle", "bookAppointmentDescription");
                    this._router.navigate("/customers/to-do/" + this.jobId + "/appointment/book-an-appointment");
                    return false;
                }
                return true;
            });
    }

    private checkIsAllDataStateValid(): Promise<boolean> {
        return this._jobService.getDataStateSummary(this.jobId)
            .then(dataStateSummary => {
                if (dataStateSummary.getCombinedTotals().invalid + dataStateSummary.getCombinedTotals().notVisited > 0) {
                    this.showPrompt("isValidReminderTitle", "isValidReminderDescription");
                    return false;
                }
                return true;
            });
    }

    private async refreshAppIfReferenceDataIsOutOfDate(): Promise<boolean> {
        let shouldUserRefresh = await this._referenceDataService.shouldUserRefreshReferenceData();
        if (!shouldUserRefresh) {
            return true;
        }

        let model: ErrorDialogModel = new ErrorDialogModel();
        model.errorMessage = ObjectHelper.getPathValue(this._labels, "referenceDataOutOfDateDescription");
        model.header = ObjectHelper.getPathValue(this._labels, "referenceDataOutOfDateTitle");

        await this._dialogService.open({ viewModel: ErrorDialog, model: model });

        WindowHelper.reload();
        return false;
    }

    private showPrompt(titleKey: string, descriptionKey: string): void {
        let toastItem: IToastItem = {
            id: Guid.newGuid(),
            title: ObjectHelper.getPathValue(this._labels, titleKey),
            content: ObjectHelper.getPathValue(this._labels, descriptionKey),
            toastAction: { details: ObjectHelper.getPathValue(this._labels, descriptionKey) },
            style: "info",
            dismissTime: 2.25
        };
        this._eventAggregator.publish(AppConstants.APP_TOAST_ADDED, toastItem);
    }

    private updateState(): void {
        this.possibleStates = [];

        if (this.jobId) {
            this._jobService.getActiveJobId()
                .then((activeJobId) => {
                    let showButtons: boolean;
                    if (activeJobId) {
                        showButtons = activeJobId === this.jobId;
                    } else {
                        showButtons = true;
                    }

                    if (showButtons) {
                        this._jobService.getJobState(this.jobId)
                            .then(state => {
                                this.requestedState = state.value;

                                this._jobService.getJobTargetStates(this.jobId)
                                    .then((targetStates) => {
                                        if (targetStates) {
                                            for (let i = 0; i < targetStates.length; i++) {
                                                this.possibleStates.push(
                                                    new IconButtonListItem(targetStates[i].name,
                                                        targetStates[i].value,
                                                        false,
                                                        "job-state-" + JobState[targetStates[i].value]));
                                            }

                                            this.updateDataState();
                                        }
                                    })
                                    .catch((error: BaseException) => {
                                        this._logger.error(error && error.toString());
                                    });
                            });
                    }
                });

        }
    }

    private updateDataState(): void {
        if (this.possibleStates) {
            let completeState = this.possibleStates.find(i => i.value === JobState.complete);

            if (completeState) {
                if (this.jobId) {
                    this._jobService.getActiveJobId()
                        .then((activeJobId) => {
                            if (activeJobId === this.jobId) {
                                this._jobService.getDataStateSummary(this.jobId)
                                    .then((dataSummary) => {
                                        if (dataSummary) {
                                            let combined = dataSummary.getCombinedTotals();

                                            if (combined.invalid > 0) {
                                                completeState.disabled = true;
                                                completeState.iconClassName = "job-state-complete state-invalid";
                                            } else if (combined.notVisited > 0) {
                                                completeState.disabled = true;
                                                completeState.iconClassName = "job-state-complete state-not-visited";
                                            } else {
                                                completeState.disabled = false;
                                                completeState.iconClassName = "job-state-complete state-valid";
                                            }
                                        } else {
                                            completeState.disabled = true;
                                            completeState.iconClassName = "job-state-complete state-invalid";
                                        }
                                    });
                            }
                        });
                }
            }
        }
    }

    private addToArchive(jobId: string, jobState: JobState): Promise<void> {
        return this.engineerService.getCurrentEngineer().then((engineer) => {
            if (engineer) {
                return this._jobService.getJob(jobId).then((job) => {
                    if (job) {
                        return this._archiveService.addUpdateJobState(job, engineer, jobState);
                    } else {
                        return Promise.resolve();
                    }
                });
            } else {
                return Promise.resolve();
            }
        });
    }

    private async checkIfJobFinishTimeNeedsToBeUpdated(): Promise<boolean> {
        let needToBeUpdated = await this._jobService.checkIfJobFinishTimeNeedsToBeUpdated();

        if (needToBeUpdated) {
            let [labels, job] = await Promise.all([this._labelService.getGroup(StringHelper.toCamelCase(ObjectHelper.getClassName(this))),
                this._jobService.getJob(this.jobId)]);

            let amendLabel = ObjectHelper.getPathValue(labels, "amend");
            let continueLabel = ObjectHelper.getPathValue(labels, "continue");
            let title = ObjectHelper.getPathValue(labels, "confirmation");
            let message = ObjectHelper.getPathValue(labels, "jobFinishTimeUpdateConfirmationMessage");
            let dialogResult = await this._dialogService.open({ viewModel: Confirmation, model: { title: title, message: message, yesLabel: amendLabel, noLabel: continueLabel } });
            if (!dialogResult.wasCancelled) {
                let businessRules = await this._businessRuleService.getQueryableRuleGroup("jobService");
                let jobDoingStatuses: string = businessRules.getBusinessRule<string>("jobDoingStatuses");
                let activeTasks = job && job.tasks && job.tasks.filter(task => jobDoingStatuses.indexOf(task.status) > -1) || [];
                let routePath: string = activeTasks.length > 1
                                            ? "/customers/to-do/" + this.jobId + "/activities"
                                            : activeTasks.length === 1 ? "/customers/to-do/" + this.jobId + "/activities/" + activeTasks[0].id + "/details" 
                                            : undefined;
                if (routePath) {
                    this._router.navigate(routePath);
                    return false;
                }          
            }
        }
        return true;
    }

    private async showHideJobCompletionProgressModal(isJobCompletionInProgress: boolean): Promise<void> {
        if (isJobCompletionInProgress) {
            const jobCompletingText = ObjectHelper.getPathValue(this._labels, "jobCompletingText");          
            await this._modalBusyService.showBusy("StateButtons", "Visit Completion", jobCompletingText);   
            this._modalStartTime = new Date().getTime();
        } else {
            const modalEndTime = new Date().getTime();
            const diff: number = modalEndTime - this._modalStartTime || 0;
            const modalDisplayms: number = 2000;
            // checking if the modal has been displaying for less than 2 seconds
            if (Math.round(diff) < modalDisplayms) {
                const delaySecs = modalDisplayms - Math.round(diff);
                await Promise.delay(delaySecs);
            }
            await this._modalBusyService.hideBusy("StateButtons");
        }
    }
}
