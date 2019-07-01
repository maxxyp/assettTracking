define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GetTypeValueConverter = /** @class */ (function () {
        function GetTypeValueConverter() {
        }
        GetTypeValueConverter.prototype.toView = function (obj) {
            if (obj) {
                return Array.isArray(obj) ? "array" : typeof obj;
            }
            return null;
        };
        return GetTypeValueConverter;
    }());
    exports.GetTypeValueConverter = GetTypeValueConverter;
});

//# sourceMappingURL=getTypeValueConverter.js.map
