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
define(["require", "exports", "aurelia-dialog", "aurelia-event-aggregator", "../../../business/services/labelService", "../../models/baseViewModel", "aurelia-framework", "../../../business/models/businessException", "./viewModels/partsCollectionViewModel", "../../../business/services/vanStockService", "./viewModels/partCollectionItemViewModel", "aurelia-router", "./confirmDialog", "../../../business/services/engineerService", "../../../business/services/workRetrievalTracker", "../../../business/services/constants/engineerServiceConstants"], function (require, exports, aurelia_dialog_1, aurelia_event_aggregator_1, labelService_1, baseViewModel_1, aurelia_framework_1, businessException_1, partsCollectionViewModel_1, vanStockService_1, partCollectionItemViewModel_1, aurelia_router_1, confirmDialog_1, engineerService_1, workRetrievalTracker_1, engineerServiceConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PartsCollectionMain = /** @class */ (function (_super) {
        __extends(PartsCollectionMain, _super);
        function PartsCollectionMain(labelService, eventAggregator, dialogService, vanStockService, engineerService, tracker, router) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this._vanStockService = vanStockService;
            _this._engineerService = engineerService;
            _this.tracker = tracker;
            _this._router = router;
            _this.allPartsVerified = false;
            eventAggregator.subscribe(PartsCollectionMain_1.MARK_PART_AS_VERIFIED, function () {
                _this.checkPartsVerified();
            });
            eventAggregator.subscribe(PartsCollectionMain_1.UPDATE_PART, function (part) {
                _this.updatePart(part);
            });
            _this._eventAggregator.subscribe(engineerServiceConstants_1.EngineerServiceConstants.ENGINEER_STATUS_CHANGED, function () { return _this.update(); });
            return _this;
        }
        PartsCollectionMain_1 = PartsCollectionMain;
        PartsCollectionMain.prototype.activateAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var materials, zones, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this._vanStockService.getPartsToCollect()];
                        case 1:
                            materials = (_a.sent());
                            return [4 /*yield*/, this._vanStockService.getLocalVanStockAreaLookup()];
                        case 2:
                            zones = _a.sent();
                            if (!zones) {
                                this.myVanAreas = [];
                            }
                            else {
                                this.myVanAreas = zones;
                            }
                            // map business to vm for materials
                            this.viewModel = this.mapMaterialsBusinessViewModel(materials.toCollect, materials.expectedReturns);
                            // set variables required for text
                            this.headerTitle = this.constructHeaderTitle(this.viewModel.parts, this.viewModel.expectedReturns);
                            // if to show submit button based on engineer status
                            this.update();
                            // this.setupObservables();
                            this.showContent();
                            return [2 /*return*/, Promise.resolve()];
                        case 3:
                            e_1 = _a.sent();
                            this.showError(new businessException_1.BusinessException(this, "PartsCollectionDetails", "Error while loading parts details", [], e_1));
                            return [2 /*return*/, Promise.resolve()];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        PartsCollectionMain.prototype.confirmParts = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var result, setupRegisterMaterialCollectionCalls, setupPartUpdateCalls, regCalls, updatePartCalls;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.confirmDialog()];
                        case 1:
                            result = _a.sent();
                            if (result.wasCancelled) {
                                return [2 /*return*/];
                            }
                            setupRegisterMaterialCollectionCalls = function (parts) {
                                var calls = [];
                                parts.forEach(function (part) {
                                    var quantityCollected = part.quantityCollected, id = part.id;
                                    calls.push(_this._vanStockService.registerMaterialCollection({ quantityCollected: quantityCollected, dispatchId: id }));
                                });
                                return calls;
                            };
                            setupPartUpdateCalls = function (parts) {
                                var calls = [];
                                parts.forEach(function (part) {
                                    var stockReferenceId = part.stockReferenceId, description = part.description, amount = part.amount, quantityCollected = part.quantityCollected, jobId = part.jobId, area = part.area;
                                    if (part.areaChanged) {
                                        var materialZoneUpdate = {
                                            stockReferenceId: stockReferenceId,
                                            jobId: jobId,
                                            description: description,
                                            quantity: quantityCollected,
                                            area: area,
                                            amount: amount
                                        };
                                        calls.push(_this._vanStockService.registerMaterialZoneUpdate(materialZoneUpdate));
                                    }
                                });
                                return calls;
                            };
                            regCalls = setupRegisterMaterialCollectionCalls(this.viewModel.parts);
                            updatePartCalls = setupPartUpdateCalls(this.viewModel.parts);
                            // order important, make sure materials are registered before updates
                            return [4 /*yield*/, Promise.all(regCalls)];
                        case 2:
                            // order important, make sure materials are registered before updates
                            _a.sent();
                            return [4 /*yield*/, Promise.all(updatePartCalls)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.setPartsCollected()];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PartsCollectionMain.prototype.setCollectingParts = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this._engineerService.isPartCollectionInProgress = true;
                            return [4 /*yield*/, this._engineerService.setStatus(engineerService_1.EngineerService.OBTAINING_MATS_STATUS)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PartsCollectionMain.prototype.confirmDialog = function () {
            // setup modal
            var collected = this.viewModel.parts.map(function (p) { return p.quantityCollected; }).reduce(function (a, b) { return a + b; });
            var expected = this.viewModel.parts.map(function (p) { return p.quantityExpected; }).reduce(function (a, b) { return a + b; });
            var model = { expected: expected, collected: collected };
            var viewModel = confirmDialog_1.ConfirmDialog;
            // handle modal result
            return this._dialogService.open({ viewModel: viewModel, model: model });
        };
        PartsCollectionMain.prototype.mapMaterialsBusinessViewModel = function (materials, returns) {
            var viewModel = new partsCollectionViewModel_1.PartsCollectionViewModel();
            var mapMaterialItemToViewModel = function (m) {
                var item = new partCollectionItemViewModel_1.PartCollectionItemViewModel();
                item.id = m.id;
                item.description = m.description;
                item.quantityExpected = m.quantity;
                item.quantityCollected = m.quantity;
                item.area = m.area;
                item.stockReferenceId = m.stockReferenceId;
                item.jobId = m.jobId;
                item.amount = 9999;
                item.verified = false;
                return item;
            };
            viewModel.parts = materials.map(function (m) { return mapMaterialItemToViewModel(m); });
            viewModel.expectedReturns = returns;
            return viewModel;
        };
        PartsCollectionMain.prototype.constructHeaderTitle = function (parts, returns) {
            var partNo = (parts || [])
                .map(function (p) { return p.quantityExpected || 0; })
                .reduce(function (a, b) { return a + b; }, 0);
            var partWord = "item" + (partNo > 1 ? "s" : "");
            var returnNo = (returns || [])
                .map(function (r) { return r.quantity || 0; })
                .reduce(function (a, b) { return a + b; }, 0);
            var returnWord = "item" + (returnNo > 1 ? "s" : "");
            return {
                partNo: partNo,
                partWord: partWord,
                returnNo: returnNo,
                returnWord: returnWord
            };
        };
        PartsCollectionMain.prototype.setPartsCollected = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this._engineerService.isPartCollectionInProgress = false;
                            // set the engineerstatus back to Working status
                            return [4 /*yield*/, this._engineerService.setStatus(undefined)];
                        case 1:
                            // set the engineerstatus back to Working status
                            _a.sent();
                            this._router.navigateToRoute("to-do");
                            return [2 /*return*/];
                    }
                });
            });
        };
        //#region event subscriptions
        PartsCollectionMain.prototype.checkPartsVerified = function () {
            this.allPartsVerified = this.viewModel.parts.map(function (p) { return p.verified; }).reduce(function (a, b) { return a && b; });
        };
        PartsCollectionMain.prototype.updatePart = function (newPart) {
            var foundIndex = this.viewModel.parts.findIndex(function (part) { return part.id === newPart.id; });
            this.viewModel.parts.splice(foundIndex, 1, newPart);
            this.allPartsVerified = false;
        };
        //#endregion
        PartsCollectionMain.prototype.update = function () {
            return __awaiter(this, void 0, void 0, function () {
                var status;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._engineerService.getStatus()];
                        case 1:
                            status = _a.sent();
                            if (status === engineerService_1.EngineerService.OBTAINING_MATS_STATUS) {
                                this.show = true;
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        PartsCollectionMain.MARK_PART_AS_VERIFIED = "MARK_PART_AS_VERIFIED";
        PartsCollectionMain.UPDATE_PART = "UPDATE_PART";
        PartsCollectionMain = PartsCollectionMain_1 = __decorate([
            aurelia_framework_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, vanStockService_1.VanStockService, engineerService_1.EngineerService, workRetrievalTracker_1.WorkRetrievalTracker, aurelia_router_1.Router),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, engineerService_1.EngineerService,
                workRetrievalTracker_1.WorkRetrievalTracker,
                aurelia_router_1.Router])
        ], PartsCollectionMain);
        return PartsCollectionMain;
        var PartsCollectionMain_1;
    }(baseViewModel_1.BaseViewModel));
    exports.PartsCollectionMain = PartsCollectionMain;
});

//# sourceMappingURL=partsCollectionMain.js.map
