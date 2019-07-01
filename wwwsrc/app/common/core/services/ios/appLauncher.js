define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AppLauncher = /** @class */ (function () {
        function AppLauncher() {
            this._uriScheme = null;
        }
        // dependency ./plugins-custom/cordova-plugin-getcustomuri
        AppLauncher.prototype.getUriScheme = function () {
            var _this = this;
            if (!window.GetCustomUri) {
                return Promise.resolve(null);
            }
            var getCustomUri = window.GetCustomUri;
            return new Promise(function (resolve) {
                getCustomUri.getUriScheme(function (res) {
                    _this._uriScheme = res + "://";
                    resolve(_this._uriScheme);
                }, function () {
                    resolve();
                });
            });
        };
        // dependency https://github.com/lampaa/com.lampa.startapp
        // dependency cordova-plugin-queries-schemes
        AppLauncher.prototype.checkApplicationInstalled = function (uri) {
            if (!window.startApp) {
                return Promise.resolve(false);
            }
            var startApp = window.startApp;
            return new Promise(function (resolve) {
                var baseUri = uri;
                if (uri.indexOf("://") > -1) {
                    baseUri = uri.split("://")[0] + "://";
                }
                startApp.set(baseUri).check(function () {
                    resolve(true);
                }, function () {
                    resolve(false);
                });
            });
        };
        AppLauncher.prototype.launchApplication = function (uri) {
            var startApp = window.startApp;
            if (!startApp) {
                return;
            }
            startApp.set(uri).start();
        };
        return AppLauncher;
    }());
    exports.AppLauncher = AppLauncher;
});

//# sourceMappingURL=appLauncher.js.map
