/// <reference path="../../../../typings/app.d.ts" />

import * as moment from "moment";
import {ValidationRule} from "aurelia-validation";

export class IsDateLessThan extends ValidationRule {
    constructor(compareDate: Date) {
        super(
            compareDate,
            (newValue: Date) => {
                return moment(newValue).isBefore(compareDate);
            },
            "The date should be less than " + moment(compareDate).format("DD-MM-YYYY"),
            "IsDateLessThanValidationRule"
        );
    }
}
