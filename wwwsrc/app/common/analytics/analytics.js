var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "universal-ga", "aurelia-event-aggregator", "aurelia-framework", "../core/services/configurationService", "../core/services/appMetaDataService", "aurelia-logging", "./analyticsConstants", "./analyticsCustomDimentions", "../geo/gpsService"], function (require, exports, ga, aurelia_event_aggregator_1, aurelia_framework_1, configurationService_1, appMetaDataService_1, Logging, analyticsConstants_1, analyticsCustomDimentions_1, gpsService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Analytics = /** @class */ (function () {
        function Analytics(eventAggregator, configurationService, appMetaDataService, gpsService) {
            this._eventAggregator = eventAggregator;
            this._configurationService = configurationService;
            this._appMetaDataService = appMetaDataService;
            this._gpsService = gpsService;
            this._bootstrapped = false;
            this._logger = Logging.getLogger("Analytics");
        }
        Analytics.prototype.initialize = function (userId, opts) {
            var _this = this;
            this._config = this._configurationService.getConfiguration();
            if (this._config && this._config.analyticsEnabled) {
                return this._appMetaDataService.get()
                    .then(function (metaData) {
                    ga.initialize(_this._config.analyticsTrackingId, { debug: true });
                    // hack - fix issue when running as WUA app.
                    window.ga("set", "checkProtocolTask", function () { });
                    ga.set("appName", metaData.appName);
                    ga.set("appId", metaData.appId);
                    ga.set("appVersion", metaData.appVersion);
                    ga.set("appInstallerId", metaData.appInstallerId);
                    if (!!userId) {
                        ga.set(analyticsCustomDimentions_1.ENGINEER_ID_DIEMENTION4, userId);
                        _this.logGeoPosition();
                    }
                    _this._logger.debug("initalised.");
                    if (opts && !!opts.trackNavigation) {
                        _this.trackRouterNavigation(metaData);
                        _this._logger.debug("tracking router navigation.");
                    }
                    _this._eventAggregator.subscribe(analyticsConstants_1.AnalyticsConstants.ANALYTICS_EVENT, function (event) {
                        try {
                            if (event) {
                                ga.set(analyticsCustomDimentions_1.UNIQUE_ID_DIEMENTION7, Date.now() + "");
                                ga.event(event.category, event.action, {
                                    "eventLabel": event.label,
                                    "eventValue": event.metric
                                });
                            }
                        }
                        catch (_a) {
                            // do nothing
                        }
                    });
                    _this._bootstrapped = true;
                    _this._logger.info("bootstrapped.");
                })
                    .catch(function (err) {
                    _this._logger.debug(err);
                });
            }
            this._logger.info("No analytics configuration defined.");
            return Promise.resolve();
        };
        Analytics.prototype.setUserId = function (userId) {
            if (userId) {
                ga.set(analyticsCustomDimentions_1.ENGINEER_ID_DIEMENTION4, userId);
            }
        };
        Analytics.prototype.setCustomMetaData = function (data, customDimensionMap) {
            var hash = JSON.stringify(data);
            if (this._bootstrapped && hash !== this._lastCustomData) {
                this._lastCustomData = hash;
                Object.keys(customDimensionMap).map(function (mapKey) {
                    var mapKeyValue = customDimensionMap[mapKey];
                    var attribute = data && data[mapKey];
                    if (attribute) {
                        ga.set(mapKeyValue, attribute);
                    }
                });
            }
        };
        Analytics.prototype.exception = function (errorMessage, isFatal) {
            if (this._bootstrapped) {
                try {
                    ga.exception(errorMessage, isFatal);
                }
                catch (_a) {
                    // do nothing
                }
            }
        };
        Analytics.prototype.logGeoPosition = function () {
            try {
                if (this._config && this._config.analyticsEnabled && this._config.logGeoLocation) {
                    this._gpsService.getLocation().then(function (location) {
                        if (location && location.latitude && location.longitude) {
                            ga.set(analyticsCustomDimentions_1.ENGINEER_GEO_POSITION_DIEMENTION5, location.latitude + "," + location.longitude);
                        }
                    }).catch(function () { });
                }
            }
            catch (_a) {
                // do nothing
            }
        };
        Analytics.prototype.trackRouterNavigation = function (metaData) {
            this._eventAggregator.subscribe("router:navigation:complete", function (params) {
                var targetInstruction = (params.instruction.getAllInstructions() || []).splice(-1)[0];
                if (params && params.result && params.result && targetInstruction && targetInstruction.config && targetInstruction.config.name) {
                    ga.screenview(targetInstruction.config.name);
                }
            });
        };
        Analytics = __decorate([
            aurelia_framework_1.inject(aurelia_event_aggregator_1.EventAggregator, configurationService_1.ConfigurationService, appMetaDataService_1.AppMetaDataService, gpsService_1.GpsService),
            __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator, Object, Object, Object])
        ], Analytics);
        return Analytics;
    }());
    exports.Analytics = Analytics;
});

//# sourceMappingURL=analytics.js.map
