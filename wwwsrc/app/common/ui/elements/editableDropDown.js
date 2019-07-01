var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-templating", "aurelia-binding", "../../core/stringHelper"], function (require, exports, aurelia_templating_1, aurelia_binding_1, stringHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CARET_ID = "editable-dropdown-caret";
    var EditableDropDown = /** @class */ (function () {
        function EditableDropDown(element) {
            var _this = this;
            this.filterList = [];
            this.keyDown = function (event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    _this.checkAddNewItem(_this.value);
                    _this.filterList = [];
                }
                _this.isOpen = false;
            };
            this._clickCheck = function (event) {
                if (event.srcElement.id !== CARET_ID) {
                    event.preventDefault();
                    _this.filterList = [];
                }
            };
        }
        EditableDropDown.prototype.attached = function () {
            this.isOpen = !this.value;
            if (!this.placeholder) {
                this.placeholder = "Please select or type...";
            }
            document.addEventListener("keydown", this.keyDown);
            document.addEventListener("click", this._clickCheck);
        };
        EditableDropDown.prototype.detached = function () {
            document.removeEventListener("keydown", this.keyDown);
            document.removeEventListener("click", this._clickCheck);
        };
        EditableDropDown.prototype.select = function (item, index) {
            if (stringHelper_1.StringHelper.isEmptyOrUndefinedOrNull(item)) {
                return;
            }
            if (this.filterList && this.filterList.length > 0) {
                this.value = this.filterList[index];
            }
            else {
                this.value = item;
            }
            this.filterList = [];
            this.isOpen = false;
        };
        EditableDropDown.prototype.toggleCaret = function () {
            if (this.disabled) {
                return;
            }
            var _a = this, isOpen = _a.isOpen, filterList = _a.filterList;
            var listHasItems = filterList.length;
            if (!isOpen && listHasItems) {
                this.clickOpen();
                return;
            }
            if (!isOpen && !listHasItems) {
                this.clickClose();
                return;
            }
            if (isOpen && !listHasItems) {
                this.filterList = this.getItems();
            }
        };
        EditableDropDown.prototype.blurListener = function (event) {
            this.checkAddNewItem(this.value);
            // this.select(this.value,0);
        };
        EditableDropDown.prototype.search = function () {
            this.isOpen = true;
            if (this.value && this.items) {
                this.filterList = this.getItems(this.value);
                return true;
            }
            this.filterList = this.items;
            return true;
        };
        EditableDropDown.prototype.checkAddNewItem = function (item) {
            if (stringHelper_1.StringHelper.isEmptyOrUndefinedOrNull(item)) {
                return;
            }
            var index = this.items.findIndex(function (i) { return i === item; });
            if (index === -1) {
                this.items = this.items.concat([item]);
            }
        };
        EditableDropDown.prototype.clickClose = function () {
            if (this.isOpen) {
                return;
            }
            this.isOpen = true;
            this.value = undefined;
            this.filterList = [];
        };
        EditableDropDown.prototype.clickOpen = function () {
            this.isOpen = true;
            this.filterList = this.getItems();
        };
        EditableDropDown.prototype.getItems = function (searchStr) {
            if (searchStr === void 0) { searchStr = null; }
            var filteredItems = this.items.filter(function (a) { return a && a.trim().length > 0; });
            if (stringHelper_1.StringHelper.isEmptyOrUndefinedOrNull(searchStr)) {
                return filteredItems;
            }
            return filteredItems.filter(function (a) { return a.toUpperCase().indexOf(searchStr.toUpperCase()) > -1; });
        };
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
            __metadata("design:type", String)
        ], EditableDropDown.prototype, "value", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], EditableDropDown.prototype, "disabled", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Array)
        ], EditableDropDown.prototype, "items", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], EditableDropDown.prototype, "placeholder", void 0);
        return EditableDropDown;
    }());
    exports.EditableDropDown = EditableDropDown;
});

//# sourceMappingURL=editableDropDown.js.map
