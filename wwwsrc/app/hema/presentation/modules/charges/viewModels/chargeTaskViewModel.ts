import * as bignumber from "bignumber";
import { Task } from "../../../../business/models/task";
import { ChargeItemPartViewModel } from "./chargeItemPartViewModel";
import { ChargeItemLabourViewModel } from "./chargeItemLabourViewModel";
import { computedFrom } from "aurelia-binding";

export class ChargeTaskViewModel {
    public id: string;
    public chargeType: string;
    public chargeDescription: string;
    public vat: bignumber.BigNumber;
    public vatCode: string;
    public grossTotal: bignumber.BigNumber;
    public netTotal: bignumber.BigNumber;
    public discountCode: string;
    public discountAmount: bignumber.BigNumber;
    public discountText: string;
    public fixedPriceQuotationAmount: bignumber.BigNumber;
    public show: boolean;
    public partItems: ChargeItemPartViewModel[];
    public labourItem: ChargeItemLabourViewModel;
    public task: Task;
    public isLabour: boolean;
    public isParts: boolean;
    public error: boolean;
    public errorDescription: string;
    public isSubsequent: boolean;

    @computedFrom("error", "hasFixedPriceQuotation", "netTotal")
    public get canApplyDiscount(): boolean {
        return !this.error && !this.hasFixedPriceQuotation && this.netTotal && this.netTotal.greaterThan(0);
    }

    @computedFrom("fixedPriceQuotationAmount")
    public get hasFixedPriceQuotation(): boolean {
        return this.fixedPriceQuotationAmount && this.fixedPriceQuotationAmount.greaterThan(0);
    }

    @computedFrom("discountAmount")
    public get displayDiscountAmount(): string {
        if (this.discountAmount && this.discountAmount.greaterThan(0)) {
            return `-£${this.discountAmount.toFixed(2)}`;
        } else {
            return "";
        }
    }

    @computedFrom("discountAmount", "netTotal", "vat")
    public get discountGreaterThanAmount(): boolean {
        if (!this.discountAmount) {
            return false;
        }

        let total = this.netTotal;

        if (this.vat) {
             total =  total.plus(total.times(this.vat).dividedBy(1000));
        }

        return this.discountAmount.greaterThan(total);
    }
}
