import { inject } from "aurelia-dependency-injection";
import { StorageService } from "../../../../business/services/storageService";
import { IStorageService } from "../../../../business/services/interfaces/IStorageService";
import { ValidatableViewModel } from "../../../models/validatableViewModel";
import { ILabelService } from "../../../../business/services/interfaces/ILabelService";
import { LabelService } from "../../../../business/services/labelService";
import { IValidationService } from "../../../../business/services/interfaces/IValidationService";
import { ValidationService } from "../../../../business/services/validationService";
import { VanStockService } from "../../../../business/services/vanStockService";

import { IVanStockService } from "../../../../business/services/interfaces/IVanStockService";
import { VanStockSector } from "../../../../business/models/vanStockSector";
import { VanStockPatchListItem } from "../../../../business/models/vanStockPatchListItem";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { observable } from "aurelia-binding";
import { IRegion } from "../../../../business/models/reference/IRegion";
import { ICatalogService } from "../../../../business/services/interfaces/ICatalogService";
import { CatalogService } from "../../../../business/services/catalogService";
import { ChargeServiceConstants } from "../../../../business/services/constants/chargeServiceConstants";
import { IJobService } from "../../../../business/services/interfaces/IJobService";
import { JobService } from "../../../../business/services/jobService";
import { UserPreferenceConstants } from "../../../../business/services/constants/userPreferenceConstants";

@inject(LabelService, EventAggregator, DialogService, ValidationService, VanStockService, StorageService, CatalogService, JobService)
export class UserPreferences extends ValidatableViewModel {
    public workingSectors: VanStockSector[];
    public patchList: VanStockPatchListItem[];
    public regionList: IRegion[];
    public isLoaded: boolean;

    @observable
    public selectedPatch: string;
    @observable
    public selectedWorkingSector: string;
    @observable
    public selectedRegion: string;

    private _vanStockService: IVanStockService;
    private _storageService: IStorageService;
    private _catalogService: ICatalogService;
    private _jobService: IJobService;

    constructor(
        labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        validationService: IValidationService,
        vanStockService: IVanStockService,
        storageService: IStorageService,
        catalogService: ICatalogService,
        jobService: IJobService) {

        super(labelService, eventAggregator, dialogService, validationService);
        this._vanStockService = vanStockService;
        this._storageService = storageService;
        this._catalogService = catalogService;
        this._jobService = jobService;
    }

    public async attachedAsync(): Promise<any> {
        this.workingSectors = this._vanStockService.getSectors();
        await this.loadAvailableRegions();
        await this.load();
        await this.buildValidation();
        await this.validationManual();

        // due to dropDown.ts issues, we only want to add the dropdown to the dom once the
        // values list has been loaded (hence its attached event will fire only once it has values)
        // on first load after install, selectedWorkingSector will be undefined,
        //  and we will not have a selectedWorkingSectorChanged event...
        if (this.selectedWorkingSector === undefined) {
            // patchList will be loaded when working sector is set, but the current dropDown throws if we enter and leave without
            //  the value list being set
            this.patchList = [];
            this.isLoaded = true;
        }
    }

    public async detachedAsync() : Promise<void> {
       await this.save();
    }

    public async selectedWorkingSectorChanged(): Promise<void> {
        await this.reloadPatches(this.selectedWorkingSector);

        if (!this.patchList.some(item => item.patchCode === this.selectedPatch)) {
            this.selectedPatch = undefined;
        }
        // after first load, we need to wait until patchList has been loaded before showing,
        //  hence wait for workingSector changed to finish its business before showing
        this.isLoaded = true;

        await this.saveIfComplete();
    }

    public selectedPatchChanged(): Promise<void> {
        return this.saveIfComplete();
    }

    public selectedRegionChanged(): Promise<void> {
        return this.saveIfComplete();
    }

    private async saveIfComplete(): Promise<void> {
        if (this.selectedWorkingSector && this.selectedPatch && this.selectedRegion) {
            await this.save();
        }
    }

    private async load(): Promise<void> {
        let [sector, patch, region] = await Promise.all([
                this._storageService.getWorkingSector(),
                this._storageService.getUserPatch(),
                this._storageService.getUserRegion()
        ]);
        this.selectedPatch = patch;
        this.selectedRegion = region;
        this.selectedWorkingSector = sector;
    }

    private async save(): Promise<void> {
        await Promise.all([
            this._storageService.setWorkingSector(this.selectedWorkingSector),
            this._storageService.setUserPatch(this.selectedPatch),
            this._storageService.setUserRegion(this.selectedRegion)
        ]);

        this._eventAggregator.publish(ChargeServiceConstants.CHARGE_UPDATE_START, await this._jobService.getActiveJobId());

        this._eventAggregator.publish(UserPreferenceConstants.USER_PREFERENCES_CHANGED, {
            engineerType: this.selectedWorkingSector,
            engineerPatch: this.selectedPatch,
            engineerRegion: this.selectedRegion
        });
    }

    private async loadAvailableRegions(): Promise<void> {
        let regionList = await this._catalogService.getRegions();
        this.regionList = regionList
            .map(item => <IRegion>{ key: item.key, description: `${item.key} - ${item.description}`})
            .sort((a, b) => +a.key - +b.key);
    }

    private async reloadPatches(sector: string): Promise<void> {
        let patchList = await this._vanStockService.getPatchCodes(sector);
        this.patchList = patchList
                            .sort((a, b) => a.patchCode > b.patchCode ? 1 : a.patchCode < b.patchCode ? -1 : 0);
    }
}
