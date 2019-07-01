/// <reference path="../../../../../typings/app.d.ts" />

import {ApplianceGasSafetyFactory} from "../../../../../app/hema/presentation/factories/applianceGasSafetyFactory";
import {ApplianceGasUnsafeDetail} from "../../../../../app/hema/business/models/applianceGasUnsafeDetail";
import {GasSafetyViewModel} from "../../../../../app/hema/presentation/modules/appliances/viewModels/gasSafetyViewModel";
import {GasUnsafetyViewModel} from "../../../../../app/hema/presentation/modules/appliances/viewModels/gasUnsafetyViewModel";
import {ApplianceGasSafety} from "../../../../../app/hema/business/models/applianceGasSafety";
import {ApplianceGasReadingMaster} from "../../../../../app/hema/business/models/applianceGasReadingMaster";
import {ApplianceGasReadings} from "../../../../../app/hema/business/models/applianceGasReadings";
import {GasApplianceReadingViewModel} from "../../../../../app/hema/presentation/modules/appliances/viewModels/gasApplianceReadingViewModel";
import { GasApplianceReadingsMasterViewModel } from "../../../../../app/hema/presentation/modules/appliances/viewModels/gasApplianceReadingsMasterViewModel";
import {DataState} from "../../../../../app/hema/business/models/dataState";
import {YesNoNa} from "../../../../../app/hema/business/models/yesNoNa";

describe("the applianceGasSafetyFactory", () => {
    let sandbox: Sinon.SinonSandbox;
    let applianceGasSafetyFactory: ApplianceGasSafetyFactory;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        applianceGasSafetyFactory = new ApplianceGasSafetyFactory();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(applianceGasSafetyFactory).toBeDefined();
    });

    describe("the createApplianceGasReadingsBusinessModel function", () => {

        it("can be called", () => {
            let methodSpy: Sinon.SinonSpy = sandbox.spy(applianceGasSafetyFactory, "createApplianceGasReadingsBusinessModel");

            applianceGasSafetyFactory.createApplianceGasReadingsBusinessModel(null);

            expect(methodSpy.calledOnce).toBe(true);
        });

        it("can map fields correctly and return a ApplianceGasReadingMaster business model", () => {
            let viewModel = new GasApplianceReadingViewModel();
            viewModel.burnerPressure = 1;
            viewModel.gasRateReading = 1;
            viewModel.isLpg = false;
            viewModel.isUnsafeReadings = true;
            viewModel.readingFirstRatio = 1;
            viewModel.readingFirstCO = 1;
            viewModel.readingFirstCO2 = 1;
            viewModel.readingMinRatio = 1;
            viewModel.readingMinCO = 1;
            viewModel.readingMinCO2 = 1;
            viewModel.readingMaxRatio = 1;
            viewModel.readingMaxCO = 1;
            viewModel.readingMaxCO2 = 1;
            viewModel.readingFinalRatio = 1;
            viewModel.readingFinalCO = 1;
            viewModel.readingFinalCO2 = 1;
            viewModel.burnerPressureUnsafe = false;
            viewModel.finalRatioUnsafe = true;
            viewModel.gasReadingUnsafe = false;

            let readingsMasterViewModel = new GasApplianceReadingsMasterViewModel();
            readingsMasterViewModel.workedOnPreliminaryPerformanceReadings = true;
            readingsMasterViewModel.workedOnSupplementaryPerformanceReadings = true;
            readingsMasterViewModel.workedOnMainReadings = true;
            readingsMasterViewModel.supplementaryBurnerFitted = true;
            readingsMasterViewModel.preliminaryReadings = viewModel;
            readingsMasterViewModel.supplementaryReadings = viewModel;
            readingsMasterViewModel.dataState = DataState.valid;

            let businessModel = applianceGasSafetyFactory.createApplianceGasReadingsBusinessModel(readingsMasterViewModel);

            expect(businessModel).toBeDefined();
            expect(businessModel.workedOnApplianceReadings).toEqual(readingsMasterViewModel.workedOnPreliminaryPerformanceReadings);
            expect(businessModel.workedOnMainReadings).toEqual(readingsMasterViewModel.workedOnMainReadings);
            expect(businessModel.supplementaryBurnerFitted).toEqual(readingsMasterViewModel.supplementaryBurnerFitted);
            expect(businessModel.workedOnSupplementaryApplianceReadings).toEqual(readingsMasterViewModel.workedOnSupplementaryPerformanceReadings);

            expect(businessModel.preliminaryReadings.burnerPressure).toEqual(viewModel.burnerPressure);
            expect(businessModel.preliminaryReadings.gasRateReading).toEqual(viewModel.gasRateReading);
            expect(businessModel.preliminaryReadings.isLpg).toEqual(viewModel.isLpg);
            expect(businessModel.preliminaryReadings.isUnsafeReadings).toEqual(viewModel.isUnsafeReadings);
            expect(businessModel.preliminaryReadings.readingFirstRatio).toEqual(viewModel.readingFirstRatio);
            expect(businessModel.preliminaryReadings.readingFirstCO).toEqual(viewModel.readingFirstCO);
            expect(businessModel.preliminaryReadings.readingFirstCO2).toEqual(viewModel.readingFirstCO2);

            expect(businessModel.preliminaryReadings.readingMinRatio).toEqual(viewModel.readingMinRatio);
            expect(businessModel.preliminaryReadings.readingMinCO).toEqual(viewModel.readingMinCO);
            expect(businessModel.preliminaryReadings.readingMinCO2).toEqual(viewModel.readingMinCO2);

            expect(businessModel.preliminaryReadings.readingMaxRatio).toEqual(viewModel.readingMaxRatio);
            expect(businessModel.preliminaryReadings.readingMaxCO).toEqual(viewModel.readingMaxCO);
            expect(businessModel.preliminaryReadings.readingMaxCO2).toEqual(viewModel.readingMaxCO2);

            expect(businessModel.preliminaryReadings.readingFinalRatio).toEqual(viewModel.readingFinalRatio);
            expect(businessModel.preliminaryReadings.readingFinalCO).toEqual(viewModel.readingFinalCO);
            expect(businessModel.preliminaryReadings.readingFinalCO2).toEqual(viewModel.readingFinalCO2);

            expect(businessModel.preliminaryReadings.burnerPressureUnsafe).toEqual(viewModel.burnerPressureUnsafe);
            expect(businessModel.preliminaryReadings.finalRatioUnsafe).toEqual(viewModel.finalRatioUnsafe);
            expect(businessModel.preliminaryReadings.gasReadingUnsafe).toEqual(viewModel.gasReadingUnsafe);

            expect(businessModel.supplementaryReadings.burnerPressure).toEqual(viewModel.burnerPressure);
            expect(businessModel.supplementaryReadings.gasRateReading).toEqual(viewModel.gasRateReading);
            expect(businessModel.supplementaryReadings.isLpg).toEqual(viewModel.isLpg);
            expect(businessModel.supplementaryReadings.isUnsafeReadings).toEqual(viewModel.isUnsafeReadings);
            expect(businessModel.supplementaryReadings.readingFirstRatio).toEqual(viewModel.readingFirstRatio);
            expect(businessModel.supplementaryReadings.readingFirstCO).toEqual(viewModel.readingFirstCO);
            expect(businessModel.supplementaryReadings.readingFirstCO2).toEqual(viewModel.readingFirstCO2);

            expect(businessModel.supplementaryReadings.readingMinRatio).toEqual(viewModel.readingMinRatio);
            expect(businessModel.supplementaryReadings.readingMinCO).toEqual(viewModel.readingMinCO);
            expect(businessModel.supplementaryReadings.readingMinCO2).toEqual(viewModel.readingMinCO2);

            expect(businessModel.supplementaryReadings.readingMaxRatio).toEqual(viewModel.readingMaxRatio);
            expect(businessModel.supplementaryReadings.readingMaxCO).toEqual(viewModel.readingMaxCO);
            expect(businessModel.supplementaryReadings.readingMaxCO2).toEqual(viewModel.readingMaxCO2);

            expect(businessModel.supplementaryReadings.readingFinalRatio).toEqual(viewModel.readingFinalRatio);
            expect(businessModel.supplementaryReadings.readingFinalCO).toEqual(viewModel.readingFinalCO);
            expect(businessModel.supplementaryReadings.readingFinalCO2).toEqual(viewModel.readingFinalCO2);

            expect(businessModel.supplementaryReadings.burnerPressureUnsafe).toEqual(viewModel.burnerPressureUnsafe);
            expect(businessModel.supplementaryReadings.finalRatioUnsafe).toEqual(viewModel.finalRatioUnsafe);
            expect(businessModel.supplementaryReadings.gasReadingUnsafe).toEqual(viewModel.gasReadingUnsafe);
            expect(businessModel.dataState).toEqual(DataState.valid);
        });
    });

    describe("the createApplianceGasReadingsViewModel function", () => {

        it("can be called", () => {
            let methodSpy: Sinon.SinonSpy = sandbox.spy(applianceGasSafetyFactory, "createApplianceGasReadingsViewModel");

            applianceGasSafetyFactory.createApplianceGasReadingsViewModel(null);

            expect(methodSpy.calledOnce).toBe(true);
        });

        it("can map fields correctly and return a ApplianceGasReadingMaster view model", () => {
            let model = new ApplianceGasReadings();
            model.burnerPressure = 1;
            model.gasRateReading = 1;
            model.isLpg = false;
            model.isUnsafeReadings = true;
            model.readingFirstRatio = 1;
            model.readingFirstCO = 1;
            model.readingFirstCO2 = 1;
            model.readingMinRatio = 1;
            model.readingMinCO = 1;
            model.readingMinCO2 = 1;
            model.readingMaxRatio = 1;
            model.readingMaxCO = 1;
            model.readingMaxCO2 = 1;
            model.readingFinalRatio = 1;
            model.readingFinalCO = 1;
            model.readingFinalCO2 = 1;
            model.burnerPressureUnsafe = false;
            model.finalRatioUnsafe = true;
            model.gasReadingUnsafe = false;   

            let applianceGasReadingMasterBusinessModel = new ApplianceGasReadingMaster();
            applianceGasReadingMasterBusinessModel.workedOnApplianceReadings = true;
            applianceGasReadingMasterBusinessModel.workedOnMainReadings = true;
            applianceGasReadingMasterBusinessModel.workedOnSupplementaryApplianceReadings = false;
            applianceGasReadingMasterBusinessModel.supplementaryBurnerFitted = false;
            applianceGasReadingMasterBusinessModel.preliminaryReadings = model;
            applianceGasReadingMasterBusinessModel.supplementaryReadings = undefined;
            applianceGasReadingMasterBusinessModel.dataState = DataState.invalid;


            let viewModel = applianceGasSafetyFactory.createApplianceGasReadingsViewModel(applianceGasReadingMasterBusinessModel);

            expect(viewModel).toBeDefined();
            expect(viewModel.preliminaryReadings.burnerPressure).toEqual(model.burnerPressure);
            expect(viewModel.preliminaryReadings.gasRateReading).toEqual(model.gasRateReading);
            expect(viewModel.preliminaryReadings.isLpg).toEqual(model.isLpg);
            expect(viewModel.preliminaryReadings.isUnsafeReadings).toEqual(model.isUnsafeReadings);
            expect(viewModel.preliminaryReadings.readingFirstRatio).toEqual(model.readingFirstRatio);
            expect(viewModel.preliminaryReadings.readingFirstCO).toEqual(model.readingFirstCO);
            expect(viewModel.preliminaryReadings.readingFirstCO2).toEqual(model.readingFirstCO2);

            expect(viewModel.preliminaryReadings.readingMinRatio).toEqual(model.readingMinRatio);
            expect(viewModel.preliminaryReadings.readingMinCO).toEqual(model.readingMinCO);
            expect(viewModel.preliminaryReadings.readingMinCO2).toEqual(model.readingMinCO2);

            expect(viewModel.preliminaryReadings.readingMaxRatio).toEqual(model.readingMaxRatio);
            expect(viewModel.preliminaryReadings.readingMaxCO).toEqual(model.readingMaxCO);
            expect(viewModel.preliminaryReadings.readingMaxCO2).toEqual(model.readingMaxCO2);

            expect(viewModel.preliminaryReadings.readingFinalRatio).toEqual(model.readingFinalRatio);
            expect(viewModel.preliminaryReadings.readingFinalCO).toEqual(model.readingFinalCO);
            expect(viewModel.preliminaryReadings.readingFinalCO2).toEqual(model.readingFinalCO2);

            expect(viewModel.preliminaryReadings.burnerPressureUnsafe).toEqual(model.burnerPressureUnsafe);
            expect(viewModel.preliminaryReadings.finalRatioUnsafe).toEqual(model.finalRatioUnsafe);
            expect(viewModel.preliminaryReadings.gasReadingUnsafe).toEqual(model.gasReadingUnsafe);

            expect(viewModel.supplementaryBurnerFitted).toEqual(applianceGasReadingMasterBusinessModel.supplementaryBurnerFitted);
            expect(viewModel.workedOnMainReadings).toEqual(applianceGasReadingMasterBusinessModel.workedOnMainReadings);
            expect(viewModel.workedOnPreliminaryPerformanceReadings).toEqual(applianceGasReadingMasterBusinessModel.workedOnApplianceReadings);
            expect(viewModel.workedOnSupplementaryPerformanceReadings).toEqual(applianceGasReadingMasterBusinessModel.workedOnSupplementaryApplianceReadings);
            expect(viewModel.dataState).toEqual(applianceGasReadingMasterBusinessModel.dataState);
        });
    });

    describe("the createApplianceGasSafetyViewModel function", () => {

        it("can be called", () => {
            let methodSpy: Sinon.SinonSpy = sandbox.spy(applianceGasSafetyFactory, "createApplianceGasSafetyViewModel");

            applianceGasSafetyFactory.createApplianceGasSafetyViewModel(null);

            expect(methodSpy.calledOnce).toBe(true);
        });

        it("can map fields correctly and return a GasSafety view model", () => {
            let businessModel = new ApplianceGasSafety();

            businessModel.isApplianceSafe = true;
            businessModel.workedOnAppliance = true;
            businessModel.chimneyInstallationAndTests = YesNoNa.Yes;
            businessModel.installationTightnessTestSafe = YesNoNa.Yes;
            businessModel.ventilationSafe = true;
            businessModel.applianceStripped = true;
            businessModel.visuallyCheckRelight = true;
            businessModel.safetyDevice = 0;
            businessModel.toCurrentStandards = YesNoNa.Yes;
            businessModel.performanceTestsNotDoneReason = "test";
            businessModel.performanceTestsNotDoneReasonForSupplementary = undefined;
            businessModel.summaryPrelimLpgWarningTrigger = true;
            businessModel.summarySuppLpgWarningTrigger = false;
            businessModel.dataState = DataState.dontCare;
            
            let viewModel = applianceGasSafetyFactory.createApplianceGasSafetyViewModel(businessModel);

            expect(viewModel).toBeDefined();
            expect(viewModel.workedOnAppliance).toEqual(businessModel.workedOnAppliance);
            expect(viewModel.isApplianceSafe).toEqual(businessModel.isApplianceSafe);
            expect(viewModel.performanceTestsNotDoneReason).toEqual(businessModel.performanceTestsNotDoneReason);
            expect(viewModel.chimneyInstallationAndTests).toEqual(businessModel.chimneyInstallationAndTests);
            expect(viewModel.applianceTightness).toEqual(businessModel.installationTightnessTestSafe);
            expect(viewModel.ventSizeConfig).toEqual(businessModel.ventilationSafe);
            expect(viewModel.performanceTestsNotDoneReasonForSupplementary).toEqual(businessModel.performanceTestsNotDoneReasonForSupplementary);
            expect(viewModel.applianceStripped).toEqual(businessModel.applianceStripped);
            expect(viewModel.didYouVisuallyCheck).toEqual(businessModel.visuallyCheckRelight);
            expect(viewModel.safetyDevice).toEqual(businessModel.safetyDevice);    
            expect(viewModel.toCurrentStandards).toEqual(businessModel.toCurrentStandards);
            expect(viewModel.summaryPrelimLpgWarningTrigger).toEqual(businessModel.summaryPrelimLpgWarningTrigger);
            expect(viewModel.summarySuppLpgWarningTrigger).toEqual(businessModel.summarySuppLpgWarningTrigger);
            expect(viewModel.dataState).toEqual(businessModel.dataState);
        });
    });

    describe("the createApplianceGasSafetyBusinessModel function", () => {

        it("can be called", () => {
            let methodSpy: Sinon.SinonSpy = sandbox.spy(applianceGasSafetyFactory, "createApplianceGasSafetyBusinessModel");

            applianceGasSafetyFactory.createApplianceGasSafetyBusinessModel(null);

            expect(methodSpy.calledOnce).toBe(true);
        });

        it("can map fields correctly and return a GasSafety business model", () => {
            let vm = new GasSafetyViewModel();

            vm.isApplianceSafe = true;
            vm.workedOnAppliance = true;
            vm.chimneyInstallationAndTests = YesNoNa.Na;
            vm.applianceTightness = YesNoNa.Yes;
            vm.ventSizeConfig = true;
            vm.applianceStripped = true;
            vm.didYouVisuallyCheck = true;
            vm.safetyDevice = 0;
            vm.summaryPrelimLpgWarningTrigger = true;
            vm.summarySuppLpgWarningTrigger = false;
            vm.dataState = DataState.dontCare;
            vm.performanceTestsNotDoneReason = "test";
            vm.performanceTestsNotDoneReasonForSupplementary = undefined;            
            vm.applianceMake = "test";
            vm.applianceModel = "test model";
            vm.ableToTest = true;
            vm.requestedToTest = true;

            let businessModel = applianceGasSafetyFactory.createApplianceGasSafetyBusinessModel(vm);

            expect(businessModel).toBeDefined();
            expect(businessModel.isApplianceSafe).toEqual(vm.isApplianceSafe);
            expect(businessModel.installationTightnessTestSafe).toEqual(vm.applianceTightness);
            expect(businessModel.ventilationSafe).toEqual(vm.ventSizeConfig);
            expect(businessModel.performanceTestsNotDoneReason).toEqual(vm.performanceTestsNotDoneReason);
            expect(businessModel.applianceStripped).toEqual(vm.applianceStripped);
            expect(businessModel.visuallyCheckRelight).toEqual(vm.didYouVisuallyCheck);
            expect(businessModel.safetyDevice).toEqual(vm.safetyDevice);    
            expect(businessModel.summarySuppLpgWarningTrigger).toEqual(vm.summarySuppLpgWarningTrigger);    
            expect(businessModel.summaryPrelimLpgWarningTrigger).toEqual(vm.summaryPrelimLpgWarningTrigger);
            expect(businessModel.applianceMake).toEqual(vm.applianceMake);
            expect(businessModel.applianceModel).toEqual(vm.applianceModel);
            expect(businessModel.ableToTest).toEqual(vm.ableToTest);
            expect(businessModel.requestedToTest).toEqual(vm.requestedToTest);            
            expect(businessModel.dataState).toEqual(DataState.dontCare);
        });
    });    

    describe("the createApplianceGasUnsafeBusinessModel function", () => {

        it("can be called", () => {
            let methodSpy: Sinon.SinonSpy = sandbox.spy(applianceGasSafetyFactory, "createApplianceGasUnsafeBusinessModel");

            applianceGasSafetyFactory.createApplianceGasUnsafeBusinessModel(null);

            expect(methodSpy.calledOnce).toBe(true);
        });

        it("can map fields correctly", () => {
            let vm = new GasUnsafetyViewModel();

            vm.report = "test report";
            vm.cappedTurnedOff = "C";
            vm.conditionAsLeft = "X";
            vm.labelAttachedRemoved = "A";
            vm.letterLeft = true;
            vm.ownedByCustomer = false;
            vm.signatureObtained = true;
            
            let gasUnsafeBusinessModel = applianceGasSafetyFactory.createApplianceGasUnsafeBusinessModel(vm);

            expect(gasUnsafeBusinessModel).toBeDefined();
            expect(gasUnsafeBusinessModel.report).toEqual(vm.report);
            expect(gasUnsafeBusinessModel.cappedTurnedOff).toEqual(vm.cappedTurnedOff);
            expect(gasUnsafeBusinessModel.conditionAsLeft).toEqual(vm.conditionAsLeft);
            expect(gasUnsafeBusinessModel.labelAttachedRemoved).toEqual(vm.labelAttachedRemoved);
            expect(gasUnsafeBusinessModel.letterLeft).toEqual(vm.letterLeft);
            expect(gasUnsafeBusinessModel.ownedByCustomer).toEqual(vm.ownedByCustomer);
            expect(gasUnsafeBusinessModel.signatureObtained).toEqual(vm.signatureObtained);
        });
    });  

    describe("the createApplianceGasUnsafeViewModel function", () => {

        it("can be called", () => {
            let methodSpy: Sinon.SinonSpy = sandbox.spy(applianceGasSafetyFactory, "createApplianceGasUnsafeViewModel");

            applianceGasSafetyFactory.createApplianceGasUnsafeViewModel(null);

            expect(methodSpy.calledOnce).toBe(true);
        });

        it("can map fields correctly", () => {
            let GasUnsafeBusinessModel = new ApplianceGasUnsafeDetail();

            GasUnsafeBusinessModel.report = "test report";
            GasUnsafeBusinessModel.cappedTurnedOff = "C";
            GasUnsafeBusinessModel.conditionAsLeft = "X";
            GasUnsafeBusinessModel.labelAttachedRemoved = "A";
            GasUnsafeBusinessModel.letterLeft = true;
            GasUnsafeBusinessModel.ownedByCustomer = true;
            GasUnsafeBusinessModel.signatureObtained = false;

            let vm = applianceGasSafetyFactory.createApplianceGasUnsafeViewModel(GasUnsafeBusinessModel);

            expect(vm).toBeDefined();
            expect(vm.report).toEqual(GasUnsafeBusinessModel.report);
            expect(vm.cappedTurnedOff).toEqual(GasUnsafeBusinessModel.cappedTurnedOff);
            expect(vm.conditionAsLeft).toEqual(GasUnsafeBusinessModel.conditionAsLeft);
            expect(vm.labelAttachedRemoved).toEqual(GasUnsafeBusinessModel.labelAttachedRemoved);
            expect(vm.letterLeft).toEqual(GasUnsafeBusinessModel.letterLeft);
            expect(vm.ownedByCustomer).toEqual(GasUnsafeBusinessModel.ownedByCustomer);
            expect(vm.signatureObtained).toEqual(GasUnsafeBusinessModel.signatureObtained);
        });
    });            
});
