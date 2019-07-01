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
define(["require", "exports", "aurelia-logging", "aurelia-framework", "../../api/services/fftService", "../models/job", "../models/businessException", "./stateMachine/stateMachine", "../models/jobState", "./stateMachine/state", "aurelia-event-aggregator", "../models/dataStateSummary", "./constants/workRetrievalServiceConstants", "./constants/jobServiceConstants", "./engineerService", "../factories/jobFactory", "../../core/dateHelper", "./jobCacheService", "./catalogService", "../services/businessRuleService", "../factories/partFactory", "./archiveService", "../models/dataState", "../models/businessRules/taskBusinessRuleHelper", "moment", "../../../common/core/threading", "../../../common/core/objectHelper", "./vanStockService", "./featureToggleService", "../../../appConstants", "../../../common/core/guid"], function (require, exports, Logging, aurelia_framework_1, fftService_1, job_1, businessException_1, stateMachine_1, jobState_1, state_1, aurelia_event_aggregator_1, dataStateSummary_1, workRetrievalServiceConstants_1, jobServiceConstants_1, engineerService_1, jobFactory_1, dateHelper_1, jobCacheService_1, catalogService_1, businessRuleService_1, partFactory_1, archiveService_1, dataState_1, taskBusinessRuleHelper_1, moment, threading_1, objectHelper_1, vanStockService_1, featureToggleService_1, appConstants_1, guid_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JobService = /** @class */ (function () {
        function JobService(engineerService, fftService, jobFactory, jobCacheService, eventAggregator, catalogService, businessRuleService, partFactory, archiveService, vanStockService, featureToggleService) {
            this._engineerService = engineerService;
            this._fftService = fftService;
            this._jobFactory = jobFactory;
            this._jobCacheService = jobCacheService;
            this._eventAggregator = eventAggregator;
            this._businessRuleService = businessRuleService;
            this._partFactory = partFactory;
            this._archiveService = archiveService;
            this._vanStockService = vanStockService;
            this._featureToggleService = featureToggleService;
            this._stateMachine = new stateMachine_1.StateMachine([
                new state_1.State(jobState_1.JobState.idle, "Idle", [jobState_1.JobState.enRoute]),
                new state_1.State(jobState_1.JobState.enRoute, "Go en-route", [jobState_1.JobState.arrived, jobState_1.JobState.deSelect]),
                new state_1.State(jobState_1.JobState.deSelect, "De-select", [jobState_1.JobState.enRoute]),
                new state_1.State(jobState_1.JobState.arrived, "Arrive", [jobState_1.JobState.complete]),
                new state_1.State(jobState_1.JobState.complete, "Complete", [jobState_1.JobState.done]),
                new state_1.State(jobState_1.JobState.done, "Done", [])
            ]);
            this._logger = Logging.getLogger("JobService");
            this._isReVisitTabsAlreadyDone = false;
        }
        JobService.prototype.getJobsToDo = function () {
            return this._jobCacheService.getJobsToDo();
        };
        JobService.prototype.getWorkListJobApiFailures = function () {
            return this._jobCacheService.getWorkListJobApiFailures();
        };
        JobService.prototype.getPartsCollections = function () {
            return this._jobCacheService.getPartsCollections();
        };
        JobService.prototype.completePartsCollections = function () {
            return __awaiter(this, void 0, void 0, function () {
                var partsCollections;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getPartsCollections()];
                        case 1:
                            partsCollections = (_a.sent()) || [];
                            partsCollections.forEach(function (partsCollection) { return partsCollection.done = true; });
                            return [4 /*yield*/, this._jobCacheService.setPartsCollections(partsCollections)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        JobService.prototype.getJob = function (id) {
            return this._jobCacheService.getJob(id);
        };
        JobService.prototype.setJob = function (job) {
            return this._jobCacheService.setJob(job);
        };
        JobService.prototype.getActiveJobId = function () {
            return this.getActiveJob()
                .then(function (activeJob) {
                return activeJob ? activeJob.id : null;
            });
        };
        JobService.prototype.isJobEditable = function (jobId) {
            return this.getJob(jobId)
                .then(function (job) {
                return job ? job.state === jobState_1.JobState.arrived : false;
            });
        };
        JobService.prototype.areAllJobsDone = function () {
            return this.getJobsToDo()
                .then(function (jobs) {
                if (jobs && jobs.length > 0) {
                    var res = jobs.some(function (j) { return j.state !== jobState_1.JobState.done; });
                    return !res;
                }
                else {
                    return true;
                }
            });
        };
        JobService.prototype.getJobState = function (jobId) {
            var _this = this;
            return this.getJob(jobId)
                .then(function (job) {
                if (job) {
                    return _this._stateMachine.lookupState(job.state);
                }
                else {
                    throw new businessException_1.BusinessException(_this, "getJobState.notFound", "Job not found '{0}'", [jobId], null);
                }
            });
        };
        JobService.prototype.getJobTargetStates = function (jobId) {
            var _this = this;
            return this.getJob(jobId)
                .then(function (job) {
                if (job) {
                    return _this._stateMachine.getTargetStates(job.state);
                }
                else {
                    throw new businessException_1.BusinessException(_this, "getJobTargetStates.notFound", "Job not found '{0}'", [jobId], null);
                }
            });
        };
        JobService.prototype.setJobState = function (jobId, newState) {
            return __awaiter(this, void 0, void 0, function () {
                var job, _a, taskItemRuleGroup, intervalInMinutes;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.getJob(jobId)];
                        case 1:
                            job = _b.sent();
                            if (!this._stateMachine.trySetState(job.state, newState)) {
                                throw new businessException_1.BusinessException(this, "setJobState.trySetState", "Unable to set the state to '{0}' for job '{1}'", [newState, jobId], null);
                            }
                            job.state = newState;
                            _a = job.state;
                            switch (_a) {
                                case jobState_1.JobState.idle: return [3 /*break*/, 2];
                                case jobState_1.JobState.arrived: return [3 /*break*/, 3];
                                case jobState_1.JobState.enRoute: return [3 /*break*/, 5];
                                case jobState_1.JobState.deSelect: return [3 /*break*/, 6];
                                case jobState_1.JobState.complete: return [3 /*break*/, 7];
                            }
                            return [3 /*break*/, 8];
                        case 2:
                            job.onsiteTime = new Date();
                            return [3 /*break*/, 8];
                        case 3:
                            job.onsiteTime = new Date();
                            job.completionTime = null;
                            return [4 /*yield*/, this._businessRuleService.getQueryableRuleGroup("taskItem")];
                        case 4:
                            taskItemRuleGroup = _b.sent();
                            intervalInMinutes = taskItemRuleGroup.getBusinessRule("intervalInMinutes");
                            this.initTaskTimes(job, intervalInMinutes);
                            return [3 /*break*/, 8];
                        case 5:
                            job.enrouteTime = new Date();
                            job.onsiteTime = null;
                            job.completionTime = null;
                            return [3 /*break*/, 8];
                        case 6:
                            job.cancellationTime = new Date();
                            job.onsiteTime = null;
                            job.completionTime = null;
                            job.state = jobState_1.JobState.idle;
                            return [3 /*break*/, 8];
                        case 7:
                            job.completionTime = new Date();
                            /* if the job has been completed then we will post the data back with no status update
                                so return the state machine to idle
                                */
                            job.state = jobState_1.JobState.done;
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/, this.jobCompletion(job, job.state === jobState_1.JobState.done)];
                    }
                });
            });
        };
        JobService.prototype.getDataStateSummary = function (jobId) {
            var _this = this;
            return this.getJob(jobId)
                .then(function (job) {
                // dataStateCompletionOverrideGroup not getting updated when relaunching the app (set activity status to noaccess and relaunch the app)
                // the below code fixes the data state issue
                var p = Promise.resolve();
                if (!!job.jobNotDoingReason && !dataStateSummary_1.DataStateSummary.dataStateCompletionOverrideGroup && job.state === jobState_1.JobState.arrived) {
                    p = _this.setJobNoAccessed(job);
                }
                return p.then(function () {
                    return new dataStateSummary_1.DataStateSummary(job);
                });
            })
                .catch(function () {
                return null;
            });
        };
        JobService.prototype.requiresAppointment = function (jobId) {
            var _this = this;
            return this._businessRuleService.getQueryableRuleGroup("taskItem")
                .then(function (ruleGroup) {
                var visitStatuses = ruleGroup.getBusinessRuleList("appointmentRequiredActivityStatus");
                return _this.getJob(jobId).then(function (job) {
                    if (!job) {
                        return false;
                    }
                    for (var i = 0; i < job.tasks.length; i++) {
                        if (job.tasks[i] && job.tasks[i].status) {
                            if (visitStatuses.indexOf(job.tasks[i].status) > -1) {
                                if (!job.appointment) {
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                });
            });
        };
        JobService.prototype.setJobNoAccessed = function (job) {
            return __awaiter(this, void 0, void 0, function () {
                var isATaskSetAsNoAccessed, areAllTasksSetAsCancelled, areTasksSayingWeAreNoAccessed, isTransitionIntoNoAccess, isTransitionOutOfNoAccess, noAccessingTask_1, otherTasks, taskBusinessRules_1, remainingNoAccessStatusTasks;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            isATaskSetAsNoAccessed = job.tasks.some(function (task) { return task.isTaskThatSetsJobAsNoAccessed; });
                            areAllTasksSetAsCancelled = job.tasks.every(function (task) { return task.isNotDoingTask; });
                            areTasksSayingWeAreNoAccessed = isATaskSetAsNoAccessed || areAllTasksSetAsCancelled;
                            isTransitionIntoNoAccess = areTasksSayingWeAreNoAccessed;
                            isTransitionOutOfNoAccess = job.jobNotDoingReason && !areTasksSayingWeAreNoAccessed;
                            if (isTransitionIntoNoAccess && isATaskSetAsNoAccessed) {
                                noAccessingTask_1 = job.tasks.find(function (task) { return task.isTaskThatSetsJobAsNoAccessed; });
                                otherTasks = job.tasks.filter(function (task) { return task !== noAccessingTask_1; });
                                otherTasks.forEach(function (otherTask) {
                                    otherTask.status = noAccessingTask_1.status;
                                    otherTask.dataState = dataState_1.DataState.dontCare;
                                });
                                job.cancellationTime = new Date();
                            }
                            if (!isTransitionOutOfNoAccess) return [3 /*break*/, 2];
                            return [4 /*yield*/, this._businessRuleService.getRuleGroup("taskItem")];
                        case 1:
                            taskBusinessRules_1 = _a.sent();
                            remainingNoAccessStatusTasks = job.tasks.filter(function (task) { return taskBusinessRuleHelper_1.TaskBusinessRuleHelper.isNotDoingJobStatus(taskBusinessRules_1, task.status); });
                            remainingNoAccessStatusTasks.forEach(function (task) {
                                task.status = undefined;
                                task.dataState = dataState_1.DataState.notVisited;
                            });
                            _a.label = 2;
                        case 2:
                            job.jobNotDoingReason = isATaskSetAsNoAccessed ? 1 /* taskNoAccessed */
                                : areAllTasksSetAsCancelled ? 2 /* allTasksCancelled */
                                    : undefined;
                            if (job.jobNotDoingReason) {
                                dataStateSummary_1.DataStateSummary.dataStateCompletionOverrideGroup = "activities";
                            }
                            else {
                                dataStateSummary_1.DataStateSummary.clearDataStateCompletionOverrideGroup();
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        JobService.prototype.checkIfJobFinishTimeNeedsToBeUpdated = function () {
            return __awaiter(this, void 0, void 0, function () {
                var job, businessRules, jobDoingStatuses, activeTasks, jobEndTimeInDate, durationDiffInMins;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getActiveJob()];
                        case 1:
                            job = _a.sent();
                            return [4 /*yield*/, this._businessRuleService.getQueryableRuleGroup("jobService")];
                        case 2:
                            businessRules = _a.sent();
                            jobDoingStatuses = businessRules.getBusinessRule("jobDoingStatuses");
                            activeTasks = job.tasks.filter(function (task) { return jobDoingStatuses.indexOf(task.status) > -1; });
                            if (activeTasks.length) {
                                jobEndTimeInDate = dateHelper_1.DateHelper.getDate(activeTasks[activeTasks.length - 1].endTime);
                                durationDiffInMins = dateHelper_1.DateHelper.getTimeDiffInMins(new Date(), jobEndTimeInDate);
                                return [2 /*return*/, durationDiffInMins >= jobServiceConstants_1.JobServiceConstants.JOB_FINISH_TIME_DIFF_MAX_IN_MINS];
                            }
                            return [2 /*return*/, false];
                    }
                });
            });
        };
        JobService.prototype.initTaskTimes = function (job, intervalInMinutes) {
            job.tasks.forEach(function (task, index, tasks) {
                task.startTime = index === 0
                    ? moment(job.onsiteTime)
                        .format("HH:mm")
                    : tasks[index - 1].endTime;
                task.endTime = moment(task.startTime, "HH:mm")
                    .add(intervalInMinutes, "minutes")
                    .format("HH:mm");
                task.workDuration = intervalInMinutes;
                task.chargeableTime = intervalInMinutes;
            });
        };
        JobService.prototype.getActiveJob = function () {
            return this.getJobsToDo()
                .then(function (jobs) { return jobs && jobs.find(function (job) { return job_1.Job.isActive(job); }); });
        };
        JobService.prototype.jobCompletion = function (job, isFullCompletion) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var jobFactoryBusinessRules, engineer, canThisJobBeCompleted, everyTaskIsVo, buildJobStatusUpdateRequest, buildPartsOrderRequest, buildJobUpdateRequest, buildMaterialConsumedRequest, sendJobStatusUpdate, sendPartsRequest, sendJobUpdate, sendMaterialConsumption, sendMaterialReturn, saveJob, publishJobStateChangedEvent, saveArchive, sendEventsAndResetDataState, jobStatusUpdateRequest, partsReqeust, jobUpdateRequest, materialConsumedRequest, content;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._businessRuleService.getQueryableRuleGroup("jobFactory")];
                        case 1:
                            jobFactoryBusinessRules = _a.sent();
                            return [4 /*yield*/, this._engineerService.getCurrentEngineer()];
                        case 2:
                            engineer = _a.sent();
                            canThisJobBeCompleted = true;
                            everyTaskIsVo = job.tasks
                                .every(function (task) { return task.status === jobFactoryBusinessRules.getBusinessRule("NotVisitedOtherActivityStatus"); });
                            buildJobStatusUpdateRequest = function () { return __awaiter(_this, void 0, void 0, function () {
                                var statusCode, reason, error_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, this._jobFactory.getJobStatusCode(job)];
                                        case 1:
                                            statusCode = _a.sent();
                                            if (!statusCode) {
                                                // only hit API if we have transitioned to a "real" status code, not "internal working" etc
                                                return [2 /*return*/, undefined];
                                            }
                                            reason = statusCode === jobFactoryBusinessRules.getBusinessRule("statusNoVisit")
                                                ? job.tasks.filter(function (task) { return task.status === jobFactoryBusinessRules.getBusinessRule("NotVisitedOtherActivityStatus")
                                                    && task.report; })[0].report || ""
                                                : "";
                                            return [2 /*return*/, {
                                                    data: {
                                                        timestamp: dateHelper_1.DateHelper.toJsonDateTimeString(new Date()),
                                                        statusCode: statusCode,
                                                        jobId: job.id,
                                                        visitId: job.visit && job.visit.id,
                                                        reason: reason
                                                    }
                                                }];
                                        case 2:
                                            error_1 = _a.sent();
                                            this._logger.error("Error building job status update", error_1 && error_1.toString());
                                            return [2 /*return*/, undefined];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); };
                            buildPartsOrderRequest = function () { return __awaiter(_this, void 0, void 0, function () {
                                var request, _a, error_2;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _b.trys.push([0, 3, , 4]);
                                            _a = !job.jobNotDoingReason;
                                            if (!_a) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this._partFactory.createPartsOrderedForTask(job)];
                                        case 1:
                                            _a = (_b.sent());
                                            _b.label = 2;
                                        case 2:
                                            request = _a;
                                            return [2 /*return*/, request && request.tasks && request.tasks.length
                                                    ? request
                                                    : undefined];
                                        case 3:
                                            error_2 = _b.sent();
                                            this._logger.error("Error building job parts order update", error_2 && error_2.toString());
                                            return [2 /*return*/, undefined];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); };
                            buildJobUpdateRequest = function () { return __awaiter(_this, void 0, void 0, function () {
                                var originalJob, jobUpdate, stringsToRetain, error_3;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 3, , 4]);
                                            if (everyTaskIsVo) {
                                                return [2 /*return*/, undefined];
                                            }
                                            return [4 /*yield*/, this._jobCacheService.getWorkListJobs()];
                                        case 1:
                                            originalJob = (_a.sent())
                                                .find(function (o) { return job.id === o.id; });
                                            return [4 /*yield*/, this._jobFactory.createJobApiModel(job, engineer, originalJob)];
                                        case 2:
                                            jobUpdate = _a.sent();
                                            stringsToRetain = objectHelper_1.ObjectHelper.getAllStringsFromObject(originalJob);
                                            objectHelper_1.ObjectHelper.sanitizeObjectStringsForJobUpdate(jobUpdate, stringsToRetain);
                                            return [2 /*return*/, jobUpdate];
                                        case 3:
                                            error_3 = _a.sent();
                                            this._logger.error("Error building job update", error_3);
                                            canThisJobBeCompleted = false;
                                            return [2 /*return*/, undefined];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); };
                            buildMaterialConsumedRequest = function () { return __awaiter(_this, void 0, void 0, function () {
                                var _a, error_4;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _b.trys.push([0, 4, , 5]);
                                            if (!(!!this._featureToggleService.isAssetTrackingEnabled() && !job.jobNotDoingReason)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this._partFactory.getPartsConsumedOnJob(job)];
                                        case 1:
                                            _a = _b.sent();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            _a = undefined;
                                            _b.label = 3;
                                        case 3: return [2 /*return*/, _a];
                                        case 4:
                                            error_4 = _b.sent();
                                            this._logger.error("Error building material consumption request", error_4 && error_4.toString());
                                            return [2 /*return*/, undefined];
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            }); };
                            sendJobStatusUpdate = function (request) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            this._logger.info("jobStatusUpdate", { data: request });
                                            return [4 /*yield*/, this._fftService.jobStatusUpdate(job.id, request)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                            sendPartsRequest = function (request) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            this._logger.info("partsOrder", { data: request });
                                            return [4 /*yield*/, this._fftService.orderPartsForJob(job.id, { data: request })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                            sendJobUpdate = function (request) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            this._logger.info("jobUpdate", { data: request });
                                            return [4 /*yield*/, this._fftService.updateJob(job.id, { data: request })];
                                        case 1:
                                            _a.sent();
                                            this._eventAggregator.publish(jobServiceConstants_1.JobServiceConstants.JOB_COMPLETED, request);
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                            sendMaterialConsumption = function (partsConsumed) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    try {
                                        if (!!partsConsumed.length) {
                                            partsConsumed.forEach(function (part) { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, this._vanStockService.registerMaterialConsumption({
                                                                stockReferenceId: part.stockReferenceId,
                                                                quantityConsumed: part.quantityConsumed,
                                                                jobId: part.isVanStock ? undefined : job.id
                                                            })];
                                                        case 1: return [2 /*return*/, _a.sent()];
                                                    }
                                                });
                                            }); });
                                        }
                                    }
                                    catch (error) {
                                        this._logger.error("material consumption call failed", error && error.toSting());
                                    }
                                    return [2 /*return*/];
                                });
                            }); };
                            sendMaterialReturn = function (jobUpdate) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                var returnedParts;
                                return __generator(this, function (_a) {
                                    try {
                                        if (!this._featureToggleService.isAssetTrackingEnabled() || !!job.jobNotDoingReason) {
                                            return [2 /*return*/];
                                        }
                                        returnedParts = (jobUpdate && jobUpdate.job && jobUpdate.job.tasks || [])
                                            .map(function (task) { return task && task.partsNotUsed || []; })
                                            .reduce(function (acc, curr) { return acc.concat(curr); }, [])
                                            .map(function (part) { return ({
                                            stockReferenceId: part.stockReferenceId,
                                            quantityReturned: part.quantityNotUsed,
                                            jobId: job.id,
                                            reason: part.reasonCode
                                        }); });
                                        returnedParts.forEach(function (part) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, this._vanStockService.registerMaterialReturn(part)];
                                                case 1: return [2 /*return*/, _a.sent()];
                                            }
                                        }); }); });
                                    }
                                    catch (error) {
                                        this._logger.error("material return call failed", error && error.toSting());
                                    }
                                    return [2 /*return*/];
                                });
                            }); };
                            saveJob = function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            this._logger.info("saving job");
                                            return [4 /*yield*/, this._jobCacheService.setJob(job)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                            publishJobStateChangedEvent = function () {
                                _this._eventAggregator.publish(jobServiceConstants_1.JobServiceConstants.JOB_STATE_CHANGED);
                            };
                            saveArchive = function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this._archiveService.addUpdateJobState(job, engineer, jobState_1.JobState.complete)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                            sendEventsAndResetDataState = function (jobUpdate) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                var businessRules, delay;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            dataStateSummary_1.DataStateSummary.clearDataStateCompletionOverrideGroup();
                                            this._eventAggregator.publish(jobServiceConstants_1.JobServiceConstants.JOB_COMPLETION_REFRESH, true);
                                            return [4 /*yield*/, this._businessRuleService.getQueryableRuleGroup("jobService")];
                                        case 1:
                                            businessRules = _a.sent();
                                            delay = businessRules.getBusinessRule("jobCompleteRefreshDelayMs") || 5000;
                                            threading_1.Threading.delay(function () { return _this._eventAggregator.publish(workRetrievalServiceConstants_1.WorkRetrievalServiceConstants.REQUEST_WORK_AND_REFRESH_WORK_LIST); }, delay);
                                            this._isReVisitTabsAlreadyDone = false;
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                            return [4 /*yield*/, buildJobStatusUpdateRequest()];
                        case 3:
                            jobStatusUpdateRequest = _a.sent();
                            if (!!isFullCompletion) return [3 /*break*/, 6];
                            if (!jobStatusUpdateRequest) return [3 /*break*/, 5];
                            return [4 /*yield*/, sendJobStatusUpdate(jobStatusUpdateRequest)];
                        case 4:
                            _a.sent();
                            saveJob();
                            publishJobStateChangedEvent();
                            _a.label = 5;
                        case 5: return [2 /*return*/];
                        case 6: return [4 /*yield*/, buildPartsOrderRequest()];
                        case 7:
                            partsReqeust = _a.sent();
                            return [4 /*yield*/, buildJobUpdateRequest()];
                        case 8:
                            jobUpdateRequest = _a.sent();
                            if (!canThisJobBeCompleted) return [3 /*break*/, 22];
                            if (!jobStatusUpdateRequest) return [3 /*break*/, 10];
                            return [4 /*yield*/, sendJobStatusUpdate(jobStatusUpdateRequest)];
                        case 9:
                            _a.sent();
                            _a.label = 10;
                        case 10:
                            if (!partsReqeust) return [3 /*break*/, 12];
                            return [4 /*yield*/, sendPartsRequest(partsReqeust)];
                        case 11:
                            _a.sent();
                            _a.label = 12;
                        case 12:
                            if (!jobUpdateRequest) return [3 /*break*/, 15];
                            return [4 /*yield*/, sendJobUpdate(jobUpdateRequest)];
                        case 13:
                            _a.sent();
                            return [4 /*yield*/, sendMaterialReturn(jobUpdateRequest)];
                        case 14:
                            _a.sent();
                            _a.label = 15;
                        case 15: return [4 /*yield*/, buildMaterialConsumedRequest()];
                        case 16:
                            materialConsumedRequest = _a.sent();
                            if (!materialConsumedRequest) return [3 /*break*/, 18];
                            return [4 /*yield*/, sendMaterialConsumption(materialConsumedRequest)];
                        case 17:
                            _a.sent();
                            _a.label = 18;
                        case 18: 
                        // keep save immediatley after we want to know that we have put stuff into resilience before setting the job as done
                        return [4 /*yield*/, saveJob()];
                        case 19:
                            // keep save immediatley after we want to know that we have put stuff into resilience before setting the job as done
                            _a.sent();
                            return [4 /*yield*/, saveArchive()];
                        case 20:
                            _a.sent();
                            publishJobStateChangedEvent();
                            return [4 /*yield*/, sendEventsAndResetDataState(jobUpdateRequest)];
                        case 21:
                            _a.sent();
                            return [3 /*break*/, 23];
                        case 22:
                            content = (!this._isReVisitTabsAlreadyDone)
                                ? "We have detected an issue completing this job."
                                    + " Please revisit all the pages/tabs to ensure if the forms have been filled in correctly and then press Complete button again to retry job completion."
                                : "We have detected an issue sending this job back to WMIS. So please contact help desk for the further assitance and support";
                            this._eventAggregator.publish(appConstants_1.AppConstants.APP_TOAST_ADDED, {
                                id: guid_1.Guid.newGuid(),
                                title: "Job completion",
                                style: "danger",
                                content: content,
                                autoDismiss: false,
                                dismissTime: 0
                            });
                            this._isReVisitTabsAlreadyDone = true;
                            // setting job back to arrived status
                            job.state = jobState_1.JobState.arrived;
                            // this is just close the job completion progress modal popup.
                            this._eventAggregator.publish(jobServiceConstants_1.JobServiceConstants.JOB_COMPLETION_REFRESH, false);
                            // this would set requestedState in state button back to arrived.          
                            publishJobStateChangedEvent();
                            _a.label = 23;
                        case 23: return [2 /*return*/];
                    }
                });
            });
        };
        JobService = __decorate([
            aurelia_framework_1.inject(engineerService_1.EngineerService, fftService_1.FftService, jobFactory_1.JobFactory, jobCacheService_1.JobCacheService, aurelia_event_aggregator_1.EventAggregator, catalogService_1.CatalogService, businessRuleService_1.BusinessRuleService, partFactory_1.PartFactory, archiveService_1.ArchiveService, vanStockService_1.VanStockService, featureToggleService_1.FeatureToggleService),
            __metadata("design:paramtypes", [Object, Object, Object, Object, aurelia_event_aggregator_1.EventAggregator, Object, Object, Object, Object, Object, Object])
        ], JobService);
        return JobService;
    }());
    exports.JobService = JobService;
});

//# sourceMappingURL=jobService.js.map
