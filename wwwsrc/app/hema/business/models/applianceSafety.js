define(["require", "exports", "./applianceGasReadingMaster", "./applianceGasSafety", "./applianceGasUnsafeDetail", "./applianceElectricalSafetyDetail", "./previousApplianceUnsafeDetail", "./applianceElectricalUnsafeDetail", "./applianceOtherSafety", "./applianceOtherUnsafeDetail"], function (require, exports, applianceGasReadingMaster_1, applianceGasSafety_1, applianceGasUnsafeDetail_1, applianceElectricalSafetyDetail_1, previousApplianceUnsafeDetail_1, applianceElectricalUnsafeDetail_1, applianceOtherSafety_1, applianceOtherUnsafeDetail_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ApplianceSafety = /** @class */ (function () {
        function ApplianceSafety() {
            this.applianceGasReadingsMaster = new applianceGasReadingMaster_1.ApplianceGasReadingMaster();
            this.applianceGasSafety = new applianceGasSafety_1.ApplianceGasSafety();
            this.applianceGasUnsafeDetail = new applianceGasUnsafeDetail_1.ApplianceGasUnsafeDetail();
            this.applianceElectricalSafetyDetail = new applianceElectricalSafetyDetail_1.ApplianceElectricalSafetyDetail();
            this.applianceElectricalUnsafeDetail = new applianceElectricalUnsafeDetail_1.ApplianceElectricalUnsafeDetail();
            this.applianceOtherSafety = new applianceOtherSafety_1.ApplianceOtherSafety();
            this.applianceOtherUnsafeDetail = new applianceOtherUnsafeDetail_1.ApplianceOtherUnsafeDetail();
            this.previousApplianceUnsafeDetail = new previousApplianceUnsafeDetail_1.PreviousApplianceUnsafeDetail();
        }
        return ApplianceSafety;
    }());
    exports.ApplianceSafety = ApplianceSafety;
});

//# sourceMappingURL=applianceSafety.js.map
