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
define(["require", "exports", "aurelia-dependency-injection", "../../models/baseViewModel", "../../factories/jobSummaryFactory", "../../../business/services/labelService", "aurelia-event-aggregator", "../../../business/models/jobState", "aurelia-dialog", "../../../business/services/constants/jobServiceConstants"], function (require, exports, aurelia_dependency_injection_1, baseViewModel_1, jobSummaryFactory_1, labelService_1, aurelia_event_aggregator_1, jobState_1, aurelia_dialog_1, jobServiceConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JobItem = /** @class */ (function (_super) {
        __extends(JobItem, _super);
        function JobItem(labelService, jobSummaryFactory, eventAggregator, dialogService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this._jobSummaryFactory = jobSummaryFactory;
            return _this;
        }
        JobItem.prototype.activateAsync = function (job) {
            var _this = this;
            this.job = job;
            this.jobSummaryViewModel = this._jobSummaryFactory.createJobSummaryViewModel(job);
            this._subscription = this._eventAggregator.subscribe(jobServiceConstants_1.JobServiceConstants.JOB_STATE_CHANGED, function () { return _this.updateState(); });
            this.updateState();
            return Promise.resolve();
        };
        JobItem.prototype.detachedAsync = function () {
            if (this._subscription) {
                this._subscription.dispose();
                this._subscription = null;
            }
            return Promise.resolve();
        };
        JobItem.prototype.updateState = function () {
            this.isDone = this.job.state === jobState_1.JobState.done;
        };
        JobItem = __decorate([
            aurelia_dependency_injection_1.inject(labelService_1.LabelService, jobSummaryFactory_1.JobSummaryFactory, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService),
            __metadata("design:paramtypes", [Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService])
        ], JobItem);
        return JobItem;
    }(baseViewModel_1.BaseViewModel));
    exports.JobItem = JobItem;
});

//# sourceMappingURL=jobItem.js.map
