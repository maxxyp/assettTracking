import * as bignumber from "bignumber";

export class PrimeSubCharge {
    public primeCharge: bignumber.BigNumber;
    public subsequentCharge: bignumber.BigNumber;
    public noPrimeChargesFound: boolean;
    public noSubsequentChargesFound: boolean;

    constructor(primeCharge: number, subCharge: number) {
        this.primeCharge = new bignumber.BigNumber(primeCharge);
        this.subsequentCharge = new bignumber.BigNumber(subCharge);
        this.noPrimeChargesFound = false;
        this.noSubsequentChargesFound = false;
    }
}
