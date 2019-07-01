define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NumberHelper = /** @class */ (function () {
        function NumberHelper() {
        }
        NumberHelper.isNumber = function (value) {
            if (value === null || value === undefined) {
                return false;
            }
            else {
                return typeof value === "number" && !isNaN(value) && isFinite(value);
            }
        };
        NumberHelper.coerceToNumber = function (value) {
            if (value === undefined) {
                return undefined;
            }
            else if (value === null) {
                return null;
            }
            else {
                var floatValue = parseFloat(value);
                return !isNaN(floatValue) && isFinite(floatValue) ? floatValue : undefined;
            }
        };
        NumberHelper.canCoerceToNumber = function (value) {
            if (value === null || value === undefined) {
                return false;
            }
            else if (isNaN(value)) {
                return false;
            }
            else {
                var floatValue = parseFloat(value);
                return !isNaN(floatValue) && isFinite(floatValue);
            }
        };
        NumberHelper.tryCoerceToNumber = function (value) {
            if (value === null || value === undefined) {
                return { isValid: false, value: value };
            }
            else if (isNaN(value)) {
                return { isValid: false, value: undefined };
            }
            else {
                var floatValue = parseFloat(value);
                var isValid = !isNaN(floatValue) && isFinite(floatValue);
                return { isValid: isValid, value: isValid ? floatValue : undefined };
            }
        };
        return NumberHelper;
    }());
    exports.NumberHelper = NumberHelper;
});

//# sourceMappingURL=numberHelper.js.map
