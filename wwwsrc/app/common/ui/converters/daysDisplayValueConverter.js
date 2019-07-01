define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DaysDisplayValueConverter = /** @class */ (function () {
        function DaysDisplayValueConverter() {
        }
        DaysDisplayValueConverter.prototype.toView = function (days) {
            if (days) {
                var disp = "";
                var numVal = parseFloat(days);
                if (!isNaN(numVal)) {
                    var years = Math.floor(numVal / 365);
                    if (years === 1) {
                        disp = years + " year ";
                    }
                    else if (years > 1) {
                        disp = years + " years ";
                    }
                    numVal -= years * 365;
                    disp += numVal + " days";
                }
                return disp;
            }
            else {
                return "";
            }
        };
        return DaysDisplayValueConverter;
    }());
    exports.DaysDisplayValueConverter = DaysDisplayValueConverter;
});

//# sourceMappingURL=daysDisplayValueConverter.js.map
