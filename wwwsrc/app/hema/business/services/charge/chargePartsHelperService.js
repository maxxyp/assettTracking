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
define(["require", "exports", "aurelia-logging", "aurelia-dependency-injection", "../partService", "bignumber"], function (require, exports, Logging, aurelia_dependency_injection_1, partService_1, bignumber) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChargePartsHelperService = /** @class */ (function () {
        function ChargePartsHelperService(partService) {
            this._partService = partService;
            this._logger = Logging.getLogger("ChargePartsHelperService");
        }
        /**
         *
         * @param {ChargeableTask} chargeableTask
         * @param {string} jobId
         * @param {boolean} shouldChargeForParts
         * @param {IChargePartsCatalogDependencies} dependencies
         * @returns {Promise<ChargeableTask>}
         */
        ChargePartsHelperService.prototype.addPartsCharge = function (chargeableTask, jobId, shouldChargeForParts, dependencies) {
            return __awaiter(this, void 0, void 0, function () {
                var visitStatuses, notUsedStatusCode, excludePartStatusPrevious, vanStockPartOrderStatus, partsToday, first, second;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            visitStatuses = dependencies.visitStatuses, notUsedStatusCode = dependencies.notUsedStatusCode, excludePartStatusPrevious = dependencies.excludePartStatusPrevious, vanStockPartOrderStatus = dependencies.vanStockPartOrderStatus;
                            return [4 /*yield*/, this._partService.getTodaysParts(jobId)];
                        case 1:
                            partsToday = _a.sent();
                            first = chargeableTask;
                            if (partsToday && partsToday.parts && partsToday.parts.length > 0) {
                                this._logger.debug("Today's parts found", partsToday.parts);
                                first = this.createPartChargeableItems(chargeableTask, partsToday.parts, shouldChargeForParts);
                            }
                            return [4 /*yield*/, this.addVanStockPartsCharge(first, jobId, shouldChargeForParts, vanStockPartOrderStatus)];
                        case 2:
                            second = _a.sent();
                            return [2 /*return*/, this.addPartsChargePreviousActivity(second, shouldChargeForParts, visitStatuses, notUsedStatusCode, excludePartStatusPrevious)];
                    }
                });
            });
        };
        /**
         *
         * @param {ChargeableTask} chargeableTask
         * @param {string} jobId
         * @param {boolean} shouldCharge
         * @param {string} vanStockPartOrderStatus
         * @returns {Promise<ChargeableTask>}
         */
        ChargePartsHelperService.prototype.addVanStockPartsCharge = function (chargeableTask, jobId, shouldCharge, vanStockPartOrderStatus) {
            return __awaiter(this, void 0, void 0, function () {
                var partBasketBusinessModel, parts;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._partService.getPartsBasket(jobId)];
                        case 1:
                            partBasketBusinessModel = _a.sent();
                            if (partBasketBusinessModel
                                && partBasketBusinessModel.partsToOrder
                                && partBasketBusinessModel.partsToOrder.length > 0) {
                                this._logger.debug("Van stock parts found", partBasketBusinessModel.partsToOrder);
                                parts = partBasketBusinessModel.partsToOrder.filter(function (p) { return p.partOrderStatus === vanStockPartOrderStatus; });
                                return [2 /*return*/, this.createPartChargeableItems(chargeableTask, parts, shouldCharge)];
                            }
                            return [2 /*return*/, chargeableTask];
                    }
                });
            });
        };
        /**
         *
         * @param {ChargeableTask} chargeableTask
         * @param {boolean} isPart
         * @param {string[]} visitStatuses
         * @param {string} notUsedStatusCode
         * @param {string[]} excludePartStatusPrevious
         * @returns {ChargeableTask}
         */
        ChargePartsHelperService.prototype.addPartsChargePreviousActivity = function (chargeableTask, isPart, visitStatuses, notUsedStatusCode, excludePartStatusPrevious) {
            if (!chargeableTask.task || !chargeableTask.task.activities || chargeableTask.task.activities.length === 0) {
                return chargeableTask;
            }
            var task = chargeableTask.task;
            var activities = task.activities;
            // filter activities we can carry forward charges:
            // i.e.  Complete, Another Visit Reqd, Field Manager Reqd,  Parts Reqd, Wait Advice
            // c, ia, if, ip, wa
            var chargeableActivities = activities.filter(function (a) { return visitStatuses.some(function (vs) { return vs === a.status; })
                && a.parts && a.parts.length > 0; });
            var parts = [];
            chargeableActivities.forEach(function (activity) {
                if (activity.parts && activity.parts.length > 0) {
                    // if an NU record is present, it represents an amount that needs to be subtracted from
                    //  a adjoining FP record (only ordered parts can be NU'ed, van stock cannot)
                    var notUsed_1 = {};
                    for (var _i = 0, _a = activity.parts.filter(function (a) { return a.status === notUsedStatusCode; }); _i < _a.length; _i++) {
                        var p = _a[_i];
                        notUsed_1[p.stockReferenceId] = (notUsed_1[p.stockReferenceId] || 0) + p.quantity;
                    }
                    var getAndChalkOffQuantityToReturn_1 = function (thisPartQuantity, stockReferenceId) {
                        var amountLeftToAllocate = notUsed_1[stockReferenceId];
                        if (!amountLeftToAllocate || amountLeftToAllocate <= 0) {
                            return undefined;
                        }
                        var amountToAllocateHere = amountLeftToAllocate <= thisPartQuantity
                            ? amountLeftToAllocate
                            : thisPartQuantity;
                        notUsed_1[stockReferenceId] = notUsed_1[stockReferenceId] - amountToAllocateHere;
                        return amountToAllocateHere;
                    };
                    // for FP parts (ordered parts), any warranty amount has not been subtracted in the FP line and so we need to
                    //  hunt for a CP line for that part to see its warranty amount.
                    // for U* parts (van stock) they already have their warranty amounts subtracted (!)
                    var claimedWarrantied_1 = {};
                    for (var _b = 0, _c = activity.parts.filter(function (a) { return a.status === "CP"; }); _b < _c.length; _b++) {
                        var p = _c[_b];
                        claimedWarrantied_1[p.stockReferenceId] = (claimedWarrantied_1[p.stockReferenceId] || 0) + p.quantity;
                    }
                    var getAndChalkOffQuantityWarrantied_1 = function (thisPartQuantity, stockReferenceId) {
                        var amountLeftToAllocate = claimedWarrantied_1[stockReferenceId];
                        if (!amountLeftToAllocate || amountLeftToAllocate <= 0) {
                            return undefined;
                        }
                        var amountToAllocateHere = amountLeftToAllocate <= thisPartQuantity
                            ? amountLeftToAllocate
                            : thisPartQuantity;
                        claimedWarrantied_1[stockReferenceId] = claimedWarrantied_1[stockReferenceId] - amountToAllocateHere;
                        return amountToAllocateHere;
                    };
                    activity.parts
                        .forEach(function (part) {
                        // beware - this bit mutates data, and this change to the underlying data is relied upon when we send
                        //  charges information back to WMIS.
                        if (part.status === "FP") {
                            var returnedQuantity = getAndChalkOffQuantityToReturn_1(part.quantity, part.stockReferenceId);
                            if (returnedQuantity) {
                                part.notUsedReturn.quantityToReturn = returnedQuantity;
                            }
                        }
                        if (part.status === "FP" || part.status === "UP") {
                            var warrantiedQuantity = getAndChalkOffQuantityWarrantied_1(part.quantity, part.stockReferenceId);
                            if (warrantiedQuantity) {
                                part.warrantyReturn.isWarrantyReturn = true;
                                part.warrantyReturn.quantityToClaimOrReturn = warrantiedQuantity;
                            }
                        }
                    });
                    var partsToChargeFor = activity.parts
                        .filter(function (p) { return !excludePartStatusPrevious.some(function (s) { return s === p.status; }); });
                    parts.push.apply(parts, partsToChargeFor);
                }
            });
            return this.createPartChargeableItems(chargeableTask, parts, isPart && task.isCharge, true);
        };
        /**
         *
         * @param {ChargeableTask} chargeableTask
         * @param {Part[]} parts
         * @param {boolean} charge
         * @param {boolean} previous
         * @returns {ChargeableTask}
         */
        ChargePartsHelperService.prototype.createPartChargeableItems = function (chargeableTask, parts, charge, previous) {
            if (previous === void 0) { previous = false; }
            var qty = 0;
            var description = "";
            var stockReferenceId = "";
            var isWarranty = false;
            var isReturn = false;
            var qtyCharged = 0;
            var partsFiltered = parts.filter(function (p) { return p.taskId === chargeableTask.task.id; });
            if (!partsFiltered || partsFiltered.length === 0) {
                return chargeableTask;
            }
            for (var _i = 0, partsFiltered_1 = partsFiltered; _i < partsFiltered_1.length; _i++) {
                var part = partsFiltered_1[_i];
                this._logger.debug("Parts found", [part]);
                qty = part.quantity;
                var totalCharge = new bignumber.BigNumber(0);
                var returnQty = 0;
                var warrantyQty = 0;
                if (!part || !part.price) {
                    break;
                }
                description = part.description || part.stockReferenceId;
                stockReferenceId = part.stockReferenceId;
                // if no charge, add part but set value to 0
                if (!chargeableTask.task.isCharge || !charge) {
                    chargeableTask.addPartItem(description, new bignumber.BigNumber(0), false, false, qty, 0, stockReferenceId, 0, 0, previous);
                }
                else {
                    var qtyToChargeFor = part.quantity;
                    if (part.warrantyReturn && part.warrantyReturn.isWarrantyReturn) {
                        if (part.warrantyReturn.quantityToClaimOrReturn > 0) {
                            warrantyQty = part.warrantyReturn.quantityToClaimOrReturn;
                            isWarranty = true;
                            qtyToChargeFor -= warrantyQty;
                        }
                    }
                    if (part.notUsedReturn && part.notUsedReturn.quantityToReturn > 0) {
                        returnQty = part.notUsedReturn.quantityToReturn;
                        isReturn = true;
                        qtyToChargeFor -= returnQty;
                    }
                    if (charge && qtyToChargeFor > 0 && part.price.greaterThan(0)) {
                        totalCharge = new bignumber.BigNumber(part.price).times(qtyToChargeFor);
                    }
                    qtyCharged = qtyToChargeFor;
                    chargeableTask.addPartItem(description, totalCharge, isReturn, isWarranty, qty, qtyCharged, stockReferenceId, returnQty, warrantyQty, previous, part.status);
                    this._logger.debug("Part added to chargeableTask", [chargeableTask]);
                }
            }
            return chargeableTask;
        };
        ChargePartsHelperService = __decorate([
            aurelia_dependency_injection_1.inject(partService_1.PartService),
            __metadata("design:paramtypes", [Object])
        ], ChargePartsHelperService);
        return ChargePartsHelperService;
    }());
    exports.ChargePartsHelperService = ChargePartsHelperService;
});

//# sourceMappingURL=chargePartsHelperService.js.map
