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
define(["require", "exports", "aurelia-templating", "aurelia-binding", "moment", "aurelia-dependency-injection", "aurelia-pal", "../../../hema/core/timeHelper", "../../../common/core/threading"], function (require, exports, aurelia_templating_1, aurelia_binding_1, moment, aurelia_dependency_injection_1, aurelia_pal_1, timeHelper_1, threading_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TimePicker2 = /** @class */ (function () {
        function TimePicker2(element) {
            this._timeFormatRegEx = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            this._element = element;
            this._startStopTimer = -1;
        }
        TimePicker2.prototype.attached = function () {
            var _this = this;
            this._element.addEventListener("mousedown", function (e) {
                _this.start(e);
            });
            this._element.addEventListener("mouseup", function (e) {
                _this.stop(e);
            });
            this._element.addEventListener("touchstart", function (e) {
                _this.start(e);
            });
            this._element.addEventListener("touchend", function (e) {
                _this.stop(e);
            });
            this._element.addEventListener("mouseout", function (e) {
                _this.stop(e);
            });
            if (!this.eachSide) {
                this.eachSide = false;
            }
            this.populateDefault();
        };
        TimePicker2.prototype.detached = function () {
            var _this = this;
            this._element.removeEventListener("mousedown", function (e) {
                _this.start(e);
            });
            this._element.removeEventListener("mouseup", function (e) {
                _this.stop(e);
            });
            this._element.removeEventListener("touchstart", function (e) {
                _this.start(e);
            });
            this._element.removeEventListener("touchend", function (e) {
                _this.stop(e);
            });
            this._element.removeEventListener("mouseout", function (e) {
                _this.stop(e);
            });
        };
        TimePicker2.prototype.add = function () {
            if (this.isValidTime() && this.intervalInMinutes) {
                var time = this.getTime(this.value);
                var incrementBy = Math.ceil((time.minute() + 1) / this.intervalInMinutes) * this.intervalInMinutes - time.minute();
                time.add(incrementBy, "minutes");
                this.value = time.format("HH:mm");
            }
        };
        TimePicker2.prototype.subtract = function () {
            if (this.isValidTime() && this.intervalInMinutes) {
                var time = this.getTime(this.value);
                var incrementBy = Math.floor((time.minute() - 1) / this.intervalInMinutes) * this.intervalInMinutes - time.minute();
                time.add(incrementBy, "minutes");
                this.value = time.format("HH:mm");
            }
        };
        TimePicker2.prototype.blur = function () {
            var _this = this;
            this._hasFocus = false;
            var value = timeHelper_1.TimeHelper.getTimeString(this.value);
            if (value && value !== this._lastKnownValue) {
                this._lastKnownValue = value;
                this.value = value;
            }
            threading_1.Threading.nextCycle(function () {
                if (!_this._hasFocus) {
                    _this._element.dispatchEvent(aurelia_pal_1.DOM.createCustomEvent("blur", {
                        detail: {
                            value: _this._element
                        },
                        bubbles: true
                    }));
                }
            });
        };
        TimePicker2.prototype.focus = function () {
            this._hasFocus = true;
        };
        TimePicker2.prototype.start = function (e) {
            var _this = this;
            if (e.srcElement.className.indexOf(this.buttonPlusClasses) > -1 && (e.type === "mousedown" || e.type === "touchstart") && this._startStopTimer === -1) {
                this._startStopTimer = threading_1.Threading.startTimer(function () { return _this.add(); }, 200);
            }
            else if (e.srcElement.className.indexOf(this.buttonMinusClasses) > -1 && (e.type === "mousedown" || e.type === "touchstart") && this._startStopTimer === -1) {
                this._startStopTimer = threading_1.Threading.startTimer(function () { return _this.subtract(); }, 200);
            }
        };
        TimePicker2.prototype.stop = function (e) {
            threading_1.Threading.stopTimer(this._startStopTimer);
            this._startStopTimer = -1;
        };
        TimePicker2.prototype.valueChanged = function (newValue) {
            var _this = this;
            threading_1.Threading.nextCycle(function () {
                var value = timeHelper_1.TimeHelper.getTimeString(newValue);
                if (value === _this._lastKnownValue) {
                    return;
                }
                if (!value) {
                    _this.value = _this._lastKnownValue;
                    return;
                }
                _this._lastKnownValue = value;
            });
        };
        TimePicker2.prototype.isValidTime = function () {
            return this._timeFormatRegEx.test(this.value);
        };
        TimePicker2.prototype.getTime = function (time) {
            var hours = parseInt(time.split(":")[0], 10);
            var minutes = parseInt(time.split(":")[1], 10);
            var currentDate = moment();
            currentDate.set("hours", hours);
            currentDate.set("minutes", minutes);
            return currentDate;
        };
        TimePicker2.prototype.populateDefault = function () {
            if (!this.intervalInMinutes) {
                this.intervalInMinutes = 1;
            }
            else if (this.intervalInMinutes === 0) {
                this.intervalInMinutes = 1;
            }
        };
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
            __metadata("design:type", String)
        ], TimePicker2.prototype, "value", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TimePicker2.prototype, "classes", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TimePicker2.prototype, "controlContainerClasses", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TimePicker2.prototype, "buttonContainerClasses", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TimePicker2.prototype, "buttonMinusClasses", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TimePicker2.prototype, "buttonPlusClasses", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], TimePicker2.prototype, "hideKeyboardOnEnter", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], TimePicker2.prototype, "disabled", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], TimePicker2.prototype, "readOnly", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], TimePicker2.prototype, "cancelDefaultSubmit", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Number)
        ], TimePicker2.prototype, "intervalInMinutes", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], TimePicker2.prototype, "eachSide", void 0);
        TimePicker2 = __decorate([
            aurelia_templating_1.customElement("time-picker2"),
            aurelia_dependency_injection_1.inject(Element),
            __metadata("design:paramtypes", [Element])
        ], TimePicker2);
        return TimePicker2;
    }());
    exports.TimePicker2 = TimePicker2;
});

//# sourceMappingURL=timePicker2.js.map
