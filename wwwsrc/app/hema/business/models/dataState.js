define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DataState;
    (function (DataState) {
        DataState[DataState["dontCare"] = 0] = "dontCare";
        DataState[DataState["notVisited"] = 1] = "notVisited";
        DataState[DataState["invalid"] = 2] = "invalid";
        DataState[DataState["valid"] = 3] = "valid";
    })(DataState = exports.DataState || (exports.DataState = {}));
});

//# sourceMappingURL=dataState.js.map
