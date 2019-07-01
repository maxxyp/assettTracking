import {IValidationRule} from "../IValidationRule";
import {StringHelper} from "../../../../../common/core/stringHelper";

export class HasMaxLengthRule implements IValidationRule {
    private _maxLength: number;

    constructor(maxLength: number) {
        this._maxLength = maxLength;
    }

    public test(value: any): Promise<boolean> {
        if (value === null || value === undefined) {
            return Promise.resolve(false);
        } else {
            if (value.hasOwnProperty("length") === false) {
                value = StringHelper.isString(value) ? value : value.toString();
            }

            return Promise.resolve(value.length <= this._maxLength);
        }
    }
}
