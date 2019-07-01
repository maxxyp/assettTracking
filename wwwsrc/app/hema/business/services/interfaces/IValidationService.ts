import {ValidationController} from "../validation/validationController";
import {ValidationCombinedResult} from "../validation/validationCombinedResult";
import {IDynamicRule} from "../validation/IDynamicRule";

export interface IValidationService {
    build(subject: any, key: string, dynamicRules: IDynamicRule[]): Promise<ValidationController>;

    addDynamicRule(validationController: ValidationController, dynamicRule: IDynamicRule): void;
    removeDynamicRule(validationController: ValidationController, propertyName: string): void;

    validate(validationController: ValidationController, subject: any, propertyName?: string) : Promise<ValidationCombinedResult>;
}
