var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-templating", "aurelia-binding", "aurelia-dependency-injection", "aurelia-pal", "../../../common/core/threading"], function (require, exports, aurelia_templating_1, aurelia_binding_1, aurelia_dependency_injection_1, aurelia_pal_1, threading_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Checkbox = /** @class */ (function () {
        function Checkbox(element) {
            this._element = element;
        }
        Checkbox.prototype.attached = function () {
            if (this.value === true) {
                this.isChecked = true;
            }
        };
        Checkbox.prototype.click = function () {
            var _this = this;
            this.isChecked = this.isChecked === true ? false : true;
            threading_1.Threading.nextCycle(function () {
                _this._element.dispatchEvent(aurelia_pal_1.DOM.createCustomEvent("change", {
                    detail: {
                        value: _this.value,
                        checked: _this.isChecked
                    },
                    bubbles: true
                }));
            });
        };
        Checkbox.prototype.blur = function () {
            this._element.dispatchEvent(aurelia_pal_1.DOM.createCustomEvent("blur", {
                detail: {
                    value: this._element
                },
                bubbles: true
            }));
        };
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], Checkbox.prototype, "value", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], Checkbox.prototype, "classes", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], Checkbox.prototype, "disabled", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
            __metadata("design:type", Boolean)
        ], Checkbox.prototype, "isChecked", void 0);
        Checkbox = __decorate([
            aurelia_templating_1.customElement("checkbox"),
            aurelia_dependency_injection_1.inject(Element),
            __metadata("design:paramtypes", [HTMLInputElement])
        ], Checkbox);
        return Checkbox;
    }());
    exports.Checkbox = Checkbox;
});

//# sourceMappingURL=checkbox.js.map
