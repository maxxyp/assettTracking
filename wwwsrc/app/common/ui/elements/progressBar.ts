/// <reference path="../../../../typings/app.d.ts" />

import {customElement, bindable} from "aurelia-framework";
import {bindingMode} from "aurelia-framework";

@customElement("progress-bar")
export class ProgressBar {
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public maxValue: number;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public minValue: number;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public value: number;

    public percent: string;

    constructor() {
        this.value = 0;
        this.minValue = 0;
        this.maxValue = 0;
    }

    public attached() : void {
        this.updateDisplay();
    }

    public valueChanged(newVal: number, oldVal: number) : void {
        if (newVal !== oldVal) {
            this.updateDisplay();
        }
    }

    public maxValueChanged(newVal: number, oldVal: number) : void {
        if (newVal !== oldVal) {
            this.updateDisplay();
        }
    }

    public minValueChanged(newVal: number, oldVal: number) : void {
        if (newVal !== oldVal) {
            this.updateDisplay();
        }
    }

    private updateDisplay() : void {
        if (this.value < this.minValue) {
            this.value = this.minValue;
        }
        if (this.value > this.maxValue) {
            this.value = this.maxValue;
        }

        let range = (this.maxValue + 1) - this.minValue;

        if (range > 0) {
            this.percent = (((this.value - this.minValue + 1) / range) * 100) + "%";
        } else {
            this.percent = "0%";
        }
    }
}
