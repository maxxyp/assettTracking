/// <reference path="../../../../typings/app.d.ts" />
import { inject } from "aurelia-framework";

import {IStorageService} from "./interfaces/IStorageService";
import {Job} from "../models/job";
import {JobState} from "../models/jobState";
import {BusinessException} from "../models/businessException";
import {IJobCacheService} from "./interfaces/IJobCacheService";
import {StorageService} from "./storageService";
import { JobApiFailure } from "../models/jobApiFailure";
import { JobPartsCollection } from "../models/jobPartsCollection";

@inject(StorageService)
export class JobCacheService implements IJobCacheService {
    private _storageService: IStorageService;
    private _jobCache: Job[];

    constructor(storageService: IStorageService) {
        this._storageService = storageService;
    }

    public getJobsToDo(): Promise<Job[]> {
        if (this._jobCache === undefined) {
            return this._storageService.getJobsToDo()
                .then((jobsToDo) => {
                    this._jobCache = jobsToDo;
                    return this._jobCache;
                });
        } else {
            return Promise.resolve(this._jobCache);
        }
    }

    public clearJobsToDo() : Promise<void> {
        this._jobCache = [];
        return this._storageService.setJobsToDo(null);
    }

    public getJob(id: string): Promise<Job> {
        let job: Job = this._jobCache.find(j => j.id === id);
        if (job) {
            return Promise.resolve(job);
        } else {
            return Promise.reject(new BusinessException(this, "getJob.notFound", "Job not found '{0}'", [id], null));
        }
    }

    public setJob(job: Job): Promise<void> {
        /* Set job doesn't actually need to do anything with the job as it is the in memory cache object
         * just save the list of jobs as a background task */
        return this._storageService.setJobsToDo(this._jobCache);
    }

    public getWorkListJobs(): Promise<Job[]> {
        return this._storageService.getWorkListJobs()
            .then((jobs) => jobs ? jobs.filter(job => job.position >= 0) : []);

    }

    public setWorkListJobs(jobs: Job[]): Promise<void> {
        return this._storageService.setWorkListJobs(jobs)
            .then(() => this.buildTodoJobs())
            .then(toDoJobs => this.setJobsToDo(toDoJobs));
    }

    public getPartsCollections(): Promise<JobPartsCollection[]> {
        return this._storageService.getPartsCollections()
            .then(collections => collections ? collections.filter(collection => collection.position >= 0) : []);
    }

    public setPartsCollections(partsCollections: JobPartsCollection[]): Promise<void> {
        return this._storageService.setPartsCollections(partsCollections);
    }

    public getWorkListJobApiFailures(): Promise<JobApiFailure[]> {
        return this._storageService.getWorkListJobApiFailures();
    }

    public setWorkListJobApiFailures(jobApiFailures: JobApiFailure[]): Promise<void> {
        return this._storageService.setWorkListJobApiFailures(jobApiFailures);
    }

    public async clearWorkListJobs(): Promise<void> {
        await Promise.all([
            this._storageService.setWorkListJobs(null),
            this._storageService.setWorkListJobApiFailures(null),
            this._storageService.setPartsCollections(null)
        ]);
    }

    public async existsALiveJobNotInWorklist(): Promise<boolean> {
        /* edge case: if a job is en-route and is cancelled in the backend, the next worklist retrieval will clear that job from
            the worklistJobs array, but because the job is not idle it remains in the todo array. If the user does not "arrive" the job
            i.e. returns the job to idle, it remains in the todo list.  Unless we do something about it, the job will remain in the todo list
            until the next worklist change.  So we expose this method to let worklist retrieval know to run through its completion logic if
            we have a stranded job.  This means that the next time the user calls request for work, or a background polling occurs, the stranded job
            will be removed, whether there is a change in the worklist or not.

        */
        let [todoListJobs, worklistJobs, failures] = await Promise.all<Job[], Job[], JobApiFailure[]>([
            this.getJobsToDo(),
            this.getWorkListJobs(),
            this.getWorkListJobApiFailures()
        ]);

        let idleJobs = (todoListJobs || []).filter(job => job && job.state === JobState.idle);

        let liveJobsOrFailures: {id: string}[] = [...idleJobs, ...(failures || [])];
        return liveJobsOrFailures.some(liveJobsOrFailure => !worklistJobs.some(worklistJob =>  worklistJob && liveJobsOrFailure && worklistJob.id === liveJobsOrFailure.id));
    }

    private setJobsToDo(jobs: Job[]): Promise<void> {
        this._jobCache = jobs;
        return this._storageService.setJobsToDo(jobs);
    }

    private buildTodoJobs(): Promise<Job[]> {

        return Promise.all([
                this.getJobsToDo(),
                this.getWorkListJobs()
            ])
            .then(([todoJobs, workListJobs]) => {
                /*
                    At this point:
                        1) we have a new list of allocated jobs from the worklist endpoint: all currently idle jobs in todo jobs need to be
                            replaced with the incoming jobs
                        2) we may or may not have an active job (en-route or arrived): we can expect this job to be in the incoming
                            list, but obviously this job should not be overwritten.  Its position in the list should be updated
                            (todo: why? does this position even matter anymore as the job is in progress)
                        3) we have our done jobs in todoJobs (todo: refactor for better naming, as todoJobs includes done jobs):
                            these jobs need to remain in todoJobs
                        4) a done job may be being rebooked: we need to replace the done job with the incoming job from the worklist
                            these can be identified by a job with a different timestamp

                        In other words: we keep all existing jobs that are at a status other than idle, apart from rebooked done jobs.
                */

                let nextJobList: Job[] = [];

                let addJobsOnlyOnce = (jobs: Job[]) => {
                    (jobs || []).forEach(job => {
                        if (!nextJobList.some(alreadyAddedJob => alreadyAddedJob.id === job.id)) {
                            nextJobList.push(job);
                        }
                    });
                };

                let doneJobsBeingReactivated = (workListJobs || []).filter(workListJob => {
                    return (todoJobs || []).some(todoJob => todoJob.state === JobState.done
                                                && workListJob.id === todoJob.id
                                                && workListJob.wmisTimestamp !== todoJob.wmisTimestamp);
                });

                let existingJobsToKeep: Job[] = (todoJobs || []).filter(job => job.state !== JobState.idle);

                // the order of the following calls is important
                addJobsOnlyOnce(doneJobsBeingReactivated);
                addJobsOnlyOnce(existingJobsToKeep);
                addJobsOnlyOnce(workListJobs);

                // assign the latest position ranking from the worklist
                nextJobList.forEach(job => {
                    let workListJob = workListJobs.find(wkJob => wkJob.id === job.id);
                    job.position = workListJob ? workListJob.position : job.position;
                });

                nextJobList.sort((a, b) => a.position < b.position ? -1 : 1);
                return nextJobList;
            });
    }
}
