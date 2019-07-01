import { VanStockPatchListItem } from "../../models/vanStockPatchListItem";
import { VanStockSector } from "../../models/vanStockSector";
import { MaterialWithQuantities } from "../../models/materialWithQuantities";
import { MaterialSearchResult } from "../../models/materialSearchResult";
import { ISort } from "../../../common/models/ISort";
import { MaterialRequest } from "../../models/materialRequest";
import { Material } from "../../models/material";
import { MaterialCollection } from "../../models/materialCollection";
import { MaterialHighValueTool } from "../../models/materialHighValueTool";
import { MaterialToCollect } from "../../models/materialToCollect";
import { Guid } from "../../../../common/core/guid";
import { VanStockStatus } from "../../vanStockStatus";

export interface IVanStockService {
    getPatchCodes(sector: string): Promise<VanStockPatchListItem[]>;
    getSectors(): VanStockSector[];
    getEngineersWithPart(code: string, sector: string, gcCode: string): Promise<{name: string, phone: string}[]>;

    getHighValueToolList(currentCount: number, searchString?: string): Promise<MaterialHighValueTool[]>;
    getHighValueToolTotal(searchString?: string): Promise<number>;

    searchLocalVanStock(currentCount: number, sort?: ISort, searchString?: string): Promise<MaterialWithQuantities[]>;
    getLocalVanStockTotal(searchString?: string): Promise<number>;
    getLocalVanStockLineTotal(searchString?: string): Promise<number>;
    getLocalVanStockAreaLookup(): Promise<string[]>;

    getBindableVanStockStatusFlag(): VanStockStatus;

    getBindableMaterialSearchResult(stockReferenceId: string, forceRefresh?: boolean): MaterialSearchResult;

    getPartsToCollect(): Promise<{
        toCollect: MaterialToCollect[],
        collected: MaterialCollection[],
        expectedReturns: Material[]
    }>;
    getMaterialRequests(): Promise<{
        inboundMaterials: MaterialRequest[],
        outboundMaterials: MaterialRequest[]
    }>;
    getReturns(): Promise<Material[]>;
    registerMaterialRequestReads(arg: { requestIds: (number | Guid)[] }): Promise<void>;
    registerMaterialZoneUpdate(arg: { stockReferenceId: string, area: string }): Promise<void>;
    registerMaterialCollection ( arg: { dispatchId: number, quantityCollected: number }): Promise<void>;
    registerMaterialReturn  ( arg: { stockReferenceId: string, quantityReturned: number, reason: string, jobId?: string }): Promise<void>;
    registerMaterialRequest ( arg: {
        stockReferenceId: string,
        description: string,
        quantityRequested: number,
        engineerId: string,
        engineerName: string,
        engineerPhone: string,
        owner: string
    }): Promise<number | Guid>;
    registerMaterialRequestWithdrawl ( arg: { requestId: number | Guid }): Promise<void>;
    registerMaterialTransfer( arg: { requestId: number | Guid }): Promise<void>;
    registerMaterialConsumption( arg: { stockReferenceId: string, quantityConsumed: number, jobId?: string}): Promise<void>;
}
