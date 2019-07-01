import {DialogResult, DialogService} from "aurelia-dialog";
import {EventAggregator} from "aurelia-event-aggregator";
import {LabelService} from "../../../business/services/labelService";
import {BaseViewModel} from "../../models/baseViewModel";
import {inject} from "aurelia-framework";
import {ILabelService} from "../../../business/services/interfaces/ILabelService";
import {BusinessException} from "../../../business/models/businessException";
import {PartsCollectionViewModel} from "./viewModels/partsCollectionViewModel";
import {IVanStockService} from "../../../business/services/interfaces/IVanStockService";
import {VanStockService} from "../../../business/services/vanStockService";
import {PartCollectionItemViewModel} from "./viewModels/partCollectionItemViewModel";
import {Router} from "aurelia-router";
import {ConfirmDialog} from "./confirmDialog";
import {EngineerService} from "../../../business/services/engineerService";
import {IEngineerService} from "../../../business/services/interfaces/IEngineerService";
import {WorkRetrievalTracker} from "../../../business/services/workRetrievalTracker";
import { MaterialToCollect } from "../../../business/models/materialToCollect";
import { Material } from "../../../business/models/material";
import { EngineerServiceConstants } from "../../../business/services/constants/engineerServiceConstants";

@inject(LabelService, EventAggregator, DialogService, VanStockService, EngineerService, WorkRetrievalTracker, Router)
export class PartsCollectionMain extends BaseViewModel {

    public static MARK_PART_AS_VERIFIED: string = "MARK_PART_AS_VERIFIED";
    public static UPDATE_PART: string = "UPDATE_PART";

    public viewModel: PartsCollectionViewModel;
    public allPartsVerified: boolean;
    public headerTitle: { partNo: number; partWord: string; };
    public myVanAreas: string [];
    public tracker: WorkRetrievalTracker;
    public show: boolean;
    private _vanStockService: IVanStockService;
    private _engineerService: IEngineerService;

    private _router: Router;

    constructor(labelService: ILabelService,
                eventAggregator: EventAggregator,
                dialogService: DialogService,
                vanStockService: IVanStockService,
                engineerService: EngineerService,
                tracker: WorkRetrievalTracker,
                router: Router) {

        super(labelService, eventAggregator, dialogService);

        this._vanStockService = vanStockService;
        this._engineerService = engineerService;

        this.tracker = tracker;

        this._router = router;

        this.allPartsVerified = false;

        eventAggregator.subscribe(PartsCollectionMain.MARK_PART_AS_VERIFIED, () => {
            this.checkPartsVerified();
        });

        eventAggregator.subscribe(PartsCollectionMain.UPDATE_PART, (part: PartCollectionItemViewModel) => {
            this.updatePart(part);
        });

        this._eventAggregator.subscribe(EngineerServiceConstants.ENGINEER_STATUS_CHANGED, () => this.update());
    }

    public async activateAsync(): Promise<void> {
        try {
            // data lookups
            const materials = (await this._vanStockService.getPartsToCollect());

            const zones = await this._vanStockService.getLocalVanStockAreaLookup();

            if (!zones) {
                this.myVanAreas = [];
            } else {
                this.myVanAreas = zones;
            }

            // map business to vm for materials
            this.viewModel = this.mapMaterialsBusinessViewModel(materials.toCollect, materials.expectedReturns);

            // set variables required for text
            this.headerTitle = this.constructHeaderTitle(this.viewModel.parts, this.viewModel.expectedReturns);

            // if to show submit button based on engineer status
            this.update();

            // this.setupObservables();
            this.showContent();

            return Promise.resolve();
        } catch (e) {
            this.showError(new BusinessException(this, "PartsCollectionDetails", "Error while loading parts details", [], e));
            return Promise.resolve();
        }
    }

    public async confirmParts(): Promise<void> {

        const result = await this.confirmDialog();

        if (result.wasCancelled) {
            return;
        }

        const setupRegisterMaterialCollectionCalls = (parts: PartCollectionItemViewModel []): Promise<void> [] => {

            let calls: Promise<void> [] = [];

            parts.forEach(part => {

                const {quantityCollected, id} = part;

                calls.push(this._vanStockService.registerMaterialCollection({quantityCollected, dispatchId: id}));
            });

            return calls;
        };
        const setupPartUpdateCalls = (parts: PartCollectionItemViewModel []): Promise<void> [] => {

            let calls: Promise<void> [] = [];

            parts.forEach(part => {

                const {stockReferenceId, description, amount, quantityCollected, jobId, area} = part;

                if (part.areaChanged) {
                    const materialZoneUpdate = {
                        stockReferenceId,
                        jobId,
                        description,
                        quantity: quantityCollected,
                        area,
                        amount
                    };
                    calls.push(this._vanStockService.registerMaterialZoneUpdate(materialZoneUpdate));
                }
            });

            return calls;
        };

        const regCalls = setupRegisterMaterialCollectionCalls(this.viewModel.parts);
        const updatePartCalls = setupPartUpdateCalls(this.viewModel.parts);

        // order important, make sure materials are registered before updates
        await Promise.all(regCalls);
        await Promise.all(updatePartCalls);

        await this.setPartsCollected();
    }

    public async setCollectingParts(): Promise<void> {
        this._engineerService.isPartCollectionInProgress = true;
        await this._engineerService.setStatus(EngineerService.OBTAINING_MATS_STATUS);
    }

    private confirmDialog(): Promise<DialogResult> {

        // setup modal
        const collected = this.viewModel.parts.map(p => p.quantityCollected).reduce((a, b) => a + b);
        const expected = this.viewModel.parts.map(p => p.quantityExpected).reduce((a, b) => a + b);

        const model = {expected, collected};
        const viewModel = ConfirmDialog;

        // handle modal result
        return this._dialogService.open({viewModel, model});
    }

    private mapMaterialsBusinessViewModel(materials: MaterialToCollect [], returns: Material[]): PartsCollectionViewModel {

        const viewModel = new PartsCollectionViewModel();

        const mapMaterialItemToViewModel = (m: MaterialToCollect) => {

            const item = new PartCollectionItemViewModel();
            item.id = m.id;
            item.description = m.description;

            item.quantityExpected = m.quantity;
            item.quantityCollected = m.quantity;

            item.area = m.area;
            item.stockReferenceId = m.stockReferenceId;
            item.jobId = m.jobId;
            item.amount = 9999;
            item.verified = false;

            return item;
        };

        viewModel.parts = materials.map((m) => mapMaterialItemToViewModel(m));

        viewModel.expectedReturns = returns;
        return viewModel;
    }

    private constructHeaderTitle(parts: PartCollectionItemViewModel [], returns: Material[]): { partNo: number, partWord: string, returnNo: number, returnWord: string } {
        const partNo = (parts || [])
                        .map(p => p.quantityExpected || 0)
                        .reduce((a, b) => a + b, 0);

        const partWord = `item${partNo > 1 ? "s" : ""}`;
        const returnNo = (returns || [])
                        .map(r => r.quantity || 0)
                        .reduce((a, b) => a + b, 0);

        const returnWord = `item${returnNo > 1 ? "s" : ""}`;
        return {
            partNo,
            partWord,
            returnNo,
            returnWord
        };
    }

    private async setPartsCollected(): Promise<void> {
        this._engineerService.isPartCollectionInProgress = false;
        // set the engineerstatus back to Working status
        await this._engineerService.setStatus(undefined);
        this._router.navigateToRoute("to-do");
    }

    //#region event subscriptions
    private checkPartsVerified(): void {
        this.allPartsVerified = this.viewModel.parts.map(p => p.verified).reduce((a, b) => a && b);
    }

    private updatePart(newPart: PartCollectionItemViewModel): void {
        const foundIndex = this.viewModel.parts.findIndex(part => part.id === newPart.id);
        this.viewModel.parts.splice(foundIndex, 1, newPart);
        this.allPartsVerified = false;
    }

    //#endregion

    private async update(): Promise<void> {
        const status = await this._engineerService.getStatus();
        if (status === EngineerService.OBTAINING_MATS_STATUS) {
            this.show = true;
        }
    }    

}
