import { ChargeableTask } from "../../../models/charge/chargeableTask";
import { IChargePartsCatalogDependencies } from "./IChargePartsCatalogDependencies";

export interface IChargePartsHelperService {

    addPartsCharge(chargeableTask: ChargeableTask, jobId: string,
                   shouldChargeForParts: boolean, dependencies: IChargePartsCatalogDependencies): Promise<ChargeableTask>;
}
