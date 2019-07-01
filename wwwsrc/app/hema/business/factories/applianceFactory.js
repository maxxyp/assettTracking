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
define(["require", "exports", "../models/chirpCode", "../../business/models/appliance", "./applianceSafetyFactory", "aurelia-dependency-injection", "../../../common/core/numberHelper", "../../../common/core/stringHelper", "../../../common/core/objectHelper", "./readingFactory", "./landlordFactory", "../services/businessRuleService", "../services/catalogService", "../../core/middlewareHelper", "../../common/factories/baseApplianceFactory", "../../common/dataStateManager"], function (require, exports, chirpCode_1, appliance_1, applianceSafetyFactory_1, aurelia_dependency_injection_1, numberHelper_1, stringHelper_1, objectHelper_1, readingFactory_1, landlordFactory_1, businessRuleService_1, catalogService_1, middlewareHelper_1, baseApplianceFactory_1, dataStateManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ApplianceFactory = /** @class */ (function (_super) {
        __extends(ApplianceFactory, _super);
        function ApplianceFactory(applianceSafetyFactory, readingFactory, landlordFactory, businessRuleService, catalogService, dataStateManager) {
            var _this = _super.call(this, businessRuleService, catalogService) || this;
            _this._applianceSafetyFactory = applianceSafetyFactory;
            _this._readingFactory = readingFactory;
            _this._landlordFactory = landlordFactory;
            _this._dataStateManager = dataStateManager;
            return _this;
        }
        ApplianceFactory.prototype.createApplianceBusinessModel = function (applianceApiModel, job, engineerWorkingSector) {
            var _this = this;
            var applianceBusinessModel = new appliance_1.Appliance();
            return this._catalogService.getObjectTypes().then(function (applianceTypes) {
                if (applianceTypes.find(function (a) { return a.applianceType === applianceApiModel.applianceType; })) {
                    var parseBgInstallationIndicator = function (bgInstallationIndicator) {
                        return bgInstallationIndicator === "1" ? true : bgInstallationIndicator === "0" ? false : undefined;
                    };
                    // map the normal fields
                    applianceBusinessModel.id = applianceApiModel.id;
                    applianceBusinessModel.serialId = applianceApiModel.serialId;
                    applianceBusinessModel.gcCode = applianceApiModel.gcCode;
                    applianceBusinessModel.bgInstallationIndicator = parseBgInstallationIndicator(applianceApiModel.bgInstallationIndicator);
                    applianceBusinessModel.category = applianceApiModel.category;
                    applianceBusinessModel.contractType = applianceApiModel.contractType;
                    applianceBusinessModel.contractExpiryDate = stringHelper_1.StringHelper.isString(applianceApiModel.contractExpiryDate) ? new Date(applianceApiModel.contractExpiryDate) : undefined;
                    applianceBusinessModel.applianceType = applianceApiModel.applianceType;
                    applianceBusinessModel.description = applianceApiModel.description;
                    applianceBusinessModel.flueType = applianceApiModel.flueType;
                    applianceBusinessModel.energyControl = applianceApiModel.energyControl;
                    applianceBusinessModel.locationDescription = applianceApiModel.locationDescription;
                    applianceBusinessModel.numberOfRadiators = applianceApiModel.numberOfRadiators;
                    applianceBusinessModel.numberOfSpecialRadiators = applianceApiModel.numberOfSpecialRadiators;
                    applianceBusinessModel.installationYear = applianceApiModel.installationYear;
                    applianceBusinessModel.notes = applianceApiModel.notes;
                    applianceBusinessModel.boilerSize = applianceApiModel.boilerSize;
                    // this is because the catalogs are using code as a string and the value comes down as a number
                    applianceBusinessModel.cylinderType = numberHelper_1.NumberHelper.canCoerceToNumber(applianceApiModel.cylinderType) ? applianceApiModel.cylinderType.toString() : undefined;
                    applianceBusinessModel.systemDesignCondition = numberHelper_1.NumberHelper.canCoerceToNumber(applianceApiModel.systemDesignCondition)
                        ? applianceApiModel.systemDesignCondition.toString()
                        : undefined;
                    applianceBusinessModel.systemType = numberHelper_1.NumberHelper.canCoerceToNumber(applianceApiModel.systemType) ? applianceApiModel.systemType.toString() : undefined;
                    applianceBusinessModel.condition = numberHelper_1.NumberHelper.canCoerceToNumber(applianceApiModel.condition) ? applianceApiModel.condition.toString() : undefined;
                    // in a parent/child pair, linkId contains the parent's id in both records
                    applianceBusinessModel.parentId = applianceApiModel.linkId && applianceApiModel.linkId !== applianceApiModel.id ? applianceApiModel.linkId : undefined;
                    if (applianceApiModel.chirp) {
                        applianceBusinessModel.preVisitChirpCode = new chirpCode_1.ChirpCode();
                        applianceBusinessModel.preVisitChirpCode.code = applianceApiModel.chirp.iaciCode;
                        applianceBusinessModel.preVisitChirpCode.date = applianceApiModel.chirp.iaciDate;
                    }
                    return _this.populateBusinessModelFields(applianceBusinessModel, engineerWorkingSector)
                        .then(function () { return _this._dataStateManager.updateApplianceDataState(applianceBusinessModel, job); })
                        .then(function () {
                        if (applianceApiModel.safety) {
                            applianceBusinessModel.safety = _this._applianceSafetyFactory.populatePreviousApplianceSafety(applianceApiModel.safety, applianceBusinessModel.safety);
                        }
                        return applianceBusinessModel;
                    });
                }
                else {
                    return undefined;
                }
            });
        };
        ApplianceFactory.prototype.createApplianceApiModel = function (job, originalJob, applianceBusinessModel, applianceIdToSequenceMap) {
            var _this = this;
            var apiModel = this.createApiModel(applianceBusinessModel);
            if (applianceBusinessModel.isDeleted) {
                this.populateDeleteSpecificFields(apiModel, applianceBusinessModel);
                return Promise.resolve(apiModel);
            }
            else {
                if (applianceBusinessModel.isCreated) {
                    this.populateCreateSpecificFields(apiModel, applianceBusinessModel, applianceIdToSequenceMap);
                }
                else {
                    this.populateUpdateSpecificFields(apiModel, applianceBusinessModel);
                }
                var originalAppliance = this.getOriginalAppliance(applianceBusinessModel, originalJob);
                this.populateCoreApplianceFields(apiModel, applianceBusinessModel, originalAppliance);
                return this.populateCentralHeatingFields(apiModel, applianceBusinessModel, originalAppliance)
                    .then(function () { return _this.populateLandlordFields(apiModel, applianceBusinessModel, job); })
                    .then(function () { return _this.populateSafetyFields(apiModel, applianceBusinessModel, job); });
            }
        };
        ApplianceFactory.prototype.createApiModel = function (applianceBusinessModel) {
            var updateMarker = applianceBusinessModel.isCreated ? "C" : applianceBusinessModel.isDeleted ? "D" : "A";
            return {
                updateMarker: updateMarker,
                applianceType: applianceBusinessModel.applianceType
            };
        };
        ApplianceFactory.prototype.populateCreateSpecificFields = function (apiModel, applianceBusinessModel, applianceIdToSequenceMap) {
            apiModel.hardwareSequenceNumber = applianceIdToSequenceMap[applianceBusinessModel.id];
            apiModel.linkId = applianceBusinessModel.parentId ? applianceIdToSequenceMap[applianceBusinessModel.parentId].toString() : undefined;
        };
        ApplianceFactory.prototype.populateUpdateSpecificFields = function (apiModel, applianceBusinessModel) {
            apiModel.id = applianceBusinessModel.id;
        };
        ApplianceFactory.prototype.populateDeleteSpecificFields = function (apiModel, applianceBusinessModel) {
            apiModel.id = applianceBusinessModel.id;
        };
        ApplianceFactory.prototype.getOriginalAppliance = function (applianceBusinessModel, originalJob) {
            return !applianceBusinessModel.isCreated
                && originalJob
                && originalJob.history
                && originalJob.history.appliances
                && originalJob.history.appliances.find(function (appl) { return appl.id === applianceBusinessModel.id; });
        };
        ApplianceFactory.prototype.populateCoreApplianceFields = function (apiModel, applianceBusinessModel, originalAppliance) {
            if (!originalAppliance || applianceBusinessModel.installationYear !== originalAppliance.installationYear) {
                apiModel.installationYear = applianceBusinessModel.installationYear;
            }
            if (!originalAppliance || applianceBusinessModel.description !== originalAppliance.description) {
                apiModel.description = applianceBusinessModel.description;
            }
            if (!originalAppliance || applianceBusinessModel.flueType !== originalAppliance.flueType) {
                apiModel.flueType = applianceBusinessModel.flueType;
            }
            if (!originalAppliance || applianceBusinessModel.gcCode !== originalAppliance.gcCode) {
                apiModel.gcCode = applianceBusinessModel.gcCode;
            }
            if (!originalAppliance || applianceBusinessModel.locationDescription !== originalAppliance.locationDescription) {
                apiModel.locationDescription = applianceBusinessModel.locationDescription;
            }
            if (!originalAppliance || applianceBusinessModel.serialId !== originalAppliance.serialId) {
                apiModel.serialId = applianceBusinessModel.serialId;
            }
            if (!originalAppliance || applianceBusinessModel.notes !== originalAppliance.notes) {
                apiModel.scmsText = applianceBusinessModel.notes;
            }
            var santizeBgInstallationIndicator = function (bgInstallationIndicator) {
                return bgInstallationIndicator === undefined ? undefined : (bgInstallationIndicator ? "1" : "0");
            };
            if (!originalAppliance || santizeBgInstallationIndicator(applianceBusinessModel.bgInstallationIndicator) !== santizeBgInstallationIndicator(originalAppliance.bgInstallationIndicator)) {
                apiModel.bgInstallationIndicator = santizeBgInstallationIndicator(applianceBusinessModel.bgInstallationIndicator);
            }
        };
        ApplianceFactory.prototype.populateCentralHeatingFields = function (apiModel, applianceBusinessModel, originalAppliance) {
            return this._businessRuleService.getQueryableRuleGroup("applianceDetails")
                .then(function (ruleGroup) {
                if (applianceBusinessModel.category && applianceBusinessModel.category === ruleGroup.getBusinessRule("centralHeatingApplianceHardwareCategory")) {
                    if (!originalAppliance || applianceBusinessModel.condition !== originalAppliance.condition) {
                        apiModel.condition = applianceBusinessModel.condition;
                    }
                    if (!originalAppliance || applianceBusinessModel.boilerSize !== originalAppliance.boilerSize) {
                        apiModel.boilerSize = applianceBusinessModel.boilerSize;
                    }
                    if (!originalAppliance || applianceBusinessModel.numberOfRadiators !== originalAppliance.numberOfRadiators) {
                        apiModel.numberOfRadiators = applianceBusinessModel.numberOfRadiators;
                    }
                    if (!originalAppliance || applianceBusinessModel.energyControl !== originalAppliance.energyControl) {
                        apiModel.energyControl = applianceBusinessModel.energyControl;
                    }
                    if (!originalAppliance || applianceBusinessModel.systemType !== originalAppliance.systemType) {
                        apiModel.systemType = applianceBusinessModel.systemType;
                    }
                    if (!originalAppliance || applianceBusinessModel.systemDesignCondition !== originalAppliance.systemDesignCondition) {
                        apiModel.systemDesignCondition = applianceBusinessModel.systemDesignCondition;
                    }
                    if (!originalAppliance || applianceBusinessModel.cylinderType !== originalAppliance.cylinderType) {
                        apiModel.cylinderType = applianceBusinessModel.cylinderType;
                    }
                    if (!originalAppliance || applianceBusinessModel.numberOfSpecialRadiators !== originalAppliance.numberOfSpecialRadiators) {
                        apiModel.numberofSpecialRadiators = applianceBusinessModel.numberOfSpecialRadiators;
                    }
                }
            });
        };
        ApplianceFactory.prototype.populateSafetyFields = function (apiModel, applianceBusinessModel, job) {
            return Promise.all([
                this._readingFactory.createReadingApiModels(applianceBusinessModel),
                this._applianceSafetyFactory.createApplianceSafetyApiModel(applianceBusinessModel, job.propertySafety && job.propertySafety.propertyGasSafetyDetail, job.propertySafety && job.propertySafety.propertyUnsafeDetail)
            ]).then(function (_a) {
                var readings = _a[0], safety = _a[1];
                apiModel.readings = readings;
                apiModel.safety = safety;
                return apiModel;
            });
        };
        ApplianceFactory.prototype.populateLandlordFields = function (apiModel, applianceBusinessModel, job) {
            var _this = this;
            if (!job.isLandlordJob) {
                return Promise.resolve(apiModel);
            }
            return Promise.all([
                this._businessRuleService.getQueryableRuleGroup(stringHelper_1.StringHelper.toCamelCase(objectHelper_1.ObjectHelper.getClassName(this))),
                this._businessRuleService.getQueryableRuleGroup("landlordSafetyCertificate"),
                this._catalogService.getSafetyActions()
            ]).then(function (_a) {
                var applianceBusinessRules = _a[0], landlordBusinessRules = _a[1], actions = _a[2];
                if (applianceBusinessModel.isSafetyRequired && !applianceBusinessModel.isInstPremAppliance) {
                    var certificateDefect = _this._landlordFactory.createLandlordSafetyCertificateDefect(applianceBusinessModel, landlordBusinessRules, actions);
                    apiModel.detailsOfAnyDefectsIdentifiedText = certificateDefect.details;
                    apiModel.remedialActionTakenText = certificateDefect.actionTakenText;
                    return _this._landlordFactory.createLandlordSafetyCertificateAppliance(applianceBusinessModel, landlordBusinessRules)
                        .then(function (certificateAppliance) {
                        if (certificateAppliance) {
                            apiModel.safetyDeviceCorrectOperation = middlewareHelper_1.MiddlewareHelper.getYNXForYesNoNa(certificateAppliance.safetyDeviceCorrectOperation, undefined);
                            apiModel.make = certificateAppliance.make;
                            apiModel.model = certificateAppliance.model;
                            apiModel.flueFlowTest = middlewareHelper_1.MiddlewareHelper.getPFXForYesNoNa(certificateAppliance.flueFlowTest);
                            apiModel.spillageTest = middlewareHelper_1.MiddlewareHelper.getPFXForYesNoNa(certificateAppliance.spillageTest);
                            apiModel.requestedToTest = !!certificateAppliance.requestedToTest;
                            apiModel.unableToTest = !!certificateAppliance.unableToTest;
                        }
                        return apiModel;
                    });
                }
                else if (applianceBusinessModel.contractType === applianceBusinessRules.getBusinessRule("instPremApplianceContractType")) {
                    var certificateResult = _this._landlordFactory.createLandlordSafetyCertificateResult(job.propertySafety, landlordBusinessRules, actions);
                    apiModel.gasInstallationSoundnessTest = middlewareHelper_1.MiddlewareHelper.getPFXForYesNoNa(certificateResult.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass);
                    apiModel.detailsOfAnyDefectsIdentifiedText = certificateResult.propertySafetyDefect.details;
                    apiModel.remedialActionTakenText = certificateResult.propertySafetyDefect.actionTakenText;
                    apiModel.requestedToTest = true;
                    apiModel.unableToTest = false;
                }
                else if (applianceBusinessModel.isInstPremAppliance) {
                    apiModel.requestedToTest = true;
                    var certificateResult = _this._landlordFactory.createLandlordSafetyCertificateResult(job.propertySafety, landlordBusinessRules, actions);
                    if (job.propertySafety.propertyGasSafetyDetail.gasInstallationTightnessTestDone === true) {
                        apiModel.unableToTest = false;
                    }
                    else {
                        apiModel.unableToTest = true;
                    }
                    apiModel.gasInstallationSoundnessTest = middlewareHelper_1.MiddlewareHelper.getPFXForYesNoNa(certificateResult.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass);
                    apiModel.detailsOfAnyDefectsIdentifiedText = certificateResult.propertySafetyDefect.details;
                    apiModel.remedialActionTakenText = certificateResult.propertySafetyDefect.actionTakenText;
                }
                return apiModel;
            });
        };
        ApplianceFactory = __decorate([
            aurelia_dependency_injection_1.inject(applianceSafetyFactory_1.ApplianceSafetyFactory, readingFactory_1.ReadingFactory, landlordFactory_1.LandlordFactory, businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService, dataStateManager_1.DataStateManager),
            __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
        ], ApplianceFactory);
        return ApplianceFactory;
    }(baseApplianceFactory_1.BaseApplianceFactory));
    exports.ApplianceFactory = ApplianceFactory;
});

//# sourceMappingURL=applianceFactory.js.map
