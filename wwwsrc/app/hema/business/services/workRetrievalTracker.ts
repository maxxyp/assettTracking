
import { WorkRetrievalRequestingStatus } from "./workRetrievalRequestingStatus";
import { IConfigurationService } from "../../../common/core/services/IConfigurationService";
import { ConfigurationService } from "../../../common/core/services/configurationService";
import { IHemaConfiguration } from "../../IHemaConfiguration";
import { inject } from "aurelia-dependency-injection";
import { IWorkListItem } from "../../api/models/fft/engineers/worklist/IWorkListItem";
// todo: back this by proper storage?
@inject(ConfigurationService)
export class WorkRetrievalTracker {
    public lastRequestTime: Date;
    public lastUpdatedTime: Date;
    public lastFailedTime: Date;
    public requestingStatus: WorkRetrievalRequestingStatus;
    private _configurationService: IConfigurationService;

    private _requestWorkOnNextCall: boolean;
    private _hasOneCompletionHappened: boolean;
    private _lastKnownModifiedTimestamp: string;

    private _hasWorklistFailedPreviously: boolean;
    private _knownItems: IWorkListItem[];

    constructor(configurationService: IConfigurationService) {
        this._configurationService = configurationService;
        // ensure that the first worklist always loads as even in the worst case where no timestamp is returned, null !== undefined.
        this._lastKnownModifiedTimestamp = null;
        this._knownItems = [];
    }

    public setShouldRequestWorkOnNextCall(val: boolean): void {
        this._requestWorkOnNextCall = val;
    }

    public shouldRequestWorkOnNextCall(): boolean {
        return !!this._requestWorkOnNextCall;
    }

    public resetLastKnownModifiedTimestamp(): void {
        this._lastKnownModifiedTimestamp = null;
    }

    public getLastKnownModifiedTimestamp(): string {
        return this._lastKnownModifiedTimestamp;
    }

    public isWorkListIdentifierKnown(): boolean {
        return this._lastKnownModifiedTimestamp !== null;
    }

    public startRequesting(): void {
        this.lastRequestTime = new Date();
        this.requestingStatus = this._requestWorkOnNextCall
            ? WorkRetrievalRequestingStatus.requestingFullRequest
            : WorkRetrievalRequestingStatus.requestingRefresh;
    }

    public isFirstRequestForWorkOfTheDay(): boolean {
        return this.requestingStatus === WorkRetrievalRequestingStatus.requestingFullRequest
            && !this._hasOneCompletionHappened;
    }

    public registerItems(okItems: IWorkListItem[], failedItems: IWorkListItem[], allLiveItems: IWorkListItem[]): void {
        this._hasOneCompletionHappened = true;

        okItems.forEach(item => {
            let existingItem = this._knownItems.find(knownItem => knownItem.id === item.id && knownItem.workType === item.workType);
            if (existingItem) {
                existingItem.timestamp = item.timestamp;
            } else {
                this._knownItems.push(item);
            }
        });

        failedItems.forEach(item => {
            let existingItem = this._knownItems.find(knownItem => knownItem.id === item.id && knownItem.workType === item.workType);
            if (existingItem) {
                existingItem.timestamp = undefined;
            } else {
                item.timestamp = undefined;
                this._knownItems.push(item);
            }
        });

        // prune _knownItems once a job has left the worklist
        // (helps if a job enters and leaves the worklist to make sure it is refreshed from the api when it reappears)
        this._knownItems = this._knownItems.filter(item => allLiveItems.some(liveItem => liveItem.id === item.id && liveItem.workType === item.workType));
    }

    public hasItemFailedPreviously(item: IWorkListItem): boolean {
        return this._knownItems.some(knownItem => knownItem.id === item.id && knownItem.workType === item.workType && !knownItem.timestamp);
    }

    public shouldRetrieveItem(item: IWorkListItem): boolean {
        if (this._configurationService.getConfiguration<IHemaConfiguration>().worklistAlwaysGetAllJobs) {
            // if we want to brute force get all jobs every time
            return true;
        } else {
            // otherwise we only want changed or previously failed jobs
            return this.hasItemFailedPreviously(item)
                    || !this._knownItems.some(knownJob => knownJob.id === item.id
                                                && knownJob.timestamp === item.timestamp
                                                && knownJob.workType === item.workType);
        }
    }

    public registerUnchangedWorklist(): void {
        this.requestingStatus = WorkRetrievalRequestingStatus.notRequesting;
    }

    public registerNewWorklist(timestamp: string, isOnlyForTracking: boolean): void {
        this._lastKnownModifiedTimestamp = timestamp;
        if (!isOnlyForTracking) {
            this.requestingStatus = WorkRetrievalRequestingStatus.notRequesting;
            this.lastUpdatedTime = new Date();
        }
    }

    public registerFailedWorklist(isOnlyForTracking: boolean): void {
        this._hasWorklistFailedPreviously = true;
        if (!isOnlyForTracking) {
            this.requestingStatus = WorkRetrievalRequestingStatus.notRequesting;
            this.lastFailedTime = new Date();
        }
    }

    public failedRequestWork(): void {
        this.lastFailedTime = new Date();
        this.requestingStatus = WorkRetrievalRequestingStatus.notRequesting;
    }

    public deregisterFailedWorklist(): void {
        this._hasWorklistFailedPreviously = false;
    }

    public hasWorklistFailedPreviously(): boolean {
        return !!this._hasWorklistFailedPreviously;
    }
}
