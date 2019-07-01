import { inject } from "aurelia-dependency-injection";
import { BaseViewModel } from "../../models/baseViewModel";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { LabelService } from "../../../business/services/labelService";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { JobApiFailure } from "../../../business/models/jobApiFailure";
import { WorkRetrievalServiceConstants } from "../../../business/services/constants/workRetrievalServiceConstants";
import { WorkRetrievalTracker } from "../../../business/services/workRetrievalTracker";

@inject(LabelService, EventAggregator, DialogService, WorkRetrievalTracker)
export class JobApiFailureItem extends BaseViewModel {
    public jobApiFailure: JobApiFailure;
    public tracker: WorkRetrievalTracker;

    constructor(labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        tracker: WorkRetrievalTracker) {
        super(labelService, eventAggregator, dialogService);
        this.tracker = tracker;
    }

    public activateAsync(jobApiFailure: JobApiFailure): Promise<void> {
        this.jobApiFailure = jobApiFailure;
        return Promise.resolve();
    }

    public refreshJobList(): void {
        this._eventAggregator.publish(WorkRetrievalServiceConstants.REFRESH_WORK_LIST);
    }

    public detachedAsync(): Promise<void> {
        return Promise.resolve();
    }
}
