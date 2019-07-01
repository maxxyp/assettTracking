import { IAppliance } from "./IAppliance";
import { ITask } from "../ITask";

export interface IJobHistory {
    tasks: ITask[];
    appliances: IAppliance[];
    id: string;
}
