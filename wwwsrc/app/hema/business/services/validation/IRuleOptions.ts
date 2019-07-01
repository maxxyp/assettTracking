export interface IRuleOptions {
    property: string | (() => string);
    required?: boolean | (() => boolean);
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    allowEmpty?: boolean;
    isNumber?: boolean;
    isDate?: boolean;
    minDate?: string;
    maxDate?: string;
    message?: string;
    regExp?: string;
    regExpError?: string;
    groups?: string[];
    isAlphaNumeric?: boolean;
    isBaseRule?: boolean;
}
