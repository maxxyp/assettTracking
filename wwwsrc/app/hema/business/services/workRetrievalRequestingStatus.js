define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WorkRetrievalRequestingStatus;
    (function (WorkRetrievalRequestingStatus) {
        WorkRetrievalRequestingStatus[WorkRetrievalRequestingStatus["notRequesting"] = 0] = "notRequesting";
        WorkRetrievalRequestingStatus[WorkRetrievalRequestingStatus["requestingFullRequest"] = 1] = "requestingFullRequest";
        WorkRetrievalRequestingStatus[WorkRetrievalRequestingStatus["requestingRefresh"] = 2] = "requestingRefresh";
    })(WorkRetrievalRequestingStatus = exports.WorkRetrievalRequestingStatus || (exports.WorkRetrievalRequestingStatus = {}));
});

//# sourceMappingURL=workRetrievalRequestingStatus.js.map
