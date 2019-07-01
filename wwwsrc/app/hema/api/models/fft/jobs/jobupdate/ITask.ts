import {IPartsUsed} from "./IPartsUsed";
import {IPartsNotUsed} from "./IPartsNotUsed";
import {IPartsCharged} from "./IPartsCharged";
import {IPartsClaimedUnderWarranty} from "./IPartsClaimedUnderWarranty";

export interface ITask {
    id: string;
    newWork: boolean;
    jobType: string;
    applianceType: string;
    chargeType: string;
    jobStatusCategory: string;
    discountCode: string;
    sequence: number;
    applianceId: string;
    fieldTaskId: string;
    status: string;
    chargeableTime: number;
    componentEndTime: string;
    componentStartTime: string;
    report: string;
    workDuration: number;
    energyEfficiencyOutcome: string;
    energyAdviceCategoryCode: string;
    energyEfficiencyAdviceComments: string;
    hardwareSequenceNumber: number;
    workedOnCode: string;
    visitActivityCode: string;
    faultActionCode: string;
    productGroupCode: string;
    partTypeCode: string;
    chargeExcludingVAT: number;
    vatAmount: number;
    vatCode: string;
    discountAmount: number;
    fixedPriceQuotationAmount: number;
    standardLabourChargeIndicator: boolean;
    standardPartsPriceCharged: number;
    subsequentJobIndicator: boolean;
    supplementaryLabourChargeTotal: number;
    totalLabourCharged: number;
    partsCharged: IPartsCharged[];
    partsUsed: IPartsUsed[];
    partsNotUsed: IPartsNotUsed[];
    partsClaimedUnderWarranty: IPartsClaimedUnderWarranty[];
}
