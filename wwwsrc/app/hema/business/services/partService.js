/// <reference path="../../../../typings/app.d.ts" />
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
define(["require", "exports", "aurelia-framework", "./jobService", "../models/businessException", "../models/partsBasket", "../models/partsDetail", "../models/warrantyEstimate", "../models/warrantyEstimateType", "./catalogService", "./businessRuleService", "moment", "../models/dataState", "../models/job"], function (require, exports, aurelia_framework_1, jobService_1, businessException_1, partsBasket_1, partsDetail_1, warrantyEstimate_1, warrantyEstimateType_1, catalogService_1, businessRuleService_1, moment, dataState_1, job_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PartService = /** @class */ (function () {
        function PartService(jobService, catalogService, businessRuleService) {
            this._jobService = jobService;
            this._catalogService = catalogService;
            this._businessRuleService = businessRuleService;
        }
        PartService.prototype.clearMainPartForTask = function (jobId, taskId) {
            return __awaiter(this, void 0, void 0, function () {
                var job, parts, existingMainPart;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._jobService.getJob(jobId)];
                        case 1:
                            job = _a.sent();
                            if (!job) return [3 /*break*/, 4];
                            parts = job.partsDetail
                                && job.partsDetail.partsBasket
                                && job.partsDetail.partsBasket.partsToOrder || [];
                            existingMainPart = parts.find(function (p) { return p.taskId === taskId && p.isMainPart; });
                            if (!existingMainPart) return [3 /*break*/, 3];
                            existingMainPart.isMainPart = false;
                            if (job.partsDetail.partsBasket.dataState !== dataState_1.DataState.invalid) {
                                job.partsDetail.partsBasket.dataState = dataState_1.DataState.notVisited;
                            }
                            return [4 /*yield*/, this._jobService.setJob(job)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4: throw new businessException_1.BusinessException(this, "partService.getMainPartForTask", "job not found", [jobId], null);
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        PartService.prototype.getPartStatusValidity = function (part, job) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, orderPartStatuses, vanStockStatuses, vanStockOrderStatus, validTaskStatusesForThisPart, partTask;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!!this._partsRequiredBusinessRules) return [3 /*break*/, 2];
                            _a = this;
                            return [4 /*yield*/, this._businessRuleService.getQueryableRuleGroup("partsRequiredInBasket")];
                        case 1:
                            _a._partsRequiredBusinessRules = _b.sent();
                            _b.label = 2;
                        case 2:
                            orderPartStatuses = this._partsRequiredBusinessRules.getBusinessRule("orderPartStatuses").split(",");
                            vanStockStatuses = this._partsRequiredBusinessRules.getBusinessRule("vanStockStatuses").split(",");
                            vanStockOrderStatus = this._partsRequiredBusinessRules.getBusinessRule("vanPartsInBasket");
                            validTaskStatusesForThisPart = part.partOrderStatus === vanStockOrderStatus ? vanStockStatuses : orderPartStatuses;
                            partTask = job.tasks.find(function (task) { return task.id === part.taskId; });
                            return [2 /*return*/, !!partTask && validTaskStatusesForThisPart.some(function (status) { return partTask.status === status; })];
                    }
                });
            });
        };
        PartService.prototype.setPartsRequiredForTask = function (jobId) {
            return __awaiter(this, void 0, void 0, function () {
                var job, isBasketValid;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._jobService.getJob(jobId)];
                        case 1:
                            job = _a.sent();
                            if (job.tasks.length === 1) {
                                job.partsDetail.partsBasket.partsToOrder.forEach(function (part) {
                                    part.taskId = job.tasks[0].id;
                                });
                            }
                            return [4 /*yield*/, this.getPartsBasketStatusValidity(job.partsDetail.partsBasket.partsToOrder, job)];
                        case 2:
                            isBasketValid = _a.sent();
                            job.partsDetail.partsBasket.hasAtLeastOneWrongActivityStatus = !isBasketValid;
                            if (isBasketValid) {
                                if (job.partsDetail.partsBasket.dataState === dataState_1.DataState.invalid) {
                                    job.partsDetail.partsBasket.dataState = dataState_1.DataState.notVisited;
                                }
                            }
                            else {
                                job.partsDetail.partsBasket.dataState = dataState_1.DataState.invalid;
                            }
                            return [4 /*yield*/, this._jobService.setJob(job)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, !isBasketValid];
                    }
                });
            });
        };
        PartService.prototype.getMainPartForTask = function (jobId, taskId) {
            var _this = this;
            return this._jobService.getJob(jobId)
                .then(function (job) {
                if (job) {
                    var parts = job.partsDetail
                        && job.partsDetail.partsBasket
                        && job.partsDetail.partsBasket.partsToOrder || [];
                    return parts.find(function (p) { return (p.taskId === taskId) && p.isMainPart; }) || null;
                }
                else {
                    throw new businessException_1.BusinessException(_this, "partService.getMainPartForTask", "job not found", [jobId], null);
                }
            });
        };
        PartService.prototype.getPartsBasket = function (jobId) {
            var _this = this;
            return this._jobService.getJob(jobId)
                .then(function (job) {
                if (job) {
                    return job.partsDetail.partsBasket;
                }
                else {
                    throw new businessException_1.BusinessException(_this, "partService.getPartsBasket", "job not found", [jobId], null);
                }
            });
        };
        PartService.prototype.savePartsBasket = function (jobId, partsBasket) {
            var _this = this;
            return this._jobService.getJob(jobId)
                .then(function (job) {
                if (job) {
                    if (!job.partsDetail) {
                        job.partsDetail = new partsDetail_1.PartsDetail();
                    }
                    if (!job.partsDetail.partsBasket) {
                        job.partsDetail.partsBasket = new partsBasket_1.PartsBasket();
                    }
                    var getTaskMainParts = function (parts) { return parts
                        .filter(function (part) { return part.isMainPart && part.taskId; }); };
                    var preSaveTaskMainParts_1 = getTaskMainParts(job.partsDetail.partsBasket.partsToOrder);
                    var newTaskMainParts = getTaskMainParts(partsBasket.partsToOrder);
                    var taskIdsNewlyMainPartedOrChanged = newTaskMainParts
                        .filter(function (newPart) { return !preSaveTaskMainParts_1
                        .some(function (prevPart) { return newPart.taskId === prevPart.taskId
                        && newPart.id === prevPart.id; }); })
                        .map(function (part) { return part.taskId; });
                    taskIdsNewlyMainPartedOrChanged
                        .map(function (taskId) { return job.tasks.find(function (task) { return task.id === taskId; }); })
                        .filter(function (task) { return task && (task.activity || task.productGroup || task.partType); })
                        .forEach(function (task) {
                        task.activity = undefined;
                        task.productGroup = undefined;
                        task.partType = undefined;
                        if (task.dataState !== dataState_1.DataState.invalid) {
                            task.dataState = dataState_1.DataState.notVisited;
                        }
                    });
                    job.partsDetail.partsBasket.dataState = partsBasket.dataState;
                    job.partsDetail.partsBasket.manualPartDetail = partsBasket.manualPartDetail;
                    job.partsDetail.partsBasket.showAddPartManually = partsBasket.showAddPartManually;
                    job.partsDetail.partsBasket.showRemainingAddPartManuallyFields = partsBasket.showRemainingAddPartManuallyFields;
                    job.partsDetail.partsBasket.deliverPartsToSite = partsBasket.deliverPartsToSite;
                    job.partsDetail.partsBasket.partsToOrder = partsBasket.partsToOrder;
                    job.partsDetail.partsBasket.hasAtLeastOneWrongActivityStatus = partsBasket.hasAtLeastOneWrongActivityStatus;
                    return _this.getPartsBasketStatusValidity(job.partsDetail.partsBasket.partsToOrder, job)
                        .then(function (isBasketValid) {
                        if (isBasketValid) {
                            if (job.partsDetail.partsBasket.dataState !== dataState_1.DataState.invalid) {
                                job.partsDetail.partsBasket.dataState = dataState_1.DataState.valid;
                            }
                        }
                        else {
                            job.partsDetail.partsBasket.dataState = dataState_1.DataState.invalid;
                        }
                    })
                        .then(function () { return _this._jobService.setJob(job); });
                }
                else {
                    throw new businessException_1.BusinessException(_this, "partService.savePartsBasket", "no current job selected", null, null);
                }
            });
        };
        PartService.prototype.getTodaysParts = function (jobId) {
            var _this = this;
            return this._jobService.getJob(jobId)
                .then(function (job) {
                if (!job) {
                    throw new businessException_1.BusinessException(_this, "partService.getTodaysParts", "no current job selected", null, null);
                }
                var promises = [];
                if (job.partsDetail &&
                    job.partsDetail.partsToday &&
                    job.partsDetail.partsToday.parts) {
                    job.partsDetail.partsToday.parts.forEach(function (part) {
                        promises.push(_this.getPartWarrantyEstimate(jobId, part.stockReferenceId, part.taskId)
                            .then(function (estimate) {
                            part.warrantyEstimate = estimate;
                        }));
                    });
                }
                return Promise.all(promises).then(function () { return job.partsDetail.partsToday; });
            });
        };
        PartService.prototype.saveTodaysPartsReturns = function (jobId, dataState, partReturns) {
            var _this = this;
            return this._jobService.getJob(jobId)
                .then(function (job) {
                if (!job || !job.partsDetail || !job.partsDetail.partsToday || !job.partsDetail.partsToday.parts) {
                    throw new businessException_1.BusinessException(_this, "partService.saveTodaysParts", "no current job selected or no partsToday parts found", [jobId], null);
                }
                job.partsDetail.partsToday.dataState = dataState;
                partReturns.forEach(function (partReturn) {
                    var part = job.partsDetail.partsToday.parts.find(function (todaysPart) { return todaysPart.id === partReturn.partId; });
                    part.warrantyReturn = partReturn.warrantyReturn;
                    part.notUsedReturn = partReturn.notusedReturn;
                });
                return _this._jobService.setJob(job);
            });
        };
        PartService.prototype.getFittedParts = function (jobId) {
            var _this = this;
            return Promise.all([
                this._catalogService.getGoodsItemStatuses(),
                this._businessRuleService.getQueryableRuleGroup("todaysParts"),
                this._jobService.getJob(jobId)
            ])
                .then(function (_a) {
                var partStatuses = _a[0], ruleGroup = _a[1], job = _a[2];
                if (!job) {
                    throw new businessException_1.BusinessException(_this, "partService.saveTodaysParts", "no current job selected", null, null);
                }
                var parts = [];
                var notFittedIndicator = ruleGroup.getBusinessRule("notFittedIndicator");
                var isAFittedPart = function (part) { return partStatuses.find(function (status) { return status.status === part.status && status.goodsItemNotFindIndicator === notFittedIndicator; }); };
                if (job.history && job.history.tasks) {
                    job.history.tasks.forEach(function (task) {
                        if (task && task.activities) {
                            task.activities.forEach(function (activity) {
                                if (activity && activity.parts) {
                                    activity.parts.forEach(function (part) {
                                        if (part) {
                                            if (isAFittedPart(part)) {
                                                parts.push(part);
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                job_1.Job.getTasksAndCompletedTasks(job)
                    .forEach(function (task) {
                    if (task && task.activities) {
                        task.activities.forEach(function (activity) {
                            if (activity && activity.parts) {
                                activity.parts.forEach(function (part) {
                                    if (part && isAFittedPart(part) && !_this.isATodaysPart(part, activity, ruleGroup)) {
                                        parts.push(part);
                                    }
                                });
                            }
                        });
                    }
                });
                return parts;
            });
        };
        PartService.prototype.getPartWarrantyEstimate = function (jobId, stockRefId, taskId) {
            var _this = this;
            return Promise.all([
                this._businessRuleService.getQueryableRuleGroup("todaysParts"),
                this._catalogService.getGoodsType(stockRefId),
                this._jobService.getJob(jobId)
            ])
                .then(function (_a) {
                var ruleGroup = _a[0], goodsType = _a[1], job = _a[2];
                var warrantyPeriod = _this.getPartWarrantyPeriodOrDefault(goodsType, ruleGroup);
                var unknownWarrantyEstimateResult = new warrantyEstimate_1.WarrantyEstimate(false, warrantyPeriod, null, warrantyEstimateType_1.WarrantyEstimateType.unknown);
                var appliance;
                if (!taskId || !job || !job.history || !job.history.appliances) {
                    return unknownWarrantyEstimateResult;
                }
                var task = (job.tasks.concat(job.history.tasks || [])).find(function (t) { return t.id === taskId; });
                if (task !== undefined) {
                    appliance = job.history.appliances.find(function (a) { return a.id === task.applianceId; });
                    if (!appliance) {
                        return unknownWarrantyEstimateResult;
                    }
                }
                return _this.getPartFittedDates(jobId, stockRefId, goodsType, ruleGroup)
                    .then(function (partFittedDates) {
                    var applianceInstallationDate = (appliance && appliance.installationYear) ? moment(appliance.installationYear + "-12-31").toDate() : null;
                    var mostRecentFittedDate = Math.max.apply(null, [applianceInstallationDate, partFittedDates.equivalentPartDate, partFittedDates.samePartDate]);
                    mostRecentFittedDate = (mostRecentFittedDate === 0 ? null : mostRecentFittedDate);
                    if (warrantyPeriod === 0) {
                        return new warrantyEstimate_1.WarrantyEstimate(false, 0, mostRecentFittedDate, warrantyEstimateType_1.WarrantyEstimateType.doesNotHaveWarranty);
                    }
                    if (_this.isDateInWarranty(partFittedDates.samePartDate, warrantyPeriod)) {
                        return new warrantyEstimate_1.WarrantyEstimate(true, warrantyPeriod, partFittedDates.samePartDate, warrantyEstimateType_1.WarrantyEstimateType.samePartInstallationDate);
                    }
                    if (_this.isDateInWarranty(partFittedDates.equivalentPartDate, warrantyPeriod)) {
                        return new warrantyEstimate_1.WarrantyEstimate(true, warrantyPeriod, partFittedDates.equivalentPartDate, warrantyEstimateType_1.WarrantyEstimateType.equivalentPartInstallationDate);
                    }
                    var applianceWarrantyPeriod = ruleGroup.getBusinessRule("defaultApplianceWarrantyWeeks");
                    if (_this.isDateInWarranty(applianceInstallationDate, warrantyPeriod)) {
                        return new warrantyEstimate_1.WarrantyEstimate(true, applianceWarrantyPeriod, applianceInstallationDate, warrantyEstimateType_1.WarrantyEstimateType.applianceInstallationDate);
                    }
                    return new warrantyEstimate_1.WarrantyEstimate(false, warrantyPeriod, mostRecentFittedDate, warrantyEstimateType_1.WarrantyEstimateType.notInWarranty);
                });
            });
        };
        PartService.prototype.deletePartsAssociatedWithTask = function (jobId, taskId) {
            return __awaiter(this, void 0, void 0, function () {
                var job, partsInBasket, isPartsBasketValid;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._jobService.getJob(jobId)];
                        case 1:
                            job = _a.sent();
                            if (!(job && job.partsDetail && job.partsDetail.partsBasket)) return [3 /*break*/, 4];
                            if (!job.partsDetail.partsBasket.partsToOrder) return [3 /*break*/, 3];
                            partsInBasket = job.partsDetail.partsBasket.partsToOrder.slice();
                            partsInBasket.forEach(function (part) {
                                if (part.taskId === taskId) {
                                    job.partsDetail.partsBasket.partsToOrder.splice(job.partsDetail.partsBasket.partsToOrder.indexOf(part), 1);
                                }
                            });
                            return [4 /*yield*/, this.getPartsBasketStatusValidity(job.partsDetail.partsBasket.partsToOrder, job)];
                        case 2:
                            isPartsBasketValid = _a.sent();
                            job.partsDetail.partsBasket.hasAtLeastOneWrongActivityStatus = !isPartsBasketValid;
                            if (isPartsBasketValid) {
                                if (job.partsDetail.partsBasket.dataState === dataState_1.DataState.invalid) {
                                    job.partsDetail.partsBasket.dataState = dataState_1.DataState.notVisited;
                                }
                            }
                            else {
                                job.partsDetail.partsBasket.dataState = dataState_1.DataState.invalid;
                            }
                            return [2 /*return*/, this._jobService.setJob(job)];
                        case 3: return [2 /*return*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        PartService.prototype.getPartsBasketStatusValidity = function (parts, job) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var mandatoryPartStatuses, partValidityResults, isAPartInvalid, partRequiredTasks, everyMandatoryTaskIsHappy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mandatoryPartStatuses = ["IP"];
                            return [4 /*yield*/, Promise.all(parts.map(function (part) { return _this.getPartStatusValidity(part, job); }))];
                        case 1:
                            partValidityResults = _a.sent();
                            isAPartInvalid = partValidityResults.some(function (result) { return !result; });
                            partRequiredTasks = job.tasks.filter(function (task) { return mandatoryPartStatuses.some(function (status) { return status === task.status; }); });
                            everyMandatoryTaskIsHappy = partRequiredTasks.every(function (task) { return parts.some(function (part) { return part.taskId === task.id && part.partOrderStatus === "O"; }); });
                            job.partsDetail.partsBasket.hasAtLeastOneWrongActivityStatus = !everyMandatoryTaskIsHappy;
                            return [2 /*return*/, everyMandatoryTaskIsHappy && !isAPartInvalid];
                    }
                });
            });
        };
        PartService.prototype.getPartWarrantyPeriodOrDefault = function (goodsType, ruleGroup) {
            var isPartCatalogCurrentlyInDate = function () {
                var goodsTypeDateFmt = ruleGroup.getBusinessRule("goodsTypeDateFmt") || "";
                return (!goodsType.goodsTypeStartDate || moment(goodsType.goodsTypeStartDate, goodsTypeDateFmt).isBefore(moment()))
                    && ((!goodsType.goodsTypeEndDate || goodsType.goodsTypeEndDate === "") || moment(goodsType.goodsTypeEndDate, goodsTypeDateFmt).isAfter(moment()));
            };
            var hasPartCatalogGotAWarrantyPeriod = function () {
                return goodsType
                    && (!!goodsType.warrantyPeriod || goodsType.warrantyPeriod === 0);
            };
            return hasPartCatalogGotAWarrantyPeriod() && isPartCatalogCurrentlyInDate()
                ? goodsType.warrantyPeriod
                : ruleGroup.getBusinessRule("defaultPartWarrantyWeeks");
        };
        PartService.prototype.getPartFittedDates = function (jobId, stockRefId, goodsType, ruleGroup) {
            var _this = this;
            var getPartWithClassification = function (part) {
                if (part.stockReferenceId === stockRefId) {
                    return Promise.resolve({ part: part, classification: "samePart" });
                }
                else if (!goodsType) {
                    return Promise.resolve({ part: part, classification: "cannotEstablish" });
                }
                else {
                    return _this._catalogService.getGoodsType(part.stockReferenceId)
                        .then(function (catalog) { return (catalog
                        && catalog.productGroupCode === goodsType.productGroupCode
                        && catalog.partTypeCode === goodsType.partTypeCode)
                        ? { part: part, classification: "equivalentPart" }
                        : { part: part, classification: "differentPart" }; });
                }
            };
            return this.getFittedParts(jobId)
                .then(function (parts) { return Promise.all(parts.map(function (part) { return getPartWithClassification(part); })); })
                .then(function (partsWithClassification) {
                var samePartDates = partsWithClassification.filter(function (p) { return p.classification === "samePart"; })
                    .map(function (p) { return moment(p.part.fittedDate).toDate(); });
                var equivalentPartDates = partsWithClassification.filter(function (p) { return p.classification === "equivalentPart"; })
                    .map(function (p) { return moment(p.part.fittedDate).toDate(); });
                return {
                    samePartDate: samePartDates.length ? Math.max.apply(null, samePartDates) : null,
                    equivalentPartDate: equivalentPartDates.length ? Math.max.apply(null, equivalentPartDates) : null
                };
            });
        };
        PartService.prototype.isDateInWarranty = function (date, warrantyWeeks) {
            return !!date && moment(date).add(warrantyWeeks, "weeks").isAfter();
        };
        PartService.prototype.isATodaysPart = function (part, activity, ruleGroup) {
            return activity.status === ruleGroup.getBusinessRule("doTodayActivityStatus")
                && part.status === ruleGroup.getBusinessRule("toBeFittedPartStatus");
        };
        PartService = __decorate([
            aurelia_framework_1.inject(jobService_1.JobService, catalogService_1.CatalogService, businessRuleService_1.BusinessRuleService),
            __metadata("design:paramtypes", [Object, Object, Object])
        ], PartService);
        return PartService;
    }());
    exports.PartService = PartService;
});

//# sourceMappingURL=partService.js.map
