var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-event-aggregator", "./platformHelper", "aurelia-framework", "./constants/wuaNetworkDiagnosticsConstants"], function (require, exports, aurelia_event_aggregator_1, platformHelper_1, aurelia_framework_1, wuaNetworkDiagnosticsConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PRIVATE_NETWORK_STATUS_CHANGED = "networkstatuschanged";
    var WuaNetworkDiagnostics = /** @class */ (function () {
        function WuaNetworkDiagnostics(eventAggregator) {
            var _this = this;
            if (!platformHelper_1.PlatformHelper.isWua()) {
                this._isInternetConnected = true;
                return;
            }
            this._eventAggregator = eventAggregator;
            var setIsInternetConnected = function () {
                var connectionProfile = Windows.Networking.Connectivity.NetworkInformation.getInternetConnectionProfile();
                _this._isInternetConnected = !!(connectionProfile && (connectionProfile.isWlanConnectionProfile || connectionProfile.isWwanConnectionProfile));
            };
            Windows.Networking.Connectivity.NetworkInformation.addEventListener(PRIVATE_NETWORK_STATUS_CHANGED, function () {
                setIsInternetConnected();
                _this._eventAggregator.publish(wuaNetworkDiagnosticsConstants_1.WuaNetworkDiagnosticsConstants.NETWORK_STATUS_CHANGED, _this._isInternetConnected);
            });
            setIsInternetConnected();
        }
        WuaNetworkDiagnostics.prototype.isInternetConnected = function () {
            return !!this._isInternetConnected;
        };
        WuaNetworkDiagnostics.prototype.getDiagnostics = function () {
            if (!platformHelper_1.PlatformHelper.isWua()) {
                return {
                    connection: "not-uwp-platform"
                };
            }
            try {
                var connectionProfile = Windows.Networking.Connectivity.NetworkInformation.getInternetConnectionProfile();
                if (!connectionProfile) {
                    return {
                        connection: "no-connection-found"
                    };
                }
                var _a = Windows.Networking.Connectivity.NetworkConnectivityLevel, internetAccess = _a.internetAccess, localAccess = _a.localAccess, constrainedInternetAccess = _a.constrainedInternetAccess;
                var connectivityLevelId = connectionProfile.getNetworkConnectivityLevel();
                var connectivityLevel = void 0;
                switch (connectivityLevelId) {
                    case localAccess:
                        connectivityLevel = "Local Access";
                        break;
                    case constrainedInternetAccess:
                        connectivityLevel = "Constrained Internet Access";
                        break;
                    case internetAccess:
                        connectivityLevel = "Internet Access";
                        break;
                    default:
                        connectivityLevel = "Don't Know: " + connectivityLevelId;
                        break;
                }
                var _b = Windows.Networking.Connectivity.DomainConnectivityLevel, authenticated = _b.authenticated, unauthenticated = _b.unauthenticated;
                var domainConnectivityLevelValue = connectionProfile.getDomainConnectivityLevel();
                var domainConnectivityLevel = void 0;
                switch (domainConnectivityLevelValue) {
                    case authenticated:
                        domainConnectivityLevel = "authenticated";
                        break;
                    case unauthenticated:
                        domainConnectivityLevel = "unauthenticated";
                        break;
                    default:
                        domainConnectivityLevel = "Don't Know: " + domainConnectivityLevelValue;
                        break;
                }
                var result = {
                    connectivityLevel: connectivityLevel,
                    domainConnectivityLevel: domainConnectivityLevel,
                    connection: "none"
                };
                if (connectionProfile.isWlanConnectionProfile) {
                    var details = connectionProfile.wlanConnectionProfileDetails;
                    result = __assign({}, result, { connection: "wlan", ssid: details && details.getConnectedSsid() });
                }
                else if (connectionProfile.isWwanConnectionProfile) {
                    var details = connectionProfile.wwanConnectionProfileDetails;
                    var _c = Windows.Networking.Connectivity.WwanNetworkRegistrationState, none = _c.none, deregistered = _c.deregistered, searching = _c.searching, home = _c.home, roaming = _c.roaming, partner = _c.partner, denied = _c.denied;
                    var networkRegistrationStateId = details && details.getNetworkRegistrationState();
                    var networkRegistrationState = void 0;
                    switch (networkRegistrationStateId) {
                        case none:
                            networkRegistrationState = "None";
                            break;
                        case deregistered:
                            networkRegistrationState = "Deregeistered";
                            break;
                        case searching:
                            networkRegistrationState = "Searching";
                            break;
                        case home:
                            networkRegistrationState = "Home";
                            break;
                        case roaming:
                            networkRegistrationState = "Roaming";
                            break;
                        case partner:
                            networkRegistrationState = "Partner";
                            break;
                        case denied:
                            networkRegistrationState = "Denied";
                            break;
                        default:
                            networkRegistrationState = "Don't Know";
                    }
                    result = __assign({}, result, { connection: "wwan", signalBarsOf5: connectionProfile.getSignalBars(), accessPointName: details && details.accessPointName, homeProviderId: details && details.homeProviderId, networkRegistrationState: networkRegistrationState });
                }
                return result;
            }
            catch (error) {
                return {
                    connection: "diagnostic-error",
                    error: error && error.toString()
                };
            }
        };
        WuaNetworkDiagnostics = __decorate([
            aurelia_framework_1.inject(aurelia_event_aggregator_1.EventAggregator),
            __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator])
        ], WuaNetworkDiagnostics);
        return WuaNetworkDiagnostics;
    }());
    exports.WuaNetworkDiagnostics = WuaNetworkDiagnostics;
});

//# sourceMappingURL=wuaNetworkDiagnostics.js.map
