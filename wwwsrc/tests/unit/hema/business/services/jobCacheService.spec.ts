/// <reference path="../../../../../typings/app.d.ts" />

import {JobCacheService} from "../../../../../app/hema/business/services/jobCacheService";
import {IStorageService} from "../../../../../app/hema/business/services/interfaces/IStorageService";
import {Job} from "../../../../../app/hema/business/models/job";
import {JobState} from "../../../../../app/hema/business/models/jobState";
import { JobApiFailure } from "../../../../../app/hema/business/models/jobApiFailure";

describe("the JobCacheService module", () => {
    let jobCacheService: JobCacheService;
    let sandbox: Sinon.SinonSandbox;

    let storageServiceStub: IStorageService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        storageServiceStub = <IStorageService>{};
        storageServiceStub.setJobsToDo = sandbox.stub().resolves(undefined);
        jobCacheService = new JobCacheService(storageServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(jobCacheService).toBeDefined();
    });


    describe("adding jobs from worklist", () => {

        let storedTodoJobs: Job[];

        beforeEach(() => {

            let storedWorkListJobs: Job[];

            storageServiceStub.setWorkListJobs = (jobs: Job[]) => {
                storedWorkListJobs = jobs;
                return Promise.resolve();
            };
            storageServiceStub.getWorkListJobs = () => Promise.resolve(storedWorkListJobs);

            storageServiceStub.setJobsToDo = (jobs: Job[]) => {
                storedTodoJobs = jobs;
                return Promise.resolve();
            };
            storageServiceStub.getJobsToDo = () => Promise.resolve(storedTodoJobs);

        });

        it("can set joblist for the first time", done => {
            let job = <Job>{id: "1", position: 1};
            jobCacheService.setWorkListJobs([job])
                .then(() => jobCacheService.getJobsToDo())
                .then(jobsToDo => {
                    expect(jobsToDo).toEqual([job]);
                    done();
                });
        });

        it("can add new jobs to the job list", done => {
            storedTodoJobs = [];
            let job = <Job>{id: "1", position: 1};
            jobCacheService.setWorkListJobs([job])
                .then(() => jobCacheService.getJobsToDo())
                .then(jobsToDo => {
                    expect(jobsToDo).toEqual([job]);
                    done();
                });
        });

        it("can replace jobs in the job list that have not been started", done => {
            let storedJob1 = <Job>{id: "1", position: 1, state: JobState.idle};
            storedTodoJobs = [storedJob1];

            let job1 = <Job>{id: "1", position: 1};

            jobCacheService.setWorkListJobs([job1])
                .then(() => jobCacheService.getJobsToDo())
                .then(jobsToDo => {
                    expect(jobsToDo).toEqual([job1]);
                    done();
                });
        });

        it("can not replace jobs in the job list that have not been started", done => {
            let storedJob1 = <Job>{id: "1", position: 1, state: JobState.arrived};
            storedTodoJobs = [storedJob1];

            let job1 = <Job>{id: "1", position: 1};

            jobCacheService.setWorkListJobs([job1])
                .then(() => jobCacheService.getJobsToDo())
                .then(jobsToDo => {
                    expect(jobsToDo).toEqual([storedJob1]);
                    done();
                });
        });

        it("can remove jobs in the job list that have not been started and are no longer in the worklist", done => {
            let storedJob1 = <Job>{id: "1", position: 1, state: JobState.idle};
            let storedJob2 = <Job>{id: "2", position: 1, state: JobState.idle};
            storedTodoJobs = [storedJob1, storedJob2];

            let job1 = <Job>{id: "1", position: 1};

            jobCacheService.setWorkListJobs([job1])
                .then(() => jobCacheService.getJobsToDo())
                .then(jobsToDo => {
                    expect(jobsToDo).toEqual([job1]);
                    done();
                });
        });

        it("can leave done jobs in the jobs list if the job disappears from the worklist", done => {
            let storedJob1 = <Job>{id: "1", position: 1, state: JobState.idle};
            let storedJob2 = <Job>{id: "2", position: 2, state: JobState.done, visit: {id: "v1" }};

            storedTodoJobs = [storedJob1, storedJob2];

            let job1 = <Job>{id: "1", position: 1};

            jobCacheService.setWorkListJobs([job1])
                .then(() => jobCacheService.getJobsToDo())
                .then(jobsToDo => {
                    expect(jobsToDo).toEqual([job1, storedJob2]);
                    done();
                });
        });

        it("can leave done jobs in the jobs list if the same job appears again", done => {
            let storedJob1 = <Job>{id: "1", position: 1, state: JobState.done, wmisTimestamp: "foo" };

            storedTodoJobs = [storedJob1];

            let job1 = <Job>{id: "1", position: 1, wmisTimestamp: "foo"};

            jobCacheService.setWorkListJobs([job1])
                .then(() => jobCacheService.getJobsToDo())
                .then(jobsToDo => {
                    expect(jobsToDo).toEqual([storedJob1]);
                    done();
                });
        });

        it("can rebook jobs in the jobs list if the same job appears with a different visit id", done => {
            let storedJob1 = <Job>{id: "1", position: 1, state: JobState.done, wmisTimestamp: "foo"};

            storedTodoJobs = [storedJob1];

            let job1 = <Job>{id: "1", position: 1, wmisTimestamp: "bar"};

            jobCacheService.setWorkListJobs([job1])
                .then(() => jobCacheService.getJobsToDo())
                .then(jobsToDo => {
                    expect(jobsToDo).toEqual([job1]);
                    done();
                });
        });

        it("reposition jobs", done => {
            let storedJob1 = <Job>{id: "1", position: 1, state: JobState.enRoute};
            storedTodoJobs = [storedJob1];

            let job1 = <Job>{id: "1", position: 2};
            let job2 = <Job>{id: "2", position: 1};
            let job3 = <Job>{id: "3", position: 3};

            jobCacheService.setWorkListJobs([job1, job2, job3])
                .then(() => jobCacheService.getJobsToDo())
                .then(jobsToDo => {
                    expect(jobsToDo).toEqual([job2, storedJob1, job3]);
                    done();
                });
        });
    });

    describe("existsALiveJobNotInWorklist", () => {
        it("returns false if all jobs in the todo list are also in the worklist", async done => {
            storageServiceStub.getJobsToDo = sandbox.stub().resolves([<Job>{id: "1", state: JobState.idle}]);
            storageServiceStub.getWorkListJobApiFailures = sandbox.stub().resolves([<JobApiFailure>{id: "2"}]);
            storageServiceStub.getWorkListJobs = sandbox.stub().resolves([<Job>{ id: "1", position: 0}, <Job>{ id: "2", position: 1}]);

            expect(await jobCacheService.existsALiveJobNotInWorklist()).toBe(false);
            done();
        });

        it("returns true if a job in the todo list is not in the worklist", async done => {
            storageServiceStub.getJobsToDo = sandbox.stub().resolves([<Job>{id: "1", state: JobState.idle}, <Job>{id: "bad", state: JobState.idle}]);
            storageServiceStub.getWorkListJobApiFailures = sandbox.stub().resolves([<JobApiFailure>{id: "2"}]);
            storageServiceStub.getWorkListJobs = sandbox.stub().resolves([<Job>{ id: "1", position: 0}, <Job>{ id: "2", position: 1}]);

            expect(await jobCacheService.existsALiveJobNotInWorklist()).toBe(true);
            done();
        });

        it("returns true if a job in the failure list is not in the worklist", async done => {
            storageServiceStub.getJobsToDo = sandbox.stub().resolves([<Job>{id: "1", state: JobState.idle}]);
            storageServiceStub.getWorkListJobApiFailures = sandbox.stub().resolves([<JobApiFailure>{id: "2"}, <JobApiFailure>{id: "bad"}]);
            storageServiceStub.getWorkListJobs = sandbox.stub().resolves([<Job>{ id: "1", position: 0}, <Job>{ id: "2", position: 1}]);

            expect(await jobCacheService.existsALiveJobNotInWorklist()).toBe(true);
            done();
        });
    });

    describe("clearJobsToDo", () => {
        it("should not cause getJob to throw an unchained exception", done => {
            jobCacheService.clearJobsToDo()
            .then(() => jobCacheService.getJob("does-not-exist"))
            .catch(() => {
                // a properly rejected promise should be returned - not an un-controlled non-chain exception
                done();
            });
        });
    });
});
