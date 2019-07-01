define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ObjectKeysValueConverter = /** @class */ (function () {
        function ObjectKeysValueConverter() {
        }
        ObjectKeysValueConverter.prototype.toView = function (obj) {
            var temp = [];
            // a basic for..in loop to get object properties
            // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/for...in
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    var value = obj[prop];
                    var type = Array.isArray(value) ? "array" : typeof value;
                    temp.push({ key: prop, value: value, type: type });
                }
            }
            return temp;
        };
        return ObjectKeysValueConverter;
    }());
    exports.ObjectKeysValueConverter = ObjectKeysValueConverter;
});

//# sourceMappingURL=objectKeysValueConverter.js.map
