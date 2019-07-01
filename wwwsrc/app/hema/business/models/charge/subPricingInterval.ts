import {ISubsqntChargeInterval} from "../reference/ISubsqntChargeInterval";
import {IPricingInterval} from "./IPricingInterval";

export class SubPricingInterval implements IPricingInterval {
    public sequenceNo: number;
    public chargeInterval: number;
    public chargePeriod: number;
    public chargeIntervalPrice: number;

    constructor(item: ISubsqntChargeInterval) {
        this.sequenceNo = item.subsequentChargeIntervalSequence;
        this.chargeInterval = item.subsequentChargeInterval;
        this.chargePeriod = item.subsequentChargeIntervalPd;
        this.chargeIntervalPrice = item.subsequentChargeIntervalPrc;
    }
}
