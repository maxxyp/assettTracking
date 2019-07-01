import { WorklistNotification } from '../../../../../app/hema/presentation/elements/worklistNotification';
import { ILabelService } from "../../../../../app/hema/business/services/interfaces/ILabelService";
import { IEngineerService } from "../../../../../app/hema/business/services/interfaces/IEngineerService";
import { IJobService } from "../../../../../app/hema/business/services/interfaces/IJobService";
import { WorkRetrievalTracker } from "../../../../../app/hema/business/services/workRetrievalTracker";
import { EventAggregator } from "aurelia-event-aggregator";
import { Disposable } from '../../../../../typings/lib/aurelia/aurelia-framework/index';
import { EngineerServiceConstants } from '../../../../../app/hema/business/services/constants/engineerServiceConstants';
import { AttributeConstants } from '../../../../../app/common/ui/attributes/constants/attributeConstants';
import { WorkRetrievalServiceConstants } from "../../../../../app/hema/business/services/constants/workRetrievalServiceConstants";
import { WorkRetrievalRequestingStatus } from "../../../../../app/hema/business/services/workRetrievalRequestingStatus";
import { Job } from '../../../../../app/hema/business/models/job';
import { JobState } from '../../../../../app/hema/business/models/jobState';
import { IConfigurationService } from "../../../../../app/common/core/services/IConfigurationService";

const ARBITRARY_TIME = 1515083731406;

describe("the worklistNotification module", () => {
    let sandbox: Sinon.SinonSandbox;
    let labelServiceStub: ILabelService;
    let engineerServiceStub: IEngineerService;
    let jobServiceStub: IJobService;
    let workListNotification: WorklistNotification;
    let tracker: WorkRetrievalTracker;
    let eventAggregatorStub: EventAggregator;
    let configurationServiceStub: IConfigurationService;

    let disposeableStub: Disposable;
    let labels: {foo: "bar"};

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        disposeableStub = <Disposable>{
            dispose: sandbox.stub()
        }

        labelServiceStub = <ILabelService>{};
        labelServiceStub.getGroup = sandbox.stub().resolves(labels);

        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.publish = sandbox.stub();
        eventAggregatorStub.subscribe = sandbox.stub().returns(disposeableStub);

        jobServiceStub = <IJobService>{};

        jobServiceStub.getJobsToDo = sandbox.stub().resolves([]);

        engineerServiceStub = <IEngineerService>{};
        engineerServiceStub.isWorking = sandbox.stub().resolves(true);


        configurationServiceStub = <IConfigurationService>{};
        configurationServiceStub.getConfiguration = sandbox.stub().returns({});
        tracker = new WorkRetrievalTracker(configurationServiceStub);

        workListNotification = new WorklistNotification(labelServiceStub, eventAggregatorStub, jobServiceStub, engineerServiceStub, tracker);
        workListNotification.jobRefreshFn = sandbox.stub().resolves({});
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(workListNotification).toBeDefined();
    });

    describe("attached", () => {

        it("can attach and populate labels, subscribe to stuff, and update information", async done => {
            await workListNotification.attached();

            expect(workListNotification.labels).toEqual(labels);

            expect(workListNotification.status).toBeDefined();
            expect((workListNotification.jobRefreshFn as Sinon.SinonStub).called).toBe(true);

            // everything hooked-up as expected
            let subscriptionArgs = (eventAggregatorStub.subscribe as Sinon.SinonStub).args;
            expect(subscriptionArgs.some(arg => arg[0] === EngineerServiceConstants.ENGINEER_STATUS_CHANGED)).toBe(true);
            expect(subscriptionArgs.some(arg => arg[0] === AttributeConstants.FULL_SCREEN_TOGGLE)).toBe(true);
            expect(subscriptionArgs.some(arg => arg[0] === WorkRetrievalServiceConstants.REFRESH_START_STOP)).toBe(true);

            let trackerSubscriber = subscriptionArgs.find(arg => arg[0] === WorkRetrievalServiceConstants.REFRESH_START_STOP)[1];
            expect(trackerSubscriber).toBeDefined();

            // make sure the subscriber functions work
            workListNotification.status = undefined;
            await trackerSubscriber();
            expect(workListNotification.status).toBeDefined();

            workListNotification.status = undefined;
            await subscriptionArgs.find(arg => arg[0] === EngineerServiceConstants.ENGINEER_STATUS_CHANGED)[1]();
            expect(workListNotification.status).toBeDefined();
            done();
        });
    });

    describe("detached", () => {

        it("can dispose all three subscriptions", async () => {
            await workListNotification.attached();
            workListNotification.detached();
            expect((disposeableStub.dispose as Sinon.SinonStub).callCount).toBe(3);
        });

    });

    describe("triggerWorklistRetrieval", () => {
        it("can trigger a request for work", async done => {
            await workListNotification.attached();
            expect((eventAggregatorStub.publish as Sinon.SinonStub).calledWith(WorkRetrievalServiceConstants.REQUEST_WORK_AND_REFRESH_WORK_LIST)).toBe(false);

            workListNotification.triggerWorklistRetrieval();

            expect((eventAggregatorStub.publish as Sinon.SinonStub).calledWith(WorkRetrievalServiceConstants.REQUEST_WORK_AND_REFRESH_WORK_LIST)).toBe(true);
            done();
        });
    });

    describe("refreshAfterNewWorklist", () => {
        it("will update data", async done => {
            await workListNotification.attached();

            workListNotification.status = undefined;
            (workListNotification.jobRefreshFn as Sinon.SinonStub).reset();

            await workListNotification.refreshAfterNewWorklist();

            expect(workListNotification.status).toBeDefined();
            expect((workListNotification.jobRefreshFn as Sinon.SinonStub).called).toBe(true);
            done();
        });
    });

    describe("updating the summary", () => {
        it("can set engineer not working", async done => {
            await workListNotification.attached();
            workListNotification.status = undefined;

            engineerServiceStub.isWorking = sandbox.stub().resolves(false); // this should win
            tracker.requestingStatus = WorkRetrievalRequestingStatus.requestingFullRequest;
            tracker.lastUpdatedTime = new Date(ARBITRARY_TIME);
            tracker.lastFailedTime = new Date(ARBITRARY_TIME + 1);

            let trackerSubscriber = (eventAggregatorStub.subscribe as Sinon.SinonStub).args.find(arg => arg[0] === WorkRetrievalServiceConstants.REFRESH_START_STOP)[1];
            await trackerSubscriber();

            expect(workListNotification.status).toBe("NOT_WORKING");
            done();
        });

        it("can set requesting", async done => {
            await workListNotification.attached();
            workListNotification.status = undefined;

            tracker.requestingStatus = WorkRetrievalRequestingStatus.requestingFullRequest;  // this should win
            tracker.lastUpdatedTime = new Date(ARBITRARY_TIME);
            tracker.lastFailedTime = new Date(ARBITRARY_TIME + 1);

            let trackerSubscriber = (eventAggregatorStub.subscribe as Sinon.SinonStub).args.find(arg => arg[0] === WorkRetrievalServiceConstants.REFRESH_START_STOP)[1];
            await trackerSubscriber();

            expect(workListNotification.status).toBe("REQUESTING");
            done();
        });

        it("can set failed", async done => {
            await workListNotification.attached();
            workListNotification.status = undefined;

            tracker.lastUpdatedTime = new Date(ARBITRARY_TIME);
            tracker.lastFailedTime = new Date(ARBITRARY_TIME + 1);

            let trackerSubscriber = (eventAggregatorStub.subscribe as Sinon.SinonStub).args.find(arg => arg[0] === WorkRetrievalServiceConstants.REFRESH_START_STOP)[1];
            await trackerSubscriber();

            expect(workListNotification.status).toBe("FAILED_WORKLIST");
            done();
        });

        it("will just refresh the first time the worklist changes rather than showing the new worklist message", async done => {

            tracker.lastUpdatedTime = new Date(ARBITRARY_TIME);
            await workListNotification.attached();

            expect(workListNotification.status).toBe("NORMAL");
            expect((workListNotification.jobRefreshFn as Sinon.SinonStub).called).toBe(true);
            done();
        });

        it("will just refresh the first time the worklist changes rather than showing the new worklist message if no worklist has ever been retrieved", async done => {

            tracker.lastUpdatedTime = undefined;
            await workListNotification.attached();

            expect(workListNotification.status).toBe("NORMAL");
            expect((workListNotification.jobRefreshFn as Sinon.SinonStub).called).toBe(true);
            done();
        });

        it("will show new worklist alert and not refresh the list", async done => {

            tracker.lastUpdatedTime = new Date(ARBITRARY_TIME);
            await workListNotification.attached();

            tracker.lastUpdatedTime = new Date(ARBITRARY_TIME + 1);
            (workListNotification.jobRefreshFn as Sinon.SinonStub).reset();

            let trackerSubscriber = (eventAggregatorStub.subscribe as Sinon.SinonStub).args.find(arg => arg[0] === WorkRetrievalServiceConstants.REFRESH_START_STOP)[1];
            await trackerSubscriber();

            expect(workListNotification.status).toBe("NEW_WORKLIST");
            expect((workListNotification.jobRefreshFn as Sinon.SinonStub).called).toBe(false);
            done();
        });

        it("can show correct figures for jobs and tasks", async done => {
            tracker.lastUpdatedTime = new Date(ARBITRARY_TIME);

            jobServiceStub.getJobsToDo = sandbox.stub().resolves([
                <Job>{ tasks: [{}, {}]},
                <Job>{ tasks: [{}], state: JobState.done}
            ]);

            await workListNotification.attached();

            expect(workListNotification.status).toBe("NORMAL");
            expect(workListNotification.jobsTodoCount).toBe(1);
            expect(workListNotification.activitiesCount).toBe(2);

            tracker.lastUpdatedTime = new Date(ARBITRARY_TIME + 1);
            let trackerSubscriber = (eventAggregatorStub.subscribe as Sinon.SinonStub).args.find(arg => arg[0] === WorkRetrievalServiceConstants.REFRESH_START_STOP)[1];
            await trackerSubscriber();
            expect(workListNotification.status).toBe("NEW_WORKLIST");

            jobServiceStub.getJobsToDo = sandbox.stub().resolves([
                <Job>{ tasks: [{}, {}], state: JobState.done},
                <Job>{ tasks: [{}], state: JobState.done}
            ]);

            await workListNotification.refreshAfterNewWorklist();

            expect(workListNotification.status).toBe("NORMAL");
            expect(workListNotification.jobsTodoCount).toBe(0);
            expect(workListNotification.activitiesCount).toBe(0);

            tracker.lastUpdatedTime = new Date(ARBITRARY_TIME + 2);
            await trackerSubscriber();
            expect(workListNotification.status).toBe("NEW_WORKLIST");

            jobServiceStub.getJobsToDo = sandbox.stub().resolves([
                <Job>{ tasks: []}, // a broken job from WMIS
                <Job>{ tasks: [{}], state: JobState.done}
            ]);

            await workListNotification.refreshAfterNewWorklist();

            expect(workListNotification.status).toBe("NORMAL");
            expect(workListNotification.jobsTodoCount).toBe(1);
            expect(workListNotification.activitiesCount).toBe(0);

            done();
        });
    });
});
