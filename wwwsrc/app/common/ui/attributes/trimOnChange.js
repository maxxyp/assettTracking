var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-templating", "aurelia-dependency-injection"], function (require, exports, aurelia_templating_1, aurelia_dependency_injection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TrimOnChange = /** @class */ (function () {
        function TrimOnChange(element) {
            var _this = this;
            this._element = element;
            this._inputEvent = function (event) {
                _this._element.value = _this._element.value.trim();
            };
        }
        TrimOnChange.prototype.attached = function () {
            this._element.addEventListener("input", this._inputEvent);
        };
        TrimOnChange.prototype.detached = function () {
            this._element.removeEventListener("input", this._inputEvent);
        };
        TrimOnChange = __decorate([
            aurelia_templating_1.customAttribute("trim-on-change"),
            aurelia_dependency_injection_1.inject(Element),
            __metadata("design:paramtypes", [HTMLInputElement])
        ], TrimOnChange);
        return TrimOnChange;
    }());
    exports.TrimOnChange = TrimOnChange;
});

//# sourceMappingURL=trimOnChange.js.map
