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
define(["require", "exports", "aurelia-dependency-injection", "../models/pageModel", "aurelia-event-aggregator", "../../business/services/constants/jobServiceConstants", "../../business/services/labelService", "../../../common/core/objectHelper", "../../../common/core/stringHelper"], function (require, exports, aurelia_dependency_injection_1, pageModel_1, aurelia_event_aggregator_1, jobServiceConstants_1, labelService_1, objectHelper_1, stringHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PageService = /** @class */ (function () {
        function PageService(eventAggregator, labelService) {
            var _this = this;
            this._pageModels = [];
            this._eventAggregator = eventAggregator;
            this._eventAggregator.subscribe(jobServiceConstants_1.JobServiceConstants.JOB_STATE_CHANGED, function () { return _this.clearPageVisitedHistory(); });
            this._labelService = labelService;
        }
        PageService.prototype.addOrUpdateLastVisitedPage = function (url) {
            return __awaiter(this, void 0, void 0, function () {
                var pageName, isPageItemIDRequired, urlVals_1, pageModel, defaultRoute;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getPageName(url)];
                        case 1:
                            pageName = _a.sent();
                            if (pageName) {
                                isPageItemIDRequired = this.isPageItemIDRequired(url);
                                urlVals_1 = this.getRouteNameAndPageItemId(url, pageName, isPageItemIDRequired);
                                pageModel = this._pageModels.length > 0 ? this._pageModels.find(function (p) { return p.pageName === pageName && p.itemId === urlVals_1.pageItemId; }) : undefined;
                                if (urlVals_1.routeName) {
                                    (pageModel) ? pageModel.routeName = urlVals_1.routeName :
                                        this._pageModels.push(new pageModel_1.PageModel(pageName, urlVals_1.pageItemId, urlVals_1.routeName));
                                }
                                else if (urlVals_1.pageItemId) {
                                    defaultRoute = this._labels[pageName];
                                    this._pageModels.push(new pageModel_1.PageModel(pageName, urlVals_1.pageItemId, defaultRoute));
                                }
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        PageService.prototype.getLastVisitedPage = function (pageName, pageItemId, isNavButtons) {
            var _this = this;
            if (isNavButtons === void 0) { isNavButtons = false; }
            var pageModel = this._pageModels.find(function (p) { return p.pageName === _this._labels[stringHelper_1.StringHelper.toCamelCase(pageName)] && p.itemId === pageItemId; });
            return pageModel ? pageModel.routeName : undefined;
        };
        PageService.prototype.getLastVisitedPageUrl = function (url) {
            return __awaiter(this, void 0, void 0, function () {
                var tabName, urlvals, pageModel;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getPageName(url)];
                        case 1:
                            tabName = _a.sent();
                            urlvals = (tabName) ? this.getRouteNameAndPageItemId(url, tabName, true) : undefined;
                            pageModel = this._pageModels.length > 0 ? this._pageModels.find(function (p) { return p.pageName === tabName && p.itemId === urlvals.pageItemId; }) : undefined;
                            return [2 /*return*/, (pageModel) ? url.replace(urlvals.routeName, pageModel.routeName) : url];
                    }
                });
            });
        };
        PageService.prototype.clearPageVisitedHistory = function () {
            this._pageModels = [];
        };
        PageService.prototype.getRouteNameAndPageItemId = function (url, tabName, isPageItemIdIndexExist) {
            var urlParts = url.split("/") || [];
            var index = urlParts.findIndex(function (p) { return p === tabName; });
            return {
                pageItemId: (isPageItemIdIndexExist) ? urlParts[index + 1] || undefined : undefined,
                routeName: (isPageItemIdIndexExist) ? urlParts[index + 2] || undefined : urlParts[index + 1] || undefined
            };
        };
        PageService.prototype.getPageName = function (url) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!!this._labels) return [3 /*break*/, 2];
                            _a = this;
                            return [4 /*yield*/, this._labelService.getGroup(stringHelper_1.StringHelper.toCamelCase(objectHelper_1.ObjectHelper.getClassName(this)))];
                        case 1:
                            _a._labels = _b.sent();
                            _b.label = 2;
                        case 2:
                            if (url.indexOf(this._labels.taskMain) > -1) {
                                return [2 /*return*/, this._labels.taskMain];
                            }
                            else if (url.indexOf(this._labels.propertySafetyMain) > -1) {
                                return [2 /*return*/, this._labels.propertySafetyMain];
                            }
                            else if (url.indexOf(this._labels.applianceMain) > -1) {
                                return [2 /*return*/, this._labels.applianceMain];
                            }
                            else if (url.indexOf(this._labels.partsMain) > -1) {
                                return [2 /*return*/, this._labels.partsMain];
                            }
                            else if (url.indexOf(this._labels.consumablesMain) > -1) {
                                return [2 /*return*/, this._labels.consumablesMain];
                            }
                            else {
                                return [2 /*return*/, undefined];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        PageService.prototype.isPageItemIDRequired = function (url) {
            if (url.indexOf(this._labels.taskMain) > -1 || url.indexOf(this._labels.applianceMain) > -1) {
                return true;
            }
            else {
                return false;
            }
        };
        PageService = __decorate([
            aurelia_dependency_injection_1.inject(aurelia_event_aggregator_1.EventAggregator, labelService_1.LabelService),
            __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator, Object])
        ], PageService);
        return PageService;
    }());
    exports.PageService = PageService;
});

//# sourceMappingURL=pageService.js.map
