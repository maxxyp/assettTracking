import {ElectricalSafetyViewModel} from "../../modules/appliances/viewModels/electricalSafetyViewModel";
import {ApplianceSafety} from "../../../business/models/applianceSafety";
import {ApplianceElectricalSafetyDetail} from "../../../business/models/applianceElectricalSafetyDetail";
import {ApplianceElectricalUnsafeDetail} from "../../../business/models/applianceElectricalUnsafeDetail";

export interface IApplianceSafetyFactory {
    createElectricalSafetyViewModel(applianceSafety: ApplianceSafety, businessRules: { [key: string]: any }): ElectricalSafetyViewModel;
    createApplianceElectricalSafetyDetail(electricalSafetyViewModel: ElectricalSafetyViewModel): ApplianceElectricalSafetyDetail;
    createApplianceElectricalUnsafeDetail(electricalSafetyViewModel: ElectricalSafetyViewModel): ApplianceElectricalUnsafeDetail;
}
