import {IValidationRule} from "../IValidationRule";
import {DateHelper} from "../../../../core/dateHelper";
import * as moment from "moment";

export class IsLessThanOrEqualToDateRule implements IValidationRule {
    private _max: Date;

    constructor(max: Date) {
        this._max = max;
    }

    public test(value: any): Promise<boolean> {
        if (!DateHelper.isDate(value) || !DateHelper.isValidDate(value)) {
            return Promise.resolve(false);
        } else {
            let maxDate = moment(this._max);
            let valueDate = moment(value);

            return Promise.resolve(valueDate.isBefore(maxDate) || valueDate.isSame(maxDate));
        }
    }
}
