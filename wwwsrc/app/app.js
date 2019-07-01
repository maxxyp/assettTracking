/// <reference path="../typings/app.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "aurelia-logging", "aurelia-framework", "aurelia-event-aggregator", "./common/core/services/configurationService", "aurelia-dependency-injection", "./common/simulation/scenarioLoader", "./hema/business/constants/initialisationEventConstants", "./hema/presentation/modules/initialisation/appInit", "./hema/business/services/constants/engineerServiceConstants", "./hema/business/services/constants/jobServiceConstants", "./hema/business/services/engineerService", "./hema/business/services/storageService", "./common/ui/elements/constants/uiConstants", "./common/ui/views/about", "./appConstants", "./common/core/guid", "./common/core/errorHandler", "./common/resilience/endpointHelper", "./common/core/threading", "./common/core/platformHelper", "./hema/business/services/jobCacheService", "./hema/business/models/job", "./hema/business/models/jobLoggingHelper", "./hema/presentation/services/pageService", "./hema/business/services/featureToggleService", "./hema/api/services/fftService", "./hema/api/services/vanStockService", "./hema/business/services/constants/soundConstants", "./common/ui/services/soundService", "./hema/business/services/notificationService"], function (require, exports, Logging, aurelia_framework_1, aurelia_event_aggregator_1, configurationService_1, aurelia_dependency_injection_1, scenarioLoader_1, initialisationEventConstants_1, appInit_1, engineerServiceConstants_1, jobServiceConstants_1, engineerService_1, storageService_1, uiConstants_1, about_1, appConstants_1, guid_1, errorHandler_1, endpointHelper_1, threading_1, platformHelper_1, jobCacheService_1, job_1, jobLoggingHelper_1, pageService_1, featureToggleService_1, fftService_1, vanStockService_1, soundConstants_1, soundService_1, notificationService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = /** @class */ (function () {
        function App(configurationService, eventAggregator, engineerService, strorageService, about, jobCacheService, jobLoggingHelper, pageService, featureToggleService, fftService, vanStockService, soundService, notificationService) {
            var _this = this;
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
            errorHandler_1.ErrorHandler.customErrorHandler = function (exception) {
                _this.handleError(exception);
            };
            about.addViewModel("../../../hema/presentation/modules/settings/about/releaseNotes");
            about.addViewModel("../../../hema/presentation/modules/settings/about/resilienceInformation", { service: this._fftService, title: "EWB" });
            about.addViewModel("../../../hema/presentation/modules/settings/about/resilienceInformation", { service: vanStockService, title: "Van Stock" });
            about.addViewModel("../../../hema/presentation/modules/settings/about/supportOperations");
            about.addViewModel("../../../hema/presentation/modules/settings/about/engineerDetails");
            about.addViewModel("../../../hema/presentation/modules/settings/about/catalogVersions");
            about.addViewModel("../../../hema/presentation/modules/settings/about/catalogQuery");
            about.addViewModel("../../../hema/presentation/modules/settings/about/endpointDetails");
            about.addViewModel("../../../hema/presentation/modules/settings/about/featureToggle");
            if (platformHelper_1.PlatformHelper.isDevelopment && platformHelper_1.PlatformHelper.getPlatform() === "wua") {
                about.addViewModel("../../../hema/presentation/modules/settings/about/logConsole");
            }
            this._eventAggregator.subscribe(initialisationEventConstants_1.InitialisationEventConstants.INITIALISED, function () {
                _this.isInitialised = true;
            });
            // toast updates todo better place to put this?  maybe notificationServices
            this._eventAggregator.subscribe(appConstants_1.AppConstants.APP_TOAST_ADDED, (function (toast) {
                // toast dismiss time is overruled by settings #18034
                _this._storage.getAppSettings().then(function (settings) {
                    toast.position = settings.notificationPosition;
                    toast.dismissTime = settings.notificationDisplayTime;
                    _this._eventAggregator.publish(uiConstants_1.UiConstants.TOAST_ADDED, toast);
                });
            }));
            this._eventAggregator.subscribe(appConstants_1.AppConstants.APP_UNHANDLED_EXCEPTION, (function (exception) {
                _this.handleError(exception);
            }));
            this._eventAggregator.subscribe(engineerServiceConstants_1.EngineerServiceConstants.ENGINEER_SIGNED_ON_CHANGED, function (isSignedOn) {
                var isTheUserOnAVanStockPage = _this.router.currentInstruction
                    && _this.router.currentInstruction.config
                    && _this.router.currentInstruction.config.name === "consumables";
                if (isTheUserOnAVanStockPage) {
                    // if the user is perusing their van stock then don't redirect.
                    return;
                }
                if (isSignedOn) {
                    _this.router.navigateToRoute("customers");
                }
                else {
                    _this.router.navigateToRoute("settings", { isSignOff: true });
                }
            });
            this._eventAggregator.subscribe("router:navigation:processing", function (params) {
                _this._logger.debug("Processing: " + params.instruction.config.name);
            });
            this._eventAggregator.subscribe("router:navigation:complete", function (params) {
                _this._logger.debug("Complete: " + params.instruction.config.name);
                _this._pageService.addOrUpdateLastVisitedPage(params.instruction.fragment);
                threading_1.Threading.delay(function () {
                    _this.handleScrollEvent();
                    if (params.instruction.config.name === "settings" && params.instruction.queryParams.isSignOff) {
                        // because we can complete a job and then end-of-day all whilst looking at a job-details page, a race
                        //  condition exists whereby "job state change" handlers will fire off, hit the jobCacheService.getJob()
                        //  but the end-of-day process has cleared the job store.  The getJob() calls then throw exceptions as
                        //  the requested job no longer exists.  So we only clear down the job store when we have end-of-dayed and
                        //  and navigated away from job detasil page (therefore disposing all of the handler subscriptions)
                        _this._jobCacheService.clearJobsToDo();
                        _this._jobCacheService.clearWorkListJobs();
                        _this._jobCacheService.getPartsCollections();
                    }
                }, 1000);
            });
            this._eventAggregator.subscribe(jobServiceConstants_1.JobServiceConstants.JOB_COMPLETION_REFRESH, function (canNavigate) {
                if (canNavigate) {
                    _this.router.navigate("/customers");
                }
            });
            this._eventAggregator.subscribe(appConstants_1.AppConstants.APP_SAVING, function () {
                var currentInstruction = _this.router.currentInstruction;
                var viewPorts = currentInstruction && currentInstruction.router.viewPorts;
                var element = viewPorts && viewPorts.default && viewPorts.default.element;
                if (element) {
                    var viewState = element.children[0];
                    if (viewState) {
                        var firstDiv = viewState.children[0];
                        if (firstDiv) {
                            _this.saveOffsetTop = firstDiv.clientHeight - element.scrollTop;
                        }
                    }
                }
                if (!!_this.saving) {
                    if (_this._savingTimeout) {
                        threading_1.Threading.stopDelay(_this._savingTimeout);
                    }
                }
                else {
                    _this.saving = true;
                }
                _this._savingTimeout = threading_1.Threading.delay(function () {
                    _this.saving = false;
                }, 900);
            });
            this.isInitialised = false;
            this.appInitViewModel = aurelia_dependency_injection_1.Container.instance.get(appInit_1.AppInit);
            this.enableLogJobOnEverySave();
        }
        App_1 = App;
        App.requiresSimulation = function (configurationService) {
            return endpointHelper_1.EndpointHelper.appRequiresSimulation(configurationService, [
                "fftServiceEndpoint",
                "whoAmIServiceEndpoint",
                "adaptServiceEndpoint",
                "assetTrackingEndpoint"
            ]);
        };
        App.prototype.activate = function () {
            var _this = this;
            // badge updates for van stock, consumables
            this._notificationService.initRouterBadgeEventSubs();
            this._eventAggregator.subscribe(soundConstants_1.SoundConstants.NOTIFICATION_SOUND, function (rings) {
                if (rings === void 0) { rings = 1; }
                return __awaiter(_this, void 0, void 0, function () {
                    var settings;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this._storage.getAppSettings()];
                            case 1:
                                settings = _a.sent();
                                if (!(settings && settings.soundEnabled)) return [3 /*break*/, 3];
                                return [4 /*yield*/, this._soundService.playBell(rings)];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            });
            return this.checkForSimulation();
        };
        App.prototype.configureRouter = function (routerConfiguration, router) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var routes, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.router = router;
                            routerConfiguration.title = this._configurationService.getConfiguration().applicationTitle || "EWB";
                            routes = [];
                            _a = this;
                            return [4 /*yield*/, this._storage.userSettingsComplete()];
                        case 1:
                            _a._defaultLandingPage = (_b.sent()) ? "customers" : "settings";
                            routes = routes.concat(this.getAppRoutes());
                            routerConfiguration.map(routes);
                            router.ensureConfigured().then(function () {
                                return _this._notificationService.updateInitialRouterBadgeCounts();
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        App.prototype.handleScrollEvent = function () {
            var target = this.router.viewPorts && this.router.viewPorts.default && this.router.viewPorts.default.element;
            this.isScrolledBottom = (target.scrollTop + 50) >= (target.scrollHeight - target.offsetHeight);
        };
        App.prototype.getAppRoutes = function () {
            var consumablesLabel = "Consumables";
            var consumableIcon = "hema-icon-parts-basket";
            var isAssetTracked = this._featureToggleService.isAssetTrackingEnabled();
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
                    settings: { icon: "icon-contact", hasBadge: true, badgeCount: 0, showCount: true }
                },
                {
                    route: "consumables",
                    name: "consumables",
                    moduleId: "hema/presentation/modules/parts/consumablesMain",
                    nav: true,
                    title: consumablesLabel,
                    settings: { icon: consumableIcon, hasBadge: true, badgeCount: 0, showCount: false }
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
        };
        App.prototype.checkForSimulation = function () {
            var simulationCounts = App_1.requiresSimulation(this._configurationService);
            if (simulationCounts.simulatedRoutes > 0) {
                /* Load scenario data for simulation use */
                var scenarioLoader = aurelia_dependency_injection_1.Container.instance.get(scenarioLoader_1.ScenarioLoader);
                if (scenarioLoader) {
                    var trainingConfig = this._configurationService.getConfiguration();
                    var isTrainingMode = trainingConfig && trainingConfig.trainingMode;
                    return scenarioLoader.initialise(isTrainingMode ? "trainingScenarios" : null);
                }
                else {
                    return Promise.resolve();
                }
            }
            else {
                return Promise.resolve();
            }
        };
        App.prototype.handleError = function (exception) {
            this._logger.error(exception && exception.toString());
            var toastItem = {
                id: guid_1.Guid.newGuid(),
                title: "Error",
                content: "An unhandled fault has been detected in the application",
                toastAction: { details: exception && exception.toString() },
                style: "danger",
                dismissTime: 0
            };
            this._eventAggregator.publish(appConstants_1.AppConstants.APP_TOAST_ADDED, toastItem);
        };
        App.prototype.enableLogJobOnEverySave = function () {
            var _this = this;
            if (this._configurationService.getConfiguration().logJobOnEverySave) {
                this._eventAggregator.subscribe("router:navigation:complete", function (params) { return __awaiter(_this, void 0, void 0, function () {
                    var activeJob, loggableJob, thisRoute, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                return [4 /*yield*/, this._engineerService.isWorking()];
                            case 1:
                                if (!(_a.sent())) {
                                    return [2 /*return*/];
                                }
                                return [4 /*yield*/, this._jobCacheService.getJobsToDo()];
                            case 2:
                                activeJob = ((_a.sent()) || [])
                                    .find(function (job) { return job_1.Job.isActive(job); });
                                if (!activeJob) {
                                    return [2 /*return*/];
                                }
                                loggableJob = this._jobLoggingHelper.prepareLoggableJob(activeJob);
                                thisRoute = params
                                    && params.instruction
                                    && params.instruction.params
                                    && params.instruction.params.childRoute;
                                this._logger.warn("Job saved:", thisRoute, loggableJob);
                                return [3 /*break*/, 4];
                            case 3:
                                error_1 = _a.sent();
                                this._logger.warn("Job saved:", "Error trying to log job", error_1);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
            }
        };
        App = App_1 = __decorate([
            aurelia_framework_1.inject(configurationService_1.ConfigurationService, aurelia_event_aggregator_1.EventAggregator, engineerService_1.EngineerService, storageService_1.StorageService, about_1.About, jobCacheService_1.JobCacheService, jobLoggingHelper_1.JobLoggingHelper, pageService_1.PageService, featureToggleService_1.FeatureToggleService, fftService_1.FftService, vanStockService_1.VanStockService, soundService_1.SoundService, notificationService_1.NotificationService),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator, Object, Object, about_1.About, Object, jobLoggingHelper_1.JobLoggingHelper, Object, Object, Object, Object, Object, Object])
        ], App);
        return App;
        var App_1;
    }());
    exports.App = App;
});

//# sourceMappingURL=app.js.map
