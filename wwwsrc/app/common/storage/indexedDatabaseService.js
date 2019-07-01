/// <reference path="../../../typings/app.d.ts" />
define(["require", "exports", "../core/arrayHelper"], function (require, exports, arrayHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IndexedDatabaseService = /** @class */ (function () {
        function IndexedDatabaseService() {
            this._db = {};
            // 20413 - window.navigator.userAgent.indexOf("Edge") is unreliable in production,
            //  leading to an Edge-based instance attempting to use compound indexes => goes bang
            this._isCompoundAvailable = false; // window.navigator.userAgent.indexOf("Edge") < 0;
        }
        IndexedDatabaseService.prototype.create = function (schema) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var request = window.indexedDB.open(schema.name, schema.version);
                request.onupgradeneeded = function () {
                    _this._db[schema.name] = request.result;
                    if (schema.storeSchemas) {
                        for (var i = 0; i < schema.storeSchemas.length; i++) {
                            if (_this._db[schema.name].objectStoreNames.contains(schema.storeSchemas[i].name)) {
                                _this._db[schema.name].deleteObjectStore(schema.storeSchemas[i].name);
                            }
                            var store = _this._db[schema.name].createObjectStore(schema.storeSchemas[i].name, {
                                keyPath: schema.storeSchemas[i].keyPath,
                                autoIncrement: schema.storeSchemas[i].autoIncrement
                            });
                            if (schema.storeSchemas[i].indexes) {
                                for (var j = 0; j < schema.storeSchemas[i].indexes.length; j++) {
                                    var isCompound = arrayHelper_1.ArrayHelper.isArray(schema.storeSchemas[i].indexes[j].keyPath);
                                    if (!isCompound || (isCompound && _this._isCompoundAvailable)) {
                                        store.createIndex(schema.storeSchemas[i].indexes[j].name, schema.storeSchemas[i].indexes[j].keyPath, { unique: schema.storeSchemas[i].indexes[j].unique });
                                    }
                                }
                            }
                        }
                    }
                };
                request.onsuccess = function () {
                    _this._db[schema.name] = request.result;
                    resolve();
                };
                request.onerror = function (ev) {
                    reject(ev.message);
                };
            });
        };
        IndexedDatabaseService.prototype.open = function (databaseName) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var request = window.indexedDB.open(databaseName);
                request.onsuccess = function () {
                    _this._db[databaseName] = request.result;
                    resolve();
                };
                request.onerror = function (ev) {
                    reject(ev.message);
                };
            });
        };
        IndexedDatabaseService.prototype.close = function (databaseName) {
            var _this = this;
            if (this._db === null && this._db[databaseName]) {
                return Promise.reject("Database must be open to close it");
            }
            return new Promise(function (resolve, reject) {
                _this._db[databaseName].close();
                _this._db[databaseName] = null;
                resolve();
            });
        };
        IndexedDatabaseService.prototype.destroy = function (databaseName) {
            return new Promise(function (resolve, reject) {
                var request = window.indexedDB.deleteDatabase(databaseName);
                request.onsuccess = function () {
                    resolve();
                };
                request.onerror = function (ev) {
                    reject("Database:" + databaseName + "\n" + ev.message);
                };
                request.onblocked = function () {
                    reject("Database:" + databaseName + "\n" + "The database operation is blocked, probably because it is locked by another browser tab");
                };
            });
        };
        IndexedDatabaseService.prototype.exists = function (databaseName, storeName) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var dbExists = true;
                var request = window.indexedDB.open(storeName);
                request.onupgradeneeded = function (e) {
                    e.target.transaction.abort();
                    dbExists = false;
                    resolve(dbExists);
                };
                request.onsuccess = function () {
                    _this._db[databaseName] = request.result;
                    resolve(dbExists);
                };
                request.onerror = function (ev) {
                    reject("Store:" + storeName + "\n" + ev.message);
                };
            });
        };
        IndexedDatabaseService.prototype.storeExists = function (databaseName, storeName) {
            return Promise.resolve(this._db[databaseName].objectStoreNames.contains(storeName));
        };
        IndexedDatabaseService.prototype.storeCreate = function (databaseName, databaseSchemaStore) {
            var _this = this;
            if (this._db === null && this._db[databaseName] === null) {
                return Promise.reject("Database must be open to create store '" + databaseSchemaStore.name + "'");
            }
            return new Promise(function (resolve, reject) {
                var version = _this._db[databaseName].version;
                var name = _this._db[databaseName].name;
                _this._db[databaseName].close();
                _this._db[databaseName] = null;
                version++;
                var request = window.indexedDB.open(name, version);
                request.onupgradeneeded = function () {
                    _this._db[databaseName] = request.result;
                    if (_this._db[databaseName].objectStoreNames.contains(databaseSchemaStore.name)) {
                        _this._db[databaseName].deleteObjectStore(databaseSchemaStore.name);
                    }
                    var store = _this._db[databaseName].createObjectStore(databaseSchemaStore.name, {
                        keyPath: databaseSchemaStore.keyPath,
                        autoIncrement: databaseSchemaStore.autoIncrement
                    });
                    if (databaseSchemaStore.indexes) {
                        for (var j = 0; j < databaseSchemaStore.indexes.length; j++) {
                            var isCompound = arrayHelper_1.ArrayHelper.isArray(databaseSchemaStore.indexes[j].keyPath);
                            if (!isCompound || (isCompound && _this._isCompoundAvailable)) {
                                store.createIndex(databaseSchemaStore.indexes[j].name, databaseSchemaStore.indexes[j].keyPath, { unique: databaseSchemaStore.indexes[j].unique });
                            }
                        }
                    }
                };
                request.onsuccess = function () {
                    _this._db[databaseName] = request.result;
                    resolve();
                };
                request.onerror = function (ev) {
                    reject(ev.message);
                };
            });
        };
        IndexedDatabaseService.prototype.storeRemove = function (databaseName, storeName) {
            var _this = this;
            if (this._db === null && this._db[databaseName] === null) {
                return Promise.reject("Database must be open to remove a store '" + storeName + "'");
            }
            return new Promise(function (resolve, reject) {
                var version = _this._db[databaseName].version;
                var name = _this._db[databaseName].name;
                _this._db[databaseName].close();
                _this._db[databaseName] = null;
                version++;
                var request = window.indexedDB.open(name, version);
                request.onupgradeneeded = function () {
                    _this._db[databaseName] = request.result;
                    if (_this._db[databaseName].objectStoreNames.contains(storeName)) {
                        _this._db[databaseName].deleteObjectStore(storeName);
                    }
                };
                request.onsuccess = function () {
                    _this._db[databaseName] = request.result;
                    resolve();
                };
                request.onerror = function (ev) {
                    reject(ev.message);
                };
            });
        };
        IndexedDatabaseService.prototype.set = function (databaseName, storeName, data) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var trans = _this._db[databaseName].transaction(storeName, "readwrite");
                var store = trans.objectStore(storeName);
                var request = store.put(data);
                request.onsuccess = function () {
                    resolve();
                };
                request.onerror = function (ev) {
                    reject("Store:" + storeName + "\n" + ev.message);
                };
            });
        };
        IndexedDatabaseService.prototype.get = function (databaseName, storeName, indexName, indexValues) {
            return this.getAll(databaseName, storeName, indexName, indexValues)
                .then(function (values) {
                return values && values.length > 0 ? values[0] : undefined;
            });
        };
        IndexedDatabaseService.prototype.getIndexes = function (databaseName, storeName) {
            var trans = this._db[databaseName].transaction(storeName, "readonly");
            var store = trans.objectStore(storeName);
            return store.indexNames;
        };
        IndexedDatabaseService.prototype.getAll = function (databaseName, storeName, indexName, indexValue) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var trans = _this._db[databaseName].transaction(storeName, "readonly");
                var store = trans.objectStore(storeName);
                var request;
                var compoundIndexes = indexName && indexName.split("_");
                var compoundLookup = false;
                /* is this a compound index that we cant use directly ? */
                if (compoundIndexes && compoundIndexes.length > 1 && !_this._isCompoundAvailable) {
                    /* this is a compound index so indexValue must be an array so use
                    this first entry for lookup and then filter on the rest in the results */
                    var index = store.index(compoundIndexes[0]);
                    var rangeTest = IDBKeyRange.only(indexValue[0]);
                    request = index.openCursor(rangeTest);
                    compoundLookup = true;
                }
                else {
                    var rangeTest = void 0;
                    if (indexValue) {
                        rangeTest = IDBKeyRange.only(indexValue);
                    }
                    if (indexName) {
                        var index = store.index(indexName);
                        if (rangeTest) {
                            request = index.openCursor(rangeTest);
                        }
                        else {
                            request = index.openCursor();
                        }
                    }
                    else {
                        if (rangeTest) {
                            request = store.openCursor(rangeTest);
                        }
                        else {
                            request = store.openCursor();
                        }
                    }
                }
                var items = [];
                request.onsuccess = function () {
                    var cursor = request.result;
                    if (cursor) {
                        if (compoundLookup) {
                            var matches = true;
                            for (var i = 1; i < indexValue.length && matches; i++) {
                                if (cursor.value[compoundIndexes[i]] !== indexValue[i]) {
                                    matches = false;
                                }
                            }
                            if (matches) {
                                items.push(cursor.value);
                            }
                        }
                        else {
                            items.push(cursor.value);
                        }
                        cursor.continue();
                    }
                };
                trans.oncomplete = function () {
                    resolve(items);
                };
                request.onerror = function (ev) {
                    reject("Store:" + storeName + "\n" + ev.message);
                };
            });
        };
        IndexedDatabaseService.prototype.setAll = function (databaseName, storeName, data) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var trans = _this._db[databaseName].transaction(storeName, "readwrite");
                var store = trans.objectStore(storeName);
                var idx = 0;
                if (data && data.length > 0) {
                    var putNext_1 = function () {
                        if (idx < data.length) {
                            var request = store.put(data[idx]);
                            request.onsuccess = putNext_1;
                            request.onerror = function (ev) {
                                reject("Store:" + storeName + "\n" + ev.message);
                            };
                            idx++;
                        }
                        else {
                            resolve();
                        }
                    };
                    putNext_1();
                }
                else {
                    resolve();
                }
            });
        };
        IndexedDatabaseService.prototype.remove = function (databaseName, storeName, key) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var trans = _this._db[databaseName].transaction(storeName, "readwrite");
                var store = trans.objectStore(storeName);
                var request = store.delete(key);
                request.onsuccess = function () {
                    resolve();
                };
                request.onerror = function (ev) {
                    reject("Store:" + storeName + "\n" + ev.message);
                };
            });
        };
        IndexedDatabaseService.prototype.removeAll = function (databaseName, storeName) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var trans = _this._db[databaseName].transaction(storeName, "readwrite");
                var store = trans.objectStore(storeName);
                var request = store.clear();
                request.onsuccess = function () {
                    resolve();
                };
                request.onerror = function (ev) {
                    reject("Store:" + storeName + "\n" + ev.message);
                };
            });
        };
        return IndexedDatabaseService;
    }());
    exports.IndexedDatabaseService = IndexedDatabaseService;
});

//# sourceMappingURL=indexedDatabaseService.js.map
