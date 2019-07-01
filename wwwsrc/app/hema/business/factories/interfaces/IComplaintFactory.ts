import {Job as JobBusinessModel} from "../../models/job";
import {IComplaintReport} from "../../../api/models/fft/jobs/jobupdate/IComplaintReport";

export interface IComplaintFactory {
    createComplaintApiModel(jobBusinessModel: JobBusinessModel): IComplaintReport;
}
