define(["require", "exports", "../../../common/core/stringHelper"], function (require, exports, stringHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EngineerStatusStyleValueConverter = /** @class */ (function () {
        function EngineerStatusStyleValueConverter() {
        }
        EngineerStatusStyleValueConverter.prototype.toView = function (value) {
            return stringHelper_1.StringHelper.isString(value) ? "hema-icon-" + stringHelper_1.StringHelper.toSnakeCase(value) : "";
        };
        return EngineerStatusStyleValueConverter;
    }());
    exports.EngineerStatusStyleValueConverter = EngineerStatusStyleValueConverter;
});

//# sourceMappingURL=engineerStatusStyleValueConverter.js.map
