import * as bignumber from "bignumber";

export class NumberToCurrencyValueConverter {
    public toView(value: number | string | bignumber.BigNumber): string {
        if (typeof value === "number" && !isNaN(value)) {
            return "£" + value.toFixed(2);
        } else if (!!value && typeof value === "string" ) {
            return "£" + parseFloat(value).toFixed(2);
        } else if (!!value && value instanceof bignumber.BigNumber) {
            return "£" + parseFloat(value.toString()).toFixed(2);
        } else {
            return "";
        }
    }
}
