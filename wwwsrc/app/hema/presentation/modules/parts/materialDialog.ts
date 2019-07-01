import { BaseViewModel } from "../../models/baseViewModel";
import { DialogController, DialogService } from "aurelia-dialog";
import { EventAggregator } from "aurelia-event-aggregator";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { LabelService } from "../../../business/services/labelService";
import { inject } from "aurelia-dependency-injection";
import { Part } from "../../../business/models/part";
import { MaterialSearchResult } from "../../../business/models/materialSearchResult";
import { MaterialDialogResult } from "./materialDialogResult";

type ViewModel =  {
    quantityOnMyVan: number;
    quantityFromVanStock: number;
    quantityToOrder: number;
};

@inject(LabelService, EventAggregator, DialogService, DialogController)
export class MaterialDialog extends BaseViewModel {
    public controller: DialogController;
    public viewModel: ViewModel;

    constructor(labelService: ILabelService, eventAggregator: EventAggregator, dialogService: DialogService, controller: DialogController) {
        super(labelService, eventAggregator, dialogService);
        this.controller = controller;
    }

    public async activateAsync(params: {
            materialSearchResult: MaterialSearchResult,
            part: Part
        }): Promise<void> {

        const { materialSearchResult, part } = params;

        this.viewModel = this.buildViewModel(materialSearchResult, part);
        this.showContent();
}

    public async ok(): Promise<void> {

        let partOrderStatus = this.viewModel.quantityToOrder
            ? "O"
            : this.viewModel.quantityFromVanStock
                ? "V"
                : "O";

        await this.controller.ok(<MaterialDialogResult> {
            quantity: this.viewModel.quantityFromVanStock || this.viewModel.quantityToOrder,
            partOrderStatus
        });
    }

    private buildViewModel(
        materialSearchResult: MaterialSearchResult,
        part: Part)
    : ViewModel {

        return {
            quantityOnMyVan: materialSearchResult.local.completionStatus === "FOUND"
                                ? materialSearchResult.local.material.quantity
                                : 0,
            quantityToOrder: part.partOrderStatus === "O"
                                ? part.quantity
                                : 0,
            quantityFromVanStock: part.partOrderStatus !== "O"
                                ? part.quantity
                                : 0
        };
    }
}
