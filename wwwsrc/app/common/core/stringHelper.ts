export class StringHelper {
    public static toCamelCase(val: string): string {
        return val && val.length > 0 ? val.substr(0, 1).toLowerCase() + val.substr(1) : val;
    }

    public static toSnakeCase(val: string): string {
        return val && val.length > 0 ? StringHelper.toCamelCase(val).replace(/([A-Z])/g, (p1: string) => {
            return "-" + p1;
        }).toLowerCase() : val;
    }

    public static isString(value: any): boolean {
        return value === null || value === undefined ? false : Object.prototype.toString.call(value) === "[object String]";
    }

    public static startsWith(value: string, test: string): boolean {
        if (StringHelper.isString(value) &&
            StringHelper.isString(test) &&
            test.length > 0 &&
            value.length >= test.length) {
            return value.substr(0, test.length) === test;
        } else {
            return false;
        }
    }

    public static endsWith(value: string, test: string): boolean {
        if (StringHelper.isString(value) &&
            StringHelper.isString(test) &&
            test.length > 0 &&
            value.length >= test.length) {
            return value.substr(value.length - test.length) === test;
        } else {
            return false;
        }
    }

    public static padLeft(value: string, pad: string, padLength: number): string {
        if (StringHelper.isString(value) && StringHelper.isString(pad) && pad.length > 0 && padLength > value.length) {
            let extra = "";

            while ((extra.length + value.length) < padLength) {
                extra += pad;
            }

            value = extra.substr(0, padLength - value.length) + value;
        }

        return value;
    }

    public static padRight(value: string, pad: string, padLength: number): string {
        if (StringHelper.isString(value) && StringHelper.isString(pad) && pad.length > 0 && padLength > value.length) {
            let extra = "";

            while ((extra.length + value.length) < padLength) {
                extra += pad;
            }

            value = value + extra.substr(0, padLength - value.length);
        }

        return value;
    }

    /*
    * 
    * The splice() method changes the content of a string by removing a range of
    * for e.g. StringHelper.splice("foo baz", 4, 0, "bar") returns "foo bar baz"
    * characters and/or adding new characters.
    * start: start Index at which to start changing the String
    * delCount: number of old chars to remove.
    * subStr: the string that is spliced in.
    * return : new string value;
    */
    public static splice(str: string, start: number, delCount: number, subStr: string): string {
        return str.slice(0, start) + subStr + str.slice(start + Math.abs(delCount));
    }

    public static sanitizeSpecialCharacters(value: string): string {
        if (!value) {
            return "";
        }
        return value = value
            .replace(/</gi, "")
            .replace(/>/gi, "");
    }

    public static pluralise(val: number, singularStr: string): string {

        if (val === undefined) {
            return singularStr;
        }

        let returnStr = `${val} ${singularStr}`;

        if (val > 1 || val === 0) {
            return `${returnStr}s`;
        }

        return returnStr;
    }

    public static isEmptyOrUndefinedOrNull(value: string): boolean {
        return value === undefined || value === null || value.trim().length === 0;
    }
}
