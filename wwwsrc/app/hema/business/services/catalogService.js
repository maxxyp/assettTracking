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
define(["require", "exports", "aurelia-dependency-injection", "./referenceDataService", "../../../common/core/services/configurationService", "../../../common/core/objectHelper", "./constants/catalogConstants"], function (require, exports, aurelia_dependency_injection_1, referenceDataService_1, configurationService_1, objectHelper_1, catalogConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CatalogService = /** @class */ (function () {
        function CatalogService(referenceDataService, configurationService) {
            this._referenceDataService = referenceDataService;
            this._catalogCahe = {};
        }
        CatalogService.prototype.getItemDescription = function (catalog, keyFields, keys, descriptionField) {
            var indexName = "";
            var keysValue;
            if (keyFields) {
                indexName = keyFields.join("_");
            }
            if (keys) {
                /* Indexed DB lookups with single index name will only accept a single value not an array for the lookup
                 * so grab the first element if its a singular */
                if (keys.length === 1) {
                    keysValue = keys[0];
                }
                else {
                    keysValue = keys;
                }
            }
            return !(catalog && indexName && keysValue && descriptionField) ? Promise.resolve(undefined) :
                this._referenceDataService.getItem(catalog, indexName, keysValue)
                    .then(function (item) { return objectHelper_1.ObjectHelper.getPathValue(item, descriptionField); })
                    .then(function (description) {
                    return description;
                });
        };
        /* Ungrouped */
        CatalogService.prototype.getActivityComponentVisitStatuses = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.ACTIVITY_COMPONENT_VISIT_STATUS, undefined, undefined);
        };
        CatalogService.prototype.getAdviceResults = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.ADVICE_RESULT, undefined, undefined);
        };
        CatalogService.prototype.getApplianceConditions = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.APPLIANCE_CONDITION, undefined, undefined);
        };
        CatalogService.prototype.getApplianceContractType = function (id) {
            return this._referenceDataService.getItem(catalogConstants_1.CatalogConstants.APPLIANCE_CONTRACT_TYPE, catalogConstants_1.CatalogConstants.APPLIANCE_CONTRACT_TYPE_ID, id);
        };
        CatalogService.prototype.getApplianceCylinderTypes = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.APPLIANCE_CYLINDER_TYPE, undefined, undefined);
        };
        CatalogService.prototype.getApplianceElectricalType = function (id) {
            return this._referenceDataService.getItem(catalogConstants_1.CatalogConstants.APPLIANCE_ELETRICAL_TYPE, catalogConstants_1.CatalogConstants.APPLIANCE_ELETRICAL_TYPE_ID, id);
        };
        CatalogService.prototype.getApplianceSystemTypes = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.APPLIANCE_SYSTEM_TYPE, undefined, undefined);
        };
        CatalogService.prototype.getAppointmentBands = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.APPOINTMENT_BAND, undefined, undefined);
        };
        CatalogService.prototype.getAreaChargeRules = function (actionType, companyCode) {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.AREA_CHARGE_RULE, catalogConstants_1.CatalogConstants.AREA_CHARGE_RULE_ACTION_TYPE_CODE + "_" + catalogConstants_1.CatalogConstants.AREA_CHARGE_RULE_COMPANY_CODE, [actionType, companyCode]);
        };
        CatalogService.prototype.getBusinessRules = function (viewModel) {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.BUSINESS_RULE, catalogConstants_1.CatalogConstants.BUSINESS_RULE_VIEW_MODEL, viewModel);
        };
        CatalogService.prototype.getChargeDisputes = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.CHARGE_DISPUTE, undefined, undefined);
        };
        CatalogService.prototype.getChargeOptions = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.CHARGE_OPTION, undefined, undefined);
        };
        CatalogService.prototype.getChargeType = function (id) {
            return this._referenceDataService.getItem(catalogConstants_1.CatalogConstants.CHARGE_TYPE, catalogConstants_1.CatalogConstants.CHARGE_TYPE_ID, id);
        };
        CatalogService.prototype.getChargeTypes = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.CHARGE_TYPE, undefined, undefined);
        };
        CatalogService.prototype.getChirpCodes = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.CHIRP_CODE, undefined, undefined);
        };
        CatalogService.prototype.getConsumable = function (id) {
            return this._referenceDataService.getItem(catalogConstants_1.CatalogConstants.CONSUMABLE_TYPE, catalogConstants_1.CatalogConstants.CONSUMABLE_TYPE_ID, id);
        };
        CatalogService.prototype.loadConsumables = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = this._catalogCahe;
                            _b = catalogConstants_1.CatalogConstants.CONSUMABLE_TYPE;
                            return [4 /*yield*/, this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.CONSUMABLE_TYPE, undefined, undefined)];
                        case 1:
                            _a[_b] = _c.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        CatalogService.prototype.getConsumables = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!this._catalogCahe[catalogConstants_1.CatalogConstants.CONSUMABLE_TYPE]) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.loadConsumables()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/, this._catalogCahe[catalogConstants_1.CatalogConstants.CONSUMABLE_TYPE]];
                    }
                });
            });
        };
        CatalogService.prototype.getDiscounts = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.DISCOUNT, undefined, undefined);
        };
        CatalogService.prototype.getEnergyControls = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.ENERGY_CONTROLS, undefined, undefined);
        };
        CatalogService.prototype.getEeaCategories = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.ENERGY_ADVICE_CATEGORY, undefined, undefined);
        };
        CatalogService.prototype.getObjectType = function (applianceType) {
            return this._referenceDataService.getItem(catalogConstants_1.CatalogConstants.OBJECT_TYPE, catalogConstants_1.CatalogConstants.OBJECT_TYPE_ID, applianceType);
        };
        CatalogService.prototype.getObjectTypes = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.OBJECT_TYPE, undefined, undefined);
        };
        CatalogService.prototype.getElectricalApplianceTypes = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.ELECTRICAL_APPLIANCE_TYPE, undefined, undefined);
        };
        CatalogService.prototype.getElectricalSystemTypes = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.ELECTRICAL_SYSTEM_TYPE, undefined, undefined);
        };
        CatalogService.prototype.getFaultActionCodes = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.FAULT_ACTION_CODE, undefined, undefined);
        };
        CatalogService.prototype.getFieldOperativeStatuses = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.FIELD_OPERATIVE_STATUS, undefined, undefined);
        };
        CatalogService.prototype.getFlueTypes = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.APPLIANCE_FLUE_TYPES, undefined, undefined);
        };
        CatalogService.prototype.getGCCode = function (id) {
            return this._referenceDataService.getItem(catalogConstants_1.CatalogConstants.GC_CODE, catalogConstants_1.CatalogConstants.GC_CODE_ID, id);
        };
        CatalogService.prototype.getGCCodes = function (objTypeCode) {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.GC_CODE, catalogConstants_1.CatalogConstants.GC_CODE_OBJECT_TYPE_CODE, objTypeCode);
        };
        CatalogService.prototype.getGoodsType = function (id) {
            return this._referenceDataService.getItem(catalogConstants_1.CatalogConstants.GOODS_TYPE, catalogConstants_1.CatalogConstants.GOODS_TYPE_ID, id);
        };
        CatalogService.prototype.getGoodsItemStatuses = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.GOODS_ITEM_STATUS, undefined, undefined);
        };
        CatalogService.prototype.getJCApplianceCode = function (id) {
            return this._referenceDataService.getItem(catalogConstants_1.CatalogConstants.JC_APPLIANCE_CODE, catalogConstants_1.CatalogConstants.JC_APPLIANCE_CODE_ID, id);
        };
        CatalogService.prototype.getJCChargeRules = function (actionTypeCode, objectTypeCode) {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.JC_CHARGE_RULES, catalogConstants_1.CatalogConstants.JC_CHARGE_RULES_ACTION_TYPE_CODE + "_" + catalogConstants_1.CatalogConstants.JC_CHARGE_RULES_OBJECT_TYPE_CODE, [actionTypeCode, objectTypeCode]);
        };
        CatalogService.prototype.getJCJobCode = function (id) {
            return this._referenceDataService.getItem(catalogConstants_1.CatalogConstants.JC_JOB_CODE, catalogConstants_1.CatalogConstants.JC_JOB_CODE_ID, id);
        };
        CatalogService.prototype.getJCJobCodes = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.JC_JOB_CODE, undefined, undefined);
        };
        CatalogService.prototype.getJCServiceLevelCode = function (id) {
            return this._referenceDataService.getItem(catalogConstants_1.CatalogConstants.JC_SERVICE_LEVEL_CODE, catalogConstants_1.CatalogConstants.JC_SERVICE_LEVEL_CODE_ID, id);
        };
        CatalogService.prototype.getLabels = function (viewModel) {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.LABEL, catalogConstants_1.CatalogConstants.LABEL_VIEW_MODEL, viewModel);
        };
        CatalogService.prototype.getLabourChargeRule = function (id) {
            return this._referenceDataService.getItem(catalogConstants_1.CatalogConstants.LABOUR_CHARGE_RULE, catalogConstants_1.CatalogConstants.LABOUR_CHARGE_RULE_ID, id);
        };
        CatalogService.prototype.getPartTypes = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.PART_TYPE, undefined, undefined);
        };
        CatalogService.prototype.getPartTypeFaultActions = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.PART_TYPE_FAULT_ACTION, undefined, undefined);
        };
        CatalogService.prototype.getProductGroups = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.PRODUCT_GROUP, undefined, undefined);
        };
        CatalogService.prototype.getPartsNotUsedReasons = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.PARTS_NOT_USED_REASON, undefined, undefined);
        };
        CatalogService.prototype.getPartOrderStatuses = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.PART_ORDER_STATUS, undefined, undefined);
        };
        CatalogService.prototype.getPassFailNas = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.PASS_FAIL_NA, undefined, undefined);
        };
        CatalogService.prototype.getPerformanceTestReasons = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.PERFORMANCE_TEST_REASON, undefined, undefined);
        };
        CatalogService.prototype.getPrimeChargeIntervals = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.PRIME_CHARGE_INTERVAL, undefined, undefined);
        };
        CatalogService.prototype.getReadTypeMappings = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.READ_TYPE_MAPPING, undefined, undefined);
        };
        CatalogService.prototype.getReadingTypes = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.READING_TYPE, undefined, undefined);
        };
        CatalogService.prototype.getSafetyAction = function (id) {
            return this._referenceDataService.getItem(catalogConstants_1.CatalogConstants.SAFETY_ACTION, catalogConstants_1.CatalogConstants.SAFETY_ACTION_ID, id);
        };
        CatalogService.prototype.getSafetyActions = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.SAFETY_ACTION, undefined, undefined);
        };
        CatalogService.prototype.getSafetyNoticeStatus = function (id) {
            return this._referenceDataService.getItem(catalogConstants_1.CatalogConstants.SAFETY_NOTICE_STATUS, catalogConstants_1.CatalogConstants.SAFETY_NOTICE_STATUS_ID, id);
        };
        CatalogService.prototype.getSafetyNoticeStatuses = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.SAFETY_NOTICE_STATUS, undefined, undefined);
        };
        CatalogService.prototype.getSafetyNoticeType = function (id) {
            return this._referenceDataService.getItem(catalogConstants_1.CatalogConstants.SAFETY_NOTICE_TYPE, catalogConstants_1.CatalogConstants.SAFETY_NOTICE_TYPE_ID, id);
        };
        CatalogService.prototype.getSafetyNoticeTypes = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.SAFETY_NOTICE_TYPE, undefined, undefined);
        };
        CatalogService.prototype.getSafetyReadingCat = function (flag, id) {
            return this._referenceDataService.getItem(catalogConstants_1.CatalogConstants.SAFETY_READING_CAT, catalogConstants_1.CatalogConstants.SAFETY_READING_CAT_GROUP + "_" + catalogConstants_1.CatalogConstants.SAFETY_READING_CAT_ID, [flag, id]);
        };
        CatalogService.prototype.getSafetyReadingCats = function (flag) {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.SAFETY_READING_CAT, catalogConstants_1.CatalogConstants.SAFETY_READING_CAT_GROUP, flag);
        };
        CatalogService.prototype.getSafetyReasonCats = function (flag) {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_GROUP, flag)
                .then(function (safetyReasons) { return safetyReasons.filter(function (safetyReason) { return safetyReason.safetyReasonCategoryCode !== "NRENG"; }); });
        };
        CatalogService.prototype.getSubsequentChargeIntervals = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.SUBSEQUENT_CHARGE_INTERVAL, undefined, undefined);
        };
        CatalogService.prototype.getSystemDesignAndCondition = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.SYSTEM_DESIGN_AND_CONDITION, undefined, undefined);
        };
        CatalogService.prototype.getValidations = function (viewModel) {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.VALIDATION, catalogConstants_1.CatalogConstants.VALIDATION_VIEW_MODEL, viewModel);
        };
        CatalogService.prototype.getVats = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.VAT, undefined, undefined);
        };
        CatalogService.prototype.getVisitActivityCodes = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.VISIT_ACTIVITY_CODE, undefined, undefined);
        };
        CatalogService.prototype.getVisitActivityFaultActions = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.VISIT_ACTIVITY_FAULT_ACTION, undefined, undefined);
        };
        CatalogService.prototype.getWorkedOns = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.WORKED_ON, undefined, undefined);
        };
        CatalogService.prototype.getYesNoNotCheckeds = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.YES_NO_NOTCHECKED, undefined, undefined);
        };
        CatalogService.prototype.getYesNoNotCheckedNas = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.YES_NO_NOTCHECKED_NA, undefined, undefined);
        };
        CatalogService.prototype.getRegion = function (id) {
            return this._referenceDataService.getItem(catalogConstants_1.CatalogConstants.REGION, catalogConstants_1.CatalogConstants.REGION_ID, id);
        };
        CatalogService.prototype.getRegions = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.REGION, undefined, undefined);
        };
        CatalogService.prototype.getFieldActivityType = function (objectTypeCode) {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.FIELD_ACTIVITY_TYPE, catalogConstants_1.CatalogConstants.FIELD_ACTIVITY_TYPE_OBJECT_TYPE_CODE, objectTypeCode);
        };
        CatalogService.prototype.getActionType = function (actionTypeCode) {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.ACTION_TYPE, catalogConstants_1.CatalogConstants.ACTION_TYPE_ID, actionTypeCode);
        };
        CatalogService.prototype.getFieldOprtvClaimType = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.FIELD_OPRTV_CLAIM_TYPE, undefined, undefined);
        };
        CatalogService.prototype.getIaciCode = function () {
            return this._referenceDataService.getItems(catalogConstants_1.CatalogConstants.IACI_CODE, undefined, undefined);
        };
        CatalogService = __decorate([
            aurelia_dependency_injection_1.inject(referenceDataService_1.ReferenceDataService, configurationService_1.ConfigurationService),
            __metadata("design:paramtypes", [Object, Object])
        ], CatalogService);
        return CatalogService;
    }());
    exports.CatalogService = CatalogService;
});

//# sourceMappingURL=catalogService.js.map
