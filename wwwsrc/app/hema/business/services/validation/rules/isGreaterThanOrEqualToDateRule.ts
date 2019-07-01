import {IValidationRule} from "../IValidationRule";
import {DateHelper} from "../../../../core/dateHelper";
import * as moment from "moment";

export class IsGreaterThanOrEqualToDateRule implements IValidationRule {
    private _min: Date;

    constructor(min: Date) {
        this._min = min;
    }

    public test(value: any): Promise<boolean> {
        if (!DateHelper.isDate(value) || !DateHelper.isValidDate(value)) {
            return Promise.resolve(false);
        } else {
            let minDate = moment(this._min);
            let valueDate = moment(value);

            return Promise.resolve(valueDate.isAfter(minDate) || valueDate.isSame(minDate));
        }
    }
}
