import { LabelService } from "../../../business/services/labelService";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { inject } from "aurelia-framework";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { BaseViewModel } from "../../models/baseViewModel";
import { PartCollectionItemViewModel } from "./viewModels/partCollectionItemViewModel";
import { UpdateDialog } from "./updateDialog";
import { PartsCollectionMain } from "./partsCollectionMain";
import { EngineerServiceConstants } from "../../../business/services/constants/engineerServiceConstants";
import { EngineerService } from "../../../business/services/engineerService";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";

@inject(LabelService, EventAggregator, DialogService, EngineerService)
export class VanStockItem extends BaseViewModel {

    public part: PartCollectionItemViewModel;
    public isDone: boolean;
    public show: boolean;
    public myVanAreas: string[];

    private _engineerService: IEngineerService;

    constructor(labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        engineerService: IEngineerService) {

        super(labelService, eventAggregator, dialogService);
        this._engineerService = engineerService;
    }

    public async activateAsync(params: { part: PartCollectionItemViewModel, myVanAreas: string[] }): Promise<void> {

        this.part = params.part;
        this.myVanAreas = params.myVanAreas;
        this._eventAggregator.subscribe(EngineerServiceConstants.ENGINEER_STATUS_CHANGED, () => this.update());
        await this.update();
        return Promise.resolve();
    }

    public toggleVerified(): void {
        this.part.verified = !this.part.verified;
        this._eventAggregator.publish(PartsCollectionMain.MARK_PART_AS_VERIFIED);
    }

    public async editVanStock(): Promise<void> {

        // setup modal
        const part = { ...this.part, verified: false };
        const model = { part, myVanAreas: this.myVanAreas };

        const viewModel = UpdateDialog;

        // handle modal result
        const result = await this._dialogService.open({ viewModel, model });

        if (result.wasCancelled) {
            return;
        }

        // update part in main form
        const editedPart: PartCollectionItemViewModel = result.output;
        const areaChanged = editedPart.area !== this.part.area;
        editedPart.areaChanged = areaChanged;

        this.part = editedPart;

        this._eventAggregator.publish(PartsCollectionMain.UPDATE_PART, editedPart);

        // update zone if changed
        // const {stockReferenceId, quantityCollected, jobId, area, description, amount} = this.part;

        if (editedPart.areaChanged) {

            // const materialZoneUpdate = {
            //     stockReferenceId,
            //     jobId,
            //     description,
            //     quantity: quantityCollected,
            //     area,
            //     amount
            // };

            const exists = this.myVanAreas.some(a => a === this.part.area);

            if (exists) {
                return;
            }

            this.myVanAreas.push(this.part.area);

        }

    }

    private async update(): Promise<void> {
        const status = await this._engineerService.getStatus();
        if (status === EngineerService.OBTAINING_MATS_STATUS) {
            this.show = true;
        }
    }
}
