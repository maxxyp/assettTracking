import {IVisit as VisitApiModel} from "../../../api/models/fft/jobs/IVisit";
import {Visit as VisitBusinessModel} from "../../models/visit";
import {IFutureVisit} from "../../../api/models/fft/jobs/jobupdate/IFutureVisit";
import {Job as JobBusinessModel} from "../../models/job";

export interface IVisitFactory {
    createVisitBusinessModel(visitApiModel: VisitApiModel): VisitBusinessModel;
    createVisitApiModel(jobBusinessModel: JobBusinessModel): IFutureVisit;
}
