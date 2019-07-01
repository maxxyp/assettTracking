/// <reference path="../../../../typings/app.d.ts" />
define(["require", "exports", "moment"], function (require, exports, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DateTimeFormatValueConverter = /** @class */ (function () {
        function DateTimeFormatValueConverter() {
        }
        DateTimeFormatValueConverter.prototype.toView = function (value, format) {
            if (value) {
                if (!format) {
                    format = "D MMMM YYYY [at] HH:mm";
                }
                return moment(value).format(format);
            }
            else {
                return value;
            }
        };
        return DateTimeFormatValueConverter;
    }());
    exports.DateTimeFormatValueConverter = DateTimeFormatValueConverter;
});

//# sourceMappingURL=dateTimeFormatValueConverter.js.map
