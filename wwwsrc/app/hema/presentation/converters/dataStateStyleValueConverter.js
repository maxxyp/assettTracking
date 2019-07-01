define(["require", "exports", "../../business/models/dataState", "../../../common/core/stringHelper"], function (require, exports, dataState_1, stringHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DataStateStyleValueConverter = /** @class */ (function () {
        function DataStateStyleValueConverter() {
        }
        DataStateStyleValueConverter.prototype.toView = function (value, canEdit) {
            return canEdit ? "state-" + stringHelper_1.StringHelper.toSnakeCase(dataState_1.DataState[value]) : "state-none";
        };
        return DataStateStyleValueConverter;
    }());
    exports.DataStateStyleValueConverter = DataStateStyleValueConverter;
});

//# sourceMappingURL=dataStateStyleValueConverter.js.map
