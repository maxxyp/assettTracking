import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { IEngineerService } from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import { IJobService } from "../../../../../../app/hema/business/services/interfaces/IJobService";
import { WorkRetrievalTracker } from "../../../../../../app/hema/business/services/workRetrievalTracker";
import { JobPartsCollections } from "../../../../../../app/hema/presentation/modules/jobsList/jobPartsCollections";
import { JobPartsCollection } from "../../../../../../app/hema/business/models/jobPartsCollection";
import { EngineerService } from "../../../../../../app/hema/business/services/engineerService";
import { JobServiceConstants } from "../../../../../../app/hema/business/services/constants/jobServiceConstants";
import { Router } from "aurelia-router";

describe("the JobPartsCollections module", () => {
    let jobPartsCollection: JobPartsCollections;
    let sandbox: Sinon.SinonSandbox;

    let labelServiceStub: ILabelService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let workRetrievalTracker: WorkRetrievalTracker;
    let engineerServiceStub: IEngineerService;
    let jobServiceStub: IJobService;
    let routerStub: Router;
    let setStatusSpy: Sinon.SinonSpy;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        labelServiceStub = <ILabelService>{};
        labelServiceStub.getGroup = sandbox.stub().returns(Promise.resolve({value: 0}));
        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.subscribe = sandbox.stub();
        eventAggregatorStub.publish = sandbox.stub();
        workRetrievalTracker = <WorkRetrievalTracker>{};
        engineerServiceStub = <IEngineerService>{};
        jobServiceStub = <IJobService>{};

        dialogServiceStub = <DialogService>{};

        routerStub = <Router> {};
        routerStub.navigate = sandbox.stub().returns(true);
        routerStub.navigateToRoute = sandbox.stub();

        jobPartsCollection = new JobPartsCollections(labelServiceStub, eventAggregatorStub, dialogServiceStub,
            workRetrievalTracker, engineerServiceStub, jobServiceStub, routerStub);

        jobServiceStub.getActiveJobId = sandbox.stub().resolves(undefined);
        jobServiceStub.completePartsCollections = sandbox.stub().resolves(Promise.resolve());
        engineerServiceStub.getStatus = sandbox.stub().resolves(EngineerService.OBTAINING_MATS_STATUS);
        setStatusSpy = engineerServiceStub.setStatus = sandbox.stub().resolves(Promise.resolve());           
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(jobPartsCollection).toBeDefined();
    });

    describe("activate", () => {

        beforeEach(() => {
            let jpc1 = new JobPartsCollection();
            jpc1.id = "1";
            jpc1.parts = [{stockReferenceId: "srid1", description: "desc1", quantity: 1}];
            jpc1.done = false;

            jobServiceStub.getPartsCollections = sandbox.stub().resolves([jpc1, jpc1, jpc1]);
        });

        it("initialises partsCollections and isDone", async done => {
            await jobPartsCollection.activateAsync({isDone: false});
            expect(jobPartsCollection.isDone).toBe(false);
            expect(jobPartsCollection.partsCollections.length).toBe(3);
            done();
        });

        it("sets enabled to true if no activeJobId", async done => {
            await jobPartsCollection.activateAsync({isDone: false});
            expect(jobPartsCollection.enabled).toBe(true);
            done();
        });

        it("sets enabled to false if no activeJobId", async done => {
            jobServiceStub.getActiveJobId = sandbox.stub().resolves(1);

            await jobPartsCollection.activateAsync({isDone: false});
            expect(jobPartsCollection.enabled).toBe(false);
            done();
        });        
    });

    // todo
    describe("summaryDescription", () => {

        it("sets summary when many parts and jobs", async done => {

            let jpc1 = new JobPartsCollection();
            jpc1.id = "1";
            jpc1.parts = [
                {stockReferenceId: "1", description: "desc1", quantity: 1},
                {stockReferenceId: "2", description: "desc2", quantity: 2}
            ];
            jpc1.done = false;

            let jpc2 = new JobPartsCollection();
            jpc2.id = "2";
            jpc2.parts = [
                {stockReferenceId: "3", description: "desc3", quantity: 10},
                {stockReferenceId: "4", description: "desc4", quantity: 20}
            ];
            jpc2.done = false;

            jobServiceStub.getPartsCollections = sandbox.stub().resolves([jpc1, jpc2]);

            await jobPartsCollection.activateAsync({isDone: false});

            expect(jobPartsCollection.summaryDescription).toEqual("33 parts to collect: 3 parts - Job 1; 30 parts - Job 2");

            done();
        });

        it("sets summary one job and one part", async done => {

            let jpc1 = new JobPartsCollection();
            jpc1.id = "1";
            jpc1.parts = [
                {stockReferenceId: "1", description: "desc1", quantity: 1}
            ];
            jpc1.done = false;

            jobServiceStub.getPartsCollections = sandbox.stub().resolves([jpc1]);

            await jobPartsCollection.activateAsync({isDone: false});

            expect(jobPartsCollection.summaryDescription).toEqual("1 part to collect: 1 part - Job 1");

            done();
        });

        it("set summary to empty string one job and no part, should say 0 parts", async done => {
            let jpc1 = new JobPartsCollection();
            jpc1.id = "1";
            jpc1.parts = [];
            jpc1.done = false;

            jobServiceStub.getPartsCollections = sandbox.stub().resolves([jpc1]);

            await jobPartsCollection.activateAsync({isDone: false});

            expect(jobPartsCollection.summaryDescription).toEqual("0 parts to collect: 0 parts - Job 1");

            done();
        });

        it("set summary to empty string one job and no part", async done => {

            jobServiceStub.getPartsCollections = sandbox.stub().resolves([]);

            await jobPartsCollection.activateAsync({isDone: false});

            expect(jobPartsCollection.summaryDescription).toEqual("");

            done();
        });

        it("uses past tense phrase when done", async done => {

            let jpc1 = new JobPartsCollection();
            jpc1.id = "1";
            jpc1.parts = [
                {stockReferenceId: "1", description: "desc1", quantity: 1}
            ];
            jpc1.done = true;

            jobServiceStub.getPartsCollections = sandbox.stub().resolves([jpc1]);

            await jobPartsCollection.activateAsync({isDone: true});

            expect(jobPartsCollection.summaryDescription).toEqual("1 part collected: 1 part - Job 1");

            done();
        });

        it("uses past tense phrase when done", async done => {

            let jpc1 = new JobPartsCollection();
            jpc1.id = "1";
            jpc1.parts = [
                {stockReferenceId: "1", description: "desc1", quantity: 1}
            ];
            jpc1.done = false;

            jobServiceStub.getPartsCollections = sandbox.stub().resolves([jpc1]);

            await jobPartsCollection.activateAsync({isDone: false});

            expect(jobPartsCollection.summaryDescription).toEqual("1 part to collect: 1 part - Job 1");

            done();
        });
    });

    describe("setCollectingParts method", () => {
        it("should set isPartCollectionInProgress to true", async done => {
            engineerServiceStub.isPartCollectionInProgress = false;
            await jobPartsCollection.setCollectingParts(null);
            expect(engineerServiceStub.isPartCollectionInProgress).toEqual(true);
            expect(setStatusSpy.called).toBeTruthy();
            done();
        });
    });

    describe("setPartsCollected method", () => {
        it("should set isPartCollectionInProgress to false", async done => {
            engineerServiceStub.isPartCollectionInProgress = true;
            await jobPartsCollection.setPartsCollected(null);
            expect(engineerServiceStub.isPartCollectionInProgress).toEqual(false);
            expect((jobServiceStub.completePartsCollections as Sinon.SinonSpy).called).toBeTruthy();
            expect(setStatusSpy.called).toBeTruthy();
            done();
        });
    });

    describe("update method", () => {
        it("should set property enabled to true when job is inactive", async done => {
            jobPartsCollection.enabled = true;

            let jpc1 = new JobPartsCollection();
            jpc1.id = "1";
            jpc1.parts = [];
            jpc1.done = false;
            jobServiceStub.getPartsCollections = sandbox.stub().resolves([jpc1]);

            await jobPartsCollection.activateAsync({isDone: false});
            eventAggregatorStub.publish(JobServiceConstants.JOB_STATE_CHANGED);
            expect(jobPartsCollection.enabled).toBe(true);
            done();    
        });

        it("should set property enabled to false when job is active", async done => {
            jobPartsCollection.enabled = true;
            
            let jpc1 = new JobPartsCollection();
            jpc1.id = "1";
            jpc1.parts = [];
            jpc1.done = false;
            jobServiceStub.getPartsCollections = sandbox.stub().resolves([jpc1]);

            jobServiceStub.getActiveJobId = sandbox.stub().resolves("1234567890");

            engineerServiceStub.getStatus = sandbox.stub().resolves(undefined);

            await jobPartsCollection.activateAsync({isDone: false});
            eventAggregatorStub.publish(JobServiceConstants.JOB_STATE_CHANGED);
            expect(jobPartsCollection.enabled).toBe(false);          
            done();    
        });
    });
});