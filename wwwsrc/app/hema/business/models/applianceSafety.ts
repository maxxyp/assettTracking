import {ApplianceGasReadingMaster} from "./applianceGasReadingMaster";
import {ApplianceGasSafety} from "./applianceGasSafety";
import {ApplianceGasUnsafeDetail} from "./applianceGasUnsafeDetail";
import {ApplianceElectricalSafetyDetail} from "./applianceElectricalSafetyDetail";
import {PreviousApplianceUnsafeDetail} from "./previousApplianceUnsafeDetail";
import {ApplianceElectricalUnsafeDetail} from "./applianceElectricalUnsafeDetail";

import {ApplianceOtherSafety} from "./applianceOtherSafety";
import {ApplianceOtherUnsafeDetail} from "./applianceOtherUnsafeDetail";

export class ApplianceSafety {
    public applianceGasSafety: ApplianceGasSafety;
    public applianceGasReadingsMaster: ApplianceGasReadingMaster;
    public applianceGasUnsafeDetail: ApplianceGasUnsafeDetail;

    public applianceElectricalSafetyDetail: ApplianceElectricalSafetyDetail;
    public applianceElectricalUnsafeDetail: ApplianceElectricalUnsafeDetail;

    public applianceOtherSafety: ApplianceOtherSafety;
    public applianceOtherUnsafeDetail: ApplianceOtherUnsafeDetail;

    public previousApplianceUnsafeDetail: PreviousApplianceUnsafeDetail;

    constructor() {
        this.applianceGasReadingsMaster = new ApplianceGasReadingMaster();
        this.applianceGasSafety = new ApplianceGasSafety();
        this.applianceGasUnsafeDetail = new ApplianceGasUnsafeDetail();

        this.applianceElectricalSafetyDetail = new ApplianceElectricalSafetyDetail();
        this.applianceElectricalUnsafeDetail = new ApplianceElectricalUnsafeDetail();

        this.applianceOtherSafety = new ApplianceOtherSafety();
        this.applianceOtherUnsafeDetail = new ApplianceOtherUnsafeDetail();

        this.previousApplianceUnsafeDetail = new PreviousApplianceUnsafeDetail();
    }
}
