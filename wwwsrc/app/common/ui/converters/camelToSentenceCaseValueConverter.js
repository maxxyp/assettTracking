define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CamelToSentenceCaseValueConverter = /** @class */ (function () {
        function CamelToSentenceCaseValueConverter() {
        }
        CamelToSentenceCaseValueConverter.prototype.toView = function (input) {
            if (input) {
                return input
                    .replace(/([a-z])([A-Z])/g, "$1 $2")
                    .replace(/([A-Z])([a-z])/g, " $1$2")
                    .replace(/\ +/g, " ");
            }
            else {
                return "";
            }
        };
        return CamelToSentenceCaseValueConverter;
    }());
    exports.CamelToSentenceCaseValueConverter = CamelToSentenceCaseValueConverter;
});

//# sourceMappingURL=camelToSentenceCaseValueConverter.js.map
