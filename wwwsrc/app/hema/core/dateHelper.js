define(["require", "exports", "moment", "../../common/core/stringHelper"], function (require, exports, moment, stringHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DateHelper = /** @class */ (function () {
        function DateHelper() {
        }
        DateHelper.getTodaysDate = function () {
            return moment().toDate();
        };
        DateHelper.getTimestampMs = function () {
            return new Date().getTime();
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
                var dateJson = (json.length > 10) ? json.substr(0, 10) : json;
                var m = moment(dateJson, DateHelper.jsonDateFormat, true);
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
        DateHelper.parseAppointmentStartTime = function (appointmentBand) {
            if (appointmentBand && appointmentBand.appointmentBandDescription) {
                var start = appointmentBand.appointmentBandDescription.split("-")[0];
                if (start) {
                    start = start.trim();
                    start = stringHelper_1.StringHelper.splice(start, 3, 0, ":");
                    return moment(start, DateHelper.timeFormat);
                }
            }
            return undefined;
        };
        DateHelper.getEstimatedDurationOfAppointmentMaxValue = function (startTime, estimatedEndTimeInMinutes) {
            // convert hours into minutes
            var startTimeInMinutes = startTime * 60;
            return (estimatedEndTimeInMinutes - startTimeInMinutes) - 1;
        };
        DateHelper.convertDateTime = function (fromString) {
            if (DateHelper.isJsonISO8601String(fromString)) {
                return DateHelper.fromJsonISO8601String(fromString);
            }
            return null;
        };
        DateHelper.getHourMinutes = function (timestamp) {
            return moment(timestamp).seconds(0).milliseconds(0).format("HH:mm");
        };
        DateHelper.getDurationMinutes = function (firsTimestamp, secondTimestamp, decimalPlaces) {
            if (decimalPlaces === void 0) { decimalPlaces = 1; }
            var date1 = moment(firsTimestamp).seconds(0).milliseconds(0).toISOString();
            var date2 = moment(secondTimestamp).seconds(0).milliseconds(0).toISOString();
            var ms = moment(date2).diff(moment(date1));
            return moment.duration(ms).asMinutes().toFixed(decimalPlaces).toString();
        };
        DateHelper.isSameDay = function (timestamp, currentDate) {
            return (timestamp) && (moment(timestamp).isSame(moment(currentDate), "day"));
        };
        // moment.min and moment.max does not play well
        // with dates without times. 
        // hence the following function
        DateHelper.getMinDate = function (values) {
            var minValue = values[0];
            var minDateValue = new Date(values[0]);
            values.forEach(function (dt, index) {
                if (new Date(dt) < minDateValue) {
                    minValue = dt;
                    minDateValue = new Date(dt);
                }
            });
            return minValue;
        };
        DateHelper.getDate = function (time) {
            if (time) {
                var hours = parseInt(time.split(":")[0], 10);
                var minutes = parseInt(time.split(":")[1], 10);
                var currentDate = moment();
                currentDate.set("hours", hours);
                currentDate.set("minutes", minutes);
                return currentDate.toDate();
            }
            else {
                return null;
            }
        };
        DateHelper.getTimeDiffInMins = function (date1, date2) {
            return moment(date1).diff(moment(date2), "minutes");
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
