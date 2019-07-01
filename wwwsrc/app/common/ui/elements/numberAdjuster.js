var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-templating", "aurelia-dependency-injection", "aurelia-binding", "../../core/stringHelper"], function (require, exports, aurelia_templating_1, aurelia_dependency_injection_1, aurelia_binding_1, stringHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NumberAdjuster = /** @class */ (function () {
        function NumberAdjuster() {
        }
        NumberAdjuster.prototype.increment = function () {
            if (this.disableMax) {
                return;
            }
            if (this.disabled) {
                return;
            }
            if (this.value < this.maxValue) {
                this.value++;
            }
        };
        NumberAdjuster.prototype.decrement = function () {
            if (this.disableMin) {
                return;
            }
            if (this.disabled) {
                return;
            }
            if (this.value) {
                this.value--;
            }
        };
        Object.defineProperty(NumberAdjuster.prototype, "disableMax", {
            get: function () {
                if (this.disabled) {
                    return true;
                }
                return this.value === this.maxValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NumberAdjuster.prototype, "disableMin", {
            get: function () {
                if (this.disabled) {
                    return true;
                }
                if (this.value === 0) {
                    return true;
                }
                return this.value === this.minValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NumberAdjuster.prototype, "displayValue", {
            get: function () {
                return this.value + " " + (this.showMax ? " of  " + this.maxValue : "");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NumberAdjuster.prototype, "missingItemLabel", {
            get: function () {
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
                var missingQty = this.maxValue - this.value;
                return "Missing " + stringHelper_1.StringHelper.pluralise(missingQty, "item");
            },
            enumerable: true,
            configurable: true
        });
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
            __metadata("design:type", Number)
        ], NumberAdjuster.prototype, "value", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
            __metadata("design:type", Number)
        ], NumberAdjuster.prototype, "maxValue", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
            __metadata("design:type", Number)
        ], NumberAdjuster.prototype, "minValue", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneTime }),
            __metadata("design:type", Boolean)
        ], NumberAdjuster.prototype, "showMax", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneTime }),
            __metadata("design:type", Boolean)
        ], NumberAdjuster.prototype, "showMissingItemLabel", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneTime }),
            __metadata("design:type", Boolean)
        ], NumberAdjuster.prototype, "disabled", void 0);
        __decorate([
            aurelia_binding_1.computedFrom("value", "maxValue", "showMax"),
            __metadata("design:type", Boolean),
            __metadata("design:paramtypes", [])
        ], NumberAdjuster.prototype, "disableMax", null);
        __decorate([
            aurelia_binding_1.computedFrom("value", "minValue", "showMax"),
            __metadata("design:type", Boolean),
            __metadata("design:paramtypes", [])
        ], NumberAdjuster.prototype, "disableMin", null);
        __decorate([
            aurelia_binding_1.computedFrom("value", "maxValue", "showMax"),
            __metadata("design:type", String),
            __metadata("design:paramtypes", [])
        ], NumberAdjuster.prototype, "displayValue", null);
        __decorate([
            aurelia_binding_1.computedFrom("value", "maxValue", "minValue"),
            __metadata("design:type", String),
            __metadata("design:paramtypes", [])
        ], NumberAdjuster.prototype, "missingItemLabel", null);
        NumberAdjuster = __decorate([
            aurelia_templating_1.customElement("number-adjuster"),
            aurelia_dependency_injection_1.inject(Element)
        ], NumberAdjuster);
        return NumberAdjuster;
    }());
    exports.NumberAdjuster = NumberAdjuster;
});

//# sourceMappingURL=numberAdjuster.js.map
