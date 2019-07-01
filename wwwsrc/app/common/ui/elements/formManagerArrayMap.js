var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-templating", "aurelia-binding"], function (require, exports, aurelia_templating_1, aurelia_binding_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FormManagerArrayMap = /** @class */ (function () {
        function FormManagerArrayMap() {
        }
        FormManagerArrayMap.prototype.itemChanged = function () {
            this.updateIndex();
        };
        FormManagerArrayMap.prototype.arrayChanged = function () {
            this.updateIndex();
        };
        FormManagerArrayMap.prototype.updateIndex = function () {
            if (this.array && this.item) {
                this.index = this.array.indexOf(this.item);
            }
            else {
                this.index = -1;
            }
        };
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Number)
        ], FormManagerArrayMap.prototype, "index", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], FormManagerArrayMap.prototype, "itemName", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], FormManagerArrayMap.prototype, "arrayName", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Object)
        ], FormManagerArrayMap.prototype, "item", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Array)
        ], FormManagerArrayMap.prototype, "array", void 0);
        FormManagerArrayMap = __decorate([
            aurelia_templating_1.customElement("form-manager-array-map")
        ], FormManagerArrayMap);
        return FormManagerArrayMap;
    }());
    exports.FormManagerArrayMap = FormManagerArrayMap;
});

//# sourceMappingURL=formManagerArrayMap.js.map
