/// <reference path="../../../../../typings/app.d.ts" />
define(["require", "exports", "../../platformHelper"], function (require, exports, platformHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AssetService = /** @class */ (function () {
        function AssetService() {
        }
        AssetService.prototype.loadText = function (assetName) {
            return new Promise(function (resolve) {
                Windows.ApplicationModel.Package.current.installedLocation
                    .getFileAsync(platformHelper_1.PlatformHelper.wwwRoot() + "\\assets\\" + assetName.replace(/\//g, "\\")).then(function (fileInFolder) {
                    Windows.Storage.FileIO.readBufferAsync(fileInFolder).then(function (buffer) {
                        var dataReader = Windows.Storage.Streams.DataReader.fromBuffer(buffer);
                        resolve(dataReader.readString(buffer.length));
                    }, function (error) {
                        resolve(null);
                    });
                }, function (error) {
                    resolve(null);
                });
            });
        };
        AssetService.prototype.loadArrayBuffer = function (assetName) {
            return new Promise(function (resolve) {
                Windows.ApplicationModel.Package.current.installedLocation
                    .getFileAsync(platformHelper_1.PlatformHelper.wwwRoot() + "\\assets\\" + assetName.replace(/\//g, "\\")).then(function (fileInFolder) {
                    Windows.Storage.FileIO.readBufferAsync(fileInFolder).then(function (buffer) {
                        var dataReader = Windows.Storage.Streams.DataReader.fromBuffer(buffer);
                        var arr = new Array(buffer.length);
                        dataReader.readBytes(arr);
                        resolve(new Int8Array(arr));
                    }, function (error) {
                        resolve(null);
                    });
                }, function (error) {
                    resolve(null);
                });
            });
        };
        AssetService.prototype.loadJson = function (assetName) {
            return new Promise(function (resolve) {
                Windows.ApplicationModel.Package.current.installedLocation
                    .getFileAsync(platformHelper_1.PlatformHelper.wwwRoot() + "\\assets\\" + assetName.replace(/\//g, "\\")).then(function (fileInFolder) {
                    Windows.Storage.FileIO.readBufferAsync(fileInFolder).then(function (buffer) {
                        var jsonData = null;
                        var dataReader = Windows.Storage.Streams.DataReader.fromBuffer(buffer);
                        try {
                            jsonData = JSON.parse(dataReader.readString(buffer.length));
                        }
                        catch (err) {
                            // handle catch?
                        }
                        resolve(jsonData);
                    }, function (error) {
                        resolve(null);
                    });
                }, function (error) {
                    resolve(null);
                });
            });
        };
        return AssetService;
    }());
    exports.AssetService = AssetService;
});

//# sourceMappingURL=assetService.js.map
