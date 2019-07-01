define(["require", "exports", "bignumber"], function (require, exports, bignumber) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChargeableBase = /** @class */ (function () {
        function ChargeableBase() {
        }
        ChargeableBase.prototype.calculateGrossAmount = function (netAmount, vat) {
            if (vat && vat.greaterThan(0)) {
                return netAmount.plus(this.calculateVatAmount(netAmount, vat));
            }
            else {
                return netAmount;
            }
        };
        ChargeableBase.prototype.calculateVatAmount = function (netAmount, vat) {
            // since VAT values will always be in multiplier of 10
            // for e.g. 175 = 17.5%, 200=20%, 50=5% etc.        
            var vatAmount = new bignumber.BigNumber(0);
            if (vat && vat.greaterThan(0) && netAmount && netAmount.greaterThan(0)) {
                vatAmount = (netAmount.times(vat)).dividedBy(1000);
            }
            return vatAmount;
        };
        return ChargeableBase;
    }());
    exports.ChargeableBase = ChargeableBase;
});

//# sourceMappingURL=chargeableBase.js.map
