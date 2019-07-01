/// <reference path="../../../../typings/app.d.ts" />

import { bindable, customElement } from "aurelia-templating";
import { bindingMode } from "aurelia-binding";
import * as moment from "moment";
import { Threading } from "../../core/threading";
import { inject } from "aurelia-dependency-injection";
import { StringHelper } from "../../core/stringHelper";
import { DOM } from "aurelia-pal";

@customElement("time-picker")
@inject(Element)
export class TimePicker {
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

        if (this.value) {
            if ((this.value.length === 4) && (this.value.indexOf(":") === -1)) {
                // there are 4 chars and no colon
                this.value = this.value.substr(0, 2) + ":" + this.value.substr(2);
            } else if ((this.value.length === 3) && (this.value.indexOf(":") === -1)) {
                this.value = this.value.substr(0, 1) + ":" + this.value.substr(1);
            }
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

    public valueChanged(): void {
        Threading.nextCycle(() => {
            /* does it have a colon */
            let colonIndex = this.value.indexOf(":");

            if (colonIndex === -1) {
                if (this.value.length > 4) {
                    /* no colon max length is 4 */
                    this.value = this.value.substr(0, 4);
                } else if (this.value.length < 4) {
                    /* no colon, not long enough, pad right with zeros */
                    this.value = StringHelper.padRight(this.value, "0", 4);
                }

                /* add a colon */
                this.value = this.value.slice(0, 2) + ":" + this.value.slice(2);
            } else {
                /* has a colon split it into parts */
                let parts = this.value.split(":");
                if (parts.length >= 2) {
                    if (parts[0].length > 2) {
                        parts[0] = parts[0].substring(0, 2);
                    } else if (parts.length < 2) {
                        parts[0] = StringHelper.padLeft(parts[0], "0", 2);
                    }

                    if (parts[1].length > 2) {
                        parts[1] = parts[1].substring(0, 2);
                    } else if (parts.length < 2) {
                        parts[1] = StringHelper.padRight(parts[1], "0", 2);
                    }

                    /* add a colon */
                    this.value = parts[0] + ":" + parts[1];
                }
            }

            /* still not valid so clear it out */
            if (!this.isValidTime()) {
                this.value = "";
            }
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

    private populateDefaultTime(): void {
        if (!this.value) {
            let currentDate = moment();
            this.value = currentDate.format("HH:mm");
        }
    }

    private populateDefault(): void {
        if (!this.intervalInMinutes) {
            this.intervalInMinutes = 5;
        } else if (this.intervalInMinutes === 0) {
            this.intervalInMinutes = 1;
        }
        this.populateDefaultTime();
    }
}
