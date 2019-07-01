/// <reference path="../../../typings/app.d.ts" />
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PlatformHelper = /** @class */ (function () {
        function PlatformHelper() {
        }
        PlatformHelper.initNavigatorPlatform = function () {
            if (!PlatformHelper.navigatorPlatform) {
                PlatformHelper.navigatorPlatform = navigator.platform;
            }
        };
        PlatformHelper.initNavigatorAppVersion = function () {
            if (!PlatformHelper.navigatorAppVersion) {
                PlatformHelper.navigatorAppVersion = navigator.appVersion;
            }
        };
        PlatformHelper.getPlatform = function () {
            PlatformHelper.initNavigatorPlatform();
            PlatformHelper.initNavigatorAppVersion();
            if (!PlatformHelper._platform) {
                PlatformHelper._platform = "web";
                if (/Electron/.test(PlatformHelper.navigatorAppVersion)) {
                    PlatformHelper._platform = "electron";
                }
                else if (/MSAppHost/.test(PlatformHelper.navigatorAppVersion)) {
                    PlatformHelper._platform = "wua";
                }
                else if (/iPad|iPhone|iPod/.test(PlatformHelper.navigatorPlatform)) {
                    PlatformHelper._platform = "ios";
                }
            }
            return PlatformHelper._platform;
        };
        PlatformHelper.resetPlatform = function () {
            PlatformHelper._platform = null;
        };
        PlatformHelper.appRoot = function () {
            return PlatformHelper.isRequreJs() ? "./" : "./app/";
        };
        PlatformHelper.wwwRoot = function () {
            return PlatformHelper.isSource ? "wwwsrc" : "www";
        };
        PlatformHelper.isRequreJs = function () {
            return typeof window.require === "function" ? true : false;
        };
        PlatformHelper.isMobile = function () {
            return this.getPlatform() === "wua" &&
                window.Windows &&
                window.Windows.Foundation &&
                window.Windows.Foundation.Metadata &&
                window.Windows.Foundation.Metadata.ApiInformation &&
                window.Windows.Foundation.Metadata.ApiInformation.isTypePresent("Windows.Phone.UI.Input.HardwareButtons");
        };
        PlatformHelper.isCordova = function () {
            return window.cordova ? true : false;
        };
        PlatformHelper.isWua = function () {
            return PlatformHelper._platform === "wua";
        };
        PlatformHelper.cordovaVersion = function () {
            return window.cordova ? window.cordova.version : "";
        };
        PlatformHelper.cordovaPlatformId = function () {
            return window.cordova ? window.cordova.platformId : "";
        };
        PlatformHelper.loadModule = function (folder, name) {
            return new Promise(function (resolve, reject) {
                if (folder && name) {
                    var platform_1 = PlatformHelper.getPlatform();
                    if (PlatformHelper.isRequreJs()) {
                        window.require([folder + "/" + platform_1 + "/" + name], function (module) {
                            resolve(module);
                        }, function (error) {
                            reject();
                        });
                    }
                    else {
                        window.System.normalize(folder + "/" + name, null)
                            .then(function (normalizedName) {
                            window.System.import("./" + platform_1 + "/" + name, normalizedName)
                                .then(function (module) {
                                resolve(module);
                            }).catch(function () {
                                reject();
                            });
                        });
                    }
                }
                else {
                    reject();
                }
            });
        };
        PlatformHelper.loaderPrefix = "";
        return PlatformHelper;
    }());
    exports.PlatformHelper = PlatformHelper;
});

//# sourceMappingURL=platformHelper.js.map
