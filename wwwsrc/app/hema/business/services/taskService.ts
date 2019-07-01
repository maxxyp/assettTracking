/// <reference path="../../../../typings/app.d.ts" />

import { inject } from "aurelia-framework";
import { ITaskService } from "./interfaces/ITaskService";
import { IJobService } from "./interfaces/IJobService";
import { JobService } from "./jobService";
import { Task as TaskBusinessModel } from "../models/task";
import { BusinessException } from "../models/businessException";
import { IBusinessRuleService } from "../services/interfaces/IBusinessRuleService";
import { BusinessRuleService } from "../services/businessRuleService";
import { Job } from "../models/job";
import { QueryableBusinessRuleGroup } from "../models/businessRules/queryableBusinessRuleGroup";
import { TaskBusinessRuleHelper } from "../models/businessRules/taskBusinessRuleHelper";
import { DataStateManager } from "../../common/dataStateManager";
import { IDataStateManager } from "../../common/IDataStateManager";
import { PartService } from "./partService";
import { IPartService } from "./interfaces/IPartService";
import { TaskSummaryViewModel } from "../../presentation/models/taskSummaryViewModel";
import { PropertySafetyType } from "../models/propertySafetyType";
import { EventAggregator } from "aurelia-event-aggregator";
import { UiConstants } from "../../../common/ui/elements/constants/uiConstants";
import { IToastItem } from "../../../common/ui/elements/models/IToastItem";
import { Guid } from "../../../common/core/guid";
import * as moment from "moment";

@inject(JobService, BusinessRuleService, DataStateManager, PartService, EventAggregator)
export class TaskService implements ITaskService {

    private _jobService: IJobService;
    private _partService: IPartService;
    private _businessRulesService: IBusinessRuleService;
    private _dataStateManager: IDataStateManager;
    private _eventAggregator: EventAggregator;

    constructor(jobService: IJobService, businessRulesService: IBusinessRuleService,
        dataStateManager: IDataStateManager,
        partService: IPartService,
        eventAggregator: EventAggregator) {
        this._jobService = jobService;
        this._businessRulesService = businessRulesService;
        this._dataStateManager = dataStateManager;
        this._partService = partService;
        this._eventAggregator = eventAggregator;
    }

    public getTasks(jobId: string): Promise<TaskBusinessModel[]> {
        return this._jobService.getJob(jobId)
            .then(job => {
                return job.tasks;
            })
            .catch(ex => {
                throw new BusinessException(this, "activities", "could not get activities", null, ex);
            });
    }

    public getTasksAndCompletedTasks(jobId: string): Promise<TaskBusinessModel[]> {
        return this._jobService.getJob(jobId)
            .then(job => {
                return Job.getTasksAndCompletedTasks(job);
            })
            .catch(ex => {
                throw new BusinessException(this, "activities", "could not get all activities", null, ex);
            });
    }

    public getAllTasksEverAtProperty(jobId: string): Promise<TaskBusinessModel[]> {
        return this._jobService.getJob(jobId)
            .then(job => {
                return Job.getTasksAndCompletedTasks(job).concat(job.history.tasks || []);
            })
            .catch(ex => {
                throw new BusinessException(this, "activities", "could not get activities", null, ex);
            });
    }

    public getTaskItem(jobId: string, taskId: string): Promise<TaskBusinessModel> {
        return this.getTasksAndCompletedTasks(jobId)
            .then(tasks => tasks.find(t => t.id === taskId))
            .catch(ex => {
                throw new BusinessException(this, "activities", "could not get activity", null, ex);
            });

    }

    public updateTaskAppliance(jobId: string, taskId: string, applianceType: string, newApplianceId: string, actionType: string, chargeType: string): Promise<TaskBusinessModel> {
        return this._jobService.getJob(jobId).then((job) => {
            if (job) {
                let currentTask = job.tasks.find(x => x.id === taskId);
                if (currentTask) {
                    return this._businessRulesService.getQueryableRuleGroup("chargeService")
                        .then((ruleGroup: QueryableBusinessRuleGroup) => TaskBusinessModel.isChargeableTask(chargeType, ruleGroup.getBusinessRule<string>("noChargePrefix")))
                        .then((isChargeableTask: boolean) => {
                            currentTask.applianceType = applianceType;
                            currentTask.applianceId = newApplianceId;
                            currentTask.jobType = actionType;
                            currentTask.chargeType = chargeType;
                            currentTask.isCharge = isChargeableTask;
                            this.checkLandlordJob(job);
                            return this._dataStateManager.updateAppliancesDataState(job)
                                .then(() => this._dataStateManager.updatePropertySafetyDataState(job))
                                .then(() => this._jobService.setJob(job))
                                .then(() => currentTask)
                                .catch((err) => { throw new BusinessException(this, "updateTask", "error saving task detail", null, err); });
                        });
                }
                throw new BusinessException(this, "updateTaskAppliance", "no current task found", null, null);
            }
            throw new BusinessException(this, "updateTaskAppliance", "no current job selected", null, null);
        });
    }

    public async deleteTask(jobId: string, taskId: string): Promise<void> {

        const job = await this._jobService.getJob(jobId);
            if (job) {
                let currentTaskIndex = job.tasks.findIndex(task => task.id === taskId);
                if (currentTaskIndex !== -1) {
                    try {
                        // todo: tidy up
                    const deletedTasksArray = job.tasks.splice(currentTaskIndex, 1);
                    const deletedTask = deletedTasksArray[0];
                    await this.removeTaskFromTimeLine(deletedTask, job);

                        await this.populateAppointment(job);
                        await this._dataStateManager.updateAppliancesDataState(job);
                        this._dataStateManager.updatePropertySafetyDataState(job);
                        await this._partService.deletePartsAssociatedWithTask(jobId, taskId);
                        await this._jobService.setJobNoAccessed(job);
                        await this._jobService.setJob(job);
                    } catch (error) {
                        throw new BusinessException(this, "deleteTask", "error saving task detail", null, error);
                    }
                } else {
                    throw new BusinessException(this, "deleteTask", "no current task found", null, null);
                }
            } else {
                throw new BusinessException(this, "deleteTask", "no current job selected", null, null);
        }
    }

    public async createTask(jobId: string, newTask: TaskBusinessModel): Promise<void> {

        const job = await this._jobService.getJob(jobId);
        if (job) {
            job.tasks = job.tasks || [];
            const maxExistingOrderNo = Math.max(...job.tasks.map(task => task.orderNo || 0));
            newTask.orderNo = maxExistingOrderNo + 1;

            const ruleGroup = await this._businessRulesService.getRuleGroup("taskItem");
            const liveTasks = job.tasks.filter(task => !TaskBusinessRuleHelper.isNotDoingTaskStatus(ruleGroup, task.status));

            const previousLiveTask = liveTasks[liveTasks.length - 1];
            newTask.startTime = previousLiveTask
                ? previousLiveTask.endTime
                : moment(job.onsiteTime).format("HH:mm");

            newTask.endTime = moment(newTask.startTime, "HH:mm")
                .add(ruleGroup.intervalInMinutes, "minutes") // todo: business rule
                .format("HH:mm");

            job.tasks.push(newTask);
            this.updateAdvise(job, job.tasks[0]);
            return this._jobService.setJobNoAccessed(job)
                .then(() => this._dataStateManager.updatePropertySafetyDataState(job))
                .then(() => this._jobService.setJob(job))
                .catch((err) => {
                    throw new BusinessException(this, "createTask", "error creating task", null, err);
                });
        } else {
            throw new BusinessException(this, "createTask", "no current job selected", null, null);
        }
    }

    public async updateTaskTimes(jobId: string, taskTimes: TaskSummaryViewModel[]): Promise<void> {
        let job = await this._jobService.getJob(jobId);
        if (job) {
            job.tasks.forEach(task => {
                const time = taskTimes.find(x => x.id === task.id);
                if (time) {
                    task.startTime = time.startTime;
                    task.endTime = time.endTime;
                    task.workDuration = time.workDuration;
                    task.chargeableTime = time.chargeableTime;
                }
            });
            await this._jobService.setJob(job);
        } else {
            throw new BusinessException(this, "updateTaskTimes", "no current job selected", null, null);
        }
    }

    public async saveTask(jobId: string, updatedTask: TaskBusinessModel): Promise<void> {
        const job = await this._jobService.getJob(jobId);
        if (!job) {
            throw new BusinessException(this, "saveTask", "no current job selected", null, null);
        }
        let task = job.tasks.find(x => x.id === updatedTask.id);
        task.report = updatedTask.report;
        task.chirpCodes = updatedTask.chirpCodes;
        task.workedOnCode = updatedTask.workedOnCode;
        task.activity = updatedTask.activity;
        task.productGroup = updatedTask.productGroup;
        task.partType = updatedTask.partType;
        task.faultActionCode = updatedTask.faultActionCode;

        task.endTime = updatedTask.endTime;
        task.startTime = updatedTask.startTime;
        task.workDuration = updatedTask.workDuration;
        task.chargeableTime = updatedTask.chargeableTime;

        task.dataState = updatedTask.dataState;
        task.isPartLJReportable = updatedTask.isPartLJReportable;

        const taskItemRules = await this._businessRulesService.getRuleGroup("taskItem");
        const previouslyIsLive = !TaskBusinessRuleHelper.isNotDoingTaskStatus(taskItemRules, task.status);
        const currentlyIsLive = !TaskBusinessRuleHelper.isNotDoingTaskStatus(taskItemRules, updatedTask.status);
        
        task.status = updatedTask.status;
        task.isFirstVisit = updatedTask.isFirstVisit;
        task.showMainPartSelectedWithInvalidActivityTypeMessage = updatedTask.showMainPartSelectedWithInvalidActivityTypeMessage;
        task.showMainPartSelectedWithInvalidProductGroupTypeMessage = updatedTask.showMainPartSelectedWithInvalidProductGroupTypeMessage;
        task.showMainPartSelectedWithInvalidPartTypeMessage = updatedTask.showMainPartSelectedWithInvalidPartTypeMessage;
        task.hasMainPart = updatedTask.hasMainPart;
        task.mainPartPartType = updatedTask.mainPartPartType;
        this.updateAdvise(job, updatedTask);
        try {

            // only one task can actively noAccess a job
            task.isTaskThatSetsJobAsNoAccessed = !job.tasks.some(t => t.id !== updatedTask.id && t.isTaskThatSetsJobAsNoAccessed)
                && TaskBusinessRuleHelper.isNotDoingJobStatus(taskItemRules, updatedTask.status);
            task.isNotDoingTask = !currentlyIsLive;
            await this._jobService.setJobNoAccessed(job);            

            if (previouslyIsLive && !currentlyIsLive) {
                await this.removeTaskFromTimeLine(task, job);
            } else if (!previouslyIsLive && currentlyIsLive || task.isTaskThatSetsJobAsNoAccessed) {
                await this.rebuildTaskTimes(job);
            }

            this.checkLandlordJob(job);

            await this.populateAppointment(job);
            await this._dataStateManager.updateAppliancesDataState(job);
            this._dataStateManager.updatePropertySafetyDataState(job);            
            await this._jobService.setJob(job);
        } catch (error) {
            throw new BusinessException(this, "saveTask", "error saving task detail", null, error);
        }
    }

    public async buildReinstatedTaskTimes(
        currentTask: { startTime: string, endTime: string, orderNo: number, workDuration: number, chargeableTime: number},
        jobId: string): Promise<{ startTime: string, endTime: string, workDuration: number, chargeableTime: number}> {

        const job = await this._jobService.getJob(jobId); // todo: can this be safely got from this.viewModel.job instead?
        const ruleGroup = await this._businessRulesService.getRuleGroup("taskItem");
        const liveTasks = job.tasks.filter(task => !TaskBusinessRuleHelper.isNotDoingTaskStatus(ruleGroup, task.status));

        const previousSiblings = liveTasks.filter(liveTask => liveTask.orderNo < currentTask.orderNo);
        const subsequentSiblings = liveTasks.filter(liveTask => liveTask.orderNo > currentTask.orderNo);

        const previousSibling = previousSiblings[previousSiblings.length - 1];
        const subsequentSibling = subsequentSiblings[0];

        const startTime = previousSibling
            ? previousSibling.endTime
            : subsequentSibling
                ? subsequentSibling.startTime
                : moment(job.onsiteTime).format("HH:mm");

        return {
            startTime,
            endTime: this.addMinutes(startTime, 1),
            workDuration: 1,
            chargeableTime: 1
        };
    }

    // todo: refator signature
    public async rebuildTaskTimes(job: Job): Promise<void> {
        const ruleGroup = await this._businessRulesService.getRuleGroup("taskItem");
        const liveTasks = job.tasks.filter(task => !TaskBusinessRuleHelper.isNotDoingTaskStatus(ruleGroup, task.status));

        liveTasks.forEach((task, index, tasks) => {
            task.startTime = tasks[index - 1] && tasks[index - 1].endTime || moment(job.onsiteTime).format("HH:mm");
            task.endTime = this.addMinutes(task.startTime, task.workDuration || 1);
        });
    }

    private async removeTaskFromTimeLine(removedTask: TaskBusinessModel, job: Job): Promise<void> {
        const ruleGroup = await this._businessRulesService.getRuleGroup("taskItem");
        const otherLiveSiblings = job.tasks
            .filter(task => task.id !== removedTask.id
                            && !TaskBusinessRuleHelper.isNotDoingTaskStatus(ruleGroup, task.status));

        const laterSiblings = otherLiveSiblings.filter(liveTask => liveTask.orderNo > removedTask.orderNo);

        laterSiblings.forEach(laterSibling => {
            laterSibling.startTime = this.addMinutes(laterSibling.startTime, -1 * removedTask.workDuration);
            laterSibling.endTime = this.addMinutes(laterSibling.endTime, -1 * removedTask.workDuration);
        });

        // todo: difficult to use undefined for time values that are bound to timeRangePicker because that will default the times to 00:00
        //  by the time the user leaves the page
        removedTask.startTime = "00:00";
        removedTask.endTime = "00:00";
        removedTask.workDuration = 0;
        removedTask.chargeableTime = 0;

        // edge case: for the slider to remain sane, we must have at least one minute on a multi-visit job.
        //  for this edge case to kick in we must be deleting/XBing the only task on the job which has minutes,
        //  and all the others have to have 0 at the time of deleting
        if (otherLiveSiblings.length && otherLiveSiblings.every(sibling => !sibling.workDuration)) {
            const adjustedSibling = otherLiveSiblings[otherLiveSiblings.length - 1]; // pick the final task
            adjustedSibling.workDuration = 1;
            adjustedSibling.chargeableTime = 1;
            adjustedSibling.endTime = this.addMinutes(adjustedSibling.endTime, 1);
        }
    }

    private addMinutes(time: string, minutesToAdd: number): string {
        // todo: centralise this somewhere else in one of the helpers
        return moment(time, "HH:mm")
            .add(minutesToAdd, "minutes")
            .format("HH:mm");
    }

    private checkLandlordJob(job: Job): void {
        if (job.isLandlordJob && !Job.isLandlordJob(job)) {
            // we are transitioning out of a landlord job

            job.isLandlordJob = false;

            // only if there remains a task that is to be done do we alert the user, i.e. if we only have one
            //  task and that is the landlord task, and the user is cancelling that task, then the job is over
            //  so no point notifying
            if (job.tasks.some(task => !task.isNotDoingTask)) {
                this._eventAggregator.publish(UiConstants.TOAST_ADDED, <IToastItem>{
                    id: Guid.newGuid(),
                    title: "Landlord Job",
                    style: "warning",
                    content: `Job ${job.id} is NO LONGER a landlord inspection job.`,
                    dismissTime: 0
                });
            }

        } else if (job.wasOriginallyLandlordJob && !job.isLandlordJob && Job.isLandlordJob(job)) {
            // we are transitioning in to a landlord job
            // edge case: gasMeterInstallationSatisfactory = "N/A" is not valid for landlord jobs
            if (job.propertySafetyType === PropertySafetyType.gas
                && job.propertySafety
                && job.propertySafety.propertyGasSafetyDetail
                && job.propertySafety.propertyGasSafetyDetail.gasMeterInstallationSatisfactory === "N/A") {
                    job.propertySafety.propertyGasSafetyDetail.gasMeterInstallationSatisfactory = undefined;
            }

            job.isLandlordJob = true;

            this._eventAggregator.publish(UiConstants.TOAST_ADDED, <IToastItem>{
                id: Guid.newGuid(),
                title: "Landlord Job",
                style: "warning",
                content: `Job ${job.id} has been reinstated as a landlord inspection job.`,
                dismissTime: 0
            });

        }
    }

    private updateAdvise(job: Job, task: TaskBusinessModel): void {
        // customer advise on both tasks needs to be replicated.
        // ref: DF_916
        job.tasks.map(t => {
            t.adviceCode = task.adviceCode;
            t.adviceComment = task.adviceComment;
            t.adviceOutcome = task.adviceOutcome;
        });
    }

    private populateAppointment(job: Job): Promise<void> {
        return Promise.all<QueryableBusinessRuleGroup, QueryableBusinessRuleGroup>([
            this._businessRulesService.getQueryableRuleGroup("taskItem"),
            this._businessRulesService.getQueryableRuleGroup("appointmentBooking")
        ])
            .then(([taskItemRuleGroup, appointmentBookingRuleGroup]) => {
                let appointmentAllowedActivityStatus = appointmentBookingRuleGroup.getBusinessRule<string>("appointmentAllowedActivityStatus").split(",");
                // defect DF-1372
                if (job.appointment) {
                    let appointmentRequired = job.tasks.some(task => appointmentAllowedActivityStatus.some(status => task.status === status));

                    if (!appointmentRequired) {
                        job.appointment = undefined;
                    } else {
                        // remove all completed, cancelled or deleted tasks
                        let deletedTaskIds = job.appointment.estimatedDurationOfAppointment
                            .filter(e => !job.tasks.some(t => t.id === e.taskId))
                            .map(e => e.taskId);

                        let completedOrCancelledActivityStatuses = taskItemRuleGroup.getBusinessRule<string>("completedOrCancelledActivityStatuses").split(",");
                        let completedOrCancelledTaskIds = job.tasks
                            .filter(task => completedOrCancelledActivityStatuses.some(status => task.status === status))
                            .map(task => task.id);

                        deletedTaskIds.concat(completedOrCancelledTaskIds).forEach(taskIdToRemove => {
                            let taskAppointmentIndex = job.appointment.estimatedDurationOfAppointment.findIndex(a => a.taskId === taskIdToRemove);
                            if (taskAppointmentIndex >= 0) {
                                job.appointment.estimatedDurationOfAppointment.splice(taskAppointmentIndex, 1);
                            }
                        });
                    }
                }
            });
    }
}
