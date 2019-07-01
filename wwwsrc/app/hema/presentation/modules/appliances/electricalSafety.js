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
define(["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "../../../business/services/labelService", "../../../business/services/jobService", "../../../business/services/validationService", "../../../business/services/businessRuleService", "../../../business/services/catalogService", "../../models/editableViewModel", "./viewModels/electricalSafetyViewModel", "../../../business/services/applianceService", "../../../business/services/propertySafetyService", "../../factories/applianceSafetyFactory", "../../../business/services/engineerService", "aurelia-dialog", "../../../business/services/constants/catalogConstants", "./appliancePageHelper", "../../models/businessRulesViewModel"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, labelService_1, jobService_1, validationService_1, businessRuleService_1, catalogService_1, editableViewModel_1, electricalSafetyViewModel_1, applianceService_1, propertySafetyService_1, applianceSafetyFactory_1, engineerService_1, aurelia_dialog_1, catalogConstants_1, appliancePageHelper_1, businessRulesViewModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ElectricalSafety = /** @class */ (function (_super) {
        __extends(ElectricalSafety, _super);
        function ElectricalSafety(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService, bindingEngine, applianceService, propertySafetyService, applianceSafetyFactory) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService) || this;
            _this._bindingEngine = bindingEngine;
            _this._propertySubscriptions = [];
            _this._applianceService = applianceService;
            _this._propertySafetyService = propertySafetyService;
            _this._applianceSafetyFactory = applianceSafetyFactory;
            _this.validationRules = {};
            return _this;
        }
        ElectricalSafety.prototype.canActivateAsync = function () {
            var rest = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rest[_i] = arguments[_i];
            }
            return appliancePageHelper_1.AppliancePageHelper.checkApplianceSafetyType(this._applianceService, rest);
        };
        ElectricalSafety.prototype.activateAsync = function (params) {
            var _this = this;
            this._applianceId = params.applianceId;
            if (this._isCleanInstance) {
                return this.loadBusinessRules()
                    .then(function () { return _this.loadCatalogs(); })
                    .then(function () { return _this.load(); })
                    .then(function () { return _this.buildValidationRules(); })
                    .then(function () { return _this.showContent(); });
            }
            else {
                return this.load();
            }
        };
        ElectricalSafety.prototype.deactivateAsync = function () {
            this.disposeSubscriptions();
            return Promise.resolve();
        };
        ElectricalSafety.prototype.toggleLeInsulationResistanceShowReasonWhyNot = function () {
            this.viewModel.showLeInsulationResistanceReasonWhyNot = !this.viewModel.showLeInsulationResistanceReasonWhyNot;
            return this.validateAllRules();
        };
        ElectricalSafety.prototype.toggleNeInsulationResistanceShowReasonWhyNot = function () {
            this.viewModel.showNeInsulationResistanceReasonWhyNot = !this.viewModel.showNeInsulationResistanceReasonWhyNot;
            return this.validateAllRules();
        };
        ElectricalSafety.prototype.toggleLnInsulationResistanceShowReasonWhyNot = function () {
            this.viewModel.showLnInsulationResistanceReasonWhyNot = !this.viewModel.showLnInsulationResistanceReasonWhyNot;
            return this.validateAllRules();
        };
        ElectricalSafety.prototype.toggleMcbFuseRatingShowReasonWhyNot = function () {
            this.viewModel.showMcbFuseRatingReasonWhyNot = !this.viewModel.showMcbFuseRatingReasonWhyNot;
            return this.validateAllRules();
        };
        ElectricalSafety.prototype.toggleApplianceFuseRatingShowReasonWhyNot = function () {
            this.viewModel.showApplianceFuseRatingReasonWhyNot = !this.viewModel.showApplianceFuseRatingReasonWhyNot;
            return this.validateAllRules();
        };
        ElectricalSafety.prototype.toggleMicrowaveLeakageReadingShowReasonWhyNot = function () {
            this.viewModel.showMicrowaveLeakageReadingReasonWhyNot = !this.viewModel.showMicrowaveLeakageReadingReasonWhyNot;
            return this.validateAllRules();
        };
        ElectricalSafety.prototype.loadModel = function () {
            var _this = this;
            return this._applianceService.getApplianceSafetyDetails(this.jobId, this._applianceId)
                .then(function (applianceSafety) {
                if (applianceSafety && (applianceSafety.applianceElectricalSafetyDetail || applianceSafety.applianceElectricalUnsafeDetail)) {
                    // there are some safety info already there, load those
                    _this.viewModel = _this._applianceSafetyFactory.createElectricalSafetyViewModel(applianceSafety, _this.businessRules);
                    _this.initialiseViewModel();
                    _this.setInitialDataState(applianceSafety.applianceElectricalSafetyDetail.dataStateId, applianceSafety.applianceElectricalSafetyDetail.dataState);
                }
                else {
                    _this.viewModel = new electricalSafetyViewModel_1.ElectricalSafetyViewModel(_this.businessRules);
                    _this.initialiseViewModel();
                    _this.setNewDataState("appliances");
                }
                return _this._propertySafetyService.getPropertySafetyDetails(_this.jobId);
            })
                .then(function (propertySafety) {
                // get the property safety info and save it to local
                if (propertySafety && propertySafety.propertyElectricalSafetyDetail) {
                    _this.viewModel.systemType = propertySafety.propertyElectricalSafetyDetail.systemType;
                }
                return _this._applianceService.getAppliance(_this.jobId, _this._applianceId);
            })
                .then(function (appliance) {
                // get the type of appliance to figure out the type e.g. Electrical, whiteGoods, Microwave etc
                return _this._catalogService.getApplianceElectricalType(appliance.applianceType);
            })
                .then(function (applianceElectricalType) {
                if (applianceElectricalType && !_this.viewModel.electricalApplianceType) {
                    _this.viewModel.electricalApplianceType = applianceElectricalType.applianceElectricalType;
                }
            });
        };
        ElectricalSafety.prototype.saveModel = function () {
            var applianceElectricalSafetyDetail = this._applianceSafetyFactory.createApplianceElectricalSafetyDetail(this.viewModel);
            var applianceElectricalUnsafeDetail = this._applianceSafetyFactory.createApplianceElectricalUnsafeDetail(this.viewModel);
            applianceElectricalSafetyDetail.dataState = this.getFinalDataState();
            return this._applianceService.saveElectricalSafetyDetails(this.jobId, this._applianceId, applianceElectricalSafetyDetail, applianceElectricalUnsafeDetail, this._isDirty);
        };
        ElectricalSafety.prototype.clearModel = function () {
            var systemType = this.viewModel.systemType;
            var electricalApplianceType = this.viewModel.electricalApplianceType;
            this.viewModel = new electricalSafetyViewModel_1.ElectricalSafetyViewModel(this.businessRules);
            this.initialiseViewModel();
            this.viewModel.systemType = systemType;
            this.viewModel.electricalApplianceType = electricalApplianceType;
            return this.buildValidationRules();
        };
        ElectricalSafety.prototype.initialiseViewModel = function () {
            var _this = this;
            this.disposeSubscriptions();
            this.viewModel.getPropertiesToBind().forEach(function (propertyKey) {
                _this._propertySubscriptions.push(_this._bindingEngine
                    .propertyObserver(_this.viewModel, propertyKey)
                    .subscribe(function (newValue, oldValue) {
                    _this.viewModel.recalculateflowState(propertyKey);
                }));
            });
            this._propertySubscriptions.push(this._bindingEngine
                .propertyObserver(this.viewModel, "availableConditionAsLefts")
                .subscribe(function (newValue, oldValue) {
                _this.handleAvailableConditionAsLeftsChanged();
            }));
            this._propertySubscriptions.push(this._bindingEngine
                .propertyObserver(this.viewModel, "availableLabelAttachedRemovedLookups")
                .subscribe(function (newValue, oldValue) {
                _this.handleAvailableLabelAttachedRemovedChanged();
            }));
            this._propertySubscriptions.push(this._bindingEngine
                .propertyObserver(this.viewModel, "unsafeReasons")
                .subscribe(function (newValue, oldValue) {
                _this.handleUnsafeReasonChanged(newValue, oldValue);
            }));
            this.viewModel.recalculateflowState();
        };
        ElectricalSafety.prototype.handleAvailableLabelAttachedRemovedChanged = function () {
            var _this = this;
            this.labelAttachedRemovedLookup.forEach(function (btn) {
                btn.disabled = !_this.viewModel.availableLabelAttachedRemovedLookups.some(function (a) { return btn.value === a; });
            });
        };
        ElectricalSafety.prototype.handleAvailableConditionAsLeftsChanged = function () {
            var _this = this;
            this.conditionAsLeftLookup.forEach(function (btn) {
                btn.disabled = !_this.viewModel.availableConditionAsLefts.some(function (a) { return btn.value === a; });
            });
        };
        ElectricalSafety.prototype.handleUnsafeReasonChanged = function (newValues, oldValues) {
            var _this = this;
            var showWarning = function (key) { return _this.showWarning(_this.getLabel("unsafeSituation"), _this.getLabel(key + "Unsafe"), null, _this.getBusinessRule("unsafeToastDismissTime")); };
            newValues.filter(function (newValue) { return !oldValues.some(function (oldValue) { return oldValue.field === newValue.field && !!newValue.mandatory === !!oldValue.mandatory; }); })
                .forEach(function (newValue) { return showWarning(newValue.field); });
        };
        ElectricalSafety.prototype.disposeSubscriptions = function () {
            if (this._propertySubscriptions) {
                this._propertySubscriptions.forEach(function (subscription) { return subscription.dispose(); });
                this._propertySubscriptions = [];
            }
        };
        ElectricalSafety.prototype.loadCatalogs = function () {
            var _this = this;
            var catalogPromises = [
                this.buildYesNoList()
                    .then(function (btns) { return _this.isApplianceHardWiredLookup = btns; }),
                this.buildYesNoList()
                    .then(function (btns) { return _this.workedOnLightingCircuitLookup = btns; }),
                this.buildYesNoList()
                    .then(function (btns) { return _this.cpcInLightingCircuitOkLookup = btns; }),
                this.buildYesNoList()
                    .then(function (btns) { return _this.installationSatisfactoryLookup = btns; }),
                this.buildYesNoList()
                    .then(function (btns) { return _this.applianceSafeLookup = btns; }),
                this.buildYesNoList()
                    .then(function (btns) { return _this.applianceInstallationSatisfactoryLookup = btns; }),
                this.buildYesNoList()
                    .then(function (btns) { return _this.readingSafeAccordingToTopsLookup = btns; }),
                this.buildYesNoList()
                    .then(function (btns) { return _this.isRcdPresentLookup = btns; }),
                this.buildYesNoList()
                    .then(function (btns) { return _this.ownedByCustomerLookup = btns; }),
                this.buildYesNoList()
                    .then(function (btns) { return _this.letterLeftLookup = btns; }),
                this.buildYesNoList()
                    .then(function (btns) { return _this.signatureObtainedLookup = btns; }),
                this.buildYesNoList()
                    .then(function (btns) { return _this.isPartPLookup = btns; }),
                this.buildYesNoList()
                    .then(function (btns) { return _this.finalEliReadingDoneLookup = btns; }),
                this.buildYesNoList()
                    .then(function (btns) { return _this.applianceEarthContinuityReadingDoneLookup = btns; }),
                this._catalogService.getSafetyReasonCats(catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_GROUP_LE_RESISTANCE_TAKEN)
                    .then(function (safetyNoticeTypes) {
                    _this.leInsulationResistanceReasonWhyNotLookup =
                        _this.toButtonListItemArray(safetyNoticeTypes, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_ID, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION);
                }),
                this._catalogService.getSafetyReasonCats(catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_GROUP_NE_RESISTANCE_TAKEN)
                    .then(function (safetyNoticeTypes) {
                    _this.neInsulationResistanceReasonWhyNotLookup =
                        _this.toButtonListItemArray(safetyNoticeTypes, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_ID, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION);
                }),
                this._catalogService.getSafetyReasonCats(catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_GROUP_LN_RESISTANCE_TAKEN)
                    .then(function (safetyNoticeTypes) {
                    _this.lnInsulationResistanceReasonWhyNotLookup =
                        _this.toButtonListItemArray(safetyNoticeTypes, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_ID, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION);
                }),
                this._catalogService.getSafetyReasonCats(catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_GROUP_CIRCUIT_PROTECT)
                    .then(function (safetyNoticeTypes) {
                    _this.circuitRcdRcboProtectedLookup =
                        _this.toButtonListItemArray(safetyNoticeTypes, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_ID, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION);
                }),
                this._catalogService.getYesNoNotCheckeds()
                    .then(function (catalog) {
                    _this.mainEarthCheckedLookup =
                        _this.toButtonListItemArray(catalog, catalogConstants_1.CatalogConstants.YES_NO_NOTCHECKED_ID, catalogConstants_1.CatalogConstants.YES_NO_NOTCHECKED_DESCRIPTION);
                }),
                this._catalogService.getYesNoNotCheckeds()
                    .then(function (catalog) {
                    _this.gasBondingCheckedLookup =
                        _this.toButtonListItemArray(catalog, catalogConstants_1.CatalogConstants.YES_NO_NOTCHECKED_ID, catalogConstants_1.CatalogConstants.YES_NO_NOTCHECKED_DESCRIPTION);
                }),
                this._catalogService.getYesNoNotCheckeds()
                    .then(function (catalog) {
                    _this.waterBondingCheckedLookup =
                        _this.toButtonListItemArray(catalog, catalogConstants_1.CatalogConstants.YES_NO_NOTCHECKED_ID, catalogConstants_1.CatalogConstants.YES_NO_NOTCHECKED_DESCRIPTION);
                }),
                this._catalogService.getYesNoNotCheckedNas()
                    .then(function (catalog) {
                    _this.otherBondingCheckedLookup =
                        _this.toButtonListItemArray(catalog, catalogConstants_1.CatalogConstants.YES_NO_NOTCHECKED_NA_ID, catalogConstants_1.CatalogConstants.YES_NO_NOTCHECKED_NA_DESCRIPTION);
                }),
                this._catalogService.getYesNoNotCheckedNas()
                    .then(function (catalog) {
                    _this.supplementaryBondingOrFullRcdProtectionCheckedLookup =
                        _this.toButtonListItemArray(catalog, catalogConstants_1.CatalogConstants.YES_NO_NOTCHECKED_NA_ID, catalogConstants_1.CatalogConstants.YES_NO_NOTCHECKED_NA_DESCRIPTION);
                }),
                this._catalogService.getPassFailNas()
                    .then(function (catalog) {
                    _this.ringContinuityReadingDoneLookup =
                        _this.toButtonListItemArray(catalog, catalogConstants_1.CatalogConstants.PASS_FAIL_NA_ID, catalogConstants_1.CatalogConstants.PASS_FAIL_NA_DESCRIPTION);
                }),
                this._catalogService.getSafetyNoticeTypes()
                    .then(function (safetyNoticeTypes) {
                    _this.conditionAsLeftLookup =
                        _this.toButtonListItemArray(safetyNoticeTypes, catalogConstants_1.CatalogConstants.SAFETY_NOTICE_TYPE_ID, catalogConstants_1.CatalogConstants.SAFETY_NOTICE_TYPE_DESCRIPTION);
                }),
                this._catalogService.getSafetyActions()
                    .then(function (safetyActions) {
                    _this.cappedTurnedOffLookup =
                        _this.toButtonListItemArray(safetyActions, catalogConstants_1.CatalogConstants.SAFETY_ACTION_ID, catalogConstants_1.CatalogConstants.SAFETY_ACTION_DESCRIPTION);
                }),
                this._catalogService.getSafetyNoticeStatuses()
                    .then(function (safetyNoticeStatus) {
                    _this.labelAttachedRemovedLookup =
                        _this.toButtonListItemArray(safetyNoticeStatus, catalogConstants_1.CatalogConstants.SAFETY_NOTICE_STATUS_ID, catalogConstants_1.CatalogConstants.SAFETY_NOTICE_STATUS_DESCRIPTION);
                }),
                this._catalogService.getSafetyReasonCats(catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_GROUP_MCB_FUSE_RAT_NOT_CHKD_REAS)
                    .then(function (safetyNoticeTypes) {
                    _this.mcbFuseRatingReasonWhyNotLookup =
                        _this.toButtonListItemArray(safetyNoticeTypes, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_ID, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION);
                }),
                this._catalogService.getSafetyReasonCats(catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_GROUP_APPLN_FUSE_RAT_NOT_CHKD_REAS)
                    .then(function (safetyNoticeTypes) {
                    _this.applianceFuseRatingReasonWhyNotLookup =
                        _this.toButtonListItemArray(safetyNoticeTypes, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_ID, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION);
                }),
                this._catalogService.getSafetyReasonCats(catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_GROUP_LEAKAGE_TEST_NOT_DONE_REAS)
                    .then(function (safetyNoticeTypes) {
                    _this.microwaveLeakageReadingReasonWhyNotLookup =
                        _this.toButtonListItemArray(safetyNoticeTypes, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_ID, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION);
                }),
                this._catalogService.getSafetyReadingCats(catalogConstants_1.CatalogConstants.SAFETY_READING_CAT_GROUP_MCB_FUSE_RAT_VALS)
                    .then(function (safetyReadings) {
                    _this.mcbFuseRatingCatalog = _this.toSortedArray(safetyReadings, businessRulesViewModel_1.BusinessRulesViewModel.numericSorter(catalogConstants_1.CatalogConstants.SAFETY_READING_CAT_DESCRIPTION));
                }),
                this._catalogService.getSafetyReadingCats(catalogConstants_1.CatalogConstants.SAFETY_READING_CAT_GROUP_FUSE_RATE_VALS)
                    .then(function (safetyReadings) {
                    _this.applianceFuseRatingCatalog = _this.toSortedArray(safetyReadings, businessRulesViewModel_1.BusinessRulesViewModel.numericSorter(catalogConstants_1.CatalogConstants.SAFETY_READING_CAT_DESCRIPTION));
                }),
                this._catalogService.getSafetyReasonCats(catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_GROUP_PART_P_REAS)
                    .then(function (safetyNoticeTypes) {
                    _this.partPReasonCatalog = safetyNoticeTypes;
                }),
                this._catalogService.getElectricalApplianceTypes()
                    .then(function (catalog) { return _this.jobTypeCatalog = catalog; })
            ];
            return Promise.all(catalogPromises).then(function () { });
        };
        ElectricalSafety.prototype.buildValidationRules = function () {
            var _this = this;
            return this.buildValidation([
                { property: "viewModel.mainEarthChecked", condition: function () { return _this.viewModel.mainEarthCheckedVisible; } },
                { property: "viewModel.gasBondingChecked", condition: function () { return _this.viewModel.gasBondingCheckedVisible; } },
                { property: "viewModel.waterBondingChecked", condition: function () { return _this.viewModel.gasBondingCheckedVisible; } },
                { property: "viewModel.otherBondingChecked", condition: function () { return _this.viewModel.otherBondingCheckedVisible; } },
                { property: "viewModel.supplementaryBondingOrFullRcdProtectionChecked", condition: function () { return _this.viewModel.supplementaryBondingOrFullRcdProtectionCheckedVisible; } },
                { property: "viewModel.ringContinuityReadingDone", condition: function () { return _this.viewModel.ringContinuityReadingDoneVisible; } },
                { property: "viewModel.leInsulationResistance", condition: function () { return _this.viewModel.leInsulationResistanceVisible && !_this.viewModel.showLeInsulationResistanceReasonWhyNot; } },
                { property: "viewModel.leInsulationResistanceReasonWhyNot", condition: function () { return _this.viewModel.leInsulationResistanceReasonWhyNotVisible; } },
                { property: "viewModel.neInsulationResistance", condition: function () { return _this.viewModel.neInsulationResistanceVisible && !_this.viewModel.showNeInsulationResistanceReasonWhyNot; } },
                { property: "viewModel.neInsulationResistanceReasonWhyNot", condition: function () { return _this.viewModel.neInsulationResistanceReasonWhyNotVisible; } },
                { property: "viewModel.lnInsulationResistance", condition: function () { return _this.viewModel.lnInsulationResistanceVisible && !_this.viewModel.showLnInsulationResistanceReasonWhyNot; } },
                { property: "viewModel.lnInsulationResistanceReasonWhyNot", condition: function () { return _this.viewModel.lnInsulationResistanceReasonWhyNotVisible; } },
                { property: "viewModel.finalEliReadingDone", condition: function () { return _this.viewModel.finalEliReadingDoneVisible; } },
                { property: "viewModel.finalEliReading", condition: function () { return _this.viewModel.finalEliReadingVisible; } },
                { property: "viewModel.readingSafeAccordingToTops", condition: function () { return _this.viewModel.readingSafeAccordingToTopsVisible; } },
                { property: "viewModel.isRcdPresent", condition: function () { return _this.viewModel.isRcdPresentVisible; } },
                { property: "viewModel.circuitRcdRcboProtected", condition: function () { return _this.viewModel.circuitRcdRcboProtectedVisible; } },
                { property: "viewModel.rcdTripTimeReading", condition: function () { return _this.viewModel.rcdTripTimeReadingVisible; } },
                { property: "viewModel.rcboTripTimeReading", condition: function () { return _this.viewModel.rcboTripTimeReadingVisible; } },
                { property: "viewModel.applianceEarthContinuityReadingDone", condition: function () { return _this.viewModel.applianceEarthContinuityReadingDoneVisible; } },
                { property: "viewModel.applianceEarthContinuityReading", condition: function () { return _this.viewModel.applianceEarthContinuityReadingVisible; } },
                { property: "viewModel.isApplianceHardWired", condition: function () { return _this.viewModel.isApplianceHardWiredVisible; } },
                { property: "viewModel.mcbFuseRating", condition: function () { return _this.viewModel.mcbFuseRatingVisible && !_this.viewModel.showMcbFuseRatingReasonWhyNot; } },
                { property: "viewModel.mcbFuseRatingReasonWhyNot", condition: function () { return _this.viewModel.mcbFuseRatingReasonWhyNotVisible; } },
                { property: "viewModel.applianceFuseRating", condition: function () { return _this.viewModel.applianceFuseRatingVisible && !_this.viewModel.showApplianceFuseRatingReasonWhyNot; } },
                { property: "viewModel.applianceFuseRatingReasonWhyNot", condition: function () { return _this.viewModel.applianceFuseRatingReasonWhyNotVisible; } },
                { property: "viewModel.isPartP", condition: function () { return _this.viewModel.isPartPVisible; } },
                { property: "viewModel.partPReason", condition: function () { return _this.viewModel.partPReasonVisible; } },
                { property: "viewModel.workedOnLightingCircuit", condition: function () { return _this.viewModel.workedOnLightingCircuitVisible; } },
                { property: "viewModel.cpcInLightingCircuitOk", condition: function () { return _this.viewModel.cpcInLightingCircuitOkVisible; } },
                { property: "viewModel.installationSatisfactory", condition: function () { return _this.viewModel.installationSatisfactoryVisible; } },
                { property: "viewModel.microwaveLeakageReading", condition: function () { return _this.viewModel.microwaveLeakageReadingVisible && !_this.viewModel.showMicrowaveLeakageReadingReasonWhyNot; } },
                { property: "viewModel.microwaveLeakageReadingReasonWhyNot", condition: function () { return _this.viewModel.microwaveLeakageReadingReasonWhyNotVisible; } },
                { property: "viewModel.applianceSafe", condition: function () { return _this.viewModel.applianceSafeVisible; } },
                { property: "viewModel.applianceInstallationSatisfactory", condition: function () { return _this.viewModel.applianceInstallationSatisfactoryVisible; } },
                { property: "viewModel.report", condition: function () { return _this.viewModel.reportFieldsMandatory; } },
                { property: "viewModel.conditionAsLeft", condition: function () { return _this.viewModel.reportFieldsMandatory; } },
                { property: "viewModel.cappedTurnedOff", condition: function () { return _this.viewModel.reportFieldsMandatory; } },
                { property: "viewModel.labelAttachedRemoved", condition: function () { return _this.viewModel.reportFieldsMandatory; } },
                { property: "viewModel.ownedByCustomer", condition: function () { return _this.viewModel.reportFieldsMandatory; } },
                { property: "viewModel.letterLeft", condition: function () { return _this.viewModel.reportFieldsMandatory; } },
                { property: "viewModel.signatureObtained", condition: function () { return _this.viewModel.reportFieldsMandatory; } }
            ]);
        };
        ElectricalSafety = __decorate([
            aurelia_framework_1.inject(jobService_1.JobService, engineerService_1.EngineerService, labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService, aurelia_framework_1.BindingEngine, applianceService_1.ApplianceService, propertySafetyService_1.PropertySafetyService, applianceSafetyFactory_1.ApplianceSafetyFactory),
            __metadata("design:paramtypes", [Object, Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, Object, aurelia_framework_1.BindingEngine, Object, Object, Object])
        ], ElectricalSafety);
        return ElectricalSafety;
    }(editableViewModel_1.EditableViewModel));
    exports.ElectricalSafety = ElectricalSafety;
});

//# sourceMappingURL=electricalSafety.js.map
