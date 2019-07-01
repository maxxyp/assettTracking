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
define(["require", "exports", "aurelia-logging", "../catalogService", "aurelia-dependency-injection", "../storageService", "../../models/businessException", "moment"], function (require, exports, Logging, catalogService_1, aurelia_dependency_injection_1, storageService_1, businessException_1, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChargeCatalogHelperService = /** @class */ (function () {
        function ChargeCatalogHelperService(catalogService, storageService) {
            this._catalogService = catalogService;
            this._storageService = storageService;
            this._logger = Logging.getLogger("ChargeCatalogHelperService");
        }
        ChargeCatalogHelperService.prototype.getValidDiscounts = function (discounts) {
            var currentDate = moment();
            if (!discounts) {
                return [];
            }
            var discountsNoEndDate = discounts.filter(function (d) {
                var _a = d.discountEndDate, discountEndDate = _a === void 0 ? "" : _a;
                return discountEndDate === "";
            });
            var discountWithinDateRange = discounts.filter(function (d) { return (currentDate.isBetween(d.discountStartDate, d.discountEndDate)); });
            return discountWithinDateRange.concat(discountsNoEndDate);
        };
        ChargeCatalogHelperService.prototype.getVatRate = function (vatCodeToCheck, taskStartTime, vatDateFormat, vats) {
            // get the vat, see if we can find one where the task date lies within the date range, if not find the current
            // vat rate, i.e. the vat rate where the end date is empty
            var vat = 0;
            if (!taskStartTime) {
                return vat;
            }
            var taskDate = moment(taskStartTime, vatDateFormat);
            var foundVat = vats.find(function (vr) {
                // being extra safe, in case api decides to omit the field all together
                var _a = vr.vatEndDate, vatEndDate = _a === void 0 ? "" : _a, vatCode = vr.vatCode;
                return vatCode === vatCodeToCheck && vatEndDate === "";
            });
            if (!foundVat) {
                foundVat = vats.find(function (vr) { return (moment(taskDate).isBetween(vr.vatStartDate, vr.vatEndDate)) && vr.vatCode === vatCodeToCheck; });
            }
            if (!foundVat) {
                return vat;
            }
            return foundVat.vatRate;
        };
        ChargeCatalogHelperService.prototype.getJobCodeChargeRule = function (jobType, applianceType, chargeType, chargeRulesDateFormat, chargeMethodCodeLength) {
            return __awaiter(this, void 0, void 0, function () {
                var taskDate, items, filteredItems, filteredItemsDateFormatted, areaCode_1, err, exception_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            taskDate = moment(new Date());
                            return [4 /*yield*/, this._catalogService.getJCChargeRules(jobType, applianceType)];
                        case 1:
                            items = _a.sent();
                            filteredItems = items.filter(function (i) { return i.chargeType + i.contractType === chargeType; });
                            filteredItemsDateFormatted = filteredItems.filter(function (i) {
                                var effectiveDate = moment(i.effectiveDate, chargeRulesDateFormat);
                                var expirationDate = moment(i.expirationDate, chargeRulesDateFormat);
                                return taskDate.isBetween(effectiveDate, expirationDate);
                            });
                            // check area charge rules, there can be multiple rules per location, so we need to see if we can get a charge
                            // rule seq number. Note, we could have queried this first, but its a big table and a area charge code lookup
                            // will not be required in most cases. Check only if necessary.
                            // if more than one charge rule, assume multiple location-based charging and get rule sequence
                            if (!filteredItemsDateFormatted || filteredItemsDateFormatted.length === 0) {
                                return [2 /*return*/, null];
                            }
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.getAreaChargeRules(chargeType, jobType, applianceType, taskDate, chargeMethodCodeLength, chargeRulesDateFormat)];
                        case 3:
                            areaCode_1 = _a.sent();
                            if (!areaCode_1) {
                                err = new businessException_1.BusinessException(this, "chargeService.getJobCodeChargeRule", "could not locate area charge rule", null, "ChargeType: " + chargeType + ", JobType: " + jobType + ", ApplianceType: " + applianceType);
                                this._logger.error(err.toString());
                                return [2 /*return*/, Promise.reject(err)];
                            }
                            return [2 /*return*/, filteredItemsDateFormatted.find(function (i) { return i.chargeRuleSequence === areaCode_1.chargeRuleSequence; })];
                        case 4:
                            exception_1 = _a.sent();
                            return [2 /*return*/, Promise.reject(exception_1)];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        ChargeCatalogHelperService.prototype.getChargeTypesByApplianceJob = function (applianceType, jobType, chargeRulesDateFormat, chargeMethodCodeLength) {
            return __awaiter(this, void 0, void 0, function () {
                var chargeRules, ex, results, chargeTypes, deduped;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._catalogService.getJCChargeRules(jobType, applianceType)];
                        case 1:
                            chargeRules = _a.sent();
                            if (!chargeRules || chargeRules.length === 0) {
                                ex = new businessException_1.BusinessException("context", "taskAppliance", "no charge rules found for appliance " + applianceType + " and job type " + jobType, null, null);
                                throw (ex);
                            }
                            results = chargeRules.map(function (cr) { return "" + cr.chargeType + cr.contractType; });
                            return [4 /*yield*/, this._catalogService.getChargeTypes()];
                        case 2:
                            chargeTypes = _a.sent();
                            deduped = results.filter(function (el, i, arr) { return arr.indexOf(el) === i; });
                            return [2 /*return*/, deduped.map(function (r) { return chargeTypes.find(function (ct) { return ct.chargeType === r; }); })];
                    }
                });
            });
        };
        ChargeCatalogHelperService.prototype.getAreaChargeRules = function (chargeType, jobType, applianceType, taskDate, chargeMethodCodeLength, chargeRulesDateFormat) {
            return __awaiter(this, void 0, void 0, function () {
                var region, ctLen, appConTypeCode, areaChargeRules, filteredItems;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._storageService.getUserRegion()];
                        case 1:
                            region = _a.sent();
                            if (!region) {
                                return [2 /*return*/, Promise.reject(new businessException_1.BusinessException(this, "chargeService", "No region found. Check it has been set in preferences", null, null))];
                            }
                            ctLen = chargeType.length;
                            appConTypeCode = chargeType.substr(chargeMethodCodeLength, ctLen);
                            return [4 /*yield*/, this._catalogService.getAreaChargeRules(jobType, region)];
                        case 2:
                            areaChargeRules = _a.sent();
                            filteredItems = areaChargeRules.filter(function (acr) {
                                return acr.applianceType === applianceType
                                    && acr.contractType === appConTypeCode
                                    && acr.jobType === jobType
                                    && acr.companyCode === region;
                            });
                            // 31-dec-68 formats to the year 1968 year, 31-dec-69 formats to 2069. So that's why we have this if, else
                            return [2 /*return*/, filteredItems.find(function (i) {
                                    var expirationDate = moment(i.expirationDate, chargeRulesDateFormat);
                                    var effectiveDate = moment(i.effectiveDate, chargeRulesDateFormat);
                                    return taskDate.isBetween(effectiveDate, expirationDate);
                                })];
                    }
                });
            });
        };
        ChargeCatalogHelperService = __decorate([
            aurelia_dependency_injection_1.inject(catalogService_1.CatalogService, storageService_1.StorageService),
            __metadata("design:paramtypes", [Object, Object])
        ], ChargeCatalogHelperService);
        return ChargeCatalogHelperService;
    }());
    exports.ChargeCatalogHelperService = ChargeCatalogHelperService;
});

//# sourceMappingURL=chargeCatalogHelperService.js.map
