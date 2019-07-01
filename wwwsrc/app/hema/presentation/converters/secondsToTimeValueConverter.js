define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SecondsToTimeValueConverter = /** @class */ (function () {
        function SecondsToTimeValueConverter() {
        }
        SecondsToTimeValueConverter.prototype.toView = function (seconds, format) {
            if (seconds && !isNaN(seconds)) {
                var hours = seconds >= 3600 ? Math.floor(seconds / 3600) : 0;
                seconds -= hours * 3600;
                var minutes = seconds >= 0 ? Math.ceil(seconds / 60) : 0;
                if (minutes === 60) {
                    hours += 1;
                    minutes = 0;
                }
                var time = "";
                if (format === "short") {
                    time += hours + "h" + minutes;
                }
                else {
                    if (hours > 0) {
                        time += hours === 1 ? "1 hour " : hours + " hours ";
                    }
                    if (minutes > 0) {
                        time += minutes === 1 ? "1 minute " : minutes + " minutes ";
                    }
                }
                return time.trim();
            }
            else {
                return "";
            }
        };
        return SecondsToTimeValueConverter;
    }());
    exports.SecondsToTimeValueConverter = SecondsToTimeValueConverter;
});

//# sourceMappingURL=secondsToTimeValueConverter.js.map
