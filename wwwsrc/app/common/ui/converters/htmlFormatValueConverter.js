define(["require", "exports", "../../core/stringHelper"], function (require, exports, stringHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HtmlFormatValueConverter = /** @class */ (function () {
        function HtmlFormatValueConverter() {
        }
        HtmlFormatValueConverter.prototype.toView = function (value) {
            if (stringHelper_1.StringHelper.isString(value)) {
                value = value
                    .replace(/\r/gi, "")
                    .replace(/\n/gi, "<br />")
                    .replace(/&/gi, "&amp;");
            }
            return value;
        };
        return HtmlFormatValueConverter;
    }());
    exports.HtmlFormatValueConverter = HtmlFormatValueConverter;
});

//# sourceMappingURL=htmlFormatValueConverter.js.map
