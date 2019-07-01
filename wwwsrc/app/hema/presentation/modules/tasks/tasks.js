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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
define(["require", "exports", "aurelia-dialog", "aurelia-event-aggregator", "aurelia-dependency-injection", "aurelia-router", "../../models/editableViewModel", "../../../business/services/businessRuleService", "../../../business/services/catalogService", "../../../business/services/engineerService", "../../../business/services/jobService", "../../../business/services/labelService", "../../../business/services/taskService", "../../factories/taskFactory", "../../../business/services/validationService", "../../../business/services/constants/chargeServiceConstants", "noUiSlider", "wNumb", "../../../business/services/constants/jobServiceConstants", "moment", "aurelia-binding", "../../../../common/core/threading", "../../../core/timeHelper", "../../../business/models/businessRules/taskBusinessRuleHelper"], function (require, exports, aurelia_dialog_1, aurelia_event_aggregator_1, aurelia_dependency_injection_1, aurelia_router_1, editableViewModel_1, businessRuleService_1, catalogService_1, engineerService_1, jobService_1, labelService_1, taskService_1, taskFactory_1, validationService_1, chargeServiceConstants_1, noUiSlider, wNumb, jobServiceConstants_1, moment, aurelia_binding_1, threading_1, timeHelper_1, taskBusinessRuleHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HHMM = "HH:mm";
    var Tasks = /** @class */ (function (_super) {
        __extends(Tasks, _super);
        function Tasks(taskService, jobService, engineerService, router, taskFactory, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService) || this;
            _this._taskService = taskService;
            _this._router = router;
            _this._taskFactory = taskFactory;
            _this.populateColors();
            _this._taskItemBusinessRules = {};
            return _this;
        }
        Tasks.prototype.activateAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this._jobStateChangedSubscription = this._eventAggregator.subscribe(jobServiceConstants_1.JobServiceConstants.JOB_STATE_CHANGED, function () { return _this.reloadTasks() // todo: could we just reload the page?
                                .then(function () { return _this.destroyAndCreateSlider(); }); });
                            return [4 /*yield*/, this.loadCustomBusinessRules()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.reloadTasks()];
                        case 2:
                            _a.sent();
                            this.showContent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        Tasks.prototype.deactivateAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (this._jobStateChangedSubscription) {
                        this._jobStateChangedSubscription.dispose();
                    }
                    return [2 /*return*/];
                });
            });
        };
        Tasks.prototype.attachedAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!this.tasks) return [3 /*break*/, 2];
                            return [4 /*yield*/, Promise.delay(100)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 0];
                        case 2:
                            this.destroyAndCreateSlider();
                            return [2 /*return*/];
                    }
                });
            });
        };
        Tasks.prototype.navigateToTask = function (id) {
            this._router.navigateToRoute("activity", { taskId: id });
        };
        Tasks.prototype.deleteTask = function (event, task) {
            return __awaiter(this, void 0, void 0, function () {
                var result, index, nextTask;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            event.stopPropagation();
                            return [4 /*yield*/, this.showDeleteConfirmation()];
                        case 1:
                            result = _a.sent();
                            if (!result) {
                                return [2 /*return*/];
                            }
                            this.showBusy(this.getLabel("loadingPleaseWait"));
                            index = this._liveTasks.findIndex(function (x) { return x.id === task.id; });
                            return [4 /*yield*/, this.saveModel()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this._taskService.deleteTask(this.jobId, task.id)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.reloadTasks()];
                        case 4:
                            _a.sent();
                            this.showContent();
                            this.destroyAndCreateSlider();
                            nextTask = this._liveTasks[index];
                            this.setChargeTimeChangeTrigger(nextTask);
                            this._eventAggregator.publish(chargeServiceConstants_1.ChargeServiceConstants.CHARGE_UPDATE_START, this.jobId);
                            return [2 /*return*/];
                    }
                });
            });
        };
        Tasks.prototype.newTask = function () {
            this._router.navigateToRoute("task-appliance", { jobId: this.jobId });
        };
        Tasks.prototype.startTimeChanged = function (newStartTime) {
            var _this = this;
            var isValidJobStartTime = function (nextStartTime) { return nextStartTime
                && timeHelper_1.TimeHelper.isAfter(_this._liveTasks[0].endTime, nextStartTime, HHMM); };
            if (!this.showTimeSlider || newStartTime === this._lastKnownStartTime) {
                return;
            }
            threading_1.Threading.nextCycle(function () {
                if (isValidJobStartTime(newStartTime)) {
                    var task = _this._liveTasks[0];
                    task.startTime = _this._lastKnownStartTime = newStartTime;
                    _this.destroyAndCreateSlider();
                    // now check the charge time change trigger becouse the change event wont 
                    // get fired.
                    _this.setChargeTimeChangeTrigger(task);
                }
                else {
                    _this.startTime = _this._lastKnownStartTime;
                }
            });
        };
        Tasks.prototype.endTimeChanged = function (newEndTime) {
            var _this = this;
            var isValidJobEndTime = function (nextEndTime) { return nextEndTime
                && timeHelper_1.TimeHelper.isAfter(nextEndTime, _this._liveTasks[_this._liveTasks.length - 1].startTime, HHMM); };
            if (!this.showTimeSlider || newEndTime === this._lastKnownEndTime) {
                return;
            }
            threading_1.Threading.nextCycle(function () {
                if (isValidJobEndTime(newEndTime)) {
                    var task = _this._liveTasks[_this._liveTasks.length - 1];
                    task.endTime = _this._lastKnownEndTime = newEndTime;
                    _this.destroyAndCreateSlider();
                    // now check the charge time change trigger becouse the change event wont 
                    // get fired.                
                    _this.setChargeTimeChangeTrigger(task);
                }
                else {
                    _this.endTime = _this._lastKnownEndTime;
                }
            });
        };
        Tasks.prototype.saveModel = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.canEdit && this.showTimeSlider)) return [3 /*break*/, 2];
                            if (this._liveTasks.find(function (x) { return x.chargeableTimeChanged; })) {
                                this.showInfo(this.getLabel("activityTimeChangedTitle"), this.getLabel("activityTimeChangedDescription"));
                                this._eventAggregator.publish(chargeServiceConstants_1.ChargeServiceConstants.CHARGE_UPDATE_START, this.jobId);
                            }
                            return [4 /*yield*/, this._taskService.updateTaskTimes(this.jobId, this._liveTasks)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        Tasks.prototype.reloadTasks = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var tasks, job, viewModels;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._taskService.getTasksAndCompletedTasks(this.jobId)];
                        case 1:
                            tasks = _a.sent();
                            return [4 /*yield*/, this._jobService.getJob(this.jobId)];
                        case 2:
                            job = _a.sent();
                            viewModels = tasks.map(function (task) { return (__assign({}, _this._taskFactory.createTaskSummaryViewModel(task), { isInCancellingStatus: !taskBusinessRuleHelper_1.TaskBusinessRuleHelper.isLiveTask(_this._taskItemBusinessRules, task.status) })); });
                            this.tasks = viewModels.filter(function (vm) { return vm.isMiddlewareDoTodayTask; }).concat(viewModels.filter(function (vm) { return !vm.isMiddlewareDoTodayTask; }));
                            this._liveTasks = this.tasks.filter(function (t) { return !t.isInCancellingStatus
                                && t.isMiddlewareDoTodayTask; });
                            this._liveTasks.forEach(function (task, i) { return task.color = _this._taskColors[i]; });
                            if (job.onsiteTime // we have onSiteTime if we have arrived
                                && this._liveTasks.length > 1) {
                                this.showTimeSlider = true;
                                this.startTime = this._lastKnownStartTime = this._liveTasks[0].startTime;
                                this.endTime = this._lastKnownEndTime = this._liveTasks[this._liveTasks.length - 1].endTime;
                            }
                            else {
                                this.showTimeSlider = false;
                            }
                            this.shouldAllowAddTask = job.jobNotDoingReason !== 1 /* taskNoAccessed */;
                            return [2 /*return*/];
                    }
                });
            });
        };
        Tasks.prototype.destroyAndCreateSlider = function () {
            var _this = this;
            if (!this.showTimeSlider || !this.tasktimes) {
                return;
            }
            if (this.slider) {
                this.slider.destroy();
            }
            this.slider = noUiSlider.create(this.tasktimes, this.getSliderBarOptions());
            var connect = this.tasktimes.querySelectorAll(".noUi-connect");
            for (var i = 0; i < connect.length; i++) {
                connect[i].style.background = this._taskColors[i];
            }
            // update gets called when page renders + when user slides the handle
            this.slider.on("update", function (values) { return _this.updateFromSliderUpdateEvent(values); });
            // change gets called when user slide the handle
            this.slider.on("change", function (values, handle) { return _this.updateFromSliderChangeEvent(handle); });
        };
        // when user slides the handle,
        // it should change duration for current task and one after.
        // this method should only get called when slides the handle.
        Tasks.prototype.updateFromSliderChangeEvent = function (handle) {
            var task1 = this._liveTasks[handle];
            this.setChargeTimeChangeTrigger(task1);
            var task2 = this._liveTasks[handle + 1];
            this.setChargeTimeChangeTrigger(task2);
        };
        Tasks.prototype.updateFromSliderUpdateEvent = function (sliderCumulativeValues) {
            for (var i = 0; i <= sliderCumulativeValues.length; i++) {
                var task = this._liveTasks[i];
                task.startTime = this._liveTasks[i - 1]
                    ? this._liveTasks[i - 1].endTime
                    : this.startTime; // the first item will not have a previous sibling, but this.startTime is what we wnat
                task.endTime = i === sliderCumulativeValues.length
                    ? this.endTime // the last item will not have a value in the array, but this.endTime is what we want
                    : moment(task.startTime, HHMM)
                        .add(sliderCumulativeValues[i] - (sliderCumulativeValues[i - 1] || 0), "minutes")
                        .format(HHMM);
                task.workDuration = moment(task.endTime, HHMM).diff(moment(task.startTime, HHMM), "minutes");
            }
        };
        Tasks.prototype.setChargeTimeChangeTrigger = function (task) {
            // this should only be set from either start/end time change or 
            // user slides the slider. 
            // this must not set when the page is loaded.
            if (task && task.workDuration !== task.chargeableTime) {
                task.chargeableTime = task.workDuration;
                task.chargeableTimeChanged = true;
            }
        };
        Tasks.prototype.getSliderBarOptions = function () {
            var _this = this;
            var times = this.getCumulativeDurations();
            var formatTooltip = wNumb({
                edit: function (value) {
                    return moment(_this.startTime, HHMM)
                        .add(value, "minutes")
                        .format(HHMM);
                }
            });
            return {
                start: times.slice(0, -1),
                connect: times.map(function (x) { return true; }),
                step: this.intervalInMinutes,
                tooltips: times.slice(0, -1).map(function (x) { return formatTooltip; }),
                range: {
                    min: 0,
                    max: times[times.length - 1]
                },
                format: wNumb({ decimals: 0 })
            };
        };
        Tasks.prototype.getCumulativeDurations = function () {
            var times = [];
            for (var i = 0; i < this._liveTasks.length; i++) {
                var thisDuration = moment.duration(moment(this._liveTasks[i].endTime, HHMM)
                    .diff(moment(this._liveTasks[i].startTime, HHMM))).asMinutes();
                times.push(thisDuration + (times[i - 1] || 0));
            }
            return times;
        };
        Tasks.prototype.loadCustomBusinessRules = function () {
            return __awaiter(this, void 0, void 0, function () {
                var notDoingJobStatuses, notDoingTaskStatuses, ruleGroup;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            notDoingJobStatuses = "notDoingJobStatuses";
                            notDoingTaskStatuses = "notDoingTaskStatuses";
                            return [4 /*yield*/, this._businessRuleService.getQueryableRuleGroup("taskItem")];
                        case 1:
                            ruleGroup = _a.sent();
                            this.intervalInMinutes = ruleGroup.getBusinessRule("intervalInMinutes");
                            this._taskItemBusinessRules[notDoingJobStatuses] = ruleGroup.getBusinessRule(notDoingJobStatuses);
                            this._taskItemBusinessRules[notDoingTaskStatuses] = ruleGroup.getBusinessRule(notDoingTaskStatuses);
                            return [2 /*return*/];
                    }
                });
            });
        };
        Tasks.prototype.populateColors = function () {
            // we assume that there will not be more then 45 activities in one job!
            var colors = [
                "#9E007E",
                "#DFA0C9",
                "#007FA3",
                "#00677F",
                "#6AD1E3",
                "#91D6AC",
                "#F2C75C",
                "#FF8674"
            ];
            this._taskColors = colors.concat(colors, colors, colors, colors);
        };
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", String)
        ], Tasks.prototype, "endTime", void 0);
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", String)
        ], Tasks.prototype, "startTime", void 0);
        Tasks = __decorate([
            aurelia_dependency_injection_1.inject(taskService_1.TaskService, jobService_1.JobService, engineerService_1.EngineerService, aurelia_router_1.Router, taskFactory_1.TaskFactory, labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService),
            __metadata("design:paramtypes", [Object, Object, Object, aurelia_router_1.Router, Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, Object])
        ], Tasks);
        return Tasks;
    }(editableViewModel_1.EditableViewModel));
    exports.Tasks = Tasks;
});

//# sourceMappingURL=tasks.js.map
