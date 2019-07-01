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
define(["require", "exports", "aurelia-dependency-injection", "aurelia-router", "../../models/baseViewModel", "../../../business/services/labelService", "aurelia-event-aggregator", "aurelia-dialog", "../../../business/models/jobState"], function (require, exports, aurelia_dependency_injection_1, aurelia_router_1, baseViewModel_1, labelService_1, aurelia_event_aggregator_1, aurelia_dialog_1, jobState_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JobSummary = /** @class */ (function (_super) {
        __extends(JobSummary, _super);
        function JobSummary(labelService, router, eventAggregator, dialogService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this._router = router;
            return _this;
        }
        JobSummary.prototype.activateAsync = function (jobSummary) {
            this.viewModel = jobSummary;
            return Promise.resolve();
        };
        JobSummary.prototype.attachedAsync = function () {
            if (this.viewModel) {
                this.viewModel.viewCount++;
            }
            return Promise.resolve();
        };
        JobSummary.prototype.navigateToDetails = function () {
            var routeName = this.viewModel.jobState === jobState_1.JobState.done ? "doneJob" : "job";
            this._router.navigateToRoute(routeName, { jobId: this.viewModel.jobNumber });
        };
        JobSummary = __decorate([
            aurelia_dependency_injection_1.inject(labelService_1.LabelService, aurelia_router_1.Router, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService),
            __metadata("design:paramtypes", [Object, aurelia_router_1.Router,
                aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService])
        ], JobSummary);
        return JobSummary;
    }(baseViewModel_1.BaseViewModel));
    exports.JobSummary = JobSummary;
});

//# sourceMappingURL=jobSummary.js.map
