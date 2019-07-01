import {IValidationRule} from "./IValidationRule";
import {ValidationPropertyResult} from "./rules/validationPropertyResult";
import {ObjectHelper} from "../../../../common/core/objectHelper";
import {PassesRule} from "./rules/passesRule";

export class ValidationRuleProperty {
    private _propertyName: string;
    private _groups: string[];
    private _condition: () => boolean;
    private _validationRules: IValidationRule[];
    private _validationRuleMessages: (string | (() => string))[];
    private _message: string;

    constructor(propertyName: string) {
        this._propertyName = propertyName;
        this._groups = [];
        this._validationRules = [];
        this._validationRuleMessages = [];
    }

    public addCondition(condition: () => boolean) : void {
        this._condition = condition;
    }

    public addRule(validationRule: IValidationRule, message: (string | (() => string))) : void {
        this._validationRules.push(validationRule);
        this._validationRuleMessages.push(message);
    }

    public addGroups(groups: string[]) : void {
        if (groups) {
            this._groups = this._groups || [];
            this._groups = this._groups.concat(groups);
        }
    }

    public getGroups() : string[] {
        return this._groups;
    }

    public getValidationRules() : IValidationRule[] {
        return this._validationRules;
    }

    public getValidationRuleMessages() : (string | (() => string))[] {
        return this._validationRuleMessages;
    }

    public setMessage(message: string) : void {
        this._message = message;
    }

    public getMessage() : string {
        return this._message;
    }

    public requiresValidating() : boolean {
        let requiresValidating: boolean = true;

        if (this._condition && !this._condition()) {
            requiresValidating = false;
        }

        return requiresValidating;
    }

    public validate(subject: any) : Promise<ValidationPropertyResult> {
        let validationPropertyResult: ValidationPropertyResult = new ValidationPropertyResult();
        validationPropertyResult.property = this._propertyName;

        let requiresValidating: boolean = this.requiresValidating();

        if (requiresValidating && this._validationRules.length > 0) {
            let ruleCounter = 0;
            let value = ObjectHelper.getPathValue(subject, this._propertyName);

            let doNextRule = () : Promise<ValidationPropertyResult> => {
                return this._validationRules[ruleCounter].test(value)
                    .then((isValid) => {
                        validationPropertyResult.isValid = isValid;

                        if (!isValid) {
                            let isPasses: boolean = this._validationRules[ruleCounter] instanceof PassesRule;
                            if (this._message && !isPasses) {
                                validationPropertyResult.message = this._message;
                            } else {
                                if (this._validationRuleMessages[ruleCounter] instanceof Function) {
                                    validationPropertyResult.message = (<() => string>this._validationRuleMessages[ruleCounter])();
                                } else {
                                    validationPropertyResult.message = <string>this._validationRuleMessages[ruleCounter];
                                }
                            }

                            return validationPropertyResult;
                        } else {
                            ruleCounter++;
                            if (ruleCounter < this._validationRules.length) {
                                return doNextRule();
                            } else {
                                return validationPropertyResult;
                            }
                        }
                    });
            };

            return doNextRule();
        } else {
            validationPropertyResult.isValid = true;
            return Promise.resolve(validationPropertyResult);
        }
    }
}
