/// <reference path="../../../../typings/app.d.ts" />
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LocalStorageService = /** @class */ (function () {
        function LocalStorageService(rootStorageFolder) {
            this._rootStorageFolder = rootStorageFolder;
        }
        LocalStorageService.prototype.checkInitised = function (storageName) {
            return Promise.resolve();
        };
        LocalStorageService.prototype.initialise = function (storageName, removeExisting) {
            var _this = this;
            this._rootFolder = storageName;
            return new Promise(function (resolve) {
                if (removeExisting) {
                    _this._rootStorageFolder.getFolderAsync(_this._rootFolder).then(function (folder) {
                        folder.deleteAsync().then(function () {
                            resolve();
                        }, function () {
                            resolve();
                        });
                    }, function (err) {
                        resolve(err);
                    });
                }
                else {
                    resolve();
                }
            });
        };
        LocalStorageService.prototype.closedown = function () {
            return new Promise(function (resolve) {
                resolve();
            });
        };
        LocalStorageService.prototype.write = function (path, file, blob) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                path = _this.sanitisePath(path);
                _this._rootStorageFolder.createFolderAsync(path, Windows.Storage.CreationCollisionOption.openIfExists).then(function (folder) {
                    folder.createFileAsync(file, Windows.Storage.CreationCollisionOption.replaceExisting).then(function (fileInFolder) {
                        var memoryStream = new Windows.Storage.Streams.InMemoryRandomAccessStream();
                        var dataWriter = new Windows.Storage.Streams.DataWriter(memoryStream);
                        dataWriter.writeString(JSON.stringify(blob));
                        var buffer = dataWriter.detachBuffer();
                        dataWriter.close();
                        Windows.Storage.FileIO.writeBufferAsync(fileInFolder, buffer).then(function () {
                            resolve();
                        }, function (error) {
                            reject(error);
                        });
                    }, function (error) {
                        reject(error);
                    });
                }, function (error) {
                    reject(error);
                });
            });
        };
        LocalStorageService.prototype.read = function (path, file) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                path = _this.sanitisePath(path);
                _this._rootStorageFolder.getFileAsync(path + file).then(function (fileInFolder) {
                    Windows.Storage.FileIO.readBufferAsync(fileInFolder).then(function (buffer) {
                        var dataReader = Windows.Storage.Streams.DataReader.fromBuffer(buffer);
                        resolve(JSON.parse(dataReader.readString(buffer.length)));
                    }, function (error) {
                        reject(error);
                    });
                }, function (error) {
                    reject(error);
                });
            });
        };
        LocalStorageService.prototype.exists = function (path, file) {
            var _this = this;
            return new Promise(function (resolve) {
                path = _this.sanitisePath(path);
                _this._rootStorageFolder.getFileAsync(path + file).then(function () {
                    resolve(true);
                }, function () {
                    resolve(false);
                });
            });
        };
        LocalStorageService.prototype.size = function (path, file) {
            var _this = this;
            return new Promise(function (resolve) {
                path = _this.sanitisePath(path);
                _this._rootStorageFolder.getFileAsync(path + file).then(function (storageFile) {
                    storageFile.getBasicPropertiesAsync().then(function (props) {
                        resolve(props.size);
                    }, function () {
                        resolve(-1);
                    });
                }, function () {
                    resolve(-1);
                });
            });
        };
        LocalStorageService.prototype.remove = function (path, file) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                path = _this.sanitisePath(path);
                _this._rootStorageFolder.getFileAsync(file).then(function (fileInFolder) {
                    fileInFolder.deleteAsync().then(function () {
                        resolve();
                    }, function (error) {
                        reject(error);
                    });
                }, function (error) {
                    reject(error);
                });
            });
        };
        LocalStorageService.prototype.list = function (path) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                path = _this.sanitisePath(path);
                _this._rootStorageFolder.getFolderAsync(path).then(function (folder) {
                    folder.getFilesAsync().then(function (filesInFolder) {
                        var files = [];
                        filesInFolder.forEach(function (file) {
                            files.push(file.name);
                        });
                        resolve(files);
                    }, function (error) {
                        reject(error);
                    });
                }, function (error) {
                    reject(error);
                });
            });
        };
        LocalStorageService.prototype.sanitisePath = function (path) {
            if (path) {
                path = path.replace(/\//g, "\\");
                if (path[0] === "\\") {
                    path = path.substr(1);
                }
                if (path[path.length - 1] !== "\\") {
                    path = path + "\\";
                }
            }
            return this._rootFolder + "\\" + path;
        };
        return LocalStorageService;
    }());
    exports.LocalStorageService = LocalStorageService;
});

//# sourceMappingURL=localStorageService.js.map
