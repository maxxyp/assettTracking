import {IValidationRule} from "../IValidationRule";
// import {ArrayHelper} from "../../../../../common/core/arrayHelper";
import {StringHelper} from "../../../../../common/core/stringHelper";

export class HasLengthBetweenRule implements IValidationRule {
    private _minLength: number;
    private _maxLength: number;

    constructor(minLength: number, maxLength: number) {
        this._minLength = minLength;
        this._maxLength = maxLength;
    }

    public test(value: any): Promise<boolean> {
        if (value === null || value === undefined) {
            return Promise.resolve(false);
        } else {
            if (value.hasOwnProperty("length") === false) {
                value = StringHelper.isString(value) ? value : value.toString();
            }

            return Promise.resolve(value.length >= this._minLength && value.length <= this._maxLength);
        }
    }
}
