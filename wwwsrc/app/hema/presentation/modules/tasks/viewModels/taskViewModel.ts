import {IPart} from "../../../../api/models/fft/jobs/IPart";
import {ITask} from "../../../../api/models/fft/jobs/ITask";
import {IActivity} from "../../../../api/models/fft/jobs/IActivity";
import {IAppliance} from "../../../../api/models/fft/jobs/history/IAppliance";

export class TaskViewModel {
    public taskParts: IPart[];
    public task: ITask;
    public startTime: string;
    public endTime: string;
    public activity: IActivity;
    public totalPreviousWorkDuration : number;

    public appliances: IAppliance[];
}
