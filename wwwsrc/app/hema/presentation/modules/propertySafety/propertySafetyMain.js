/// <reference path="./../../../../../typings/app.d.ts" />
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
define(["require", "exports", "aurelia-dependency-injection", "../../../business/services/jobService", "../../../business/models/propertySafetyType", "../../../business/services/labelService", "aurelia-event-aggregator", "../../../business/models/dataState", "../../../business/services/catalogService", "../../../business/services/businessRuleService", "../../../business/services/validationService", "../../models/editableViewModel", "../../../business/services/engineerService", "aurelia-dialog", "../../../business/services/constants/jobServiceConstants", "../../../business/models/dataStateSummary", "../../../business/models/jobState", "../../services/pageService", "../../../../common/core/objectHelper"], function (require, exports, aurelia_dependency_injection_1, jobService_1, propertySafetyType_1, labelService_1, aurelia_event_aggregator_1, dataState_1, catalogService_1, businessRuleService_1, validationService_1, editableViewModel_1, engineerService_1, aurelia_dialog_1, jobServiceConstants_1, dataStateSummary_1, jobState_1, pageService_1, objectHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PropertySafetyMain = /** @class */ (function (_super) {
        __extends(PropertySafetyMain, _super);
        function PropertySafetyMain(labelService, jobService, engineerService, eventAggregator, dialogService, validationService, businessRuleService, catalogService, pageService) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService) || this;
            _this.isFullScreen = window.isFullScreen;
            _this._pageService = pageService;
            return _this;
        }
        PropertySafetyMain.prototype.configureRouter = function (config, childRouter) {
            this.router = childRouter;
            this.setupChildRoutes();
            config.map(this._childRoutes);
        };
        PropertySafetyMain.prototype.activateAsync = function (params) {
            var _this = this;
            return this.load()
                .then(function () { return _this.showContent(); });
        };
        PropertySafetyMain.prototype.deactivateAsync = function () {
            if (this._jobDataStateSubscription) {
                this._jobDataStateSubscription.dispose();
                this._jobDataStateSubscription = null;
            }
            return Promise.resolve();
        };
        PropertySafetyMain.prototype.navigateToRoute = function (name) {
            this.router.navigateToRoute(name);
        };
        PropertySafetyMain.prototype.stateChanged = function () {
            var _this = this;
            return _super.prototype.stateChanged.call(this)
                .then(function () {
                _this.router.navigateToRoute((!_this.canEdit && _this._jobState !== jobState_1.JobState.done) ? "previous-detail" : _this.getRedirectRoute());
            });
        };
        PropertySafetyMain.prototype.loadModel = function () {
            var _this = this;
            return this._jobService.getJob(this.jobId)
                .then(function (job) {
                _this.propertySafetyType = job.propertySafetyType;
                _this._jobState = job.state;
                _this._jobDataStateSubscription = _this._eventAggregator.subscribe(jobServiceConstants_1.JobServiceConstants.JOB_DATA_STATE_CHANGED, function () { return _this.updateDataState(); });
                _this.updateDataState();
            });
        };
        PropertySafetyMain.prototype.getRedirectRoute = function () {
            var landingPage = this._pageService.getLastVisitedPage(objectHelper_1.ObjectHelper.getClassName(this));
            if (!landingPage) {
                switch (this.propertySafetyType) {
                    case propertySafetyType_1.PropertySafetyType.gas:
                        return "current-detail-gas";
                    case propertySafetyType_1.PropertySafetyType.electrical:
                        return "current-detail-electrical";
                    default:
                        return "previous-detail";
                }
            }
            return landingPage;
        };
        PropertySafetyMain.prototype.setupChildRoutes = function () {
            this._childRoutes = [];
            this._childRoutes.push({
                route: "current-detail-gas",
                moduleId: "hema/presentation/modules/propertySafety/gasSafetyDetail",
                name: "current-detail-gas",
                nav: true,
                title: "Property Safety Details",
                settings: {
                    tabGroupParent: "property-safety",
                    propertySafetyType: propertySafetyType_1.PropertySafetyType.gas,
                    dataState: dataState_1.DataState.dontCare
                }
            });
            this._childRoutes.push({
                route: "current-detail-electrical",
                moduleId: "hema/presentation/modules/propertySafety/electricalSafetyDetail",
                name: "current-detail-electrical",
                nav: true,
                title: "Property Safety Details",
                settings: {
                    tabGroupParent: "property-safety",
                    propertySafetyType: propertySafetyType_1.PropertySafetyType.electrical,
                    dataState: dataState_1.DataState.dontCare
                }
            });
            this._childRoutes.push({
                route: "",
                redirect: this.getRedirectRoute()
            });
            this._childRoutes.push({
                route: "previous-detail",
                moduleId: "hema/presentation/modules/propertySafety/previousSafetyDetail",
                name: "previous-detail",
                nav: true,
                title: "Previous Safety Detail",
                settings: {
                    tabGroupParent: "property-safety",
                    dataState: dataState_1.DataState.dontCare
                }
            });
        };
        PropertySafetyMain.prototype.updateDataState = function () {
            var _this = this;
            var isActivitiesOverride = dataStateSummary_1.DataStateSummary.dataStateCompletionOverrideGroup === "activities";
            if (isActivitiesOverride) {
                this._childRoutes
                    .filter(function (rt) { return !rt.redirect; })
                    .forEach(function (rt) { return rt.settings.dataState = dataState_1.DataState.dontCare; });
            }
            else {
                this._jobService.getJob(this.jobId)
                    .then(function (job) {
                    if (job) {
                        if (_this.propertySafetyType === propertySafetyType_1.PropertySafetyType.gas) {
                            var currentDetailRoute = _this._childRoutes.find(function (r) { return r.route === "current-detail-gas"; });
                            currentDetailRoute.settings.dataState = job.propertySafety &&
                                job.propertySafety.propertyGasSafetyDetail ?
                                job.propertySafety.propertyGasSafetyDetail.dataState : dataState_1.DataState.dontCare;
                        }
                        else if (_this.propertySafetyType === propertySafetyType_1.PropertySafetyType.electrical) {
                            var currentDetailRoute = _this._childRoutes.find(function (r) { return r.route === "current-detail-electrical"; });
                            currentDetailRoute.settings.dataState = job.propertySafety &&
                                job.propertySafety.propertyElectricalSafetyDetail ?
                                job.propertySafety.propertyElectricalSafetyDetail.dataState : dataState_1.DataState.dontCare;
                        }
                    }
                });
            }
        };
        PropertySafetyMain = __decorate([
            aurelia_dependency_injection_1.inject(labelService_1.LabelService, jobService_1.JobService, engineerService_1.EngineerService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService, pageService_1.PageService),
            __metadata("design:paramtypes", [Object, Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, Object, Object])
        ], PropertySafetyMain);
        return PropertySafetyMain;
    }(editableViewModel_1.EditableViewModel));
    exports.PropertySafetyMain = PropertySafetyMain;
});

//# sourceMappingURL=propertySafetyMain.js.map
