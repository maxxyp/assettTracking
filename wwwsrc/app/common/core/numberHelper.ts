export class NumberHelper {
    public static isNumber(value: any): boolean {
        if (value === null || value === undefined) {
            return false;
        } else {
            return typeof value === "number" && !isNaN(value) && isFinite(value);
        }
    }

    public static coerceToNumber(value: any): number {
        if (value === undefined) {
            return undefined;
        } else if (value === null) {
            return null;
        } else {
            let floatValue = parseFloat(value);
            return !isNaN(floatValue) && isFinite(floatValue) ? floatValue : undefined;
        }
    }

    public static canCoerceToNumber(value: any): boolean {
        if (value === null || value === undefined) {
            return false;
        } else if (isNaN(value)) {
            return false;
        } else {
            let floatValue = parseFloat(value);
            return !isNaN(floatValue) && isFinite(floatValue);
        }
    }

    public static tryCoerceToNumber(value: any): { isValid: boolean; value: number } {
        if (value === null || value === undefined) {
            return { isValid: false, value: value };
        } else if (isNaN(value)) {
            return { isValid: false, value: undefined };
        } else {
            let floatValue = parseFloat(value);
            let isValid = !isNaN(floatValue) && isFinite(floatValue);
            return { isValid: isValid, value: isValid ? floatValue : undefined };
        }
    }
}
