var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LocalStorageDbService = /** @class */ (function () {
        function LocalStorageDbService() {
        }
        LocalStorageDbService.prototype.create = function (schema) {
            return __awaiter(this, void 0, void 0, function () {
                var _i, _a, storeSchema;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _i = 0, _a = schema.storeSchemas || [];
                            _b.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            storeSchema = _a[_i];
                            return [4 /*yield*/, this.storeCreate(schema.name, storeSchema)];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        LocalStorageDbService.prototype.open = function (databaseName) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            });
        };
        LocalStorageDbService.prototype.close = function (databaseName) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            });
        };
        LocalStorageDbService.prototype.destroy = function (databaseName) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var storeNames;
                return __generator(this, function (_a) {
                    storeNames = this.getDbStoreNames(databaseName);
                    storeNames.forEach(function (storeName) { return _this.storeRemove(databaseName, storeName); });
                    return [2 /*return*/];
                });
            });
        };
        LocalStorageDbService.prototype.exists = function (databaseName, storeName) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, !!this.getDbStoreNames(databaseName).length];
                });
            });
        };
        LocalStorageDbService.prototype.storeExists = function (databaseName, storeName) {
            return __awaiter(this, void 0, void 0, function () {
                var key;
                return __generator(this, function (_a) {
                    key = this.getKeyFromNames(databaseName, storeName);
                    return [2 /*return*/, !!localStorage[key]];
                });
            });
        };
        LocalStorageDbService.prototype.storeCreate = function (databaseName, storeSchema) {
            return __awaiter(this, void 0, void 0, function () {
                var key, freshStorage;
                return __generator(this, function (_a) {
                    key = this.getKeyFromNames(databaseName, storeSchema.name);
                    if (!localStorage[key]) {
                        freshStorage = {
                            def: {
                                pk: storeSchema.keyPath,
                                autoIncrement: storeSchema.autoIncrement,
                                lastAutoIncrementValue: storeSchema.autoIncrement ? -1 : undefined
                            },
                            data: []
                        };
                        this.setStore(key, freshStorage);
                    }
                    return [2 /*return*/];
                });
            });
        };
        LocalStorageDbService.prototype.storeRemove = function (databaseName, storeName) {
            return __awaiter(this, void 0, void 0, function () {
                var key;
                return __generator(this, function (_a) {
                    key = this.getKeyFromNames(databaseName, storeName);
                    localStorage.removeItem(key);
                    return [2 /*return*/];
                });
            });
        };
        LocalStorageDbService.prototype.set = function (databaseName, storeName, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.setAll(databaseName, storeName, [data])];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LocalStorageDbService.prototype.get = function (databaseName, storeName, indexName, indexValue) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getAll(databaseName, storeName, indexName, indexValue)];
                        case 1: return [2 /*return*/, (_a.sent())[0]];
                    }
                });
            });
        };
        LocalStorageDbService.prototype.getIndexes = function (databaseName, storeName) {
            var key = this.getKeyFromNames(databaseName, storeName);
            var store = this.getStore(key);
            var pk = store.def.pk;
            // in reality because we're nor really an indexedDb implementation,
            //   any field can be queried without being an index, so not sure about this...
            // maybe we store the indexes passed in during storeCreate in def and be strict about only
            //  allowing querying on these predefined indexes..
            var result = {
                length: 1,
                contains: function (name) { return name === pk; },
                item: function (index) { return index === 0 ? pk : null; },
            };
            result[0] = pk;
            return result;
        };
        LocalStorageDbService.prototype.getAll = function (databaseName, storeName, indexName, indexValue) {
            return __awaiter(this, void 0, void 0, function () {
                var storeKey, data;
                return __generator(this, function (_a) {
                    storeKey = this.getKeyFromNames(databaseName, storeName);
                    data = this.getStore(storeKey).data;
                    return [2 /*return*/, indexName
                            ? data.filter(function (item) { return item[indexName] === indexValue; })
                            : data];
                });
            });
        };
        LocalStorageDbService.prototype.setAll = function (databaseName, storeName, data) {
            return __awaiter(this, void 0, void 0, function () {
                var key, store, _a, autoIncrement, pk, lastAutoIncrementValue, workingAutoIncrementValue;
                return __generator(this, function (_b) {
                    key = this.getKeyFromNames(databaseName, storeName);
                    store = this.getStore(key);
                    _a = store.def, autoIncrement = _a.autoIncrement, pk = _a.pk, lastAutoIncrementValue = _a.lastAutoIncrementValue;
                    workingAutoIncrementValue = lastAutoIncrementValue;
                    data.forEach(function (item) {
                        var exitingIndex = store.data.findIndex(function (storeItem) { return storeItem[pk] === item[pk]; });
                        if (exitingIndex === -1) {
                            if (autoIncrement) {
                                item[pk] = ++workingAutoIncrementValue;
                            }
                            else if (item[pk] === null || item[pk] === undefined) {
                                throw new Error("PK must be supplied for a non-autoincrement store");
                            }
                            store.data.push(item);
                        }
                        else {
                            store.data[exitingIndex] = item;
                        }
                    });
                    store.def.lastAutoIncrementValue = workingAutoIncrementValue;
                    this.setStore(key, store);
                    return [2 /*return*/];
                });
            });
        };
        LocalStorageDbService.prototype.remove = function (databaseName, storeName, key) {
            return __awaiter(this, void 0, void 0, function () {
                var storeKey, store;
                return __generator(this, function (_a) {
                    storeKey = this.getKeyFromNames(databaseName, storeName);
                    store = this.getStore(storeKey);
                    store.data = store.data.filter(function (item) { return item[store.def.pk] !== key; });
                    this.setStore(storeKey, store);
                    return [2 /*return*/];
                });
            });
        };
        LocalStorageDbService.prototype.removeAll = function (databaseName, storeName) {
            return __awaiter(this, void 0, void 0, function () {
                var storeKey, store;
                return __generator(this, function (_a) {
                    storeKey = this.getKeyFromNames(databaseName, storeName);
                    store = this.getStore(storeKey);
                    store.data = [];
                    this.setStore(storeKey, store);
                    return [2 /*return*/];
                });
            });
        };
        LocalStorageDbService.prototype.getKeyFromNames = function (dbName, storeName) {
            return "db:" + dbName + ":" + storeName;
        };
        LocalStorageDbService.prototype.getDbStoreNames = function (dbName) {
            var myStoreKeys = [];
            for (var i = 0; i < localStorage.length; i++) {
                if (localStorage.key(i).indexOf("db:" + dbName) === 0) {
                    myStoreKeys.push(localStorage.key(i).replace("db:" + dbName + ":", ""));
                }
            }
            return myStoreKeys;
        };
        LocalStorageDbService.prototype.getStore = function (key) {
            var storedString = localStorage[key];
            return storedString && JSON.parse(storedString);
        };
        LocalStorageDbService.prototype.setStore = function (key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        };
        return LocalStorageDbService;
    }());
    exports.LocalStorageDbService = LocalStorageDbService;
});

//# sourceMappingURL=localStorageDbService.js.map
