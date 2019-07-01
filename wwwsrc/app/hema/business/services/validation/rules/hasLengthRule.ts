import {IValidationRule} from "../IValidationRule";
import {StringHelper} from "../../../../../common/core/stringHelper";

export class HasLengthRule implements IValidationRule {
    private _length: number;

    constructor(length: number) {
        this._length = length;
    }

    public test(value: any): Promise<boolean> {
        if (value === null || value === undefined) {
            return Promise.resolve(false);
        } else {
            if (value.hasOwnProperty("length") === false) {
                value = StringHelper.isString(value) ? value : value.toString();
            }

            return Promise.resolve(value.length === this._length);
        }
    }
}
