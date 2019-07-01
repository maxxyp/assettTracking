import {Guid} from "../../../common/core/guid";
import {PartWarrantyReturn} from "./partWarrantyReturn";
import {PartNotUsedReturn} from "./partNotUsedReturn";
import {WarrantyEstimate} from "./warrantyEstimate";
import * as bignumber from "bignumber";
import { NumberHelper } from "../../core/numberHelper";
import { DateHelper } from "../../core/dateHelper";

export class Part {
    public id: Guid;
    public stockReferenceId: string;
    public description: string;
    public quantity: number;
    public price: bignumber.BigNumber;
    public taskId: string;
    public partOrderStatus: string;
    public isMainPart: boolean;
    public status: string;
    public isInPatchVanStock: boolean;
    public patchVanStockEngineers: {name: string, phone: string}[];
    public warrantyEstimate: WarrantyEstimate;
    public warrantyReturn: PartWarrantyReturn;
    public notUsedReturn: PartNotUsedReturn;
    public requisitionNumber: string;
    public quantityCharged: number;
    public orderDate: Date;
    public taskDescription: string;
    public wasFoundUsingManualEntry: boolean;
    public fittedDate: Date;
    public isMainPartOptionAvailable: boolean;
    public isConsumable: boolean;
    public isFavourite: boolean;
    public isPriorityPart: boolean;
    public isCatalogPriceDifferentFromAdapt: boolean;
    public hasTaskWithWrongStatus: boolean;
    public hasFullCatalogsForMainPart: boolean;
    public isValid: boolean;

    public orderType: string; // "myVan" | "search" | "order;"
    public orderOption: number;

    constructor() {
        this.patchVanStockEngineers = [];

        this.warrantyReturn = new PartWarrantyReturn();
        this.notUsedReturn = new PartNotUsedReturn();

        this.isPriorityPart = false;
        this.isCatalogPriceDifferentFromAdapt = false;
        this.hasTaskWithWrongStatus = false;

        this.price = new bignumber.BigNumber(0);
    }

    public static fromJson(raw: any): Part {

        if (raw.price) {
            raw.price = NumberHelper.convertToBigNumber(raw.price);
        } else {
            raw.price = NumberHelper.convertToBigNumber("0");
        }

        raw.orderDate = DateHelper.convertDateTime(raw.orderDate);
        raw.fittedDate = DateHelper.convertDateTime(raw.fittedDate);

        return <Part> raw;
    }
}
