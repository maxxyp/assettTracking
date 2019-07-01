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
define(["require", "exports", "aurelia-framework", "aurelia-router", "../../../business/services/taskService", "../../../business/services/labelService", "aurelia-event-aggregator", "../../models/editableViewModel", "../../../business/services/catalogService", "../../../business/services/businessRuleService", "../../../business/services/validationService", "../../../business/services/jobService", "../../../business/models/dataState", "../../../business/services/engineerService", "aurelia-dialog", "../../../business/services/constants/jobServiceConstants", "../../../../common/ui/services/animationService", "../../factories/taskFactory", "../../services/pageService", "../../../../common/core/objectHelper"], function (require, exports, aurelia_framework_1, aurelia_router_1, taskService_1, labelService_1, aurelia_event_aggregator_1, editableViewModel_1, catalogService_1, businessRuleService_1, validationService_1, jobService_1, dataState_1, engineerService_1, aurelia_dialog_1, jobServiceConstants_1, animationService_1, taskFactory_1, pageService_1, objectHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TaskMain = /** @class */ (function (_super) {
        __extends(TaskMain, _super);
        function TaskMain(jobService, engineerService, taskService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService, animationService, taskFactory, pageService) {
            var _this = _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService) || this;
            _this._taskService = taskService;
            _this._animationService = animationService;
            _this.taskIds = [];
            _this._taskSubscriptions = [];
            _this._taskFactory = taskFactory;
            _this.isFullScreen = window.isFullScreen;
            _this._pageService = pageService;
            return _this;
        }
        TaskMain.prototype.configureRouter = function (config, childRouter) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            this.router = childRouter;
            this._landingPage = (args &&
                args.length >= 3 &&
                args[2] instanceof aurelia_router_1.NavigationInstruction &&
                args[2].params &&
                args[2].params.taskId) ?
                this._pageService.getLastVisitedPage(objectHelper_1.ObjectHelper.getClassName(this), args[2].params.taskId) || "details" :
                "details";
            this.setupChildRoutes();
            config.map(this._childRoutes);
        };
        TaskMain.prototype.activateAsync = function (params) {
            var _this = this;
            this.jobId = params.jobId;
            this.taskId = params.taskId;
            return this.loadBusinessRules()
                .then(function () { return _this.load(); })
                .then(function () { return _this.showContent(); });
        };
        TaskMain.prototype.deactivateAsync = function () {
            this._taskSubscriptions.forEach(function (subscription) {
                subscription.dispose();
            });
            return Promise.resolve();
        };
        TaskMain.prototype.navigateToRoute = function (name) {
            this.router.navigateToRoute(name);
        };
        TaskMain.prototype.swipeFunction = function (swipeDirection) {
            var _this = this;
            if (swipeDirection === "left") {
                this._animationService.swipe(this.card, this.taskIds, this._itemPosition, swipeDirection, "slide-in-right", "slide-out-left", 300).then(function (position) {
                    _this.router.parent.navigate(_this.router.parent.currentInstruction.fragment.replace(_this.taskIds[_this._itemPosition], _this.taskIds[position]));
                    _this._itemPosition = position;
                })
                    .catch();
            }
            else {
                this._animationService.swipe(this.card, this.taskIds, this._itemPosition, swipeDirection, "slide-in-left", "slide-out-right", 300).then(function (position) {
                    _this.router.parent.navigate(_this.router.parent.currentInstruction.fragment.replace(_this.taskIds[_this._itemPosition], _this.taskIds[position]));
                    _this._itemPosition = position;
                })
                    .catch();
            }
        };
        TaskMain.prototype.changeApplianceType = function (event) {
            event.stopPropagation();
            this.router.navigateToRoute("task-appliance", { jobId: this.jobId, taskId: this.taskId });
        };
        TaskMain.prototype.loadModel = function () {
            var _this = this;
            return Promise.all([
                this.loadTasks(this.jobId),
                this._jobService.getJob(this.jobId)
            ])
                .then(function (_a) {
                var task = _a[0], job = _a[1];
                if (task) {
                    _this.isDoTodayTask = task.isMiddlewareDoTodayTask;
                    _this.actionType = task.jobType;
                    _this._taskSubscriptions.push(_this._eventAggregator.subscribe(jobServiceConstants_1.JobServiceConstants.JOB_DATA_STATE_CHANGED, function () { return _this.updateDataState(); }));
                    _this.updateDataState();
                }
            });
        };
        TaskMain.prototype.setupChildRoutes = function () {
            this._childRoutes = [
                {
                    route: "",
                    redirect: this._landingPage
                },
                {
                    route: "details",
                    moduleId: "hema/presentation/modules/tasks/taskItem",
                    name: "details",
                    nav: true,
                    title: "Details",
                    settings: {
                        tabGroupParent: "activities",
                        dataState: dataState_1.DataState.notVisited,
                        canEditCancelledJob: true,
                        hideIfNotDoToday: true
                    }
                },
                {
                    route: "previous-activities",
                    moduleId: "hema/presentation/modules/tasks/taskVisitDetails",
                    name: "previous-activities",
                    nav: true,
                    title: "Previous Visits",
                    settings: {
                        tabGroupParent: "activities",
                        dataState: dataState_1.DataState.dontCare,
                        canEditCancelledJob: true,
                        hideIfNotDoToday: false
                    }
                }
            ];
        };
        TaskMain.prototype.updateDataState = function () {
            var _this = this;
            this._taskService.getTaskItem(this.jobId, this.taskId)
                .then(function (task) {
                if (task) {
                    var detailsRoute = _this._childRoutes.find(function (r) { return r.route === "details"; });
                    if (detailsRoute) {
                        detailsRoute.settings.dataState = task.dataState;
                    }
                }
            });
        };
        TaskMain.prototype.loadTasks = function (jobId) {
            var _this = this;
            return this._taskService.getTasksAndCompletedTasks(jobId)
                .then(function (tasks) {
                if (tasks) {
                    _this.taskIds = tasks.map(function (t) { return t.id; });
                    _this._itemPosition = _this.taskIds.indexOf(_this.taskId);
                    var currentTask = tasks.find(function (x) { return x.id === _this.taskId; });
                    if (currentTask) {
                        _this.applianceId = currentTask.applianceId;
                        _this.applianceType = currentTask.applianceType;
                        _this.chargeType = currentTask.chargeType;
                        var summary = _this._taskFactory.createTaskSummaryViewModel(currentTask);
                        if (summary) {
                            _this.visitCount = summary.visitCount;
                        }
                    }
                    _this.currentTask = currentTask;
                    return currentTask;
                }
                else {
                    return undefined;
                }
            });
        };
        TaskMain = __decorate([
            aurelia_framework_1.inject(jobService_1.JobService, engineerService_1.EngineerService, taskService_1.TaskService, labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService, animationService_1.AnimationService, taskFactory_1.TaskFactory, pageService_1.PageService),
            __metadata("design:paramtypes", [Object, Object, Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, Object, Object, Object, Object])
        ], TaskMain);
        return TaskMain;
    }(editableViewModel_1.EditableViewModel));
    exports.TaskMain = TaskMain;
});

//# sourceMappingURL=taskMain.js.map
