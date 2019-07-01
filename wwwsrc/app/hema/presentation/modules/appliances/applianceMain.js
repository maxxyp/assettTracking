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
define(["require", "exports", "aurelia-dependency-injection", "aurelia-router", "../../../business/services/jobService", "../../../business/services/labelService", "aurelia-event-aggregator", "../../../business/services/applianceService", "../../../business/models/dataState", "../../models/editableViewModel", "../../../business/services/catalogService", "../../../business/services/businessRuleService", "../../../business/services/validationService", "../../../business/services/engineerService", "../../../../common/core/guid", "aurelia-dialog", "../../../business/services/constants/jobServiceConstants", "../../../business/models/dataStateSummary", "../../constants/applianceDetailsConstants", "../../../../common/ui/services/animationService", "../../../../common/core/services/appLauncher", "../../../../common/core/services/configurationService", "aurelia-binding", "../../../business/models/applianceSafetyType", "../../services/pageService", "../../../../common/core/objectHelper"], function (require, exports, aurelia_dependency_injection_1, aurelia_router_1, jobService_1, labelService_1, aurelia_event_aggregator_1, applianceService_1, dataState_1, editableViewModel_1, catalogService_1, businessRuleService_1, validationService_1, engineerService_1, guid_1, aurelia_dialog_1, jobServiceConstants_1, dataStateSummary_1, applianceDetailsConstants_1, animationService_1, appLauncher_1, configurationService_1, aurelia_binding_1, applianceSafetyType_1, pageService_1, objectHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ApplianceMain = /** @class */ (function (_super) {
        __extends(ApplianceMain, _super);
        function ApplianceMain(labelService, jobService, engineerService, eventAggregator, dialogService, validationService, businessRuleService, catalogService, applianceService, animationService, appLauncher, configurationService, pageService) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService) || this;
            _this._applianceService = applianceService;
            _this._animationService = animationService;
            _this._appLauncher = appLauncher;
            _this._configurationService = configurationService;
            _this.isFullScreen = window.isFullScreen;
            _this._pageService = pageService;
            return _this;
        }
        ApplianceMain.prototype.configureRouter = function (config, childRouter) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            this.router = childRouter;
            this._landingPage = (args &&
                args.length >= 3 &&
                args[2] instanceof aurelia_router_1.NavigationInstruction &&
                args[2].params &&
                args[2].params.applianceId) ?
                this._pageService.getLastVisitedPage(objectHelper_1.ObjectHelper.getClassName(this), args[2].params.applianceId) || "appliance-details" :
                "appliance-details";
            this.setupChildRoutes();
            config.map(this._childRoutes);
        };
        ApplianceMain.prototype.activateAsync = function (params) {
            var _this = this;
            this._applianceId = params.applianceId;
            this.isNew = this._applianceId === guid_1.Guid.empty;
            return this.loadBusinessRules()
                .then(function () { return _this.load(); });
        };
        ApplianceMain.prototype.deactivateAsync = function () {
            if (this._jobDataStateSubscription) {
                this._jobDataStateSubscription.dispose();
                this._jobDataStateSubscription = null;
            }
            if (this._applianceDetailsSubscription) {
                this._applianceDetailsSubscription.dispose();
                this._applianceDetailsSubscription = null;
            }
            return Promise.resolve();
        };
        ApplianceMain.prototype.navigateToRoute = function (name) {
            this.router.navigateToRoute(name);
        };
        ApplianceMain.prototype.swipeFunction = function (swipeDirection) {
            var _this = this;
            if (this._itemPosition !== -1) {
                if (swipeDirection === "left") {
                    this._animationService.swipe(this.card, this.applianceIds, this._itemPosition, swipeDirection, "slide-in-right", "slide-out-left", 300).then(function (position) {
                        _this.router.parent.navigate(_this.router.parent.currentInstruction.fragment.replace(_this.applianceIds[_this._itemPosition], _this.applianceIds[position]));
                        _this._itemPosition = position;
                    })
                        .catch();
                }
                else {
                    this._animationService.swipe(this.card, this.applianceIds, this._itemPosition, swipeDirection, "slide-in-left", "slide-out-right", 300).then(function (position) {
                        _this.router.parent.navigate(_this.router.parent.currentInstruction.fragment.replace(_this.applianceIds[_this._itemPosition], _this.applianceIds[position]));
                        _this._itemPosition = position;
                    })
                        .catch();
                }
            }
        };
        ApplianceMain.prototype.launchAdapt = function (gcCode) {
            this._appLauncher.launchApplication(this._configurationService.getConfiguration().adaptLaunchUri + " " + gcCode);
        };
        ApplianceMain.prototype.stateChanged = function () {
            var _this = this;
            return _super.prototype.stateChanged.call(this)
                .then(function () {
                if (!_this.canEdit) {
                    _this.router.navigateToRoute("appliance-details");
                }
            });
        };
        ApplianceMain.prototype.loadModel = function () {
            var _this = this;
            return this._applianceService.getAppliances(this.jobId)
                .then(function (appliances) {
                _this.applianceIds = appliances.map(function (a) { return a.id; });
                _this.appliance = appliances.find(function (a) { return a.id === _this._applianceId; });
                if (_this.isNew) {
                    _this.description = "";
                    _this._itemPosition = -1;
                }
                else {
                    _this.applianceSafetyType = _this.appliance.applianceSafetyType;
                    _this.isInstPremAppliance = _this.appliance.isInstPremAppliance;
                    _this.applianceType = _this.appliance.applianceType;
                    _this.updateApplianceDetails(_this.appliance.description, _this.appliance.gcCode);
                    _this._itemPosition = _this.applianceIds.indexOf(_this.appliance.id);
                }
                _this._applianceDetailsSubscription = _this._eventAggregator.subscribe(applianceDetailsConstants_1.ApplianceDetailsConstants.DETAILS_CHANGED, function (arg) { return _this.updateApplianceDetails(arg.description, arg.gccode); });
                _this._jobDataStateSubscription = _this._eventAggregator.subscribe(jobServiceConstants_1.JobServiceConstants.JOB_DATA_STATE_CHANGED, function () { return _this.updateDataState(); });
                _this.updateDataState();
                _this.showContent();
                _this.scrollToTop();
            });
        };
        ApplianceMain.prototype.updateApplianceDetails = function (description, gccode) {
            var _this = this;
            return this._applianceService.isFullGcCode(gccode)
                .then(function (isFullGcCode) {
                _this.gcCode = isFullGcCode ? gccode : "";
                _this.description = description;
            });
        };
        ApplianceMain.prototype.setupChildRoutes = function () {
            this._childRoutes = [
                {
                    route: "",
                    redirect: this._landingPage
                },
                {
                    route: "appliance-details",
                    moduleId: "hema/presentation/modules/appliances/applianceDetails",
                    name: "appliance-details",
                    nav: true,
                    title: "Appliance Details",
                    settings: {
                        tabGroupParent: "appliances",
                        dataState: dataState_1.DataState.valid,
                        alwaysShow: true,
                        hideIfInstPrem: false
                    }
                },
                {
                    route: "reading",
                    moduleId: "hema/presentation/modules/appliances/applianceReading",
                    name: "reading",
                    nav: true,
                    title: "Appliance Reading",
                    settings: {
                        dataState: dataState_1.DataState.dontCare,
                        applianceSafetyType: applianceSafetyType_1.ApplianceSafetyType.gas,
                        hideIfInstPrem: true
                    }
                },
                {
                    route: "gas-safety",
                    moduleId: "hema/presentation/modules/appliances/gasSafety",
                    name: "gas-safety",
                    nav: true,
                    title: "Gas Safety",
                    settings: {
                        dataState: dataState_1.DataState.dontCare,
                        applianceSafetyType: applianceSafetyType_1.ApplianceSafetyType.gas,
                        hideIfInstPrem: true
                    }
                },
                {
                    route: "previous-gas-safety",
                    moduleId: "hema/presentation/modules/appliances/prevGasSafety",
                    name: "previous-gas-safety",
                    nav: true,
                    title: "Previous Unsafe Situation",
                    settings: {
                        dataState: dataState_1.DataState.dontCare,
                        applianceSafetyType: applianceSafetyType_1.ApplianceSafetyType.gas,
                        alwaysShow: true,
                        hideIfInstPrem: true
                    }
                },
                {
                    route: "electrical-safety",
                    moduleId: "hema/presentation/modules/appliances/electricalSafety",
                    name: "electrical-safety",
                    nav: true,
                    title: "Electrical Safety",
                    settings: {
                        dataState: dataState_1.DataState.valid,
                        applianceSafetyType: applianceSafetyType_1.ApplianceSafetyType.electrical,
                        hideIfInstPrem: true
                    }
                },
                {
                    route: "previous-electrical-unsafe-detail",
                    moduleId: "hema/presentation/modules/appliances/previousElectricalUnsafeDetail",
                    name: "previous-electrical-unsafe-detail",
                    nav: true,
                    title: "Previous Electrical Unsafe Detail",
                    settings: {
                        dataState: dataState_1.DataState.dontCare,
                        applianceSafetyType: applianceSafetyType_1.ApplianceSafetyType.electrical,
                        alwaysShow: true,
                        hideIfInstPrem: true
                    }
                },
                {
                    route: "other-safety",
                    moduleId: "hema/presentation/modules/appliances/otherSafety",
                    name: "other-safety",
                    nav: true,
                    title: "Other Safety",
                    settings: {
                        dataState: dataState_1.DataState.dontCare,
                        applianceSafetyType: applianceSafetyType_1.ApplianceSafetyType.other,
                        hideIfInstPrem: true
                    }
                },
                {
                    route: "previous-other-safety",
                    moduleId: "hema/presentation/modules/appliances/prevOtherSafety",
                    name: "previous-other-safety",
                    nav: true,
                    title: "Previous Unsafe Situation",
                    settings: {
                        dataState: dataState_1.DataState.dontCare,
                        applianceSafetyType: applianceSafetyType_1.ApplianceSafetyType.other,
                        alwaysShow: true,
                        hideIfInstPrem: true
                    }
                }
            ];
        };
        ApplianceMain.prototype.updateDataState = function () {
            var _this = this;
            if (this.isNew) {
                return null;
            }
            var isDataStateOverridden = dataStateSummary_1.DataStateSummary.dataStateCompletionOverrideGroup !== undefined;
            if (isDataStateOverridden) {
                this.router.routes
                    .filter(function (rt) { return !rt.redirect; })
                    .forEach(function (rt) { return rt.settings.dataState = dataState_1.DataState.dontCare; });
                return null;
            }
            return this._applianceService.getAppliance(this.jobId, this._applianceId)
                .then(function (appliance) {
                var applianceRoute = _this.router.routes.find(function (r) { return r.route === "appliance-details"; });
                applianceRoute.settings.dataState = appliance.dataState;
                if (_this.appliance.applianceSafetyType === applianceSafetyType_1.ApplianceSafetyType.electrical) {
                    var electricalApplianceSafetyRoute = _this.router.routes.find(function (r) { return r.route === "electrical-safety"; });
                    electricalApplianceSafetyRoute.settings.dataState = appliance.safety.applianceElectricalSafetyDetail.dataState;
                }
                else if (_this.appliance.applianceSafetyType === applianceSafetyType_1.ApplianceSafetyType.gas) {
                    var readingRoute = _this.router.routes.find(function (r) { return r.route === "reading"; });
                    readingRoute.settings.dataState = appliance.safety.applianceGasReadingsMaster.dataState;
                    var gasSafetyRoute = _this.router.routes.find(function (r) { return r.route === "gas-safety"; });
                    gasSafetyRoute.settings.dataState = appliance.safety.applianceGasSafety.dataState;
                }
                else if (_this.appliance.applianceSafetyType === applianceSafetyType_1.ApplianceSafetyType.other) {
                    var otherApplianceSafetyRoute = _this.router.routes.find(function (r) { return r.route === "other-safety"; });
                    otherApplianceSafetyRoute.settings.dataState = appliance.safety.applianceOtherSafety.dataState;
                }
            });
        };
        __decorate([
            aurelia_binding_1.observable(),
            __metadata("design:type", Number)
        ], ApplianceMain.prototype, "applianceSafetyType", void 0);
        __decorate([
            aurelia_binding_1.observable(),
            __metadata("design:type", Boolean)
        ], ApplianceMain.prototype, "isInstPremAppliance", void 0);
        ApplianceMain = __decorate([
            aurelia_dependency_injection_1.inject(labelService_1.LabelService, jobService_1.JobService, engineerService_1.EngineerService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService, applianceService_1.ApplianceService, animationService_1.AnimationService, appLauncher_1.AppLauncher, configurationService_1.ConfigurationService, pageService_1.PageService),
            __metadata("design:paramtypes", [Object, Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, Object, Object, Object, Object, Object, Object])
        ], ApplianceMain);
        return ApplianceMain;
    }(editableViewModel_1.EditableViewModel));
    exports.ApplianceMain = ApplianceMain;
});

//# sourceMappingURL=applianceMain.js.map
