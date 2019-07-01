import { DialogService } from "aurelia-dialog";
import { JobService } from "../../../business/services/jobService";
import { EventAggregator } from "aurelia-event-aggregator";
import { LabelService } from "../../../business/services/labelService";
import { BaseViewModel } from "../../models/baseViewModel";
import { inject } from "aurelia-framework";
import { IPartsCollectionFactory } from "../../factories/interfaces/IPartsCollectionFactory";
import { PartsCollectionFactory } from "../../factories/partsCollectionFactory";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { PartCollectionDetailViewModel } from "../../models/partCollectionDetailViewModel";
import { BusinessException } from "../../../business/models/businessException";

@inject(LabelService, EventAggregator, DialogService, JobService, PartsCollectionFactory)
export class PartsCollectionDetails extends BaseViewModel {

    public viewModel: PartCollectionDetailViewModel[];
    public isDone: boolean;
    private _factory: IPartsCollectionFactory;
    private _jobService: IJobService;

    constructor(labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        jobService: IJobService,
        factory: IPartsCollectionFactory) {
        super(labelService, eventAggregator, dialogService);
        this._jobService = jobService;
        this._factory = factory;
    }

    public async activateAsync(params: { isDone: string }): Promise<void> {
        try {
            this.isDone = params && params.isDone === "true" ? true : false;
            const businessModel = await this._jobService.getPartsCollections();
            this.viewModel = this._factory.createPartsCollectionViewModel(businessModel.filter(x => x.done === this.isDone));
            this.showContent();
            return Promise.resolve();
        } catch (e) {
            this.showError(new BusinessException(this, "PartsCollectionDetails", "Error while loading parts details", [], e));
            return Promise.resolve();
        }
    }
}
