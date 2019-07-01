import { IApplianceGasSafetyFactory } from "./interfaces/IApplianceGasSafetyFactory";
import { ApplianceGasUnsafeDetail } from "../../business/models/applianceGasUnsafeDetail";
import { GasSafetyViewModel } from "../modules/appliances/viewModels/gasSafetyViewModel";
import { GasUnsafetyViewModel } from "../modules/appliances/viewModels/gasUnsafetyViewModel";
import { ApplianceGasSafety } from "../../business/models/applianceGasSafety";
import { ApplianceGasReadings } from "../../business/models/applianceGasReadings";
import { GasApplianceReadingViewModel } from "../modules/appliances/viewModels/gasApplianceReadingViewModel";
import { ApplianceGasReadingMaster } from "../../business/models/applianceGasReadingMaster";
import { GasApplianceReadingsMasterViewModel } from "../modules/appliances/viewModels/gasApplianceReadingsMasterViewModel";
import {YesNoNa} from "../../business/models/yesNoNa";

export class ApplianceGasSafetyFactory implements IApplianceGasSafetyFactory {

    public createApplianceGasReadingsBusinessModel(vm: GasApplianceReadingsMasterViewModel): ApplianceGasReadingMaster {
        if (!vm) {
            vm = new GasApplianceReadingsMasterViewModel();
        }

        let model: ApplianceGasReadingMaster = new ApplianceGasReadingMaster();

        model.workedOnApplianceReadings = vm.workedOnPreliminaryPerformanceReadings;
        model.workedOnMainReadings = vm.workedOnMainReadings;
        model.supplementaryBurnerFitted = vm.supplementaryBurnerFitted;
        model.workedOnSupplementaryApplianceReadings = vm.workedOnSupplementaryPerformanceReadings;
                
        model.preliminaryReadings = this.createReadingsBusinessModel(vm.preliminaryReadings);
        model.supplementaryReadings = this.createReadingsBusinessModel(vm.supplementaryReadings);

        model.dataState = vm.dataState;
        model.dataStateId = vm.dataStateId;

        return model;
    }

    public createApplianceGasReadingsViewModel(model: ApplianceGasReadingMaster): GasApplianceReadingsMasterViewModel {
        let vm = new GasApplianceReadingsMasterViewModel();

        if (!model) {
            model = new ApplianceGasReadingMaster();
        }

        vm.workedOnPreliminaryPerformanceReadings = model.workedOnApplianceReadings;
        vm.workedOnMainReadings = model.workedOnMainReadings;
        vm.supplementaryBurnerFitted = model.supplementaryBurnerFitted;
        vm.workedOnSupplementaryPerformanceReadings = model.workedOnSupplementaryApplianceReadings;

        vm.preliminaryReadings = this.createReadingsViewModel(model.preliminaryReadings);
        vm.supplementaryReadings = this.createReadingsViewModel(model.supplementaryReadings);

        vm.dataState = model.dataState;
        vm.dataStateId = model.dataStateId;

        return vm;
    }

    public createApplianceGasSafetyBusinessModel(vm: GasSafetyViewModel): ApplianceGasSafety {
        if (!vm) {
            vm = new GasSafetyViewModel();
        }

        let model: ApplianceGasSafety = new ApplianceGasSafety();

        model.installationTightnessTestSafe = vm.applianceTightness;
        model.ventilationSafe = vm.ventSizeConfig;
        model.performanceTestsNotDoneReason = vm.performanceTestsNotDoneReason;
        model.applianceStripped = vm.applianceStripped;
        model.performanceTestsNotDoneReasonForSupplementary = vm.performanceTestsNotDoneReasonForSupplementary;
        model.supplementaryApplianceStripped = vm.supplementaryApplianceStripped;
        model.visuallyCheckRelight = vm.didYouVisuallyCheck;
        model.safetyDevice = vm.safetyDevice;
        model.isApplianceSafe = vm.isApplianceSafe;
        model.toCurrentStandards = vm.toCurrentStandards;
        model.workedOnAppliance = vm.workedOnAppliance;
        model.chimneyInstallationAndTests = vm.chimneyInstallationAndTests;

        model.overrideWorkedOnAppliance = vm.overrideWorkedOnAppliance;

        model.summaryPrelimLpgWarningTrigger = vm.summaryPrelimLpgWarningTrigger;
        model.summarySuppLpgWarningTrigger = vm.summarySuppLpgWarningTrigger;

        model.applianceMake = vm.applianceMake;
        model.applianceModel = vm.applianceModel;
        model.ableToTest = vm.ableToTest;
        model.requestedToTest = vm.requestedToTest;

        model.dataState = vm.dataState;
        model.dataStateId = vm.dataStateId;
        model.dataStateGroup = vm.dataStateGroup;

        if (vm.workedOnAppliance === true) {
            model.installationSafe = YesNoNa.Na;
        } else {
            if (vm.isApplianceSafe === true) {
                model.installationSafe = YesNoNa.Yes;
            } else if (vm.isApplianceSafe === false) {
                model.installationSafe = YesNoNa.No;
            }
        }

        return model;
    }

    public createApplianceGasSafetyViewModel(model: ApplianceGasSafety): GasSafetyViewModel {
        let vm = new GasSafetyViewModel();
        if (!model) {
            model = new ApplianceGasSafety();
        }

        vm.chimneyInstallationAndTests = model.chimneyInstallationAndTests;
        vm.applianceTightness = model.installationTightnessTestSafe;
        vm.ventSizeConfig = model.ventilationSafe;
        vm.performanceTestsNotDoneReason = model.performanceTestsNotDoneReason;
        vm.applianceStripped = model.applianceStripped;
        vm.performanceTestsNotDoneReasonForSupplementary = model.performanceTestsNotDoneReasonForSupplementary;
        vm.supplementaryApplianceStripped = model.supplementaryApplianceStripped;
        vm.didYouVisuallyCheck = model.visuallyCheckRelight;
        vm.safetyDevice = model.safetyDevice;
        vm.isApplianceSafe = model.isApplianceSafe;
        vm.toCurrentStandards = model.toCurrentStandards;
        vm.workedOnAppliance = model.workedOnAppliance;

        vm.overrideWorkedOnAppliance = model.overrideWorkedOnAppliance;
        vm.summaryPrelimLpgWarningTrigger = model.summaryPrelimLpgWarningTrigger;
        vm.summarySuppLpgWarningTrigger = model.summarySuppLpgWarningTrigger;

        vm.applianceMake = model.applianceMake;
        vm.applianceModel = model.applianceModel;
        vm.ableToTest = model.ableToTest;
        vm.requestedToTest = model.requestedToTest;

        vm.dataState = model.dataState;
        vm.dataStateId = model.dataStateId;
        vm.dataStateGroup = model.dataStateGroup;

        return vm;
    }

    public createApplianceGasUnsafeBusinessModel(vm: GasUnsafetyViewModel): ApplianceGasUnsafeDetail {
        if (!vm) {
            vm = new GasUnsafetyViewModel();
        }

        let model = new ApplianceGasUnsafeDetail();
        model.report = vm.report;
        model.cappedTurnedOff = vm.cappedTurnedOff;
        model.conditionAsLeft = vm.conditionAsLeft;
        model.labelAttachedRemoved = vm.labelAttachedRemoved;
        model.letterLeft = vm.letterLeft;
        model.ownedByCustomer = vm.ownedByCustomer;
        model.signatureObtained = vm.signatureObtained;

        return model;
    }

    public createApplianceGasUnsafeViewModel(model: ApplianceGasUnsafeDetail): GasUnsafetyViewModel {
        let vm = new GasUnsafetyViewModel();
        if (!model) {
            model = new ApplianceGasUnsafeDetail();
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

    private createReadingsViewModel(model: ApplianceGasReadings): GasApplianceReadingViewModel {
        let vm = new GasApplianceReadingViewModel();
        if (!model) {
            model = new ApplianceGasReadings();
        }
        vm.burnerPressure = model.burnerPressure;
        vm.gasRateReading = model.gasRateReading;
        vm.isLpg = model.isLpg;

        vm.readingFirstRatio = model.readingFirstRatio;
        vm.readingFirstCO = model.readingFirstCO;
        vm.readingFirstCO2 = model.readingFirstCO2;

        vm.readingMinRatio = model.readingMinRatio;
        vm.readingMinCO = model.readingMinCO;
        vm.readingMinCO2 = model.readingMinCO2;

        vm.readingMaxRatio = model.readingMaxRatio;
        vm.readingMaxCO = model.readingMaxCO;
        vm.readingMaxCO2 = model.readingMaxCO2;

        vm.readingFinalRatio = model.readingFinalRatio;
        vm.readingFinalCO = model.readingFinalCO;
        vm.readingFinalCO2 = model.readingFinalCO2;

        vm.burnerPressureUnsafe = model.burnerPressureUnsafe;
        vm.finalRatioUnsafe = model.finalRatioUnsafe;
        vm.gasReadingUnsafe = model.gasReadingUnsafe;

        vm.isUnsafeReadings = model.isUnsafeReadings;

        vm.askIfLpg = model.askIfLpg;
        return vm;
    }

    private createReadingsBusinessModel(vm: GasApplianceReadingViewModel): ApplianceGasReadings {
        let model = new ApplianceGasReadings();
        if (!vm) {
            vm = new GasApplianceReadingViewModel();
        }
        model.burnerPressure = vm.burnerPressure;
        model.gasRateReading = vm.gasRateReading;
        model.isLpg = vm.isLpg;

        model.readingFirstRatio = vm.readingFirstRatio;
        model.readingFirstCO = vm.readingFirstCO;
        model.readingFirstCO2 = vm.readingFirstCO2;

        model.readingMinRatio = vm.readingMinRatio;
        model.readingMinCO = vm.readingMinCO;
        model.readingMinCO2 = vm.readingMinCO2;

        model.readingMaxRatio = vm.readingMaxRatio;
        model.readingMaxCO = vm.readingMaxCO;
        model.readingMaxCO2 = vm.readingMaxCO2;

        model.readingFinalRatio = vm.readingFinalRatio;
        model.readingFinalCO = vm.readingFinalCO;
        model.readingFinalCO2 = vm.readingFinalCO2;

        model.burnerPressureUnsafe = vm.burnerPressureUnsafe;
        model.finalRatioUnsafe = vm.finalRatioUnsafe;
        model.gasReadingUnsafe = vm.gasReadingUnsafe;

        model.isUnsafeReadings = vm.isUnsafeReadings;

        model.askIfLpg = vm.askIfLpg;
        return model;
    }
}
