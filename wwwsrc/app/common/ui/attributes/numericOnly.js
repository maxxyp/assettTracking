/// <reference path="../../../../typings/app.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-templating", "aurelia-dependency-injection", "aurelia-templating", "./attributeBase"], function (require, exports, aurelia_templating_1, aurelia_dependency_injection_1, aurelia_templating_2, attributeBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NumericOnly = /** @class */ (function (_super) {
        __extends(NumericOnly, _super);
        function NumericOnly(element) {
            var _this = _super.call(this, element) || this;
            _this.allowFloat = false;
            return _this;
        }
        NumericOnly.prototype.clipboardIsValid = function (event) {
            var clipboardData = event.clipboardData.getData("Text");
            var isAllowed = /^\d+$/.test(clipboardData) || (this.allowFloat && /^[0-9]*[.][0-9]+$/.test(clipboardData));
            if (isAllowed) {
                var valueMask = this.valueMaskFromClipboardData(clipboardData);
                isAllowed = this.inputLengthValid(clipboardData.length, valueMask);
            }
            return isAllowed;
        };
        NumericOnly.prototype.eventKeyIsValid = function (event) {
            var keyType = this.defineKeyType(event);
            var isAllowed = keyType === attributeBase_1.AttributeBase.CONTROL || keyType === attributeBase_1.AttributeBase.NUMERICAL;
            /* One dot only for float, keyboard dot and numpad dot */
            if (this.allowFloat && keyType === attributeBase_1.AttributeBase.DECIMALMARK && this._element.value.indexOf(".") < 0) {
                isAllowed = true;
            }
            if (isAllowed && (keyType === attributeBase_1.AttributeBase.NUMERICAL || keyType === attributeBase_1.AttributeBase.DECIMALMARK)) {
                var valueMask = this.valueMaskFromKeyType(keyType);
                isAllowed = this.inputLengthValid(1, valueMask);
            }
            return isAllowed;
        };
        NumericOnly.prototype.inputLengthValid = function (addLength, valueMask) {
            return !(this.exceedsMaxLength(this.maxLength, addLength) ||
                this.exceedsMaxDecimalPlaces(this.decimalPlaces, valueMask) ||
                this.exceedsMaxWholePlaces(this.wholePlaces, valueMask));
        };
        __decorate([
            aurelia_templating_2.bindable,
            __metadata("design:type", Boolean)
        ], NumericOnly.prototype, "allowFloat", void 0);
        __decorate([
            aurelia_templating_2.bindable,
            __metadata("design:type", Number)
        ], NumericOnly.prototype, "maxLength", void 0);
        __decorate([
            aurelia_templating_2.bindable,
            __metadata("design:type", Number)
        ], NumericOnly.prototype, "decimalPlaces", void 0);
        __decorate([
            aurelia_templating_2.bindable,
            __metadata("design:type", Number)
        ], NumericOnly.prototype, "wholePlaces", void 0);
        NumericOnly = __decorate([
            aurelia_templating_1.customAttribute("numeric-only"),
            aurelia_dependency_injection_1.inject(Element),
            __metadata("design:paramtypes", [HTMLInputElement])
        ], NumericOnly);
        return NumericOnly;
    }(attributeBase_1.AttributeBase));
    exports.NumericOnly = NumericOnly;
});

//# sourceMappingURL=numericOnly.js.map
