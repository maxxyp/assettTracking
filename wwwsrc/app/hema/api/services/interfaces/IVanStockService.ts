/// <reference path="../../../../../typings/app.d.ts" />

import {IVanStockPatch} from "../../models/vanStock/IVanStockPatch";
import {IVanStockPatchListItem} from "../../models/vanStock/IVanStockPatchListItem";
import { IMaterial } from "../../models/vanStock/IMaterial";
import { IOnlineMaterialSearchResult } from "../../models/vanStock/IOnlineMaterialSearchResult";
import { IMaterialActions } from "../../models/vanStock/IMaterialActions";
import { IMaterialHighValueTool } from "../../models/vanStock/IMaterialHighValueTool";
import { IMaterialZoneUpdateRequest } from "../../models/vanStock/IMaterialZoneUpdateRequest";
import { IMaterialReceiptRequest } from "../../models/vanStock/IMaterialReceiptRequest";
import { IMaterialReturnRequest } from "../../models/vanStock/IMaterialReturnRequest";
import { IMaterialRequestRequest } from "../../models/vanStock/IMaterialRequestRequest";
import { IMaterialTransferRequest } from "../../models/vanStock/IMaterialTransferRequest";
import { IMaterialConsumptionRequest } from "../../models/vanStock/IMaterialConsumptionRequest";

export interface IVanStockService {
    getVanstockPatch(patchCode: string, sector: String): Promise<IVanStockPatch>;
    getVanstockPatchCodes(sector: String): Promise<IVanStockPatchListItem[]>;

    getHighValueTools(): Promise<IMaterialHighValueTool[]>;
    getEngineerMaterials(engineerId: string): Promise<IMaterial[]>;
    getEngineerActions(engineerId: string): Promise<IMaterialActions>;
    getRemoteMaterialSearch(stockReferenceId: string): Promise<{isInternectConnected: boolean, results: IOnlineMaterialSearchResult[]}>;

    sendMaterialZoneUpdate(materialCode: string, data: IMaterialZoneUpdateRequest): Promise<void>;
    sendMaterialReceipt(materialCode: string, data: IMaterialReceiptRequest): Promise<void>;
    sendMaterialReturn(materialCode: string, data: IMaterialReturnRequest): Promise<void>;
    sendMaterialRequest(materialCode: string, data: IMaterialRequestRequest): Promise<void>;
    sendMaterialRequestUpdate(materialCode: string, data: IMaterialRequestRequest): Promise<void>;
    sendMaterialTransfer(materialCode: string, data: IMaterialTransferRequest): Promise<void>;
    sendMaterialConsumption(materialCode: string, data: IMaterialConsumptionRequest): Promise<void>;
}
