define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JobServiceConstants = /** @class */ (function () {
        function JobServiceConstants() {
        }
        // work list is changed in local storage.
        JobServiceConstants.JOB_STATE_CHANGED = "JOB_STATE_CHANGED";
        JobServiceConstants.JOB_DATA_STATE_CHANGED = "JOB_DATA_STATE_CHANGED";
        JobServiceConstants.JOB_COMPLETION_REFRESH = "JOB_COMPLETION_REFRESH";
        JobServiceConstants.JOB_COMPLETED = "JOB_COMPLETED";
        JobServiceConstants.JOB_FINISH_TIME_DIFF_MAX_IN_MINS = 5;
        return JobServiceConstants;
    }());
    exports.JobServiceConstants = JobServiceConstants;
});

//# sourceMappingURL=jobServiceConstants.js.map
