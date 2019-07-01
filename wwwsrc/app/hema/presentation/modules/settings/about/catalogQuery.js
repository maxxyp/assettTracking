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
define(["require", "exports", "aurelia-dependency-injection", "../../../../../common/storage/indexedDatabaseService", "aurelia-dialog", "aurelia-event-aggregator", "../../../../business/services/labelService", "aurelia-binding", "../../../../business/models/reference/referenceDataManifest", "../../../../business/services/constants/referenceDataConstants", "../../../../../common/core/arrayHelper", "./baseInformation"], function (require, exports, aurelia_dependency_injection_1, indexedDatabaseService_1, aurelia_dialog_1, aurelia_event_aggregator_1, labelService_1, aurelia_binding_1, referenceDataManifest_1, referenceDataConstants_1, arrayHelper_1, baseInformation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var REFERENCE_DATA_MANIFEST = new referenceDataManifest_1.ReferenceDataManifest();
    var REF_DATABASE = referenceDataConstants_1.ReferenceDataConstants.REFERENCE_DATABASE;
    var CatalogQuery = /** @class */ (function (_super) {
        __extends(CatalogQuery, _super);
        function CatalogQuery(labelService, eventAggregator, dialogService, indexDatabaseService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            var catalogTables = arrayHelper_1.ArrayHelper.sortByColumn(REFERENCE_DATA_MANIFEST.all(), "type") || [];
            _this.catalogs = catalogTables.map(function (ct) {
                var code = ct.type;
                return { code: code, description: code };
            });
            _this.isExpanded = false;
            _this.indexNames = [];
            _this._indexDatabaseService = indexDatabaseService;
            _this.indexValue = "";
            _this.queryResult = "";
            _this.showQuery = false;
            _this.itemsFound = 0;
            return _this;
        }
        CatalogQuery.prototype.activateAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, Promise.resolve()];
                });
            });
        };
        Object.defineProperty(CatalogQuery.prototype, "noIndexes", {
            get: function () {
                return !this.indexNames || this.indexNames.length === 0;
            },
            enumerable: true,
            configurable: true
        });
        CatalogQuery.prototype.selectedCatalogChanged = function () {
            return __awaiter(this, void 0, void 0, function () {
                var indexes, length, items, i;
                return __generator(this, function (_a) {
                    if (!this.selectedCatalog || this.selectedCatalog === "") {
                        this.indexNames = [];
                        return [2 /*return*/, Promise.resolve()];
                    }
                    this.itemsFound = 0;
                    this.queryResult = "";
                    this.indexValue = "";
                    indexes = this._indexDatabaseService.getIndexes(REF_DATABASE, this.selectedCatalog);
                    if (!indexes || indexes.length === 0) {
                        this.indexNames = undefined;
                        this.selectedIndexName = undefined;
                    }
                    length = indexes.length;
                    items = [];
                    for (i = 0; i < length; i++) {
                        items.push(indexes[i]);
                    }
                    this.indexNames = items.map(function (i) {
                        return { code: i, description: i };
                    });
                    this.selectedIndexName = undefined;
                    return [2 /*return*/];
                });
            });
        };
        CatalogQuery.prototype.clear = function () {
            this.indexValue = undefined;
            this.queryResult = undefined;
            this.showQuery = false;
            this.itemsFound = 0;
            this.selectedCatalog = undefined;
            this.selectedIndexName = undefined;
            this.indexNames = [];
        };
        CatalogQuery.prototype.queryIndex = function () {
            return __awaiter(this, void 0, void 0, function () {
                var indexValues, itemsFound, singleItem;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.queryResult = "";
                            this.itemsFound = 0;
                            this.showQuery = false;
                            indexValues = undefined;
                            itemsFound = [];
                            if (!!this.indexValue) return [3 /*break*/, 2];
                            return [4 /*yield*/, this._indexDatabaseService.getAll(REF_DATABASE, this.selectedCatalog)];
                        case 1:
                            itemsFound = _a.sent();
                            return [3 /*break*/, 6];
                        case 2:
                            if (!(this.indexValue.indexOf(",", 0) > -1)) return [3 /*break*/, 4];
                            indexValues = this.indexValue.split(",");
                            return [4 /*yield*/, this._indexDatabaseService.getAll(REF_DATABASE, this.selectedCatalog, this.selectedIndexName, indexValues)];
                        case 3:
                            itemsFound = _a.sent();
                            return [3 /*break*/, 6];
                        case 4:
                            indexValues = this.indexValue;
                            return [4 /*yield*/, this._indexDatabaseService.getAll(REF_DATABASE, this.selectedCatalog, this.selectedIndexName, indexValues)];
                        case 5:
                            singleItem = _a.sent();
                            itemsFound.push(singleItem);
                            _a.label = 6;
                        case 6:
                            this.itemsFound = itemsFound.length;
                            this.queryResult = JSON.stringify(itemsFound, undefined, 2);
                            this.showQuery = true;
                            return [2 /*return*/];
                    }
                });
            });
        };
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", String)
        ], CatalogQuery.prototype, "selectedCatalog", void 0);
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", String)
        ], CatalogQuery.prototype, "selectedIndexName", void 0);
        __decorate([
            aurelia_binding_1.computedFrom("indexNames"),
            __metadata("design:type", Boolean),
            __metadata("design:paramtypes", [])
        ], CatalogQuery.prototype, "noIndexes", null);
        CatalogQuery = __decorate([
            aurelia_dependency_injection_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, indexedDatabaseService_1.IndexedDatabaseService),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, Object])
        ], CatalogQuery);
        return CatalogQuery;
    }(baseInformation_1.BaseInformation));
    exports.CatalogQuery = CatalogQuery;
});

//# sourceMappingURL=catalogQuery.js.map
