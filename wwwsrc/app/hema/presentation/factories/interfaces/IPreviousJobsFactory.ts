import {Job as JobBusinessModel} from "../../../business/models/job";
import {PreviousJobViewModel} from "../../modules/previousJobs/viewModels/previousJobViewModel";

export interface IPreviousJobsFactory {
    createPreviousJobsViewModel(job: JobBusinessModel): Promise<PreviousJobViewModel[]>;
}
