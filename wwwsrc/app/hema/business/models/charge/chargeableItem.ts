import {ChargeableBase} from "./chargeableBase";
import * as bignumber from "bignumber";

export abstract class ChargeableItem extends ChargeableBase {
    public description: string;
    public netAmount: bignumber.BigNumber;
    public vat: bignumber.BigNumber;

    constructor() {
        super();
        this.netAmount = new bignumber.BigNumber(0);
        this.description = "";
        this.vat = new bignumber.BigNumber(0);
    }

    public get grossAmount(): bignumber.BigNumber {
        return this.calculateGrossAmount(this.netAmount, this.vat);
    }
}
