import { bindable, customElement } from "aurelia-templating";
import { bindingMode, observable } from "aurelia-binding";
import { inject } from "aurelia-dependency-injection";
import { DOM } from "aurelia-pal";
import { Threading } from "../../core/threading";
import { StringHelper } from "../../core/stringHelper";

@customElement("number-box")
@inject(Element)
export class NumberBox {
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: number;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public classes: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public disabled: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public readonly: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public floatAllowed: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public placeholder: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public maxLength: number;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public maxValue: number;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public wholePlaces: number;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public decimalPlaces: number;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public hideKeyboardOnEnter: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public cancelDefaultSubmit: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public resetValueForValidation: boolean;

    @observable
    public inputValue: string;
    @observable
    public defaultPlaceholder: string;

    private _element: Element;

    constructor(element: Element) {
        this.placeholder = "";
        this.defaultPlaceholder = "";
        this._element = element;
        this.maxLength = 15;
        this.resetValueForValidation = false;
    }

    public attached(): void {
        this.updatePlaceholder();
    }

    public placeholderChanged(): void {
        this.updatePlaceholder();
    }

    public decimalPlacesChanged(): void {
        this.updatePlaceholder();
    }

    // warning: if you bind to this you are forced to use a (finite) number type or undefined only
    // bind your model to this
    public valueChanged(newValue: number, oldValue: number): void {
        if (typeof this.value === "number" && isFinite(this.value)) {
            if (newValue > this.maxValue) {
                if (!this.resetValueForValidation) {
                    Threading.nextCycle(() => {
                        this.value = oldValue;
                    });
                }
            } else {
                if (this.decimalPlaces) {
                    let actualDecimalPlaces = this.calculatePlaceValues(newValue);
                    if (actualDecimalPlaces > this.decimalPlaces) {
                        Threading.nextCycle(() => {
                            this.value = oldValue; // don't use old value here if it's not valid
                        });
                    }
                    if (oldValue === undefined && !this.resetValueForValidation) {
                        let inptVal = this.getFormattedInputValue(newValue.toString(), newValue, actualDecimalPlaces, this.decimalPlaces);
                        if (inptVal !== undefined) {
                            this.inputValue = inptVal;
                        }
                    }
                }
            }

            if (this.value !== parseFloat(this.inputValue)) {
                if (this.decimalPlaces) {
                    let actualDecimalPlaces = this.calculatePlaceValues(newValue);
                    let inptVal = this.getFormattedInputValue(newValue.toString(), newValue, actualDecimalPlaces, this.decimalPlaces);
                    if (inptVal !== undefined) {
                        this.inputValue = inptVal;
                    } else {
                        this.inputValue = this.value.toString();
                    }
                } else {
                    this.inputValue = this.value.toString();
                }
            }
        } else {
            if (this.inputValue !== "") {
                this.inputValue = "";
            }
        }
    }

    // to be used internally, never bind to this
    public inputValueChanged(newValue: string, oldValue: string): void {
        let parsedValue = parseFloat(newValue);
        // use undefined rather than NaN
        parsedValue = isNaN(parsedValue) ? undefined : parsedValue;
        if (parsedValue !== this.value) {
            this.value = parsedValue;
        }
    }

    public blur(): void {
        this.prefixDecimalPlaceWithZero();
        this._element.dispatchEvent(DOM.createCustomEvent("blur", {
            detail: {
                value: this._element
            },
            bubbles: true
        }));
    }

    private calculatePlaceValues(newValue: number): number {
        let value = newValue.toString();
        let usesScientificNotation = value.indexOf("e") !== -1;
        let actualDecimalPlaces = 0;

        if (usesScientificNotation) {
            let exponent = parseFloat(value.split("e").pop());
            if (exponent !== undefined && exponent < 0) {
                actualDecimalPlaces = Math.abs(exponent);
            }
        } else {
            let decimalPointIndex = value.indexOf(".");
            if (decimalPointIndex !== -1) {
                actualDecimalPlaces = value.length - decimalPointIndex - 1;
            }
        }

        return actualDecimalPlaces;
    }

    private prefixDecimalPlaceWithZero(): void {
        if (this.value !== null && this.value !== undefined) {
            if (this.decimalPlaces) {
                let actualDecimalPlaces = this.calculatePlaceValues(this.value);
                let inptVal = this.getFormattedInputValue(this.inputValue, this.value, actualDecimalPlaces, this.decimalPlaces);
                if (inptVal === undefined) {
                    this.inputValue = this.value.toString(10);
                } else {
                    this.inputValue = inptVal;
                }
            } else {
                this.inputValue = this.value.toString(10);
            }
        } else if (this.inputValue !== null && this.inputValue !== undefined) {
            if (this.inputValue === ".") {
                if (this.decimalPlaces !== null && this.decimalPlaces !== undefined) {
                    this.inputValue = "0." + StringHelper.padRight("", "0", this.decimalPlaces);
                } else {
                    this.inputValue = "0";
                }

                this.value = parseFloat(this.inputValue);
            }
        }
    }

    private updatePlaceholder(): void {
        if (!this.placeholder && this.decimalPlaces) {
            this.defaultPlaceholder = "0." + StringHelper.padRight("", "0", this.decimalPlaces);
        }
    }

    private getFormattedInputValue(inputValue: string, value: number, actualDecimalPlaces: number, decimalPlaces: number): string {
        let inputVal: string = undefined;
        if (inputValue !== undefined && inputValue !== null) {
            if (actualDecimalPlaces < decimalPlaces) {
                if (decimalPlaces) {
                    // postfix zeros to inputValue                        
                    if (inputValue.indexOf(".") !== -1) {
                        let decimalPlcs = this.calculatePlaceValues(parseFloat(inputValue));
                        if (decimalPlcs > 0) {
                            inputVal = parseFloat(inputValue) + StringHelper.padRight("", "0", decimalPlaces - actualDecimalPlaces);
                        } else {
                            inputVal = parseFloat(inputValue) + "." + StringHelper.padRight("", "0", decimalPlaces);
                        }
                    } else {
                        inputVal = parseFloat(inputValue) + "." + StringHelper.padRight("", "0", decimalPlaces);
                    }
                } else {
                    inputVal = inputValue;
                }
            }
        }
        return inputVal;
    }
}
