import {FormControllerElement} from "./formControllerElement";

export interface IFormController {
    elementsLoaded(formElements: FormControllerElement[]) : void;
    elementUpdate(formElement: FormControllerElement, method: string) : void;
}
