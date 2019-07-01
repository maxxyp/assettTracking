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
define(["require", "exports", "aurelia-dependency-injection", "../../models/baseViewModel", "../../../business/services/labelService", "aurelia-event-aggregator", "aurelia-dialog", "../../../business/services/constants/workRetrievalServiceConstants", "../../../business/services/workRetrievalTracker"], function (require, exports, aurelia_dependency_injection_1, baseViewModel_1, labelService_1, aurelia_event_aggregator_1, aurelia_dialog_1, workRetrievalServiceConstants_1, workRetrievalTracker_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JobApiFailureItem = /** @class */ (function (_super) {
        __extends(JobApiFailureItem, _super);
        function JobApiFailureItem(labelService, eventAggregator, dialogService, tracker) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this.tracker = tracker;
            return _this;
        }
        JobApiFailureItem.prototype.activateAsync = function (jobApiFailure) {
            this.jobApiFailure = jobApiFailure;
            return Promise.resolve();
        };
        JobApiFailureItem.prototype.refreshJobList = function () {
            this._eventAggregator.publish(workRetrievalServiceConstants_1.WorkRetrievalServiceConstants.REFRESH_WORK_LIST);
        };
        JobApiFailureItem.prototype.detachedAsync = function () {
            return Promise.resolve();
        };
        JobApiFailureItem = __decorate([
            aurelia_dependency_injection_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, workRetrievalTracker_1.WorkRetrievalTracker),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService,
                workRetrievalTracker_1.WorkRetrievalTracker])
        ], JobApiFailureItem);
        return JobApiFailureItem;
    }(baseViewModel_1.BaseViewModel));
    exports.JobApiFailureItem = JobApiFailureItem;
});

//# sourceMappingURL=jobApiFailureItem.js.map
