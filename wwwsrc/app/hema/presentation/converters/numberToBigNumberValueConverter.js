define(["require", "exports", "bignumber"], function (require, exports, bignumber) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NumberToBigNumberValueConverter = /** @class */ (function () {
        function NumberToBigNumberValueConverter() {
        }
        NumberToBigNumberValueConverter.prototype.toView = function (input) {
            if (input) {
                return input.toNumber();
            }
            return undefined;
        };
        NumberToBigNumberValueConverter.prototype.fromView = function (num) {
            if (num) {
                return new bignumber.BigNumber(num);
            }
            return undefined;
        };
        return NumberToBigNumberValueConverter;
    }());
    exports.NumberToBigNumberValueConverter = NumberToBigNumberValueConverter;
});

//# sourceMappingURL=numberToBigNumberValueConverter.js.map
