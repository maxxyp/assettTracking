define(["require", "exports", "./partWarrantyReturn", "./partNotUsedReturn", "bignumber", "../../core/numberHelper", "../../core/dateHelper"], function (require, exports, partWarrantyReturn_1, partNotUsedReturn_1, bignumber, numberHelper_1, dateHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Part = /** @class */ (function () {
        function Part() {
            this.patchVanStockEngineers = [];
            this.warrantyReturn = new partWarrantyReturn_1.PartWarrantyReturn();
            this.notUsedReturn = new partNotUsedReturn_1.PartNotUsedReturn();
            this.isPriorityPart = false;
            this.isCatalogPriceDifferentFromAdapt = false;
            this.hasTaskWithWrongStatus = false;
            this.price = new bignumber.BigNumber(0);
        }
        Part.fromJson = function (raw) {
            if (raw.price) {
                raw.price = numberHelper_1.NumberHelper.convertToBigNumber(raw.price);
            }
            else {
                raw.price = numberHelper_1.NumberHelper.convertToBigNumber("0");
            }
            raw.orderDate = dateHelper_1.DateHelper.convertDateTime(raw.orderDate);
            raw.fittedDate = dateHelper_1.DateHelper.convertDateTime(raw.fittedDate);
            return raw;
        };
        return Part;
    }());
    exports.Part = Part;
});

//# sourceMappingURL=part.js.map
