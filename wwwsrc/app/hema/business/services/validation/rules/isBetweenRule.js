define(["require", "exports", "../../../../../common/core/numberHelper"], function (require, exports, numberHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IsBetweenRule = /** @class */ (function () {
        function IsBetweenRule(min, max, allowEmpty) {
            this._min = min;
            this._max = max;
            this._allowEmpty = allowEmpty;
        }
        IsBetweenRule.prototype.test = function (value) {
            if (this._allowEmpty && (value === undefined || value === null)) {
                return Promise.resolve(true);
            }
            var tryCoerce = numberHelper_1.NumberHelper.tryCoerceToNumber(value);
            if (!tryCoerce.isValid) {
                return Promise.resolve(false);
            }
            else {
                return Promise.resolve(tryCoerce.value >= this._min && tryCoerce.value <= this._max);
            }
        };
        return IsBetweenRule;
    }());
    exports.IsBetweenRule = IsBetweenRule;
});

//# sourceMappingURL=isBetweenRule.js.map
