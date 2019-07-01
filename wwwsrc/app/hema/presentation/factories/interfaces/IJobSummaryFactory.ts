import {Job} from "../../../business/models/job";
import {JobSummaryViewModel} from "../../models/jobSummaryViewModel";

export interface IJobSummaryFactory {
    createJobSummaryViewModel(job: Job): JobSummaryViewModel;
}
