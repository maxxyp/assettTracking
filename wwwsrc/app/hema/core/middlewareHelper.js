define(["require", "exports", "../business/models/yesNoNa"], function (require, exports, yesNoNa_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MiddlewareHelper = /** @class */ (function () {
        function MiddlewareHelper() {
        }
        MiddlewareHelper.getYNForBoolean = function (value, defaultValue) {
            return value === true ? "Y" : value === false ? "N" : defaultValue;
        };
        MiddlewareHelper.getBooleanForYNX = function (value, defaultValue) {
            if (value === "Y") {
                return true;
            }
            else if (value === "N") {
                return false;
            }
            return defaultValue || undefined;
        };
        MiddlewareHelper.removeAllControlCharacters = function (value) {
            if (!value) {
                return value;
            }
            return value.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
        };
        MiddlewareHelper.getYNXForYesNoNa = function (value, defaultValue) {
            switch (value) {
                case yesNoNa_1.YesNoNa.Yes:
                    return "Y";
                case yesNoNa_1.YesNoNa.No:
                    return "N";
                case yesNoNa_1.YesNoNa.Na:
                    return "X";
                default:
                    return defaultValue;
            }
        };
        MiddlewareHelper.getPFXForYesNoNa = function (value, defaultValue) {
            if (defaultValue === void 0) { defaultValue = undefined; }
            switch (value) {
                case yesNoNa_1.YesNoNa.Yes:
                    return "P";
                case yesNoNa_1.YesNoNa.No:
                    return "F";
                case yesNoNa_1.YesNoNa.Na:
                    return "X";
                default:
                    return defaultValue;
            }
        };
        return MiddlewareHelper;
    }());
    exports.MiddlewareHelper = MiddlewareHelper;
});

//# sourceMappingURL=middlewareHelper.js.map
