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
define(["require", "exports", "../../../business/models/archive", "aurelia-framework", "aurelia-event-aggregator", "../../../business/services/labelService", "../../../business/services/jobService", "../../../business/services/validationService", "../../../business/services/businessRuleService", "../../../business/services/catalogService", "../../models/editableViewModel", "../../../business/services/engineerService", "aurelia-dialog", "../../../business/services/archiveService", "moment", "./viewModels/archiveModel", "../../../business/models/jobState", "../../../../common/core/stringHelper", "../../../../common/core/objectHelper", "../../elements/engineerState", "./viewModels/archiveJobStateModel", "../../../business/services/constants/archiveConstants", "../../../core/dateHelper"], function (require, exports, archive_1, aurelia_framework_1, aurelia_event_aggregator_1, labelService_1, jobService_1, validationService_1, businessRuleService_1, catalogService_1, editableViewModel_1, engineerService_1, aurelia_dialog_1, archiveService_1, moment, archiveModel_1, jobState_1, stringHelper_1, objectHelper_1, engineerState_1, archiveJobStateModel_1, archiveConstants_1, dateHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Archives = /** @class */ (function (_super) {
        __extends(Archives, _super);
        function Archives(jobService, engineerService, labelService, eventAggregator, validationService, businessRulesService, catalogService, dialogService, archiveService) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService) || this;
            _this._archiveService = archiveService;
            _this.archiveModel = [];
            _this.minDate = new Date();
            _this.maxDate = new Date();
            return _this;
        }
        Archives.prototype.activateAsync = function () {
            var _this = this;
            return this.populateTaskStates()
                .then(function () { return _this.populateEngineerLabels(); })
                .then(function () { return _this.populateEngineerBusinessRules(); })
                .then(function () { return _this.setInitialDates(); })
                .then(function () { return _this.getTimesheetData(new Date()); })
                .then(function (archives) { return _this.mapToModel(_this.archiveDate, archives); })
                .then(function () { return _this._subscription = _this._eventAggregator.subscribe(archiveConstants_1.ArchiveConstants.ARCHIVE_UPDATED, function () { return _this.rePopulate(); }); })
                .then(function () { return _this.showContent(); });
        };
        Archives.prototype.deactivateAsync = function () {
            if (this._subscription) {
                this._subscription.dispose();
                this._subscription = undefined;
            }
            return Promise.resolve();
        };
        Archives.prototype.archiveDateChanged = function (newDate, oldDate) {
            var _this = this;
            if (newDate) {
                return this.getTimesheetData(newDate).then(function (archive) {
                    return _this.mapToModel(newDate, archive);
                });
            }
            this.archiveModel = [];
            return Promise.resolve();
        };
        Archives.prototype.toggleJobs = function (archive) {
            if (archive) {
                archive.showJobs = !archive.showJobs;
            }
        };
        Archives.prototype.rePopulate = function () {
            var _this = this;
            this.archiveDate = new Date();
            this.archiveModel = [];
            return this.getTimesheetData(this.archiveDate).then(function (archives) {
                return _this.mapToModel(_this.archiveDate, archives);
            });
        };
        Archives.prototype.getTimesheetData = function (date) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._archiveService.getArchiveByDate(moment(date).format(archive_1.ARCHIVE_DATE_FORMAT))];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        Archives.prototype.setInitialDates = function () {
            var _this = this;
            return this._archiveService.getEarliestDate().then(function (date) {
                _this.minDate = date;
                _this.archiveDate = new Date();
                return;
            });
        };
        Archives.prototype.populateTaskStates = function () {
            var _this = this;
            return this._catalogService.getActivityComponentVisitStatuses().then(function (states) {
                _this._taskStates = states;
            });
        };
        Archives.prototype.populateEngineerLabels = function () {
            var _this = this;
            return this._labelService.getGroup(stringHelper_1.StringHelper.toCamelCase(objectHelper_1.ObjectHelper.getClassName(engineerState_1.EngineerState)))
                .then(function (labels) {
                _this.engineerStateLabels = labels;
            });
        };
        Archives.prototype.populateEngineerBusinessRules = function () {
            var _this = this;
            return this._businessRuleService.getRuleGroup(stringHelper_1.StringHelper.toCamelCase(objectHelper_1.ObjectHelper.getClassName(engineerService_1.EngineerService)))
                .then(function (rules) {
                _this.engineerStateBusinessRules = rules;
            });
        };
        Archives.prototype.mapToModel = function (currentDate, archives) {
            this.archiveModel = [];
            if (!archives) {
                return;
            }
            for (var i = 0; i < archives.length; i++) {
                var businessModel = archives[i];
                if (!businessModel) {
                    break;
                }
                var viewModel = new archiveModel_1.ArchiveModel();
                viewModel.id = businessModel.id;
                viewModel.engineerId = businessModel.engineerId;
                viewModel.jobId = businessModel.jobId;
                viewModel.details = businessModel.details;
                viewModel.customerName = businessModel.customerName;
                viewModel.shortAddress = businessModel.address;
                var nextBusinessModel = archives[i + 1];
                this.setEngineerStates(viewModel, businessModel, nextBusinessModel);
                this.setJobStates(viewModel, businessModel);
                this.archiveModel.push(viewModel);
            }
        };
        /**
         * calculating time duration from start of first status and end of previous status
         */
        Archives.prototype.setEngineerStates = function (viewModel, archiveCurrent, archiveNext) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, completedTime;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!archiveCurrent) {
                                return [2 /*return*/];
                            }
                            _a = viewModel;
                            return [4 /*yield*/, this._engineerService.getEngineerStateText(archiveCurrent.engineerStatus)];
                        case 1:
                            _a.engineerStatus = _b.sent();
                            viewModel.start = dateHelper_1.DateHelper.getHourMinutes(archiveCurrent.timestamp);
                            // if this is the last state then use completed time to calculate duration
                            if (archiveCurrent.jobStates) {
                                completedTime = archiveCurrent.jobStates.find(function (x) { return x.state === jobState_1.JobState.complete; });
                                if (completedTime) {
                                    viewModel.end = dateHelper_1.DateHelper.getHourMinutes(completedTime.timestamp);
                                    viewModel.duration = dateHelper_1.DateHelper.getDurationMinutes(archiveCurrent.timestamp, completedTime.timestamp, 0);
                                }
                                else {
                                    if (archiveNext && archiveNext.timestamp) {
                                        viewModel.end = dateHelper_1.DateHelper.getHourMinutes(archiveNext.timestamp);
                                        viewModel.duration = dateHelper_1.DateHelper.getDurationMinutes(archiveCurrent.timestamp, archiveNext.timestamp, 0);
                                    }
                                }
                            }
                            else {
                                if (archiveNext && archiveNext.timestamp) {
                                    viewModel.end = dateHelper_1.DateHelper.getHourMinutes(archiveNext.timestamp);
                                    viewModel.duration = dateHelper_1.DateHelper.getDurationMinutes(archiveCurrent.timestamp, archiveNext.timestamp, 0);
                                }
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        /*
        converting business data into presentation data.For persenation it requires start time, end time,
        total duration and job status text (not enum).
         */
        Archives.prototype.setJobStates = function (viewModel, businessModel) {
            if (!businessModel.jobStates || businessModel.jobStates.length === 0) {
                return;
            }
            if ((businessModel.jobStates.find(function (x) { return x.state === jobState_1.JobState.done; }))
                || (businessModel.jobStates.find(function (x) { return x.state === jobState_1.JobState.complete; }))) {
                viewModel.start = dateHelper_1.DateHelper.getHourMinutes(businessModel.jobStates[0].timestamp);
                viewModel.end = dateHelper_1.DateHelper.getHourMinutes(businessModel.jobStates[businessModel.jobStates.length - 1].timestamp);
                viewModel.duration = dateHelper_1.DateHelper.getDurationMinutes(moment(viewModel.start, "HH:mm").toDate(), moment(viewModel.end, "HH:mm").toDate(), 0);
            }
            viewModel.jobStates = [];
            for (var i = 0; i < businessModel.jobStates.length; i++) {
                var currentJobState = businessModel.jobStates[i];
                if (currentJobState.state === jobState_1.JobState.done || currentJobState.state === jobState_1.JobState.complete) {
                    break;
                }
                var prevTimestamp = currentJobState.timestamp, state = currentJobState.state;
                var jobStatus = new archiveJobStateModel_1.ArchiveJobStateModel();
                jobStatus.state = this.mapToJobState(state);
                jobStatus.start = dateHelper_1.DateHelper.getHourMinutes(prevTimestamp);
                var nextJobState = businessModel.jobStates[i + 1];
                if (nextJobState && nextJobState.timestamp) {
                    var nextTimestamp = nextJobState.timestamp;
                    // when engineer do not finish the job on same day and finished next day or day after
                    var isEndSameDay = dateHelper_1.DateHelper.isSameDay(prevTimestamp, nextTimestamp);
                    if (isEndSameDay) {
                        jobStatus.end = dateHelper_1.DateHelper.getHourMinutes(nextTimestamp);
                    }
                    else {
                        jobStatus.end = dateHelper_1.DateHelper.getHourMinutes(nextTimestamp) + (" (" + moment(nextTimestamp).format("DD-MMM") + ")");
                    }
                    jobStatus.duration = dateHelper_1.DateHelper.getDurationMinutes(moment(jobStatus.start, "HH:mm").toDate(), moment(jobStatus.end, "HH:mm").toDate(), 0);
                }
                viewModel.jobStates.push(jobStatus);
            }
            // map tasks
            this.setTaskItems(viewModel, businessModel);
        };
        Archives.prototype.setTaskItems = function (viewModel, businessModel) {
            var _this = this;
            if (!businessModel.taskItems) {
                return;
            }
            viewModel.taskItems = [];
            businessModel.taskItems.forEach(function (task) {
                task.visitStatus = _this.mapToTaskState(task.visitStatus);
                viewModel.taskItems.push(task);
            });
        };
        Archives.prototype.mapToJobState = function (jobState) {
            switch (jobState) {
                case jobState_1.JobState.arrived:
                    return this.getLabel("jobStatusArrived");
                case jobState_1.JobState.complete:
                    return this.getLabel("jobStatusCompleted");
                case jobState_1.JobState.deSelect:
                    return this.getLabel("jobStatusDeSelected");
                case jobState_1.JobState.done:
                    return this.getLabel("jobStatusDone");
                case jobState_1.JobState.enRoute:
                    return this.getLabel("jobStatusEnRoute");
                case jobState_1.JobState.idle:
                    return "";
            }
        };
        Archives.prototype.mapToTaskState = function (tstate) {
            var state = this._taskStates.find(function (x) { return x.status === tstate; });
            if (state) {
                return state.statusDescription;
            }
            return tstate;
        };
        __decorate([
            aurelia_framework_1.observable,
            __metadata("design:type", Date)
        ], Archives.prototype, "archiveDate", void 0);
        Archives = __decorate([
            aurelia_framework_1.inject(jobService_1.JobService, engineerService_1.EngineerService, labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService, aurelia_dialog_1.DialogService, archiveService_1.ArchiveService),
            __metadata("design:paramtypes", [Object, Object, Object, aurelia_event_aggregator_1.EventAggregator, Object, Object, Object, aurelia_dialog_1.DialogService, Object])
        ], Archives);
        return Archives;
    }(editableViewModel_1.EditableViewModel));
    exports.Archives = Archives;
});

//# sourceMappingURL=archives.js.map
