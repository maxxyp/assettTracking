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
define(["require", "exports", "aurelia-logging", "../../models/charge/primeSubCharge", "../../models/charge/primePricingInterval", "../../models/charge/subPricingInterval", "../catalogService", "aurelia-dependency-injection", "bignumber", "../../../../hema/core/numberHelper"], function (require, exports, Logging, primeSubCharge_1, primePricingInterval_1, subPricingInterval_1, catalogService_1, aurelia_dependency_injection_1, bignumber, numberHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChargeLabourHelperService = /** @class */ (function () {
        function ChargeLabourHelperService(catalogService) {
            this._catalogService = catalogService;
            this._logger = Logging.getLogger("ChargeLabourHelperService");
        }
        /**
         *
         * @param {ChargeableTask} chargeableTask
         * @param {IJcChargeRules} jcChargeRule
         * @param {IChargeLabourCatalogDependencies} catalogDependencies
         * @returns {Promise<ChargeableTask>}
         */
        ChargeLabourHelperService.prototype.calculateLabourCharge = function (chargeableTask, jcChargeRule, catalogDependencies) {
            return __awaiter(this, void 0, void 0, function () {
                var fixedLabourChargeCurrencyUnit, tieredLabourChargeCurrencyUnit, primeChargeIntervals, subChargeIntervals, labourChargeRuleCode, cp, primeCharge, subsequentCharge, primeChargeVal, subsequentChargeVal, chargeBig, chargeBig, rule, message, chargeableTime, chargePair;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fixedLabourChargeCurrencyUnit = catalogDependencies.fixedLabourChargeCurrencyUnit, tieredLabourChargeCurrencyUnit = catalogDependencies.tieredLabourChargeCurrencyUnit, primeChargeIntervals = catalogDependencies.primeChargeIntervals, subChargeIntervals = catalogDependencies.subChargeIntervals;
                            labourChargeRuleCode = jcChargeRule.labourChargeRuleCode;
                            if (!labourChargeRuleCode) {
                                cp = new primeSubCharge_1.PrimeSubCharge(0, 0);
                                primeCharge = jcChargeRule.standardLabourChargePrime;
                                subsequentCharge = jcChargeRule.standardLabourChargeSubs;
                                primeChargeVal = new bignumber.BigNumber(0);
                                subsequentChargeVal = new bignumber.BigNumber(0);
                                if (!numberHelper_1.NumberHelper.isNullOrUndefined(primeCharge)) {
                                    chargeBig = new bignumber.BigNumber(primeCharge);
                                    primeChargeVal = new bignumber.BigNumber(fixedLabourChargeCurrencyUnit).times(chargeBig);
                                    cp.primeCharge = primeChargeVal;
                                }
                                else {
                                    cp.noPrimeChargesFound = true;
                                }
                                if (!numberHelper_1.NumberHelper.isNullOrUndefined(subsequentCharge)) {
                                    chargeBig = new bignumber.BigNumber(subsequentCharge);
                                    subsequentChargeVal = new bignumber.BigNumber(fixedLabourChargeCurrencyUnit).times(chargeBig);
                                    cp.subsequentCharge = subsequentChargeVal;
                                }
                                else {
                                    cp.noSubsequentChargesFound = true;
                                }
                                chargeableTask.updateLabourItem("", cp, true);
                                this._logger.debug("Standard fixed price charge used", [cp]);
                                return [2 /*return*/, chargeableTask];
                            }
                            return [4 /*yield*/, this._catalogService.getLabourChargeRule(labourChargeRuleCode)];
                        case 1:
                            rule = _a.sent();
                            this._logger.debug("Labour Charge Rule found", [rule]);
                            if (!rule) {
                                message = "labour charge rule " + labourChargeRuleCode + " not found in catalogData";
                                this._logger.error(message, labourChargeRuleCode);
                                chargeableTask.setChargeableTaskAsError(message);
                                return [2 /*return*/, chargeableTask];
                            }
                            chargeableTime = chargeableTask.task.chargeableTime + chargeableTask.getTotalPreviousChargeableTimeForTask;
                            this._logger.debug("Chargeable time is", [chargeableTime]);
                            chargePair = this.calculateChargeUsingLabourRule(rule, chargeableTime, primeChargeIntervals, subChargeIntervals);
                            chargePair.primeCharge = new bignumber.BigNumber(chargePair.primeCharge).times(tieredLabourChargeCurrencyUnit);
                            chargePair.subsequentCharge =
                                new bignumber.BigNumber(chargePair.subsequentCharge).times(tieredLabourChargeCurrencyUnit);
                            this._logger.debug("Tier charge calculated", [chargePair]);
                            chargeableTask.updateLabourItem("", chargePair, false);
                            return [2 /*return*/, chargeableTask];
                    }
                });
            });
        };
        /**
         *
         * @param {number} minimumCharge
         * @param {number} minimumPeriod
         * @param {number} totalChargeableTime
         * @param {IPricingInterval[]} intervals
         * @returns {number}
         */
        ChargeLabourHelperService.prototype.calculateTierCharge = function (minimumCharge, minimumPeriod, totalChargeableTime, intervals) {
            this._logger.debug("Calculate tier charge", []);
            var totalTime = totalChargeableTime - minimumPeriod;
            var runningCharge = minimumCharge;
            if (intervals && intervals.length > 0) {
                intervals.forEach(function (interval) {
                    while (totalTime > 0) {
                        if (totalTime > interval.chargePeriod) {
                            runningCharge += (interval.chargePeriod / interval.chargeInterval) * interval.chargeIntervalPrice;
                            totalTime -= interval.chargePeriod;
                        }
                        else {
                            while (totalTime > 0) {
                                runningCharge += interval.chargeIntervalPrice;
                                totalTime -= interval.chargeInterval;
                            }
                        }
                        break;
                    }
                });
            }
            return runningCharge;
        };
        /**
         *
         * @param {ILabourChargeRule} labourChargeRule
         * @param {number} totalChargeDuration
         * @param {IPrimeChargeInterval[]} primeChargeIntervals
         * @param {ISubsqntChargeInterval[]} subChargeIntervals
         * @returns {PrimeSubCharge}
         */
        ChargeLabourHelperService.prototype.calculateChargeUsingLabourRule = function (labourChargeRule, totalChargeDuration, primeChargeIntervals, subChargeIntervals) {
            var primeMinCharge = labourChargeRule.minimumChargeIfPrime;
            var primeMinPeriod = labourChargeRule.minimumPdIfPrime;
            var subMinCharge = labourChargeRule.minimumChargeIfSbsqt;
            var subMinPeriod = labourChargeRule.minimumPdIfSbsqt;
            var primeIntervals = this.mapCatalogLabourChargeRuleToPricingInterval(labourChargeRule.labourChargeRuleCode, true, primeChargeIntervals, subChargeIntervals);
            var primeCharge = 0;
            var noPrimeChargesFound = false;
            if (primeIntervals && primeIntervals.length > 0) {
                this._logger.debug("Prime charge intervals found", primeIntervals);
                primeCharge = this.calculateTierCharge(primeMinCharge, primeMinPeriod, totalChargeDuration, primeIntervals);
            }
            else {
                noPrimeChargesFound = true;
            }
            var chargePair = new primeSubCharge_1.PrimeSubCharge(primeCharge, 0);
            chargePair.noPrimeChargesFound = noPrimeChargesFound;
            var subIntervals = this.mapCatalogLabourChargeRuleToPricingInterval(labourChargeRule.labourChargeRuleCode, false, primeChargeIntervals, subChargeIntervals);
            if (subIntervals && subIntervals.length > 0) {
                this._logger.debug("Subsequent charge intervals found", subIntervals);
                var subCharge = this.calculateTierCharge(subMinCharge, subMinPeriod, totalChargeDuration, subIntervals);
                chargePair.subsequentCharge = new bignumber.BigNumber(subCharge);
            }
            else {
                chargePair.noSubsequentChargesFound = true;
            }
            return chargePair;
        };
        /**
         *
         * @param {string} labourChargeRuleCode
         * @param {boolean} isPrime
         * @param {IPrimeChargeInterval[]} primeChargeIntervals
         * @param {ISubsqntChargeInterval[]} subChargeIntervals
         * @returns {IPricingInterval[]}
         */
        ChargeLabourHelperService.prototype.mapCatalogLabourChargeRuleToPricingInterval = function (labourChargeRuleCode, isPrime, primeChargeIntervals, subChargeIntervals) {
            if (isPrime) {
                return primeChargeIntervals.filter(function (item) { return item.labourChargeRuleCode === labourChargeRuleCode; }).map(function (item) {
                    return new primePricingInterval_1.PrimePricingInterval(item);
                });
            }
            return subChargeIntervals.filter(function (item) { return item.labourChargeRuleCode === labourChargeRuleCode; }).map(function (item) {
                return new subPricingInterval_1.SubPricingInterval(item);
            });
        };
        ChargeLabourHelperService = __decorate([
            aurelia_dependency_injection_1.inject(catalogService_1.CatalogService),
            __metadata("design:paramtypes", [Object])
        ], ChargeLabourHelperService);
        return ChargeLabourHelperService;
    }());
    exports.ChargeLabourHelperService = ChargeLabourHelperService;
});

//# sourceMappingURL=chargeLabourHelperService.js.map
