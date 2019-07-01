import { inject } from "aurelia-framework";
import { LabelService } from "../../../business/services/labelService";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { PartsCollectionViewModel } from "../../models/partsCollectionViewModel";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { BaseViewModel } from "../../models/baseViewModel";

@inject(LabelService, EventAggregator, DialogService)
export class PartsSummary extends BaseViewModel {
    public parts: PartsCollectionViewModel[];

    constructor(labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService) {
        super(labelService, eventAggregator, dialogService);
    }

    public activateAsync(parts: PartsCollectionViewModel[]): Promise<void> {
        this.parts = parts;
        return Promise.resolve();
    }
}
