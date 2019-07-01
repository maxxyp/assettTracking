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
define(["require", "exports", "aurelia-dependency-injection", "../../../business/services/jobService", "../../../business/services/labelService", "aurelia-event-aggregator", "../../../business/models/dataState", "../../../business/services/catalogService", "../../../business/services/businessRuleService", "../../../business/services/validationService", "../../models/editableViewModel", "../../../business/services/engineerService", "aurelia-dialog", "../../../business/services/constants/jobServiceConstants", "../../../business/models/dataStateSummary", "../../services/pageService", "../../../../common/core/objectHelper"], function (require, exports, aurelia_dependency_injection_1, jobService_1, labelService_1, aurelia_event_aggregator_1, dataState_1, catalogService_1, businessRuleService_1, validationService_1, editableViewModel_1, engineerService_1, aurelia_dialog_1, jobServiceConstants_1, dataStateSummary_1, pageService_1, objectHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PartsMain = /** @class */ (function (_super) {
        __extends(PartsMain, _super);
        function PartsMain(labelService, jobService, engineerService, eventAggregator, dialogService, validationService, businessRuleService, catalogService, pageService) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService) || this;
            _this.isFullScreen = window.isFullScreen;
            _this._pageService = pageService;
            return _this;
        }
        PartsMain.prototype.configureRouter = function (config, childRouter) {
            this.router = childRouter;
            this.setupChildRoutes();
            config.map(this._childRoutes);
        };
        PartsMain.prototype.activateAsync = function (params) {
            var _this = this;
            return this.load()
                .then(function () { return _this.showContent(); });
        };
        PartsMain.prototype.deactivateAsync = function () {
            if (this._jobDataStateSubscription) {
                this._jobDataStateSubscription.dispose();
                this._jobDataStateSubscription = null;
            }
            return Promise.resolve();
        };
        PartsMain.prototype.navigateToRoute = function (name) {
            this.router.navigateToRoute(name);
        };
        PartsMain.prototype.stateChanged = function () {
            var _this = this;
            return _super.prototype.stateChanged.call(this)
                .then(function () {
                if (!_this.canEdit) {
                    _this.router.navigateToRoute("previously-fitted-parts");
                }
                _this._childRoutes.find(function (config) { return config.name === "consumables-favourites"; }).settings.alwaysShow = _this.canEdit;
            });
        };
        PartsMain.prototype.loadModel = function () {
            var _this = this;
            this._jobDataStateSubscription = this._eventAggregator.subscribe(jobServiceConstants_1.JobServiceConstants.JOB_DATA_STATE_CHANGED, function () { return _this.updateDataState(); });
            this.updateDataState();
            return Promise.resolve();
        };
        PartsMain.prototype.getRedirectRoute = function () {
            var landingPage = this._pageService.getLastVisitedPage(objectHelper_1.ObjectHelper.getClassName(this));
            return landingPage || "todays-parts";
        };
        PartsMain.prototype.setupChildRoutes = function () {
            this._childRoutes = [{
                    route: "",
                    redirect: this.getRedirectRoute()
                }];
            this._childRoutes.push({
                route: "todays-parts",
                moduleId: "hema/presentation/modules/parts/todaysParts",
                name: "todays-parts",
                nav: true,
                title: "Today's Parts",
                settings: {
                    tabGroupParent: "parts",
                    dataState: dataState_1.DataState.dontCare,
                    alwaysShow: true
                }
            });
            this._childRoutes.push({
                route: "parts-basket",
                moduleId: "hema/presentation/modules/parts/partsBasket",
                name: "parts-basket",
                nav: true,
                title: "Parts Basket",
                settings: {
                    tabGroupParent: "parts",
                    dataState: dataState_1.DataState.dontCare,
                    alwaysShow: true
                }
            });
            this._childRoutes.push({
                route: "previously-fitted-parts",
                moduleId: "hema/presentation/modules/parts/previouslyFittedParts",
                name: "previously-fitted-parts",
                nav: true,
                title: "Previously Fitted Parts",
                settings: {
                    tabGroupParent: "parts",
                    dataState: dataState_1.DataState.dontCare,
                    alwaysShow: true
                }
            });
            this._childRoutes.push({
                route: "consumables-favourites",
                moduleId: "hema/presentation/modules/parts/consumablesFavourites",
                name: "consumables-favourites",
                nav: true,
                title: "Favourites",
                settings: {
                    dataState: dataState_1.DataState.dontCare,
                    alwaysShow: this.canEdit
                }
            });
        };
        PartsMain.prototype.updateDataState = function () {
            var isActivitiesOverride = dataStateSummary_1.DataStateSummary.dataStateCompletionOverrideGroup === "activities";
            var partsBasketRoute = this._childRoutes.find(function (r) { return r.route === "parts-basket"; });
            var todaysPartsRoute = this._childRoutes.find(function (r) { return r.route === "todays-parts"; });
            if (isActivitiesOverride) {
                partsBasketRoute.settings.dataState = dataState_1.DataState.dontCare;
                todaysPartsRoute.settings.dataState = dataState_1.DataState.dontCare;
            }
            else {
                this._jobService.getJob(this.jobId)
                    .then(function (job) {
                    if (job) {
                        partsBasketRoute.settings.dataState = job.partsDetail && job.partsDetail.partsBasket
                            ? job.partsDetail.partsBasket.dataState
                            : dataState_1.DataState.dontCare;
                        todaysPartsRoute.settings.dataState = job.partsDetail && job.partsDetail.partsToday
                            ? job.partsDetail.partsToday.dataState
                            : dataState_1.DataState.dontCare;
                    }
                });
            }
        };
        PartsMain = __decorate([
            aurelia_dependency_injection_1.inject(labelService_1.LabelService, jobService_1.JobService, engineerService_1.EngineerService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService, pageService_1.PageService),
            __metadata("design:paramtypes", [Object, Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, Object, Object])
        ], PartsMain);
        return PartsMain;
    }(editableViewModel_1.EditableViewModel));
    exports.PartsMain = PartsMain;
});

//# sourceMappingURL=partsMain.js.map
