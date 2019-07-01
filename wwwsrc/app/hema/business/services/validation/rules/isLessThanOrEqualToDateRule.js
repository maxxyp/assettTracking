define(["require", "exports", "../../../../core/dateHelper", "moment"], function (require, exports, dateHelper_1, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IsLessThanOrEqualToDateRule = /** @class */ (function () {
        function IsLessThanOrEqualToDateRule(max) {
            this._max = max;
        }
        IsLessThanOrEqualToDateRule.prototype.test = function (value) {
            if (!dateHelper_1.DateHelper.isDate(value) || !dateHelper_1.DateHelper.isValidDate(value)) {
                return Promise.resolve(false);
            }
            else {
                var maxDate = moment(this._max);
                var valueDate = moment(value);
                return Promise.resolve(valueDate.isBefore(maxDate) || valueDate.isSame(maxDate));
            }
        };
        return IsLessThanOrEqualToDateRule;
    }());
    exports.IsLessThanOrEqualToDateRule = IsLessThanOrEqualToDateRule;
});

//# sourceMappingURL=isLessThanOrEqualToDateRule.js.map
