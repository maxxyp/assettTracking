import {ILabelService} from "../../../../business/services/interfaces/ILabelService";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";
import {LabelService} from "../../../../business/services/labelService";
import {inject} from "aurelia-dependency-injection";
import {BaseInformation} from "./baseInformation";
import {IEngineerService} from "../../../../business/services/interfaces/IEngineerService";
import {EngineerService} from "../../../../business/services/engineerService";
import {StorageService} from "../../../../business/services/storageService";
import {IStorageService} from "../../../../business/services/interfaces/IStorageService";
import {CatalogService} from "../../../../business/services/catalogService";
import {ICatalogService} from "../../../../business/services/interfaces/ICatalogService";
import {VanStockService} from "../../../../business/services/vanStockService";
import {IVanStockService} from "../../../../business/services/interfaces/IVanStockService";
import { UserPreferenceConstants } from "../../../../business/services/constants/userPreferenceConstants";

@inject(LabelService, EventAggregator, DialogService, EngineerService, StorageService, CatalogService, VanStockService)
export class EngineerDetails extends BaseInformation {
    public name: string;
    public payrollId: string;
    public lanId: string;
    public phoneNumber: string;
    public roles: string;
    public workingArea: string;
    public patch: string;
    public region: string;

    private _engineerService: IEngineerService;
    private _storageService: IStorageService;
    private _catalogService: ICatalogService;
    private _vanStockService: IVanStockService;
    private _subscription: Subscription;

    constructor(labelService: ILabelService, eventAggregator: EventAggregator, dialogService: DialogService,
                engineerService: IEngineerService, storageService: IStorageService, catalogService: ICatalogService, vanStockService: IVanStockService) {
        super(labelService, eventAggregator, dialogService);
        this._eventAggregator = eventAggregator;
        this.isExpanded = false;
        this._engineerService = engineerService;
        this._storageService = storageService;
        this._catalogService = catalogService;
        this._vanStockService = vanStockService;
    }

    public attachedAsync() : Promise<void> {
        this._subscription = this._eventAggregator.subscribe(UserPreferenceConstants.USER_PREFERENCES_CHANGED, () => this.load());
        return this.load();
    }

    public detachedAsync(): Promise<void> {
        if (this._subscription) {
            this._subscription.dispose();
        }
        return Promise.resolve();
    }

    public async load() : Promise<void> {
        let [engineer, userPatch, workingSector, regionId] = await Promise.all([
            this._engineerService.getCurrentEngineer(),
            this._storageService.getUserPatch(),
            this._storageService.getWorkingSector(),
            this._storageService.getUserRegion()
        ]);

        this.name = engineer.firstName + " " + engineer.lastName;
        this.payrollId = engineer.id;
        this.lanId = engineer.lanId;
        this.phoneNumber = engineer.phoneNumber;
        this.roles = engineer && engineer.roles ? engineer.roles.join(", ") : "";

        this.patch = userPatch;

        let workingSectors = this._vanStockService.getSectors();
        let wa = workingSectors.find((sector) => sector.sectorCode === workingSector);
        if (wa) {
            this.workingArea = wa.sectorDescription;
        }

        let region = await this._catalogService.getRegion(regionId);
        this.region = region ? region.description : "";
    }
}
