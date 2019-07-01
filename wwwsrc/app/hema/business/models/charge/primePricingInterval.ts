
import {IPrimeChargeInterval} from "../reference/IPrimeChargeInterval";
import {IPricingInterval} from "./IPricingInterval";

export class PrimePricingInterval implements IPricingInterval {
    public sequenceNo: number;
    public chargeInterval: number;
    public chargePeriod: number;
    public chargeIntervalPrice: number;

    constructor(item: IPrimeChargeInterval) {
        this.sequenceNo = item.primeChargeIntervalSequence;
        this.chargeInterval = item.primeChargeInterval;
        this.chargePeriod = item.primeChargeIntervalPD;
        this.chargeIntervalPrice = item.primeChargeIntervalPRC;
    }
}
