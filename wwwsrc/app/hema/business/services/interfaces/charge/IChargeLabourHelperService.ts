
import { ChargeableTask } from "../../../models/charge/chargeableTask";
import { IJcChargeRules } from "../../../models/reference/IJcChargeRules";
import { IChargeLabourCatalogDependencies } from "./IChargeLabourCatalogDependencies";

export interface IChargeLabourHelperService {
    calculateLabourCharge(chargeableTask: ChargeableTask, jcChargeRule: IJcChargeRules
        , catalogDependencies: IChargeLabourCatalogDependencies): Promise<ChargeableTask>;
}
