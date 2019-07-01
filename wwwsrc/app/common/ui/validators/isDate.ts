/// <reference path="../../../../typings/app.d.ts" />

import {ValidationRule} from "aurelia-validation";

export class IsDate extends ValidationRule {
    constructor() {
        super(
            null,
            (newValue: Date) => {
                return newValue && !isNaN(newValue.getTime());
            },
            "The date is not valid",
            "IsDateValidationRule"
        );
    }
}
