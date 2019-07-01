/// <reference path="../../../../typings/app.d.ts" />
define(["require", "exports", "moment"], function (require, exports, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DateFormatValueConverter = /** @class */ (function () {
        function DateFormatValueConverter() {
        }
        DateFormatValueConverter.prototype.toView = function (value, format) {
            if (value) {
                if (!format) {
                    format = "D MMMM YYYY";
                }
                return moment(value).format(format);
            }
            else {
                return value;
            }
        };
        return DateFormatValueConverter;
    }());
    exports.DateFormatValueConverter = DateFormatValueConverter;
});

//# sourceMappingURL=dateFormatValueConverter.js.map
