/// <reference path="../../../../../../typings/app.d.ts" />

import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { PartsCollectionItem } from '../../../../../../app/hema/presentation/modules/partsCollection/partsCollectionItem';
import { PartCollectionDetailViewModel } from "../../../../../../app/hema/presentation/models/partCollectionDetailViewModel";
import {Router} from "aurelia-router";

describe("the PartsCollectionItem module", () => {
    let partsCollectionItem: PartsCollectionItem;
    let sandbox: Sinon.SinonSandbox;
    let labelServiceStub: ILabelService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let routerStub: Router;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        labelServiceStub = <ILabelService>{};
        labelServiceStub.getGroup = sinon.stub().returns(Promise.resolve({}));

        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.subscribe = sandbox.stub();
        eventAggregatorStub.publish = sandbox.stub();

        dialogServiceStub = <DialogService>{};

        routerStub = <Router>{};
        routerStub.navigate = sandbox.stub().returns(true);

        partsCollectionItem = new PartsCollectionItem(labelServiceStub, eventAggregatorStub, dialogServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(partsCollectionItem).toBeDefined();
    });

    describe("activateAsync", () => {
        it("can call activateAsync, viewModel set", (done) => {
            const model = new PartCollectionDetailViewModel();
            partsCollectionItem.activateAsync({isDone: false, partDetails: model}).then(() => {
                expect(partsCollectionItem.viewModel).toBeDefined();
                done();
            });
        });

        it("parameter is undefined, viewModel set undefined", (done) => {
            partsCollectionItem.activateAsync(undefined).then(() => {
                expect(partsCollectionItem.viewModel).toBeUndefined();
                done();
            });
        });        
    });
});
