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
define(["require", "exports", "aurelia-framework", "../../../common/resilience/services/resilientService", "./constants/fftServiceConstants", "../../../common/core/services/configurationService", "aurelia-event-aggregator", "./fftHeaderProvider", "../../business/services/storageService", "../../../common/resilience/services/resilientHttpClientFactory", "../../../common/core/wuaNetworkDiagnostics"], function (require, exports, aurelia_framework_1, resilientService_1, fftServiceConstants_1, configurationService_1, aurelia_event_aggregator_1, fftHeaderProvider_1, storageService_1, resilientHttpClientFactory_1, wuaNetworkDiagnostics_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FftService = /** @class */ (function (_super) {
        __extends(FftService, _super);
        function FftService(configurationService, storageService, eventAggregator, fftHeaderProvider, resilientClientFactory, wuaNetworkDiagnostics) {
            return _super.call(this, configurationService, fftServiceConstants_1.FftServiceConstants.ENDPOINT_CONFIGURATION, storageService, eventAggregator, fftHeaderProvider, resilientClientFactory, wuaNetworkDiagnostics) || this;
        }
        FftService.prototype.requestWork = function (engineerId) {
            // .NOT a resilient call - we want immediate feedback if this has not worked
            return this.putData("engineer_requestwork", { "engineerId": engineerId }, {});
        };
        FftService.prototype.getWorkList = function (engineerId, breakCache) {
            return this.getData("engineer_worklist", { "engineerId": engineerId }, breakCache)
                .then(function (response) { return response ? response : undefined; });
        };
        FftService.prototype.orderConsumables = function (engineerId, orderConsumablesRequest) {
            return this.putDataResilient(fftServiceConstants_1.FftServiceConstants.ORDER_CONSUMABLES_ROUTE, { "engineerId": engineerId }, orderConsumablesRequest);
        };
        FftService.prototype.getJob = function (jobId, breakCache) {
            return this.getData("job", { "jobId": jobId }, breakCache)
                .then(function (response) { return response && response.data ? response.data.job : undefined; });
        };
        FftService.prototype.updateJob = function (jobId, jobUpdateRequest) {
            return this.putDataResilient(fftServiceConstants_1.FftServiceConstants.JOB_UPDATE_ROUTE, { "jobId": jobId }, jobUpdateRequest);
        };
        FftService.prototype.jobStatusUpdate = function (jobId, jobStatusUpdateRequest) {
            return this.putDataResilient("job_status", { "jobId": jobId }, jobStatusUpdateRequest);
        };
        FftService.prototype.engineerStatusUpdate = function (engineerId, engineerStatusUpdateRequest) {
            return this.putDataResilient("engineer_status", { "engineerId": engineerId }, engineerStatusUpdateRequest);
        };
        FftService.prototype.engineerStatusUpdateEod = function (engineerId, engineerStatusUpdateRequest) {
            // .NOT a resilient call - if it fails the engineer cant sign off
            return this.putData("engineer_status_eod", { "engineerId": engineerId }, engineerStatusUpdateRequest);
        };
        FftService.prototype.getJobHistory = function (jobId, breakCache) {
            return this.getData("job_history", { "jobId": jobId }, breakCache)
                .then(function (response) { return response ? response.data : undefined; });
        };
        FftService.prototype.getRemoteReferenceDataIndex = function () {
            return this.getData("reference_index", null, true)
                .then(function (response) { return response && response.data && response.data.listObjects ? response.data.listObjects : undefined; });
        };
        FftService.prototype.getRemoteReferenceDataCatalog = function (catalogName) {
            return this.getData("reference_catalog", { "catalog": catalogName }, true)
                .then(function (response) { return response && response.meta && response.data ? response : undefined; });
        };
        FftService.prototype.updateRemoteReferenceData = function (referenceDataUpdateRequest) {
            return this.putDataResilient("reference_update", null, referenceDataUpdateRequest);
        };
        FftService.prototype.orderPartsForJob = function (jobId, partsOrderedRequest) {
            return this.putDataResilient(fftServiceConstants_1.FftServiceConstants.ORDER_PARTS_ROUTE, { "jobId": jobId }, partsOrderedRequest);
        };
        FftService.prototype.getPartsCollection = function (jobId, breakCache) {
            return this.getData("parts_collection", { "jobId": jobId }, breakCache)
                .then(function (response) { return response && response.data && response.data.list ? response : undefined; });
        };
        FftService.prototype.getAmIContractEngineerInfo = function (engineerId, breakCache) {
            return this.getData("contractor_info", { "engineerId": parseInt(engineerId, 10) }, breakCache)
                .then(function (response) { return response && response.data ? response.data : undefined; });
        };
        FftService = __decorate([
            aurelia_framework_1.inject(configurationService_1.ConfigurationService, storageService_1.StorageService, aurelia_event_aggregator_1.EventAggregator, fftHeaderProvider_1.FftHeaderProvider, resilientHttpClientFactory_1.ResilientHttpClientFactory, wuaNetworkDiagnostics_1.WuaNetworkDiagnostics),
            __metadata("design:paramtypes", [Object, Object, aurelia_event_aggregator_1.EventAggregator, Object, resilientHttpClientFactory_1.ResilientHttpClientFactory,
                wuaNetworkDiagnostics_1.WuaNetworkDiagnostics])
        ], FftService);
        return FftService;
    }(resilientService_1.ResilientService));
    exports.FftService = FftService;
});

//# sourceMappingURL=fftService.js.map
