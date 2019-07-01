import { Task as TaskBusinessModel } from "../../models/task";
import { TaskSummaryViewModel } from "../../../presentation/models/taskSummaryViewModel";
import { Job } from "../../models/job";

export interface ITaskService {
    getTasks(jobId: string): Promise<TaskBusinessModel[]>;
    getTasksAndCompletedTasks(jobId: string): Promise<TaskBusinessModel[]>;
    getAllTasksEverAtProperty(jobId: string): Promise<TaskBusinessModel[]>;
    getTaskItem(jobId: string, taskId: string): Promise<TaskBusinessModel>;
    saveTask(jobId: string, task: TaskBusinessModel): Promise<void>;
    updateTaskAppliance(jobId: string, taskId: string, applianceType: string, applianceId: string, actionType: string, chargeType: string): Promise<TaskBusinessModel>;
    deleteTask(jobId: string, taskId: string): Promise<void>;
    createTask(jobId: string, task: TaskBusinessModel): Promise<void>;
    updateTaskTimes(jobId: string, taskTimes: TaskSummaryViewModel[]): Promise<void>;

    buildReinstatedTaskTimes(
        currentTask: { startTime: string, endTime: string, orderNo: number, workDuration: number, chargeableTime: number},
        jobId: string): Promise<{ startTime: string, endTime: string, workDuration: number, chargeableTime: number}>;

    rebuildTaskTimes(job: Job): Promise<void>;
}
