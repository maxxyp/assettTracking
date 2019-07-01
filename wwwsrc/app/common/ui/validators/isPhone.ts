/// <reference path="../../../../typings/app.d.ts" />

import {ValidationRule} from "aurelia-validation";

export class IsPhone extends ValidationRule {
    constructor() {
        super(
            null,
            (newValue: string) => {
                newValue = newValue.replace(/\(|\)|\s+|-/gi, "");
                let regularExpression: RegExp = /^0(?:1\d{8,9}|[23]\d{9}|7(?:[45789]\d{8}|624\d{6}))$/;
                return regularExpression.test(newValue);
            },
            "The phone is not in a valid format",
            "IsPhoneValidationRule"
        );
    }
}
