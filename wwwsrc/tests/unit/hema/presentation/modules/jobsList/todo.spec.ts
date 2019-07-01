/// <reference path="../../../../../../typings/app.d.ts" />
import {IJobService} from "../../../../../../app/hema/business/services/interfaces/IJobService";
import {ILabelService} from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import {EventAggregator} from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";
import { Todo } from "../../../../../../app/hema/presentation/modules/jobsList/todo";
import { Job } from "../../../../../../app/hema/business/models/job";
import { JobState } from "../../../../../../app/hema/business/models/jobState";
import { JobServiceConstants } from "../../../../../../app/hema/business/services/constants/jobServiceConstants";
import { IFeatureToggleService } from "../../../../../../app/hema/business/services/interfaces/IFeatureToggleService";

describe("the todo module", () => {
    let todoView: Todo;
    let sandbox: Sinon.SinonSandbox;

    let labelServiceStub: ILabelService;
    let jobServiceStub: IJobService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let featureToggleStub: IFeatureToggleService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        jobServiceStub = <IJobService>{};
        jobServiceStub.getJobsToDo = sandbox.stub().resolves([]); 
        jobServiceStub.getWorkListJobApiFailures = sandbox.stub().resolves([]);         
        labelServiceStub = <ILabelService>{};
        eventAggregatorStub = new EventAggregator();
        dialogServiceStub = <DialogService>{};
        featureToggleStub = <IFeatureToggleService>{
            isAssetTrackingEnabled: () => true
        };
        todoView = new Todo(labelServiceStub, eventAggregatorStub, dialogServiceStub, jobServiceStub, featureToggleStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(todoView).toBeDefined();
    });

    describe("the activateAsync function", () => {
        it("can be called", async (done) => {
            let activateSpy: Sinon.SinonSpy = sandbox.spy(todoView, "activateAsync");
            await todoView.activateAsync();
            expect(activateSpy.calledOnce).toBeTruthy();
            done();
        });

        it("should remove job from worklist", async (done) => {  
            jobServiceStub.getJobsToDo = sandbox.stub().resolves([
                <Job> {id: "111111", state: JobState.idle},
                <Job> {id: "222222", state: JobState.done},
            ]);         
            let updateJobsSpy: Sinon.SinonSpy = sandbox.spy(todoView, "updateJobs");
            await todoView.activateAsync();
            eventAggregatorStub.publish(JobServiceConstants.JOB_COMPLETION_REFRESH);
            while (updateJobsSpy.called) {
                await Promise.delay(50);
                expect(todoView.jobs.length).toBe(1);
                done();
            }            
        });
    });                       
});
