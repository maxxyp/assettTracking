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
    var TextArea = /** @class */ (function () {
        function TextArea(element) {
            this._defaultMaxLength = this.maxlength = this.maxlength2 = 65535;
            this.maxLengthSet = false;
            this.maxlengthText = "characters left";
            this.spellCheck = true;
            this.placeholder = "";
            this._element = element;
        }
        TextArea.prototype.attached = function () {
            this.updateCharCount();
        };
        TextArea.prototype.valueChanged = function (newValue, oldValue) {
            this.updateCharCount();
        };
        TextArea.prototype.maxlengthChanged = function (newValue, oldValue) {
            if (newValue) {
                this.maxlength = parseInt(newValue, 10);
                this.maxLengthSet = true;
                this.updateCharCount();
            }
            else {
                this.maxlength = this._defaultMaxLength;
                this.maxLengthSet = false;
            }
        };
        TextArea.prototype.maxlength2Changed = function (newValue, oldValue) {
            if (newValue) {
                this.maxlength2 = parseInt(newValue, 10);
                this.maxLength2Set = true;
                this.updateCharCount();
            }
            else {
                this.maxlength2 = this._defaultMaxLength;
                this.maxLength2Set = false;
            }
        };
        TextArea.prototype.updateCharCount = function () {
            if (this.maxLengthSet) {
                var totalLength = (this.value ? this.value.length : 0);
                var val = this.maxlength - totalLength;
                if (val >= 0) {
                    this.charactersLeft = val + " " + this.maxlengthText;
                }
                else if (val < 0) {
                    var truncval = this.value.substr(0, this.maxlength);
                    this.value = truncval;
                }
                if (this.maxLength2Set && this.maxlength2 < this.maxlength) {
                    var val2 = this.maxlength2 - totalLength;
                    if (val2 > 0) {
                        this.charactersLeft2 = "(" + val2 + " " + this.maxlength2Text + ")";
                    }
                    else if (val2 < 0) {
                        this.charactersLeft2 = "(" + this.maxlength2ExceededText + ")";
                    }
                    else {
                        this.charactersLeft2 = "";
                    }
                }
            }
        };
        TextArea.prototype.blur = function () {
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
        ], TextArea.prototype, "value", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TextArea.prototype, "classes", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], TextArea.prototype, "disabled", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], TextArea.prototype, "readonly", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TextArea.prototype, "placeholder", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], TextArea.prototype, "spellCheck", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TextArea.prototype, "charactersLeft", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Number)
        ], TextArea.prototype, "maxlength", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TextArea.prototype, "maxlengthText", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TextArea.prototype, "charactersLeft2", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Number)
        ], TextArea.prototype, "maxlength2", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TextArea.prototype, "maxlength2Text", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], TextArea.prototype, "maxlength2ExceededText", void 0);
        TextArea = __decorate([
            aurelia_templating_1.customElement("text-area"),
            aurelia_dependency_injection_1.inject(Element),
            __metadata("design:paramtypes", [Element])
        ], TextArea);
        return TextArea;
    }());
    exports.TextArea = TextArea;
});

//# sourceMappingURL=textArea.js.map
