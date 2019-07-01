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
define(["require", "exports", "aurelia-event-aggregator", "aurelia-dependency-injection", "aurelia-router", "./constants/consumableServiceConstants", "./constants/messageServiceConstants", "../../presentation/modules/parts/consumablesBasket", "./constants/vanStockConstants", "./messageService", "./vanStockService", "./constants/soundConstants", "./storageService", "../../../appConstants", "../../../common/core/guid"], function (require, exports, aurelia_event_aggregator_1, aurelia_dependency_injection_1, aurelia_router_1, consumableServiceConstants_1, messageServiceConstants_1, consumablesBasket_1, vanStockConstants_1, messageService_1, vanStockService_1, soundConstants_1, storageService_1, appConstants_1, guid_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CONSUMABLES_ROUTE_NAME = "consumables";
    var MESSAGES_ROUTE_NAME = "messages";
    var GROUP_VANSTOCK_CONSUMABLES = "VANSTOCK_SOURCE";
    var NotificationService = /** @class */ (function () {
        function NotificationService(eventAggregator, router, messageService, vanStockService, storage) {
            this._eventAggregator = eventAggregator;
            this._router = router;
            this._messageService = messageService;
            this._vanStockService = vanStockService;
            this._storage = storage;
        }
        NotificationService.prototype.initRouterBadgeEventSubs = function () {
            var _this = this;
            var notCurrentlyOnRoute = function (routeName) {
                if (!_this._router) {
                    return false;
                }
                if (!_this._router.currentInstruction) {
                    return false;
                }
                if (_this._router.currentInstruction.params) {
                    return _this._router.currentInstruction.params.childRoute !== routeName;
                }
                return false;
            };
            // badge updates for consumables, only do if not on current page
            this._eventAggregator.subscribe(consumableServiceConstants_1.ConsumableServiceConstants.CONSUMABLE_ADDED, function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!notCurrentlyOnRoute("consumables-basket")) return [3 /*break*/, 2];
                            this.updateBadge(CONSUMABLES_ROUTE_NAME, 1);
                            return [4 /*yield*/, this._storage.setConsumablesRead(false)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); });
            this._eventAggregator.subscribe(consumablesBasket_1.ConsumablesBasket.READ_CONSUMBALES_BASKET, function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.updateBadge(CONSUMABLES_ROUTE_NAME);
                    return [2 /*return*/];
                });
            }); });
            // badge updates for messages
            this._eventAggregator.subscribe(messageServiceConstants_1.MessageServiceConstants.MESSAGE_SERVICE_UPDATED, function (badgeCount) {
                _this.updateBadge(MESSAGES_ROUTE_NAME, badgeCount);
            });
            // badge updates for van stock, check if any outbound items
            this._eventAggregator.subscribe(vanStockConstants_1.VanStockConstants.VANSTOCK_UPDATED, function () { return __awaiter(_this, void 0, void 0, function () {
                var notOnRoute, items, badgeCount, msg;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            notOnRoute = notCurrentlyOnRoute("in-out-stock");
                            return [4 /*yield*/, this._vanStockService.getMaterialRequests()];
                        case 1:
                            items = _a.sent();
                            badgeCount = items.outboundMaterials.filter(function (i) { return i.isUnread; }).length;
                            // if read all items or on different page and updates
                            if (badgeCount === 0 || notOnRoute && badgeCount) {
                                this.updateBadge(CONSUMABLES_ROUTE_NAME, badgeCount, GROUP_VANSTOCK_CONSUMABLES);
                            }
                            if (badgeCount) {
                                this._eventAggregator.publish(soundConstants_1.SoundConstants.NOTIFICATION_SOUND);
                                msg = badgeCount > 1 ? "parts" : "part";
                                this._eventAggregator.publish(appConstants_1.AppConstants.APP_TOAST_ADDED, {
                                    id: guid_1.Guid.newGuid(),
                                    title: "Reservation Request",
                                    style: "warning",
                                    content: "You have just received a " + msg + " reservation request",
                                    autoDismiss: false
                                });
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        // only call post router setup, i.e. router.ensureConfigured
        NotificationService.prototype.updateInitialRouterBadgeCounts = function () {
            var _this = this;
            return this._router.ensureConfigured().then(function () {
                _this.updateBadge("messages", _this._messageService.unreadCount);
                return _this._vanStockService.getMaterialRequests().then(function (items) {
                    var badgeCount = items.outboundMaterials.filter(function (i) { return i.isUnread; }).length;
                    _this.updateBadge(CONSUMABLES_ROUTE_NAME, badgeCount, GROUP_VANSTOCK_CONSUMABLES);
                });
            });
        };
        NotificationService.prototype.updateBadge = function (route, count, groupId) {
            if (count === void 0) { count = 0; }
            if (groupId === void 0) { groupId = route; }
            if (!this._router) {
                return;
            }
            var routeObject = this._router.routes.find(function (r) { return r.route === route; });
            if (!routeObject) {
                return;
            }
            var settings = routeObject.settings;
            var _a = settings.counts, counts = _a === void 0 ? {} : _a;
            counts[groupId] = count;
            var badgeCount = Object.keys(counts).reduce(function (a, b) { return a + counts[b]; }, 0);
            routeObject.settings = __assign({}, settings, { badgeCount: badgeCount, counts: counts });
        };
        NotificationService = __decorate([
            aurelia_dependency_injection_1.inject(aurelia_event_aggregator_1.EventAggregator, aurelia_router_1.Router, messageService_1.MessageService, vanStockService_1.VanStockService, storageService_1.StorageService),
            __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator, aurelia_router_1.Router, Object, Object, Object])
        ], NotificationService);
        return NotificationService;
    }());
    exports.NotificationService = NotificationService;
});

//# sourceMappingURL=notificationService.js.map
