/// <reference path="../../../../typings/app.d.ts" />

import { bindable, customElement } from "aurelia-templating";
import { bindingMode } from "aurelia-binding";
import { DOM } from "aurelia-pal";
import { inject } from "aurelia-dependency-injection";
import { Threading } from "../../../common/core/threading";
import { NumberHelper } from "../../../common/core/numberHelper";

@customElement("incremental-number-picker")
@inject(Element)
export class IncrementalNumberPicker {
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: number;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public hideKeyboardOnEnter: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public disabled: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public readOnly: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public cancelDefaultSubmit: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public incrementStep: number;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public minValue: number;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public maxValue: number;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public eachSide: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public buttonMinusClasses: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public buttonPlusClasses: string;

    private _hasFocus: boolean;
    private _element: Element;
    private _oldValue: number;

    constructor(element: Element) {
        this._element = element;
    }

    public attached(): void {
        if (!this.eachSide) {
            this.eachSide = false;
        }
        this._oldValue = this.minValue;
    }

    public valueChanged(newValue: number, oldValue: number): void {
        if (oldValue !== undefined && oldValue !== null) {
            this._oldValue = oldValue;
        }
        if (this.isAboveMax(newValue) || this.isBelowMin(newValue)) {
            Threading.nextCycle(() => {
                this.value = oldValue;
            });
        }
    }

    public add(): void {
        this.ensureIncrementHasValue();

        if (!NumberHelper.isNumber(this.value)) {
            /* when clicking add on an empty value, initialise to:
                 basementValue if basementValue is non-zero
                 otherwise basementValue plus incrementValue
                (in other words, it looks odd if "add"" intialises an empty value to zero)
            */
            let basementValue = (this.minValue || 0);
            this.value = basementValue ? basementValue : basementValue + this.incrementStep;
        } else {
            if (!this.isAboveMax(this.value + this.incrementStep)) {
                this.value = this.value + this.incrementStep;
            }
        }
        this.dispachEvent("add");
    }

    public subtract(): void {
        this.ensureIncrementHasValue();

        if (!NumberHelper.isNumber(this.value)) {
            // when clicking subtract on an empty value, initialise to basement value
            this.value = this.minValue || 0;
        } else {
            if (!this.isBelowMin(this.value - this.incrementStep)) {
                this.value = this.value - this.incrementStep;
            }
        }
        this.dispachEvent("subtract");
    }

    public updated(): void {
        this.dispachEvent("updated");
    }

    public blur(): void {
        this._hasFocus = false;

        Threading.nextCycle(() => {
            if (!this._hasFocus) {
                this._element.dispatchEvent(DOM.createCustomEvent("blur", {
                    detail: {
                        value: this._element
                    },
                    bubbles: true
                }));
            }
        });

        if (this.value === undefined || this.value === null) {
            if (this._oldValue !== undefined && this._oldValue !== null) {
                this.value = this._oldValue;
            } else {
                this.value = this.minValue;
            }
        }
       this.updated();
    }

    public focus(): void {
        this._hasFocus = true;
    }

    public dispachEvent(eventName: string): void {
        Threading.nextCycle(() => {
            let myevent: Event = new Event(eventName);
            if (this._element) {
                this._element.dispatchEvent(myevent);
            }
        });
    }

    private ensureIncrementHasValue(): void {
        if (!NumberHelper.isNumber(this.incrementStep)) {
            this.incrementStep = 1;
        }
    }

    private isAboveMax(value: number): boolean {
        return NumberHelper.isNumber(value) && NumberHelper.isNumber(this.maxValue)
            && (value > this.maxValue);
    }

    private isBelowMin(value: number): boolean {
        return NumberHelper.isNumber(value) && NumberHelper.isNumber(this.minValue)
            && (value < this.minValue);
    }
}
