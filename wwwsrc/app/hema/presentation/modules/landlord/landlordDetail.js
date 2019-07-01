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
define(["require", "exports", "../../models/baseViewModel", "../../../business/services/labelService", "aurelia-dependency-injection", "aurelia-dialog", "aurelia-event-aggregator", "../../../business/services/jobService"], function (require, exports, baseViewModel_1, labelService_1, aurelia_dependency_injection_1, aurelia_dialog_1, aurelia_event_aggregator_1, jobService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LandlordDetail = /** @class */ (function (_super) {
        __extends(LandlordDetail, _super);
        function LandlordDetail(labelService, eventAggregator, dialogService, jobService, controller) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this._jobService = jobService;
            _this.controller = controller;
            _this.contact = null;
            return _this;
        }
        LandlordDetail.prototype.activateAsync = function (params) {
            var _this = this;
            this.jobId = params.jobId;
            return this._jobService.getJob(params.jobId).then(function (job) {
                _this.contact = job.customerContact;
                _this.showContent();
            });
        };
        LandlordDetail = __decorate([
            aurelia_dependency_injection_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, jobService_1.JobService, aurelia_dialog_1.DialogController),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, aurelia_dialog_1.DialogController])
        ], LandlordDetail);
        return LandlordDetail;
    }(baseViewModel_1.BaseViewModel));
    exports.LandlordDetail = LandlordDetail;
});

//# sourceMappingURL=landlordDetail.js.map
