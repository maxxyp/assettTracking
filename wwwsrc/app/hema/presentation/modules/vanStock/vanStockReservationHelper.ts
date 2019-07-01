import { TransferVanStockItemViewModel } from "./viewModels/transferVanStockItemViewModel";
import { MaterialSearchResult } from "../../../business/models/materialSearchResult";
import { TransferVanStock } from "./transferVanStock";
import { DialogService } from "aurelia-dialog";
import { IVanStockService } from "../../../business/services/interfaces/IVanStockService";

export class VanStockReservationHelper {

    public static async launchReservationDialog(
            dialogService: DialogService,
            vanStockService: IVanStockService,
            materialSearchResult: MaterialSearchResult,
            onComplete: (hasAResevationBeenMade: boolean) => Promise<void>
        ): Promise<void> {

        if (!materialSearchResult || !materialSearchResult.online) {
            return;
        }

        let summary = `${materialSearchResult.stockReferenceId}
                        - ${materialSearchResult.online.summary.totalParts}
                        part${materialSearchResult.online.summary.totalParts > 1 ? "s" : ""}
                        available nearby`;

        let materials: TransferVanStockItemViewModel[] = [];

        materialSearchResult.online.results.forEach(async r => {
            let material = new TransferVanStockItemViewModel();
            material.engineerId = r.id;
            material.engineerName = r.name;
            material.engineerPhone = r.phone;
            material.distanceInMiles = r.distance;
            material.quantityRequested = 0;
            material.lat = r.lat;
            material.lon = r.lon;
            if (r.material) {
                material.availableQuantity = r.material.quantity;
            }
            if (r.material.reservationQuantity) {
                material.reservationQuantity = r.material.reservationQuantity;
            }
            material.owner = r.material.owner;
            materials.push(material);
        });

        const result = await dialogService.open({ viewModel: TransferVanStock, model: materials, summary: summary });
        if (result && !result.wasCancelled) {
            const transfer: TransferVanStockItemViewModel[] = result.output as TransferVanStockItemViewModel[];
            const promise: Promise<any>[] = [];
            transfer.forEach(m => {
                if (m.quantityRequested > 0) {
                    promise.push(vanStockService.registerMaterialRequest({
                        stockReferenceId: materialSearchResult.stockReferenceId,
                        description: materialSearchResult.description,
                        quantityRequested: m.quantityRequested,
                        engineerId: m.engineerId,
                        engineerName: m.engineerName,
                        engineerPhone: m.engineerPhone,
                        owner: m.owner
                    }));
                }
            });
            await Promise.all(promise);
            await onComplete(!!promise.length);
        }
    }
}
