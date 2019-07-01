define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AppMetaDataService = /** @class */ (function () {
        function AppMetaDataService() {
        }
        AppMetaDataService.prototype.get = function () {
            var packageInfo = Windows.ApplicationModel.Package.current;
            var version = packageInfo.id.version;
            return Promise.resolve({
                appName: packageInfo.id.name,
                appId: packageInfo.id.familyName,
                appVersion: version.major + "." + version.minor + "," + version.revision + "," + version.build,
                appInstallerId: packageInfo.id.publisherId,
                env: window.appBuildType
            });
        };
        return AppMetaDataService;
    }());
    exports.AppMetaDataService = AppMetaDataService;
});

//# sourceMappingURL=appMetaDataService.js.map
