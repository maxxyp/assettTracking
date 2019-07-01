/// <reference path="../../../../../typings/app.d.ts" />

import {ApplianceOtherSafetyFactory} from "../../../../../app/hema/presentation/factories/applianceOtherSafetyFactory";
import {OtherSafetyViewModel} from "../../../../../app/hema/presentation/modules/appliances/viewModels/otherSafetyViewModel";
import {OtherUnsafetyViewModel} from "../../../../../app/hema/presentation/modules/appliances/viewModels/otherUnsafetyViewModel";
import {ApplianceOtherUnsafeDetail} from "../../../../../app/hema/business/models/applianceOtherUnsafeDetail";
import {ApplianceOtherSafety} from "../../../../../app/hema/business/models/applianceOtherSafety";
import {DataState} from "../../../../../app/hema/business/models/dataState";
import {YesNoNa} from "../../../../../app/hema/business/models/yesNoNa";

describe("ApplianceOtherSafetyFactory", () => {
    let applianceOtherSafetyFactory: ApplianceOtherSafetyFactory;

    beforeEach(() => {
        applianceOtherSafetyFactory = new ApplianceOtherSafetyFactory();
    });

    it("can be created", () => {
        expect(applianceOtherSafetyFactory).toBeDefined();
    });

    describe("createApplianceOtherSafetyBusinessModel method", () => {

        it("map fields correctly and returns ApplianceOtherSafety business model", () => {
            let otherSafetyViewModel = new OtherSafetyViewModel();
            otherSafetyViewModel.isApplianceSafe = true;
            otherSafetyViewModel.didYouVisuallyCheck = true;
            otherSafetyViewModel.workedOnAppliance = true;
            otherSafetyViewModel.toCurrentStandards = YesNoNa.Yes;
            otherSafetyViewModel.dataState = DataState.valid;

            let businessModel = applianceOtherSafetyFactory.createApplianceOtherSafetyBusinessModel(otherSafetyViewModel);

            expect(businessModel.workedOnAppliance).toEqual(otherSafetyViewModel.workedOnAppliance);
            expect(businessModel.isApplianceSafe).toEqual(otherSafetyViewModel.isApplianceSafe);
            expect(businessModel.visuallyCheckRelight).toEqual(otherSafetyViewModel.didYouVisuallyCheck);
            expect(businessModel.toCurrentStandards).toEqual(otherSafetyViewModel.toCurrentStandards);
            expect(businessModel.dataState).toEqual(otherSafetyViewModel.dataState);            
        });

    });

    describe("createApplianceOtherSafetyViewModel method", () => {

        it("map fields correctly and returns OtherSafetyViewModel", () => {
            let otherSafetyBusinessModel = new ApplianceOtherSafety();
            otherSafetyBusinessModel.isApplianceSafe = true;
            otherSafetyBusinessModel.visuallyCheckRelight = true;
            otherSafetyBusinessModel.workedOnAppliance = true;
            otherSafetyBusinessModel.toCurrentStandards = YesNoNa.Yes;
            otherSafetyBusinessModel.dataState = DataState.dontCare;

            let otherSafetyViewModel = applianceOtherSafetyFactory.createApplianceOtherSafetyViewModel(otherSafetyBusinessModel);

            expect(otherSafetyViewModel.workedOnAppliance).toEqual(otherSafetyBusinessModel.workedOnAppliance);
            expect(otherSafetyViewModel.isApplianceSafe).toEqual(otherSafetyBusinessModel.isApplianceSafe);
            expect(otherSafetyViewModel.didYouVisuallyCheck).toEqual(otherSafetyBusinessModel.visuallyCheckRelight);
            expect(otherSafetyViewModel.toCurrentStandards).toEqual(otherSafetyBusinessModel.toCurrentStandards);
            expect(otherSafetyViewModel.dataState).toEqual(otherSafetyBusinessModel.dataState);            
        });

    });

    describe("createApplianceOtherUnsafeBusinessModel method", () => {

        it("map fields correctly and returns ApplianceOtherUnsafeDetail business model", () => {
            let otherUnsafetyViewModel = new OtherUnsafetyViewModel();
            otherUnsafetyViewModel.report = "test report";
            otherUnsafetyViewModel.cappedTurnedOff = "C";
            otherUnsafetyViewModel.conditionAsLeft = "X";
            otherUnsafetyViewModel.labelAttachedRemoved = "A";
            otherUnsafetyViewModel.letterLeft = true;
            otherUnsafetyViewModel.ownedByCustomer = true;
            otherUnsafetyViewModel.signatureObtained = true;

            let businessModel = applianceOtherSafetyFactory.createApplianceOtherUnsafeBusinessModel(otherUnsafetyViewModel);

            expect(businessModel.report).toEqual(otherUnsafetyViewModel.report);
            expect(businessModel.cappedTurnedOff).toEqual(otherUnsafetyViewModel.cappedTurnedOff);
            expect(businessModel.conditionAsLeft).toEqual(otherUnsafetyViewModel.conditionAsLeft);
            expect(businessModel.labelAttachedRemoved).toEqual(otherUnsafetyViewModel.labelAttachedRemoved);
            expect(businessModel.letterLeft).toEqual(otherUnsafetyViewModel.letterLeft); 
            expect(businessModel.ownedByCustomer).toEqual(otherUnsafetyViewModel.ownedByCustomer); 
            expect(businessModel.signatureObtained).toEqual(otherUnsafetyViewModel.signatureObtained);            
        });

    });

    describe("createApplianceOtherUnsafeViewModel method", () => {

        it("map fields correctly and returns OtherUnsafetyViewModel", () => {
            let applianceOtherUnsafeDetail = new ApplianceOtherUnsafeDetail();
            applianceOtherUnsafeDetail.report = "test report";
            applianceOtherUnsafeDetail.cappedTurnedOff = "C";
            applianceOtherUnsafeDetail.conditionAsLeft = "X";
            applianceOtherUnsafeDetail.labelAttachedRemoved = "A";
            applianceOtherUnsafeDetail.letterLeft = true;
            applianceOtherUnsafeDetail.ownedByCustomer = true;
            applianceOtherUnsafeDetail.signatureObtained = true;

            let otherUnsafetyViewModel = applianceOtherSafetyFactory.createApplianceOtherUnsafeViewModel(applianceOtherUnsafeDetail);

            expect(otherUnsafetyViewModel.report).toEqual(applianceOtherUnsafeDetail.report);
            expect(otherUnsafetyViewModel.cappedTurnedOff).toEqual(applianceOtherUnsafeDetail.cappedTurnedOff);
            expect(otherUnsafetyViewModel.conditionAsLeft).toEqual(applianceOtherUnsafeDetail.conditionAsLeft);
            expect(otherUnsafetyViewModel.labelAttachedRemoved).toEqual(applianceOtherUnsafeDetail.labelAttachedRemoved);
            expect(otherUnsafetyViewModel.letterLeft).toEqual(applianceOtherUnsafeDetail.letterLeft); 
            expect(otherUnsafetyViewModel.ownedByCustomer).toEqual(applianceOtherUnsafeDetail.ownedByCustomer); 
            expect(otherUnsafetyViewModel.signatureObtained).toEqual(applianceOtherUnsafeDetail.signatureObtained);            
        });

    });
});