import { ApplianceGasSafety } from "../../../business/models/applianceGasSafety";
import { ApplianceGasUnsafeDetail } from "../../../business/models/applianceGasUnsafeDetail";
import { GasSafetyViewModel } from "../../modules/appliances/viewModels/gasSafetyViewModel";
import { GasUnsafetyViewModel } from "../../modules/appliances/viewModels/gasUnsafetyViewModel";
import { ApplianceGasReadingMaster } from "../../../business/models/applianceGasReadingMaster";
import { GasApplianceReadingsMasterViewModel } from "../../modules/appliances/viewModels/gasApplianceReadingsMasterViewModel";

export interface IApplianceGasSafetyFactory {
    createApplianceGasSafetyBusinessModel(vm: GasSafetyViewModel, isSafetyRequired: boolean): ApplianceGasSafety;
    createApplianceGasSafetyViewModel(model: ApplianceGasSafety, isSafetyRequired: boolean): GasSafetyViewModel;
    createApplianceGasUnsafeBusinessModel(vm: GasUnsafetyViewModel): ApplianceGasUnsafeDetail;
    createApplianceGasUnsafeViewModel(model: ApplianceGasUnsafeDetail): GasUnsafetyViewModel;
    createApplianceGasReadingsBusinessModel(vm: GasApplianceReadingsMasterViewModel): ApplianceGasReadingMaster;
    createApplianceGasReadingsViewModel(model: ApplianceGasReadingMaster): GasApplianceReadingsMasterViewModel;

}
