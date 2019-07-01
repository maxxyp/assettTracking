define(["require", "exports", "../../core/stringHelper"], function (require, exports, stringHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SanitizeSpecialCharactersValueConverter = /** @class */ (function () {
        function SanitizeSpecialCharactersValueConverter() {
        }
        SanitizeSpecialCharactersValueConverter.prototype.toView = function (value) {
            if (stringHelper_1.StringHelper.isString(value)) {
                value = stringHelper_1.StringHelper.sanitizeSpecialCharacters(value);
            }
            return value;
        };
        return SanitizeSpecialCharactersValueConverter;
    }());
    exports.SanitizeSpecialCharactersValueConverter = SanitizeSpecialCharactersValueConverter;
});

//# sourceMappingURL=sanitizeSpecialCharactersValueConverter.js.map
