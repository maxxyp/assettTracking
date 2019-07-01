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
define(["require", "exports", "aurelia-logging", "aurelia-framework", "../../../common/ui/elements/models/iconButtonListItem", "../../business/services/jobService", "aurelia-event-aggregator", "../../business/models/jobState", "../../business/services/engineerService", "../../business/services/constants/jobServiceConstants", "../../../appConstants", "aurelia-router", "../../business/services/archiveService", "../../business/services/labelService", "../../../common/core/stringHelper", "../../../common/core/objectHelper", "../../../common/core/guid", "../services/viewService", "../../business/services/referenceDataService", "aurelia-dialog", "../../../common/ui/dialogs/models/errorDialogModel", "../../../common/ui/dialogs/errorDialog", "../../core/windowHelper", "../../../common/analytics/analyticsConstants", "moment", "../modules/confirmation/confirmation", "../../../common/ui/services/modalBusyService", "../../business/models/job", "../../business/services/charge/chargeService", "../../business/services/businessRuleService"], function (require, exports, Logging, aurelia_framework_1, iconButtonListItem_1, jobService_1, aurelia_event_aggregator_1, jobState_1, engineerService_1, jobServiceConstants_1, appConstants_1, aurelia_router_1, archiveService_1, labelService_1, stringHelper_1, objectHelper_1, guid_1, viewService_1, referenceDataService_1, aurelia_dialog_1, errorDialogModel_1, errorDialog_1, windowHelper_1, analyticsConstants_1, moment, confirmation_1, modalBusyService_1, job_1, chargeService_1, businessRuleService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StateButtons = /** @class */ (function () {
        function StateButtons(jobService, engineerService, eventAggregator, router, archiveService, labelService, viewService, referenceDataService, dialogService, modalBusyService, chargeService, businessRuleService) {
            this._jobService = jobService;
            this.engineerService = engineerService;
            this._eventAggregator = eventAggregator;
            this._router = router;
            this._archiveService = archiveService;
            this._labelService = labelService;
            this._viewService = viewService;
            this._referenceDataService = referenceDataService;
            this._dialogService = dialogService;
            this.possibleStates = [];
            this._subscriptions = [];
            this.updateState();
            this.updateDataState();
            this._logger = Logging.getLogger("StateButtons");
            this._modalBusyService = modalBusyService;
            this._chargeService = chargeService;
            this._businessRuleService = businessRuleService;
        }
        StateButtons.prototype.attached = function () {
            var _this = this;
            this._subscriptions.push(this._eventAggregator.subscribe(jobServiceConstants_1.JobServiceConstants.JOB_STATE_CHANGED, function () { return _this.updateState(); }));
            this._subscriptions.push(this._eventAggregator.subscribe(jobServiceConstants_1.JobServiceConstants.JOB_DATA_STATE_CHANGED, function () { return _this.updateDataState(); }));
            this._subscriptions.push(this._eventAggregator.subscribe(jobServiceConstants_1.JobServiceConstants.JOB_COMPLETION_REFRESH, function () { return _this.showHideJobCompletionProgressModal(false); }));
            this._labelService.getGroup(stringHelper_1.StringHelper.toCamelCase(objectHelper_1.ObjectHelper.getClassName(this)))
                .then(function (labels) {
                _this._labels = labels;
            });
        };
        StateButtons.prototype.detached = function () {
            this._subscriptions.forEach(function (s) { return s.dispose(); });
            this._subscriptions = [];
        };
        StateButtons.prototype.jobIdChanged = function () {
            this.updateState();
        };
        StateButtons.prototype.requestedStateChanged = function (newValue, oldValue) {
            var _this = this;
            return this._jobService.getJobState(this.jobId)
                .then(function (state) {
                if (state.value === newValue) {
                    return Promise.resolve();
                }
                _this.addToAnalytics(newValue);
                var p = Promise.resolve(true);
                if (newValue === jobState_1.JobState.enRoute) {
                    p = _this.ensureEngineerWorkingIsSet()
                        .then(function () {
                        return _this.refreshAppIfReferenceDataIsOutOfDate();
                    });
                }
                else if (newValue === jobState_1.JobState.complete) {
                    p = _this.ensureJobSavedAndRunCompleteChecks()
                        .then(function (completeJobChecksPassed) { return __awaiter(_this, void 0, void 0, function () {
                        var job;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!!completeJobChecksPassed) return [3 /*break*/, 1];
                                    this.requestedState = oldValue;
                                    return [3 /*break*/, 5];
                                case 1: return [4 /*yield*/, this.showHideJobCompletionProgressModal(true)];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, this._jobService.getJob(this.jobId)];
                                case 3:
                                    job = _a.sent();
                                    if (!(job && job_1.Job.isIncompleteSerialization(job))) return [3 /*break*/, 5];
                                    return [4 /*yield*/, this._chargeService.startCharges(this.jobId)];
                                case 4:
                                    _a.sent();
                                    _a.label = 5;
                                case 5: return [2 /*return*/, completeJobChecksPassed];
                            }
                        });
                    }); });
                }
                return p.then(function (okToSetState) { return okToSetState
                    ? _this._jobService.setJobState(_this.jobId, newValue)
                        .then(function () { return _this.addToArchive(_this.jobId, newValue); })
                    : null; });
            });
        };
        StateButtons.prototype.addToAnalytics = function (state) {
            if (state && this.jobId) {
                try {
                    this._eventAggregator.publish(analyticsConstants_1.AnalyticsConstants.ANALYTICS_EVENT, {
                        category: analyticsConstants_1.AnalyticsConstants.JOB_STATE + " : " + this.jobId,
                        action: jobState_1.JobState[state],
                        label: moment().format(analyticsConstants_1.AnalyticsConstants.DATE_TIME_FORMAT),
                        metric: analyticsConstants_1.AnalyticsConstants.METRIC
                    });
                }
                catch (_a) {
                    // do nothing
                }
            }
        };
        StateButtons.prototype.ensureEngineerWorkingIsSet = function () {
            var _this = this;
            return this.engineerService.isWorking()
                .then(function (isWorking) { return isWorking ? null : _this.engineerService.setStatus(undefined); });
        };
        StateButtons.prototype.ensureJobSavedAndRunCompleteChecks = function () {
            var _this = this;
            return this._viewService.saveAll()
                .then(function () { return _this.checkIsAllDataStateValid(); })
                .then(function (isValidSoFar) { return isValidSoFar ? _this.checkIsAppointmentSetAndRedirect() : false; })
                .then(function (isValidSoFar) { return isValidSoFar ? _this.checkIfJobFinishTimeNeedsToBeUpdated() : false; });
        };
        StateButtons.prototype.checkIsAppointmentSetAndRedirect = function () {
            var _this = this;
            return this._jobService.requiresAppointment(this.jobId)
                .then(function (requiresAppt) {
                if (requiresAppt) {
                    _this.showPrompt("bookAppointmentTitle", "bookAppointmentDescription");
                    _this._router.navigate("/customers/to-do/" + _this.jobId + "/appointment/book-an-appointment");
                    return false;
                }
                return true;
            });
        };
        StateButtons.prototype.checkIsAllDataStateValid = function () {
            var _this = this;
            return this._jobService.getDataStateSummary(this.jobId)
                .then(function (dataStateSummary) {
                if (dataStateSummary.getCombinedTotals().invalid + dataStateSummary.getCombinedTotals().notVisited > 0) {
                    _this.showPrompt("isValidReminderTitle", "isValidReminderDescription");
                    return false;
                }
                return true;
            });
        };
        StateButtons.prototype.refreshAppIfReferenceDataIsOutOfDate = function () {
            return __awaiter(this, void 0, void 0, function () {
                var shouldUserRefresh, model;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._referenceDataService.shouldUserRefreshReferenceData()];
                        case 1:
                            shouldUserRefresh = _a.sent();
                            if (!shouldUserRefresh) {
                                return [2 /*return*/, true];
                            }
                            model = new errorDialogModel_1.ErrorDialogModel();
                            model.errorMessage = objectHelper_1.ObjectHelper.getPathValue(this._labels, "referenceDataOutOfDateDescription");
                            model.header = objectHelper_1.ObjectHelper.getPathValue(this._labels, "referenceDataOutOfDateTitle");
                            return [4 /*yield*/, this._dialogService.open({ viewModel: errorDialog_1.ErrorDialog, model: model })];
                        case 2:
                            _a.sent();
                            windowHelper_1.WindowHelper.reload();
                            return [2 /*return*/, false];
                    }
                });
            });
        };
        StateButtons.prototype.showPrompt = function (titleKey, descriptionKey) {
            var toastItem = {
                id: guid_1.Guid.newGuid(),
                title: objectHelper_1.ObjectHelper.getPathValue(this._labels, titleKey),
                content: objectHelper_1.ObjectHelper.getPathValue(this._labels, descriptionKey),
                toastAction: { details: objectHelper_1.ObjectHelper.getPathValue(this._labels, descriptionKey) },
                style: "info",
                dismissTime: 2.25
            };
            this._eventAggregator.publish(appConstants_1.AppConstants.APP_TOAST_ADDED, toastItem);
        };
        StateButtons.prototype.updateState = function () {
            var _this = this;
            this.possibleStates = [];
            if (this.jobId) {
                this._jobService.getActiveJobId()
                    .then(function (activeJobId) {
                    var showButtons;
                    if (activeJobId) {
                        showButtons = activeJobId === _this.jobId;
                    }
                    else {
                        showButtons = true;
                    }
                    if (showButtons) {
                        _this._jobService.getJobState(_this.jobId)
                            .then(function (state) {
                            _this.requestedState = state.value;
                            _this._jobService.getJobTargetStates(_this.jobId)
                                .then(function (targetStates) {
                                if (targetStates) {
                                    for (var i = 0; i < targetStates.length; i++) {
                                        _this.possibleStates.push(new iconButtonListItem_1.IconButtonListItem(targetStates[i].name, targetStates[i].value, false, "job-state-" + jobState_1.JobState[targetStates[i].value]));
                                    }
                                    _this.updateDataState();
                                }
                            })
                                .catch(function (error) {
                                _this._logger.error(error && error.toString());
                            });
                        });
                    }
                });
            }
        };
        StateButtons.prototype.updateDataState = function () {
            var _this = this;
            if (this.possibleStates) {
                var completeState_1 = this.possibleStates.find(function (i) { return i.value === jobState_1.JobState.complete; });
                if (completeState_1) {
                    if (this.jobId) {
                        this._jobService.getActiveJobId()
                            .then(function (activeJobId) {
                            if (activeJobId === _this.jobId) {
                                _this._jobService.getDataStateSummary(_this.jobId)
                                    .then(function (dataSummary) {
                                    if (dataSummary) {
                                        var combined = dataSummary.getCombinedTotals();
                                        if (combined.invalid > 0) {
                                            completeState_1.disabled = true;
                                            completeState_1.iconClassName = "job-state-complete state-invalid";
                                        }
                                        else if (combined.notVisited > 0) {
                                            completeState_1.disabled = true;
                                            completeState_1.iconClassName = "job-state-complete state-not-visited";
                                        }
                                        else {
                                            completeState_1.disabled = false;
                                            completeState_1.iconClassName = "job-state-complete state-valid";
                                        }
                                    }
                                    else {
                                        completeState_1.disabled = true;
                                        completeState_1.iconClassName = "job-state-complete state-invalid";
                                    }
                                });
                            }
                        });
                    }
                }
            }
        };
        StateButtons.prototype.addToArchive = function (jobId, jobState) {
            var _this = this;
            return this.engineerService.getCurrentEngineer().then(function (engineer) {
                if (engineer) {
                    return _this._jobService.getJob(jobId).then(function (job) {
                        if (job) {
                            return _this._archiveService.addUpdateJobState(job, engineer, jobState);
                        }
                        else {
                            return Promise.resolve();
                        }
                    });
                }
                else {
                    return Promise.resolve();
                }
            });
        };
        StateButtons.prototype.checkIfJobFinishTimeNeedsToBeUpdated = function () {
            return __awaiter(this, void 0, void 0, function () {
                var needToBeUpdated, _a, labels, job, amendLabel, continueLabel, title, message, dialogResult, businessRules, jobDoingStatuses_1, activeTasks, routePath;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this._jobService.checkIfJobFinishTimeNeedsToBeUpdated()];
                        case 1:
                            needToBeUpdated = _b.sent();
                            if (!needToBeUpdated) return [3 /*break*/, 5];
                            return [4 /*yield*/, Promise.all([this._labelService.getGroup(stringHelper_1.StringHelper.toCamelCase(objectHelper_1.ObjectHelper.getClassName(this))),
                                    this._jobService.getJob(this.jobId)])];
                        case 2:
                            _a = _b.sent(), labels = _a[0], job = _a[1];
                            amendLabel = objectHelper_1.ObjectHelper.getPathValue(labels, "amend");
                            continueLabel = objectHelper_1.ObjectHelper.getPathValue(labels, "continue");
                            title = objectHelper_1.ObjectHelper.getPathValue(labels, "confirmation");
                            message = objectHelper_1.ObjectHelper.getPathValue(labels, "jobFinishTimeUpdateConfirmationMessage");
                            return [4 /*yield*/, this._dialogService.open({ viewModel: confirmation_1.Confirmation, model: { title: title, message: message, yesLabel: amendLabel, noLabel: continueLabel } })];
                        case 3:
                            dialogResult = _b.sent();
                            if (!!dialogResult.wasCancelled) return [3 /*break*/, 5];
                            return [4 /*yield*/, this._businessRuleService.getQueryableRuleGroup("jobService")];
                        case 4:
                            businessRules = _b.sent();
                            jobDoingStatuses_1 = businessRules.getBusinessRule("jobDoingStatuses");
                            activeTasks = job && job.tasks && job.tasks.filter(function (task) { return jobDoingStatuses_1.indexOf(task.status) > -1; }) || [];
                            routePath = activeTasks.length > 1
                                ? "/customers/to-do/" + this.jobId + "/activities"
                                : activeTasks.length === 1 ? "/customers/to-do/" + this.jobId + "/activities/" + activeTasks[0].id + "/details"
                                    : undefined;
                            if (routePath) {
                                this._router.navigate(routePath);
                                return [2 /*return*/, false];
                            }
                            _b.label = 5;
                        case 5: return [2 /*return*/, true];
                    }
                });
            });
        };
        StateButtons.prototype.showHideJobCompletionProgressModal = function (isJobCompletionInProgress) {
            return __awaiter(this, void 0, void 0, function () {
                var jobCompletingText, modalEndTime, diff, modalDisplayms, delaySecs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!isJobCompletionInProgress) return [3 /*break*/, 2];
                            jobCompletingText = objectHelper_1.ObjectHelper.getPathValue(this._labels, "jobCompletingText");
                            return [4 /*yield*/, this._modalBusyService.showBusy("StateButtons", "Visit Completion", jobCompletingText)];
                        case 1:
                            _a.sent();
                            this._modalStartTime = new Date().getTime();
                            return [3 /*break*/, 6];
                        case 2:
                            modalEndTime = new Date().getTime();
                            diff = modalEndTime - this._modalStartTime || 0;
                            modalDisplayms = 2000;
                            if (!(Math.round(diff) < modalDisplayms)) return [3 /*break*/, 4];
                            delaySecs = modalDisplayms - Math.round(diff);
                            return [4 /*yield*/, Promise.delay(delaySecs)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [4 /*yield*/, this._modalBusyService.hideBusy("StateButtons")];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], StateButtons.prototype, "jobId", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Number)
        ], StateButtons.prototype, "requestedState", void 0);
        StateButtons = __decorate([
            aurelia_framework_1.customElement("state-buttons"),
            aurelia_framework_1.inject(jobService_1.JobService, engineerService_1.EngineerService, aurelia_event_aggregator_1.EventAggregator, aurelia_router_1.Router, archiveService_1.ArchiveService, labelService_1.LabelService, viewService_1.ViewService, referenceDataService_1.ReferenceDataService, aurelia_dialog_1.DialogService, modalBusyService_1.ModalBusyService, chargeService_1.ChargeService, businessRuleService_1.BusinessRuleService),
            __metadata("design:paramtypes", [Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_router_1.Router, Object, Object, viewService_1.ViewService, Object, aurelia_dialog_1.DialogService, Object, Object, Object])
        ], StateButtons);
        return StateButtons;
    }());
    exports.StateButtons = StateButtons;
});

//# sourceMappingURL=stateButtons.js.map
