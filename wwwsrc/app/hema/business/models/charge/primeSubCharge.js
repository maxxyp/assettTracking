define(["require", "exports", "bignumber"], function (require, exports, bignumber) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PrimeSubCharge = /** @class */ (function () {
        function PrimeSubCharge(primeCharge, subCharge) {
            this.primeCharge = new bignumber.BigNumber(primeCharge);
            this.subsequentCharge = new bignumber.BigNumber(subCharge);
            this.noPrimeChargesFound = false;
            this.noSubsequentChargesFound = false;
        }
        return PrimeSubCharge;
    }());
    exports.PrimeSubCharge = PrimeSubCharge;
});

//# sourceMappingURL=primeSubCharge.js.map
