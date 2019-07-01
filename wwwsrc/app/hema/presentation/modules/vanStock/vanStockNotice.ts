import { BaseViewModel } from "../../models/baseViewModel";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { LabelService } from "../../../business/services/labelService";
import { Part as PartBusinessModel } from "../../../business/models/part";
import { inject } from "aurelia-dependency-injection";

import * as moment from "moment";
import { DialogController, DialogService } from "aurelia-dialog";
import { EventAggregator } from "aurelia-event-aggregator";

@inject(LabelService, EventAggregator, DialogService, DialogController)
export class VanStockNotice extends BaseViewModel {
    public part: PartBusinessModel;
    public jobId: string;
    public controller: DialogController;

    constructor(
        labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        controller: DialogController,
    ) {
        super(labelService, eventAggregator, dialogService);
        this.controller = controller;
    }

    public activateAsync(params: { jobId: string, part: PartBusinessModel, userPatch: string }): Promise<void> {
        let parts: PartBusinessModel[] = [];
        this.part = params.part;
        this.jobId = params.jobId;
        parts.push(this.part);
        this.showContent();
        return Promise.resolve();
    }

    public getYear(dt: Date): string {
        return moment(dt).format("YYYY");
    }
}
