define(["require", "exports", "../models/taskSummaryViewModel"], function (require, exports, taskSummaryViewModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TaskFactory = /** @class */ (function () {
        function TaskFactory() {
        }
        TaskFactory.prototype.createTaskSummaryViewModel = function (task) {
            var vm = new taskSummaryViewModel_1.TaskSummaryViewModel();
            if (task) {
                vm.id = task.id;
                vm.jobType = task.jobType;
                vm.applianceType = task.applianceType;
                vm.applianceId = task.applianceId;
                vm.chargeType = task.chargeType;
                vm.supportingText = task.supportingText;
                vm.specialRequirement = task.specialRequirement;
                vm.problemDesc = task.problemDesc;
                vm.applianceMake = task.applianceMake;
                vm.applianceModel = task.applianceModel;
                vm.applianceErrorCode = task.applianceErrorCode;
                vm.applianceErrorDesc = task.applianceErrorDesc;
                vm.activityCount = task.activities.length;
                vm.visitCount = task.sequence;
                vm.isNewRFA = task.isNewRFA;
                vm.isMiddlewareDoTodayTask = task.isMiddlewareDoTodayTask;
                vm.dataState = task.dataState;
                vm.workDuration = task.workDuration;
                vm.chargeableTime = task.chargeableTime;
                vm.startTime = task.startTime;
                vm.endTime = task.endTime;
                vm.orderNo = task.orderNo;
                vm.chargeableTimeChanged = false;
            }
            return vm;
        };
        return TaskFactory;
    }());
    exports.TaskFactory = TaskFactory;
});

//# sourceMappingURL=taskFactory.js.map
