import {IFutureTask} from "./IFutureTask";

export interface IFutureVisit {
    premiseId: string;
    appointmentBandCode: string;
    preferredEngineer: string;
    date: string;
    temporaryVisitInformation: string;
    tasks: IFutureTask[];
}
