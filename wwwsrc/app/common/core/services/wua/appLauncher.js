define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AppLauncher = /** @class */ (function () {
        function AppLauncher() {
            this._uriScheme = null;
        }
        AppLauncher.prototype.getUriScheme = function () {
            var _this = this;
            if (!!this._uriScheme) {
                return Promise.resolve(this._uriScheme);
            }
            var installedLocation = Windows.ApplicationModel.Package.current.installedLocation;
            return new Promise((function (resolve) {
                installedLocation.getFileAsync("AppxManifest.xml")
                    .then(function (file) {
                    Windows.Storage.FileIO.readTextAsync(file).then(function (text) {
                        _this._uriScheme = text.match(/<uap:Protocol Name="(.*)">/)[1] + "://";
                        resolve(_this._uriScheme);
                    }, function (err) {
                        resolve(_this._uriScheme);
                    });
                }, function (err) {
                    resolve(_this._uriScheme);
                });
            }));
        };
        AppLauncher.prototype.checkApplicationInstalled = function (uri) {
            return new Promise(function (resolve) {
                Windows.System.Launcher.queryUriSupportAsync(new Windows.Foundation.Uri(uri), Windows.System.LaunchQuerySupportType.uri)
                    .done(function (supported) {
                    return resolve(supported === Windows.System.LaunchQuerySupportStatus.available);
                }, function () { return resolve(false); });
            });
        };
        AppLauncher.prototype.launchApplication = function (uri) {
            Windows.System.Launcher.launchUriAsync(new Windows.Foundation.Uri(uri));
        };
        return AppLauncher;
    }());
    exports.AppLauncher = AppLauncher;
});

//# sourceMappingURL=appLauncher.js.map
