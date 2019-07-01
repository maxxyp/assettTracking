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
define(["require", "exports", "aurelia-dependency-injection", "../../../../business/services/storageService", "../../../models/validatableViewModel", "../../../../business/services/labelService", "../../../../business/services/validationService", "../../../../business/services/vanStockService", "aurelia-event-aggregator", "aurelia-dialog", "aurelia-binding", "../../../../business/services/catalogService", "../../../../business/services/constants/chargeServiceConstants", "../../../../business/services/jobService", "../../../../business/services/constants/userPreferenceConstants"], function (require, exports, aurelia_dependency_injection_1, storageService_1, validatableViewModel_1, labelService_1, validationService_1, vanStockService_1, aurelia_event_aggregator_1, aurelia_dialog_1, aurelia_binding_1, catalogService_1, chargeServiceConstants_1, jobService_1, userPreferenceConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UserPreferences = /** @class */ (function (_super) {
        __extends(UserPreferences, _super);
        function UserPreferences(labelService, eventAggregator, dialogService, validationService, vanStockService, storageService, catalogService, jobService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService, validationService) || this;
            _this._vanStockService = vanStockService;
            _this._storageService = storageService;
            _this._catalogService = catalogService;
            _this._jobService = jobService;
            return _this;
        }
        UserPreferences.prototype.attachedAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.workingSectors = this._vanStockService.getSectors();
                            return [4 /*yield*/, this.loadAvailableRegions()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.load()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.buildValidation()];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.validationManual()];
                        case 4:
                            _a.sent();
                            // due to dropDown.ts issues, we only want to add the dropdown to the dom once the
                            // values list has been loaded (hence its attached event will fire only once it has values)
                            // on first load after install, selectedWorkingSector will be undefined,
                            //  and we will not have a selectedWorkingSectorChanged event...
                            if (this.selectedWorkingSector === undefined) {
                                // patchList will be loaded when working sector is set, but the current dropDown throws if we enter and leave without
                                //  the value list being set
                                this.patchList = [];
                                this.isLoaded = true;
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        UserPreferences.prototype.detachedAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.save()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        UserPreferences.prototype.selectedWorkingSectorChanged = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reloadPatches(this.selectedWorkingSector)];
                        case 1:
                            _a.sent();
                            if (!this.patchList.some(function (item) { return item.patchCode === _this.selectedPatch; })) {
                                this.selectedPatch = undefined;
                            }
                            // after first load, we need to wait until patchList has been loaded before showing,
                            //  hence wait for workingSector changed to finish its business before showing
                            this.isLoaded = true;
                            return [4 /*yield*/, this.saveIfComplete()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        UserPreferences.prototype.selectedPatchChanged = function () {
            return this.saveIfComplete();
        };
        UserPreferences.prototype.selectedRegionChanged = function () {
            return this.saveIfComplete();
        };
        UserPreferences.prototype.saveIfComplete = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.selectedWorkingSector && this.selectedPatch && this.selectedRegion)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.save()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        UserPreferences.prototype.load = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, sector, patch, region;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this._storageService.getWorkingSector(),
                                this._storageService.getUserPatch(),
                                this._storageService.getUserRegion()
                            ])];
                        case 1:
                            _a = _b.sent(), sector = _a[0], patch = _a[1], region = _a[2];
                            this.selectedPatch = patch;
                            this.selectedRegion = region;
                            this.selectedWorkingSector = sector;
                            return [2 /*return*/];
                    }
                });
            });
        };
        UserPreferences.prototype.save = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this._storageService.setWorkingSector(this.selectedWorkingSector),
                                this._storageService.setUserPatch(this.selectedPatch),
                                this._storageService.setUserRegion(this.selectedRegion)
                            ])];
                        case 1:
                            _d.sent();
                            _b = (_a = this._eventAggregator).publish;
                            _c = [chargeServiceConstants_1.ChargeServiceConstants.CHARGE_UPDATE_START];
                            return [4 /*yield*/, this._jobService.getActiveJobId()];
                        case 2:
                            _b.apply(_a, _c.concat([_d.sent()]));
                            this._eventAggregator.publish(userPreferenceConstants_1.UserPreferenceConstants.USER_PREFERENCES_CHANGED, {
                                engineerType: this.selectedWorkingSector,
                                engineerPatch: this.selectedPatch,
                                engineerRegion: this.selectedRegion
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        UserPreferences.prototype.loadAvailableRegions = function () {
            return __awaiter(this, void 0, void 0, function () {
                var regionList;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._catalogService.getRegions()];
                        case 1:
                            regionList = _a.sent();
                            this.regionList = regionList
                                .map(function (item) { return ({ key: item.key, description: item.key + " - " + item.description }); })
                                .sort(function (a, b) { return +a.key - +b.key; });
                            return [2 /*return*/];
                    }
                });
            });
        };
        UserPreferences.prototype.reloadPatches = function (sector) {
            return __awaiter(this, void 0, void 0, function () {
                var patchList;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._vanStockService.getPatchCodes(sector)];
                        case 1:
                            patchList = _a.sent();
                            this.patchList = patchList
                                .sort(function (a, b) { return a.patchCode > b.patchCode ? 1 : a.patchCode < b.patchCode ? -1 : 0; });
                            return [2 /*return*/];
                    }
                });
            });
        };
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", String)
        ], UserPreferences.prototype, "selectedPatch", void 0);
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", String)
        ], UserPreferences.prototype, "selectedWorkingSector", void 0);
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", String)
        ], UserPreferences.prototype, "selectedRegion", void 0);
        UserPreferences = __decorate([
            aurelia_dependency_injection_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, validationService_1.ValidationService, vanStockService_1.VanStockService, storageService_1.StorageService, catalogService_1.CatalogService, jobService_1.JobService),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, Object, Object, Object])
        ], UserPreferences);
        return UserPreferences;
    }(validatableViewModel_1.ValidatableViewModel));
    exports.UserPreferences = UserPreferences;
});

//# sourceMappingURL=userPreferences.js.map
