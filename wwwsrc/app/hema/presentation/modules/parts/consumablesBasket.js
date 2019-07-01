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
define(["require", "exports", "aurelia-framework", "aurelia-binding", "../../models/editableViewModel", "../../../business/services/jobService", "../../../business/services/engineerService", "../../../business/services/labelService", "aurelia-event-aggregator", "aurelia-dialog", "../../../business/services/validationService", "../../../business/services/businessRuleService", "../.././../business/services/catalogService", "../../../business/services/consumableService", "../../../business/models/consumablesBasket", "../../../business/models/consumablePart", "../../../business/services/favouriteService", "../../../business/services/constants/consumableServiceConstants", "../../../business/services/constants/adaptBusinessServiceConstants"], function (require, exports, aurelia_framework_1, aurelia_binding_1, editableViewModel_1, jobService_1, engineerService_1, labelService_1, aurelia_event_aggregator_1, aurelia_dialog_1, validationService_1, businessRuleService_1, catalogService_1, consumableService_1, consumablesBasket_1, consumablePart_1, favouriteService_1, consumableServiceConstants_1, adaptBusinessServiceConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConsumablesBasket = /** @class */ (function (_super) {
        __extends(ConsumablesBasket, _super);
        function ConsumablesBasket(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService, consumableService, favouriteService) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService) || this;
            _this._consumableService = consumableService;
            _this.selectedConsumableQuantity = 1;
            _this.showFaves = false;
            _this.showManual = false;
            _this._favouriteService = favouriteService;
            _this.manualConsumablePartQuantity = 1;
            _this._eventSubscriptions = [];
            return _this;
        }
        ConsumablesBasket_1 = ConsumablesBasket;
        ConsumablesBasket.prototype.activateAsync = function () {
            var _this = this;
            this.canEdit = true;
            this.validationToggle(true);
            this._eventSubscriptions.push(this._eventAggregator.subscribe(adaptBusinessServiceConstants_1.AdaptBusinessServiceConstants.ADAPT_PARTS_SELECTED, function (partIds) { return _this.updateConsumablesBasket(partIds); }));
            this._eventAggregator.publish(ConsumablesBasket_1.READ_CONSUMBALES_BASKET);
            return this.loadBusinessRules()
                .then(function () { return _this.loadCatalogs(); })
                .then(function () { return _this.load(); })
                .then(function () { return _this.buildValidationRules(); })
                .then(function () { return _this.showContent(); });
        };
        ConsumablesBasket.prototype.deactivateAsync = function () {
            this.disposeEventSubscriptions();
            return Promise.resolve();
        };
        ConsumablesBasket.prototype.addConsumable = function () {
            var _this = this;
            return this.checkAllRules().then(function (validationResult) {
                if (validationResult) {
                    var consumablePart = function () {
                        return new consumablePart_1.ConsumablePart(_this.showManual ? _this.manualConsumablePartRef.toUpperCase() : _this.selectedConsumableItem.stockReferenceId.toUpperCase(), _this.showManual ? _this.manualConsumablePartDescription : _this.selectedConsumableItem.consumableTypeDescription, _this.showManual ? _this.manualConsumablePartQuantity : _this.selectedConsumableQuantity);
                    };
                    _this._consumableService.addConsumableToBasket(consumablePart())
                        .then(function () {
                        return _this.fetchBasket().then(function () {
                            _this.selectedConsumable = undefined;
                            _this.selectedConsumableQuantity = 1;
                            _this.showManual = false;
                            _this.manualConsumablePartRef = undefined;
                            _this.manualConsumablePartDescription = undefined;
                            _this.manualConsumablePartQuantity = 1;
                        });
                    });
                }
                else {
                    _this.buildValidation();
                }
            });
        };
        ConsumablesBasket.prototype.removeFavourite = function (index) {
            var _this = this;
            return this.showDeleteConfirmation()
                .then(function (shouldDelete) {
                if (shouldDelete) {
                    _this._consumableService.removeFavourite(index)
                        .then(function () {
                        return _this.fetchBasket().then(function () { return _this.selectedConsumableItemChanged(); });
                    });
                }
            });
        };
        ConsumablesBasket.prototype.reOrder = function (item) {
            var _this = this;
            if (item) {
                item.sent = false;
                this._consumableService.addConsumableToBasket(item)
                    .then(function () {
                    _this.fetchBasket();
                });
            }
        };
        ConsumablesBasket.prototype.placeConsumablesOrder = function () {
            var _this = this;
            // if the fave flag is set then add to favourites
            this.consumablesBasket.partsInBasket.forEach(function (part) {
                if (part.favourite && !part.sent) {
                    _this._favouriteService.addFavouriteConsumablePart(part);
                }
            });
            this._consumableService.placeOrder(this.consumablesBasket).then(function () { return _this.fetchBasket(); });
            this.showSuccess(this.getLabel("savedTitle"), this.getLabel("savedMessage"));
        };
        ConsumablesBasket.prototype.removeConsumable = function (referenceId) {
            var _this = this;
            this.showDeleteConfirmation()
                .then(function (shouldDelete) {
                if (shouldDelete) {
                    _this._consumableService.removeConsumableFromBasket(referenceId)
                        .then(function () {
                        _this.fetchBasket();
                    });
                }
            });
        };
        ConsumablesBasket.prototype.updateBasket = function () {
            this._consumableService.saveBasket(this.consumablesBasket);
        };
        ConsumablesBasket.prototype.toggleFaves = function () {
            this.showFaves = !this.showFaves;
        };
        ConsumablesBasket.prototype.selectedConsumableItemChanged = function () {
            var _this = this;
            if (this.selectedConsumable) {
                if (this.consumablesBasket.favourites.find(function (f) { return f.referenceId === _this.selectedConsumableItem.stockReferenceId && f.sent === false; })) {
                    this.showFaveButton = false;
                }
                else {
                    this.showFaveButton = true;
                }
            }
            else {
                this.showFaveButton = false;
            }
        };
        ConsumablesBasket.prototype.saveAndSendBadgeEvent = function (item) {
            var _this = this;
            this._consumableService.saveBasket(this.consumablesBasket).then(function () {
                _this._consumableService.orderItemCount().then(function (total) {
                    _this._eventAggregator.publish(consumableServiceConstants_1.ConsumableServiceConstants.CONSUMABLE_ADDED, total);
                });
            });
        };
        ConsumablesBasket.prototype.showManualAdd = function () {
            this.showManual = true;
            var typedValue = this.dropDownElement.querySelector(".search-box");
            this.manualConsumablePartRef = typedValue.value.substr(0, 6);
            this.manualConsumablePartDescription = undefined;
            this.validateSingleRule("manualConsumablePartRef");
            this.validateSingleRule("manualConsumablePartDescription");
        };
        ConsumablesBasket.prototype.hideManualAdd = function () {
            this.showManual = false;
            this.manualConsumablePartRef = undefined;
            this.manualConsumablePartDescription = undefined;
            this.manualConsumablePartQuantity = 1;
        };
        ConsumablesBasket.prototype.manualConsumablePartRefChanged = function (newValue, oldValue) {
            this.testValidConsumable();
        };
        ConsumablesBasket.prototype.manualConsumablePartDescriptionChanged = function (newValue, oldValue) {
            this.testValidConsumable();
        };
        ConsumablesBasket.prototype.loadModel = function () {
            var _this = this;
            this._consumableStockReferenceIdPrefixRule = this.getBusinessRule("consumableStockRefIdPrefixRule");
            this.consumablesBasket = new consumablesBasket_1.ConsumablesBasket();
            return this._consumableService.clearOldOrders(60).then(function () {
                _this._consumableService.getConsumablesBasket().then(function (partsBasket) {
                    _this.consumablesBasket = partsBasket;
                    _this.checkForOrdersPending();
                });
            });
        };
        ConsumablesBasket.prototype.loadCatalogs = function () {
            var _this = this;
            return this._catalogService.getConsumables()
                .then(function (consumables) {
                if (consumables && consumables.length > 0) {
                    _this.consumablePartsList = consumables;
                }
                else {
                    return undefined;
                }
            });
        };
        ConsumablesBasket.prototype.fetchBasket = function () {
            var _this = this;
            return this._consumableService.getConsumablesBasket().then(function (partsBasket) {
                _this.consumablesBasket = partsBasket;
                _this.checkForOrdersPending();
            });
        };
        ConsumablesBasket.prototype.buildValidationRules = function () {
            var _this = this;
            return this.buildValidation([
                {
                    property: "manualConsumablePartRef",
                    condition: function () { return _this.showManual; }
                },
                {
                    property: "manualConsumablePartDescription",
                    condition: function () { return _this.showManual; }
                }
            ]);
        };
        ConsumablesBasket.prototype.checkForOrdersPending = function () {
            this.noRecords = this.consumablesBasket.partsInBasket.filter(function (p) { return p.sent === false; }).length === 0;
        };
        ConsumablesBasket.prototype.disposeEventSubscriptions = function () {
            if (this._eventSubscriptions) {
                this._eventSubscriptions.forEach(function (s) { return s.dispose(); });
                this._eventSubscriptions = [];
            }
        };
        ConsumablesBasket.prototype.updateConsumablesBasket = function (partIds) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var consumablePartsBasket, partsAddedFromAdapt;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._consumableService.getConsumablesBasket()];
                        case 1:
                            consumablePartsBasket = _a.sent();
                            partsAddedFromAdapt = consumablePartsBasket.partsInBasket.filter(function (p) { return partIds.indexOf(p.referenceId) !== -1 && p.sent === false; });
                            partsAddedFromAdapt.map(function (part) {
                                var partIndex = _this.consumablesBasket.partsInBasket.findIndex(function (p) { return p.referenceId === part.referenceId && p.sent === false; });
                                if (partIndex > -1) {
                                    _this.consumablesBasket.partsInBasket[partIndex].quantity += 1;
                                }
                                else {
                                    _this.consumablesBasket.partsInBasket.push(part);
                                }
                            });
                            this.checkForOrdersPending();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ConsumablesBasket.prototype.testValidConsumable = function () {
            this.isConsumableValid = false;
            if (!!this.manualConsumablePartRef && !!this.manualConsumablePartDescription && this.manualConsumablePartRef.length === this.validationRules.manualConsumablePartRef.maxLength) {
                var regexTest = new RegExp(this._consumableStockReferenceIdPrefixRule);
                this.isConsumableValid = !regexTest.test(this.manualConsumablePartRef.substr(0, 1));
            }
        };
        ConsumablesBasket.READ_CONSUMBALES_BASKET = "READ_CONSUMABLES_BASKET";
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", Object)
        ], ConsumablesBasket.prototype, "selectedConsumableItem", void 0);
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", String)
        ], ConsumablesBasket.prototype, "manualConsumablePartRef", void 0);
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", String)
        ], ConsumablesBasket.prototype, "manualConsumablePartDescription", void 0);
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", Number)
        ], ConsumablesBasket.prototype, "manualConsumablePartQuantity", void 0);
        ConsumablesBasket = ConsumablesBasket_1 = __decorate([
            aurelia_framework_1.inject(jobService_1.JobService, engineerService_1.EngineerService, labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService, consumableService_1.ConsumableService, favouriteService_1.FavouriteService),
            __metadata("design:paramtypes", [Object, Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, Object, Object, Object])
        ], ConsumablesBasket);
        return ConsumablesBasket;
        var ConsumablesBasket_1;
    }(editableViewModel_1.EditableViewModel));
    exports.ConsumablesBasket = ConsumablesBasket;
});

//# sourceMappingURL=consumablesBasket.js.map
