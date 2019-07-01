var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-logging", "aurelia-templating", "aurelia-dependency-injection", "./formControllerElement", "aurelia-binding", "../observers/pathObserver", "../services/mutationObserverProvider", "../domHelper"], function (require, exports, Logging, aurelia_templating_1, aurelia_dependency_injection_1, formControllerElement_1, aurelia_binding_1, pathObserver_1, mutationObserverProvider_1, domHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FormManager = /** @class */ (function () {
        function FormManager(element, bindingEngine, mutationObserverProvider) {
            this._element = element;
            this._bindingEngine = bindingEngine;
            this._mutationObserverProvider = mutationObserverProvider;
            this._logger = Logging.getLogger("FormManager");
        }
        FormManager.prototype.bind = function (bindingContext) {
            this._formController = bindingContext;
        };
        FormManager.prototype.attached = function () {
            var _this = this;
            this.disconnectFormElements();
            if (this._formController) {
                this._formController.elementsLoaded(this._formElements);
            }
            this.connectDomNode(this._element);
            if (this._formController) {
                this._formController.elementsLoaded(this._formElements);
            }
            /* Setup the mutation observer on the dom to make sure we notice any dynamically added/removed
            form fields, such as if.binds or interated arrays
             */
            this._mutationObserver = this._mutationObserverProvider.create(function (mutations) { return _this.updateMutations(mutations); });
            this._mutationObserver.observe(this._element, { childList: true, subtree: true });
        };
        FormManager.prototype.detached = function () {
            if (this._mutationObserver) {
                this._mutationObserver.disconnect();
                this._mutationObserver = null;
            }
            this.disconnectFormElements();
            if (this._formController) {
                this._formController.elementsLoaded(this._formElements);
            }
        };
        FormManager.prototype.connectDomNode = function (rootElement) {
            var hasChanged = false;
            if (this._formController) {
                if (this.addFormElement(rootElement)) {
                    hasChanged = true;
                }
                var elements = rootElement.children;
                if (elements) {
                    for (var i = 0; i < elements.length; i++) {
                        var domElement = elements[i];
                        // we have nested editableViewModels, we do not want the formManager of the parent to recurse into and register
                        //  the children of router-views.  If we don't do this then bad things happen, like a validationClear() being called on
                        //  the parent clearing validation messages on the child
                        if (domElement.localName !== "router-view" && this.connectDomNode(domElement)) {
                            hasChanged = true;
                        }
                    }
                }
            }
            return hasChanged;
        };
        FormManager.prototype.disconnectDomNode = function (rootElement) {
            var hasChanged = false;
            if (rootElement) {
                if (this.removeFormElement(rootElement)) {
                    hasChanged = true;
                }
                var elements = rootElement.children;
                if (elements) {
                    for (var i = 0; i < elements.length; i++) {
                        var domElement = elements[i];
                        if (this.disconnectDomNode(domElement)) {
                            hasChanged = true;
                        }
                    }
                }
            }
            return hasChanged;
        };
        FormManager.prototype.getBindingPathFromElement = function (element) {
            var bindingPath = null;
            if (element && element.attributes) {
                var atts = ["value.bind", "value.two-way", "value.one-way"];
                atts.forEach(function (att) {
                    var attr = element.attributes.getNamedItem(att);
                    if (attr) {
                        var disableFormManager = element.attributes.getNamedItem("disable-form-manager");
                        if (disableFormManager === null) {
                            bindingPath = domHelper_1.DomHelper.getModelPropertyNameFromBindingPath(attr.value);
                            var validateIndexAttribute = element.attributes.getNamedItem("validate-index");
                            if (validateIndexAttribute) {
                                var formManagerArrayMapElement = domHelper_1.DomHelper.closestTag(element, "form-manager-array-map");
                                if (formManagerArrayMapElement) {
                                    var formManagerArrayMap = domHelper_1.DomHelper.getAureliaComponentFromElement(formManagerArrayMapElement, "form-manager-array-map");
                                    if (formManagerArrayMap && bindingPath) {
                                        bindingPath = bindingPath.replace(formManagerArrayMap.itemName, formManagerArrayMap.arrayName + "[" + formManagerArrayMap.index + "]");
                                    }
                                }
                            }
                        }
                    }
                });
            }
            return bindingPath;
        };
        FormManager.prototype.updateMutations = function (mutations) {
            var _this = this;
            var hasChanged = false;
            if (mutations) {
                mutations.forEach(function (mut) {
                    if (mut.removedNodes) {
                        for (var i = 0; i < mut.removedNodes.length; i++) {
                            var removeElement = mut.removedNodes.item(i);
                            if (_this.disconnectDomNode(removeElement)) {
                                hasChanged = true;
                            }
                        }
                    }
                    if (mut.addedNodes) {
                        for (var i = 0; i < mut.addedNodes.length; i++) {
                            var addElement = mut.addedNodes.item(i);
                            if (_this.connectDomNode(addElement)) {
                                hasChanged = true;
                            }
                        }
                    }
                });
            }
            /* Now make sure all the element have the correct path bindings */
            if (this._formElements) {
                this._formElements.forEach(function (elem) {
                    var oldProp = elem.valueBindingPropertyName;
                    elem.valueBindingPropertyName = _this.getBindingPathFromElement(elem.element);
                    if (elem.valueBindingPropertyName !== oldProp) {
                        hasChanged = true;
                    }
                });
            }
            if (hasChanged) {
                this._formController.elementsLoaded(this._formElements);
            }
        };
        FormManager.prototype.addFormElement = function (htmlElement) {
            var _this = this;
            var hasChanged = false;
            var bindingPath = this.getBindingPathFromElement(htmlElement);
            if (bindingPath) {
                this._logger.debug("Adding Form Element: " + bindingPath);
                var formElement_1;
                this._formElements = this._formElements || [];
                formElement_1 = new formControllerElement_1.FormControllerElement();
                formElement_1.element = htmlElement;
                formElement_1.valueBindingPropertyName = bindingPath;
                formElement_1.pathObserver = new pathObserver_1.PathObserver(this._bindingEngine, this._formController, formElement_1.valueBindingPropertyName);
                formElement_1.pathObserver.subscribe(function () {
                    _this.elementUpdate(formElement_1, "valueChanged");
                });
                var blurListener = function () { return _this.elementUpdate(formElement_1, "lostFocus"); };
                htmlElement.addEventListener("blur", blurListener);
                formElement_1.elementListener = blurListener;
                this._formElements.push(formElement_1);
                hasChanged = true;
            }
            return hasChanged;
        };
        FormManager.prototype.removeFormElement = function (htmlElement) {
            var hasChanged = false;
            var bindingPath = this.getBindingPathFromElement(htmlElement);
            if (bindingPath) {
                this._logger.debug("Removing Form Element: " + bindingPath);
                var formControllerElement = this._formElements.find(function (elem) { return elem.element === htmlElement; });
                if (formControllerElement) {
                    this.removeFormControllerElement(formControllerElement);
                    hasChanged = true;
                }
            }
            return hasChanged;
        };
        FormManager.prototype.removeFormControllerElement = function (formControllerElement) {
            formControllerElement.element.removeEventListener("blur", formControllerElement.elementListener);
            formControllerElement.pathObserver.dispose();
            var foundIndex = this._formElements.indexOf(formControllerElement);
            if (foundIndex >= 0) {
                this._formElements.splice(foundIndex, 1);
            }
        };
        FormManager.prototype.elementUpdate = function (formElement, method) {
            this._formController.elementUpdate(formElement, method);
        };
        FormManager.prototype.disconnectFormElements = function () {
            for (var formElement in this._formElements) {
                this.removeFormControllerElement(this._formElements[formElement]);
            }
            this._formElements = undefined;
        };
        FormManager = __decorate([
            aurelia_templating_1.customAttribute("form-manager"),
            aurelia_dependency_injection_1.inject(Element, aurelia_binding_1.BindingEngine, mutationObserverProvider_1.MutationObserverProvider),
            __metadata("design:paramtypes", [HTMLElement, aurelia_binding_1.BindingEngine, Object])
        ], FormManager);
        return FormManager;
    }());
    exports.FormManager = FormManager;
});

//# sourceMappingURL=formManager.js.map
