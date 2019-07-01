/// <reference path="../../../../../../../typings/app.d.ts" />

import {ElectricalSafetyViewModel} from "../../../../../../../app/hema/presentation/modules/appliances/viewModels/electricalSafetyViewModel";

describe("the ElectricalSafetyViewModel module", () => {
    let electricalSafetyViewModel: ElectricalSafetyViewModel;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        let rules = {
            "applianceTypeElectrical": "E",
            "applianceTypeWhiteGoods": "W",
            "applianceTypeMicrowave": "M",
            "itemCheckedQuestionNo": "N",
            "itemCheckedQuestionNotChecked": "C",
            "ringContinuityReadingDoneFail": "F",
            "leInsulationResistanceMinThreshold": 1,
            "neInsulationResistanceMinThreshold": 1,
            "lnInsulationResistanceMinThreshold": 1,
            "systemTypeUnableToCheck": "U",
            "systemTypeTt": "T",
            "eliReadingRcdPresentMaxThreshold": 1,
            "finalEliReadingMinThreshold": 1,
            "circuitRcdProtectedNo": "N",
            "circuitRcdProtected": "R",
            "circuitRcboProtected": "C",
            "circuitRcdProtectedCustRefusedTest": "CRT",
            "rcdTripTimeReadingFirstThreshold": 1,
            "rcdTripTimeReadingSecondThreshold": 199,
            "rcboTripTimeReading": 1,
            "rcboTripTimeReadingMinThreshold": 1,
            "applianceEarthContinuityReadingMaxThreshold": 1,
            "mcbFuseRatingUnsafeReason": "R",
            "applianceFuseRatingUnsafeReason": "R",
            "microwaveLeakageMaxThreshold": 1,
            };
        electricalSafetyViewModel = new ElectricalSafetyViewModel(rules);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(electricalSafetyViewModel).toBeDefined();
    });

    describe("intial page state", () => {

        it("can call recalculate for an electrical appliance and show correct initial fields", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            electricalSafetyViewModel.recalculateflowState();

            let fieldsAndVisibility = electricalSafetyViewModel.getPropertiesToBind()
                .map(key => ({key: key, visible: <any>electricalSafetyViewModel[key + "Visible"]}));

            let expectedVisibleFieldNames = [
                "mainEarthChecked", "gasBondingChecked", "waterBondingChecked", "otherBondingChecked",
                "supplementaryBondingOrFullRcdProtectionChecked","ringContinuityReadingDone", "leInsulationResistance", "showLeInsulationResistanceReasonWhyNot",
                "neInsulationResistance", "showNeInsulationResistanceReasonWhyNot", "lnInsulationResistance", "showLnInsulationResistanceReasonWhyNot", "systemType",
                "finalEliReadingDone", "circuitRcdRcboProtected", "mcbFuseRating", "showMcbFuseRatingReasonWhyNot", "isPartP", "workedOnLightingCircuit", "installationSatisfactory"];

            let actualVisibleFieldNames = fieldsAndVisibility
                                            .filter(f => f.visible)
                                            .map(f => f.key);

            expect(actualVisibleFieldNames.sort()).toEqual(expectedVisibleFieldNames.sort());
        });

        it("can call recalculate for a white goods appliance and show correct initial fields", () => {
            electricalSafetyViewModel.electricalApplianceType = "W";
            electricalSafetyViewModel.recalculateflowState();

            let fieldsAndVisibility = electricalSafetyViewModel.getPropertiesToBind()
            .map(key => ({key: key, visible: <any>electricalSafetyViewModel[key + "Visible"]}));

            let expectedVisibleFieldNames = [
                "leInsulationResistance", "showLeInsulationResistanceReasonWhyNot", "neInsulationResistance",
                "showNeInsulationResistanceReasonWhyNot", "finalEliReadingDone", "isApplianceHardWired",
                "applianceSafe", "applianceInstallationSatisfactory"];

            let actualVisibleFieldNames = fieldsAndVisibility
                                            .filter(f => f.visible)
                                            .map(f => f.key);

            expect(actualVisibleFieldNames.sort()).toEqual(expectedVisibleFieldNames.sort());
        });

        it("can call recalculate for a microwave appliance and show correct initial fields", () => {
            electricalSafetyViewModel.electricalApplianceType = "M";
            electricalSafetyViewModel.recalculateflowState();

            let fieldsAndVisibility = electricalSafetyViewModel.getPropertiesToBind()
                .map(key => ({key: key, visible: <any>electricalSafetyViewModel[key + "Visible"]}));

            let expectedVisibleFieldNames = [
                "leInsulationResistance", "showLeInsulationResistanceReasonWhyNot", "finalEliReadingDone",
                "isApplianceHardWired", "microwaveLeakageReading", "showMicrowaveLeakageReadingReasonWhyNot",
                "applianceSafe", "applianceInstallationSatisfactory"];

            let actualVisibleFieldNames = fieldsAndVisibility
                                            .filter(f => f.visible)
                                            .map(f => f.key);

            expect(actualVisibleFieldNames.sort()).toEqual(expectedVisibleFieldNames.sort());
        });
    });

    describe("unsafe situations can be triggered", () => {

        let recalculateAndAssertNotUnsafe = () => {
            electricalSafetyViewModel.recalculateflowState();
            expect(electricalSafetyViewModel.unsafeReasons.length).toBe(0);
        };

        let reclaculateAndAssertUnsafe = (key: string, isMandatory: boolean, conditionsAsLeft?: string[] ) => {
            electricalSafetyViewModel.recalculateflowState();
            expect(electricalSafetyViewModel.unsafeReasons.length).toBe(1);
            expect(electricalSafetyViewModel.unsafeReasons[0]).toEqual({field: key, mandatory: isMandatory});
            expect(electricalSafetyViewModel.availableConditionAsLefts).toEqual(conditionsAsLeft || ["AR", "ID", "SS", "XC"])
        };

        it("mainEarthChecked", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.mainEarthChecked = "N";
            reclaculateAndAssertUnsafe("mainEarthChecked", true);
        });

        it("mainEarthUnChecked", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.mainEarthChecked = "C";
            reclaculateAndAssertUnsafe("mainEarthUnChecked", true);
        });

        it("gasBondingChecked", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.gasBondingChecked = "N";
            reclaculateAndAssertUnsafe("gasBondingChecked", true);
        });

        it("gasBondingUnChecked", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.gasBondingChecked = "C";
            reclaculateAndAssertUnsafe("gasBondingUnChecked", true);
        });

        it("waterBondingChecked", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.waterBondingChecked = "N";
            reclaculateAndAssertUnsafe("waterBondingChecked", true);
        });

        it("waterBondingUnChecked", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.waterBondingChecked = "C";
            reclaculateAndAssertUnsafe("waterBondingUnChecked", true);
        });

        it("otherBondingChecked", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.otherBondingChecked = "N";
            reclaculateAndAssertUnsafe("otherBondingChecked", true);
        });

        it("otherBondingUnChecked", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.otherBondingChecked = "C";
            reclaculateAndAssertUnsafe("otherBondingUnChecked", true);
        });

        it("supplementaryBondingOrFullRcdProtectionChecked", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.supplementaryBondingOrFullRcdProtectionChecked = "N";
            reclaculateAndAssertUnsafe("supplementaryBondingOrFullRcdProtectionChecked", true, ["SS"]);
        });

        it("supplementaryBondingOrFullRcdProtectionUnChecked", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.supplementaryBondingOrFullRcdProtectionChecked = "C";
            reclaculateAndAssertUnsafe("supplementaryBondingOrFullRcdProtectionUnChecked", true, ["SS"]);
        });

        it("ringContinuityReadingDone", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.ringContinuityReadingDone = "F";
            reclaculateAndAssertUnsafe("ringContinuityReadingDone", true, ["AR", "ID"]);
        });

        it("leInsulationResistance", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.leInsulationResistance = 0.99;
            reclaculateAndAssertUnsafe("leInsulationResistance", true, ["AR", "ID"]);
        });

        it("neInsulationResistance", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.neInsulationResistance = 0.99;
            reclaculateAndAssertUnsafe("neInsulationResistance", true, ["AR", "ID"]);
        });

        it("lnInsulationResistance", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.lnInsulationResistance = 0.99;
            reclaculateAndAssertUnsafe("lnInsulationResistance", true, ["AR", "ID"]);
        });

        it("systemType", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.systemType = "U";
            reclaculateAndAssertUnsafe("systemType", true, ["AR", "ID"]);
        });

        it("finalEliReadingDone", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.finalEliReadingDone  = false;
            reclaculateAndAssertUnsafe("finalEliReadingDone", true, ["AR", "ID"]);
        });

        it("finalEliReading", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            electricalSafetyViewModel.finalEliReadingDone = true;
            electricalSafetyViewModel.isRcdPresent = true;
            electricalSafetyViewModel.finalEliReading = 1;
            electricalSafetyViewModel.systemType = "T";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.finalEliReading = 1.01;
            reclaculateAndAssertUnsafe("finalEliReading", true, ["AR", "ID"]);
        });

        it("readingSafeAccordingToTops", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            electricalSafetyViewModel.systemType = "X";
            electricalSafetyViewModel.finalEliReadingDone = true;
            electricalSafetyViewModel.finalEliReading = 1.01;
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.readingSafeAccordingToTops = false;
            reclaculateAndAssertUnsafe("readingSafeAccordingToTops", true, ["AR", "ID"]);
        });

        it("isRcdPresent", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            electricalSafetyViewModel.finalEliReadingDone = true;
            electricalSafetyViewModel.systemType = "T";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.isRcdPresent = false;
            reclaculateAndAssertUnsafe("isRcdPresent", true, ["AR", "ID"]);
        });

        it("circuitRcdRcboProtected", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.circuitRcdRcboProtected = "N";
            electricalSafetyViewModel.finalEliReading  = 1.01;
            reclaculateAndAssertUnsafe("circuitRcdRcboProtected", true, ["AR", "ID"]);
        });

        it("rcdTripTimeReading", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            electricalSafetyViewModel.circuitRcdRcboProtected  = "R";
            electricalSafetyViewModel.finalEliReadingDone = true;
            electricalSafetyViewModel.finalEliReading = 1.01;
            electricalSafetyViewModel.rcdTripTimeReading = undefined;
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.rcdTripTimeReading = 199;
            expect(electricalSafetyViewModel.unsafeReasons.length === 0).toBeTruthy();
            electricalSafetyViewModel.rcdTripTimeReading = 200.01;
            reclaculateAndAssertUnsafe("rcdTripTimeReading", false, ["AR", "ID", "SS"]);
        });

        it("rcboTripTimeReading", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            electricalSafetyViewModel.circuitRcdRcboProtected  = "C";
            electricalSafetyViewModel.finalEliReadingDone = true;
            electricalSafetyViewModel.finalEliReading = 1.01;
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.rcboTripTimeReading = 1.01;
            reclaculateAndAssertUnsafe("rcboTripTimeReading", true, ["AR", "ID"]);
        });

        it("applianceEarthContinuityReading", () => {
            electricalSafetyViewModel.electricalApplianceType = "W";
            electricalSafetyViewModel.finalEliReadingDone = false;
            electricalSafetyViewModel.applianceEarthContinuityReadingDone = true;
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.applianceEarthContinuityReading  = 1.01;
            reclaculateAndAssertUnsafe("applianceEarthContinuityReading", true, ["AR", "ID"]);
        });

        it("mcbFuseRating", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            electricalSafetyViewModel.isApplianceHardWired = true;
            electricalSafetyViewModel.showMcbFuseRatingReasonWhyNot = false;
            electricalSafetyViewModel.applianceEarthContinuityReading  = 1.01;
            electricalSafetyViewModel.mcbFuseRating = "";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.mcbFuseRating = undefined;
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.mcbFuseRating = "5";
            recalculateAndAssertNotUnsafe();
        });

        it("mcbFuseRatingReasonWhyNot", () => {
            electricalSafetyViewModel.electricalApplianceType = "W";
            electricalSafetyViewModel.isApplianceHardWired = true;
            electricalSafetyViewModel.showMcbFuseRatingReasonWhyNot = true;
            electricalSafetyViewModel.applianceEarthContinuityReading  = 1.01;
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.mcbFuseRatingReasonWhyNot = "R";
            reclaculateAndAssertUnsafe("mcbFuseRatingReasonWhyNot", true, ["AR", "ID"]);
        });

        it("applianceFuseRatingReasonWhyNot", () => {
            electricalSafetyViewModel.electricalApplianceType = "W";
            electricalSafetyViewModel.isApplianceHardWired = false;
            electricalSafetyViewModel.showApplianceFuseRatingReasonWhyNot = true;
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.applianceFuseRatingReasonWhyNot = "R";
            reclaculateAndAssertUnsafe("applianceFuseRatingReasonWhyNot", true, ["AR", "ID"]);
        });

        it("cpcInLightingCircuitOk", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            electricalSafetyViewModel.workedOnLightingCircuit = true;
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.cpcInLightingCircuitOk = false;
            reclaculateAndAssertUnsafe("cpcInLightingCircuitOk", true);
        });

        it("installationSatisfactory", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.installationSatisfactory = false;
            reclaculateAndAssertUnsafe("installationSatisfactory", true);
        });

        it("microwaveLeakageReading", () => {
            electricalSafetyViewModel.electricalApplianceType = "M";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.microwaveLeakageReading = 1.01;
            reclaculateAndAssertUnsafe("microwaveLeakageReading", true, ["AR", "ID"]);
        });

        it("applianceSafe", () => {
            electricalSafetyViewModel.electricalApplianceType = "W";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.applianceSafe = false;
            reclaculateAndAssertUnsafe("applianceSafe", true, ["AR", "ID"]);
        });

        it("applianceInstallationSatisfactory", () => {
            electricalSafetyViewModel.electricalApplianceType = "W";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.applianceInstallationSatisfactory = false;
            reclaculateAndAssertUnsafe("applianceInstallationSatisfactory", true, ["AR", "ID"]);
        });

        it("can remove an unsafe reason", () => {
            electricalSafetyViewModel.electricalApplianceType = "W";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.applianceInstallationSatisfactory = false;
            reclaculateAndAssertUnsafe("applianceInstallationSatisfactory", true, ["AR", "ID"]);
            electricalSafetyViewModel.applianceInstallationSatisfactory = true;
            recalculateAndAssertNotUnsafe();
        });

        it("can add multiple unsafe situations", () => {
            electricalSafetyViewModel.electricalApplianceType = "W";
            recalculateAndAssertNotUnsafe();
            electricalSafetyViewModel.applianceSafe = false;
            electricalSafetyViewModel.applianceInstallationSatisfactory = false;

            electricalSafetyViewModel.recalculateflowState();
            expect(electricalSafetyViewModel.unsafeReasons.length).toBe(2);
        });
    });

    describe("reset handlers", () => {
        it("leInsulationResistance", () => {
            electricalSafetyViewModel.leInsulationResistance = 1;
            electricalSafetyViewModel.leInsulationResistanceReasonWhyNot = "X";
            electricalSafetyViewModel.recalculateflowState("leInsulationResistanceReasonWhyNot");
            expect(electricalSafetyViewModel.leInsulationResistance).toBeUndefined();
        });

        it("showLeInsulationResistanceReasonWhyNot", () => {
            electricalSafetyViewModel.showLeInsulationResistanceReasonWhyNot = true ;
            electricalSafetyViewModel.leInsulationResistance = 1;
            electricalSafetyViewModel.recalculateflowState("leInsulationResistance");
            expect(electricalSafetyViewModel.showLeInsulationResistanceReasonWhyNot).toBeUndefined();
        });

        it("leInsulationResistanceReasonWhyNot", () => {
            electricalSafetyViewModel.leInsulationResistanceReasonWhyNot = "X";
            electricalSafetyViewModel.leInsulationResistance = 1;
            electricalSafetyViewModel.recalculateflowState("leInsulationResistance");
            expect(electricalSafetyViewModel.leInsulationResistanceReasonWhyNot).toBeUndefined();
        });

        it("neInsulationResistance", () => {
            electricalSafetyViewModel.neInsulationResistance = 1;
            electricalSafetyViewModel.neInsulationResistanceReasonWhyNot = "X";
            electricalSafetyViewModel.recalculateflowState("neInsulationResistanceReasonWhyNot");
            expect(electricalSafetyViewModel.neInsulationResistance).toBeUndefined();
        });

        it("showNeInsulationResistanceReasonWhyNot", () => {
            electricalSafetyViewModel.showNeInsulationResistanceReasonWhyNot = true ;
            electricalSafetyViewModel.neInsulationResistance = 1;
            electricalSafetyViewModel.recalculateflowState("neInsulationResistance");
            expect(electricalSafetyViewModel.showNeInsulationResistanceReasonWhyNot).toBeUndefined();
        });

        it("neInsulationResistanceReasonWhyNot", () => {
            electricalSafetyViewModel.neInsulationResistanceReasonWhyNot = "X";
            electricalSafetyViewModel.neInsulationResistance = 1;
            electricalSafetyViewModel.recalculateflowState("neInsulationResistance");
            expect(electricalSafetyViewModel.neInsulationResistanceReasonWhyNot).toBeUndefined();
        });

        it("lnInsulationResistance", () => {
            electricalSafetyViewModel.lnInsulationResistance = 1;
            electricalSafetyViewModel.lnInsulationResistanceReasonWhyNot = "X";
            electricalSafetyViewModel.recalculateflowState("lnInsulationResistanceReasonWhyNot");
            expect(electricalSafetyViewModel.lnInsulationResistance).toBeUndefined();
        });

        it("showLnInsulationResistanceReasonWhyNot", () => {
            electricalSafetyViewModel.showLnInsulationResistanceReasonWhyNot = true ;
            electricalSafetyViewModel.lnInsulationResistance = 1;
            electricalSafetyViewModel.recalculateflowState("lnInsulationResistance");
            expect(electricalSafetyViewModel.showLnInsulationResistanceReasonWhyNot).toBeUndefined();
        });

        it("lnInsulationResistanceReasonWhyNot", () => {
            electricalSafetyViewModel.lnInsulationResistanceReasonWhyNot = "X";
            electricalSafetyViewModel.lnInsulationResistance = 1;
            electricalSafetyViewModel.recalculateflowState("lnInsulationResistance");
            expect(electricalSafetyViewModel.lnInsulationResistanceReasonWhyNot).toBeUndefined();
        });

        it("finalEliReading", () => {
            electricalSafetyViewModel.finalEliReading = 1;
            electricalSafetyViewModel.finalEliReadingDone = false;
            electricalSafetyViewModel.recalculateflowState();
            expect(electricalSafetyViewModel.finalEliReading).toBeUndefined();
        });

        it("readingSafeAccordingToTops", () => {
            electricalSafetyViewModel.readingSafeAccordingToTops = true;
            electricalSafetyViewModel.finalEliReadingDone = false;
            electricalSafetyViewModel.recalculateflowState();
            expect(electricalSafetyViewModel.readingSafeAccordingToTops).toBeUndefined();
        });

        it("isRcdPresent", () => {
            electricalSafetyViewModel.isRcdPresent = true;
            electricalSafetyViewModel.finalEliReadingDone = false;
            electricalSafetyViewModel.recalculateflowState();
            expect(electricalSafetyViewModel.isRcdPresent).toBeUndefined();
        });

        it("rcdTripTimeReading", () => {
            electricalSafetyViewModel.rcdTripTimeReading = 1;
            electricalSafetyViewModel.circuitRcdRcboProtected = "X";
            electricalSafetyViewModel.recalculateflowState();
            expect(electricalSafetyViewModel.rcdTripTimeReading).toBeUndefined();
        });

        it("rcboTripTimeReading", () => {
            electricalSafetyViewModel.rcboTripTimeReading = 1;
            electricalSafetyViewModel.circuitRcdRcboProtected = "X";
            electricalSafetyViewModel.recalculateflowState();
            expect(electricalSafetyViewModel.rcboTripTimeReading).toBeUndefined();
        });

        it("mcbFuseRating", () => {
            electricalSafetyViewModel.mcbFuseRating = "X";
            electricalSafetyViewModel.mcbFuseRatingReasonWhyNot = "X";
            electricalSafetyViewModel.recalculateflowState("mcbFuseRatingReasonWhyNot");
            expect(electricalSafetyViewModel.mcbFuseRating).toBeUndefined();
        });

        it("showMcbFuseRatingReasonWhyNot", () => {
            electricalSafetyViewModel.mcbFuseRating = "X";
            electricalSafetyViewModel.recalculateflowState("mcbFuseRating");
            expect(electricalSafetyViewModel.showMcbFuseRatingReasonWhyNot).toBeUndefined();
        });

        it("mcbFuseRatingReasonWhyNot", () => {
            electricalSafetyViewModel.showMcbFuseRatingReasonWhyNot = true;
            electricalSafetyViewModel.mcbFuseRating = "X";
            electricalSafetyViewModel.recalculateflowState("mcbFuseRating");
            expect(electricalSafetyViewModel.mcbFuseRatingReasonWhyNot).toBeUndefined();
        });

        it("applianceFuseRating", () => {
            electricalSafetyViewModel.applianceFuseRating = "X";
            electricalSafetyViewModel.applianceFuseRatingReasonWhyNot = "X";
            electricalSafetyViewModel.recalculateflowState("applianceFuseRatingReasonWhyNot");
            expect(electricalSafetyViewModel.applianceFuseRating).toBeUndefined();
        });

        it("showApplianceFuseRatingReasonWhyNot", () => {
            electricalSafetyViewModel.showApplianceFuseRatingReasonWhyNot = true;
            electricalSafetyViewModel.applianceFuseRating = "X";
            electricalSafetyViewModel.recalculateflowState("applianceFuseRating");
            expect(electricalSafetyViewModel.showApplianceFuseRatingReasonWhyNot).toBeUndefined();
        });

        it("applianceFuseRatingReasonWhyNot", () => {
            electricalSafetyViewModel.applianceFuseRatingReasonWhyNot = "X";
            electricalSafetyViewModel.applianceFuseRating = "X";
            electricalSafetyViewModel.recalculateflowState("applianceFuseRating");
            expect(electricalSafetyViewModel.applianceFuseRatingReasonWhyNot).toBeUndefined();
        });

        it("partPReason", () => {
            electricalSafetyViewModel.partPReason = "X";
            electricalSafetyViewModel.isPartP = false;
            electricalSafetyViewModel.recalculateflowState();
            expect(electricalSafetyViewModel.partPReason).toBeUndefined();
        });

        it("cpcInLightingCircuitOk", () => {
            electricalSafetyViewModel.cpcInLightingCircuitOk = true;
            electricalSafetyViewModel.workedOnLightingCircuit = false;
            electricalSafetyViewModel.recalculateflowState();
            expect(electricalSafetyViewModel.cpcInLightingCircuitOk).toBeUndefined();
        });

        it("will not reset if the field itself is the one being changed", () => {
            electricalSafetyViewModel.electricalApplianceType = "E";
            electricalSafetyViewModel.leInsulationResistanceVisible = true;
            electricalSafetyViewModel.showLeInsulationResistanceReasonWhyNot = true;
            electricalSafetyViewModel.leInsulationResistance = 1;
            electricalSafetyViewModel.recalculateflowState("leInsulationResistance");
            expect(electricalSafetyViewModel.leInsulationResistance).toBe(1);
        });
    });
});
