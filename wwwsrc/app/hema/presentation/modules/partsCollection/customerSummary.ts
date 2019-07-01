import { inject } from "aurelia-framework";
import { LabelService } from "../../../business/services/labelService";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { PartsCollectionCustomerViewModel } from "../../models/PartsCollectionCustomerViewModel";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { BaseViewModel } from "../../models/baseViewModel";

@inject(LabelService, EventAggregator, DialogService)
export class CustomerSummary extends BaseViewModel {
    public viewModel: PartsCollectionCustomerViewModel;
    public jobId: string;

    constructor(labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService) {
        super(labelService, eventAggregator, dialogService);
    }

    public activateAsync(params: { jobId: string, customer: PartsCollectionCustomerViewModel }): Promise<void> {
        if (params) {
            this.viewModel = params.customer;
            this.jobId = params.jobId;
        }
        return Promise.resolve();
    }
}
