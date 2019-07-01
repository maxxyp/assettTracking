/// <reference path="../../../../typings/app.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
define(["require", "exports", "aurelia-framework", "./constants/vanStockServiceConstants", "../../../common/core/services/assetService", "../../../common/resilience/apiException", "../../../common/resilience/services/resilientService", "../../../common/core/services/configurationService", "../../business/services/storageService", "aurelia-event-aggregator", "../../../common/resilience/services/resilientHttpClientFactory", "../../../common/core/wuaNetworkDiagnostics", "./vanStockHeaderProvider"], function (require, exports, aurelia_framework_1, vanStockServiceConstants_1, assetService_1, apiException_1, resilientService_1, configurationService_1, storageService_1, aurelia_event_aggregator_1, resilientHttpClientFactory_1, wuaNetworkDiagnostics_1, vanStockHeaderProvider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VanStockService = /** @class */ (function (_super) {
        __extends(VanStockService, _super);
        function VanStockService(assetService, configurationService, storageService, eventAggregator, headerProvider, resilientClientFactory, wuaNetworkDiagnostics) {
            var _this = _super.call(this, configurationService, "assetTrackingEndpoint", storageService, eventAggregator, headerProvider, resilientClientFactory, wuaNetworkDiagnostics) || this;
            _this._assetService = assetService;
            return _this;
        }
        VanStockService.prototype.getVanstockPatch = function (patchCode, sector) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    try {
                        return [2 /*return*/, this._assetService.loadJson(vanStockServiceConstants_1.VanStockServiceConstants.PATCH_VANSTOCK_ENDPOINT + "/" + sector + "/" + patchCode + ".json")];
                    }
                    catch (error) {
                        throw new apiException_1.ApiException(this, "getVanstockPatch", error, undefined, undefined, undefined);
                    }
                    return [2 /*return*/];
                });
            });
        };
        VanStockService.prototype.getVanstockPatchCodes = function (sector) {
            try {
                return this._assetService.loadJson(vanStockServiceConstants_1.VanStockServiceConstants.PATCH_VANSTOCK_ENDPOINT + "/" + sector + "/patch_list.json");
            }
            catch (error) {
                throw new apiException_1.ApiException(this, "getVanstockPatchCodes", error, undefined, undefined, undefined);
            }
        };
        VanStockService.prototype.getEngineerMaterials = function (engineerId) {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getData("materials", { "engineerId": engineerId })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response || []]; // make sure no nulls or undefined go back
                    }
                });
            });
        };
        VanStockService.prototype.getHighValueTools = function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getData("highvaluetools", null)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response || []]; // make sure no nulls or undefined go back
                    }
                });
            });
        };
        VanStockService.prototype.getEngineerActions = function (engineerId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getData("actions", { "engineerId": engineerId }, true)];
                        case 1: return [2 /*return*/, (_a.sent())
                                || {
                                    dispatchedMaterials: [],
                                    reservedMaterials: [],
                                    transferredMaterials: []
                                }]; // make sure no null or undefined package goes back
                    }
                });
            });
        };
        VanStockService.prototype.getRemoteMaterialSearch = function (stockReferenceId) {
            return __awaiter(this, void 0, void 0, function () {
                var results, error_1, apiException;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            if (!this.isInternetConnected()) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getData("search", { materialCode: stockReferenceId }, true)];
                        case 1:
                            results = _a.sent();
                            return [2 /*return*/, { isInternectConnected: true, results: results || [] }]; // make sure no nulls or undefined go back
                        case 2: return [2 /*return*/, { isInternectConnected: false, results: [] }];
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            if (error_1 instanceof apiException_1.ApiException) {
                                apiException = error_1;
                                if (apiException.httpStatusCode && apiException.httpStatusCode[0] === "4" /* any 400, 404 etc codes */) {
                                    return [2 /*return*/, { isInternectConnected: true, results: [] }];
                                }
                            }
                            throw new apiException_1.ApiException(this, "onlineMaterialSearch", error_1, undefined, undefined, undefined);
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        VanStockService.prototype.sendMaterialZoneUpdate = function (materialCode, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.putDataResilient("zone", { materialCode: materialCode }, data)];
                });
            });
        };
        VanStockService.prototype.sendMaterialReceipt = function (materialCode, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.postDataResilient("receipt", { materialCode: materialCode }, data)];
                });
            });
        };
        VanStockService.prototype.sendMaterialReturn = function (materialCode, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.postDataResilient("return", { materialCode: materialCode }, data)];
                });
            });
        };
        VanStockService.prototype.sendMaterialRequest = function (materialCode, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.postDataResilient("reservation", { materialCode: materialCode }, data)];
                });
            });
        };
        VanStockService.prototype.sendMaterialRequestUpdate = function (materialCode, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.putDataResilient("reservation", { materialCode: materialCode }, data)];
                });
            });
        };
        VanStockService.prototype.sendMaterialTransfer = function (materialCode, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.postDataResilient("transfer", { materialCode: materialCode }, data)];
                });
            });
        };
        VanStockService.prototype.sendMaterialConsumption = function (materialCode, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.postDataResilient("consumption", { materialCode: materialCode }, data)];
                });
            });
        };
        VanStockService = __decorate([
            aurelia_framework_1.inject(assetService_1.AssetService, configurationService_1.ConfigurationService, storageService_1.StorageService, aurelia_event_aggregator_1.EventAggregator, vanStockHeaderProvider_1.VanStockHeaderProvider, resilientHttpClientFactory_1.ResilientHttpClientFactory, wuaNetworkDiagnostics_1.WuaNetworkDiagnostics),
            __metadata("design:paramtypes", [Object, Object, Object, aurelia_event_aggregator_1.EventAggregator, Object, resilientHttpClientFactory_1.ResilientHttpClientFactory,
                wuaNetworkDiagnostics_1.WuaNetworkDiagnostics])
        ], VanStockService);
        return VanStockService;
    }(resilientService_1.ResilientService));
    exports.VanStockService = VanStockService;
});

//# sourceMappingURL=vanStockService.js.map
