/// <reference path="../../../../../typings/app.d.ts" />

import {IRiskService} from "../../../../../app/hema/business/services/interfaces/IRiskService";
import {RiskService} from "../../../../../app/hema/business/services/riskService";
import {IJobService} from "../../../../../app/hema/business/services/interfaces/IJobService";
import {Risk} from "../../../../../app/hema/business/models/risk";
import {BusinessException} from "../../../../../app/hema/business/models/businessException";
import {Job} from "../../../../../app/hema/business/models/job";
import {DataState} from "../../../../../app/hema/business/models/dataState";
import {Guid} from "../../../../../app/common/core/guid";
import {DateHelper} from "../../../../../app/hema/core/dateHelper";

describe("the RiskService class", () => {
    let sandbox: Sinon.SinonSandbox;
    let riskService: IRiskService;
    let jobServiceStub: IJobService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        jobServiceStub = <IJobService>{};
        riskService = new RiskService(jobServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(riskService).toBeDefined();
    });

    it("getRisks, returns risks", (done) => {
        let job: Job = new Job();
        let risk: Risk = new Risk();
        risk.id = Guid.empty;
        risk.reason = "reason";
        risk.report = "report";
        job.risks = [];
        job.risks.push(risk);
        jobServiceStub.getJob = sandbox.stub().returns(Promise.resolve(job));
        riskService.getRisks("123").then((risks: Risk[]) => {
            expect(risks).toBeDefined();
            expect(risks.length === 1).toBeTruthy();
            expect(risks[0].reason).toEqual("reason");
            expect(risks[0].report).toEqual("report");
            done();
        });
    });

    it("getRisks, returns business error", (done) => {
        jobServiceStub.getJob = sandbox.stub().returns(Promise.reject("error"));
        riskService.getRisks("123").catch((err: BusinessException) => {
            expect(err.reference).toEqual("risks");
            done();
        });
    });

    it("updateRisks, updates risks", (done) => {
        let job: Job = new Job();
        let risk: Risk = new Risk();
        risk.id = Guid.empty;
        risk.reason = "reason";
        risk.report = "report";
        job.risks = [];
        job.risks.push(risk);
        jobServiceStub.getJob = sandbox.stub().returns(Promise.resolve(job));
        jobServiceStub.setJob = sandbox.stub().returns(Promise.resolve());
        let newRisk: Risk = new Risk();
        newRisk.id = Guid.empty;
        newRisk.reason = "reason2";
        newRisk.report = "report2";
        riskService.updateRisk(job.id, newRisk).then(() => {
            done();
        });
    });

    it("updateRisks, no job found rejects", (done) => {
        jobServiceStub.getJob = sandbox.stub().returns(Promise.resolve(null));
        let newRisk: Risk = new Risk();
        newRisk.id = Guid.empty;
        newRisk.reason = "reason2";
        newRisk.report = "report2";
        riskService.updateRisk("01", newRisk).catch((err: BusinessException) => {
            expect(err.reference).toEqual("risks");
            done();
        });
    });

    describe("CRUD tracking", () => {

        let saveSpy: Sinon.SinonSpy;
        let job: Job;
        beforeEach(() => {
            job = <Job>{ risks: [] };
            jobServiceStub.getJob = sandbox.stub().returns(Promise.resolve(job));
            saveSpy = jobServiceStub.setJob = sandbox.stub().returns(Promise.resolve());
        });

        it("can update a risk and set the updated flag", done => {
            job.risks.push(<Risk>{id: "1"});

            riskService.updateRisk("2", <Risk>{id: "1"}).then(() => {
                let savedRisk = (<Job>saveSpy.args[0][0]).risks.find(r => r.id === "1");
                expect(savedRisk.isUpdated).toBe(true);
                done();
            });
        });

        it("can create a risk and set the created flag and date", done => {

            riskService.addRisk("2", <Risk>{}).then(() => {
                let savedRisk = (<Job>saveSpy.args[0][0]).risks[0];
                expect(savedRisk.date.getFullYear()).toEqual(DateHelper.getTodaysDate().getFullYear());
                expect(savedRisk.isCreated).toBe(true);
                done();
            });
        });

        it("can delete a risk and set the deleted flag and move the risk to the job.deletedRisks array", done => {
            job.risks.push(<Risk>{id: "1"});

            riskService.deleteRisk("2", "1").then(() => {

                // #16679 has been added to refactor job.deletedRisks out, and replace with a isDeleted flag on risk models (like appliances)
                let existingRisk = (<Job>saveSpy.args[0][0]).risks.find(r => r.id === "1");
                let deletedRisk = (<Job>saveSpy.args[0][0]).deletedRisks.find(r => r.id === "1");

                expect(existingRisk).toBeUndefined();
                expect(deletedRisk.isDeleted).toBe(true);
                expect(deletedRisk.dataState).toBe(DataState.dontCare);
                done();
            });
        });
    });

});
