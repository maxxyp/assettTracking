/// <reference path="../../../../../typings/app.d.ts" />

import { inject } from "aurelia-framework";
import { DialogService } from "aurelia-dialog";

import { BaseViewModel } from "../../models/baseViewModel";

import { IReferenceDataService } from "../../../business/services/interfaces/IReferenceDataService";
import { ReferenceDataService } from "../../../business/services/referenceDataService";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { InitialisationEventConstants } from "../../../business/constants/initialisationEventConstants";
import { InitialisationCategory } from "../../../business/models/initialisationCategory";
import { InitialisationUpdate } from "../../../business/models/initialisationUpdate";
import { IBridgeBusinessService } from "../../../business/services/interfaces/IBridgeBusinessService";
import { BridgeBusinessService } from "../../../business/services/bridgeBusinessService";
import { EngineerService } from "../../../business/services/engineerService";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { WorkRetrievalService } from "../../../business/services/workRetrievalService";
import { IWorkRetrievalService } from "../../../business/services/interfaces/IWorkRetrievalService";
import { ConfigurationService } from "../../../../common/core/services/configurationService";
import { StorageService } from "../../../business/services/storageService";
import { IStorageService } from "../../../business/services/interfaces/IStorageService";
import { IConfigurationService } from "../../../../common/core/services/IConfigurationService";
import { PlatformHelper } from "../../../../common/core/platformHelper";
import { IHttpHeader } from "../../../../common/core/IHttpHeader";
import { DeviceService } from "../../../../common/core/services/deviceService";
import { IDeviceService } from "../../../../common/core/services/IDeviceService";
import { Engineer } from "../../../business/models/engineer";
import { IHemaConfiguration } from "../../../IHemaConfiguration";
import { FftHeaderProvider } from "../../../api/services/fftHeaderProvider";
import { IHttpHeaderProvider } from "../../../../common/resilience/services/interfaces/IHttpHeaderProvider";
import { ArchiveService } from "../../../business/services/archiveService";
import { IArchiveService } from "../../../business/services/interfaces/IArchiveService";
import { MessageService } from "../../../business/services/messageService";
import { IMessageService } from "../../../business/services/interfaces/IMessageService";
import { Analytics } from "../../../../common/analytics/analytics";
import { IAnalyticsService } from "../../../../common/analytics/IAnalyticsService";
import { ApplicationSettings } from "../../../business/models/applicationSettings";
import { ToastPosition } from "../../../../common/ui/elements/models/toastPosition";
import { ITrainingModeConfiguration } from "../../../business/services/interfaces/ITrainingModeConfiguration";
import { CatalogService } from "../../../business/services/catalogService";
import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";
import { BaseException } from "../../../../common/core/models/baseException";
import { AnalyticsExceptionModel } from "../../../../common/analytics/analyticsExceptionModel";
import { CatalogConstants } from "../../../business/services/constants/catalogConstants";
import { ObjectHelper } from "../../../../common/core/objectHelper";
import { ISetting } from "../../../business/models/reference/ISetting";
import { AuthenticationService } from "../../../business/services/authenticationService";
import { IAuthenticationService } from "../../../business/services/interfaces/IAuthenticationService";
import { FeatureToggleService } from "../../../business/services/featureToggleService";
import { IFeatureToggleService } from "../../../business/services/interfaces/IFeatureToggleService";
import { VanStockEngine } from "../../../business/services/vanStockEngine";
import { IVanStockEngine } from "../../../business/services/interfaces/IVanStockEngine";
import { WindowHelper } from "../../../core/windowHelper";
import { AppConstants } from "../../../../appConstants";
import { Guid } from "../../../../common/core/guid";
import { IToastItem } from "../../../../common/ui/elements/models/IToastItem";
import { IndexedDatabaseService } from "../../../../common/storage/indexedDatabaseService";
import { IDatabaseService } from "../../../../common/storage/IDatabaseService";
import { HttpHelper } from "../../../../common/core/httpHelper";
import { IHttpHelper } from "../../../../common/core/IHttpHelper";
import { LogHelper } from "../../../../common/core/logHelper";
import { GeoHelper } from "../../../../common/geo/geoHelper";
import { AppLauncher } from "../../../../common/core/services/appLauncher";
import { IAppLauncher } from "../../../../common/core/services/IAppLauncher";

const NOTIFICATION_DISPLAY_TIME: number = 5;
const NOTIFICATION_DISPLAY_POSITION: ToastPosition = ToastPosition.bottomcenter;
const DROPDOWN_TYPE: number = 1;
const MIN_ITEMS_CATEGORISE_SMASH_BUTTONS: number = -1;
const SOUND_ENABLED: boolean = false;
const LOCATION_SETTINGS_URI: string = "ms-settings:privacy-location";

@inject(ReferenceDataService, EventAggregator, DialogService, BridgeBusinessService,
    EngineerService, WorkRetrievalService, ConfigurationService, StorageService,
    DeviceService, FftHeaderProvider, ArchiveService, MessageService, Analytics, CatalogService,
    AuthenticationService, IndexedDatabaseService, FeatureToggleService, VanStockEngine, HttpHelper, AppLauncher)
export class AppInit extends BaseViewModel {
    public category: string;
    public item: string;
    public progressValue: number;
    public progressMax: number;
    public error: string;
    public appVersion: string;
    public buildType: string;
    public isAuthError: boolean;
    public refDataRetrySeconds: number;
    public showReferenceDataRetryDiv: boolean;
    public showLocationNotification: boolean;

    private _referenceDataService: IReferenceDataService;
    private _adaptBusinessService: IBridgeBusinessService;
    private _engineerService: IEngineerService;
    private _workRetrievalService: IWorkRetrievalService;
    private _storageService: IStorageService;
    private _configurationService: IConfigurationService;
    private _deviceService: IDeviceService;
    private _fftHeaderProvider: IHttpHeaderProvider;
    private _archiveService: IArchiveService;
    private _messageService: IMessageService;
    private _analyticsService: IAnalyticsService;
    private _catalogService: ICatalogService;
    private _featureToggleService: IFeatureToggleService;
    private _engineerAuthentication: IAuthenticationService;
    private _vanStockEngine: IVanStockEngine;
    private _indexedDatabaseService: IDatabaseService;
    private _subscription1: Subscription;
    private _subscription2: Subscription;
    private _subscription3: Subscription;
    private _httpHelper: IHttpHelper;
    private _appLauncher: IAppLauncher;

    constructor(referenceDataService: IReferenceDataService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        adaptBusinessService: IBridgeBusinessService,
        engineerService: IEngineerService,
        workRetrievalService: IWorkRetrievalService,
        configurationService: IConfigurationService,
        storageService: IStorageService,
        deviceService: IDeviceService,
        fftHeaderProvider: IHttpHeaderProvider,
        archiveService: IArchiveService,
        messageService: IMessageService,
        analyticsService: IAnalyticsService,
        catalogService: ICatalogService,
        engineerAuthentication: IAuthenticationService,
        indexedDatabaseService: IDatabaseService,
        featureToggleService: IFeatureToggleService,
        vanStockEngine: IVanStockEngine,
        httpHelper: IHttpHelper,
        appLauncher: IAppLauncher) {
        /* We cant use the labelservice as this is the appinit which populates the label service data */
        super(null, eventAggregator, dialogService);

        this._referenceDataService = referenceDataService;
        this._adaptBusinessService = adaptBusinessService;
        this._engineerService = engineerService;
        this._workRetrievalService = workRetrievalService;
        this._configurationService = configurationService;
        this._storageService = storageService;
        this._deviceService = deviceService;
        this._fftHeaderProvider = fftHeaderProvider;
        this._archiveService = archiveService;
        this._messageService = messageService;
        this._analyticsService = analyticsService;
        this._catalogService = catalogService;
        this._engineerAuthentication = engineerAuthentication;
        this._featureToggleService = featureToggleService;
        this._vanStockEngine = vanStockEngine;
        this.showReferenceDataRetryDiv = false;
        this._indexedDatabaseService = indexedDatabaseService;
        this._httpHelper = httpHelper;
        this._appLauncher = appLauncher;
    }

    public async attachedAsync(): Promise<any> {
        this.appVersion = PlatformHelper.appVersion;
        this.buildType = PlatformHelper.buildType;

        this._logger.debug("Application is being initialised", [{
            appVersion: this.appVersion,
            buildType: this.buildType
        }]);

        this._subscription1 = this._eventAggregator.subscribe(InitialisationEventConstants.INITIALISE_CATEGORY,
            (initCategory: InitialisationCategory) => {
                this.category = initCategory.category;
                this.item = initCategory.item;
                this.progressMax = Math.max(initCategory.progressMax, 0);
                this.progressValue = 0;
            });

        this._subscription2 = this._eventAggregator.subscribe(InitialisationEventConstants.INITIALISE_UPDATE,
            (initUpdate: InitialisationUpdate) => {
                this.item = initUpdate.item;
                this.progressValue = Math.max(initUpdate.progressValue, 0);
            });
        await this.init();

    }

    public detachedAsync(): Promise<void> {
        if (this._subscription1) {
            this._subscription1.dispose();
            this._subscription1 = null;
        }
        if (this._subscription2) {
            this._subscription2.dispose();
            this._subscription2 = null;
        }
        if (this._subscription3) {
            this._subscription3.dispose();
            this._subscription3 = null;
        }
        return Promise.resolve();
    }

    public async retry(): Promise<void> {
        this._logger.warn("appInit: Retry reference data. Attempting to re-launch app");
        WindowHelper.reload();
    }

    public async ignore(): Promise<void> {
        this._logger.warn("appInit: Retry ignored");
        this.showReferenceDataRetryDiv = false;
    }

    public openSettings(): void {
        this.showLocationNotification = false;
        this._appLauncher.launchApplication(LOCATION_SETTINGS_URI);
    }

    private async init(): Promise<void> {

        let nextCategory = (category: string) => {
            this.category = category;
            this.item = "";
            this.progressMax = 0;
            this.progressValue = 0;
        };

        try {
            this.isAuthError = false;
            this.error = undefined;

            let engineer: Engineer;
            let isTrainingMode = this._configurationService.getConfiguration<ITrainingModeConfiguration>().trainingMode;

            // this would setup listener for suspending and resuming event (fix for app crashing after came out of stand by)
            this._httpHelper.intialise();
            try {
                // authentication sequence
                nextCategory("Checking Existing Logon");
                engineer = (await this._engineerService.getCurrentEngineer() || <Engineer>{ isSignedOn: false });

                nextCategory("Initialising Analytics");
                await this._analyticsService.initialize(engineer.id, { trackNavigation: true });

                nextCategory("Authenticating User");
                let authenticationResult = await this._engineerAuthentication.authenticate("Authenticating User", engineer.isSignedOn);

                nextCategory("Authorising User");
                await this._engineerService.initialise(authenticationResult.hasWhoAmISucceeded, authenticationResult.result);
                engineer = await this._engineerService.getCurrentEngineer();

                if (!isTrainingMode) {
                    nextCategory("Checking User Details");
                    engineer = await this._engineerService.overrideEngineerId(engineer);
                }

            } catch (error) {
                this.isAuthError = true;
                throw error;
            }

            this._analyticsService.setUserId(engineer.id);

            nextCategory("Initialising User Mode");
            await this.initialiseTrainingMode(engineer);

            nextCategory("Initialising Static Headers");
            await this.initialiseStaticRequestHeaders(engineer);

            nextCategory("Initialising Application Settings");
            await this.initialiseApplicationSettings();

            nextCategory("Initialising Catalogs");
            await this._referenceDataService.initialise();

            if (!await this._storageService.getLastSuccessfulSyncTime()) {
                this.showReferenceDataRetryDiv = true;
                await this.checkIfIsRefDataRetryIngored();
            }

            nextCategory("Overriding Application Settings");
            await this.overrideApplicationSettings();

            nextCategory("Preloading Catalogs");
            await this._catalogService.loadConsumables();

            nextCategory("Initialising Adapt Bridge");
            await this._adaptBusinessService.initialise();

            nextCategory("Initialising Work Retrieval");
            await this._workRetrievalService.initialise();

            // todo: remove migration code after version 7.3 is released
            //  - (we need to move from indexedDb to localStorage cos indexedDb cannot be relied upon!)
            nextCategory("Migrating Archives");
            await this._archiveService.migrate(this._indexedDatabaseService);

            nextCategory("Initialising Archive");
            await this._archiveService.initialise();

            nextCategory("Initialising Messages");
            await this._messageService.initialise();

            nextCategory("Initialising Asset Tracking Feature Check");
            await this._featureToggleService.initialise(engineer.id);

            nextCategory("Initialising Van Stock");
            if (this._featureToggleService.isAssetTrackingEnabled()) {
                this.showLocationNotification = !await GeoHelper.isLocationEnabled();

                if (this.showLocationNotification) {
                    this._logger.warn("appinit: Initialising Van Stock - Location service on this device is not turned on");
                    let delay = async (): Promise<void> => {
                        if (!this.showLocationNotification) {
                            return;
                        }
                        await Promise.delay(1000);
                        return delay();
                    };

                    await delay();
                }

                await this._vanStockEngine.initialise(engineer.id);
            }

            if (!await this._storageService.getLastSuccessfulSyncTime()) {
                this._eventAggregator.publish(AppConstants.APP_TOAST_ADDED, <IToastItem>{
                    id: Guid.newGuid(),
                    title: "Reference Error",
                    style: "warning",
                    autoDismiss: false,
                    content: "The reference data is not fully downloaded. Before you carry out work, we recommend you to tap on REMOVE CATALOG DATA button which" +
                        " is under Support Operations section in settings page"
                });
            }

            nextCategory("Clearing logs");
            if (PlatformHelper.getPlatform() === "wua") {
                const maxLogFileAgeDays: number = this._configurationService.getConfiguration<IHemaConfiguration>().maxLogFileAgeDays || 0;
                if (maxLogFileAgeDays > 0) {
                    LogHelper.clearDownLogs(maxLogFileAgeDays);
                }
            }

            this._eventAggregator.publish(InitialisationEventConstants.INITIALISED);
        } catch (exception) {

            if (!exception) {
                this.error = "We were unable to identify any additional details for the problem.";
            } else if (exception instanceof BaseException) {
                this.error = (<BaseException>exception).resolvedMessage;
            } else {
                this.error = exception.toString();
            }

            let analyticsModel = new AnalyticsExceptionModel("Application Intialisation: " + this.error);
            this._logger.error(this.category, analyticsModel, exception && exception.toString());
        }
    }

    private async initialiseStaticRequestHeaders(engineer: Engineer): Promise<void> {
        let headers: IHttpHeader[] = [];

        let deviceId = await this._deviceService.getDeviceId();

        let deviceType = await this._deviceService.getDeviceType();

        let hemaConfiguration = this._configurationService.getConfiguration<IHemaConfiguration>();

        if (hemaConfiguration) {
            headers.push({ name: "organisation", value: hemaConfiguration.organisationId });
            headers.push({ name: "applicationId", value: hemaConfiguration.applicationId });
        }
        headers.push({ name: "engineerId", value: engineer.id });
        headers.push({ name: "deviceId", value: deviceId });
        headers.push({ name: "deviceType", value: deviceType });

        this._fftHeaderProvider.setStaticHeaders(headers);
    }

    private async initialiseApplicationSettings(): Promise<void> {
        let defaultApplicationSettings = this._configurationService.getConfiguration<ApplicationSettings>();

        let settings = await this._storageService.getAppSettings();
        if (!settings) {
            settings = <ApplicationSettings>{};
        }

        if (settings.notificationDisplayTime === undefined) {
            settings.notificationDisplayTime = defaultApplicationSettings.notificationDisplayTime || NOTIFICATION_DISPLAY_TIME;
        }

        if (settings.notificationPosition === undefined) {
            settings.notificationPosition = defaultApplicationSettings.notificationPosition || NOTIFICATION_DISPLAY_POSITION;
        }

        if (settings.dropdownType === undefined) {
            settings.dropdownType = defaultApplicationSettings.dropdownType || DROPDOWN_TYPE;
        }

        if (settings.minItemsToCategoriseSmashButtons === undefined) {
            settings.minItemsToCategoriseSmashButtons = defaultApplicationSettings.minItemsToCategoriseSmashButtons || MIN_ITEMS_CATEGORISE_SMASH_BUTTONS;
        }

        if (settings.soundEnabled === undefined) {
            settings.soundEnabled = defaultApplicationSettings.soundEnabled || SOUND_ENABLED;
        }

        await this._storageService.setAppSettings(settings);

    }

    private async initialiseTrainingMode(engineer: Engineer): Promise<void> {

        let config = this._configurationService.getConfiguration<IHemaConfiguration>();
        let isTrainingMode = this._configurationService.getConfiguration<ITrainingModeConfiguration>().trainingMode;

        if (isTrainingMode && config.whoAmIServiceEndpoint.routes.some(r => r.route === "whoAmI" && r.client === "prod")) {

            this.category = "Initialising Training mode";
            let simulationEngineerId = await this._storageService.getSimulationEngineer();
            if (simulationEngineerId) {
                engineer.id = simulationEngineerId;
                await this._storageService.setEngineer(engineer);
            }
        }

        this._logger.warn("User Details", [engineer]);
    }

    private async overrideApplicationSettings(): Promise<void> {
        try {
            let overrideSettings = await this._referenceDataService.getItems<ISetting>(CatalogConstants.SETTING, undefined, undefined);
            if (overrideSettings && overrideSettings.length) {
                let overrideSettingsObject = ObjectHelper.keyValueArrayToObject(overrideSettings);
                this._configurationService.overrideSettings(overrideSettingsObject);
                this._logger.info("Application settings overridden", JSON.stringify(overrideSettingsObject));
            } else {
                this._logger.info("Application settings not overridden");
            }
        } catch (err) {
            this._logger.warn("Application settings not overridden because of error", err);
        }
    }

    private checkIfIsRefDataRetryIngored(): Promise<void> {
        if (!this.showReferenceDataRetryDiv) {
            return Promise.resolve();
        }
        return Promise.delay(1000)
            .then(() => {
                return this.checkIfIsRefDataRetryIngored();
            });
    }
}
