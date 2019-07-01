/// <reference path="../../../../../../typings/app.d.ts" />
import {IJobService} from "../../../../../../app/hema/business/services/interfaces/IJobService";
import {ILabelService} from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import {EventAggregator} from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";
import { Done } from "../../../../../../app/hema/presentation/modules/jobsList/done";
import { Job } from "../../../../../../app/hema/business/models/job";
import { JobState } from "../../../../../../app/hema/business/models/jobState";

describe("the Done module", () => {
    let doneView: Done;
    let sandbox: Sinon.SinonSandbox;

    let labelServiceStub: ILabelService;
    let jobServiceStub: IJobService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        jobServiceStub = <IJobService>{};
        labelServiceStub = <ILabelService>{};
        eventAggregatorStub = <EventAggregator>{};
        dialogServiceStub = <DialogService>{};
        doneView = new Done(labelServiceStub, eventAggregatorStub, dialogServiceStub, jobServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(doneView).toBeDefined();
    });

    describe("the activateAsync function", () => {
        it("can be called", (done) => {
            jobServiceStub.getJobsToDo = sandbox.stub().resolves(undefined);            
            let activateSpy: Sinon.SinonSpy = sandbox.spy(doneView, "activateAsync");
            doneView.activateAsync().then(() => {
                expect(activateSpy.calledOnce).toBeTruthy();
                done();
            });
        });

        it("no jobs, loads page", (done) => {
            jobServiceStub.getJobsToDo = sandbox.stub().resolves(undefined);            
            doneView.activateAsync().then(() => {
                expect(doneView.jobs.length === 0).toBeTruthy();
                done();
            });
        });        

        it("has done jobs, loads page", (done) => {
            let job: Job = new Job();
            job.state = JobState.done;
            jobServiceStub.getJobsToDo = sandbox.stub().resolves([job]);            
            doneView.activateAsync().then(() => {
                expect(doneView.jobs.length === 1).toBeTruthy();
                done();
            });
        });                

        it("has no done jobs, loads page", (done) => {
            let job: Job = new Job();
            job.state = JobState.arrived;
            jobServiceStub.getJobsToDo = sandbox.stub().resolves([job]);            
            doneView.activateAsync().then(() => {
                expect(doneView.jobs.length === 0).toBeTruthy();
                done();
            });
        });                        
    });
});
