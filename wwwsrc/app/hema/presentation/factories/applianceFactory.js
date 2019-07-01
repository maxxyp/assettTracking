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
define(["require", "exports", "../../business/models/appliance", "../modules/appliances/viewModels/applianceViewModel", "aurelia-dependency-injection", "../../../common/core/guid", "../../common/factories/baseApplianceFactory", "../../business/services/businessRuleService", "../../business/services/catalogService", "../../business/models/applianceSafetyType", "../../common/dataStateManager"], function (require, exports, appliance_1, applianceViewModel_1, aurelia_dependency_injection_1, guid_1, baseApplianceFactory_1, businessRuleService_1, catalogService_1, applianceSafetyType_1, dataStateManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ApplianceFactory = /** @class */ (function (_super) {
        __extends(ApplianceFactory, _super);
        function ApplianceFactory(businessRuleService, catalogService, dataStateManager) {
            var _this = _super.call(this, businessRuleService, catalogService) || this;
            _this._dataStateManager = dataStateManager;
            return _this;
        }
        ApplianceFactory.prototype.createNewApplianceViewModel = function () {
            var viewModel = new applianceViewModel_1.ApplianceViewModel();
            viewModel.id = guid_1.Guid.newGuid();
            viewModel.dataStateGroup = "appliances";
            viewModel.hasChildAppliance = false;
            viewModel.hasParentAppliance = false;
            return viewModel;
        };
        ApplianceFactory.prototype.createApplianceViewModelFromBusinessModel = function (applianceBusinessModel, applianceTypeCatalogItem, centralHeatingApplianceHardwareCategory, applianceRequiresGcCode, parentApplianceBusinessModel) {
            var viewModel = new applianceViewModel_1.ApplianceViewModel();
            viewModel.dataStateGroup = applianceBusinessModel.dataStateGroup;
            viewModel.dataState = applianceBusinessModel.dataState;
            viewModel.dataStateId = applianceBusinessModel.dataStateId;
            viewModel.id = applianceBusinessModel.id;
            viewModel.serialId = applianceBusinessModel.serialId;
            viewModel.gcCode = applianceBusinessModel.gcCode;
            viewModel.bgInstallationIndicator = applianceBusinessModel.bgInstallationIndicator;
            viewModel.category = applianceBusinessModel.category;
            viewModel.contractType = applianceBusinessModel.contractType;
            viewModel.contractExpiryDate = applianceBusinessModel.contractExpiryDate;
            viewModel.applianceType = applianceBusinessModel.applianceType;
            viewModel.description = applianceBusinessModel.description;
            viewModel.flueType = applianceBusinessModel.flueType;
            viewModel.cylinderType = applianceBusinessModel.cylinderType;
            viewModel.energyControl = applianceBusinessModel.energyControl;
            viewModel.locationDescription = applianceBusinessModel.locationDescription;
            viewModel.condition = applianceBusinessModel.condition;
            viewModel.numberOfRadiators = applianceBusinessModel.numberOfRadiators;
            viewModel.numberOfSpecialRadiators = applianceBusinessModel.numberOfSpecialRadiators;
            viewModel.installationYear = applianceBusinessModel.installationYear;
            viewModel.systemDesignCondition = applianceBusinessModel.systemDesignCondition;
            viewModel.systemType = applianceBusinessModel.systemType;
            viewModel.notes = applianceBusinessModel.notes;
            viewModel.boilerSize = applianceBusinessModel.boilerSize;
            viewModel.parentId = applianceBusinessModel.parentId;
            viewModel.childId = applianceBusinessModel.childId;
            viewModel.isInstPremAppliance = applianceBusinessModel.isInstPremAppliance;
            viewModel.applianceSafetyType = applianceBusinessModel.applianceSafetyType;
            viewModel.isGasAppliance = viewModel.applianceSafetyType === applianceSafetyType_1.ApplianceSafetyType.gas;
            viewModel.isCentralHeatingAppliance = applianceTypeCatalogItem.category === centralHeatingApplianceHardwareCategory;
            viewModel.requiresGcCode = applianceTypeCatalogItem.fetchGCCode === applianceRequiresGcCode;
            viewModel.hasChildAppliance = viewModel.childId !== null && viewModel.childId !== undefined;
            viewModel.hasParentAppliance = viewModel.parentId !== null && viewModel.parentId !== undefined && viewModel.parentId !== viewModel.id;
            if (viewModel.hasParentAppliance && parentApplianceBusinessModel) {
                viewModel.parentApplianceType = parentApplianceBusinessModel.applianceType;
            }
            return viewModel;
        };
        ApplianceFactory.prototype.updateApplianceViewModelApplianceType = function (applianceViewModel, applianceType, applianceTypeCatalogItem, centralHeatingApplianceHardwareCategory, applianceRequiresGcCode, parentApplianceIndicator, engineerWorkingSector) {
            var calculateApplianceSafeTypePromise;
            if (applianceTypeCatalogItem) {
                calculateApplianceSafeTypePromise = this.calculateApplianceSafetyType(applianceType, engineerWorkingSector);
            }
            else {
                calculateApplianceSafeTypePromise = Promise.resolve(undefined);
            }
            return calculateApplianceSafeTypePromise
                .then(function (applianceSafetyType) {
                if (applianceTypeCatalogItem) {
                    applianceViewModel.applianceSafetyType = applianceSafetyType;
                    applianceViewModel.isGasAppliance = applianceViewModel.applianceSafetyType === applianceSafetyType_1.ApplianceSafetyType.gas;
                    applianceViewModel.isCentralHeatingAppliance = applianceTypeCatalogItem.category === centralHeatingApplianceHardwareCategory;
                    applianceViewModel.requiresGcCode = applianceTypeCatalogItem.fetchGCCode === applianceRequiresGcCode;
                    // you cannot change the applianceType on a child and only in new appliance mode
                    // just to be safe clear out any parent stuff
                    applianceViewModel.hasParentAppliance = false;
                    applianceViewModel.parentApplianceType = undefined;
                    applianceViewModel.hasChildAppliance = (applianceTypeCatalogItem.association === parentApplianceIndicator);
                }
                else {
                    applianceViewModel.applianceSafetyType = undefined;
                    applianceViewModel.isGasAppliance = false;
                    applianceViewModel.isCentralHeatingAppliance = false;
                    applianceViewModel.requiresGcCode = undefined;
                    // you cannot change the applianceType on a child so only the has child is needed
                    // just to be safe clear out any parent stuff
                    applianceViewModel.hasParentAppliance = false;
                    applianceViewModel.parentApplianceType = undefined;
                    applianceViewModel.hasChildAppliance = false;
                }
            });
        };
        ApplianceFactory.prototype.createApplianceBusinessModelFromViewModel = function (applianceViewModel, job, engineerWorkingSector) {
            var _this = this;
            var applianceBusinessModel = new appliance_1.Appliance();
            applianceBusinessModel.id = applianceViewModel.id;
            applianceBusinessModel.serialId = applianceViewModel.serialId;
            applianceBusinessModel.gcCode = applianceViewModel.gcCode;
            applianceBusinessModel.bgInstallationIndicator = applianceViewModel.bgInstallationIndicator;
            applianceBusinessModel.category = applianceViewModel.category;
            applianceBusinessModel.contractType = applianceViewModel.contractType;
            applianceBusinessModel.contractExpiryDate = applianceViewModel.contractExpiryDate;
            applianceBusinessModel.applianceType = applianceViewModel.applianceType;
            applianceBusinessModel.description = applianceViewModel.description;
            applianceBusinessModel.flueType = applianceViewModel.flueType;
            applianceBusinessModel.cylinderType = applianceViewModel.cylinderType;
            applianceBusinessModel.energyControl = applianceViewModel.energyControl;
            applianceBusinessModel.locationDescription = applianceViewModel.locationDescription;
            applianceBusinessModel.condition = applianceViewModel.condition;
            applianceBusinessModel.numberOfRadiators = applianceViewModel.numberOfRadiators;
            applianceBusinessModel.numberOfSpecialRadiators = applianceViewModel.numberOfSpecialRadiators;
            applianceBusinessModel.installationYear = applianceViewModel.installationYear;
            applianceBusinessModel.systemDesignCondition = applianceViewModel.systemDesignCondition;
            applianceBusinessModel.systemType = applianceViewModel.systemType;
            applianceBusinessModel.notes = applianceViewModel.notes;
            applianceBusinessModel.boilerSize = applianceViewModel.boilerSize;
            // applianceBusinessModel.applianceCategoryType = applianceViewModel.applianceCategoryType;
            applianceBusinessModel.preVisitChirpCode = undefined;
            applianceBusinessModel.applianceSafetyType = applianceViewModel.applianceSafetyType;
            return this.populateBusinessModelFields(applianceBusinessModel, engineerWorkingSector)
                .then(function () { return _this._dataStateManager.updateApplianceDataState(applianceBusinessModel, job); })
                .then(function () { return applianceBusinessModel; });
        };
        ApplianceFactory.prototype.updateApplianceBusinessModelFromViewModel = function (applianceViewModel, applianceBusinessModel) {
            applianceBusinessModel.serialId = applianceViewModel.serialId;
            applianceBusinessModel.gcCode = applianceViewModel.gcCode;
            applianceBusinessModel.bgInstallationIndicator = applianceViewModel.bgInstallationIndicator;
            applianceBusinessModel.category = applianceViewModel.category;
            applianceBusinessModel.applianceType = applianceViewModel.applianceType;
            applianceBusinessModel.description = applianceViewModel.description;
            applianceBusinessModel.flueType = applianceViewModel.flueType;
            applianceBusinessModel.cylinderType = applianceViewModel.cylinderType;
            applianceBusinessModel.energyControl = applianceViewModel.energyControl;
            applianceBusinessModel.locationDescription = applianceViewModel.locationDescription;
            applianceBusinessModel.condition = applianceViewModel.condition;
            applianceBusinessModel.numberOfRadiators = applianceViewModel.numberOfRadiators;
            applianceBusinessModel.numberOfSpecialRadiators = applianceViewModel.numberOfSpecialRadiators;
            applianceBusinessModel.installationYear = applianceViewModel.installationYear;
            applianceBusinessModel.systemDesignCondition = applianceViewModel.systemDesignCondition;
            applianceBusinessModel.systemType = applianceViewModel.systemType;
            applianceBusinessModel.notes = applianceViewModel.notes;
            applianceBusinessModel.boilerSize = applianceViewModel.boilerSize;
            // applianceBusinessModel.applianceCategoryType = applianceViewModel.applianceCategoryType;
            applianceBusinessModel.applianceSafetyType = applianceViewModel.applianceSafetyType;
            applianceBusinessModel.dataState = applianceViewModel.dataState;
            return applianceBusinessModel;
        };
        ApplianceFactory = __decorate([
            aurelia_dependency_injection_1.inject(businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService, dataStateManager_1.DataStateManager),
            __metadata("design:paramtypes", [Object, Object, Object])
        ], ApplianceFactory);
        return ApplianceFactory;
    }(baseApplianceFactory_1.BaseApplianceFactory));
    exports.ApplianceFactory = ApplianceFactory;
});

//# sourceMappingURL=applianceFactory.js.map
