/// <reference path="../../../../typings/app.d.ts" />

import { customElement, bindable, bindingMode, inject } from "aurelia-framework";
import { IEngineerService } from "../../business/services/interfaces/IEngineerService";
import { EngineerService } from "../../business/services/engineerService";
import { ILabelService } from "../../business/services/interfaces/ILabelService";
import { LabelService } from "../../business/services/labelService";
import { ObjectHelper } from "../../../common/core/objectHelper";
import { StringHelper } from "../../../common/core/stringHelper";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { BusinessRuleService } from "../../business/services/businessRuleService";
import { IBusinessRuleService } from "../../business/services/interfaces/IBusinessRuleService";
import { JobService } from "../../business/services/jobService";
import { IJobService } from "../../business/services/interfaces/IJobService";
import { JobState } from "../../business/models/jobState";
import { EngineerServiceConstants } from "../../business/services/constants/engineerServiceConstants";
import { JobServiceConstants } from "../../business/services/constants/jobServiceConstants";
import { IFieldOperativeStatus } from "../../business/models/reference/IFieldOperativeStatus";
import { ConfigurationService } from "../../../common/core/services/configurationService";
import { IConfigurationService } from "../../../common/core/services/IConfigurationService";
import { IHemaConfiguration } from "../../IHemaConfiguration";
import { CatalogConstants } from "../../business/services/constants/catalogConstants";
import { Router } from "aurelia-router";
import { FftService } from "../../api/services/fftService";
import { DialogService, DialogResult } from "aurelia-dialog";
import { ErrorDialogModel } from "../../../common/ui/dialogs/models/errorDialogModel";
import { ErrorDialog } from "../../../common/ui/dialogs/errorDialog";
import { ArchiveService } from "../../business/services/archiveService";
import { IArchiveService } from "../../business/services/interfaces/IArchiveService";
import { InfoDialog } from "../../../common/ui/dialogs/infoDialog";
import { InfoDialogModel } from "../../../common/ui/dialogs/models/infoDialogModel";
import { EndOfDayFail } from "../modules/eod/endOfDayFail";
import { UserPreferenceConstants } from "../../business/services/constants/userPreferenceConstants";
import { StorageService } from "../../business/services/storageService";
import { IStorageService } from "../../business/services/interfaces/IStorageService";
import { EngineerDialogConstants } from "../constants/engineerDialogConstants";
import { MessageService } from "../../business/services/messageService";
import { IMessageService } from "../../business/services/interfaces/IMessageService";
import { ArchiveConstants } from "../../business/services/constants/archiveConstants";
import { IAnalyticsService } from "../../../common/analytics/IAnalyticsService";
import { Analytics } from "../../../common/analytics/analytics";
import { ENGINEER_TYPE_DIEMENTION1, ENGINEER_PATCH_DIEMENTION2, ENGINEER_REGION_DIEMENTION3 }
    from "../../../common/analytics/analyticsCustomDimentions";
import { VanStockService } from "../../api/services/vanStockService";
import { VanStockService as BusinessVanStockService} from "../../business/services/vanStockService";
import { IResilientService } from "../../../common/resilience/services/interfaces/IResilientService";
import { FeatureToggleService } from "../../business/services/featureToggleService";
import { IFeatureToggleService } from "../../business/services/interfaces/IFeatureToggleService";
import { IVanStockService } from "../../business/services/interfaces/IVanStockService";

@customElement("engineer-state")
@inject(EngineerService, JobService, LabelService, BusinessRuleService, EventAggregator, ConfigurationService,
    Router, FftService, VanStockService, DialogService, ArchiveService, StorageService, MessageService, Analytics,
    FeatureToggleService, BusinessVanStockService )
export class EngineerState {

    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public engineerState: string;

    public engineerStatuses: IFieldOperativeStatus[];

    public canChangeEngineerStatus: boolean;
    public userSettingsComplete: boolean;
    public labels: { [key: string]: string };
    public catalog: CatalogConstants;
    public myStatusLabel: string;

    public isSignedOn: boolean;

    public engineerService: IEngineerService;
    private _labelService: ILabelService;
    private _jobService: IJobService;
    private _messageService: IMessageService;
    private _analytics: IAnalyticsService;
    private _businessRuleService: IBusinessRuleService;
    private _eventAggregator: EventAggregator;

    private _workingStatus: IFieldOperativeStatus;
    private _notWorkingStatus: IFieldOperativeStatus;
    private _signOnStatus: IFieldOperativeStatus;
    private _signOffStatus: IFieldOperativeStatus;
    private _allStatuses: IFieldOperativeStatus[];
    private _alwaysAllowSignOff: boolean;
    private _fftService: IResilientService;
    private _vanStockService: IResilientService;
    private _dialogService: DialogService;

    private _subscriptions: Subscription[];

    private _router: Router;
    private _signOffId: string;
    private _archiveService: IArchiveService;
    private _storageService: IStorageService;
    private _featureToggleService: IFeatureToggleService;
    private _businessVanStockService: IVanStockService;
    private _lastKnownHandledEngineerState: string;

    constructor(engineerService: IEngineerService,
        jobService: IJobService,
        labelService: ILabelService,
        businessRuleService: IBusinessRuleService,
        eventAggregator: EventAggregator,
        configurationService: IConfigurationService,
        router: Router,
        fftService: IResilientService,
        vanStockService: IResilientService,
        dialogService: DialogService,
        archiveService: IArchiveService,
        storageService: IStorageService,
        messageService: IMessageService,
        analytics: IAnalyticsService,
        featureToggleService: IFeatureToggleService,
        businessVanStockService: IVanStockService) {
        this.engineerService = engineerService;
        this._labelService = labelService;
        this._jobService = jobService;
        this._businessRuleService = businessRuleService;
        this._messageService = messageService;
        this._eventAggregator = eventAggregator;
        this.catalog = CatalogConstants;

        this.engineerStatuses = [];
        this.canChangeEngineerStatus = true;

        this._subscriptions = [];
        this._router = router;
        this._fftService = fftService;
        this._vanStockService = vanStockService;

        this._dialogService = dialogService;
        let hemaConfiguration = configurationService.getConfiguration<IHemaConfiguration>();
        if (hemaConfiguration) {
            this._alwaysAllowSignOff = hemaConfiguration.alwaysAllowSignOff;
        } else {
            this._alwaysAllowSignOff = false;
        }
        this._archiveService = archiveService;
        this._storageService = storageService;
        this._featureToggleService = featureToggleService;
        this._businessVanStockService = businessVanStockService;
        this._analytics = analytics;
    }

    public attached(): Promise<void> {
        this._subscriptions.push(this._eventAggregator.subscribe(EngineerServiceConstants.ENGINEER_STATUS_CHANGED, () => this.engineerUpdateStatus()));
        this._subscriptions.push(this._eventAggregator.subscribe(JobServiceConstants.JOB_STATE_CHANGED, () => this.engineerUpdateStatus()
            .then(() => this.updateJobState())));
        this._subscriptions.push(this._eventAggregator.subscribe(UserPreferenceConstants.USER_PREFERENCES_CHANGED, (
            engineer: {
                engineerType: string,
                engineerPatch: string,
                engineerRegion: string
            }) => {
            this._analytics.setCustomMetaData(engineer, {
                engineerType: ENGINEER_TYPE_DIEMENTION1,
                engineerPatch: ENGINEER_PATCH_DIEMENTION2,
                engineerRegion: ENGINEER_REGION_DIEMENTION3
            });
            this.userSettingsToggle();
        }));

        this.userSettingsToggle();

        return this._businessRuleService.getRuleGroup(StringHelper.toCamelCase(ObjectHelper.getClassName(EngineerService)))
            .then(engineerServiceBusinessRules => {
                return this._labelService.getGroup(StringHelper.toCamelCase(ObjectHelper.getClassName(this)))
                    .then((labels) => {
                        this.labels = labels;

                        this._workingStatus = <IFieldOperativeStatus>{};
                        this._workingStatus.fieldOperativeStatus = "internalWorking";
                        this._workingStatus.fieldOperativeStatusDescription = ObjectHelper.getPathValue(labels, "working");

                        this._notWorkingStatus = <IFieldOperativeStatus>{};
                        this._notWorkingStatus.fieldOperativeStatus = "internalNotWorking";
                        this._notWorkingStatus.fieldOperativeStatusDescription = ObjectHelper.getPathValue(labels, "notWorking");

                        return this.engineerService.getAllStatus()
                            .then((data) => {
                                let signOnId = ObjectHelper.getPathValue(engineerServiceBusinessRules, "signOnId");
                                this._signOffId = ObjectHelper.getPathValue(engineerServiceBusinessRules, "signOffId");

                                this._signOnStatus = data.find(es => es.fieldOperativeStatus === signOnId);
                                this._signOffStatus = data.find(es => es.fieldOperativeStatus === this._signOffId);

                                if (!this._signOnStatus) {
                                    this._signOnStatus = <IFieldOperativeStatus>{};
                                    this._signOnStatus.fieldOperativeStatus = signOnId;
                                    this._signOnStatus.fieldOperativeStatusDescription = ObjectHelper.getPathValue(labels, "signOn");
                                }

                                if (!this._signOffStatus) {
                                    this._signOffStatus = <IFieldOperativeStatus>{};
                                    this._signOffStatus.fieldOperativeStatus = this._signOffId;
                                    this._signOffStatus.fieldOperativeStatusDescription = ObjectHelper.getPathValue(labels, "signOff");
                                }

                                let minId: number = +ObjectHelper.getPathValue(engineerServiceBusinessRules, "minId");

                                this._allStatuses = data.filter(fos => +fos.fieldOperativeStatus >= minId && fos.fieldOperativeStatus !== signOnId && fos.fieldOperativeStatus !== this._signOffId);
                            })
                            .then(() => this.engineerUpdateStatus())
                            .then(() => this.updateJobState());
                    });
            });
    }

    public detached(): void {
        this._subscriptions.forEach(sub => sub.dispose());
        this._subscriptions = [];
    }

    public engineerStateChanged(newValue: string, oldValue: string): Promise<void> {
        if (this._subscriptions.length === 0) {
            return Promise.resolve();
        }

        if (newValue === this._lastKnownHandledEngineerState) {
            // we are resetting from within this handler so do not trigger the actual business logic
            return Promise.resolve();
        }

        // a standard status change...
        if (newValue !== this._signOffId) {
            // 'working' is followed immeditately by 'ready for work' status
            // meaning 'ready for work' will always be zero.
            // hence we exclude it from archive
            return this._businessRuleService.getRuleGroup(StringHelper.toCamelCase(ObjectHelper.getClassName(EngineerService)))
                .then(engineerServiceBusinessRules => {
                    let signOnId = ObjectHelper.getPathValue(engineerServiceBusinessRules, "signOnId");
                    return this.setPartsCollectionProgress()
                        .then(() => this.engineerService.setStatus(newValue === "internalWorking" || newValue === "internalNotWorking" ? undefined : newValue))
                        .then(() => this.addToArchive(newValue === "internalNotWorking" || newValue === signOnId ? undefined : newValue))
                        .then(() => this._lastKnownHandledEngineerState = newValue)
                        .thenReturn();
                });
        }

        // ... otherwise we are trying to sign off for the day
        if (this._messageService.unreadCount > 0) {
            return this.showEndOfDayErrorDialog(EngineerDialogConstants.END_OF_DAY_MESSAGE_UNREAD)
                .then(() => this.engineerState = oldValue)
                .thenReturn();
        }

        return this.hasUnsentPayloads()
            .then(hasUnsentPayloads => {
                if (hasUnsentPayloads) {
                    return this.showEndOfDayErrorDialog(EngineerDialogConstants.END_OF_DAY_MESSAGE_UNSENT)
                        .then(() => this.engineerState = oldValue)
                        .thenReturn();
                } else {
                    // good to go
                    return this.engineerService.setStatus(newValue)
                        .then(() => this.showEndOfDaySuccessDialog())
                        .then(() => this.addToArchive(newValue))
                        .then(() => this._lastKnownHandledEngineerState = newValue)
                        .thenReturn()
                        .catch(() => this.showEndOfDayRetryDialog()
                            .then((result) => {
                                if (result.output) {
                                    // retry immediately
                                    this.engineerStateChanged(newValue, oldValue);
                                } else {
                                    // let the user escape from infinite loop if no network
                                    this.engineerState = oldValue;
                                }
                            })
                        );
                }
            });

    }

    public addToArchive(state: string): Promise<void> {
        if (state) {
            return this._jobService.getActiveJobId().then((jobId) => {
                return this.engineerService.getCurrentEngineer().then((engineer) => {
                    if (engineer && engineer.id) {
                        return this._archiveService.addEngineerState(engineer, state, jobId)
                            .then(() => this._eventAggregator.publish(ArchiveConstants.ARCHIVE_UPDATED));
                    } else {
                        return Promise.resolve();
                    }
                });
            });
        }
        return Promise.resolve();
    }    

    private engineerUpdateStatus(): Promise<void> {
        return this.engineerService.isSignedOn()
            .then((isSignedOn) => {
                this.updateStatus(isSignedOn);
                return this.areAllJobsDone().then((alldone) => {
                    return this.engineerService.isWorking()
                        .then(isWorking => {
                            this.isSignedOn = isSignedOn;
                            this.engineerStatuses = [];

                            if (!isSignedOn) {
                                this.engineerStatuses.push(this._notWorkingStatus);
                                if (this._signOnStatus) {
                                    this.engineerStatuses.push(this._signOnStatus);
                                }
                                this.engineerState = this._notWorkingStatus.fieldOperativeStatus;
                                return undefined;
                            } else {
                                this.engineerStatuses.push(this._workingStatus);
                                this.engineerStatuses = this.engineerStatuses.concat(this._allStatuses);
                                if (this._signOffStatus && alldone === true) {
                                    this.engineerStatuses.push(this._signOffStatus);
                                }
                                if (isWorking) {
                                    this.engineerState = this._workingStatus.fieldOperativeStatus;
                                    return undefined;
                                } else {
                                    return this.engineerService.getStatus()
                                        .then((status) => {
                                            if (status) {
                                                let state = this.engineerStatuses.find(es => es.fieldOperativeStatus === status);
                                                if (state) {
                                                    this.engineerState = state.fieldOperativeStatus;
                                                }
                                            }
                                        });
                                }
                            }
                        });
                });
            });
    }

    private updateJobState(): Promise<void> {
        /* if there is no active job then we are allowed to change the engineer status */
        return this._jobService.getActiveJobId()
            .then(activeJobId => {
                if (activeJobId) {
                    return this._jobService.getJobState(activeJobId)
                        .then(jobState => {
                            if (jobState) {
                                this.canChangeEngineerStatus = false;
                                if (jobState.value === JobState.complete) {
                                    this._router.navigateToRoute("customers");
                                }
                            } else {
                                this.canChangeEngineerStatus = true;
                            }
                        });
                } else {
                    this.canChangeEngineerStatus = true;
                    return undefined;
                }
            });
    }

    private areAllJobsDone(): Promise<boolean> {
        if (this._alwaysAllowSignOff === false) {
            return this._jobService.areAllJobsDone();
        } else {
            return Promise.resolve(true);
        }
    }

    private updateStatus(isSignedOn: boolean): void {
        if (this.labels) {
            const myStatus: string = "myStatus";
            const signInHere: string = "signInHere";
            if (isSignedOn) {
                this.myStatusLabel = this.labels[myStatus];
            } else {
                this.myStatusLabel = this.labels[signInHere];
            }
        }
    }

    private async hasUnsentPayloads(): Promise<boolean> {
        let payloads = [
            ...await this._fftService.getUnsentPayloads(),
            ... await this._vanStockService.getUnsentPayloads()
        ];
        if (payloads && payloads.length > 0) {
            return true;
        }
        return false;
    }

    private showEndOfDaySuccessDialog(): Promise<DialogResult> {
        let model: InfoDialogModel = new InfoDialogModel(
            this.labels[EngineerDialogConstants.SIGN_OFF],
            this.labels[EngineerDialogConstants.END_OF_DAY_MESSAGE_SUCCESS]);
        return this._dialogService.open({ viewModel: InfoDialog, model: model });
    }

    private showEndOfDayRetryDialog(): Promise<DialogResult> {
        let model: ErrorDialogModel = new ErrorDialogModel();
        model.errorMessage = this.labels[EngineerDialogConstants.END_OF_DAY_MESSAGE_RETRY];
        model.header = this.labels[EngineerDialogConstants.SIGN_OFF];
        return this._dialogService.open({ viewModel: EndOfDayFail, model: model });
    }

    private showEndOfDayErrorDialog(errorMessage: string): Promise<DialogResult> {
        let model: ErrorDialogModel = new ErrorDialogModel();
        model.errorMessage = this.labels[errorMessage];
        model.header = this.labels[EngineerDialogConstants.SIGN_OFF];
        return this._dialogService.open({ viewModel: ErrorDialog, model: model });
    }

    private userSettingsToggle(): void {
        this._storageService.userSettingsComplete().then((complete) => {
            if (complete) {
                this.userSettingsComplete = true;
            } else {
                this.userSettingsComplete = false;
            }
        });
    }

    private async setPartsCollectionProgress(): Promise<void> {

        if (this.engineerState === EngineerService.OBTAINING_MATS_STATUS && !this.engineerService.isPartCollectionInProgress) {
            const existsPartsToCollect = this._featureToggleService.isAssetTrackingEnabled()
                ? (await this._businessVanStockService.getPartsToCollect()).toCollect.length > 0
                : (await this._jobService.getPartsCollections() || []).some(partCollection => !partCollection.done);
            if (existsPartsToCollect) {
                // force the user to exit OBTAING MATS by using the parts collection UI
                this.engineerService.isPartCollectionInProgress = true;
            }
        }
    }
}
