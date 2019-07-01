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
define(["require", "exports", "aurelia-framework", "../../models/baseViewModel", "../../../business/services/labelService", "aurelia-event-aggregator", "aurelia-dialog", "../../../business/services/vanStockService", "../../../business/services/constants/vanStockServiceConstants", "./updateVanStockItem", "./returnVanStockItem"], function (require, exports, aurelia_framework_1, baseViewModel_1, labelService_1, aurelia_event_aggregator_1, aurelia_dialog_1, vanStockService_1, vanStockServiceConstants_1, updateVanStockItem_1, returnVanStockItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VanStock = /** @class */ (function (_super) {
        __extends(VanStock, _super);
        function VanStock(labelService, eventAggregator, dialogService, vanStockService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this._vanStockService = vanStockService;
            _this._pageSize = 1000;
            _this._currentCount = _this._pageSize;
            _this.sort = {};
            _this.hideLoadMore = false;
            _this._myVanAreas = [];
            _this.selectedRow = -1;
            return _this;
        }
        VanStock.prototype.activateAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.sort.sortBy = "stockReferenceId";
                            this.sort.sortOrderAsc = true;
                            return [4 /*yield*/, this.populate()];
                        case 1:
                            _a.sent();
                            this.showContent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        VanStock.prototype.loadMore = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this._currentCount = this._currentCount + this._pageSize;
                            _a = this;
                            return [4 /*yield*/, this._vanStockService.searchLocalVanStock(this._currentCount, this.sort, this.searchText)];
                        case 1:
                            _a.material = _b.sent();
                            return [4 /*yield*/, this.showHideLoadMore(this.searchText)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, this.populateMyVanAreas()];
                        case 3:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        VanStock.prototype.sortVanStock = function (sortProperty) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.sort.sortBy = sortProperty;
                            this.sort.sortOrderAsc = !this.sort.sortOrderAsc;
                            _a = this;
                            return [4 /*yield*/, this._vanStockService.searchLocalVanStock(this._currentCount, this.sort, this.searchText)];
                        case 1:
                            _a.material = _b.sent();
                            return [4 /*yield*/, this.populateMyVanAreas()];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        VanStock.prototype.searchTextChanged = function (newValue, oldValue) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!newValue) {
                                newValue = "";
                            }
                            if (!oldValue) {
                                oldValue = "";
                            }
                            newValue = newValue.trim();
                            oldValue = oldValue.trim();
                            if (!this.searchAutoCorrect(newValue, oldValue)) return [3 /*break*/, 4];
                            _a = this;
                            return [4 /*yield*/, this._vanStockService.searchLocalVanStock(this._currentCount, this.sort, newValue)];
                        case 1:
                            _a.material = _b.sent();
                            return [4 /*yield*/, this.showHideLoadMore(newValue)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, this.populateMyVanAreas()];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        VanStock.prototype.editVanStock = function (part) {
            return __awaiter(this, void 0, void 0, function () {
                var model, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.selectedRow = -1;
                            model = {};
                            model.material = part;
                            model.myVanAreas = this._myVanAreas;
                            return [4 /*yield*/, this._dialogService.open({ viewModel: updateVanStockItem_1.UpdateVanStockItem, model: model })];
                        case 1:
                            result = _a.sent();
                            if (!result) return [3 /*break*/, 5];
                            if (!!result.wasCancelled) return [3 /*break*/, 3];
                            return [4 /*yield*/, this._vanStockService.registerMaterialZoneUpdate(result.output)];
                        case 2:
                            _a.sent();
                            this.showInfo("My Van Stock Update", "Van stock updated.");
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.populate()];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        VanStock.prototype.returnVanStock = function (part) {
            return __awaiter(this, void 0, void 0, function () {
                var model, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.selectedRow = -1;
                            model = {};
                            model.material = part;
                            return [4 /*yield*/, this._dialogService.open({ viewModel: returnVanStockItem_1.ReturnVanStockItem, model: model })];
                        case 1:
                            result = _a.sent();
                            if (!result) return [3 /*break*/, 5];
                            if (!!result.wasCancelled) return [3 /*break*/, 3];
                            return [4 /*yield*/, this._vanStockService.registerMaterialReturn({
                                    stockReferenceId: result.output.material.stockReferenceId,
                                    quantityReturned: result.output.quantityToReturn,
                                    reason: result.output.returnReason
                                })];
                        case 2:
                            _a.sent();
                            this.showInfo("Material Return", "Material return requested.");
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.populate()];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        Object.defineProperty(VanStock.prototype, "isEditing", {
            get: function () {
                return this.selectedRow !== -1;
            },
            enumerable: true,
            configurable: true
        });
        VanStock.prototype.setNotEditing = function () {
            this.setEditingRow(-1);
        };
        VanStock.prototype.setEditingRow = function (index) {
            this.selectedRow = index;
        };
        VanStock.prototype.searchAutoCorrect = function (newValue, oldValue) {
            if (newValue && (newValue.length === 1 && newValue === "@")) {
                this.searchText = vanStockServiceConstants_1.VanStockServiceConstants.AREA_SEARCH_PREFIX;
                return false;
            }
            if (newValue && (newValue.length === 1 && newValue === "#")) {
                this.searchText = vanStockServiceConstants_1.VanStockServiceConstants.JOB_SEARCH_PREFIX;
                return false;
            }
            if (oldValue && newValue && newValue.length < oldValue.length) {
                if (oldValue.trim() === vanStockServiceConstants_1.VanStockServiceConstants.AREA_SEARCH_PREFIX
                    || oldValue.trim() === vanStockServiceConstants_1.VanStockServiceConstants.JOB_SEARCH_PREFIX) {
                    this.searchText = undefined;
                }
            }
            return true;
        };
        VanStock.prototype.populateMyVanAreas = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this;
                            return [4 /*yield*/, this._vanStockService.getLocalVanStockAreaLookup()];
                        case 1:
                            _a._myVanAreas = _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        VanStock.prototype.populate = function () {
            return __awaiter(this, void 0, void 0, function () {
                var material;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._vanStockService.searchLocalVanStock(this._currentCount, this.sort, this.searchText)];
                        case 1:
                            material = _a.sent();
                            if (!material) return [3 /*break*/, 4];
                            this.material = material;
                            return [4 /*yield*/, this.showHideLoadMore(this.searchText)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.populateMyVanAreas()];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        VanStock.prototype.showHideLoadMore = function (searchText) {
            return __awaiter(this, void 0, void 0, function () {
                var totalVanStockCount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._vanStockService.getLocalVanStockLineTotal(searchText)];
                        case 1:
                            totalVanStockCount = _a.sent();
                            this.hideLoadMore = totalVanStockCount === this.material.length;
                            return [2 /*return*/];
                    }
                });
            });
        };
        __decorate([
            aurelia_framework_1.observable,
            __metadata("design:type", String)
        ], VanStock.prototype, "searchText", void 0);
        __decorate([
            aurelia_framework_1.computedFrom("selectedRow"),
            __metadata("design:type", Boolean),
            __metadata("design:paramtypes", [])
        ], VanStock.prototype, "isEditing", null);
        VanStock = __decorate([
            aurelia_framework_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, vanStockService_1.VanStockService),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object])
        ], VanStock);
        return VanStock;
    }(baseViewModel_1.BaseViewModel));
    exports.VanStock = VanStock;
});

//# sourceMappingURL=vanStock.js.map
