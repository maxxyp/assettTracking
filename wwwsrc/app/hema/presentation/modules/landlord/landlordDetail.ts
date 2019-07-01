import { BaseViewModel } from "../../models/baseViewModel";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { LabelService } from "../../../business/services/labelService";
import { inject } from "aurelia-dependency-injection";
import { DialogController, DialogService } from "aurelia-dialog";
import { EventAggregator } from "aurelia-event-aggregator";
import { JobService } from "../../../business/services/jobService";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { CustomerContact } from "../../../business/models/customerContact";

@inject(LabelService, EventAggregator, DialogService, JobService, DialogController)
export class LandlordDetail extends BaseViewModel {

    public contact: CustomerContact;
    public jobId: string;
    public controller: DialogController;

    private _jobService: IJobService;

    constructor(labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        jobService: IJobService,
        controller: DialogController) {
        super(labelService, eventAggregator, dialogService);

        this._jobService = jobService;
        this.controller = controller;

        this.contact = null;
    }

    public activateAsync(params: { jobId: string }): Promise<void> {
        this.jobId = params.jobId;

        return this._jobService.getJob(params.jobId).then(job => {
            this.contact = job.customerContact;
            this.showContent();
        });
    }
}
