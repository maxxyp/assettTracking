import { PreviousJobViewModel } from "./viewModels/previousJobViewModel";
import { inject } from "aurelia-dependency-injection";
import { Router } from "aurelia-router";
import { Task } from "../../../business/models/task";
import { Job } from "../../../business/models/job";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { JobService } from "../../../business/services/jobService";
import { BaseViewModel } from "../../models/baseViewModel";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { LabelService } from "../../../business/services/labelService";
import { IPreviousJobsFactory } from "../../factories/interfaces/IPreviousJobsFactory";
import { PreviousJobsFactory } from "../../factories/previousJobsFactory";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { AnimationService } from "../../../../common/ui/services/animationService";
import { IAnimationService } from "../../../../common/ui/services/IAnimationService";

@inject(JobService, PreviousJobsFactory, LabelService, EventAggregator, DialogService, AnimationService, Router)
export class PreviousJobDetail extends BaseViewModel {
    public router: Router;
    public previousJobViewModel: PreviousJobViewModel;
    public tasks: Task[];
    public job: Job;
    public previousJobIds: string[];
    public previousJobs: PreviousJobViewModel[];
    public card: HTMLElement;

    private _jobService: IJobService;
    private _previousJobsFactory: IPreviousJobsFactory;
    private _itemPosition: number;
    private _animationService: IAnimationService;
    private _router: Router;

    constructor(jobService: IJobService,
        previousJobsFactory: IPreviousJobsFactory,
        labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        animationService: IAnimationService,
        router: Router) {
        super(labelService, eventAggregator, dialogService);
        this._animationService = animationService;
        this.tasks = [];
        this.previousJobs = [];
        this._jobService = jobService;
        this._previousJobsFactory = previousJobsFactory;
        this._router = router;
    }

    public activateAsync(params: { jobId: string, previousJobId: string }): Promise<void> {
        return this._jobService.getJob(params.jobId).then((job) => {
            this.job = job;

            if (this.job && this.job.history && this.job.history.tasks) {
                this.tasks = this.job.history.tasks;
                this.previousJobs = [];
                this._previousJobsFactory.createPreviousJobsViewModel(this.job)
                    .then((previousJobs) => {
                        this.previousJobs = previousJobs;
                        this.previousJobViewModel = this.previousJobs.find(j => j.id === params.previousJobId);
                        this.previousJobIds = this.previousJobs.map(pj => pj.id);
                        this._itemPosition = this.previousJobs.map((x) => { return x.id; }).indexOf(params.previousJobId);
                    });
            }

            this.showContent();
        });
    }
    public swipeFunction(swipeDirection: string): void {
        if (swipeDirection === "left") {
            this._animationService.swipe(this.card, this.previousJobs, this._itemPosition, swipeDirection, "slide-in-right", "slide-out-left", 300).then((position) => {
                this._router.parent.navigate(this._router.parent.currentInstruction.fragment.replace(this.previousJobs[this._itemPosition].id, this.previousJobs[position].id));
                this._itemPosition = position;
            })
                .catch();
        } else {
            this._animationService.swipe(this.card, this.previousJobs, this._itemPosition, swipeDirection, "slide-in-left", "slide-out-right", 300).then((position) => {
                this._router.parent.navigate(this._router.parent.currentInstruction.fragment.replace(this.previousJobs[this._itemPosition].id, this.previousJobs[position].id));
                this._itemPosition = position;
            })
                .catch();
        }
    }
}
