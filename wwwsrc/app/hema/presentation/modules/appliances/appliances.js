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
define(["require", "exports", "aurelia-dependency-injection", "../../../../common/core/services/appLauncher", "../../../../common/core/services/configurationService", "../../models/editableViewModel", "../../../business/services/applianceService", "./viewModels/applianceSummaryViewModel", "aurelia-router", "../../../business/services/labelService", "aurelia-event-aggregator", "../../../business/services/jobService", "../../../business/services/catalogService", "../../../business/services/validationService", "../../../business/services/businessRuleService", "../../../../common/core/guid", "../../../business/services/engineerService", "aurelia-dialog", "../../../business/models/dataStateSummary", "../../../business/models/dataState", "../../../business/services/taskService", "../../../../common/core/arrayHelper", "../../../business/services/constants/chargeServiceConstants", "../../../business/models/applianceOperationType"], function (require, exports, aurelia_dependency_injection_1, appLauncher_1, configurationService_1, editableViewModel_1, applianceService_1, applianceSummaryViewModel_1, aurelia_router_1, labelService_1, aurelia_event_aggregator_1, jobService_1, catalogService_1, validationService_1, businessRuleService_1, guid_1, engineerService_1, aurelia_dialog_1, dataStateSummary_1, dataState_1, taskService_1, arrayHelper_1, chargeServiceConstants_1, applianceOperationType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Appliances = /** @class */ (function (_super) {
        __extends(Appliances, _super);
        function Appliances(labelService, applianceService, router, jobService, engineerService, eventAggregator, dialogService, validationService, businessRuleService, catalogService, appLauncher, configurationService, taskService) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService) || this;
            _this._applianceService = applianceService;
            _this._router = router;
            _this._appLauncher = appLauncher;
            _this._configurationService = configurationService;
            _this._taskService = taskService;
            return _this;
        }
        Appliances.prototype.activateAsync = function (params) {
            var _this = this;
            return this.buildValidation()
                .then(function () { return _this.loadBusinessRules(); })
                .then(function () { return _this.load(); })
                .then(function () { return _this.showContent(); });
        };
        Appliances.prototype.navigateToAppliance = function (id, applianceExcluded) {
            this._router.navigateToRoute("appliance", { applianceId: id });
        };
        Appliances.prototype.newAppliance = function () {
            this._router.navigateToRoute("appliance", { applianceId: guid_1.Guid.empty });
        };
        Appliances.prototype.launchAdapt = function (gcCode, applianceExcluded) {
            this._appLauncher.launchApplication(this._configurationService.getConfiguration().adaptLaunchUri + " " + gcCode);
        };
        Appliances.prototype.excludeAppliance = function (event, id) {
            return __awaiter(this, void 0, void 0, function () {
                var tasks, associatedTasks, dialogResult, shouldDelete;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            event.stopPropagation();
                            return [4 /*yield*/, this._taskService.getTasks(this.jobId)];
                        case 1:
                            tasks = _a.sent();
                            associatedTasks = tasks.filter(function (task) { return task.applianceId === id; });
                            if (!(associatedTasks.length > 0)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.showConfirmation(this.getLabel("objectName"), this.getLabel("delinkApplianceMessage"))];
                        case 2:
                            dialogResult = _a.sent();
                            if (!(dialogResult.wasCancelled === false)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.excludeApp(id)];
                        case 3:
                            _a.sent();
                            if (tasks.some(function (task) { return task.isCharge; })) {
                                this._eventAggregator.publish(chargeServiceConstants_1.ChargeServiceConstants.CHARGE_UPDATE_START, this.jobId);
                            }
                            _a.label = 4;
                        case 4: return [3 /*break*/, 8];
                        case 5: return [4 /*yield*/, this.showConfirmation(this.getLabel("objectName"), this.getLabel("hideQuestion"))];
                        case 6:
                            shouldDelete = _a.sent();
                            if (!shouldDelete) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.excludeApp(id)];
                        case 7:
                            _a.sent();
                            _a.label = 8;
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        Appliances.prototype.loadModel = function () {
            var _this = this;
            /* do not await */ this._applianceService.ensureAdaptInformationIsSynced(this.jobId);
            return this._applianceService.getAppliances(this.jobId)
                .then(function (appliances) {
                appliances = arrayHelper_1.ArrayHelper.sortByColumnDescending(appliances, "dataState");
                return Promise.all(appliances.map(function (app) { return _this.createViewModel(app, appliances); }))
                    .then(function (viewModels) {
                    _this.viewModels = viewModels;
                });
            });
        };
        Appliances.prototype.createViewModel = function (appliance, allAppliances) {
            var _this = this;
            var vm = new applianceSummaryViewModel_1.ApplianceSummaryViewModel();
            vm.appliance = appliance;
            this.setApplianceAggregateDataState(vm);
            this.setContractStatus(vm);
            return this._applianceService.isFullGcCode(appliance.gcCode)
                .then(function (isFullGcCode) {
                vm.isDisplayableGcCode = isFullGcCode;
            })
                .then(function () { return _this.setApplianceDescription(vm); })
                .then(function () { return _this._taskService.getTasks(_this.jobId); })
                .then(function (liveTasks) {
                vm.isAssociatedWithTask = liveTasks.filter(function (task) { return task.applianceId === appliance.id; }).length > 0;
                vm.canExclude = !vm.appliance.parentId && !vm.isUnderContract && !liveTasks.some(function (task) { return task.applianceId === vm.appliance.id && task.sequence > 1; });
                return vm;
            });
        };
        Appliances.prototype.setApplianceAggregateDataState = function (vm) {
            var totals = new dataStateSummary_1.DataStateSummary(vm.appliance).getTotals("appliances");
            vm.aggregateDataState = totals.invalid ? dataState_1.DataState.invalid
                : totals.notVisited ? dataState_1.DataState.notVisited
                    : totals.valid ? dataState_1.DataState.valid
                        : dataState_1.DataState.dontCare;
        };
        Appliances.prototype.setContractStatus = function (vm) {
            var nonContractContractTypes = (this.getBusinessRule("nonContractContractTypes") || "").split(",");
            vm.isUnderContract = !!vm
                && !!vm.appliance
                && !!vm.appliance.contractType
                && !nonContractContractTypes.some(function (nonContractContractType) { return nonContractContractType === vm.appliance.contractType; });
        };
        Appliances.prototype.setApplianceDescription = function (vm) {
            if (vm.appliance.gcCode && vm.isDisplayableGcCode) {
                return this._catalogService.getGCCode(vm.appliance.gcCode)
                    .then(function (gcCode) {
                    vm.applianceDescription = gcCode ? gcCode.gcCodeDescription : vm.appliance.description;
                });
            }
            else {
                vm.applianceDescription = vm.appliance.description;
                return Promise.resolve();
            }
        };
        Appliances.prototype.excludeApp = function (applianceId) {
            return __awaiter(this, void 0, void 0, function () {
                var foundItem, childIndex;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            foundItem = this.viewModels.find(function (vm) { return vm.appliance.id === applianceId; });
                            if (!foundItem) return [3 /*break*/, 4];
                            this.viewModels.splice(this.viewModels.indexOf(foundItem), 1);
                            if (foundItem.appliance.childId) {
                                childIndex = this.viewModels.findIndex(function (child) { return child.appliance.id === foundItem.appliance.childId; });
                                if (childIndex >= 0) {
                                    this.viewModels.splice(childIndex, 1);
                                }
                            }
                            return [4 /*yield*/, this._applianceService.deleteOrExcludeAppliance(this.jobId, applianceId, applianceOperationType_1.ApplianceOperationType.exclude)];
                        case 1:
                            _a.sent();
                            if (!foundItem.appliance.childId) return [3 /*break*/, 3];
                            return [4 /*yield*/, this._applianceService.deleteOrExcludeAppliance(this.jobId, foundItem.appliance.childId, applianceOperationType_1.ApplianceOperationType.exclude)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            this.notifyDataStateChanged();
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        Appliances = __decorate([
            aurelia_dependency_injection_1.inject(labelService_1.LabelService, applianceService_1.ApplianceService, aurelia_router_1.Router, jobService_1.JobService, engineerService_1.EngineerService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService, appLauncher_1.AppLauncher, configurationService_1.ConfigurationService, taskService_1.TaskService),
            __metadata("design:paramtypes", [Object, Object, aurelia_router_1.Router, Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, Object, Object, Object, Object])
        ], Appliances);
        return Appliances;
    }(editableViewModel_1.EditableViewModel));
    exports.Appliances = Appliances;
});

//# sourceMappingURL=appliances.js.map
