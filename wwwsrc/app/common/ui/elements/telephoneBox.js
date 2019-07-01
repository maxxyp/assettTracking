var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-templating", "aurelia-binding", "aurelia-dependency-injection", "aurelia-pal"], function (require, exports, aurelia_templating_1, aurelia_binding_1, aurelia_dependency_injection_1, aurelia_pal_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TelephoneBox = /** @class */ (function () {
        function TelephoneBox(element) {
            this._element = element;
        }
        TelephoneBox.prototype.blur = function () {
            this._element.dispatchEvent(aurelia_pal_1.DOM.createCustomEvent("blur", {
                detail: {
                    value: this._element
                },
                bubbles: true
            }));
        };
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
            __metadata("design:type", String)
        ], TelephoneBox.prototype, "value", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TelephoneBox.prototype, "classes", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], TelephoneBox.prototype, "disabled", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], TelephoneBox.prototype, "readonly", void 0);
        TelephoneBox = __decorate([
            aurelia_templating_1.customElement("telephone-box"),
            aurelia_dependency_injection_1.inject(Element),
            __metadata("design:paramtypes", [Element])
        ], TelephoneBox);
        return TelephoneBox;
    }());
    exports.TelephoneBox = TelephoneBox;
});

//# sourceMappingURL=telephoneBox.js.map
