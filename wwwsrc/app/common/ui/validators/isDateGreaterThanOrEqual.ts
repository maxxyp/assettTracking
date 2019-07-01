/// <reference path="../../../../typings/app.d.ts" />

import * as moment from "moment";
import {ValidationRule} from "aurelia-validation";

export class IsDateGreaterThanOrEqual extends ValidationRule {
    constructor(compareDate: Date) {
        super(
            compareDate,
            (newValue: Date) => {
                return moment(newValue).isAfter(compareDate) || moment(newValue).isSame(compareDate);
            },
            "The date should be greater than or equal to " + moment(compareDate).format("DD-MM-YYYY"),
            "IsDateGreaterThanOrEqualValidationRule"
        );
    }
}
