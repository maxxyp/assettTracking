import { IApplianceOtherSafetyFactory } from "./interfaces/IApplianceOtherSafetyFactory";
import { ApplianceOtherUnsafeDetail } from "../../business/models/applianceOtherUnsafeDetail";
import { OtherSafetyViewModel } from "../modules/appliances/viewModels/otherSafetyViewModel";
import { OtherUnsafetyViewModel } from "../modules/appliances/viewModels/otherUnsafetyViewModel";
import { ApplianceOtherSafety } from "../../business/models/applianceOtherSafety";

export class ApplianceOtherSafetyFactory implements IApplianceOtherSafetyFactory {

    public createApplianceOtherSafetyBusinessModel(vm: OtherSafetyViewModel): ApplianceOtherSafety {
        if (!vm) {
            vm = new OtherSafetyViewModel();
        }
        let model: ApplianceOtherSafety = new ApplianceOtherSafety();
        model.visuallyCheckRelight = vm.didYouVisuallyCheck;
        model.isApplianceSafe = vm.isApplianceSafe;
        model.toCurrentStandards = vm.toCurrentStandards;
        model.workedOnAppliance = vm.workedOnAppliance;
        model.dataState = vm.dataState;
        model.dataStateId = vm.dataStateId;

        return model;
    }

    public createApplianceOtherSafetyViewModel(model: ApplianceOtherSafety): OtherSafetyViewModel {
        let vm = new OtherSafetyViewModel();
        if (!model) {
            model = new ApplianceOtherSafety();
        }
        vm.didYouVisuallyCheck = model.visuallyCheckRelight;
        vm.isApplianceSafe = model.isApplianceSafe;
        vm.workedOnAppliance = model.workedOnAppliance;
        vm.toCurrentStandards = model.toCurrentStandards;

        vm.dataState = model.dataState;
        vm.dataStateId = model.dataStateId;
        return vm;
    }

    public createApplianceOtherUnsafeBusinessModel(vm: OtherUnsafetyViewModel): ApplianceOtherUnsafeDetail {
        if (!vm) {
            vm = new OtherUnsafetyViewModel();
        }

        let model = new ApplianceOtherUnsafeDetail();
        model.report = vm.report;
        model.cappedTurnedOff = vm.cappedTurnedOff;
        model.conditionAsLeft = vm.conditionAsLeft;
        model.labelAttachedRemoved = vm.labelAttachedRemoved;
        model.letterLeft = vm.letterLeft;
        model.ownedByCustomer = vm.ownedByCustomer;
        model.signatureObtained = vm.signatureObtained;

        return model;
    }

    public createApplianceOtherUnsafeViewModel(model: ApplianceOtherUnsafeDetail): OtherUnsafetyViewModel {
        let vm = new OtherUnsafetyViewModel();
        if (!model) {
            model = new ApplianceOtherUnsafeDetail();
        }
        vm.report = model.report;
        vm.cappedTurnedOff = model.cappedTurnedOff;
        vm.conditionAsLeft = model.conditionAsLeft;
        vm.labelAttachedRemoved = model.labelAttachedRemoved;
        vm.letterLeft = model.letterLeft;
        vm.ownedByCustomer = model.ownedByCustomer;
        vm.signatureObtained = model.signatureObtained;

        return vm;
    }
}
