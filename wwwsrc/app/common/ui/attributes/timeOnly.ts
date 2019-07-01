/// <reference path="../../../../typings/app.d.ts" />

import {customAttribute} from "aurelia-templating";
import {inject} from "aurelia-dependency-injection";
import {AttributeBase} from "./attributeBase";

@customAttribute("time-only")
@inject(Element)
export class TimeOnly extends AttributeBase {
    constructor(element: HTMLInputElement) {
        super(element);
    }

    public clipboardIsValid(event: ClipboardEvent): boolean {
        let clipboardData = event.clipboardData.getData("Text");
        return /^\d+$/.test(clipboardData) || (/^[0-9]*[:][0-9]+$/.test(clipboardData));
    }

    public eventKeyIsValid(event: KeyboardEvent): boolean {
        let keyType = this.defineKeyType(event);
        let isAllowed = keyType === AttributeBase.CONTROL || keyType === AttributeBase.NUMERICAL;

        if (!isAllowed) {
            /* Colon */
            if (event.which === 16 || event.which === 186) {
                isAllowed = true;
            }
        }

        if (isAllowed && keyType === AttributeBase.NUMERICAL && this.exceedsMaxLength(5, 1)) {
            isAllowed = false;
        }

        return isAllowed;
    }
}
