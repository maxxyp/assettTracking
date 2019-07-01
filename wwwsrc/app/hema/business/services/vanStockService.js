var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
define(["require", "exports", "aurelia-framework", "../factories/vanStockPatchFactory", "../../api/services/vanStockService", "aurelia-logging", "./constants/vanStockServiceConstants", "./vanStockEngine"], function (require, exports, aurelia_framework_1, vanStockPatchFactory_1, vanStockService_1, Logging, vanStockServiceConstants_1, vanStockEngine_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.STOCK_REFERENCE_ID_REGEX = /^[a-z0-9]{6}$/i;
    var AREA_REG_EX = /^@Area:(?:[a-z0-9]?)/i;
    var JOB_REG_EX = /^#Job:(?:[0-9]?)/i;
    // there is a function in side arrayHelper.ts which has a know  bug
    // that function can not deal with arrays with undefined values.
    // as the arrayhelper function is used in existing code elsewhere in the app
    // its been decided to use this just for van stock.
    var sortByColumnName = function (columnSort) { return function (a, b) {
        var aValue = a[columnSort.sortBy] || " "; // becouse for the undefined values the sorting does not behave
        var bValue = b[columnSort.sortBy] || " ";
        if (aValue.length > 1) {
            aValue = aValue.trim();
        }
        if (bValue.length > 1) {
            bValue = bValue.trim();
        }
        if (!aValue && !bValue) {
            return 0;
        }
        else if (aValue && !bValue) {
            return -1;
        }
        else if (!aValue && bValue) {
            return 1;
        }
        else {
            var value1 = aValue.toString().toUpperCase(); // ignore upper and lowercase
            var value2 = bValue.toString().toUpperCase(); // ignore upper and lowercase
            if (value1 < value2) {
                return columnSort.sortOrderAsc ? -1 : 1;
            }
            else if (value1 > value2) {
                return columnSort.sortOrderAsc ? 1 : -1;
            }
            else {
                return 0;
            }
        }
    }; };
    var VanStockService = /** @class */ (function () {
        function VanStockService(vanStockService, vanStockPatchFactory, vanStockEngine) {
            this._vanStockService = vanStockService;
            this._vanStockPatchFactory = vanStockPatchFactory;
            this._vanStockEngine = vanStockEngine;
            this._patchCache = [];
            this._logger = Logging.getLogger("VanStockService");
        }
        VanStockService.prototype.getPatchCodes = function (sector) {
            return __awaiter(this, void 0, void 0, function () {
                var patch;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._vanStockService.getVanstockPatchCodes(sector)];
                        case 1:
                            patch = _a.sent();
                            return [2 /*return*/, this._vanStockPatchFactory.createVanStockPatchListBusinessModel(patch)];
                    }
                });
            });
        };
        VanStockService.prototype.getSectors = function () {
            return [
                { sectorCode: "PatchGas", sectorDescription: "Gas Services" },
                { sectorCode: "PatchES", sectorDescription: "Electrical Services" }
            ];
        };
        // todo: remove this old version stuff
        VanStockService.prototype.getEngineersWithPart = function (code, sector, gcCode) {
            return __awaiter(this, void 0, void 0, function () {
                var patchRecord, patchApiModel, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            patchRecord = this._patchCache.find(function (item) { return item.sector === sector && item.code === code; });
                            if (!!patchRecord) return [3 /*break*/, 2];
                            return [4 /*yield*/, this._vanStockService.getVanstockPatch(code, sector)];
                        case 1:
                            patchApiModel = _a.sent();
                            patchRecord = { sector: sector, code: code, patch: (this._vanStockPatchFactory.createVanStockPatchBusinessModel(patchApiModel) || { engineers: [] }) };
                            this._patchCache.push(patchRecord);
                            _a.label = 2;
                        case 2: return [2 /*return*/, patchRecord.patch.engineers
                                .filter(function (engineer) { return engineer.parts.some(function (engineersGcCode) { return gcCode === engineersGcCode; }); })
                                .map(function (engineer) { return ({ name: engineer.name, phone: engineer.phone }); })];
                        case 3:
                            err_1 = _a.sent();
                            this._logger.error("Unable to find patch data", err_1);
                            return [2 /*return*/, []];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        VanStockService.prototype.getHighValueToolList = function (currentCount, searchString) {
            return __awaiter(this, void 0, void 0, function () {
                var search, fulllist;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            search = function (data) {
                                if (searchString) {
                                    var filteredData = [];
                                    if (exports.STOCK_REFERENCE_ID_REGEX.test(searchString)) {
                                        // this is stock reference id or description
                                        filteredData = data.filter(function (v) {
                                            return v && (v.materialCode && v.materialCode.toUpperCase().indexOf(searchString.toUpperCase()) > -1
                                                || v.description && v.description.toUpperCase().indexOf(searchString.toUpperCase()) > -1);
                                        });
                                    }
                                    else {
                                        // search in all fields
                                        filteredData = data.filter(function (v) {
                                            if (v && v.description && v.materialCode) {
                                                return v.description.toUpperCase().indexOf(searchString.toUpperCase()) > -1
                                                    || v.materialCode.toUpperCase().indexOf(searchString.toUpperCase()) > -1;
                                            }
                                            return false;
                                        });
                                    }
                                    return filteredData;
                                }
                                return data;
                            };
                            return [4 /*yield*/, this._vanStockEngine.getHighValueToolList()];
                        case 1:
                            fulllist = _a.sent();
                            return [2 /*return*/, search(fulllist)
                                    .slice(0, currentCount)];
                    }
                });
            });
        };
        VanStockService.prototype.getHighValueToolTotal = function (searchString) {
            return __awaiter(this, void 0, void 0, function () {
                var list;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getHighValueToolList(99999, searchString)];
                        case 1:
                            list = _a.sent();
                            return [2 /*return*/, list ? list.length : 0];
                    }
                });
            });
        };
        VanStockService.prototype.searchLocalVanStock = function (currentCount, sort, searchString) {
            return __awaiter(this, void 0, void 0, function () {
                var search, fulllist;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            search = function (data) {
                                if (searchString) {
                                    var filteredData = [];
                                    if (AREA_REG_EX.test(searchString)) {
                                        var areaSearchString_1 = searchString.trim().replace(vanStockServiceConstants_1.VanStockServiceConstants.AREA_SEARCH_PREFIX, "");
                                        // this is area
                                        filteredData = data.filter(function (v) {
                                            return v && v.area && v.area.toUpperCase().indexOf(areaSearchString_1.toUpperCase()) > -1;
                                        });
                                    }
                                    else if (JOB_REG_EX.test(searchString)) {
                                        var jobSearchString_1 = searchString.trim().replace(vanStockServiceConstants_1.VanStockServiceConstants.JOB_SEARCH_PREFIX, "");
                                        // this is jobId
                                        filteredData = data.filter(function (v) {
                                            return v && v.jobId && v.jobId.toUpperCase().indexOf(jobSearchString_1.toUpperCase()) > -1;
                                        });
                                    }
                                    else if (exports.STOCK_REFERENCE_ID_REGEX.test(searchString)) {
                                        // this is stock reference id or description
                                        filteredData = data.filter(function (v) {
                                            return v && (v.stockReferenceId && v.stockReferenceId.toUpperCase().indexOf(searchString.toUpperCase()) > -1
                                                || v.description && v.description.toUpperCase().indexOf(searchString.toUpperCase()) > -1);
                                        });
                                    }
                                    else {
                                        // search in all fields
                                        filteredData = data.filter(function (v) {
                                            if (v && v.description && v.stockReferenceId) {
                                                return v.description.toUpperCase().indexOf(searchString.toUpperCase()) > -1
                                                    || v.stockReferenceId.toUpperCase().indexOf(searchString.toUpperCase()) > -1;
                                            }
                                            return false;
                                        });
                                    }
                                    return filteredData;
                                }
                                return data;
                            };
                            return [4 /*yield*/, this._vanStockEngine.getLocalMaterial()];
                        case 1:
                            fulllist = _a.sent();
                            if (sort) {
                                fulllist = fulllist.sort(sortByColumnName(sort));
                            }
                            return [2 /*return*/, search(fulllist)
                                    .slice(0, currentCount)];
                    }
                });
            });
        };
        VanStockService.prototype.getLocalVanStockTotal = function (searchString) {
            return __awaiter(this, void 0, void 0, function () {
                var list;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.searchLocalVanStock(99999, null, searchString)];
                        case 1:
                            list = _a.sent();
                            return [2 /*return*/, list ? (list.length > 0 ? list.map(function (a) { return a.quantity; }).reduce(function (a, c) { return a + c; }) : 0) : 0];
                    }
                });
            });
        };
        VanStockService.prototype.getLocalVanStockLineTotal = function (searchString) {
            return __awaiter(this, void 0, void 0, function () {
                var list;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.searchLocalVanStock(99999, null, searchString)];
                        case 1:
                            list = _a.sent();
                            return [2 /*return*/, list ? list.length : 0];
                    }
                });
            });
        };
        VanStockService.prototype.getLocalVanStockAreaLookup = function () {
            return __awaiter(this, void 0, void 0, function () {
                var materials, unique;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._vanStockEngine.getLocalMaterial()];
                        case 1:
                            materials = _a.sent();
                            unique = (function (value, index, self) {
                                return self[index] && self.indexOf(value) === index;
                            });
                            return [4 /*yield*/, materials.map(function (m) { return m.area; }).filter(unique)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        VanStockService.prototype.getBindableVanStockStatusFlag = function () {
            return this._vanStockEngine.getBindableVanStockStatusFlag();
        };
        VanStockService.prototype.getBindableMaterialSearchResult = function (stockReferenceId, forceRefresh) {
            return this._vanStockEngine.getBindableMaterialSearchResult(stockReferenceId, forceRefresh);
        };
        VanStockService.prototype.getPartsToCollect = function () {
            return this._vanStockEngine.getPartsToCollect();
        };
        VanStockService.prototype.getMaterialRequests = function () {
            return this._vanStockEngine.getMaterialRequests();
        };
        VanStockService.prototype.getReturns = function () {
            return this._vanStockEngine.getReturns();
        };
        VanStockService.prototype.registerMaterialRequestReads = function (arg) {
            return this._vanStockEngine.registerMaterialRequestReads(arg);
        };
        VanStockService.prototype.registerMaterialZoneUpdate = function (arg) {
            return this._vanStockEngine.registerMaterialZoneUpdate(arg);
        };
        VanStockService.prototype.registerMaterialCollection = function (arg) {
            return this._vanStockEngine.registerMaterialCollection(arg);
        };
        VanStockService.prototype.registerMaterialReturn = function (arg) {
            return this._vanStockEngine.registerMaterialReturn(arg);
        };
        VanStockService.prototype.registerMaterialRequest = function (arg) {
            return this._vanStockEngine.registerMaterialRequest(arg);
        };
        VanStockService.prototype.registerMaterialRequestWithdrawl = function (arg) {
            return this._vanStockEngine.registerMaterialRequestWithdrawl(arg);
        };
        VanStockService.prototype.registerMaterialTransfer = function (arg) {
            return this._vanStockEngine.registerMaterialTransfer(arg);
        };
        VanStockService.prototype.registerMaterialConsumption = function (arg) {
            return this._vanStockEngine.registerMaterialConsumption(arg);
        };
        VanStockService = __decorate([
            aurelia_framework_1.inject(vanStockService_1.VanStockService, vanStockPatchFactory_1.VanStockPatchFactory, vanStockEngine_1.VanStockEngine),
            __metadata("design:paramtypes", [Object, Object, Object])
        ], VanStockService);
        return VanStockService;
    }());
    exports.VanStockService = VanStockService;
});

//# sourceMappingURL=vanStockService.js.map
