import {IValidationRule} from "../IValidationRule";
import {DateHelper} from "../../../../core/dateHelper";

export class IsDateRule implements IValidationRule {
    public test(value: any): Promise<boolean> {
        return Promise.resolve(DateHelper.isDate(value) && DateHelper.isValidDate(value));
    }
}
