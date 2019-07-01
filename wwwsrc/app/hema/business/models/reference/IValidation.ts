export interface IValidation {
   key: string;
   viewModel: string;
   property: string;
   required: boolean;
   minLength: number;
   maxLength: number;
   min: number;
   max: number;
   allowEmpty: boolean;
   isNumber: boolean;
   isDate: boolean;
   minDate: string;
   maxDate: string;
   message: string;
   regExp: string;
   regExpError: string;
   groups: string;
   isAlphaNumeric: boolean;
   isBaseRule: boolean;
   ctlgEntDelnMkr: string;
}
