define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WarrantyEstimate = /** @class */ (function () {
        function WarrantyEstimate(isInWarranty, warrantyPeriodWeeks, lastFittedDate, warrantyEstimateType) {
            this.isInWarranty = isInWarranty;
            this.warrantyPeriodWeeks = warrantyPeriodWeeks;
            this.lastFittedDate = lastFittedDate;
            this.warrantyEstimateType = warrantyEstimateType;
        }
        return WarrantyEstimate;
    }());
    exports.WarrantyEstimate = WarrantyEstimate;
});

//# sourceMappingURL=warrantyEstimate.js.map
