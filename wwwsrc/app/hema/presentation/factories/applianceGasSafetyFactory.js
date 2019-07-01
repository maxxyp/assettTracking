define(["require", "exports", "../../business/models/applianceGasUnsafeDetail", "../modules/appliances/viewModels/gasSafetyViewModel", "../modules/appliances/viewModels/gasUnsafetyViewModel", "../../business/models/applianceGasSafety", "../../business/models/applianceGasReadings", "../modules/appliances/viewModels/gasApplianceReadingViewModel", "../../business/models/applianceGasReadingMaster", "../modules/appliances/viewModels/gasApplianceReadingsMasterViewModel", "../../business/models/yesNoNa"], function (require, exports, applianceGasUnsafeDetail_1, gasSafetyViewModel_1, gasUnsafetyViewModel_1, applianceGasSafety_1, applianceGasReadings_1, gasApplianceReadingViewModel_1, applianceGasReadingMaster_1, gasApplianceReadingsMasterViewModel_1, yesNoNa_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ApplianceGasSafetyFactory = /** @class */ (function () {
        function ApplianceGasSafetyFactory() {
        }
        ApplianceGasSafetyFactory.prototype.createApplianceGasReadingsBusinessModel = function (vm) {
            if (!vm) {
                vm = new gasApplianceReadingsMasterViewModel_1.GasApplianceReadingsMasterViewModel();
            }
            var model = new applianceGasReadingMaster_1.ApplianceGasReadingMaster();
            model.workedOnApplianceReadings = vm.workedOnPreliminaryPerformanceReadings;
            model.workedOnMainReadings = vm.workedOnMainReadings;
            model.supplementaryBurnerFitted = vm.supplementaryBurnerFitted;
            model.workedOnSupplementaryApplianceReadings = vm.workedOnSupplementaryPerformanceReadings;
            model.preliminaryReadings = this.createReadingsBusinessModel(vm.preliminaryReadings);
            model.supplementaryReadings = this.createReadingsBusinessModel(vm.supplementaryReadings);
            model.dataState = vm.dataState;
            model.dataStateId = vm.dataStateId;
            return model;
        };
        ApplianceGasSafetyFactory.prototype.createApplianceGasReadingsViewModel = function (model) {
            var vm = new gasApplianceReadingsMasterViewModel_1.GasApplianceReadingsMasterViewModel();
            if (!model) {
                model = new applianceGasReadingMaster_1.ApplianceGasReadingMaster();
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
        };
        ApplianceGasSafetyFactory.prototype.createApplianceGasSafetyBusinessModel = function (vm) {
            if (!vm) {
                vm = new gasSafetyViewModel_1.GasSafetyViewModel();
            }
            var model = new applianceGasSafety_1.ApplianceGasSafety();
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
                model.installationSafe = yesNoNa_1.YesNoNa.Na;
            }
            else {
                if (vm.isApplianceSafe === true) {
                    model.installationSafe = yesNoNa_1.YesNoNa.Yes;
                }
                else if (vm.isApplianceSafe === false) {
                    model.installationSafe = yesNoNa_1.YesNoNa.No;
                }
            }
            return model;
        };
        ApplianceGasSafetyFactory.prototype.createApplianceGasSafetyViewModel = function (model) {
            var vm = new gasSafetyViewModel_1.GasSafetyViewModel();
            if (!model) {
                model = new applianceGasSafety_1.ApplianceGasSafety();
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
        };
        ApplianceGasSafetyFactory.prototype.createApplianceGasUnsafeBusinessModel = function (vm) {
            if (!vm) {
                vm = new gasUnsafetyViewModel_1.GasUnsafetyViewModel();
            }
            var model = new applianceGasUnsafeDetail_1.ApplianceGasUnsafeDetail();
            model.report = vm.report;
            model.cappedTurnedOff = vm.cappedTurnedOff;
            model.conditionAsLeft = vm.conditionAsLeft;
            model.labelAttachedRemoved = vm.labelAttachedRemoved;
            model.letterLeft = vm.letterLeft;
            model.ownedByCustomer = vm.ownedByCustomer;
            model.signatureObtained = vm.signatureObtained;
            return model;
        };
        ApplianceGasSafetyFactory.prototype.createApplianceGasUnsafeViewModel = function (model) {
            var vm = new gasUnsafetyViewModel_1.GasUnsafetyViewModel();
            if (!model) {
                model = new applianceGasUnsafeDetail_1.ApplianceGasUnsafeDetail();
            }
            vm.report = model.report;
            vm.cappedTurnedOff = model.cappedTurnedOff;
            vm.conditionAsLeft = model.conditionAsLeft;
            vm.labelAttachedRemoved = model.labelAttachedRemoved;
            vm.letterLeft = model.letterLeft;
            vm.ownedByCustomer = model.ownedByCustomer;
            vm.signatureObtained = model.signatureObtained;
            return vm;
        };
        ApplianceGasSafetyFactory.prototype.createReadingsViewModel = function (model) {
            var vm = new gasApplianceReadingViewModel_1.GasApplianceReadingViewModel();
            if (!model) {
                model = new applianceGasReadings_1.ApplianceGasReadings();
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
        };
        ApplianceGasSafetyFactory.prototype.createReadingsBusinessModel = function (vm) {
            var model = new applianceGasReadings_1.ApplianceGasReadings();
            if (!vm) {
                vm = new gasApplianceReadingViewModel_1.GasApplianceReadingViewModel();
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
        };
        return ApplianceGasSafetyFactory;
    }());
    exports.ApplianceGasSafetyFactory = ApplianceGasSafetyFactory;
});

//# sourceMappingURL=applianceGasSafetyFactory.js.map
