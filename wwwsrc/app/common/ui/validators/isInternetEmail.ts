/// <reference path="../../../../typings/app.d.ts" />

import {ValidationRule} from "aurelia-validation";

export class IsInternetEmail extends ValidationRule {

    constructor() {
        super(
            null,
            (newValue: string) => {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(newValue);
            },
            "The email is not in a valid format",
            "IsInternetEmailValidationRule"
        );
    }
}
