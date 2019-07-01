/// <reference path="./../../../../../typings/app.d.ts" />

import { inject } from "aurelia-framework";
import { Router, RouterConfiguration, RouteConfig, NavigationInstruction } from "aurelia-router";
import { ITaskService } from "../../../business/services/interfaces/ITaskService";
import { TaskService } from "../../../business/services/taskService";
import { LabelService } from "../../../business/services/labelService";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { EditableViewModel } from "../../models/editableViewModel";
import { CatalogService } from "../../../business/services/catalogService";
import { BusinessRuleService } from "../../../business/services/businessRuleService";
import { ValidationService } from "../../../business/services/validationService";
import { JobService } from "../../../business/services/jobService";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { IBusinessRuleService } from "../../../business/services/interfaces/IBusinessRuleService";
import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";
import { IValidationService } from "../../../business/services/interfaces/IValidationService";
import { DataState } from "../../../business/models/dataState";
import { EngineerService } from "../../../business/services/engineerService";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { DialogService } from "aurelia-dialog";
import { JobServiceConstants } from "../../../business/services/constants/jobServiceConstants";
import { AnimationService } from "../../../../common/ui/services/animationService";
import { IAnimationService } from "../../../../common/ui/services/IAnimationService";
import { Task } from "../../../business/models/task";
import { ITaskFactory } from "../../factories/interfaces/ITaskFactory";
import { TaskFactory } from "../../factories/taskFactory";
import {IPageService} from "../../services/interfaces/IPageService";
import {PageService} from "../../services/pageService";
import { ObjectHelper } from "../../../../common/core/objectHelper";

@inject(JobService, EngineerService, TaskService, LabelService, EventAggregator, DialogService, ValidationService, BusinessRuleService, CatalogService, AnimationService, TaskFactory, PageService)
export class TaskMain extends EditableViewModel {
    public router: Router;

    public jobId: string;
    public taskId: string;
    public currentTask: Task;
    public actionType: string;
    public taskIds: string[];
    public applianceId: string;
    public applianceType: string;
    public chargeType: string;
    public card: HTMLElement;
    public visitCount: number;
    public isFullScreen: boolean;
    public isDoTodayTask: boolean;

    private _childRoutes: RouteConfig[];

    private _taskService: ITaskService;
    private _itemPosition: number;
    private _animationService: IAnimationService;
    private _taskSubscriptions: Subscription[];
    private _taskFactory: ITaskFactory;
    private _pageService: IPageService;
    private _landingPage: string;

    constructor(jobService: IJobService,
        engineerService: IEngineerService,
        taskService: ITaskService,
        labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        validationService: IValidationService,
        businessRuleService: IBusinessRuleService,
        catalogService: ICatalogService,
        animationService: IAnimationService,
        taskFactory: ITaskFactory,
        pageService: IPageService) {
        super(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService);
        this._taskService = taskService;
        this._animationService = animationService;
        this.taskIds = [];
        this._taskSubscriptions = [];
        this._taskFactory = taskFactory;
        this.isFullScreen = window.isFullScreen;
        this._pageService = pageService;
    }

    public configureRouter(config: RouterConfiguration, childRouter: Router, ...args: any[]): void {
        this.router = childRouter;
        this._landingPage = (args && 
                                args.length >= 3 && 
                                args[2] instanceof NavigationInstruction && 
                                (<NavigationInstruction> args[2]).params && 
                                (<NavigationInstruction> args[2]).params.taskId) ? 
                                    this._pageService.getLastVisitedPage(ObjectHelper.getClassName(this), (<NavigationInstruction> args[2]).params.taskId) || "details" :
                                    "details";
        this.setupChildRoutes();
        config.map(this._childRoutes);
    }

    public activateAsync(params: { jobId: string, taskId: string }): Promise<void> {
        this.jobId = params.jobId;
        this.taskId = params.taskId;

        return this.loadBusinessRules()
            .then(() => this.load())
            .then(() => this.showContent());
    }

    public deactivateAsync(): Promise<void> {
        this._taskSubscriptions.forEach(subscription => {
            subscription.dispose();
        });
        return Promise.resolve();
    }

    public navigateToRoute(name: string): void {
        this.router.navigateToRoute(name);
    }
    public swipeFunction(swipeDirection: string): void {
        if (swipeDirection === "left") {
            this._animationService.swipe(this.card, this.taskIds, this._itemPosition, swipeDirection, "slide-in-right", "slide-out-left", 300).then((position) => {
                this.router.parent.navigate(this.router.parent.currentInstruction.fragment.replace(this.taskIds[this._itemPosition], this.taskIds[position]));
                this._itemPosition = position;
            })
                .catch();
        } else {
            this._animationService.swipe(this.card, this.taskIds, this._itemPosition, swipeDirection, "slide-in-left", "slide-out-right", 300).then((position) => {
                this.router.parent.navigate(this.router.parent.currentInstruction.fragment.replace(this.taskIds[this._itemPosition], this.taskIds[position]));
                this._itemPosition = position;
            })
                .catch();
        }
    }

    public changeApplianceType(event: MouseEvent): void {
        event.stopPropagation();
        this.router.navigateToRoute("task-appliance", { jobId: this.jobId, taskId: this.taskId });
    }

    protected loadModel(): Promise<void> {
        return Promise.all([
            this.loadTasks(this.jobId),
            this._jobService.getJob(this.jobId)
        ])
            .then(([task, job]) => {
                if (task) {
                    this.isDoTodayTask = task.isMiddlewareDoTodayTask;
                    this.actionType = task.jobType;
                    this._taskSubscriptions.push(
                        this._eventAggregator.subscribe(JobServiceConstants.JOB_DATA_STATE_CHANGED, () => this.updateDataState())
                    );
                    this.updateDataState();
                }
            });
    }

    private setupChildRoutes(): void {
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
                    dataState: DataState.notVisited,
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
                    dataState: DataState.dontCare,
                    canEditCancelledJob: true,
                    hideIfNotDoToday: false
                }
            }
        ];
    }

    private updateDataState(): void {
        this._taskService.getTaskItem(this.jobId, this.taskId)
            .then((task) => {
                if (task) {
                    let detailsRoute = this._childRoutes.find(r => r.route === "details");
                    if (detailsRoute) {
                        detailsRoute.settings.dataState = task.dataState;
                    }
                }
            });
    }

    private loadTasks(jobId: string): Promise<Task> {
        return this._taskService.getTasksAndCompletedTasks(jobId)
            .then(tasks => {
                if (tasks) {
                    this.taskIds = tasks.map(t => t.id);
                    this._itemPosition = this.taskIds.indexOf(this.taskId);
                    let currentTask = tasks.find(x => x.id === this.taskId);
                    if (currentTask) {
                        this.applianceId = currentTask.applianceId;
                        this.applianceType = currentTask.applianceType;
                        this.chargeType = currentTask.chargeType;
                        let summary = this._taskFactory.createTaskSummaryViewModel(currentTask);
                        if (summary) {
                            this.visitCount = summary.visitCount;
                        }
                    }
                    this.currentTask = currentTask;
                    return currentTask;
                } else {
                    return undefined;
                }
            });
    }
}
