define(["require", "exports", "../modules/tasks/viewModels/taskItemViewModel", "../../business/models/job", "../../../common/ui/elements/models/timeRange", "../../business/models/task"], function (require, exports, taskItemViewModel_1, job_1, timeRange_1, task_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TaskItemFactory = /** @class */ (function () {
        function TaskItemFactory() {
        }
        TaskItemFactory.prototype.createTaskItemViewModel = function (taskId, job, intervalInMinutes, chirpCodesCatalog) {
            var viewModel;
            if (taskId) {
                var task_2 = job_1.Job.getTasksAndCompletedTasks(job).find(function (t) { return t.id === taskId; });
                if (task_2) {
                    viewModel = new taskItemViewModel_1.TaskItemViewModel(taskId, job, task_2);
                    viewModel.taskTime = new timeRange_1.TimeRange(task_2.startTime, task_2.endTime);
                    viewModel.chirpCodes = task_2.chirpCodes ? chirpCodesCatalog.filter(function (cc) { return task_2.chirpCodes.indexOf(cc.code) >= 0; }) : undefined;
                    viewModel.isNotDoingJobByAnotherTask = job.tasks.some(function (t) { return t.isTaskThatSetsJobAsNoAccessed && t.id !== taskId; });
                    viewModel.selectedChirpCode = undefined;
                }
            }
            return viewModel;
        };
        TaskItemFactory.prototype.createTaskItemBusinessModel = function (viewModel, taskId, adviceResultsThatNeedCategory) {
            var task = new task_1.Task(true, viewModel.isNewRFA);
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
            task.chirpCodes = viewModel.chirpCodes ? viewModel.chirpCodes.map(function (cc) { return cc.code; }) : undefined;
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
        };
        TaskItemFactory.prototype.clearViewModel = function (viewModel, task, firstVisitTaskCode, resetViewModel) {
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
                viewModel.taskTime = new timeRange_1.TimeRange(task.startTime, task.endTime);
            }
            viewModel.workDuration = task ? task.workDuration : undefined;
            viewModel.chargeableTime = task ? task.chargeableTime : undefined;
            viewModel.chirpCodes = undefined;
            viewModel.totalPreviousWorkDuration = taskItemViewModel_1.TaskItemViewModel.getTotalPreviousChargeableTime(task);
            viewModel.faultActionCode = undefined;
            viewModel.productGroup = undefined;
            viewModel.partType = undefined;
            viewModel.isPartLJReportable = undefined;
        };
        return TaskItemFactory;
    }());
    exports.TaskItemFactory = TaskItemFactory;
});

//# sourceMappingURL=taskItemFactory.js.map
