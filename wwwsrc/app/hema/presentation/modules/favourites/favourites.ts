/// <reference path="../../../../../typings/app.d.ts" />
import { inject } from "aurelia-framework";
import { FavouriteService } from "../../../business/services/favouriteService";
import { FavouriteList } from "../../../business/models/favouriteList";
import { Part } from "../../../business/models/part";
import { ConsumablePart } from "../../..//business/models/consumablePart";
import { BaseViewModel } from "../../models/baseViewModel";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { LabelService } from "../../../business/services/labelService";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { JobService } from "../../../business/services/jobService";
import { IFavouriteService } from "../../../business/services/interfaces/IFavouriteService";
import { JobServiceConstants } from "../../../business/services/constants/jobServiceConstants";

@inject(LabelService, EventAggregator, DialogService, FavouriteService, JobService)
export class Favourites extends BaseViewModel {

    public favouriteList: FavouriteList;
    public showAddToPartsBasketButton: boolean;

    private _favouriteService: IFavouriteService;
    private _jobService: IJobService;

    constructor(labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        favouriteService: IFavouriteService,
        jobService: IJobService) {
        super(labelService, eventAggregator, dialogService);

        this._favouriteService = favouriteService;
        this.showAddToPartsBasketButton = false;
        this._jobService = jobService;
    }

    public activateAsync(): Promise<any> {
        return this._jobService.getActiveJobId()
            .then((jobId) => {
                this.showAddToPartsBasketButton = !!(jobId && (jobId !== ""));
                return this._favouriteService.getFavouritesList();
            })
            .then((faveList) => {
                this.favouriteList = faveList;
            });
    }

    public detachedAsync(): Promise<void> {
        this._eventAggregator.publish(JobServiceConstants.JOB_DATA_STATE_CHANGED);
        return Promise.resolve();
    }

    public reorderConsumableItem(item: Part | ConsumablePart): Promise<void> {
        return this._favouriteService.reOrder(item, false).catch((e) => this.showError(e));
    }

    public async reorderPartItem(item: Part | ConsumablePart): Promise<void> {
        await this._favouriteService.reOrder(<Part>item, true).catch((e) => this.showError(e));
        this._eventAggregator.publish(JobServiceConstants.JOB_DATA_STATE_CHANGED);
    }
    public deleteItem(index: number): void {
        this._favouriteService.removeFavourite(index);
    }
}
