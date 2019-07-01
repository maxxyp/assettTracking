import {ChargeableItem} from "./chargeableItem";

export class ChargeablePartItem extends ChargeableItem {

    public qty: number;
    public isWarranty: boolean;
    public isReturn: boolean;
    public stockReferenceId: string;
    public qtyCharged: number;
    public warrantyQty: number;
    public returnQty: number;
    public isFromPreviousActivity: boolean;
    public status: string;

    constructor() {
        super();
        this.qty = 0;
        this.stockReferenceId = "";
        this.isWarranty = false;
        this.isReturn = false;
        this.warrantyQty = 0;
        this.returnQty = 0;
        this.isFromPreviousActivity = false;
        this.status = "";
    }
}
