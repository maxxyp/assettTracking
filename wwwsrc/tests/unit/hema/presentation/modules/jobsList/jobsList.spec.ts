/// <reference path="../../../../../../typings/app.d.ts" />

import {JobsList} from "../../../../../../app/hema/presentation/modules/jobsList/jobsList";

import {IJobService} from "../../../../../../app/hema/business/services/interfaces/IJobService";

import {Job as JobBusinessModel} from "../../../../../../app/hema/business/models/job";
import {ILabelService} from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import {EventAggregator} from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";
import {IEngineerService} from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import {Engineer} from "../../../../../../app/hema/business/models/engineer";

describe("the JobsList module", () => {
    let jobsList: JobsList;
    let labelServiceStub: ILabelService;
    let sandbox: Sinon.SinonSandbox;

    let jobServiceStub: IJobService;
    let engineerServiceStub: IEngineerService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        jobServiceStub = <IJobService>{};
        labelServiceStub = <ILabelService>{};
        engineerServiceStub = <IEngineerService>{};
        engineerServiceStub.getCurrentEngineer = sinon.stub().resolves(new Engineer());
        engineerServiceStub.isSignedOn = sinon.stub().resolves(true);

        labelServiceStub.getGroup = sinon.stub().resolves({});
        eventAggregatorStub = <EventAggregator>{};
        dialogServiceStub = <DialogService>{};

        eventAggregatorStub.subscribe = sinon.stub();

        jobsList = new JobsList(labelServiceStub, eventAggregatorStub, dialogServiceStub, engineerServiceStub);

        jobsList.labels = { "notWorking": "notWorking" };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(jobsList).toBeDefined();
    });

    describe("the attachedAsync function", () => {
        beforeEach(() => {
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can be called", (done) => {
            let jobs: JobBusinessModel[] = [];
            jobServiceStub.getJobsToDo = sandbox.stub().returns(Promise.resolve(jobs));

            let attachedAsyncSpy: Sinon.SinonSpy = sandbox.spy(jobsList, "attachedAsync");

            jobsList.attachedAsync()
            .then(() => {
                expect(attachedAsyncSpy.calledOnce).toBeTruthy();
                done();
            });
        });

        it("can show content", (done) => {
            let jobs: JobBusinessModel[] = [];
            let job: JobBusinessModel = new JobBusinessModel();
            jobs.push(job);

            jobServiceStub.getJobsToDo = sandbox.stub().returns(Promise.resolve(jobs));

            let showContentSpy: Sinon.SinonSpy = sandbox.spy(jobsList, "showContent");

            jobsList.attachedAsync()
            .then(() => {
                expect(showContentSpy.calledOnce).toBeTruthy();
                done();
            });
        });
    });
});
