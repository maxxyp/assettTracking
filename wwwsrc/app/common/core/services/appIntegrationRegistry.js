var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "../guid", "aurelia-dependency-injection", "./uriSchemeService", "./appLauncher"], function (require, exports, guid_1, aurelia_dependency_injection_1, uriSchemeService_1, appLauncher_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CUSTOMER_TIPS_COMPLETE = "customerTipsComplete";
    var CUSTOMER_INFO_NAVIGATE_PREMISES_ID = "customerinfo://premises/{premisesId}";
    var BOILER_EFFICIENCY_GUIDE_NAVIGATE_GC_CODE = "boilerefficiencyguide://{gcCode}";
    var EWB_COMMAND_NOTIFY_CUSTOMER_TIPS_URI = "hema://command/" + CUSTOMER_TIPS_COMPLETE;
    var AppIntegrationRegistry = /** @class */ (function () {
        function AppIntegrationRegistry(uriSchemeService, appLauncher) {
            var _this = this;
            this.boilerEfficiencyGuide = {
                navigateTo: {
                    gcCode: function (gcCode, options) {
                        _this._appLauncher.launch(BOILER_EFFICIENCY_GUIDE_NAVIGATE_GC_CODE, {
                            gcCode: gcCode
                        }, options);
                    }
                }
            };
            this.customerInfo = {
                navigateTo: {
                    premises: function (premisesId, options) {
                        _this._appLauncher.launch(CUSTOMER_INFO_NAVIGATE_PREMISES_ID, {
                            premisesId: premisesId
                        });
                    }
                },
                subscribe: {
                    customerTipsComplete: function (callback) {
                        return _this.createCommandSubscription(CUSTOMER_TIPS_COMPLETE, function (args) { return callback(args.premisesId); });
                    }
                }
            };
            this.engineerWorkBench = {
                notify: {
                    customerTipsComplete: function (premisesId) {
                        _this._appLauncher.launch(EWB_COMMAND_NOTIFY_CUSTOMER_TIPS_URI, {
                            "?premisesId": premisesId
                        });
                    }
                }
            };
            this._uriSchemeService = uriSchemeService;
            this._appLauncher = appLauncher;
            this._handlers = [];
            this._uriSchemeService.subscribe(function (command) {
                var handlers = _this._handlers.filter(function (x) { return x.command === command.methodName; });
                handlers.forEach(function (handler) { return handler.handler(command.args); });
            });
        }
        AppIntegrationRegistry.prototype.createCommandSubscription = function (command, callback) {
            var _this = this;
            var token = guid_1.Guid.newGuid();
            this._handlers.push({
                token: token,
                command: command,
                handler: callback
            });
            return {
                dispose: function () { return _this.unSubscribe(token); }
            };
        };
        AppIntegrationRegistry.prototype.unSubscribe = function (token) {
            this._handlers = this._handlers.filter(function (x) { return x.token !== token; });
        };
        AppIntegrationRegistry = __decorate([
            aurelia_dependency_injection_1.inject(uriSchemeService_1.UriSchemeService, appLauncher_1.AppLauncher),
            __metadata("design:paramtypes", [Object, Object])
        ], AppIntegrationRegistry);
        return AppIntegrationRegistry;
    }());
    exports.AppIntegrationRegistry = AppIntegrationRegistry;
});

//# sourceMappingURL=appIntegrationRegistry.js.map
