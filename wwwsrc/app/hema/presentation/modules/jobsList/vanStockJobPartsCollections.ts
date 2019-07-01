import {inject} from "aurelia-dependency-injection";
import {BaseViewModel} from "../../models/baseViewModel";
import {ILabelService} from "../../../business/services/interfaces/ILabelService";
import {LabelService} from "../../../business/services/labelService";
import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";
import {WorkRetrievalTracker} from "../../../business/services/workRetrievalTracker";
import {EngineerService} from "../../../business/services/engineerService";
import {IEngineerService} from "../../../business/services/interfaces/IEngineerService";
import {JobService} from "../../../business/services/jobService";
import {IJobService} from "../../../business/services/interfaces/IJobService";
import {computedFrom} from "aurelia-binding";
import {StringHelper} from "../../../../common/core/stringHelper";
import {Router} from "aurelia-router";
import {DOM} from "aurelia-pal";
import {IVanStockService} from "../../../business/services/interfaces/IVanStockService";
import {Material} from "../../../business/models/material";
import {VanStockService} from "../../../business/services/vanStockService";
import {JobServiceConstants} from "../../../business/services/constants/jobServiceConstants";

@inject(LabelService, EventAggregator, DialogService, WorkRetrievalTracker, EngineerService, VanStockService, JobService, Router)
export class VanStockJobPartsCollections extends BaseViewModel {
    public partsCollections: Material[];
    public tracker: WorkRetrievalTracker;
    public enabled: boolean;
    public engineerService: IEngineerService;
    public isDone: boolean;

    // private _subscriptions: Subscription[];
    private _router: Router;
    private _vanStockService: IVanStockService;
    private _jobService: IJobService;

    private _subscriptions: Subscription[];

    constructor(labelService: ILabelService,
                eventAggregator: EventAggregator,
                dialogService: DialogService,
                tracker: WorkRetrievalTracker,
                engineerService: IEngineerService,
                vanStockService: IVanStockService,
                jobService: IJobService,
                router: Router) {
        super(labelService, eventAggregator, dialogService);
        this.tracker = tracker;
        this.engineerService = engineerService;
        this._vanStockService = vanStockService;
        this._jobService = jobService;
        this._router = router;
    }

    public async activateAsync(params: { isDone: boolean }): Promise<void> {
        this.isDone = params && params.isDone;
        this._subscriptions = [
            this._eventAggregator.subscribe(JobServiceConstants.JOB_STATE_CHANGED, () => this.update()),
        ];

        const partsCollections = (await this._vanStockService.getPartsToCollect()).toCollect;
        this.partsCollections = (partsCollections || []);

        await this.update();
    }

    public async collectAndNavigateToPartsCollection(e: Event): Promise<void> {
        this.dispatchClickEvent(e);
        await this.setCollectingParts();
        this._router.navigateToRoute("vanStockPartsCollectionDetails");
    }

    public async continueToPartsCollection(e: Event): Promise<void> {
        this.dispatchClickEvent(e);
        this._router.navigateToRoute("vanStockPartsCollectionDetails");
    }

    public async detachedAsync(): Promise<void> {
        this._subscriptions.forEach(subscription => subscription.dispose());
    }

    public navigateToPartsCollection(e: Event): void {
        this._router.navigateToRoute("vanStockPartsCollectionDetails");
        this.dispatchClickEvent(e);
    }    

    @computedFrom("partsCollections")
    public get summaryDescription(): string {
        let totalParts = this.partsCollections ? this.partsCollections.length : 0;
        return `You have ${StringHelper.pluralise(totalParts, "part")} ready for collection`;
    }

    private async update(): Promise<void> {
        let activeJobId = await this._jobService.getActiveJobId();
        this.enabled = !activeJobId;
    }

    private async setCollectingParts(): Promise<void> {
        this.engineerService.isPartCollectionInProgress = true;
        await this.engineerService.setStatus(EngineerService.OBTAINING_MATS_STATUS);
    }

    private dispatchClickEvent(event: Event): void {
        if (event !== null) {
            event.stopPropagation();
            DOM.dispatchEvent(new Event("click"));
        }
    }
}
