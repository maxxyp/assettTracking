
import { MaterialWithQuantities } from "../../models/materialWithQuantities";
import { MaterialSearchResult } from "../../models/materialSearchResult";
import { MaterialRequest } from "../../models/materialRequest";
import { Material } from "../../models/material";
import { MaterialCollection } from "../../models/materialCollection";
import { MaterialHighValueTool } from "../../models/materialHighValueTool";
import { MaterialToCollect } from "../../models/materialToCollect";
import { Guid } from "../../../../common/core/guid";
import { VanStockStatus } from "../../vanStockStatus";

export interface IVanStockEngine {
    initialise(engineerId: string): Promise<void>;
    getBindableVanStockStatusFlag(): VanStockStatus;

    getHighValueToolList(): Promise<MaterialHighValueTool[]>;
    getLocalMaterial(): MaterialWithQuantities[];
    getBindableMaterialSearchResult(stockReferenceId: string, forceOnlineRefresh?: boolean): MaterialSearchResult;

    getPartsToCollect(): Promise<{toCollect: MaterialToCollect[], collected: MaterialCollection[], expectedReturns: Material[]}>;
    getMaterialRequests(): Promise<{
        inboundMaterials: MaterialRequest[],
        outboundMaterials: MaterialRequest[]
    }>;
    getReturns(): Promise<Material[]>;
    registerMaterialRequestReads(arg: { requestIds: (number | Guid)[] }): Promise<void>;
    registerMaterialZoneUpdate(arg: { stockReferenceId: string, area: string }): Promise<void>;
    registerMaterialCollection ( arg: { dispatchId: number, quantityCollected: number }): Promise<void>;
    registerMaterialReturn  ( arg: { stockReferenceId: string, quantityReturned: number, reason: string, jobId?: string }): Promise<void>;
    registerMaterialConsumption( arg: { stockReferenceId: string, quantityConsumed: number, jobId?: string}): Promise<void>;

    registerMaterialRequest ( arg: {
        stockReferenceId: string,
        description: string,
        quantityRequested: number,
        engineerId: string,
        engineerName: string,
        engineerPhone: string,
        owner: string }
        ): Promise<number | Guid>;
    registerMaterialRequestWithdrawl ( arg: { requestId: number | Guid }): Promise<void>;
    registerMaterialTransfer( arg: { requestId: number | Guid }): Promise<void>;
}
