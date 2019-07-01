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
define(["require", "exports", "../models/part", "../../../common/core/guid", "aurelia-dependency-injection", "../services/businessRuleService", "../models/businessException", "bignumber"], function (require, exports, part_1, guid_1, aurelia_dependency_injection_1, businessRuleService_1, businessException_1, bignumber) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PartFactory = /** @class */ (function () {
        function PartFactory(businessRuleService) {
            this._businessRuleService = businessRuleService;
        }
        PartFactory.prototype.createPartBusinessModelFromAdaptApiModel = function (adaptPartApiModel) {
            var businessModel = new part_1.Part();
            var adaptPartsCurrencyUnit = 0.01;
            businessModel.id = guid_1.Guid.newGuid();
            // todo: businessModel.status
            businessModel.description = adaptPartApiModel.description;
            businessModel.quantity = 1;
            businessModel.stockReferenceId = adaptPartApiModel.stockReferenceId;
            businessModel.price = adaptPartApiModel.price ? new bignumber.BigNumber(adaptPartApiModel.price).times(adaptPartsCurrencyUnit) : new bignumber.BigNumber(0);
            businessModel.partOrderStatus = "O";
            return businessModel;
        };
        PartFactory.prototype.createPartsChargedApiModelsFromBusinessModels = function (task, partsDetail, isPartsChargeableChargeType) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var canAddPart, partFactoryRules, brPartVanStockStatus_1, brPartsDescriptionLength_1, chargeServiceRules, visitStatuses_1, excludePartStatusPrevious_1, partsCharged_1, chargableActivities, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            canAddPart = isPartsChargeableChargeType
                                && partsDetail
                                && task
                                && task.isCharge
                                // only ever transmit partsCharged if the task is complete
                                && task.status === "C";
                            if (!canAddPart) {
                                return [2 /*return*/, []];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, this._businessRuleService.getQueryableRuleGroup("partFactory")];
                        case 2:
                            partFactoryRules = _a.sent();
                            brPartVanStockStatus_1 = partFactoryRules && partFactoryRules.getBusinessRule("partVanStockStatus");
                            brPartsDescriptionLength_1 = partFactoryRules && partFactoryRules.getBusinessRule("partsDescriptionLength");
                            return [4 /*yield*/, this._businessRuleService.getQueryableRuleGroup("chargeService")];
                        case 3:
                            chargeServiceRules = _a.sent();
                            visitStatuses_1 = chargeServiceRules.getBusinessRuleList("visitStatuses");
                            excludePartStatusPrevious_1 = chargeServiceRules.getBusinessRuleList("excludePartStatusPrevious");
                            partsCharged_1 = [];
                            // vanstock
                            if (partsDetail.partsBasket && partsDetail.partsBasket.partsToOrder) {
                                partsDetail.partsBasket.partsToOrder
                                    .filter(function (part) { return part && (part.taskId === task.id) && (part.partOrderStatus === brPartVanStockStatus_1); })
                                    .forEach(function (chargeablePart) {
                                    var convertedPart = _this.createPartCharge(chargeablePart, brPartsDescriptionLength_1);
                                    if (convertedPart) {
                                        partsCharged_1.push(convertedPart);
                                    }
                                });
                            }
                            // todays parts that have been fitted
                            if (partsDetail.partsToday && partsDetail.partsToday.parts) {
                                partsDetail.partsToday.parts
                                    .filter(function (part) { return part && (part.taskId === task.id); })
                                    .forEach(function (todaysPart) {
                                    var convertedPart = _this.createPartCharge(todaysPart, brPartsDescriptionLength_1);
                                    if (convertedPart) {
                                        partsCharged_1.push(convertedPart);
                                    }
                                });
                            }
                            // previously fitted parts on this job
                            if (task.activities) {
                                chargableActivities = task.activities
                                    .filter(function (activity) { return activity
                                    && activity.parts
                                    && activity.parts.length
                                    && visitStatuses_1.some(function (status) { return status === activity.status; }); });
                                chargableActivities.forEach(function (activity) {
                                    activity.parts
                                        .filter(function (part) { return part && !excludePartStatusPrevious_1.some(function (excludedStatus) { return part.status === excludedStatus; }); })
                                        .forEach(function (previousPart) {
                                        var convertedPart = _this.createPartCharge(previousPart, brPartsDescriptionLength_1);
                                        if (convertedPart) {
                                            partsCharged_1.push(convertedPart);
                                        }
                                    });
                                });
                            }
                            return [2 /*return*/, partsCharged_1];
                        case 4:
                            error_1 = _a.sent();
                            throw new businessException_1.BusinessException(this, "createPartsChargedApiModelsFromBusinessModels", "Unable to create the parts charged", null, error_1);
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        PartFactory.prototype.createPartsUsedApiModelsFromBusinessModels = function (task, partsDetail, isPartsChargeableChargeType) {
            // go through all the parts for this task and see if they were used, as in they were either vanstock and in the parts basket
            // or they are todays parts and not returned not used
            var _this = this;
            if (!partsDetail || !task) {
                return Promise.resolve([]);
            }
            return Promise.all([
                this._businessRuleService.getQueryableRuleGroup("partFactory"),
                this._businessRuleService.getQueryableRuleGroup("todaysParts"),
            ]).then(function (_a) {
                var partFactoryRules = _a[0], todaysPartsRules = _a[1];
                var partsUsed = [];
                var brPartsDescriptionLength = partFactoryRules && partFactoryRules.getBusinessRule("partsDescriptionLength");
                if (!todaysPartsRules) {
                    return partsUsed;
                }
                var brPersonalSourceCategory = todaysPartsRules.getBusinessRule("personalSourceCategory");
                var brPartVanStockStatus = todaysPartsRules.getBusinessRule("partVanStockStatus");
                if (brPersonalSourceCategory && brPartVanStockStatus && partsDetail.partsBasket && partsDetail.partsBasket.partsToOrder
                    && partsDetail.partsBasket.partsToOrder.length > 0) {
                    partsDetail.partsBasket.partsToOrder
                        .filter(function (part) { return (part.taskId === task.id) && (part.partOrderStatus === brPartVanStockStatus); })
                        .forEach(function (vanStockPart) {
                        var convertedPart = _this.createPartUsed(vanStockPart, brPartsDescriptionLength, brPersonalSourceCategory, 100, isPartsChargeableChargeType);
                        if (convertedPart) {
                            partsUsed.push(convertedPart);
                        }
                    });
                }
                return partsUsed;
            });
        };
        PartFactory.prototype.createPartsNotUsedApiModelsFromBusinessModels = function (task, partsDetail) {
            // look at the todays parts and add the ones which are returned not used and return those
            if (!partsDetail) {
                return Promise.resolve([]);
            }
            var partsToReturn = [];
            var partsAvailable = partsDetail.partsToday && partsDetail.partsToday.parts && partsDetail.partsToday.parts.length > 0;
            if (!partsAvailable) {
                return Promise.resolve(partsToReturn);
            }
            partsDetail.partsToday.parts
                .filter(function (part) { return (part.taskId === task.id) && (part.notUsedReturn) && (part.notUsedReturn.quantityToReturn > 0); })
                .forEach(function (notUsedPart) {
                var convertedPart = {
                    "fieldComponentVisitSeq": task.sequence,
                    "locationCode": "",
                    "reasonCode": notUsedPart.notUsedReturn.reasonForReturn,
                    "quantityNotUsed": notUsedPart.notUsedReturn.quantityToReturn,
                    "requisitionNumber": "",
                    "stockReferenceId": notUsedPart.stockReferenceId
                };
                partsToReturn.push(convertedPart);
            });
            return Promise.resolve(partsToReturn);
        };
        PartFactory.prototype.createPartsClaimedUnderWarrantyApiModelsFromBusinessModels = function (task, partsDetail) {
            var _this = this;
            var partsToReturn = [];
            if (partsDetail && partsDetail.partsToday && partsDetail.partsToday.parts && partsDetail.partsToday.parts.length) {
                partsDetail.partsToday.parts.filter(function (p) { return p.taskId === task.id && p.warrantyReturn && p.warrantyReturn.isWarrantyReturn; })
                    .forEach(function (part) {
                    var convertedPart = _this.createPartClaimsWarranty(part);
                    partsToReturn.push(convertedPart);
                });
            }
            if (partsDetail && partsDetail.partsBasket && partsDetail.partsBasket.partsToOrder && partsDetail.partsBasket.partsToOrder.length) {
                partsDetail.partsBasket.partsToOrder.filter(function (p) { return p.taskId === task.id && p.warrantyReturn && p.warrantyReturn.isWarrantyReturn; })
                    .forEach(function (part) {
                    var convertedPart = _this.createPartClaimsWarranty(part);
                    partsToReturn.push(convertedPart);
                });
            }
            return Promise.resolve(partsToReturn);
        };
        PartFactory.prototype.createPartsOrderedForTask = function (job) {
            var _this = this;
            var partsOrderedForTasks = { tasks: [] };
            return this._businessRuleService.getQueryableRuleGroup("partFactory")
                .then(function (ruleGroup) {
                var brPartsDescriptionLength = ruleGroup && ruleGroup.getBusinessRule("partsDescriptionLength");
                var brPartOrderStatus = ruleGroup.getBusinessRule("partOrderStatus");
                if (brPartOrderStatus) {
                    if (job && job.partsDetail && job.partsDetail.partsBasket && job.partsDetail.partsBasket.partsToOrder &&
                        job.partsDetail.partsBasket.partsToOrder.filter(function (part) { return part.partOrderStatus === brPartOrderStatus; }).length > 0) {
                        if (job.tasks && job.tasks.length > 0) {
                            job.tasks.forEach(function (task) {
                                var orderedParts = [];
                                job.partsDetail.partsBasket.partsToOrder
                                    .filter(function (part) { return (part.partOrderStatus === brPartOrderStatus) && (part.taskId === task.id); })
                                    .forEach(function (orderedPart) {
                                    var convertedPart = {
                                        visitId: job.visit.id,
                                        charge: new bignumber.BigNumber(orderedPart.price).times(100).toNumber(),
                                        description: orderedPart.description.substring(0, brPartsDescriptionLength),
                                        priority: orderedPart.isPriorityPart,
                                        quantity: orderedPart.quantity,
                                        quantityCharged: orderedPart.quantity,
                                        stockReferenceId: orderedPart.stockReferenceId
                                    };
                                    orderedParts.push(convertedPart);
                                });
                                if (orderedParts.length > 0) {
                                    // some parts have been ordered for this task
                                    var partsOrderedForTask = {};
                                    partsOrderedForTask.deliverToSite = job.partsDetail.partsBasket.deliverPartsToSite || false;
                                    partsOrderedForTask.id = task.isNewRFA ? undefined : task.id;
                                    partsOrderedForTask.fieldTaskId = task.isNewRFA ? task.fieldTaskId : undefined;
                                    partsOrderedForTask.parts = orderedParts;
                                    partsOrderedForTasks.tasks.push(partsOrderedForTask);
                                }
                            });
                            return partsOrderedForTasks;
                        }
                        else {
                            // tasks are missing
                            throw new businessException_1.BusinessException(_this, "createPartsOrderedForTask", "Required task details not present", null, null);
                        }
                    }
                    else {
                        return partsOrderedForTasks;
                    }
                }
                else {
                    // missing required business rules
                    throw new businessException_1.BusinessException(_this, "createPartsOrderedForTask", "Required business rules not present", null, null);
                }
            })
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "createPartsOrderedForTask", "Required business rule group not present: '{0}'", ["partFactory"], error);
            });
        };
        PartFactory.prototype.getPartsConsumedOnJob = function (job) {
            return __awaiter(this, void 0, void 0, function () {
                var todaysPartsRules, brPartVanStockStatus, consumedVanStockParts, consumedJobParts;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._businessRuleService.getQueryableRuleGroup("todaysParts")];
                        case 1:
                            todaysPartsRules = _a.sent();
                            brPartVanStockStatus = todaysPartsRules.getBusinessRule("partVanStockStatus");
                            consumedVanStockParts = (job && job.partsDetail && job.partsDetail.partsBasket && job.partsDetail.partsBasket.partsToOrder || [])
                                .filter(function (part) { return part && part.partOrderStatus === brPartVanStockStatus; })
                                .map(function (part) { return ({
                                stockReferenceId: part.stockReferenceId,
                                isVanStock: true,
                                quantityConsumed: part.quantity || 0
                            }); })
                                .filter(function (part) { return part.quantityConsumed; });
                            consumedJobParts = (job && job.partsDetail && job.partsDetail.partsToday && job.partsDetail.partsToday.parts || [])
                                .filter(function (part) { return part; })
                                .map(function (part) { return ({
                                stockReferenceId: part.stockReferenceId,
                                isVanStock: false,
                                quantityConsumed: (part.quantity || 0) - (part.notUsedReturn && part.notUsedReturn.quantityToReturn || 0)
                            }); })
                                .filter(function (part) { return part.quantityConsumed; });
                            return [2 /*return*/, consumedVanStockParts.concat(consumedJobParts)];
                    }
                });
            });
        };
        PartFactory.prototype.createPartClaimsWarranty = function (part) {
            return {
                "claimedUnderWarrantyReasonDescription": part.warrantyReturn.reasonForClaim,
                "partReturnedIndicator": true,
                "quantityClaimed": part.warrantyReturn.quantityToClaimOrReturn,
                "stockReferenceId": part.warrantyReturn.removedPartStockReferenceId
            };
        };
        PartFactory.prototype.createPartCharge = function (part, brPartsDescriptionLength) {
            var _a = part.price, price = _a === void 0 ? 0 : _a, _b = part.quantity, quantity = _b === void 0 ? 0 : _b, _c = part.description, description = _c === void 0 ? "" : _c, _d = part.stockReferenceId, stockReferenceId = _d === void 0 ? "" : _d;
            var noChargeQty = 0;
            var notUsed = 0;
            if (part.notUsedReturn) {
                noChargeQty = notUsed = part.notUsedReturn.quantityToReturn || 0;
            }
            if (part.warrantyReturn && part.warrantyReturn.isWarrantyReturn) {
                noChargeQty = noChargeQty + (part.warrantyReturn.quantityToClaimOrReturn || 0);
            }
            var quantityUsed = quantity - notUsed;
            var quantityCharged = quantity - noChargeQty;
            if (quantityCharged <= 0 || quantityUsed <= 0) {
                return null;
            }
            return {
                "charge": new bignumber.BigNumber(price).times(100).toNumber(),
                "quantityCharged": quantityCharged,
                "quantityUsed": quantityUsed,
                "description": description.substring(0, brPartsDescriptionLength),
                "stockReferenceId": stockReferenceId
            };
        };
        PartFactory.prototype.createPartUsed = function (part, brPartsDescriptionLength, sourceCategory, buyingUnitPriceMultiplier, isPartsChargeableChargeType) {
            if (buyingUnitPriceMultiplier === void 0) { buyingUnitPriceMultiplier = 1; }
            var _a = part.price, price = _a === void 0 ? 0 : _a, _b = part.quantity, quantity = _b === void 0 ? 0 : _b, _c = part.description, description = _c === void 0 ? "" : _c, _d = part.stockReferenceId, stockReferenceId = _d === void 0 ? "" : _d;
            var noChargeQty = 0;
            var notUsed = 0;
            if (part.notUsedReturn) {
                noChargeQty = notUsed = part.notUsedReturn.quantityToReturn || 0;
            }
            if (part.warrantyReturn && part.warrantyReturn.isWarrantyReturn) {
                noChargeQty = noChargeQty + (part.warrantyReturn.quantityToClaimOrReturn || 0);
            }
            var quantityUsed = quantity - notUsed;
            if (quantityUsed <= 0) {
                return null;
            }
            return {
                "quantityUsed": quantityUsed,
                "quantityCharged": isPartsChargeableChargeType ? quantity - noChargeQty : 0,
                "requisitionNumber": "",
                "buyingUnitPrice": new bignumber.BigNumber(price).times(buyingUnitPriceMultiplier).toNumber(),
                "description": description.substring(0, brPartsDescriptionLength),
                sourceCategory: sourceCategory,
                "charge": new bignumber.BigNumber(part.price).times(buyingUnitPriceMultiplier).toNumber(),
                stockReferenceId: stockReferenceId
            };
        };
        PartFactory = __decorate([
            aurelia_dependency_injection_1.inject(businessRuleService_1.BusinessRuleService),
            __metadata("design:paramtypes", [Object])
        ], PartFactory);
        return PartFactory;
    }());
    exports.PartFactory = PartFactory;
});

//# sourceMappingURL=partFactory.js.map
