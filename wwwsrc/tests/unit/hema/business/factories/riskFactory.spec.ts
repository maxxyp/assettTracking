/// <reference path="../../../../../typings/app.d.ts" />

import { RiskFactory } from "../../../../../app/hema/business/factories/riskFactory";
import { IRisk } from "../../../../../app/hema/api/models/fft/jobs/IRisk";
import { Guid } from "../../../../../app/common/core/guid";
import { Job } from "../../../../../app/hema/business/models/job";
import { Risk } from "../../../../../app/hema/business/models/risk";
import { IAppliance } from "../../../../../app/hema/api/models/fft/jobs/history/IAppliance";

describe("the RiskFactory module", () => {
    let riskFactory: RiskFactory;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        riskFactory = new RiskFactory();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(riskFactory).toBeDefined();
    });

    describe("createRiskBusinessModel method", () => {
        it("can create from empty model", () => {
            let risk = <IRisk>{};

            let businessModel = riskFactory.createRiskBusinessModel(risk);

            expect(Guid.isGuid(businessModel.id)).toBeTruthy();
            expect(businessModel.reason).toBeUndefined();
            expect(businessModel.report).toBeUndefined();
            expect(businessModel.date).toBeUndefined();
            expect(businessModel.isHazard).toEqual(false);
        });

        it("can create from model with values", () => {
            let risk = <IRisk>{
                reason: "aaa",
                report: "bbb",
                date: "2015-01-01T00:00:00Z"
            };

            let businessModel = riskFactory.createRiskBusinessModel(risk);

            expect(Guid.isGuid(businessModel.id)).toBeTruthy();
            expect(businessModel.reason).toEqual("aaa");
            expect(businessModel.report).toEqual("bbb");
            expect(businessModel.date).toEqual(new Date(2015, 0, 1));
            expect(businessModel.isHazard).toEqual(false);
        });

        it("can create from model with date (no time) value", () => {
            let risk = <IRisk>{
                reason: "aaa",
                report: "bbb",
                date: "2015-08-31"
            };

            let businessModel = riskFactory.createRiskBusinessModel(risk);
            expect(Guid.isGuid(businessModel.id)).toBeTruthy();
            expect(businessModel.date).toEqual(new Date(2015, 7, 31));
        });

        it("can create with incorrectly formatted date", () => {
            let risk = <IRisk>{
                date: "2016-06-13Z"
            };

            let businessModel = riskFactory.createRiskBusinessModel(risk);

            expect(businessModel.date).toEqual(new Date(2016, 5, 13));
        });
    });

    describe("createRiskApiModel method", () => {
        it("can create from empty model", () => {
            let risk = <Risk>{};

            let apiModel = riskFactory.createRiskApiModel(risk)

            expect(apiModel.reason).toBeUndefined();
            expect(apiModel.report).toBeUndefined();
        });
        it("can create from model with values", () => {
            let risk = <Risk>{
                id: Guid.newGuid(),
                reason: "aaa",
                report: "bbb",
                date: new Date(2015, 0, 1),
                isHazard: false
            };

            let apiModel = riskFactory.createRiskApiModel(risk);

            expect(apiModel.reason).toEqual("aaa");
            expect(apiModel.report).toEqual("bbb");
        });
    });

    describe("createRiskBusinessModelFromAppliance method", () => {
        it("can create from empty model", () => {
            let appliance = <IAppliance>{};

            let businessModel = riskFactory.createRiskBusinessModelFromAppliance(appliance, "HAZ");

            expect(Guid.isGuid(businessModel.id)).toBeTruthy();
            expect(businessModel.reason).toEqual("HAZ");
            expect(businessModel.report).toBeUndefined();
            expect(businessModel.date).toBeUndefined();
            expect(businessModel.isHazard).toEqual(true);
        });
        it("can create from model with values", () => {
            let appliance = <IAppliance>{};
            appliance.id = "111111";
            appliance.locationDescription = "somewhere";
            appliance.installationYear = 2000;

            let businessModel = riskFactory.createRiskBusinessModelFromAppliance(appliance, "HAZ");

            expect(businessModel.id).toEqual("111111");
            expect(businessModel.reason).toEqual("HAZ");
            expect(businessModel.report).toEqual("somewhere");
            expect(businessModel.date).toEqual(new Date(2000, 0, 1));
            expect(businessModel.isHazard).toEqual(true);
        });

        it("can create with incorrectly formatted date", () => {
            let appliance = <IAppliance>{};
            appliance.installationYear = <any>"2000";

            let businessModel = riskFactory.createRiskBusinessModelFromAppliance(appliance, "HAZ");

            expect(businessModel.date).toEqual(undefined);
        });
    });

    describe("createApplianceApiModel method", () => {

        it("can create a model for a created appliance", () => {
            let risk = <Risk>{
                id: Guid.newGuid(),
                reason: "HAZ",
                report: "bbb",
                date: new Date(2015, 0, 1),
                isHazard: true,
                isUpdated: true,
                isCreated: true
            };

            let apiModel = riskFactory.createApplianceApiModel(risk, <Job>{});

            expect(apiModel.id).toBeUndefined();
            expect(apiModel.applianceType).toEqual("HAZ");
            expect(apiModel.locationDescription).toEqual("bbb");
            expect(apiModel.installationYear).toBeUndefined();
            expect(apiModel.updateMarker).toBe("C");
        });

        it("can create a model for an updated appliance", () => {
            let risk = <Risk>{
                id: "2",
                reason: "HAZ",
                report: "bbb",
                date: new Date(2015, 0, 1),
                isHazard: true,
                isUpdated: true
            };

            let apiModel = riskFactory.createApplianceApiModel(risk, <Job>{});

            expect(apiModel.id).toBe("2");
            expect(apiModel.applianceType).toEqual("HAZ");
            expect(apiModel.locationDescription).toEqual("bbb");
            expect(apiModel.installationYear).toBeUndefined();
            expect(apiModel.updateMarker).toBe("A");
        });

        describe("and can only build changed fields", () => {

            it("can create a model when only report has changed", () => {
                let risk = <Risk>{
                    id: "2",
                    reason: "HAZ",
                    report: "bbb",
                    date: new Date(2015, 0, 1),
                    isHazard: true,
                    isUpdated: true
                };

                let originalRisk = <Risk>(Object.assign({}, risk));
                originalRisk.report = "ccc";

                let apiModel = riskFactory.createApplianceApiModel(risk, <Job>{risks: [originalRisk]});

                expect(apiModel.id).toBe("2");
                expect(apiModel.applianceType).toEqual("HAZ");
                expect(apiModel.locationDescription).toEqual("bbb");
                expect(apiModel.installationYear).toBeUndefined();
                expect(apiModel.updateMarker).toBe("A");
            });

        });

        it("can create a model for a deleted appliance", () => {
            let risk = <Risk>{
                id: "2",
                reason: "HAZ",
                report: "bbb",
                date: new Date(2015, 0, 1),
                isHazard: true,
                isUpdated: true,
                isDeleted: true
            };

            let apiModel = riskFactory.createApplianceApiModel(risk, <Job>{});

            expect(apiModel.id).toBe("2");
            expect(apiModel.applianceType).toEqual("HAZ");
            expect(apiModel.locationDescription).toBeUndefined();
            expect(apiModel.installationYear).toBeUndefined();
            expect(apiModel.updateMarker).toBe("D");
        });
    });

});
