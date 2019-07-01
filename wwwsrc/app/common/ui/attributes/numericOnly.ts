/// <reference path="../../../../typings/app.d.ts" />

import {customAttribute} from "aurelia-templating";
import {inject} from "aurelia-dependency-injection";
import {bindable} from "aurelia-templating";
import {AttributeBase} from "./attributeBase";

@customAttribute("numeric-only")
@inject(Element)
export class NumericOnly extends AttributeBase {
    @bindable
    public allowFloat: boolean;
    @bindable
    public maxLength: number;
    @bindable
    public decimalPlaces: number;
    @bindable
    public wholePlaces: number;

    constructor(element: HTMLInputElement) {
        super(element);

        this.allowFloat = false;
    }

    public clipboardIsValid(event: ClipboardEvent): boolean {
        let clipboardData = event.clipboardData.getData("Text");
        let isAllowed = /^\d+$/.test(clipboardData) || (this.allowFloat && /^[0-9]*[.][0-9]+$/.test(clipboardData));

        if (isAllowed) {
            let valueMask = this.valueMaskFromClipboardData(clipboardData);
            isAllowed = this.inputLengthValid(clipboardData.length, valueMask);
        }

        return isAllowed;
    }

    public eventKeyIsValid(event: KeyboardEvent): boolean {
        let keyType = this.defineKeyType(event);
        let isAllowed = keyType === AttributeBase.CONTROL || keyType === AttributeBase.NUMERICAL;

        /* One dot only for float, keyboard dot and numpad dot */
        if (this.allowFloat && keyType === AttributeBase.DECIMALMARK && this._element.value.indexOf(".") < 0) {
            isAllowed = true;
        }

        if (isAllowed && (keyType === AttributeBase.NUMERICAL || keyType === AttributeBase.DECIMALMARK)) {
            let valueMask = this.valueMaskFromKeyType(keyType);
            isAllowed = this.inputLengthValid(1, valueMask);
        }

        return isAllowed;
    }

    private inputLengthValid(addLength: number, valueMask: string): boolean {
        return !(this.exceedsMaxLength(this.maxLength, addLength) ||
            this.exceedsMaxDecimalPlaces(this.decimalPlaces, valueMask) ||
            this.exceedsMaxWholePlaces(this.wholePlaces, valueMask)
        );
    }
}
