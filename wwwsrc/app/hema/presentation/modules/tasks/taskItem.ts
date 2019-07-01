/// <reference path="./../../../../../typings/app.d.ts" />

import { BindingEngine } from "aurelia-binding";
import { inject } from "aurelia-framework";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { Task } from "../../../business/models/task";
import { CatalogService } from "../.././../business/services/catalogService";
import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { JobService } from "../../../business/services/jobService";
import { ITaskService } from "../../../business/services/interfaces/ITaskService";
import { TaskService } from "../../../business/services/taskService";
import { EditableViewModel } from "../../models/editableViewModel";
import { ButtonListItem } from "../../../../common/ui/elements/models/buttonListItem";
import { LabelService } from "../../../business/services/labelService";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { IValidationService } from "../../../business/services/interfaces/IValidationService";
import { ValidationService } from "../../../business/services/validationService";
import { IBusinessRuleService } from "../../../business/services/interfaces/IBusinessRuleService";
import { BusinessRuleService } from "../../../business/services/businessRuleService";
import { Redirect } from "aurelia-router";
import { EngineerService } from "../../../business/services/engineerService";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { DialogService } from "aurelia-dialog";
import { Threading } from "../../../../common/core/threading";
import { IPartService } from "../../../business/services/interfaces/IPartService";
import { PartService } from "../../../business/services/partService";
import { ChargeServiceConstants } from "../../../business/services/constants/chargeServiceConstants";
import { IJcJobCode } from "../../../business/models/reference/IJcJobCode";
import { IActivityCmpnentVstStatus } from "../../../business/models/reference/IActivityCmpnentVstStatus";
import { IChirpCode } from "../../../business/models/reference/IChirpCode";
import { CatalogConstants } from "../../../business/services/constants/catalogConstants";
import { IVisitActivityCode } from "../../../business/models/reference/IVisitActivityCode";
import { IProductGroup } from "../../../business/models/reference/IProductGroup";
import { IPartType } from "../../../business/models/reference/IPartType";
import { IPtFac } from "../../../business/models/reference/IPtFac";
import { IVisitActivityFaultActionCode } from "../../../business/models/reference/IVisitActivityFaultActionCode";
import { IFaultActionCode } from "../../../business/models/reference/IFaultActionCode";
import { ArrayHelper } from "../../../../common/core/arrayHelper";
import { TaskConstants } from "../../constants/taskConstants";
import { DataStateSummary } from "../../../business/models/dataStateSummary";
import { Job } from "../../../business/models/job";
import { JobServiceConstants } from "../../../business/services/constants/jobServiceConstants";
import { JobState } from "../../../business/models/jobState";
import { BaseException } from "../../../../common/core/models/baseException";
import { TaskBusinessRuleHelper } from "../../../business/models/businessRules/taskBusinessRuleHelper";
import { TaskItemViewModel } from "./viewModels/taskItemViewModel";
import { TaskItemFactory } from "../../factories/taskItemFactory";
import { ITaskItemFactory } from "../../factories/interfaces/ITaskItemFactory";
import { TimeRange } from "../../../../common/ui/elements/models/timeRange";

@inject(CatalogService, JobService, EngineerService, LabelService, TaskService, EventAggregator, DialogService,
    ValidationService, BusinessRuleService, BindingEngine, PartService, TaskItemFactory)
export class TaskItem extends EditableViewModel {

    public viewModel: TaskItemViewModel;

    public intervalInMinutes: number;
    public jobStatusesCatalog: IActivityCmpnentVstStatus[];
    public jobCodesCatalog: IJcJobCode[];
    public chirpCodesCatalog: IChirpCode[];
    public visitActivityCatalog: IVisitActivityCode[];
    public productGroupCatalog: IProductGroup[];
    public partTypeCatalog: IPartType[];
    public partTypeFaultActLinkCatalog: IPtFac[];
    public visitActFaultActLinkCatalog: IVisitActivityFaultActionCode[];
    public faultActionCodeCatalog: IFaultActionCode[];
    public adviceResultLookup: ButtonListItem[];
    public adviceCategoryLookup: ButtonListItem[];
    public workedOnLookup: ButtonListItem[];
    public isPartLJReportableLookup: ButtonListItem[];
    public disableTimeRangePicker: boolean;
    public totalChargableTime: number;

    private _faultMap: { [code: string]: IFaultActionCode };

    private _taskService: ITaskService;
    private _partService: IPartService;
    private _taskItemFactory: ITaskItemFactory;

    private _adviceResultsThatNeedCategory: string;

    // business rule properties
    private _firstVisitJobCode: string;
    private _firstVisitTaskCode: string;
    private _visitCodesProductGroupPartsRequired: string[];
    private _claimRejNotCoveredVisitCodesPattern: string;
    private _workedOnClaimRejNotCovered: string;
    private _taskSubscriptions: Subscription[];
    private _bindingEngine: BindingEngine;
    private _taskUpdateSubscription: Subscription;
    private _jobStateChangedSubscription: Subscription;
    private _taskStatusDoToday: string;
    private _partsRequiredInBasketStatus: string;
    private _instaPremAppliance: string;
    private _annualServiceActionType: string;
    private _taskId: string;
    private _insAnnualServiceActivityStatuses: string[];
    private _filteredOutActivityStatuses: string[];

    constructor(catalogService: ICatalogService,
        jobService: IJobService,
        engineerService: IEngineerService,
        labelService: ILabelService,
        taskService: ITaskService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        validationService: IValidationService,
        businessRulesService: IBusinessRuleService,
        bindingEngine: BindingEngine,
        partService: IPartService,
        taskItemFactory: ITaskItemFactory) {

        super(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService);

        this._partService = partService;
        this._taskItemFactory = taskItemFactory;

        this.adviceResultLookup = [];
        this.adviceCategoryLookup = [];
        this.workedOnLookup = [];
        this._faultMap = {};
        this._bindingEngine = bindingEngine;
        this._taskSubscriptions = [];
        this._taskService = taskService;
        this._taskUpdateSubscription = null;
        this._jobStateChangedSubscription = null;
        this._filteredOutActivityStatuses = [];
        this.totalChargableTime = 0;
    }

    // fix status not binding when navigating to this vm from a sibling route
    public bind(bindingContext: any, overrideContext: any): void {
        if (!this.viewModel) {
            this.viewModel = <TaskItemViewModel>{};
        }
        this.viewModel.status = "";
        this.viewModel.workedOnCode = "";
        this.viewModel.chargeableTime = 0;
        this.viewModel.taskTime = undefined;
    }

    public canActivateAsync(...rest: any[]): Promise<boolean | Redirect> {
        if (rest && rest[0] && rest[0].jobId && rest[0].taskId) {
            return this._jobService.getJob(rest[0].jobId)
                .then(job => {
                    let taskId = rest[0].taskId;
                    let jobId = rest[0].jobId;
                    let task = Job.getTasksAndCompletedTasks(job).find(t => t.id === taskId);
                    if (!task.isMiddlewareDoTodayTask) {
                        return new Redirect("#/customers/to-do/" + jobId + "/activities/" + taskId + "/previous-activities");
                    }
                    return true;
                });
        }
        return Promise.resolve(false);
    }

    public activateAsync(params: { jobId: string, taskId: string }): Promise<void> {
        this._taskId = params.taskId;
        this.jobId = params.jobId;

        this._taskUpdateSubscription = this._eventAggregator.subscribe(TaskConstants.UPDATE_DATA_STATE, (task: Task) => {
            this.viewModel.applianceType = task.applianceType;
            this.updateDataState(task);
        });

        this._jobStateChangedSubscription = this._eventAggregator.subscribe(JobServiceConstants.JOB_STATE_CHANGED, () => this.jobStatusChanged());

        if (this._isCleanInstance) {
            return this.loadBusinessRules()
                .then(() => this.buildBusinessRules())
                .then(() => this.buildCustomBusinessRules())
                .then(() => this.buildValidationRules())
                .then(() => this.loadCatalogs())
                .then(() => this.load())
                .then(() => {
                    this.showContent();
                });
        } else {
            return this.loadActivityComponentVisitStatuses()
                .then(() => this.buildValidationRules())
                .then(() => {
                    if (this.viewModel) {
                        this._taskItemFactory.clearViewModel(this.viewModel, undefined, undefined, true);
                    }
                    return this.load();
                });
        }
    }

    public deactivateAsync(): Promise<void> {
        this.clearAllSubscriptions();
        return Promise.resolve();
    }

    public workedOnCodeChanged(newValue: string, oldValue: string): void {
        if (newValue) {
            this.updateVisitActivities(newValue);
        }
    }

    public activityChanged(newValue: string, oldValue: string): void {
        if (newValue) {
            this.updateFaultCodesBasedOnActivity(newValue);
        }
    }

    public productGroupChanged(newValue: string, oldValue: string): void {
        if (newValue) {
            this.updateParts(newValue);
        }
    }

    public partTypeChanged(newValue: string, oldValue: string): void {
        if (newValue) {
            this.updateFaultCodesBasedOnPartType(newValue);
        }
    }

    public async statusChanged(): Promise<void> {
        this.viewModel.isInCancellingStatus = !TaskBusinessRuleHelper.isLiveTask(this.businessRules, this.viewModel.status);
        await this.setTimeRangePicker();
    }

    public deselectChirpCode(chirpCode: IChirpCode): void {
        let idx: number = this.viewModel.chirpCodes.indexOf(chirpCode);
        if (idx >= 0) {
            this.viewModel.chirpCodes.splice(idx, 1);
            this.viewModel.chirpCodes = this.viewModel.chirpCodes.slice(0);
            this.updateUnused();
            this.calculateCharactersLeft();
        }
    }

    public chirpCodesChanged(): void {
        this.calculateCharactersLeft();
    }

    public selectedChirpCodeChanged(): void {
        if (!this.viewModel.chirpCodes) {
            this.viewModel.chirpCodes = [];
        }
        if (this.viewModel.selectedChirpCode && this.viewModel.chirpCodes.findIndex(cc => cc.code === this.viewModel.selectedChirpCode) === -1) {
            this.viewModel.chirpCodes.push(this.viewModel.unusedChirpCodes.find(cc => cc.code === this.viewModel.selectedChirpCode));
            this.viewModel.chirpCodes = this.viewModel.chirpCodes.slice(0);
            this.updateUnused();
            this.calculateCharactersLeft();
        }
        // df_1772 revalidate all the rules.
        this.validateAllRules();
    }

    public updateUnused(): void {
        this.viewModel.unusedChirpCodes = this.viewModel.chirpCodes ?
            this.chirpCodesCatalog.filter(cc => this.viewModel.chirpCodes.findIndex(used => used.code === cc.code) === -1) :
            this.chirpCodesCatalog.slice(0);
    }

    public workDurationChanged(newValue: number, oldValue: number): void {
        this.viewModel.chargeableTime = newValue;
    }

    public displayPartsRequiredMessage(): string {
        return this.showDanger("Parts Required", "Parts required in basket", null);
    }

    public updateVisitActivities(workedOnCode: string): void {

        // no point resetting if firstVisit  already set

        if (!this.viewModel.isFirstVisit) {

            this.viewModel.productGroup = undefined;
            this.viewModel.activity = undefined;
            this.viewModel.partType = undefined;
            this.viewModel.faultActionCode = undefined;

            this.viewModel.partTypeFilteredCatalog = [];
            this.viewModel.faultActionCodeFilteredCatalog = [];
            this.viewModel.visitActivityFilteredCatalog = [];
            this.viewModel.showProductGroupAndPartTypes = false;

            TaskItemViewModel.filterVisitActivityCatalog(this.viewModel,
                workedOnCode,
                this._firstVisitJobCode,
                this._firstVisitTaskCode,
                this.visitActivityCatalog,
                this._claimRejNotCoveredVisitCodesPattern,
                this._workedOnClaimRejNotCovered);
        }
    }

    public updateFaultCodesBasedOnActivity(activityCode: string): Promise<void> {

        this.viewModel.faultActionCode = undefined;
        this.viewModel.partType = undefined;
        this.viewModel.productGroup = undefined;

        this.viewModel.faultActionCodeFilteredCatalog = [];
        this.viewModel.partTypeFilteredCatalog = [];

        TaskItemViewModel.filterFaultActionCodeCatalog(this.viewModel, this.visitActFaultActLinkCatalog, this._faultMap, this._visitCodesProductGroupPartsRequired);

        return this.loadMainPartDetails()
            .then(() => {
                if (this.viewModel.hasMainPart) {
                    if (activityCode !== undefined) {
                        if (this._visitCodesProductGroupPartsRequired.indexOf(activityCode) !== -1) {
                            this.viewModel.showMainPartSelectedWithInvalidActivityTypeMessage = false;

                            Threading.nextCycle(() => {
                                this.viewModel.productGroup = this.viewModel.mainPartProductGroup;
                            });
                        } else {
                            this.viewModel.showMainPartSelectedWithInvalidActivityTypeMessage = true;
                        }
                    } else {
                        this.viewModel.showMainPartSelectedWithInvalidActivityTypeMessage = true;
                    }
                } else {
                    this.viewModel.showMainPartSelectedWithInvalidActivityTypeMessage = false;
                }
            });
    }

    public updateParts(productCode: string): void {

        if (productCode === undefined) {
            return;
        }

        this.viewModel.faultActionCode = undefined;
        this.viewModel.partType = undefined;
        this.viewModel.partTypeFilteredCatalog = [];

        TaskItemViewModel.filterPartTypeCatalog(this.viewModel, this.partTypeCatalog);

        if (!this.viewModel.hasMainPart) {
            this.viewModel.showMainPartSelectedWithInvalidProductGroupTypeMessage = false;
            return;
        }
        if (productCode === this.viewModel.mainPartProductGroup) {
            Threading.nextCycle(() => {
                this.viewModel.partType = this.viewModel.mainPartPartType;
            });
            this.viewModel.showMainPartSelectedWithInvalidProductGroupTypeMessage = false;
        } else {
            this.viewModel.showMainPartSelectedWithInvalidProductGroupTypeMessage = true;
        }
    }

    public updateFaultCodesBasedOnPartType(partTypeCode: string): void {

        if (partTypeCode === undefined) {
            return;
        }

        if (this.viewModel.hasMainPart) {
            if (partTypeCode === this.viewModel.mainPartPartType) {
                this.viewModel.showMainPartSelectedWithInvalidPartTypeMessage = false;
            } else {
                this.viewModel.showMainPartSelectedWithInvalidPartTypeMessage = true;
            }
        } else {
            this.viewModel.showMainPartSelectedWithInvalidPartTypeMessage = false;
        }

        this.viewModel.faultActionCode = undefined;

        TaskItemViewModel.filterFaultActionCodeBasedOnPartType(this.viewModel, this.partTypeFaultActLinkCatalog, this.partTypeCatalog, this._faultMap);
    }

    public get showAdviceCategory(): boolean {
        if (this.viewModel && this.viewModel.adviceOutcome) {
            return this.viewModel.adviceOutcome && this._adviceResultsThatNeedCategory.indexOf(this.viewModel.adviceOutcome) !== -1;
        }
        return false;
    }

    // space needs to be between each chirp codes and between chirp code and freetext report
    public calculateCharactersLeft(): void {
        if (this.getValidationEnabled()) {

            let maxChars = this.getValidationRule("viewModel.taskReport").maxLength;
            let selectedChirpCodes = (this.viewModel.chirpCodes && this.viewModel.chirpCodes.length > 0) ? this.viewModel.chirpCodes.map(cc => cc.code).join(" ") : undefined;
            this.viewModel.charactersLeftNum = (selectedChirpCodes) ? maxChars - (selectedChirpCodes.length + 1) : maxChars;

            // commented to fix 16843
            // this.combinedReport = "";
            /* if (this.chirpCodes && this.chirpCodes.length > 0) {
             this.combinedReport += this.chirpCodes.map(cc => cc.code).join("");
             }

             if (this.taskReport) {
             this.combinedReport += this.taskReport;
             }

             this.charactersLeftNum = maxChars - this.combinedReport.length;

             this.charactersLeftClass = "";
             this.charactersLeft = "";

             if (this.charactersLeftNum >= 0) {
             this.charactersLeft = `${this.charactersLeftNum} characters left`;
             this.charactersLeftClass = "valid";
             } else if (this.charactersLeftNum < 0) {
             this.charactersLeft = `${Math.abs(this.charactersLeftNum)} characters too many`;
             this.charactersLeftClass = "invalid";
             } */
        }
    }

    public canDeactivateAsync(): Promise<boolean> {
        // ask the question
        if (!this.isValidActivityProductGroupAndPartTypeForMainPart()) {
            return this.showConfirmation(this.getLabel("confirmation"), this.getLabel("incorrectActivityProductGroupOrPartTypeQuestion"))
                .then((result) => {
                    if (!result.wasCancelled) {
                        // need to reset the main part flag for this task
                        return this._partService.clearMainPartForTask(this.jobId, this._taskId)
                            .then(() => true);
                    } else {
                        return false;
                    }
                });
        } else {
            return Promise.resolve(true);
        }
    }

    public loadProductGroupFromMainPart(): void {
        if (this.viewModel.hasMainPart) {
            this.viewModel.productGroup = this.viewModel.mainPartProductGroup;
        }
    }

    public loadPartTypeFromMainPart(): void {
        if (this.viewModel.hasMainPart) {
            this.updateParts(this.viewModel.mainPartProductGroup);
            this.loadProductGroupFromMainPart();
        }
    }

    public chargeableTimeChanged(): void {
        this.totalChargableTime = (this.viewModel.totalPreviousWorkDuration || 0) + (this.viewModel.chargeableTime || 0);
    }

    protected async loadModel(): Promise<void> {
        this.clearObservableSubscriptions();
        this.resetMainPartFlags();
        const job = await this._jobService.getJob(this.jobId);

        if (job && job.tasks) {
            this.viewModel = this._taskItemFactory.createTaskItemViewModel(this._taskId, job, this.intervalInMinutes, this.chirpCodesCatalog);
            this.updateActivityIfJobTypeChanged();
            this.statusChanged(); // todo: when this is awaited then a red error occurs
            // initialise activity changed
            TaskItemViewModel.filterVisitActivityCatalog(this.viewModel,
                this.viewModel.workedOnCode,
                this._firstVisitJobCode,
                this._firstVisitTaskCode,
                this.visitActivityCatalog,
                this._claimRejNotCoveredVisitCodesPattern,
                this._workedOnClaimRejNotCovered);

            TaskItemViewModel.filterFaultActionCodeCatalog(this.viewModel,
                this.visitActFaultActLinkCatalog,
                this._faultMap,
                this._visitCodesProductGroupPartsRequired);

            TaskItemViewModel.filterPartTypeCatalog(this.viewModel, this.partTypeCatalog);
            TaskItemViewModel.filterFaultActionCodeBasedOnPartType(this.viewModel, this.partTypeFaultActLinkCatalog, this.partTypeCatalog, this._faultMap);
            this.updateUnused();
            this.setInitialDataState(this.viewModel.dataStateId, this.viewModel.dataState);
            this.validationToggle(true);
            this.jobStatusesCatalog = this.filterActivityStatuses(this.jobStatusesCatalog, this.viewModel.applianceType, this.viewModel.jobType);
            this.viewModel.selectedChirpCode = undefined;
            await this.setTimeRangePicker();
            this.calculateCharactersLeft();
        }
        Threading.nextCycle(() => {
            if (this.viewModel.jobType === this._firstVisitJobCode) {
                this.viewModel.activity = this._firstVisitTaskCode; // this is required for fresh job with undefined workedOnCode, etc.
            }
            this.setObservables();
            this.viewModel.chargeableTime = (this.viewModel.chargeableTime !== undefined) ? this.viewModel.chargeableTime : this.viewModel.workDuration;
            this.chargeableTimeChanged();
        });
    }

    protected saveModel(): Promise<void> {
        const task = this._taskItemFactory.createTaskItemBusinessModel(this.viewModel, this._taskId, this._adviceResultsThatNeedCategory);

        return this.updateDataState(task)
            .then(() => this._taskService.saveTask(this.jobId, task))
            .then(() => this.setPartsRequiredForTask(this.viewModel.status))
            .then(() => {
                if (this._isDirty) {
                    this._eventAggregator.publish(ChargeServiceConstants.CHARGE_UPDATE_START, this.jobId);
                }
            });
    }

    protected clearModel(): Promise<void> {
        if (DataStateSummary.dataStateCompletionOverrideGroup === "activities") {
            DataStateSummary.clearDataStateCompletionOverrideGroup();
        }

        this.clearObservableSubscriptions();

        return this._taskService.getTaskItem(this.jobId, this._taskId)
            .then(async task => {
                this._taskItemFactory.clearViewModel(this.viewModel, task, this._firstVisitTaskCode, false);
                this.statusChanged();
                this.setInitialDataState(task.dataStateId, task.dataState);
                this.setObservables();
                await this.setTimeRangePicker();
            });
    }

    // this is needed becase the next and previous buttons dont hit the constructor and
    // as such the values are not reset
    private resetMainPartFlags(): void {
        if (this.viewModel) {
            this.viewModel.mainPartInformationRetrieved = false;
            this.viewModel.hasMainPart = false;
            this.viewModel.mainPartProductGroup = "";
            this.viewModel.mainPartPartType = "";
            this.viewModel.showMainPartSelectedWithInvalidActivityTypeMessage = false;
            this.viewModel.showMainPartSelectedWithInvalidProductGroupTypeMessage = false;
            this.viewModel.showMainPartSelectedWithInvalidPartTypeMessage = false;
        }
    }

    private filterActivityStatuses(catalog: IActivityCmpnentVstStatus[], applianceType: string, jobType: string): IActivityCmpnentVstStatus[] {
        if (applianceType === this._instaPremAppliance && jobType === this._annualServiceActionType) {
            return catalog.filter(x => this._insAnnualServiceActivityStatuses.some(y => y === x.status));
        }
        return catalog;
    }

    private setPartsRequiredForTask(newStatus: string): Promise<void> {
        return this._partService.setPartsRequiredForTask(this.jobId)
            .then((partsMessage) => {
                if (partsMessage) {
                    if (newStatus === this._partsRequiredInBasketStatus) {
                        this.showDanger("Parts Required", "Parts in basket are required", "");
                    }
                }
            });
    }

    private isValidActivityProductGroupAndPartTypeForMainPart(): boolean {
        if (this.viewModel.hasMainPart && this.viewModel.workedOnCode) {
            if ((this._visitCodesProductGroupPartsRequired.indexOf(this.viewModel.activity) === -1)
                || (this.viewModel.productGroup !== this.viewModel.mainPartProductGroup)
                || (this.viewModel.partType !== this.viewModel.mainPartPartType)) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    private loadMainPartDetails(): Promise<void> {
        if (this.viewModel.mainPartInformationRetrieved) {
            return Promise.resolve();
        }

        return this._partService.getMainPartForTask(this.jobId, this._taskId)
            .then((mainPart) => {
                if (!mainPart) {
                    this.viewModel.hasMainPart = false;
                    this.viewModel.mainPartProductGroup = undefined;
                    this.viewModel.mainPartPartType = undefined;

                    return Promise.resolve();
                }
                return this._catalogService.getGoodsType(mainPart.stockReferenceId)
                    .then(part => {
                        this.viewModel.mainPartInformationRetrieved = true;

                        if (!part) {
                            this.viewModel.hasMainPart = false;
                            this.viewModel.mainPartProductGroup = undefined;
                            this.viewModel.mainPartPartType = undefined;

                            return Promise.resolve();
                        }
                        this.viewModel.hasMainPart = true;
                        this.viewModel.mainPartProductGroup = part.productGroupCode;
                        this.viewModel.mainPartPartType = part.partTypeCode;

                        if (this.viewModel.activity && this._visitCodesProductGroupPartsRequired.indexOf(this.viewModel.activity) !== -1) {
                            this.viewModel.showMainPartSelectedWithInvalidActivityTypeMessage = false;

                        } else {
                            this.viewModel.showMainPartSelectedWithInvalidActivityTypeMessage = true;
                        }

                        return Promise.resolve();

                    })
                    .catch((error: BaseException) => {
                        this._logger.error(error && error.toString());
                        this.viewModel.hasMainPart = false;
                        this.viewModel.mainPartProductGroup = undefined;
                        this.viewModel.mainPartPartType = undefined;

                        return Promise.resolve();
                    });
            })
            .catch((error: BaseException) => {
                this._logger.error(error && error.toString());
                this.viewModel.hasMainPart = false;
                this.viewModel.mainPartProductGroup = undefined;
                this.viewModel.mainPartPartType = undefined;

                return Promise.resolve();
            });
    }

    private buildBusinessRules(): void {
        this._adviceResultsThatNeedCategory = this.getBusinessRule<string>("adviceResultsThatNeedCategory");
        this._firstVisitJobCode = this.getBusinessRule<string>("firstVisitJob");
        this._firstVisitTaskCode = this.getBusinessRule<string>("firstVisitTask");
        this._visitCodesProductGroupPartsRequired = this.getBusinessRule<string>("visitCodesProductGroupPartsRequired").split(",");
        this._claimRejNotCoveredVisitCodesPattern = this.getBusinessRule<string>("claimRejNotCoveredVisitCodesPattern");
        this._workedOnClaimRejNotCovered = this.getBusinessRule<string>("workedOnClaimRejNotCovered");
        this._taskStatusDoToday = this.getBusinessRule<string>("taskStatusDoToday");
        this._partsRequiredInBasketStatus = this.getBusinessRule<string>("activityPartsRequiredStatus");
        this._insAnnualServiceActivityStatuses = this.getBusinessRule<string>("insAnnualServiceActivityStatuses").split(",");
        this.intervalInMinutes = this.getBusinessRule<number>("intervalInMinutes");
        this._filteredOutActivityStatuses = this.getBusinessRule<string>("filteredOutActivityStatuses").split(",");
    }

    private buildCustomBusinessRules(): Promise<void> {
        return this._businessRuleService.getQueryableRuleGroup("jobFactory").then((jobFactoryRuleGroup) => {
            this._instaPremAppliance = jobFactoryRuleGroup.getBusinessRule<string>("instPremApplianceType");
            this._annualServiceActionType = jobFactoryRuleGroup.getBusinessRule<string>("annualServiceJobType");
        });
    }

    private async loadCatalogs(): Promise<void> {
        const [jobCode, chirpCode, adviceResult, advicecategory, workedon, isPartLJReportableLookup] =
            await Promise.all([
                this._catalogService.getJCJobCodes(),
                this._catalogService.getChirpCodes(),
                this._catalogService.getAdviceResults(),
                this._catalogService.getEeaCategories(),
                this._catalogService.getWorkedOns(),
                this.buildYesNoList()
            ]);

        this.jobCodesCatalog = this.toSortedArray(jobCode, CatalogConstants.JC_JOB_CODE_DESCRIPTION);
        this.chirpCodesCatalog = this.toSortedArray(chirpCode, CatalogConstants.CHIRP_CODE_ID);
        this.adviceResultLookup = this.toButtonListItemArray(adviceResult, CatalogConstants.ADVICE_RESULT_ID, CatalogConstants.ADVICE_RESULT_DESCRIPTION);
        this.adviceCategoryLookup = this.toButtonListItemArray(advicecategory, CatalogConstants.ENERGY_ADVICE_CATEGORY_ID, CatalogConstants.ENERGY_ADVICE_CATEGORY_DESCRIPTION);
        this.workedOnLookup = this.toButtonListItemArray(workedon, CatalogConstants.WORKED_ON_ID, CatalogConstants.WORKED_ON_DESCRIPTION);
        this.isPartLJReportableLookup = isPartLJReportableLookup;
        await this.loadActivityComponentVisitStatuses();
        await this.loadDynamicDropdownCatalogs();
    }

    private loadDynamicDropdownCatalogs(): Promise<void> {
        return Promise.all([
            this._catalogService.getVisitActivityCodes(),
            this._catalogService.getProductGroups(),
            this._catalogService.getPartTypes(),
            this._catalogService.getPartTypeFaultActions(),
            this._catalogService.getVisitActivityFaultActions(),
            this._catalogService.getFaultActionCodes()
        ]).then(([visitActivity, productGroup, partType, partTypeFaultActLink, visitActFaultActLink, faultActionCode]: [IVisitActivityCode[], IProductGroup[], IPartType[], IPtFac[],
            IVisitActivityFaultActionCode[], IFaultActionCode[]]) => {
            this.visitActivityCatalog = ArrayHelper.sortByColumn(visitActivity, CatalogConstants.VISIT_ACTIVITY_CODE_DESCRIPTION);
            this.productGroupCatalog = ArrayHelper.sortByColumn(productGroup, CatalogConstants.PRODUCT_GROUP_DESCRIPTION);
            this.partTypeCatalog = ArrayHelper.sortByColumn(partType, CatalogConstants.PART_TYPE_DESCRIPTION);
            this.partTypeFaultActLinkCatalog = partTypeFaultActLink;
            this.visitActFaultActLinkCatalog = visitActFaultActLink;
            this.faultActionCodeCatalog = faultActionCode;

            // used for faultCode lookups
            faultActionCode.forEach(f => this._faultMap[f.faultActionCode] = f);
        });
    }

    private async loadActivityComponentVisitStatuses(): Promise<void> {
        let visitStatus = await this._catalogService.getActivityComponentVisitStatuses();
        this.jobStatusesCatalog = this.toSortedArray(visitStatus.filter(x => this._filteredOutActivityStatuses.indexOf(x.status) === -1), CatalogConstants.ACTIVITY_COMPONENT_VISIT_STATUS_ID);
    }

    // need this, as opposed to using decoraters, to prevent unnecessary fires on initialisation
    private setObservables(): void {
        let sub1 = this._bindingEngine.propertyObserver(this.viewModel, "activity")
            .subscribe(newValue => this.updateFaultCodesBasedOnActivity(newValue));
        this._taskSubscriptions.push(sub1);

        let sub2 = this._bindingEngine.propertyObserver(this.viewModel, "productGroup")
            .subscribe(newValue => this.updateParts(newValue));
        this._taskSubscriptions.push(sub2);

        let sub3 = this._bindingEngine.propertyObserver(this.viewModel, "partType")
            .subscribe(newValue => this.updateFaultCodesBasedOnPartType(newValue));
        this._taskSubscriptions.push(sub3);

        let sub4 = this._bindingEngine.propertyObserver(this.viewModel, "workedOnCode")
            .subscribe(newValue => this.updateVisitActivities(newValue));
        this._taskSubscriptions.push(sub4);

        let sub5 = this._bindingEngine.propertyObserver(this.viewModel, "status")
            .subscribe((newValue, oldValue) => this.statusChanged());
        this._taskSubscriptions.push(sub5);

        let sub6 = this._bindingEngine.propertyObserver(this.viewModel, "workDuration")
            .subscribe((newValue, oldValue) => this.workDurationChanged(newValue, oldValue));
        this._taskSubscriptions.push(sub6);

        let sub7 = this._bindingEngine.propertyObserver(this.viewModel, "chirpCodes").subscribe(() => this.chirpCodesChanged());
        this._taskSubscriptions.push(sub7);

        let sub8 = this._bindingEngine.propertyObserver(this.viewModel, "selectedChirpCode").subscribe(() => this.selectedChirpCodeChanged());
        this._taskSubscriptions.push(sub8);

        let sub9 = this._bindingEngine.propertyObserver(this.viewModel, "chargeableTime")
            .subscribe(newValue => this.chargeableTimeChanged());
        this._taskSubscriptions.push(sub9);
    }

    private clearAllSubscriptions(): void {
        this.clearObservableSubscriptions();

        if (this._taskUpdateSubscription) {
            this._taskUpdateSubscription.dispose();
            this._taskUpdateSubscription = null;
        }

        if (this._jobStateChangedSubscription) {
            this._jobStateChangedSubscription.dispose();
            this._jobStateChangedSubscription = null;
        }
    }

    private clearObservableSubscriptions(): void {
        this._taskSubscriptions.forEach(s => s.dispose());
        this._taskSubscriptions = [];
    }

    private buildValidationRules(): Promise<void> {

        const minValidationCondition = () => !this.viewModel.isInCancellingStatus && !this.viewModel.isNotDoingJobByAnotherTask;

        return this.buildValidation([
            {
                property: "viewModel.chargeableTime",
                condition: () => this.viewModel.chargeableTime !== undefined || (this.showAdviceCategory && minValidationCondition()),
                passes: [
                    {
                        test: () => this.viewModel.chargeableTime <= this.viewModel.workDuration,
                        message: this.getLabel("chargeableTimeMessage")
                    }
                ]
            },
            // commented to fix 16843
            /* {
             property: "combinedReport",
             condition: () => !this.notCompletingJobReason && !this.isJobNoAccessedByAnotherTask
             } */,
            {
                property: "viewModel.chirpCodes",
                condition: () => minValidationCondition()
            },
            {
                property: "viewModel.status",
                condition: () => minValidationCondition(),
                passes: [
                    {
                        test: () => this.viewModel.status === this._taskStatusDoToday ? false : true,
                        message: this.getLabel("doTodayTaskStatusMessage")
                    }
                ]
            },
            {
                property: "viewModel.activity",
                condition: () => minValidationCondition()
            },
            {
                property: "viewModel.adviceOutcome",
                condition: () => minValidationCondition()
            },
            {
                property: "viewModel.workedOnCode",
                condition: () => minValidationCondition()
            },
            {
                property: "viewModel.adviceComment",
                condition: () => this.showAdviceCategory && minValidationCondition()
            },
            {
                property: "viewModel.adviceCode",
                condition: () => this.showAdviceCategory && minValidationCondition()
            },
            {
                property: "viewModel.applianceType",
                condition: () => minValidationCondition()
            },
            {
                property: "viewModel.productGroup",
                condition: () => this.viewModel.showProductGroupAndPartTypes && minValidationCondition()
            },
            {
                property: "viewModel.partType",
                condition: () => (this.viewModel.showProductGroupAndPartTypes || this.viewModel.partTypeFilteredCatalog.length > 0)
                    && minValidationCondition()
            },
            {
                property: "viewModel.faultActionCode",
                condition: () => this.viewModel.faultActionCodeFilteredCatalog.length > 0 && minValidationCondition()
            },
            {
                property: "viewModel.isPartLJReportable",
                condition: () => this.viewModel.isPotentiallyPartLJReportable && minValidationCondition()
            },
            {
                property: "viewModel.taskReport", condition: () => !this.viewModel.isNotDoingJobByAnotherTask
            }
        ]);
    }

    private updateDataState(task: Task): Promise<void> {
        return this.validateAllRules().then(() => {
            task.dataState = this.getFinalDataState();
            this.viewModel.currentApplianceId = task.applianceId;
            this.viewModel.applianceType = task.applianceType;
        });
    }

    private async jobStatusChanged(): Promise<void> {
        const job = await this._jobService.getJob(this.jobId);
        if (job && job.state === JobState.arrived) {
            let task = job.tasks.find(t => t.id === this._taskId);
            // ttr1 what about chargeable time
            this.viewModel.taskTime = new TimeRange(task.startTime, task.endTime);
            this.viewModel.workDuration = task.workDuration;
            this.viewModel.chargeableTime = task.chargeableTime;
            await this.setTimeRangePicker();
        }
    }

    private async setTimeRangePicker(): Promise<void> {
        if (!(this.viewModel.job && this.viewModel.job.state === JobState.arrived)) {
            return;
        }

        const isCurrentTaskLive = !TaskBusinessRuleHelper.isNotDoingTaskStatus(this.businessRules, this.viewModel.status);
        const isAnotherTaskLive = this.viewModel.tasks
            .some(task => task.id !== this._taskId
                && !TaskBusinessRuleHelper.isNotDoingTaskStatus(this.businessRules, task.status));

        // edge case: if we are on a multiTask job, and we previosuly NAed, and we have come back to reinstate the job,
        //  all other tasks will be still NAed until we leave the screen.  We need to make the time pickers behave before we
        //  leave the screen so we check for other visits and the before and after task status to see if we need to disable the fields.
        const isAReinstatedNATask = isCurrentTaskLive
            && TaskBusinessRuleHelper.isNotDoingJobStatus( // isNotDoingJob not isNotDoingTask
                this.businessRules,
                this.viewModel.tasks.find(task => task.id === this._taskId).status // this tasks status when we hit the screen
            )
            && this.viewModel.tasks.some(task => task.id !== this._taskId);

        this.disableTimeRangePicker = !isCurrentTaskLive
            || isAnotherTaskLive
            || isAReinstatedNATask;

        // todo: difficult to use undefined for time values that are bound to timeRangePicker because that will default the times to 00:00
        //  by the time the user leaves the page
        const isCurrentTaskTimeEmpty = this.viewModel.taskTime.startTime === "00:00";

        if (isCurrentTaskLive && isCurrentTaskTimeEmpty) {
            // if we are reinstating an e.g. XBed task, we need to reinitialise the time/duration fields
            const reinstatedTimes = await this._taskService.buildReinstatedTaskTimes(this.viewModel, this.jobId);
            this.viewModel.taskTime = new TimeRange(reinstatedTimes.startTime, reinstatedTimes.endTime);
            this.viewModel.workDuration = reinstatedTimes.workDuration;
            this.viewModel.chargeableTime = reinstatedTimes.chargeableTime;
        }
    }

    private updateActivityIfJobTypeChanged(): void {
        if (this.viewModel.activity === this._firstVisitTaskCode && this.viewModel.jobType !== this._firstVisitJobCode) {
            this.viewModel.activity = undefined;
        }
    }
}
