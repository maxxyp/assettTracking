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
define(["require", "exports", "aurelia-templating", "aurelia-binding", "moment", "../../core/threading", "aurelia-dependency-injection", "../../core/stringHelper", "aurelia-pal"], function (require, exports, aurelia_templating_1, aurelia_binding_1, moment, threading_1, aurelia_dependency_injection_1, stringHelper_1, aurelia_pal_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TimePicker = /** @class */ (function () {
        function TimePicker(element) {
            this._timeFormatRegEx = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            this._element = element;
            this._startStopTimer = -1;
        }
        TimePicker.prototype.attached = function () {
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
        TimePicker.prototype.detached = function () {
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
        TimePicker.prototype.add = function () {
            if (this.isValidTime() && this.intervalInMinutes) {
                var time = this.getTime(this.value);
                var incrementBy = Math.ceil((time.minute() + 1) / this.intervalInMinutes) * this.intervalInMinutes - time.minute();
                time.add(incrementBy, "minutes");
                this.value = time.format("HH:mm");
            }
        };
        TimePicker.prototype.subtract = function () {
            if (this.isValidTime() && this.intervalInMinutes) {
                var time = this.getTime(this.value);
                var incrementBy = Math.floor((time.minute() - 1) / this.intervalInMinutes) * this.intervalInMinutes - time.minute();
                time.add(incrementBy, "minutes");
                this.value = time.format("HH:mm");
            }
        };
        TimePicker.prototype.blur = function () {
            var _this = this;
            this._hasFocus = false;
            if (this.value) {
                if ((this.value.length === 4) && (this.value.indexOf(":") === -1)) {
                    // there are 4 chars and no colon
                    this.value = this.value.substr(0, 2) + ":" + this.value.substr(2);
                }
                else if ((this.value.length === 3) && (this.value.indexOf(":") === -1)) {
                    this.value = this.value.substr(0, 1) + ":" + this.value.substr(1);
                }
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
        TimePicker.prototype.focus = function () {
            this._hasFocus = true;
        };
        TimePicker.prototype.start = function (e) {
            var _this = this;
            if (e.srcElement.className.indexOf(this.buttonPlusClasses) > -1 && (e.type === "mousedown" || e.type === "touchstart") && this._startStopTimer === -1) {
                this._startStopTimer = threading_1.Threading.startTimer(function () { return _this.add(); }, 200);
            }
            else if (e.srcElement.className.indexOf(this.buttonMinusClasses) > -1 && (e.type === "mousedown" || e.type === "touchstart") && this._startStopTimer === -1) {
                this._startStopTimer = threading_1.Threading.startTimer(function () { return _this.subtract(); }, 200);
            }
        };
        TimePicker.prototype.stop = function (e) {
            threading_1.Threading.stopTimer(this._startStopTimer);
            this._startStopTimer = -1;
        };
        TimePicker.prototype.valueChanged = function () {
            var _this = this;
            threading_1.Threading.nextCycle(function () {
                /* does it have a colon */
                var colonIndex = _this.value.indexOf(":");
                if (colonIndex === -1) {
                    if (_this.value.length > 4) {
                        /* no colon max length is 4 */
                        _this.value = _this.value.substr(0, 4);
                    }
                    else if (_this.value.length < 4) {
                        /* no colon, not long enough, pad right with zeros */
                        _this.value = stringHelper_1.StringHelper.padRight(_this.value, "0", 4);
                    }
                    /* add a colon */
                    _this.value = _this.value.slice(0, 2) + ":" + _this.value.slice(2);
                }
                else {
                    /* has a colon split it into parts */
                    var parts = _this.value.split(":");
                    if (parts.length >= 2) {
                        if (parts[0].length > 2) {
                            parts[0] = parts[0].substring(0, 2);
                        }
                        else if (parts.length < 2) {
                            parts[0] = stringHelper_1.StringHelper.padLeft(parts[0], "0", 2);
                        }
                        if (parts[1].length > 2) {
                            parts[1] = parts[1].substring(0, 2);
                        }
                        else if (parts.length < 2) {
                            parts[1] = stringHelper_1.StringHelper.padRight(parts[1], "0", 2);
                        }
                        /* add a colon */
                        _this.value = parts[0] + ":" + parts[1];
                    }
                }
                /* still not valid so clear it out */
                if (!_this.isValidTime()) {
                    _this.value = "";
                }
            });
        };
        TimePicker.prototype.isValidTime = function () {
            return this._timeFormatRegEx.test(this.value);
        };
        TimePicker.prototype.getTime = function (time) {
            var hours = parseInt(time.split(":")[0], 10);
            var minutes = parseInt(time.split(":")[1], 10);
            var currentDate = moment();
            currentDate.set("hours", hours);
            currentDate.set("minutes", minutes);
            return currentDate;
        };
        TimePicker.prototype.populateDefaultTime = function () {
            if (!this.value) {
                var currentDate = moment();
                this.value = currentDate.format("HH:mm");
            }
        };
        TimePicker.prototype.populateDefault = function () {
            if (!this.intervalInMinutes) {
                this.intervalInMinutes = 5;
            }
            else if (this.intervalInMinutes === 0) {
                this.intervalInMinutes = 1;
            }
            this.populateDefaultTime();
        };
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
            __metadata("design:type", String)
        ], TimePicker.prototype, "value", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TimePicker.prototype, "classes", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TimePicker.prototype, "controlContainerClasses", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TimePicker.prototype, "buttonContainerClasses", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TimePicker.prototype, "buttonMinusClasses", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TimePicker.prototype, "buttonPlusClasses", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], TimePicker.prototype, "hideKeyboardOnEnter", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], TimePicker.prototype, "disabled", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], TimePicker.prototype, "readOnly", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], TimePicker.prototype, "cancelDefaultSubmit", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Number)
        ], TimePicker.prototype, "intervalInMinutes", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], TimePicker.prototype, "eachSide", void 0);
        TimePicker = __decorate([
            aurelia_templating_1.customElement("time-picker"),
            aurelia_dependency_injection_1.inject(Element),
            __metadata("design:paramtypes", [Element])
        ], TimePicker);
        return TimePicker;
    }());
    exports.TimePicker = TimePicker;
});

//# sourceMappingURL=timePicker.js.map
