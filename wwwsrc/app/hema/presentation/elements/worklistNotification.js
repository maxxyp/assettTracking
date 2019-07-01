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
define(["require", "exports", "aurelia-binding", "aurelia-framework", "../../business/services/engineerService", "../../business/services/jobService", "../../business/services/labelService", "aurelia-event-aggregator", "../../business/models/jobState", "../../business/services/constants/workRetrievalServiceConstants", "../../../common/core/stringHelper", "../../../common/core/objectHelper", "../../business/services/constants/engineerServiceConstants", "../../../common/ui/attributes/constants/attributeConstants", "../../business/services/workRetrievalTracker", "../../../common/analytics/analyticsConstants"], function (require, exports, aurelia_binding_1, aurelia_framework_1, engineerService_1, jobService_1, labelService_1, aurelia_event_aggregator_1, jobState_1, workRetrievalServiceConstants_1, stringHelper_1, objectHelper_1, engineerServiceConstants_1, attributeConstants_1, workRetrievalTracker_1, analyticsConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WORKLIST_RETRIVAL_LABEL = "Worklist Retrival";
    var WorklistNotification = /** @class */ (function () {
        function WorklistNotification(labelService, eventAggregator, jobService, engineerService, workRetrievalTracker) {
            this._eventAggregator = eventAggregator;
            this._jobService = jobService;
            this._engineerService = engineerService;
            this._labelService = labelService;
            this.labels = {};
            this.tracker = workRetrievalTracker;
            this._subscriptions = [];
        }
        WorklistNotification.prototype.attached = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this;
                            return [4 /*yield*/, this._labelService.getGroup(stringHelper_1.StringHelper.toCamelCase(objectHelper_1.ObjectHelper.getClassName(this)))];
                        case 1:
                            _a.labels = _b.sent();
                            this._subscriptions = [
                                this._eventAggregator.subscribe(engineerServiceConstants_1.EngineerServiceConstants.ENGINEER_STATUS_CHANGED, function () { return _this.update(); }),
                                this._eventAggregator.subscribe(workRetrievalServiceConstants_1.WorkRetrievalServiceConstants.REFRESH_START_STOP, function () { return _this.update(); }),
                                this._eventAggregator.subscribe(attributeConstants_1.AttributeConstants.FULL_SCREEN_TOGGLE, function (isFullScreen) { return _this.isFullScreen = window.isFullScreen; })
                            ];
                            return [4 /*yield*/, this.updateList()];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, this.update()];
                        case 3:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WorklistNotification.prototype.detached = function () {
            this._subscriptions.forEach(function (s) { return s.dispose(); });
        };
        WorklistNotification.prototype.triggerWorklistRetrieval = function () {
            this._eventAggregator.publish(workRetrievalServiceConstants_1.WorkRetrievalServiceConstants.REQUEST_WORK_AND_REFRESH_WORK_LIST);
            this._eventAggregator.publish(analyticsConstants_1.AnalyticsConstants.ANALYTICS_EVENT, {
                category: analyticsConstants_1.AnalyticsConstants.WORKLIST_RETRIVAL_CATEGORY,
                action: analyticsConstants_1.AnalyticsConstants.CLICK_ACTION,
                label: WORKLIST_RETRIVAL_LABEL,
                metric: analyticsConstants_1.AnalyticsConstants.METRIC
            });
        };
        WorklistNotification.prototype.refreshAfterNewWorklist = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.updateList()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.update()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WorklistNotification.prototype.update = function () {
            return __awaiter(this, void 0, void 0, function () {
                var getTime, jobsToDo, liveJobs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            getTime = function (date) { return date ? date.getTime() : 0; };
                            return [4 /*yield*/, this._engineerService.isWorking()];
                        case 1:
                            if (!!(_a.sent())) return [3 /*break*/, 2];
                            this.status = "NOT_WORKING";
                            return [3 /*break*/, 9];
                        case 2:
                            if (!this.tracker.requestingStatus) return [3 /*break*/, 3];
                            this.status = "REQUESTING";
                            return [3 /*break*/, 9];
                        case 3:
                            if (!(getTime(this.tracker.lastFailedTime) > getTime(this.tracker.lastRequestTime))) return [3 /*break*/, 4];
                            this.status = "FAILED_WORKLIST";
                            return [3 /*break*/, 9];
                        case 4:
                            if (!(this._lastKnownUpdatedTime && getTime(this.tracker.lastUpdatedTime) !== getTime(this._lastKnownUpdatedTime))) return [3 /*break*/, 5];
                            this.status = "NEW_WORKLIST";
                            return [3 /*break*/, 9];
                        case 5:
                            if (!(getTime(this.tracker.lastUpdatedTime) !== getTime(this._lastKnownUpdatedTime))) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.updateList()];
                        case 6:
                            _a.sent();
                            _a.label = 7;
                        case 7:
                            this.status = "NORMAL";
                            return [4 /*yield*/, this._jobService.getJobsToDo()];
                        case 8:
                            jobsToDo = (_a.sent()) || [];
                            liveJobs = jobsToDo.filter(function (x) { return x.state !== jobState_1.JobState.done; });
                            this.jobsTodoCount = liveJobs.length;
                            this.activitiesCount = liveJobs.map(function (job) { return (job.tasks || []).length; })
                                .reduce(function (prev, curr) { return prev + curr; }, 0);
                            _a.label = 9;
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        WorklistNotification.prototype.updateList = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this._lastKnownUpdatedTime = this.tracker.lastUpdatedTime;
                            if (!!!this.jobRefreshFn) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.jobRefreshFn()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Function)
        ], WorklistNotification.prototype, "jobRefreshFn", void 0);
        WorklistNotification = __decorate([
            aurelia_framework_1.customElement("worklist-notification"),
            aurelia_framework_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, jobService_1.JobService, engineerService_1.EngineerService, workRetrievalTracker_1.WorkRetrievalTracker),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator, Object, Object, workRetrievalTracker_1.WorkRetrievalTracker])
        ], WorklistNotification);
        return WorklistNotification;
    }());
    exports.WorklistNotification = WorklistNotification;
});

//# sourceMappingURL=worklistNotification.js.map
