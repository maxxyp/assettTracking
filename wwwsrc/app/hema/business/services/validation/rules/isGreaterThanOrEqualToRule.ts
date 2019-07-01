import {IValidationRule} from "../IValidationRule";
import {NumberHelper} from "../../../../../common/core/numberHelper";

export class IsGreaterThanOrEqualToRule implements IValidationRule {
    private _min: number;

    constructor(min: number) {
        this._min = min;
    }

    public test(value: any): Promise<boolean> {
        let tryCoerce = NumberHelper.tryCoerceToNumber(value);
        if (!tryCoerce.isValid) {
            return Promise.resolve(false);
        } else {
            return Promise.resolve(tryCoerce.value >= this._min);
        }
    }
}
