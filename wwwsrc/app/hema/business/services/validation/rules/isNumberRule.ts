import {IValidationRule} from "../IValidationRule";
import {NumberHelper} from "../../../../../common/core/numberHelper";

export class IsNumberRule implements IValidationRule {
    public test(value: any): Promise<boolean> {
        return Promise.resolve(NumberHelper.canCoerceToNumber(value));
    }
}
