define(["require", "exports", "../../../../../common/core/stringHelper"], function (require, exports, stringHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HasMinLengthRule = /** @class */ (function () {
        function HasMinLengthRule(minLength) {
            this._minLength = minLength;
        }
        HasMinLengthRule.prototype.test = function (value) {
            if (value === null || value === undefined) {
                return Promise.resolve(false);
            }
            else {
                if (value.hasOwnProperty("length") === false) {
                    value = stringHelper_1.StringHelper.isString(value) ? value : value.toString();
                }
                return Promise.resolve(value.length >= this._minLength);
            }
        };
        return HasMinLengthRule;
    }());
    exports.HasMinLengthRule = HasMinLengthRule;
});

//# sourceMappingURL=hasMinLengthRule.js.map
