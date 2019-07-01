import {IValidationRule} from "../IValidationRule";

export class PassesRule implements IValidationRule {
    private _passes: () => boolean | Promise<boolean>;

    constructor(passes: () => boolean | Promise<boolean>) {
        this._passes = passes;
    }

    public test(value: any): Promise<boolean> {
        return Promise.resolve(this._passes());
    }
}
