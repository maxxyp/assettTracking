
import { IValidationService } from "../../business/services/interfaces/IValidationService";
import { ILabelService } from "../../business/services/interfaces/ILabelService";
import { BaseViewModel } from "./baseViewModel";
import { BusinessException } from "../../business/models/businessException";
import { IFormController } from "../../../common/ui/attributes/IFormController";
import { FormControllerElement } from "../../../common/ui/attributes/formControllerElement";
import { ValidationController } from "../../business/services/validation/validationController";
import { IDynamicRule } from "../../business/services/validation/IDynamicRule";
import { ValidationCombinedResult } from "../../business/services/validation/validationCombinedResult";
import { EventAggregator } from "aurelia-event-aggregator";
import { ObjectHelper } from "../../../common/core/objectHelper";
import { StringHelper } from "../../../common/core/stringHelper";
import { DialogService } from "aurelia-dialog";
import { DomHelper } from "../../../common/ui/domHelper";
import { ValidationRule } from "../../business/services/validation/validationRule";

export abstract class ValidatableViewModel extends BaseViewModel implements IFormController {
    public validationRules: { [key: string]: ValidationRule };

    protected _isDirty: boolean;
    protected _lastDataLoadTime: number;

    protected _validationService: IValidationService;
    protected _validationController: ValidationController;

    private _enableValidation: boolean;
    private _formElements: FormControllerElement[];

    constructor(labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        validationService: IValidationService) {
        super(labelService, eventAggregator, dialogService);

        this._validationService = validationService;
        this._isDirty = false;
        this._lastDataLoadTime = 0;
        this._enableValidation = false;
        this.validationRules = {};
    }

    public buildValidation(dynamicRules?: IDynamicRule[]): Promise<void> {
        return this._validationService.build(this, StringHelper.toCamelCase(ObjectHelper.getClassName(this)), dynamicRules).then((validationController) => {
            if (validationController) {
                this._validationController = validationController;
                this.validationRules = validationController.staticRules;
            }
            return this.validateAllRules();
        });
    }

    public detached(): Promise<void> {
        return super.detached()
            .then(() => {
                this._validationController = null;
            });
    }

    public getValidationRule(ruleKey: string): ValidationRule {
        if (!this.validationRules[ruleKey]) {
            throw new BusinessException(this, "getValidationRule", "Unable to get rule '{0}' for viewModel '{1}'", [ruleKey, ObjectHelper.getClassName(this)], null);
        }

        return this.validationRules[ruleKey];
    }

    public validationManual(): void {
        this.validationToggle(true);
        this._lastDataLoadTime = new Date().getTime();
    }

    public validationToggle(enable: boolean): void {
        this._enableValidation = enable;
    }

    public getValidationEnabled(): boolean {
        return this._enableValidation;
    }

    public validateAllRules(): Promise<void> {
        if (this._validationController) {
            // .DF_1149 - only validate if the page has loaded
            let readyToValidate = this._enableValidation && this._lastDataLoadTime && this.pageReadyToValidate();

            if (readyToValidate) {
                return this._validationService.validate(this._validationController, this, null)
                    .then((validationCombinedResult) => {

                        this.toggleErrors(validationCombinedResult);

                        return this.updateLiveDataState(validationCombinedResult.isValid)
                            .then(() => {
                                this.validationUpdated(validationCombinedResult);
                            });

                    });
            } else {
                return this.validationClearDisplay();
            }
        } else {
            return Promise.resolve();
        }
    }
    public checkAllRules(): Promise<boolean> {
        if (this._validationController) {
                return this._validationService.validate(this._validationController, this, null)
                    .then((validationCombinedResult) => {
                        return validationCombinedResult.isValid;
                    });
        } else {
            return Promise.resolve(false);
        }
    }

    public validateSingleRule(property: string): Promise<ValidationCombinedResult> {
        if (this._validationController && this._enableValidation) {
            return this._validationService.validate(this._validationController, this, property)
                .then((validationCombinedResult) => {

                    this.toggleErrors(validationCombinedResult);

                    this.validationUpdated(validationCombinedResult);

                    return this.updateLiveDataState(undefined)
                        .then(() => {
                            return validationCombinedResult;
                        });
                });
        } else {
            return Promise.resolve(null);
        }
    }

    public validationClearDisplay(): Promise<void> {
        if (this._validationController && this._formElements) {
            this._formElements.forEach(elem => {
                this.toggleError(elem, true, "");
            });
        }
        return Promise.resolve();
    }

    public validationClearGroup(groupName: string): Promise<void> {
        if (this._validationController && this._formElements) {
            this._formElements.forEach(elem => {
                if (this._validationController.validationRuleGroups[groupName]) {
                    if (this._validationController.validationRuleGroups[groupName].find(x => x === elem.valueBindingPropertyName)) {
                        this.toggleError(elem, true, "");
                    }
                }
            });
        }
        return Promise.resolve();
    }

    public validationClearItem(propertyName: string): Promise<void> {
        if (this._validationController && this._formElements) {
            if (StringHelper.endsWith(propertyName, "*")) {
                let startsWith = propertyName.substr(0, propertyName.length - 1);
                let formControllerElements = this._formElements.filter(fe => StringHelper.startsWith(fe.valueBindingPropertyName, startsWith));
                if (formControllerElements) {
                    formControllerElements.forEach((formControllerElement) => {
                        this.toggleError(formControllerElement, true, "");
                    });
                }
            } else {
                let formControllerElement = this._formElements.find(fe => fe.valueBindingPropertyName === propertyName);
                if (formControllerElement) {
                    this.toggleError(formControllerElement, true, "");
                }
            }
        }
        return Promise.resolve();
    }

    public elementsLoaded(formElements: FormControllerElement[]): void {
        this._formElements = formElements;
        this.validateAllRules();
    }

    public elementUpdate(formElement: FormControllerElement, method: string): void {
        /* clearing data can often lead to property changes so we don't want
         * to revalidate straight away, give the UI a short time to complete its updates
         * this is also the case when the data has been initially loaded */
        if (this._lastDataLoadTime > 0) {
            let timeNow = new Date().getTime();
            if (timeNow - this._lastDataLoadTime > 500) {
                if (this._isDirty) {
                    this.validateSingleRule(formElement.valueBindingPropertyName);
                } else {
                    // .DF_1149 on first touch validate everything, otherwise we may get an overall currentDataState of invalid
                    //  but with no asterisks showing on other fields
                    this.setDirty(true);
                    this.validateAllRules();
                }
            }
        }
    }

    public setDirty(isDirty: boolean): void {
        this._isDirty = isDirty;
    }

    protected validationUpdated(validationCombinedResult: ValidationCombinedResult): void {
    }

    protected isValidChanged(isValid: boolean): void {
    }

    // overridden in editableViewModel
    protected pageReadyToValidate(): boolean {
        return true;
    }

    private updateLiveDataState(isValid: boolean): Promise<void> {
        let p: Promise<boolean>;
        if (isValid === undefined) {
            p = this._validationService.validate(this._validationController, this, null)
                .then((combinedResult) => combinedResult.isValid);
        } else {
            p = Promise.resolve(isValid);
        }

        return p.then((finalIsValid) => {
            this.isValidChanged(finalIsValid);
        });
    }

    private toggleErrors(validationCombinedResult: ValidationCombinedResult): void {
        if (validationCombinedResult && this._formElements) {
            for (let property in validationCombinedResult.propertyResults) {
                let formControllerElement = this._formElements.find(elem => elem.valueBindingPropertyName === property);
                if (formControllerElement) {
                    this.toggleError(formControllerElement, validationCombinedResult.propertyResults[property].isValid, validationCombinedResult.propertyResults[property].message);
                }
            }
        }
    }

    private toggleError(formControllerElement: FormControllerElement, isValid: boolean, message: string): void {
        let formGroup = DomHelper.closest(formControllerElement.element, ".form-group");
        if (formGroup) {
            if (isValid) {
                formGroup.classList.remove("has-warning");
            } else {
                formGroup.classList.add("has-warning");
            }

            let customBlock: HTMLElement;

            /* see if the dev has provided a custom error position block, if so use that for messages */
            let customBlocks = formGroup.getElementsByClassName("validation-custom");
            if (customBlocks && customBlocks.length > 0) {
                customBlock = <HTMLElement>customBlocks[0];
            }

            let labels = formGroup.getElementsByTagName("label");

            if (labels && labels.length > 0) {
                let labelContainer = labels[0].parentElement;

                let spans = labelContainer.getElementsByClassName("help-block validation-message");
                let requiredSpan: Element = null;
                let helpSpan: Element = null;
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
                    let errorMessageElement = this.getElementByClassName(formGroup, "requiredFieldMessag");
                    if (errorMessageElement) {
                        errorMessageElement.remove();
                    }
                } else {
                    /* dont add the message block if this is only a required message, and there is no custom block to show it */
                    if (!requiredSpan) {
                        requiredSpan = document.createElement("span");
                        requiredSpan.className = "help-block validation-message validation-required-marker";

                        if (formGroup.children[1]) {
                            let errorMessageElement = this.getElementByClassName(formGroup, "requiredFieldMessag");
                            if (!errorMessageElement) {
                                let requireFieldMessage = document.createElement("span");
                                requireFieldMessage.className = "requiredFieldMessag help-block validation-message validation-required-marker";
                                let iconElement = document.createElement("i");
                                iconElement.className = "fa fa-exclamation-triangle";
                                requireFieldMessage.appendChild(iconElement);
                                let messageText = document.createElement("span");
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
                    } else {
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
    }

    private getElementByClassName(rootElement: Element, classNameSearch: string): Element {
        if (rootElement.children[1] && rootElement.children[1].children) {
            for (let i: number = 0; i < rootElement.children[1].children.length; i++) {
                if (rootElement.children[1].children[i] && rootElement.children[1].children[i].className.indexOf(classNameSearch) > -1) {
                    return rootElement.children[1].children[i];
                }
            }
        }
        return undefined;
    }
}
