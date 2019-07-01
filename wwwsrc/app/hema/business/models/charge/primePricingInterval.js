define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PrimePricingInterval = /** @class */ (function () {
        function PrimePricingInterval(item) {
            this.sequenceNo = item.primeChargeIntervalSequence;
            this.chargeInterval = item.primeChargeInterval;
            this.chargePeriod = item.primeChargeIntervalPD;
            this.chargeIntervalPrice = item.primeChargeIntervalPRC;
        }
        return PrimePricingInterval;
    }());
    exports.PrimePricingInterval = PrimePricingInterval;
});

//# sourceMappingURL=primePricingInterval.js.map
