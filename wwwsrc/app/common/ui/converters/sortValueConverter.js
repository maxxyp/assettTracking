define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SortValueConverter = /** @class */ (function () {
        function SortValueConverter() {
        }
        SortValueConverter.prototype.toView = function (array, propertyName, direction) {
            if (array && array.length > 0) {
                var factor_1 = (direction || "ascending") === "ascending" ? 1 : -1;
                if (propertyName) {
                    if (array[0].hasOwnProperty(propertyName)) {
                        return array
                            .slice(0)
                            .sort(function (a, b) {
                            return (a[propertyName] >= b[propertyName] ? 1 : -1) * factor_1;
                        });
                    }
                    else {
                        return array;
                    }
                }
                else {
                    return array
                        .slice(0)
                        .sort(function (a, b) {
                        return (a >= b ? 1 : -1) * factor_1;
                    });
                }
            }
            else {
                return [];
            }
        };
        return SortValueConverter;
    }());
    exports.SortValueConverter = SortValueConverter;
});

//# sourceMappingURL=sortValueConverter.js.map
