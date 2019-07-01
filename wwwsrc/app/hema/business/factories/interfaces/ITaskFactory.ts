import {ITask as TaskApiModel} from "../../../api/models/fft/jobs/ITask";
import {ITask as TaskUpdateApiModel} from "../../../api/models/fft/jobs/jobupdate/ITask";
import {Task as TaskBusinessModel} from "../../models/task";
import {Job} from "../../models/job";
import {PartsToday} from "../../models/partsToday";

export interface ITaskFactory {
    createTaskBusinessModel(taskApiModel: TaskApiModel, partsToday: PartsToday, isCurrentJob: boolean): Promise<TaskBusinessModel>;
    createTaskApiModel(task: TaskBusinessModel, job: Job, hardwareSequenceNumber?: number): Promise<TaskUpdateApiModel>;
}
