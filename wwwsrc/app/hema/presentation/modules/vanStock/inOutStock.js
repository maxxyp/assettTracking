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
define(["require", "exports", "aurelia-framework", "../../models/baseViewModel", "../../../business/services/labelService", "aurelia-event-aggregator", "aurelia-dialog", "../../../business/services/vanStockService", "../../../business/services/constants/vanStockConstants", "aurelia-binding", "./hvtLookup", "./vanStockReservationHelper", "../../../../common/ui/dialogs/models/confirmDialogModel", "../../../../common/ui/dialogs/confirmDialog", "../../../../common/core/dateHelper"], function (require, exports, aurelia_framework_1, baseViewModel_1, labelService_1, aurelia_event_aggregator_1, aurelia_dialog_1, vanStockService_1, vanStockConstants_1, aurelia_binding_1, hvtLookup_1, vanStockReservationHelper_1, confirmDialogModel_1, confirmDialog_1, dateHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var InOutStock = /** @class */ (function (_super) {
        __extends(InOutStock, _super);
        function InOutStock(labelService, eventAggregator, dialogService, vanStockService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this._vanStockService = vanStockService;
            return _this;
        }
        InOutStock.prototype.activateAsync = function (queryParams) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.statusFlag = this._vanStockService.getBindableVanStockStatusFlag();
                            return [4 /*yield*/, this.populateReturns()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.populateInOut()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.populateCollection()];
                        case 3:
                            _a.sent();
                            this._subscription = this._eventAggregator.subscribe(vanStockConstants_1.VanStockConstants.VANSTOCK_UPDATED, function () {
                                _this.populateReturns();
                                _this.populateInOut();
                                _this.populateCollection();
                            });
                            this.showContent();
                            return [4 /*yield*/, this.trySearchViaQueryString(queryParams)];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        InOutStock.prototype.deactivateAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var requestIds;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this._subscription) {
                                this._subscription.dispose();
                                this._subscription = null;
                            }
                            requestIds = this.outboundMaterials.map(function (o) { return o.id; });
                            return [4 /*yield*/, this._vanStockService.registerMaterialRequestReads({ requestIds: requestIds })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, Promise.resolve()];
                    }
                });
            });
        };
        InOutStock.prototype.collect = function (item) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var vm;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            vm = new confirmDialogModel_1.ConfirmDialogModel();
                            vm.header = "Confirmation";
                            vm.text = "Are you sure that your wish to collect the item " + item.stockReferenceId + "?";
                            return [4 /*yield*/, this._dialogService.open({ viewModel: confirmDialog_1.ConfirmDialog, model: vm })
                                    .then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                                    var ex_1;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!(result.wasCancelled === false)) return [3 /*break*/, 5];
                                                _a.label = 1;
                                            case 1:
                                                _a.trys.push([1, 4, , 5]);
                                                return [4 /*yield*/, this._vanStockService.registerMaterialTransfer({ requestId: item.id })];
                                            case 2:
                                                _a.sent();
                                                this.showSuccess("Material Collection", "Material collected.");
                                                return [4 /*yield*/, this.populateInOut()];
                                            case 3:
                                                _a.sent();
                                                return [3 /*break*/, 5];
                                            case 4:
                                                ex_1 = _a.sent();
                                                this.showError(ex_1);
                                                return [3 /*break*/, 5];
                                            case 5: return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        InOutStock.prototype.cancelCollection = function (item) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var vm;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            vm = new confirmDialogModel_1.ConfirmDialogModel();
                            vm.header = "Confirmation";
                            vm.text = "Are you sure that your wish to cancel this reservation for item " + item.stockReferenceId + "?";
                            return [4 /*yield*/, this._dialogService.open({ viewModel: confirmDialog_1.ConfirmDialog, model: vm })
                                    .then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                                    var ex_2;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!(result.wasCancelled === false)) return [3 /*break*/, 5];
                                                _a.label = 1;
                                            case 1:
                                                _a.trys.push([1, 4, , 5]);
                                                return [4 /*yield*/, this._vanStockService.registerMaterialRequestWithdrawl({ requestId: item.id })];
                                            case 2:
                                                _a.sent();
                                                this.showInfo("Material Collection", "Material collection cancelled.");
                                                return [4 /*yield*/, this.populateInOut()];
                                            case 3:
                                                _a.sent();
                                                return [3 /*break*/, 5];
                                            case 4:
                                                ex_2 = _a.sent();
                                                this.showError(ex_2);
                                                return [3 /*break*/, 5];
                                            case 5: return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        InOutStock.prototype.search = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (this.searchText && vanStockService_1.STOCK_REFERENCE_ID_REGEX.test(this.searchText.trim())) {
                        this.materialSearchResult = this._vanStockService.getBindableMaterialSearchResult(this.searchText.trim());
                    }
                    return [2 /*return*/];
                });
            });
        };
        InOutStock.prototype.view = function (res) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, vanStockReservationHelper_1.VanStockReservationHelper.launchReservationDialog(this._dialogService, this._vanStockService, res, function (hasAReservationBeenMade) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!hasAReservationBeenMade) return [3 /*break*/, 2];
                                            this.showSuccess("Material Request", "Material request sent.");
                                            return [4 /*yield*/, this.populateInOut()];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2:
                                            this.resetSearch();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        InOutStock.prototype.searchTextChanged = function (newValue) {
            // clear out search result when we have one and the user starts typing again
            if (this.materialSearchResult && !vanStockService_1.STOCK_REFERENCE_ID_REGEX.test(newValue.trim())) {
                this.materialSearchResult = undefined;
            }
        };
        InOutStock.prototype.openhvt = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._dialogService.open({ viewModel: hvtLookup_1.HvtLookup })];
                        case 1:
                            result = _a.sent();
                            if (!result) return [3 /*break*/, 3];
                            if (!!result.wasCancelled) return [3 /*break*/, 3];
                            this.searchText = result.output.materialCode;
                            return [4 /*yield*/, this.search()];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        InOutStock.prototype.getDateTime = function (pDate, pTime) {
            var getDateString = dateHelper_1.DateHelper.getDateFromNumber(pDate, pTime, "YYYYMMDD", "HHmmssSS");
            return getDateString || "";
        };
        InOutStock.prototype.populateReturns = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this;
                            return [4 /*yield*/, this._vanStockService.getReturns()];
                        case 1:
                            _a.returns = _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        InOutStock.prototype.populateInOut = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, inboundMaterials, outboundMaterials;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this._vanStockService.getMaterialRequests()];
                        case 1:
                            _a = _b.sent(), inboundMaterials = _a.inboundMaterials, outboundMaterials = _a.outboundMaterials;
                            this.inboundMaterials = inboundMaterials;
                            this.outboundMaterials = outboundMaterials;
                            return [2 /*return*/];
                    }
                });
            });
        };
        InOutStock.prototype.populateCollection = function () {
            return __awaiter(this, void 0, void 0, function () {
                var collected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._vanStockService.getPartsToCollect()];
                        case 1:
                            collected = (_a.sent()).collected;
                            this.materialCollected = collected;
                            return [2 /*return*/];
                    }
                });
            });
        };
        InOutStock.prototype.resetSearch = function () {
            this.searchText = "";
            this.materialSearchResult = undefined;
        };
        InOutStock.prototype.trySearchViaQueryString = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var searchParam;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            searchParam = params && params.search;
                            if (!searchParam) {
                                return [2 /*return*/];
                            }
                            this.searchText = searchParam;
                            return [4 /*yield*/, this.search()];
                        case 1:
                            _a.sent();
                            if (!(this.materialSearchResult
                                && this.materialSearchResult.online
                                && this.materialSearchResult.online.results
                                && this.materialSearchResult.online.results.length)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.view(this.materialSearchResult)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", String)
        ], InOutStock.prototype, "searchText", void 0);
        InOutStock = __decorate([
            aurelia_framework_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, vanStockService_1.VanStockService),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object])
        ], InOutStock);
        return InOutStock;
    }(baseViewModel_1.BaseViewModel));
    exports.InOutStock = InOutStock;
});

//# sourceMappingURL=inOutStock.js.map
