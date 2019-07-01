import {inject} from "aurelia-dependency-injection";
import {Router} from "aurelia-router";

import {BaseViewModel} from "../../models/baseViewModel";

import {JobSummaryViewModel} from "../../models/jobSummaryViewModel";
import {ILabelService} from "../../../business/services/interfaces/ILabelService";
import {LabelService} from "../../../business/services/labelService";
import {EventAggregator} from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";
import { JobState } from "../../../business/models/jobState";

@inject(LabelService, Router, EventAggregator, DialogService)
export class JobSummary extends BaseViewModel {
    public viewModel: JobSummaryViewModel;

    private _router: Router;

    constructor(labelService: ILabelService,
                router: Router,
                eventAggregator: EventAggregator,
                dialogService: DialogService) {
        super(labelService, eventAggregator, dialogService);

        this._router = router;
    }

    public activateAsync(jobSummary: JobSummaryViewModel): Promise<void> {
        this.viewModel = jobSummary;

        return Promise.resolve();
    }

    public attachedAsync() : Promise<void> {
        if (this.viewModel) {
            this.viewModel.viewCount++;
        }
        return Promise.resolve();
    }

    public navigateToDetails(): void {
        const routeName = this.viewModel.jobState === JobState.done ? "doneJob" : "job";
        this._router.navigateToRoute(routeName, {jobId: this.viewModel.jobNumber});
    }
}
