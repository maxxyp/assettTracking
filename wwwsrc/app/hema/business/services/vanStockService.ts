/// <reference path="../../../../typings/app.d.ts" />
import { inject } from "aurelia-framework";
import { IVanStockPatchFactory } from "../factories/interfaces/IVanStockPatchFactory";
import { VanStockPatchFactory } from "../factories/vanStockPatchFactory";
import { VanStockPatchListItem } from "../models/vanStockPatchListItem";
import { VanStockSector } from "../models/vanStockSector";
import { VanStockService as ApiVanStockService } from "../../api/services/vanStockService";
import { IVanStockService as IApiVanStockService } from "../../api/services/interfaces/IVanStockService";
import { IVanStockService as IBusinessVanStockService } from "./interfaces/IVanStockService";
import { VanStockPatch } from "../models/vanStockPatch";
import * as Logging from "aurelia-logging";
import { MaterialWithQuantities } from "../models/materialWithQuantities";
import { MaterialSearchResult } from "../models/materialSearchResult";
import { ISort } from "../../common/models/ISort";
import { VanStockServiceConstants } from "./constants/vanStockServiceConstants";
import { VanStockEngine } from "./vanStockEngine";
import { IVanStockEngine } from "./interfaces/IVanStockEngine";
import { MaterialRequest } from "../models/materialRequest";
import { Material } from "../models/material";
import { MaterialCollection } from "../models/materialCollection";
import { MaterialHighValueTool } from "../models/materialHighValueTool";
import { MaterialToCollect } from "../models/materialToCollect";
import { Guid } from "../../../common/core/guid";
import { VanStockStatus } from "../vanStockStatus";

export const STOCK_REFERENCE_ID_REGEX = /^[a-z0-9]{6}$/i;
const AREA_REG_EX = /^@Area:(?:[a-z0-9]?)/i;
const JOB_REG_EX = /^#Job:(?:[0-9]?)/i;

// there is a function in side arrayHelper.ts which has a know  bug
// that function can not deal with arrays with undefined values.
// as the arrayhelper function is used in existing code elsewhere in the app
// its been decided to use this just for van stock.
const sortByColumnName = (columnSort: ISort) => (a: any, b: any): number => {
    let aValue = a[columnSort.sortBy] || " "; // becouse for the undefined values the sorting does not behave
    let bValue = b[columnSort.sortBy] || " ";
    if (aValue.length > 1) {
        aValue = aValue.trim();
    }

    if (bValue.length > 1) {
        bValue = bValue.trim();
    }

    if (!aValue && !bValue) {
        return 0;
    } else if (aValue && !bValue) {
        return -1;
    } else if (!aValue && bValue) {
        return 1;
    } else {
        const value1 = aValue.toString().toUpperCase(); // ignore upper and lowercase
        const value2 = bValue.toString().toUpperCase(); // ignore upper and lowercase
        if (value1 < value2) {
            return columnSort.sortOrderAsc ? -1 : 1;
        } else if (value1 > value2) {
            return columnSort.sortOrderAsc ? 1 : -1;
        } else {
            return 0;
        }
    }
};

@inject(ApiVanStockService, VanStockPatchFactory, VanStockEngine)
export class VanStockService implements IBusinessVanStockService {
    private _vanStockService: IApiVanStockService;
    private _vanStockPatchFactory: IVanStockPatchFactory;
    private _vanStockEngine: IVanStockEngine;
    private _patchCache: { sector: string, code: string, patch: VanStockPatch }[];
    private _logger: Logging.Logger;

    constructor(vanStockService: IApiVanStockService,
        vanStockPatchFactory: IVanStockPatchFactory,
        vanStockEngine: IVanStockEngine) {
        this._vanStockService = vanStockService;
        this._vanStockPatchFactory = vanStockPatchFactory;
        this._vanStockEngine = vanStockEngine;
        this._patchCache = [];
        this._logger = Logging.getLogger("VanStockService");
    }

    public async getPatchCodes(sector: string): Promise<VanStockPatchListItem[]> {
        let patch = await this._vanStockService.getVanstockPatchCodes(sector);
        return this._vanStockPatchFactory.createVanStockPatchListBusinessModel(patch);
    }

    public getSectors(): VanStockSector[] {
        return [
            { sectorCode: "PatchGas", sectorDescription: "Gas Services" },
            { sectorCode: "PatchES", sectorDescription: "Electrical Services" }
        ];
    }

    // todo: remove this old version stuff
    public async getEngineersWithPart(code: string, sector: string, gcCode: string): Promise<{ name: string, phone: string }[]> {
        try {
            let patchRecord = this._patchCache.find(item => item.sector === sector && item.code === code);
            if (!patchRecord) {
                let patchApiModel = await this._vanStockService.getVanstockPatch(code, sector);
                patchRecord = { sector, code, patch: (this._vanStockPatchFactory.createVanStockPatchBusinessModel(patchApiModel) || <VanStockPatch>{ engineers: [] }) };
                this._patchCache.push(patchRecord);
            }

            return patchRecord.patch.engineers
                .filter(engineer => engineer.parts.some(engineersGcCode => gcCode === engineersGcCode))
                .map(engineer => ({ name: engineer.name, phone: engineer.phone }));

        } catch (err) {
            this._logger.error("Unable to find patch data", err);
            return [];
        }
    }

    public async getHighValueToolList(currentCount: number, searchString?: string): Promise<MaterialHighValueTool[]> {
        let search = (data: MaterialHighValueTool[]): MaterialHighValueTool[] => {
            if (searchString) {
                let filteredData: MaterialHighValueTool[] = [];
                if (STOCK_REFERENCE_ID_REGEX.test(searchString)) {
                    // this is stock reference id or description
                    filteredData = data.filter((v) => {
                        return v && (v.materialCode && v.materialCode.toUpperCase().indexOf(searchString.toUpperCase()) > -1
                            || v.description && v.description.toUpperCase().indexOf(searchString.toUpperCase()) > -1);
                    });
                } else {
                    // search in all fields
                    filteredData = data.filter((v) => {
                        if (v && v.description && v.materialCode) {
                            return v.description.toUpperCase().indexOf(searchString.toUpperCase()) > -1
                                || v.materialCode.toUpperCase().indexOf(searchString.toUpperCase()) > -1;
                        } return false;
                    });
                }
                return filteredData;
            }
            return data;
        };

        let fulllist = await this._vanStockEngine.getHighValueToolList();

        return search(fulllist)
            .slice(0, currentCount);
    }

    public async getHighValueToolTotal(searchString?: string): Promise<number> {
        const list = await this.getHighValueToolList(99999, searchString);
        return list ? list.length : 0;
    }

    public async searchLocalVanStock(currentCount: number, sort?: ISort, searchString?: string): Promise<MaterialWithQuantities[]> {
        let search = (data: MaterialWithQuantities[]): MaterialWithQuantities[] => {
            if (searchString) {
                let filteredData: MaterialWithQuantities[] = [];
                if (AREA_REG_EX.test(searchString)) {
                    let areaSearchString = searchString.trim().replace(VanStockServiceConstants.AREA_SEARCH_PREFIX, "");
                    // this is area
                    filteredData = data.filter((v) => {
                        return v && v.area && v.area.toUpperCase().indexOf(areaSearchString.toUpperCase()) > -1;
                    });
                } else if (JOB_REG_EX.test(searchString)) {
                    let jobSearchString = searchString.trim().replace(VanStockServiceConstants.JOB_SEARCH_PREFIX, "");
                    // this is jobId
                    filteredData = data.filter((v) => {
                        return v && v.jobId && v.jobId.toUpperCase().indexOf(jobSearchString.toUpperCase()) > -1;
                    });
                } else if (STOCK_REFERENCE_ID_REGEX.test(searchString)) {
                    // this is stock reference id or description
                    filteredData = data.filter((v) => {
                        return v && (v.stockReferenceId && v.stockReferenceId.toUpperCase().indexOf(searchString.toUpperCase()) > -1
                            || v.description && v.description.toUpperCase().indexOf(searchString.toUpperCase()) > -1);
                    });
                } else {
                    // search in all fields
                    filteredData = data.filter((v) => {
                        if (v && v.description && v.stockReferenceId) {
                            return v.description.toUpperCase().indexOf(searchString.toUpperCase()) > -1
                                || v.stockReferenceId.toUpperCase().indexOf(searchString.toUpperCase()) > -1;
                        } return false;
                    });
                }
                return filteredData;
            }
            return data;
        };

        let fulllist = await this._vanStockEngine.getLocalMaterial();
        if (sort) {
            fulllist = fulllist.sort(sortByColumnName(sort));
        }

        return search(fulllist)
            .slice(0, currentCount);
    }

    public async getLocalVanStockTotal(searchString?: string): Promise<number> {
        const list = await this.searchLocalVanStock(99999, null, searchString);
        return list ? (list.length > 0 ? list.map(a => a.quantity).reduce((a, c) => a + c) : 0) : 0;
    }

    public async getLocalVanStockLineTotal(searchString?: string): Promise<number> {
        const list = await this.searchLocalVanStock(99999, null, searchString);
        return list ? list.length : 0;
    }

    public async getLocalVanStockAreaLookup(): Promise<string[]> {
        const materials: MaterialWithQuantities[] = await this._vanStockEngine.getLocalMaterial();
        const unique = ((value: string, index: number, self: string[]): boolean => {
            return self[index] && self.indexOf(value) === index;
        });
        return await materials.map(m => m.area).filter(unique);
    }

    public getBindableVanStockStatusFlag(): VanStockStatus {
        return this._vanStockEngine.getBindableVanStockStatusFlag();
    }

    public getBindableMaterialSearchResult(stockReferenceId: string, forceRefresh?: boolean): MaterialSearchResult {
        return this._vanStockEngine.getBindableMaterialSearchResult(stockReferenceId, forceRefresh);
    }

    public getPartsToCollect(): Promise<{ toCollect: MaterialToCollect[], collected: MaterialCollection[], expectedReturns: Material[] }> {
        return this._vanStockEngine.getPartsToCollect();
    }

    public getMaterialRequests(): Promise<{ inboundMaterials: MaterialRequest[], outboundMaterials: MaterialRequest[] }> {
        return this._vanStockEngine.getMaterialRequests();
    }

    public getReturns(): Promise<Material[]> {
        return this._vanStockEngine.getReturns();
    }

    public registerMaterialRequestReads(arg: { requestIds: (number | Guid)[] }): Promise<void> {
        return this._vanStockEngine.registerMaterialRequestReads(arg);
    }

    public registerMaterialZoneUpdate(arg: { stockReferenceId: string, area: string }): Promise<void> {
        return this._vanStockEngine.registerMaterialZoneUpdate(arg);
    }

    public registerMaterialCollection(arg: { dispatchId: number, quantityCollected: number }): Promise<void> {
        return this._vanStockEngine.registerMaterialCollection(arg);
    }

    public registerMaterialReturn(arg: { stockReferenceId: string, quantityReturned: number, reason: string, jobId?: string }): Promise<void> {
        return this._vanStockEngine.registerMaterialReturn(arg);
    }

    public registerMaterialRequest(arg: {
        stockReferenceId: string,
        description: string,
        quantityRequested: number,
        engineerId: string,
        engineerName: string,
        engineerPhone: string,
        owner: string
    }): Promise<number | Guid> {
        return this._vanStockEngine.registerMaterialRequest(arg);
    }

    public registerMaterialRequestWithdrawl(arg: { requestId: number | Guid }): Promise<void> {
        return this._vanStockEngine.registerMaterialRequestWithdrawl(arg);
    }

    public registerMaterialTransfer(arg: { requestId: number | Guid }): Promise<void> {
        return this._vanStockEngine.registerMaterialTransfer(arg);
    }

    public registerMaterialConsumption(arg: { stockReferenceId: string, quantityConsumed: number, jobId?: string }): Promise<void> {
        return this._vanStockEngine.registerMaterialConsumption(arg);
    }
}
