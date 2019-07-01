import {computedFrom, inject, observable} from "aurelia-framework";
import {BaseViewModel} from "../../models/baseViewModel";
import {ILabelService} from "../../../business/services/interfaces/ILabelService";
import {LabelService} from "../../../business/services/labelService";
import {EventAggregator} from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";
import {MaterialWithQuantities} from "../../../business/models/materialWithQuantities";
import {IVanStockService} from "../../../business/services/interfaces/IVanStockService";
import {VanStockService} from "../../../business/services/vanStockService";
import {ISort} from "../../../common/models/ISort";
import {VanStockServiceConstants} from "../../../business/services/constants/vanStockServiceConstants";
import {UpdateVanStockItem} from "./updateVanStockItem";
import {ReturnVanStockItem} from "./returnVanStockItem";
import {UpdateVanStockItemViewModel} from "./viewModels/updateVanStockItemViewModel";
import {ReturnVanStockItemViewModel} from "./viewModels/returnVanStockItemViewModel";

@inject(LabelService, EventAggregator, DialogService, VanStockService)
export class VanStock extends BaseViewModel {

    public material: MaterialWithQuantities[];
    public hideLoadMore: boolean;
    public sort: ISort;
    @observable
    public searchText: string;
    public selectedRow: number;

    private _vanStockService: IVanStockService;
    private _currentCount: number;
    private _myVanAreas: string[];
    private readonly _pageSize: number;

    constructor(labelService: ILabelService,
                eventAggregator: EventAggregator,
                dialogService: DialogService,
                vanStockService: IVanStockService) {
        super(labelService, eventAggregator, dialogService);
        this._vanStockService = vanStockService;
        this._pageSize = 1000;
        this._currentCount = this._pageSize;
        this.sort = {} as ISort;
        this.hideLoadMore = false;
        this._myVanAreas = [];
        this.selectedRow = -1;
    }

    public async activateAsync(): Promise<void> {
        this.sort.sortBy = "stockReferenceId";
        this.sort.sortOrderAsc = true;
        await this.populate();
        this.showContent();
    }

    public async loadMore(): Promise<void> {
        this._currentCount = this._currentCount + this._pageSize;
        this.material = await this._vanStockService.searchLocalVanStock(this._currentCount, this.sort, this.searchText);
        await this.showHideLoadMore(this.searchText);
        await this.populateMyVanAreas();
        return;
    }

    public async sortVanStock(sortProperty: string): Promise<void> {
        this.sort.sortBy = sortProperty;
        this.sort.sortOrderAsc = !this.sort.sortOrderAsc;
        this.material = await this._vanStockService.searchLocalVanStock(this._currentCount, this.sort, this.searchText);
        await this.populateMyVanAreas();
        return;
    }

    public async searchTextChanged(newValue: string, oldValue: string): Promise<void> {
        if (!newValue) {
            newValue = "";
        }
        if (!oldValue) {
            oldValue = "";
        }
        newValue = newValue.trim();
        oldValue = oldValue.trim();
        if (this.searchAutoCorrect(newValue, oldValue)) {
            this.material = await this._vanStockService.searchLocalVanStock(this._currentCount, this.sort, newValue);
            await this.showHideLoadMore(newValue);
            await this.populateMyVanAreas();
        }
        return;
    }

    public async editVanStock(part: MaterialWithQuantities): Promise<void> {
        this.selectedRow = -1;
        let model: UpdateVanStockItemViewModel = {} as UpdateVanStockItemViewModel;
        model.material = part;
        model.myVanAreas = this._myVanAreas;
        const result = await this._dialogService.open({viewModel: UpdateVanStockItem, model: model});
        if (result) {
            if (!result.wasCancelled) {
                await this._vanStockService.registerMaterialZoneUpdate(result.output);
                this.showInfo("My Van Stock Update", "Van stock updated.");
            }
            await this.populate();
        }
        return;
    }

    public async returnVanStock(part: MaterialWithQuantities): Promise<void> {
        this.selectedRow = -1;
        let model: ReturnVanStockItemViewModel = {} as ReturnVanStockItemViewModel;
        model.material = part;
        const result = await this._dialogService.open({viewModel: ReturnVanStockItem, model: model});
        if (result) {
            if (!result.wasCancelled) {
                await this._vanStockService.registerMaterialReturn({
                    stockReferenceId: result.output.material.stockReferenceId,
                    quantityReturned: result.output.quantityToReturn,
                    reason: result.output.returnReason
                });
                this.showInfo("Material Return", "Material return requested.");
            }
            await this.populate();
        }
        return;
    }

    @computedFrom("selectedRow")
    public get isEditing(): boolean {
        return this.selectedRow !== -1;
    }

    public setNotEditing(): void {
        this.setEditingRow(-1);
    }

    public setEditingRow(index: number): void {
        this.selectedRow = index;
    }

    private searchAutoCorrect(newValue: string, oldValue: string): boolean {
        if (newValue && (newValue.length === 1 && newValue === "@")) {
            this.searchText = VanStockServiceConstants.AREA_SEARCH_PREFIX;
            return false;
        }
        if (newValue && (newValue.length === 1 && newValue === "#")) {
            this.searchText = VanStockServiceConstants.JOB_SEARCH_PREFIX;
            return false;
        }
        if (oldValue && newValue && newValue.length < oldValue.length) { // deleting text
            if (oldValue.trim() === VanStockServiceConstants.AREA_SEARCH_PREFIX
                || oldValue.trim() === VanStockServiceConstants.JOB_SEARCH_PREFIX) {
                this.searchText = undefined;
            }
        }
        return true;
    }

    private async populateMyVanAreas(): Promise<void> {
        this._myVanAreas = await this._vanStockService.getLocalVanStockAreaLookup();
    }

    private async populate(): Promise<void> {
        const material = await this._vanStockService.searchLocalVanStock(this._currentCount, this.sort, this.searchText);
        if (material) {
            this.material = material;
            await this.showHideLoadMore(this.searchText);
            await this.populateMyVanAreas();
        }
    }

    private async showHideLoadMore(searchText: string): Promise<void> {
        const totalVanStockCount = await this._vanStockService.getLocalVanStockLineTotal(searchText);
        this.hideLoadMore = totalVanStockCount === this.material.length;
    }

}
