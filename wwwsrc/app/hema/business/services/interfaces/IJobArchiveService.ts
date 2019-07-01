import {Job} from "../../models/job";
export interface IJobArchiveService {
    initialise(): Promise<void>;
    archive(job: Job): Promise<void>;
    getArchivedJobs(): Promise<Job[]>;
}
