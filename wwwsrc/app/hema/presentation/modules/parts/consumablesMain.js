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
define(["require", "exports", "../../../business/models/dataState", "aurelia-dependency-injection", "../../../business/services/vanStockService", "../../../business/services/featureToggleService", "../../../business/services/constants/vanStockConstants", "aurelia-event-aggregator", "../../services/pageService", "../../../../common/core/objectHelper", "../../../business/services/constants/consumableServiceConstants", "./consumablesBasket", "../../../business/services/storageService"], function (require, exports, dataState_1, aurelia_dependency_injection_1, vanStockService_1, featureToggleService_1, vanStockConstants_1, aurelia_event_aggregator_1, pageService_1, objectHelper_1, consumableServiceConstants_1, consumablesBasket_1, storageService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConsumablesMain = /** @class */ (function () {
        function ConsumablesMain(vanStockService, featureToggleService, eventAggregator, pageService, storageService) {
            this._vanStockService = vanStockService;
            this._featureToggleService = featureToggleService;
            this._storageService = storageService;
            this._subscriptions = [];
            this._eventAggregator = eventAggregator;
            this.consumablesLabel = "Consumables";
            this._pageService = pageService;
        }
        ConsumablesMain.prototype.configureRouter = function (config, childRouter) {
            this.router = childRouter;
            this.setupChildRoutes();
            config.map(this._childRoutes);
        };
        ConsumablesMain.prototype.activate = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var vanStockSub, consumableAddSub, consumableReadSub, read;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this._featureToggleService.isAssetTrackingEnabled()) {
                                this.consumablesLabel = "Material";
                            }
                            vanStockSub = this._eventAggregator.subscribe(vanStockConstants_1.VanStockConstants.VANSTOCK_UPDATED, function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.updateVanStockTitle()];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, this.updateInOutStockTitle()];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            consumableAddSub = this._eventAggregator.subscribe(consumableServiceConstants_1.ConsumableServiceConstants.CONSUMABLE_ADDED, function (count) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.updateConsumablesTitle(count)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            consumableReadSub = this._eventAggregator.subscribe(consumablesBasket_1.ConsumablesBasket.READ_CONSUMBALES_BASKET, function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.updateConsumablesTitle(0)];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, this._storageService.setConsumablesRead(true)];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            this._subscriptions = [vanStockSub, consumableAddSub, consumableReadSub];
                            return [4 /*yield*/, this._storageService.getConsumablesRead()];
                        case 1:
                            read = _a.sent();
                            return [4 /*yield*/, this.updateConsumablesTitle(read ? 0 : 1)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.updateVanStockTitle()];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.updateInOutStockTitle()];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ConsumablesMain.prototype.deactivate = function () {
            this._subscriptions.forEach(function (subscription) { return subscription.dispose(); });
            this._subscriptions = [];
            return Promise.resolve();
        };
        ConsumablesMain.prototype.navigateToRoute = function (name) {
            this.router.navigateToRoute(name);
        };
        ConsumablesMain.prototype.setupChildRoutes = function () {
            if (this._featureToggleService.isAssetTrackingEnabled()) {
                var landingPage = this._pageService.getLastVisitedPage(objectHelper_1.ObjectHelper.getClassName(this)) || "van-stock";
                this._childRoutes = [{
                        route: "",
                        redirect: landingPage
                    }];
                this._childRoutes.push({
                    route: "in-out-stock",
                    moduleId: "hema/presentation/modules/vanStock/inOutStock",
                    name: "in-out-stock",
                    nav: true,
                    title: "Locate Items",
                    settings: {
                        dataState: dataState_1.DataState.dontCare,
                        alwaysShow: true,
                        showCount: false,
                        showDataState: true,
                    }
                });
                this._childRoutes.push({
                    route: "van-stock",
                    moduleId: "hema/presentation/modules/vanStock/vanStock",
                    name: "van-stock",
                    nav: true,
                    title: "My Stock",
                    settings: {
                        dataState: dataState_1.DataState.dontCare,
                        showDataState: false,
                        showCount: true,
                        alwaysShow: true
                    }
                });
            }
            else {
                this._childRoutes = [{
                        route: "",
                        redirect: "consumables-basket"
                    }];
            }
            this._childRoutes.push({
                route: "consumables-basket",
                moduleId: "hema/presentation/modules/parts/consumablesBasket",
                name: "consumables-basket",
                nav: true,
                title: "Consumables",
                settings: {
                    dataState: dataState_1.DataState.dontCare,
                    showDataState: true,
                    showCount: false,
                    alwaysShow: true,
                }
            });
            this._childRoutes.push({
                route: "consumables-history",
                moduleId: "hema/presentation/modules/parts/consumablesHistory",
                name: "consumables-history",
                nav: true,
                title: "Order History",
                settings: {
                    dataState: dataState_1.DataState.dontCare,
                    showDataState: false,
                    showCount: false,
                    alwaysShow: true
                }
            });
            this._childRoutes.push({
                route: "consumables-favourites",
                moduleId: "hema/presentation/modules/parts/consumablesFavourites",
                name: "consumables-favourites",
                nav: true,
                title: "Favourites",
                settings: {
                    dataState: dataState_1.DataState.dontCare,
                    showDataState: false,
                    showCount: true,
                    alwaysShow: true
                }
            });
        };
        ConsumablesMain.prototype.updateVanStockTitle = function () {
            return __awaiter(this, void 0, void 0, function () {
                var total;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._vanStockService.getLocalVanStockTotal()];
                        case 1:
                            total = _a.sent();
                            this.updateTitle("van-stock", total);
                            return [2 /*return*/];
                    }
                });
            });
        };
        ConsumablesMain.prototype.updateInOutStockTitle = function () {
            return __awaiter(this, void 0, void 0, function () {
                var items, total;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._vanStockService.getMaterialRequests()];
                        case 1:
                            items = _a.sent();
                            total = items && items.outboundMaterials ? items.outboundMaterials.filter(function (i) { return i.isUnread; }).length : 0;
                            this.updateTitle("in-out-stock", total);
                            return [2 /*return*/];
                    }
                });
            });
        };
        ConsumablesMain.prototype.updateConsumablesTitle = function (count) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.updateTitle("consumables-basket", count);
                    return [2 /*return*/];
                });
            });
        };
        ConsumablesMain.prototype.updateTitle = function (route, count) {
            // if  items and already on page no need to update the badge
            if (!this.router) {
                return;
            }
            var onRoute = this.router && this.router.currentInstruction &&
                this.router.currentInstruction.fragment === route;
            // if already on page then badge count 0 (means that items read)
            // or we are on different page and we want to update the badge (change tab from orange to grey).
            var updateTheTab = (count === 0) || (!onRoute && count > 0);
            if (!updateTheTab) {
                return;
            }
            var routeObject = this.router.routes.find(function (r) { return r.route === route; });
            if (!routeObject) {
                return;
            }
            var settings = routeObject.settings, navModel = routeObject.navModel, title = routeObject.title;
            if (settings && settings.showDataState) {
                settings.badgeCount = count;
                settings.dataState = count ? dataState_1.DataState.notVisited : dataState_1.DataState.dontCare;
            }
            if (!navModel) {
                return;
            }
            if (settings.showCount) {
                var formattedTitle = title + " " + (count ? "(" + count + ")" : "");
                navModel.setTitle(formattedTitle);
            }
        };
        ConsumablesMain = __decorate([
            aurelia_dependency_injection_1.inject(vanStockService_1.VanStockService, featureToggleService_1.FeatureToggleService, aurelia_event_aggregator_1.EventAggregator, pageService_1.PageService, storageService_1.StorageService),
            __metadata("design:paramtypes", [Object, Object, aurelia_event_aggregator_1.EventAggregator, Object, Object])
        ], ConsumablesMain);
        return ConsumablesMain;
    }());
    exports.ConsumablesMain = ConsumablesMain;
});

//# sourceMappingURL=consumablesMain.js.map
