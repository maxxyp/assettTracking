define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SubPricingInterval = /** @class */ (function () {
        function SubPricingInterval(item) {
            this.sequenceNo = item.subsequentChargeIntervalSequence;
            this.chargeInterval = item.subsequentChargeInterval;
            this.chargePeriod = item.subsequentChargeIntervalPd;
            this.chargeIntervalPrice = item.subsequentChargeIntervalPrc;
        }
        return SubPricingInterval;
    }());
    exports.SubPricingInterval = SubPricingInterval;
});

//# sourceMappingURL=subPricingInterval.js.map
