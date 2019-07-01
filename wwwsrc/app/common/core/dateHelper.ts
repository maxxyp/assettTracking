import * as moment from "moment";
import { StringHelper } from "./stringHelper";

export class DateHelper {
    public static jsonISO8601RegEx: RegExp = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;
    public static jsonISO8601Format: string = "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]";
    public static jsonDateTimeFormat: string = "YYYY-MM-DD[T]HH:mm:ss[Z]";
    public static jsonDateTimeRegEx: RegExp = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/;
    public static jsonDateFormat: string = "YYYY-MM-DD";
    public static jsonDateRegEx: RegExp = /\d{4}-\d{2}-\d{2}Z/;
    public static timeFormat: string = "HH:mm";

    public static getTodaysDate(): Date {
        let todaysDate = moment().format(DateHelper.jsonISO8601Format);
        return moment(todaysDate).toDate();
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
            let m = moment(json, DateHelper.jsonDateFormat, true);
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

    public static addDays(date: Date, numberOfDays: number): Date {
        let result = new Date();
        result.setDate(date.getDate() + numberOfDays);
        return result;
    }

    public static getDateFromNumber(d: number, t: number, dateFormat?: string, timeFormat?: string): string {
        if (dateFormat === "YYYYMMDD" && timeFormat === "HHmmssSS") {
            const hoursLength = t.toString().length > 7 ? 2 : 1; // we may receive 9341903 instead of 09341903
            let  retDate = moment();
            retDate.set("year", parseInt(d.toString().substr(0, 4), 10));
            retDate.set("month", parseInt(d.toString().substr(4, 2), 10) - 1);
            retDate.set("date", parseInt(d.toString().substr(6, 2), 10));
            retDate.set("hour", parseInt(t.toString().substr(0, hoursLength), 10));
            retDate.set("minute", parseInt(t.toString().substr(hoursLength, 2), 10));
            retDate.set("second", parseInt(t.toString().substr((hoursLength + 2), 2), 10));
            return retDate.format("DD/MMM HH:mm");
        }
        return undefined;
    }
}
