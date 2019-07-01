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
define(["require", "exports", "aurelia-dependency-injection", "../../models/baseViewModel", "../../../business/services/labelService", "aurelia-event-aggregator", "aurelia-dialog", "../../../business/services/workRetrievalTracker", "../../../business/services/engineerService", "../../../business/services/jobService", "aurelia-binding", "../../../../common/core/stringHelper", "aurelia-router", "aurelia-pal", "../../../business/services/vanStockService", "../../../business/services/constants/jobServiceConstants"], function (require, exports, aurelia_dependency_injection_1, baseViewModel_1, labelService_1, aurelia_event_aggregator_1, aurelia_dialog_1, workRetrievalTracker_1, engineerService_1, jobService_1, aurelia_binding_1, stringHelper_1, aurelia_router_1, aurelia_pal_1, vanStockService_1, jobServiceConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VanStockJobPartsCollections = /** @class */ (function (_super) {
        __extends(VanStockJobPartsCollections, _super);
        function VanStockJobPartsCollections(labelService, eventAggregator, dialogService, tracker, engineerService, vanStockService, jobService, router) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this.tracker = tracker;
            _this.engineerService = engineerService;
            _this._vanStockService = vanStockService;
            _this._jobService = jobService;
            _this._router = router;
            return _this;
        }
        VanStockJobPartsCollections.prototype.activateAsync = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var partsCollections;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.isDone = params && params.isDone;
                            this._subscriptions = [
                                this._eventAggregator.subscribe(jobServiceConstants_1.JobServiceConstants.JOB_STATE_CHANGED, function () { return _this.update(); }),
                            ];
                            return [4 /*yield*/, this._vanStockService.getPartsToCollect()];
                        case 1:
                            partsCollections = (_a.sent()).toCollect;
                            this.partsCollections = (partsCollections || []);
                            return [4 /*yield*/, this.update()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        VanStockJobPartsCollections.prototype.collectAndNavigateToPartsCollection = function (e) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.dispatchClickEvent(e);
                            return [4 /*yield*/, this.setCollectingParts()];
                        case 1:
                            _a.sent();
                            this._router.navigateToRoute("vanStockPartsCollectionDetails");
                            return [2 /*return*/];
                    }
                });
            });
        };
        VanStockJobPartsCollections.prototype.continueToPartsCollection = function (e) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.dispatchClickEvent(e);
                    this._router.navigateToRoute("vanStockPartsCollectionDetails");
                    return [2 /*return*/];
                });
            });
        };
        VanStockJobPartsCollections.prototype.detachedAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this._subscriptions.forEach(function (subscription) { return subscription.dispose(); });
                    return [2 /*return*/];
                });
            });
        };
        VanStockJobPartsCollections.prototype.navigateToPartsCollection = function (e) {
            this._router.navigateToRoute("vanStockPartsCollectionDetails");
            this.dispatchClickEvent(e);
        };
        Object.defineProperty(VanStockJobPartsCollections.prototype, "summaryDescription", {
            get: function () {
                var totalParts = this.partsCollections ? this.partsCollections.length : 0;
                return "You have " + stringHelper_1.StringHelper.pluralise(totalParts, "part") + " ready for collection";
            },
            enumerable: true,
            configurable: true
        });
        VanStockJobPartsCollections.prototype.update = function () {
            return __awaiter(this, void 0, void 0, function () {
                var activeJobId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._jobService.getActiveJobId()];
                        case 1:
                            activeJobId = _a.sent();
                            this.enabled = !activeJobId;
                            return [2 /*return*/];
                    }
                });
            });
        };
        VanStockJobPartsCollections.prototype.setCollectingParts = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.engineerService.isPartCollectionInProgress = true;
                            return [4 /*yield*/, this.engineerService.setStatus(engineerService_1.EngineerService.OBTAINING_MATS_STATUS)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        VanStockJobPartsCollections.prototype.dispatchClickEvent = function (event) {
            if (event !== null) {
                event.stopPropagation();
                aurelia_pal_1.DOM.dispatchEvent(new Event("click"));
            }
        };
        __decorate([
            aurelia_binding_1.computedFrom("partsCollections"),
            __metadata("design:type", String),
            __metadata("design:paramtypes", [])
        ], VanStockJobPartsCollections.prototype, "summaryDescription", null);
        VanStockJobPartsCollections = __decorate([
            aurelia_dependency_injection_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, workRetrievalTracker_1.WorkRetrievalTracker, engineerService_1.EngineerService, vanStockService_1.VanStockService, jobService_1.JobService, aurelia_router_1.Router),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService,
                workRetrievalTracker_1.WorkRetrievalTracker, Object, Object, Object, aurelia_router_1.Router])
        ], VanStockJobPartsCollections);
        return VanStockJobPartsCollections;
    }(baseViewModel_1.BaseViewModel));
    exports.VanStockJobPartsCollections = VanStockJobPartsCollections;
});

//# sourceMappingURL=vanStockJobPartsCollections.js.map
