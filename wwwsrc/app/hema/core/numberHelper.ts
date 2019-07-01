import * as bignumber from "bignumber";

export class NumberHelper {

    public static convertToBigNumber(value: string): bignumber.BigNumber {
        return new bignumber.BigNumber(value || 0);
    }
    
    public static isNullOrUndefined(value: number): boolean {
        return value === undefined || value === null;
    }
}
