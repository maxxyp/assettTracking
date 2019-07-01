var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-templating", "aurelia-binding", "aurelia-dependency-injection", "../../core/threading"], function (require, exports, aurelia_templating_1, aurelia_binding_1, aurelia_dependency_injection_1, threading_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Badge = /** @class */ (function () {
        function Badge(element) {
        }
        Badge.prototype.valueChanged = function () {
            var _this = this;
            this.animationClass = "holder-out";
            threading_1.Threading.delay(function () {
                _this.animationClass = "holder-bottom";
                _this.newValue = _this.value;
                threading_1.Threading.delay(function () {
                    _this.animationClass = "";
                }, 100);
            }, 150);
        };
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], Badge.prototype, "value", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneTime }),
            __metadata("design:type", Boolean)
        ], Badge.prototype, "disabled", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneTime }),
            __metadata("design:type", Boolean)
        ], Badge.prototype, "showCount", void 0);
        Badge = __decorate([
            aurelia_templating_1.customElement("badge"),
            aurelia_dependency_injection_1.inject(Element),
            __metadata("design:paramtypes", [Element])
        ], Badge);
        return Badge;
    }());
    exports.Badge = Badge;
});

//# sourceMappingURL=badge.js.map
