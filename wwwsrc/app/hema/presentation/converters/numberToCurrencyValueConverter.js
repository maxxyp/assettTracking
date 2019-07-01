define(["require", "exports", "bignumber"], function (require, exports, bignumber) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NumberToCurrencyValueConverter = /** @class */ (function () {
        function NumberToCurrencyValueConverter() {
        }
        NumberToCurrencyValueConverter.prototype.toView = function (value) {
            if (typeof value === "number" && !isNaN(value)) {
                return "£" + value.toFixed(2);
            }
            else if (!!value && typeof value === "string") {
                return "£" + parseFloat(value).toFixed(2);
            }
            else if (!!value && value instanceof bignumber.BigNumber) {
                return "£" + parseFloat(value.toString()).toFixed(2);
            }
            else {
                return "";
            }
        };
        return NumberToCurrencyValueConverter;
    }());
    exports.NumberToCurrencyValueConverter = NumberToCurrencyValueConverter;
});

//# sourceMappingURL=numberToCurrencyValueConverter.js.map
