/// <reference path="../../../../../../typings/app.d.ts" />

import {EventAggregator} from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";

import { IJobService } from "../../../../../../app/hema/business/services/interfaces/IJobService";
import { IFavouriteService } from "../../../../../../app/hema/business/services/interfaces/IFavouriteService";
import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";

import { Favourites } from "../../../../../../app/hema/presentation/modules/favourites/favourites";

describe("the favourites module", () => {
    let sandbox: Sinon.SinonSandbox;
    let favourites: Favourites;

    let jobServiceStub: IJobService;
    let favouriteServiceStub: IFavouriteService;
    let labelServiceStub: ILabelService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        jobServiceStub = <IJobService>{};
        favouriteServiceStub = <IFavouriteService>{};
        labelServiceStub = <ILabelService>{};
        eventAggregatorStub = <EventAggregator>{};
        dialogServiceStub = <DialogService>{};

        favourites = new Favourites(labelServiceStub, eventAggregatorStub, dialogServiceStub, favouriteServiceStub, jobServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(favourites).toBeDefined();
    });

    describe("the showAddToPartsBasketButton flag", () => {

        beforeEach(() => {
            favouriteServiceStub.getFavouritesList = sandbox.stub().resolves([]);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can will be false if not active job", (done) => {
            jobServiceStub.getActiveJobId = sandbox.stub().resolves("");

            favourites.activateAsync()
                .then(() => {
                   expect(favourites.showAddToPartsBasketButton).toBe(false);
                   done();
                });
        });

        it("can will be true if active job", (done) => {
            jobServiceStub.getActiveJobId = sandbox.stub().resolves("123456789");

            favourites.activateAsync()
                .then(() => {
                    expect(favourites.showAddToPartsBasketButton).toBe(true);
                    done();
                });
        });
    });
});
