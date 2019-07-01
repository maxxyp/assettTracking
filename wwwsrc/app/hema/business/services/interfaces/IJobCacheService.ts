import {Job} from "../../models/job";
import { JobApiFailure } from "../../models/jobApiFailure";
import { JobPartsCollection } from "../../models/jobPartsCollection";

export interface IJobCacheService {
    getJobsToDo(): Promise<Job[]>;
    clearJobsToDo(): Promise<void>;

    getJob(jobId: string) : Promise<Job>;
    setJob(job: Job) : Promise<void>;

    getWorkListJobs(): Promise<Job[]>;
    setWorkListJobs(jobs: Job[]): Promise<void>;
    clearWorkListJobs(): Promise<void>;
    getPartsCollections(): Promise<JobPartsCollection[]>;
    setPartsCollections(partsCollections: JobPartsCollection[]): Promise<void>;

    getWorkListJobApiFailures(): Promise<JobApiFailure[]>;
    setWorkListJobApiFailures(jobApiFailures: JobApiFailure[]): Promise<void>;
    existsALiveJobNotInWorklist(): Promise<boolean>;
}
