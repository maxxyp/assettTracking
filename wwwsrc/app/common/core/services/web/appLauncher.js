define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AppLauncher = /** @class */ (function () {
        function AppLauncher() {
        }
        AppLauncher.prototype.getUriScheme = function () {
            return Promise.resolve(location.protocol + "//" + location.host);
        };
        AppLauncher.prototype.checkApplicationInstalled = function (uri) {
            return Promise.resolve(true);
        };
        AppLauncher.prototype.launchApplication = function (uri) {
            window.open(uri, "_blank");
        };
        return AppLauncher;
    }());
    exports.AppLauncher = AppLauncher;
});

//# sourceMappingURL=appLauncher.js.map
