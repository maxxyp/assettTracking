import {Charge} from "../../../models/charge/charge";
import {IDiscount} from "../../../models/reference/IDiscount";
import {ChargeableTask} from "../../../models/charge/chargeableTask";

export interface IChargeService {

    startCharges(jobId: string): Promise<void>;

    applyCharges(jobId: string): Promise<Charge>;

    loadCharges(jobId: string): Promise<Charge>;

    saveCharges(charges: Charge): Promise<void>;

    applyDiscountToTask(task: ChargeableTask, discounts: IDiscount [], discountPercentageCode: string,
                        discountFixedCode: string, noDiscountCode: string): void;

    areChargesUptoDate(): boolean;

    updateTotals(charge: Charge): void;
}
