import * as moment from "moment";
import { StringHelper } from "../../common/core/stringHelper";

export class TimeHelper {
    public static isValidTime(value: string): boolean {
        const timeFormatRegEx = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeFormatRegEx.test(value);
    }

    // purpose is to convert time string to proper time for e.g. 1900 to 19:00
    // either returns a valid value or returns undefined if its invalid
    public static getTimeString(value: string): string {
        if (value) {
            if (value.indexOf(":") === -1) {  // if ':' NOT found 
                let temp;
                if (value.length > 4) {
                    /* no colon max length is 4 */
                    temp = value.substr(0, 4);
                } else if (value.length < 4) {
                    /* no colon, not long enough, pad right with zeros */
                    temp = StringHelper.padRight(value, "0", 4);
                } else {
                    temp = value;
                }
                if (temp) {
                    const newVal = temp.slice(0, 2) + ":" + temp.slice(2);
                    // const isValieTimeFormat = validFormatRegEx.test(newVal);
                    if (TimeHelper.isValidTime(newVal) && newVal !== "00:00") {
                        return newVal;
                    }
                }
                return undefined;
            } else { // if ':' found 
                /* has a colon split it into parts */
                let parts = value.split(":");
                if (parts.length >= 2) {
                    if (parts[0].length > 2) {
                        parts[0] = parts[0].substring(0, 2);
                    } else if (parts.length < 2) {
                        parts[0] = StringHelper.padLeft(parts[0], "0", 2);
                    }

                    if (parts[1].length > 2) {
                        parts[1] = parts[1].substring(0, 2);
                    } else if (parts.length < 2) {
                        parts[1] = StringHelper.padRight(parts[1], "0", 2);
                    }

                    /* add a colon */
                    const newVal = parts[0] + ":" + parts[1];
                    if (TimeHelper.isValidTime(newVal) && newVal !== "00:00") {
                        return newVal;
                    }
                    return undefined;
                }
                return undefined;
            }
        }
        return undefined;
    }

    public static isAfter(time1: string, time2: string, format: string): boolean {
        return moment(time1, format).isAfter(moment(time2, format));
    }
}
