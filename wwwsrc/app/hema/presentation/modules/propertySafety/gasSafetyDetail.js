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
define(["require", "exports", "aurelia-framework", "../../../business/services/catalogService", "../../../../common/ui/elements/models/buttonListItem", "../../../business/services/propertySafetyService", "../../../business/models/propertyGasSafetyDetail", "aurelia-event-aggregator", "../../../business/services/jobService", "aurelia-binding", "../../models/editableViewModel", "../../../business/services/validationService", "../../../business/services/labelService", "../../../business/services/businessRuleService", "../../../business/models/propertyUnsafeDetail", "../../../business/services/engineerService", "aurelia-dialog", "../../../business/services/constants/catalogConstants"], function (require, exports, aurelia_framework_1, catalogService_1, buttonListItem_1, propertySafetyService_1, propertyGasSafetyDetail_1, aurelia_event_aggregator_1, jobService_1, aurelia_binding_1, editableViewModel_1, validationService_1, labelService_1, businessRuleService_1, propertyUnsafeDetail_1, engineerService_1, aurelia_dialog_1, catalogConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GasSafetyDetail = /** @class */ (function (_super) {
        __extends(GasSafetyDetail, _super);
        function GasSafetyDetail(catalogService, labelService, propertySafetyService, eventAggregator, dialogService, jobService, engineerService, validationService, businessRuleService) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService) || this;
            _this._propertySafetyService = propertySafetyService;
            _this.iniEliReadingLookup = [];
            _this.noEliReadingsReasonLookup = [];
            _this.gasMeterInstallationSatisfactoryLookup = [];
            _this.gasMeterInstallationSatisfactoryDisabled = false;
            _this.cappedTurnedOffSelectedDisabled = false;
            _this.showUnsafeWarningMsg = false;
            return _this;
        }
        GasSafetyDetail_1 = GasSafetyDetail;
        GasSafetyDetail.numericComparisonSorter = function () {
            return function (a, b) {
                var aVal = +a[catalogConstants_1.CatalogConstants.SAFETY_READING_CAT_DESCRIPTION].replace("<", "0").replace(">", "100");
                var bVal = +b[catalogConstants_1.CatalogConstants.SAFETY_READING_CAT_DESCRIPTION].replace("<", "0").replace(">", "100");
                if (aVal > bVal) {
                    return 1;
                }
                if (aVal < bVal) {
                    return -1;
                }
                return 0;
            };
        };
        GasSafetyDetail.prototype.activateAsync = function () {
            var _this = this;
            return this.loadBusinessRules()
                .then(function () { return _this.buildValidationRules(); })
                .then(function () { return _this.buildBusinessRules(); })
                .then(function () { return _this.loadCatalogs(); })
                .then(function () { return _this.load(); })
                .then(function () { return _this.removeOptionFromGasMeterInstallationSatisfactoryLookup(_this._gasMeterInstallationSatisfactoryNotApplicableOption); })
                .then(function () { return _this.showContent(); });
        };
        GasSafetyDetail.prototype.iniEliReadingSelectedChanged = function (newValue, oldValue) {
            return this.populateGasUnsafeReasons(this._readyToShowToast);
        };
        GasSafetyDetail.prototype.gasInstallationTightnessTestDoneSelectedChanged = function (newValue, oldValue) {
            var _this = this;
            if (newValue === null || newValue === undefined || this.gasInstallationTightnessTestDoneSelected === false) {
                this.pressureDrop = undefined;
                this.gasMeterInstallationSatisfactoryDisabled = false;
            }
            if (newValue === false) {
                this.conditionAsLeftSelected = undefined;
                this.cappedTurnedOffSelected = undefined;
                this.labelAttachedRemovedSelected = undefined;
                this.removeOptionFromGasMeterInstallationSatisfactoryLookup(this._gasMeterInstallationSatisfactoryNotApplicableOptionYes);
                this.removeOptionFromConditionAsLeftLookup(this._notToCurrentStdConditionAsLeftOptionSelectedSS);
            }
            else if (newValue === true) {
                return this.resetOptionFromGasMeterInstallationSatisfactoryLookup(this._gasMeterInstallationSatisfactoryNotApplicableOptionInstaPerm)
                    .then(function () { return _this.resetOptionFromConditionAsLeftLookup(); })
                    .then(function () { return _this.populateGasUnsafeReasons(_this._readyToShowToast); });
            }
            return this.resetOptionFromGasMeterInstallationSatisfactoryLookup(this._gasMeterInstallationSatisfactoryNotApplicableOptionInstaPerm)
                .then(function () { return _this.populateGasUnsafeReasons(_this._readyToShowToast); });
        };
        GasSafetyDetail.prototype.pressureDropChanged = function (newValue, oldValue) {
            var _this = this;
            if (newValue > this._pressureDropThreshold) {
                this.conditionAsLeftSelected = undefined;
                this.cappedTurnedOffSelected = undefined;
                this.labelAttachedRemovedSelected = undefined;
                this.gasMeterInstallationSatisfactorySelected = "No";
                this.gasMeterInstallationSatisfactoryDisabled = true;
            }
            else {
                this.gasMeterInstallationSatisfactoryDisabled = false;
            }
            // disable ConditionAsLeft buttons SS, XC if pressuredrop > 8.
            this.conditionAsLeftLookup.map(function (btn) {
                btn.disabled = (_this._conditionAsLeftDisableOptions.indexOf(btn.value) > -1 && newValue > _this._pressureDropThreshold);
            });
            return this.populateGasUnsafeReasons(this._readyToShowToast);
        };
        GasSafetyDetail.prototype.gasMeterInstallationSatisfactorySelectedChanged = function (newValue, oldValue) {
            return this.populateGasUnsafeReasons(this._readyToShowToast);
        };
        GasSafetyDetail.prototype.conditionAsLeftSelectedChanged = function (newValue) {
            var _this = this;
            // disable Not Applicable CappedTurnedOff Option button when ConditionAsLeft selected value is equal to anyone of these (AR, ID, XC).
            // disable Capped, Not Capped, TuredOff, Not TurnedOff CappedTurnedOff Option buttons when ConditionAsLeft selected value is equal to Not to current std.
            this.cappedTurnedOffLookup.forEach(function (btn) {
                btn.disabled = (_this._conditionAsLeftSelectedOptions.some(function (option) { return option === newValue; }) && _this._cappedTurnedOffDisabledOptions.indexOf(btn.value) > -1) ||
                    (_this._notToCurrentStdConditionAsLeftOptionSelected.some(function (option) { return option === newValue; }) &&
                        _this._cappedTurnedOffDisabledOptionsForNotToCurrentStd.indexOf(btn.value) > -1);
                _this.cappedTurnedOffSelected = (btn.disabled && btn.value === _this.cappedTurnedOffSelected) ? undefined : _this.cappedTurnedOffSelected;
            });
            // disable all the CappedTurnedOff label attached/removed Option buttons except Attached option when ConditionAsLeft selected value is equal to anyone of these (AR, ID, XC).
            // disable Attached and Not attached label attached/removed Option buttons when ConditionAsLeft selected value is equal to Not to current std.
            this.labelAttachedRemovedLookup.forEach(function (btn) {
                btn.disabled = (_this._conditionAsLeftSelectedOptions.some(function (option) { return option === newValue; }) && _this._labelAttachedDisableOptions.indexOf(btn.value) > -1) ||
                    (_this._notToCurrentStdConditionAsLeftOptionSelected.some(function (option) { return option === newValue; }) &&
                        _this._labelAttachedDisabledOptionsForNotToCurrentStd.indexOf(btn.value) > -1);
                _this.labelAttachedRemovedSelected = (btn.disabled && btn.value === _this.labelAttachedRemovedSelected) ? undefined : _this.labelAttachedRemovedSelected;
            });
            this.showUnsafeWarningMsg = this.showUnsafeWarningMessage();
        };
        GasSafetyDetail.prototype.cappedTurnedOffSelectedChanged = function (newValue) {
            this.showUnsafeWarningMsg = this.showUnsafeWarningMessage();
        };
        Object.defineProperty(GasSafetyDetail.prototype, "isNoEliReadingTaken", {
            get: function () {
                return this.iniEliReadingSelected === catalogConstants_1.CatalogConstants.SAFETY_READING_CAT_NO_READING_TAKEN;
            },
            enumerable: true,
            configurable: true
        });
        GasSafetyDetail.prototype.loadModel = function () {
            var _this = this;
            return this._jobService.getJob(this.jobId)
                .then(function (job) {
                if (job) {
                    _this.isLandlordJob = job.isLandlordJob;
                }
                else {
                    _this.isLandlordJob = false;
                }
            })
                .then(function () { return _this._propertySafetyService.getPropertySafetyDetails(_this.jobId); })
                .then(function (safetyDetail) {
                _this._readyToShowToast = false;
                if (safetyDetail) {
                    if (safetyDetail.propertyGasSafetyDetail) {
                        _this.iniEliReadingSelected = safetyDetail.propertyGasSafetyDetail.eliReading;
                        _this.gasInstallationTightnessTestDoneSelected = safetyDetail.propertyGasSafetyDetail.gasInstallationTightnessTestDone;
                        _this.gasMeterInstallationSatisfactorySelected = safetyDetail.propertyGasSafetyDetail.gasMeterInstallationSatisfactory;
                        _this.noEliReadingsReasonSelected = safetyDetail.propertyGasSafetyDetail.eliReadingReason;
                        _this.reasonWhyText = safetyDetail.propertyGasSafetyDetail.safetyAdviseNoticeLeftReason;
                        _this.pressureDrop = safetyDetail.propertyGasSafetyDetail.pressureDrop;
                        _this.safetyAdviceNoticeLeftSelected = safetyDetail.propertyGasSafetyDetail.safetyAdviseNoticeLeft;
                        _this._gasSafetyModel = safetyDetail.propertyGasSafetyDetail;
                        _this.setInitialDataState(safetyDetail.propertyGasSafetyDetail.dataStateId, safetyDetail.propertyGasSafetyDetail.dataState);
                    }
                    else {
                        _this._gasSafetyModel = new propertyGasSafetyDetail_1.PropertyGasSafetyDetail();
                    }
                    if (safetyDetail.propertyUnsafeDetail) {
                        _this.report = safetyDetail.propertyUnsafeDetail.report;
                        _this.conditionAsLeftSelected = safetyDetail.propertyUnsafeDetail.conditionAsLeft;
                        _this.cappedTurnedOffSelected = safetyDetail.propertyUnsafeDetail.cappedTurnedOff;
                        _this.labelAttachedRemovedSelected = safetyDetail.propertyUnsafeDetail.labelAttachedRemoved;
                        _this.ownedByCustomerSelected = safetyDetail.propertyUnsafeDetail.ownedByCustomer;
                        _this.letterLeftSelected = safetyDetail.propertyUnsafeDetail.letterLeft;
                        _this.signatureObtainedSelected = safetyDetail.propertyUnsafeDetail.signatureObtained;
                    }
                    else {
                        _this.clearUnsafeDetail();
                    }
                }
                else {
                    _this._gasSafetyModel = new propertyGasSafetyDetail_1.PropertyGasSafetyDetail();
                    _this.clearUnsafeDetail();
                }
                return _this.populateGasUnsafeReasons(_this._readyToShowToast)
                    .then(function () {
                    _this._readyToShowToast = true;
                });
            });
        };
        GasSafetyDetail.prototype.saveModel = function () {
            if (this.reasons && this.reasons.length === 0) {
                this.clearUnsafeDetail();
            }
            this._gasSafetyModel.eliReading = this.iniEliReadingSelected;
            this._gasSafetyModel.eliReadingReason = this.isNoEliReadingTaken ? this.noEliReadingsReasonSelected : undefined;
            this._gasSafetyModel.gasInstallationTightnessTestDone = this.gasInstallationTightnessTestDoneSelected;
            this._gasSafetyModel.gasMeterInstallationSatisfactory = this.gasMeterInstallationSatisfactorySelected;
            this._gasSafetyModel.pressureDrop = this.pressureDrop;
            this._gasSafetyModel.safetyAdviseNoticeLeft = this.safetyAdviceNoticeLeftSelected;
            this._gasSafetyModel.safetyAdviseNoticeLeftReason = this.reasonWhyText;
            var gasUnsafeDetailModel = new propertyUnsafeDetail_1.PropertyUnsafeDetail();
            gasUnsafeDetailModel.cappedTurnedOff = this.cappedTurnedOffSelected;
            gasUnsafeDetailModel.conditionAsLeft = this.conditionAsLeftSelected;
            gasUnsafeDetailModel.labelAttachedRemoved = this.labelAttachedRemovedSelected;
            gasUnsafeDetailModel.ownedByCustomer = this.ownedByCustomerSelected;
            gasUnsafeDetailModel.signatureObtained = this.signatureObtainedSelected;
            gasUnsafeDetailModel.letterLeft = this.letterLeftSelected;
            gasUnsafeDetailModel.report = this.report;
            gasUnsafeDetailModel.reasons = this.reasons ? this.reasons.map(function (r) { return r.catalogId; }) : [];
            this._gasSafetyModel.dataState = this.getFinalDataState();
            return this._propertySafetyService.saveGasSafetyDetails(this.jobId, this._gasSafetyModel, gasUnsafeDetailModel);
        };
        GasSafetyDetail.prototype.clearModel = function () {
            this._readyToShowToast = false;
            this.iniEliReadingSelected = undefined;
            this.gasInstallationTightnessTestDoneSelected = undefined;
            this.gasMeterInstallationSatisfactorySelected = undefined;
            this.noEliReadingsReasonSelected = undefined;
            this.reasonWhyText = undefined;
            this.pressureDrop = undefined;
            this.safetyAdviceNoticeLeftSelected = undefined;
            this.clearReasons();
            this.clearUnsafeDetail();
            this._readyToShowToast = true;
            return this.resetOptionFromGasMeterInstallationSatisfactoryLookup(this._gasMeterInstallationSatisfactoryNotApplicableOptionInstaPerm);
        };
        GasSafetyDetail.prototype.buildBusinessRules = function () {
            var _this = this;
            this._pressureDropThreshold = this.getBusinessRule("pressureDropThreshold");
            this.pressureDropDecimalPlaces = this.getBusinessRule("pressureDropDecimalPlaces");
            this._gasMeterInstallationSatisfactoryNotApplicableOption = this.getBusinessRule("gasMeterInstallationSatisfactoryNotApplicableOption");
            this._gasMeterInstallationSatisfactoryNotApplicableOptionYes = this.getBusinessRule("gasMeterInstallationSatisfactoryNotApplicableOptionYes");
            this._labelAttachedDisableOptions = (this.getBusinessRule("labelAttachedDisableOptions") || "").split(",");
            this._cappedTurnedOffDisabledOptions = (this.getBusinessRule("cappedTurnedOffDisabledOptions") || "").split(",");
            this._gasMeterInstallationSatisfactoryNotApplicableOptionInstaPerm = (this.getBusinessRule("gasMeterInstallationSatisfactoryNotApplicableOptionInstaPerm") || "");
            this._conditionAsLeftDisableOptions = (this.getBusinessRule("conditionAsLeftDisableOptions") || "").split(",");
            this._conditionAsLeftSelectedOptions = (this.getBusinessRule("conditionAsLeftSelectedOptions") || "").split(",");
            this._notToCurrentStdConditionAsLeftOptionSelected = (this.getBusinessRule("notToCurrentStdConditionAsLeftOptionSelected") || "").split(",");
            this._cappedTurnedOffDisabledOptionsForNotToCurrentStd = (this.getBusinessRule("cappedTurnedOffDisabledOptionsForNotToCurrentStd") || "").split(",");
            this._labelAttachedDisabledOptionsForNotToCurrentStd = (this.getBusinessRule("labelAttachedDisabledOptionsForNotToCurrentStd") || "").split(",");
            this._notToCurrentStdConditionAsLeftOptionSelectedSS = (this.getBusinessRule("notToCurrentStdConditionAsLeftOptionSelectedSS") || "");
            return this._businessRuleService.getQueryableRuleGroup("gasSafety").then(function (gasSafetyRuleGroup) {
                _this._conditionAsLeftImmediatelyDangerousOption = gasSafetyRuleGroup.getBusinessRule("conditionAsLeftImmediatelyDangerousOption");
                _this._cappedTurnedOffOptionsForWarningMsg = gasSafetyRuleGroup.getBusinessRule("cappedTurnedOffOptionsForWarningMsg").split(",");
            });
        };
        GasSafetyDetail.prototype.removeOptionFromGasMeterInstallationSatisfactoryLookup = function (option) {
            if (this.isLandlordJob || this.gasInstallationTightnessTestDoneSelected) {
                var buttonListItem = this.gasMeterInstallationSatisfactoryLookup
                    .find(function (btnListItem) { return (btnListItem.value === option); });
                if (buttonListItem) {
                    var index = this.gasMeterInstallationSatisfactoryLookup.indexOf(buttonListItem);
                    if (index !== -1) {
                        this.gasMeterInstallationSatisfactoryLookup.splice(index, 1);
                    }
                }
            }
        };
        // repopulate list and then remove the item as per removeOptionFromGasMeterInstallationSatisfactoryLookup
        GasSafetyDetail.prototype.resetOptionFromGasMeterInstallationSatisfactoryLookup = function (option) {
            var _this = this;
            this.gasMeterInstallationSatisfactoryLookup = [];
            return this._catalogService.getSafetyReasonCats(catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_GROUP_GAS_INST_SAT)
                .then(function (lookup) {
                _this.gasMeterInstallationSatisfactoryLookup = _this.toButtonListItemArray(lookup, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION);
                _this.removeOptionFromGasMeterInstallationSatisfactoryLookup(_this._gasMeterInstallationSatisfactoryNotApplicableOption);
            });
        };
        GasSafetyDetail.prototype.removeOptionFromConditionAsLeftLookup = function (option) {
            if (this.isLandlordJob) {
                var buttonListItem = this.conditionAsLeftLookup
                    .find(function (btnListItem) { return (btnListItem.value === option); });
                if (buttonListItem) {
                    var index = this.conditionAsLeftLookup.indexOf(buttonListItem);
                    if (index !== -1) {
                        this.conditionAsLeftLookup.splice(index, 1);
                    }
                }
            }
        };
        // repopulate list and then remove the item as per removeOptionFromConditionAsLeftLookup
        GasSafetyDetail.prototype.resetOptionFromConditionAsLeftLookup = function () {
            var _this = this;
            this.conditionAsLeftLookup = [];
            return this._catalogService.getSafetyNoticeTypes()
                .then(function (safetyNoticeTypes) {
                _this.conditionAsLeftLookup = _this.toButtonListItemArray(safetyNoticeTypes, catalogConstants_1.CatalogConstants.SAFETY_NOTICE_TYPE_ID, catalogConstants_1.CatalogConstants.SAFETY_NOTICE_TYPE_DESCRIPTION);
            });
        };
        GasSafetyDetail.prototype.loadCatalogs = function () {
            var _this = this;
            var catalogPromises = [
                this._catalogService.getSafetyActions()
                    .then(function (safetyActions) {
                    _this.cappedTurnedOffLookup = _this.toButtonListItemArray(safetyActions, catalogConstants_1.CatalogConstants.SAFETY_ACTION_ID, catalogConstants_1.CatalogConstants.SAFETY_ACTION_DESCRIPTION);
                }),
                this.resetOptionFromConditionAsLeftLookup(),
                this._catalogService.getSafetyNoticeStatuses()
                    .then(function (safetyNoticeStatus) {
                    _this.labelAttachedRemovedLookup = _this.toButtonListItemArray(safetyNoticeStatus, catalogConstants_1.CatalogConstants.SAFETY_NOTICE_STATUS_ID, catalogConstants_1.CatalogConstants.SAFETY_NOTICE_STATUS_DESCRIPTION);
                })
            ];
            return Promise.all(catalogPromises)
                .then(function () {
                return Promise.all([
                    _this._catalogService.getSafetyReadingCats(catalogConstants_1.CatalogConstants.SAFETY_READING_CAT_GROUP_INIT_ELI_READING),
                    _this._catalogService.getSafetyReasonCats(catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_GROUP_ELI_READ_WHY_NOT),
                    _this._catalogService.getSafetyReasonCats(catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_GROUP_GAS_INST_SAT),
                    _this.buildNoYesList(),
                    _this.buildNoYesList(),
                    _this.buildNoYesList(),
                    _this.buildNoYesList(),
                    _this.buildNoYesList()
                ])
                    .then(function (promiseResults) {
                    var iniEliReadingCatalog = promiseResults[0];
                    var noEliReadingCatalog = promiseResults[1];
                    var gasMeterInstallationSatisfactoryCatalog = promiseResults[2];
                    _this.iniEliReadingLookup = _this.toButtonListItemArray(iniEliReadingCatalog, catalogConstants_1.CatalogConstants.SAFETY_READING_CAT_ID, catalogConstants_1.CatalogConstants.SAFETY_READING_CAT_DESCRIPTION, GasSafetyDetail_1.numericComparisonSorter());
                    // the catalog itself doesn't have a value for "no eli readings taken"
                    var noEliReadingslabelKey = "noEliReadings";
                    _this.iniEliReadingLookup.push(new buttonListItem_1.ButtonListItem(_this.labels[noEliReadingslabelKey], catalogConstants_1.CatalogConstants.SAFETY_READING_CAT_NO_READING_TAKEN, false));
                    _this.noEliReadingsReasonLookup = _this.toButtonListItemArray(noEliReadingCatalog, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION);
                    _this.gasMeterInstallationSatisfactoryLookup = _this.toButtonListItemArray(gasMeterInstallationSatisfactoryCatalog, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION);
                    _this.safetyAdviceNoticeLeftLookup = promiseResults[3];
                    _this.gasInstallationTightnessTestDoneLookup = promiseResults[4];
                    _this.ownedByCustomerLookup = promiseResults[5];
                    _this.letterLeftLookup = promiseResults[6];
                    _this.signatureObtainedLookup = promiseResults[7];
                });
            });
        };
        GasSafetyDetail.prototype.populateGasUnsafeReasons = function (isToastRequired) {
            var _this = this;
            var pressureDropThreshold = this.getBusinessRule("pressureDropThreshold");
            var installationSatisfactoryNoType = this.getBusinessRule("gasInstallationNotSatisfactoryNoType");
            var installationSatisfactoryNoMeterType = this.getBusinessRule("gasInstallationNotSatisfactoryNoMeterType");
            return this._propertySafetyService.populateGasUnsafeReasons(this.pressureDrop, this.gasMeterInstallationSatisfactorySelected, pressureDropThreshold, installationSatisfactoryNoType, installationSatisfactoryNoMeterType, this.iniEliReadingSelected === catalogConstants_1.CatalogConstants.SAFETY_READING_CAT_NO_READING_TAKEN)
                .then(function (latestUnsafeReasons) {
                var currentWarnings = [];
                if (_this.reasons) {
                    _this.reasons.forEach(function (reason) {
                        currentWarnings.push(reason.label);
                    });
                }
                _this.reasons = latestUnsafeReasons;
                if (_this.reasons) {
                    /* If there are reasons that we didn't have before then show a toast for them */
                    _this.reasons.forEach(function (reason) {
                        reason.label = _this.getParameterisedLabel(reason.lookupId + "Unsafe", reason.params);
                        if (isToastRequired && currentWarnings.indexOf(reason.label) === -1) {
                            _this.showWarning(_this.getLabel("unsafeToast"), reason.label);
                        }
                    });
                }
            })
                .then(function () { return _this.validateAllRules(); });
        };
        GasSafetyDetail.prototype.clearUnsafeDetail = function () {
            this.report = undefined;
            this.conditionAsLeftSelected = undefined;
            this.cappedTurnedOffSelected = undefined;
            this.labelAttachedRemovedSelected = undefined;
            this.ownedByCustomerSelected = undefined;
            this.letterLeftSelected = undefined;
            this.signatureObtainedSelected = undefined;
        };
        GasSafetyDetail.prototype.clearReasons = function () {
            this.reasons = [];
            this.gasMeterInstallationSatisfactoryDisabled = false;
        };
        GasSafetyDetail.prototype.shouldValidateReportFields = function () {
            var isAMandatoryUnsafeReasonPresent = this.reasons && this.reasons.filter(function (x) { return x.isMandatory; }).length > 0;
            var isAnyUnsafeReasonPresent = this.reasons && this.reasons.length > 0;
            var isAnyReportFieldCompleted = !!(this.conditionAsLeftSelected || this.cappedTurnedOffSelected || this.labelAttachedRemovedSelected
                || this.ownedByCustomerSelected || this.letterLeftSelected || this.signatureObtainedSelected
                || this.report);
            return isAMandatoryUnsafeReasonPresent || (isAnyUnsafeReasonPresent && isAnyReportFieldCompleted);
        };
        GasSafetyDetail.prototype.buildValidationRules = function () {
            var _this = this;
            return this.buildValidation([
                { property: "reasonWhyText", condition: function () { return _this.safetyAdviceNoticeLeftSelected === true; } },
                { property: "pressureDrop", condition: function () { return _this.gasInstallationTightnessTestDoneSelected === true; } },
                {
                    property: "noEliReadingsReasonSelected",
                    condition: function () { return _this.iniEliReadingSelected === catalogConstants_1.CatalogConstants.SAFETY_READING_CAT_NO_READING_TAKEN; }
                },
                {
                    property: "conditionAsLeftSelected",
                    groups: ["unsafeReport"],
                    condition: function () { return _this.shouldValidateReportFields(); }
                },
                {
                    property: "cappedTurnedOffSelected",
                    groups: ["unsafeReport"],
                    condition: function () { return _this.shouldValidateReportFields(); }
                },
                {
                    property: "labelAttachedRemovedSelected",
                    groups: ["unsafeReport"],
                    condition: function () { return _this.shouldValidateReportFields(); }
                },
                {
                    property: "ownedByCustomerSelected",
                    groups: ["unsafeReport"],
                    condition: function () { return _this.shouldValidateReportFields(); }
                },
                {
                    property: "letterLeftSelected",
                    groups: ["unsafeReport"],
                    condition: function () { return _this.shouldValidateReportFields(); }
                },
                {
                    property: "signatureObtainedSelected",
                    groups: ["unsafeReport"],
                    condition: function () { return _this.shouldValidateReportFields(); }
                },
                { property: "report", groups: ["unsafeReport"], condition: function () { return _this.shouldValidateReportFields(); } }
            ]);
        };
        GasSafetyDetail.prototype.showUnsafeWarningMessage = function () {
            var _this = this;
            return this.conditionAsLeftSelected
                && this.cappedTurnedOffSelected
                && this.conditionAsLeftSelected === this._conditionAsLeftImmediatelyDangerousOption
                && this._cappedTurnedOffOptionsForWarningMsg.some(function (c) { return _this.cappedTurnedOffSelected === c; });
        };
        __decorate([
            aurelia_binding_1.observable(),
            __metadata("design:type", String)
        ], GasSafetyDetail.prototype, "iniEliReadingSelected", void 0);
        __decorate([
            aurelia_binding_1.observable(),
            __metadata("design:type", Boolean)
        ], GasSafetyDetail.prototype, "gasInstallationTightnessTestDoneSelected", void 0);
        __decorate([
            aurelia_binding_1.observable(),
            __metadata("design:type", Number)
        ], GasSafetyDetail.prototype, "pressureDrop", void 0);
        __decorate([
            aurelia_binding_1.observable(),
            __metadata("design:type", String)
        ], GasSafetyDetail.prototype, "gasMeterInstallationSatisfactorySelected", void 0);
        __decorate([
            aurelia_binding_1.observable(),
            __metadata("design:type", String)
        ], GasSafetyDetail.prototype, "conditionAsLeftSelected", void 0);
        __decorate([
            aurelia_binding_1.observable(),
            __metadata("design:type", String)
        ], GasSafetyDetail.prototype, "cappedTurnedOffSelected", void 0);
        GasSafetyDetail = GasSafetyDetail_1 = __decorate([
            aurelia_framework_1.inject(catalogService_1.CatalogService, labelService_1.LabelService, propertySafetyService_1.PropertySafetyService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, jobService_1.JobService, engineerService_1.EngineerService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService),
            __metadata("design:paramtypes", [Object, Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, Object, Object])
        ], GasSafetyDetail);
        return GasSafetyDetail;
        var GasSafetyDetail_1;
    }(editableViewModel_1.EditableViewModel));
    exports.GasSafetyDetail = GasSafetyDetail;
});

//# sourceMappingURL=gasSafetyDetail.js.map
