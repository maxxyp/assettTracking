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
define(["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "aurelia-dialog", "aurelia-binding", "aurelia-router", "../.././../business/services/catalogService", "../../../business/services/jobService", "../../../../common/core/services/appLauncher", "../../../../common/core/services/configurationService", "../../../business/services/partService", "../../../business/services/storageService", "../../../business/services/labelService", "../../../business/services/validationService", "../../../business/services/businessRuleService", "../../../business/services/engineerService", "../../../business/services/vanStockService", "../../models/editableViewModel", "../vanStock/vanStockNotice", "../../../../common/core/guid", "../../../business/models/part", "../../../business/services/constants/adaptBusinessServiceConstants", "../../../business/services/constants/chargeServiceConstants", "../../../business/services/appointmentBookingService", "../../../../common/core/stringHelper", "../../../../common/core/objectHelper", "../appointment/appointmentBooking", "../../factories/partsBasketFactory", "bignumber", "../../../business/services/consumableService", "../../../business/models/consumablePart", "../../../business/services/favouriteService", "../../../core/dateHelper", "moment", "./materialDialog", "../../../business/services/featureToggleService", "../vanStock/vanStockReservationHelper"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, aurelia_dialog_1, aurelia_binding_1, aurelia_router_1, catalogService_1, jobService_1, appLauncher_1, configurationService_1, partService_1, storageService_1, labelService_1, validationService_1, businessRuleService_1, engineerService_1, vanStockService_1, editableViewModel_1, vanStockNotice_1, guid_1, part_1, adaptBusinessServiceConstants_1, chargeServiceConstants_1, appointmentBookingService_1, stringHelper_1, objectHelper_1, appointmentBooking_1, partsBasketFactory_1, bignumber, consumableService_1, consumablePart_1, favouriteService_1, dateHelper_1, moment, materialDialog_1, featureToggleService_1, vanStockReservationHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PartsBasket = /** @class */ (function (_super) {
        __extends(PartsBasket, _super);
        function PartsBasket(catalogService, engineerService, jobService, labelService, partService, eventAggregator, dialogService, validationService, businessRuleService, bindingEngine, router, vanStockService, storageService, appLauncher, configurationService, appointmentBookingService, partsBasketFactory, consumableService, favouriteService, featureToggleService) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService) || this;
            _this._partService = partService;
            _this._eventSubscriptions = [];
            _this._viewModelPropertySubscriptions = [];
            _this._bindingEngine = bindingEngine;
            _this._router = router;
            _this._vanStockService = vanStockService;
            _this._storageService = storageService;
            _this._appLauncher = appLauncher;
            _this._configurationService = configurationService;
            _this._appointmentBookingService = appointmentBookingService;
            _this._partsBasketFactory = partsBasketFactory;
            _this._consumableService = consumableService;
            _this._favouriteService = favouriteService;
            _this._featureToggleService = featureToggleService;
            _this.isFullScreen = window.isFullScreen;
            _this.materialSearchResults = {};
            return _this;
        }
        PartsBasket.prototype.activateAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            this.isVanStockEnabled = this._featureToggleService.isAssetTrackingEnabled();
                            this._eventSubscriptions.push(this._eventAggregator.subscribe(adaptBusinessServiceConstants_1.AdaptBusinessServiceConstants.ADAPT_PARTS_SELECTED, function (partIds) { return _this.adaptPartLiveUpdate(partIds); }));
                            _a = this;
                            return [4 /*yield*/, this._storageService.getUserPatch()];
                        case 1:
                            _a._userPatch = _d.sent();
                            _b = this;
                            return [4 /*yield*/, this._storageService.getWorkingSector()];
                        case 2:
                            _b._userSector = _d.sent();
                            return [4 /*yield*/, this.loadBusinessRules()];
                        case 3:
                            _d.sent();
                            return [4 /*yield*/, this.buildBusinessRules()];
                        case 4:
                            _d.sent();
                            _c = this;
                            return [4 /*yield*/, this.buildNoYesList()];
                        case 5:
                            _c.yesNoLookup = _d.sent();
                            return [4 /*yield*/, this.load()];
                        case 6:
                            _d.sent();
                            this.showContent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PartsBasket.prototype.deactivateAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.disposeViewModelPropertySubscriptions();
                    this._eventSubscriptions.forEach(function (s) { return s.dispose(); });
                    return [2 /*return*/];
                });
            });
        };
        PartsBasket.prototype.showSearchResults = function (part) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.isVanStockEnabled) return [3 /*break*/, 2];
                            return [4 /*yield*/, vanStockReservationHelper_1.VanStockReservationHelper.launchReservationDialog(this._dialogService, this._vanStockService, this.materialSearchResults[part.stockReferenceId], function (hasAReservationBeenMade) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!hasAReservationBeenMade) return [3 /*break*/, 2];
                                                this.showSuccess("Material Request", "Material request sent.");
                                                return [4 /*yield*/, this.rebuildInboundReservations()];
                                            case 1:
                                                _a.sent();
                                                _a.label = 2;
                                            case 2: return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this._dialogService.open({
                                viewModel: vanStockNotice_1.VanStockNotice,
                                model: {
                                    jobId: this.jobId,
                                    part: part,
                                    userPatch: this._userPatch
                                }
                            })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        PartsBasket.prototype.goToInOutScreen = function () {
            this._router.navigate("/consumables/in-out-stock");
        };
        PartsBasket.prototype.launchAdapt = function () {
            this._appLauncher.launchApplication(this._configurationService.getConfiguration().adaptLaunchUri);
        };
        PartsBasket.prototype.launchMaterialDialog = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var part;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            part = params.part;
                            return [4 /*yield*/, this._dialogService.open({
                                    viewModel: materialDialog_1.MaterialDialog,
                                    model: {
                                        part: part,
                                        MaterialSearchResult: this.materialSearchResults[part.stockReferenceId]
                                    }
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PartsBasket.prototype.bookAnAppointment = function () {
            this._router.navigateToRoute("appointmentMain", { jobId: this.jobId });
        };
        PartsBasket.prototype.setSameRefAsOriginal = function (part) {
            part.warrantyReturn.removedPartStockReferenceId = part.stockReferenceId;
        };
        PartsBasket.prototype.testValidConsumable = function (consumableCode) {
            var regexTest = new RegExp(this._consumablesRule);
            return regexTest.test(consumableCode[0]); // todo doesn't work
        };
        PartsBasket.prototype.toggleFavourite = function (part) {
            return __awaiter(this, void 0, void 0, function () {
                var favouritesResult, foundPartIndex;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            part.isFavourite = !part.isFavourite;
                            this.viewModel.partsInBasket
                                .filter(function (p) { return p.description === part.description; })
                                .forEach(function (p) {
                                p.isFavourite = part.isFavourite;
                            });
                            if (!part.isFavourite) return [3 /*break*/, 2];
                            return [4 /*yield*/, this._favouriteService.addFavouritePart(part)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 2: return [4 /*yield*/, this._favouriteService.getFavouritesList()];
                        case 3:
                            favouritesResult = _a.sent();
                            if (!(favouritesResult && favouritesResult.favourites)) return [3 /*break*/, 5];
                            foundPartIndex = favouritesResult.favourites.findIndex(function (favouritePart) { return favouritePart.description === part.description; });
                            if (!(foundPartIndex !== -1)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this._favouriteService.removeFavourite(foundPartIndex)];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        PartsBasket.prototype.quickAdd = function (part) {
            part.quantity = 1;
            part.partOrderStatus = this.materialSearchResults[part.stockReferenceId].local.completionStatus === "FOUND"
                ? "V"
                : "O";
        };
        PartsBasket.prototype.showAddPartManually = function () {
            if (this.viewModel.showAddPartManually) {
                return;
            }
            this.viewModel.showAddPartManually = true;
            this.viewModel.showRemainingAddPartManuallyFields = false;
            this.viewModel.manualPartDetail = new part_1.Part();
        };
        PartsBasket.prototype.hideAddPartManually = function () {
            if (!this.viewModel.showAddPartManually) {
                return;
            }
            this.viewModel.showAddPartManually = false;
            this.viewModel.showRemainingAddPartManuallyFields = false;
            this.viewModel.manualPartDetail = undefined;
        };
        PartsBasket.prototype.searchForManuallyAddedPart = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var validationResult, partFoundInCatalog, populate, ruleString, partFoundInVanStock;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.validateSingleRule("viewModel.manualPartDetail.stockReferenceId")];
                        case 1:
                            validationResult = _a.sent();
                            if (!validationResult.isValid) {
                                return [2 /*return*/];
                            }
                            this.viewModel.manualPartDetail.stockReferenceId = this.viewModel.manualPartDetail.stockReferenceId.toUpperCase();
                            this.viewModel.showRemainingAddPartManuallyFields = true;
                            return [4 /*yield*/, this._catalogService.getGoodsType(this.viewModel.manualPartDetail.stockReferenceId)];
                        case 2:
                            partFoundInCatalog = _a.sent();
                            populate = function (description, charge, isFound) {
                                _this.viewModel.manualPartDetail.description = description;
                                _this.viewModel.manualPartDetail.price = new bignumber.BigNumber(charge).times(_this._partsCurrencyUnit);
                                _this.viewModel.manualPartDetail.quantity = 0;
                                _this.viewModel.manualPartDetail.wasFoundUsingManualEntry = isFound;
                            };
                            if (!partFoundInCatalog) return [3 /*break*/, 3];
                            populate(partFoundInCatalog.description, partFoundInCatalog.charge, true);
                            return [3 /*break*/, 5];
                        case 3:
                            ruleString = "viewModel.manualPartDetail.*";
                            return [4 /*yield*/, this._vanStockService.searchLocalVanStock(1, undefined, this.viewModel.manualPartDetail.stockReferenceId)];
                        case 4:
                            partFoundInVanStock = (_a.sent()) || [];
                            if (!!partFoundInVanStock.length && partFoundInVanStock[0].description) {
                                populate(partFoundInVanStock[0].description, 0, false);
                                ruleString = "viewModel.manualPartDetail.price";
                            }
                            this.validateSingleRule(ruleString);
                            _a.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        PartsBasket.prototype.addManualPartToOrderList = function () {
            return __awaiter(this, void 0, void 0, function () {
                var validationCombinedResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.validateSingleRule("viewModel.manualPartDetail.*")];
                        case 1:
                            validationCombinedResult = _a.sent();
                            if (!validationCombinedResult.isValid) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.insertPartsIntoBasket([objectHelper_1.ObjectHelper.clone(this.viewModel.manualPartDetail)])];
                        case 2:
                            _a.sent();
                            this.hideAddPartManually();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PartsBasket.prototype.adaptPartLiveUpdate = function (incomingPartIds) {
            if (incomingPartIds === void 0) { incomingPartIds = []; }
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var partsDetail, partsNotAlreadyInBasket;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._partService.getPartsBasket(this.jobId)];
                        case 1:
                            partsDetail = _a.sent();
                            partsNotAlreadyInBasket = incomingPartIds
                                .map(function (incomingPartId) { return partsDetail.partsToOrder.find(function (partToOrder) { return partToOrder.id === incomingPartId; }); })
                                .filter(function (incomingPart) { return !_this.viewModel.partsInBasket.some(function (partInBasket) { return partInBasket === incomingPart.id; }); });
                            return [4 /*yield*/, this.insertPartsIntoBasket(partsNotAlreadyInBasket)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PartsBasket.prototype.removePart = function (event, part, isATransferToConsumables) {
            return __awaiter(this, void 0, void 0, function () {
                var result, shouldDelete;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            event.stopPropagation();
                            if (!isATransferToConsumables) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.showConfirmation(this.getLabel("confirmation"), this.getLabel("addToConsumablesQuestion"))];
                        case 1:
                            result = _a.sent();
                            if (result.wasCancelled) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this._consumableService.addConsumableToBasket(new consumablePart_1.ConsumablePart(part.stockReferenceId, part.description, part.quantity))];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, this.showDeleteConfirmation()];
                        case 4:
                            shouldDelete = _a.sent();
                            if (!shouldDelete) {
                                return [2 /*return*/];
                            }
                            _a.label = 5;
                        case 5:
                            this.viewModel.partsInBasket.splice(this.viewModel.partsInBasket.indexOf(part), 1);
                            this.removePartsValidationRules(this.viewModel.partsInBasket.length);
                            return [4 /*yield*/, this.setAndTriggerViewModelPropertyChangeHandlers()];
                        case 6:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PartsBasket.prototype.selectMainPart = function (part, isSelected) {
            return __awaiter(this, void 0, void 0, function () {
                var result, preexistingMainPartForThisTask, confirmResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.setDirty(true); // by using a changeHandler rather than binding, the checkboxes will not inherently register a dirty change
                            if (!isSelected) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.showConfirmation(this.getLabel("confirmation"), this.getLabel("selectMainPartQuestion"))];
                        case 1:
                            result = _a.sent();
                            if (!!result.wasCancelled) return [3 /*break*/, 4];
                            preexistingMainPartForThisTask = this.viewModel.partsInBasket.find(function (p) { return p.taskId === part.taskId && p.isMainPart && p !== part; });
                            if (!!preexistingMainPartForThisTask) return [3 /*break*/, 2];
                            part.isMainPart = true;
                            return [2 /*return*/];
                        case 2: return [4 /*yield*/, this.showConfirmation(this.getLabel("confirmation"), this.getLabel("makeMainPartForActivity"))];
                        case 3:
                            confirmResult = _a.sent();
                            if (!confirmResult.wasCancelled) {
                                part.isMainPart = true;
                                preexistingMainPartForThisTask.isMainPart = false;
                                return [2 /*return*/];
                            }
                            _a.label = 4;
                        case 4:
                            // if here then user unset the checkbox, or has set the box but then declined one of the dialogs
                            part.isMainPart = true; // hack so that the screen checkbox ui updates
                            part.isMainPart = false;
                            return [2 /*return*/];
                    }
                });
            });
        };
        // todo: delete me once we can toggle via modal
        PartsBasket.prototype.selectOrderType = function (part, isSelected) {
            this.setDirty(true); // by using a changeHandler rather than binding, the checkboxes will not inherently register a dirty change
            part.partOrderStatus = isSelected ? this.brVanStockPartOrderStatus : this.brPartOrderStatus;
        };
        PartsBasket.prototype.loadModel = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var _a, getTaskLookup, _b, partsDetail;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.rebuildInboundReservations()];
                        case 1:
                            _c.sent();
                            _a = this;
                            return [4 /*yield*/, this._jobService.getJob(this.jobId)];
                        case 2:
                            _a._job = _c.sent();
                            getTaskLookup = function (task) { return __awaiter(_this, void 0, void 0, function () {
                                var jobCodeCatalogEntry, objectTypeCatalogEntry, chargeTypeCatalog, text;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this._catalogService.getJCJobCode(task.jobType)];
                                        case 1:
                                            jobCodeCatalogEntry = _a.sent();
                                            return [4 /*yield*/, this._catalogService.getObjectType(task.applianceType)];
                                        case 2:
                                            objectTypeCatalogEntry = _a.sent();
                                            return [4 /*yield*/, this._catalogService.getChargeType(task.chargeType)];
                                        case 3:
                                            chargeTypeCatalog = _a.sent();
                                            text = ((jobCodeCatalogEntry && jobCodeCatalogEntry.fieldAppCode) || task.jobType) + " -\n                                " + ((objectTypeCatalogEntry &&
                                                objectTypeCatalogEntry.applianceTypeDescription) ||
                                                task.applianceType) + " -\n                                " + ((chargeTypeCatalog && chargeTypeCatalog.chargeTypeDescription) ||
                                                task.chargeType);
                                            return [2 /*return*/, { id: task.id, text: text }];
                                    }
                                });
                            }); };
                            _b = this;
                            return [4 /*yield*/, Promise.all(this._job.tasks.filter(function (task) { return task && task.applianceType && task.isMiddlewareDoTodayTask; }).map(function (task) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, getTaskLookup(task)];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                }); }); }))];
                        case 3:
                            _b.tasksCatalog = _c.sent();
                            return [4 /*yield*/, this._partService.getPartsBasket(this.jobId)];
                        case 4:
                            partsDetail = _c.sent();
                            this.viewModel = this._partsBasketFactory.createPartsBasketViewModel(partsDetail);
                            this.setInitialDataState(this.viewModel.dataStateId, this.viewModel.dataState);
                            return [4 /*yield*/, this.initialiseNonPartsValidationRules()];
                        case 5:
                            _c.sent();
                            return [4 /*yield*/, this.insertPartsIntoBasket(this.viewModel.partsToOrder)];
                        case 6:
                            _c.sent();
                            // think this is here in case the taskItem screen has not been visited, is this mutating stored data
                            // todo: why
                            return [4 /*yield*/, this._partService.setPartsRequiredForTask(this._job.id)];
                        case 7:
                            // think this is here in case the taskItem screen has not been visited, is this mutating stored data
                            // todo: why
                            _c.sent();
                            return [4 /*yield*/, this.validateAllRules()];
                        case 8:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PartsBasket.prototype.saveModel = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var appointment, businessRules;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.viewModel.dataState = this.getFinalDataState();
                            this.viewModel.partsToOrder = this.viewModel.partsInBasket;
                            if (!this.viewModel.partsInBasket.some(function (x) { return x.partOrderStatus === _this.brPartOrderStatus; })) return [3 /*break*/, 3];
                            return [4 /*yield*/, this._appointmentBookingService.load(this.jobId)];
                        case 1:
                            appointment = _a.sent();
                            if (!(appointment && appointment.promisedDate)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this._businessRuleService.getRuleGroup(stringHelper_1.StringHelper.toCamelCase(objectHelper_1.ObjectHelper.getClassName(appointmentBooking_1.AppointmentBooking)))];
                        case 2:
                            businessRules = _a.sent();
                            if (this._appointmentBookingService.checkIfAppointmentNeedsToBeRebooked(appointment.promisedDate, moment(dateHelper_1.DateHelper.getTodaysDate()).toDate(), businessRules["cutOffTime" + ""])) {
                                this.showInfo(this.getLabel("appointmentBooking"), this.getLabel("appointmentBookingMessage"));
                            }
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this._partService.savePartsBasket(this.jobId, this.viewModel)];
                        case 4:
                            _a.sent();
                            if (this._isDirty) {
                                this._eventAggregator.publish(chargeServiceConstants_1.ChargeServiceConstants.CHARGE_UPDATE_START, this.jobId);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        PartsBasket.prototype.clearModel = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.viewModel.partsInBasket.forEach(function (_, index) { return _this.removePartsValidationRules(index); });
                            this.viewModel.partsInBasket = [];
                            this.viewModel.manualPartDetail = undefined;
                            this.viewModel.showAddPartManually = false;
                            this.viewModel.showRemainingAddPartManuallyFields = false;
                            return [4 /*yield*/, this.setAndTriggerViewModelPropertyChangeHandlers()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PartsBasket.prototype.validationUpdated = function (result) {
            var _this = this;
            result.groups.forEach(function (group) {
                var overallPartValidity = Object.keys(result.propertyResults)
                    .filter(function (key) { return key !== group && result.propertyResults[key].property.lastIndexOf("viewModel." + group) === 0; })
                    .every(function (key) { return result.propertyResults[key].isValid; });
                var part = objectHelper_1.ObjectHelper.getPathValue(_this.viewModel, group);
                if (part) {
                    part.isValid = overallPartValidity;
                }
            });
        };
        PartsBasket.prototype.insertPartsIntoBasket = function (partsToAdd) {
            return __awaiter(this, void 0, void 0, function () {
                var _i, partsToAdd_1, part;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            for (_i = 0, partsToAdd_1 = partsToAdd; _i < partsToAdd_1.length; _i++) {
                                part = partsToAdd_1[_i];
                                this.viewModel.partsInBasket.push(part);
                                this.insertPartsValidationRules(this.viewModel.partsInBasket.length - 1);
                            }
                            return [4 /*yield*/, this.setAndTriggerViewModelPropertyChangeHandlers()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PartsBasket.prototype.setAndTriggerViewModelPropertyChangeHandlers = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var hasFullCatalogs, partOrListChanged;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.disposeViewModelPropertySubscriptions();
                            hasFullCatalogs = function (stockReferenceId) { return __awaiter(_this, void 0, void 0, function () {
                                var foundPartInCatalog, foundProductGroup;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!stockReferenceId) {
                                                return [2 /*return*/, false];
                                            }
                                            return [4 /*yield*/, this._catalogService.getGoodsType(stockReferenceId)];
                                        case 1:
                                            foundPartInCatalog = _a.sent();
                                            if (!foundPartInCatalog) {
                                                return [2 /*return*/, false];
                                            }
                                            return [4 /*yield*/, this._catalogService.getProductGroups()];
                                        case 2:
                                            foundProductGroup = (_a.sent()).find(function (x) { return x.productGroupCode === foundPartInCatalog.productGroupCode; });
                                            if (!foundProductGroup) {
                                                return [2 /*return*/, false];
                                            }
                                            return [4 /*yield*/, this._catalogService.getPartTypes()];
                                        case 3: return [2 /*return*/, (_a.sent()).some(function (partType) { return partType.productGroupCode === foundProductGroup.productGroupCode && partType.partTypeCode === foundPartInCatalog.partTypeCode; })];
                                    }
                                });
                            }); };
                            partOrListChanged = function (forceWarrantyCheckPart) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                var _loop_1, this_1, _i, _a, part, everyMandatoryTaskIsHappy;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _loop_1 = function (part) {
                                                var favouritesModel, _a, _b, _c, engineersWithPart, _d, taskItem, _e;
                                                return __generator(this, function (_f) {
                                                    switch (_f.label) {
                                                        case 0:
                                                            part.id = part.id || guid_1.Guid.newGuid();
                                                            part.quantity = part.quantity || 1;
                                                            part.partOrderStatus = part.partOrderStatus || this_1.brPartOrderStatus;
                                                            part.taskId = this_1.tasksCatalog.length === 1 ? this_1.tasksCatalog[0].id : part.taskId;
                                                            if (part.partOrderStatus === this_1.brVanStockPartOrderStatus) {
                                                                part.isPriorityPart = false;
                                                            }
                                                            if (part.isConsumable === undefined) {
                                                                part.isConsumable =
                                                                    part.stockReferenceId && this_1._isPartConsumableStockReferencePrefix.some(function (prefix) { return stringHelper_1.StringHelper.startsWith(part.stockReferenceId, prefix); });
                                                            }
                                                            return [4 /*yield*/, this_1._favouriteService.getFavouritesList()];
                                                        case 1:
                                                            favouritesModel = _f.sent();
                                                            part.isFavourite = favouritesModel && favouritesModel.favourites && favouritesModel.favourites.some(function (x) { return x.description === part.description; });
                                                            if (!(part.warrantyEstimate === undefined || forceWarrantyCheckPart === part)) return [3 /*break*/, 3];
                                                            _a = part;
                                                            return [4 /*yield*/, this_1._partService.getPartWarrantyEstimate(this_1.jobId, part.stockReferenceId, part.taskId)];
                                                        case 2:
                                                            _a.warrantyEstimate = _f.sent();
                                                            _f.label = 3;
                                                        case 3:
                                                            if (!this_1.isVanStockEnabled) return [3 /*break*/, 6];
                                                            if (!!this_1.materialSearchResults[part.stockReferenceId]) return [3 /*break*/, 5];
                                                            _b = this_1.materialSearchResults;
                                                            _c = part.stockReferenceId;
                                                            return [4 /*yield*/, this_1._vanStockService.getBindableMaterialSearchResult(part.stockReferenceId)];
                                                        case 4:
                                                            _b[_c] = _f.sent();
                                                            _f.label = 5;
                                                        case 5: return [3 /*break*/, 8];
                                                        case 6:
                                                            if (!(part.isInPatchVanStock === undefined)) return [3 /*break*/, 8];
                                                            return [4 /*yield*/, this_1._vanStockService.getEngineersWithPart(this_1._userPatch, this_1._userSector, part.stockReferenceId)];
                                                        case 7:
                                                            engineersWithPart = (_f.sent()) || [];
                                                            part.isInPatchVanStock = !!engineersWithPart.length;
                                                            part.patchVanStockEngineers = engineersWithPart;
                                                            _f.label = 8;
                                                        case 8:
                                                            if (!(part.hasFullCatalogsForMainPart === undefined)) return [3 /*break*/, 10];
                                                            _d = part;
                                                            return [4 /*yield*/, hasFullCatalogs(part.stockReferenceId)];
                                                        case 9:
                                                            _d.hasFullCatalogsForMainPart = _f.sent();
                                                            _f.label = 10;
                                                        case 10:
                                                            taskItem = part.taskId && this_1._job.tasks.find(function (task) { return task.id === part.taskId; });
                                                            part.isMainPartOptionAvailable =
                                                                part.hasFullCatalogsForMainPart &&
                                                                    taskItem &&
                                                                    taskItem.workedOnCode !== this_1._brWorkedOnClaimRejectCoveredCode &&
                                                                    taskItem.jobType !== this_1._brFirstVisitJobType;
                                                            if (!part.isMainPartOptionAvailable) {
                                                                part.isMainPart = false;
                                                            }
                                                            _e = part;
                                                            return [4 /*yield*/, this_1._partService.getPartStatusValidity(part, this_1._job)];
                                                        case 11:
                                                            _e.hasTaskWithWrongStatus = !(_f.sent());
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            };
                                            this_1 = this;
                                            _i = 0, _a = this.viewModel.partsInBasket;
                                            _b.label = 1;
                                        case 1:
                                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                                            part = _a[_i];
                                            return [5 /*yield**/, _loop_1(part)];
                                        case 2:
                                            _b.sent();
                                            _b.label = 3;
                                        case 3:
                                            _i++;
                                            return [3 /*break*/, 1];
                                        case 4:
                                            this.showPartsToOrderList = !!this.viewModel.partsInBasket.length;
                                            this.showBookAppointmentButton = this.viewModel.partsInBasket.some(function (x) { return x.partOrderStatus === _this.brPartOrderStatus; });
                                            this.hideDeliverToSiteCheckbox = this.viewModel.partsInBasket.every(function (p) { return p.partOrderStatus === _this.brVanStockPartOrderStatus; });
                                            this.viewModel.deliverPartsToSite = this.viewModel.partsInBasket.length ? this.viewModel.deliverPartsToSite : null;
                                            everyMandatoryTaskIsHappy = this._job.tasks
                                                .filter(function (task) { return task.status === "IP"; }) // todo: is this right, should WA be included
                                                .every(function (task) { return _this.viewModel.partsInBasket.some(function (p) { return p.taskId === task.id && p.partOrderStatus === _this.brPartOrderStatus; }); });
                                            this.viewModel.hasAtLeastOneWrongActivityStatus = !everyMandatoryTaskIsHappy || this.viewModel.partsInBasket.some(function (p) { return p.hasTaskWithWrongStatus; });
                                            this.partsToOrderTotalPrice = this.viewModel.partsInBasket.reduce(function (prev, curr) {
                                                return prev + (curr.quantity || 0) * new bignumber.BigNumber(curr.price).toNumber();
                                            }, 0);
                                            return [4 /*yield*/, this.validateAllRules()];
                                        case 5:
                                            _b.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                            this._viewModelPropertySubscriptions.push(this._bindingEngine.collectionObserver(this.viewModel.partsInBasket).subscribe(function () {
                                partOrListChanged();
                            }));
                            this.viewModel.partsInBasket.forEach(function (part) {
                                _this._viewModelPropertySubscriptions.push(_this._bindingEngine.propertyObserver(part, "quantity").subscribe(function () {
                                    partOrListChanged();
                                }), _this._bindingEngine.propertyObserver(part, "taskId").subscribe(function () {
                                    partOrListChanged(part);
                                }), _this._bindingEngine.propertyObserver(part, "partOrderStatus").subscribe(function () {
                                    partOrListChanged();
                                }));
                            });
                            return [4 /*yield*/, partOrListChanged()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PartsBasket.prototype.disposeViewModelPropertySubscriptions = function () {
            this._viewModelPropertySubscriptions.forEach(function (subscription) { return subscription.dispose(); });
        };
        PartsBasket.prototype.buildBusinessRules = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this._consumablesRule = this.getBusinessRule("consumablesRule");
                            this.brVanStockPartOrderStatus = this.getBusinessRule("vanStockPartOrderStatus");
                            this.brPartOrderStatus = this.getBusinessRule("partOrderStatus");
                            this.quantityIncrementStep = this.getBusinessRule("quantityIncrementStep");
                            this.priceDecimalPlaces = this.getBusinessRule("priceDecimalPlaces");
                            this._brWorkedOnClaimRejectCoveredCode = this.getBusinessRule("workedOnClaimRejectCoveredCode");
                            this._partsCurrencyUnit = this.getBusinessRule("partsCurrencyUnit");
                            this._isPartConsumableStockReferencePrefix = (this.getBusinessRule("isPartConsumableStockReferencePrefix") || "").split(",");
                            _a = this;
                            return [4 /*yield*/, this._businessRuleService.getQueryableRuleGroup("taskItem")];
                        case 1:
                            _a._brFirstVisitJobType = (_b.sent()).getBusinessRule("firstVisitJob");
                            return [2 /*return*/];
                    }
                });
            });
        };
        PartsBasket.prototype.initialiseNonPartsValidationRules = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.buildValidation([
                                {
                                    property: "viewModel.manualPartDetail.stockReferenceId",
                                    groups: ["manualPartDetail"],
                                    condition: function () { return _this.viewModel.showAddPartManually; }
                                },
                                {
                                    property: "viewModel.manualPartDetail.description",
                                    groups: ["manualPartDetail"],
                                    condition: function () { return _this.viewModel.showAddPartManually && _this.viewModel.showRemainingAddPartManuallyFields; }
                                },
                                {
                                    property: "viewModel.manualPartDetail.price",
                                    groups: ["manualPartDetail"],
                                    condition: function () { return _this.viewModel.showAddPartManually && _this.viewModel.showRemainingAddPartManuallyFields; }
                                },
                                {
                                    property: "viewModel.partsListValidation",
                                    required: false,
                                    passes: [
                                        {
                                            test: function () { return !_this.viewModel.hasAtLeastOneWrongActivityStatus; },
                                            message: "At least one of the activities has an incorrect status"
                                        }
                                    ]
                                }
                            ])];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PartsBasket.prototype.insertPartsValidationRules = function (index) {
            var _this = this;
            // todo: are some of these basedOns wrong?                They don't seem to exists!                Maybe Sumair did it...?
            var isVanStock = function () {
                return _this.viewModel.partsInBasket &&
                    _this.viewModel.partsInBasket[index] &&
                    _this.viewModel.partsInBasket[index].partOrderStatus === _this.brVanStockPartOrderStatus;
            };
            var isVanStockWarrantyReturn = function () {
                return isVanStock() && _this.viewModel.partsInBasket[index].warrantyReturn && _this.viewModel.partsInBasket[index].warrantyReturn.isWarrantyReturn;
            };
            var root = "viewModel.partsInBasket[" + index + "].";
            [
                {
                    property: root + "taskId",
                    groups: ["partsInBasket[" + index + "]"],
                    basedOn: "viewModel.manualPartDetail.taskId",
                    passes: [
                        {
                            test: function () {
                                return !_this.viewModel.partsInBasket[index].hasTaskWithWrongStatus;
                            },
                            message: "** The associated task an incompatible status **"
                        }
                    ],
                    message: "Select the associated task"
                },
                {
                    property: root + "quantity",
                    groups: ["partsInBasket[" + index + "]"],
                    // basedOn: "viewModel.manualPartDetail.quantity",
                    passes: [
                        {
                            test: function () { return !!_this.viewModel.partsInBasket[index].quantity; },
                            message: ""
                        }
                    ]
                },
                {
                    property: root + "partOrderStatus",
                    groups: ["partsInBasket[" + index + "]"],
                    // basedOn: "viewModel.manualPartDetail.partOrderStatus",
                    passes: [
                        {
                            test: function () { return !!_this.viewModel.partsInBasket[index].partOrderStatus; },
                            message: ""
                        }
                    ]
                },
                {
                    property: root + "warrantyReturn.isWarrantyReturn",
                    groups: ["partsInBasket[" + index + "]"],
                    basedOn: "viewModel.manualPartDetail.warrantyReturn.isWarrantyReturn",
                    condition: function () { return isVanStock(); }
                },
                {
                    property: root + "warrantyReturn.quantityToClaimOrReturn",
                    groups: ["partsInBasket[" + index + "]"],
                    basedOn: "viewModel.manualPartDetail.warrantyReturn.quantityToClaimOrReturn",
                    condition: function () { return isVanStockWarrantyReturn(); },
                    passes: [
                        {
                            test: function () { return _this.viewModel.partsInBasket[index].quantity >= _this.viewModel.partsInBasket[index].warrantyReturn.quantityToClaimOrReturn; },
                            message: ""
                        }
                    ]
                },
                {
                    property: root + "warrantyReturn.removedPartStockReferenceId",
                    groups: ["partsInBasket[" + index + "]"],
                    basedOn: "viewModel.manualPartDetail.stockReferenceId",
                    condition: function () { return isVanStockWarrantyReturn(); }
                },
                {
                    property: root + "warrantyReturn.reasonForClaim",
                    groups: ["partsInBasket[" + index + "]"],
                    basedOn: "parts.warrantyReturn.reasonForClaim",
                    condition: function () { return isVanStockWarrantyReturn(); }
                }
            ].forEach(function (rule) { return _this._validationService.addDynamicRule(_this._validationController, rule); });
        };
        PartsBasket.prototype.removePartsValidationRules = function (index) {
            var _this = this;
            [
                "viewModel.partsInBasket[" + index + "].taskId",
                "viewModel.partsInBasket[" + index + "].quantity",
                "viewModel.partsInBasket[" + index + "].partOrderStatus",
                "viewModel.partsInBasket[" + index + "].warrantyReturn.isWarrantyReturn",
                "viewModel.partsInBasket[" + index + "].warrantyReturn.quantityToClaimOrReturn",
                "viewModel.partsInBasket[" + index + "].warrantyReturn.removedPartStockReferenceId",
                "viewModel.partsInBasket[" + index + "].warrantyReturn.reasonForClaim"
            ].forEach(function (ruleKey) { return _this._validationService.removeDynamicRule(_this._validationController, ruleKey); });
        };
        PartsBasket.prototype.rebuildInboundReservations = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            _a = this;
                            return [4 /*yield*/, this._vanStockService.getMaterialRequests()];
                        case 1:
                            _a.inboundReservations = (_b.sent()).inboundMaterials
                                .filter(function (reservation) { return reservation.status === "PENDING"; })
                                .reduce(function (acc, curr) {
                                acc[curr.stockReferenceId] = (acc[curr.stockReferenceId] || 0) + curr.quantity;
                                return acc;
                            }, {});
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _b.sent();
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", Number)
        ], PartsBasket.prototype, "partsToOrderTotalPrice", void 0);
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", Boolean)
        ], PartsBasket.prototype, "showPartsToOrderList", void 0);
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", Boolean)
        ], PartsBasket.prototype, "showBookAppointmentButton", void 0);
        PartsBasket = __decorate([
            aurelia_framework_1.inject(catalogService_1.CatalogService, engineerService_1.EngineerService, jobService_1.JobService, labelService_1.LabelService, partService_1.PartService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, aurelia_binding_1.BindingEngine, aurelia_router_1.Router, vanStockService_1.VanStockService, storageService_1.StorageService, appLauncher_1.AppLauncher, configurationService_1.ConfigurationService, appointmentBookingService_1.AppointmentBookingService, partsBasketFactory_1.PartsBasketFactory, consumableService_1.ConsumableService, favouriteService_1.FavouriteService, featureToggleService_1.FeatureToggleService),
            __metadata("design:paramtypes", [Object, Object, Object, Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, aurelia_binding_1.BindingEngine,
                aurelia_router_1.Router, Object, Object, Object, Object, Object, Object, Object, Object, Object])
        ], PartsBasket);
        return PartsBasket;
    }(editableViewModel_1.EditableViewModel));
    exports.PartsBasket = PartsBasket;
});

//# sourceMappingURL=partsBasket.js.map
