import {ValidationPropertyResult} from "./rules/validationPropertyResult";

export class ValidationCombinedResult {
    public isValid: boolean;
    public propertyResults: { [key: string] : ValidationPropertyResult};
    public groups: string[];
}
