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
define(["require", "exports", "../../../business/services/catalogService", "../../../business/services/businessRuleService", "../../../business/services/jobService", "../../../business/services/engineerService", "../../../business/services/labelService", "aurelia-event-aggregator", "aurelia-dialog", "../../../business/services/validationService", "aurelia-dependency-injection", "../../../business/services/applianceService", "../../../business/services/taskService", "aurelia-router", "aurelia-binding", "../../../business/models/task", "../../../business/services/constants/chargeServiceConstants", "../../../business/services/charge/chargeCatalogHelperService", "../../models/editableViewModel", "../../../../common/core/objectHelper", "../../../business/models/businessException", "../../../../common/core/threading", "moment", "../../constants/taskConstants", "../../../business/services/constants/jobServiceConstants", "../../../business/services/charge/chargeService"], function (require, exports, catalogService_1, businessRuleService_1, jobService_1, engineerService_1, labelService_1, aurelia_event_aggregator_1, aurelia_dialog_1, validationService_1, aurelia_dependency_injection_1, applianceService_1, taskService_1, aurelia_router_1, aurelia_binding_1, task_1, chargeServiceConstants_1, chargeCatalogHelperService_1, editableViewModel_1, objectHelper_1, businessException_1, threading_1, moment, taskConstants_1, jobServiceConstants_1, chargeService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TaskAppliance = /** @class */ (function (_super) {
        __extends(TaskAppliance, _super);
        function TaskAppliance(catalogService, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, applianceService, taskService, router, bindingEngine, chargeCatalogHelper, chargeService) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService) || this;
            _this._businessRulesService = businessRulesService;
            _this._bindingEngine = bindingEngine;
            _this._applianceService = applianceService;
            _this._taskService = taskService;
            _this.actionTypes = [];
            _this._router = router;
            _this._visitNumber = 1;
            _this._rfaSubscriptions = [];
            _this.isNewTask = false;
            _this._chargeCatalogHelper = chargeCatalogHelper;
            _this.isFirstVisitActivity = true;
            _this.showActionTypesLoading = false;
            _this.showChargeTypesLoading = false;
            _this._chargeService = chargeService;
            _this.noChargeRulesFound = false;
            return _this;
        }
        TaskAppliance.prototype.saveTask = function () {
            if (this.isNew) {
                return this.createNew();
            }
            else {
                return this.updateExisting();
            }
        };
        TaskAppliance.prototype.activateAsync = function (params) {
            var _this = this;
            this.jobId = params.jobId;
            this.isNew = true; // .DF_1697
            return this.loadBusinessRules()
                .then(function () { return _this.buildBusinessRules(); })
                .then(function () { return _this.populateErrorMessage(); })
                .then(function () { return _this.buildCustomBusinessRules(); })
                .then(function () { return _this.loadJob(params.jobId); })
                .then(function () { return _this.populateAppliances(params.jobId); })
                .then(function () { return params.taskId ? _this.loadExistingTask(params.jobId, params.taskId) : _this.loadNewTask(params.jobId); })
                .then(function () { return _this.filterAppliances(); })
                .then(function () { return _this.populate(); })
                .then(function () { return _this.setObservables(); })
                .then(function () { return _this.showContent(); });
        };
        TaskAppliance.prototype.deactivateAsync = function () {
            this.removeObservables();
            return Promise.resolve();
        };
        TaskAppliance.prototype.selectedApplianceIdChanged = function (newValue, oldValue) {
            var _this = this;
            if (newValue) {
                this.showActionTypesLoading = true;
                this.actionTypes = [];
                this.selectedActionType = undefined;
                this.chargeTypes = [];
                this.selectedChargeType = undefined;
                if (this.appliances) {
                    var app = this.appliances.find(function (x) { return x.id === newValue; });
                    if (app) {
                        this._selectedApplianceType = app.applianceType;
                        this.selectedApplianceDescription = app.description;
                        return this._catalogService.getFieldActivityType(app.applianceType)
                            .then(function (fieldActivityTypes) { return _this.populateActionTypes(fieldActivityTypes); })
                            .then(function (actionTypes) { return _this.actionTypes = actionTypes; })
                            .then(function () {
                            _this.showActionTypesLoading = false;
                            return Promise.resolve();
                        });
                    }
                    this.showActionTypesLoading = false;
                    return Promise.resolve();
                }
                this.showActionTypesLoading = false;
                return Promise.resolve();
            }
            return Promise.resolve();
        };
        TaskAppliance.prototype.selectedActionTypeChanged = function (newValue, oldValue) {
            var _this = this;
            this.showChargeTypesLoading = true;
            this.chargeTypes = [];
            if (newValue && this._selectedApplianceType && this.actionTypes) {
                this.selectedChargeType = undefined;
                this.chargeTypes = [];
                var at = this.actionTypes.find(function (x) { return x.jobType === newValue; });
                if (at) {
                    this._logger.info("looking for charge rule", newValue, this._selectedApplianceType);
                    return this.populateChargeTypes(this._selectedApplianceType, newValue)
                        .then(function (chargeTypes) {
                        _this.chargeTypes = chargeTypes;
                        if (_this.chargeTypes && _this.chargeTypes.length === 1) {
                            _this.selectedChargeType = _this.chargeTypes[0].chargeType;
                            _this.selectedChargeText = _this.chargeTypes[0].chargeType + " - " + _this.chargeTypes[0].chargeTypeDescription;
                        }
                        _this.showChargeTypesLoading = false;
                    });
                }
                this.showChargeTypesLoading = false;
                return Promise.resolve();
            }
            this.showChargeTypesLoading = false;
            return Promise.resolve();
        };
        TaskAppliance.prototype.selectedChargeTypeChanged = function (newValue, oldValue) {
            return __awaiter(this, void 0, void 0, function () {
                var jobType, applianceType, chargeType, crdf, cmcl, chargeRules, ex_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.selectedChargeType) {
                                return [2 /*return*/];
                            }
                            this.showChargeTypesLoading = true;
                            jobType = this.selectedActionType;
                            applianceType = this._selectedApplianceType;
                            chargeType = this.selectedChargeType;
                            crdf = this._chargeRulesDateFormat;
                            cmcl = this._chargeMethodCodeLength;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this._chargeCatalogHelper.getJobCodeChargeRule(jobType, applianceType, chargeType, crdf, cmcl)];
                        case 2:
                            chargeRules = _a.sent();
                            this.noChargeRulesFound = chargeRules === undefined;
                            this.showChargeTypesLoading = false;
                            return [3 /*break*/, 4];
                        case 3:
                            ex_1 = _a.sent();
                            this.noChargeRulesFound = true;
                            this.showChargeTypesLoading = false;
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        TaskAppliance.prototype.resetViewModel = function () {
            var _this = this;
            this.selectedApplianceId = undefined;
            this._selectedApplianceType = undefined;
            this.selectedApplianceDescription = undefined;
            this.actionTypes = [];
            this.selectedActionType = undefined;
            this.chargeTypes = [];
            this.selectedChargeType = undefined;
            return this.populateAppliances(this.jobId).then(function () { return _this.filterAppliances(); });
        };
        TaskAppliance.prototype.cancel = function () {
            if (this.task && this.task.id) {
                return this._router.navigateToRoute("activity", { taskId: this.task.id });
            }
            return this._router.navigateToRoute("activities");
        };
        Object.defineProperty(TaskAppliance.prototype, "noChargeRuleMessage", {
            // so could be that we have no charge types for appliance and job type, or there could be a charge type but
            // we cannot find any charge rules associated for the region (see DF_1881)
            get: function () {
                return "" + (this.chargeTypes && this.chargeTypes.length > 0 ? "No charge rules found for your region" : "No charge types found");
            },
            enumerable: true,
            configurable: true
        });
        TaskAppliance.prototype.populateAppliances = function (jobId) {
            var _this = this;
            this.appliances = [];
            return this._applianceService.getAppliances(jobId)
                .then(function (appliances) {
                _this.appliances = appliances.filter(function (x) { return !x.parentId; });
                _this.appliances.forEach(function (x) {
                    if (x.description === undefined || x.description === null) {
                        x.description = "";
                    }
                    if (x.locationDescription === undefined || x.locationDescription === null) {
                        x.locationDescription = "";
                    }
                });
            });
        };
        TaskAppliance.prototype.buildBusinessRules = function () {
            this._fmtFieldActivityType = this.getBusinessRule("fmtFieldActivityType");
            this._validNewWorkInd = this.getBusinessRule("validNewWorkInd");
        };
        TaskAppliance.prototype.buildCustomBusinessRules = function () {
            var _this = this;
            var taskItemBusinessRules = this._businessRuleService.getQueryableRuleGroup("taskItem");
            var taskApplianceBusinessRules = this._businessRuleService.getQueryableRuleGroup("taskAppliance");
            var chargeServiceBusinessRules = this._businessRuleService.getQueryableRuleGroup("chargeService");
            return Promise.all([taskItemBusinessRules, taskApplianceBusinessRules, chargeServiceBusinessRules])
                .then(function (_a) {
                var taskItemBusinessRuleGroup = _a[0], taskApplianceBusinessRuleGroup = _a[1], chargeServiceBusinessRuleGroup = _a[2];
                _this._firstVisitJobCode = taskItemBusinessRuleGroup.getBusinessRule("firstVisitJob");
                _this._chargeRulesDateFormat = chargeServiceBusinessRuleGroup.getBusinessRule("chargeRulesDateFormat");
                _this._chargeMethodCodeLength = chargeServiceBusinessRuleGroup.getBusinessRule("chargeMethodCodeLength");
                var firstVisitRestrictionsString = taskApplianceBusinessRuleGroup.getBusinessRule("firstVisitRestrictions");
                if (firstVisitRestrictionsString) {
                    _this._firstVisitRestrictions = firstVisitRestrictionsString.split(",");
                }
                _this._firstVisitSequence = taskApplianceBusinessRuleGroup.getBusinessRule("firstVisitSequence");
            });
        };
        TaskAppliance.prototype.loadNewTask = function (jobId) {
            var _this = this;
            this.isNewTask = true;
            this.isNew = true;
            return this._taskService.getTasksAndCompletedTasks(jobId).then(function (tasks) {
                var newTaskId = task_1.Task.getNextTaskId(tasks);
                if (!newTaskId) {
                    throw new businessException_1.BusinessException(_this, "loadNewTask", "Unable to generate next task id for job {0}", [jobId], null);
                }
                _this._newTaskId = newTaskId;
                _this._visitNumber = 1;
            });
        };
        TaskAppliance.prototype.loadExistingTask = function (jobId, taskId) {
            var _this = this;
            this.isNew = false;
            return this._jobService.getJob(jobId).then(function (job) {
                if (job && job.tasks) {
                    _this.task = job.tasks.find(function (x) { return x.id === taskId; });
                    if (_this.task) {
                        // this is becouse this.task.isNewRFA is an absolute truth.
                        _this.isNewTask = _this.task.isNewRFA;
                        _this.isFirstVisitActivity = _this.task.sequence !== undefined ? _this.task.sequence === _this._firstVisitSequence : _this.isFirstVisitActivity;
                        _this.filterAppliances();
                        return _this.selectedApplianceIdChanged(_this.task.applianceId, undefined)
                            .then(function () { return _this.selectedActionTypeChanged(_this.task.jobType, undefined); })
                            .then(function () { return _this.selectedChargeTypeChanged(_this.task.chargeType, undefined); });
                    }
                    return Promise.resolve();
                }
                return Promise.resolve();
            });
        };
        TaskAppliance.prototype.populateChargeTypes = function (applianceType, jobType) {
            return __awaiter(this, void 0, void 0, function () {
                var err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this._chargeCatalogHelper.getChargeTypesByApplianceJob(applianceType, jobType, this._chargeRulesDateFormat, this._chargeMethodCodeLength)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            err_1 = _a.sent();
                            this._logger.error(err_1);
                            this.showChargeTypesLoading = false;
                            this.noChargeRulesFound = true;
                            return [2 /*return*/, []];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        TaskAppliance.prototype.populateActionTypes = function (fieldActivityTypes) {
            var _this = this;
            var result = [];
            if (fieldActivityTypes) {
                var actionTypePromises = [];
                actionTypePromises = fieldActivityTypes.map(function (val) { return _this.getActionTypePromise(val); });
                return Promise.all(actionTypePromises)
                    .then(function (actTypes) {
                    if (actTypes) {
                        result = actTypes.reduce(function (acc, val) { return (val && val[0]) ? acc.concat(val[0]) : acc; }, []);
                    }
                    return Promise.resolve(result);
                });
            }
            else {
                return Promise.resolve(result);
            }
        };
        TaskAppliance.prototype.getActionTypePromise = function (fieldActivityType) {
            var endDate = moment(fieldActivityType.fieldActivityTypeEndDate, this._fmtFieldActivityType);
            var startDate = moment(fieldActivityType.fieldActivityTypeStartDate, this._fmtFieldActivityType);
            if (moment().isBetween(startDate, endDate)) {
                if (this.isNewTask) {
                    // only restrict action types when its new task created from field app
                    if (fieldActivityType.validNewWorkIndicator === this._validNewWorkInd) {
                        return this._catalogService.getActionType(fieldActivityType.jobType);
                    }
                    return undefined;
                }
                return this._catalogService.getActionType(fieldActivityType.jobType);
            }
            return undefined;
        };
        TaskAppliance.prototype.setObservables = function () {
            var _this = this;
            // dont get chance to set value (into dropdown control)
            // so wait for next digest cycle
            // this needs to be fixed in dropdown
            threading_1.Threading.nextCycle(function () {
                var sub1 = _this._bindingEngine.propertyObserver(_this, "selectedApplianceId")
                    .subscribe(function (newValue, oldValue) { return _this.selectedApplianceIdChanged(newValue, oldValue); });
                _this._rfaSubscriptions.push(sub1);
                var sub2 = _this._bindingEngine.propertyObserver(_this, "selectedActionType")
                    .subscribe(function (newValue, oldValue) { return _this.selectedActionTypeChanged(newValue, oldValue); });
                _this._rfaSubscriptions.push(sub2);
                var sub3 = _this._bindingEngine.propertyObserver(_this, "selectedChargeType")
                    .subscribe(function (newValue, oldValue) { return _this.selectedChargeTypeChanged(newValue, oldValue); });
                _this._rfaSubscriptions.push(sub3);
            });
        };
        TaskAppliance.prototype.removeObservables = function () {
            if (this._rfaSubscriptions) {
                this._rfaSubscriptions.forEach(function (x) {
                    if (x) {
                        x.dispose();
                        x = null;
                    }
                });
                this._rfaSubscriptions = [];
            }
            else {
                this._rfaSubscriptions = [];
            }
        };
        TaskAppliance.prototype.populate = function () {
            var _this = this;
            if (this.task) {
                if (this.appliances) {
                    if (this.appliances.find(function (x) { return x.id === _this.task.applianceId; })) {
                        this.selectedApplianceId = this.task.applianceId;
                    }
                    if (this.task.applianceType) {
                        if (this.appliances.find(function (x) { return x.applianceType === _this.task.applianceType; })) {
                            this._selectedApplianceType = this.task.applianceType;
                        }
                    }
                }
                if (this.actionTypes) {
                    if (this.actionTypes.find(function (x) { return x.jobType === _this.task.jobType; })) {
                        this.selectedActionType = this.task.jobType;
                    }
                }
                if (this.chargeTypes) {
                    if (this.chargeTypes.find(function (x) { return x.chargeType === _this.task.chargeType; })) {
                        this.selectedChargeType = this.task.chargeType;
                    }
                }
            }
        };
        TaskAppliance.prototype.loadJob = function (jobId) {
            var _this = this;
            return this._jobService.getJob(jobId).then(function (job) {
                _this._job = job;
            });
        };
        TaskAppliance.prototype.filterAppliances = function () {
            var _this = this;
            if (this.isNewTask === false) {
                if (this.task && this._firstVisitJobCode && this.appliances) {
                    if (this.task.jobType === this._firstVisitJobCode) {
                        this.appliances = this.appliances.filter(function (x) { return !x.parentId && _this._firstVisitRestrictions.find(function (fv) { return fv !== x.applianceType; }); });
                    }
                }
            }
        };
        TaskAppliance.prototype.populateErrorMessage = function () {
            var _this = this;
            return this._labelService.getGroup("newTask")
                .then(function (labels) {
                _this.chargeTypeErrorMsg = objectHelper_1.ObjectHelper.getPathValue(labels, "chargeTypeInvalidErrorMsg");
                _this.actionTypeErrorMsg = objectHelper_1.ObjectHelper.getPathValue(labels, "actionTypeInvalidErrorMsg");
            });
        };
        TaskAppliance.prototype.createNew = function () {
            var _this = this;
            if (this.isCompleteTriggeredAlready) {
                return Promise.resolve();
            }
            this.isCompleteTriggeredAlready = true;
            var task = new task_1.Task(true, true);
            task.chargeType = this.selectedChargeType;
            task.applianceType = this._selectedApplianceType;
            task.applianceId = this.selectedApplianceId;
            task.jobType = this.selectedActionType;
            task.activities = [];
            task.previousVisits = [];
            task.sequence = this._visitNumber;
            task.id = this._newTaskId;
            task.fieldTaskId = task_1.Task.getFieldTaskId(this._newTaskId);
            return this._businessRulesService.getQueryableRuleGroup("chargeService")
                .then(function (ruleGroup) { return ruleGroup.getBusinessRule("noChargePrefix"); })
                .then(function (noChargePrefix) {
                task.isCharge = task_1.Task.isChargeableTask(_this.selectedChargeType, noChargePrefix);
                return _this._taskService.createTask(_this.jobId, task)
                    .then(function () { return _this._taskService.updateTaskAppliance(_this.jobId, task.id, _this._selectedApplianceType, _this.selectedApplianceId, _this.selectedActionType, _this.selectedChargeType); })
                    .then(function () {
                    _this.notifyDataStateChanged();
                    return _this._chargeService.startCharges(_this.jobId);
                })
                    .then(function () {
                    _this.showInfo(_this.getLabel("objectName"), _this.getLabel("taskSaved"));
                    _this._router.navigateToRoute("activities");
                });
            });
        };
        TaskAppliance.prototype.updateExisting = function () {
            var _this = this;
            if (this.appliances) {
                var app = this.appliances.find(function (x) { return x.id === _this.selectedApplianceId; });
                if (app) {
                    this._selectedApplianceType = app.applianceType;
                }
            }
            var isApplianceTypeChanged = this.task.applianceId !== this.selectedApplianceId;
            var isActionTypeChanged = this.task.jobType !== this.selectedActionType;
            var isChargeTypeChanged = this.task.chargeType !== this.selectedChargeType;
            return this.validateAllRules()
                .then(function () { return _this._taskService.updateTaskAppliance(_this.jobId, _this.task.id, _this._selectedApplianceType, _this.selectedApplianceId, _this.selectedActionType, _this.selectedChargeType); })
                .then(function (task) { return _this._eventAggregator.publish(taskConstants_1.TaskConstants.UPDATE_DATA_STATE, task); })
                .then(function () { return _this._eventAggregator.publish(jobServiceConstants_1.JobServiceConstants.JOB_DATA_STATE_CHANGED); })
                .then(function () { return _this._eventAggregator.publish(chargeServiceConstants_1.ChargeServiceConstants.CHARGE_UPDATE_START, _this.jobId); })
                .then(function () {
                if (isApplianceTypeChanged) {
                    _this.showInfo(_this.getLabel("objectName"), _this.getLabel("applianceTypeChanged"));
                }
                if (isActionTypeChanged) {
                    _this.showInfo(_this.getLabel("objectName"), _this.getLabel("actionTypeChanged"));
                }
                if (isChargeTypeChanged) {
                    _this.showInfo(_this.getLabel("objectName"), _this.getLabel("chargeTypeChanged"));
                }
            })
                .then(function () { return _this._router.navigateToRoute("activity", { taskId: _this.task.id }); })
                .then(function () { return Promise.resolve(); });
        };
        __decorate([
            aurelia_binding_1.computedFrom("chargeTypes"),
            __metadata("design:type", String),
            __metadata("design:paramtypes", [])
        ], TaskAppliance.prototype, "noChargeRuleMessage", null);
        TaskAppliance = __decorate([
            aurelia_dependency_injection_1.inject(catalogService_1.CatalogService, jobService_1.JobService, engineerService_1.EngineerService, labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, applianceService_1.ApplianceService, taskService_1.TaskService, aurelia_router_1.Router, aurelia_binding_1.BindingEngine, chargeCatalogHelperService_1.ChargeCatalogHelperService, chargeService_1.ChargeService),
            __metadata("design:paramtypes", [Object, Object, Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, Object, Object, aurelia_router_1.Router,
                aurelia_binding_1.BindingEngine, Object, Object])
        ], TaskAppliance);
        return TaskAppliance;
    }(editableViewModel_1.EditableViewModel));
    exports.TaskAppliance = TaskAppliance;
});

//# sourceMappingURL=taskAppliance.js.map
