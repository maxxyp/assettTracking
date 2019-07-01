define(["require", "exports", "../../../../../common/core/numberHelper"], function (require, exports, numberHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IsNumberRule = /** @class */ (function () {
        function IsNumberRule() {
        }
        IsNumberRule.prototype.test = function (value) {
            return Promise.resolve(numberHelper_1.NumberHelper.canCoerceToNumber(value));
        };
        return IsNumberRule;
    }());
    exports.IsNumberRule = IsNumberRule;
});

//# sourceMappingURL=isNumberRule.js.map
