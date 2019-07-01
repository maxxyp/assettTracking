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
define(["require", "exports", "aurelia-dependency-injection", "aurelia-event-aggregator", "aurelia-dialog", "../../../models/businessRulesViewModel", "../../../../business/services/labelService", "../../../../business/services/businessRuleService", "../../../../business/services/catalogService", "../../../../../common/core/services/assetService", "../../../factories/landlordFactory", "../../../../business/services/validationService", "aurelia-framework", "../../../../business/services/constants/catalogConstants", "../../../../business/services/landlordService"], function (require, exports, aurelia_dependency_injection_1, aurelia_event_aggregator_1, aurelia_dialog_1, businessRulesViewModel_1, labelService_1, businessRuleService_1, catalogService_1, assetService_1, landlordFactory_1, validationService_1, aurelia_framework_1, catalogConstants_1, landlordService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LandlordSafetyCertificate = /** @class */ (function (_super) {
        __extends(LandlordSafetyCertificate, _super);
        function LandlordSafetyCertificate(labelService, eventAggregator, dialogService, catalogService, businessRulesService, landlordFactory, assetService, controller, validationService, landlordService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService) || this;
            _this._catalogService = catalogService;
            _this._landlordFactory = landlordFactory;
            _this._assetService = assetService;
            _this.controller = controller;
            _this._landlordService = landlordService;
            return _this;
        }
        LandlordSafetyCertificate.prototype.activateAsync = function (params) {
            var _this = this;
            this._jobId = params.jobId;
            return this.loadBusinessRules()
                .then(function () {
                return Promise.all([
                    _this._landlordService.getLandlordSafetyCertificate(_this._jobId),
                    _this._assetService.loadText(_this.getBusinessRule("templateAssetPath"))
                ]).then(function (_a) {
                    var landlordCertificateBusinessModel = _a[0], viewHtml = _a[1];
                    _this.model = _this._landlordFactory.createLandlordSafetyCertificateViewModel(landlordCertificateBusinessModel, _this.labels);
                    // this.model = LandlordSafetyCertificateViewModel.dummy();
                    return _this.getRequiredCatalogValues(_this.model)
                        .then(function () {
                        _this.padTableRows(_this.model, _this.getBusinessRule("minApplianceLines"));
                        _this.viewHtml = new aurelia_framework_1.InlineViewStrategy(viewHtml);
                        _this.showContent();
                    });
                });
            });
        };
        LandlordSafetyCertificate.prototype.getRequiredCatalogValues = function (viewModel) {
            var _this = this;
            var catalogValueLookupPromises = [];
            // get all the flue types
            if (viewModel && viewModel.appliances && viewModel.appliances.length > 0) {
                viewModel.appliances.forEach(function (appliance) {
                    if (appliance.flueType !== _this.getLabel("incomplete")) {
                        catalogValueLookupPromises.push(_this._catalogService.getItemDescription(catalogConstants_1.CatalogConstants.APPLIANCE_FLUE_TYPES, [catalogConstants_1.CatalogConstants.APPLIANCE_FLUE_TYPES_ID], [appliance.flueType], catalogConstants_1.CatalogConstants.APPLIANCE_FLUE_TYPES_DESCRIPTION)
                            .then(function (lookupValue) {
                            appliance.flueType = lookupValue;
                        }));
                    }
                });
            }
            if (viewModel && viewModel.defects && viewModel.defects.length > 0) {
                // todo: when a lookup value is null or undefined, then what should the value be?
                viewModel.defects.forEach(function (defect) {
                    if ((defect.actionTaken !== _this.getLabel("notApplicable")) && (defect.actionTaken !== _this.getLabel("incomplete"))) {
                        catalogValueLookupPromises.push(_this._catalogService.getItemDescription(catalogConstants_1.CatalogConstants.SAFETY_ACTION, [catalogConstants_1.CatalogConstants.SAFETY_ACTION_ID], [defect.actionTaken], catalogConstants_1.CatalogConstants.SAFETY_ACTION_DESCRIPTION)
                            .then(function (lookupValue) {
                            defect.actionTaken = lookupValue;
                        }));
                    }
                    if ((defect.conditionOfAppliance !== _this.getLabel("notApplicable")) && (defect.conditionOfAppliance !== _this.getLabel("incomplete"))) {
                        catalogValueLookupPromises.push(_this._catalogService.getItemDescription(catalogConstants_1.CatalogConstants.SAFETY_NOTICE_TYPE, [catalogConstants_1.CatalogConstants.SAFETY_NOTICE_TYPE_ID], [defect.conditionOfAppliance], catalogConstants_1.CatalogConstants.SAFETY_NOTICE_TYPE_DESCRIPTION)
                            .then(function (lookupValue) {
                            defect.conditionOfAppliance = lookupValue;
                        }));
                    }
                });
            }
            if (viewModel && viewModel.instPremDefect) {
                if ((viewModel.instPremDefect.actionTaken !== this.getLabel("notApplicable")) && (viewModel.instPremDefect.actionTaken !== this.getLabel("incomplete"))) {
                    catalogValueLookupPromises.push(this._catalogService.getItemDescription(catalogConstants_1.CatalogConstants.SAFETY_ACTION, [catalogConstants_1.CatalogConstants.SAFETY_ACTION_ID], [viewModel.instPremDefect.actionTaken], catalogConstants_1.CatalogConstants.SAFETY_ACTION_DESCRIPTION)
                        .then(function (lookupValue) {
                        viewModel.instPremDefect.actionTaken = lookupValue;
                    }));
                }
                if ((viewModel.instPremDefect.conditionOfAppliance !== this.getLabel("notApplicable")) && (viewModel.instPremDefect.conditionOfAppliance !== this.getLabel("incomplete"))) {
                    catalogValueLookupPromises.push(this._catalogService.getItemDescription(catalogConstants_1.CatalogConstants.SAFETY_NOTICE_TYPE, [catalogConstants_1.CatalogConstants.SAFETY_NOTICE_TYPE_ID], [viewModel.instPremDefect.conditionOfAppliance], catalogConstants_1.CatalogConstants.SAFETY_NOTICE_TYPE_DESCRIPTION)
                        .then(function (lookupValue) {
                        viewModel.instPremDefect.conditionOfAppliance = lookupValue;
                    }));
                }
            }
            return Promise.all(catalogValueLookupPromises).then(function () { return Promise.resolve(); });
        };
        LandlordSafetyCertificate.prototype.padTableRows = function (model, minLines) {
            if (model && model.appliances && model.appliances.length > 0) {
                while (model.appliances.length < minLines) {
                    model.appliances.push(null);
                }
            }
            if (model && model.defects && model.defects.length > 0) {
                while (model.defects.length < minLines) {
                    model.defects.push(null);
                }
            }
        };
        LandlordSafetyCertificate = __decorate([
            aurelia_dependency_injection_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, catalogService_1.CatalogService, businessRuleService_1.BusinessRuleService, landlordFactory_1.LandlordFactory, assetService_1.AssetService, aurelia_dialog_1.DialogController, validationService_1.ValidationService, landlordService_1.LandlordService),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, Object, Object, aurelia_dialog_1.DialogController, Object, Object])
        ], LandlordSafetyCertificate);
        return LandlordSafetyCertificate;
    }(businessRulesViewModel_1.BusinessRulesViewModel));
    exports.LandlordSafetyCertificate = LandlordSafetyCertificate;
});

//# sourceMappingURL=landlordSafetyCertificate.js.map
