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
define(["require", "exports", "aurelia-binding", "aurelia-framework", "../../../business/services/catalogService", "../../../business/services/propertySafetyService", "../../../business/models/propertyElectricalSafetyDetail", "../../../business/services/validationService", "../../../business/services/businessRuleService", "../../../business/services/labelService", "../../models/editableViewModel", "../../../business/services/jobService", "aurelia-event-aggregator", "../../../business/models/propertyUnsafeDetail", "../../../business/services/engineerService", "aurelia-dialog", "../../../business/services/constants/catalogConstants"], function (require, exports, aurelia_binding_1, aurelia_framework_1, catalogService_1, propertySafetyService_1, propertyElectricalSafetyDetail_1, validationService_1, businessRuleService_1, labelService_1, editableViewModel_1, jobService_1, aurelia_event_aggregator_1, propertyUnsafeDetail_1, engineerService_1, aurelia_dialog_1, catalogConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ElectricalSafetyDetail = /** @class */ (function (_super) {
        __extends(ElectricalSafetyDetail, _super);
        function ElectricalSafetyDetail(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService, propertySafetyService) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService) || this;
            _this._catalogService = catalogService;
            _this._propertySafetyService = propertySafetyService;
            _this.consumerUnitSatisfactoryLookup = [];
            _this.systemTypeLookup = [];
            _this.rcdPresentLookup = [];
            _this.eliSafeAccordingToTopsLookup = [];
            return _this;
        }
        ElectricalSafetyDetail.prototype.iniEliReadingChanged = function () {
            this.populateElectricalUnsafeReasons(this._readyToShowToast);
            this.setEliSafeAccordingToTops();
        };
        ElectricalSafetyDetail.prototype.conditionAsLeftSelectedChanged = function () {
            if (this.conditionAsLeftSelected) {
                // set the first one since its only got "A" in it
                this.labelAttachedRemovedSelected = this.labelAttachedRemovedLookup[0].value;
            }
            else {
                this.labelAttachedRemovedSelected = "";
            }
        };
        ElectricalSafetyDetail.prototype.systemTypeChanged = function () {
            this.populateElectricalUnsafeReasons(this._readyToShowToast);
            this.setEliSafeAccordingToTops();
        };
        ElectricalSafetyDetail.prototype.rcdPresentChanged = function () {
            this.populateElectricalUnsafeReasons(this._readyToShowToast);
        };
        ElectricalSafetyDetail.prototype.eliSafeAccordingToTopsChanged = function () {
            this.populateElectricalUnsafeReasons(this._readyToShowToast);
        };
        ElectricalSafetyDetail.prototype.ttSystemTypeChanged = function () {
            this.setEliSafeAccordingToTops();
        };
        ElectricalSafetyDetail.prototype.consumerUnitSatisfactoryChanged = function () {
            this.populateElectricalUnsafeReasons(this._readyToShowToast);
        };
        ElectricalSafetyDetail.prototype.activateAsync = function () {
            var _this = this;
            return this.loadBusinessRules()
                .then(function () { return _this.buildBusinessRules(); })
                .then(function () { return _this.buildValidationRules(); })
                .then(function () { return _this.loadCatalogs(); })
                .then(function () { return _this.load(); })
                .then(function () { return _this.showContent(); });
        };
        ElectricalSafetyDetail.prototype.toggleNoEliReadings = function () {
            this.noEliReadings = !this.noEliReadings;
            this.iniEliReading = null;
            this.populateElectricalUnsafeReasons(true);
        };
        ElectricalSafetyDetail.prototype.loadModel = function () {
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
                _this.iniEliReading = safetyDetail.propertyElectricalSafetyDetail.eliReading;
                _this.noEliReadingsReason = safetyDetail.propertyElectricalSafetyDetail.eliReadingReason;
                _this.noEliReadings = safetyDetail.propertyElectricalSafetyDetail.noEliReadings;
                _this.consumerUnitSatisfactory = safetyDetail.propertyElectricalSafetyDetail.consumerUnitSatisfactory;
                _this.systemType = safetyDetail.propertyElectricalSafetyDetail.systemType;
                _this.rcdPresent = safetyDetail.propertyElectricalSafetyDetail.rcdPresent;
                _this.eliSafeAccordingToTops = safetyDetail.propertyElectricalSafetyDetail.eliSafeAccordingToTops;
                _this.setInitialDataState(safetyDetail.propertyElectricalSafetyDetail.dataStateId, safetyDetail.propertyElectricalSafetyDetail.dataState);
                if (safetyDetail && safetyDetail.propertyUnsafeDetail) {
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
                return _this.populateElectricalUnsafeReasons(_this._readyToShowToast)
                    .then(function () { _this._readyToShowToast = true; });
            });
        };
        ElectricalSafetyDetail.prototype.saveModel = function () {
            if (!this.hasReason()) {
                this.clearUnsafeDetail();
            }
            var safetyDetailModel = new propertyElectricalSafetyDetail_1.PropertyElectricalSafetyDetail();
            safetyDetailModel.eliReading = this.iniEliReading;
            safetyDetailModel.noEliReadings = this.noEliReadings;
            safetyDetailModel.eliReadingReason = this.noEliReadingsReason;
            safetyDetailModel.consumerUnitSatisfactory = this.consumerUnitSatisfactory;
            safetyDetailModel.systemType = this.systemType;
            safetyDetailModel.rcdPresent = this.rcdPresent;
            safetyDetailModel.eliSafeAccordingToTops = this.eliSafeAccordingToTops;
            safetyDetailModel.dataState = this.getFinalDataState();
            var unsafeDetailModel = new propertyUnsafeDetail_1.PropertyUnsafeDetail();
            unsafeDetailModel.cappedTurnedOff = this.cappedTurnedOffSelected;
            unsafeDetailModel.conditionAsLeft = this.conditionAsLeftSelected;
            unsafeDetailModel.labelAttachedRemoved = this.labelAttachedRemovedSelected;
            unsafeDetailModel.ownedByCustomer = this.ownedByCustomerSelected;
            unsafeDetailModel.signatureObtained = this.signatureObtainedSelected;
            unsafeDetailModel.letterLeft = this.letterLeftSelected;
            unsafeDetailModel.report = this.report;
            unsafeDetailModel.reasons = this.reasons ? this.reasons.map(function (r) { return r.catalogId; }) : [];
            return this._propertySafetyService.saveElectricalSafetyDetails(this.jobId, safetyDetailModel, unsafeDetailModel);
        };
        ElectricalSafetyDetail.prototype.clearModel = function () {
            this._readyToShowToast = false;
            // .DF_1582 noEliReadings must be cleared before iniEliReading due to the change handler on iniEliReadings
            //  firing off populateElectricalUnsafeReasons(). If we don't do this, when populateElectricalUnsafeReasons() gets fired
            //  it will use the old version of noEliReadings and register a false positive unsafe reason.
            this.noEliReadings = undefined;
            this.iniEliReading = undefined;
            this.noEliReadingsReason = undefined;
            this.consumerUnitSatisfactory = undefined;
            this.systemType = undefined;
            this.rcdPresent = undefined;
            this.eliSafeAccordingToTops = undefined;
            this.report = undefined;
            this.showEliSafeAccordingToTops = false;
            this.clearUnsafeDetail();
            this.clearReasons();
            this._readyToShowToast = true;
            return Promise.resolve();
        };
        ElectricalSafetyDetail.prototype.loadCatalogs = function () {
            var _this = this;
            var catalogPromises = [
                this._catalogService.getSafetyActions()
                    .then(function (safetyActions) {
                    _this.cappedTurnedOffLookup = _this.toButtonListItemArray(safetyActions, catalogConstants_1.CatalogConstants.SAFETY_ACTION_ID, catalogConstants_1.CatalogConstants.SAFETY_ACTION_DESCRIPTION);
                }),
                this._catalogService.getSafetyNoticeTypes()
                    .then(function (safetyNoticeTypes) {
                    var availableNoticeTypeCodes = _this.getBusinessRule("availableConditionAsLeftCodes").split(",");
                    var availableNoticeTypes = safetyNoticeTypes.filter(function (safetyNoticeType) { return availableNoticeTypeCodes.indexOf(safetyNoticeType.noticeType) > -1; });
                    _this.conditionAsLeftLookup = _this.toButtonListItemArray(availableNoticeTypes, catalogConstants_1.CatalogConstants.SAFETY_NOTICE_TYPE_ID, catalogConstants_1.CatalogConstants.SAFETY_NOTICE_TYPE_DESCRIPTION);
                }),
                this._catalogService.getSafetyNoticeStatuses()
                    .then(function (safetyNoticeStatuses) {
                    var availableNoticeStatusCodes = _this.getBusinessRule("availableLabelAttachedCodes").split(",");
                    var availableNoticeStatuses = safetyNoticeStatuses.filter(function (safetyNoticeStatus) { return availableNoticeStatusCodes.indexOf(safetyNoticeStatus.noticeStatus) > -1; });
                    _this.labelAttachedRemovedLookup = _this.toButtonListItemArray(availableNoticeStatuses, catalogConstants_1.CatalogConstants.SAFETY_NOTICE_STATUS_ID, catalogConstants_1.CatalogConstants.SAFETY_NOTICE_STATUS_DESCRIPTION);
                }),
                this._catalogService.getSafetyReasonCats(catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_GROUP_RCD_PRESENT)
                    .then(function (safetyReasonCats) {
                    _this.rcdPresentLookup = _this.toButtonListItemArray(safetyReasonCats, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_ID, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION);
                }),
                this._catalogService.getElectricalSystemTypes()
                    .then(function (electricalSystemTypes) {
                    _this.systemTypeLookup = _this.toButtonListItemArray(electricalSystemTypes, catalogConstants_1.CatalogConstants.ELECTRICAL_SYSTEM_TYPE_ID, catalogConstants_1.CatalogConstants.ELECTRICAL_SYSTEM_TYPE_DESCRIPTION);
                }),
                this.buildNoYesList().then(function (yesNo) { return _this.consumerUnitSatisfactoryLookup = yesNo; }),
                this.buildNoYesList().then(function (yesNo) { return _this.eliSafeAccordingToTopsLookup = yesNo; }),
                this.buildNoYesList().then(function (yesNo) { return _this.ownedByCustomerLookup = yesNo; }),
                this.buildNoYesList().then(function (yesNo) { return _this.letterLeftLookup = yesNo; }),
                this.buildNoYesList().then(function (yesNo) { return _this.signatureObtainedLookup = yesNo; }),
            ];
            return Promise.all(catalogPromises).then(function () { });
        };
        ElectricalSafetyDetail.prototype.hasReason = function () {
            return this.reasons && this.reasons.length > 0;
        };
        ElectricalSafetyDetail.prototype.populateElectricalUnsafeReasons = function (isToastRequired) {
            var _this = this;
            var rcdPresentThreshold = this.getBusinessRule("rcdPresentThreshold");
            var safetyDetail = new propertyElectricalSafetyDetail_1.PropertyElectricalSafetyDetail();
            safetyDetail.consumerUnitSatisfactory = this.consumerUnitSatisfactory;
            safetyDetail.systemType = this.systemType;
            safetyDetail.noEliReadings = this.noEliReadings;
            safetyDetail.rcdPresent = this.rcdPresent;
            safetyDetail.eliReading = this.iniEliReading;
            safetyDetail.eliSafeAccordingToTops = this.eliSafeAccordingToTops;
            return this._propertySafetyService.populateElectricalUnsafeReasons(safetyDetail, this.unableToCheckSystemType, this.ttSystemType, rcdPresentThreshold, this.safeInTopsThreshold)
                .then(function (reasons) {
                var currentWarnings = [];
                if (_this.reasons) {
                    _this.reasons.forEach(function (reason) {
                        currentWarnings.push(reason.label);
                    });
                }
                _this.reasons = reasons;
                if (_this.reasons) {
                    /* If there are reasons that we didn't have before then show a toast for them */
                    _this.reasons.forEach(function (reason) {
                        reason.label = _this.getParameterisedLabel(reason.lookupId + "Unsafe", reason.params);
                        if (isToastRequired && currentWarnings.indexOf(reason.label) === -1) {
                            _this.showWarning(_this.getLabel("unsafeToast"), reason.label);
                        }
                    });
                }
            });
        };
        ElectricalSafetyDetail.prototype.clearUnsafeDetail = function () {
            this.conditionAsLeftSelected = undefined;
            this.cappedTurnedOffSelected = undefined;
            this.labelAttachedRemovedSelected = undefined;
            this.ownedByCustomerSelected = undefined;
            this.letterLeftSelected = undefined;
            this.signatureObtainedSelected = undefined;
        };
        ElectricalSafetyDetail.prototype.clearReasons = function () {
            this.reasons = [];
        };
        ElectricalSafetyDetail.prototype.buildBusinessRules = function () {
            this.ttSystemType = this.getBusinessRule("ttSystemType");
            this.unableToCheckSystemType = this.getBusinessRule("unableToCheckSystemType");
            this.safeInTopsThreshold = this.getBusinessRule("safeInTopsThreshold");
            this.iniEliReadingDecimalPlaces = this.getBusinessRule("iniEliReadingDecimalPlaces");
        };
        ElectricalSafetyDetail.prototype.buildValidationRules = function () {
            var _this = this;
            return this.buildValidation([
                { property: "iniEliReading", condition: function () { return !_this.noEliReadings; } },
                {
                    property: "rcdPresent",
                    condition: function () { return (_this.systemType === _this.ttSystemType) && !_this.noEliReadings; }
                },
                {
                    property: "eliSafeAccordingToTops",
                    condition: function () { return (_this.systemType !== _this.ttSystemType) && (_this.iniEliReading > _this.safeInTopsThreshold); }
                },
                { property: "conditionAsLeftSelected", condition: function () { return _this.hasReason(); } },
                { property: "cappedTurnedOffSelected", condition: function () { return _this.hasReason(); } },
                { property: "labelAttachedRemovedSelected", condition: function () { return _this.hasReason(); } },
                { property: "ownedByCustomerSelected", condition: function () { return _this.hasReason(); } },
                { property: "letterLeftSelected", condition: function () { return _this.hasReason(); } },
                { property: "signatureObtainedSelected", condition: function () { return _this.hasReason(); } },
                { property: "report", condition: function () { return _this.hasReason(); } }
            ]);
        };
        ElectricalSafetyDetail.prototype.setEliSafeAccordingToTops = function () {
            this.showEliSafeAccordingToTops = false;
            if (this.systemType && this.ttSystemType && this.iniEliReading !== undefined && this.safeInTopsThreshold) {
                if (this.systemType !== this.ttSystemType && this.iniEliReading > this.safeInTopsThreshold) {
                    this.showEliSafeAccordingToTops = true;
                }
                else {
                    this.eliSafeAccordingToTops = undefined;
                }
            }
        };
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", Number)
        ], ElectricalSafetyDetail.prototype, "iniEliReading", void 0);
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", Boolean)
        ], ElectricalSafetyDetail.prototype, "consumerUnitSatisfactory", void 0);
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", String)
        ], ElectricalSafetyDetail.prototype, "systemType", void 0);
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", String)
        ], ElectricalSafetyDetail.prototype, "rcdPresent", void 0);
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", Boolean)
        ], ElectricalSafetyDetail.prototype, "eliSafeAccordingToTops", void 0);
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", String)
        ], ElectricalSafetyDetail.prototype, "ttSystemType", void 0);
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", String)
        ], ElectricalSafetyDetail.prototype, "unableToCheckSystemType", void 0);
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", String)
        ], ElectricalSafetyDetail.prototype, "conditionAsLeftSelected", void 0);
        ElectricalSafetyDetail = __decorate([
            aurelia_framework_1.inject(jobService_1.JobService, engineerService_1.EngineerService, labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService, propertySafetyService_1.PropertySafetyService),
            __metadata("design:paramtypes", [Object, Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, Object, Object])
        ], ElectricalSafetyDetail);
        return ElectricalSafetyDetail;
    }(editableViewModel_1.EditableViewModel));
    exports.ElectricalSafetyDetail = ElectricalSafetyDetail;
});

//# sourceMappingURL=electricalSafetyDetail.js.map
