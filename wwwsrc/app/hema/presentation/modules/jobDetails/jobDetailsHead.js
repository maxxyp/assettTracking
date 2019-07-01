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
define(["require", "exports", "aurelia-dependency-injection", "aurelia-router", "aurelia-pal", "../../../business/services/jobService", "../../../business/models/job", "aurelia-event-aggregator", "moment", "../../../../common/core/threading", "../../models/baseViewModel", "../../../business/services/labelService", "../../../business/models/jobState", "../notice/notice", "aurelia-dialog", "../../../business/services/constants/jobServiceConstants", "../landlord/landlordDetail", "../../../../common/core/services/configurationService", "../../../../common/core/guid", "../../../../appConstants", "../../../business/services/catalogService", "../../../business/services/bridgeBusinessService", "../../../business/services/customerInfoService"], function (require, exports, aurelia_dependency_injection_1, aurelia_router_1, aurelia_pal_1, jobService_1, job_1, aurelia_event_aggregator_1, moment, threading_1, baseViewModel_1, labelService_1, jobState_1, notice_1, aurelia_dialog_1, jobServiceConstants_1, landlordDetail_1, configurationService_1, guid_1, appConstants_1, catalogService_1, bridgeBusinessService_1, customerInfoService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JobDetailsHead = /** @class */ (function (_super) {
        __extends(JobDetailsHead, _super);
        function JobDetailsHead(labelService, jobService, eventAggregator, dialogService, router, configurationService, catalogService, adaptBusinessService, customerInfoService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this._jobService = jobService;
            _this._dialogService = dialogService;
            _this._router = router;
            _this._configurationService = configurationService;
            _this._adaptBusinessService = adaptBusinessService;
            _this._customerInfoService = customerInfoService;
            _this.startTime = null;
            _this.elapsedTime = -1;
            _this._timerId = -1;
            _this.isActiveJob = false;
            _this.isDone = false;
            _this.trainingMode = false;
            _this.landlordDialogOpen = false;
            _this._catalogService = catalogService;
            _this._subscriptions = [];
            return _this;
        }
        JobDetailsHead.prototype.attachedAsync = function () {
            var _this = this;
            this._subscriptions.push(this._eventAggregator.subscribe(jobServiceConstants_1.JobServiceConstants.JOB_STATE_CHANGED, function () {
                _this.updateState();
                _this.showNotices();
                _this.showChirpCodeWarning();
            }));
            this._subscriptions.push(this._eventAggregator.subscribe(jobServiceConstants_1.JobServiceConstants.JOB_DATA_STATE_CHANGED, function () { return _this.updateRiskIndicator(); }));
            this._timerId = threading_1.Threading.startTimer(function () { return _this.updateState(); }, 10 * 1000);
            if (this.viewModel) {
                this.viewModel.viewCount++;
            }
            this.trainingMode = !!this._configurationService
                .getConfiguration()
                .trainingMode;
            return Promise.resolve();
        };
        JobDetailsHead.prototype.detachedAsync = function () {
            if (this._timerId !== -1) {
                threading_1.Threading.stopTimer(this._timerId);
                this._timerId = -1;
            }
            this._subscriptions.forEach(function (subscription) { return subscription.dispose(); });
            this._subscriptions = null;
            return Promise.resolve();
        };
        JobDetailsHead.prototype.activateAsync = function (params) {
            var _this = this;
            if (params.jobSummary) {
                this.job = params.job;
                this.viewModel = params.jobSummary;
                this.clickable = params.clickable;
                this.updateState();
                this.updateRiskIndicator();
            }
            return this._catalogService.getIaciCode().then(function (iaciCodes) {
                _this._iaciCodes = iaciCodes;
            });
        };
        JobDetailsHead.prototype.headerClicked = function () {
            if (this.clickable) {
                var routeName = this.job.state === jobState_1.JobState.done ? "doneJob" : "job";
                this._router.navigateToRoute(routeName, { jobId: this.viewModel.jobNumber });
            }
        };
        JobDetailsHead.prototype.navigateToAppointmentBooking = function (event) {
            this._router.navigate("/customers/to-do/" + this.job.id + "/appointment/book-an-appointment");
            this.dispatchClickEvent(event);
        };
        JobDetailsHead.prototype.showRisks = function (jobId, event) {
            this._dialogService.open({ viewModel: notice_1.Notice, model: { jobId: jobId } });
            this.dispatchClickEvent(event);
        };
        JobDetailsHead.prototype.showLandlordDetails = function (jobId, event) {
            this._dialogService.open({ viewModel: landlordDetail_1.LandlordDetail, model: { jobId: jobId } });
            this.dispatchClickEvent(event);
        };
        JobDetailsHead.prototype.launchCustomerInfo = function (event) {
            this._customerInfoService.openApp(this.job.premises.id);
            this.dispatchClickEvent(event);
        };
        JobDetailsHead.prototype.exportCustomerDetails = function (event, jobId) {
            var _this = this;
            this.dispatchClickEvent(event);
            return this._adaptBusinessService.exportCustomerDetails(jobId, false).then(function () {
                return _this.showInfo("Exported data", "Successfully exported customer details");
            });
        };
        JobDetailsHead.prototype.showNotices = function () {
            var _this = this;
            this._jobService.getJob(this.viewModel.jobNumber)
                .then(function (job) {
                if (job.state === jobState_1.JobState.enRoute && job.risks && job.risks.length > 0) {
                    _this.showRisks(_this.viewModel.jobNumber, null);
                }
            });
        };
        JobDetailsHead.prototype.updateState = function () {
            if (this.job) {
                this.jobState = jobState_1.JobState[this.job.state];
                this.isActiveJob = this.job.state === jobState_1.JobState.arrived;
                this.isDone = this.job.state === jobState_1.JobState.done;
                if (this.isActiveJob) {
                    this.startTime = this.job.onsiteTime;
                    var endTime = this.job.completionTime;
                    if (this.startTime) {
                        if (endTime) {
                            this.elapsedTime = moment(endTime).diff(moment(this.startTime), "minutes");
                        }
                        else {
                            this.elapsedTime = moment(new Date()).diff(moment(this.startTime), "minutes");
                        }
                        if (this.elapsedTime < 5) {
                            this.elapsedTime = 0;
                        }
                        else {
                            this.elapsedTime = Math.ceil(Math.max(this.elapsedTime, 1) / 5) * 5;
                        }
                    }
                    else {
                        this.startTime = null;
                        this.elapsedTime = -1;
                    }
                }
                else {
                    this.startTime = null;
                    this.elapsedTime = -1;
                }
            }
        };
        JobDetailsHead.prototype.updateRiskIndicator = function () {
            if (this.job) {
                var hasHazardAndRisk = job_1.Job.hasHazardAndRisk(this.job);
                this.safetyStatusCssClass = hasHazardAndRisk.hasHazard
                    ? "critical"
                    : hasHazardAndRisk.hasRisk
                        ? "alert"
                        : null;
            }
        };
        JobDetailsHead.prototype.showChirpCodeWarning = function () {
            var _this = this;
            if (this.job) {
                this.jobState = jobState_1.JobState[this.job.state];
                if (this.job.state === jobState_1.JobState.arrived) {
                    var chirpCodes = this.previousChirpCode();
                    if (chirpCodes) {
                        chirpCodes.forEach(function (code) {
                            if (code) {
                                var iaciDescription = _this._iaciCodes.find(function (x) { return x.iaciCode === code.code; });
                                if (iaciDescription) {
                                    var toastItem = {
                                        id: guid_1.Guid.newGuid(),
                                        title: _this.getLabel("previousChirpCodeWarningTitle"),
                                        content: _this.getParameterisedLabel("previousChirpCodeWarning", [iaciDescription.iaciDescription, code.applinace.applianceType, code.applinace.locationDescription]),
                                        style: "warning",
                                        dismissTime: 0
                                    };
                                    _this._eventAggregator.publish(appConstants_1.AppConstants.APP_TOAST_ADDED, toastItem);
                                }
                            }
                        });
                    }
                }
            }
        };
        JobDetailsHead.prototype.previousChirpCode = function () {
            var codes = [];
            if (this.job && this.job.history && this.job.history.appliances) {
                this.job.history.appliances.forEach(function (appliance) {
                    if (appliance && appliance.preVisitChirpCode) {
                        codes.push({ code: appliance.preVisitChirpCode.code, applinace: appliance });
                    }
                });
            }
            return codes;
        };
        JobDetailsHead.prototype.dispatchClickEvent = function (event) {
            if (event !== null) {
                event.stopPropagation();
                aurelia_pal_1.DOM.dispatchEvent(new Event("click"));
            }
        };
        JobDetailsHead = __decorate([
            aurelia_dependency_injection_1.inject(labelService_1.LabelService, jobService_1.JobService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, aurelia_router_1.Router, configurationService_1.ConfigurationService, catalogService_1.CatalogService, bridgeBusinessService_1.BridgeBusinessService, customerInfoService_1.CustomerInfoService),
            __metadata("design:paramtypes", [Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService,
                aurelia_router_1.Router, Object, Object, Object, Object])
        ], JobDetailsHead);
        return JobDetailsHead;
    }(baseViewModel_1.BaseViewModel));
    exports.JobDetailsHead = JobDetailsHead;
});

//# sourceMappingURL=jobDetailsHead.js.map
