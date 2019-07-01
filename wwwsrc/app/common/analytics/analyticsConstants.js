define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AnalyticsConstants = /** @class */ (function () {
        function AnalyticsConstants() {
        }
        AnalyticsConstants.ANALYTICS_EVENT = "ANALYTICS_EVENT";
        AnalyticsConstants.METRIC = 1;
        /* actions */
        AnalyticsConstants.CLICK_ACTION = "click";
        /* actions */
        /* categories */
        AnalyticsConstants.HELP_OVERLAY_CATEGORY = "Help Overlay";
        AnalyticsConstants.FULL_SCREEN_CATEGORY = "Full Screen";
        AnalyticsConstants.WORKLIST_RETRIVAL_CATEGORY = "Worklist Retrival Notification Bar";
        AnalyticsConstants.JOB_STATE = "Job";
        AnalyticsConstants.ENGINNER_STATE_CHANGED = "Engineer State Changed";
        AnalyticsConstants.END_OF_DAY_UNSENT_PAYLOADS = "End of day has unsent payloads";
        AnalyticsConstants.REMOVE_USER_DATA = "Support: Remove User Data";
        AnalyticsConstants.REMOVE_CATALOG_DATA = "Support: Remove Catalog Data";
        AnalyticsConstants.HTTP_RESULT = "HTTP Result";
        /* categories */
        AnalyticsConstants.DATE_TIME_FORMAT = "DD-MM-YYYY HH:mm:ss";
        return AnalyticsConstants;
    }());
    exports.AnalyticsConstants = AnalyticsConstants;
});

//# sourceMappingURL=analyticsConstants.js.map
