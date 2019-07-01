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
    var ApplianceGasReadingMaster = /** @class */ (function (_super) {
        __extends(ApplianceGasReadingMaster, _super);
        function ApplianceGasReadingMaster() {
            var _this = _super.call(this, dataState_1.DataState.dontCare, "appliances") || this;
            _this.workedOnApplianceReadings = false;
            _this.workedOnMainReadings = false;
            _this.workedOnSupplementaryApplianceReadings = false;
            return _this;
        }
        ApplianceGasReadingMaster.isTouched = function (readingsMaster) {
            var isAPreliminaryReadingTaken = readingsMaster && readingsMaster.preliminaryReadings
                && (readingsMaster.preliminaryReadings.burnerPressure !== undefined ||
                    readingsMaster.preliminaryReadings.gasRateReading !== undefined ||
                    readingsMaster.preliminaryReadings.isLpg !== undefined);
            var isASupplementaryReadingTaken = readingsMaster && readingsMaster.supplementaryReadings
                && (readingsMaster.supplementaryReadings.burnerPressure !== undefined ||
                    readingsMaster.supplementaryReadings.gasRateReading !== undefined ||
                    readingsMaster.supplementaryReadings.isLpg !== undefined);
            return isAPreliminaryReadingTaken || isASupplementaryReadingTaken;
        };
        return ApplianceGasReadingMaster;
    }(dataStateProvider_1.DataStateProvider));
    exports.ApplianceGasReadingMaster = ApplianceGasReadingMaster;
});

//# sourceMappingURL=applianceGasReadingMaster.js.map
