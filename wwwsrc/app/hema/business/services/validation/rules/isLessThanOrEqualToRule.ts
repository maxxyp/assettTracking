import {IValidationRule} from "../IValidationRule";
import {NumberHelper} from "../../../../../common/core/numberHelper";

export class IsLessThanOrEqualToRule implements IValidationRule {
    private _max: number;

    constructor(max: number) {
        this._max = max;
    }

    public test(value: any): Promise<boolean> {
        let tryCoerce = NumberHelper.tryCoerceToNumber(value);
        if (!tryCoerce.isValid) {
            return Promise.resolve(false);
        } else {
            return Promise.resolve(tryCoerce.value <= this._max);
        }
    }
}
