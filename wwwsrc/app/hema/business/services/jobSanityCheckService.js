define(["require", "exports", "aurelia-logging", "../../../common/core/objectHelper", "../../../common/analytics/analyticsExceptionModel", "../../../common/analytics/analyticsExceptionCodeConstants"], function (require, exports, Logging, objectHelper_1, analyticsExceptionModel_1, analyticsExceptionCodeConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JobSanityCheckService = /** @class */ (function () {
        function JobSanityCheckService() {
            this._logger = Logging.getLogger(objectHelper_1.ObjectHelper.getClassName(this));
        }
        /*
            In field trial we are getting junk from WMIS - e.g. job documents with missing details.
            This code should be removed when we no longer see this happening.
        */
        JobSanityCheckService.prototype.isBadlyFormed = function (job) {
            var _this = this;
            var badlyFormed = function (reason) {
                var message = "Badly formed job with jobId " + job.id + " : " + reason;
                _this._logger.error(message, new analyticsExceptionModel_1.AnalyticsExceptionModel(analyticsExceptionCodeConstants_1.AnalyticsExceptionCodeConstants.BADLY_FORMED_JOB, false, message));
                return { isBadlyFormed: true, reason: reason };
            };
            if (!(job.tasks || []).length) {
                return badlyFormed("no activities for today.");
            }
            return { isBadlyFormed: false };
        };
        return JobSanityCheckService;
    }());
    exports.JobSanityCheckService = JobSanityCheckService;
});

//# sourceMappingURL=jobSanityCheckService.js.map
