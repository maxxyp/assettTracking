import { inject } from "aurelia-dependency-injection";
import { BaseViewModel } from "../../models/baseViewModel";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { LabelService } from "../../../business/services/labelService";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { WorkRetrievalTracker } from "../../../business/services/workRetrievalTracker";
import { JobPartsCollection } from "../../../business/models/jobPartsCollection";
import { JobServiceConstants } from "../../../business/services/constants/jobServiceConstants";
import { EngineerService } from "../../../business/services/engineerService";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { JobService } from "../../../business/services/jobService";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { WorkRetrievalServiceConstants } from "../../../business/services/constants/workRetrievalServiceConstants";
import { computedFrom } from "aurelia-binding";
import { StringHelper } from "../../../../common/core/stringHelper";
import { Router } from "aurelia-router";
import { DOM } from "aurelia-pal";

@inject(LabelService, EventAggregator, DialogService, WorkRetrievalTracker, EngineerService, JobService, Router)
export class JobPartsCollections extends BaseViewModel {
    public partsCollections: JobPartsCollection[];
    public tracker: WorkRetrievalTracker;
    public enabled: boolean;
    public isDone: boolean;
    public engineerService: IEngineerService;

    private _subscriptions: Subscription[];    
    private _jobService: IJobService;
    private _router: Router;

    constructor(labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        tracker: WorkRetrievalTracker,
        engineerService: IEngineerService,
        jobService: IJobService,
        router: Router) {
        super(labelService, eventAggregator, dialogService);
        this.tracker = tracker;
        this.engineerService = engineerService;
        this._jobService = jobService;
        this._router = router;
    }

    public async activateAsync(params: { isDone: boolean }): Promise<void> {
        this.isDone = params && params.isDone;
        this._subscriptions = [
            this._eventAggregator.subscribe(JobServiceConstants.JOB_STATE_CHANGED, () => this.update()),            
            this._eventAggregator.subscribe(WorkRetrievalServiceConstants.REFRESH_START_STOP, () => this.update())
        ];
        await this.update();
    }

    public async detachedAsync(): Promise<void> {
        this._subscriptions.forEach(subscription => subscription.dispose());
    }

    public async setCollectingParts(e: any): Promise<void> {
        this.dispatchClickEvent(e);
        this.engineerService.isPartCollectionInProgress = true;
        await this.engineerService.setStatus(EngineerService.OBTAINING_MATS_STATUS);
    }

    public async setPartsCollected(e: any): Promise<void> {
        this.dispatchClickEvent(e);
        this.engineerService.isPartCollectionInProgress = false;
        // set the engineerstatus back to Working status
        await this._jobService.completePartsCollections();
        await this.engineerService.setStatus(undefined);
        this._router.navigateToRoute("to-do");
    }

    public navigateToPartsCollection(e: Event): void {
        if (this.isDone) {
            this._router.navigateToRoute("donePartsCollectionDetails", { isDone: "true" });
        } else {
            this._router.navigateToRoute("partsCollectionDetails", { isDone: "false" });
        }
        this.dispatchClickEvent(e);
    }

    // e.g. 7 parts to collect: 3 parts - Job 1319414267;  4 parts - Job 1319415267
    @computedFrom("partsCollections")
    public get summaryDescription(): string {

        let value = "";
        let totalParts = 0;

        const { length = 0 } = this.partsCollections;
        const lastIndex = length - 1;

        this.partsCollections.forEach((j, index) => {

            if (j.parts && j.parts.length > 0) {

                const noParts = j.parts.map(p => p.quantity).reduce((p, n) => (p + n));

                value += `${StringHelper.pluralise(noParts, "part")} - Job ${j.id}`;

                totalParts = (totalParts + noParts);

            } else {
                value += `0 parts - Job ${j.id}`;
            }

            if (index < lastIndex) {
                value += "; ";
            }
        });

        if (value) {
            value = `${StringHelper.pluralise(totalParts, "part")} ${this.isDone ? "collected" : "to collect"}: ${value}`;
        }

        return value;
    }

    private async update(): Promise<void> {
        let [partsCollections, activeJobId] = await Promise.all([
            this._jobService.getPartsCollections(),
            this._jobService.getActiveJobId()            
        ]);
        this.partsCollections = (partsCollections || [])
            .filter(partsCollection => !!partsCollection.done === !!this.isDone);
        this.enabled = !activeJobId;        
    }

    private dispatchClickEvent(event: Event): void {
        if (event !== null) {
            event.stopPropagation();
            DOM.dispatchEvent(new Event("click"));
        }
    }
}
