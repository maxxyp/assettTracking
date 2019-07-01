define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArrayHelper = /** @class */ (function () {
        function ArrayHelper() {
        }
        ArrayHelper.isArray = function (arr) {
            return arr === undefined || arr === null ? false : arr instanceof Array;
        };
        ArrayHelper.sortByColumn = function (arr, columnName) {
            if (arr === undefined) {
                return undefined;
            }
            else if (arr === null) {
                return null;
            }
            else {
                var sortByColumnName = function (a, b) {
                    if (a[columnName] > b[columnName]) {
                        return 1;
                    }
                    if (a[columnName] < b[columnName]) {
                        return -1;
                    }
                    return 0;
                };
                return arr.sort(sortByColumnName);
            }
        };
        ArrayHelper.sortByColumnDescending = function (arr, columnName) {
            if (arr === undefined) {
                return undefined;
            }
            else if (arr === null) {
                return null;
            }
            else {
                var sortByColumnName = function (a, b) {
                    if (a[columnName] > b[columnName]) {
                        return -1;
                    }
                    if (a[columnName] < b[columnName]) {
                        return 1;
                    }
                    return 0;
                };
                return arr.sort(sortByColumnName);
            }
        };
        ArrayHelper.toKeyedObject = function (arr, keyFinder) {
            return (arr || [])
                .reduce(function (accum, curr) {
                accum[keyFinder(curr)] = curr;
                return accum;
            }, {});
        };
        return ArrayHelper;
    }());
    exports.ArrayHelper = ArrayHelper;
});

//# sourceMappingURL=arrayHelper.js.map
