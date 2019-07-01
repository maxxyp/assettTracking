define(["require", "exports", "../core/guid", "moment", "./analyticsConstants"], function (require, exports, guid_1, moment, analyticsConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // make sure NO sensitive information is placed here
    var AnalyticsExceptionModel = /** @class */ (function () {
        function AnalyticsExceptionModel(code, isFatal) {
            if (isFatal === void 0) { isFatal = false; }
            var detail = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                detail[_i - 2] = arguments[_i];
            }
            this.id = guid_1.Guid.newGuid();
            this.code = code;
            this.detail = detail;
            this.isFatal = isFatal;
            this.timestamp = moment().format(analyticsConstants_1.AnalyticsConstants.DATE_TIME_FORMAT);
        }
        return AnalyticsExceptionModel;
    }());
    exports.AnalyticsExceptionModel = AnalyticsExceptionModel;
});

//# sourceMappingURL=analyticsExceptionModel.js.map
