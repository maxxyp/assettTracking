define(["require", "exports", "../../../../core/dateHelper"], function (require, exports, dateHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IsDateRule = /** @class */ (function () {
        function IsDateRule() {
        }
        IsDateRule.prototype.test = function (value) {
            return Promise.resolve(dateHelper_1.DateHelper.isDate(value) && dateHelper_1.DateHelper.isValidDate(value));
        };
        return IsDateRule;
    }());
    exports.IsDateRule = IsDateRule;
});

//# sourceMappingURL=isDateRule.js.map
