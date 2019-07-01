import { inject } from "aurelia-framework";
import { BaseViewModel } from "../../models/baseViewModel";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { LabelService } from "../../../business/services/labelService";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { IVanStockService } from "../../../business/services/interfaces/IVanStockService";
import { VanStockService, STOCK_REFERENCE_ID_REGEX } from "../../../business/services/vanStockService";
import { Material } from "../../../business/models/material";
import { MaterialRequest } from "../../../business/models/materialRequest";
import { VanStockConstants } from "../../../business/services/constants/vanStockConstants";
import { MaterialSearchResult } from "../../../business/models/materialSearchResult";
import { observable } from "aurelia-binding";
import { MaterialCollection } from "../../../business/models/materialCollection";
import { HvtLookup } from "./hvtLookup";
import { VanStockReservationHelper } from "./vanStockReservationHelper";
import { ConfirmDialogModel } from "../../../../common/ui/dialogs/models/confirmDialogModel";
import { ConfirmDialog } from "../../../../common/ui/dialogs/confirmDialog";
import { VanStockStatus } from "../../../business/vanStockStatus";
import { DateHelper } from "../../../../common/core/dateHelper";

@inject(LabelService, EventAggregator, DialogService, VanStockService)
export class InOutStock extends BaseViewModel {

    public returns: Material[];
    public inboundMaterials: MaterialRequest[];
    public outboundMaterials: MaterialRequest[];
    public materialCollected: MaterialCollection[];
    @observable
    public searchText: string;
    public materialSearchResult: MaterialSearchResult;
    public statusFlag: VanStockStatus;
    private _vanStockService: IVanStockService;
    private _subscription: Subscription;

    constructor(labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        vanStockService: IVanStockService) {
        super(labelService, eventAggregator, dialogService);
        this._vanStockService = vanStockService;
    }

    public async activateAsync(queryParams: any): Promise<void> {
        this.statusFlag = this._vanStockService.getBindableVanStockStatusFlag();
        await this.populateReturns();
        await this.populateInOut();
        await this.populateCollection();
        this._subscription = this._eventAggregator.subscribe(VanStockConstants.VANSTOCK_UPDATED, () => {
            this.populateReturns();
            this.populateInOut();
            this.populateCollection();
        });
        this.showContent();
        await this.trySearchViaQueryString(queryParams);
    }

    public async deactivateAsync(): Promise<void> {
        if (this._subscription) {
            this._subscription.dispose();
            this._subscription = null;
        }

        const requestIds = this.outboundMaterials.map(o => o.id);
        await this._vanStockService.registerMaterialRequestReads({requestIds});

        return Promise.resolve();
    }

    public async collect(item: MaterialRequest): Promise<void> {
        let vm: ConfirmDialogModel = new ConfirmDialogModel();
        vm.header = "Confirmation";
        vm.text = `Are you sure that your wish to collect the item ${item.stockReferenceId}?`;
        await this._dialogService.open({ viewModel: ConfirmDialog, model: vm })
            .then(async (result) => {
                if (result.wasCancelled === false) {
                    try {
                        await this._vanStockService.registerMaterialTransfer({ requestId: item.id });
                        this.showSuccess("Material Collection", "Material collected.");
                        await this.populateInOut();
                    } catch (ex) {
                        this.showError(ex);
                    }
                }
            });
    }

    public async cancelCollection(item: MaterialRequest): Promise<void> {
        let vm: ConfirmDialogModel = new ConfirmDialogModel();
        vm.header = "Confirmation";
        vm.text = `Are you sure that your wish to cancel this reservation for item ${item.stockReferenceId}?`;
        await this._dialogService.open({ viewModel: ConfirmDialog, model: vm })
            .then(async (result) => {
                if (result.wasCancelled === false) {
                    try {
                        await this._vanStockService.registerMaterialRequestWithdrawl({ requestId: item.id });
                        this.showInfo("Material Collection", "Material collection cancelled.");
                        await this.populateInOut();
                    } catch (ex) {
                        this.showError(ex);
                    }
                }
            });
    }

    public async search(): Promise<void> {
        if (this.searchText && STOCK_REFERENCE_ID_REGEX.test(this.searchText.trim())) {
            this.materialSearchResult = this._vanStockService.getBindableMaterialSearchResult(this.searchText.trim());
        }
    }

    public async view(res: MaterialSearchResult): Promise<void> {
        await VanStockReservationHelper.launchReservationDialog(
            this._dialogService,
            this._vanStockService,
            res,
            async hasAReservationBeenMade => {
                if (hasAReservationBeenMade) {
                    this.showSuccess("Material Request", "Material request sent.");
                    await this.populateInOut();
                }
                this.resetSearch();
            }
        );
    }

    public searchTextChanged(newValue: string): void {
        // clear out search result when we have one and the user starts typing again
        if (this.materialSearchResult && !STOCK_REFERENCE_ID_REGEX.test(newValue.trim())) {
            this.materialSearchResult = undefined;
        }
    }

    public async openhvt(): Promise<void> {
        const result = await this._dialogService.open({ viewModel: HvtLookup });
        if (result) {
            if (!result.wasCancelled) {
                this.searchText = result.output.materialCode;
                await this.search();
            }
        }
    }

    public getDateTime(pDate: number, pTime: number): string {
        const getDateString = DateHelper.getDateFromNumber(pDate, pTime, "YYYYMMDD", "HHmmssSS");       
        return getDateString || "";
    }

    private async populateReturns(): Promise<void> {
        this.returns = await this._vanStockService.getReturns();
    }

    private async populateInOut(): Promise<void> {
        const { inboundMaterials, outboundMaterials } = await this._vanStockService.getMaterialRequests();
        this.inboundMaterials = inboundMaterials;
        this.outboundMaterials = outboundMaterials;
    }

    private async populateCollection(): Promise<void> {
        const { collected } = await this._vanStockService.getPartsToCollect();
        this.materialCollected = collected;
    }

    private resetSearch(): void {
        this.searchText = "";
        this.materialSearchResult = undefined;
    }

    private async trySearchViaQueryString(params: any): Promise<void> {
        let searchParam: string = params && params.search;
        if (!searchParam) {
            return;
        }

        this.searchText = searchParam;
        await this.search();
        if (this.materialSearchResult
            && this.materialSearchResult.online
            && this.materialSearchResult.online.results
            && this.materialSearchResult.online.results.length) {
            await this.view(this.materialSearchResult);
        }
    }
}
