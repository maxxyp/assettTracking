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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "../../../business/services/labelService", "../../../business/services/jobService", "../../../business/services/validationService", "../../../business/services/businessRuleService", "../../../business/services/applianceService", "../.././../business/services/catalogService", "../../models/editableViewModel", "../../../../common/core/guid", "../../../business/services/engineerService", "aurelia-dialog", "../../factories/applianceFactory", "../../constants/applianceDetailsConstants", "../../../business/services/constants/catalogConstants", "../../../business/services/storageService", "../../../business/models/businessException", "../../../../common/core/objectHelper"], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, labelService_1, jobService_1, validationService_1, businessRuleService_1, applianceService_1, catalogService_1, editableViewModel_1, guid_1, engineerService_1, aurelia_dialog_1, applianceFactory_1, applianceDetailsConstants_1, catalogConstants_1, storageService_1, businessException_1, objectHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ApplianceDetails = /** @class */ (function (_super) {
        __extends(ApplianceDetails, _super);
        function ApplianceDetails(jobService, engineerService, labelService, applianceService, applianceFactory, router, eventAggregator, dialogService, validationService, businessRulesService, catalogService, bindingEngine, storageService) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService) || this;
            _this._applianceService = applianceService;
            _this._applianceFactory = applianceFactory;
            _this._router = router;
            _this._bindingEngine = bindingEngine;
            _this._propertySubscriptions = [];
            _this._storageService = storageService;
            _this._gcCodeChanged = false;
            _this._isGcCodeChangedConfirmationShown = false;
            return _this;
        }
        ApplianceDetails.prototype.activateAsync = function (params) {
            var _this = this;
            this._applianceId = params.applianceId;
            this.isNew = this._applianceId === guid_1.Guid.empty;
            this._newGcCode = params.newGcCode || undefined;
            this._oldApplianceId = params.oldApplianceId;
            this.replaceAppliance = (this.isNew && this._newGcCode !== undefined && this._oldApplianceId !== undefined);
            this.isCompleteTriggeredAlready = false;
            if (this._isCleanInstance) {
                return this.loadBusinessRules()
                    .then(function () { return _this.buildBusinessRules(); })
                    .then(function () { return _this.buildValidationRules(); })
                    .then(function () { return _this.loadCatalogs(); })
                    .then(function () { return _this.load(); })
                    .then(function () { return _this.showContent(); });
            }
            else {
                return this.load();
            }
        };
        ApplianceDetails.prototype.completeOk = function () {
            var _this = this;
            if (this.isCompleteTriggeredAlready) {
                return Promise.resolve(false);
            }
            this.isCompleteTriggeredAlready = true;
            return this.save()
                .then(function (success) {
                if (success) {
                    return _this._router.navigateToRoute("appliances");
                }
                else {
                    return false;
                }
            });
        };
        ApplianceDetails.prototype.completeCancel = function () {
            this._router.navigateToRoute("appliances");
        };
        ApplianceDetails.prototype.selectDefaultGcCodes = function () {
            var _this = this;
            this._catalogService.getGCCodes(this.viewModel.applianceType)
                .then(function (gcCodes) {
                if (gcCodes) {
                    _this.defaultGcCodeCatalogItems = gcCodes.filter(function (x) { return x.defaultIndicator === _this._isDefaultGcCode; });
                    _this.isDefaultGcCodeOptionAvailable = true;
                    _this.selectedDefaultGcCode = "";
                }
            })
                .catch(function (error) { return _this.showError(error); });
        };
        ApplianceDetails.prototype.hideDefaultGcCodes = function () {
            this.isDefaultGcCodeOptionAvailable = false;
        };
        ApplianceDetails.prototype.loadParentAppliance = function () {
            this._router.navigateToRoute("appliance", { "applianceId": this.viewModel.parentId });
        };
        ApplianceDetails.prototype.loadChildAppliance = function () {
            var _this = this;
            if (this.isNew) {
                if (this.isCompleteTriggeredAlready) {
                    return;
                }
                this.isCompleteTriggeredAlready = true;
                this.save()
                    .then(function () {
                    return _this._applianceService.getChildApplianceId(_this.jobId, _this.viewModel.id)
                        .then(function (childApplianceId) {
                        _this._router.navigateToRoute("appliance", { "applianceId": childApplianceId });
                    });
                });
            }
            else {
                this._router.navigateToRoute("appliance", { "applianceId": this.viewModel.childId });
            }
        };
        ApplianceDetails.prototype.applianceTypeChanged = function (newValue, oldValue) {
            var _this = this;
            if (!this._isLoading) {
                this.viewModel.gcCode = undefined;
                this.isKnownGcCodeSelected = false;
                this.viewModel.description = undefined;
            }
            this.hideDefaultGcCodes();
            var applianceTypeCatalogItem = this.applianceTypeCatalog.find(function (a) { return a.applianceType === _this.viewModel.applianceType; });
            this._applianceFactory.updateApplianceViewModelApplianceType(this.viewModel, this.viewModel.applianceType, applianceTypeCatalogItem, this._centralHeatingApplianceHardwareCategory, this._applianceRequiresGcCode, this._parentApplianceIndicator, this._engineerWorkingSector);
        };
        ApplianceDetails.prototype.gcCodeChanged = function (newValue, oldValue) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.isKnownGcCodeSelected = false;
                    this.viewModel.description = undefined;
                    this.isDefaultGcCodeOptionAvailable = false;
                    this._gcCodeChanged = true;
                    if (this.viewModel.requiresGcCode
                        && this.viewModel.gcCode
                        && this.viewModel.gcCode.length === this.getValidationRule("viewModel.gcCode").maxLength) {
                        // because the gccode is correct size, do the lookup
                        if (!this._isGcCodeChangedConfirmationShown && !this.isNew && !this._isLoading && this.viewModel.gcCode !== this._savedGcCode) {
                            this._isGcCodeChangedConfirmationShown = true;
                            return [2 /*return*/, this.checkIfApplianceReplacementOrAmendmentRequired()];
                        }
                        else {
                            this._isGcCodeChangedConfirmationShown = false;
                            return [2 /*return*/, this.getGCCodeDescription()];
                        }
                    }
                    else {
                        this._isGcCodeChangedConfirmationShown = false;
                        this.publishApplianceDetailsChangedEvent();
                        return [2 /*return*/, Promise.resolve()];
                    }
                    return [2 /*return*/];
                });
            });
        };
        ApplianceDetails.prototype.applianceDescriptionChanged = function (newValue, oldValue) {
            if (newValue !== oldValue) {
                this.publishApplianceDetailsChangedEvent();
            }
        };
        ApplianceDetails.prototype.selectedDefaultGcCodeChanged = function (newValue, oldValue) {
            if (newValue) {
                this.viewModel.gcCode = newValue;
                this.isDefaultGcCodeOptionAvailable = false;
                this.publishApplianceDetailsChangedEvent();
            }
        };
        ApplianceDetails.prototype.deactivateAsync = function () {
            this.disposeSubscriptions();
            return Promise.resolve();
        };
        ApplianceDetails.prototype.navigateToReadings = function () {
            this._router.navigateToRoute("notyetimplemented");
        };
        ApplianceDetails.prototype.navigateToSafety = function () {
            this._router.navigateToRoute("appliancesafety", {
                jobId: this.jobId,
                applianceId: this.viewModel.id
            });
        };
        ApplianceDetails.prototype.loadModel = function () {
            var _this = this;
            this.isDefaultGcCodeOptionAvailable = false;
            this.isKnownGcCodeSelected = false;
            this._isLoading = true;
            return this._storageService.getWorkingSector()
                .then(function (engineerWorkingSector) {
                if (engineerWorkingSector) {
                    _this._engineerWorkingSector = engineerWorkingSector;
                }
                else {
                    throw new businessException_1.BusinessException(_this, "loadModel", "Required engineer working sector not found", null, null);
                }
            })
                .then(function () { return _this._jobService.getJob(_this.jobId); })
                .then(function (job) { _this._job = job; })
                .then(function () {
                if (_this.isNew) {
                    return _this._applianceFactory.createNewApplianceViewModel();
                }
                else {
                    return _this._applianceService.getAppliance(_this.jobId, _this._applianceId)
                        .then(function (applianceBusinessModel) {
                        var getParentAppliancePromise;
                        if (applianceBusinessModel.parentId) {
                            getParentAppliancePromise = _this._applianceService.getAppliance(_this.jobId, applianceBusinessModel.parentId);
                        }
                        else {
                            getParentAppliancePromise = Promise.resolve(null);
                        }
                        return getParentAppliancePromise
                            .then(function (parentAppliance) {
                            var applianceTypeCatalogItem = _this.applianceTypeCatalog.find(function (a) { return a.applianceType === applianceBusinessModel.applianceType; });
                            return _this._applianceFactory
                                .createApplianceViewModelFromBusinessModel(applianceBusinessModel, applianceTypeCatalogItem, _this._centralHeatingApplianceHardwareCategory, _this._applianceRequiresGcCode, parentAppliance);
                        });
                    });
                }
            })
                .then(function (applianceViewModel) {
                _this.viewModel = applianceViewModel;
                _this.viewModel.gcCode = (_this.replaceAppliance) ? _this._newGcCode : _this.viewModel.gcCode;
                _this._savedGcCode = _this.viewModel.gcCode;
                var p = Promise.resolve();
                if (_this.replaceAppliance) {
                    p = _this._catalogService.getGCCode(_this.viewModel.gcCode)
                        .then(function (catalogItem) {
                        if (catalogItem) {
                            _this.viewModel.description = catalogItem.gcCodeDescription.substr(0, _this.getValidationRule("viewModel.description").maxLength);
                            _this.viewModel.applianceType = catalogItem.applianceTypeCode;
                            _this.applianceTypeChanged(_this.viewModel.applianceType, undefined);
                        }
                    });
                }
                return p.then(function () {
                    if (_this.isNew) {
                        _this.setNewDataState(_this.viewModel.dataStateGroup);
                    }
                    else {
                        _this.setInitialDataState(_this.viewModel.dataStateId, _this.viewModel.dataState);
                    }
                    // if we are hitting undo, we need to transmit the gcCode/description change
                    _this.publishApplianceDetailsChangedEvent();
                    if (!!_this.viewModel.contractType) {
                        return _this._catalogService.getApplianceContractType(_this.viewModel.contractType).then(function (applianceContractType) {
                            _this.contractTypeDescription = applianceContractType.applianceContractTypeDescription || undefined;
                        });
                    }
                    return Promise.resolve();
                });
            })
                .delay(1)
                .then(function () {
                _this.setPropertyChangeHandlers();
                _this._isLoading = false;
            });
        };
        ApplianceDetails.prototype.saveModel = function () {
            var _this = this;
            if (this.isNew) {
                // this.isNew = false;
                return this._applianceFactory.createApplianceBusinessModelFromViewModel(this.viewModel, this._job, this._engineerWorkingSector)
                    .then(function (applianceBusinessModel) {
                    applianceBusinessModel.dataState = _this.getFinalDataState();
                    if (_this.replaceAppliance) {
                        return _this._applianceService.replaceAppliance(_this._job.id, applianceBusinessModel, _this._oldApplianceId);
                    }
                    return _this._applianceService.createAppliance(_this._job.id, applianceBusinessModel);
                });
            }
            else {
                // get the existing appliance business model first
                return this._applianceService.getAppliance(this._job.id, this.viewModel.id)
                    .then(function (applianceBusinessModel) { return _this._applianceFactory.updateApplianceBusinessModelFromViewModel(_this.viewModel, objectHelper_1.ObjectHelper.clone(applianceBusinessModel)); })
                    .then(function (applianceBusinessModel) {
                    applianceBusinessModel.dataState = _this.getFinalDataState();
                    return _this._applianceService.updateAppliance(_this._job.id, applianceBusinessModel, _this._isDirty, _this._gcCodeChanged);
                });
            }
        };
        ApplianceDetails.prototype.clearModel = function () {
            this.viewModel.gcCode = undefined;
            this.viewModel.description = undefined;
            this.viewModel.locationDescription = undefined;
            this.viewModel.installationYear = undefined;
            this.viewModel.serialId = undefined;
            this.viewModel.flueType = undefined;
            this.viewModel.bgInstallationIndicator = undefined;
            this.viewModel.condition = undefined;
            this.viewModel.systemType = undefined;
            this.viewModel.systemDesignCondition = undefined;
            this.viewModel.numberOfRadiators = undefined;
            this.viewModel.numberOfSpecialRadiators = undefined;
            this.viewModel.boilerSize = undefined;
            this.viewModel.cylinderType = undefined;
            this.viewModel.energyControl = undefined;
            return Promise.resolve();
        };
        ApplianceDetails.prototype.publishApplianceDetailsChangedEvent = function () {
            this._eventAggregator.publish(applianceDetailsConstants_1.ApplianceDetailsConstants.DETAILS_CHANGED, {
                description: this.viewModel.description,
                gccode: this.viewModel.gcCode
            });
        };
        ApplianceDetails.prototype.setPropertyChangeHandlers = function () {
            var _this = this;
            this.disposeSubscriptions();
            var applianceTypeSubscription = this._bindingEngine
                .propertyObserver(this.viewModel, "applianceType")
                .subscribe(function (newValue, oldValue) { return _this.applianceTypeChanged(newValue, oldValue); });
            this._propertySubscriptions.push(applianceTypeSubscription);
            var gcCodeSubscription = this._bindingEngine
                .propertyObserver(this.viewModel, "gcCode")
                .subscribe(function (newValue, oldValue) { return _this.gcCodeChanged(newValue, oldValue); });
            this._propertySubscriptions.push(gcCodeSubscription);
            var applianceDescription = this._bindingEngine
                .propertyObserver(this.viewModel, "description")
                .subscribe(function (newValue, oldValue) { return _this.applianceDescriptionChanged(newValue, oldValue); });
            this._propertySubscriptions.push(applianceDescription);
        };
        ApplianceDetails.prototype.disposeSubscriptions = function () {
            if (this._propertySubscriptions) {
                this._propertySubscriptions.forEach(function (subscription) { return subscription.dispose(); });
                this._propertySubscriptions = [];
            }
        };
        ApplianceDetails.prototype.buildBusinessRules = function () {
            var _this = this;
            this._centralHeatingApplianceHardwareCategory = this.getBusinessRule("centralHeatingApplianceHardwareCategory");
            this._applianceRequiresGcCode = this.getBusinessRule("applianceRequiresGcCode");
            this._isDefaultGcCode = this.getBusinessRule("isDefaultGcCode");
            this._applianceTyepAllowsCreation = this.getBusinessRule("applianceTypeAllowsCreation");
            this._applianceTypeCatalogExclusions = this.getBusinessRule("applianceTypeCatalogExclusions").split(";");
            this._parentApplianceIndicator = this.getBusinessRule("parentApplianceIndicator");
            return this._businessRuleService.getQueryableRuleGroup("applianceFactory").then(function (applianceFactoryBusinessRules) {
                _this._instPremApplianceType = applianceFactoryBusinessRules.getBusinessRule("instPremApplianceType");
            });
        };
        ApplianceDetails.prototype.loadCatalogs = function () {
            var _this = this;
            return Promise.all([
                this.buildNoYesList(),
                this._catalogService.getObjectTypes(),
                this._catalogService.getFlueTypes(),
                this._catalogService.getApplianceConditions(),
                this._catalogService.getApplianceSystemTypes(),
                this._catalogService.getSystemDesignAndCondition(),
                this._catalogService.getApplianceCylinderTypes(),
                this._catalogService.getEnergyControls(),
                this._applianceService.getAppliances(this.jobId)
            ])
                .then(function (_a) {
                var bgInstallationYesNo = _a[0], applianceTypesCatalog = _a[1], flueTypesCatalog = _a[2], applianceConditionCatalog = _a[3], systemTypeCatalog = _a[4], systemDesignAndConditionCatalog = _a[5], cylinderTypeCatalog = _a[6], energyControlsCatalog = _a[7], appliances = _a[8];
                _this.bgInstallationYesNoLookup = bgInstallationYesNo;
                _this.applianceTypeCatalog = applianceTypesCatalog;
                var isINSApplianceExists = appliances.some(function (a) { return a.applianceType === _this._instPremApplianceType; });
                _this.creatableApplianceTypesCatalog = applianceTypesCatalog
                    .filter(function (c) { return c.allowCreateInField === _this._applianceTyepAllowsCreation; })
                    .filter(function (c) { return (_this._applianceTypeCatalogExclusions || []).indexOf(c.applianceType) === -1; })
                    .filter(function (c) { return isINSApplianceExists ? c.applianceType !== _this._instPremApplianceType : true; });
                _this.flueTypesCatalog = flueTypesCatalog;
                _this.applianceConditionCatalog = applianceConditionCatalog;
                _this.systemTypeCatalog = systemTypeCatalog;
                _this.systemDesignAndConditionCatalog = systemDesignAndConditionCatalog;
                _this.cylinderTypeCatalog = cylinderTypeCatalog;
                _this.energyControlsCatalog = _this.toSortedArray(energyControlsCatalog, catalogConstants_1.CatalogConstants.ENERGY_CONTROLS_ID);
            });
        };
        ApplianceDetails.prototype.buildValidationRules = function () {
            var _this = this;
            return this.buildValidation([
                {
                    property: "viewModel.installationYear",
                    passes: [
                        {
                            test: function () { return _this.viewModel.installationYear && _this.viewModel.installationYear.toString().length === 4 ?
                                _this.viewModel.installationYear <= new Date().getFullYear() : true; },
                            message: this.getLabel("invalidYear")
                        }
                    ]
                }, {
                    property: "viewModel.flueType",
                    condition: function () { return _this.viewModel.isGasAppliance && _this.viewModel.applianceType !== "INS"; },
                }, { property: "viewModel.condition", condition: function () { return _this.viewModel.isCentralHeatingAppliance; } },
                { property: "viewModel.systemType", condition: function () { return _this.viewModel.isCentralHeatingAppliance; } },
                { property: "viewModel.serialId", condition: function () { return _this.viewModel.serialId !== null && _this.viewModel.serialId !== undefined && _this.viewModel.serialId !== ""; } },
                { property: "viewModel.systemDesignCondition", condition: function () { return _this.viewModel.isCentralHeatingAppliance; } },
                { property: "viewModel.numberOfRadiators", condition: function () { return _this.viewModel.isCentralHeatingAppliance; } },
                {
                    property: "viewModel.numberOfSpecialRadiators",
                    condition: function () { return _this.viewModel.isCentralHeatingAppliance; },
                    passes: [
                        {
                            test: function () { return _this.viewModel.numberOfSpecialRadiators > 0
                                ? +_this.viewModel.numberOfRadiators >= +_this.viewModel.numberOfSpecialRadiators
                                : true; },
                            message: this.getLabel("invalidNumberOfSpecialRadiators")
                        }
                    ]
                },
                { property: "viewModel.boilerSize", condition: function () { return _this.viewModel.isCentralHeatingAppliance; } },
                { property: "viewModel.cylinderType", condition: function () { return _this.viewModel.isCentralHeatingAppliance; } },
                { property: "viewModel.energyControl", condition: function () { return _this.viewModel.isCentralHeatingAppliance; } },
                { property: "viewModel.description", condition: function () { return !_this.viewModel.requiresGcCode; } },
                {
                    property: "viewModel.gcCode",
                    // validate gcCode rules (maxLength etc.) if type is requiresGcCode, or the user has entered some text
                    // remember that condition() turns on/off all of the standard rules as well as the custom "passes" rules
                    // #18271 removed condition to make all GC Codes required, but still check validity when requiresGcCode = true
                    condition: function () { return true; },
                    passes: [
                        {
                            // but if not a requiresGcCode type, then do not check the reference data as it will never be in there.
                            // remember that this rule only kicks in only if all other previously tested rules for this property have passed
                            test: function () { return !_this.viewModel.requiresGcCode
                                || _this.hasValidGcCode(); },
                            message: this.getLabel("invalidGcCode")
                        }
                    ]
                }
            ]);
        };
        ApplianceDetails.prototype.hasValidGcCode = function () {
            var _this = this;
            return this._catalogService.getGCCode(this.viewModel.gcCode)
                .then(function (catalogItem) { return catalogItem && catalogItem.applianceTypeCode === _this.viewModel.applianceType; });
        };
        ApplianceDetails.prototype.getGCCodeDescription = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this._catalogService.getGCCode(this.viewModel.gcCode)
                            .then(function (catalogItem) {
                            if (catalogItem && (catalogItem.applianceTypeCode === _this.viewModel.applianceType)) {
                                _this.viewModel.description = catalogItem.gcCodeDescription.substr(0, _this.getValidationRule("viewModel.description").maxLength);
                                _this.isKnownGcCodeSelected = true;
                            }
                            _this.publishApplianceDetailsChangedEvent();
                        })];
                });
            });
        };
        ApplianceDetails.prototype.checkIfApplianceReplacementOrAmendmentRequired = function () {
            return __awaiter(this, void 0, void 0, function () {
                var isGCCodeValid, applianceReplacementConfirmation, applianceAmendmentConfirmation, newApplianceGcCode;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.hasValidGcCode()];
                        case 1:
                            isGCCodeValid = _a.sent();
                            if (!isGCCodeValid) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.showConfirmation(this.getLabel("confirmation"), this.getLabel("replaceApplianceQuestion"))];
                        case 2:
                            applianceReplacementConfirmation = _a.sent();
                            if (!applianceReplacementConfirmation.wasCancelled) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.showConfirmation(this.getLabel("confirmation"), this.getLabel("amendApplianceQuestion"))];
                        case 3:
                            applianceAmendmentConfirmation = _a.sent();
                            if (applianceAmendmentConfirmation.wasCancelled) {
                                this.viewModel.gcCode = this._savedGcCode;
                                return [2 /*return*/, Promise.resolve()];
                            }
                            else {
                                return [2 /*return*/, this.getGCCodeDescription()];
                            }
                            return [3 /*break*/, 5];
                        case 4:
                            newApplianceGcCode = this.viewModel.gcCode;
                            this.viewModel.gcCode = this._savedGcCode;
                            this._router.navigateToRoute("appliance", { applianceId: guid_1.Guid.empty, newGcCode: newApplianceGcCode, oldApplianceId: this.viewModel.id });
                            _a.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        __decorate([
            aurelia_framework_1.observable,
            __metadata("design:type", String)
        ], ApplianceDetails.prototype, "selectedDefaultGcCode", void 0);
        ApplianceDetails = __decorate([
            aurelia_framework_1.inject(jobService_1.JobService, engineerService_1.EngineerService, labelService_1.LabelService, applianceService_1.ApplianceService, applianceFactory_1.ApplianceFactory, aurelia_router_1.Router, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService, aurelia_framework_1.BindingEngine, storageService_1.StorageService),
            __metadata("design:paramtypes", [Object, Object, Object, Object, Object, aurelia_router_1.Router,
                aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, Object, aurelia_framework_1.BindingEngine, Object])
        ], ApplianceDetails);
        return ApplianceDetails;
    }(editableViewModel_1.EditableViewModel));
    exports.ApplianceDetails = ApplianceDetails;
});

//# sourceMappingURL=applianceDetails.js.map
