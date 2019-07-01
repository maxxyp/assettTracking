var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./dataStateProvider", "./dataState", "../../../common/core/numberHelper", "../../../common/core/stringHelper"], function (require, exports, dataStateProvider_1, dataState_1, numberHelper_1, stringHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Task = /** @class */ (function (_super) {
        __extends(Task, _super);
        function Task(isCurrentTask, isNewRFA) {
            var _this = _super.call(this, isCurrentTask ? dataState_1.DataState.notVisited : dataState_1.DataState.dontCare, isCurrentTask ? "activities" : "previous-jobs") || this;
            _this.isNewRFA = isNewRFA;
            _this.orderNo = 1;
            _this.isMiddlewareDoTodayTask = true;
            _this.showMainPartSelectedWithInvalidActivityTypeMessage = false;
            _this.showMainPartSelectedWithInvalidProductGroupTypeMessage = false;
            _this.showMainPartSelectedWithInvalidPartTypeMessage = false;
            _this.hasMainPart = false;
            return _this;
        }
        Task.isChargeableTask = function (chargeType, noChargePrefix) {
            if (chargeType === undefined) {
                return false;
            }
            if (noChargePrefix === undefined) {
                return false;
            }
            if (noChargePrefix === "") {
                return false;
            }
            if (chargeType === "") {
                return false;
            }
            var lenNoChargePrefix = noChargePrefix.length;
            return chargeType.substr(0, lenNoChargePrefix) !== noChargePrefix;
        };
        Task.getNextTaskId = function (tasks) {
            if (!tasks || !tasks.length) {
                return null;
            }
            var sortedExistingTaskIds = tasks
                .filter(function (task) { return task && task.id; })
                .map(function (task) { return task.id; })
                .sort();
            if (!sortedExistingTaskIds.length) {
                return null;
            }
            var maxExistingTaskId = sortedExistingTaskIds.pop();
            if (maxExistingTaskId.length < 3) {
                return null;
            }
            // if id is 123456789001 then root is 123456789 and suffix is 001
            var idRoot = maxExistingTaskId.substr(0, maxExistingTaskId.length - 3);
            var idSuffix = maxExistingTaskId.substr(maxExistingTaskId.length - 3);
            if (!numberHelper_1.NumberHelper.canCoerceToNumber(idSuffix)) {
                return null;
            }
            var nextIdSuffix = (numberHelper_1.NumberHelper.coerceToNumber(idSuffix) + 1).toString();
            if (nextIdSuffix.length > 3) {
                return null;
            }
            var paddedNextIdSuffix = stringHelper_1.StringHelper.padLeft(nextIdSuffix, "0", 3);
            return idRoot + paddedNextIdSuffix;
        };
        Task.getFieldTaskId = function (taskId) {
            /*  Jairam says that fieldTaskId should be a 8 digit number, e.g. "00003902".
                It should be unique across all new tasks generated for the job.
            */
            if (taskId.length < 8) {
                return stringHelper_1.StringHelper.padLeft(taskId, "0", 8);
            }
            else {
                return taskId.substr(taskId.length - 8);
            }
        };
        return Task;
    }(dataStateProvider_1.DataStateProvider));
    exports.Task = Task;
});

//# sourceMappingURL=task.js.map
