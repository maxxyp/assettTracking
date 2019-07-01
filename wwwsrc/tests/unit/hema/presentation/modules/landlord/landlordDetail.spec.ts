/// <reference path="../../../../../../typings/app.d.ts" />

import {ILabelService} from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import {DialogController, DialogService} from "aurelia-dialog";
import {EventAggregator} from "aurelia-event-aggregator";
import {LandlordDetail} from "../../../../../../app/hema/presentation/modules/landlord/landlordDetail";
import SinonSpy = Sinon.SinonSpy;
import {IJobService} from "../../../../../../app/hema/business/services/interfaces/IJobService";
import {Job} from "../../../../../../app/hema/business/models/job";
import {CustomerContact} from "../../../../../../app/hema/business/models/customerContact";

describe("the LandlordDetail module", () => {
    let landlordDetail: LandlordDetail;
    let labelServiceStub: ILabelService;
    let sandbox: Sinon.SinonSandbox;
    let dialogStub: DialogController;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let jobServiceStub: IJobService;

    let showContentSpy: SinonSpy;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        labelServiceStub = <ILabelService>{};
        dialogStub = <DialogController>{};
        eventAggregatorStub = <EventAggregator>{};
        dialogServiceStub = <DialogService>{};
        jobServiceStub = <IJobService>{};

        showContentSpy = sandbox.spy();

        landlordDetail = new LandlordDetail(labelServiceStub, eventAggregatorStub, dialogServiceStub, jobServiceStub, dialogStub);
        landlordDetail.showContent = showContentSpy;
        landlordDetail.labels = {
            "landlordDetail": "",
            "landlordName": "",
            "address": "",
            "homePhone": "",
            "workPhone": ""
        };

    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(landlordDetail).toBeDefined();
    });

    describe("the activateAsync function", () => {
        beforeEach(() => {
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can be called, initialises customer contact", (done) => {
            let job: Job = new Job();
            job.customerContact = new CustomerContact();
            jobServiceStub.getJob = sandbox.stub().resolves(job);

            landlordDetail.activateAsync({jobId: "1"})
                .then(() => {
                    expect(landlordDetail.contact).toBeDefined();
                    done();
                });
        });
    });
});
