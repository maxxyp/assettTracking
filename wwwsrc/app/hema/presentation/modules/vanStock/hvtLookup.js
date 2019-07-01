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
define(["require", "exports", "aurelia-framework", "aurelia-dialog", "../../../business/services/vanStockService", "../../../business/services/constants/vanStockServiceConstants"], function (require, exports, aurelia_framework_1, aurelia_dialog_1, vanStockService_1, vanStockServiceConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HvtLookup = /** @class */ (function () {
        function HvtLookup(dialogController, vanStockService) {
            this.controller = dialogController;
            this._vanStockService = vanStockService;
            this._pageSize = 1000;
            this._currentCount = this._pageSize;
            this.hideLoadMore = false;
            if (this.controller) {
                this.controller.settings.lock = true;
                this.material = this.controller.settings.model;
            }
        }
        HvtLookup.prototype.attached = function () {
            return __awaiter(this, void 0, void 0, function () {
                var material;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._vanStockService.getHighValueToolList(this._currentCount, this.searchText)];
                        case 1:
                            material = _a.sent();
                            if (material) {
                                this.material = material;
                                this.showHideLoadMore(this.searchText);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        HvtLookup.prototype.loadMore = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this._currentCount = this._currentCount + this._pageSize;
                            _a = this;
                            return [4 /*yield*/, this._vanStockService.getHighValueToolList(this._currentCount, this.searchText)];
                        case 1:
                            _a.material = _b.sent();
                            this.showHideLoadMore(this.searchText);
                            return [2 /*return*/];
                    }
                });
            });
        };
        HvtLookup.prototype.searchTextChanged = function (newValue, oldValue) {
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
                            if (!this.searchAutoCorrect(newValue, oldValue)) return [3 /*break*/, 2];
                            _a = this;
                            return [4 /*yield*/, this._vanStockService.getHighValueToolList(this._currentCount, newValue)];
                        case 1:
                            _a.material = _b.sent();
                            this.showHideLoadMore(newValue);
                            _b.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        HvtLookup.prototype.searchAutoCorrect = function (newValue, oldValue) {
            if (newValue && (newValue.length === 1 && newValue === "@")) {
                this.searchText = vanStockServiceConstants_1.VanStockServiceConstants.AREA_SEARCH_PREFIX;
                return false;
            }
            return true;
        };
        HvtLookup.prototype.showHideLoadMore = function (searchText) {
            return __awaiter(this, void 0, void 0, function () {
                var totalVanStockCount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._vanStockService.getHighValueToolTotal(searchText)];
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
        ], HvtLookup.prototype, "searchText", void 0);
        HvtLookup = __decorate([
            aurelia_framework_1.inject(aurelia_dialog_1.DialogController, vanStockService_1.VanStockService),
            __metadata("design:paramtypes", [aurelia_dialog_1.DialogController, Object])
        ], HvtLookup);
        return HvtLookup;
    }());
    exports.HvtLookup = HvtLookup;
});

//# sourceMappingURL=hvtLookup.js.map
