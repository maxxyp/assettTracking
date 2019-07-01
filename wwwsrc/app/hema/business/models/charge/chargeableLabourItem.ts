import {ChargeableItem} from "./chargeableItem";
import {PrimeSubCharge} from "./primeSubCharge";

export class ChargeableLabourItem extends ChargeableItem {
    public isFixed: boolean;

    public chargePair: PrimeSubCharge;

    constructor() {
        super();
        this.chargePair = new PrimeSubCharge(0, 0);
        this.isFixed = false;
    }

}
