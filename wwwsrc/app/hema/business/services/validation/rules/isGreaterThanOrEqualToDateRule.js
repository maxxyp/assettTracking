define(["require", "exports", "../../../../core/dateHelper", "moment"], function (require, exports, dateHelper_1, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IsGreaterThanOrEqualToDateRule = /** @class */ (function () {
        function IsGreaterThanOrEqualToDateRule(min) {
            this._min = min;
        }
        IsGreaterThanOrEqualToDateRule.prototype.test = function (value) {
            if (!dateHelper_1.DateHelper.isDate(value) || !dateHelper_1.DateHelper.isValidDate(value)) {
                return Promise.resolve(false);
            }
            else {
                var minDate = moment(this._min);
                var valueDate = moment(value);
                return Promise.resolve(valueDate.isAfter(minDate) || valueDate.isSame(minDate));
            }
        };
        return IsGreaterThanOrEqualToDateRule;
    }());
    exports.IsGreaterThanOrEqualToDateRule = IsGreaterThanOrEqualToDateRule;
});

//# sourceMappingURL=isGreaterThanOrEqualToDateRule.js.map
