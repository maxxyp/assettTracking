define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JobState;
    (function (JobState) {
        JobState[JobState["idle"] = 0] = "idle";
        JobState[JobState["enRoute"] = 1] = "enRoute";
        JobState[JobState["arrived"] = 2] = "arrived";
        JobState[JobState["deSelect"] = 3] = "deSelect";
        JobState[JobState["complete"] = 4] = "complete";
        JobState[JobState["done"] = 5] = "done";
    })(JobState = exports.JobState || (exports.JobState = {}));
});

//# sourceMappingURL=jobState.js.map
