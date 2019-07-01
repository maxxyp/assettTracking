/// <reference path="../../../../typings/app.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-templating", "aurelia-binding", "moment", "./models/timeRange", "aurelia-dependency-injection", "aurelia-pal"], function (require, exports, aurelia_templating_1, aurelia_binding_1, moment, timeRange_1, aurelia_dependency_injection_1, aurelia_pal_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TimeRangePicker = /** @class */ (function () {
        function TimeRangePicker(element) {
            this._timeFormatRegEx = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            this.startTimeLabel = "Start time";
            this.endTimeLabel = "End time";
            this.intervalInMinutes = 5;
            this.durationInMinutes = 5;
            this.startTimeDisabled = false;
            this.endTimeDisabled = false;
            this._element = element;
        }
        TimeRangePicker.prototype.valueChanged = function (newValue, oldValue) {
            if (!this._internalValueChange) {
                var currentStartTime = this.value ? this.value.startTime : "";
                var currentEndTime = this.value ? this.value.endTime : "";
                if (this.startTime !== currentStartTime) {
                    this.startTime = currentStartTime;
                }
                if (this.endTime !== currentEndTime) {
                    this.endTime = currentEndTime;
                }
                this.updateDuration();
            }
        };
        TimeRangePicker.prototype.startTimeChanged = function (newValue, oldValue) {
            this._internalValueChange = true;
            var currentEndTime = this.value ? this.value.endTime : this.endTime;
            if (this._timeFormatRegEx.test(this.startTime)) {
                if (!this.isStartDateGreaterThanEnd(this.startTime, currentEndTime)) {
                    this.value = new timeRange_1.TimeRange(this.startTime, currentEndTime);
                }
                else {
                    this.startTime = currentEndTime;
                    this.value = new timeRange_1.TimeRange(currentEndTime, currentEndTime);
                }
            }
            else {
                this.value = undefined;
            }
            this.updateDuration();
            this._internalValueChange = false;
        };
        TimeRangePicker.prototype.endTimeChanged = function (newValue, oldValue) {
            this._internalValueChange = true;
            var currentStartTime = this.value ? this.value.startTime : this.startTime;
            if (this._timeFormatRegEx.test(this.endTime)) {
                if (!this.isStartDateGreaterThanEnd(currentStartTime, this.endTime)) {
                    this.value = new timeRange_1.TimeRange(currentStartTime, this.endTime);
                }
                else {
                    this.endTime = currentStartTime;
                    this.value = new timeRange_1.TimeRange(currentStartTime, currentStartTime);
                }
            }
            else {
                this.value = undefined;
            }
            this.updateDuration();
            this._internalValueChange = false;
        };
        TimeRangePicker.prototype.blur = function () {
            this._element.dispatchEvent(aurelia_pal_1.DOM.createCustomEvent("blur", {
                detail: {
                    value: this._element
                },
                bubbles: true
            }));
        };
        TimeRangePicker.prototype.updateDuration = function () {
            if (this._timeFormatRegEx.test(this.startTime) && this._timeFormatRegEx.test(this.endTime)) {
                this.durationInMinutes = this.getDuration(this.value);
            }
            else {
                this.durationInMinutes = 0;
            }
        };
        TimeRangePicker.prototype.getTime = function (time) {
            if (time) {
                var hours = parseInt(time.split(":")[0], 10);
                var minutes = parseInt(time.split(":")[1], 10);
                var currentDate = moment();
                currentDate.set("hours", hours);
                currentDate.set("minutes", minutes);
                return currentDate.toDate();
            }
            else {
                return null;
            }
        };
        TimeRangePicker.prototype.isStartDateGreaterThanEnd = function (startTime, endTime) {
            var flag = false;
            var start = this.getTime(startTime);
            var end = this.getTime(endTime);
            if (start && end) {
                flag = start.getTime() > end.getTime();
            }
            return flag;
        };
        TimeRangePicker.prototype.getDuration = function (time) {
            if (time) {
                var duration = void 0;
                var logStartTime = null;
                var workEndTime = null;
                if (time.startTime) {
                    logStartTime = this.getTime(time.startTime);
                }
                if (time.endTime) {
                    workEndTime = this.getTime(time.endTime);
                }
                if (logStartTime && workEndTime) {
                    duration = moment(workEndTime).diff(moment(logStartTime), "minutes");
                }
                else if (logStartTime) {
                    duration = moment(new Date()).diff(moment(logStartTime), "minutes");
                }
                // convert to nearst of minutes interval
                if (duration && duration > 0) {
                    return Math.ceil(duration / this.intervalInMinutes) * this.intervalInMinutes;
                }
                else if (duration === 0) {
                    return 0;
                }
                else {
                    return this.intervalInMinutes;
                }
            }
            else {
                return null;
            }
        };
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
            __metadata("design:type", timeRange_1.TimeRange)
        ], TimeRangePicker.prototype, "value", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], TimeRangePicker.prototype, "startTimeDisabled", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], TimeRangePicker.prototype, "endTimeDisabled", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], TimeRangePicker.prototype, "readOnly", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TimeRangePicker.prototype, "startTimeLabel", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TimeRangePicker.prototype, "endTimeLabel", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Number)
        ], TimeRangePicker.prototype, "intervalInMinutes", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TimeRangePicker.prototype, "buttonContainerClasses", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TimeRangePicker.prototype, "buttonMinusClasses", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TimeRangePicker.prototype, "buttonPlusClasses", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], TimeRangePicker.prototype, "hideKeyboardOnEnter", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
            __metadata("design:type", Number)
        ], TimeRangePicker.prototype, "durationInMinutes", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TimeRangePicker.prototype, "controlContainerClasses", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
            __metadata("design:type", String)
        ], TimeRangePicker.prototype, "startTime", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
            __metadata("design:type", String)
        ], TimeRangePicker.prototype, "endTime", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], TimeRangePicker.prototype, "eachSide", void 0);
        TimeRangePicker = __decorate([
            aurelia_templating_1.customElement("time-range-picker"),
            aurelia_dependency_injection_1.inject(Element),
            __metadata("design:paramtypes", [Element])
        ], TimeRangePicker);
        return TimeRangePicker;
    }());
    exports.TimeRangePicker = TimeRangePicker;
});

//# sourceMappingURL=timeRangePicker.js.map
