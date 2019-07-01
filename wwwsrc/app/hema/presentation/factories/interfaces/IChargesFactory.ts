import { ChargeMainViewModel } from "../../modules/charges/viewModels/chargeMainViewModel";
import { Charge } from "../../../business/models/charge/charge";
import {ChargeTaskViewModel} from "../../modules/charges/viewModels/chargeTaskViewModel";
import {ChargeableTask} from "../../../business/models/charge/chargeableTask";

export interface IChargesFactory {
    createChargesBusinessModel(vm: ChargeMainViewModel): Charge;
    createChargesViewModel(model: Charge): ChargeMainViewModel;
    createChargeableTaskBusinessModel(vm: ChargeTaskViewModel): ChargeableTask;
    createChargeableTaskViewModel(task: ChargeableTask): ChargeTaskViewModel;
}
