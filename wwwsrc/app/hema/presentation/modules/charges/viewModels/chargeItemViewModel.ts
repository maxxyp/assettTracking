import * as bignumber from "bignumber";

export abstract class ChargeItemViewModel {
    public itemName: string;
    public netAmount: bignumber.BigNumber;
    public vat: bignumber.BigNumber;
    public grossAmount: bignumber.BigNumber;
    public isFixed: boolean;
}
