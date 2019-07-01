import { Job } from "../../models/job";
import { JobState } from "../../models/jobState";
import { State } from "../stateMachine/state";
import { DataStateSummary } from "../../models/dataStateSummary";
import { JobApiFailure } from "../../models/jobApiFailure";
import { JobPartsCollection } from "../../models/jobPartsCollection";

export interface IJobService {
    getJobsToDo(): Promise<Job[]>;

    getWorkListJobApiFailures(): Promise<JobApiFailure[]>;

    getPartsCollections(): Promise<JobPartsCollection[]>;

    completePartsCollections(): Promise<void>;

    getJob(id: string): Promise<Job>;

    setJob(job: Job): Promise<void>;

    getActiveJobId(): Promise<string>;

    isJobEditable(jobId: string): Promise<boolean>;

    areAllJobsDone(): Promise<boolean>;

    getJobState(jobId: string): Promise<State<JobState>>;

    getJobTargetStates(jobId: string): Promise<State<JobState>[]>;

    setJobState(jobId: string, state: JobState): Promise<void>;

    getDataStateSummary(jobId: string): Promise<DataStateSummary>;

    requiresAppointment(jobId: string): Promise<boolean>;

    setJobNoAccessed(job: Job): Promise<void>;

    checkIfJobFinishTimeNeedsToBeUpdated(): Promise<boolean>;
}
