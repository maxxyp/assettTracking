define(["require", "exports", "../../../../../common/core/numberHelper"], function (require, exports, numberHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IsLessThanOrEqualToRule = /** @class */ (function () {
        function IsLessThanOrEqualToRule(max) {
            this._max = max;
        }
        IsLessThanOrEqualToRule.prototype.test = function (value) {
            var tryCoerce = numberHelper_1.NumberHelper.tryCoerceToNumber(value);
            if (!tryCoerce.isValid) {
                return Promise.resolve(false);
            }
            else {
                return Promise.resolve(tryCoerce.value <= this._max);
            }
        };
        return IsLessThanOrEqualToRule;
    }());
    exports.IsLessThanOrEqualToRule = IsLessThanOrEqualToRule;
});

//# sourceMappingURL=isLessThanOrEqualToRule.js.map
