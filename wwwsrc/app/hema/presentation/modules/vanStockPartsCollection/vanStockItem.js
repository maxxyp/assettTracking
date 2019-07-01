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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
define(["require", "exports", "../../../business/services/labelService", "aurelia-event-aggregator", "aurelia-dialog", "aurelia-framework", "../../models/baseViewModel", "./updateDialog", "./partsCollectionMain", "../../../business/services/constants/engineerServiceConstants", "../../../business/services/engineerService"], function (require, exports, labelService_1, aurelia_event_aggregator_1, aurelia_dialog_1, aurelia_framework_1, baseViewModel_1, updateDialog_1, partsCollectionMain_1, engineerServiceConstants_1, engineerService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VanStockItem = /** @class */ (function (_super) {
        __extends(VanStockItem, _super);
        function VanStockItem(labelService, eventAggregator, dialogService, engineerService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this._engineerService = engineerService;
            return _this;
        }
        VanStockItem.prototype.activateAsync = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.part = params.part;
                            this.myVanAreas = params.myVanAreas;
                            this._eventAggregator.subscribe(engineerServiceConstants_1.EngineerServiceConstants.ENGINEER_STATUS_CHANGED, function () { return _this.update(); });
                            return [4 /*yield*/, this.update()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, Promise.resolve()];
                    }
                });
            });
        };
        VanStockItem.prototype.toggleVerified = function () {
            this.part.verified = !this.part.verified;
            this._eventAggregator.publish(partsCollectionMain_1.PartsCollectionMain.MARK_PART_AS_VERIFIED);
        };
        VanStockItem.prototype.editVanStock = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var part, model, viewModel, result, editedPart, areaChanged, exists;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            part = __assign({}, this.part, { verified: false });
                            model = { part: part, myVanAreas: this.myVanAreas };
                            viewModel = updateDialog_1.UpdateDialog;
                            return [4 /*yield*/, this._dialogService.open({ viewModel: viewModel, model: model })];
                        case 1:
                            result = _a.sent();
                            if (result.wasCancelled) {
                                return [2 /*return*/];
                            }
                            editedPart = result.output;
                            areaChanged = editedPart.area !== this.part.area;
                            editedPart.areaChanged = areaChanged;
                            this.part = editedPart;
                            this._eventAggregator.publish(partsCollectionMain_1.PartsCollectionMain.UPDATE_PART, editedPart);
                            // update zone if changed
                            // const {stockReferenceId, quantityCollected, jobId, area, description, amount} = this.part;
                            if (editedPart.areaChanged) {
                                exists = this.myVanAreas.some(function (a) { return a === _this.part.area; });
                                if (exists) {
                                    return [2 /*return*/];
                                }
                                this.myVanAreas.push(this.part.area);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        VanStockItem.prototype.update = function () {
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
        VanStockItem = __decorate([
            aurelia_framework_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, engineerService_1.EngineerService),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object])
        ], VanStockItem);
        return VanStockItem;
    }(baseViewModel_1.BaseViewModel));
    exports.VanStockItem = VanStockItem;
});

//# sourceMappingURL=vanStockItem.js.map
