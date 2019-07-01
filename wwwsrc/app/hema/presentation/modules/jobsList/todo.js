/// <reference path="../../../../../typings/app.d.ts" />
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
define(["require", "exports", "aurelia-framework", "../../models/baseViewModel", "../../../business/services/jobService", "../../../business/services/labelService", "aurelia-event-aggregator", "aurelia-dialog", "../../../business/models/jobState", "../../../business/services/featureToggleService", "../../../business/services/constants/jobServiceConstants"], function (require, exports, aurelia_framework_1, baseViewModel_1, jobService_1, labelService_1, aurelia_event_aggregator_1, aurelia_dialog_1, jobState_1, featureToggleService_1, jobServiceConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Todo = /** @class */ (function (_super) {
        __extends(Todo, _super);
        function Todo(labelService, eventAggregator, dialogService, jobService, featureToggleService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this._jobService = jobService;
            _this._subscriptions = [];
            _this.isAssetTracked = featureToggleService.isAssetTrackingEnabled();
            return _this;
        }
        Todo.prototype.activateAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    this._subscriptions.push(this._eventAggregator.subscribe(jobServiceConstants_1.JobServiceConstants.JOB_COMPLETION_REFRESH, function () { return _this.updateJobs(); }));
                    this.showContent();
                    return [2 /*return*/];
                });
            });
        };
        Todo.prototype.deactivateAsync = function () {
            this._subscriptions.forEach(function (s) { return s.dispose(); });
            this._subscriptions = [];
            return Promise.resolve();
        };
        Todo.prototype.updateJobs = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, jobsToDo, jobApiFailures, activeJobs, errorJobs;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this._jobService.getJobsToDo(),
                                this._jobService.getWorkListJobApiFailures()
                            ])];
                        case 1:
                            _a = _b.sent(), jobsToDo = _a[0], jobApiFailures = _a[1];
                            activeJobs = (jobsToDo || [])
                                .filter(function (j) { return j.state !== jobState_1.JobState.done; })
                                .map(function (job) { return ({ isError: false, data: job }); });
                            errorJobs = (jobApiFailures || [])
                                .map(function (error) { return ({ isError: true, data: error }); });
                            this.jobs = activeJobs.concat(errorJobs).sort(function (a, b) { return a.data.position < b.data.position ? -1 : 1; });
                            return [2 /*return*/];
                    }
                });
            });
        };
        Todo = __decorate([
            aurelia_framework_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, jobService_1.JobService, featureToggleService_1.FeatureToggleService),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object])
        ], Todo);
        return Todo;
    }(baseViewModel_1.BaseViewModel));
    exports.Todo = Todo;
});

//# sourceMappingURL=todo.js.map
