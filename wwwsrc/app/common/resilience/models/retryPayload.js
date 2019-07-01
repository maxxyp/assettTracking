define(["require", "exports", "../../../hema/core/dateHelper"], function (require, exports, dateHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RetryPayload = /** @class */ (function () {
        function RetryPayload() {
        }
        RetryPayload.fromJson = function (raw) {
            var retryPayload = new RetryPayload();
            Object.assign(retryPayload, raw);
            retryPayload.createdTime = dateHelper_1.DateHelper.convertDateTime(raw.createdTime);
            retryPayload.expiryTime = dateHelper_1.DateHelper.convertDateTime(raw.expiryTime);
            retryPayload.lastRetryTime = dateHelper_1.DateHelper.convertDateTime(raw.lastRetryTime);
            // for backwards compatibility (if we have old versions of RetryPayload in storage they will not
            //  have the counts initialised, so ensure initialisation here)
            retryPayload.failureWithoutStatusCount = retryPayload.failureWithoutStatusCount || 0;
            retryPayload.failureWithStatusCount = retryPayload.failureWithStatusCount || 0;
            retryPayload.createdTime = retryPayload.createdTime || new Date();
            return retryPayload;
        };
        return RetryPayload;
    }());
    exports.RetryPayload = RetryPayload;
});

//# sourceMappingURL=retryPayload.js.map
