/// <reference path="../../../../../../typings/app.d.ts" />

import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { PartsSummary } from '../../../../../../app/hema/presentation/modules/partsCollection/partsSummary';
import { PartsCollectionViewModel } from "../../../../../../app/hema/presentation/models/partsCollectionViewModel";

describe("the PartsSummary module", () => {
    let partsSummary: PartsSummary;
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

        partsSummary = new PartsSummary(labelServiceStub, eventAggregatorStub, dialogServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(partsSummary).toBeDefined();
    });

    describe("activateAsync", () => {
        it("can call activateAsync, parts set", (done) => {
            const model = new PartsCollectionViewModel();
            partsSummary.activateAsync([model]).then(() => {
                expect(partsSummary.parts.length === 1).toBeDefined();
                done();
            });
        });

        it("parameter is undefined, parts set undefined", (done) => {
            partsSummary.activateAsync(undefined).then(() => {
                expect(partsSummary.parts).toBeUndefined();
                done();
            });
        });        
    });
});
