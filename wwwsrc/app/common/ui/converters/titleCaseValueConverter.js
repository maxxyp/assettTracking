define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TitleCaseValueConverter = /** @class */ (function () {
        function TitleCaseValueConverter() {
        }
        TitleCaseValueConverter.prototype.toView = function (input) {
            if (input) {
                var output = input.replace(/([A-Z])/g, " $1");
                return output.charAt(0).toUpperCase() + output.substr(1, output.length);
            }
            else {
                return "";
            }
        };
        return TitleCaseValueConverter;
    }());
    exports.TitleCaseValueConverter = TitleCaseValueConverter;
});

//# sourceMappingURL=titleCaseValueConverter.js.map
