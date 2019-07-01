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
define(["require", "exports", "aurelia-templating", "aurelia-dependency-injection", "./attributeBase"], function (require, exports, aurelia_templating_1, aurelia_dependency_injection_1, attributeBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TimeOnly = /** @class */ (function (_super) {
        __extends(TimeOnly, _super);
        function TimeOnly(element) {
            return _super.call(this, element) || this;
        }
        TimeOnly.prototype.clipboardIsValid = function (event) {
            var clipboardData = event.clipboardData.getData("Text");
            return /^\d+$/.test(clipboardData) || (/^[0-9]*[:][0-9]+$/.test(clipboardData));
        };
        TimeOnly.prototype.eventKeyIsValid = function (event) {
            var keyType = this.defineKeyType(event);
            var isAllowed = keyType === attributeBase_1.AttributeBase.CONTROL || keyType === attributeBase_1.AttributeBase.NUMERICAL;
            if (!isAllowed) {
                /* Colon */
                if (event.which === 16 || event.which === 186) {
                    isAllowed = true;
                }
            }
            if (isAllowed && keyType === attributeBase_1.AttributeBase.NUMERICAL && this.exceedsMaxLength(5, 1)) {
                isAllowed = false;
            }
            return isAllowed;
        };
        TimeOnly = __decorate([
            aurelia_templating_1.customAttribute("time-only"),
            aurelia_dependency_injection_1.inject(Element),
            __metadata("design:paramtypes", [HTMLInputElement])
        ], TimeOnly);
        return TimeOnly;
    }(attributeBase_1.AttributeBase));
    exports.TimeOnly = TimeOnly;
});

//# sourceMappingURL=timeOnly.js.map
