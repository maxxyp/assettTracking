import * as moment from "moment";
import { StringHelper } from "../../common/core/stringHelper";
import { IAppointmentBand } from "../business/models/reference/IAppointmentBand";

export class DateHelper {
    public static jsonISO8601RegEx: RegExp = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;
    public static jsonISO8601Format: string = "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]";
    public static jsonDateTimeFormat: string = "YYYY-MM-DD[T]HH:mm:ss[Z]";
    public static jsonDateTimeRegEx: RegExp = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/;
    public static jsonDateFormat: string = "YYYY-MM-DD";
    public static jsonDateRegEx: RegExp = /\d{4}-\d{2}-\d{2}Z/;
    public static timeFormat: string = "HH:mm";

    public static getTodaysDate(): Date {
        return moment().toDate();
    }

    public static getTimestampMs(): number {
        return new Date().getTime();
    }

    public static isDate(value: any): boolean {
        return value === null || value === undefined ? false : Object.prototype.toString.call(value) === "[object Date]";
    }

    public static isValidDate(value: Date): boolean {
        return !isNaN(value.getTime());
    }

    public static isJsonISO8601String(date: string): boolean {
        if (StringHelper.isString(date)) {
            let matches = date.match(DateHelper.jsonISO8601RegEx);
            return matches && matches.length > 0;
        } else {
            return false;
        }
    }

    public static toJsonISO8601String(date: Date): string {
        if (!DateHelper.isDate(date)) {
            return undefined;
        } else {
            return moment(date).format(DateHelper.jsonISO8601Format);
        }
    }

    public static fromJsonISO8601String(json: string): Date {
        if (json === undefined) {
            return undefined;
        } else if (json === null) {
            return null;
        } else {
            let m = moment.utc(json, DateHelper.jsonISO8601Format, true);
            return m.isValid() ? m.toDate() : undefined;
        }
    }

    public static isJsonDateTimeString(date: string): boolean {
        if (StringHelper.isString(date)) {
            let matches = date.match(DateHelper.jsonDateTimeRegEx);
            return matches && matches.length > 0;
        } else {
            return false;
        }
    }

    public static toJsonDateTimeString(date: Date): string {
        if (!DateHelper.isDate(date)) {
            return undefined;
        } else {
            return moment(date).format(DateHelper.jsonDateTimeFormat);
        }
    }

    public static fromJsonDateTimeString(json: string): Date {
        if (json === undefined) {
            return undefined;
        } else if (json === null) {
            return null;
        } else {
            let m = moment(json, DateHelper.jsonDateTimeFormat, true);
            return m.isValid() ? m.toDate() : undefined;
        }
    }

    public static isJsonDateString(date: string): boolean {
        if (StringHelper.isString(date)) {
            let matches = date.match(DateHelper.jsonDateRegEx);
            return matches && matches.length > 0;
        } else {
            return false;
        }
    }

    public static toJsonDateString(date: Date): string {
        if (!DateHelper.isDate(date)) {
            return undefined;
        } else {
            return moment(date).format(DateHelper.jsonDateFormat);
        }
    }

    public static fromJsonDateString(json: string): Date {
        if (json === undefined) {
            return undefined;
        } else if (json === null) {
            return null;
        } else {
            const dateJson = (json.length > 10) ? json.substr(0, 10) : json;
            let m = moment(dateJson, DateHelper.jsonDateFormat, true);
            return m.isValid() ? m.toDate() : undefined;
        }
    }

    public static dateIsOnSunday(date: Date): boolean {
        let flag: boolean = false;
        if (moment(date).day() === 0) { // sunday
            flag = true;
        }
        return flag;
    }

    public static dateIsOnFriday(date: Date): boolean {
        let flag: boolean = false;
        if (moment(date).day() === 5) { // friday
            flag = true;
        }
        return flag;
    }

    public static dateIsOnSaturday(date: Date): boolean {
        let flag: boolean = false;
        if (moment(date).day() === 6) { // saturday
            flag = true;
        }
        return flag;
    }

    public static dateInMondayToThursDay(date: Date): boolean {
        let flag: boolean = false;
        switch (moment(date).day()) {
            case 1: // monday
            case 2: // tuesday
            case 3: // wednesday
            case 4: // thursday
                flag = true;
                break;
            default:
                flag = false;
        }
        return flag;
    }

    public static dateInMondayToFriday(date: Date): boolean {
        let flag: boolean = false;
        switch (moment(date).day()) {
            case 1: // monday
            case 2: // tuesday
            case 3: // wednesday
            case 4: // thursday
            case 5: // friday
                flag = true;
                break;
            default:
                flag = false;
        }
        return flag;
    }

    // parse time range '10:00-12:00' to appropriate object
    public static parseTimeRangeSlot(timeSlotRange: string): { start: moment.Moment, end: moment.Moment } {
        let timeslot: { start: moment.Moment, end: moment.Moment } = <{ start: moment.Moment, end: moment.Moment }>{};
        if (timeSlotRange) {
            let start = timeSlotRange.split("-")[0];
            let end = timeSlotRange.split("-")[1];
            if (start) {
                timeslot.start = moment(start, DateHelper.timeFormat);
            }
            if (end) {
                timeslot.end = moment(end, DateHelper.timeFormat);
            }
        }
        return timeslot;
    }

    public static timeStringToJsonDateTimeString(timeString: string): string {
        if (timeString) {
            return moment(timeString, DateHelper.timeFormat).format(DateHelper.jsonDateTimeFormat);
        }
        return undefined;
    }

    public static parseAppointmentStartTime(appointmentBand: IAppointmentBand): moment.Moment {
        if (appointmentBand && appointmentBand.appointmentBandDescription) {
            let start = appointmentBand.appointmentBandDescription.split("-")[0];
            if (start) {
                start = start.trim();
                start = StringHelper.splice(start, 3, 0, ":");
                return moment(start, DateHelper.timeFormat);
            }
        }
        return undefined;
    }

    public static getEstimatedDurationOfAppointmentMaxValue(startTime: number, estimatedEndTimeInMinutes: number): number {
        // convert hours into minutes
        let startTimeInMinutes: number = startTime * 60;
        return (estimatedEndTimeInMinutes - startTimeInMinutes) - 1;
    }

    public static convertDateTime(fromString: string): Date {
        if (DateHelper.isJsonISO8601String(fromString)) {
            return DateHelper.fromJsonISO8601String(fromString);
        }
        return null;
    }

    public static getHourMinutes(timestamp: Date): string {
        return moment(timestamp).seconds(0).milliseconds(0).format("HH:mm");
    }

    public static getDurationMinutes(firsTimestamp: Date, secondTimestamp: Date, decimalPlaces: number = 1): string {
        let date1 = moment(firsTimestamp).seconds(0).milliseconds(0).toISOString();
        let date2 = moment(secondTimestamp).seconds(0).milliseconds(0).toISOString();
        const ms = moment(date2).diff(moment(date1));
        return moment.duration(ms).asMinutes().toFixed(decimalPlaces).toString();
    }

    public static isSameDay(timestamp: Date, currentDate: Date): boolean {
        return (timestamp) && (moment(timestamp).isSame(moment(currentDate), "day"));
    }

    // moment.min and moment.max does not play well
    // with dates without times. 
    // hence the following function
    public static getMinDate(values: string[]): string {
        let minValue = values[0];
        let minDateValue = new Date(values[0]);
        values.forEach((dt: any, index) => {
            if (new Date(dt) < minDateValue) {
                minValue = dt;
                minDateValue = new Date(dt);
            }
        });
        return minValue;
    }

    public static getDate(time: string): Date {
        if (time) {
            let hours = parseInt(time.split(":")[0], 10);
            let minutes = parseInt(time.split(":")[1], 10);
            let currentDate = moment();
            currentDate.set("hours", hours);
            currentDate.set("minutes", minutes);
            return currentDate.toDate();
        } else {
            return null;
        }
    }

    public static getTimeDiffInMins(date1: Date, date2: Date): number {
        return moment(date1).diff(moment(date2), "minutes");
    }
}
