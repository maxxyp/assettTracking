import { TaskItemViewModel } from "../../modules/tasks/viewModels/taskItemViewModel";
import { Job } from "../../../business/models/job";
import { IChirpCode } from "../../../business/models/reference/IChirpCode";
import { Task as TaskBusinessModel } from "../../../business/models/task";

export interface ITaskItemFactory {
    createTaskItemViewModel(taskId: string, job: Job, intervalInMinutes: number, chirpCodesCatalog: IChirpCode[]): TaskItemViewModel;
    createTaskItemBusinessModel(viewModel: TaskItemViewModel, taskId: string, adviceResultsThatNeedCategory: string): TaskBusinessModel;
    clearViewModel(viewModel: TaskItemViewModel, task: TaskBusinessModel, firstVisitTaskCode: string, resetViewModel: boolean): void;
}
