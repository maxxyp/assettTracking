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
define(["require", "exports", "aurelia-framework", "aurelia-dependency-injection", "../../../business/models/risk", "../../../business/services/labelService", "../../../business/services/validationService", "../../models/editableViewModel", "../../../business/services/businessRuleService", "aurelia-event-aggregator", "../../../business/services/catalogService", "../../../business/services/riskService", "../../../business/services/jobService", "../../../../common/core/guid", "aurelia-router", "../../../business/services/engineerService", "aurelia-dialog", "../../../business/services/constants/catalogConstants"], function (require, exports, aurelia_framework_1, aurelia_dependency_injection_1, risk_1, labelService_1, validationService_1, editableViewModel_1, businessRuleService_1, aurelia_event_aggregator_1, catalogService_1, riskService_1, jobService_1, guid_1, aurelia_router_1, engineerService_1, aurelia_dialog_1, catalogConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RiskItem = /** @class */ (function (_super) {
        __extends(RiskItem, _super);
        function RiskItem(catalogService, jobService, engineerService, labelService, riskService, eventAggregator, dialogService, validationService, businessRulesService, router) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService) || this;
            _this._riskService = riskService;
            _this._router = router;
            return _this;
        }
        RiskItem.prototype.activateAsync = function (params) {
            var _this = this;
            this._riskId = params.riskId;
            return this._riskService.getRisks(params.jobId).then(function (risks) {
                _this._risks = risks || [];
                if (_this._isCleanInstance) {
                    return _this.buildValidation([
                        { property: "location", condition: function () { return _this.isHazard; } },
                        { property: "report", condition: function () { return !_this.isHazard; } },
                    ])
                        .then(function () { return _this.loadBusinessRules(); })
                        .then(function () {
                        _this._hazardReason = _this.getBusinessRule("hazard");
                        _this._riskException = (_this.getBusinessRule("riskException") || "").split(",");
                    })
                        .then(function () { return _this.loadCatalogs(); })
                        .then(function () { return _this.load(); })
                        .then(function () { return _this.showContent(); });
                }
                else {
                    return _this.load();
                }
            });
        };
        RiskItem.prototype.completeOk = function () {
            var _this = this;
            return this.saveModel()
                .then(function () {
                _this.notifyDataStateChanged();
                _this._router.navigateToRoute("risks");
            });
        };
        RiskItem.prototype.completeCancel = function () {
            this._router.navigateToRoute("risks");
        };
        RiskItem.prototype.reasonChanged = function (newReason, oldReason) {
            this.isHazard = newReason && newReason === this._hazardReason;
        };
        RiskItem.prototype.loadModel = function () {
            var _this = this;
            if (this._riskId === guid_1.Guid.empty) {
                this.reason = "";
                this.report = "";
                this.location = "";
                this.isHazard = false;
                this.setNewDataState("risks");
                this.isNew = true;
                this.reasonButtons.forEach(function (reasonButton) {
                    /* can only have one of each type or risk, so disable any existing ones */
                    reasonButton.disabled = !!_this._risks.find(function (r) { return r.reason === reasonButton.value && !(_this._riskException.indexOf(r.reason) !== -1); });
                });
                return Promise.resolve();
            }
            else {
                return this._riskService.getRisk(this.jobId, this._riskId)
                    .then(function (risk) {
                    _this.isNew = false;
                    _this.reason = risk.reason;
                    _this.isHazard = risk.isHazard;
                    _this.location = _this.isHazard ? risk.report : undefined;
                    _this.report = !_this.isHazard ? risk.report : undefined;
                    _this.setInitialDataState(risk.dataStateId, risk.dataState);
                    _this.reasonButtons.forEach(function (reasonButton) {
                        /* can only have one of each type or risk, so disable any existing ones
                        * as long as its not the current selection */
                        reasonButton.disabled = !!_this._risks.find(function (r) { return r.reason === reasonButton.value && r.reason !== _this.reason; });
                    });
                });
            }
        };
        RiskItem.prototype.clearModel = function () {
            this.location = undefined;
            this.report = undefined;
            this.reason = undefined;
            return Promise.resolve();
        };
        RiskItem.prototype.saveModel = function () {
            var risk = new risk_1.Risk();
            risk.isHazard = this.reason === this._hazardReason;
            risk.reason = this.reason;
            risk.report = this.isHazard ? this.location : this.report;
            risk.dataState = this.getFinalDataState();
            if (this._riskId === guid_1.Guid.empty) {
                if (this.isCompleteTriggeredAlready) {
                    return Promise.resolve();
                }
                this.isCompleteTriggeredAlready = true;
                return this._riskService.addRisk(this.jobId, risk).then(function () { });
            }
            else {
                risk.id = this._riskId;
                return this._riskService.updateRisk(this.jobId, risk);
            }
        };
        RiskItem.prototype.loadCatalogs = function () {
            var _this = this;
            return this._catalogService.getSafetyReasonCats(catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_GROUP_RISK_REASON)
                .then(function (safetyReasons) {
                safetyReasons = safetyReasons || [];
                safetyReasons.push({
                    safetyReasonCategoryCode: _this._hazardReason,
                    safetyReasonCategoryReason: _this.getLabel("hazardReason")
                });
                _this.reasonButtons = _this.toButtonListItemArray(safetyReasons, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_ID, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_DESCRIPTION);
            });
        };
        __decorate([
            aurelia_framework_1.observable,
            __metadata("design:type", String)
        ], RiskItem.prototype, "reason", void 0);
        RiskItem = __decorate([
            aurelia_dependency_injection_1.inject(catalogService_1.CatalogService, jobService_1.JobService, engineerService_1.EngineerService, labelService_1.LabelService, riskService_1.RiskService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, aurelia_router_1.Router),
            __metadata("design:paramtypes", [Object, Object, Object, Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, aurelia_router_1.Router])
        ], RiskItem);
        return RiskItem;
    }(editableViewModel_1.EditableViewModel));
    exports.RiskItem = RiskItem;
});

//# sourceMappingURL=riskItem.js.map
