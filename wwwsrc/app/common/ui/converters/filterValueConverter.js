define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FilterValueConverter = /** @class */ (function () {
        function FilterValueConverter() {
        }
        FilterValueConverter.prototype.toView = function (array, property, exp) {
            if (array && exp) {
                if (property) {
                    var splitSearchString_1 = exp.split(" ");
                    return array.filter(function (item) {
                        var searchCount = 0;
                        for (var _i = 0, splitSearchString_2 = splitSearchString_1; _i < splitSearchString_2.length; _i++) {
                            var searchItem = splitSearchString_2[_i];
                            if (item[property].toLowerCase()
                                .indexOf(searchItem.toLowerCase()) > -1) {
                                searchCount++;
                            }
                        }
                        if (searchCount === splitSearchString_1.length) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    });
                }
                else {
                    var splitSearchString_3 = exp.split(" ");
                    return array.filter(function (item) {
                        var searchCount = 0;
                        for (var _i = 0, splitSearchString_4 = splitSearchString_3; _i < splitSearchString_4.length; _i++) {
                            var searchItem = splitSearchString_4[_i];
                            if (JSON.stringify(item).toLowerCase()
                                .indexOf(searchItem.toLowerCase()) > -1) {
                                searchCount++;
                            }
                        }
                        if (searchCount === splitSearchString_3.length) {
                            return true;
                        }
                        return false;
                    });
                }
            }
            else {
                return array;
            }
        };
        return FilterValueConverter;
    }());
    exports.FilterValueConverter = FilterValueConverter;
});

//# sourceMappingURL=filterValueConverter.js.map
