
import { inject } from "aurelia-framework";
import { DialogController, DialogService } from "aurelia-dialog";
import { ReturnVanStockItemViewModel } from "./viewModels/returnVanStockItemViewModel";
import { ConfirmDialogModel } from "../../../../common/ui/dialogs/models/confirmDialogModel";
import { ConfirmDialog } from "../../../../common/ui/dialogs/confirmDialog";
import { CatalogService } from "../../../business/services/catalogService";
import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";
import { IPartsNotUsedReason } from "../../../business/models/reference/IPartsNotUsedReason";
import { PartsHelper } from "../../../core/partsHelper";

@inject(DialogController, DialogService, CatalogService)
export class ReturnVanStockItem {
    public viewModel: ReturnVanStockItemViewModel;
    public availableReturnQuantity: number;
    public minReturnQuantity: number;
    public controller: DialogController;
    public materialReturnReasonsCatalog: IPartsNotUsedReason[];

    private _dialogService: DialogService;
    private _catalogService: ICatalogService;

    constructor(dialogController: DialogController,
        dialogService: DialogService,
        catalogService: ICatalogService) {
        this.minReturnQuantity = 1;
        this.controller = dialogController;
        this._dialogService = dialogService;
        this._catalogService = catalogService;
        if (this.controller) {
            this.controller.settings.lock = true;
            this.viewModel = this.controller.settings.model;
        }
    }

    public async attached(): Promise<void> {
        const allReasons = await this._catalogService.getPartsNotUsedReasons();
        this.materialReturnReasonsCatalog = PartsHelper.filterPartsNotUsedReasonsForAssetTracking(allReasons);
        this.populateModel();
    }

    public submit(): Promise<void> {
        let vm: ConfirmDialogModel = new ConfirmDialogModel();
        vm.header = "Confirmation";
        vm.text = `Are you sure that your wish to return ${this.viewModel.material.stockReferenceId}?`;
        this._dialogService.open({ viewModel: ConfirmDialog, model: vm }).then((result) => {
            if (result.wasCancelled === false) {
                this.controller.ok(this.viewModel);
            }
        });
        return Promise.resolve();
    }

    private populateModel(): void {
        if (!this.viewModel.quantityToReturn) {
            this.viewModel.quantityToReturn = this.minReturnQuantity;
        }
        if (this.viewModel.material) {
            if (this.viewModel.material.quantity - this.viewModel.material.quantityToBeReturned > 0) {
                this.availableReturnQuantity = this.viewModel.material.quantity - this.viewModel.material.quantityToBeReturned;
            } else {
                this.availableReturnQuantity = this.viewModel.material.quantity;
            }
        } else {
            this.availableReturnQuantity = 0;
        }
        if (!this.viewModel.returnReason) {
            this.viewModel.returnReason = this.materialReturnReasonsCatalog[0].partsNotUsedReasonDescription;
        }
    }
}
