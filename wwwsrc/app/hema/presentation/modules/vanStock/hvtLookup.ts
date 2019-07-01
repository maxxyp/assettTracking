
import { inject, observable } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";
import { VanStockService } from "../../../business/services/vanStockService";
import { IVanStockService } from "../../../business/services/interfaces/IVanStockService";
import { MaterialHighValueTool } from "../../../business/models/materialHighValueTool";
import { VanStockServiceConstants } from "../../../business/services/constants/vanStockServiceConstants";

@inject(DialogController, VanStockService)
export class HvtLookup {
    public material: MaterialHighValueTool[];
    public controller: DialogController;
    @observable
    public searchText: string;    
    public hideLoadMore: boolean;

    private _vanStockService: IVanStockService;
    private _currentCount: number;
    private readonly _pageSize: number;

    constructor(dialogController: DialogController,
        vanStockService: IVanStockService) {
        this.controller = dialogController;
        this._vanStockService = vanStockService;
        this._pageSize = 1000;        
        this._currentCount = this._pageSize;
        this.hideLoadMore = false;        
        if (this.controller) {
            this.controller.settings.lock = true;
            this.material = this.controller.settings.model;
        }
    }

    public async attached(): Promise<void> {
        const material = await this._vanStockService.getHighValueToolList(this._currentCount, this.searchText);
        if (material) {
            this.material = material;
            this.showHideLoadMore(this.searchText);
        }
    }

    public async loadMore(): Promise<void> {
        this._currentCount = this._currentCount + this._pageSize;
        this.material = await this._vanStockService.getHighValueToolList(this._currentCount, this.searchText);
        this.showHideLoadMore(this.searchText);
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
            this.material = await this._vanStockService.getHighValueToolList(this._currentCount, newValue);
            this.showHideLoadMore(newValue);
        }
        return;
    }    

    private searchAutoCorrect(newValue: string, oldValue: string): boolean {
        if (newValue && (newValue.length === 1 && newValue === "@")) {
            this.searchText = VanStockServiceConstants.AREA_SEARCH_PREFIX;
            return false;
        }
        return true;
    }
    
    private async showHideLoadMore(searchText: string): Promise<void> {
        const totalVanStockCount = await this._vanStockService.getHighValueToolTotal(searchText);
        this.hideLoadMore = totalVanStockCount === this.material.length;        
    }
}
