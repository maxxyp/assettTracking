/// <reference path="../../../../../../typings/app.d.ts" />

import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { CustomerSummary } from '../../../../../../app/hema/presentation/modules/partsCollection/customerSummary';
import { PartsCollectionCustomerViewModel } from "../../../../../../app/hema/presentation/models/partsCollectionCustomerViewModel";

describe("the CustomerSummary module", () => {
    let customerSummary: CustomerSummary;
    let sandbox: Sinon.SinonSandbox;
    let labelServiceStub: ILabelService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        labelServiceStub = <ILabelService>{};
        labelServiceStub.getGroup = sinon.stub().returns(Promise.resolve({}));

        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.subscribe = sandbox.stub();
        eventAggregatorStub.publish = sandbox.stub();

        dialogServiceStub = <DialogService>{};

        customerSummary = new CustomerSummary(labelServiceStub, eventAggregatorStub, dialogServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(customerSummary).toBeDefined();
    });

    describe("activateAsync", () => {
        it("can call activateAsync, jobId and viewModel set", (done) => {
            const model = new PartsCollectionCustomerViewModel();
            customerSummary.activateAsync({ jobId: "job1", customer: model}).then(() => {
                expect(customerSummary.jobId === "job1").toBeTruthy();
                expect(customerSummary.viewModel).toBeDefined();
                done();
            });
        });

        it("parameter is undefined, jobId and viewModel set undefined", (done) => {
            customerSummary.activateAsync(undefined).then(() => {
                expect(customerSummary.jobId).toBeUndefined()
                expect(customerSummary.viewModel).toBeUndefined();
                done();
            });
        });        
    });
});
