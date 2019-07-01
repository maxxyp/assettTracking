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
define(["require", "exports", "aurelia-framework", "./jobService", "../models/task", "../models/businessException", "../services/businessRuleService", "../models/job", "../models/businessRules/taskBusinessRuleHelper", "../../common/dataStateManager", "./partService", "../models/propertySafetyType", "aurelia-event-aggregator", "../../../common/ui/elements/constants/uiConstants", "../../../common/core/guid", "moment"], function (require, exports, aurelia_framework_1, jobService_1, task_1, businessException_1, businessRuleService_1, job_1, taskBusinessRuleHelper_1, dataStateManager_1, partService_1, propertySafetyType_1, aurelia_event_aggregator_1, uiConstants_1, guid_1, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TaskService = /** @class */ (function () {
        function TaskService(jobService, businessRulesService, dataStateManager, partService, eventAggregator) {
            this._jobService = jobService;
            this._businessRulesService = businessRulesService;
            this._dataStateManager = dataStateManager;
            this._partService = partService;
            this._eventAggregator = eventAggregator;
        }
        TaskService.prototype.getTasks = function (jobId) {
            var _this = this;
            return this._jobService.getJob(jobId)
                .then(function (job) {
                return job.tasks;
            })
                .catch(function (ex) {
                throw new businessException_1.BusinessException(_this, "activities", "could not get activities", null, ex);
            });
        };
        TaskService.prototype.getTasksAndCompletedTasks = function (jobId) {
            var _this = this;
            return this._jobService.getJob(jobId)
                .then(function (job) {
                return job_1.Job.getTasksAndCompletedTasks(job);
            })
                .catch(function (ex) {
                throw new businessException_1.BusinessException(_this, "activities", "could not get all activities", null, ex);
            });
        };
        TaskService.prototype.getAllTasksEverAtProperty = function (jobId) {
            var _this = this;
            return this._jobService.getJob(jobId)
                .then(function (job) {
                return job_1.Job.getTasksAndCompletedTasks(job).concat(job.history.tasks || []);
            })
                .catch(function (ex) {
                throw new businessException_1.BusinessException(_this, "activities", "could not get activities", null, ex);
            });
        };
        TaskService.prototype.getTaskItem = function (jobId, taskId) {
            var _this = this;
            return this.getTasksAndCompletedTasks(jobId)
                .then(function (tasks) { return tasks.find(function (t) { return t.id === taskId; }); })
                .catch(function (ex) {
                throw new businessException_1.BusinessException(_this, "activities", "could not get activity", null, ex);
            });
        };
        TaskService.prototype.updateTaskAppliance = function (jobId, taskId, applianceType, newApplianceId, actionType, chargeType) {
            var _this = this;
            return this._jobService.getJob(jobId).then(function (job) {
                if (job) {
                    var currentTask_1 = job.tasks.find(function (x) { return x.id === taskId; });
                    if (currentTask_1) {
                        return _this._businessRulesService.getQueryableRuleGroup("chargeService")
                            .then(function (ruleGroup) { return task_1.Task.isChargeableTask(chargeType, ruleGroup.getBusinessRule("noChargePrefix")); })
                            .then(function (isChargeableTask) {
                            currentTask_1.applianceType = applianceType;
                            currentTask_1.applianceId = newApplianceId;
                            currentTask_1.jobType = actionType;
                            currentTask_1.chargeType = chargeType;
                            currentTask_1.isCharge = isChargeableTask;
                            _this.checkLandlordJob(job);
                            return _this._dataStateManager.updateAppliancesDataState(job)
                                .then(function () { return _this._dataStateManager.updatePropertySafetyDataState(job); })
                                .then(function () { return _this._jobService.setJob(job); })
                                .then(function () { return currentTask_1; })
                                .catch(function (err) { throw new businessException_1.BusinessException(_this, "updateTask", "error saving task detail", null, err); });
                        });
                    }
                    throw new businessException_1.BusinessException(_this, "updateTaskAppliance", "no current task found", null, null);
                }
                throw new businessException_1.BusinessException(_this, "updateTaskAppliance", "no current job selected", null, null);
            });
        };
        TaskService.prototype.deleteTask = function (jobId, taskId) {
            return __awaiter(this, void 0, void 0, function () {
                var job, currentTaskIndex, deletedTasksArray, deletedTask, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._jobService.getJob(jobId)];
                        case 1:
                            job = _a.sent();
                            if (!job) return [3 /*break*/, 13];
                            currentTaskIndex = job.tasks.findIndex(function (task) { return task.id === taskId; });
                            if (!(currentTaskIndex !== -1)) return [3 /*break*/, 11];
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 9, , 10]);
                            deletedTasksArray = job.tasks.splice(currentTaskIndex, 1);
                            deletedTask = deletedTasksArray[0];
                            return [4 /*yield*/, this.removeTaskFromTimeLine(deletedTask, job)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.populateAppointment(job)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, this._dataStateManager.updateAppliancesDataState(job)];
                        case 5:
                            _a.sent();
                            this._dataStateManager.updatePropertySafetyDataState(job);
                            return [4 /*yield*/, this._partService.deletePartsAssociatedWithTask(jobId, taskId)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, this._jobService.setJobNoAccessed(job)];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, this._jobService.setJob(job)];
                        case 8:
                            _a.sent();
                            return [3 /*break*/, 10];
                        case 9:
                            error_1 = _a.sent();
                            throw new businessException_1.BusinessException(this, "deleteTask", "error saving task detail", null, error_1);
                        case 10: return [3 /*break*/, 12];
                        case 11: throw new businessException_1.BusinessException(this, "deleteTask", "no current task found", null, null);
                        case 12: return [3 /*break*/, 14];
                        case 13: throw new businessException_1.BusinessException(this, "deleteTask", "no current job selected", null, null);
                        case 14: return [2 /*return*/];
                    }
                });
            });
        };
        TaskService.prototype.createTask = function (jobId, newTask) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var job, maxExistingOrderNo, ruleGroup_1, liveTasks, previousLiveTask;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._jobService.getJob(jobId)];
                        case 1:
                            job = _a.sent();
                            if (!job) return [3 /*break*/, 3];
                            job.tasks = job.tasks || [];
                            maxExistingOrderNo = Math.max.apply(Math, job.tasks.map(function (task) { return task.orderNo || 0; }));
                            newTask.orderNo = maxExistingOrderNo + 1;
                            return [4 /*yield*/, this._businessRulesService.getRuleGroup("taskItem")];
                        case 2:
                            ruleGroup_1 = _a.sent();
                            liveTasks = job.tasks.filter(function (task) { return !taskBusinessRuleHelper_1.TaskBusinessRuleHelper.isNotDoingTaskStatus(ruleGroup_1, task.status); });
                            previousLiveTask = liveTasks[liveTasks.length - 1];
                            newTask.startTime = previousLiveTask
                                ? previousLiveTask.endTime
                                : moment(job.onsiteTime).format("HH:mm");
                            newTask.endTime = moment(newTask.startTime, "HH:mm")
                                .add(ruleGroup_1.intervalInMinutes, "minutes") // todo: business rule
                                .format("HH:mm");
                            job.tasks.push(newTask);
                            this.updateAdvise(job, job.tasks[0]);
                            return [2 /*return*/, this._jobService.setJobNoAccessed(job)
                                    .then(function () { return _this._dataStateManager.updatePropertySafetyDataState(job); })
                                    .then(function () { return _this._jobService.setJob(job); })
                                    .catch(function (err) {
                                    throw new businessException_1.BusinessException(_this, "createTask", "error creating task", null, err);
                                })];
                        case 3: throw new businessException_1.BusinessException(this, "createTask", "no current job selected", null, null);
                    }
                });
            });
        };
        TaskService.prototype.updateTaskTimes = function (jobId, taskTimes) {
            return __awaiter(this, void 0, void 0, function () {
                var job;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._jobService.getJob(jobId)];
                        case 1:
                            job = _a.sent();
                            if (!job) return [3 /*break*/, 3];
                            job.tasks.forEach(function (task) {
                                var time = taskTimes.find(function (x) { return x.id === task.id; });
                                if (time) {
                                    task.startTime = time.startTime;
                                    task.endTime = time.endTime;
                                    task.workDuration = time.workDuration;
                                    task.chargeableTime = time.chargeableTime;
                                }
                            });
                            return [4 /*yield*/, this._jobService.setJob(job)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3: throw new businessException_1.BusinessException(this, "updateTaskTimes", "no current job selected", null, null);
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        TaskService.prototype.saveTask = function (jobId, updatedTask) {
            return __awaiter(this, void 0, void 0, function () {
                var job, task, taskItemRules, previouslyIsLive, currentlyIsLive, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._jobService.getJob(jobId)];
                        case 1:
                            job = _a.sent();
                            if (!job) {
                                throw new businessException_1.BusinessException(this, "saveTask", "no current job selected", null, null);
                            }
                            task = job.tasks.find(function (x) { return x.id === updatedTask.id; });
                            task.report = updatedTask.report;
                            task.chirpCodes = updatedTask.chirpCodes;
                            task.workedOnCode = updatedTask.workedOnCode;
                            task.activity = updatedTask.activity;
                            task.productGroup = updatedTask.productGroup;
                            task.partType = updatedTask.partType;
                            task.faultActionCode = updatedTask.faultActionCode;
                            task.endTime = updatedTask.endTime;
                            task.startTime = updatedTask.startTime;
                            task.workDuration = updatedTask.workDuration;
                            task.chargeableTime = updatedTask.chargeableTime;
                            task.dataState = updatedTask.dataState;
                            task.isPartLJReportable = updatedTask.isPartLJReportable;
                            return [4 /*yield*/, this._businessRulesService.getRuleGroup("taskItem")];
                        case 2:
                            taskItemRules = _a.sent();
                            previouslyIsLive = !taskBusinessRuleHelper_1.TaskBusinessRuleHelper.isNotDoingTaskStatus(taskItemRules, task.status);
                            currentlyIsLive = !taskBusinessRuleHelper_1.TaskBusinessRuleHelper.isNotDoingTaskStatus(taskItemRules, updatedTask.status);
                            task.status = updatedTask.status;
                            task.isFirstVisit = updatedTask.isFirstVisit;
                            task.showMainPartSelectedWithInvalidActivityTypeMessage = updatedTask.showMainPartSelectedWithInvalidActivityTypeMessage;
                            task.showMainPartSelectedWithInvalidProductGroupTypeMessage = updatedTask.showMainPartSelectedWithInvalidProductGroupTypeMessage;
                            task.showMainPartSelectedWithInvalidPartTypeMessage = updatedTask.showMainPartSelectedWithInvalidPartTypeMessage;
                            task.hasMainPart = updatedTask.hasMainPart;
                            task.mainPartPartType = updatedTask.mainPartPartType;
                            this.updateAdvise(job, updatedTask);
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 12, , 13]);
                            // only one task can actively noAccess a job
                            task.isTaskThatSetsJobAsNoAccessed = !job.tasks.some(function (t) { return t.id !== updatedTask.id && t.isTaskThatSetsJobAsNoAccessed; })
                                && taskBusinessRuleHelper_1.TaskBusinessRuleHelper.isNotDoingJobStatus(taskItemRules, updatedTask.status);
                            task.isNotDoingTask = !currentlyIsLive;
                            return [4 /*yield*/, this._jobService.setJobNoAccessed(job)];
                        case 4:
                            _a.sent();
                            if (!(previouslyIsLive && !currentlyIsLive)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.removeTaskFromTimeLine(task, job)];
                        case 5:
                            _a.sent();
                            return [3 /*break*/, 8];
                        case 6:
                            if (!(!previouslyIsLive && currentlyIsLive || task.isTaskThatSetsJobAsNoAccessed)) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.rebuildTaskTimes(job)];
                        case 7:
                            _a.sent();
                            _a.label = 8;
                        case 8:
                            this.checkLandlordJob(job);
                            return [4 /*yield*/, this.populateAppointment(job)];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, this._dataStateManager.updateAppliancesDataState(job)];
                        case 10:
                            _a.sent();
                            this._dataStateManager.updatePropertySafetyDataState(job);
                            return [4 /*yield*/, this._jobService.setJob(job)];
                        case 11:
                            _a.sent();
                            return [3 /*break*/, 13];
                        case 12:
                            error_2 = _a.sent();
                            throw new businessException_1.BusinessException(this, "saveTask", "error saving task detail", null, error_2);
                        case 13: return [2 /*return*/];
                    }
                });
            });
        };
        TaskService.prototype.buildReinstatedTaskTimes = function (currentTask, jobId) {
            return __awaiter(this, void 0, void 0, function () {
                var job, ruleGroup, liveTasks, previousSiblings, subsequentSiblings, previousSibling, subsequentSibling, startTime;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._jobService.getJob(jobId)];
                        case 1:
                            job = _a.sent();
                            return [4 /*yield*/, this._businessRulesService.getRuleGroup("taskItem")];
                        case 2:
                            ruleGroup = _a.sent();
                            liveTasks = job.tasks.filter(function (task) { return !taskBusinessRuleHelper_1.TaskBusinessRuleHelper.isNotDoingTaskStatus(ruleGroup, task.status); });
                            previousSiblings = liveTasks.filter(function (liveTask) { return liveTask.orderNo < currentTask.orderNo; });
                            subsequentSiblings = liveTasks.filter(function (liveTask) { return liveTask.orderNo > currentTask.orderNo; });
                            previousSibling = previousSiblings[previousSiblings.length - 1];
                            subsequentSibling = subsequentSiblings[0];
                            startTime = previousSibling
                                ? previousSibling.endTime
                                : subsequentSibling
                                    ? subsequentSibling.startTime
                                    : moment(job.onsiteTime).format("HH:mm");
                            return [2 /*return*/, {
                                    startTime: startTime,
                                    endTime: this.addMinutes(startTime, 1),
                                    workDuration: 1,
                                    chargeableTime: 1
                                }];
                    }
                });
            });
        };
        // todo: refator signature
        TaskService.prototype.rebuildTaskTimes = function (job) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var ruleGroup, liveTasks;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._businessRulesService.getRuleGroup("taskItem")];
                        case 1:
                            ruleGroup = _a.sent();
                            liveTasks = job.tasks.filter(function (task) { return !taskBusinessRuleHelper_1.TaskBusinessRuleHelper.isNotDoingTaskStatus(ruleGroup, task.status); });
                            liveTasks.forEach(function (task, index, tasks) {
                                task.startTime = tasks[index - 1] && tasks[index - 1].endTime || moment(job.onsiteTime).format("HH:mm");
                                task.endTime = _this.addMinutes(task.startTime, task.workDuration || 1);
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        TaskService.prototype.removeTaskFromTimeLine = function (removedTask, job) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var ruleGroup, otherLiveSiblings, laterSiblings, adjustedSibling;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._businessRulesService.getRuleGroup("taskItem")];
                        case 1:
                            ruleGroup = _a.sent();
                            otherLiveSiblings = job.tasks
                                .filter(function (task) { return task.id !== removedTask.id
                                && !taskBusinessRuleHelper_1.TaskBusinessRuleHelper.isNotDoingTaskStatus(ruleGroup, task.status); });
                            laterSiblings = otherLiveSiblings.filter(function (liveTask) { return liveTask.orderNo > removedTask.orderNo; });
                            laterSiblings.forEach(function (laterSibling) {
                                laterSibling.startTime = _this.addMinutes(laterSibling.startTime, -1 * removedTask.workDuration);
                                laterSibling.endTime = _this.addMinutes(laterSibling.endTime, -1 * removedTask.workDuration);
                            });
                            // todo: difficult to use undefined for time values that are bound to timeRangePicker because that will default the times to 00:00
                            //  by the time the user leaves the page
                            removedTask.startTime = "00:00";
                            removedTask.endTime = "00:00";
                            removedTask.workDuration = 0;
                            removedTask.chargeableTime = 0;
                            // edge case: for the slider to remain sane, we must have at least one minute on a multi-visit job.
                            //  for this edge case to kick in we must be deleting/XBing the only task on the job which has minutes,
                            //  and all the others have to have 0 at the time of deleting
                            if (otherLiveSiblings.length && otherLiveSiblings.every(function (sibling) { return !sibling.workDuration; })) {
                                adjustedSibling = otherLiveSiblings[otherLiveSiblings.length - 1];
                                adjustedSibling.workDuration = 1;
                                adjustedSibling.chargeableTime = 1;
                                adjustedSibling.endTime = this.addMinutes(adjustedSibling.endTime, 1);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        TaskService.prototype.addMinutes = function (time, minutesToAdd) {
            // todo: centralise this somewhere else in one of the helpers
            return moment(time, "HH:mm")
                .add(minutesToAdd, "minutes")
                .format("HH:mm");
        };
        TaskService.prototype.checkLandlordJob = function (job) {
            if (job.isLandlordJob && !job_1.Job.isLandlordJob(job)) {
                // we are transitioning out of a landlord job
                job.isLandlordJob = false;
                // only if there remains a task that is to be done do we alert the user, i.e. if we only have one
                //  task and that is the landlord task, and the user is cancelling that task, then the job is over
                //  so no point notifying
                if (job.tasks.some(function (task) { return !task.isNotDoingTask; })) {
                    this._eventAggregator.publish(uiConstants_1.UiConstants.TOAST_ADDED, {
                        id: guid_1.Guid.newGuid(),
                        title: "Landlord Job",
                        style: "warning",
                        content: "Job " + job.id + " is NO LONGER a landlord inspection job.",
                        dismissTime: 0
                    });
                }
            }
            else if (job.wasOriginallyLandlordJob && !job.isLandlordJob && job_1.Job.isLandlordJob(job)) {
                // we are transitioning in to a landlord job
                // edge case: gasMeterInstallationSatisfactory = "N/A" is not valid for landlord jobs
                if (job.propertySafetyType === propertySafetyType_1.PropertySafetyType.gas
                    && job.propertySafety
                    && job.propertySafety.propertyGasSafetyDetail
                    && job.propertySafety.propertyGasSafetyDetail.gasMeterInstallationSatisfactory === "N/A") {
                    job.propertySafety.propertyGasSafetyDetail.gasMeterInstallationSatisfactory = undefined;
                }
                job.isLandlordJob = true;
                this._eventAggregator.publish(uiConstants_1.UiConstants.TOAST_ADDED, {
                    id: guid_1.Guid.newGuid(),
                    title: "Landlord Job",
                    style: "warning",
                    content: "Job " + job.id + " has been reinstated as a landlord inspection job.",
                    dismissTime: 0
                });
            }
        };
        TaskService.prototype.updateAdvise = function (job, task) {
            // customer advise on both tasks needs to be replicated.
            // ref: DF_916
            job.tasks.map(function (t) {
                t.adviceCode = task.adviceCode;
                t.adviceComment = task.adviceComment;
                t.adviceOutcome = task.adviceOutcome;
            });
        };
        TaskService.prototype.populateAppointment = function (job) {
            return Promise.all([
                this._businessRulesService.getQueryableRuleGroup("taskItem"),
                this._businessRulesService.getQueryableRuleGroup("appointmentBooking")
            ])
                .then(function (_a) {
                var taskItemRuleGroup = _a[0], appointmentBookingRuleGroup = _a[1];
                var appointmentAllowedActivityStatus = appointmentBookingRuleGroup.getBusinessRule("appointmentAllowedActivityStatus").split(",");
                // defect DF-1372
                if (job.appointment) {
                    var appointmentRequired = job.tasks.some(function (task) { return appointmentAllowedActivityStatus.some(function (status) { return task.status === status; }); });
                    if (!appointmentRequired) {
                        job.appointment = undefined;
                    }
                    else {
                        // remove all completed, cancelled or deleted tasks
                        var deletedTaskIds = job.appointment.estimatedDurationOfAppointment
                            .filter(function (e) { return !job.tasks.some(function (t) { return t.id === e.taskId; }); })
                            .map(function (e) { return e.taskId; });
                        var completedOrCancelledActivityStatuses_1 = taskItemRuleGroup.getBusinessRule("completedOrCancelledActivityStatuses").split(",");
                        var completedOrCancelledTaskIds = job.tasks
                            .filter(function (task) { return completedOrCancelledActivityStatuses_1.some(function (status) { return task.status === status; }); })
                            .map(function (task) { return task.id; });
                        deletedTaskIds.concat(completedOrCancelledTaskIds).forEach(function (taskIdToRemove) {
                            var taskAppointmentIndex = job.appointment.estimatedDurationOfAppointment.findIndex(function (a) { return a.taskId === taskIdToRemove; });
                            if (taskAppointmentIndex >= 0) {
                                job.appointment.estimatedDurationOfAppointment.splice(taskAppointmentIndex, 1);
                            }
                        });
                    }
                }
            });
        };
        TaskService = __decorate([
            aurelia_framework_1.inject(jobService_1.JobService, businessRuleService_1.BusinessRuleService, dataStateManager_1.DataStateManager, partService_1.PartService, aurelia_event_aggregator_1.EventAggregator),
            __metadata("design:paramtypes", [Object, Object, Object, Object, aurelia_event_aggregator_1.EventAggregator])
        ], TaskService);
        return TaskService;
    }());
    exports.TaskService = TaskService;
});

//# sourceMappingURL=taskService.js.map
