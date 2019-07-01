import {IJobUpdateJob} from "./IJobUpdateJob";
import {IAppliance} from "./IAppliance";
import {IComplaintReport} from "./IComplaintReport";
import {INewWork} from "./INewWork";

export interface IJobUpdate {
    job: IJobUpdateJob;
    appliances: IAppliance[];
    complaintReportOrCompensationPayment: IComplaintReport;
    newWork: INewWork[];
}
