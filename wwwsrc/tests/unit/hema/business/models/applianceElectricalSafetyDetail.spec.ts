/// <reference path="../../../../../typings/app.d.ts" />

import {ApplianceElectricalSafetyDetail} from "../../../../../app/hema/business/models/applianceElectricalSafetyDetail";
import { DataState } from "../../../../../app/hema/business/models/dataState";

describe("the ApplianceElectricalSafetyDetail module", () => {
    let applianceElectricalSafetyDetail: ApplianceElectricalSafetyDetail;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        applianceElectricalSafetyDetail = new ApplianceElectricalSafetyDetail();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(applianceElectricalSafetyDetail).toBeDefined();
    });

    describe("isTouched", () => {

        let reset = () => {
            applianceElectricalSafetyDetail = new ApplianceElectricalSafetyDetail();
            applianceElectricalSafetyDetail.dataState = DataState.invalid;
            applianceElectricalSafetyDetail.dataStateGroup = "a";
            applianceElectricalSafetyDetail.dataStateId = "a";
            applianceElectricalSafetyDetail.systemType = "a";
            applianceElectricalSafetyDetail.electricalApplianceType = "a";
        }

        it("is touched when any property (apart from boring core ones - see reset()) is set", () => {
            reset();
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(false);
            reset();
            applianceElectricalSafetyDetail.mainEarthChecked = "a";
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.gasBondingChecked = "a";
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.waterBondingChecked = "a";
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.otherBondingChecked = "a";
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.supplementaryBondingOrFullRcdProtectionChecked = "a";
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.ringContinuityReadingDone = "a";
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.leInsulationResistance = 0;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.showLeInsulationResistanceReasonWhyNot = false;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.leInsulationResistanceReasonWhyNot = "a";
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.neInsulationResistance = 0;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.showNeInsulationResistanceReasonWhyNot = false;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.neInsulationResistanceReasonWhyNot = "a";
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.lnInsulationResistance = 0;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.showLnInsulationResistanceReasonWhyNot = false;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.lnInsulationResistanceReasonWhyNot = "a";
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.finalEliReadingDone = false;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.finalEliReading = 0;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.readingSafeAccordingToTops = false;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.isRcdPresent = false;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.circuitRcdRcboProtected = "a";
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.rcdTripTimeReading = 0;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.rcboTripTimeReading = 0;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.applianceEarthContinuityReadingDone = false;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.applianceEarthContinuityReading = 0;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.isApplianceHardWired = false;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.mcbFuseRating = "a";
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.showMcbFuseRatingReasonWhyNot = false;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.mcbFuseRatingReasonWhyNot = "a";
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.applianceFuseRating = "a";
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.showApplianceFuseRatingReasonWhyNot = false;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.applianceFuseRatingReasonWhyNot = "a";
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.isPartP = false;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.partPReason = "a";
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.workedOnLightingCircuit = false;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.cpcInLightingCircuitOk = false;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.installationSatisfactory = false;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.microwaveLeakageReading = 0;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.showMicrowaveLeakageReadingReasonWhyNot = false;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.microwaveLeakageReadingReasonWhyNot = "a";
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.applianceSafe = false;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
            reset();
            applianceElectricalSafetyDetail.applianceInstallationSatisfactory = false;
            expect(ApplianceElectricalSafetyDetail.isTouched(applianceElectricalSafetyDetail)).toBe(true);
        })

    });
});
