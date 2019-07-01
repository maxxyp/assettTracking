import {IApplianceSafetyFactory} from "./interfaces/IApplianceSafetyFactory";
import {ElectricalSafetyViewModel} from "../modules/appliances/viewModels/electricalSafetyViewModel";
import {ApplianceSafety} from "../../business/models/applianceSafety";
import {ApplianceElectricalSafetyDetail} from "../../business/models/applianceElectricalSafetyDetail";
import {ApplianceElectricalUnsafeDetail} from "../../business/models/applianceElectricalUnsafeDetail";

export class ApplianceSafetyFactory implements IApplianceSafetyFactory {
    public createElectricalSafetyViewModel(applianceSafety: ApplianceSafety, businessRules: { [key: string]: any }): ElectricalSafetyViewModel {
        let vm = new ElectricalSafetyViewModel(businessRules);

        if (applianceSafety && applianceSafety.applianceElectricalSafetyDetail) {
            vm.electricalApplianceType = applianceSafety.applianceElectricalSafetyDetail.electricalApplianceType;

            vm.mainEarthChecked = applianceSafety.applianceElectricalSafetyDetail.mainEarthChecked;
            vm.gasBondingChecked = applianceSafety.applianceElectricalSafetyDetail.gasBondingChecked;
            vm.waterBondingChecked = applianceSafety.applianceElectricalSafetyDetail.waterBondingChecked;
            vm.otherBondingChecked = applianceSafety.applianceElectricalSafetyDetail.otherBondingChecked;
            vm.supplementaryBondingOrFullRcdProtectionChecked = applianceSafety.applianceElectricalSafetyDetail.supplementaryBondingOrFullRcdProtectionChecked;
            vm.ringContinuityReadingDone = applianceSafety.applianceElectricalSafetyDetail.ringContinuityReadingDone;

            vm.leInsulationResistance = applianceSafety.applianceElectricalSafetyDetail.leInsulationResistance;
            vm.leInsulationResistanceReasonWhyNot = applianceSafety.applianceElectricalSafetyDetail.leInsulationResistanceReasonWhyNot;
            vm.showLeInsulationResistanceReasonWhyNot = applianceSafety.applianceElectricalSafetyDetail.showLeInsulationResistanceReasonWhyNot;

            vm.neInsulationResistance = applianceSafety.applianceElectricalSafetyDetail.neInsulationResistance;
            vm.neInsulationResistanceReasonWhyNot = applianceSafety.applianceElectricalSafetyDetail.neInsulationResistanceReasonWhyNot;
            vm.showNeInsulationResistanceReasonWhyNot = applianceSafety.applianceElectricalSafetyDetail.showNeInsulationResistanceReasonWhyNot;

            vm.lnInsulationResistance = applianceSafety.applianceElectricalSafetyDetail.lnInsulationResistance;
            vm.lnInsulationResistanceReasonWhyNot = applianceSafety.applianceElectricalSafetyDetail.lnInsulationResistanceReasonWhyNot;
            vm.showLnInsulationResistanceReasonWhyNot = applianceSafety.applianceElectricalSafetyDetail.showLnInsulationResistanceReasonWhyNot;

            vm.systemType = applianceSafety.applianceElectricalSafetyDetail.systemType;
            vm.finalEliReadingDone = applianceSafety.applianceElectricalSafetyDetail.finalEliReadingDone;
            vm.finalEliReading = applianceSafety.applianceElectricalSafetyDetail.finalEliReading;
            vm.readingSafeAccordingToTops = applianceSafety.applianceElectricalSafetyDetail.readingSafeAccordingToTops;
            vm.isRcdPresent = applianceSafety.applianceElectricalSafetyDetail.isRcdPresent;

            vm.circuitRcdRcboProtected = applianceSafety.applianceElectricalSafetyDetail.circuitRcdRcboProtected;
            vm.rcdTripTimeReading = applianceSafety.applianceElectricalSafetyDetail.rcdTripTimeReading;
            vm.rcboTripTimeReading = applianceSafety.applianceElectricalSafetyDetail.rcboTripTimeReading;

            vm.applianceEarthContinuityReadingDone = applianceSafety.applianceElectricalSafetyDetail.applianceEarthContinuityReadingDone;
            vm.applianceEarthContinuityReading = applianceSafety.applianceElectricalSafetyDetail.applianceEarthContinuityReading;

            vm.isApplianceHardWired = applianceSafety.applianceElectricalSafetyDetail.isApplianceHardWired;
            vm.mcbFuseRating = applianceSafety.applianceElectricalSafetyDetail.mcbFuseRating;
            vm.mcbFuseRatingReasonWhyNot = applianceSafety.applianceElectricalSafetyDetail.mcbFuseRatingReasonWhyNot;
            vm.showMcbFuseRatingReasonWhyNot = applianceSafety.applianceElectricalSafetyDetail.showMcbFuseRatingReasonWhyNot;

            vm.applianceFuseRating = applianceSafety.applianceElectricalSafetyDetail.applianceFuseRating;
            vm.applianceFuseRatingReasonWhyNot = applianceSafety.applianceElectricalSafetyDetail.applianceFuseRatingReasonWhyNot;
            vm.showApplianceFuseRatingReasonWhyNot = applianceSafety.applianceElectricalSafetyDetail.showApplianceFuseRatingReasonWhyNot;

            vm.isPartP = applianceSafety.applianceElectricalSafetyDetail.isPartP;
            vm.partPReason = applianceSafety.applianceElectricalSafetyDetail.partPReason;

            vm.workedOnLightingCircuit = applianceSafety.applianceElectricalSafetyDetail.workedOnLightingCircuit;
            vm.cpcInLightingCircuitOk = applianceSafety.applianceElectricalSafetyDetail.cpcInLightingCircuitOk;

            vm.installationSatisfactory = applianceSafety.applianceElectricalSafetyDetail.installationSatisfactory;

            vm.microwaveLeakageReading = applianceSafety.applianceElectricalSafetyDetail.microwaveLeakageReading; // m
            vm.microwaveLeakageReadingReasonWhyNot = applianceSafety.applianceElectricalSafetyDetail.microwaveLeakageReadingReasonWhyNot; // m
            vm.showMicrowaveLeakageReadingReasonWhyNot = applianceSafety.applianceElectricalSafetyDetail.showMicrowaveLeakageReadingReasonWhyNot;

            // for DF_1111 - needs to be outside of the check for unsafe detail
            vm.applianceSafe = applianceSafety.applianceElectricalSafetyDetail.applianceSafe;
            vm.applianceInstallationSatisfactory = applianceSafety.applianceElectricalSafetyDetail.applianceInstallationSatisfactory;
        }

        if (applianceSafety && applianceSafety.applianceElectricalUnsafeDetail) {
            vm.unsafeReasons = applianceSafety.applianceElectricalUnsafeDetail.unsafeReasons;
            vm.report = applianceSafety.applianceElectricalUnsafeDetail.report;
            vm.conditionAsLeft = applianceSafety.applianceElectricalUnsafeDetail.conditionAsLeft;
            vm.cappedTurnedOff = applianceSafety.applianceElectricalUnsafeDetail.cappedTurnedOff;
            vm.labelAttachedRemoved = applianceSafety.applianceElectricalUnsafeDetail.labelAttachedRemoved;
            vm.ownedByCustomer = applianceSafety.applianceElectricalUnsafeDetail.ownedByCustomer;
            vm.letterLeft = applianceSafety.applianceElectricalUnsafeDetail.letterLeft;
            vm.signatureObtained = applianceSafety.applianceElectricalUnsafeDetail.signatureObtained;
            vm.ownerNameAddressPhone = applianceSafety.applianceElectricalUnsafeDetail.ownerNameAddressPhone;
        }

        return vm;
    }

    public createApplianceElectricalSafetyDetail(electricalSafetyViewModel: ElectricalSafetyViewModel): ApplianceElectricalSafetyDetail {
        let bm = new ApplianceElectricalSafetyDetail();

        if (electricalSafetyViewModel) {
            bm.electricalApplianceType = electricalSafetyViewModel.electricalApplianceType;

            bm.mainEarthChecked = electricalSafetyViewModel.mainEarthChecked;
            bm.gasBondingChecked = electricalSafetyViewModel.gasBondingChecked;
            bm.waterBondingChecked = electricalSafetyViewModel.waterBondingChecked;
            bm.otherBondingChecked = electricalSafetyViewModel.otherBondingChecked;
            bm.supplementaryBondingOrFullRcdProtectionChecked = electricalSafetyViewModel.supplementaryBondingOrFullRcdProtectionChecked;
            bm.ringContinuityReadingDone = electricalSafetyViewModel.ringContinuityReadingDone;

            bm.leInsulationResistance = electricalSafetyViewModel.leInsulationResistance;
            bm.showLeInsulationResistanceReasonWhyNot = electricalSafetyViewModel.showLeInsulationResistanceReasonWhyNot;
            bm.leInsulationResistanceReasonWhyNot = electricalSafetyViewModel.leInsulationResistanceReasonWhyNot;

            bm.neInsulationResistance = electricalSafetyViewModel.neInsulationResistance;
            bm.showNeInsulationResistanceReasonWhyNot = electricalSafetyViewModel.showNeInsulationResistanceReasonWhyNot;
            bm.neInsulationResistanceReasonWhyNot = electricalSafetyViewModel.neInsulationResistanceReasonWhyNot;

            bm.lnInsulationResistance = electricalSafetyViewModel.lnInsulationResistance;
            bm.showLnInsulationResistanceReasonWhyNot = electricalSafetyViewModel.showLnInsulationResistanceReasonWhyNot;
            bm.lnInsulationResistanceReasonWhyNot = electricalSafetyViewModel.lnInsulationResistanceReasonWhyNot;

            bm.systemType = electricalSafetyViewModel.systemType;
            bm.finalEliReadingDone = electricalSafetyViewModel.finalEliReadingDone;
            bm.finalEliReading = electricalSafetyViewModel.finalEliReading;
            bm.readingSafeAccordingToTops = electricalSafetyViewModel.readingSafeAccordingToTops;
            bm.isRcdPresent = electricalSafetyViewModel.isRcdPresent;

            bm.circuitRcdRcboProtected = electricalSafetyViewModel.circuitRcdRcboProtected;
            bm.rcdTripTimeReading = electricalSafetyViewModel.rcdTripTimeReading;
            bm.rcboTripTimeReading = electricalSafetyViewModel.rcboTripTimeReading;

            bm.applianceEarthContinuityReadingDone = electricalSafetyViewModel.applianceEarthContinuityReadingDone;
            bm.applianceEarthContinuityReading = electricalSafetyViewModel.applianceEarthContinuityReading;

            bm.isApplianceHardWired = electricalSafetyViewModel.isApplianceHardWired;
            bm.mcbFuseRating = electricalSafetyViewModel.mcbFuseRating;
            bm.showMcbFuseRatingReasonWhyNot = electricalSafetyViewModel.showMcbFuseRatingReasonWhyNot;
            bm.mcbFuseRatingReasonWhyNot = electricalSafetyViewModel.mcbFuseRatingReasonWhyNot;

            bm.applianceFuseRating = electricalSafetyViewModel.applianceFuseRating;
            bm.showApplianceFuseRatingReasonWhyNot = electricalSafetyViewModel.showApplianceFuseRatingReasonWhyNot;
            bm.applianceFuseRatingReasonWhyNot = electricalSafetyViewModel.applianceFuseRatingReasonWhyNot;

            bm.isPartP = electricalSafetyViewModel.isPartP;
            bm.partPReason = electricalSafetyViewModel.partPReason;

            bm.workedOnLightingCircuit = electricalSafetyViewModel.workedOnLightingCircuit;
            bm.cpcInLightingCircuitOk = electricalSafetyViewModel.cpcInLightingCircuitOk;

            bm.installationSatisfactory = electricalSafetyViewModel.installationSatisfactory;

            bm.microwaveLeakageReading = electricalSafetyViewModel.microwaveLeakageReading;
            bm.showMicrowaveLeakageReadingReasonWhyNot = electricalSafetyViewModel.showMicrowaveLeakageReadingReasonWhyNot;
            bm.microwaveLeakageReadingReasonWhyNot = electricalSafetyViewModel.microwaveLeakageReadingReasonWhyNot;

            bm.applianceSafe = electricalSafetyViewModel.applianceSafe;
            bm.applianceInstallationSatisfactory = electricalSafetyViewModel.applianceInstallationSatisfactory;
        }

        return bm;
    }

    public createApplianceElectricalUnsafeDetail(electricalSafetyViewModel: ElectricalSafetyViewModel): ApplianceElectricalUnsafeDetail {
        let bm = new ApplianceElectricalUnsafeDetail();

        if (electricalSafetyViewModel) {
            bm.unsafeReasons = electricalSafetyViewModel.unsafeReasons;
            bm.report = electricalSafetyViewModel.report;
            bm.conditionAsLeft = electricalSafetyViewModel.conditionAsLeft;
            bm.cappedTurnedOff = electricalSafetyViewModel.cappedTurnedOff;
            bm.labelAttachedRemoved = electricalSafetyViewModel.labelAttachedRemoved;
            bm.ownedByCustomer = electricalSafetyViewModel.ownedByCustomer;
            bm.letterLeft = electricalSafetyViewModel.letterLeft;
            bm.signatureObtained = electricalSafetyViewModel.signatureObtained;
            bm.ownerNameAddressPhone = electricalSafetyViewModel.ownerNameAddressPhone;
        }

        return bm;
    }
}
