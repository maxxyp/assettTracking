define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WindowHelper = /** @class */ (function () {
        function WindowHelper() {
        }
        WindowHelper.reload = function () {
            window.location.href = window.location.href.replace(window.location.hash, "");
        };
        return WindowHelper;
    }());
    exports.WindowHelper = WindowHelper;
});

//# sourceMappingURL=windowHelper.js.map
