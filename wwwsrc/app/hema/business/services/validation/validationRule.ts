import {IRuleOptions} from "./IRuleOptions";

export class ValidationRule implements IRuleOptions {
    public property: string;
    public required: boolean | (() => boolean);
    public minLength: number;
    public maxLength: number;
    public min: number;
    public max: number;
    public allowEmpty?: boolean;
    public isNumber: boolean;
    public isDate: boolean;
    public minDate: string;
    public maxDate: string;
    public message: string;
    public regExp: string;
    public regExpError: string;
    public groups: string[];
    public isAlphaNumeric: boolean;
    public isBaseRule: boolean;
}
