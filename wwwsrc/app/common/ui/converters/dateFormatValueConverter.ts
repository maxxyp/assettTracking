/// <reference path="../../../../typings/app.d.ts" />

import * as moment from "moment";

export class DateFormatValueConverter {

    public toView(value: any, format?: string): any {
        if (value) {
            if (!format) {
                format = "D MMMM YYYY";
            }
            return moment(value).format(format); 
        } else {
            return value;
        }
    }
}
