/// <reference path="../../../../typings/app.d.ts" />
import { inject } from "aurelia-framework";
import { FavouriteList } from "../models/favouriteList";
import { Part } from "../models/part";
import { ConsumablePart } from "../models/consumablePart";
import { IFavouriteService } from "./interfaces/IFavouriteService";
import { IStorageService } from "./interfaces/IStorageService";
import { StorageService } from "./storageService";
import { IConsumableService } from "../../business/services/interfaces/IConsumableService";
import { ConsumableService } from "../../business/services/consumableService";
import { IPartService } from "./interfaces/IPartService";
import { PartService } from "./partService";
import { IJobService } from "./interfaces/IJobService";
import { JobService } from "./jobService";
import { IBusinessRuleService } from "./interfaces/IBusinessRuleService";
import { BusinessRuleService } from "./businessRuleService";
import { BusinessException } from "../models/businessException";

// import * as bignumber from "bignumber";

@inject(StorageService, JobService, ConsumableService, PartService, BusinessRuleService)
export class FavouriteService implements IFavouriteService {
    public favouritesList: FavouriteList;

    private _storageService: IStorageService;
    private _jobService: IJobService;
    private _consumablesService: IConsumableService;
    private _partService: IPartService;
    private _businessRuleService: IBusinessRuleService;

    constructor(storageService: IStorageService, jobService: IJobService,
                consumableService: IConsumableService,
                partService: IPartService,
                businessRuleService: IBusinessRuleService) {
        this._storageService = storageService;
        this._jobService = jobService;
        this._consumablesService = consumableService;
        this._partService = partService;
        this._businessRuleService = businessRuleService;
        // todo promise in contructor??
        this.getFavouritesList().then(favouriteList => {
            this.favouritesList = favouriteList;
        });
    }

    public addFavouriteConsumablePart(favouriteItem: ConsumablePart): Promise<void> {
        return this.addFavourite(favouriteItem, "ConsumablePart");
    }

    public addFavouritePart(favouriteItem: Part): Promise<void> {
        return this.addFavourite(favouriteItem, "Part");
    }

    public removeFavourite(index: number): Promise<void> {
        this.favouritesList.favourites.splice(index, 1);
        return this.saveFavouritesList();
    }

    public reOrder(favouriteItem: Part | ConsumablePart, isPart: boolean): Promise<void> {
        if (!isPart) {
            return this._consumablesService.addConsumableToBasket(<ConsumablePart>favouriteItem).then(() => Promise.resolve());
        }

        return this._businessRuleService.getQueryableRuleGroup("partsBasket")
            .then(ruleGroup => {
                if (ruleGroup) {
                    let partOrderStatus = ruleGroup.getBusinessRule<string>("partOrderStatus");
                    if (partOrderStatus) {
                        return this._jobService.getActiveJobId()
                            .then(jobId => {
                                return this._partService.getPartsBasket(jobId)
                                    .then(basket => {
                                        (<Part>favouriteItem).partOrderStatus = partOrderStatus;
                                        (<Part>favouriteItem).isMainPart = false;
                                        (<Part>favouriteItem).isFavourite = true;
                                        basket.partsToOrder.push(<Part>favouriteItem);
                                        return this._partService.savePartsBasket(jobId, basket)
                                            .then(() => this._partService.setPartsRequiredForTask(jobId))
                                            .thenReturn();
                                    });
                            });
                    } else {
                        throw new BusinessException(this, "FavouriteService.reOrder", "business rule group missing", null, null);
                    }
                } else {
                    throw new BusinessException(this, "FavouriteService.reOrder", "business rule missing", null, null);
                }
            });
    }

    public getFavouritesList(): Promise<FavouriteList> {
        return this._storageService.getFavouritesList().then((favouritesList) => {
            if (favouritesList) {

                // hydrate
                const newFavourites = favouritesList.favourites.map(f => {
                    if (!f || !Object.keys(f).some(p => p === "price")) {
                        return f;
                    }
                    return Part.fromJson(f);
                });

                return this.favouritesList = {...favouritesList, favourites: newFavourites};
            } else {
                return new FavouriteList();
            }
        });
    }

    private addFavourite(favouriteItem: Part | ConsumablePart, type: string): Promise<void> {
        return this.getFavouritesList().then(favouriteList => {
            let faveItem: Part = JSON.parse(JSON.stringify(favouriteItem));
            let foundPart = favouriteList.favourites.findIndex(favePart => favePart.description === faveItem.description);
            if (foundPart === -1) {
                faveItem.quantity = 1;
                if (type === "Part") {
                    // clear down any warranty information
                    if (faveItem.warrantyReturn) {
                        faveItem.warrantyReturn.isWarrantyReturn = undefined;
                        faveItem.warrantyReturn.quantityToClaimOrReturn = 1;
                        faveItem.warrantyReturn.reasonForClaim = undefined;
                        faveItem.warrantyReturn.removedPartStockReferenceId = undefined;
                    }
                    faveItem.isMainPart = undefined;
                    faveItem.partOrderStatus = undefined;
                    faveItem.taskId = undefined;
                }
                this.favouritesList.favourites.push(faveItem);
                return this.saveFavouritesList();
            } else {
                return Promise.resolve();
            }
        });
    }

    private saveFavouritesList(): Promise<void> {
        return this._storageService.setFavouritesList(this.favouritesList);
    }

}
