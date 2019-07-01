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
define(["require", "exports", "aurelia-framework", "aurelia-framework"], function (require, exports, aurelia_framework_1, aurelia_framework_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ProgressBar = /** @class */ (function () {
        function ProgressBar() {
            this.value = 0;
            this.minValue = 0;
            this.maxValue = 0;
        }
        ProgressBar.prototype.attached = function () {
            this.updateDisplay();
        };
        ProgressBar.prototype.valueChanged = function (newVal, oldVal) {
            if (newVal !== oldVal) {
                this.updateDisplay();
            }
        };
        ProgressBar.prototype.maxValueChanged = function (newVal, oldVal) {
            if (newVal !== oldVal) {
                this.updateDisplay();
            }
        };
        ProgressBar.prototype.minValueChanged = function (newVal, oldVal) {
            if (newVal !== oldVal) {
                this.updateDisplay();
            }
        };
        ProgressBar.prototype.updateDisplay = function () {
            if (this.value < this.minValue) {
                this.value = this.minValue;
            }
            if (this.value > this.maxValue) {
                this.value = this.maxValue;
            }
            var range = (this.maxValue + 1) - this.minValue;
            if (range > 0) {
                this.percent = (((this.value - this.minValue + 1) / range) * 100) + "%";
            }
            else {
                this.percent = "0%";
            }
        };
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.oneWay }),
            __metadata("design:type", Number)
        ], ProgressBar.prototype, "maxValue", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.oneWay }),
            __metadata("design:type", Number)
        ], ProgressBar.prototype, "minValue", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.oneWay }),
            __metadata("design:type", Number)
        ], ProgressBar.prototype, "value", void 0);
        ProgressBar = __decorate([
            aurelia_framework_1.customElement("progress-bar"),
            __metadata("design:paramtypes", [])
        ], ProgressBar);
        return ProgressBar;
    }());
    exports.ProgressBar = ProgressBar;
});

//# sourceMappingURL=progressBar.js.map
