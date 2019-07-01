/// <reference path="../../../../../typings/app.d.ts" />

import {ApplianceSafetyFactory} from "../../../../../app/hema/presentation/factories/applianceSafetyFactory";
import {ApplianceElectricalUnsafeDetail as ApplianceElectricalUnsafeBusinessModel} from "../../../../../app/hema/business/models/applianceElectricalUnsafeDetail";
import {ElectricalSafetyViewModel} from "../../../../../app/hema/presentation/modules/appliances/viewModels/electricalSafetyViewModel";
import {ApplianceElectricalSafetyDetail} from "../../../../../app/hema/business/models/applianceElectricalSafetyDetail";
import {ApplianceSafety} from "../../../../../app/hema/business/models/applianceSafety";

describe("the applianceSafetyFactory factory", () => {
    let sandbox: Sinon.SinonSandbox;
    let applianceSafetyFactory: ApplianceSafetyFactory;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        applianceSafetyFactory = new ApplianceSafetyFactory();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(applianceSafetyFactory).toBeDefined();
    });

    describe("the createApplianceElectricalUnsafeDetail function", () => {

        beforeEach(() => {
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can be called", () => {
            let methodSpy: Sinon.SinonSpy = sandbox.spy(applianceSafetyFactory, "createApplianceElectricalUnsafeDetail");

            applianceSafetyFactory.createApplianceElectricalUnsafeDetail(null);

            expect(methodSpy.calledOnce).toBe(true);
        });

        it("can map fields correctly and return ApplianceElectricalUnsafeDetail business model", () => {
            let viewModel = new ElectricalSafetyViewModel({});

            viewModel.unsafeReasons = [{field: "Reason 1", mandatory: true}, {field: "Reason 2", mandatory: false}];
            viewModel.report = "This is the unsafe report";
            viewModel.conditionAsLeft = "CAL";
            viewModel.cappedTurnedOff = "CTO";
            viewModel.labelAttachedRemoved = "LAR";
            viewModel.ownedByCustomer = true;
            viewModel.letterLeft = true;
            viewModel.signatureObtained = true;
            viewModel.ownerNameAddressPhone = "01234567890";

            let businessModel = applianceSafetyFactory.createApplianceElectricalUnsafeDetail(viewModel);

            expect(businessModel).toBeDefined();
            expect(businessModel.unsafeReasons).toEqual([{field: "Reason 1", mandatory: true}, {field: "Reason 2", mandatory: false}]);
            expect(businessModel.report).toEqual("This is the unsafe report");
            expect(businessModel.conditionAsLeft).toEqual("CAL");
            expect(businessModel.cappedTurnedOff).toEqual("CTO");
            expect(businessModel.labelAttachedRemoved).toEqual("LAR");
            expect(businessModel.ownedByCustomer).toEqual(true);
            expect(businessModel.letterLeft).toEqual(true);
            expect(businessModel.signatureObtained).toEqual(true);
            expect(businessModel.ownerNameAddressPhone).toEqual("01234567890");
        });
    });

    describe("the createApplianceElectricalSafetyDetail function", () => {

        beforeEach(() => {
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can be called", () => {
            let methodSpy: Sinon.SinonSpy = sandbox.spy(applianceSafetyFactory, "createApplianceElectricalSafetyDetail");

            applianceSafetyFactory.createApplianceElectricalSafetyDetail(null);

            expect(methodSpy.calledOnce).toBe(true);
        });

        it("can map fields correctly and returns ApplianceElectricalSafetyDetail business model", () => {
            let viewModel = new ElectricalSafetyViewModel({});

            viewModel.electricalApplianceType = "ELECTRICAL";

            viewModel.mainEarthChecked = "Y";
            viewModel.gasBondingChecked = "Y";
            viewModel.waterBondingChecked = "Y";
            viewModel.otherBondingChecked = "Y";
            viewModel.supplementaryBondingOrFullRcdProtectionChecked = "Y";
            viewModel.ringContinuityReadingDone = "Y";

            viewModel.leInsulationResistance = 1;
            viewModel.leInsulationResistanceReasonWhyNot = "";

            viewModel.neInsulationResistance = 1;
            viewModel.neInsulationResistanceReasonWhyNot = "";

            viewModel.lnInsulationResistance = 1;
            viewModel.lnInsulationResistanceReasonWhyNot = "";

            viewModel.systemType = "TT";
            viewModel.finalEliReading = 1;
            viewModel.readingSafeAccordingToTops = true;
            viewModel.isRcdPresent = true;

            viewModel.circuitRcdRcboProtected = "Y";
            viewModel.rcdTripTimeReading = 1;
            viewModel.rcboTripTimeReading = 1;

            viewModel.applianceEarthContinuityReading = 1;

            viewModel.isApplianceHardWired = true;
            viewModel.mcbFuseRating = "1";
            viewModel.mcbFuseRatingReasonWhyNot = "";

            viewModel.applianceFuseRating = "1";
            viewModel.applianceFuseRatingReasonWhyNot = "";

            viewModel.isPartP = false;
            viewModel.partPReason = "";

            viewModel.workedOnLightingCircuit = false;
            viewModel.cpcInLightingCircuitOk = false;

            viewModel.installationSatisfactory = true;

            viewModel.microwaveLeakageReading = 1;
            viewModel.microwaveLeakageReadingReasonWhyNot = "";

            viewModel.applianceSafe = true;
            viewModel.applianceInstallationSatisfactory = true;

            let businessModel = applianceSafetyFactory.createApplianceElectricalSafetyDetail(viewModel);

            expect(businessModel).toBeDefined();
            expect(businessModel.electricalApplianceType).toEqual("ELECTRICAL");

            expect(businessModel.mainEarthChecked).toEqual("Y");
            expect(businessModel.gasBondingChecked).toEqual("Y");
            expect(businessModel.waterBondingChecked).toEqual("Y");
            expect(businessModel.otherBondingChecked).toEqual("Y");
            expect(businessModel.supplementaryBondingOrFullRcdProtectionChecked).toEqual("Y");
            expect(businessModel.ringContinuityReadingDone).toEqual("Y");

            expect(businessModel.leInsulationResistance).toEqual(1);
            expect(businessModel.leInsulationResistanceReasonWhyNot).toEqual("");

            expect(businessModel.neInsulationResistance).toEqual(1);
            expect(businessModel.neInsulationResistanceReasonWhyNot).toEqual("");

            expect(businessModel.lnInsulationResistance).toEqual(1);
            expect(businessModel.lnInsulationResistanceReasonWhyNot).toEqual("");

            expect(businessModel.systemType).toEqual("TT");
            expect(businessModel.finalEliReading).toEqual(1);
            expect(businessModel.readingSafeAccordingToTops).toEqual(true);
            expect(businessModel.isRcdPresent).toEqual(true);

            expect(businessModel.circuitRcdRcboProtected).toEqual("Y");
            expect(businessModel.rcdTripTimeReading).toEqual(1);
            expect(businessModel.rcboTripTimeReading).toEqual(1);

            expect(businessModel.applianceEarthContinuityReading).toEqual(1);

            expect(businessModel.isApplianceHardWired).toEqual(true);
            expect(businessModel.mcbFuseRating).toEqual("1");
            expect(businessModel.mcbFuseRatingReasonWhyNot).toEqual("");

            expect(businessModel.applianceFuseRating).toEqual("1");
            expect(businessModel.applianceFuseRatingReasonWhyNot).toEqual("");

            expect(businessModel.isPartP).toEqual(false);
            expect(businessModel.partPReason).toEqual("");

            expect(businessModel.workedOnLightingCircuit).toEqual(false);
            expect(businessModel.cpcInLightingCircuitOk).toEqual(false);

            expect(businessModel.installationSatisfactory).toEqual(true);

            expect(businessModel.microwaveLeakageReading).toEqual(1);
            expect(businessModel.microwaveLeakageReadingReasonWhyNot).toEqual("");

            expect(businessModel.applianceSafe).toEqual(true);
            expect(businessModel.applianceInstallationSatisfactory).toEqual(true);
        });
    });

    describe("the createElectricalSafetyViewModel function", () => {

        it("can be called", () => {
            let methodSpy: Sinon.SinonSpy = sandbox.spy(applianceSafetyFactory, "createElectricalSafetyViewModel");

            applianceSafetyFactory.createElectricalSafetyViewModel(null, undefined);

            expect(methodSpy.calledOnce).toBe(true);
        });

        it("can map fields correctly", () => {
            let safetyDetailBusinessModel = new ApplianceElectricalSafetyDetail();

            safetyDetailBusinessModel.electricalApplianceType = "ELECTRICAL";

            safetyDetailBusinessModel.mainEarthChecked = "Y";
            safetyDetailBusinessModel.gasBondingChecked = "Y";
            safetyDetailBusinessModel.waterBondingChecked = "Y";
            safetyDetailBusinessModel.otherBondingChecked = "Y";
            safetyDetailBusinessModel.supplementaryBondingOrFullRcdProtectionChecked = "Y";
            safetyDetailBusinessModel.ringContinuityReadingDone = "Y";

            safetyDetailBusinessModel.leInsulationResistance = 1;
            safetyDetailBusinessModel.leInsulationResistanceReasonWhyNot = "";

            safetyDetailBusinessModel.neInsulationResistance = 1;
            safetyDetailBusinessModel.neInsulationResistanceReasonWhyNot = "";

            safetyDetailBusinessModel.lnInsulationResistance = 1;
            safetyDetailBusinessModel.lnInsulationResistanceReasonWhyNot = "";

            safetyDetailBusinessModel.systemType = "TT";
            safetyDetailBusinessModel.finalEliReading = 1;
            safetyDetailBusinessModel.readingSafeAccordingToTops = true;
            safetyDetailBusinessModel.isRcdPresent = true;

            safetyDetailBusinessModel.circuitRcdRcboProtected = "Y";
            safetyDetailBusinessModel.rcdTripTimeReading = 1;
            safetyDetailBusinessModel.rcboTripTimeReading = 1;

            safetyDetailBusinessModel.applianceEarthContinuityReading = 1;

            safetyDetailBusinessModel.isApplianceHardWired = true;
            safetyDetailBusinessModel.mcbFuseRating = "1";
            safetyDetailBusinessModel.mcbFuseRatingReasonWhyNot = "";

            safetyDetailBusinessModel.applianceFuseRating = "1";
            safetyDetailBusinessModel.applianceFuseRatingReasonWhyNot = "";

            safetyDetailBusinessModel.isPartP = false;
            safetyDetailBusinessModel.partPReason = "";

            safetyDetailBusinessModel.workedOnLightingCircuit = false;
            safetyDetailBusinessModel.cpcInLightingCircuitOk = false;

            safetyDetailBusinessModel.installationSatisfactory = true;

            safetyDetailBusinessModel.microwaveLeakageReading = 1;
            safetyDetailBusinessModel.microwaveLeakageReadingReasonWhyNot = "";

            safetyDetailBusinessModel.applianceSafe = true;
            safetyDetailBusinessModel.applianceInstallationSatisfactory = true;

            let unsafeDetailBusinessModel = new ApplianceElectricalUnsafeBusinessModel();

            unsafeDetailBusinessModel.unsafeReasons = [{field: "Reason 1", mandatory: true}, {field: "Reason 2", mandatory: false}];
            unsafeDetailBusinessModel.report = "This is the unsafe report";
            unsafeDetailBusinessModel.conditionAsLeft = "CAL";
            unsafeDetailBusinessModel.cappedTurnedOff = "CTO";
            unsafeDetailBusinessModel.labelAttachedRemoved = "LAR";
            unsafeDetailBusinessModel.ownedByCustomer = true;
            unsafeDetailBusinessModel.letterLeft = true;
            unsafeDetailBusinessModel.signatureObtained = true;
            unsafeDetailBusinessModel.ownerNameAddressPhone = "01234567890";

            let applianceSafety = new ApplianceSafety();
            applianceSafety.applianceElectricalSafetyDetail = safetyDetailBusinessModel;
            applianceSafety.applianceElectricalUnsafeDetail = unsafeDetailBusinessModel;

            let viewModel = applianceSafetyFactory.createElectricalSafetyViewModel(applianceSafety, {});

            expect(viewModel).toBeDefined();
            expect(viewModel.electricalApplianceType).toEqual("ELECTRICAL");

            expect(viewModel.mainEarthChecked).toEqual("Y");
            expect(viewModel.gasBondingChecked).toEqual("Y");
            expect(viewModel.waterBondingChecked).toEqual("Y");
            expect(viewModel.otherBondingChecked).toEqual("Y");
            expect(viewModel.supplementaryBondingOrFullRcdProtectionChecked).toEqual("Y");
            expect(viewModel.ringContinuityReadingDone).toEqual("Y");

            expect(viewModel.leInsulationResistance).toEqual(1);
            expect(viewModel.leInsulationResistanceReasonWhyNot).toEqual("");

            expect(viewModel.neInsulationResistance).toEqual(1);
            expect(viewModel.neInsulationResistanceReasonWhyNot).toEqual("");

            expect(viewModel.lnInsulationResistance).toEqual(1);
            expect(viewModel.lnInsulationResistanceReasonWhyNot).toEqual("");

            expect(viewModel.systemType).toEqual("TT");
            expect(viewModel.finalEliReading).toEqual(1);
            expect(viewModel.readingSafeAccordingToTops).toEqual(true);
            expect(viewModel.isRcdPresent).toEqual(true);

            expect(viewModel.circuitRcdRcboProtected).toEqual("Y");
            expect(viewModel.rcdTripTimeReading).toEqual(1);
            expect(viewModel.rcboTripTimeReading).toEqual(1);

            expect(viewModel.applianceEarthContinuityReading).toEqual(1);

            expect(viewModel.isApplianceHardWired).toEqual(true);
            expect(viewModel.mcbFuseRating).toEqual("1");
            expect(viewModel.mcbFuseRatingReasonWhyNot).toEqual("");

            expect(viewModel.applianceFuseRating).toEqual("1");
            expect(viewModel.applianceFuseRatingReasonWhyNot).toEqual("");

            expect(viewModel.isPartP).toEqual(false);
            expect(viewModel.partPReason).toEqual("");

            expect(viewModel.workedOnLightingCircuit).toEqual(false);
            expect(viewModel.cpcInLightingCircuitOk).toEqual(false);

            expect(viewModel.installationSatisfactory).toEqual(true);

            expect(viewModel.microwaveLeakageReading).toEqual(1);
            expect(viewModel.microwaveLeakageReadingReasonWhyNot).toEqual("");

            expect(viewModel.applianceSafe).toEqual(true);
            expect(viewModel.applianceInstallationSatisfactory).toEqual(true);

            expect(viewModel.unsafeReasons).toEqual([{field: "Reason 1", mandatory: true}, {field: "Reason 2", mandatory: false}]);
            expect(viewModel.report).toEqual("This is the unsafe report");
            expect(viewModel.conditionAsLeft).toEqual("CAL");
            expect(viewModel.cappedTurnedOff).toEqual("CTO");
            expect(viewModel.labelAttachedRemoved).toEqual("LAR");
            expect(viewModel.ownedByCustomer).toEqual(true);
            expect(viewModel.letterLeft).toEqual(true);
            expect(viewModel.signatureObtained).toEqual(true);
            expect(viewModel.ownerNameAddressPhone).toEqual("01234567890");
        });
    });
});
