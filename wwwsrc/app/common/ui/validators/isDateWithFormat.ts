/// <reference path="../../../../typings/app.d.ts" />

import * as moment from "moment";
import {ValidationRule} from "aurelia-validation";

export class IsDateWithFormat extends ValidationRule {
    constructor(dateFormat: string) {
        super(
            dateFormat,
            (newValue: string, dateStringFormat: string) => {
                return newValue && moment(newValue, dateStringFormat, true).isValid();
            },
            "This is not a valid date format for " + dateFormat,
            "IsDateWithFormatValidationRule"
        );
    }
}
