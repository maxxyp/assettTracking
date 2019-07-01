import {ChargeItemViewModel} from "./chargeItemViewModel";

export class ChargeItemPartViewModel extends ChargeItemViewModel {

    public qty: number;
    public isWarranty: boolean;
    public isReturn: boolean;
    public warrantyQty: number;
    public returnQty: number;
    public isFromPreviousActivity: boolean;
    public status: string;

    constructor() {
        super();
        this.isFromPreviousActivity = false;
    }

    public get displayItemName(): string {

        let displayItem: string = this.itemName;

        if (this.qty && displayItem && this.qty > 0) {
            displayItem = `${displayItem} x${this.qty}`;
        }

        return displayItem;
    }
}
