var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "../../core/platformHelper", "aurelia-templating", "aurelia-dependency-injection"], function (require, exports, platformHelper_1, aurelia_templating_1, aurelia_dependency_injection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HideKeyboardOnEnter = /** @class */ (function () {
        function HideKeyboardOnEnter(element) {
            var _this = this;
            this._element = element;
            this._keyDown = function (event) {
                if (event.keyCode === 13) {
                    if (platformHelper_1.PlatformHelper.getPlatform() === "wua") {
                        Windows.UI.ViewManagement.InputPane.getForCurrentView().tryHide();
                    }
                    else {
                        _this._element.blur();
                    }
                }
            };
        }
        HideKeyboardOnEnter.prototype.attached = function () {
            this._element.addEventListener("keydown", this._keyDown);
        };
        HideKeyboardOnEnter.prototype.detached = function () {
            this._element.removeEventListener("keydown", this._keyDown);
        };
        HideKeyboardOnEnter = __decorate([
            aurelia_templating_1.customAttribute("hide-keyboard-on-enter"),
            aurelia_dependency_injection_1.inject(Element),
            __metadata("design:paramtypes", [HTMLInputElement])
        ], HideKeyboardOnEnter);
        return HideKeyboardOnEnter;
    }());
    exports.HideKeyboardOnEnter = HideKeyboardOnEnter;
});

//# sourceMappingURL=hideKeyboardOnEnter.js.map
