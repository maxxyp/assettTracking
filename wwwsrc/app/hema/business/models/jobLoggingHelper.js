define(["require", "exports", "../../../common/core/objectHelper"], function (require, exports, objectHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JobLoggingHelper = /** @class */ (function () {
        function JobLoggingHelper() {
        }
        JobLoggingHelper.prototype.prepareLoggableJob = function (jobModel) {
            // take a clone of the jobModel
            var job = JSON.parse(JSON.stringify(jobModel, function (key, val) {
                // as we clone, lets get rid of the dataState guids - these get updated even when the user
                //  is not editing data, so would give false positive changes
                return key === "dataStateId" ? undefined : val;
            }));
            // clear parts of the business model that do not change
            job.customerContact = undefined;
            job.customerAddress = undefined;
            job.premises = undefined;
            job.contact = undefined;
            job.visit = undefined;
            job.tasksNotToday = undefined;
            if (job.history) {
                job.history.tasks = undefined;
            }
            if (job.charge && job.charge.tasks) {
                job.charge.tasks.forEach(function (task) { return task.task = undefined; });
            }
            if (job.partsDetail) {
                var partsBasket = job.partsDetail.partsBasket;
                if (partsBasket) {
                    if (partsBasket.manualPartDetail) {
                        partsBasket.manualPartDetail.patchVanStockEngineers = undefined;
                    }
                    if (partsBasket.partsInBasket) {
                        partsBasket.partsInBasket.forEach(function (part) { return part.patchVanStockEngineers = undefined; });
                    }
                    if (partsBasket.partsToOrder) {
                        partsBasket.partsToOrder.forEach(function (part) { return part.patchVanStockEngineers = undefined; });
                    }
                }
                if (job.partsDetail.partsToday && job.partsDetail.partsToday.parts) {
                    job.partsDetail.partsToday.parts.forEach(function (part) { return part.patchVanStockEngineers = undefined; });
                }
            }
            if (objectHelper_1.ObjectHelper.isComparable(job, this.lastLoggedJob)) {
                return "Not changed";
            }
            else {
                this.lastLoggedJob = job;
                return job;
            }
        };
        return JobLoggingHelper;
    }());
    exports.JobLoggingHelper = JobLoggingHelper;
});

//# sourceMappingURL=jobLoggingHelper.js.map
