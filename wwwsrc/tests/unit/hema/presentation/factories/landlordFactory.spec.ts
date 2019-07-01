/// <reference path="../../../../../typings/app.d.ts" />

import {LandlordFactory} from "../../../../../app/hema/presentation/factories/landlordFactory";
import {LandlordSafetyCertificate as LandlordSafetyCertificateBusinessModel} from "../../../../../app/hema/business/models/landlord/landlordSafetyCertificate";
import {LandlordSafetyCertificateAppliance as LandlordSafetyCertificateApplianceBusinessModel} from "../../../../../app/hema/business/models/landlord/landlordSafetyCertificateAppliance";
import {LandlordSafetyCertificateDefect as LandlordSafetyCertificateDefectBusinessModel} from "../../../../../app/hema/business/models/landlord/landlordSafetyCertificateDefect";
import {LandlordSafetyCertificateResult} from "../../../../../app/hema/business/models/landlord/LandlordSafetyCertificateResult";
import {YesNoNa} from "../../../../../app/hema/business/models/yesNoNa";

describe("the LandlordFactory class", () => {
    let sandbox: Sinon.SinonSandbox;
    let landlordFactory: LandlordFactory;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        landlordFactory = new LandlordFactory();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(landlordFactory).toBeDefined();
    });

    describe("the getDictionaryValue function", () => {
        afterEach(() => {
            sandbox.restore();
        });
    });

    describe("the createLandlordSafetyCertificateViewModel function", () => {
        let labels: {[key: string]: any};

        let landlordCertificateBusinessModel: LandlordSafetyCertificateBusinessModel;
        let landlordSafetyCertificateApplianceBusinessModel: LandlordSafetyCertificateApplianceBusinessModel;
        let landlordSafetyCertificateDefectBusinessModel: LandlordSafetyCertificateDefectBusinessModel;
        let landlordSafetyCertificateResult: LandlordSafetyCertificateResult;

        beforeEach(() => {
            labels = {
                        incomplete: "InComplete",
                        yes: "Yes",
                        no: "No",
                        notApplicable: "N/A",
                        unableToTest: "unableToTest",
                        pass: "pass",
                        fail: "fail",
                        dashes: "dashes",
                        operatingUnitsM: "operatingUnitsM",
                        operatingUnitsR: "operatingUnitsR",
                        operatingUnitsK: "operatingUnitsK"
                    };

            //landlordFactory.getDictionaryValue = sandbox.stub().returns(null);

            landlordSafetyCertificateApplianceBusinessModel = <LandlordSafetyCertificateApplianceBusinessModel> {
                applianceSafe: false,
                flueFlowTest: YesNoNa.Na,
                flueType: undefined,
                id: "11111",
                location: undefined,
                make: undefined,
                model: "",
                operatingValue: null,
                operatingValueUnits: null,
                requestedToTest: false,
                safetyDeviceCorrectOperation: YesNoNa.Na,
                spillageTest: YesNoNa.Na,
                type: "FRE",
                unableToTest: true,
                ventilationSatisfactory: YesNoNa.Na,
                visualConditionOfFlueAndTerminationSatisfactory: YesNoNa.Na
            };

            landlordSafetyCertificateDefectBusinessModel = <LandlordSafetyCertificateDefectBusinessModel> {
                actionTaken: undefined,
                actionTakenText: undefined,
                conditionOfAppliance: undefined,
                details: undefined,
                isNotApplicable: false,
                labelledAndWarningNoticeGiven: undefined
            };

            landlordSafetyCertificateResult = <LandlordSafetyCertificateResult> {
                gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass: undefined,
                propertySafetyDefect: <LandlordSafetyCertificateDefectBusinessModel> {
                    actionTaken: undefined,
                    actionTakenText: undefined,
                    conditionOfAppliance: undefined,
                    details: undefined,
                    isNotApplicable: false,
                    labelledAndWarningNoticeGiven: undefined
                }
            }

            landlordCertificateBusinessModel = new LandlordSafetyCertificateBusinessModel();
            landlordCertificateBusinessModel.applianceCount = 1;
            landlordCertificateBusinessModel.engineerId = "1111";
            landlordCertificateBusinessModel.landlordAddress = [];
            landlordCertificateBusinessModel.landlordName = "test";
            landlordCertificateBusinessModel.propertyAddress = [];
            landlordCertificateBusinessModel.certificateResult = landlordSafetyCertificateResult
            landlordCertificateBusinessModel.appliances = [landlordSafetyCertificateApplianceBusinessModel];
            landlordCertificateBusinessModel.defects = [landlordSafetyCertificateDefectBusinessModel];

        });

        afterEach(() => {
            sandbox.restore();
        });

        it("should be defined", () => {
            let vm = landlordFactory.createLandlordSafetyCertificateViewModel(landlordCertificateBusinessModel, labels);
            expect(vm).toBeDefined();
        });

        it("unableToTest = false, requestedToTest = false, operatingValue, applianceSafe, labelledAndWarningNoticeGiven should be N/A", () => {
            landlordCertificateBusinessModel.appliances[0].requestedToTest = false;
            landlordCertificateBusinessModel.appliances[0].unableToTest = false;
            let vm = landlordFactory.createLandlordSafetyCertificateViewModel(landlordCertificateBusinessModel, labels);
            expect(vm.appliances[0].operatingValue).toBeDefined("N/A");
            expect(vm.appliances[0].safetyDeviceCorrectOperation).toBeDefined("N/A");
            expect(vm.appliances[0].ventilationSatisfactory).toBeDefined("N/A");
            expect(vm.appliances[0].flueFlowTest).toBeDefined("N/A");
            expect(vm.appliances[0].spillageTest).toBeDefined("N/A");
            expect(vm.appliances[0].visualConditionOfFlueAndTerminationSatisfactory).toBeDefined("N/A");
            expect(vm.appliances[0].applianceSafe).toBeDefined("N/A");
            expect(vm.appliances[0].requestedToTest).toBeDefined("No");
            expect(vm.appliances[0].unableToTest).toBeDefined("Yes");
        });

        it("unableToTest = true, requestedToTest = true, operatingValue, applianceSafe, labelledAndWarningNoticeGiven should be N/A", () => {
            landlordCertificateBusinessModel.appliances[0].requestedToTest = true;
            landlordCertificateBusinessModel.appliances[0].unableToTest = true;
            let vm = landlordFactory.createLandlordSafetyCertificateViewModel(landlordCertificateBusinessModel, labels);
            expect(vm.appliances[0].operatingValue).toBeDefined("N/A");
            expect(vm.appliances[0].safetyDeviceCorrectOperation).toBeDefined("N/A");
            expect(vm.appliances[0].ventilationSatisfactory).toBeDefined("N/A");
            expect(vm.appliances[0].flueFlowTest).toBeDefined("N/A");
            expect(vm.appliances[0].spillageTest).toBeDefined("N/A");
            expect(vm.appliances[0].visualConditionOfFlueAndTerminationSatisfactory).toBeDefined("N/A");
            expect(vm.appliances[0].applianceSafe).toBeDefined("N/A");
            expect(vm.appliances[0].requestedToTest).toBeDefined("No");
            expect(vm.appliances[0].unableToTest).toBeDefined("Yes");
        });

        it("unableToTest = false, requestedToTest = true", () => {
            landlordCertificateBusinessModel.appliances[0].requestedToTest = true;
            landlordCertificateBusinessModel.appliances[0].unableToTest = false;
            landlordCertificateBusinessModel.appliances[0].flueFlowTest = YesNoNa.Yes;
            landlordCertificateBusinessModel.appliances[0].safetyDeviceCorrectOperation = YesNoNa.Yes;
            landlordCertificateBusinessModel.appliances[0].ventilationSatisfactory = YesNoNa.Na;
            landlordCertificateBusinessModel.appliances[0].spillageTest = YesNoNa.Yes;
            landlordCertificateBusinessModel.appliances[0].visualConditionOfFlueAndTerminationSatisfactory = YesNoNa.Yes;
            landlordCertificateBusinessModel.appliances[0].applianceSafe = true;

            let vm = landlordFactory.createLandlordSafetyCertificateViewModel(landlordCertificateBusinessModel, labels);
            expect(vm.appliances[0].operatingValue).toBeDefined("InComplete");
            expect(vm.appliances[0].safetyDeviceCorrectOperation).toBeDefined("Yes");
            expect(vm.appliances[0].ventilationSatisfactory).toBeDefined("No");
            expect(vm.appliances[0].flueFlowTest).toBeDefined("Yes");
            expect(vm.appliances[0].spillageTest).toBeDefined("Yes");
            expect(vm.appliances[0].visualConditionOfFlueAndTerminationSatisfactory).toBeDefined("Yes");
            expect(vm.appliances[0].applianceSafe).toBeDefined("Yes");
            expect(vm.appliances[0].requestedToTest).toBeDefined("Yes");
            expect(vm.appliances[0].unableToTest).toBeDefined("No");
        });
    });
});
