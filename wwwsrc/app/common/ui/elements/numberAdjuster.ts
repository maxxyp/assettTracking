import {bindable, customElement} from "aurelia-templating";
import {inject} from "aurelia-dependency-injection";
import {bindingMode, computedFrom} from "aurelia-binding";
import {StringHelper} from "../../core/stringHelper";

@customElement("number-adjuster")
@inject(Element)
export class NumberAdjuster {
    @bindable({defaultBindingMode: bindingMode.twoWay})
    public value: number;

    @bindable({defaultBindingMode: bindingMode.twoWay})
    public maxValue: number;

    @bindable({defaultBindingMode: bindingMode.twoWay})
    public minValue: number;

    @bindable({defaultBindingMode: bindingMode.oneTime})
    public showMax: boolean;

    @bindable({defaultBindingMode: bindingMode.oneTime})
    public showMissingItemLabel: boolean;

    @bindable({defaultBindingMode: bindingMode.oneTime})
    public disabled: boolean;

    public increment(): void {

        if (this.disableMax) {
            return;
        }

        if (this.disabled) {
            return;
        }

        if (this.value < this.maxValue) {
            this.value++;
        }
    }

    public decrement(): void {

        if (this.disableMin) {
            return;
        }

        if (this.disabled) {
            return;
        }

        if (this.value) {
            this.value--;
        }
    }

    @computedFrom("value", "maxValue", "showMax")
    public get disableMax(): boolean {
        if (this.disabled) {
            return true;
        }

        return this.value === this.maxValue;
    }

    @computedFrom("value", "minValue", "showMax")
    public get disableMin(): boolean {

        if (this.disabled) {
            return true;
        }

        if (this.value === 0) {
            return true;
        }

        return this.value === this.minValue;
    }

    @computedFrom("value", "maxValue", "showMax")
    public get displayValue(): string {

        return `${this.value} ${this.showMax ? ` of  ${this.maxValue}` : ""}`;

    }

    @computedFrom("value", "maxValue", "minValue")
    public get missingItemLabel(): string {

        if (this.disabled) {
            return "";
        }

        if (!this.showMissingItemLabel) {
            return "";
        }

        if (this.value === undefined) {
            return "";
        }

        if (this.value === this.maxValue) {
            return "";
        }

        const missingQty = this.maxValue - this.value;
        return `Missing ${StringHelper.pluralise(missingQty, "item")}`;
    }

}
