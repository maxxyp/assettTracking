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
define(["require", "exports", "aurelia-dependency-injection", "./partFactory", "../models/task", "../models/activity", "../models/part", "../../../common/core/guid", "../../core/dateHelper", "../models/taskVisit", "../../../common/core/stringHelper", "../../../common/core/objectHelper", "../services/businessRuleService", "../services/catalogService", "bignumber", "../../core/numberHelper"], function (require, exports, aurelia_dependency_injection_1, partFactory_1, task_1, activity_1, part_1, guid_1, dateHelper_1, taskVisit_1, stringHelper_1, objectHelper_1, businessRuleService_1, catalogService_1, bignumber, numberHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TaskFactory = /** @class */ (function () {
        function TaskFactory(partFactory, businessRuleService, catalogService) {
            this._partFactory = partFactory;
            this._businessRulesService = businessRuleService;
            this._catalogService = catalogService;
        }
        TaskFactory.prototype.createTaskBusinessModel = function (taskApiModel, partsToday, isCurrentJob) {
            var _this = this;
            return Promise.all([
                this._businessRulesService.getQueryableRuleGroup(stringHelper_1.StringHelper.toCamelCase(objectHelper_1.ObjectHelper.getClassName(this))),
                this._businessRulesService.getQueryableRuleGroup("todaysParts")
            ]).then(function (_a) {
                var businessRules = _a[0], todaysPartsBusinessRules = _a[1];
                var taskBusinessModel = undefined;
                var partLJActionCodes = businessRules.getBusinessRuleList("partLJReportableActionTypes");
                var bypassTaskStatus = businessRules.getBusinessRule("bypassTaskStatus");
                var middlewareDoTodayStatuses = businessRules.getBusinessRuleList("middlewareDoTodayStatuses");
                var partsCurrencyUnit = businessRules.getBusinessRule("partsCurrencyUnit");
                if (taskApiModel && taskApiModel.status !== bypassTaskStatus) {
                    var isDoTodayTask = middlewareDoTodayStatuses.indexOf(taskApiModel.status) > -1;
                    taskBusinessModel = new task_1.Task(isDoTodayTask && isCurrentJob, false);
                    taskBusinessModel.isMiddlewareDoTodayTask = isDoTodayTask;
                    taskBusinessModel.id = taskApiModel.id;
                    taskBusinessModel.jobType = taskApiModel.jobType;
                    taskBusinessModel.applianceType = taskApiModel.applianceType;
                    taskBusinessModel.applianceId = taskApiModel.applianceId;
                    taskBusinessModel.chargeType = taskApiModel.chargeType;
                    taskBusinessModel.specialRequirement = taskApiModel.specialRequirement;
                    taskBusinessModel.supportingText = taskApiModel.supportingText;
                    taskBusinessModel.problemDesc = taskApiModel.problemDesc;
                    taskBusinessModel.applianceMake = taskApiModel.applianceMake;
                    taskBusinessModel.applianceModel = taskApiModel.applianceModel;
                    taskBusinessModel.applianceErrorCode = taskApiModel.applianceErrorCode;
                    taskBusinessModel.applianceErrorDesc = taskApiModel.applianceErrorDesc;
                    taskBusinessModel.sequence = taskApiModel.sequence;
                    taskBusinessModel.previousVisits = [];
                    taskBusinessModel.fixedPriceQuotationAmount = taskApiModel.fixedPriceQuotationAmount;
                    taskBusinessModel.discountCode = taskApiModel.discountCode;
                    taskBusinessModel.isPotentiallyPartLJReportable = partLJActionCodes.some(function (actionCode) { return taskApiModel.jobType === actionCode; });
                    if (!taskBusinessModel.isMiddlewareDoTodayTask) {
                        taskBusinessModel.status = taskApiModel.status;
                    }
                    taskBusinessModel.activities = [];
                    if (taskApiModel.activities) {
                        taskApiModel.activities.forEach(function (activityApiModel) {
                            var activityBusinessModel = new activity_1.Activity();
                            activityBusinessModel.date = dateHelper_1.DateHelper.fromJsonDateString(activityApiModel.date);
                            activityBusinessModel.status = activityApiModel.status;
                            activityBusinessModel.engineerName = activityApiModel.engineerName;
                            activityBusinessModel.report = activityApiModel.report;
                            activityBusinessModel.workDuration = activityApiModel.workDuration;
                            activityBusinessModel.chargeableTime = activityApiModel.chargeableTime;
                            activityBusinessModel.parts = [];
                            if (activityApiModel.parts) {
                                activityApiModel.parts.forEach(function (partApiModel) {
                                    var partBusinessModel = new part_1.Part();
                                    partBusinessModel.status = partApiModel.status;
                                    partBusinessModel.description = partApiModel.description;
                                    partBusinessModel.quantity = partApiModel.quantity;
                                    partBusinessModel.stockReferenceId = partApiModel.stockReferenceId;
                                    partBusinessModel.taskId = taskBusinessModel.id;
                                    partBusinessModel.price = partApiModel.charge ? new bignumber.BigNumber(partApiModel.charge).times(partsCurrencyUnit) : new bignumber.BigNumber(0);
                                    partBusinessModel.isMainPart = partApiModel.isMainPart;
                                    partBusinessModel.orderDate = partApiModel.orderDate;
                                    partBusinessModel.partOrderStatus = partApiModel.partOrderStatus;
                                    partBusinessModel.quantityCharged = partApiModel.quantityCharged;
                                    partBusinessModel.requisitionNumber = partApiModel.requisitionNumber;
                                    partBusinessModel.stockReferenceId = partApiModel.stockReferenceId;
                                    partBusinessModel.fittedDate = dateHelper_1.DateHelper.fromJsonDateString(activityApiModel.date);
                                    partBusinessModel.id = guid_1.Guid.newGuid();
                                    activityBusinessModel.parts.push(partBusinessModel);
                                    if (todaysPartsBusinessRules && partsToday) {
                                        if (_this.isATodaysPart(partBusinessModel, activityBusinessModel, todaysPartsBusinessRules)) {
                                            partsToday.parts.push(partBusinessModel);
                                        }
                                    }
                                });
                            }
                            taskBusinessModel.activities.push(activityBusinessModel);
                        });
                    }
                    var previousVisits = _this.generatePreviousVisits(middlewareDoTodayStatuses, taskApiModel.activities);
                    taskBusinessModel.previousVisits = previousVisits;
                }
                return taskBusinessModel;
            });
        };
        TaskFactory.prototype.createTaskApiModel = function (task, job, hardwareSequenceNumber) {
            return __awaiter(this, void 0, void 0, function () {
                var taskApiModel, taskIsLive, chargeType, isPartsChargeable, _a, _b, _c, _d, statuses, taskStatus, taskItemRuleGroup;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            taskApiModel = {};
                            taskIsLive = !job.jobNotDoingReason && !task.isNotDoingTask;
                            taskApiModel.id = task.isNewRFA ? undefined : task.id;
                            taskApiModel.fieldTaskId = task.isNewRFA ? task.fieldTaskId : undefined;
                            taskApiModel.newWork = task.isNewRFA;
                            taskApiModel.jobType = task.jobType;
                            taskApiModel.applianceType = task.applianceType;
                            taskApiModel.chargeType = task.chargeType;
                            taskApiModel.sequence = task.sequence;
                            taskApiModel.applianceId = hardwareSequenceNumber ? undefined : task.applianceId;
                            taskApiModel.status = task.status;
                            taskApiModel.hardwareSequenceNumber = hardwareSequenceNumber || undefined;
                            taskApiModel.componentEndTime = dateHelper_1.DateHelper.timeStringToJsonDateTimeString(task.endTime) || undefined;
                            taskApiModel.componentStartTime = dateHelper_1.DateHelper.timeStringToJsonDateTimeString(task.startTime) || undefined;
                            taskApiModel.report = task.report;
                            if (taskIsLive) {
                                taskApiModel.report = (task.chirpCodes && task.chirpCodes.length > 0) ?
                                    task.chirpCodes.join(" ").concat(" ", taskApiModel.report) :
                                    taskApiModel.report;
                                taskApiModel.energyEfficiencyOutcome = task.adviceOutcome;
                                taskApiModel.energyAdviceCategoryCode = task.adviceCode;
                                taskApiModel.energyEfficiencyAdviceComments = task.adviceComment;
                                taskApiModel.productGroupCode = task.productGroup;
                                taskApiModel.partTypeCode = task.partType;
                                taskApiModel.fixedPriceQuotationAmount = task.fixedPriceQuotationAmount;
                                taskApiModel.workDuration = task.workDuration;
                                taskApiModel.workedOnCode = task.workedOnCode;
                                taskApiModel.visitActivityCode = task.activity;
                                taskApiModel.faultActionCode = task.faultActionCode;
                            }
                            return [4 /*yield*/, this._catalogService.getChargeType(task.chargeType)];
                        case 1:
                            chargeType = _e.sent();
                            isPartsChargeable = numberHelper_1.NumberHelper.isNullOrUndefined(task.fixedPriceQuotationAmount) // 0 is valid here
                                && chargeType
                                && chargeType.chargePartsIndicator === "Y"
                                && taskIsLive;
                            if (!taskIsLive) return [3 /*break*/, 6];
                            // todo move logic out to here about whether to build charges
                            _a = taskApiModel;
                            return [4 /*yield*/, this._partFactory.createPartsChargedApiModelsFromBusinessModels(task, job.partsDetail, isPartsChargeable)];
                        case 2:
                            // todo move logic out to here about whether to build charges
                            _a.partsCharged = _e.sent();
                            _b = taskApiModel;
                            return [4 /*yield*/, this._partFactory.createPartsUsedApiModelsFromBusinessModels(task, job.partsDetail, isPartsChargeable)];
                        case 3:
                            _b.partsUsed = _e.sent();
                            _c = taskApiModel;
                            return [4 /*yield*/, this._partFactory.createPartsNotUsedApiModelsFromBusinessModels(task, job.partsDetail)];
                        case 4:
                            _c.partsNotUsed = _e.sent();
                            _d = taskApiModel;
                            return [4 /*yield*/, this._partFactory.createPartsClaimedUnderWarrantyApiModelsFromBusinessModels(task, job.partsDetail)];
                        case 5:
                            _d.partsClaimedUnderWarranty = _e.sent();
                            _e.label = 6;
                        case 6: return [4 /*yield*/, this._catalogService.getActivityComponentVisitStatuses()];
                        case 7:
                            statuses = _e.sent();
                            taskStatus = statuses && statuses.find(function (status) { return status.status === taskApiModel.status; });
                            if (taskStatus) {
                                taskApiModel.jobStatusCategory = taskStatus.jobStatusCategory;
                            }
                            if (!taskApiModel.partsUsed || taskApiModel.partsUsed.length === 0) {
                                taskApiModel.partsUsed = undefined;
                            }
                            if (!taskApiModel.partsCharged || taskApiModel.partsCharged.length === 0) {
                                taskApiModel.partsCharged = undefined;
                            }
                            if (!taskApiModel.partsClaimedUnderWarranty || taskApiModel.partsClaimedUnderWarranty.length === 0) {
                                taskApiModel.partsClaimedUnderWarranty = undefined;
                            }
                            if (!taskApiModel.partsNotUsed || taskApiModel.partsNotUsed.length === 0) {
                                taskApiModel.partsNotUsed = undefined;
                            }
                            return [4 /*yield*/, this._businessRulesService.getQueryableRuleGroup("taskItem")];
                        case 8:
                            taskItemRuleGroup = _e.sent();
                            if (!this.isTaskStatusRequiresDurations(taskItemRuleGroup, task.status)) {
                                taskApiModel.workDuration = 0;
                                taskApiModel.chargeableTime = undefined;
                                taskApiModel.componentStartTime = undefined;
                                taskApiModel.componentEndTime = undefined;
                            }
                            else {
                                taskApiModel.workDuration = taskIsLive ? task.workDuration : 0;
                                taskApiModel.chargeableTime = taskIsLive ? task.chargeableTime : 0;
                            }
                            return [2 /*return*/, taskApiModel];
                    }
                });
            });
        };
        TaskFactory.prototype.isATodaysPart = function (part, activity, todaysPartsBusinessRules) {
            return activity.status === todaysPartsBusinessRules.getBusinessRule("doTodayActivityStatus")
                && part.status === todaysPartsBusinessRules.getBusinessRule("toBeFittedPartStatus");
        };
        TaskFactory.prototype.generatePreviousVisits = function (middlewareDoTodayStatuses, activities) {
            var visits = [];
            if (activities && middlewareDoTodayStatuses) {
                activities.filter(function (activity) { return middlewareDoTodayStatuses.indexOf(activity.status) === -1; }).forEach(function (activity) {
                    var previousVisit = new taskVisit_1.TaskVisit();
                    previousVisit.date = activity.date;
                    previousVisit.report = activity.report;
                    previousVisit.status = activity.status;
                    previousVisit.chargeableTime = activity.chargeableTime;
                    previousVisit.workDuration = activity.workDuration;
                    previousVisit.engineerName = activity.engineerName;
                    visits.push(previousVisit);
                });
            }
            return visits;
        };
        TaskFactory.prototype.isTaskStatusRequiresDurations = function (ruleGroup, status) {
            var rules = ruleGroup.getBusinessRuleList("taskNotRequriedDuration");
            return rules ? !rules.some(function (x) { return x === status; }) : true;
        };
        TaskFactory = __decorate([
            aurelia_dependency_injection_1.inject(partFactory_1.PartFactory, businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService),
            __metadata("design:paramtypes", [Object, Object, Object])
        ], TaskFactory);
        return TaskFactory;
    }());
    exports.TaskFactory = TaskFactory;
});

//# sourceMappingURL=taskFactory.js.map
