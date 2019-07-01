import { bindingMode } from "aurelia-binding";
import { bindable, customElement, inject } from "aurelia-framework";
import { EngineerService } from "../../business/services/engineerService";
import { JobService } from "../../business/services/jobService";
import { LabelService } from "../../business/services/labelService";
import { ILabelService } from "../../business/services/interfaces/ILabelService";
import { IJobService } from "../../business/services/interfaces/IJobService";
import { IEngineerService } from "../../business/services/interfaces/IEngineerService";
import { Subscription, EventAggregator } from "aurelia-event-aggregator";
import { JobState } from "../../business/models/jobState";
import { WorkRetrievalServiceConstants } from "../../business/services/constants/workRetrievalServiceConstants";
import { StringHelper } from "../../../common/core/stringHelper";
import { ObjectHelper } from "../../../common/core/objectHelper";
import { EngineerServiceConstants } from "../../business/services/constants/engineerServiceConstants";

import { AttributeConstants } from "../../../common/ui/attributes/constants/attributeConstants";
import { WorkRetrievalTracker } from "../../business/services/workRetrievalTracker";
import { AnalyticsConstants } from "../../../common/analytics/analyticsConstants";

const WORKLIST_RETRIVAL_LABEL: string = "Worklist Retrival";

@customElement("worklist-notification")
@inject(LabelService, EventAggregator, JobService, EngineerService, WorkRetrievalTracker)
export class WorklistNotification {
    public jobsTodoCount: number;
    public activitiesCount: number;
    public labels: { [key: string]: string };
    public isFullScreen: boolean;

    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public jobRefreshFn: () => Promise<any>;

    public status: "NOT_WORKING" | "NORMAL" | "REQUESTING" | "FAILED_WORKLIST" | "NEW_WORKLIST";
    public  tracker: WorkRetrievalTracker;

    private _eventAggregator: EventAggregator;
    private _subscriptions: Subscription[];
    private _jobService: IJobService;
    private _engineerService: IEngineerService;
    private _labelService: ILabelService;
    private _lastKnownUpdatedTime: Date;

    constructor(labelService: ILabelService,
        eventAggregator: EventAggregator,
        jobService: IJobService,
        engineerService: IEngineerService,
        workRetrievalTracker: WorkRetrievalTracker) {
        this._eventAggregator = eventAggregator;
        this._jobService = jobService;
        this._engineerService = engineerService;

        this._labelService = labelService;
        this.labels = {};
        this.tracker = workRetrievalTracker;
        this._subscriptions = [];
    }

    public async attached(): Promise<void> {
        this.labels = await this._labelService.getGroup(StringHelper.toCamelCase(ObjectHelper.getClassName(this)));

        this._subscriptions = [
            this._eventAggregator.subscribe(EngineerServiceConstants.ENGINEER_STATUS_CHANGED, () => this.update()),
            this._eventAggregator.subscribe(WorkRetrievalServiceConstants.REFRESH_START_STOP, () => this.update()),
            this._eventAggregator.subscribe(AttributeConstants.FULL_SCREEN_TOGGLE, (isFullScreen: boolean) => this.isFullScreen = window.isFullScreen)
        ];

        await this.updateList();
        await this.update();
    }

    public detached(): void {
        this._subscriptions.forEach(s => s.dispose());
    }

    public triggerWorklistRetrieval(): void {
        this._eventAggregator.publish(WorkRetrievalServiceConstants.REQUEST_WORK_AND_REFRESH_WORK_LIST);
        this._eventAggregator.publish(AnalyticsConstants.ANALYTICS_EVENT, {
            category: AnalyticsConstants.WORKLIST_RETRIVAL_CATEGORY,
            action: AnalyticsConstants.CLICK_ACTION,
            label: WORKLIST_RETRIVAL_LABEL,
            metric: AnalyticsConstants.METRIC
        });
    }

    public async refreshAfterNewWorklist(): Promise<void> {
        await this.updateList();
        await this.update();
    }

    private async update(): Promise<void> {

        let getTime = (date: Date) => date ? date.getTime() : 0;

        if (!await this._engineerService.isWorking()) {
            this.status = "NOT_WORKING";
        } else if (this.tracker.requestingStatus) {
            this.status = "REQUESTING";
        } else if (getTime(this.tracker.lastFailedTime) > getTime(this.tracker.lastRequestTime)) {
            this.status = "FAILED_WORKLIST";
        } else if (this._lastKnownUpdatedTime && getTime(this.tracker.lastUpdatedTime) !== getTime(this._lastKnownUpdatedTime)) {
            this.status = "NEW_WORKLIST";
        } else {

            // edge case: we are looking at the screen when the first request of the day comes in, i.e. this._lastKnownUpdatedTime is empty,
            // in this case don't show the refresh worklist button and just automatically refresh the worklist
            if (getTime(this.tracker.lastUpdatedTime) !== getTime(this._lastKnownUpdatedTime)) {
                await this.updateList();
            }

            this.status = "NORMAL";
            let jobsToDo = await this._jobService.getJobsToDo() || [];
            let liveJobs = jobsToDo.filter(x => x.state !== JobState.done);

            this.jobsTodoCount = liveJobs.length;
            this.activitiesCount = liveJobs.map(job => (job.tasks || []).length)
                                        .reduce((prev, curr) => prev + curr, 0);
        }
    }

    private async updateList(): Promise<void> {
        this._lastKnownUpdatedTime = this.tracker.lastUpdatedTime;
        if (!!this.jobRefreshFn) {
            await this.jobRefreshFn();
        }
    }
}
