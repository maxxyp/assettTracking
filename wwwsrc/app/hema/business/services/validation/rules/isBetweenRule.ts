import {IValidationRule} from "../IValidationRule";
import {NumberHelper} from "../../../../../common/core/numberHelper";

export class IsBetweenRule implements IValidationRule {
    private _min: number;
    private _max: number;
    private _allowEmpty: boolean;

    constructor(min: number, max: number, allowEmpty: boolean) {
        this._min = min;
        this._max = max;
        this._allowEmpty = allowEmpty;
    }

    public test(value: any): Promise<boolean> {
        if (this._allowEmpty && (value === undefined || value === null)) {
            return Promise.resolve(true);
        }
        let tryCoerce = NumberHelper.tryCoerceToNumber(value);
        if (!tryCoerce.isValid) {
            return Promise.resolve(false);
        } else {
            return Promise.resolve(tryCoerce.value >= this._min && tryCoerce.value <= this._max);
        }
    }
}
