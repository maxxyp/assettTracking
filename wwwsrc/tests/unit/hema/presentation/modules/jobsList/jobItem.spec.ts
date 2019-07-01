/// <reference path="../../../../../../typings/app.d.ts" />

import {JobItem} from "../../../../../../app/hema/presentation/modules/jobsList/jobItem";
import {IJobSummaryFactory} from "../../../../../../app/hema/presentation/factories/interfaces/IJobSummaryFactory";

import {Job as JobBusinessModel} from "../../../../../../app/hema/business/models/job";
import {JobSummaryViewModel} from "../../../../../../app/hema/presentation/models/jobSummaryViewModel";
import {ILabelService} from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import {EventAggregator} from "aurelia-event-aggregator";
import {JobState} from "../../../../../../app/hema/business/models/jobState";
import {DialogService} from "aurelia-dialog";

describe("the JobItem module", () => {
    let jobItem: JobItem;
    let sandbox: Sinon.SinonSandbox;

    let labelServiceStub: ILabelService;
    let jobSummaryFactoryStub: IJobSummaryFactory;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        jobSummaryFactoryStub = <IJobSummaryFactory>{};
        labelServiceStub = <ILabelService>{};
        labelServiceStub.getGroup = sinon.stub().returns(Promise.resolve({ value: 0 }));
        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.subscribe = sandbox.stub();
        eventAggregatorStub.publish = sinon.stub();

        dialogServiceStub = <DialogService>{};

        jobItem = new JobItem(labelServiceStub, jobSummaryFactoryStub, eventAggregatorStub, dialogServiceStub);
        jobItem.labels = {};
        jobItem.labels["errorTitle"] = "error";
        jobItem.labels["errorDescription"] = "error";
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(jobItem).toBeDefined();
    });

    describe("the activateAsync function", () => {
        let jobSummaryViewModel: JobSummaryViewModel;
        let jobBusinessModel: JobBusinessModel;

        beforeEach(() => {
            jobBusinessModel = new JobBusinessModel();
            jobSummaryViewModel = new JobSummaryViewModel();

            jobSummaryFactoryStub.createJobSummaryViewModel = sandbox.stub().returns(jobSummaryViewModel);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can be called", (done) => {
            let activateSpy: Sinon.SinonSpy = sandbox.spy(jobItem, "activateAsync");

            jobItem.activateAsync(jobBusinessModel).then(() => {
                expect(activateSpy.calledOnce).toBeTruthy();
                done();
            });
        });

        it("can show content", (done) => {
            jobSummaryViewModel = new JobSummaryViewModel();
            jobSummaryViewModel.jobNumber = "1234567";


            jobSummaryFactoryStub.createJobSummaryViewModel = sandbox.stub().returns(jobSummaryViewModel);
            jobBusinessModel.state = JobState.done;

            jobItem.activateAsync(jobBusinessModel).then(() => {
                expect(jobItem.isDone).toBeTruthy();
                done();
            });
        });
    });
});
