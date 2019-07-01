/// <reference path="../../../../../typings/app.d.ts" />
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AssetService = /** @class */ (function () {
        function AssetService() {
        }
        AssetService.prototype.loadText = function (assetName) {
            return new Promise(function (resolve) {
                window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/assets/" + assetName, function (fileEntry) {
                    fileEntry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function () {
                            resolve(reader.result);
                        };
                        reader.readAsText(file);
                    }, function (error) {
                        resolve(null);
                    });
                }, function (err) {
                    resolve(null);
                });
            });
        };
        AssetService.prototype.loadArrayBuffer = function (assetName) {
            return new Promise(function (resolve) {
                window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/assets/" + assetName, function (fileEntry) {
                    fileEntry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function () {
                            resolve(reader.result);
                        };
                        reader.readAsArrayBuffer(file);
                    }, function (error) {
                        resolve(null);
                    });
                }, function (err) {
                    resolve(null);
                });
            });
        };
        AssetService.prototype.loadJson = function (assetName) {
            return new Promise(function (resolve) {
                window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/assets/" + assetName, function (fileEntry) {
                    fileEntry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function () {
                            var jsonResponse = null;
                            try {
                                jsonResponse = JSON.parse(reader.result);
                            }
                            catch (error) {
                                // handle this/log this?
                            }
                            resolve(jsonResponse);
                        };
                        reader.readAsText(file);
                    }, function (error) {
                        resolve(null);
                    });
                }, function (err) {
                    resolve(null);
                });
            });
        };
        return AssetService;
    }());
    exports.AssetService = AssetService;
});

//# sourceMappingURL=assetService.js.map
