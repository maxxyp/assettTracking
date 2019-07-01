define(["require", "exports", "../../../../../common/core/stringHelper"], function (require, exports, stringHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HasMaxLengthRule = /** @class */ (function () {
        function HasMaxLengthRule(maxLength) {
            this._maxLength = maxLength;
        }
        HasMaxLengthRule.prototype.test = function (value) {
            if (value === null || value === undefined) {
                return Promise.resolve(false);
            }
            else {
                if (value.hasOwnProperty("length") === false) {
                    value = stringHelper_1.StringHelper.isString(value) ? value : value.toString();
                }
                return Promise.resolve(value.length <= this._maxLength);
            }
        };
        return HasMaxLengthRule;
    }());
    exports.HasMaxLengthRule = HasMaxLengthRule;
});

//# sourceMappingURL=hasMaxLengthRule.js.map
