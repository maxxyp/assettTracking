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
define(["require", "exports", "./chargeableBase", "bignumber", "./chargeablePartItem", "./chargeableLabourItem"], function (require, exports, chargeableBase_1, bignumber, chargeablePartItem_1, chargeableLabourItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChargeableTask = /** @class */ (function (_super) {
        __extends(ChargeableTask, _super);
        function ChargeableTask() {
            var _this = _super.call(this) || this;
            _this.partItems = [];
            _this.isLabourCharge = false;
            _this.isPartsCharge = false;
            _this.isSubsequent = false;
            _this.labourItem = new chargeableLabourItem_1.ChargeableLabourItem();
            _this.fixedPriceQuotationAmount = new bignumber.BigNumber(0);
            _this.error = false;
            _this.errorDescription = "";
            _this.discountAmount = new bignumber.BigNumber(0);
            return _this;
        }
        Object.defineProperty(ChargeableTask.prototype, "partItemsCharge", {
            get: function () {
                var total = new bignumber.BigNumber(0);
                if (this.partItems) {
                    this.partItems.forEach(function (x) {
                        if (x.netAmount) {
                            total = total.plus(x.netAmount);
                        }
                    });
                }
                return total;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChargeableTask.prototype, "calculatedVatAmount", {
            get: function () {
                return this.calculateVatAmount(this.netTotal, this.vat);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChargeableTask.prototype, "grossTotal", {
            get: function () {
                var value = this.calculateGrossAmount(this.netTotal, this.vat);
                return value.round(2);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChargeableTask.prototype, "netTotal", {
            get: function () {
                var total = new bignumber.BigNumber(0);
                if (this.fixedPriceQuotationAmount && this.fixedPriceQuotationAmount.greaterThan(0)) {
                    return this.fixedPriceQuotationAmount;
                }
                total = total.plus(this.partItemsCharge);
                if (this.labourItem) {
                    if (this.labourItem.netAmount && this.labourItem.netAmount.greaterThan(0)) {
                        total = total.plus(this.labourItem.netAmount);
                    }
                }
                if (this.discountAmount) {
                    if (this.discountAmount.greaterThan(total)) {
                        total = new bignumber.BigNumber(0);
                    }
                    else if (this.discountAmount.greaterThan(0)) {
                        total = total.minus(this.discountAmount);
                    }
                }
                return total;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChargeableTask.prototype, "fixedPriceAmount", {
            get: function () {
                var total = new bignumber.BigNumber(0);
                if (this.labourItem.isFixed) {
                    total = this.labourItem.netAmount;
                }
                return total;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChargeableTask.prototype, "useFixedPriceQuotation", {
            get: function () {
                if (this.fixedPriceQuotationAmount && this.fixedPriceQuotationAmount.greaterThan(0)) {
                    return true;
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        ChargeableTask.prototype.updateLabourItem = function (description, chargePair, isFixed) {
            if (this.labourItem) {
                this.labourItem.isFixed = isFixed;
                this.labourItem.description = description;
                this.labourItem.chargePair = chargePair;
                this.labourItem.vat = this.vat;
            }
        };
        ChargeableTask.prototype.addPartItem = function (description, netAmount, isReturn, isWarranty, qty, qtyCharged, refId, returnQty, warrantyQty, previous, status) {
            if (previous === void 0) { previous = false; }
            if (status === void 0) { status = ""; }
            var partItem = new chargeablePartItem_1.ChargeablePartItem();
            partItem.description = description;
            partItem.vat = this.vat;
            partItem.isReturn = isReturn;
            partItem.isWarranty = isWarranty;
            partItem.qty = qty;
            partItem.qtyCharged = qtyCharged;
            partItem.stockReferenceId = refId;
            partItem.netAmount = netAmount;
            partItem.returnQty = returnQty;
            partItem.warrantyQty = warrantyQty;
            partItem.isFromPreviousActivity = previous;
            partItem.status = status;
            this.partItems.push(partItem);
        };
        ChargeableTask.prototype.setErrorsPrimeAndSubCharges = function (ignoreSubsequentCharges) {
            if (this && this.isLabourCharge && this.labourItem && this.labourItem.chargePair) {
                var _a = this, labourItem = _a.labourItem, isSubsequent = _a.isSubsequent;
                var isFixed = labourItem.isFixed, chargePair = labourItem.chargePair;
                var noPrimeChargesFound = chargePair.noPrimeChargesFound, noSubsequentChargesFound = chargePair.noSubsequentChargesFound;
                if (!isFixed) {
                    if (noPrimeChargesFound && !isSubsequent) {
                        this.error = true;
                        this.errorDescription = "no prime charge intervals found";
                    }
                    else if (noSubsequentChargesFound && !ignoreSubsequentCharges && isSubsequent) {
                        this.error = true;
                        this.errorDescription = "no subsequent charge intervals found";
                    }
                }
                else {
                    if (noPrimeChargesFound && !isSubsequent) {
                        this.error = true;
                        this.errorDescription = "no prime charge found for standard labour";
                    }
                    else if (noSubsequentChargesFound && !ignoreSubsequentCharges && isSubsequent) {
                        this.error = true;
                        this.errorDescription = "no subsequent charge found for standard labour";
                    }
                }
            }
        };
        Object.defineProperty(ChargeableTask.prototype, "getTotalPreviousChargeableTimeForTask", {
            get: function () {
                var totalChargeableTime = 0;
                for (var i = 0; i < this.task.activities.length; i++) {
                    var activity = this.task.activities[i];
                    if (activity && activity.chargeableTime) {
                        totalChargeableTime += activity.chargeableTime;
                    }
                }
                return totalChargeableTime;
            },
            enumerable: true,
            configurable: true
        });
        ChargeableTask.prototype.shouldCharge = function (statuses, chargeStatusCodes) {
            var _this = this;
            if (this.error) {
                return false;
            }
            if (this.task.status) {
                var status_1 = statuses.find(function (a) { return a.status === _this.task.status; });
                if (status_1 && chargeStatusCodes) {
                    var index = chargeStatusCodes.findIndex(function (c) { return c === status_1.jobStatusCategory; });
                    return index > -1;
                }
            }
            return false;
        };
        ChargeableTask.prototype.setChargeableTaskAsError = function (message) {
            this.error = true;
            this.errorDescription = message;
        };
        return ChargeableTask;
    }(chargeableBase_1.ChargeableBase));
    exports.ChargeableTask = ChargeableTask;
});

//# sourceMappingURL=chargeableTask.js.map
