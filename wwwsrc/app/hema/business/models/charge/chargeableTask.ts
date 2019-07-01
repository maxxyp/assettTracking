import { Task } from "../task";
import { ChargeableBase } from "./chargeableBase";
import * as bignumber from "bignumber";
import { ChargeablePartItem } from "./chargeablePartItem";
import { ChargeableLabourItem } from "./chargeableLabourItem";
import { PrimeSubCharge } from "./primeSubCharge";
import { IActivityCmpnentVstStatus } from "../reference/IActivityCmpnentVstStatus";

export class ChargeableTask extends ChargeableBase {
    public task: Task;
    public chargeDescription: string;
    public isLabourCharge: boolean;
    public isPartsCharge: boolean;
    public vat: bignumber.BigNumber;
    public discountAmount: bignumber.BigNumber;
    public discountCode: string;
    public discountText: string;
    public vatCode: string;
    public isSubsequent: boolean;
    public labourItem: ChargeableLabourItem;
    public partItems: ChargeablePartItem [];
    public fixedPriceQuotationAmount: bignumber.BigNumber;
    public error: boolean;
    public errorDescription: string;

    constructor() {
        super();
        this.partItems = [];
        this.isLabourCharge = false;
        this.isPartsCharge = false;
        this.isSubsequent = false;
        this.labourItem = new ChargeableLabourItem();
        this.fixedPriceQuotationAmount = new bignumber.BigNumber(0);
        this.error = false;
        this.errorDescription = "";
        this.discountAmount = new bignumber.BigNumber(0);
    }

    public get partItemsCharge(): bignumber.BigNumber {

        let total = new bignumber.BigNumber(0);

        if (this.partItems) {
            this.partItems.forEach(x => {
                if (x.netAmount) {
                    total = total.plus(x.netAmount);
                }
            });
        }
        return total;
    }

    public get calculatedVatAmount(): bignumber.BigNumber {
        return this.calculateVatAmount(this.netTotal, this.vat);
    }

    public get grossTotal(): bignumber.BigNumber {
        let value = this.calculateGrossAmount(this.netTotal, this.vat);

        return value.round(2);
    }

    public get netTotal(): bignumber.BigNumber {
        let total = new bignumber.BigNumber(0);

        if (this.fixedPriceQuotationAmount && this.fixedPriceQuotationAmount.greaterThan(0)) {
            return this.fixedPriceQuotationAmount;
        }

        total = total.plus(this.partItemsCharge);

        if (this.labourItem) {
            if (this.labourItem.netAmount && this.labourItem.netAmount.greaterThan(0)) {
                total = total.plus(this.labourItem.netAmount);
            }
        }

        if (this.discountAmount) {
            if (this.discountAmount.greaterThan(total)) {
                total = new bignumber.BigNumber(0);
            } else if (this.discountAmount.greaterThan(0)) {
                total = total.minus(this.discountAmount);
            }
        }

        return total;
    }

    public get fixedPriceAmount(): bignumber.BigNumber {
        let total = new bignumber.BigNumber(0);

        if (this.labourItem.isFixed) {
            total = this.labourItem.netAmount;
        }
        return total;
    }

    public get useFixedPriceQuotation(): boolean {
        if (this.fixedPriceQuotationAmount && this.fixedPriceQuotationAmount.greaterThan(0)) {
            return true;
        }
        return false;
    }

    public updateLabourItem(description: string, chargePair: PrimeSubCharge, isFixed: boolean): void {
        if (this.labourItem) {
            this.labourItem.isFixed = isFixed;
            this.labourItem.description = description;
            this.labourItem.chargePair = chargePair;
            this.labourItem.vat = this.vat;
        }
    }

    public addPartItem(description: string, netAmount: bignumber.BigNumber, isReturn: boolean, isWarranty: boolean,
                       qty: number, qtyCharged: number, refId: string, returnQty: number, warrantyQty: number,
                       previous: boolean = false, status: string = ""): void {

        let partItem = new ChargeablePartItem();
        partItem.description = description;
        partItem.vat = this.vat;
        partItem.isReturn = isReturn;
        partItem.isWarranty = isWarranty;
        partItem.qty = qty;
        partItem.qtyCharged = qtyCharged;
        partItem.stockReferenceId = refId;
        partItem.netAmount = netAmount;
        partItem.returnQty = returnQty;
        partItem.warrantyQty = warrantyQty;
        partItem.isFromPreviousActivity = previous;
        partItem.status = status;

        this.partItems.push(partItem);
    }

    public setErrorsPrimeAndSubCharges(ignoreSubsequentCharges: boolean): void {

        if (this && this.isLabourCharge && this.labourItem && this.labourItem.chargePair) {

            const {labourItem, isSubsequent} = this;
            const {isFixed, chargePair} = labourItem;
            const {noPrimeChargesFound, noSubsequentChargesFound} = chargePair;

            if (!isFixed) {
                if (noPrimeChargesFound && !isSubsequent) {
                    this.error = true;
                    this.errorDescription = "no prime charge intervals found";
                } else if (noSubsequentChargesFound && !ignoreSubsequentCharges && isSubsequent) {
                    this.error = true;
                    this.errorDescription = "no subsequent charge intervals found";
                }
            } else {
                if (noPrimeChargesFound && !isSubsequent) {
                    this.error = true;
                    this.errorDescription = "no prime charge found for standard labour";
                } else if (noSubsequentChargesFound && !ignoreSubsequentCharges && isSubsequent) {
                    this.error = true;
                    this.errorDescription = "no subsequent charge found for standard labour";
                }
            }
        }
    }

    public get getTotalPreviousChargeableTimeForTask(): number {
        let totalChargeableTime: number = 0;

        for (let i: number = 0; i < this.task.activities.length; i++) {
            let activity = this.task.activities[i];
            if (activity && activity.chargeableTime) {
                totalChargeableTime += activity.chargeableTime;
            }
        }

        return totalChargeableTime;
    }

    public shouldCharge(statuses: IActivityCmpnentVstStatus [], chargeStatusCodes: string [] ): boolean {

        if (this.error) {
            return false;
        }

        if (this.task.status) {

            const status = statuses.find(a => a.status === this.task.status);

            if (status && chargeStatusCodes) {
                const index = chargeStatusCodes.findIndex(c => c === status.jobStatusCategory);
                return index > -1;
            }
        }

        return false;
    }

    public setChargeableTaskAsError(message: string): void {
        this.error = true;
        this.errorDescription = message;
    }

}
