import { ISupportService } from "./interfaces/ISupportService";
import { IJobUpdate } from "../../api/models/fft/jobs/jobupdate/IJobUpdate";
import { inject } from "aurelia-framework";
import { HemaStorage } from "../../core/services/hemaStorage";
import { IStorage } from "../../../common/core/services/IStorage";
import { JobServiceConstants } from "./constants/jobServiceConstants";
import { EventAggregator } from "aurelia-event-aggregator";
import { StorageConstants } from "../constants/storageConstants";

@inject(HemaStorage, EventAggregator)
export class SupportService implements ISupportService {
    private _storage: IStorage;
    private _eventAggregator: EventAggregator;

    constructor(storage: IStorage, eventAggregator: EventAggregator) {
        this._storage = storage;
        this._eventAggregator = eventAggregator;
        this._eventAggregator.subscribe(JobServiceConstants.JOB_COMPLETED, (jobUpdate: IJobUpdate) => {
            this._storage.set<IJobUpdate>(StorageConstants.HEMA_STORAGE_CONTAINER, StorageConstants.HEMA_SOTRAGE_LAST_JOB_UPDATE, jobUpdate);
        });
    }

    public getLastJobUpdate(): Promise<IJobUpdate> {
        return this._storage.get<IJobUpdate>(StorageConstants.HEMA_STORAGE_CONTAINER, StorageConstants.HEMA_SOTRAGE_LAST_JOB_UPDATE);
    }
}
