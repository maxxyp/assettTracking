import * as bignumber from "bignumber";

export abstract class ChargeableBase {
    protected calculateGrossAmount(netAmount: bignumber.BigNumber, vat: bignumber.BigNumber): bignumber.BigNumber {
        if (vat && vat.greaterThan(0)) {
            return netAmount.plus(this.calculateVatAmount(netAmount, vat));
        } else {
            return netAmount;
        }
    }

    protected calculateVatAmount(netAmount: bignumber.BigNumber, vat: bignumber.BigNumber): bignumber.BigNumber {
        // since VAT values will always be in multiplier of 10
        // for e.g. 175 = 17.5%, 200=20%, 50=5% etc.        
        let vatAmount: bignumber.BigNumber = new bignumber.BigNumber(0);

        if (vat && vat.greaterThan(0) && netAmount && netAmount.greaterThan(0)) {
            vatAmount = (netAmount.times(vat)).dividedBy(1000);
        }
        return vatAmount;
    }
}
