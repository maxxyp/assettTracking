define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CalendarDay = /** @class */ (function () {
        function CalendarDay(dayNumber, classMembers, isDisabled, lastDayOfWeek) {
            this.dayNumber = dayNumber;
            this.classMembers = classMembers;
            this.isDisabled = isDisabled;
            this.lastDayOfWeek = lastDayOfWeek;
        }
        return CalendarDay;
    }());
    exports.CalendarDay = CalendarDay;
});

//# sourceMappingURL=calendarDay.js.map
