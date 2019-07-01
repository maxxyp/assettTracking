import {ChargeTaskViewModel} from "./chargeTaskViewModel";
import * as bignumber from "bignumber";
import {DataState} from "../../../../business/models/dataState";

export class ChargeMainViewModel {
    public jobId: string;
    public discountAmount: bignumber.BigNumber;
    public chargeOption: string;
    public chargeComplaintActionCategory: string;
    public chargeDisputeText: string;
    public remarks: string;
    public grossTotal: bignumber.BigNumber;
    public netTotal: bignumber.BigNumber;
    public chargeTotal: bignumber.BigNumber;
    public totalVatAmount: bignumber.BigNumber;
    public tasks: ChargeTaskViewModel[];
    public dataStateId: string;
    public dataState: DataState;
    public chargeReasonCode: string;
    public previousChargeSameAppliance: boolean;
    public previousChargeSameApplianceConfirmed: boolean;
}
