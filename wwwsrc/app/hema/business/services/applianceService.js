/// <reference path="../../../../typings/app.d.ts" />
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
define(["require", "exports", "aurelia-framework", "../models/appliance", "../models/history", "./jobService", "../models/businessException", "../../../common/core/arrayHelper", "../../business/services/catalogService", "../../business/services/businessRuleService", "../models/dataState", "../../common/factories/baseApplianceFactory", "../../business/services/bridgeBusinessService", "../../../common/core/guid", "./storageService", "../../common/dataStateManager", "./taskService", "../../presentation/constants/adaptCssClassConstants", "./constants/adaptAvailabilityAttributeType", "../models/applianceOperationType"], function (require, exports, aurelia_framework_1, appliance_1, history_1, jobService_1, businessException_1, arrayHelper_1, catalogService_1, businessRuleService_1, dataState_1, baseApplianceFactory_1, bridgeBusinessService_1, guid_1, storageService_1, dataStateManager_1, taskService_1, adaptCssClassConstants_1, adaptAvailabilityAttributeType_1, applianceOperationType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ApplianceService = /** @class */ (function () {
        function ApplianceService(jobService, catalogService, businessRulesService, baseApplianceFactory, bridgeBusinessService, storageService, dataStateManager, taskService) {
            this._jobService = jobService;
            this._catalogService = catalogService;
            this._businessRulesService = businessRulesService;
            this._bridgeBusinessService = bridgeBusinessService;
            this._baseApplianceFactory = baseApplianceFactory;
            this._storageService = storageService;
            this._dataStateManager = dataStateManager;
            this._taskService = taskService;
        }
        ApplianceService.prototype.getChildApplianceId = function (jobId, parentApplianceId) {
            var _this = this;
            return this.getAppliances(jobId)
                .then(function (appliances) {
                var appliance = appliances.find(function (a) { return a.id === parentApplianceId; });
                if (!appliance) {
                    throw new businessException_1.BusinessException(_this, "getChildApplianceId", "applianceId not found", null, null);
                }
                return appliance.childId;
            })
                .catch(function (ex) {
                throw new businessException_1.BusinessException(_this, "getChildApplianceId", "could not get appliance", null, ex);
            });
        };
        ApplianceService.prototype.getAppliances = function (jobId) {
            var _this = this;
            return Promise.all([
                this._jobService.getJob(jobId),
                this._businessRulesService.getQueryableRuleGroup("applianceService"),
                this._catalogService.getObjectTypes(),
                this._storageService.getWorkingSector()
            ])
                .then(function (_a) {
                var job = _a[0], ruleGroup = _a[1], catalog = _a[2], sector = _a[3];
                _this.senatizeDescription(job, ruleGroup);
                var isElectricalEngineer = ruleGroup.getBusinessRule("electricalWorkingSector") === sector;
                // electrical and gas engineers need to see the appliance list sorted with their own type of appliance higher
                //  e.g. gas engineer sees gas appliances first, then electrical (the other), and vice versa
                var applianceCategoryPriorities = ruleGroup.getBusinessRuleList(isElectricalEngineer
                    ? "electricalApplianceCategorySortOrder"
                    : "gasApplianceCategorySortOrder");
                return _this.orderAppliances(job, applianceCategoryPriorities, catalog)
                    .filter(function (appliance) { return !appliance.isDeleted && !appliance.isExcluded; });
            })
                .catch(function (ex) {
                throw new businessException_1.BusinessException(_this, "appliances", "could not get appliances", null, ex);
            });
        };
        ApplianceService.prototype.getAppliancesForLandlordsCertificate = function (jobId) {
            return this.getAppliances(jobId).then(function (appliances) {
                return appliances.filter(function (a) { return a.isSafetyRequired && !a.isInstPremAppliance && !a.isExcluded; });
            });
        };
        ApplianceService.prototype.getAppliance = function (jobId, applianceId) {
            var _this = this;
            return this.getAppliances(jobId)
                .then(function (appliances) {
                var appliance = appliances.find(function (a) { return a.id === applianceId; });
                if (!appliance) {
                    throw new businessException_1.BusinessException(_this, "appliances", "applianceId not found", null, null);
                }
                return appliance;
            })
                .catch(function (ex) {
                throw new businessException_1.BusinessException(_this, "appliances", "could not get appliance", null, ex);
            });
        };
        ApplianceService.prototype.createAppliance = function (jobId, appliance) {
            var _this = this;
            var childApplianceIndicator;
            var childAppliance = null;
            var engineerWorkingSector = undefined;
            return this._storageService.getWorkingSector()
                .then(function (sector) {
                if (sector) {
                    engineerWorkingSector = sector;
                }
                else {
                    throw new businessException_1.BusinessException("applianceService", "createAppliance", "Required engineer working sector not found", null, null);
                }
            })
                .then(function () { return _this._jobService.getJob(jobId); })
                .then(function (job) {
                if (job) {
                    // first check if its a parent and child or just a normal appliance
                    // if it is a parent child, then create the child but dont save
                    return _this._businessRulesService.getQueryableRuleGroup("applianceService")
                        .then(function (businessRuleGroup) {
                        if (businessRuleGroup) {
                            return businessRuleGroup.getBusinessRule("childApplianceIndicator");
                        }
                        else {
                            throw new businessException_1.BusinessException("applianceService", "createAppliance", "Required business rule group not found", null, null);
                        }
                    })
                        .then(function (childApplianceIndicatorRule) {
                        if (childApplianceIndicatorRule) {
                            childApplianceIndicator = childApplianceIndicatorRule;
                            return null;
                        }
                        else {
                            throw new businessException_1.BusinessException("applianceService", "createAppliance", "Required business rule not found", null, null);
                        }
                    })
                        .then(function () { return _this._catalogService.getObjectTypes(); })
                        .then(function (applianceTypeCatalog) {
                        var parentCatalogItem = applianceTypeCatalog.find(function (a) { return a.applianceType === appliance.applianceType; });
                        if (parentCatalogItem) {
                            var childCatalogItem = applianceTypeCatalog.find(function (a) {
                                return a.association === childApplianceIndicator &&
                                    a.associationNumber === parentCatalogItem.associationNumber;
                            });
                            if (childCatalogItem) {
                                // there is a child appliance needed
                                childAppliance = new appliance_1.Appliance();
                                childAppliance.id = guid_1.Guid.newGuid();
                                childAppliance.parentId = appliance.id;
                                appliance.childId = childAppliance.id;
                                childAppliance.applianceType = childCatalogItem.applianceType;
                                childAppliance.flueType = appliance.flueType;
                                childAppliance.locationDescription = appliance.locationDescription;
                                childAppliance.isCreated = true;
                                return _this._baseApplianceFactory.populateBusinessModelFields(childAppliance, engineerWorkingSector)
                                    .then(function () {
                                    // cannot set to notVisited because the baseApplianceFactory.populateApplianceDataState logic
                                    //  will in most scenarios convert to dontCare
                                    childAppliance.dataState = dataState_1.DataState.invalid;
                                });
                            }
                            else {
                                return Promise.resolve();
                            }
                        }
                        else {
                            return Promise.resolve();
                        }
                    })
                        .then(function () {
                        _this.ensureHistoryExists(job);
                        appliance.isCreated = true;
                        job.history.appliances.push(appliance);
                        if (childAppliance) {
                            job.history.appliances.push(childAppliance);
                        }
                        return _this._dataStateManager.updateAppliancesDataState(job);
                    })
                        .then(function () { return _this._jobService.setJob(job); });
                }
                else {
                    throw new businessException_1.BusinessException(_this, "appliances", "no current job selected", null, null);
                }
            });
        };
        ApplianceService.prototype.updateAppliance = function (jobId, appliance, setIsUpdated, updateMakeAndModel) {
            var _this = this;
            return this._jobService.getJob(jobId)
                .then(function (job) {
                if (job) {
                    _this.ensureHistoryExists(job);
                    var existingApplianceIndex = job.history.appliances.findIndex(function (a) { return a.id === appliance.id; });
                    if (existingApplianceIndex >= 0) {
                        var existingAppliance = job.history.appliances[existingApplianceIndex];
                        if (appliance.flueType !== existingAppliance.flueType && appliance.safety && appliance.safety.applianceGasSafety) {
                            appliance.safety.applianceGasSafety.chimneyInstallationAndTests = undefined;
                        }
                        if (setIsUpdated) {
                            appliance.isUpdated = true;
                        }
                        job.history.appliances[existingApplianceIndex] = appliance;
                        var p = updateMakeAndModel ? _this.ensureAdaptInformationIsSynced(jobId) : Promise.resolve();
                        return p
                            .then(function () { return _this._dataStateManager.updateApplianceDataState(appliance, job); })
                            .then(function () { return _this._jobService.setJob(job); });
                    }
                    else {
                        throw new businessException_1.BusinessException(_this, "appliances", "saving appliance that does not exist", null, null);
                    }
                }
                else {
                    throw new businessException_1.BusinessException(_this, "appliances", "no current job selected", null, null);
                }
            });
        };
        ApplianceService.prototype.getApplianceSafetyDetails = function (jobId, applianceId) {
            return this.getAppliance(jobId, applianceId)
                .then(function (appliance) { return appliance.safety; });
        };
        ApplianceService.prototype.saveApplianceSafetyDetails = function (jobId, applianceId, applianceSafety, setIsUpdated, updateAdaptMakeAndModel) {
            var _this = this;
            return this.getAppliance(jobId, applianceId)
                .then(function (appliance) {
                appliance.safety = applianceSafety;
                return _this.updateAppliance(jobId, appliance, setIsUpdated, updateAdaptMakeAndModel);
            });
        };
        ApplianceService.prototype.saveElectricalSafetyDetails = function (jobId, applianceId, safetyDetail, unsafeDetail, setIsUpdated) {
            var _this = this;
            return this.getAppliance(jobId, applianceId)
                .then(function (appliance) {
                if (appliance) {
                    appliance.safety.applianceElectricalSafetyDetail = safetyDetail;
                    appliance.safety.applianceElectricalUnsafeDetail = unsafeDetail;
                    return _this.updateAppliance(jobId, appliance, setIsUpdated, false);
                }
                else {
                    // todo: throw error
                    throw new businessException_1.BusinessException(_this, "appliances", "no current appliance", null, null);
                }
            });
        };
        ApplianceService.prototype.isFullGcCode = function (gcCode) {
            return __awaiter(this, void 0, void 0, function () {
                var ruleGroup, rule;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._businessRulesService.getQueryableRuleGroup("applianceService")];
                        case 1:
                            ruleGroup = _a.sent();
                            rule = ruleGroup.getBusinessRule("fullGcCodeLength");
                            return [2 /*return*/, !!gcCode && parseInt(rule, 10) === gcCode.length];
                    }
                });
            });
        };
        ApplianceService.prototype.ensureAdaptInformationIsSynced = function (jobId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var job, _a, createIcon, ruleGroup, rule, isFullGcCode, appliances, appliancesToReset, appliancesThatShouldBeSynced, getAndAttachAdaptInfo;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = jobId;
                            if (!_a) return [3 /*break*/, 2];
                            return [4 /*yield*/, this._jobService.getJob(jobId)];
                        case 1:
                            _a = (_b.sent());
                            _b.label = 2;
                        case 2:
                            job = _a;
                            if (!job) {
                                return [2 /*return*/];
                            }
                            createIcon = function (className, key) { return ({ iconClassName: className, title: key }); };
                            return [4 /*yield*/, this._businessRulesService.getQueryableRuleGroup("applianceService")];
                        case 3:
                            ruleGroup = _b.sent();
                            rule = ruleGroup.getBusinessRule("fullGcCodeLength");
                            isFullGcCode = function (gcCode) { return !!gcCode && parseInt(rule, 10) === gcCode.length; };
                            appliances = (job.history && job.history.appliances || [])
                                .filter(function (appliance) { return appliance && !appliance.isDeleted; });
                            appliancesToReset = appliances
                                .filter(function (appliance) { return !isFullGcCode(appliance.gcCode)
                                || (appliance.adaptInfo && appliance.adaptInfo.gcCode !== appliance.gcCode); });
                            appliancesToReset
                                .forEach(function (appliance) {
                                appliance.adaptInfo = undefined;
                                appliance.headerIcons = [];
                            });
                            appliancesThatShouldBeSynced = appliances
                                .filter(function (appliance) { return isFullGcCode(appliance.gcCode)
                                && !appliance.adaptInfo; });
                            getAndAttachAdaptInfo = function (appliance) { return __awaiter(_this, void 0, void 0, function () {
                                var adaptInfo, error_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, 3, 4]);
                                            appliance.headerIcons = [createIcon(adaptCssClassConstants_1.AdaptCssClassConstants.BUSY, "loading")];
                                            return [4 /*yield*/, this._bridgeBusinessService.getApplianceInformation(appliance.gcCode)];
                                        case 1:
                                            adaptInfo = _a.sent();
                                            if (adaptInfo.foundInAdapt) {
                                                appliance.safety.applianceGasSafety.applianceMake = adaptInfo.manufacturer && adaptInfo.manufacturer.substr(0, 10);
                                                appliance.safety.applianceGasSafety.applianceModel = adaptInfo.description && adaptInfo.description.substr(0, 10);
                                                appliance.headerIcons = [];
                                                if (adaptInfo.safetyNotice) {
                                                    appliance.headerIcons.push(createIcon(adaptCssClassConstants_1.AdaptCssClassConstants.SAFETY_ISSUE, "gcStatusSafetyIssue"));
                                                }
                                                if (adaptInfo.availabilityStatus === adaptAvailabilityAttributeType_1.AdaptAvailabilityAttributeType.FOLIO) {
                                                    appliance.headerIcons.push(createIcon(adaptCssClassConstants_1.AdaptCssClassConstants.FOLIO, "gcStatusFolio"));
                                                }
                                                else if (adaptInfo.availabilityStatus === adaptAvailabilityAttributeType_1.AdaptAvailabilityAttributeType.WITHDRAWN) {
                                                    appliance.headerIcons.push(createIcon(adaptCssClassConstants_1.AdaptCssClassConstants.WITHDRAWN, "gcStatusWithdrawn"));
                                                }
                                                else if (adaptInfo.availabilityStatus === adaptAvailabilityAttributeType_1.AdaptAvailabilityAttributeType.REDUCED_PARTS_LIST) {
                                                    appliance.headerIcons.push(createIcon(adaptCssClassConstants_1.AdaptCssClassConstants.RESTRICTED, "gcStatusRsl"));
                                                }
                                                else if (adaptInfo.availabilityStatus === adaptAvailabilityAttributeType_1.AdaptAvailabilityAttributeType.SERVICE_LISTED) {
                                                    appliance.headerIcons.push(createIcon(adaptCssClassConstants_1.AdaptCssClassConstants.SERVICE_LISTED, "gcStatusSl"));
                                                }
                                                if (adaptInfo.ceased) {
                                                    appliance.headerIcons.push(createIcon(adaptCssClassConstants_1.AdaptCssClassConstants.CEASED, "gcStatusCeased"));
                                                }
                                            }
                                            else {
                                                appliance.headerIcons = [createIcon(adaptCssClassConstants_1.AdaptCssClassConstants.ERROR_ADAPT, "adaptError")];
                                            }
                                            return [3 /*break*/, 4];
                                        case 2:
                                            error_1 = _a.sent();
                                            appliance.headerIcons = [createIcon(adaptCssClassConstants_1.AdaptCssClassConstants.ERROR_ADAPT, "adaptError")];
                                            return [3 /*break*/, 4];
                                        case 3:
                                            // fallback logic - try to give a decent default to model
                                            if (!appliance.safety.applianceGasSafety.applianceModel && appliance.description) {
                                                appliance.safety.applianceGasSafety.applianceModel = appliance.description.substr(0, 10);
                                            }
                                            appliance.adaptInfo = { gcCode: appliance.gcCode, info: adaptInfo };
                                            return [7 /*endfinally*/];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); };
                            return [4 /*yield*/, Promise.map(appliancesThatShouldBeSynced, function (appliance) { return getAndAttachAdaptInfo(appliance); })];
                        case 4:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ApplianceService.prototype.replaceAppliance = function (jobId, appliance, oldApplianceId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var job, tasks, oldAppliance;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.createAppliance(jobId, appliance)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this._jobService.getJob(jobId)];
                        case 2:
                            job = _a.sent();
                            if (!job) return [3 /*break*/, 8];
                            tasks = job.tasks && job.tasks.filter(function (x) { return x.applianceId === oldApplianceId; });
                            if (!(tasks && tasks.length)) return [3 /*break*/, 4];
                            return [4 /*yield*/, Promise.map(tasks, function (task) { return _this._taskService.updateTaskAppliance(jobId, task.id, appliance.applianceType, appliance.id, task.jobType, task.chargeType); })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            oldAppliance = job.history.appliances.find(function (a) { return a.id === oldApplianceId; });
                            return [4 /*yield*/, this.deleteOrExcludeAppliance(jobId, oldApplianceId, applianceOperationType_1.ApplianceOperationType.delete)];
                        case 5:
                            _a.sent();
                            if (!oldAppliance.childId) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.deleteOrExcludeAppliance(jobId, oldAppliance.childId, applianceOperationType_1.ApplianceOperationType.delete)];
                        case 6:
                            _a.sent();
                            _a.label = 7;
                        case 7: return [3 /*break*/, 9];
                        case 8: throw new businessException_1.BusinessException(this, "replaceAppliance", "job not exist", null, null);
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        ApplianceService.prototype.deleteOrExcludeAppliance = function (jobId, applianceId, operation) {
            var _this = this;
            return this._jobService.getJob(jobId)
                .then(function (job) {
                if (job) {
                    var appliance = job.history.appliances.find(function (a) { return a.id === applianceId; });
                    if (appliance) {
                        appliance.isDeleted = operation === applianceOperationType_1.ApplianceOperationType.delete ? true : undefined;
                        appliance.isExcluded = operation === applianceOperationType_1.ApplianceOperationType.exclude ? true : undefined;
                    }
                    else {
                        throw new businessException_1.BusinessException(_this, "appliances", "deleting appliance that does not exist", null, null);
                    }
                    // todo crossover between appliances and tasks here
                    var tasksWithAppliance = job.tasks && job.tasks.filter(function (x) { return x.applianceId === applianceId; });
                    tasksWithAppliance.forEach(function (task) {
                        task.applianceId = undefined;
                        task.applianceType = undefined;
                        task.dataState = dataState_1.DataState.invalid;
                    });
                    return _this._dataStateManager.updateAppliancesDataState(job)
                        .then(function () { return _this._dataStateManager.updatePropertySafetyDataState(job); })
                        .then(function () { return _this._jobService.setJob(job); });
                }
                else {
                    throw new businessException_1.BusinessException(_this, "appliances", "no current job selected", null, null);
                }
            });
        };
        ApplianceService.prototype.ensureHistoryExists = function (job) {
            if (!job.history) {
                job.history = new history_1.History();
                job.history.appliances = [];
            }
            else if (!job.history.appliances) {
                job.history.appliances = [];
            }
        };
        ApplianceService.prototype.removeBadCharactersFromApplianceDesc = function (regex, appliance) {
            // if WMIS returns description with trailing full stop replace with empty string
            if (regex) {
                var desc = appliance.description;
                if (desc) {
                    appliance.description = desc.replace(new RegExp(regex), "");
                }
            }
        };
        ApplianceService.prototype.orderAppliances = function (job, categoryPriorities, catalog) {
            // the default ordering for appliances should be:
            //  0) child appliances must be shown immediately after their parent
            //  1) the appliance for task 001, then 002, then 003, etc. (i.e. in task id order)
            //  2) for a gas job: the remaining appliances, ordered by gas, then electric, then other
            //     for an electrical job: the remaining appliances, ordered by electric, then gas, then other
            var orderedAppliances = [];
            if (job.history) {
                var appliances_1 = job.history.appliances;
                if (appliances_1) {
                    var addApplianceOnce_1 = function (appliance) {
                        if (appliance && !orderedAppliances.find(function (app) { return app.id === appliance.id; })) {
                            orderedAppliances.push(appliance);
                        }
                    };
                    // handles making sure that parent/child pairs are always added as a
                    //   pair, and in the correct order.  It is possible that the child may be fed in before the parent.
                    var addApplianceOrPair_1 = function (appliance) {
                        if (appliance) {
                            // check for a child being added first
                            if (appliance.parentId) {
                                var parentApp = appliances_1.find(function (a) { return a.id === appliance.parentId; });
                                addApplianceOnce_1(parentApp);
                            }
                            addApplianceOnce_1(appliance);
                            // check for a parent being added first
                            if (appliance.childId) {
                                var childApp = appliances_1.find(function (a) { return a.id === appliance.childId; });
                                addApplianceOnce_1(childApp);
                            }
                        }
                    };
                    if (job.tasks) {
                        // add appliances for today's tasks, in task order
                        arrayHelper_1.ArrayHelper.sortByColumn(job.tasks, "id");
                        job.tasks.forEach(function (task) {
                            var appliance = appliances_1.find(function (app) { return app.id === task.applianceId; });
                            addApplianceOrPair_1(appliance);
                        });
                    }
                    var applianceAndTypeCodes_1 = appliances_1.map(function (app) {
                        var catalogItem = catalog.find(function (c) { return c.applianceType === app.applianceType; });
                        return {
                            appliance: app,
                            code: catalogItem ? catalogItem.applianceCategory : undefined
                        };
                    });
                    /* add appliance based on their categories */
                    categoryPriorities.forEach(function (category) {
                        applianceAndTypeCodes_1
                            .filter(function (app) { return app.code === category; })
                            .forEach(function (app) { return addApplianceOrPair_1(app.appliance); });
                    });
                    /* finally any that we have missed because they didn't have a category */
                    appliances_1.forEach(function (appliance) { return addApplianceOrPair_1(appliance); });
                }
            }
            return orderedAppliances;
        };
        ApplianceService.prototype.senatizeDescription = function (job, ruleGroup) {
            // reference: DF_553, in some cases, for e.g. First Visit, WMIS adds a trailing '.', so remove here.
            // todo remove this when WMIS clean up their appliance description for first visits
            var _this = this;
            var regex = ruleGroup.getBusinessRule("removeCharactersDescription");
            if (regex && job.history.appliances) {
                job.history.appliances.forEach(function (appliance) { return _this.removeBadCharactersFromApplianceDesc(regex, appliance); });
            }
        };
        ApplianceService = __decorate([
            aurelia_framework_1.inject(jobService_1.JobService, catalogService_1.CatalogService, businessRuleService_1.BusinessRuleService, baseApplianceFactory_1.BaseApplianceFactory, bridgeBusinessService_1.BridgeBusinessService, storageService_1.StorageService, dataStateManager_1.DataStateManager, taskService_1.TaskService),
            __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object])
        ], ApplianceService);
        return ApplianceService;
    }());
    exports.ApplianceService = ApplianceService;
});

//# sourceMappingURL=applianceService.js.map
