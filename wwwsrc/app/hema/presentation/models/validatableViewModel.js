var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./baseViewModel", "../../business/models/businessException", "../../../common/core/objectHelper", "../../../common/core/stringHelper", "../../../common/ui/domHelper"], function (require, exports, baseViewModel_1, businessException_1, objectHelper_1, stringHelper_1, domHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ValidatableViewModel = /** @class */ (function (_super) {
        __extends(ValidatableViewModel, _super);
        function ValidatableViewModel(labelService, eventAggregator, dialogService, validationService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this._validationService = validationService;
            _this._isDirty = false;
            _this._lastDataLoadTime = 0;
            _this._enableValidation = false;
            _this.validationRules = {};
            return _this;
        }
        ValidatableViewModel.prototype.buildValidation = function (dynamicRules) {
            var _this = this;
            return this._validationService.build(this, stringHelper_1.StringHelper.toCamelCase(objectHelper_1.ObjectHelper.getClassName(this)), dynamicRules).then(function (validationController) {
                if (validationController) {
                    _this._validationController = validationController;
                    _this.validationRules = validationController.staticRules;
                }
                return _this.validateAllRules();
            });
        };
        ValidatableViewModel.prototype.detached = function () {
            var _this = this;
            return _super.prototype.detached.call(this)
                .then(function () {
                _this._validationController = null;
            });
        };
        ValidatableViewModel.prototype.getValidationRule = function (ruleKey) {
            if (!this.validationRules[ruleKey]) {
                throw new businessException_1.BusinessException(this, "getValidationRule", "Unable to get rule '{0}' for viewModel '{1}'", [ruleKey, objectHelper_1.ObjectHelper.getClassName(this)], null);
            }
            return this.validationRules[ruleKey];
        };
        ValidatableViewModel.prototype.validationManual = function () {
            this.validationToggle(true);
            this._lastDataLoadTime = new Date().getTime();
        };
        ValidatableViewModel.prototype.validationToggle = function (enable) {
            this._enableValidation = enable;
        };
        ValidatableViewModel.prototype.getValidationEnabled = function () {
            return this._enableValidation;
        };
        ValidatableViewModel.prototype.validateAllRules = function () {
            var _this = this;
            if (this._validationController) {
                // .DF_1149 - only validate if the page has loaded
                var readyToValidate = this._enableValidation && this._lastDataLoadTime && this.pageReadyToValidate();
                if (readyToValidate) {
                    return this._validationService.validate(this._validationController, this, null)
                        .then(function (validationCombinedResult) {
                        _this.toggleErrors(validationCombinedResult);
                        return _this.updateLiveDataState(validationCombinedResult.isValid)
                            .then(function () {
                            _this.validationUpdated(validationCombinedResult);
                        });
                    });
                }
                else {
                    return this.validationClearDisplay();
                }
            }
            else {
                return Promise.resolve();
            }
        };
        ValidatableViewModel.prototype.checkAllRules = function () {
            if (this._validationController) {
                return this._validationService.validate(this._validationController, this, null)
                    .then(function (validationCombinedResult) {
                    return validationCombinedResult.isValid;
                });
            }
            else {
                return Promise.resolve(false);
            }
        };
        ValidatableViewModel.prototype.validateSingleRule = function (property) {
            var _this = this;
            if (this._validationController && this._enableValidation) {
                return this._validationService.validate(this._validationController, this, property)
                    .then(function (validationCombinedResult) {
                    _this.toggleErrors(validationCombinedResult);
                    _this.validationUpdated(validationCombinedResult);
                    return _this.updateLiveDataState(undefined)
                        .then(function () {
                        return validationCombinedResult;
                    });
                });
            }
            else {
                return Promise.resolve(null);
            }
        };
        ValidatableViewModel.prototype.validationClearDisplay = function () {
            var _this = this;
            if (this._validationController && this._formElements) {
                this._formElements.forEach(function (elem) {
                    _this.toggleError(elem, true, "");
                });
            }
            return Promise.resolve();
        };
        ValidatableViewModel.prototype.validationClearGroup = function (groupName) {
            var _this = this;
            if (this._validationController && this._formElements) {
                this._formElements.forEach(function (elem) {
                    if (_this._validationController.validationRuleGroups[groupName]) {
                        if (_this._validationController.validationRuleGroups[groupName].find(function (x) { return x === elem.valueBindingPropertyName; })) {
                            _this.toggleError(elem, true, "");
                        }
                    }
                });
            }
            return Promise.resolve();
        };
        ValidatableViewModel.prototype.validationClearItem = function (propertyName) {
            var _this = this;
            if (this._validationController && this._formElements) {
                if (stringHelper_1.StringHelper.endsWith(propertyName, "*")) {
                    var startsWith_1 = propertyName.substr(0, propertyName.length - 1);
                    var formControllerElements = this._formElements.filter(function (fe) { return stringHelper_1.StringHelper.startsWith(fe.valueBindingPropertyName, startsWith_1); });
                    if (formControllerElements) {
                        formControllerElements.forEach(function (formControllerElement) {
                            _this.toggleError(formControllerElement, true, "");
                        });
                    }
                }
                else {
                    var formControllerElement = this._formElements.find(function (fe) { return fe.valueBindingPropertyName === propertyName; });
                    if (formControllerElement) {
                        this.toggleError(formControllerElement, true, "");
                    }
                }
            }
            return Promise.resolve();
        };
        ValidatableViewModel.prototype.elementsLoaded = function (formElements) {
            this._formElements = formElements;
            this.validateAllRules();
        };
        ValidatableViewModel.prototype.elementUpdate = function (formElement, method) {
            /* clearing data can often lead to property changes so we don't want
             * to revalidate straight away, give the UI a short time to complete its updates
             * this is also the case when the data has been initially loaded */
            if (this._lastDataLoadTime > 0) {
                var timeNow = new Date().getTime();
                if (timeNow - this._lastDataLoadTime > 500) {
                    if (this._isDirty) {
                        this.validateSingleRule(formElement.valueBindingPropertyName);
                    }
                    else {
                        // .DF_1149 on first touch validate everything, otherwise we may get an overall currentDataState of invalid
                        //  but with no asterisks showing on other fields
                        this.setDirty(true);
                        this.validateAllRules();
                    }
                }
            }
        };
        ValidatableViewModel.prototype.setDirty = function (isDirty) {
            this._isDirty = isDirty;
        };
        ValidatableViewModel.prototype.validationUpdated = function (validationCombinedResult) {
        };
        ValidatableViewModel.prototype.isValidChanged = function (isValid) {
        };
        // overridden in editableViewModel
        ValidatableViewModel.prototype.pageReadyToValidate = function () {
            return true;
        };
        ValidatableViewModel.prototype.updateLiveDataState = function (isValid) {
            var _this = this;
            var p;
            if (isValid === undefined) {
                p = this._validationService.validate(this._validationController, this, null)
                    .then(function (combinedResult) { return combinedResult.isValid; });
            }
            else {
                p = Promise.resolve(isValid);
            }
            return p.then(function (finalIsValid) {
                _this.isValidChanged(finalIsValid);
            });
        };
        ValidatableViewModel.prototype.toggleErrors = function (validationCombinedResult) {
            if (validationCombinedResult && this._formElements) {
                var _loop_1 = function (property) {
                    var formControllerElement = this_1._formElements.find(function (elem) { return elem.valueBindingPropertyName === property; });
                    if (formControllerElement) {
                        this_1.toggleError(formControllerElement, validationCombinedResult.propertyResults[property].isValid, validationCombinedResult.propertyResults[property].message);
                    }
                };
                var this_1 = this;
                for (var property in validationCombinedResult.propertyResults) {
                    _loop_1(property);
                }
            }
        };
        ValidatableViewModel.prototype.toggleError = function (formControllerElement, isValid, message) {
            var formGroup = domHelper_1.DomHelper.closest(formControllerElement.element, ".form-group");
            if (formGroup) {
                if (isValid) {
                    formGroup.classList.remove("has-warning");
                }
                else {
                    formGroup.classList.add("has-warning");
                }
                var customBlock = void 0;
                /* see if the dev has provided a custom error position block, if so use that for messages */
                var customBlocks = formGroup.getElementsByClassName("validation-custom");
                if (customBlocks && customBlocks.length > 0) {
                    customBlock = customBlocks[0];
                }
                var labels = formGroup.getElementsByTagName("label");
                if (labels && labels.length > 0) {
                    var labelContainer = labels[0].parentElement;
                    var spans = labelContainer.getElementsByClassName("help-block validation-message");
                    var requiredSpan = null;
                    var helpSpan = null;
                    if (spans && spans.length > 0) {
                        requiredSpan = spans[0];
                        if (spans.length > 1) {
                            helpSpan = spans[1];
                        }
                    }
                    if (isValid) {
                        if (requiredSpan) {
                            labelContainer.removeChild(requiredSpan);
                        }
                        if (helpSpan) {
                            labelContainer.removeChild(helpSpan);
                        }
                        var errorMessageElement = this.getElementByClassName(formGroup, "requiredFieldMessag");
                        if (errorMessageElement) {
                            errorMessageElement.remove();
                        }
                    }
                    else {
                        /* dont add the message block if this is only a required message, and there is no custom block to show it */
                        if (!requiredSpan) {
                            requiredSpan = document.createElement("span");
                            requiredSpan.className = "help-block validation-message validation-required-marker";
                            if (formGroup.children[1]) {
                                var errorMessageElement = this.getElementByClassName(formGroup, "requiredFieldMessag");
                                if (!errorMessageElement) {
                                    var requireFieldMessage = document.createElement("span");
                                    requireFieldMessage.className = "requiredFieldMessag help-block validation-message validation-required-marker";
                                    var iconElement = document.createElement("i");
                                    iconElement.className = "fa fa-exclamation-triangle";
                                    requireFieldMessage.appendChild(iconElement);
                                    var messageText = document.createElement("span");
                                    messageText.innerHTML = " Requires input";
                                    requireFieldMessage.appendChild(messageText);
                                    formGroup.children[1].appendChild(requireFieldMessage);
                                }
                            }
                            labelContainer.insertBefore(requiredSpan, labels[0].nextSibling);
                        }
                        if (message !== "*" && customBlock === undefined) {
                            if (!helpSpan) {
                                helpSpan = document.createElement("span");
                                helpSpan.className = "requiredFieldMessage help-block validation-message";
                                labelContainer.insertBefore(helpSpan, requiredSpan.nextSibling);
                            }
                            helpSpan.textContent = message;
                        }
                        else {
                            if (helpSpan) {
                                labelContainer.removeChild(helpSpan);
                            }
                        }
                    }
                }
                /* display custom messages */
                if (customBlock) {
                    customBlock.style.display = isValid ? "none" : "block";
                    customBlock.textContent = message === "*" || isValid ? "" : message;
                }
            }
        };
        ValidatableViewModel.prototype.getElementByClassName = function (rootElement, classNameSearch) {
            if (rootElement.children[1] && rootElement.children[1].children) {
                for (var i = 0; i < rootElement.children[1].children.length; i++) {
                    if (rootElement.children[1].children[i] && rootElement.children[1].children[i].className.indexOf(classNameSearch) > -1) {
                        return rootElement.children[1].children[i];
                    }
                }
            }
            return undefined;
        };
        return ValidatableViewModel;
    }(baseViewModel_1.BaseViewModel));
    exports.ValidatableViewModel = ValidatableViewModel;
});

//# sourceMappingURL=validatableViewModel.js.map
