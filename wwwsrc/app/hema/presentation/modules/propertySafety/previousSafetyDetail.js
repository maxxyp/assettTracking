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
define(["require", "exports", "aurelia-framework", "../../../business/services/propertySafetyService", "../../../business/services/labelService", "../../models/baseViewModel", "../../../business/services/jobService", "../../../business/services/catalogService", "aurelia-event-aggregator", "aurelia-dialog", "../../../business/services/constants/catalogConstants"], function (require, exports, aurelia_framework_1, propertySafetyService_1, labelService_1, baseViewModel_1, jobService_1, catalogService_1, aurelia_event_aggregator_1, aurelia_dialog_1, catalogConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PreviousSafetyDetail = /** @class */ (function (_super) {
        __extends(PreviousSafetyDetail, _super);
        function PreviousSafetyDetail(labelService, eventAggregator, dialogService, propertySafetyService, jobService, catalogService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this._propertySafetyService = propertySafetyService;
            _this._jobService = jobService;
            _this._catalogService = catalogService;
            return _this;
        }
        PreviousSafetyDetail.prototype.activateAsync = function (params) {
            var _this = this;
            this._jobId = params.jobId;
            return this._jobService.getJob(this._jobId).then(function (job) {
                _this.hasData = !!(job.propertySafety && (job.propertySafety.previousPropertySafetyDetail));
                _this.showContent();
            });
        };
        PreviousSafetyDetail.prototype.attachedAsync = function () {
            var _this = this;
            return this.loadCatalogs().then(function () {
                return _this._propertySafetyService.getPropertySafetyDetails(_this._jobId)
                    .then(function (safetyDetail) {
                    var previousPropertySafety = safetyDetail.previousPropertySafetyDetail;
                    if (!previousPropertySafety) {
                        return;
                    }
                    _this.lastVisitDate = previousPropertySafety.lastVisitDate;
                    _this.safetyNoticeNotLeftReason = previousPropertySafety.safetyNoticeNotLeftReason;
                    _this.report = previousPropertySafety.report;
                    if (previousPropertySafety.reasons) {
                        var reasonDescriptions_1 = [];
                        previousPropertySafety.reasons.forEach(function (x) {
                            var unsafeReasonResult = _this._unsafeReasonLookup.find(function (c) { return c.safetyReasonCategoryCode === x; });
                            if (unsafeReasonResult && unsafeReasonResult.safetyReasonCategoryReason) {
                                reasonDescriptions_1.push(unsafeReasonResult.safetyReasonCategoryReason);
                            }
                        });
                        _this.unsafeSituation = reasonDescriptions_1.join(",");
                    }
                    _this._catalogService.getSafetyNoticeType(previousPropertySafety.conditionAsLeft)
                        .then(function (conditionAsLeftResult) {
                        if (conditionAsLeftResult) {
                            _this.conditionAsLeft = conditionAsLeftResult.safetyNoticeTypeDescription;
                        }
                    });
                    _this._catalogService.getSafetyAction(previousPropertySafety.cappedOrTurnedOff)
                        .then(function (cappedTurnedOffResult) {
                        if (cappedTurnedOffResult) {
                            _this.cappedTurnedOff = cappedTurnedOffResult.safetyActionDescription;
                        }
                    });
                    _this._catalogService.getSafetyNoticeStatus(previousPropertySafety.labelAttachedOrRemoved)
                        .then(function (labelAttachedResult) {
                        if (labelAttachedResult) {
                            _this.labelAttached = labelAttachedResult.safetyNoticeStatusDescription;
                        }
                    });
                    _this.ownedByCustomer = previousPropertySafety.ownedByCustomer ? "Yes" : "No";
                    _this.letterLeft = previousPropertySafety.letterLeft ? "Yes" : "No";
                    _this.signatureObtained = previousPropertySafety.signatureObtained ? "Yes" : "No";
                });
            });
        };
        PreviousSafetyDetail.prototype.loadCatalogs = function () {
            var _this = this;
            return this._catalogService.getSafetyReasonCats(catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_GROUP_UNSAFE_REASON)
                .then(function (safetyReasons) {
                _this._unsafeReasonLookup = safetyReasons;
            });
        };
        PreviousSafetyDetail = __decorate([
            aurelia_framework_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, propertySafetyService_1.PropertySafetyService, jobService_1.JobService, catalogService_1.CatalogService),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, Object])
        ], PreviousSafetyDetail);
        return PreviousSafetyDetail;
    }(baseViewModel_1.BaseViewModel));
    exports.PreviousSafetyDetail = PreviousSafetyDetail;
});

//# sourceMappingURL=previousSafetyDetail.js.map
