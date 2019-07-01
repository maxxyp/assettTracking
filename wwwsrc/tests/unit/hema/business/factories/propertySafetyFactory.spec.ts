/// <reference path="../../../../../typings/app.d.ts" />

import {PropertySafetyFactory} from "../../../../../app/hema/business/factories/propertySafetyFactory";
import {PropertySafety} from "../../../../../app/hema/business/models/propertySafety";
import {PropertySafetyType} from "../../../../../app/hema/business/models/propertySafetyType";
import {ISafetyDetail as SafetyDetailApiModel} from "../../../../../app/hema/api/models/fft/jobs/ISafetyDetail";
import {IUnsafeDetail as UnsafeDetailApiModel} from "../../../../../app/hema/api/models/fft/jobs/IUnsafeDetail";
import {DateHelper} from "../../../../../app/hema/core/dateHelper";
import {CatalogConstants} from "../../../../../app/hema/business/services/constants/catalogConstants";

describe("the PropertySafetyFactory module", () => {
    let propertySafetyFactory: PropertySafetyFactory;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        propertySafetyFactory = new PropertySafetyFactory();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(propertySafetyFactory).toBeDefined();
    });

    describe("createAddressBusinessModel method", () => {
        it("can create from undefined model", () => {
            let businessModel = propertySafetyFactory.createPropertySafetyBusinessModel(undefined, undefined, undefined);

            expect(businessModel).toBeDefined();
            expect(businessModel.previousPropertySafetyDetail).toBeUndefined();
            expect(businessModel.propertyGasSafetyDetail).toBeDefined();
            expect(businessModel.propertyElectricalSafetyDetail).toBeDefined();
            expect(businessModel.propertyUnsafeDetail).toBeDefined();
        });

        it("can create from empty gas models", () => {
            let propertySafetyType = PropertySafetyType.gas;
            let safetyDetail = <SafetyDetailApiModel>{};
            let unsafeDetail = <UnsafeDetailApiModel>{};

            let businessModel = propertySafetyFactory.createPropertySafetyBusinessModel(propertySafetyType, safetyDetail, unsafeDetail);

            expect(businessModel).toBeDefined();
            expect(businessModel.propertyGasSafetyDetail).toBeDefined();
            expect(businessModel.propertyUnsafeDetail).toBeDefined();
            expect(businessModel.previousPropertySafetyDetail).toBeUndefined();
            expect(businessModel.propertyElectricalSafetyDetail).toBeDefined();
        });

        it("can create from empty electrical models", () => {
            let propertySafetyType = PropertySafetyType.electrical;
            let safetyDetail = <SafetyDetailApiModel>{};
            let unsafeDetail = <UnsafeDetailApiModel>{};

            let businessModel = propertySafetyFactory.createPropertySafetyBusinessModel(propertySafetyType, safetyDetail, unsafeDetail);

            expect(businessModel).toBeDefined();
            expect(businessModel.propertyGasSafetyDetail).toBeDefined();
            expect(businessModel.propertyUnsafeDetail).toBeDefined();
            expect(businessModel.previousPropertySafetyDetail).toBeUndefined();
            expect(businessModel.propertyElectricalSafetyDetail).toBeDefined();
        });

        // it("can create from empty other models", () => {
        //     let jobType = JobType.other;
        //     let safetyDetail = <SafetyDetailApiModel>{};
        //     let unsafeDetail = <UnsafeDetailApiModel>{};

        //     let businessModel = propertySafetyFactory.createPropertySafetyBusinessModel(jobType, safetyDetail, unsafeDetail);

        //     expect(businessModel).toBeDefined();
        //     expect(businessModel.propertyGasSafetyDetail).toBeUndefined();
        //     expect(businessModel.propertyUnsafeDetail).toBeUndefined();
        //     expect(businessModel.previousPropertySafetyDetail).toBeUndefined();
        //     expect(businessModel.propertyElectricalSafetyDetail).toBeUndefined();
        // });

        // it("can create from empty unknown models", () => {
        //     let jobType = JobType.unknown;
        //     let safetyDetail = <SafetyDetailApiModel>{};
        //     let unsafeDetail = <UnsafeDetailApiModel>{};

        //     let businessModel = propertySafetyFactory.createPropertySafetyBusinessModel(jobType, safetyDetail, unsafeDetail);

        //     expect(businessModel).toBeDefined();
        //     expect(businessModel.propertyGasSafetyDetail).toBeUndefined();
        //     expect(businessModel.propertyUnsafeDetail).toBeUndefined();
        //     expect(businessModel.previousPropertySafetyDetail).toBeUndefined();
        //     expect(businessModel.propertyElectricalSafetyDetail).toBeUndefined();
        // });

        it("can create from models with gas previous unsafe properties", () => {
            let propertySafetyType = PropertySafetyType.gas;
            let safetyDetail = <SafetyDetailApiModel>{};
            safetyDetail.lastGasVisitDate = DateHelper.toJsonDateTimeString(new Date(2016, 0, 1, 0, 0, 0));
            safetyDetail.safetyNoticeNotLeftReason = "reason";
            let unsafeDetail = <UnsafeDetailApiModel>{};
            unsafeDetail.signatureObtained = true;

            let businessModel = propertySafetyFactory.createPropertySafetyBusinessModel(propertySafetyType, safetyDetail, unsafeDetail);

            expect(businessModel).toBeDefined();
            expect(businessModel.propertyGasSafetyDetail).toBeDefined();
            expect(businessModel.propertyUnsafeDetail).toBeDefined();
            expect(businessModel.previousPropertySafetyDetail).toBeDefined();
            expect(businessModel.propertyElectricalSafetyDetail).toBeDefined();
            expect(businessModel.previousPropertySafetyDetail.lastVisitDate).toEqual(DateHelper.toJsonDateTimeString(new Date(2016, 0, 1, 0, 0, 0)));
            expect(businessModel.previousPropertySafetyDetail.safetyNoticeNotLeftReason).toEqual("reason");
        });

        it("can create from models with electrical previous unsafe properties", () => {
            let propertySafetyType = PropertySafetyType.electrical;
            let safetyDetail = <SafetyDetailApiModel>{};
            safetyDetail.lastElectricVisitDate = DateHelper.toJsonDateTimeString(new Date(2016, 0, 1, 0, 0, 0));
            safetyDetail.safetyNoticeNotLeftReason = "reason";
            let unsafeDetail = <UnsafeDetailApiModel>{};
            unsafeDetail.signatureObtained = true;

            let businessModel = propertySafetyFactory.createPropertySafetyBusinessModel(propertySafetyType, safetyDetail, unsafeDetail);

            expect(businessModel).toBeDefined();
            expect(businessModel.propertyGasSafetyDetail).toBeDefined();
            expect(businessModel.propertyUnsafeDetail).toBeDefined();
            expect(businessModel.propertyElectricalSafetyDetail).toBeDefined();
            expect(businessModel.previousPropertySafetyDetail).toBeDefined();
            expect(businessModel.previousPropertySafetyDetail.lastVisitDate).toEqual(DateHelper.toJsonDateTimeString(new Date(2016, 0, 1, 0, 0, 0)));
            expect(businessModel.previousPropertySafetyDetail.safetyNoticeNotLeftReason).toBeUndefined();
        });
    });

    describe("createPropertySafetyApiModel method", () => {
        it("can create from undefined model", () => {
            let apiModel = propertySafetyFactory.createPropertySafetyApiModel(undefined, undefined, undefined, undefined);
            expect(apiModel).toBeDefined();
            expect(Object.getOwnPropertyNames(apiModel)).toEqual(["riskIdentifiedAtProperty"]);
            expect(apiModel.riskIdentifiedAtProperty).toBe(false);
        });


        describe("gas jobs", () => {
            it ("can send eliReading if it has been specified", () => {

                let propertySafety = <PropertySafety>{
                    propertyGasSafetyDetail: {
                        eliReading: "X"
                    }
                };
                let apiModel = propertySafetyFactory.createPropertySafetyApiModel(PropertySafetyType.gas, propertySafety, undefined, undefined);
                expect(apiModel.gasELIReading).toBe("X");
            });

            it ("can not send eliReading if the user has specified no eli readings taken", () => {

                let propertySafety = <PropertySafety>{
                    propertyGasSafetyDetail: {
                        eliReading: CatalogConstants.SAFETY_READING_CAT_NO_READING_TAKEN
                    }
                };
                let apiModel = propertySafetyFactory.createPropertySafetyApiModel(PropertySafetyType.gas, propertySafety, undefined, undefined);
                expect(apiModel.gasELIReading).toBeUndefined();
            });


        });

    });
});
