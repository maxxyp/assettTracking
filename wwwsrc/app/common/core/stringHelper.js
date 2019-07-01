define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StringHelper = /** @class */ (function () {
        function StringHelper() {
        }
        StringHelper.toCamelCase = function (val) {
            return val && val.length > 0 ? val.substr(0, 1).toLowerCase() + val.substr(1) : val;
        };
        StringHelper.toSnakeCase = function (val) {
            return val && val.length > 0 ? StringHelper.toCamelCase(val).replace(/([A-Z])/g, function (p1) {
                return "-" + p1;
            }).toLowerCase() : val;
        };
        StringHelper.isString = function (value) {
            return value === null || value === undefined ? false : Object.prototype.toString.call(value) === "[object String]";
        };
        StringHelper.startsWith = function (value, test) {
            if (StringHelper.isString(value) &&
                StringHelper.isString(test) &&
                test.length > 0 &&
                value.length >= test.length) {
                return value.substr(0, test.length) === test;
            }
            else {
                return false;
            }
        };
        StringHelper.endsWith = function (value, test) {
            if (StringHelper.isString(value) &&
                StringHelper.isString(test) &&
                test.length > 0 &&
                value.length >= test.length) {
                return value.substr(value.length - test.length) === test;
            }
            else {
                return false;
            }
        };
        StringHelper.padLeft = function (value, pad, padLength) {
            if (StringHelper.isString(value) && StringHelper.isString(pad) && pad.length > 0 && padLength > value.length) {
                var extra = "";
                while ((extra.length + value.length) < padLength) {
                    extra += pad;
                }
                value = extra.substr(0, padLength - value.length) + value;
            }
            return value;
        };
        StringHelper.padRight = function (value, pad, padLength) {
            if (StringHelper.isString(value) && StringHelper.isString(pad) && pad.length > 0 && padLength > value.length) {
                var extra = "";
                while ((extra.length + value.length) < padLength) {
                    extra += pad;
                }
                value = value + extra.substr(0, padLength - value.length);
            }
            return value;
        };
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
        StringHelper.splice = function (str, start, delCount, subStr) {
            return str.slice(0, start) + subStr + str.slice(start + Math.abs(delCount));
        };
        StringHelper.sanitizeSpecialCharacters = function (value) {
            if (!value) {
                return "";
            }
            return value = value
                .replace(/</gi, "")
                .replace(/>/gi, "");
        };
        StringHelper.pluralise = function (val, singularStr) {
            if (val === undefined) {
                return singularStr;
            }
            var returnStr = val + " " + singularStr;
            if (val > 1 || val === 0) {
                return returnStr + "s";
            }
            return returnStr;
        };
        StringHelper.isEmptyOrUndefinedOrNull = function (value) {
            return value === undefined || value === null || value.trim().length === 0;
        };
        return StringHelper;
    }());
    exports.StringHelper = StringHelper;
});

//# sourceMappingURL=stringHelper.js.map
