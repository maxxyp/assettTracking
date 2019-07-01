import { ApplianceOtherSafety } from "../../../business/models/applianceOtherSafety";
import { ApplianceOtherUnsafeDetail } from "../../../business/models/applianceOtherUnsafeDetail";
import { OtherSafetyViewModel } from "../../modules/appliances/viewModels/otherSafetyViewModel";
import { OtherUnsafetyViewModel } from "../../modules/appliances/viewModels/otherUnsafetyViewModel";

export interface IApplianceOtherSafetyFactory {
    createApplianceOtherSafetyBusinessModel(vm: OtherSafetyViewModel, isSafetyRequired: boolean): ApplianceOtherSafety;
    createApplianceOtherSafetyViewModel(model: ApplianceOtherSafety, isSafetyRequired: boolean): OtherSafetyViewModel;
    createApplianceOtherUnsafeBusinessModel(vm: OtherUnsafetyViewModel): ApplianceOtherUnsafeDetail;
    createApplianceOtherUnsafeViewModel(model: ApplianceOtherUnsafeDetail): OtherUnsafetyViewModel;
}
