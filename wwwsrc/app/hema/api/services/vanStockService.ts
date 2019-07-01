/// <reference path="../../../../typings/app.d.ts" />

import { inject } from "aurelia-framework";
import { VanStockServiceConstants } from "./constants/vanStockServiceConstants";
import { AssetService } from "../../../common/core/services/assetService";
import { IAssetService } from "../../../common/core/services/IAssetService";
import { IVanStockService } from "./interfaces/IVanStockService";
import { IVanStockPatch } from "../models/vanStock/IVanStockPatch";
import { ApiException } from "../../../common/resilience/apiException";
import { IVanStockPatchListItem } from "../models/vanStock/IVanStockPatchListItem";
import { IMaterial } from "../models/vanStock/IMaterial";
import { ResilientService } from "../../../common/resilience/services/resilientService";
import { ConfigurationService } from "../../../common/core/services/configurationService";
import { StorageService } from "../../business/services/storageService";
import { EventAggregator } from "aurelia-event-aggregator";
import { ResilientHttpClientFactory } from "../../../common/resilience/services/resilientHttpClientFactory";
import { WuaNetworkDiagnostics } from "../../../common/core/wuaNetworkDiagnostics";
import { IConfigurationService } from "../../../common/core/services/IConfigurationService";
import { IStorageService } from "../../business/services/interfaces/IStorageService";
import { IHttpHeaderProvider } from "../../../common/resilience/services/interfaces/IHttpHeaderProvider";
import { IOnlineMaterialSearchResult } from "../models/vanStock/IOnlineMaterialSearchResult";
import { IMaterialActions } from "../models/vanStock/IMaterialActions";
import { VanStockHeaderProvider } from "./vanStockHeaderProvider";
// import { IMaterials } from "../models/vanStock/IMaterials";
import { IMaterialHighValueTool } from "../models/vanStock/IMaterialHighValueTool";
// import { IMaterialHighValueTools } from "../models/vanStock/IMaterialHighValueTools";
import { IMaterialZoneUpdateRequest } from "../models/vanStock/IMaterialZoneUpdateRequest";
import { IMaterialReceiptRequest } from "../models/vanStock/IMaterialReceiptRequest";
import { IMaterialReturnRequest } from "../models/vanStock/IMaterialReturnRequest";
import { IMaterialRequestRequest } from "../models/vanStock/IMaterialRequestRequest";
import { IMaterialTransferRequest } from "../models/vanStock/IMaterialTransferRequest";
import { IMaterialConsumptionRequest } from "../models/vanStock/IMaterialConsumptionRequest";

@inject(AssetService, ConfigurationService, StorageService, EventAggregator, VanStockHeaderProvider, ResilientHttpClientFactory, WuaNetworkDiagnostics)
export class VanStockService extends ResilientService implements IVanStockService {
    private _assetService: IAssetService;

    constructor(assetService: IAssetService, configurationService: IConfigurationService, storageService: IStorageService,
        eventAggregator: EventAggregator, headerProvider: IHttpHeaderProvider, resilientClientFactory: ResilientHttpClientFactory,
        wuaNetworkDiagnostics: WuaNetworkDiagnostics) {
        super(configurationService, "assetTrackingEndpoint", storageService, eventAggregator, headerProvider, resilientClientFactory, wuaNetworkDiagnostics);
        this._assetService = assetService;
    }

    public async getVanstockPatch(patchCode: string, sector: String): Promise<IVanStockPatch> {
        try {
            return this._assetService.loadJson<IVanStockPatch>(`${VanStockServiceConstants.PATCH_VANSTOCK_ENDPOINT}/${sector}/${patchCode}.json`);
        } catch (error) {
            throw new ApiException(this, "getVanstockPatch", error, undefined, undefined, undefined);
        }
    }

    public getVanstockPatchCodes(sector: string): Promise<IVanStockPatchListItem[]> {
        try {
            return this._assetService.loadJson<IVanStockPatchListItem[]>(`${VanStockServiceConstants.PATCH_VANSTOCK_ENDPOINT}/${sector}/patch_list.json`);
        } catch (error) {
            throw new ApiException(this, "getVanstockPatchCodes", error, undefined, undefined, undefined);
        }
    }

    public async getEngineerMaterials(engineerId: string): Promise<IMaterial[]> {
        const response = await this.getData<IMaterial[]>("materials", {"engineerId": engineerId});
        return response || []; // make sure no nulls or undefined go back
    }

    public async getHighValueTools(): Promise<IMaterialHighValueTool[]> {
        const response = await this.getData<IMaterialHighValueTool[]>("highvaluetools", null);
        return response || []; // make sure no nulls or undefined go back
    }

    public async getEngineerActions(engineerId: string): Promise<IMaterialActions> {
        return (await this.getData<IMaterialActions>("actions", {"engineerId": engineerId}, true))
                || <IMaterialActions>{
                    dispatchedMaterials: [],
                    reservedMaterials: [],
                    transferredMaterials: []
                }; // make sure no null or undefined package goes back
    }

    public async getRemoteMaterialSearch(stockReferenceId: string): Promise<{isInternectConnected: boolean, results: IOnlineMaterialSearchResult[]}> {
        try {
            if (this.isInternetConnected()) {
                let results = await this.getData<IOnlineMaterialSearchResult[]>("search", {materialCode: stockReferenceId}, true);
                return { isInternectConnected: true, results: results || [] }; // make sure no nulls or undefined go back
            } else {
                return { isInternectConnected: false, results: []};
            }
        } catch (error) {
            if (error instanceof ApiException) {
                const apiException = error as ApiException;
                if (apiException.httpStatusCode && apiException.httpStatusCode[0] === "4" /* any 400, 404 etc codes */) {
                    return { isInternectConnected: true, results: [] };
                }
            }
            throw new ApiException(this, "onlineMaterialSearch", error, undefined, undefined, undefined);
        }
    }

    public async sendMaterialZoneUpdate(materialCode: string, data: IMaterialZoneUpdateRequest): Promise<void> {
        return this.putDataResilient(
            "zone",
            { materialCode },
            data
        );
    }

    public async sendMaterialReceipt(materialCode: string, data: IMaterialReceiptRequest): Promise<void> {
        return this.postDataResilient(
            "receipt",
            { materialCode },
            data
        );
    }

    public async sendMaterialReturn(materialCode: string, data: IMaterialReturnRequest): Promise<void> {
        return this.postDataResilient(
            "return",
            { materialCode },
            data
        );
    }

    public async sendMaterialRequest(materialCode: string, data: IMaterialRequestRequest): Promise<void> {
        return this.postDataResilient(
            "reservation",
            { materialCode },
            data
        );
    }

    public async sendMaterialRequestUpdate(materialCode: string, data: IMaterialRequestRequest): Promise<void> {
        return this.putDataResilient(
            "reservation",
            { materialCode },
            data
        );
    }

    public async sendMaterialTransfer(materialCode: string, data: IMaterialTransferRequest): Promise<void> {
        return this.postDataResilient(
            "transfer",
            { materialCode },
            data
        );
    }

    public async sendMaterialConsumption(materialCode: string, data: IMaterialConsumptionRequest): Promise<void> {
        return this.postDataResilient(
            "consumption",
            { materialCode },
            data
        );
    }
}
