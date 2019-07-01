/// <reference path="../../../../../typings/app.d.ts" />

import {PropertySafetyService} from "../../../../../app/hema/business/services/propertySafetyService";
import {IJobService} from "../../../../../app/hema/business/services/interfaces/IJobService";
import {IBusinessRuleService} from "../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import {Job} from "../../../../../app/hema/business/models/job";
import {PropertySafety} from "../../../../../app/hema/business/models/propertySafety";
import {PropertyGasSafetyDetail} from "../../../../../app/hema/business/models/propertyGasSafetyDetail";
import {PropertyElectricalSafetyDetail} from "../../../../../app/hema/business/models/propertyElectricalSafetyDetail";
import {PropertyUnsafeDetail} from "../../../../../app/hema/business/models/propertyUnsafeDetail";
import {BusinessException} from "../../../../../app/hema/business/models/businessException";
import { QueryableBusinessRuleGroup } from "../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import { IDataStateManager } from "../../../../../app/hema/common/IDataStateManager";

describe("the PropertySafetyService module", () => {
    let propertySafetyService: PropertySafetyService;
    let sandbox: Sinon.SinonSandbox;

    let jobServiceStub: IJobService;
    let loadJobSpy: Sinon.SinonSpy;
    let saveJobSpy: Sinon.SinonSpy;

    let businessRuleServiceStub: IBusinessRuleService;

    let job: Job;
    let dataStateManagerStub: IDataStateManager;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        job = <Job>{};
        job.propertySafety = <PropertySafety>{};

        jobServiceStub = <IJobService>{};
        loadJobSpy = jobServiceStub.getJob = sandbox.stub().returns(Promise.resolve(job));
        saveJobSpy = jobServiceStub.setJob = sandbox.stub().returns(Promise.resolve());

        let queryableBusinessRuleGroup = new QueryableBusinessRuleGroup();
        queryableBusinessRuleGroup.code = "code";
        queryableBusinessRuleGroup.rules = [];

        businessRuleServiceStub = <IBusinessRuleService>{};
        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(queryableBusinessRuleGroup);

        dataStateManagerStub = <IDataStateManager>{
            updateApplianceDataState: sandbox.stub().resolves(null),
            updateAppliancesDataState: sandbox.stub().resolves(null),
            updatePropertySafetyDataState: sandbox.stub()
        };

        propertySafetyService = new PropertySafetyService(jobServiceStub, businessRuleServiceStub, dataStateManagerStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(propertySafetyService).toBeDefined();
    });

    it("can call getGasSafetyDetails and return model", done => {
        propertySafetyService.getPropertySafetyDetails("0").then(model => {
            expect(loadJobSpy.calledWith("0")).toBe(true);
            expect(model).toBe(job.propertySafety);
            done();
        });
    });

    describe("saveGasSafetyDetails", () => {

        it("can call saveGasSafetyDetails", done => {
            let propGasSafetyDetail = <PropertyGasSafetyDetail>{};
            propGasSafetyDetail.eliReadingReason = "X";
            let propGasUnsafeDetail = <PropertyUnsafeDetail>{};
            propertySafetyService.saveGasSafetyDetails("0", propGasSafetyDetail, propGasUnsafeDetail).then(() => {
                let savedModel: Job = saveJobSpy.args[0][0];
                expect(savedModel.propertySafety.propertyGasSafetyDetail.eliReadingReason).toBe("X");
                done();
            });
        });

        it("can call saveGasSafetyDetails and create existing model if null", done => {
            let propGasSafetyDetail = <PropertyGasSafetyDetail>{};
            propGasSafetyDetail.eliReadingReason = "Y";
            let propGasUnsafeDetail = <PropertyUnsafeDetail>{};
            propertySafetyService.saveGasSafetyDetails("0", propGasSafetyDetail, propGasUnsafeDetail).then(() => {
                let savedModel: Job = saveJobSpy.args[0][0];
                expect(savedModel.propertySafety.propertyGasSafetyDetail.eliReadingReason).toBe("Y");
                done();
            });
        });

        it("can call saveGasSafetyDetails and throw if load job returns a null model", done => {
            jobServiceStub.getJob = sandbox.stub().returns(Promise.resolve(null));
            let propGasSafetyDetail = <PropertyGasSafetyDetail>{};
            propGasSafetyDetail.eliReadingReason = "Y";
            let propGasUnsafeDetail = <PropertyUnsafeDetail>{};
            propertySafetyService.saveGasSafetyDetails("0", propGasSafetyDetail, propGasUnsafeDetail)
            .catch((err) => {
                expect(err instanceof BusinessException).toBe(true);
                done();
            });
        });

        it("can call saveGasSafetyDetails and throw if save job throws", done => {
            jobServiceStub.setJob = sandbox.stub().returns(Promise.reject(null));
            let propGasSafetyDetail = <PropertyGasSafetyDetail>{};
            propGasSafetyDetail.eliReadingReason = "Y";
            let propGasUnsafeDetail = <PropertyUnsafeDetail>{};
            propertySafetyService.saveGasSafetyDetails("0", propGasSafetyDetail, propGasUnsafeDetail)
            .catch((err) => {
                expect(err instanceof BusinessException).toBe(true);
                done();
            });
        });
    });

    describe("saveElectricalSafetyDetails", () => {

        it("can call saveElectricalSafetyDetails", done => {
            let propElecSafetyDetail = <PropertyElectricalSafetyDetail>{};
            propElecSafetyDetail.eliReadingReason = "X";
            let propElecUnsafeDetail = <PropertyUnsafeDetail>{};
            propertySafetyService.saveElectricalSafetyDetails("0", propElecSafetyDetail, propElecUnsafeDetail).then(() => {
                let savedModel: Job = saveJobSpy.args[0][0];
                expect(savedModel.propertySafety.propertyElectricalSafetyDetail.eliReadingReason).toBe("X");
                done();
            });
        });

        it("can call saveElectricalSafetyDetails and create existing model if null", done => {
            let propElecSafetyDetail = <PropertyElectricalSafetyDetail>{};
            propElecSafetyDetail.eliReadingReason = "Y";
            let propElecUnsafeDetail = <PropertyUnsafeDetail>{};
            propertySafetyService.saveElectricalSafetyDetails("0", propElecSafetyDetail, propElecUnsafeDetail).then(() => {
                let savedModel: Job = saveJobSpy.args[0][0];
                expect(savedModel.propertySafety.propertyElectricalSafetyDetail.eliReadingReason).toBe("Y");
                done();
            });
        });

        it("can call saveElectricalSafetyDetails and throw if load job returns a null model", done => {
            jobServiceStub.getJob = sandbox.stub().returns(Promise.resolve(null));
            let propElecSafetyDetail = <PropertyElectricalSafetyDetail>{};
            let propElecUnsafeDetail = <PropertyUnsafeDetail>{};
            propertySafetyService.saveElectricalSafetyDetails("0", propElecSafetyDetail, propElecUnsafeDetail)
            .catch((err) => {
                expect(err instanceof BusinessException).toBe(true);
                done();
            });
        });

        it("can call saveElectricalSafetyDetails and throw if save job throws", done => {
            jobServiceStub.setJob = sandbox.stub().returns(Promise.reject(null));
            let propElecSafetyDetail = <PropertyElectricalSafetyDetail>{};
            let propElecUnsafeDetail = <PropertyUnsafeDetail>{};
            propertySafetyService.saveElectricalSafetyDetails("0", propElecSafetyDetail, propElecUnsafeDetail)
            .catch((err) => {
                expect(err instanceof BusinessException).toBe(true);
                done();
            });
        });

        it("can call saveElectricalSafetyDetails and update appliances dataState", done =>  {
            let propElecSafetyDetail = <PropertyElectricalSafetyDetail>{};
            propElecSafetyDetail.eliReadingReason = "X";
            let propElecUnsafeDetail = <PropertyUnsafeDetail>{};
            propertySafetyService.saveElectricalSafetyDetails("0", propElecSafetyDetail, propElecUnsafeDetail).then(() => {
                expect((dataStateManagerStub.updateAppliancesDataState as Sinon.SinonStub).called).toBe(true);
                done();
            });
        });
    });

    describe("unsafe gas situations for the property", () => {

        it("shows an unsafe situation for a pressure drop blow 8", done => {

            let pressureDrop: number = 7.999,
                gasMeterInstallationSatisfactorySelected: string,
                pressureDropThreshold: number = 8,
                installationSatisfactoryNoType: string,
                installationSatisfactoryNoMeterType: string;

            propertySafetyService.populateGasUnsafeReasons(
                pressureDrop,
                gasMeterInstallationSatisfactorySelected,
                pressureDropThreshold,
                installationSatisfactoryNoType,
                installationSatisfactoryNoMeterType
            ).then(reasons => {
                expect(reasons.length).toBe(1);
                expect(reasons[0].lookupId).toBe("pressureDropLess8");
                done();
            });

        });

        it("does not show an unsafe situation for a pressure drop of 8", done => {

            let pressureDrop: number = 8,
                gasMeterInstallationSatisfactorySelected: string,
                pressureDropThreshold: number = 8,
                installationSatisfactoryNoType: string,
                installationSatisfactoryNoMeterType: string;

            propertySafetyService.populateGasUnsafeReasons(
                pressureDrop,
                gasMeterInstallationSatisfactorySelected,
                pressureDropThreshold,
                installationSatisfactoryNoType,
                installationSatisfactoryNoMeterType
            ).then(reasons => {
                expect(reasons.length).toBe(0);
                done();
            });

        });

        it("shows an unsafe situation for a pressure drop above 8", done => {

            let pressureDrop: number = 8.001,
                gasMeterInstallationSatisfactorySelected: string,
                pressureDropThreshold: number = 8,
                installationSatisfactoryNoType: string,
                installationSatisfactoryNoMeterType: string;

            propertySafetyService.populateGasUnsafeReasons(
                pressureDrop,
                gasMeterInstallationSatisfactorySelected,
                pressureDropThreshold,
                installationSatisfactoryNoType,
                installationSatisfactoryNoMeterType
            ).then(reasons => {
                expect(reasons.length).toBe(1);
                expect(reasons[0].lookupId).toBe("pressureDropGreater8");
                done();
            });

        });

        it("shows an unsafe situation for an unsatisfactory meter installation", done => {

            let pressureDrop: number = 8,
                gasMeterInstallationSatisfactorySelected: string = "No",
                pressureDropThreshold: number = 8,
                installationSatisfactoryNoType: string = "No",
                installationSatisfactoryNoMeterType: string = "No Meter";

            propertySafetyService.populateGasUnsafeReasons(
                pressureDrop,
                gasMeterInstallationSatisfactorySelected,
                pressureDropThreshold,
                installationSatisfactoryNoType,
                installationSatisfactoryNoMeterType
            ).then(reasons => {
                expect(reasons.length).toBe(1);
                expect(reasons[0].lookupId).toBe("gasMeterInstallation");
                done();
            });

        });

        it("shows an unsafe situation for a satisfactory meter installation of N/A", done => {

            let pressureDrop: number = 8,
                gasMeterInstallationSatisfactorySelected: string = "No Meter",
                pressureDropThreshold: number = 8,
                installationSatisfactoryNoType: string = "No",
                installationSatisfactoryNoMeterType: string = "No Meter";

            propertySafetyService.populateGasUnsafeReasons(
                pressureDrop,
                gasMeterInstallationSatisfactorySelected,
                pressureDropThreshold,
                installationSatisfactoryNoType,
                installationSatisfactoryNoMeterType
            ).then(reasons => {
                expect(reasons.length).toBe(1);
                expect(reasons[0].lookupId).toBe("gasMeterInstallation");
                done();
            });

        });

    });

    describe("unsafe electricity situations for the property", () => {

        it("shows an unsafe situation for an unsatisfactory consumer unit", done => {

            let safetyDetail: PropertyElectricalSafetyDetail = <PropertyElectricalSafetyDetail> {
                    consumerUnitSatisfactory: false
                },
                unableToCheckSystemType: string = "Unable to check",
                ttSystemType: string = "TT",
                rcdPresentThreshold: number,
                safeInTopsThreshold: number;

            propertySafetyService.populateElectricalUnsafeReasons(
                safetyDetail,
                unableToCheckSystemType,
                ttSystemType,
                rcdPresentThreshold,
                safeInTopsThreshold
            ).then(reasons => {
                expect(reasons.length).toBe(1);
                expect(reasons[0].lookupId).toBe("consumerUnit");
                done();
            });

        });

        it("shows an unsafe situation if unable to check system type", done => {

            let safetyDetail: PropertyElectricalSafetyDetail = <PropertyElectricalSafetyDetail> {
                    systemType: "Unable to check"
                },
                unableToCheckSystemType: string = "Unable to check",
                ttSystemType: string = "TT",
                rcdPresentThreshold: number,
                safeInTopsThreshold: number;

            propertySafetyService.populateElectricalUnsafeReasons(
                safetyDetail,
                unableToCheckSystemType,
                ttSystemType,
                rcdPresentThreshold,
                safeInTopsThreshold
            ).then(reasons => {
                expect(reasons.length).toBe(1);
                expect(reasons[0].lookupId).toBe("systemType");
                done();
            });

        });

        it("shows an unsafe situation if no ELI reading taken", done => {

            let safetyDetail: PropertyElectricalSafetyDetail = <PropertyElectricalSafetyDetail> {
                    noEliReadings: true
                },
                unableToCheckSystemType: string = "Unable to check",
                ttSystemType: string = "TT",
                rcdPresentThreshold: number,
                safeInTopsThreshold: number;

            propertySafetyService.populateElectricalUnsafeReasons(
                safetyDetail,
                unableToCheckSystemType,
                ttSystemType,
                rcdPresentThreshold,
                safeInTopsThreshold
            ).then(reasons => {
                expect(reasons.length).toBe(1);
                expect(reasons[0].lookupId).toBe("noElectricalEliReading");
                done();
            });

        });

        it("shows an unsafe situation if TT system has no RCD", done => {

            let safetyDetail: PropertyElectricalSafetyDetail = <PropertyElectricalSafetyDetail> {
                    systemType: "TT",
                    rcdPresent: "N"
                },
                unableToCheckSystemType: string = "Unable to check",
                ttSystemType: string = "TT",
                rcdPresentThreshold: number,
                safeInTopsThreshold: number;

            propertySafetyService.populateElectricalUnsafeReasons(
                safetyDetail,
                unableToCheckSystemType,
                ttSystemType,
                rcdPresentThreshold,
                safeInTopsThreshold
            ).then(reasons => {
                expect(reasons.length).toBe(1);
                expect(reasons[0].lookupId).toBe("rcdNotPresent");
                done();
            });

        });

        it("shows an unsafe situation if TT system has RCD and ELI is over 200", done => {

            let safetyDetail: PropertyElectricalSafetyDetail = <PropertyElectricalSafetyDetail> {
                    systemType: "TT",
                    rcdPresent: "Y",
                    eliReading: 201
                },
                unableToCheckSystemType: string = "Unable to check",
                ttSystemType: string = "TT",
                rcdPresentThreshold: number = 200,
                safeInTopsThreshold: number;

            propertySafetyService.populateElectricalUnsafeReasons(
                safetyDetail,
                unableToCheckSystemType,
                ttSystemType,
                rcdPresentThreshold,
                safeInTopsThreshold
            ).then(reasons => {
                expect(reasons.length).toBe(1);
                expect(reasons[0].lookupId).toBe("rcdGreater200");
                done();
            });

        });

        it("does not show an unsafe situation if TT system has RCD and ELI is under 200", done => {

            let safetyDetail: PropertyElectricalSafetyDetail = <PropertyElectricalSafetyDetail> {
                    systemType: "TT",
                    rcdPresent: "Y",
                    eliReading: 199
                },
                unableToCheckSystemType: string = "Unable to check",
                ttSystemType: string = "TT",
                rcdPresentThreshold: number = 200,
                safeInTopsThreshold: number;

            propertySafetyService.populateElectricalUnsafeReasons(
                safetyDetail,
                unableToCheckSystemType,
                ttSystemType,
                rcdPresentThreshold,
                safeInTopsThreshold
            ).then(reasons => {
                expect(reasons.length).toBe(0);
                done();
            });

        });

        it("shows an unsafe situation if ELI is above the TOPS threshold and flagged as unsafe", done => {

            let safetyDetail: PropertyElectricalSafetyDetail = <PropertyElectricalSafetyDetail> {
                    systemType: "Something else",
                    eliReading: 201,
                    eliSafeAccordingToTops: false
                },
                unableToCheckSystemType: string = "Unable to check",
                ttSystemType: string = "TT",
                rcdPresentThreshold: number,
                safeInTopsThreshold: number = 200;

            propertySafetyService.populateElectricalUnsafeReasons(
                safetyDetail,
                unableToCheckSystemType,
                ttSystemType,
                rcdPresentThreshold,
                safeInTopsThreshold
            ).then(reasons => {
                expect(reasons.length).toBe(1);
                expect(reasons[0].lookupId).toBe("topsReadingSafe");
                done();
            });

        });

        it("does not show an unsafe situation if ELI is less than the TOPS threshold", done => {

            let safetyDetail: PropertyElectricalSafetyDetail = <PropertyElectricalSafetyDetail> {
                    systemType: "Something else",
                    eliReading: 199,
                    eliSafeAccordingToTops: false
                },
                unableToCheckSystemType: string = "Unable to check",
                ttSystemType: string = "TT",
                rcdPresentThreshold: number,
                safeInTopsThreshold: number = 200;

            propertySafetyService.populateElectricalUnsafeReasons(
                safetyDetail,
                unableToCheckSystemType,
                ttSystemType,
                rcdPresentThreshold,
                safeInTopsThreshold
            ).then(reasons => {
                expect(reasons.length).toBe(0);
                done();
            });

        });

    });

});
