/// <reference path="../../../../typings/app.d.ts" />

export abstract class AttributeBase {

    public static NUMERICAL: string = "numerical";
    public static DECIMALMARK: string = "decimalmark";
    public static CONTROL: string = "control";

    protected _element: HTMLInputElement;

    private _keyDown: (event: KeyboardEvent) => void;
    private _paste: (event: ClipboardEvent) => void;

    constructor(element: HTMLInputElement) {
        this._element = element;

        this._keyDown = (event) => {
            if (!this.eventKeyIsValid(event)) {
                event.preventDefault();
            }
        };
        this._paste = (event) => {
            if (!this.clipboardIsValid(event)) {
                event.preventDefault();
            }
        };
    }

    public attached(): void {
        this._element.addEventListener("keydown", this._keyDown);
        this._element.addEventListener("paste", this._paste);
    }

    public detached(): void {
        this._element.removeEventListener("keydown", this._keyDown);
        this._element.removeEventListener("paste", this._paste);
    }

    public abstract clipboardIsValid(event: ClipboardEvent): boolean;

    public abstract eventKeyIsValid(event: KeyboardEvent): boolean;

    protected defineKeyType(event: KeyboardEvent): string {
        let keyType: string;
        if (this.keyboardEventIsNumerical(event)) {
            keyType = AttributeBase.NUMERICAL;
        } else if (this.keyboardEventIsDecimalMark(event)) {
            keyType = AttributeBase.DECIMALMARK;
        } else if (this.keyboardEventIsControl(event)) {
            keyType = AttributeBase.CONTROL;
        }
        return keyType;
    }

    protected exceedsMaxLength(maxLength: number, addLength: number): boolean {
        return this.exceedsMax(this.numericalLengthOfElement(), maxLength, addLength);
    }

    protected exceedsMaxDecimalPlaces(maxLength: number, valueMask: string): boolean {
        return maxLength && this.calculateDecimalPlaceValues(valueMask) > maxLength;
    }

    protected exceedsMaxWholePlaces(maxLength: number, valueMask: string): boolean {
        return maxLength && this.calculateWholePlaceValues(valueMask) > maxLength;
    }

    protected keyboardEventIsNumerical(event: KeyboardEvent): boolean {
        return (
            (event.which >= 48 && event.which <= 57 && !event.shiftKey) || /* Digits */
            (event.which >= 96 && event.which <= 105) /* NumPad */
        );
    }

    protected keyboardEventIsDecimalMark(event: KeyboardEvent): boolean {
        return (event.which === 190 || event.which === 110);
    }

    protected keyboardEventIsControl(event: KeyboardEvent): boolean {
        return (event.which === 8 || /* Backspace */
            event.which === 9 || /* Tab */
            event.which === 46 || /* Delete */
            event.which === 35 || /* End */
            event.which === 36 || /* Home */
            event.which === 37 || /* Left arrow */
            event.which === 39 || /* right arrow */
            (event.which === 67 && event.ctrlKey) || /* Ctrl-C copy */
            (event.which === 88 && event.ctrlKey) || /* Ctrl-X cut */
            (event.which === 86 && event.ctrlKey) || /* Ctrl-V paste */
            (event.which === 65 && event.ctrlKey) || /* Ctrl-A select all */
            (event.which === 45 && event.shiftKey) /* Shift-Insert paste */
        );
    }

    protected valueMaskFromKeyType(keyType: string): string {
        if (this._element && this._element.value !== undefined) {
            let selectionStart = 0;
            let selectionEnd = 0;

            try {
                selectionStart = this._element.selectionStart || this._element.value.length;
                selectionEnd = this._element.selectionEnd || this._element.value.length;
            } catch (e) {
                selectionStart = this._element.value.length;
                selectionEnd = this._element.value.length;
            }

            let firstPart = this._element.value.substring(0, selectionStart);
            let lastPart = this._element.value.substring(selectionEnd, this._element.value.length);
            let newKey = keyType === AttributeBase.DECIMALMARK ? "." : "9";
            return firstPart + newKey + lastPart;
        } else {
            return "";
        }
    }

    protected valueMaskFromClipboardData(clipboardData: string): string {
        if (this._element && this._element.value !== undefined) {
            let selectionStart = 0;
            let selectionEnd = 0;

            try {
                selectionStart = this._element.selectionStart || this._element.value.length;
                selectionEnd = this._element.selectionEnd || this._element.value.length;
            } catch (e) {
                selectionStart = this._element.value.length;
                selectionEnd = this._element.value.length;
            }
            
            let firstPart = this._element.value.substring(0, selectionStart);
            let lastPart = this._element.value.substring(selectionEnd, this._element.value.length);
            return firstPart + clipboardData + lastPart;
        } else {
            return "";
        }
    }

    private exceedsMax(currentLength: number, maxLength: number, addLength: number): boolean {
        let exceeds: boolean = false;

        if (maxLength) {
            let selectionLength = 0;

            try {
                selectionLength = this._element.selectionEnd && this._element.selectionStart ?
                this._element.selectionEnd - this._element.selectionStart : 0;
            } catch (e) {
            }

            let newLength: number;
            if (selectionLength === 0) {
                newLength = currentLength + addLength;
            } else {
                newLength = (currentLength - selectionLength) + addLength;
            }

            if (newLength > maxLength) {
                exceeds = true;
            }
        }

        return exceeds;
    }

    private numericalLengthOfElement(): number {
        if (this._element && this._element.value !== undefined) {
            return this._element.value.replace(/\D/g, "").length;
        } else {
            return 0;
        }
    }

    private calculateDecimalPlaceValues(value: string): number {
        let actualDecimalPlaces = 0;

        let decimalPointIndex = value.indexOf(".");
        if (decimalPointIndex !== -1) {
            actualDecimalPlaces = value.length - decimalPointIndex - 1;
        }

        return actualDecimalPlaces;
    }

    private calculateWholePlaceValues(value: string): number {
        let actualWholePlaces = value.length;

        let decimalPointIndex = value.indexOf(".");
        if (decimalPointIndex !== -1) {
            actualWholePlaces = decimalPointIndex;
        }

        return actualWholePlaces;
    }
}
