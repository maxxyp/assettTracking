import {inject} from "aurelia-dependency-injection";
import {Task} from "../../../business/models/task";
import {Job} from "../../../business/models/job";
import {IJobService} from "../../../business/services/interfaces/IJobService";
import {JobService} from "../../../business/services/jobService";
import {PreviousJobViewModel} from "./viewModels/previousJobViewModel";
import {Router} from "aurelia-router";

import {IPreviousJobsFactory} from "../../factories/interfaces/IPreviousJobsFactory";
import {PreviousJobsFactory} from "../../factories/previousJobsFactory";
import {BaseViewModel} from "../../models/baseViewModel";
import {ILabelService} from "../../../business/services/interfaces/ILabelService";
import {LabelService} from "../../../business/services/labelService";
import {EventAggregator} from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";

@inject(Router, JobService, PreviousJobsFactory, LabelService, EventAggregator, DialogService)
export class PreviousJobs extends BaseViewModel {
    public tasks: Task[];
    public job: Job;
    public previousJobs: PreviousJobViewModel[];
    public isFullScreen: boolean;
    private _jobService: IJobService;
    private _previousJobsFactory: IPreviousJobsFactory;
    private _router: Router;

    constructor(router: Router,
                jobService: IJobService,
                previousJobsFactory: IPreviousJobsFactory,
                labelService: ILabelService,
                eventAggregator: EventAggregator,
                dialogService: DialogService) {
        super(labelService, eventAggregator, dialogService);

        this.tasks = [];
        this.previousJobs = [];
        this._router = router;
        this._jobService = jobService;
        this._previousJobsFactory = previousJobsFactory;
        this.isFullScreen = window.isFullScreen;
    }

    public activateAsync(params: { jobId: string }): Promise<void> {
        return this._jobService.getJob(params.jobId).then((job) => {
            return this._previousJobsFactory.createPreviousJobsViewModel(job)
                .then((previousJobs) => {
                    this.previousJobs = previousJobs;
                    this.showContent();
                });
        });
    }

    public navigateToPreviousJob(id: string): void {
        this._router.navigateToRoute("previous-job", {previousJobId: id});
    }
}
