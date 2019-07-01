import {observable} from "aurelia-binding";
import {IJobService} from "../../business/services/interfaces/IJobService";
import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {ILabelService} from "../../business/services/interfaces/ILabelService";
import {BusinessRulesViewModel} from "./businessRulesViewModel";
import {IValidationService} from "../../business/services/interfaces/IValidationService";
import {IBusinessRuleService} from "../../business/services/interfaces/IBusinessRuleService";
import {ICatalogService} from "../../business/services/interfaces/ICatalogService";
import {DataState} from "../../business/models/dataState";
import {StringHelper} from "../../../common/core/stringHelper";
import {ObjectHelper} from "../../../common/core/objectHelper";
import {IEngineerService} from "../../business/services/interfaces/IEngineerService";
import {DialogService} from "aurelia-dialog";
import {JobServiceConstants} from "../../business/services/constants/jobServiceConstants";
import {EngineerServiceConstants} from "../../business/services/constants/engineerServiceConstants";
import { RouteConfig } from "aurelia-router";
import { AppConstants } from "../../../appConstants";

export abstract class EditableViewModel extends BusinessRulesViewModel {

    @observable()
    public canEdit: boolean;
    public isNew: boolean;
    public jobId: string;
    @observable()
    public currentDataState: DataState;

    public isScrolledBottom: boolean;

    protected _jobService: IJobService;
    protected _engineerService: IEngineerService;

    private _initialDataState: DataState;
    private _dataStateGroup: string;
    private _subscriptions: Subscription[];
    private _canEditCancelledJob: boolean;
    private _currentRouteConfig: RouteConfig;

    constructor(jobService: IJobService,
                engineerService: IEngineerService,
                labelService: ILabelService,
                eventAggregator: EventAggregator,
                dialogService: DialogService,
                validationService: IValidationService,
                businessRuleService: IBusinessRuleService,
                catalogService: ICatalogService) {
        super(labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService);

        this._jobService = jobService;
        this._engineerService = engineerService;
        this.canEdit = false;
        this._subscriptions = [];
        this.isScrolledBottom = false;
        this._canEditCancelledJob = false;
    }

    public activate(params: { jobId: string }, routeConfig: RouteConfig): Promise<void> {
        this.jobId = params.jobId;
        this.isNew = false;
        this._initialDataState = undefined;
        this._lastDataLoadTime = 0;
        // by default a cancelled job (noacess etc) makes all screens canEdit: false.
        // canEditCancelledJob is a route setting we can apply to override this behaviour on a per route basis.
        // example: we don't want the task screens to be disabled (and validation to work) so override these with canEditCancelledJob: true
        if (routeConfig) {
            this._canEditCancelledJob = routeConfig.settings && !!routeConfig.settings.canEditCancelledJob;
            this._currentRouteConfig = routeConfig;
        }

        return super.activate(params, routeConfig);
    }

    public canDeactivate(): Promise<boolean> {
        let wasActivated = this._isActivated;

        return super.canDeactivate()
            .then((canDeactivate) => {
                if (wasActivated && canDeactivate) {
                    /* We do the save in canDeactivate as deactivate is not called when navigating to another child router (https://github.com/aurelia/router/issues/132),
                     we also check that the view is activated as canDeactivate can get called multiple times as the parent routers are deconstructed */
                    if (this.canEdit && !this.isNew) {
                        // do not call this.resetLiveDataState() as the save calls it. This will avoid some dataState flashing
                        return this.save();
                    } else {
                        return true;
                    }
                } else {
                    return canDeactivate;
                }
            });
    }

    public attached(): void {
        super.attached();

        this._subscriptions.push(this._eventAggregator.subscribe(JobServiceConstants.JOB_STATE_CHANGED, () => this.stateChanged()));
        this._subscriptions.push(this._eventAggregator.subscribe(EngineerServiceConstants.ENGINEER_WORKING_CHANGED, () => this.stateChanged()));

        this.stateChanged();
    }

    public detached(): Promise<void> {
        return super.detached()
            .then(() => {
                this._subscriptions.forEach(s => s.dispose());
                this._subscriptions = [];
                this.setDataState(undefined);
            });
    }

    public setInitialDataState(dataStateId: string, initialDataState: DataState) : void {
        this._initialDataState = initialDataState;
        this.setDataState(initialDataState);
    }

    public setNewDataState(dataStateGroup: string) : void {
        this._dataStateGroup = dataStateGroup;
        this.setDataState(DataState.notVisited);
    }

    public getFinalDataState() : DataState {
        return this._initialDataState === DataState.dontCare && !this._isDirty
                    ? DataState.dontCare
                    : this.currentDataState;
    }

    public load(): Promise<void> {
        return this.loadModel()
            .then(() => {
                /* set the last data load time so that any value bindings don't trigger change events and in turn validation */
                this._lastDataLoadTime = new Date().getTime();
                return this.validateAllRules();
            });
    }

    public save(): Promise<boolean> {
        return this.validateAllRules()
            .then(() => {
                this._logger.debug(ObjectHelper.getClassName(this) + " => save");

                let savePromise = this.saveModel();
                if (savePromise) {
                    return savePromise.then(() => {

                        return true;
                    });
                } else {
                    return false;
                }
            })
            .then((hasSaved: boolean) => {
                if (hasSaved) {
                    this._logger.debug(ObjectHelper.getClassName(this) + " => hasSaved: true");
                    this.notifyDataStateChanged();
                    /* only show the confirmation if the data has changed */
                    if (this._isDirty) {
                        let finalDataState = this.getFinalDataState();
                        this.showSaveToast(finalDataState);
                    }
                } else {
                    this._logger.debug(ObjectHelper.getClassName(this) + " => hasSaved: false");
                }
                this.setDirty(false);
                return true;
            })
            .catch(err => {
                this.showError(err);
                return false;
            });
    }

    public undo(): Promise<void> {
        /* set the last data load time so that any value bindings don't trigger change events and in turn validation
        * we redo the validation after the load anyway */
        this._lastDataLoadTime = new Date().getTime();

        this.undoModel();

        return this.loadModel()
            .then(() => {
                this.setDirty(false);
                return this.validateAllRules();
            });
    }

    public clear(): Promise<void> {
        let objectName = this.getLabel("objectName");

        return this.showConfirmation(this.getLabel("confirmation"), this.getParameterisedLabel("clearQuestion", [objectName]))
            .then((result) => {
                if (!result.wasCancelled) {
                    /* set the last data load time so that any value bindings don't trigger change events and in turn validation */
                    this._lastDataLoadTime = new Date().getTime();

                    return this.clearModel()
                        .then(() => {
                            this.setDirty(true);
                            return this.validateAllRules();
                        });
                } else {
                    return Promise.resolve();
                }
            });
    }

    public notifyDataStateChanged(): void {
        this._eventAggregator.publish(JobServiceConstants.JOB_DATA_STATE_CHANGED);
    }

    public validationToggle(enable: boolean): void {
        super.validationToggle(enable && this.canEdit);
    }

    protected isValidChanged(isValid: boolean) : void {
        if (this._isActivated) {
            this.setDataState(isValid ? DataState.valid : DataState.invalid);
        }
        if (this._isDirty) {
            this._eventAggregator.publish(AppConstants.APP_SAVING);
        }
    }

    protected stateChanged(): Promise<void> {
        if (this.jobId) {
            return Promise.all([
                this._jobService.isJobEditable(this.jobId),
                this._jobService.getJob(this.jobId),
                this._engineerService.isWorking()
            ])
            .then(([isEditable, job, isWorking]) => {

                let oldEdit = this.canEdit;
                this.canEdit = isEditable && isWorking && (!job.jobNotDoingReason || this._canEditCancelledJob) ;

                if (this.canEdit && !oldEdit) {
                    /* we have switched to editing mode so validate the form using the initial data state logic */
                    this.validationToggle(true);

                    return this.validateAllRules();
                } else {
                    if (oldEdit === true && !this.isNew) {
                        /*
                            we were editing and are no longer editing so save any changes and remove any validation errors,
                            unless we are in new mode and the user is completing a job, in which case we do not want to
                            save the current record.
                        */
                        return this.save()
                            .then(() => this.validationClearDisplay()
                                .then(() => {
                                    this.validationToggle(false);
                                    return;
                                }));
                    }
                }
                return undefined;
            })
            .catch(() => {
                this.canEdit = false;
                this.validationToggle(false);
            });
        } else {
            return Promise.resolve();
        }
    }

    protected loadModel(): Promise<void> {
        return Promise.resolve();
    }

    protected saveModel(): Promise<void> {
        return undefined;
    }

    protected clearModel(): Promise<void> {
        return Promise.resolve();
    }

    protected undoModel(): void {   }

    protected showSaveToast(finalDataState: DataState) : void {
        let objectName = this.getLabel("objectName");
        let msg = this.getParameterisedLabel(StringHelper.endsWith(objectName, "s") ? "savedDescriptionPlural" : "savedDescription", [objectName.toLowerCase()]);
        if (finalDataState === DataState.invalid) {
            msg += this.getLabel("savedDataInvalid");
            this.showDanger(this.getLabel("savedTitle"), msg);
        } else {
            this.showSuccess(this.getLabel("savedTitle"), msg);
        }
    }

    protected pageReadyToValidate(): boolean {
        // .DF_1149 - only validate if the page has loaded and specified its starting dataState
        return (this._initialDataState !== undefined || this._dataStateGroup)
            // do not validate if this is a don't care and the user has not touched it
            && !(this._initialDataState === DataState.dontCare && !this._isDirty);
    }

    private setDataState(dataState: DataState) : void {
        this.currentDataState = dataState;
        if (this._currentRouteConfig && this._currentRouteConfig.settings) {
            this._currentRouteConfig.settings.currentDataState = dataState;
        }
    }
}
