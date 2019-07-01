import {WarrantyEstimateType} from "./warrantyEstimateType";

export class WarrantyEstimate {
    public isInWarranty: boolean;
    public warrantyPeriodWeeks: number;
    public lastFittedDate: Date;
    public warrantyEstimateType: WarrantyEstimateType;

    constructor(isInWarranty: boolean, warrantyPeriodWeeks: number, lastFittedDate: Date,
                warrantyEstimateType: WarrantyEstimateType) {
        this.isInWarranty = isInWarranty;
        this.warrantyPeriodWeeks = warrantyPeriodWeeks;
        this.lastFittedDate = lastFittedDate;
        this.warrantyEstimateType = warrantyEstimateType;
    }
}
