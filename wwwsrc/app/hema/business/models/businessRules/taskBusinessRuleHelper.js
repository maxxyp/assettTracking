define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TaskBusinessRuleHelper = /** @class */ (function () {
        function TaskBusinessRuleHelper() {
        }
        TaskBusinessRuleHelper.isNotDoingJobStatus = function (ruleGroup, status) {
            return ruleGroup.notDoingJobStatuses.split(",").some(function (s) { return s === status; });
        };
        TaskBusinessRuleHelper.isNotDoingTaskStatus = function (ruleGroup, status) {
            return ruleGroup.notDoingTaskStatuses.split(",").some(function (s) { return s === status; });
        };
        TaskBusinessRuleHelper.isLiveTask = function (ruleGroup, status) {
            return !this.isNotDoingJobStatus(ruleGroup, status)
                && !this.isNotDoingTaskStatus(ruleGroup, status);
        };
        return TaskBusinessRuleHelper;
    }());
    exports.TaskBusinessRuleHelper = TaskBusinessRuleHelper;
});

//# sourceMappingURL=taskBusinessRuleHelper.js.map
