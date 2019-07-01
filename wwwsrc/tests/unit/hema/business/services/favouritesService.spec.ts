/// <reference path="../../../../../typings/app.d.ts" />

import { IJobService } from "../../../../../app/hema/business/services/interfaces/IJobService";
import { IFavouriteService } from "../../../../../app/hema/business/services/interfaces/IFavouriteService";
import { FavouriteService } from "../../../../../app/hema/business/services/favouriteService";
import { IStorageService } from "../../../../../app/hema/business/services/interfaces/IStorageService";
import { IConsumableService } from "../../../../../app/hema/business/services/interfaces/IConsumableService";
import { IPartService } from "../../../../../app/hema/business/services/interfaces/IPartService";
import { IBusinessRuleService } from "../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { FavouriteList } from "../../../../../app/hema/business/models/favouriteList";
import * as bignumber from "bignumber";

// todo missing unit tests, only tested found defect
describe("the FavouritesService class", () => {
    let sandbox: Sinon.SinonSandbox;
    let favouritesService: IFavouriteService;

    let storageServiceStub: IStorageService;
    let jobServiceStub: IJobService;
    let consumableServiceStub: IConsumableService;
    let partServiceStub: IPartService;
    let businessRuleServiceStub: IBusinessRuleService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        jobServiceStub = <IJobService>{};
        storageServiceStub = <IStorageService>{};
        consumableServiceStub = <IConsumableService>{};
        partServiceStub = <IPartService>{};
        businessRuleServiceStub = <IBusinessRuleService> {};

        storageServiceStub.getFavouritesList = sandbox.stub().resolves(new FavouriteList());

    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        favouritesService = new FavouriteService(storageServiceStub, jobServiceStub, consumableServiceStub, partServiceStub, businessRuleServiceStub);
        expect(favouritesService).toBeDefined();
    });

    describe("getFavouritesList", () => {

        beforeEach(() => {

        });

        it("converts part price to big number", (done) => {

            let part: any = {
                "patchVanStockEngineers": [],
                "warrantyReturn": {
                    "quantityToClaimOrReturn": 1
                },
                "notUsedReturn": {},
                "isWarrantyReturnOptionAvailable": true,
                "isConsumable": false,
                "isFavourite": false,
                "isValid": true,
                "isPriorityPart": false,
                "isCatalogPriceDifferentFromAdapt": false,
                "hasTaskWithWrongStatus": false,
                "price": "1.12",
                "quantity": 1,
                "stockReferenceId": "212122",
                "description": "11",
                "warrantyEstimate": {
                    "isInWarranty": false,
                    "warrantyPeriodWeeks": 52,
                    "lastFittedDate": 1419984000000,
                    "warrantyEstimateType": 2
                },
                "isMainPartOptionAvailable": false,
                "id": "3fdbbc7f-659e-e54f-275f-c234053ee899",
            };

            let favouritesList = new FavouriteList();
            favouritesList.favourites = [part];

            storageServiceStub.getFavouritesList = sandbox.stub().resolves(favouritesList);

            favouritesService = new FavouriteService(storageServiceStub, jobServiceStub, consumableServiceStub, partServiceStub, businessRuleServiceStub);

            favouritesService.getFavouritesList().then(list => {
                const {favourites} = list;
                const [item] = favourites;
                expect(item["price"] instanceof bignumber.BigNumber).toBeTruthy();

                done();
            });

        });

    });


});
