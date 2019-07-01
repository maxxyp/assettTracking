import {ITask} from "./ITask";
import {IFutureVisit} from "./IFutureVisit";
import {IPremises} from "./IPremises";
import {IStatus} from "./IStatus";

export interface IJobUpdateJob {
    status: IStatus;
    sourceSystem: string;
    engineerId: string;
    dispatchTime: string;
    enrouteTime: string;
    onsiteTime: string;
    completionTime: string;
    paymentNonCollectionReasonCode: string;
    visitId: string;
    tasks: ITask[];
    futureVisit: IFutureVisit;
    premises: IPremises;
}
