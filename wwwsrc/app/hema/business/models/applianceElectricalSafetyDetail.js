var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./dataStateProvider", "./dataState"], function (require, exports, dataStateProvider_1, dataState_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ApplianceElectricalSafetyDetail = /** @class */ (function (_super) {
        __extends(ApplianceElectricalSafetyDetail, _super);
        function ApplianceElectricalSafetyDetail() {
            return _super.call(this, dataState_1.DataState.dontCare, "appliances") || this;
        }
        ApplianceElectricalSafetyDetail.isTouched = function (applianceElectricalSafetyDetail) {
            // these are the fundamental properties that are always set that do not really indicate if the user has touched this record
            var propertiesToIgnore = ["systemType", "electricalApplianceType", "dataState", "dataStateGroup", "dataStateId"];
            var propertiesToCheck = Object.getOwnPropertyNames(applianceElectricalSafetyDetail)
                .filter(function (prop) { return propertiesToIgnore.indexOf(prop) === -1; });
            return propertiesToCheck.some(function (prop) { return applianceElectricalSafetyDetail[prop] !== undefined; });
        };
        return ApplianceElectricalSafetyDetail;
    }(dataStateProvider_1.DataStateProvider));
    exports.ApplianceElectricalSafetyDetail = ApplianceElectricalSafetyDetail;
});

//# sourceMappingURL=applianceElectricalSafetyDetail.js.map
