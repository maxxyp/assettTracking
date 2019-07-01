import { Task } from "./task";
import { Appliance } from "./appliance";
import {DataStateProvider} from "./dataStateProvider";
import {DataState} from "./dataState";

export class History extends DataStateProvider {
    public tasks: Task[];
    public appliances: Appliance[];

    public constructor() {
        super(DataState.dontCare, "appliances");
    }
}
