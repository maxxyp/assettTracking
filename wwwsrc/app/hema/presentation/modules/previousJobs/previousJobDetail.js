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
define(["require", "exports", "aurelia-dependency-injection", "aurelia-router", "../../../business/services/jobService", "../../models/baseViewModel", "../../../business/services/labelService", "../../factories/previousJobsFactory", "aurelia-event-aggregator", "aurelia-dialog", "../../../../common/ui/services/animationService"], function (require, exports, aurelia_dependency_injection_1, aurelia_router_1, jobService_1, baseViewModel_1, labelService_1, previousJobsFactory_1, aurelia_event_aggregator_1, aurelia_dialog_1, animationService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PreviousJobDetail = /** @class */ (function (_super) {
        __extends(PreviousJobDetail, _super);
        function PreviousJobDetail(jobService, previousJobsFactory, labelService, eventAggregator, dialogService, animationService, router) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this._animationService = animationService;
            _this.tasks = [];
            _this.previousJobs = [];
            _this._jobService = jobService;
            _this._previousJobsFactory = previousJobsFactory;
            _this._router = router;
            return _this;
        }
        PreviousJobDetail.prototype.activateAsync = function (params) {
            var _this = this;
            return this._jobService.getJob(params.jobId).then(function (job) {
                _this.job = job;
                if (_this.job && _this.job.history && _this.job.history.tasks) {
                    _this.tasks = _this.job.history.tasks;
                    _this.previousJobs = [];
                    _this._previousJobsFactory.createPreviousJobsViewModel(_this.job)
                        .then(function (previousJobs) {
                        _this.previousJobs = previousJobs;
                        _this.previousJobViewModel = _this.previousJobs.find(function (j) { return j.id === params.previousJobId; });
                        _this.previousJobIds = _this.previousJobs.map(function (pj) { return pj.id; });
                        _this._itemPosition = _this.previousJobs.map(function (x) { return x.id; }).indexOf(params.previousJobId);
                    });
                }
                _this.showContent();
            });
        };
        PreviousJobDetail.prototype.swipeFunction = function (swipeDirection) {
            var _this = this;
            if (swipeDirection === "left") {
                this._animationService.swipe(this.card, this.previousJobs, this._itemPosition, swipeDirection, "slide-in-right", "slide-out-left", 300).then(function (position) {
                    _this._router.parent.navigate(_this._router.parent.currentInstruction.fragment.replace(_this.previousJobs[_this._itemPosition].id, _this.previousJobs[position].id));
                    _this._itemPosition = position;
                })
                    .catch();
            }
            else {
                this._animationService.swipe(this.card, this.previousJobs, this._itemPosition, swipeDirection, "slide-in-left", "slide-out-right", 300).then(function (position) {
                    _this._router.parent.navigate(_this._router.parent.currentInstruction.fragment.replace(_this.previousJobs[_this._itemPosition].id, _this.previousJobs[position].id));
                    _this._itemPosition = position;
                })
                    .catch();
            }
        };
        PreviousJobDetail = __decorate([
            aurelia_dependency_injection_1.inject(jobService_1.JobService, previousJobsFactory_1.PreviousJobsFactory, labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, animationService_1.AnimationService, aurelia_router_1.Router),
            __metadata("design:paramtypes", [Object, Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, aurelia_router_1.Router])
        ], PreviousJobDetail);
        return PreviousJobDetail;
    }(baseViewModel_1.BaseViewModel));
    exports.PreviousJobDetail = PreviousJobDetail;
});

//# sourceMappingURL=previousJobDetail.js.map
