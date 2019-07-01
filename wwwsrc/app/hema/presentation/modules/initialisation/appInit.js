/// <reference path="../../../../../typings/app.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
define(["require", "exports", "aurelia-framework", "aurelia-dialog", "../../models/baseViewModel", "../../../business/services/referenceDataService", "aurelia-event-aggregator", "../../../business/constants/initialisationEventConstants", "../../../business/services/bridgeBusinessService", "../../../business/services/engineerService", "../../../business/services/workRetrievalService", "../../../../common/core/services/configurationService", "../../../business/services/storageService", "../../../../common/core/platformHelper", "../../../../common/core/services/deviceService", "../../../api/services/fftHeaderProvider", "../../../business/services/archiveService", "../../../business/services/messageService", "../../../../common/analytics/analytics", "../../../../common/ui/elements/models/toastPosition", "../../../business/services/catalogService", "../../../../common/core/models/baseException", "../../../../common/analytics/analyticsExceptionModel", "../../../business/services/constants/catalogConstants", "../../../../common/core/objectHelper", "../../../business/services/authenticationService", "../../../business/services/featureToggleService", "../../../business/services/vanStockEngine", "../../../core/windowHelper", "../../../../appConstants", "../../../../common/core/guid", "../../../../common/storage/indexedDatabaseService", "../../../../common/core/httpHelper", "../../../../common/core/logHelper", "../../../../common/geo/geoHelper", "../../../../common/core/services/appLauncher"], function (require, exports, aurelia_framework_1, aurelia_dialog_1, baseViewModel_1, referenceDataService_1, aurelia_event_aggregator_1, initialisationEventConstants_1, bridgeBusinessService_1, engineerService_1, workRetrievalService_1, configurationService_1, storageService_1, platformHelper_1, deviceService_1, fftHeaderProvider_1, archiveService_1, messageService_1, analytics_1, toastPosition_1, catalogService_1, baseException_1, analyticsExceptionModel_1, catalogConstants_1, objectHelper_1, authenticationService_1, featureToggleService_1, vanStockEngine_1, windowHelper_1, appConstants_1, guid_1, indexedDatabaseService_1, httpHelper_1, logHelper_1, geoHelper_1, appLauncher_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NOTIFICATION_DISPLAY_TIME = 5;
    var NOTIFICATION_DISPLAY_POSITION = toastPosition_1.ToastPosition.bottomcenter;
    var DROPDOWN_TYPE = 1;
    var MIN_ITEMS_CATEGORISE_SMASH_BUTTONS = -1;
    var SOUND_ENABLED = false;
    var LOCATION_SETTINGS_URI = "ms-settings:privacy-location";
    var AppInit = /** @class */ (function (_super) {
        __extends(AppInit, _super);
        function AppInit(referenceDataService, eventAggregator, dialogService, adaptBusinessService, engineerService, workRetrievalService, configurationService, storageService, deviceService, fftHeaderProvider, archiveService, messageService, analyticsService, catalogService, engineerAuthentication, indexedDatabaseService, featureToggleService, vanStockEngine, httpHelper, appLauncher) {
            var _this = 
            /* We cant use the labelservice as this is the appinit which populates the label service data */
            _super.call(this, null, eventAggregator, dialogService) || this;
            _this._referenceDataService = referenceDataService;
            _this._adaptBusinessService = adaptBusinessService;
            _this._engineerService = engineerService;
            _this._workRetrievalService = workRetrievalService;
            _this._configurationService = configurationService;
            _this._storageService = storageService;
            _this._deviceService = deviceService;
            _this._fftHeaderProvider = fftHeaderProvider;
            _this._archiveService = archiveService;
            _this._messageService = messageService;
            _this._analyticsService = analyticsService;
            _this._catalogService = catalogService;
            _this._engineerAuthentication = engineerAuthentication;
            _this._featureToggleService = featureToggleService;
            _this._vanStockEngine = vanStockEngine;
            _this.showReferenceDataRetryDiv = false;
            _this._indexedDatabaseService = indexedDatabaseService;
            _this._httpHelper = httpHelper;
            _this._appLauncher = appLauncher;
            return _this;
        }
        AppInit.prototype.attachedAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.appVersion = platformHelper_1.PlatformHelper.appVersion;
                            this.buildType = platformHelper_1.PlatformHelper.buildType;
                            this._logger.debug("Application is being initialised", [{
                                    appVersion: this.appVersion,
                                    buildType: this.buildType
                                }]);
                            this._subscription1 = this._eventAggregator.subscribe(initialisationEventConstants_1.InitialisationEventConstants.INITIALISE_CATEGORY, function (initCategory) {
                                _this.category = initCategory.category;
                                _this.item = initCategory.item;
                                _this.progressMax = Math.max(initCategory.progressMax, 0);
                                _this.progressValue = 0;
                            });
                            this._subscription2 = this._eventAggregator.subscribe(initialisationEventConstants_1.InitialisationEventConstants.INITIALISE_UPDATE, function (initUpdate) {
                                _this.item = initUpdate.item;
                                _this.progressValue = Math.max(initUpdate.progressValue, 0);
                            });
                            return [4 /*yield*/, this.init()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        AppInit.prototype.detachedAsync = function () {
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
        };
        AppInit.prototype.retry = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this._logger.warn("appInit: Retry reference data. Attempting to re-launch app");
                    windowHelper_1.WindowHelper.reload();
                    return [2 /*return*/];
                });
            });
        };
        AppInit.prototype.ignore = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this._logger.warn("appInit: Retry ignored");
                    this.showReferenceDataRetryDiv = false;
                    return [2 /*return*/];
                });
            });
        };
        AppInit.prototype.openSettings = function () {
            this.showLocationNotification = false;
            this._appLauncher.launchApplication(LOCATION_SETTINGS_URI);
        };
        AppInit.prototype.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var nextCategory, engineer, isTrainingMode, authenticationResult, error_1, _a, delay_1, maxLogFileAgeDays, exception_1, analyticsModel;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            nextCategory = function (category) {
                                _this.category = category;
                                _this.item = "";
                                _this.progressMax = 0;
                                _this.progressValue = 0;
                            };
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 33, , 34]);
                            this.isAuthError = false;
                            this.error = undefined;
                            engineer = void 0;
                            isTrainingMode = this._configurationService.getConfiguration().trainingMode;
                            // this would setup listener for suspending and resuming event (fix for app crashing after came out of stand by)
                            this._httpHelper.intialise();
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 10, , 11]);
                            // authentication sequence
                            nextCategory("Checking Existing Logon");
                            return [4 /*yield*/, this._engineerService.getCurrentEngineer()];
                        case 3:
                            engineer = ((_b.sent()) || { isSignedOn: false });
                            nextCategory("Initialising Analytics");
                            return [4 /*yield*/, this._analyticsService.initialize(engineer.id, { trackNavigation: true })];
                        case 4:
                            _b.sent();
                            nextCategory("Authenticating User");
                            return [4 /*yield*/, this._engineerAuthentication.authenticate("Authenticating User", engineer.isSignedOn)];
                        case 5:
                            authenticationResult = _b.sent();
                            nextCategory("Authorising User");
                            return [4 /*yield*/, this._engineerService.initialise(authenticationResult.hasWhoAmISucceeded, authenticationResult.result)];
                        case 6:
                            _b.sent();
                            return [4 /*yield*/, this._engineerService.getCurrentEngineer()];
                        case 7:
                            engineer = _b.sent();
                            if (!!isTrainingMode) return [3 /*break*/, 9];
                            nextCategory("Checking User Details");
                            return [4 /*yield*/, this._engineerService.overrideEngineerId(engineer)];
                        case 8:
                            engineer = _b.sent();
                            _b.label = 9;
                        case 9: return [3 /*break*/, 11];
                        case 10:
                            error_1 = _b.sent();
                            this.isAuthError = true;
                            throw error_1;
                        case 11:
                            this._analyticsService.setUserId(engineer.id);
                            nextCategory("Initialising User Mode");
                            return [4 /*yield*/, this.initialiseTrainingMode(engineer)];
                        case 12:
                            _b.sent();
                            nextCategory("Initialising Static Headers");
                            return [4 /*yield*/, this.initialiseStaticRequestHeaders(engineer)];
                        case 13:
                            _b.sent();
                            nextCategory("Initialising Application Settings");
                            return [4 /*yield*/, this.initialiseApplicationSettings()];
                        case 14:
                            _b.sent();
                            nextCategory("Initialising Catalogs");
                            return [4 /*yield*/, this._referenceDataService.initialise()];
                        case 15:
                            _b.sent();
                            return [4 /*yield*/, this._storageService.getLastSuccessfulSyncTime()];
                        case 16:
                            if (!!(_b.sent())) return [3 /*break*/, 18];
                            this.showReferenceDataRetryDiv = true;
                            return [4 /*yield*/, this.checkIfIsRefDataRetryIngored()];
                        case 17:
                            _b.sent();
                            _b.label = 18;
                        case 18:
                            nextCategory("Overriding Application Settings");
                            return [4 /*yield*/, this.overrideApplicationSettings()];
                        case 19:
                            _b.sent();
                            nextCategory("Preloading Catalogs");
                            return [4 /*yield*/, this._catalogService.loadConsumables()];
                        case 20:
                            _b.sent();
                            nextCategory("Initialising Adapt Bridge");
                            return [4 /*yield*/, this._adaptBusinessService.initialise()];
                        case 21:
                            _b.sent();
                            nextCategory("Initialising Work Retrieval");
                            return [4 /*yield*/, this._workRetrievalService.initialise()];
                        case 22:
                            _b.sent();
                            // todo: remove migration code after version 7.3 is released
                            //  - (we need to move from indexedDb to localStorage cos indexedDb cannot be relied upon!)
                            nextCategory("Migrating Archives");
                            return [4 /*yield*/, this._archiveService.migrate(this._indexedDatabaseService)];
                        case 23:
                            _b.sent();
                            nextCategory("Initialising Archive");
                            return [4 /*yield*/, this._archiveService.initialise()];
                        case 24:
                            _b.sent();
                            nextCategory("Initialising Messages");
                            return [4 /*yield*/, this._messageService.initialise()];
                        case 25:
                            _b.sent();
                            nextCategory("Initialising Asset Tracking Feature Check");
                            return [4 /*yield*/, this._featureToggleService.initialise(engineer.id)];
                        case 26:
                            _b.sent();
                            nextCategory("Initialising Van Stock");
                            if (!this._featureToggleService.isAssetTrackingEnabled()) return [3 /*break*/, 31];
                            _a = this;
                            return [4 /*yield*/, geoHelper_1.GeoHelper.isLocationEnabled()];
                        case 27:
                            _a.showLocationNotification = !(_b.sent());
                            if (!this.showLocationNotification) return [3 /*break*/, 29];
                            this._logger.warn("appinit: Initialising Van Stock - Location service on this device is not turned on");
                            delay_1 = function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!this.showLocationNotification) {
                                                return [2 /*return*/];
                                            }
                                            return [4 /*yield*/, Promise.delay(1000)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, delay_1()];
                                    }
                                });
                            }); };
                            return [4 /*yield*/, delay_1()];
                        case 28:
                            _b.sent();
                            _b.label = 29;
                        case 29: return [4 /*yield*/, this._vanStockEngine.initialise(engineer.id)];
                        case 30:
                            _b.sent();
                            _b.label = 31;
                        case 31: return [4 /*yield*/, this._storageService.getLastSuccessfulSyncTime()];
                        case 32:
                            if (!(_b.sent())) {
                                this._eventAggregator.publish(appConstants_1.AppConstants.APP_TOAST_ADDED, {
                                    id: guid_1.Guid.newGuid(),
                                    title: "Reference Error",
                                    style: "warning",
                                    autoDismiss: false,
                                    content: "The reference data is not fully downloaded. Before you carry out work, we recommend you to tap on REMOVE CATALOG DATA button which" +
                                        " is under Support Operations section in settings page"
                                });
                            }
                            nextCategory("Clearing logs");
                            if (platformHelper_1.PlatformHelper.getPlatform() === "wua") {
                                maxLogFileAgeDays = this._configurationService.getConfiguration().maxLogFileAgeDays || 0;
                                if (maxLogFileAgeDays > 0) {
                                    logHelper_1.LogHelper.clearDownLogs(maxLogFileAgeDays);
                                }
                            }
                            this._eventAggregator.publish(initialisationEventConstants_1.InitialisationEventConstants.INITIALISED);
                            return [3 /*break*/, 34];
                        case 33:
                            exception_1 = _b.sent();
                            if (!exception_1) {
                                this.error = "We were unable to identify any additional details for the problem.";
                            }
                            else if (exception_1 instanceof baseException_1.BaseException) {
                                this.error = exception_1.resolvedMessage;
                            }
                            else {
                                this.error = exception_1.toString();
                            }
                            analyticsModel = new analyticsExceptionModel_1.AnalyticsExceptionModel("Application Intialisation: " + this.error);
                            this._logger.error(this.category, analyticsModel, exception_1 && exception_1.toString());
                            return [3 /*break*/, 34];
                        case 34: return [2 /*return*/];
                    }
                });
            });
        };
        AppInit.prototype.initialiseStaticRequestHeaders = function (engineer) {
            return __awaiter(this, void 0, void 0, function () {
                var headers, deviceId, deviceType, hemaConfiguration;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            headers = [];
                            return [4 /*yield*/, this._deviceService.getDeviceId()];
                        case 1:
                            deviceId = _a.sent();
                            return [4 /*yield*/, this._deviceService.getDeviceType()];
                        case 2:
                            deviceType = _a.sent();
                            hemaConfiguration = this._configurationService.getConfiguration();
                            if (hemaConfiguration) {
                                headers.push({ name: "organisation", value: hemaConfiguration.organisationId });
                                headers.push({ name: "applicationId", value: hemaConfiguration.applicationId });
                            }
                            headers.push({ name: "engineerId", value: engineer.id });
                            headers.push({ name: "deviceId", value: deviceId });
                            headers.push({ name: "deviceType", value: deviceType });
                            this._fftHeaderProvider.setStaticHeaders(headers);
                            return [2 /*return*/];
                    }
                });
            });
        };
        AppInit.prototype.initialiseApplicationSettings = function () {
            return __awaiter(this, void 0, void 0, function () {
                var defaultApplicationSettings, settings;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            defaultApplicationSettings = this._configurationService.getConfiguration();
                            return [4 /*yield*/, this._storageService.getAppSettings()];
                        case 1:
                            settings = _a.sent();
                            if (!settings) {
                                settings = {};
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
                            return [4 /*yield*/, this._storageService.setAppSettings(settings)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        AppInit.prototype.initialiseTrainingMode = function (engineer) {
            return __awaiter(this, void 0, void 0, function () {
                var config, isTrainingMode, simulationEngineerId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            config = this._configurationService.getConfiguration();
                            isTrainingMode = this._configurationService.getConfiguration().trainingMode;
                            if (!(isTrainingMode && config.whoAmIServiceEndpoint.routes.some(function (r) { return r.route === "whoAmI" && r.client === "prod"; }))) return [3 /*break*/, 3];
                            this.category = "Initialising Training mode";
                            return [4 /*yield*/, this._storageService.getSimulationEngineer()];
                        case 1:
                            simulationEngineerId = _a.sent();
                            if (!simulationEngineerId) return [3 /*break*/, 3];
                            engineer.id = simulationEngineerId;
                            return [4 /*yield*/, this._storageService.setEngineer(engineer)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            this._logger.warn("User Details", [engineer]);
                            return [2 /*return*/];
                    }
                });
            });
        };
        AppInit.prototype.overrideApplicationSettings = function () {
            return __awaiter(this, void 0, void 0, function () {
                var overrideSettings, overrideSettingsObject, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.SETTING, undefined, undefined)];
                        case 1:
                            overrideSettings = _a.sent();
                            if (overrideSettings && overrideSettings.length) {
                                overrideSettingsObject = objectHelper_1.ObjectHelper.keyValueArrayToObject(overrideSettings);
                                this._configurationService.overrideSettings(overrideSettingsObject);
                                this._logger.info("Application settings overridden", JSON.stringify(overrideSettingsObject));
                            }
                            else {
                                this._logger.info("Application settings not overridden");
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            err_1 = _a.sent();
                            this._logger.warn("Application settings not overridden because of error", err_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        AppInit.prototype.checkIfIsRefDataRetryIngored = function () {
            var _this = this;
            if (!this.showReferenceDataRetryDiv) {
                return Promise.resolve();
            }
            return Promise.delay(1000)
                .then(function () {
                return _this.checkIfIsRefDataRetryIngored();
            });
        };
        AppInit = __decorate([
            aurelia_framework_1.inject(referenceDataService_1.ReferenceDataService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, bridgeBusinessService_1.BridgeBusinessService, engineerService_1.EngineerService, workRetrievalService_1.WorkRetrievalService, configurationService_1.ConfigurationService, storageService_1.StorageService, deviceService_1.DeviceService, fftHeaderProvider_1.FftHeaderProvider, archiveService_1.ArchiveService, messageService_1.MessageService, analytics_1.Analytics, catalogService_1.CatalogService, authenticationService_1.AuthenticationService, indexedDatabaseService_1.IndexedDatabaseService, featureToggleService_1.FeatureToggleService, vanStockEngine_1.VanStockEngine, httpHelper_1.HttpHelper, appLauncher_1.AppLauncher),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
        ], AppInit);
        return AppInit;
    }(baseViewModel_1.BaseViewModel));
    exports.AppInit = AppInit;
});

//# sourceMappingURL=appInit.js.map
