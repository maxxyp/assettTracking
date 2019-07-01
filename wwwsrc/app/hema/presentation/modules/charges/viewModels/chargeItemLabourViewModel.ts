import {ChargeItemViewModel} from "./chargeItemViewModel";
import * as bignumber from "bignumber";

export class ChargeItemLabourViewModel extends ChargeItemViewModel {

    public primeChargeTotal: bignumber.BigNumber;
    public subChargeTotal: bignumber.BigNumber;

    constructor() {
        super();
        this.primeChargeTotal = new bignumber.BigNumber(0);
        this.subChargeTotal = new bignumber.BigNumber(0);
    }

    public get displayItemName(): string {
        return this.itemName;
    }
}
