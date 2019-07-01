var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-templating", "aurelia-binding", "aurelia-dependency-injection", "aurelia-pal", "../../core/threading", "../../core/stringHelper"], function (require, exports, aurelia_templating_1, aurelia_binding_1, aurelia_dependency_injection_1, aurelia_pal_1, threading_1, stringHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NumberBox = /** @class */ (function () {
        function NumberBox(element) {
            this.placeholder = "";
            this.defaultPlaceholder = "";
            this._element = element;
            this.maxLength = 15;
            this.resetValueForValidation = false;
        }
        NumberBox.prototype.attached = function () {
            this.updatePlaceholder();
        };
        NumberBox.prototype.placeholderChanged = function () {
            this.updatePlaceholder();
        };
        NumberBox.prototype.decimalPlacesChanged = function () {
            this.updatePlaceholder();
        };
        // warning: if you bind to this you are forced to use a (finite) number type or undefined only
        // bind your model to this
        NumberBox.prototype.valueChanged = function (newValue, oldValue) {
            var _this = this;
            if (typeof this.value === "number" && isFinite(this.value)) {
                if (newValue > this.maxValue) {
                    if (!this.resetValueForValidation) {
                        threading_1.Threading.nextCycle(function () {
                            _this.value = oldValue;
                        });
                    }
                }
                else {
                    if (this.decimalPlaces) {
                        var actualDecimalPlaces = this.calculatePlaceValues(newValue);
                        if (actualDecimalPlaces > this.decimalPlaces) {
                            threading_1.Threading.nextCycle(function () {
                                _this.value = oldValue; // don't use old value here if it's not valid
                            });
                        }
                        if (oldValue === undefined && !this.resetValueForValidation) {
                            var inptVal = this.getFormattedInputValue(newValue.toString(), newValue, actualDecimalPlaces, this.decimalPlaces);
                            if (inptVal !== undefined) {
                                this.inputValue = inptVal;
                            }
                        }
                    }
                }
                if (this.value !== parseFloat(this.inputValue)) {
                    if (this.decimalPlaces) {
                        var actualDecimalPlaces = this.calculatePlaceValues(newValue);
                        var inptVal = this.getFormattedInputValue(newValue.toString(), newValue, actualDecimalPlaces, this.decimalPlaces);
                        if (inptVal !== undefined) {
                            this.inputValue = inptVal;
                        }
                        else {
                            this.inputValue = this.value.toString();
                        }
                    }
                    else {
                        this.inputValue = this.value.toString();
                    }
                }
            }
            else {
                if (this.inputValue !== "") {
                    this.inputValue = "";
                }
            }
        };
        // to be used internally, never bind to this
        NumberBox.prototype.inputValueChanged = function (newValue, oldValue) {
            var parsedValue = parseFloat(newValue);
            // use undefined rather than NaN
            parsedValue = isNaN(parsedValue) ? undefined : parsedValue;
            if (parsedValue !== this.value) {
                this.value = parsedValue;
            }
        };
        NumberBox.prototype.blur = function () {
            this.prefixDecimalPlaceWithZero();
            this._element.dispatchEvent(aurelia_pal_1.DOM.createCustomEvent("blur", {
                detail: {
                    value: this._element
                },
                bubbles: true
            }));
        };
        NumberBox.prototype.calculatePlaceValues = function (newValue) {
            var value = newValue.toString();
            var usesScientificNotation = value.indexOf("e") !== -1;
            var actualDecimalPlaces = 0;
            if (usesScientificNotation) {
                var exponent = parseFloat(value.split("e").pop());
                if (exponent !== undefined && exponent < 0) {
                    actualDecimalPlaces = Math.abs(exponent);
                }
            }
            else {
                var decimalPointIndex = value.indexOf(".");
                if (decimalPointIndex !== -1) {
                    actualDecimalPlaces = value.length - decimalPointIndex - 1;
                }
            }
            return actualDecimalPlaces;
        };
        NumberBox.prototype.prefixDecimalPlaceWithZero = function () {
            if (this.value !== null && this.value !== undefined) {
                if (this.decimalPlaces) {
                    var actualDecimalPlaces = this.calculatePlaceValues(this.value);
                    var inptVal = this.getFormattedInputValue(this.inputValue, this.value, actualDecimalPlaces, this.decimalPlaces);
                    if (inptVal === undefined) {
                        this.inputValue = this.value.toString(10);
                    }
                    else {
                        this.inputValue = inptVal;
                    }
                }
                else {
                    this.inputValue = this.value.toString(10);
                }
            }
            else if (this.inputValue !== null && this.inputValue !== undefined) {
                if (this.inputValue === ".") {
                    if (this.decimalPlaces !== null && this.decimalPlaces !== undefined) {
                        this.inputValue = "0." + stringHelper_1.StringHelper.padRight("", "0", this.decimalPlaces);
                    }
                    else {
                        this.inputValue = "0";
                    }
                    this.value = parseFloat(this.inputValue);
                }
            }
        };
        NumberBox.prototype.updatePlaceholder = function () {
            if (!this.placeholder && this.decimalPlaces) {
                this.defaultPlaceholder = "0." + stringHelper_1.StringHelper.padRight("", "0", this.decimalPlaces);
            }
        };
        NumberBox.prototype.getFormattedInputValue = function (inputValue, value, actualDecimalPlaces, decimalPlaces) {
            var inputVal = undefined;
            if (inputValue !== undefined && inputValue !== null) {
                if (actualDecimalPlaces < decimalPlaces) {
                    if (decimalPlaces) {
                        // postfix zeros to inputValue                        
                        if (inputValue.indexOf(".") !== -1) {
                            var decimalPlcs = this.calculatePlaceValues(parseFloat(inputValue));
                            if (decimalPlcs > 0) {
                                inputVal = parseFloat(inputValue) + stringHelper_1.StringHelper.padRight("", "0", decimalPlaces - actualDecimalPlaces);
                            }
                            else {
                                inputVal = parseFloat(inputValue) + "." + stringHelper_1.StringHelper.padRight("", "0", decimalPlaces);
                            }
                        }
                        else {
                            inputVal = parseFloat(inputValue) + "." + stringHelper_1.StringHelper.padRight("", "0", decimalPlaces);
                        }
                    }
                    else {
                        inputVal = inputValue;
                    }
                }
            }
            return inputVal;
        };
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
            __metadata("design:type", Number)
        ], NumberBox.prototype, "value", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], NumberBox.prototype, "classes", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], NumberBox.prototype, "disabled", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], NumberBox.prototype, "readonly", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], NumberBox.prototype, "floatAllowed", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], NumberBox.prototype, "placeholder", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Number)
        ], NumberBox.prototype, "maxLength", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Number)
        ], NumberBox.prototype, "maxValue", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Number)
        ], NumberBox.prototype, "wholePlaces", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Number)
        ], NumberBox.prototype, "decimalPlaces", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], NumberBox.prototype, "hideKeyboardOnEnter", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], NumberBox.prototype, "cancelDefaultSubmit", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], NumberBox.prototype, "resetValueForValidation", void 0);
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", String)
        ], NumberBox.prototype, "inputValue", void 0);
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", String)
        ], NumberBox.prototype, "defaultPlaceholder", void 0);
        NumberBox = __decorate([
            aurelia_templating_1.customElement("number-box"),
            aurelia_dependency_injection_1.inject(Element),
            __metadata("design:paramtypes", [Element])
        ], NumberBox);
        return NumberBox;
    }());
    exports.NumberBox = NumberBox;
});

//# sourceMappingURL=numberBox.js.map
