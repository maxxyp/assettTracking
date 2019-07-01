/// <reference path="../../../../typings/app.d.ts" />

import * as moment from "moment";
import {ValidationRule} from "aurelia-validation";

export class IsDateLessThanOrEqual extends ValidationRule {
    constructor(compareDate: Date) {
        super(
            compareDate,
            (newValue: Date) => {
                return moment(newValue).isBefore(compareDate) || moment(newValue).isSame(compareDate);
            },
            "The date should be less than or equal to " + moment(compareDate).format("DD-MM-YYYY"),
            "IsDateLessThanOrEqualValidationRule"
        );
    }
}
