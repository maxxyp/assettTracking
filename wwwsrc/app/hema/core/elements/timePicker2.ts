/// <reference path="../../../../typings/app.d.ts" />

import { bindable, customElement } from "aurelia-templating";
import { bindingMode } from "aurelia-binding";
import * as moment from "moment";
import { inject } from "aurelia-dependency-injection";
import { DOM } from "aurelia-pal";
import { TimeHelper } from "../../../hema/core/timeHelper";
import { Threading } from "../../../common/core/threading";

@customElement("time-picker2")
@inject(Element)
export class TimePicker2 {
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public classes: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public controlContainerClasses: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public buttonContainerClasses: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public buttonMinusClasses: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public buttonPlusClasses: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public hideKeyboardOnEnter: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public disabled: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public readOnly: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public cancelDefaultSubmit: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public intervalInMinutes: number;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public eachSide: boolean;
    public pickerTextBox: HTMLInputElement;
    /* HH:mm */
    private _timeFormatRegEx: RegExp;
    private _hasFocus: boolean;
    private _element: Element;
    private _startStopTimer: number;
    private _lastKnownValue: string;

    constructor(element: Element) {
        this._timeFormatRegEx = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        this._element = element;
        this._startStopTimer = -1;
    }

    public attached(): void {
        this._element.addEventListener("mousedown", (e: MouseEvent) => {
            this.start(e);
        });
        this._element.addEventListener("mouseup", (e: MouseEvent) => {
            this.stop(e);
        });
        this._element.addEventListener("touchstart", (e: TouchEvent) => {
            this.start(e);
        });
        this._element.addEventListener("touchend", (e: TouchEvent) => {
            this.stop(e);
        });
        this._element.addEventListener("mouseout", (e: MouseEvent) => {
            this.stop(e);
        });
        if (!this.eachSide) {
            this.eachSide = false;
        }
        this.populateDefault();
    }

    public detached(): void {
        this._element.removeEventListener("mousedown", (e: MouseEvent) => {
            this.start(e);
        });
        this._element.removeEventListener("mouseup", (e: MouseEvent) => {
            this.stop(e);
        });
        this._element.removeEventListener("touchstart", (e: TouchEvent) => {
            this.start(e);
        });
        this._element.removeEventListener("touchend", (e: TouchEvent) => {
            this.stop(e);
        });
        this._element.removeEventListener("mouseout", (e: TouchEvent) => {
            this.stop(e);
        });
    }

    public add(): void {
        if (this.isValidTime() && this.intervalInMinutes) {
            let time = this.getTime(this.value);
            let incrementBy = Math.ceil((time.minute() + 1) / this.intervalInMinutes) * this.intervalInMinutes - time.minute();
            time.add(incrementBy, "minutes");
            this.value = time.format("HH:mm");
        }
    }

    public subtract(): void {
        if (this.isValidTime() && this.intervalInMinutes) {
            let time = this.getTime(this.value);
            let incrementBy = Math.floor((time.minute() - 1) / this.intervalInMinutes) * this.intervalInMinutes - time.minute();
            time.add(incrementBy, "minutes");
            this.value = time.format("HH:mm");
        }
    }

    public blur(): void {
        this._hasFocus = false;
        const value = TimeHelper.getTimeString(this.value);
        if (value && value !== this._lastKnownValue) {
            this._lastKnownValue = value;
            this.value = value;
        }

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
    }

    public focus(): void {
        this._hasFocus = true;
    }

    public start(e: any): void {
        if (e.srcElement.className.indexOf(this.buttonPlusClasses) > -1 && (e.type === "mousedown" || e.type === "touchstart") && this._startStopTimer === -1) {
            this._startStopTimer = Threading.startTimer(() => this.add(), 200);
        } else if (e.srcElement.className.indexOf(this.buttonMinusClasses) > -1 && (e.type === "mousedown" || e.type === "touchstart") && this._startStopTimer === -1) {
            this._startStopTimer = Threading.startTimer(() => this.subtract(), 200);
        }
    }

    public stop(e: any): void {
        Threading.stopTimer(this._startStopTimer);
        this._startStopTimer = -1;
    }

    public valueChanged(newValue: string): void {
        Threading.nextCycle(() => {
            const value = TimeHelper.getTimeString(newValue);
            if (value === this._lastKnownValue) {
                return;
            }
            if (!value) {
                this.value = this._lastKnownValue;
                return;
            }
            this._lastKnownValue = value;
        });
    }

    private isValidTime(): boolean {
        return this._timeFormatRegEx.test(this.value);
    }

    private getTime(time: string): moment.Moment {
        let hours = parseInt(time.split(":")[0], 10);
        let minutes = parseInt(time.split(":")[1], 10);
        let currentDate = moment();
        currentDate.set("hours", hours);
        currentDate.set("minutes", minutes);
        return currentDate;
    }

    private populateDefault(): void {
        if (!this.intervalInMinutes) {
            this.intervalInMinutes = 1;
        } else if (this.intervalInMinutes === 0) {
            this.intervalInMinutes = 1;
        }
    }
}
