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
define(["require", "exports", "aurelia-dependency-injection", "../../../business/services/jobService", "../../../business/models/job", "../../models/baseViewModel", "../../../business/services/labelService", "../../../business/models/jobState", "aurelia-event-aggregator", "../../../business/models/dataState", "../../../business/services/engineerService", "aurelia-dialog", "../../../business/services/constants/engineerServiceConstants", "../../../business/services/constants/jobServiceConstants", "../../factories/jobSummaryFactory", "../../../business/services/charge/chargeService", "../../../business/services/constants/chargeServiceConstants"], function (require, exports, aurelia_dependency_injection_1, jobService_1, job_1, baseViewModel_1, labelService_1, jobState_1, aurelia_event_aggregator_1, dataState_1, engineerService_1, aurelia_dialog_1, engineerServiceConstants_1, jobServiceConstants_1, jobSummaryFactory_1, chargeService_1, chargeServiceConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JobDetails = /** @class */ (function (_super) {
        __extends(JobDetails, _super);
        function JobDetails(jobService, jobSummaryFactory, engineerService, labelService, eventAggregator, dialogService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this._jobService = jobService;
            _this._jobSummaryFactory = jobSummaryFactory;
            _this._engineerService = engineerService;
            _this._subscriptions = [];
            return _this;
        }
        JobDetails.prototype.configureRouter = function (config, childRouter) {
            this.router = childRouter;
            config.map(this.getJobChildRoutes());
        };
        JobDetails.prototype.activateAsync = function (params) {
            var _this = this;
            return this._jobService.getJob(params.jobId)
                .then(function (job) {
                _this.job = job;
                _this.jobSummaryViewModel = _this._jobSummaryFactory.createJobSummaryViewModel(_this.job);
                _this._subscriptions.push(_this._eventAggregator.subscribe(jobServiceConstants_1.JobServiceConstants.JOB_STATE_CHANGED, function () { return _this.updateDataState(); }));
                _this._subscriptions.push(_this._eventAggregator.subscribe(jobServiceConstants_1.JobServiceConstants.JOB_DATA_STATE_CHANGED, function () { return _this.updateDataState(); }));
                _this._subscriptions.push(_this._eventAggregator.subscribe(engineerServiceConstants_1.EngineerServiceConstants.ENGINEER_WORKING_CHANGED, function () { return _this.updateDataState(); }));
                _this._subscriptions.push(_this._eventAggregator.subscribe(chargeServiceConstants_1.ChargeServiceConstants.CHARGE_UPDATE_COMPLETED, function () { return chargeService_1.ChargeService.showHideChargeRoute(job, _this.router); }));
                _this.updateRiskIndicators();
                // adding dynamic routes like this because in edge it doesnt work in line
                _this.addDynamicRoutes();
                _this.updateDataState();
            })
                .then(function () { return _this.showContent(); });
        };
        JobDetails.prototype.deactivateAsync = function () {
            this._subscriptions.forEach(function (s) { return s.dispose(); });
            this._subscriptions = [];
            return Promise.resolve();
        };
        JobDetails.prototype.navigateToJob = function () {
            var routeName = this.job.state === jobState_1.JobState.done ? "doneJob" : "job";
            this.router.navigateToRoute(routeName, { jobId: this.job.id });
        };
        JobDetails.prototype.getJobChildRoutes = function () {
            return [
                {
                    route: "",
                    redirect: "risks"
                },
                {
                    route: "risks",
                    moduleId: "hema/presentation/modules/risks/risks",
                    name: "risks",
                    nav: true,
                    title: "Risks",
                    settings: {}
                },
                {
                    route: "property-safety",
                    moduleId: "hema/presentation/modules/propertySafety/propertySafetyMain",
                    name: "property-safety",
                    nav: true,
                    title: "Property Safety",
                    settings: {}
                },
                {
                    route: "risks/:riskId",
                    moduleId: "hema/presentation/modules/risks/riskMain",
                    name: "risk",
                    nav: false,
                    title: "Risk",
                    settings: {
                        tabGroupParent: "risks",
                    }
                },
                {
                    route: "appliances",
                    moduleId: "hema/presentation/modules/appliances/appliances",
                    name: "appliances",
                    nav: true,
                    title: "Appliances",
                    settings: {}
                },
                {
                    route: "appliances/:applianceId",
                    moduleId: "hema/presentation/modules/appliances/applianceMain",
                    name: "appliance",
                    nav: false,
                    title: "Appliance",
                    settings: { tabGroupParent: "appliances" }
                },
                {
                    route: "activities",
                    moduleId: "hema/presentation/modules/tasks/tasks",
                    name: "activities",
                    nav: true,
                    title: "Activities",
                    settings: {
                        canEditCancelledJob: true
                    }
                },
                {
                    route: "activities/:taskId",
                    moduleId: "hema/presentation/modules/tasks/taskMain",
                    name: "activity",
                    nav: false,
                    title: "Activity",
                    settings: { tabGroupParent: "activities" }
                },
                {
                    route: "task-appliance/:jobId",
                    moduleId: "hema/presentation/modules/tasks/taskAppliance",
                    name: "task-appliance",
                    nav: false,
                    title: "Activity Appliance",
                    settings: {
                        tabGroupParent: "activities",
                        canEditCancelledJob: true
                    }
                },
                {
                    route: "parts",
                    moduleId: "hema/presentation/modules/parts/partsMain",
                    name: "parts",
                    nav: true,
                    title: "Parts",
                    settings: {
                        tabGroupParent: "parts"
                    }
                },
                {
                    route: "charges",
                    moduleId: "hema/presentation/modules/charges/charges",
                    name: "charges",
                    nav: true,
                    title: "Charges",
                    settings: {
                        visible: false
                    }
                },
                {
                    route: "appointment",
                    name: "appointmentMain",
                    moduleId: "hema/presentation/modules/appointment/appointmentBookingMain",
                    nav: false,
                    title: "Book an Appointment",
                    settings: {}
                },
                {
                    route: "landlord-certificate",
                    moduleId: "hema/presentation/modules/landlord/certificate/landlordSafetyCertificate",
                    name: "landlord-certificate",
                    nav: true,
                    title: "Certificate",
                    settings: {}
                }
            ];
        };
        JobDetails.prototype.addDynamicRoutes = function () {
            this.addPreviousJobsRoutes();
            chargeService_1.ChargeService.showHideChargeRoute(this.job, this.router);
        };
        JobDetails.prototype.addPreviousJobsRoutes = function () {
            var _this = this;
            var previousJobsRoutes = [{
                    route: "previous-jobs",
                    moduleId: "hema/presentation/modules/previousJobs/previousJobs",
                    name: "previous-jobs",
                    nav: true,
                    title: "Previous Activities",
                    settings: {}
                },
                {
                    route: "previous-jobs/:previousJobId",
                    moduleId: "hema/presentation/modules/previousJobs/previousJobDetail",
                    name: "previous-job",
                    nav: false,
                    title: "Previous Activities",
                    settings: { tabGroupParent: "previous-jobs" }
                }];
            previousJobsRoutes.forEach(function (route) { return _this.router.addRoute(route); });
        };
        JobDetails.prototype.updateDataState = function () {
            var _this = this;
            this._engineerService.isWorking()
                .then(function (isWorking) {
                if (isWorking) {
                    _this.updateRiskIndicators();
                    _this._jobService.getDataStateSummary(_this.job.id)
                        .then(function (dataStateSummary) {
                        if (dataStateSummary) {
                            _this._jobService.getJobState(_this.job.id).then(function (state) {
                                _this.updateRouterState("activities", dataStateSummary, state.value);
                                _this.updateRouterState("property-safety", dataStateSummary, state.value);
                                _this.updateRouterState("risks", dataStateSummary, state.value);
                                _this.updateRouterState("appliances", dataStateSummary, state.value);
                                _this.updateRouterState("previous-jobs", dataStateSummary, state.value);
                                _this.updateRouterState("parts", dataStateSummary, state.value);
                                _this.updateRouterState("charges", dataStateSummary, state.value);
                                // special case: we take certificate dataState as the combination of
                                //  propertySafety and appliances
                                _this.updateCertificateState(dataStateSummary, state.value);
                            });
                        }
                    });
                }
            });
        };
        JobDetails.prototype.updateRouterState = function (configName, dataStateSummary, jobState) {
            var navModel = this.router.navigation.find(function (n) { return n.config.name === configName; });
            if (navModel) {
                var dataState = this.getRouteState(configName, dataStateSummary, jobState);
                var cssClass = this.getCssClassFromState(dataState);
                navModel.settings.stateClass = cssClass;
            }
        };
        JobDetails.prototype.updateCertificateState = function (dataStateSummary, jobState) {
            var navModel = this.router.navigation.find(function (n) { return n.config.name === "landlord-certificate"; });
            if (navModel) {
                navModel.settings.visible = this.job.isLandlordJob;
                var propertySafetyDataState = this.getRouteState("property-safety", dataStateSummary, jobState);
                var appliancesDataState = this.getRouteState("appliances", dataStateSummary, jobState);
                var dataState = this.getWorstCaseDataState(propertySafetyDataState, appliancesDataState);
                var cssClass = this.getCssClassFromState(dataState);
                navModel.settings.stateClass = cssClass;
            }
        };
        JobDetails.prototype.updateRiskIndicators = function () {
            if (this.job) {
                var propertySafetyNav = this.router.navigation.find(function (n) { return n.config.name === "property-safety"; });
                if (this.job.propertySafety && this.job.propertySafety.previousPropertySafetyDetail) {
                    propertySafetyNav.settings.riskType = "critical";
                }
                var risksNav = this.router.navigation.find(function (n) { return n.config.name === "risks"; });
                if (risksNav) {
                    var existsHazardAndRisk = job_1.Job.hasHazardAndRisk(this.job);
                    risksNav.settings.riskType = existsHazardAndRisk.hasHazard ? "critical" : existsHazardAndRisk.hasRisk ? "alert" : null;
                }
                var appliancesNav = this.router.navigation.find(function (n) { return n.config.name === "appliances"; });
                if (appliancesNav) {
                    var hasUnSafe = this.job.history.appliances
                        && this.job.history.appliances.some(function (a) { return !a.isDeleted
                            && !a.isExcluded
                            && a.safety
                            && a.safety.previousApplianceUnsafeDetail
                            && a.safety.previousApplianceUnsafeDetail.noticeType !== undefined; });
                    appliancesNav.settings.riskType = hasUnSafe ? "alert" : null;
                }
            }
        };
        JobDetails.prototype.getRouteState = function (configName, dataStateSummary, jobState) {
            if (jobState === jobState_1.JobState.arrived) {
                var dataStateTotals = dataStateSummary.getTotals(configName);
                if (dataStateTotals) {
                    if (dataStateTotals.invalid > 0) {
                        return dataState_1.DataState.invalid;
                    }
                    else if (dataStateTotals.notVisited > 0) {
                        return dataState_1.DataState.notVisited;
                    }
                    else if (dataStateTotals.dontCare > 0 && dataStateTotals.valid === 0) {
                        return dataState_1.DataState.dontCare;
                    }
                    else {
                        return dataState_1.DataState.valid;
                    }
                }
                else {
                    return dataState_1.DataState.dontCare;
                }
            }
            else {
                return dataState_1.DataState.dontCare;
            }
        };
        JobDetails.prototype.getCssClassFromState = function (dataState) {
            switch (dataState) {
                case dataState_1.DataState.valid:
                    return "state-valid";
                case dataState_1.DataState.notVisited:
                    return "state-not-visited";
                case dataState_1.DataState.invalid:
                    return "state-invalid";
                case dataState_1.DataState.dontCare:
                    return "state-dont-care";
                default:
                    return "state-none";
            }
        };
        JobDetails.prototype.getWorstCaseDataState = function () {
            var dataStates = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                dataStates[_i] = arguments[_i];
            }
            if (dataStates.some(function (state) { return state === dataState_1.DataState.invalid; })) {
                return dataState_1.DataState.invalid;
            }
            if (dataStates.some(function (state) { return state === dataState_1.DataState.notVisited; })) {
                return dataState_1.DataState.notVisited;
            }
            if (dataStates.some(function (state) { return state === dataState_1.DataState.valid; })) {
                return dataState_1.DataState.valid;
            }
            return dataState_1.DataState.dontCare;
        };
        JobDetails = __decorate([
            aurelia_dependency_injection_1.inject(jobService_1.JobService, jobSummaryFactory_1.JobSummaryFactory, engineerService_1.EngineerService, labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService),
            __metadata("design:paramtypes", [Object, Object, Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService])
        ], JobDetails);
        return JobDetails;
    }(baseViewModel_1.BaseViewModel));
    exports.JobDetails = JobDetails;
});

//# sourceMappingURL=jobDetails.js.map
