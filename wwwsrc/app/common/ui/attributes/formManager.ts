import * as Logging from "aurelia-logging";
import {customAttribute} from "aurelia-templating";
import {inject} from "aurelia-dependency-injection";
import {IFormController} from "./IFormController";
import {FormControllerElement} from "./formControllerElement";
import {BindingEngine} from "aurelia-binding";
import {PathObserver} from "../observers/pathObserver";
import {MutationObserverProvider} from "../services/mutationObserverProvider";
import {IMutationObserverProvider} from "../services/IMutationObserverProvider";
import { DomHelper } from "../domHelper";
import {FormManagerArrayMap} from "../elements/formManagerArrayMap";

@customAttribute("form-manager")
@inject(Element, BindingEngine, MutationObserverProvider)
export class FormManager {
    private _formController: IFormController;
    private _element: HTMLElement;
    private _formElements: FormControllerElement[];

    private _mutationObserverProvider: IMutationObserverProvider;
    private _bindingEngine: BindingEngine;
    private _mutationObserver: MutationObserver;
    private _logger: Logging.Logger;

    constructor(element: HTMLElement, bindingEngine: BindingEngine, mutationObserverProvider: IMutationObserverProvider) {
        this._element = element;
        this._bindingEngine = bindingEngine;
        this._mutationObserverProvider = mutationObserverProvider;

        this._logger = Logging.getLogger("FormManager");
    }

    public bind(bindingContext: any): any {
        this._formController = bindingContext;
    }

    public attached(): void {
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
        this._mutationObserver = this._mutationObserverProvider.create((mutations) => this.updateMutations(mutations));
        this._mutationObserver.observe(this._element, {childList: true, subtree: true});
    }

    public detached(): void {
        if (this._mutationObserver) {
            this._mutationObserver.disconnect();
            this._mutationObserver = null;
        }
        this.disconnectFormElements();
        if (this._formController) {
            this._formController.elementsLoaded(this._formElements);
        }
    }

    private connectDomNode(rootElement: HTMLElement): boolean {
        let hasChanged: boolean = false;

        if (this._formController) {
            if (this.addFormElement(rootElement)) {
                hasChanged = true;
            }
            let elements: HTMLCollection = rootElement.children;

            if (elements) {
                for (let i = 0; i < elements.length; i++) {
                    let domElement = <HTMLElement>elements[i];

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
    }

    private disconnectDomNode(rootElement: HTMLElement) : boolean {
        let hasChanged: boolean = false;

        if (rootElement) {
            if (this.removeFormElement(rootElement)) {
                hasChanged = true;
            }
            let elements: HTMLCollection = rootElement.children;

            if (elements) {
                for (let i = 0; i < elements.length; i++) {
                    let domElement = <HTMLElement>elements[i];

                    if (this.disconnectDomNode(domElement)) {
                        hasChanged = true;
                    }
                }
            }
        }

        return hasChanged;
    }

    private getBindingPathFromElement(element: HTMLElement): string {
        let bindingPath: string = null;

        if (element && element.attributes) {
            let atts: string[] = ["value.bind", "value.two-way" , "value.one-way"];

            atts.forEach((att) => {
                let attr: Attr = element.attributes.getNamedItem(att);
                if (attr) {
                    let disableFormManager = element.attributes.getNamedItem("disable-form-manager");

                    if (disableFormManager === null) {
                        bindingPath = DomHelper.getModelPropertyNameFromBindingPath(attr.value);

                        let validateIndexAttribute = element.attributes.getNamedItem("validate-index");

                        if (validateIndexAttribute) {
                            let formManagerArrayMapElement = DomHelper.closestTag(element, "form-manager-array-map");
                            if (formManagerArrayMapElement) {
                                let formManagerArrayMap = DomHelper.getAureliaComponentFromElement<FormManagerArrayMap>(formManagerArrayMapElement, "form-manager-array-map");
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
    }

    private updateMutations(mutations: MutationRecord[]): void {
        let hasChanged: boolean = false;

        if (mutations) {
            mutations.forEach(mut => {

                if (mut.removedNodes) {
                    for (let i = 0; i < mut.removedNodes.length; i++) {
                        let removeElement = <HTMLElement>mut.removedNodes.item(i);

                        if (this.disconnectDomNode(removeElement)) {
                            hasChanged = true;
                        }
                    }
                }

                if (mut.addedNodes) {
                    for (let i = 0; i < mut.addedNodes.length; i++) {
                        let addElement = <HTMLElement>mut.addedNodes.item(i);

                        if (this.connectDomNode(addElement)) {
                            hasChanged = true;
                        }
                    }
                }
            });
        }

        /* Now make sure all the element have the correct path bindings */
        if (this._formElements) {
            this._formElements.forEach(elem => {
                let oldProp = elem.valueBindingPropertyName;

                elem.valueBindingPropertyName = this.getBindingPathFromElement(elem.element);

                if (elem.valueBindingPropertyName !== oldProp) {
                    hasChanged = true;
                }
            });
        }

        if (hasChanged) {
            this._formController.elementsLoaded(this._formElements);
        }
    }

    private addFormElement(htmlElement: HTMLElement): boolean {
        let hasChanged: boolean = false;

        let bindingPath = this.getBindingPathFromElement(htmlElement);

        if (bindingPath) {
            this._logger.debug("Adding Form Element: " + bindingPath);

            let formElement: FormControllerElement;
            this._formElements = this._formElements || [];

            formElement = new FormControllerElement();
            formElement.element = htmlElement;
            formElement.valueBindingPropertyName = bindingPath;
            formElement.pathObserver = new PathObserver(this._bindingEngine, this._formController, formElement.valueBindingPropertyName);

            formElement.pathObserver.subscribe(() => {
                this.elementUpdate(formElement, "valueChanged");
            });

            let blurListener: (event: FocusEvent) => any = () => this.elementUpdate(formElement, "lostFocus");
            htmlElement.addEventListener("blur", blurListener);

            formElement.elementListener = blurListener;

            this._formElements.push(formElement);

            hasChanged = true;
        }

        return hasChanged;
    }

    private removeFormElement(htmlElement: HTMLElement): boolean {
        let hasChanged: boolean = false;

        let bindingPath = this.getBindingPathFromElement(htmlElement);

        if (bindingPath) {
            this._logger.debug("Removing Form Element: " + bindingPath);

            let formControllerElement = this._formElements.find(elem => elem.element === htmlElement);

            if (formControllerElement) {
                this.removeFormControllerElement(formControllerElement);

                hasChanged = true;
            }
        }

        return hasChanged;
    }

    private removeFormControllerElement(formControllerElement: FormControllerElement) : void {
        formControllerElement.element.removeEventListener("blur", formControllerElement.elementListener);

        formControllerElement.pathObserver.dispose();

        let foundIndex = this._formElements.indexOf(formControllerElement);

        if (foundIndex >= 0) {
            this._formElements.splice(foundIndex, 1);
        }
    }

    private elementUpdate(formElement: FormControllerElement, method: string): void {
        this._formController.elementUpdate(formElement, method);
    }

    private disconnectFormElements(): void {
        for (let formElement in this._formElements) {
            this.removeFormControllerElement(this._formElements[formElement]);
        }
        this._formElements = undefined;
    }
}
