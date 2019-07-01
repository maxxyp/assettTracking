import { Charge } from "../../models/charge/charge";
import { ITask as TaskUpdateApiModel } from "../../../api/models/fft/jobs/jobupdate/ITask";
import { ITask as TaskApiModel } from "../../../api/models/fft/jobs/ITask";
import { ChargeableTask } from "../../models/charge/chargeableTask";

export interface IChargeFactory {

    createChargeBusinessModel(tasks: TaskApiModel[]): Charge;

    createChargeApiModel(chargeableTasks: ChargeableTask[], updateApiTasks: TaskUpdateApiModel[] ): Promise<TaskUpdateApiModel[]>;
}
