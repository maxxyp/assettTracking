import {IValidationRule} from "../IValidationRule";
import {DateHelper} from "../../../../core/dateHelper";
import * as moment from "moment";

export class IsBetweenDateRule implements IValidationRule {
    private _min: Date;
    private _max: Date;

    constructor(min: Date, max: Date) {
        this._min = min;
        this._max = max;
    }

    public test(value: any): Promise<boolean> {
        if (!DateHelper.isDate(value) || !DateHelper.isValidDate(value)) {
            return Promise.resolve(false);
        } else {
            let minDate = moment(this._min);
            let maxDate = moment(this._max);
            let valueDate = moment(value);

            return Promise.resolve((valueDate.isAfter(minDate) || valueDate.isSame(minDate)) &&
                                    (valueDate.isBefore(maxDate) || valueDate.isSame(maxDate)));
        }
    }
}
