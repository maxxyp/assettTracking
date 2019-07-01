define(["require", "exports", "bignumber"], function (require, exports, bignumber) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NumberHelper = /** @class */ (function () {
        function NumberHelper() {
        }
        NumberHelper.convertToBigNumber = function (value) {
            return new bignumber.BigNumber(value || 0);
        };
        NumberHelper.isNullOrUndefined = function (value) {
            return value === undefined || value === null;
        };
        return NumberHelper;
    }());
    exports.NumberHelper = NumberHelper;
});

//# sourceMappingURL=numberHelper.js.map
