import {Task as TaskBusinessModel} from "../../../business/models/task";
import {TaskSummaryViewModel} from "../../models/taskSummaryViewModel";

export interface ITaskFactory {
    createTaskSummaryViewModel(task: TaskBusinessModel): TaskSummaryViewModel;
}
