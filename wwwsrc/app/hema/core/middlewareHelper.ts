import { YesNoNa } from "../business/models/yesNoNa";

export class MiddlewareHelper {
    public static getYNForBoolean(value: boolean, defaultValue: string): string {
        return value === true ? "Y" : value === false ? "N" : defaultValue;
    }

    public static getBooleanForYNX(value: string, defaultValue?: boolean): boolean {
        if (value === "Y") {
            return true;
        } else if (value === "N") {
            return false;
        }
        return defaultValue || undefined;
    }

    public static removeAllControlCharacters(value: string): string {
        if (!value) {
            return value;
        }
        return value.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
    }

    public static getYNXForYesNoNa(value: YesNoNa, defaultValue: string): string {
        switch (value) {
            case YesNoNa.Yes:
                return "Y";
            case YesNoNa.No:
                return "N";
            case YesNoNa.Na:
                return "X";
            default:
                return defaultValue;
        }
    }

    public static getPFXForYesNoNa(value: YesNoNa, defaultValue: string = undefined): string {
        switch (value) {
            case YesNoNa.Yes:
                return "P";
            case YesNoNa.No:
                return "F";
            case YesNoNa.Na:
                return "X";
            default:
                return defaultValue;
        }
    }    
}
