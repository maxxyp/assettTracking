/// <reference path="../../../../typings/app.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "aurelia-binding", "aurelia-dependency-injection", "../../core/threading", "aurelia-pal", "./models/dropdownType"], function (require, exports, aurelia_framework_1, aurelia_binding_1, aurelia_dependency_injection_1, threading_1, aurelia_pal_1, dropdownType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DropDown = /** @class */ (function () {
        function DropDown(element) {
            var _this = this;
            this.noFilter = false;
            this.showSmash = false;
            this.minItemsToCategoriseSmashButtons = -1;
            this.heightStyle = "";
            this._element = element;
            this.selectedId = -1;
            this.showDropDown = false;
            this.filteredValues = [];
            this.filterCount = 0;
            this.keyDown = function (event) {
                if (_this.showDropDown) {
                    if (event.keyCode === 9) {
                        _this.checkForListValue();
                        _this.closeDropdown();
                    }
                    if (event.keyCode === 13) {
                        event.preventDefault();
                        if (_this.selectedId > -1) {
                            _this.select(_this.filteredValues[_this.selectedId][DropDown_1._ID_PROPERTY]);
                        }
                        else {
                            _this.checkForListValue();
                        }
                        _this.closeDropdown();
                    }
                    if (event.keyCode === 27) {
                        event.preventDefault();
                        _this.checkForListValue();
                        _this.closeDropdown();
                    }
                    if (event.keyCode === 38) {
                        event.preventDefault();
                        if (_this.selectedId > 0) {
                            _this.selectedId--;
                            _this.lookupItems.scrollTop = _this.lookupItems.scrollTop - _this.findItemHeight();
                        }
                    }
                    if (event.keyCode === 40) {
                        event.preventDefault();
                        if (_this.selectedId < _this.filteredValues.length - 1) {
                            _this.selectedId++;
                            if (_this.selectedId > 1) {
                                _this.lookupItems.scrollTop = _this.lookupItems.scrollTop + _this.findItemHeight();
                            }
                        }
                    }
                }
                else {
                    if (event.keyCode === 40 && _this._hasFocus) {
                        event.preventDefault();
                        _this.openDropdown();
                    }
                }
            };
            this._clickCheck = function () {
                if (new Date().getTime() - _this._lastShow > 500) {
                    _this.closeDropdown();
                    _this.checkForListValue();
                }
            };
            this.focusListener = function () {
                _this._element.children[0].classList.add("ctrl-focus");
                _this._hasFocus = true;
            };
            this.blurListener = function () {
                _this._element.children[0].classList.remove("ctrl-focus");
                _this._hasFocus = false;
                threading_1.Threading.nextCycle(function () {
                    if (!_this._hasFocus) {
                        _this.blur();
                    }
                });
            };
        }
        DropDown_1 = DropDown;
        DropDown.prototype.attached = function () {
            if (this.dropdownType === dropdownType_1.DropdownType.smashbuttons) {
                this.noFilter = true;
            }
            if (!this.caretClass) {
                this.caretClass = "fa-caret-down";
            }
            if (!this.crossClass) {
                this.crossClass = "fa-close";
            }
            if (!this.placeholder) {
                this.placeholder = "Please select or type...";
            }
            if (!this.searchProperties) {
                this.searchProperties = [this.textProperty];
            }
            if (this.values) {
                this.addIdsToObjectArray();
            }
            if (!this.limit) {
                this.limit = 99999;
            }
            this.processValue(this.value);
            this.setupAlphabeticalKeys();
            document.addEventListener("keydown", this.keyDown);
        };
        DropDown.prototype.detached = function () {
            document.removeEventListener("click", this._clickCheck);
            document.removeEventListener("keydown", this.keyDown);
        };
        DropDown.prototype.openDropdown = function () {
            this.selectedId = -1;
            this._lastShow = new Date().getTime();
            this.showDropDown = true;
            this.filterCount = this.filteredValues.length;
            document.addEventListener("click", this._clickCheck);
        };
        DropDown.prototype.closeDropdown = function () {
            this.showDropDown = false;
            document.removeEventListener("click", this._clickCheck);
            if (!this.value) {
                this.filterCount = 0;
            }
        };
        DropDown.prototype.valuesChanged = function () {
            this.addIdsToObjectArray();
            this.resetFiltered();
            this.setupAlphabeticalKeys();
        };
        DropDown.prototype.valueChanged = function (newValue, oldValue) {
            this.processValue(newValue);
        };
        DropDown.prototype.valueTextChanged = function (newValue, oldValue) {
            if (newValue === "") {
                this.value = undefined;
                this.item = undefined;
                this.valueItem = undefined;
                this.filterCount = this.filteredValues.length;
            }
            this.filterValues();
            this.errorMsg = (this.showErrorMessage && newValue !== "" && this.filteredValues.length === 0) ? this.errorMessage : undefined;
        };
        DropDown.prototype.select = function (id) {
            var _this = this;
            if (id > -1) {
                var currentId = this.values.map(function (v) {
                    return v[DropDown_1._ID_PROPERTY];
                }).indexOf(id);
                if (this.clearOnSelect) {
                    this.valueText = "";
                }
                else {
                    this.valueText = this.formatValueTextString(id - 1);
                }
                this.value = this.values[currentId][this.valueProperty];
                this.item = this.values[id];
                this.valueItem = this.values[currentId];
                this.closeDropdown();
                this.lookupItems.scrollTop = 0;
                this.resetFiltered();
                /* Allow the current value to propogate before clearing it */
                if (this.clearOnSelect) {
                    threading_1.Threading.nextCycle(function () {
                        _this.value = undefined;
                    });
                }
            }
        };
        DropDown.prototype.filterValues = function () {
            var _this = this;
            this.selectedId = -1;
            this.resetFiltered();
            if (this.valueText && this.valueText.length > 0) {
                this.filteredValues = this.filteredValues.filter(function (value) {
                    var found = false;
                    var keywords = _this.valueText.toLocaleLowerCase().split(" ");
                    for (var index = 0; index < _this.searchProperties.length; index++) {
                        var foundCount = 0;
                        var property = _this.searchProperties[index];
                        for (var keywordsCount = 0; keywordsCount < keywords.length; keywordsCount++) {
                            if (value && value[property] && value[property].toString().toLowerCase().indexOf(keywords[keywordsCount].toLowerCase()) > -1
                                || _this.formatValueTextString(value._id - 1).toString().toLowerCase().indexOf(keywords[keywordsCount].toLowerCase()) > -1) {
                                foundCount++;
                            }
                        }
                        if (foundCount >= keywords.length) {
                            found = true;
                            break;
                        }
                    }
                    return found;
                });
                this.filterCount = this.filteredValues.length;
                this.openDropdown();
            }
        };
        DropDown.prototype.toggleDropdown = function () {
            if (!this.disabled) {
                if (this.dropdownType === dropdownType_1.DropdownType.smashbuttons) {
                    if (this.isDoubleHeightNeeded(this.filteredValues, this.textProperty)) {
                        this.heightStyle = "height:100px !important";
                    }
                    this.showSmash = true;
                }
                else {
                    if (this.showDropDown) {
                        this.closeDropdown();
                    }
                    else {
                        this.openDropdown();
                    }
                }
            }
        };
        DropDown.prototype.blur = function () {
            this._element.dispatchEvent(aurelia_pal_1.DOM.createCustomEvent("blur", {
                detail: {
                    value: this._element
                },
                bubbles: true
            }));
        };
        DropDown.prototype.smashButtonsSetValue = function (selectedValue) {
            this.value = selectedValue;
            this.showSmash = false;
        };
        DropDown.prototype.cancel = function () {
            if (this.dropdownType === dropdownType_1.DropdownType.smashbuttons) {
                this.selectAlphabetLetter(DropDown_1._SHOW_ALL_ITEMS);
            }
            this.showSmash = false;
        };
        DropDown.prototype.selectAlphabetLetter = function (alphabetLetter) {
            if (alphabetLetter === DropDown_1._SHOW_ALL_ITEMS) {
                this.filteredValues = this.values.slice();
                this._selectedAlphabetLetter = alphabetLetter;
                return;
            }
            if (this.alphabets[alphabetLetter].length > 0) {
                this.filteredValues = this.alphabets[alphabetLetter];
                this._selectedAlphabetLetter = alphabetLetter;
            }
        };
        Object.defineProperty(DropDown.prototype, "currentAlphabetLetter", {
            get: function () {
                return this._selectedAlphabetLetter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DropDown.prototype, "showCategories", {
            get: function () {
                var noItems = this.values ? this.values.length : 0;
                return this.minItemsToCategoriseSmashButtons === -1 || noItems >= this.minItemsToCategoriseSmashButtons;
            },
            enumerable: true,
            configurable: true
        });
        DropDown.prototype.checkForListValue = function () {
            var _this = this;
            var foundPos = this.values.map(function (v) {
                return _this.formatValueTextString(v._id - 1);
            }).indexOf(this.valueText);
            if (foundPos > -1) {
                this.valueText = this.formatValueTextString(foundPos); // this.values[foundPos][this.textProperty];
                this.value = this.values[foundPos][this.valueProperty];
                this.item = this.values[foundPos];
                this.valueItem = this.values[foundPos];
            }
            else {
                this.valueText = "";
                this.value = undefined;
                this.item = undefined;
                this.valueItem = undefined;
                this.filterCount = this.filteredValues.length;
            }
            this.closeDropdown();
            this.resetFiltered();
        };
        DropDown.prototype.formatValueTextString = function (valueId) {
            var _this = this;
            if (this.formatTextValue && valueId > -1) {
                var val = this.formatTextValue.replace(/\((.+?)\)/g, function (match, idx) {
                    return _this.values[valueId][idx];
                });
                if (val.trim().indexOf("/") === val.trim().length - 1) {
                    return this.values[valueId][this.textProperty];
                }
                return val;
            }
            else if (valueId === -1) {
                return "";
            }
            else {
                return this.values[valueId][this.textProperty];
            }
        };
        DropDown.prototype.processValue = function (newValue) {
            var _this = this;
            if (this.values) {
                var foundPos = this.values.map(function (v) {
                    return v[_this.valueProperty];
                }).indexOf(newValue);
                if (foundPos > -1 && !this.clearOnSelect) {
                    newValue = this.values[foundPos][this.valueProperty];
                    this.valueText = this.formatValueTextString(foundPos);
                    this.item = this.values[foundPos];
                }
                else if (foundPos > -1 && this.clearOnSelect) {
                    newValue = this.values[foundPos][this.valueProperty];
                    this.valueText = "";
                    this.item = this.values[foundPos];
                }
                else {
                    newValue = undefined;
                    this.valueText = "";
                    this.item = undefined;
                }
                this.closeDropdown();
                this.resetFiltered();
            }
        };
        DropDown.prototype.findItemHeight = function () {
            var item;
            item = this.lookupItems.children[this.selectedId];
            return item.offsetHeight;
        };
        DropDown.prototype.isDoubleHeightNeeded = function (items, textProperty) {
            var result = false;
            items.forEach(function (item) {
                if (item[textProperty].length > 30) {
                    result = true;
                }
            });
            return result;
        };
        DropDown.prototype.resetFiltered = function () {
            var _this = this;
            this.filteredValues = [];
            if (this.values && this.values.length > 0) {
                this.values.forEach(function (value) {
                    if (!value[_this.textProperty]) {
                        value[_this.textProperty] = value[_this.valueProperty];
                    }
                    if (value[_this.textProperty] && value[_this.valueProperty]) {
                        _this.filteredValues.push(value);
                    }
                });
                // this.filteredValues.sort();
            }
        };
        DropDown.prototype.addIdsToObjectArray = function () {
            for (var index = 0; index < this.values.length; index++) {
                var valueItem = this.values[index];
                valueItem[DropDown_1._ID_PROPERTY] = index + 1;
            }
        };
        DropDown.prototype.setupAlphabeticalKeys = function () {
            var _this = this;
            if (this.dropdownType !== dropdownType_1.DropdownType.smashbuttons) {
                return;
            }
            if (!this.values || this.values.length === 0) {
                return;
            }
            // initialise alphabet categories used for smash buttons
            this.alphabetKeys = DropDown_1._ALPHABET_ITEMS.split(",");
            this.alphabets = {};
            for (var _i = 0, _a = this.alphabetKeys; _i < _a.length; _i++) {
                var ch = _a[_i];
                this.alphabets[ch] = [];
            }
            this._selectedAlphabetLetter = DropDown_1._SHOW_ALL_ITEMS;
            this.values.forEach(function (v) {
                if (v && v[_this.textProperty] && v[_this.textProperty].length > 0) {
                    var text = v[_this.textProperty].trim(); // need to remove trailing spaces
                    var letter = text.charAt(0).toUpperCase();
                    if (_this.alphabets[letter]) {
                        _this.alphabets[letter].push(v);
                    }
                }
            });
        };
        DropDown._ID_PROPERTY = "_id";
        DropDown._SHOW_ALL_ITEMS = "All";
        DropDown._ALPHABET_ITEMS = "All,0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], DropDown.prototype, "placeholder", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Number)
        ], DropDown.prototype, "limit", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", String)
        ], DropDown.prototype, "value", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], DropDown.prototype, "valueItem", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], DropDown.prototype, "disabled", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], DropDown.prototype, "readonly", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Array)
        ], DropDown.prototype, "values", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], DropDown.prototype, "valueProperty", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], DropDown.prototype, "textProperty", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Array)
        ], DropDown.prototype, "searchProperties", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], DropDown.prototype, "crossClass", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], DropDown.prototype, "caretClass", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], DropDown.prototype, "clearOnSelect", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], DropDown.prototype, "formatTextValue", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], DropDown.prototype, "errorMessage", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], DropDown.prototype, "showErrorMessage", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], DropDown.prototype, "noFilter", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Number)
        ], DropDown.prototype, "dropdownType", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Number)
        ], DropDown.prototype, "minItemsToCategoriseSmashButtons", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Number)
        ], DropDown.prototype, "filterCount", void 0);
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", String)
        ], DropDown.prototype, "valueText", void 0);
        __decorate([
            aurelia_binding_1.computedFrom("showSmash", "values"),
            __metadata("design:type", Boolean),
            __metadata("design:paramtypes", [])
        ], DropDown.prototype, "showCategories", null);
        DropDown = DropDown_1 = __decorate([
            aurelia_framework_1.customElement("drop-down"),
            aurelia_dependency_injection_1.inject(Element),
            __metadata("design:paramtypes", [HTMLElement])
        ], DropDown);
        return DropDown;
        var DropDown_1;
    }());
    exports.DropDown = DropDown;
});

//# sourceMappingURL=dropDown.js.map
