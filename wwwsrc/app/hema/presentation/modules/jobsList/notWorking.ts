/// <reference path="../../../../../typings/app.d.ts" />

import { inject } from "aurelia-framework";

import { BaseViewModel } from "../../models/baseViewModel";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { LabelService } from "../../../business/services/labelService";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";

@inject(LabelService, EventAggregator, DialogService)
export class NotWorking extends BaseViewModel {
    constructor(labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService) {
        super(labelService, eventAggregator, dialogService);
    }

    public attachedAsync(): Promise<any> {
        this.showContent();
        return Promise.resolve();
    }
}
