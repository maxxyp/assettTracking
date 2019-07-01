import { ITask } from "./ITask";
import { IVisit } from "./IVisit";
import { IPremises } from "./IPremises";
import { ICustomer } from "./ICustomer";

export interface IJob {
    customer: ICustomer;
    premises: IPremises;
    visit: IVisit;
    tasks: ITask[];
}
