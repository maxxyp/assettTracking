/// <reference path="../../../../typings/app.d.ts" />
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
define(["require", "exports", "aurelia-framework", "../../../common/core/services/configurationService", "../../../common/resilience/services/resilientService", "aurelia-event-aggregator", "../../business/services/storageService", "../../../common/resilience/services/resilientHttpClientFactory", "../../../common/core/wuaNetworkDiagnostics"], function (require, exports, aurelia_framework_1, configurationService_1, resilientService_1, aurelia_event_aggregator_1, storageService_1, resilientHttpClientFactory_1, wuaNetworkDiagnostics_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WhoAmIService = /** @class */ (function (_super) {
        __extends(WhoAmIService, _super);
        function WhoAmIService(configurationService, storageService, eventAggregator, resilientClientFactory, wuaNetworkDiagnostics) {
            return _super.call(this, configurationService, "whoAmIServiceEndpoint", storageService, eventAggregator, undefined, resilientClientFactory, wuaNetworkDiagnostics) || this;
        }
        WhoAmIService.prototype.whoAmI = function (attributes, roles) {
            return this.getData("whoAmI", { "?attributes": attributes.join(","), "?roles": roles.join(",") });
        };
        WhoAmIService = __decorate([
            aurelia_framework_1.inject(configurationService_1.ConfigurationService, storageService_1.StorageService, aurelia_event_aggregator_1.EventAggregator, resilientHttpClientFactory_1.ResilientHttpClientFactory, wuaNetworkDiagnostics_1.WuaNetworkDiagnostics),
            __metadata("design:paramtypes", [Object, Object, aurelia_event_aggregator_1.EventAggregator, resilientHttpClientFactory_1.ResilientHttpClientFactory,
                wuaNetworkDiagnostics_1.WuaNetworkDiagnostics])
        ], WhoAmIService);
        return WhoAmIService;
    }(resilientService_1.ResilientService));
    exports.WhoAmIService = WhoAmIService;
});

//# sourceMappingURL=whoAmIService.js.map
