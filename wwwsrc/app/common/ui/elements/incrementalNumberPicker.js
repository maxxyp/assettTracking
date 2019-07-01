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
define(["require", "exports", "aurelia-templating", "aurelia-binding", "aurelia-pal", "aurelia-dependency-injection", "../../../common/core/threading", "../../../common/core/numberHelper"], function (require, exports, aurelia_templating_1, aurelia_binding_1, aurelia_pal_1, aurelia_dependency_injection_1, threading_1, numberHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IncrementalNumberPicker = /** @class */ (function () {
        function IncrementalNumberPicker(element) {
            this._element = element;
        }
        IncrementalNumberPicker.prototype.attached = function () {
            if (!this.eachSide) {
                this.eachSide = false;
            }
            this._oldValue = this.minValue;
        };
        IncrementalNumberPicker.prototype.valueChanged = function (newValue, oldValue) {
            var _this = this;
            if (oldValue !== undefined && oldValue !== null) {
                this._oldValue = oldValue;
            }
            if (this.isAboveMax(newValue) || this.isBelowMin(newValue)) {
                threading_1.Threading.nextCycle(function () {
                    _this.value = oldValue;
                });
            }
        };
        IncrementalNumberPicker.prototype.add = function () {
            this.ensureIncrementHasValue();
            if (!numberHelper_1.NumberHelper.isNumber(this.value)) {
                /* when clicking add on an empty value, initialise to:
                     basementValue if basementValue is non-zero
                     otherwise basementValue plus incrementValue
                    (in other words, it looks odd if "add"" intialises an empty value to zero)
                */
                var basementValue = (this.minValue || 0);
                this.value = basementValue ? basementValue : basementValue + this.incrementStep;
            }
            else {
                if (!this.isAboveMax(this.value + this.incrementStep)) {
                    this.value = this.value + this.incrementStep;
                }
            }
            this.dispachEvent("add");
        };
        IncrementalNumberPicker.prototype.subtract = function () {
            this.ensureIncrementHasValue();
            if (!numberHelper_1.NumberHelper.isNumber(this.value)) {
                // when clicking subtract on an empty value, initialise to basement value
                this.value = this.minValue || 0;
            }
            else {
                if (!this.isBelowMin(this.value - this.incrementStep)) {
                    this.value = this.value - this.incrementStep;
                }
            }
            this.dispachEvent("subtract");
        };
        IncrementalNumberPicker.prototype.updated = function () {
            this.dispachEvent("updated");
        };
        IncrementalNumberPicker.prototype.blur = function () {
            var _this = this;
            this._hasFocus = false;
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
            if (this.value === undefined || this.value === null) {
                if (this._oldValue !== undefined && this._oldValue !== null) {
                    this.value = this._oldValue;
                }
                else {
                    this.value = this.minValue;
                }
            }
            this.updated();
        };
        IncrementalNumberPicker.prototype.focus = function () {
            this._hasFocus = true;
        };
        IncrementalNumberPicker.prototype.dispachEvent = function (eventName) {
            var _this = this;
            threading_1.Threading.nextCycle(function () {
                var myevent = new Event(eventName);
                if (_this._element) {
                    _this._element.dispatchEvent(myevent);
                }
            });
        };
        IncrementalNumberPicker.prototype.ensureIncrementHasValue = function () {
            if (!numberHelper_1.NumberHelper.isNumber(this.incrementStep)) {
                this.incrementStep = 1;
            }
        };
        IncrementalNumberPicker.prototype.isAboveMax = function (value) {
            return numberHelper_1.NumberHelper.isNumber(value) && numberHelper_1.NumberHelper.isNumber(this.maxValue)
                && (value > this.maxValue);
        };
        IncrementalNumberPicker.prototype.isBelowMin = function (value) {
            return numberHelper_1.NumberHelper.isNumber(value) && numberHelper_1.NumberHelper.isNumber(this.minValue)
                && (value < this.minValue);
        };
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
            __metadata("design:type", Number)
        ], IncrementalNumberPicker.prototype, "value", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], IncrementalNumberPicker.prototype, "hideKeyboardOnEnter", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], IncrementalNumberPicker.prototype, "disabled", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], IncrementalNumberPicker.prototype, "readOnly", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], IncrementalNumberPicker.prototype, "cancelDefaultSubmit", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Number)
        ], IncrementalNumberPicker.prototype, "incrementStep", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Number)
        ], IncrementalNumberPicker.prototype, "minValue", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Number)
        ], IncrementalNumberPicker.prototype, "maxValue", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], IncrementalNumberPicker.prototype, "eachSide", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], IncrementalNumberPicker.prototype, "buttonMinusClasses", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], IncrementalNumberPicker.prototype, "buttonPlusClasses", void 0);
        IncrementalNumberPicker = __decorate([
            aurelia_templating_1.customElement("incremental-number-picker"),
            aurelia_dependency_injection_1.inject(Element),
            __metadata("design:paramtypes", [Element])
        ], IncrementalNumberPicker);
        return IncrementalNumberPicker;
    }());
    exports.IncrementalNumberPicker = IncrementalNumberPicker;
});

//# sourceMappingURL=incrementalNumberPicker.js.map
