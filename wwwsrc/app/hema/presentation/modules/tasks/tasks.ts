import { DialogService } from "aurelia-dialog";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { inject } from "aurelia-dependency-injection";
import { Router } from "aurelia-router";
import { EditableViewModel } from "../../models/editableViewModel";
import { TaskSummaryViewModel } from "../../models/taskSummaryViewModel";
import { IBusinessRuleService } from "../../../business/services/interfaces/IBusinessRuleService";
import { BusinessRuleService } from "../../../business/services/businessRuleService";
import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";
import { CatalogService } from "../../../business/services/catalogService";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { EngineerService } from "../../../business/services/engineerService";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { JobService } from "../../../business/services/jobService";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { LabelService } from "../../../business/services/labelService";
import { ITaskService } from "../../../business/services/interfaces/ITaskService";
import { TaskService } from "../../../business/services/taskService";
import { ITaskFactory } from "../../factories/interfaces/ITaskFactory";
import { TaskFactory } from "../../factories/taskFactory";
import { IValidationService } from "../../../business/services/interfaces/IValidationService";
import { ValidationService } from "../../../business/services/validationService";
import { ChargeServiceConstants } from "../../../business/services/constants/chargeServiceConstants";
import { JobNotDoingReason } from "../../../business/models/jobNotDoingReason";
import * as noUiSlider from "noUiSlider";
import * as wNumb from "wNumb";
import { JobServiceConstants } from "../../../business/services/constants/jobServiceConstants";
import * as moment from "moment";
import { observable } from "aurelia-binding";
import { Threading } from "../../../../common/core/threading";
import { TimeHelper } from "../../../core/timeHelper";
import { TaskBusinessRuleHelper } from "../../../business/models/businessRules/taskBusinessRuleHelper";

const HHMM = "HH:mm";

@inject(TaskService, JobService, EngineerService, Router, TaskFactory,
    LabelService, EventAggregator, DialogService, ValidationService,
    BusinessRuleService, CatalogService)
export class Tasks extends EditableViewModel {

    public tasks: TaskSummaryViewModel[];
    public shouldAllowAddTask: boolean;
    public tasktimes: HTMLElement;

    public showTimeSlider: boolean;
    // endtime will reamin end time of the last task
    @observable
    public endTime: string;
    // when arrived, arrival time becomes startTime
    @observable
    public startTime: string;
    public intervalInMinutes: number;
    public slider: any;

    private _taskService: ITaskService;
    private _router: Router;
    private _taskFactory: ITaskFactory;
    private _jobStateChangedSubscription: Subscription;
    private _taskColors: string[];
    private _lastKnownStartTime: string;
    private _lastKnownEndTime: string;
    private _taskItemBusinessRules: { [key: string]: any };
    private _liveTasks: TaskSummaryViewModel[];

    constructor(taskService: ITaskService,
        jobService: IJobService,
        engineerService: IEngineerService,
        router: Router,
        taskFactory: ITaskFactory,
        labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        validationService: IValidationService,
        businessRuleService: IBusinessRuleService,
        catalogService: ICatalogService) {

        super(jobService, engineerService, labelService, eventAggregator,
            dialogService, validationService, businessRuleService, catalogService);

        this._taskService = taskService;
        this._router = router;
        this._taskFactory = taskFactory;
        this.populateColors();
        this._taskItemBusinessRules = {};
    }

    public async activateAsync(): Promise<void> {
        this._jobStateChangedSubscription = this._eventAggregator.subscribe(
            JobServiceConstants.JOB_STATE_CHANGED,
            () => this.reloadTasks() // todo: could we just reload the page?
                .then(() => this.destroyAndCreateSlider())
        );

        await this.loadCustomBusinessRules();
        await this.reloadTasks();
        this.showContent();
    }

    public async deactivateAsync(): Promise<void> {
        if (this._jobStateChangedSubscription) {
            this._jobStateChangedSubscription.dispose();
        }
    }

    public async attachedAsync(): Promise<void> {
        while (!this.tasks) { // todo: comment this, we need to wait for load to happen
            await Promise.delay(100);
        }
        this.destroyAndCreateSlider();
    }

    public navigateToTask(id: string): void {
        this._router.navigateToRoute("activity", { taskId: id });
    }

    public async deleteTask(event: MouseEvent, task: TaskSummaryViewModel): Promise<void> {
        event.stopPropagation();
        const result = await this.showDeleteConfirmation();
        if (!result) {
            return;
        }
        this.showBusy(this.getLabel("loadingPleaseWait"));

        // get the index of task that is beging deleted
        const index = this._liveTasks.findIndex(x => x.id === task.id);

        await this.saveModel();
        await this._taskService.deleteTask(this.jobId, task.id);
        await this.reloadTasks();
        this.showContent();

        this.destroyAndCreateSlider();
        // index now be next time after task is deleted from array 
        // so no need to do index + 1
        const nextTask = this._liveTasks[index];        
        this.setChargeTimeChangeTrigger(nextTask);

        this._eventAggregator.publish(ChargeServiceConstants.CHARGE_UPDATE_START, this.jobId);
    }

    public newTask(): void {
        this._router.navigateToRoute("task-appliance", { jobId: this.jobId });
    }

    public startTimeChanged(newStartTime: string): void {
        const isValidJobStartTime = (nextStartTime: string) => nextStartTime
            && TimeHelper.isAfter(this._liveTasks[0].endTime, nextStartTime, HHMM);

        if (!this.showTimeSlider || newStartTime === this._lastKnownStartTime) {
            return;
        }

        Threading.nextCycle(() => {
            if (isValidJobStartTime(newStartTime)) {
                const task = this._liveTasks[0];
                task.startTime = this._lastKnownStartTime = newStartTime;
                this.destroyAndCreateSlider();
                // now check the charge time change trigger becouse the change event wont 
                // get fired.
                this.setChargeTimeChangeTrigger(task);
            } else {
                this.startTime = this._lastKnownStartTime;
            }
        });
    }

    public endTimeChanged(newEndTime: string): void {
        const isValidJobEndTime = (nextEndTime: string) => nextEndTime
            && TimeHelper.isAfter(nextEndTime, this._liveTasks[this._liveTasks.length - 1].startTime, HHMM);

        if (!this.showTimeSlider || newEndTime === this._lastKnownEndTime) {
            return;
        }

        Threading.nextCycle(() => {
            if (isValidJobEndTime(newEndTime)) {
                const task = this._liveTasks[this._liveTasks.length - 1];
                task.endTime = this._lastKnownEndTime = newEndTime;
                this.destroyAndCreateSlider();
                // now check the charge time change trigger becouse the change event wont 
                // get fired.                
                this.setChargeTimeChangeTrigger(task);
            } else {
                this.endTime = this._lastKnownEndTime;
            }
        });
    }

    protected async saveModel(): Promise<void> {
        if (this.canEdit && this.showTimeSlider) {
            if (this._liveTasks.find(x => x.chargeableTimeChanged)) {
                this.showInfo(this.getLabel("activityTimeChangedTitle"), this.getLabel("activityTimeChangedDescription"));
                this._eventAggregator.publish(ChargeServiceConstants.CHARGE_UPDATE_START, this.jobId);
            }
            await this._taskService.updateTaskTimes(this.jobId, this._liveTasks);
        }
    }

    private async reloadTasks(): Promise<void> {
        const tasks = await this._taskService.getTasksAndCompletedTasks(this.jobId);
        const job = await this._jobService.getJob(this.jobId);

        const viewModels = tasks.map(task => ({
            ...this._taskFactory.createTaskSummaryViewModel(task),
            isInCancellingStatus: !TaskBusinessRuleHelper.isLiveTask(this._taskItemBusinessRules, task.status)
        }));

        this.tasks = [
            ...viewModels.filter(vm => vm.isMiddlewareDoTodayTask),
            ...viewModels.filter(vm => !vm.isMiddlewareDoTodayTask)
        ];

        this._liveTasks = this.tasks.filter(t => !t.isInCancellingStatus
            && t.isMiddlewareDoTodayTask);

        this._liveTasks.forEach((task, i) => task.color = this._taskColors[i]);

        if (job.onsiteTime // we have onSiteTime if we have arrived
            && this._liveTasks.length > 1) {
            this.showTimeSlider = true;
            this.startTime = this._lastKnownStartTime = this._liveTasks[0].startTime;
            this.endTime = this._lastKnownEndTime = this._liveTasks[this._liveTasks.length - 1].endTime;
        } else {
            this.showTimeSlider = false;
        }

        this.shouldAllowAddTask = job.jobNotDoingReason !== JobNotDoingReason.taskNoAccessed;
    }

    private destroyAndCreateSlider(): void {
        if (!this.showTimeSlider || !this.tasktimes) {
            return;
        }

        if (this.slider) {
            this.slider.destroy();
        }

        this.slider = noUiSlider.create(this.tasktimes, this.getSliderBarOptions());
        const connect = this.tasktimes.querySelectorAll(".noUi-connect");
        for (let i = 0; i < connect.length; i++) {
            (<any>connect[i]).style.background = this._taskColors[i];
        }

        // update gets called when page renders + when user slides the handle
        this.slider.on("update", (values: number[]) => this.updateFromSliderUpdateEvent(values));
        // change gets called when user slide the handle
        this.slider.on("change", (values: number[], handle: any) => this.updateFromSliderChangeEvent(handle));
    }

    // when user slides the handle,
    // it should change duration for current task and one after.
    // this method should only get called when slides the handle.
    private updateFromSliderChangeEvent(handle: any): void {
        const task1 = this._liveTasks[handle];
        this.setChargeTimeChangeTrigger(task1);
        const task2 = this._liveTasks[handle + 1];
        this.setChargeTimeChangeTrigger(task2);
    }

    private updateFromSliderUpdateEvent(sliderCumulativeValues: number[]): void {
        for (let i = 0; i <= sliderCumulativeValues.length; i++) { // note we use <= length, not < length
            const task = this._liveTasks[i];
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
    }

    private setChargeTimeChangeTrigger(task: TaskSummaryViewModel): void {
        // this should only be set from either start/end time change or 
        // user slides the slider. 
        // this must not set when the page is loaded.
        if (task && task.workDuration !== task.chargeableTime) {
            task.chargeableTime = task.workDuration;
            task.chargeableTimeChanged = true;
        }
    }

    private getSliderBarOptions(): any {
        const times: number[] = this.getCumulativeDurations();
        const formatTooltip = wNumb({
            edit: (value: any) => {
                return moment(this.startTime, HHMM)
                    .add(value, "minutes")
                    .format(HHMM);
            }
        });
        return {
            start: times.slice(0, -1), // need all but the last element to build the handles
            connect: times.map(x => true),
            step: this.intervalInMinutes,
            tooltips: times.slice(0, -1).map(x => formatTooltip), // need all but the last element to build the handles
            range: {
                min: 0,
                max: times[times.length - 1]
            },
            format: wNumb({ decimals: 0 })
        };
    }

    private getCumulativeDurations(): number[] {
        const times: number[] = [];

        for (let i = 0; i < this._liveTasks.length; i++) {
            const thisDuration = moment.duration(
                moment(this._liveTasks[i].endTime, HHMM)
                    .diff(moment(this._liveTasks[i].startTime, HHMM))
            ).asMinutes();
            times.push(thisDuration + (times[i - 1] || 0));
        }
        return times;
    }

    private async loadCustomBusinessRules(): Promise<void> {
        const notDoingJobStatuses = "notDoingJobStatuses";
        const notDoingTaskStatuses = "notDoingTaskStatuses";

        const ruleGroup = await this._businessRuleService.getQueryableRuleGroup("taskItem");
        this.intervalInMinutes = ruleGroup.getBusinessRule<number>("intervalInMinutes");
        this._taskItemBusinessRules[notDoingJobStatuses] = ruleGroup.getBusinessRule(notDoingJobStatuses);
        this._taskItemBusinessRules[notDoingTaskStatuses] = ruleGroup.getBusinessRule(notDoingTaskStatuses);
    }

    private populateColors(): void {
        // we assume that there will not be more then 45 activities in one job!
        const colors = [
            "#9E007E",
            "#DFA0C9",
            "#007FA3",
            "#00677F",
            "#6AD1E3",
            "#91D6AC",
            "#F2C75C",
            "#FF8674"
        ];
        this._taskColors = [...colors, ...colors, ...colors, ...colors, ...colors];
    }
}
