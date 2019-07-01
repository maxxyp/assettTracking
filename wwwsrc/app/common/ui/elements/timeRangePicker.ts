/// <reference path="../../../../typings/app.d.ts" />

import { bindable, customElement } from "aurelia-templating";
import { bindingMode } from "aurelia-binding";
import * as moment from "moment";
import { TimeRange } from "./models/timeRange";
import { inject } from "aurelia-dependency-injection";
import { DOM } from "aurelia-pal";
@customElement("time-range-picker")
@inject(Element)
export class TimeRangePicker {

    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: TimeRange;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public startTimeDisabled: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public endTimeDisabled: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public readOnly: boolean;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public startTimeLabel: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public endTimeLabel: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public intervalInMinutes: number;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public buttonContainerClasses: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public buttonMinusClasses: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public buttonPlusClasses: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public hideKeyboardOnEnter: boolean;
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public durationInMinutes: number;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public controlContainerClasses: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public startTime: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public endTime: string;
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public eachSide: boolean;

    private _internalValueChange: boolean;
    private _element: Element;
    private _timeFormatRegEx: RegExp;

    constructor(element: Element) {
        this._timeFormatRegEx = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        this.startTimeLabel = "Start time";
        this.endTimeLabel = "End time";
        this.intervalInMinutes = 5;
        this.durationInMinutes = 5;
        this.startTimeDisabled = false;
        this.endTimeDisabled = false;
        this._element = element;
    }

    public valueChanged(newValue: TimeRange, oldValue: TimeRange): void {
        if (!this._internalValueChange) {
            let currentStartTime = this.value ? this.value.startTime : "";
            let currentEndTime = this.value ? this.value.endTime : "";
            if (this.startTime !== currentStartTime) {
                this.startTime = currentStartTime;
            }
            if (this.endTime !== currentEndTime) {
                this.endTime = currentEndTime;
            }

            this.updateDuration();
        }
    }

    public startTimeChanged(newValue: string, oldValue: string): void {
        this._internalValueChange = true;

        let currentEndTime = this.value ? this.value.endTime : this.endTime;
        if (this._timeFormatRegEx.test(this.startTime)) {
            if (!this.isStartDateGreaterThanEnd(this.startTime, currentEndTime)) {
                this.value = new TimeRange(this.startTime, currentEndTime);
            } else {
                this.startTime = currentEndTime;
                this.value = new TimeRange(currentEndTime, currentEndTime);
            }
        } else {
            this.value = undefined;
        }
        this.updateDuration();
        this._internalValueChange = false;
    }

    public endTimeChanged(newValue: string, oldValue: string): void {
        this._internalValueChange = true;
        let currentStartTime = this.value ? this.value.startTime : this.startTime;
        if (this._timeFormatRegEx.test(this.endTime)) {
            if (!this.isStartDateGreaterThanEnd(currentStartTime, this.endTime)) {
                this.value = new TimeRange(currentStartTime, this.endTime);
            } else {
                this.endTime = currentStartTime;
                this.value = new TimeRange(currentStartTime, currentStartTime);
            }
        } else {
            this.value = undefined;
        }
        this.updateDuration();
        this._internalValueChange = false;
    }

    public blur(): void {
        this._element.dispatchEvent(DOM.createCustomEvent("blur", {
            detail: {
                value: this._element
            },
            bubbles: true
        }));
    }

    private updateDuration(): void {
        if (this._timeFormatRegEx.test(this.startTime) && this._timeFormatRegEx.test(this.endTime)) {
            this.durationInMinutes = this.getDuration(this.value);
        } else {
            this.durationInMinutes = 0;
        }
    }

    private getTime(time: string): Date {
        if (time) {
            let hours = parseInt(time.split(":")[0], 10);
            let minutes = parseInt(time.split(":")[1], 10);
            let currentDate = moment();
            currentDate.set("hours", hours);
            currentDate.set("minutes", minutes);
            return currentDate.toDate();
        } else {
            return null;
        }
    }

    private isStartDateGreaterThanEnd(startTime: string, endTime: string): boolean {
        let flag: boolean = false;
        let start: Date = this.getTime(startTime);
        let end: Date = this.getTime(endTime);
        if (start && end) {
            flag = start.getTime() > end.getTime();
        }
        return flag;
    }

    private getDuration(time: TimeRange): number {
        if (time) {
            let duration: number;
            let logStartTime: Date = null;
            let workEndTime: Date = null;

            if (time.startTime) {
                logStartTime = this.getTime(time.startTime);
            }

            if (time.endTime) {
                workEndTime = this.getTime(time.endTime);
            }

            if (logStartTime && workEndTime) {
                duration = moment(workEndTime).diff(moment(logStartTime), "minutes");
            } else if (logStartTime) {
                duration = moment(new Date()).diff(moment(logStartTime), "minutes");
            }

            // convert to nearst of minutes interval
            if (duration && duration > 0) {
                return Math.ceil(duration / this.intervalInMinutes) * this.intervalInMinutes;
            } else if (duration === 0) {
                return 0;
            } else {
                return this.intervalInMinutes;
            }
        } else {
            return null;
        }
    }
}
