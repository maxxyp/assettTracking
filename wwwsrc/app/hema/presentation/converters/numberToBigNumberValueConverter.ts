import * as bignumber from "bignumber";

export class NumberToBigNumberValueConverter {
    public toView(input: bignumber.BigNumber): number {
        if (input) {
            return input.toNumber();
        }
        return undefined;
    }

    public fromView(num: number): bignumber.BigNumber {

        if (num) {
            return new bignumber.BigNumber(num);
        }
        return undefined;
    }
}
