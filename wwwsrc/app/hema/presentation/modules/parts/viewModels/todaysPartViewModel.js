define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TodaysPartViewModel = /** @class */ (function () {
        function TodaysPartViewModel() {
        }
        Object.defineProperty(TodaysPartViewModel.prototype, "canRaiseNotUsed", {
            get: function () {
                return !this.warrantyReturn || !this.warrantyReturn.isWarrantyReturn || this.warrantyReturn.quantityToClaimOrReturn < this.part.quantity;
            },
            enumerable: true,
            configurable: true
        });
        return TodaysPartViewModel;
    }());
    exports.TodaysPartViewModel = TodaysPartViewModel;
});

//# sourceMappingURL=todaysPartViewModel.js.map
