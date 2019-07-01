var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "./models/buttonListItem", "../../core/threading", "aurelia-pal", "aurelia-dependency-injection"], function (require, exports, aurelia_framework_1, buttonListItem_1, threading_1, aurelia_pal_1, aurelia_dependency_injection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ButtonList = /** @class */ (function () {
        function ButtonList(element) {
            this.multiSelect = false;
            this.buttonWidth = "auto";
            this.buttonHeight = "auto";
            this.buttonLayout = "horizontal";
            this._element = element;
        }
        ButtonList.prototype.attached = function () {
            // if we have values and not button list items then convert our values array into a ButtonListItem array.
            if (this.values) {
                this.items = [];
                for (var indexValueItem = 0; indexValueItem < this.values.length; indexValueItem++) {
                    this.items.push(new buttonListItem_1.ButtonListItem(this.values[indexValueItem], this.values[indexValueItem], false));
                }
            }
        };
        ButtonList.prototype.setValue = function (buttonListItem, index, event) {
            if (!buttonListItem.disabled) {
                if (!this.multiSelect) {
                    this.value = buttonListItem.value;
                }
                else {
                    var pos = this.value ? this.value.indexOf(buttonListItem.value) : -1;
                    if (pos > -1) {
                        this.value.splice(pos, 1);
                    }
                    else {
                        if (!this.value) {
                            this.value = [];
                        }
                        this.value.push(buttonListItem.value);
                    }
                    /* Do a shallow copy to make the outside world notice the array change */
                    this.value = this.value.slice(0);
                }
                if (event) {
                    event.stopPropagation();
                    aurelia_pal_1.DOM.dispatchEvent(new Event("click"));
                }
            }
        };
        ButtonList.prototype.isIconButton = function (buttonListItem) {
            return !!buttonListItem
                && buttonListItem.iconClassName !== undefined;
        };
        ButtonList.prototype.blur = function (index) {
            var _this = this;
            this._buttonHasFocus = false;
            threading_1.Threading.nextCycle(function () {
                if (!_this._buttonHasFocus) {
                    _this._element.dispatchEvent(aurelia_pal_1.DOM.createCustomEvent("blur", {
                        detail: {
                            value: _this._element
                        },
                        bubbles: true
                    }));
                }
            });
        };
        ButtonList.prototype.focus = function (index) {
            this._buttonHasFocus = true;
        };
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Array)
        ], ButtonList.prototype, "items", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], ButtonList.prototype, "buttonLayout", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], ButtonList.prototype, "value", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], ButtonList.prototype, "multiSelect", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], ButtonList.prototype, "buttonWidth", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], ButtonList.prototype, "buttonHeight", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Array)
        ], ButtonList.prototype, "values", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], ButtonList.prototype, "disabled", void 0);
        ButtonList = __decorate([
            aurelia_dependency_injection_1.inject(Element),
            __metadata("design:paramtypes", [Element])
        ], ButtonList);
        return ButtonList;
    }());
    exports.ButtonList = ButtonList;
});

//# sourceMappingURL=buttonList.js.map
