import { IActivity } from "./IActivity";

export interface ITask {
    id: string;
    applianceId: string;
    jobType: string;
    applianceType: string;
    chargeType: string;
    status: string;
    skill: string;
    fixedPriceQuotationAmount: number;
    discountCode: string;
    sequence: number;
    specialRequirement: string;
    supportingText: string;
    applianceErrorDesc: string;
    applianceErrorCode: string;
    applianceModel: string;
    applianceMake: string;
    problemDesc: string;
    activities: IActivity[];
}
