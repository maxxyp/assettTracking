define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LimitValueConverter = /** @class */ (function () {
        function LimitValueConverter() {
        }
        LimitValueConverter.prototype.toView = function (array, count) {
            if (array) {
                return array.slice(0, count);
            }
            else {
                return [];
            }
        };
        return LimitValueConverter;
    }());
    exports.LimitValueConverter = LimitValueConverter;
});

//# sourceMappingURL=limitValueConverter.js.map
