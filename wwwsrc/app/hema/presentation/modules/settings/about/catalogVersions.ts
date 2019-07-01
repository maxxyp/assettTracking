import {ILabelService} from "../../../../business/services/interfaces/ILabelService";
import {EventAggregator} from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";
import {LabelService} from "../../../../business/services/labelService";
import {inject} from "aurelia-dependency-injection";
import {BaseInformation} from "./baseInformation";
import {ReferenceDataService} from "../../../../business/services/referenceDataService";
import {IReferenceDataService} from "../../../../business/services/interfaces/IReferenceDataService";
import {ReferenceVersion} from "../../../../business/models/reference/referenceVersion";
import {StorageService} from "../../../../business/services/storageService";
import {IStorageService} from "../../../../business/services/interfaces/IStorageService";

@inject(LabelService, EventAggregator, DialogService, ReferenceDataService, StorageService)
export class CatalogVersions extends BaseInformation {
    public referenceVersions: ReferenceVersion[];
    public lastSuccessfulSyncTime: Date;

    private _referenceDataService: IReferenceDataService;
    private _storageService: IStorageService;

    constructor(labelService: ILabelService, eventAggregator: EventAggregator, dialogService: DialogService,
                referenceDataService: IReferenceDataService, storageService: IStorageService) {
        super(labelService, eventAggregator, dialogService);

        this.isExpanded = false;
        this._referenceDataService = referenceDataService;
        this._storageService = storageService;
    }

    public attachedAsync() : Promise<void> {
        this.referenceVersions = this._referenceDataService.getVersions();
        return this._storageService.getLastSuccessfulSyncTime()
            .then((lastSuccessfulSyncTime) => {
                this.lastSuccessfulSyncTime = new Date(lastSuccessfulSyncTime);
            });
    }
}
