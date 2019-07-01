/// <reference path="./../../../../../typings/app.d.ts" />
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
define(["require", "exports", "aurelia-binding", "aurelia-framework", "aurelia-event-aggregator", "../.././../business/services/catalogService", "../../../business/services/jobService", "../../../business/services/taskService", "../../models/editableViewModel", "../../../business/services/labelService", "../../../business/services/validationService", "../../../business/services/businessRuleService", "aurelia-router", "../../../business/services/engineerService", "aurelia-dialog", "../../../../common/core/threading", "../../../business/services/partService", "../../../business/services/constants/chargeServiceConstants", "../../../business/services/constants/catalogConstants", "../../../../common/core/arrayHelper", "../../constants/taskConstants", "../../../business/models/dataStateSummary", "../../../business/models/job", "../../../business/services/constants/jobServiceConstants", "../../../business/models/jobState", "../../../business/models/businessRules/taskBusinessRuleHelper", "./viewModels/taskItemViewModel", "../../factories/taskItemFactory", "../../../../common/ui/elements/models/timeRange"], function (require, exports, aurelia_binding_1, aurelia_framework_1, aurelia_event_aggregator_1, catalogService_1, jobService_1, taskService_1, editableViewModel_1, labelService_1, validationService_1, businessRuleService_1, aurelia_router_1, engineerService_1, aurelia_dialog_1, threading_1, partService_1, chargeServiceConstants_1, catalogConstants_1, arrayHelper_1, taskConstants_1, dataStateSummary_1, job_1, jobServiceConstants_1, jobState_1, taskBusinessRuleHelper_1, taskItemViewModel_1, taskItemFactory_1, timeRange_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TaskItem = /** @class */ (function (_super) {
        __extends(TaskItem, _super);
        function TaskItem(catalogService, jobService, engineerService, labelService, taskService, eventAggregator, dialogService, validationService, businessRulesService, bindingEngine, partService, taskItemFactory) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService) || this;
            _this._partService = partService;
            _this._taskItemFactory = taskItemFactory;
            _this.adviceResultLookup = [];
            _this.adviceCategoryLookup = [];
            _this.workedOnLookup = [];
            _this._faultMap = {};
            _this._bindingEngine = bindingEngine;
            _this._taskSubscriptions = [];
            _this._taskService = taskService;
            _this._taskUpdateSubscription = null;
            _this._jobStateChangedSubscription = null;
            _this._filteredOutActivityStatuses = [];
            _this.totalChargableTime = 0;
            return _this;
        }
        // fix status not binding when navigating to this vm from a sibling route
        TaskItem.prototype.bind = function (bindingContext, overrideContext) {
            if (!this.viewModel) {
                this.viewModel = {};
            }
            this.viewModel.status = "";
            this.viewModel.workedOnCode = "";
            this.viewModel.chargeableTime = 0;
            this.viewModel.taskTime = undefined;
        };
        TaskItem.prototype.canActivateAsync = function () {
            var rest = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rest[_i] = arguments[_i];
            }
            if (rest && rest[0] && rest[0].jobId && rest[0].taskId) {
                return this._jobService.getJob(rest[0].jobId)
                    .then(function (job) {
                    var taskId = rest[0].taskId;
                    var jobId = rest[0].jobId;
                    var task = job_1.Job.getTasksAndCompletedTasks(job).find(function (t) { return t.id === taskId; });
                    if (!task.isMiddlewareDoTodayTask) {
                        return new aurelia_router_1.Redirect("#/customers/to-do/" + jobId + "/activities/" + taskId + "/previous-activities");
                    }
                    return true;
                });
            }
            return Promise.resolve(false);
        };
        TaskItem.prototype.activateAsync = function (params) {
            var _this = this;
            this._taskId = params.taskId;
            this.jobId = params.jobId;
            this._taskUpdateSubscription = this._eventAggregator.subscribe(taskConstants_1.TaskConstants.UPDATE_DATA_STATE, function (task) {
                _this.viewModel.applianceType = task.applianceType;
                _this.updateDataState(task);
            });
            this._jobStateChangedSubscription = this._eventAggregator.subscribe(jobServiceConstants_1.JobServiceConstants.JOB_STATE_CHANGED, function () { return _this.jobStatusChanged(); });
            if (this._isCleanInstance) {
                return this.loadBusinessRules()
                    .then(function () { return _this.buildBusinessRules(); })
                    .then(function () { return _this.buildCustomBusinessRules(); })
                    .then(function () { return _this.buildValidationRules(); })
                    .then(function () { return _this.loadCatalogs(); })
                    .then(function () { return _this.load(); })
                    .then(function () {
                    _this.showContent();
                });
            }
            else {
                return this.loadActivityComponentVisitStatuses()
                    .then(function () { return _this.buildValidationRules(); })
                    .then(function () {
                    if (_this.viewModel) {
                        _this._taskItemFactory.clearViewModel(_this.viewModel, undefined, undefined, true);
                    }
                    return _this.load();
                });
            }
        };
        TaskItem.prototype.deactivateAsync = function () {
            this.clearAllSubscriptions();
            return Promise.resolve();
        };
        TaskItem.prototype.workedOnCodeChanged = function (newValue, oldValue) {
            if (newValue) {
                this.updateVisitActivities(newValue);
            }
        };
        TaskItem.prototype.activityChanged = function (newValue, oldValue) {
            if (newValue) {
                this.updateFaultCodesBasedOnActivity(newValue);
            }
        };
        TaskItem.prototype.productGroupChanged = function (newValue, oldValue) {
            if (newValue) {
                this.updateParts(newValue);
            }
        };
        TaskItem.prototype.partTypeChanged = function (newValue, oldValue) {
            if (newValue) {
                this.updateFaultCodesBasedOnPartType(newValue);
            }
        };
        TaskItem.prototype.statusChanged = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.viewModel.isInCancellingStatus = !taskBusinessRuleHelper_1.TaskBusinessRuleHelper.isLiveTask(this.businessRules, this.viewModel.status);
                            return [4 /*yield*/, this.setTimeRangePicker()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        TaskItem.prototype.deselectChirpCode = function (chirpCode) {
            var idx = this.viewModel.chirpCodes.indexOf(chirpCode);
            if (idx >= 0) {
                this.viewModel.chirpCodes.splice(idx, 1);
                this.viewModel.chirpCodes = this.viewModel.chirpCodes.slice(0);
                this.updateUnused();
                this.calculateCharactersLeft();
            }
        };
        TaskItem.prototype.chirpCodesChanged = function () {
            this.calculateCharactersLeft();
        };
        TaskItem.prototype.selectedChirpCodeChanged = function () {
            var _this = this;
            if (!this.viewModel.chirpCodes) {
                this.viewModel.chirpCodes = [];
            }
            if (this.viewModel.selectedChirpCode && this.viewModel.chirpCodes.findIndex(function (cc) { return cc.code === _this.viewModel.selectedChirpCode; }) === -1) {
                this.viewModel.chirpCodes.push(this.viewModel.unusedChirpCodes.find(function (cc) { return cc.code === _this.viewModel.selectedChirpCode; }));
                this.viewModel.chirpCodes = this.viewModel.chirpCodes.slice(0);
                this.updateUnused();
                this.calculateCharactersLeft();
            }
            // df_1772 revalidate all the rules.
            this.validateAllRules();
        };
        TaskItem.prototype.updateUnused = function () {
            var _this = this;
            this.viewModel.unusedChirpCodes = this.viewModel.chirpCodes ?
                this.chirpCodesCatalog.filter(function (cc) { return _this.viewModel.chirpCodes.findIndex(function (used) { return used.code === cc.code; }) === -1; }) :
                this.chirpCodesCatalog.slice(0);
        };
        TaskItem.prototype.workDurationChanged = function (newValue, oldValue) {
            this.viewModel.chargeableTime = newValue;
        };
        TaskItem.prototype.displayPartsRequiredMessage = function () {
            return this.showDanger("Parts Required", "Parts required in basket", null);
        };
        TaskItem.prototype.updateVisitActivities = function (workedOnCode) {
            // no point resetting if firstVisit  already set
            if (!this.viewModel.isFirstVisit) {
                this.viewModel.productGroup = undefined;
                this.viewModel.activity = undefined;
                this.viewModel.partType = undefined;
                this.viewModel.faultActionCode = undefined;
                this.viewModel.partTypeFilteredCatalog = [];
                this.viewModel.faultActionCodeFilteredCatalog = [];
                this.viewModel.visitActivityFilteredCatalog = [];
                this.viewModel.showProductGroupAndPartTypes = false;
                taskItemViewModel_1.TaskItemViewModel.filterVisitActivityCatalog(this.viewModel, workedOnCode, this._firstVisitJobCode, this._firstVisitTaskCode, this.visitActivityCatalog, this._claimRejNotCoveredVisitCodesPattern, this._workedOnClaimRejNotCovered);
            }
        };
        TaskItem.prototype.updateFaultCodesBasedOnActivity = function (activityCode) {
            var _this = this;
            this.viewModel.faultActionCode = undefined;
            this.viewModel.partType = undefined;
            this.viewModel.productGroup = undefined;
            this.viewModel.faultActionCodeFilteredCatalog = [];
            this.viewModel.partTypeFilteredCatalog = [];
            taskItemViewModel_1.TaskItemViewModel.filterFaultActionCodeCatalog(this.viewModel, this.visitActFaultActLinkCatalog, this._faultMap, this._visitCodesProductGroupPartsRequired);
            return this.loadMainPartDetails()
                .then(function () {
                if (_this.viewModel.hasMainPart) {
                    if (activityCode !== undefined) {
                        if (_this._visitCodesProductGroupPartsRequired.indexOf(activityCode) !== -1) {
                            _this.viewModel.showMainPartSelectedWithInvalidActivityTypeMessage = false;
                            threading_1.Threading.nextCycle(function () {
                                _this.viewModel.productGroup = _this.viewModel.mainPartProductGroup;
                            });
                        }
                        else {
                            _this.viewModel.showMainPartSelectedWithInvalidActivityTypeMessage = true;
                        }
                    }
                    else {
                        _this.viewModel.showMainPartSelectedWithInvalidActivityTypeMessage = true;
                    }
                }
                else {
                    _this.viewModel.showMainPartSelectedWithInvalidActivityTypeMessage = false;
                }
            });
        };
        TaskItem.prototype.updateParts = function (productCode) {
            var _this = this;
            if (productCode === undefined) {
                return;
            }
            this.viewModel.faultActionCode = undefined;
            this.viewModel.partType = undefined;
            this.viewModel.partTypeFilteredCatalog = [];
            taskItemViewModel_1.TaskItemViewModel.filterPartTypeCatalog(this.viewModel, this.partTypeCatalog);
            if (!this.viewModel.hasMainPart) {
                this.viewModel.showMainPartSelectedWithInvalidProductGroupTypeMessage = false;
                return;
            }
            if (productCode === this.viewModel.mainPartProductGroup) {
                threading_1.Threading.nextCycle(function () {
                    _this.viewModel.partType = _this.viewModel.mainPartPartType;
                });
                this.viewModel.showMainPartSelectedWithInvalidProductGroupTypeMessage = false;
            }
            else {
                this.viewModel.showMainPartSelectedWithInvalidProductGroupTypeMessage = true;
            }
        };
        TaskItem.prototype.updateFaultCodesBasedOnPartType = function (partTypeCode) {
            if (partTypeCode === undefined) {
                return;
            }
            if (this.viewModel.hasMainPart) {
                if (partTypeCode === this.viewModel.mainPartPartType) {
                    this.viewModel.showMainPartSelectedWithInvalidPartTypeMessage = false;
                }
                else {
                    this.viewModel.showMainPartSelectedWithInvalidPartTypeMessage = true;
                }
            }
            else {
                this.viewModel.showMainPartSelectedWithInvalidPartTypeMessage = false;
            }
            this.viewModel.faultActionCode = undefined;
            taskItemViewModel_1.TaskItemViewModel.filterFaultActionCodeBasedOnPartType(this.viewModel, this.partTypeFaultActLinkCatalog, this.partTypeCatalog, this._faultMap);
        };
        Object.defineProperty(TaskItem.prototype, "showAdviceCategory", {
            get: function () {
                if (this.viewModel && this.viewModel.adviceOutcome) {
                    return this.viewModel.adviceOutcome && this._adviceResultsThatNeedCategory.indexOf(this.viewModel.adviceOutcome) !== -1;
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        // space needs to be between each chirp codes and between chirp code and freetext report
        TaskItem.prototype.calculateCharactersLeft = function () {
            if (this.getValidationEnabled()) {
                var maxChars = this.getValidationRule("viewModel.taskReport").maxLength;
                var selectedChirpCodes = (this.viewModel.chirpCodes && this.viewModel.chirpCodes.length > 0) ? this.viewModel.chirpCodes.map(function (cc) { return cc.code; }).join(" ") : undefined;
                this.viewModel.charactersLeftNum = (selectedChirpCodes) ? maxChars - (selectedChirpCodes.length + 1) : maxChars;
                // commented to fix 16843
                // this.combinedReport = "";
                /* if (this.chirpCodes && this.chirpCodes.length > 0) {
                 this.combinedReport += this.chirpCodes.map(cc => cc.code).join("");
                 }
    
                 if (this.taskReport) {
                 this.combinedReport += this.taskReport;
                 }
    
                 this.charactersLeftNum = maxChars - this.combinedReport.length;
    
                 this.charactersLeftClass = "";
                 this.charactersLeft = "";
    
                 if (this.charactersLeftNum >= 0) {
                 this.charactersLeft = `${this.charactersLeftNum} characters left`;
                 this.charactersLeftClass = "valid";
                 } else if (this.charactersLeftNum < 0) {
                 this.charactersLeft = `${Math.abs(this.charactersLeftNum)} characters too many`;
                 this.charactersLeftClass = "invalid";
                 } */
            }
        };
        TaskItem.prototype.canDeactivateAsync = function () {
            var _this = this;
            // ask the question
            if (!this.isValidActivityProductGroupAndPartTypeForMainPart()) {
                return this.showConfirmation(this.getLabel("confirmation"), this.getLabel("incorrectActivityProductGroupOrPartTypeQuestion"))
                    .then(function (result) {
                    if (!result.wasCancelled) {
                        // need to reset the main part flag for this task
                        return _this._partService.clearMainPartForTask(_this.jobId, _this._taskId)
                            .then(function () { return true; });
                    }
                    else {
                        return false;
                    }
                });
            }
            else {
                return Promise.resolve(true);
            }
        };
        TaskItem.prototype.loadProductGroupFromMainPart = function () {
            if (this.viewModel.hasMainPart) {
                this.viewModel.productGroup = this.viewModel.mainPartProductGroup;
            }
        };
        TaskItem.prototype.loadPartTypeFromMainPart = function () {
            if (this.viewModel.hasMainPart) {
                this.updateParts(this.viewModel.mainPartProductGroup);
                this.loadProductGroupFromMainPart();
            }
        };
        TaskItem.prototype.chargeableTimeChanged = function () {
            this.totalChargableTime = (this.viewModel.totalPreviousWorkDuration || 0) + (this.viewModel.chargeableTime || 0);
        };
        TaskItem.prototype.loadModel = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var job;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.clearObservableSubscriptions();
                            this.resetMainPartFlags();
                            return [4 /*yield*/, this._jobService.getJob(this.jobId)];
                        case 1:
                            job = _a.sent();
                            if (!(job && job.tasks)) return [3 /*break*/, 3];
                            this.viewModel = this._taskItemFactory.createTaskItemViewModel(this._taskId, job, this.intervalInMinutes, this.chirpCodesCatalog);
                            this.updateActivityIfJobTypeChanged();
                            this.statusChanged(); // todo: when this is awaited then a red error occurs
                            // initialise activity changed
                            taskItemViewModel_1.TaskItemViewModel.filterVisitActivityCatalog(this.viewModel, this.viewModel.workedOnCode, this._firstVisitJobCode, this._firstVisitTaskCode, this.visitActivityCatalog, this._claimRejNotCoveredVisitCodesPattern, this._workedOnClaimRejNotCovered);
                            taskItemViewModel_1.TaskItemViewModel.filterFaultActionCodeCatalog(this.viewModel, this.visitActFaultActLinkCatalog, this._faultMap, this._visitCodesProductGroupPartsRequired);
                            taskItemViewModel_1.TaskItemViewModel.filterPartTypeCatalog(this.viewModel, this.partTypeCatalog);
                            taskItemViewModel_1.TaskItemViewModel.filterFaultActionCodeBasedOnPartType(this.viewModel, this.partTypeFaultActLinkCatalog, this.partTypeCatalog, this._faultMap);
                            this.updateUnused();
                            this.setInitialDataState(this.viewModel.dataStateId, this.viewModel.dataState);
                            this.validationToggle(true);
                            this.jobStatusesCatalog = this.filterActivityStatuses(this.jobStatusesCatalog, this.viewModel.applianceType, this.viewModel.jobType);
                            this.viewModel.selectedChirpCode = undefined;
                            return [4 /*yield*/, this.setTimeRangePicker()];
                        case 2:
                            _a.sent();
                            this.calculateCharactersLeft();
                            _a.label = 3;
                        case 3:
                            threading_1.Threading.nextCycle(function () {
                                if (_this.viewModel.jobType === _this._firstVisitJobCode) {
                                    _this.viewModel.activity = _this._firstVisitTaskCode; // this is required for fresh job with undefined workedOnCode, etc.
                                }
                                _this.setObservables();
                                _this.viewModel.chargeableTime = (_this.viewModel.chargeableTime !== undefined) ? _this.viewModel.chargeableTime : _this.viewModel.workDuration;
                                _this.chargeableTimeChanged();
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        TaskItem.prototype.saveModel = function () {
            var _this = this;
            var task = this._taskItemFactory.createTaskItemBusinessModel(this.viewModel, this._taskId, this._adviceResultsThatNeedCategory);
            return this.updateDataState(task)
                .then(function () { return _this._taskService.saveTask(_this.jobId, task); })
                .then(function () { return _this.setPartsRequiredForTask(_this.viewModel.status); })
                .then(function () {
                if (_this._isDirty) {
                    _this._eventAggregator.publish(chargeServiceConstants_1.ChargeServiceConstants.CHARGE_UPDATE_START, _this.jobId);
                }
            });
        };
        TaskItem.prototype.clearModel = function () {
            var _this = this;
            if (dataStateSummary_1.DataStateSummary.dataStateCompletionOverrideGroup === "activities") {
                dataStateSummary_1.DataStateSummary.clearDataStateCompletionOverrideGroup();
            }
            this.clearObservableSubscriptions();
            return this._taskService.getTaskItem(this.jobId, this._taskId)
                .then(function (task) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this._taskItemFactory.clearViewModel(this.viewModel, task, this._firstVisitTaskCode, false);
                            this.statusChanged();
                            this.setInitialDataState(task.dataStateId, task.dataState);
                            this.setObservables();
                            return [4 /*yield*/, this.setTimeRangePicker()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        // this is needed becase the next and previous buttons dont hit the constructor and
        // as such the values are not reset
        TaskItem.prototype.resetMainPartFlags = function () {
            if (this.viewModel) {
                this.viewModel.mainPartInformationRetrieved = false;
                this.viewModel.hasMainPart = false;
                this.viewModel.mainPartProductGroup = "";
                this.viewModel.mainPartPartType = "";
                this.viewModel.showMainPartSelectedWithInvalidActivityTypeMessage = false;
                this.viewModel.showMainPartSelectedWithInvalidProductGroupTypeMessage = false;
                this.viewModel.showMainPartSelectedWithInvalidPartTypeMessage = false;
            }
        };
        TaskItem.prototype.filterActivityStatuses = function (catalog, applianceType, jobType) {
            var _this = this;
            if (applianceType === this._instaPremAppliance && jobType === this._annualServiceActionType) {
                return catalog.filter(function (x) { return _this._insAnnualServiceActivityStatuses.some(function (y) { return y === x.status; }); });
            }
            return catalog;
        };
        TaskItem.prototype.setPartsRequiredForTask = function (newStatus) {
            var _this = this;
            return this._partService.setPartsRequiredForTask(this.jobId)
                .then(function (partsMessage) {
                if (partsMessage) {
                    if (newStatus === _this._partsRequiredInBasketStatus) {
                        _this.showDanger("Parts Required", "Parts in basket are required", "");
                    }
                }
            });
        };
        TaskItem.prototype.isValidActivityProductGroupAndPartTypeForMainPart = function () {
            if (this.viewModel.hasMainPart && this.viewModel.workedOnCode) {
                if ((this._visitCodesProductGroupPartsRequired.indexOf(this.viewModel.activity) === -1)
                    || (this.viewModel.productGroup !== this.viewModel.mainPartProductGroup)
                    || (this.viewModel.partType !== this.viewModel.mainPartPartType)) {
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                return true;
            }
        };
        TaskItem.prototype.loadMainPartDetails = function () {
            var _this = this;
            if (this.viewModel.mainPartInformationRetrieved) {
                return Promise.resolve();
            }
            return this._partService.getMainPartForTask(this.jobId, this._taskId)
                .then(function (mainPart) {
                if (!mainPart) {
                    _this.viewModel.hasMainPart = false;
                    _this.viewModel.mainPartProductGroup = undefined;
                    _this.viewModel.mainPartPartType = undefined;
                    return Promise.resolve();
                }
                return _this._catalogService.getGoodsType(mainPart.stockReferenceId)
                    .then(function (part) {
                    _this.viewModel.mainPartInformationRetrieved = true;
                    if (!part) {
                        _this.viewModel.hasMainPart = false;
                        _this.viewModel.mainPartProductGroup = undefined;
                        _this.viewModel.mainPartPartType = undefined;
                        return Promise.resolve();
                    }
                    _this.viewModel.hasMainPart = true;
                    _this.viewModel.mainPartProductGroup = part.productGroupCode;
                    _this.viewModel.mainPartPartType = part.partTypeCode;
                    if (_this.viewModel.activity && _this._visitCodesProductGroupPartsRequired.indexOf(_this.viewModel.activity) !== -1) {
                        _this.viewModel.showMainPartSelectedWithInvalidActivityTypeMessage = false;
                    }
                    else {
                        _this.viewModel.showMainPartSelectedWithInvalidActivityTypeMessage = true;
                    }
                    return Promise.resolve();
                })
                    .catch(function (error) {
                    _this._logger.error(error && error.toString());
                    _this.viewModel.hasMainPart = false;
                    _this.viewModel.mainPartProductGroup = undefined;
                    _this.viewModel.mainPartPartType = undefined;
                    return Promise.resolve();
                });
            })
                .catch(function (error) {
                _this._logger.error(error && error.toString());
                _this.viewModel.hasMainPart = false;
                _this.viewModel.mainPartProductGroup = undefined;
                _this.viewModel.mainPartPartType = undefined;
                return Promise.resolve();
            });
        };
        TaskItem.prototype.buildBusinessRules = function () {
            this._adviceResultsThatNeedCategory = this.getBusinessRule("adviceResultsThatNeedCategory");
            this._firstVisitJobCode = this.getBusinessRule("firstVisitJob");
            this._firstVisitTaskCode = this.getBusinessRule("firstVisitTask");
            this._visitCodesProductGroupPartsRequired = this.getBusinessRule("visitCodesProductGroupPartsRequired").split(",");
            this._claimRejNotCoveredVisitCodesPattern = this.getBusinessRule("claimRejNotCoveredVisitCodesPattern");
            this._workedOnClaimRejNotCovered = this.getBusinessRule("workedOnClaimRejNotCovered");
            this._taskStatusDoToday = this.getBusinessRule("taskStatusDoToday");
            this._partsRequiredInBasketStatus = this.getBusinessRule("activityPartsRequiredStatus");
            this._insAnnualServiceActivityStatuses = this.getBusinessRule("insAnnualServiceActivityStatuses").split(",");
            this.intervalInMinutes = this.getBusinessRule("intervalInMinutes");
            this._filteredOutActivityStatuses = this.getBusinessRule("filteredOutActivityStatuses").split(",");
        };
        TaskItem.prototype.buildCustomBusinessRules = function () {
            var _this = this;
            return this._businessRuleService.getQueryableRuleGroup("jobFactory").then(function (jobFactoryRuleGroup) {
                _this._instaPremAppliance = jobFactoryRuleGroup.getBusinessRule("instPremApplianceType");
                _this._annualServiceActionType = jobFactoryRuleGroup.getBusinessRule("annualServiceJobType");
            });
        };
        TaskItem.prototype.loadCatalogs = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, jobCode, chirpCode, adviceResult, advicecategory, workedon, isPartLJReportableLookup;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this._catalogService.getJCJobCodes(),
                                this._catalogService.getChirpCodes(),
                                this._catalogService.getAdviceResults(),
                                this._catalogService.getEeaCategories(),
                                this._catalogService.getWorkedOns(),
                                this.buildYesNoList()
                            ])];
                        case 1:
                            _a = _b.sent(), jobCode = _a[0], chirpCode = _a[1], adviceResult = _a[2], advicecategory = _a[3], workedon = _a[4], isPartLJReportableLookup = _a[5];
                            this.jobCodesCatalog = this.toSortedArray(jobCode, catalogConstants_1.CatalogConstants.JC_JOB_CODE_DESCRIPTION);
                            this.chirpCodesCatalog = this.toSortedArray(chirpCode, catalogConstants_1.CatalogConstants.CHIRP_CODE_ID);
                            this.adviceResultLookup = this.toButtonListItemArray(adviceResult, catalogConstants_1.CatalogConstants.ADVICE_RESULT_ID, catalogConstants_1.CatalogConstants.ADVICE_RESULT_DESCRIPTION);
                            this.adviceCategoryLookup = this.toButtonListItemArray(advicecategory, catalogConstants_1.CatalogConstants.ENERGY_ADVICE_CATEGORY_ID, catalogConstants_1.CatalogConstants.ENERGY_ADVICE_CATEGORY_DESCRIPTION);
                            this.workedOnLookup = this.toButtonListItemArray(workedon, catalogConstants_1.CatalogConstants.WORKED_ON_ID, catalogConstants_1.CatalogConstants.WORKED_ON_DESCRIPTION);
                            this.isPartLJReportableLookup = isPartLJReportableLookup;
                            return [4 /*yield*/, this.loadActivityComponentVisitStatuses()];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, this.loadDynamicDropdownCatalogs()];
                        case 3:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        TaskItem.prototype.loadDynamicDropdownCatalogs = function () {
            var _this = this;
            return Promise.all([
                this._catalogService.getVisitActivityCodes(),
                this._catalogService.getProductGroups(),
                this._catalogService.getPartTypes(),
                this._catalogService.getPartTypeFaultActions(),
                this._catalogService.getVisitActivityFaultActions(),
                this._catalogService.getFaultActionCodes()
            ]).then(function (_a) {
                var visitActivity = _a[0], productGroup = _a[1], partType = _a[2], partTypeFaultActLink = _a[3], visitActFaultActLink = _a[4], faultActionCode = _a[5];
                _this.visitActivityCatalog = arrayHelper_1.ArrayHelper.sortByColumn(visitActivity, catalogConstants_1.CatalogConstants.VISIT_ACTIVITY_CODE_DESCRIPTION);
                _this.productGroupCatalog = arrayHelper_1.ArrayHelper.sortByColumn(productGroup, catalogConstants_1.CatalogConstants.PRODUCT_GROUP_DESCRIPTION);
                _this.partTypeCatalog = arrayHelper_1.ArrayHelper.sortByColumn(partType, catalogConstants_1.CatalogConstants.PART_TYPE_DESCRIPTION);
                _this.partTypeFaultActLinkCatalog = partTypeFaultActLink;
                _this.visitActFaultActLinkCatalog = visitActFaultActLink;
                _this.faultActionCodeCatalog = faultActionCode;
                // used for faultCode lookups
                faultActionCode.forEach(function (f) { return _this._faultMap[f.faultActionCode] = f; });
            });
        };
        TaskItem.prototype.loadActivityComponentVisitStatuses = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var visitStatus;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._catalogService.getActivityComponentVisitStatuses()];
                        case 1:
                            visitStatus = _a.sent();
                            this.jobStatusesCatalog = this.toSortedArray(visitStatus.filter(function (x) { return _this._filteredOutActivityStatuses.indexOf(x.status) === -1; }), catalogConstants_1.CatalogConstants.ACTIVITY_COMPONENT_VISIT_STATUS_ID);
                            return [2 /*return*/];
                    }
                });
            });
        };
        // need this, as opposed to using decoraters, to prevent unnecessary fires on initialisation
        TaskItem.prototype.setObservables = function () {
            var _this = this;
            var sub1 = this._bindingEngine.propertyObserver(this.viewModel, "activity")
                .subscribe(function (newValue) { return _this.updateFaultCodesBasedOnActivity(newValue); });
            this._taskSubscriptions.push(sub1);
            var sub2 = this._bindingEngine.propertyObserver(this.viewModel, "productGroup")
                .subscribe(function (newValue) { return _this.updateParts(newValue); });
            this._taskSubscriptions.push(sub2);
            var sub3 = this._bindingEngine.propertyObserver(this.viewModel, "partType")
                .subscribe(function (newValue) { return _this.updateFaultCodesBasedOnPartType(newValue); });
            this._taskSubscriptions.push(sub3);
            var sub4 = this._bindingEngine.propertyObserver(this.viewModel, "workedOnCode")
                .subscribe(function (newValue) { return _this.updateVisitActivities(newValue); });
            this._taskSubscriptions.push(sub4);
            var sub5 = this._bindingEngine.propertyObserver(this.viewModel, "status")
                .subscribe(function (newValue, oldValue) { return _this.statusChanged(); });
            this._taskSubscriptions.push(sub5);
            var sub6 = this._bindingEngine.propertyObserver(this.viewModel, "workDuration")
                .subscribe(function (newValue, oldValue) { return _this.workDurationChanged(newValue, oldValue); });
            this._taskSubscriptions.push(sub6);
            var sub7 = this._bindingEngine.propertyObserver(this.viewModel, "chirpCodes").subscribe(function () { return _this.chirpCodesChanged(); });
            this._taskSubscriptions.push(sub7);
            var sub8 = this._bindingEngine.propertyObserver(this.viewModel, "selectedChirpCode").subscribe(function () { return _this.selectedChirpCodeChanged(); });
            this._taskSubscriptions.push(sub8);
            var sub9 = this._bindingEngine.propertyObserver(this.viewModel, "chargeableTime")
                .subscribe(function (newValue) { return _this.chargeableTimeChanged(); });
            this._taskSubscriptions.push(sub9);
        };
        TaskItem.prototype.clearAllSubscriptions = function () {
            this.clearObservableSubscriptions();
            if (this._taskUpdateSubscription) {
                this._taskUpdateSubscription.dispose();
                this._taskUpdateSubscription = null;
            }
            if (this._jobStateChangedSubscription) {
                this._jobStateChangedSubscription.dispose();
                this._jobStateChangedSubscription = null;
            }
        };
        TaskItem.prototype.clearObservableSubscriptions = function () {
            this._taskSubscriptions.forEach(function (s) { return s.dispose(); });
            this._taskSubscriptions = [];
        };
        TaskItem.prototype.buildValidationRules = function () {
            var _this = this;
            var minValidationCondition = function () { return !_this.viewModel.isInCancellingStatus && !_this.viewModel.isNotDoingJobByAnotherTask; };
            return this.buildValidation([
                {
                    property: "viewModel.chargeableTime",
                    condition: function () { return _this.viewModel.chargeableTime !== undefined || (_this.showAdviceCategory && minValidationCondition()); },
                    passes: [
                        {
                            test: function () { return _this.viewModel.chargeableTime <= _this.viewModel.workDuration; },
                            message: this.getLabel("chargeableTimeMessage")
                        }
                    ]
                },
                // commented to fix 16843
                /* {
                 property: "combinedReport",
                 condition: () => !this.notCompletingJobReason && !this.isJobNoAccessedByAnotherTask
                 } */ ,
                {
                    property: "viewModel.chirpCodes",
                    condition: function () { return minValidationCondition(); }
                },
                {
                    property: "viewModel.status",
                    condition: function () { return minValidationCondition(); },
                    passes: [
                        {
                            test: function () { return _this.viewModel.status === _this._taskStatusDoToday ? false : true; },
                            message: this.getLabel("doTodayTaskStatusMessage")
                        }
                    ]
                },
                {
                    property: "viewModel.activity",
                    condition: function () { return minValidationCondition(); }
                },
                {
                    property: "viewModel.adviceOutcome",
                    condition: function () { return minValidationCondition(); }
                },
                {
                    property: "viewModel.workedOnCode",
                    condition: function () { return minValidationCondition(); }
                },
                {
                    property: "viewModel.adviceComment",
                    condition: function () { return _this.showAdviceCategory && minValidationCondition(); }
                },
                {
                    property: "viewModel.adviceCode",
                    condition: function () { return _this.showAdviceCategory && minValidationCondition(); }
                },
                {
                    property: "viewModel.applianceType",
                    condition: function () { return minValidationCondition(); }
                },
                {
                    property: "viewModel.productGroup",
                    condition: function () { return _this.viewModel.showProductGroupAndPartTypes && minValidationCondition(); }
                },
                {
                    property: "viewModel.partType",
                    condition: function () { return (_this.viewModel.showProductGroupAndPartTypes || _this.viewModel.partTypeFilteredCatalog.length > 0)
                        && minValidationCondition(); }
                },
                {
                    property: "viewModel.faultActionCode",
                    condition: function () { return _this.viewModel.faultActionCodeFilteredCatalog.length > 0 && minValidationCondition(); }
                },
                {
                    property: "viewModel.isPartLJReportable",
                    condition: function () { return _this.viewModel.isPotentiallyPartLJReportable && minValidationCondition(); }
                },
                {
                    property: "viewModel.taskReport", condition: function () { return !_this.viewModel.isNotDoingJobByAnotherTask; }
                }
            ]);
        };
        TaskItem.prototype.updateDataState = function (task) {
            var _this = this;
            return this.validateAllRules().then(function () {
                task.dataState = _this.getFinalDataState();
                _this.viewModel.currentApplianceId = task.applianceId;
                _this.viewModel.applianceType = task.applianceType;
            });
        };
        TaskItem.prototype.jobStatusChanged = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var job, task;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._jobService.getJob(this.jobId)];
                        case 1:
                            job = _a.sent();
                            if (!(job && job.state === jobState_1.JobState.arrived)) return [3 /*break*/, 3];
                            task = job.tasks.find(function (t) { return t.id === _this._taskId; });
                            // ttr1 what about chargeable time
                            this.viewModel.taskTime = new timeRange_1.TimeRange(task.startTime, task.endTime);
                            this.viewModel.workDuration = task.workDuration;
                            this.viewModel.chargeableTime = task.chargeableTime;
                            return [4 /*yield*/, this.setTimeRangePicker()];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        TaskItem.prototype.setTimeRangePicker = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var isCurrentTaskLive, isAnotherTaskLive, isAReinstatedNATask, isCurrentTaskTimeEmpty, reinstatedTimes;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.viewModel.job && this.viewModel.job.state === jobState_1.JobState.arrived)) {
                                return [2 /*return*/];
                            }
                            isCurrentTaskLive = !taskBusinessRuleHelper_1.TaskBusinessRuleHelper.isNotDoingTaskStatus(this.businessRules, this.viewModel.status);
                            isAnotherTaskLive = this.viewModel.tasks
                                .some(function (task) { return task.id !== _this._taskId
                                && !taskBusinessRuleHelper_1.TaskBusinessRuleHelper.isNotDoingTaskStatus(_this.businessRules, task.status); });
                            isAReinstatedNATask = isCurrentTaskLive
                                && taskBusinessRuleHelper_1.TaskBusinessRuleHelper.isNotDoingJobStatus(// isNotDoingJob not isNotDoingTask
                                this.businessRules, this.viewModel.tasks.find(function (task) { return task.id === _this._taskId; }).status // this tasks status when we hit the screen
                                )
                                && this.viewModel.tasks.some(function (task) { return task.id !== _this._taskId; });
                            this.disableTimeRangePicker = !isCurrentTaskLive
                                || isAnotherTaskLive
                                || isAReinstatedNATask;
                            isCurrentTaskTimeEmpty = this.viewModel.taskTime.startTime === "00:00";
                            if (!(isCurrentTaskLive && isCurrentTaskTimeEmpty)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this._taskService.buildReinstatedTaskTimes(this.viewModel, this.jobId)];
                        case 1:
                            reinstatedTimes = _a.sent();
                            this.viewModel.taskTime = new timeRange_1.TimeRange(reinstatedTimes.startTime, reinstatedTimes.endTime);
                            this.viewModel.workDuration = reinstatedTimes.workDuration;
                            this.viewModel.chargeableTime = reinstatedTimes.chargeableTime;
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        TaskItem.prototype.updateActivityIfJobTypeChanged = function () {
            if (this.viewModel.activity === this._firstVisitTaskCode && this.viewModel.jobType !== this._firstVisitJobCode) {
                this.viewModel.activity = undefined;
            }
        };
        TaskItem = __decorate([
            aurelia_framework_1.inject(catalogService_1.CatalogService, jobService_1.JobService, engineerService_1.EngineerService, labelService_1.LabelService, taskService_1.TaskService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, aurelia_binding_1.BindingEngine, partService_1.PartService, taskItemFactory_1.TaskItemFactory),
            __metadata("design:paramtypes", [Object, Object, Object, Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, aurelia_binding_1.BindingEngine, Object, Object])
        ], TaskItem);
        return TaskItem;
    }(editableViewModel_1.EditableViewModel));
    exports.TaskItem = TaskItem;
});

//# sourceMappingURL=taskItem.js.map
