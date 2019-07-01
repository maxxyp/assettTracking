import { LabelService } from "../../../business/services/labelService";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { inject } from "aurelia-framework";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { BaseViewModel } from "../../models/baseViewModel";
import { PartCollectionDetailViewModel } from "../../models/partCollectionDetailViewModel";

@inject(LabelService, EventAggregator, DialogService)
export class PartsCollectionItem extends BaseViewModel {
    public viewModel: PartCollectionDetailViewModel;
    public isDone: boolean;

    constructor(labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService) {
        super(labelService, eventAggregator, dialogService);
    }

    public activateAsync(params: { isDone: boolean, partDetails: PartCollectionDetailViewModel }): Promise<void> {
        if (params) {
            this.viewModel = params.partDetails;
            this.isDone = params.isDone;
        }
        return Promise.resolve();
    }
}
