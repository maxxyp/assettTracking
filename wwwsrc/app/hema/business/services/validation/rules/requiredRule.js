define(["require", "exports", "../../../../../common/core/stringHelper", "../../../../core/dateHelper"], function (require, exports, stringHelper_1, dateHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RequiredRule = /** @class */ (function () {
        function RequiredRule() {
        }
        RequiredRule.prototype.setRequired = function (required) {
            this._required = required;
        };
        RequiredRule.prototype.test = function (value) {
            var isRequired = true;
            if (this._required !== undefined) {
                if (this._required instanceof Function) {
                    isRequired = this._required();
                }
                else {
                    isRequired = this._required;
                }
            }
            if (isRequired) {
                return Promise.resolve(value !== null &&
                    value !== undefined &&
                    !(stringHelper_1.StringHelper.isString(value) && !/\S/.test(value)) &&
                    !(dateHelper_1.DateHelper.isDate(value) && !dateHelper_1.DateHelper.isValidDate(value)));
            }
            else {
                return Promise.resolve(true);
            }
        };
        return RequiredRule;
    }());
    exports.RequiredRule = RequiredRule;
});

//# sourceMappingURL=requiredRule.js.map
