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
define(["require", "exports", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "../../models/editableViewModel", "aurelia-dialog", "../../../business/services/constants/catalogConstants", "../../../business/models/yesNoNa", "../../../business/services/jobService", "../../../business/services/engineerService", "../../../business/services/labelService", "../../../business/services/applianceService", "../../../business/services/validationService", "../../../business/services/businessRuleService", "../../../business/services/catalogService", "../../factories/applianceOtherSafetyFactory", "./appliancePageHelper", "../../../business/models/unsafeReason"], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, editableViewModel_1, aurelia_dialog_1, catalogConstants_1, yesNoNa_1, jobService_1, engineerService_1, labelService_1, applianceService_1, validationService_1, businessRuleService_1, catalogService_1, applianceOtherSafetyFactory_1, appliancePageHelper_1, unsafeReason_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OtherSafety = /** @class */ (function (_super) {
        __extends(OtherSafety, _super);
        function OtherSafety(jobService, engineerService, labelService, applianceService, router, eventAggregator, dialogService, validationService, businessRulesService, catalogService, bindingEngine, applianceOtherSafetyFactory) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService) || this;
            _this._applianceService = applianceService;
            _this._applianceOtherSafetyFactory = applianceOtherSafetyFactory;
            _this._bindingEngine = bindingEngine;
            // this.unsafeReasonLabels = [];
            _this.unsafeReasons = [];
            _this.disableApplianceSafe = false;
            _this._safetyNoticeStatus = [];
            return _this;
        }
        OtherSafety.prototype.canActivateAsync = function () {
            var rest = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rest[_i] = arguments[_i];
            }
            return appliancePageHelper_1.AppliancePageHelper.checkApplianceSafetyType(this._applianceService, rest);
        };
        OtherSafety.prototype.activateAsync = function (params) {
            var _this = this;
            this.applianceId = params.applianceId;
            this.jobId = params.jobId;
            if (this._isCleanInstance) {
                return this.loadBusinessRules()
                    .then(function () { return _this.buildValidationRules(); })
                    .then(function () { return _this.loadCatalogs(); })
                    .then(function () { return _this.load(); })
                    .then(function () { return _this.showContent(); });
            }
            else {
                return this.load();
            }
        };
        OtherSafety.prototype.deactivateAsync = function () {
            this._showToasts = false;
            this.removeObservables();
            return Promise.resolve();
        };
        OtherSafety.prototype.unsafeSituation = function () {
            if (this.otherSafetyViewModel) {
                this.otherSafetyViewModel.isApplianceSafe = false;
            }
        };
        OtherSafety.prototype.saveModel = function () {
            this.otherSafetyViewModel.dataState = this.getFinalDataState();
            this.appliance.safety.applianceOtherSafety = this._applianceOtherSafetyFactory.createApplianceOtherSafetyBusinessModel(this.otherSafetyViewModel, this.appliance.isSafetyRequired);
            this.appliance.safety.applianceOtherUnsafeDetail = this._applianceOtherSafetyFactory.createApplianceOtherUnsafeBusinessModel(this.otherUnsafeViewModel);
            return this._applianceService.saveApplianceSafetyDetails(this.jobId, this.appliance.id, this.appliance.safety, false, false);
        };
        OtherSafety.prototype.loadModel = function () {
            var _this = this;
            return this._applianceService.getAppliance(this.jobId, this.applianceId)
                .then(function (appliance) {
                if (appliance) {
                    _this.appliance = appliance;
                    _this.otherSafetyViewModel = _this._applianceOtherSafetyFactory.createApplianceOtherSafetyViewModel(appliance.safety.applianceOtherSafety, appliance.isSafetyRequired);
                    _this.otherUnsafeViewModel = _this._applianceOtherSafetyFactory.createApplianceOtherUnsafeViewModel(appliance.safety.applianceOtherUnsafeDetail);
                    _this.setInitialDataState(_this.otherSafetyViewModel.dataStateId, _this.otherSafetyViewModel.dataState);
                }
                else {
                    _this.setNewDataState("appliances");
                }
            })
                .then(function () { return _this.removeObservables(); })
                .then(function () { return _this.initOtherSafetyStatus(); })
                .then(function () { return _this.setObservables(); })
                .then(function () {
                _this._showToasts = true;
            });
        };
        OtherSafety.prototype.clearModel = function () {
            this.removeObservables();
            this.resetLocalModels();
            this.initOtherSafetyStatus();
            this.otherSafetyViewModel.workedOnAppliance = undefined;
            this.setObservables();
            return this.validateAllRules();
        };
        OtherSafety.prototype.hasMandatoryUnsafeReasons = function () {
            return this.unsafeReasons && this.unsafeReasons.filter(function (x) { return x.isMandatory; }).length > 0;
        };
        OtherSafety.prototype.hasAtLeastOneUnsafeFieldPopulated = function () {
            if (this.otherUnsafeViewModel &&
                (this.otherUnsafeViewModel.conditionAsLeft || this.otherUnsafeViewModel.cappedTurnedOff || this.otherUnsafeViewModel.labelAttachedRemoved
                    || this.otherUnsafeViewModel.ownedByCustomer || this.otherUnsafeViewModel.letterLeft || this.otherUnsafeViewModel.signatureObtained
                    || this.otherUnsafeViewModel.report)) {
                return true;
            }
            return false;
        };
        OtherSafety.prototype.populateUnsafeReasons = function (isToastRequired) {
            var _this = this;
            var latestUnsafeReasons = [];
            // worked on appliance unsafe check
            // visually check relight unsafe check
            if (this.otherSafetyViewModel.didYouVisuallyCheck === false) {
                latestUnsafeReasons.push(new unsafeReason_1.UnsafeReason("didYouVisuallyCheck", null, null, true));
            }
            // is appliance safe unsafe check
            if (this.otherSafetyViewModel.isApplianceSafe === false) {
                latestUnsafeReasons.push(new unsafeReason_1.UnsafeReason("isApplianceSafe", null, null, true));
            }
            // current standards unsafe check
            if (this.otherSafetyViewModel.toCurrentStandards === yesNoNa_1.YesNoNa.No) {
                latestUnsafeReasons.push(new unsafeReason_1.UnsafeReason("toCurrentStandards", null, null, true));
            }
            var currentWarnings = [];
            if (this.unsafeReasons) {
                this.unsafeReasons.forEach(function (reason) {
                    currentWarnings.push(reason.label);
                });
            }
            this.unsafeReasons = latestUnsafeReasons;
            if (this.unsafeReasons.length > 0) {
                /* If there are reasons that we didn't have before then show a toast for them */
                this.unsafeReasons.forEach(function (reason) {
                    reason.label = _this.getLabel(reason.lookupId);
                    if (isToastRequired && currentWarnings.indexOf(reason.label) === -1 && _this._showToasts) {
                        _this.showWarning(_this.getLabel("unsafeSituation"), reason.label);
                    }
                });
            }
            else {
                // clear unsafe fields if there are no unsafe reasons
                this.clearUnSafeFields();
            }
            return this.validateAllRules();
        };
        OtherSafety.prototype.obserWorkedOnAppliance = function (newValue, onload) {
            if (newValue === false && !onload) {
                this.clearForWorkOnAppliance(onload);
            }
        };
        OtherSafety.prototype.obserApplianceSafe = function (newValue, oldValue, onload) {
            this.populateUnsafeReasons(true);
            if (this.otherSafetyViewModel.isApplianceSafe === false) {
                this.otherSafetyViewModel.toCurrentStandards = yesNoNa_1.YesNoNa.Yes;
                this.disableToCurrentStandards = true;
            }
            else if (!onload) {
                this.otherSafetyViewModel.toCurrentStandards = undefined;
                this.disableToCurrentStandards = false;
            }
        };
        OtherSafety.prototype.obserToCurrentStandards = function (newValue, oldValue) {
            this.populateUnsafeReasons(true);
        };
        OtherSafety.prototype.obserDidYouVisuallyCheck = function (newValue, onload) {
            if (newValue !== undefined) {
                this.populateUnsafeReasons(true);
                this.otherSafetyViewModel.isApplianceSafe = (newValue) ? this.otherSafetyViewModel.isApplianceSafe : false;
                this.disableApplianceSafe = !newValue;
            }
        };
        OtherSafety.prototype.obserConditionAsLeft = function (newValue, oldValue, onload) {
            var _this = this;
            switch (newValue) {
                case "ID": // opt IMMEDIATELY DANGEROUS
                case "AR":// opt AT RISK
                    this.filterLabelAttachedRemovedLookup("A");
                    break;
                case "SS": // opt NOT TO CURRENT STD
                case "XC":// opt NOT COMMISSIONED
                    this.filterLabelAttachedRemovedLookup("N");
                    break;
                default:
                    this.filterLabelAttachedRemovedLookup(undefined);
                    break;
            }
            if (!!newValue
                && !onload
                && !!this.otherUnsafeViewModel.labelAttachedRemoved
                && this.labelAttachedRemovedLookup.some(function (x) { return x.value !== _this.otherUnsafeViewModel.labelAttachedRemoved; })) {
                this.otherUnsafeViewModel.labelAttachedRemoved = undefined;
            }
        };
        OtherSafety.prototype.filterLabelAttachedRemovedLookup = function (cat) {
            if (cat) {
                this.labelAttachedRemovedLookup = this.toButtonListItemArray(this._safetyNoticeStatus.filter(function (x) { return x.safetyNoticeStatusCategory === cat; }), catalogConstants_1.CatalogConstants.SAFETY_NOTICE_STATUS_ID, catalogConstants_1.CatalogConstants.SAFETY_NOTICE_STATUS_DESCRIPTION);
            }
            else {
                this.labelAttachedRemovedLookup = this.toButtonListItemArray(this._safetyNoticeStatus, catalogConstants_1.CatalogConstants.SAFETY_NOTICE_STATUS_ID, catalogConstants_1.CatalogConstants.SAFETY_NOTICE_STATUS_DESCRIPTION);
            }
        };
        OtherSafety.prototype.setObservables = function () {
            var _this = this;
            if (this.otherSafetyViewModel) {
                this._otherSafetySubscriptions.push(this._bindingEngine.propertyObserver(this.otherSafetyViewModel, "workedOnAppliance")
                    .subscribe(function (newValue) {
                    _this.obserWorkedOnAppliance(newValue, false);
                }));
                this._otherSafetySubscriptions.push(this._bindingEngine.propertyObserver(this.otherSafetyViewModel, "isApplianceSafe")
                    .subscribe(function (newValue) {
                    _this.obserApplianceSafe(newValue, false, false);
                }));
                this._otherSafetySubscriptions.push(this._bindingEngine.propertyObserver(this.otherSafetyViewModel, "toCurrentStandards")
                    .subscribe(function (newValue) {
                    _this.obserToCurrentStandards(newValue, yesNoNa_1.YesNoNa.Na);
                }));
                this._otherSafetySubscriptions.push(this._bindingEngine.propertyObserver(this.otherSafetyViewModel, "didYouVisuallyCheck")
                    .subscribe(function (newValue) {
                    _this.obserDidYouVisuallyCheck(newValue, false);
                }));
                this._otherSafetySubscriptions.push(this._bindingEngine.propertyObserver(this.otherUnsafeViewModel, "conditionAsLeft")
                    .subscribe(function (newValue, oldValue) {
                    _this.obserConditionAsLeft(newValue, oldValue, false);
                }));
            }
        };
        OtherSafety.prototype.initOtherSafetyStatus = function () {
            if (this.otherSafetyViewModel) {
                this.obserWorkedOnAppliance(this.otherSafetyViewModel.workedOnAppliance, true);
                this.obserDidYouVisuallyCheck(this.otherSafetyViewModel.didYouVisuallyCheck, true);
                this.obserApplianceSafe(this.otherSafetyViewModel.isApplianceSafe, true, true);
                this.obserToCurrentStandards(this.otherSafetyViewModel.toCurrentStandards, null);
                this.obserConditionAsLeft(this.otherUnsafeViewModel.conditionAsLeft, null, true);
            }
        };
        OtherSafety.prototype.isCurrentStandardsRequired = function () {
            if (this.disableToCurrentStandards === true) {
                return false;
            }
            else if (this.otherSafetyViewModel && this.appliance && this.appliance.isSafetyRequired
                && (this.otherSafetyViewModel.isApplianceSafe === false || this.otherSafetyViewModel.toCurrentStandards !== yesNoNa_1.YesNoNa.Yes)) {
                return true;
            }
            return false;
        };
        OtherSafety.prototype.loadCatalogs = function () {
            var _this = this;
            return Promise.all([
                this._catalogService.getSafetyActions()
                    .then(function (safetyActions) {
                    _this.cappedTurnedOffLookup = _this.toButtonListItemArray(safetyActions, catalogConstants_1.CatalogConstants.SAFETY_ACTION_ID, catalogConstants_1.CatalogConstants.SAFETY_ACTION_DESCRIPTION);
                }),
                this._catalogService.getSafetyNoticeTypes()
                    .then(function (safetyNoticeTypes) {
                    _this.conditionAsLeftLookup = _this.toButtonListItemArray(safetyNoticeTypes, catalogConstants_1.CatalogConstants.SAFETY_NOTICE_TYPE_ID, catalogConstants_1.CatalogConstants.SAFETY_NOTICE_TYPE_DESCRIPTION);
                }),
                this._catalogService.getSafetyNoticeStatuses()
                    .then(function (safetyNoticeStatus) {
                    _this._safetyNoticeStatus = safetyNoticeStatus;
                }),
                this.buildNoYesList().then(function (noYes) { return _this.didYouWorkOnApplianceLookup = noYes; }),
                this.buildNoYesList().then(function (noYes) { return _this.didYouVisuallyCheckLookup = noYes; }),
                this.buildNoYesList().then(function (noYes) { return _this.isApplianceSafeLookup = noYes; }),
                this.buildNoNaList().then(function (noNaList) { return _this.toCurrentStandardsLookup = noNaList; }),
                this.buildNoYesList().then(function (noYes) { return _this.ownedByCustomerLookup = noYes; }),
                this.buildNoYesList().then(function (noYes) { return _this.letterLeftLookup = noYes; }),
                this.buildNoYesList().then(function (noYes) { return _this.signatureObtainedLookup = noYes; })
            ])
                .then(function () { return _this.filterLabelAttachedRemovedLookup(undefined); });
        };
        OtherSafety.prototype.hasAtLeastOneFieldPopulated = function () {
            if (this.otherSafetyViewModel &&
                ((this.otherSafetyViewModel.workedOnAppliance !== null && this.otherSafetyViewModel.workedOnAppliance !== undefined)
                    || (this.otherSafetyViewModel.didYouVisuallyCheck !== null && this.otherSafetyViewModel.didYouVisuallyCheck !== undefined)
                    || (this.otherSafetyViewModel.isApplianceSafe !== null && this.otherSafetyViewModel.isApplianceSafe !== undefined)
                    || (this.otherSafetyViewModel.toCurrentStandards !== null && this.otherSafetyViewModel.toCurrentStandards !== undefined))) {
                return true;
            }
            return false;
        };
        OtherSafety.prototype.buildValidationRules = function () {
            var _this = this;
            return this.buildValidation([
                {
                    property: "otherSafetyViewModel.workedOnAppliance", condition: function () { return (_this.otherSafetyViewModel && _this.appliance && _this.appliance.isSafetyRequired)
                        || _this.hasAtLeastOneFieldPopulated(); }
                },
                {
                    property: "otherSafetyViewModel.didYouVisuallyCheck", condition: function () { return (_this.otherSafetyViewModel && _this.appliance && _this.appliance.isSafetyRequired)
                        || _this.hasAtLeastOneFieldPopulated(); }
                },
                {
                    property: "otherSafetyViewModel.isApplianceSafe", condition: function () { return (_this.otherSafetyViewModel && _this.appliance && _this.appliance.isSafetyRequired)
                        || _this.hasAtLeastOneFieldPopulated(); }
                },
                {
                    property: "otherSafetyViewModel.toCurrentStandards", condition: function () { return (_this.isCurrentStandardsRequired())
                        || _this.hasAtLeastOneFieldPopulated(); }
                },
                { property: "otherUnsafeViewModel.report", condition: function () { return _this.hasMandatoryUnsafeReasons() || _this.hasAtLeastOneUnsafeFieldPopulated(); } },
                { property: "otherUnsafeViewModel.conditionAsLeft", condition: function () { return _this.hasMandatoryUnsafeReasons() || _this.hasAtLeastOneUnsafeFieldPopulated(); } },
                { property: "otherUnsafeViewModel.cappedTurnedOff", condition: function () { return _this.hasMandatoryUnsafeReasons() || _this.hasAtLeastOneUnsafeFieldPopulated(); } },
                { property: "otherUnsafeViewModel.labelAttachedRemoved", condition: function () { return _this.hasMandatoryUnsafeReasons() || _this.hasAtLeastOneUnsafeFieldPopulated(); } },
                { property: "otherUnsafeViewModel.ownedByCustomer", condition: function () { return _this.hasMandatoryUnsafeReasons() || _this.hasAtLeastOneUnsafeFieldPopulated(); } },
                { property: "otherUnsafeViewModel.letterLeft", condition: function () { return _this.hasMandatoryUnsafeReasons() || _this.hasAtLeastOneUnsafeFieldPopulated(); } },
                { property: "otherUnsafeViewModel.signatureObtained", condition: function () { return _this.hasMandatoryUnsafeReasons() || _this.hasAtLeastOneUnsafeFieldPopulated(); } },
            ]);
        };
        OtherSafety.prototype.removeObservables = function () {
            if (this._otherSafetySubscriptions) {
                this._otherSafetySubscriptions.forEach(function (x) {
                    if (x) {
                        x.dispose();
                    }
                });
            }
            this._otherSafetySubscriptions = [];
        };
        OtherSafety.prototype.resetLocalModels = function () {
            this.otherSafetyViewModel.didYouVisuallyCheck = undefined;
            this.otherSafetyViewModel.isApplianceSafe = undefined;
            this.otherSafetyViewModel.toCurrentStandards = undefined;
            this.clearUnSafeFields();
        };
        OtherSafety.prototype.clearUnSafeFields = function () {
            this.unsafeReasons = [];
            this.otherUnsafeViewModel.report = undefined;
            this.otherUnsafeViewModel.conditionAsLeft = undefined;
            this.otherUnsafeViewModel.labelAttachedRemoved = undefined;
            this.otherUnsafeViewModel.ownedByCustomer = undefined;
            this.otherUnsafeViewModel.letterLeft = undefined;
            this.otherUnsafeViewModel.signatureObtained = undefined;
            this.otherUnsafeViewModel.cappedTurnedOff = undefined;
        };
        OtherSafety.prototype.clearForWorkOnAppliance = function (onload) {
            this.removeObservables();
            this.resetLocalModels();
            this.initOtherSafetyStatus();
            this.setObservables();
        };
        OtherSafety = __decorate([
            aurelia_framework_1.inject(jobService_1.JobService, engineerService_1.EngineerService, labelService_1.LabelService, applianceService_1.ApplianceService, aurelia_router_1.Router, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService, aurelia_framework_1.BindingEngine, applianceOtherSafetyFactory_1.ApplianceOtherSafetyFactory),
            __metadata("design:paramtypes", [Object, Object, Object, Object, aurelia_router_1.Router,
                aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, Object, aurelia_framework_1.BindingEngine, Object])
        ], OtherSafety);
        return OtherSafety;
    }(editableViewModel_1.EditableViewModel));
    exports.OtherSafety = OtherSafety;
});

//# sourceMappingURL=otherSafety.js.map
