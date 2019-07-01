define(["require", "exports", "moment", "./stringHelper"], function (require, exports, moment, stringHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DateHelper = /** @class */ (function () {
        function DateHelper() {
        }
        DateHelper.getTodaysDate = function () {
            var todaysDate = moment().format(DateHelper.jsonISO8601Format);
            return moment(todaysDate).toDate();
        };
        DateHelper.isDate = function (value) {
            return value === null || value === undefined ? false : Object.prototype.toString.call(value) === "[object Date]";
        };
        DateHelper.isValidDate = function (value) {
            return !isNaN(value.getTime());
        };
        DateHelper.isJsonISO8601String = function (date) {
            if (stringHelper_1.StringHelper.isString(date)) {
                var matches = date.match(DateHelper.jsonISO8601RegEx);
                return matches && matches.length > 0;
            }
            else {
                return false;
            }
        };
        DateHelper.toJsonISO8601String = function (date) {
            if (!DateHelper.isDate(date)) {
                return undefined;
            }
            else {
                return moment(date).format(DateHelper.jsonISO8601Format);
            }
        };
        DateHelper.fromJsonISO8601String = function (json) {
            if (json === undefined) {
                return undefined;
            }
            else if (json === null) {
                return null;
            }
            else {
                var m = moment.utc(json, DateHelper.jsonISO8601Format, true);
                return m.isValid() ? m.toDate() : undefined;
            }
        };
        DateHelper.isJsonDateTimeString = function (date) {
            if (stringHelper_1.StringHelper.isString(date)) {
                var matches = date.match(DateHelper.jsonDateTimeRegEx);
                return matches && matches.length > 0;
            }
            else {
                return false;
            }
        };
        DateHelper.toJsonDateTimeString = function (date) {
            if (!DateHelper.isDate(date)) {
                return undefined;
            }
            else {
                return moment(date).format(DateHelper.jsonDateTimeFormat);
            }
        };
        DateHelper.fromJsonDateTimeString = function (json) {
            if (json === undefined) {
                return undefined;
            }
            else if (json === null) {
                return null;
            }
            else {
                var m = moment(json, DateHelper.jsonDateTimeFormat, true);
                return m.isValid() ? m.toDate() : undefined;
            }
        };
        DateHelper.isJsonDateString = function (date) {
            if (stringHelper_1.StringHelper.isString(date)) {
                var matches = date.match(DateHelper.jsonDateRegEx);
                return matches && matches.length > 0;
            }
            else {
                return false;
            }
        };
        DateHelper.toJsonDateString = function (date) {
            if (!DateHelper.isDate(date)) {
                return undefined;
            }
            else {
                return moment(date).format(DateHelper.jsonDateFormat);
            }
        };
        DateHelper.fromJsonDateString = function (json) {
            if (json === undefined) {
                return undefined;
            }
            else if (json === null) {
                return null;
            }
            else {
                var m = moment(json, DateHelper.jsonDateFormat, true);
                return m.isValid() ? m.toDate() : undefined;
            }
        };
        DateHelper.dateIsOnSunday = function (date) {
            var flag = false;
            if (moment(date).day() === 0) {
                flag = true;
            }
            return flag;
        };
        DateHelper.dateIsOnFriday = function (date) {
            var flag = false;
            if (moment(date).day() === 5) {
                flag = true;
            }
            return flag;
        };
        DateHelper.dateIsOnSaturday = function (date) {
            var flag = false;
            if (moment(date).day() === 6) {
                flag = true;
            }
            return flag;
        };
        DateHelper.dateInMondayToThursDay = function (date) {
            var flag = false;
            switch (moment(date).day()) {
                case 1: // monday
                case 2: // tuesday
                case 3: // wednesday
                case 4:// thursday
                    flag = true;
                    break;
                default:
                    flag = false;
            }
            return flag;
        };
        DateHelper.dateInMondayToFriday = function (date) {
            var flag = false;
            switch (moment(date).day()) {
                case 1: // monday
                case 2: // tuesday
                case 3: // wednesday
                case 4: // thursday
                case 5:// friday
                    flag = true;
                    break;
                default:
                    flag = false;
            }
            return flag;
        };
        // parse time range '10:00-12:00' to appropriate object
        DateHelper.parseTimeRangeSlot = function (timeSlotRange) {
            var timeslot = {};
            if (timeSlotRange) {
                var start = timeSlotRange.split("-")[0];
                var end = timeSlotRange.split("-")[1];
                if (start) {
                    timeslot.start = moment(start, DateHelper.timeFormat);
                }
                if (end) {
                    timeslot.end = moment(end, DateHelper.timeFormat);
                }
            }
            return timeslot;
        };
        DateHelper.timeStringToJsonDateTimeString = function (timeString) {
            if (timeString) {
                return moment(timeString, DateHelper.timeFormat).format(DateHelper.jsonDateTimeFormat);
            }
            return undefined;
        };
        DateHelper.addDays = function (date, numberOfDays) {
            var result = new Date();
            result.setDate(date.getDate() + numberOfDays);
            return result;
        };
        DateHelper.getDateFromNumber = function (d, t, dateFormat, timeFormat) {
            if (dateFormat === "YYYYMMDD" && timeFormat === "HHmmssSS") {
                var hoursLength = t.toString().length > 7 ? 2 : 1; // we may receive 9341903 instead of 09341903
                var retDate = moment();
                retDate.set("year", parseInt(d.toString().substr(0, 4), 10));
                retDate.set("month", parseInt(d.toString().substr(4, 2), 10) - 1);
                retDate.set("date", parseInt(d.toString().substr(6, 2), 10));
                retDate.set("hour", parseInt(t.toString().substr(0, hoursLength), 10));
                retDate.set("minute", parseInt(t.toString().substr(hoursLength, 2), 10));
                retDate.set("second", parseInt(t.toString().substr((hoursLength + 2), 2), 10));
                return retDate.format("DD/MMM HH:mm");
            }
            return undefined;
        };
        DateHelper.jsonISO8601RegEx = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;
        DateHelper.jsonISO8601Format = "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]";
        DateHelper.jsonDateTimeFormat = "YYYY-MM-DD[T]HH:mm:ss[Z]";
        DateHelper.jsonDateTimeRegEx = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/;
        DateHelper.jsonDateFormat = "YYYY-MM-DD";
        DateHelper.jsonDateRegEx = /\d{4}-\d{2}-\d{2}Z/;
        DateHelper.timeFormat = "HH:mm";
        return DateHelper;
    }());
    exports.DateHelper = DateHelper;
});

//# sourceMappingURL=dateHelper.js.map
