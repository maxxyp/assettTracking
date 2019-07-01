import {IValidationRule} from "../IValidationRule";

export class RegExpRule implements IValidationRule {
    private _regExp: RegExp;

    constructor(regExp: RegExp) {
        this._regExp = regExp;
    }

    public test(value: any): Promise<boolean> {
        return Promise.resolve(this._regExp.test(value));
    }
}
