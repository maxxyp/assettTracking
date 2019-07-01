/// <reference path="../../../../../typings/app.d.ts" />

import {inject} from "aurelia-framework";

import {BaseViewModel} from "../../models/baseViewModel";
import {Job as JobBusinessModel} from "../../../business/models/job";
import {ILabelService} from "../../../business/services/interfaces/ILabelService";
import {LabelService} from "../../../business/services/labelService";
import {EventAggregator} from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";
import {IJobService} from "../../../business/services/interfaces/IJobService";
import {JobState} from "../../../business/models/jobState";
import {JobService} from "../../../business/services/jobService";

@inject(LabelService, EventAggregator, DialogService, JobService)

export class Done extends BaseViewModel {
    public jobs: JobBusinessModel[];
    public isSignedOn: boolean;
    private _jobService: IJobService;

    constructor(labelService: ILabelService,
                eventAggregator: EventAggregator,
                dialogService: DialogService, jobService: IJobService) {
        super(labelService, eventAggregator, dialogService);

        this.jobs = [];
        this._jobService = jobService;
    }

    public activateAsync(): Promise<any> {

        return this._jobService.getJobsToDo()
            .then((jobsToDo) => {
                this.jobs = (jobsToDo || []).filter(j => j.state === JobState.done);
            }).then(() => {
                this.showContent();
            });
    }

}
