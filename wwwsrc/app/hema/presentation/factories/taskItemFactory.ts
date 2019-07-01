import { ITaskItemFactory } from "./interfaces/ITaskItemFactory";
import { TaskItemViewModel } from "../modules/tasks/viewModels/taskItemViewModel";
import { Job } from "../../business/models/job";
import { TimeRange } from "../../../common/ui/elements/models/timeRange";
import { IChirpCode } from "../../business/models/reference/IChirpCode";
import { Task as TaskBusinessModel } from "../../business/models/task";
export class TaskItemFactory implements ITaskItemFactory {

    public createTaskItemViewModel(taskId: string, job: Job, intervalInMinutes: number, chirpCodesCatalog: IChirpCode[]): TaskItemViewModel {
        let viewModel: TaskItemViewModel;
        if (taskId) {
            let task = Job.getTasksAndCompletedTasks(job).find(t => t.id === taskId);
            if (task) {
                viewModel = new TaskItemViewModel(taskId, job, task);
                viewModel.taskTime = new TimeRange(task.startTime, task.endTime);
                viewModel.chirpCodes = task.chirpCodes ? chirpCodesCatalog.filter(cc => task.chirpCodes.indexOf(cc.code) >= 0) : undefined;
                viewModel.isNotDoingJobByAnotherTask = job.tasks.some(t => t.isTaskThatSetsJobAsNoAccessed && t.id !== taskId);
                viewModel.selectedChirpCode = undefined;
            }
        }
        return viewModel;
    }

    public createTaskItemBusinessModel(viewModel: TaskItemViewModel, taskId: string, adviceResultsThatNeedCategory: string): TaskBusinessModel {
        let task: TaskBusinessModel = new TaskBusinessModel(true, viewModel.isNewRFA);

        task.id = taskId;
        task.status = viewModel.status;
        task.workedOnCode = viewModel.workedOnCode;
        task.activity = viewModel.activity;
        task.productGroup = viewModel.productGroup;
        task.partType = viewModel.partType;
        task.faultActionCode = viewModel.faultActionCode;
        task.adviceOutcome = viewModel.adviceOutcome;
        task.adviceCode = (adviceResultsThatNeedCategory.indexOf(viewModel.adviceOutcome) !== -1) ? viewModel.adviceCode : undefined;
        task.adviceComment = (adviceResultsThatNeedCategory.indexOf(viewModel.adviceOutcome) !== -1) ? viewModel.adviceComment : undefined;

        if (viewModel.taskTime) {
            task.startTime = viewModel.taskTime.startTime;
            task.endTime = viewModel.taskTime.endTime;
        }
        task.workDuration = viewModel.workDuration;
        task.chargeableTime = viewModel.chargeableTime;

        task.report = viewModel.taskReport;
        task.chirpCodes = viewModel.chirpCodes ? viewModel.chirpCodes.map(cc => cc.code) : undefined;
        task.isPartLJReportable = viewModel.isPartLJReportable;
        task.applianceType = viewModel.applianceType;
        task.orderNo = viewModel.orderNo;

        task.isFirstVisit = viewModel.isFirstVisit;
        task.showMainPartSelectedWithInvalidActivityTypeMessage = viewModel.showMainPartSelectedWithInvalidActivityTypeMessage;
        task.showMainPartSelectedWithInvalidProductGroupTypeMessage = viewModel.showMainPartSelectedWithInvalidProductGroupTypeMessage;
        task.showMainPartSelectedWithInvalidPartTypeMessage = viewModel.showMainPartSelectedWithInvalidPartTypeMessage;
        task.hasMainPart = viewModel.hasMainPart;
        task.mainPartPartType = viewModel.mainPartPartType;
        return task;
    }

    public clearViewModel(viewModel: TaskItemViewModel, task: TaskBusinessModel, firstVisitTaskCode: string, resetViewModel: boolean): void {
        viewModel.status = undefined;
        viewModel.workedOnCode = undefined;

        // if first visit then retain dropdown state
        if (viewModel.activity !== firstVisitTaskCode || resetViewModel) {
            // this.workedOnCode = undefined;
            viewModel.activity = undefined;
            viewModel.visitActivityFilteredCatalog = [];
            viewModel.partTypeFilteredCatalog = [];
            viewModel.faultActionCodeFilteredCatalog = [];
            viewModel.showProductGroupAndPartTypes = false;
        }

        viewModel.adviceOutcome = undefined;
        viewModel.adviceCode = undefined;
        viewModel.adviceComment = undefined;
        viewModel.taskReport = undefined;

        if (task && task.startTime && task.endTime) {
            viewModel.taskTime = new TimeRange(task.startTime, task.endTime);
        }
        viewModel.workDuration = task ? task.workDuration : undefined;
        viewModel.chargeableTime = task ? task.chargeableTime : undefined;

        viewModel.chirpCodes = undefined;
        viewModel.totalPreviousWorkDuration = TaskItemViewModel.getTotalPreviousChargeableTime(task);
        viewModel.faultActionCode = undefined;
        viewModel.productGroup = undefined;
        viewModel.partType = undefined;
        viewModel.isPartLJReportable = undefined;
    }
}
