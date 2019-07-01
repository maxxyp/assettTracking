define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChargeTypeToServiceLevelCodeValueConverter = /** @class */ (function () {
        function ChargeTypeToServiceLevelCodeValueConverter() {
        }
        ChargeTypeToServiceLevelCodeValueConverter.prototype.toView = function (value) {
            // return the part of the string starting from the first numeric digit, including the digit
            var matches = /^[^\d]*(\d.*)/.exec(value);
            return (matches || []).length >= 2
                ? matches[1]
                : null;
        };
        return ChargeTypeToServiceLevelCodeValueConverter;
    }());
    exports.ChargeTypeToServiceLevelCodeValueConverter = ChargeTypeToServiceLevelCodeValueConverter;
});

//# sourceMappingURL=chargeTypeToServiceLevelCodeValueConverter.js.map
