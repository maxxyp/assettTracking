/// <reference path="../../../../typings/app.d.ts" />

import * as moment from "moment";
import {ValidationRule} from "aurelia-validation";

export class IsDateGreaterThan extends ValidationRule {
    constructor(compareDate: Date) {
        super(
            compareDate,
            (newValue: Date) => {
                return moment(newValue).isAfter(compareDate);
            },
            "The date should be greater than " + moment(compareDate).format("DD-MM-YYYY"),
            "IsDateGreaterThanValidationRule"
        );
    }
}
