import {IValidationRule} from "../IValidationRule";
import {StringHelper} from "../../../../../common/core/stringHelper";
import {DateHelper} from "../../../../core/dateHelper";

export class RequiredRule implements IValidationRule {
    private _required: boolean | (() => boolean);

    public setRequired(required: boolean | (() => boolean)) : void {
        this._required = required;
    }

    public test(value: any): Promise<boolean> {
        let isRequired = true;

        if (this._required !== undefined) {
            if (this._required instanceof Function) {
                isRequired = (<() => boolean>this._required)();
            } else {
                isRequired = <boolean>this._required;
            }
        }

        if (isRequired) {
            return Promise.resolve(value !== null &&
                value !== undefined &&
                !(StringHelper.isString(value) && !/\S/.test(value)) &&
                !(DateHelper.isDate(value) && !DateHelper.isValidDate(value)));
        } else {
            return Promise.resolve(true);
        }
    }
}
