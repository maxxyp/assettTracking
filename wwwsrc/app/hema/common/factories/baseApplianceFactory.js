var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "../../business/services/businessRuleService", "aurelia-dependency-injection", "../../business/services/catalogService", "../../business/models/businessException", "../../business/models/applianceSafetyType"], function (require, exports, businessRuleService_1, aurelia_dependency_injection_1, catalogService_1, businessException_1, applianceSafetyType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseApplianceFactory = /** @class */ (function () {
        function BaseApplianceFactory(businessRuleService, catalogService) {
            this._businessRuleService = businessRuleService;
            this._catalogService = catalogService;
        }
        BaseApplianceFactory.prototype.calculateApplianceSafetyType = function (applianceType, engineerWorkingSector) {
            var _this = this;
            var electricalWorkingSector = undefined;
            var applianceCategoryOther = undefined;
            var applianceCategoryElectrical = undefined;
            var applianceCategoryGas = undefined;
            var applianceTypesToUseEngineerPatchInsteadToCalculateSafetyType = undefined;
            return this._businessRuleService.getQueryableRuleGroup("applianceFactory")
                .then(function (businessRules) {
                applianceTypesToUseEngineerPatchInsteadToCalculateSafetyType = businessRules.getBusinessRule("applianceTypesToUseEngineerPatchInsteadToCalculateSafetyType");
                applianceCategoryOther = businessRules.getBusinessRule("applianceCategoryOther");
                applianceCategoryElectrical = businessRules.getBusinessRule("applianceCategoryElectrical");
                applianceCategoryGas = businessRules.getBusinessRule("applianceCategoryGas");
                electricalWorkingSector = businessRules.getBusinessRule("electricalWorkingSector");
            })
                .then(function () { return _this._catalogService.getObjectType(applianceType); })
                .then(function (applianceCatalogObjectType) {
                // check all the required lookup exist
                if (applianceCategoryOther && applianceCategoryElectrical && applianceCategoryGas && electricalWorkingSector) {
                    if (applianceCatalogObjectType) {
                        // if special appliance, use engineer
                        // otherwise use appliance type
                        if (applianceTypesToUseEngineerPatchInsteadToCalculateSafetyType
                            && applianceTypesToUseEngineerPatchInsteadToCalculateSafetyType.split(",").some(function (x) { return x === applianceType; })) {
                            // this is a special appliance
                            if (applianceCatalogObjectType.applianceCategory === applianceCategoryOther) {
                                return applianceSafetyType_1.ApplianceSafetyType.other;
                            }
                            else {
                                if (electricalWorkingSector === engineerWorkingSector) {
                                    return applianceSafetyType_1.ApplianceSafetyType.electrical;
                                }
                                else {
                                    return applianceSafetyType_1.ApplianceSafetyType.gas;
                                }
                            }
                        }
                        else {
                            switch (applianceCatalogObjectType.applianceCategory) {
                                case applianceCategoryGas:
                                    return applianceSafetyType_1.ApplianceSafetyType.gas;
                                case applianceCategoryElectrical:
                                    return applianceSafetyType_1.ApplianceSafetyType.electrical;
                                case applianceCategoryOther:
                                    return applianceSafetyType_1.ApplianceSafetyType.other;
                                default:
                                    throw new businessException_1.BusinessException(_this, "calculateApplianceSafetyType", "Unknown appliance category detected", null, null);
                            }
                        }
                    }
                    else {
                        // throw exception required lookup values not found
                        throw new businessException_1.BusinessException(_this, "calculateApplianceSafetyType", "Required catalog lookup not found", null, null);
                    }
                }
                else {
                    // throw exception required lookup values not found
                    throw new businessException_1.BusinessException(_this, "calculateApplianceSafetyType", "Required business rules lookup not found", null, null);
                }
            });
        };
        BaseApplianceFactory.prototype.populateBusinessModelFields = function (appliance, engineerWorkingSector) {
            var _this = this;
            // get the business rules
            var hardwareCategoryForCentralHeatingAppliance;
            var instPremApplianceType;
            return this.calculateApplianceSafetyType(appliance.applianceType, engineerWorkingSector)
                .then(function (applianceSafetyType) {
                appliance.applianceSafetyType = applianceSafetyType;
                return _this._businessRuleService.getQueryableRuleGroup("applianceFactory");
            })
                .then(function (businessRules) {
                hardwareCategoryForCentralHeatingAppliance = businessRules.getBusinessRule("hardWareCatForCHAppliance");
                instPremApplianceType = businessRules.getBusinessRule("instPremApplianceType");
            })
                .then(function () { return _this._catalogService.getObjectType(appliance.applianceType); })
                .then(function (applianceCatalogObjectType) {
                // check all the required lookup exist
                if (hardwareCategoryForCentralHeatingAppliance && instPremApplianceType
                    && applianceCatalogObjectType) {
                    // central heating appliance
                    appliance.isCentralHeatingAppliance = applianceCatalogObjectType.category === hardwareCategoryForCentralHeatingAppliance;
                    // instPrem appliance
                    appliance.isInstPremAppliance = instPremApplianceType === appliance.applianceType;
                }
                else {
                    // throw exception required lookup values not found
                    throw new businessException_1.BusinessException(_this, "populateBusinessModelFields", "Required business rules/catalog lookup not found", null, null);
                }
            });
        };
        BaseApplianceFactory = __decorate([
            aurelia_dependency_injection_1.inject(businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService),
            __metadata("design:paramtypes", [Object, Object])
        ], BaseApplianceFactory);
        return BaseApplianceFactory;
    }());
    exports.BaseApplianceFactory = BaseApplianceFactory;
});

//# sourceMappingURL=baseApplianceFactory.js.map
