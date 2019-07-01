define(["require", "exports", "../../../../core/dateHelper", "moment"], function (require, exports, dateHelper_1, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IsBetweenDateRule = /** @class */ (function () {
        function IsBetweenDateRule(min, max) {
            this._min = min;
            this._max = max;
        }
        IsBetweenDateRule.prototype.test = function (value) {
            if (!dateHelper_1.DateHelper.isDate(value) || !dateHelper_1.DateHelper.isValidDate(value)) {
                return Promise.resolve(false);
            }
            else {
                var minDate = moment(this._min);
                var maxDate = moment(this._max);
                var valueDate = moment(value);
                return Promise.resolve((valueDate.isAfter(minDate) || valueDate.isSame(minDate)) &&
                    (valueDate.isBefore(maxDate) || valueDate.isSame(maxDate)));
            }
        };
        return IsBetweenDateRule;
    }());
    exports.IsBetweenDateRule = IsBetweenDateRule;
});

//# sourceMappingURL=isBetweenDateRule.js.map
