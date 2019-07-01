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
define(["require", "exports", "aurelia-framework", "../../../business/services/applianceService", "aurelia-event-aggregator", "../../../business/services/labelService", "aurelia-dialog", "../../../business/services/catalogService", "../../models/businessRulesViewModel", "../../../business/services/businessRuleService", "../../../business/services/validationService", "./appliancePageHelper"], function (require, exports, aurelia_framework_1, applianceService_1, aurelia_event_aggregator_1, labelService_1, aurelia_dialog_1, catalogService_1, businessRulesViewModel_1, businessRuleService_1, validationService_1, appliancePageHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PrevOtherSafety = /** @class */ (function (_super) {
        __extends(PrevOtherSafety, _super);
        function PrevOtherSafety(labelService, applianceService, eventAggregator, dialogService, validationService, businessRuleService, catalogService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService) || this;
            _this._applianceService = applianceService;
            _this._catalogService = catalogService;
            _this.isEmpty = false;
            return _this;
        }
        PrevOtherSafety.prototype.canActivateAsync = function () {
            var rest = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rest[_i] = arguments[_i];
            }
            return appliancePageHelper_1.AppliancePageHelper.checkApplianceSafetyType(this._applianceService, rest);
        };
        PrevOtherSafety.prototype.activateAsync = function (params) {
            var _this = this;
            this._jobId = params.jobId;
            this._applianceId = params.applianceId;
            if (this._isCleanInstance) {
                return this.loadCatalogs()
                    .then(function () { return _this.loadModel(); })
                    .then(function () { return _this.showContent(); });
            }
            else {
                return this.loadModel();
            }
        };
        PrevOtherSafety.prototype.loadModel = function () {
            var _this = this;
            return this._applianceService.getAppliance(this._jobId, this._applianceId)
                .then(function (appliance) {
                if (appliance) {
                    _this.isEmpty = _this.isModelEmpty(appliance.safety.previousApplianceUnsafeDetail);
                    _this.safety = appliance.safety.previousApplianceUnsafeDetail;
                }
            });
        };
        PrevOtherSafety.prototype.loadCatalogs = function () {
            var _this = this;
            var catalogPromises = [
                this.buildYesNoList()
                    .then(function (btns) { return _this.applianceSafeLookup = btns; }),
                this.buildYesNoList()
                    .then(function (btns) { return _this.installationSafeLookup = btns; }),
                this._catalogService.getSafetyNoticeTypes()
                    .then(function (safetyNoticeTypes) { _this.noticeTypeCatalog = safetyNoticeTypes; }),
                this._catalogService.getSafetyActions()
                    .then(function (safetyActions) { _this.safetyActionTypeCatalog = safetyActions; }),
                this._catalogService.getSafetyNoticeStatuses()
                    .then(function (safetyNoticeStatus) { _this.noticeStatusCatalog = safetyNoticeStatus; })
            ];
            return Promise.all(catalogPromises).then(function () { });
        };
        PrevOtherSafety.prototype.isModelEmpty = function (previous) {
            var isEmpty = false;
            if (previous) {
                if (!previous.actionCode &&
                    !previous.applianceSafe &&
                    !previous.date &&
                    !previous.installationSafe &&
                    !previous.noticeStatus &&
                    !previous.noticeType &&
                    !previous.progress &&
                    !previous.report) {
                    isEmpty = true;
                }
            }
            else {
                isEmpty = true;
            }
            return isEmpty;
        };
        PrevOtherSafety = __decorate([
            aurelia_framework_1.inject(labelService_1.LabelService, applianceService_1.ApplianceService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService),
            __metadata("design:paramtypes", [Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, Object])
        ], PrevOtherSafety);
        return PrevOtherSafety;
    }(businessRulesViewModel_1.BusinessRulesViewModel));
    exports.PrevOtherSafety = PrevOtherSafety;
});

//# sourceMappingURL=prevOtherSafety.js.map
