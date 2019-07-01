/// <reference path="../../../../../../typings/app.d.ts" />

import { IJobService } from "../../../../../../app/hema/business/services/interfaces/IJobService";
import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { PartsCollectionDetails } from '../../../../../../app/hema/presentation/modules/partsCollection/partsCollectionDetails';
import { IPartsCollectionFactory } from "../../../../../../app/hema/presentation/factories/interfaces/IPartsCollectionFactory";

describe("the PartsCollectionDetails module", () => {
    let partsCollectionDetails: PartsCollectionDetails;
    let sandbox: Sinon.SinonSandbox;
    let jobServiceStub: IJobService;
    let labelServiceStub: ILabelService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let partsCollectionFactortStub: IPartsCollectionFactory;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        jobServiceStub = <IJobService>{};
        partsCollectionFactortStub = <IPartsCollectionFactory>{};
        partsCollectionFactortStub.createPartsCollectionViewModel = sandbox.stub().returns([]);
        jobServiceStub.getPartsCollections = sandbox.stub().resolves([]);

        labelServiceStub = <ILabelService>{};
        labelServiceStub.getGroup = sinon.stub().returns(Promise.resolve({}));

        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.subscribe = sandbox.stub();
        eventAggregatorStub.publish = sandbox.stub();

        dialogServiceStub = <DialogService>{};

        partsCollectionDetails = new PartsCollectionDetails(labelServiceStub, eventAggregatorStub, dialogServiceStub, jobServiceStub, partsCollectionFactortStub);
        partsCollectionDetails.labels = {};
        partsCollectionDetails.labels["errorTitle"] = "error";
        partsCollectionDetails.labels["errorDescription"] = "error";
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(partsCollectionDetails).toBeDefined();
    });

    describe("activateAsync", () => {
        it("load content", (done) => {
            let showContentSpy: Sinon.SinonSpy = sandbox.spy(partsCollectionDetails, "showContent");
            partsCollectionDetails.activateAsync({isDone: "false"}).then(() => {
                expect(partsCollectionDetails.viewModel.length === 0).toBeTruthy();
                expect(showContentSpy.called).toBeTruthy();
                done();
            });
        });

        it("call showError`", (done) => {
            jobServiceStub.getPartsCollections = sandbox.stub().rejects(new Error());
            let showErrorSpy: Sinon.SinonSpy = sandbox.spy(partsCollectionDetails, "showError");
            partsCollectionDetails.activateAsync({isDone: "false"}).then(() => {
                expect(showErrorSpy.called).toBeTruthy();
                done();
            });
        });        
    });
});
