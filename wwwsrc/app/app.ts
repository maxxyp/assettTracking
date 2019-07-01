/// <reference path="../typings/app.d.ts" />

import * as Logging from "aurelia-logging";
import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { IConfigurationService } from "./common/core/services/IConfigurationService";
import { ConfigurationService } from "./common/core/services/configurationService";
import { Router, RouterConfiguration, NavigationInstruction } from "aurelia-router";
import { Container } from "aurelia-dependency-injection";
import { ScenarioLoader } from "./common/simulation/scenarioLoader";
import { IScenarioLoader } from "./common/simulation/IScenarioLoader";
import { RouteConfig } from "aurelia-router";
import { InitialisationEventConstants } from "./hema/business/constants/initialisationEventConstants";
import { AppInit } from "./hema/presentation/modules/initialisation/appInit";
import { EngineerServiceConstants } from "./hema/business/services/constants/engineerServiceConstants";
import { JobServiceConstants } from "./hema/business/services/constants/jobServiceConstants";
import { IEngineerService } from "./hema/business/services/interfaces/IEngineerService";
import { EngineerService } from "./hema/business/services/engineerService";
import { StorageService } from "./hema/business/services/storageService";
import { IStorageService } from "./hema/business/services/interfaces/IStorageService";
import { IToastItem } from "./common/ui/elements/models/IToastItem";
import { UiConstants } from "./common/ui/elements/constants/uiConstants";
import { About } from "./common/ui/views/about";
import { AppConstants } from "./appConstants";
import { BaseException } from "./common/core/models/baseException";
import { Guid } from "./common/core/guid";
import { ErrorHandler } from "./common/core/errorHandler";
import { EndpointHelper } from "./common/resilience/endpointHelper";
import { Threading } from "./common/core/threading";
import { PlatformHelper } from "./common/core/platformHelper";
import { IHemaConfiguration } from "./hema/IHemaConfiguration";
import { ITrainingModeConfiguration } from "./hema/business/services/interfaces/ITrainingModeConfiguration";
import { JobCacheService } from "./hema/business/services/jobCacheService";
import { IJobCacheService } from "./hema/business/services/interfaces/IJobCacheService";
import { Job } from "./hema/business/models/job";
import { JobLoggingHelper } from "./hema/business/models/jobLoggingHelper";
import {IPageService} from "./hema/presentation/services/interfaces/IPageService";
import {PageService} from "./hema/presentation/services/pageService";
import {FeatureToggleService} from "./hema/business/services/featureToggleService";
import {IFeatureToggleService} from "./hema/business/services/interfaces/IFeatureToggleService";
import {IFFTService} from "./hema/api/services/interfaces/IFFTService";
import {IVanStockService} from "./hema/api/services/interfaces/IVanStockService";
import {FftService} from "./hema/api/services/fftService";
import {VanStockService} from "./hema/api/services/vanStockService";
import {ISoundService} from "./common/ui/services/ISoundService";
import {SoundConstants} from "./hema/business/services/constants/soundConstants";
import {SoundService} from "./common/ui/services/soundService";
import {INotificationService} from "./hema/business/services/interfaces/INotificationService";
import {NotificationService} from "./hema/business/services/notificationService";

@inject(
    ConfigurationService,
    EventAggregator,
    EngineerService,
    StorageService,
    About,
    JobCacheService,
    JobLoggingHelper,
    PageService,
    FeatureToggleService,
    FftService,
    VanStockService,
    SoundService,
    NotificationService
)
export class App {
    public router: Router;
    public isInitialised: boolean;

    public saving: boolean;
    public saveOffsetTop: number;

    public appInitViewModel: AppInit;
    public isScrolledBottom: boolean;

    private _configurationService: IConfigurationService;
    private _eventAggregator: EventAggregator;
    private _engineerService: IEngineerService;
    private _jobCacheService: IJobCacheService;

    private _storage: IStorageService;

    private _logger: Logging.Logger;
    private _savingTimeout: number;
    private _jobLoggingHelper: JobLoggingHelper;
    private _defaultLandingPage: string;
    private _pageService: IPageService;
    private _featureToggleService: IFeatureToggleService;
    private _fftService: IFFTService;
    private _soundService: ISoundService;
    private _notificationService: INotificationService;

    constructor(configurationService: IConfigurationService,
        eventAggregator: EventAggregator,
        engineerService: IEngineerService,
        strorageService: IStorageService,
        about: About,
        jobCacheService: IJobCacheService,
        jobLoggingHelper: JobLoggingHelper,
                pageService: IPageService,
                featureToggleService: IFeatureToggleService,
                fftService: IFFTService,
                vanStockService: IVanStockService,
                soundService: ISoundService,
                notificationService: INotificationService
    ) {
        this._configurationService = configurationService;
        this._engineerService = engineerService;
        this._storage = strorageService;
        this._eventAggregator = eventAggregator;
        this._jobCacheService = jobCacheService;
        this._jobLoggingHelper = jobLoggingHelper;
        this._pageService = pageService;
        this._featureToggleService = featureToggleService;
        this._fftService = fftService;
        this._soundService = soundService;
        this._notificationService = notificationService;

        this.isScrolledBottom = false;
        this.saving = false;

        this._logger = Logging.getLogger("app");

        ErrorHandler.customErrorHandler = (exception) => {
            this.handleError(exception);
        };
        about.addViewModel("../../../hema/presentation/modules/settings/about/releaseNotes");
        about.addViewModel("../../../hema/presentation/modules/settings/about/resilienceInformation",
            {service: this._fftService, title: "EWB"});
        about.addViewModel("../../../hema/presentation/modules/settings/about/resilienceInformation",
            {service: vanStockService, title: "Van Stock"});
        about.addViewModel("../../../hema/presentation/modules/settings/about/supportOperations");
        about.addViewModel("../../../hema/presentation/modules/settings/about/engineerDetails");
        about.addViewModel("../../../hema/presentation/modules/settings/about/catalogVersions");
        about.addViewModel("../../../hema/presentation/modules/settings/about/catalogQuery");
        about.addViewModel("../../../hema/presentation/modules/settings/about/endpointDetails");
        about.addViewModel("../../../hema/presentation/modules/settings/about/featureToggle");

        if (PlatformHelper.isDevelopment && PlatformHelper.getPlatform() === "wua") {
            about.addViewModel("../../../hema/presentation/modules/settings/about/logConsole");
        }

        this._eventAggregator.subscribe(InitialisationEventConstants.INITIALISED, () => {
            this.isInitialised = true;
        });

        // toast updates todo better place to put this?  maybe notificationServices
        this._eventAggregator.subscribe(AppConstants.APP_TOAST_ADDED, ((toast: IToastItem) => {
            // toast dismiss time is overruled by settings #18034
            this._storage.getAppSettings().then((settings) => {
                toast.position = settings.notificationPosition;
                toast.dismissTime = settings.notificationDisplayTime;
                this._eventAggregator.publish(UiConstants.TOAST_ADDED, toast);
            });

        }));

        this._eventAggregator.subscribe(AppConstants.APP_UNHANDLED_EXCEPTION, ((exception: BaseException) => {
            this.handleError(exception);
        }));

        this._eventAggregator.subscribe(EngineerServiceConstants.ENGINEER_SIGNED_ON_CHANGED, (isSignedOn: boolean) => {
            const isTheUserOnAVanStockPage = this.router.currentInstruction
                && this.router.currentInstruction.config
                && this.router.currentInstruction.config.name === "consumables";

            if (isTheUserOnAVanStockPage) {
                // if the user is perusing their van stock then don't redirect.
                return;
            }

            if (isSignedOn) {
                this.router.navigateToRoute("customers");
            } else {
                this.router.navigateToRoute("settings", { isSignOff: true });
            }
        });

        this._eventAggregator.subscribe("router:navigation:processing", (params: { instruction: NavigationInstruction }) => {
            this._logger.debug("Processing: " + params.instruction.config.name);
        });
        this._eventAggregator.subscribe("router:navigation:complete", (params: { instruction: NavigationInstruction, result: any }) => {
            this._logger.debug("Complete: " + params.instruction.config.name);

            this._pageService.addOrUpdateLastVisitedPage(params.instruction.fragment);

            Threading.delay(() => {
                this.handleScrollEvent();
                if (params.instruction.config.name === "settings" && params.instruction.queryParams.isSignOff) {
                    // because we can complete a job and then end-of-day all whilst looking at a job-details page, a race
                    //  condition exists whereby "job state change" handlers will fire off, hit the jobCacheService.getJob()
                    //  but the end-of-day process has cleared the job store.  The getJob() calls then throw exceptions as
                    //  the requested job no longer exists.  So we only clear down the job store when we have end-of-dayed and
                    //  and navigated away from job detasil page (therefore disposing all of the handler subscriptions)
                    this._jobCacheService.clearJobsToDo();
                    this._jobCacheService.clearWorkListJobs();
                    this._jobCacheService.getPartsCollections();
                }
            }, 1000);
        });
        this._eventAggregator.subscribe(JobServiceConstants.JOB_COMPLETION_REFRESH, (canNavigate: boolean) => {
            if (canNavigate) {
                this.router.navigate("/customers");
            }            
        });
        this._eventAggregator.subscribe(AppConstants.APP_SAVING, () => {

            let currentInstruction = this.router.currentInstruction;
            let viewPorts = currentInstruction && currentInstruction.router.viewPorts;
            let element: HTMLElement = viewPorts && (<any>viewPorts).default && (<any>viewPorts).default.element;
            if (element) {
                let viewState = element.children[0];
                if (viewState) {
                    let firstDiv = viewState.children[0];
                    if (firstDiv) {
                        this.saveOffsetTop = firstDiv.clientHeight - element.scrollTop;
                    }
                }
            }

            if (!!this.saving) {
                if (this._savingTimeout) {
                    Threading.stopDelay(this._savingTimeout);
                }
            } else {
                this.saving = true;
            }
            this._savingTimeout = Threading.delay(() => {
                this.saving = false;
            }, 900);
        });

        this.isInitialised = false;
        this.appInitViewModel = Container.instance.get(AppInit);

        this.enableLogJobOnEverySave();
    }

    public static requiresSimulation(configurationService: IConfigurationService): { totalRoutes: number, simulatedRoutes: number } {
        return EndpointHelper.appRequiresSimulation(configurationService, [
            "fftServiceEndpoint",
            "whoAmIServiceEndpoint",
            "adaptServiceEndpoint",
            "assetTrackingEndpoint"]);
    }

    public activate(): Promise<void> {

        // badge updates for van stock, consumables
        this._notificationService.initRouterBadgeEventSubs();

        this._eventAggregator.subscribe(SoundConstants.NOTIFICATION_SOUND, async (rings: number = 1) => {

                const settings = await this._storage.getAppSettings();

                if (settings && settings.soundEnabled) {
                    await this._soundService.playBell(rings);
                }
            }
        );

        return this.checkForSimulation();
    }

    public async configureRouter(routerConfiguration: RouterConfiguration, router: Router): Promise<void> {
        this.router = router;

        routerConfiguration.title = this._configurationService.getConfiguration<IHemaConfiguration>().applicationTitle || "EWB";

        let routes: RouteConfig[] = [];

        this._defaultLandingPage = await this._storage.userSettingsComplete() ? "customers" : "settings";

        routes = routes.concat(this.getAppRoutes());

        routerConfiguration.map(routes);

        router.ensureConfigured().then(() => {
            return this._notificationService.updateInitialRouterBadgeCounts();
        });
    }

    public handleScrollEvent(): void {
        let target: HTMLElement = this.router.viewPorts && (<any>this.router.viewPorts).default && (<any>this.router.viewPorts).default.element;
        this.isScrolledBottom = (target.scrollTop + 50) >= (target.scrollHeight - target.offsetHeight);
    }

    private getAppRoutes(): RouteConfig[] {
        let consumablesLabel = "Consumables";
        let consumableIcon = "hema-icon-parts-basket";

        const isAssetTracked = this._featureToggleService.isAssetTrackingEnabled();

        if (isAssetTracked) {
            consumablesLabel = "My Van";
            consumableIcon = "hema-icon-vanstock";
        }

        return [
            {
                route: "",
                redirect: this._defaultLandingPage
            },
            {
                route: "customers",
                name: "customers",
                moduleId: "hema/presentation/modules/jobsList/jobsList",
                nav: true,
                title: "Customers",
                settings: { icon: "icon-engineerappointments" }
            },
            {
                route: "attended",
                name: "attended",
                redirect: "customers/attended",
                title: "Attended",
                nav: true,
                settings: {
                    icon: "hema-icon-jobs-done"
                }
            },
            {
                route: "messages",
                name: "messages",
                moduleId: "hema/presentation/modules/messages/messages",
                nav: true,
                title: "Messages",
                settings: {icon: "icon-contact", hasBadge: true, badgeCount: 0, showCount: true}
            },
            {
                route: "consumables",
                name: "consumables",
                moduleId: "hema/presentation/modules/parts/consumablesMain",
                nav: true,
                title: consumablesLabel,
                settings: {icon: consumableIcon, hasBadge: true, badgeCount: 0, showCount: false}
            },
            {
                route: "archives",
                name: "archives",
                moduleId: "hema/presentation/modules/archives/archives",
                nav: true,
                title: "Archives",
                settings: { icon: "hema-icon-calendar" }
            },
            {
                route: "settings",
                name: "settings",
                moduleId: "hema/presentation/modules/settings/settingsMain",
                nav: true,
                title: "Settings",
                settings: { icon: "hema-icon-settings" }
            }
        ];
    }

    private checkForSimulation(): Promise<void> {
        let simulationCounts = App.requiresSimulation(this._configurationService);
        if (simulationCounts.simulatedRoutes > 0) {
            /* Load scenario data for simulation use */
            let scenarioLoader = <IScenarioLoader>Container.instance.get(ScenarioLoader);

            if (scenarioLoader) {
                let trainingConfig = this._configurationService.getConfiguration<ITrainingModeConfiguration>();
                let isTrainingMode = trainingConfig && trainingConfig.trainingMode;
                return scenarioLoader.initialise(isTrainingMode ? "trainingScenarios" : null);
            } else {
                return Promise.resolve();
            }
        } else {
            return Promise.resolve();
        }
    }

    private handleError(exception: BaseException): void {
        this._logger.error(exception && exception.toString());

        let toastItem: IToastItem = {
            id: Guid.newGuid(),
            title: "Error",
            content: "An unhandled fault has been detected in the application",
            toastAction: { details: exception && exception.toString() },
            style: "danger",
            dismissTime: 0
        };
        this._eventAggregator.publish(AppConstants.APP_TOAST_ADDED, toastItem);
    }

    private enableLogJobOnEverySave(): void {
        if (this._configurationService.getConfiguration<IHemaConfiguration>().logJobOnEverySave) {
            this._eventAggregator.subscribe("router:navigation:complete", async (params: { instruction: NavigationInstruction }) => {

                try {
                    if (!await this._engineerService.isWorking()) {
                        return;
                    }

                    let activeJob = (await this._jobCacheService.getJobsToDo() || [])
                        .find(job => Job.isActive(job));

                    if (!activeJob) {
                        return;
                    }

                    let loggableJob = this._jobLoggingHelper.prepareLoggableJob(activeJob);

                    let thisRoute = params
                        && params.instruction
                        && params.instruction.params
                        && params.instruction.params.childRoute;

                    this._logger.warn("Job saved:", thisRoute, loggableJob);

                } catch (error) {
                    this._logger.warn("Job saved:", "Error trying to log job", error);
                }
            });
        }
    }
}
