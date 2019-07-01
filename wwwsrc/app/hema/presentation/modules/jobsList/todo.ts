/// <reference path="../../../../../typings/app.d.ts" />

import {inject} from "aurelia-framework";

import {BaseViewModel} from "../../models/baseViewModel";
import {IJobService} from "../../../business/services/interfaces/IJobService";
import {JobService} from "../../../business/services/jobService";
import {Job} from "../../../business/models/job";
import {ILabelService} from "../../../business/services/interfaces/ILabelService";
import {LabelService} from "../../../business/services/labelService";
import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";
import {JobState} from "../../../business/models/jobState";
import { JobApiFailure } from "../../../business/models/jobApiFailure";
import {FeatureToggleService} from "../../../business/services/featureToggleService";
import {IFeatureToggleService} from "../../../business/services/interfaces/IFeatureToggleService";
import { JobServiceConstants } from "../../../business/services/constants/jobServiceConstants";

@inject(LabelService, EventAggregator, DialogService, JobService, FeatureToggleService)
export class Todo extends BaseViewModel {

    public jobs: {isError: boolean, data: Job | JobApiFailure}[];
    public isAssetTracked: boolean;

    private _jobService: IJobService;
    private _subscriptions: Subscription[];

    constructor(labelService: ILabelService,
                eventAggregator: EventAggregator,
                dialogService: DialogService,
                jobService: IJobService,
                featureToggleService: IFeatureToggleService) {
        super(labelService, eventAggregator, dialogService);

        this._jobService = jobService;
        this._subscriptions = [];
        this.isAssetTracked = featureToggleService.isAssetTrackingEnabled();
    }

    public async activateAsync(): Promise<void> {
        this._subscriptions.push(this._eventAggregator.subscribe(JobServiceConstants.JOB_COMPLETION_REFRESH, () => this.updateJobs()));
        this.showContent();
    }

    public deactivateAsync(): Promise<void> {
        this._subscriptions.forEach(s => s.dispose());
        this._subscriptions = [];

        return Promise.resolve();
    }

    public async updateJobs(): Promise<void> {
        let [jobsToDo, jobApiFailures] = await Promise.all<Job[], JobApiFailure[]>([
            this._jobService.getJobsToDo(),
            this._jobService.getWorkListJobApiFailures()
        ]);

        let activeJobs = (jobsToDo || [])
                            .filter(j => j.state !== JobState.done)
                            .map(job => ({isError: false, data: job}));

        let errorJobs = (jobApiFailures || [])
                            .map(error => ({isError: true, data: error}));

        this.jobs = [...activeJobs, ...errorJobs]
                        .sort((a, b) => a.data.position < b.data.position ? -1 : 1);

    }
}
