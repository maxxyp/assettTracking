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
define(["require", "exports", "aurelia-dependency-injection", "../../../business/services/jobService", "aurelia-router", "../../factories/previousJobsFactory", "../../models/baseViewModel", "../../../business/services/labelService", "aurelia-event-aggregator", "aurelia-dialog"], function (require, exports, aurelia_dependency_injection_1, jobService_1, aurelia_router_1, previousJobsFactory_1, baseViewModel_1, labelService_1, aurelia_event_aggregator_1, aurelia_dialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PreviousJobs = /** @class */ (function (_super) {
        __extends(PreviousJobs, _super);
        function PreviousJobs(router, jobService, previousJobsFactory, labelService, eventAggregator, dialogService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this.tasks = [];
            _this.previousJobs = [];
            _this._router = router;
            _this._jobService = jobService;
            _this._previousJobsFactory = previousJobsFactory;
            _this.isFullScreen = window.isFullScreen;
            return _this;
        }
        PreviousJobs.prototype.activateAsync = function (params) {
            var _this = this;
            return this._jobService.getJob(params.jobId).then(function (job) {
                return _this._previousJobsFactory.createPreviousJobsViewModel(job)
                    .then(function (previousJobs) {
                    _this.previousJobs = previousJobs;
                    _this.showContent();
                });
            });
        };
        PreviousJobs.prototype.navigateToPreviousJob = function (id) {
            this._router.navigateToRoute("previous-job", { previousJobId: id });
        };
        PreviousJobs = __decorate([
            aurelia_dependency_injection_1.inject(aurelia_router_1.Router, jobService_1.JobService, previousJobsFactory_1.PreviousJobsFactory, labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService),
            __metadata("design:paramtypes", [aurelia_router_1.Router, Object, Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService])
        ], PreviousJobs);
        return PreviousJobs;
    }(baseViewModel_1.BaseViewModel));
    exports.PreviousJobs = PreviousJobs;
});

//# sourceMappingURL=previousJobs.js.map
