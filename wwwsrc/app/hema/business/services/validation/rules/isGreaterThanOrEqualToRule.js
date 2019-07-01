define(["require", "exports", "../../../../../common/core/numberHelper"], function (require, exports, numberHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IsGreaterThanOrEqualToRule = /** @class */ (function () {
        function IsGreaterThanOrEqualToRule(min) {
            this._min = min;
        }
        IsGreaterThanOrEqualToRule.prototype.test = function (value) {
            var tryCoerce = numberHelper_1.NumberHelper.tryCoerceToNumber(value);
            if (!tryCoerce.isValid) {
                return Promise.resolve(false);
            }
            else {
                return Promise.resolve(tryCoerce.value >= this._min);
            }
        };
        return IsGreaterThanOrEqualToRule;
    }());
    exports.IsGreaterThanOrEqualToRule = IsGreaterThanOrEqualToRule;
});

//# sourceMappingURL=isGreaterThanOrEqualToRule.js.map
