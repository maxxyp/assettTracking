define(["require", "exports", "../../../common/core/guid"], function (require, exports, guid_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DataStateProvider = /** @class */ (function () {
        function DataStateProvider(dataState, dataStateGroup) {
            this.dataState = dataState;
            this.dataStateGroup = dataStateGroup;
            this.dataStateId = guid_1.Guid.newGuid();
        }
        return DataStateProvider;
    }());
    exports.DataStateProvider = DataStateProvider;
});

//# sourceMappingURL=dataStateProvider.js.map
