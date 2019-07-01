import {inject} from "aurelia-dependency-injection";
import {BaseViewModel} from "../../models/baseViewModel";
import {IJobSummaryFactory} from "../../factories/interfaces/IJobSummaryFactory";
import {JobSummaryFactory} from "../../factories/jobSummaryFactory";
import {Job as JobBusinessModel} from "../../../business/models/job";
import {JobSummaryViewModel} from "../../models/jobSummaryViewModel";
import {ILabelService} from "../../../business/services/interfaces/ILabelService";
import {LabelService} from "../../../business/services/labelService";
import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {JobState} from "../../../business/models/jobState";
import {DialogService} from "aurelia-dialog";
import {JobServiceConstants} from "../../../business/services/constants/jobServiceConstants";

@inject(LabelService, JobSummaryFactory, EventAggregator, DialogService)
export class JobItem extends BaseViewModel {
    public jobSummaryViewModel: JobSummaryViewModel;
    public isDone: boolean;
    public job: JobBusinessModel;

    private _jobSummaryFactory: IJobSummaryFactory;

    private _subscription: Subscription;

    constructor(labelService: ILabelService,
                jobSummaryFactory: IJobSummaryFactory,

                eventAggregator: EventAggregator,
                dialogService: DialogService) {
        super(labelService, eventAggregator, dialogService);
        this._jobSummaryFactory = jobSummaryFactory;
    }

    public activateAsync(job: JobBusinessModel): Promise<void> {
        this.job = job;
        this.jobSummaryViewModel = this._jobSummaryFactory.createJobSummaryViewModel(job);
        this._subscription = this._eventAggregator.subscribe(JobServiceConstants.JOB_STATE_CHANGED, () => this.updateState());
        this.updateState();

        return Promise.resolve();
    }

    public detachedAsync(): Promise<void> {
        if (this._subscription) {
            this._subscription.dispose();
            this._subscription = null;
        }
        return Promise.resolve();
    }

    private updateState(): void {
        this.isDone = this.job.state === JobState.done;
    }
}
