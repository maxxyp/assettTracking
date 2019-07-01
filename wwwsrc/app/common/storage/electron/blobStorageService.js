/// <reference path="../../../../typings/app.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-dependency-injection", "../indexedDatabaseService", "../models/databaseSchema", "../models/databaseSchemaStore", "../models/databaseSchemaStoreIndex", "./models/databaseFileBlob"], function (require, exports, aurelia_dependency_injection_1, indexedDatabaseService_1, databaseSchema_1, databaseSchemaStore_1, databaseSchemaStoreIndex_1, databaseFileBlob_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BlobStorageService = /** @class */ (function () {
        function BlobStorageService(databaseService) {
            this._databaseService = databaseService;
            this._isIntialised = false;
        }
        BlobStorageService_1 = BlobStorageService;
        BlobStorageService.sanitisePath = function (path) {
            if (path) {
                path = path.replace(/\\/g, "/");
                if (path[0] !== "/") {
                    path = "/" + path;
                }
                if (path[path.length - 1] !== "/") {
                    path += "/";
                }
            }
            return path;
        };
        BlobStorageService.prototype.checkInitised = function (storageName) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this._databaseService.exists(BlobStorageService_1._STORE_NAME, storageName)
                    .then(function (exists) {
                    if (exists) {
                        _this._isIntialised = true;
                        resolve();
                    }
                    else {
                        _this._isIntialised = false;
                        resolve();
                    }
                });
            });
        };
        BlobStorageService.prototype.initialise = function (storageName, removeExisting) {
            var _this = this;
            this._storageName = storageName;
            return new Promise(function (resolve, reject) {
                if (_this._isIntialised) {
                    resolve();
                }
                else {
                    var open_1 = function () {
                        var schema = new databaseSchema_1.DatabaseSchema(_this._storageName, 1, [
                            new databaseSchemaStore_1.DatabaseSchemaStore(BlobStorageService_1._STORE_NAME, "fullPath", false, [
                                new databaseSchemaStoreIndex_1.DatabaseSchemaStoreIndex("path", "path", false)
                            ])
                        ]);
                        _this._databaseService.exists(BlobStorageService_1._STORE_NAME, BlobStorageService_1._STORE_NAME).then(function (exists) {
                            if (exists) {
                                _this._databaseService.open(BlobStorageService_1._STORE_NAME)
                                    .then(function () {
                                    _this._isIntialised = true;
                                    resolve();
                                })
                                    .catch(function () {
                                    reject("Unable to initialise blob storage");
                                });
                            }
                            else {
                                _this._databaseService.create(schema)
                                    .then(function () {
                                    _this._isIntialised = true;
                                    resolve();
                                })
                                    .catch(function () {
                                    reject("Unable to initialise blob storage");
                                });
                            }
                        });
                    };
                    if (removeExisting) {
                        _this._databaseService.destroy(_this._storageName).then(function () {
                            return open_1();
                        }).catch(function (err) {
                            resolve(err);
                        });
                    }
                    else {
                        return open_1();
                    }
                }
            });
        };
        BlobStorageService.prototype.closedown = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!_this._isIntialised) {
                    resolve();
                }
                else {
                    _this._databaseService.close(BlobStorageService_1._STORE_NAME)
                        .then(function () {
                        _this._isIntialised = false;
                        resolve();
                    })
                        .catch(function () {
                        reject("Unable to closedown blob storage");
                    });
                }
            });
        };
        BlobStorageService.prototype.write = function (path, file, blob) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!_this._isIntialised) {
                    reject("The blob storage is not initialised");
                }
                else {
                    path = BlobStorageService_1.sanitisePath(path);
                    var databaseFileBlob = new databaseFileBlob_1.DatabaseFileBlob();
                    databaseFileBlob.fullPath = path + file;
                    databaseFileBlob.path = path;
                    databaseFileBlob.file = file;
                    databaseFileBlob.blob = blob;
                    databaseFileBlob.size = JSON.stringify(blob).length;
                    _this._databaseService.set(BlobStorageService_1._STORE_NAME, BlobStorageService_1._STORE_NAME, databaseFileBlob)
                        .then(function () {
                        resolve();
                    })
                        .catch(function () {
                        reject("Unable to write file to blob storage");
                    });
                }
            });
        };
        BlobStorageService.prototype.read = function (path, file) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!_this._isIntialised) {
                    reject("The blob storage is not initialised");
                }
                else {
                    path = BlobStorageService_1.sanitisePath(path);
                    _this._databaseService.get(BlobStorageService_1._STORE_NAME, BlobStorageService_1._STORE_NAME, "path", path + file)
                        .then(function (item) {
                        resolve(item.blob);
                    })
                        .catch(function () {
                        reject("Unable to read file from blob storage");
                    });
                }
            });
        };
        BlobStorageService.prototype.exists = function (path, file) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!_this._isIntialised) {
                    reject("The blob storage is not initialised");
                }
                else {
                    path = BlobStorageService_1.sanitisePath(path);
                    _this._databaseService.get(BlobStorageService_1._STORE_NAME, BlobStorageService_1._STORE_NAME, "path", path + file)
                        .then(function () {
                        resolve(true);
                    })
                        .catch(function () {
                        resolve(false);
                    });
                }
            });
        };
        BlobStorageService.prototype.size = function (path, file) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!_this._isIntialised) {
                    reject("The blob storage is not initialised");
                }
                else {
                    path = BlobStorageService_1.sanitisePath(path);
                    _this._databaseService.get(BlobStorageService_1._STORE_NAME, BlobStorageService_1._STORE_NAME, "path", path + file)
                        .then(function (data) {
                        resolve(data.size);
                    })
                        .catch(function () {
                        resolve(-1);
                    });
                }
            });
        };
        BlobStorageService.prototype.remove = function (path, file) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!_this._isIntialised) {
                    reject("The blob storage is not initialised");
                }
                else {
                    path = BlobStorageService_1.sanitisePath(path);
                    _this._databaseService.remove(BlobStorageService_1._STORE_NAME, BlobStorageService_1._STORE_NAME, path + file)
                        .then(function () {
                        resolve();
                    })
                        .catch(function () {
                        reject("Unable to delete file from blob storage");
                    });
                }
            });
        };
        BlobStorageService.prototype.list = function (path) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!_this._isIntialised) {
                    reject("The blob storage is not initialised");
                }
                else {
                    path = BlobStorageService_1.sanitisePath(path);
                    _this._databaseService.getAll(BlobStorageService_1._STORE_NAME, "path", path)
                        .then(function (blobs) {
                        var files = [];
                        if (blobs) {
                            for (var i = 0; i < blobs.length; i++) {
                                files.push(blobs[i].file);
                            }
                        }
                        resolve(files);
                    })
                        .catch(function () {
                        reject("Unable to list files from blob storage");
                    });
                }
            });
        };
        BlobStorageService._STORE_NAME = "files";
        BlobStorageService = BlobStorageService_1 = __decorate([
            aurelia_dependency_injection_1.inject(indexedDatabaseService_1.IndexedDatabaseService),
            __metadata("design:paramtypes", [Object])
        ], BlobStorageService);
        return BlobStorageService;
        var BlobStorageService_1;
    }());
    exports.BlobStorageService = BlobStorageService;
});

//# sourceMappingURL=blobStorageService.js.map
