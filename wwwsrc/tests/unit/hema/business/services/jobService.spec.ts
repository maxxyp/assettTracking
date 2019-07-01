/// <reference path="../../../../../typings/app.d.ts" />

import { EventAggregator } from "aurelia-event-aggregator";

import { JobService } from "../../../../../app/hema/business/services/jobService";
import { IFFTService } from "../../../../../app/hema/api/services/interfaces/IFFTService";
import { JobState } from "../../../../../app/hema/business/models/jobState";
import { Job } from "../../../../../app/hema/business/models/job";
import { BusinessException } from "../../../../../app/hema/business/models/businessException";
import { StateMachine } from "../../../../../app/hema/business/services//stateMachine/stateMachine";
import { IEngineerService } from "../../../../../app/hema/business/services/interfaces/IEngineerService";
import { IJobFactory } from "../../../../../app/hema/business/factories/interfaces/IJobFactory";
import { IJobCacheService } from "../../../../../app/hema/business/services/interfaces/IJobCacheService";
import { ICatalogService } from "../../../../../app/hema/business/services/interfaces/ICatalogService";
import { IBusinessRuleService } from "../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { QueryableBusinessRuleGroup } from "../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import { IPartFactory } from "../../../../../app/hema/business/factories/interfaces/IPartFactory";
import { IArchiveService } from "../../../../../app/hema/business/services/interfaces/IArchiveService";
import { Engineer } from "../../../../../app/hema/business/models/engineer";
import { Task } from "../../../../../app/hema/business/models/task";
import { DataState } from "../../../../../app/hema/business/models/dataState";
import { DataStateSummary } from "../../../../../app/hema/business/models/dataStateSummary";
import { JobNotDoingReason } from "../../../../../app/hema/business/models/jobNotDoingReason";
import { IJobStatusRequest } from "../../../../../app/hema/api/models/fft/jobs/status/IJobStatusRequest";
import { DateHelper } from "../../../../../app/hema/core/dateHelper";
import { Threading } from "../../../../../app/common/core/threading";
import { WorkRetrievalServiceConstants } from "../../../../../app/hema/business/services/constants/workRetrievalServiceConstants";
import { IPartsOrderedForTask } from "../../../../../app/hema/api/models/fft/jobs/orderparts/IPartsOrderedForTask";
import { IPartsOrderedTasks } from "../../../../../app/hema/api/models/fft/jobs/orderparts/IPartsOrderedTasks";
import { IJobUpdate } from "../../../../../app/hema/api/models/fft/jobs/jobupdate/IJobUpdate";
import { IVanStockService } from "../../../../../app/hema/business/services/interfaces/IVanStockService";
import { IFeatureToggleService } from "../../../../../app/hema/business/services/interfaces/IFeatureToggleService";
import { JobServiceConstants } from "../../../../../app/hema/business/services/constants/jobServiceConstants";
import { IPartsNotUsed } from "../../../../../app/hema/api/models/fft/jobs/jobupdate/IPartsNotUsed";

describe("the jobService class", () => {
    let sandbox: Sinon.SinonSandbox;
    let jobService: JobService;

    let fftServiceStub: IFFTService;
    let vanStockServiceStub: IVanStockService;
    let jobCacheServiceStub: IJobCacheService;
    let engineerServiceStub: IEngineerService;
    let jobFactoryStub: IJobFactory;
    let eventAggregatorStub: EventAggregator;
    let catalogServiceStub: ICatalogService;
    let businessRuleServiceStub: IBusinessRuleService;
    let partFactoryStub: IPartFactory;
    let archiveServiceStub: IArchiveService;
    let getBusinessRuleStub: Sinon.SinonStub;
    let stateMachineStub: StateMachine<JobState>;
    let threadingStub: Sinon.SinonStub;
    let featureToggleServiceStub: IFeatureToggleService;
    let origDelay: any;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        fftServiceStub = <IFFTService>{};
        jobCacheServiceStub = <IJobCacheService>{};
        engineerServiceStub = <IEngineerService>{};
        eventAggregatorStub = <EventAggregator>{};
        jobFactoryStub = <IJobFactory>{};
        catalogServiceStub = <ICatalogService>{};
        businessRuleServiceStub = <IBusinessRuleService>{};
        partFactoryStub = <IPartFactory>{};
        archiveServiceStub = <IArchiveService>{};
        stateMachineStub= <StateMachine<JobState>>{};
        
        eventAggregatorStub.subscribe = sandbox.stub();
        eventAggregatorStub.publish = sandbox.stub();
        jobFactoryStub.getJobStatusCode = sandbox.stub().resolves(null);
        // fftServiceStub.jobStatusUpdate = sandbox.stub().resolves(null);
        catalogServiceStub.getApplianceContractType = sandbox.stub().resolves("");

        let engineer = new Engineer();
        engineer.id = "11111111";
        engineerServiceStub.getCurrentEngineer = sandbox.stub().returns(Promise.resolve(engineer));

        archiveServiceStub.addUpdateJobState = sandbox.stub().resolves(Promise.resolve());

        let partsOrdered = {
            id: "111",
            fieldTaskId: "1222",
            deliverToSite: false,
            parts: [],
            tasks: [{ id: "11" }]
        };
        partFactoryStub.createPartsOrderedForTask = sandbox.stub().resolves(partsOrdered);
        partFactoryStub.getPartsConsumedOnJob = sandbox.stub().resolves([]);

        jobCacheServiceStub.getWorkListJobs = sandbox.stub().resolves([]);

        jobFactoryStub.createJobApiModel = sandbox.stub().resolves(null);

        fftServiceStub.orderPartsForJob = sandbox.stub().resolves(true);

        fftServiceStub.updateJob = sandbox.stub().resolves(undefined);

        let queryableRuleGroup = <QueryableBusinessRuleGroup>{};
        let getBusinessRuleListStub = queryableRuleGroup.getBusinessRuleList = sandbox.stub().returns([]);
        getBusinessRuleListStub.withArgs("appointmentRequiredActivityStatus").returns("IZ,IP,QP,IA,IF,IP,IH")
        getBusinessRuleStub = queryableRuleGroup.getBusinessRule = sandbox.stub();
        getBusinessRuleStub.withArgs("notDoingJobStatuses").returns("NA,VO");
        getBusinessRuleStub.withArgs("notDoingTaskStatuses").returns("XB,XC");
        getBusinessRuleStub.withArgs("NotVisitedOtherActivityStatus").returns("VO");
        getBusinessRuleStub.withArgs("statusNoVisit").returns("50");
        getBusinessRuleStub.withArgs("jobCompleteRefreshDelayMs").returns(7);
        getBusinessRuleStub.withArgs("intervalInMinutes").returns(1);
        getBusinessRuleStub.withArgs("jobDoingStatuses").returns("C,IA,IF,IH,IP,QP,WA");

        businessRuleServiceStub = <IBusinessRuleService>{};
        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(queryableRuleGroup);

        vanStockServiceStub = <IVanStockService>{};
        vanStockServiceStub.registerMaterialConsumption = sandbox.stub().resolves(null);
        vanStockServiceStub.registerMaterialReturn = sandbox.stub().resolves(null);


        featureToggleServiceStub = <IFeatureToggleService> {};
        featureToggleServiceStub.isAssetTrackingEnabled = sandbox.stub().returns(false);

        jobService = new JobService(
            engineerServiceStub, fftServiceStub,
            jobFactoryStub, jobCacheServiceStub, eventAggregatorStub,
            catalogServiceStub, businessRuleServiceStub,
            partFactoryStub, archiveServiceStub,
            vanStockServiceStub, featureToggleServiceStub
        );
        origDelay = Threading.delay;
        threadingStub = Threading.delay = sandbox.stub();
    });

    afterEach(() => {
        Threading.delay = origDelay;
        sandbox.restore();
    });

    it("can be created", () => {
        expect(jobService).toBeDefined();
    });

    describe("the setJobState function", () => {
        let fftServiceSpy: Sinon.SinonSpy;
        let job1: Job;

        beforeEach(() => {
            job1 = new Job();
            job1.id = "J1";
            job1.state = JobState.idle;
            job1.tasks = [<Task> {id: "232323", status: "C"}]

            jobCacheServiceStub.getJob = sandbox.stub().resolves(job1);
            jobCacheServiceStub.setJob = sandbox.stub().resolves(undefined);
            fftServiceSpy = fftServiceStub.jobStatusUpdate = sandbox.stub().resolves(undefined);
            stateMachineStub.trySetState = sandbox.stub().returns(true);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can be called", (done) => {
            jobCacheServiceStub.getJob = sandbox.stub().resolves(null);

            let methodSpy: Sinon.SinonSpy = sandbox.spy(jobService, "setJobState");

            jobService.setJobState("", JobState.arrived)
                .catch(() => {
                    expect(methodSpy.calledOnce).toBeTruthy();
                    done();
                });
        });

        it("can set state", (done) => {
            let methodSpy: Sinon.SinonSpy = sandbox.spy(jobService, "setJobState");

            jobService.setJobState("J1", JobState.enRoute)
                .then(() => {
                    expect(methodSpy.calledOnce).toBeTruthy();
                    done();
                })
                .catch((error) => {
                    fail("error: " + error);
                    done();
                });
        });

        it("should call API jobStatusUpdate if there is a jobStatus", (done) => {
            let methodSpy: Sinon.SinonSpy = sandbox.spy(jobService, "setJobState");
            jobFactoryStub.getJobStatusCode = sandbox.stub().resolves("foo");
            job1.state = JobState.arrived;
            jobService.setJobState("J1", JobState.complete)
                .then((jobState) => {
                    expect(methodSpy.calledOnce).toBeTruthy();
                    expect(fftServiceSpy.called).toBeTruthy();
                    done();
                });
        });

        it("should not call API jobStatusUpdate if there is a not a jobStatus", (done) => {
            let methodSpy: Sinon.SinonSpy = sandbox.spy(jobService, "setJobState");
            jobFactoryStub.getJobStatusCode = sandbox.stub().resolves(undefined);
            job1.state = JobState.arrived;
            jobService.setJobState("J1", JobState.complete)
                .then((jobState) => {
                    expect(methodSpy.calledOnce).toBeTruthy();
                    expect(fftServiceSpy.called).toBeFalsy();
                    done();
                });
        });

        it("reason should not be empty in jobStatusUpdate api call for VO activity status ", async (done) => {
            job1.tasks = [<Task>{status: "VO", report: "test report"}];
            job1.state = JobState.arrived;
            jobFactoryStub.getJobStatusCode = sandbox.stub().resolves("50");
            let request = <IJobStatusRequest>{
                                        data: {
                                            timestamp: DateHelper.toJsonDateTimeString(new Date()),
                                            statusCode: "50",
                                            jobId: "J1",
                                            visitId: undefined,
                                            reason: "test report"
                                        }
                                    };
            await jobService.setJobState("J1", JobState.complete);
            expect(fftServiceSpy.calledWith("J1", request)).toBeTruthy();
            done();
        });

        it("reason should be empty in jobStatusUpdate api call for other activity statuses", async (done) => {
            job1.tasks = [<Task>{status: "IP", report: "test report"}];
            job1.state = JobState.arrived;
            jobFactoryStub.getJobStatusCode = sandbox.stub().resolves("04");
            let request = <IJobStatusRequest>{
                                        data: {
                                            timestamp: DateHelper.toJsonDateTimeString(new Date()),
                                            statusCode: "04",
                                            jobId: "J1",
                                            visitId: undefined,
                                            reason: ""
                                        }
                                    };
            await jobService.setJobState("J1", JobState.complete);
            expect(fftServiceSpy.calledWith("J1", request)).toBeTruthy();
            done();
        });

        it("should delay before sending the worklist refresh request", async done => {
            job1.state = JobState.arrived;

            expect(threadingStub.called).toBe(false);
            await jobService.setJobState("J1", JobState.complete);
            expect(threadingStub.args[0][1]).toBe(7);

            let publishStub = eventAggregatorStub.publish as Sinon.SinonStub;
            publishStub.reset();

            let delayCallback : () => void = threadingStub.args[0][0];
            delayCallback();
            expect(publishStub.calledWith(WorkRetrievalServiceConstants.REQUEST_WORK_AND_REFRESH_WORK_LIST));
            done();
        });

        it("does not add parts ordered if job cancelled", async done => {

            let partsOrderedForTask = <IPartsOrderedForTask>{};
            partsOrderedForTask.id = "1";
            partsOrderedForTask.fieldTaskId = "1";

            let partsOrderedTasks = <IPartsOrderedTasks>{};
            partsOrderedTasks.tasks = [partsOrderedForTask];

            partFactoryStub.createPartsOrderedForTask = sandbox.stub().resolves(partsOrderedTasks);

            job1.tasks = [<Task>{status: "C", report: "test report"}];
            job1.jobNotDoingReason = JobNotDoingReason.taskNoAccessed;
            job1.state = JobState.arrived;

            const orderPartsForJobStub = fftServiceStub.orderPartsForJob = sandbox.stub().resolves(true);

            await jobService.setJobState("J1", JobState.complete);

            expect(orderPartsForJobStub.notCalled).toBe(true);

            done();
        });

        it("should call updateJob api for activity statues other than VO status", async (done) => {
            job1.state = JobState.arrived;
            jobFactoryStub.getJobStatusCode = sandbox.stub().resolves("04");

            jobCacheServiceStub.getWorkListJobs = sandbox.stub().resolves(<Job[]>[
                {
                    id: "J1",
                    specialInstructions: "mmm💩👨‍💻",
                    wmisTimestamp: "foo"
                }
            ]);

            jobFactoryStub.createJobApiModel = sandbox.stub().resolves(<IJobUpdate>{
                job: {
                    tasks: [
                        { report: "mmm💩👨‍💻"}
                    ]
                }
            });

            await jobService.setJobState("J1", JobState.complete);
            expect((fftServiceStub.updateJob as Sinon.SinonSpy).called).toBeTruthy();
            done();
        });

        it("should call updateJob api and not pass emojis", async (done) => {
            job1.state = JobState.arrived;
            jobFactoryStub.getJobStatusCode = sandbox.stub().resolves("04");
            jobFactoryStub.createJobApiModel = sandbox.stub().resolves(<IJobUpdate>{
                job: {
                    tasks: [
                        { report: "mmm💩👨‍💻"}
                    ]
                }
            });
            await jobService.setJobState("J1", JobState.complete);
            expect((fftServiceStub.updateJob as Sinon.SinonStub).args[0][1].data.job.tasks[0].report).toBe("mmm ");
            done();
        });

        it("should call updateJob api and pass emojis if they were in the original job", async (done) => {
            job1.state = JobState.arrived;
            jobFactoryStub.getJobStatusCode = sandbox.stub().resolves("04");

            jobCacheServiceStub.getWorkListJobs = sandbox.stub().resolves(<Job[]>[
                {
                    id: "J1",
                    specialInstructions: "mmm💩👨‍💻",
                    wmisTimestamp: "foo"
                }
            ]);

            jobFactoryStub.createJobApiModel = sandbox.stub().resolves(<IJobUpdate>{
                job: {
                    tasks: [
                        { report: "mmm💩👨‍💻"}
                    ]
                }
            });
            await jobService.setJobState("J1", JobState.complete);
            expect((fftServiceStub.updateJob as Sinon.SinonStub).args[0][1].data.job.tasks[0].report).toBe("mmm💩👨‍💻");
            done();
        });

        it("should not call updateJob api for VO activity status", async (done) => {
            job1.tasks = [<Task>{status: "VO", report: "test report"}];
            job1.state = JobState.arrived;
            jobFactoryStub.getJobStatusCode = sandbox.stub().resolves("02");

            await jobService.setJobState("J1", JobState.complete);
            expect((fftServiceStub.updateJob as Sinon.SinonSpy).called).toBeFalsy();
            done();
        });

        it("should save the job and not call jobupdate when setting enroute status", async (done) => {
            jobFactoryStub.getJobStatusCode = sandbox.stub().resolves("02");
            
            await jobService.setJobState("J1", JobState.enRoute);
            expect((fftServiceStub.jobStatusUpdate as Sinon.SinonSpy).called).toBeTruthy();
            expect((fftServiceStub.updateJob as Sinon.SinonSpy).called).toBeFalsy();
            expect((jobCacheServiceStub.setJob as Sinon.SinonSpy).called).toBeTruthy();
            expect((eventAggregatorStub.publish as Sinon.SinonSpy).calledWith(JobServiceConstants.JOB_STATE_CHANGED));
            done();
        });

        it("should save the job and not call jobupdate when setting arrived status", async (done) => {
            job1.state = JobState.enRoute;
            jobFactoryStub.getJobStatusCode = sandbox.stub().resolves("03");
            
            await jobService.setJobState("J1", JobState.arrived);
            expect((fftServiceStub.jobStatusUpdate as Sinon.SinonSpy).called).toBeTruthy();
            expect((fftServiceStub.updateJob as Sinon.SinonSpy).called).toBeFalsy();
            expect((jobCacheServiceStub.setJob as Sinon.SinonSpy).called).toBeTruthy();
            expect((eventAggregatorStub.publish as Sinon.SinonSpy).calledWith(JobServiceConstants.JOB_STATE_CHANGED));
            done();
        });

        it("should not call material consumption and material return endpoints when assset tracking is not enabled", async (done) => {
            job1.state = JobState.arrived;
            jobFactoryStub.getJobStatusCode = sandbox.stub().resolves("04");
            jobFactoryStub.createJobApiModel = sandbox.stub().resolves(<IJobUpdate>{
                job: {
                    tasks: [
                        { report: "mmm💩👨‍💻"}
                    ]
                }
            });
            featureToggleServiceStub.isAssetTrackingEnabled = sandbox.stub().returns(true);
            await jobService.setJobState("J1", JobState.complete);
            expect((fftServiceStub.updateJob as Sinon.SinonSpy).called).toBeTruthy();
            expect((vanStockServiceStub.registerMaterialConsumption as Sinon.SinonSpy).called).toBeFalsy();
            expect((vanStockServiceStub.registerMaterialReturn as Sinon.SinonSpy).called).toBeFalsy();
            done();
        });

        it("should call material consumption and material return endpoints when assset tracking is not enabled", async (done) => {
            job1.state = JobState.arrived;
            jobFactoryStub.getJobStatusCode = sandbox.stub().resolves("04");
            jobFactoryStub.createJobApiModel = sandbox.stub().resolves(<IJobUpdate>{
                job: {
                    tasks: [
                        { report: "mmm💩👨‍💻",
                        partsNotUsed: [<IPartsNotUsed> {stockReferenceId: "1234",
                                        quantityNotUsed: 2,
                                        reasonCode: "ass" }]}
                    ]
                }
            });
            featureToggleServiceStub.isAssetTrackingEnabled = sandbox.stub().returns(true);
            partFactoryStub.getPartsConsumedOnJob = sandbox.stub().resolves(
                    [{ stockReferenceId: "12344", quantityConsumed: 2, isVanStock: true}]
                );
            await jobService.setJobState("J1", JobState.complete);
            expect((fftServiceStub.updateJob as Sinon.SinonSpy).called).toBeTruthy();
            expect((vanStockServiceStub.registerMaterialConsumption as Sinon.SinonSpy).called).toBeTruthy();
            expect((vanStockServiceStub.registerMaterialReturn as Sinon.SinonSpy).called).toBeTruthy();
            done();
        });

        it("should not call material consumption and material return endpoints when there are no consumption and return", async (done) => {
            job1.state = JobState.arrived;
            jobFactoryStub.getJobStatusCode = sandbox.stub().resolves("04");
            jobFactoryStub.createJobApiModel = sandbox.stub().resolves(<IJobUpdate>{
                job: {
                    tasks: [
                        { report: "mmm💩👨‍💻"}
                    ]
                }
            });
            featureToggleServiceStub.isAssetTrackingEnabled = sandbox.stub().returns(true);
            await jobService.setJobState("J1", JobState.complete);
            expect((fftServiceStub.updateJob as Sinon.SinonSpy).called).toBeTruthy();
            expect((vanStockServiceStub.registerMaterialConsumption as Sinon.SinonSpy).called).toBeFalsy();
            expect((vanStockServiceStub.registerMaterialReturn as Sinon.SinonSpy).called).toBeFalsy();
            done();
        });

        it("should not call material consumption and material return endpoints when the jobNotDoingReason is not undefined", async (done) => {
            job1.state = JobState.arrived;
            job1.jobNotDoingReason = JobNotDoingReason.allTasksCancelled;
            jobFactoryStub.getJobStatusCode = sandbox.stub().resolves("04");
            jobFactoryStub.createJobApiModel = sandbox.stub().resolves(<IJobUpdate>{
                job: {
                    tasks: [
                        { report: "mmm💩👨‍💻"}
                    ]
                }
            });
            featureToggleServiceStub.isAssetTrackingEnabled = sandbox.stub().returns(true);
            await jobService.setJobState("J1", JobState.complete);
            expect((fftServiceStub.updateJob as Sinon.SinonSpy).called).toBeTruthy();
            expect((vanStockServiceStub.registerMaterialConsumption as Sinon.SinonSpy).called).toBeFalsy();
            expect((vanStockServiceStub.registerMaterialReturn as Sinon.SinonSpy).called).toBeFalsy();
            done();
        });

        it("job.state should be set back to arrived if there is any exception thrown while building job api model", async (done) => {
            job1.state = JobState.arrived;
            jobFactoryStub.createJobApiModel = sandbox.stub().throws(new BusinessException("jobFactory", "getJobStatusCode", "failed", undefined, undefined));
            featureToggleServiceStub.isAssetTrackingEnabled = sandbox.stub().returns(true);
            await jobService.setJobState("J1", JobState.complete);      
            expect(job1.state).toBe(JobState.arrived);
            done();
        });

        it("should publish appToastAdded and JOB_STATE_CHANGED event if there is any exception thrown while building job api model", async (done) => {
            job1.state = JobState.arrived;
            jobFactoryStub.createJobApiModel = sandbox.stub().throws(new BusinessException("jobFactory", "getJobStatusCode", "failed", undefined, undefined));
            featureToggleServiceStub.isAssetTrackingEnabled = sandbox.stub().returns(true);
            await jobService.setJobState("J1", JobState.complete);      
            expect((eventAggregatorStub.publish as Sinon.SinonSpy).args[0][0]).toBe("appToastAdded");     
            expect((eventAggregatorStub.publish as Sinon.SinonSpy).args[0][1].title).toBe("Job completion");    
            expect((eventAggregatorStub.publish as Sinon.SinonSpy).args[0][1].content.indexOf("We have detected an issue completing this job")).toBeGreaterThan(-1);    
            done();
        });

        it("should save the job", async (done) => {
            job1.state = JobState.arrived;
            jobFactoryStub.createJobApiModel = sandbox.stub().throws(new BusinessException("jobFactory", "getJobStatusCode", "failed", undefined, undefined));
            featureToggleServiceStub.isAssetTrackingEnabled = sandbox.stub().returns(true);
            await jobService.setJobState("J1", JobState.complete);      
            jobFactoryStub.createJobApiModel = sandbox.stub().resolves(<IJobUpdate>{
                job: {
                    tasks: [
                        { report: "mmm💩👨‍💻"}
                    ]
                }
            });
            await jobService.setJobState("J1", JobState.complete);      
            expect((jobCacheServiceStub.setJob as Sinon.SinonSpy).called).toBeTruthy();
            done();
        });
    });

    describe("the getJobTargetStates function", () => {
        beforeEach(() => {
            let job1: Job = new Job();
            job1.id = "J1";
            job1.state = JobState.idle;

            jobCacheServiceStub.getJob = sandbox.stub().resolves(job1);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can be called", (done) => {
            jobCacheServiceStub.getJob = sandbox.stub().resolves(null);

            let methodSpy: Sinon.SinonSpy = sandbox.spy(jobService, "getJobTargetStates");

            jobService.getJobTargetStates("")
                .catch(() => {
                    expect(methodSpy.calledOnce).toBeTruthy();
                    done();
                });
        });

        it("cant get job target states", (done) => {

            jobCacheServiceStub.getJob = sandbox.stub().resolves(null);

            jobService.getJobTargetStates("J1")
                .catch((error) => {
                    expect(error instanceof BusinessException).toBeTruthy();
                    done();
                });
        });

        it("can get job target states", (done) => {
            jobService.getJobTargetStates("J1")
                .then((jobStates) => {
                    expect(jobStates.length).toBeGreaterThan(0);
                    done();
                });
        });
    });

    describe("the getJobState function", () => {
        let jobBusinessModels: Job[];

        beforeEach(() => {
            jobBusinessModels = [];

            let job1: Job = new Job();
            job1.id = "J1";
            job1.state = JobState.idle;
            jobBusinessModels.push(job1);

            jobCacheServiceStub.getJob = sandbox.stub().resolves(job1);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can be called", (done) => {
            jobCacheServiceStub.getJob = sandbox.stub().resolves(null);

            let methodSpy: Sinon.SinonSpy = sandbox.spy(jobService, "getJobState");

            jobService.getJobState("")
                .catch(() => {
                    expect(methodSpy.calledOnce).toBeTruthy();
                    done();
                });
        });

        it("cant get job state", (done) => {

            jobCacheServiceStub.getJob = sandbox.stub().resolves(null);

            jobService.getJobState("J1")
                .catch((error) => {
                    expect(error instanceof BusinessException).toBeTruthy();
                    done();
                });
        });

        it("can get job state", (done) => {
            let job = new Job();
            job.state = JobState.idle;

            jobCacheServiceStub.getJob = sandbox.stub().resolves(job);

            jobService.getJobState("J1")
                .then((jobState) => {
                    expect(jobState.value).toEqual(JobState.idle);
                    done();
                });
        });
    });

    describe("the getActiveJobId function", () => {
        let job1: Job;
        let jobBusinessModels: Job[];

        beforeEach(() => {
            jobBusinessModels = [];

            job1 = new Job();
            job1.id = "J1";
            job1.state = JobState.enRoute;

            jobBusinessModels.push(job1);

            jobCacheServiceStub.getJobsToDo = sandbox.stub().resolves(jobBusinessModels);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can be called", (done) => {
            let methodSpy: Sinon.SinonSpy = sandbox.spy(jobService, "getActiveJobId");

            jobService.getActiveJobId()
                .then(() => {
                    expect(methodSpy.calledOnce).toBeTruthy();
                    done();
                });
        });

        it("will return active job id", (done) => {
            jobService.getActiveJobId()
                .then((jobId) => {
                    expect(jobId).toEqual("J1");
                    done();
                });
        });

        it("will return null for active job id", (done) => {

            let job1: Job = new Job();
            job1.id = "J1";
            job1.state = JobState.idle;

            jobCacheServiceStub.getJobsToDo = sandbox.stub().resolves([job1]);

            jobService.getActiveJobId()
                .then((jobId) => {
                    expect(jobId).toEqual(null);
                    done();
                });
        });
    });

    describe("the saveJob function", () => {
        let job1: Job;

        beforeEach(() => {
            job1 = new Job();
            job1.id = "J1";
            job1.state = JobState.enRoute;

            jobCacheServiceStub.getJob = sandbox.stub().resolves(job1);
            jobCacheServiceStub.setJob = sandbox.stub();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can save job", (done) => {
            let methodSpy: Sinon.SinonSpy = jobCacheServiceStub.setJob = sandbox.stub().resolves(undefined);
            jobService.setJob(job1)
                .then(() => {
                    expect(methodSpy.calledOnce).toBeTruthy();
                    done();
                });
        });
    });

    describe("the loadJob function", () => {
        let job1: Job;

        beforeEach(() => {
            job1 = new Job();
            job1.id = "J1";
            job1.state = JobState.enRoute;

            jobCacheServiceStub.getJob = sandbox.stub().resolves(job1);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can be called", (done) => {
            let methodSpy: Sinon.SinonSpy = sandbox.spy(jobService, "getJob");

            jobService.getJob("J1")
                .then((job) => {
                    expect(methodSpy.calledOnce).toBeTruthy();
                    done();
                });
        });

        it("will return null when no matching job is found", (done) => {
            jobCacheServiceStub.getJob = sandbox.stub().rejects(new BusinessException(null, null, null, null, null));

            jobService.getJob("J2")
                .then((job) => {
                    fail("Should throw");
                    done();
                })
                .catch((error) => {
                    expect(error instanceof BusinessException).toBeTruthy();
                    done();
                });
        });

        it("can load job", (done) => {
            jobService.getJob("J1")
                .then((job) => {
                    expect(job).toBeDefined();
                    expect(job.id).toEqual("J1");
                    done();
                });
        });
    });

    describe("the getJobsToDo function", () => {
        let job1: Job;
        let jobBusinessModels: Job[];

        beforeEach(() => {
            jobBusinessModels = [];

            job1 = new Job();
            job1.id = "J1";
            job1.state = JobState.enRoute;

            jobBusinessModels.push(job1);

            jobCacheServiceStub.getJobsToDo = sandbox.stub().resolves(jobBusinessModels);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can be called", (done) => {
            let methodSpy: Sinon.SinonSpy = sandbox.spy(jobService, "getJobsToDo");

            jobService.getJobsToDo()
                .then((jobs) => {
                    expect(methodSpy.calledOnce).toBeTruthy();
                    done();
                });
        });

        it("will reject when storage service errors", (done) => {

            jobCacheServiceStub.getJobsToDo = sandbox.stub().rejects(new BusinessException("", "", "testing", null, null));

            jobService.getJobsToDo()
                .catch((error) => {
                    expect(error instanceof BusinessException).toBeTruthy();
                    done();
                });
        });

        it("will return jobs", (done) => {
            jobService.getJobsToDo()
                .then((jobs) => {
                    expect(jobs).toBeDefined();
                    expect(jobs.length).toEqual(1);
                    done();
                });
        });
    });

    describe("the areAllJobsDone function", () => {

        it("no jobs available returns empty array, returns true", (done) => {
            jobCacheServiceStub.getJobsToDo = sandbox.stub().resolves([]);
            jobService.areAllJobsDone()
                .then((allDone) => {
                    expect(allDone).toBeTruthy();
                    done();
                });
        });

        it("no jobs available returns undefined, returns true", (done) => {
            jobCacheServiceStub.getJobsToDo = sandbox.stub().resolves(undefined);
            jobService.areAllJobsDone()
                .then((allDone) => {
                    expect(allDone).toBeTruthy();
                    done();
                });
        });

        it("has jobs available, returns false", (done) => {
            jobCacheServiceStub.getJobsToDo = sandbox.stub().resolves([<Job>{}]);
            jobService.areAllJobsDone()
                .then((allDone) => {
                    expect(allDone).toBeFalsy();
                    done();
                });
        });
    });

    describe("setJobNoAccessed", () => {

        let job: Job;
        let task1: Task;
        let task2: Task

        beforeEach(() => {
            task1 = <Task>{};
            task2 = <Task> {};
            job = <Job>{
                tasks: [task1, task2]
            }

            businessRuleServiceStub.getRuleGroup = sandbox.stub().resolves({
                notDoingJobStatuses: "foo,bar",
                notDoingTaskStatuses: "buzz,baz"
            });
        });

        it("should set a job as no accessed if one task is no accessed", done => {
            task1.isTaskThatSetsJobAsNoAccessed = true;
            task1.status = "foo";
            task1.dataState = DataState.valid;

            jobService.setJobNoAccessed(job)
                .then(() => {
                   expect(job.jobNotDoingReason).toBe(JobNotDoingReason.taskNoAccessed) ;

                   expect(task1.status).toBe("foo");
                   expect(task1.dataState).toBe(DataState.valid);


                   expect(task2.status).toBe("foo");
                   expect(task2.dataState).toBe(DataState.dontCare);

                   expect(DataStateSummary.dataStateCompletionOverrideGroup).toBe("activities");
                   done();
                });
        })

        it("should set a job as no accessed if all tasks are cancelled", done => {
            task1.isNotDoingTask = true;
            task2.isNotDoingTask = true;
            task1.status = "buzz";
            task2.status = "baz";
            jobService.setJobNoAccessed(job)
                .then(() => {
                   expect(job.jobNotDoingReason).toBe(JobNotDoingReason.allTasksCancelled);
                   expect(task1.status).toBe("buzz");
                   expect(task2.status).toBe("baz");
                   expect(DataStateSummary.dataStateCompletionOverrideGroup).toBe("activities");
                   done();
                });
        });

        // see DF_1834 - on no access, onSiteTime should never be set to null

        it("should retain onSiteTime when there is no access", done => {

            task1.isTaskThatSetsJobAsNoAccessed = true;

            jobService.setJobNoAccessed(job)
                .then(() => {
                    expect(job.onsiteTime).not.toBeNull();
                    done();
                });
        });

        it("should unset a no accessed job if the no accessing task is reset", done => {
            job.jobNotDoingReason = JobNotDoingReason.taskNoAccessed;
            DataStateSummary.dataStateCompletionOverrideGroup = "activities";

            task1.status = "statusX";
            task1.dataState = DataState.valid;

            task2.status = "foo";
            task1.dataState = DataState.valid;

            jobService.setJobNoAccessed(job)
                .then(() => {
                    expect(job.jobNotDoingReason).toBeFalsy();

                    expect(task1.status).toBe("statusX");
                    expect(task1.dataState).toBe(DataState.valid);

                    expect(task2.status).toBeUndefined();
                    expect(task2.dataState).toBe(DataState.notVisited);

                    expect(DataStateSummary.dataStateCompletionOverrideGroup).toBeUndefined();
                    done();
                });
        })

        it("should unset a no accessed job if one of the cancelling jobs is reset", done => {
            task1.isNotDoingTask = true;
            task2.isNotDoingTask = false;
            job.jobNotDoingReason = JobNotDoingReason.allTasksCancelled;
            DataStateSummary.dataStateCompletionOverrideGroup = "activities";
            jobService.setJobNoAccessed(job)
                .then(() => {
                    expect(job.jobNotDoingReason).toBeFalsy();
                    expect(DataStateSummary.dataStateCompletionOverrideGroup).toBeUndefined();
                    done();
                });
        })
    })

    describe("requiresAppointment method", () => {

        let job1: Job;
        beforeEach(() => {
            job1 = new Job();
            job1.id = "J1";
            job1.state = JobState.idle;

            let task = new Task(true, false);
            job1.tasks = [task];
            jobCacheServiceStub.getJob = sandbox.stub().resolves(job1);
       });

        afterEach(() => {
            sandbox.restore();
        });

        it("should return true as appointment booking is mandatory for tasks status IA", async done => {
            job1.tasks[0].status = "IA";
            let requireAppointment = await jobService.requiresAppointment("J1");
            expect(requireAppointment).toBe(true);
            done();
        });

        it("should return false as appointment booking not mandatory for tasks status WA", async done => {
            job1.tasks[0].status = "WA";
            let requireAppointment = await jobService.requiresAppointment("J1");
            expect(requireAppointment).toBe(false);
            done();
        });
    });

    describe("checkIfJobFinishTimeNeedsToBeUpdated method", () => {
//        let job1: Job;
        // let getTimeDiffInMinsSpy: Sinon.SinonSpy;
    //     beforeEach(() => {
    //         job1 = new Job();
    //         job1.id = "J1";
    //         job1.state = JobState.arrived;

    //         let task = new Task(true, false);
    //         task.status = "C";
    //         job1.tasks = [task];
    //         jobCacheServiceStub.getJobsToDo = sandbox.stub().resolves([job1]);
    //         getTimeDiffInMinsSpy = sandbox.spy(DateHelper, "getTimeDiffInMins");
    //    });

        afterEach(() => {
            sandbox.restore();
        });

        // it("should call DateHelper.getTimeDiffInMins method if the selected task status is equal to one of the jobDoingStatuses business rule", async (done) => {
        //     job1.tasksEndTime = moment(new Date()).subtract(4, "minutes").format("HH:mm");
        //     await jobService.checkIfJobFinishTimeNeedsToBeUpdated();
        //     expect(getTimeDiffInMinsSpy.called).toBeTruthy();
        //     done();
        // });

        // it("should return false and not call DateHelper.getTimeDiffInMins method if the cancelled job/task status is selected", async (done) => {
        //     job1.tasks[0].status = "NA";
        //     job1.tasksEndTime = moment(new Date()).subtract(4, "minutes").format("HH:mm");
        //     let needsUpdate = await jobService.checkIfJobFinishTimeNeedsToBeUpdated();
        //     expect(getTimeDiffInMinsSpy.called).toBeFalsy();
        //     expect(needsUpdate).toBeFalsy();
        //     done();
        // });

        // it("should return false and not call DateHelper.getTimeDiffInMins method if the cancelled job/task status is selected", async (done) => {
        //     job1.tasks[0].status = "XC";
        //     let task = new Task(true, false);
        //     task.status = "XB";
        //     job1.tasks.push(task);
        //     job1.tasksEndTime = moment(new Date()).subtract(4, "minutes").format("HH:mm");
        //     let needsUpdate = await jobService.checkIfJobFinishTimeNeedsToBeUpdated();
        //     expect(getTimeDiffInMinsSpy.called).toBeFalsy();
        //     expect(needsUpdate).toBeFalsy();
        //     done();
        // });

        // it("should call DateHelper.getTimeDiffInMins method if the job doing status is selected for one of the tasks", async (done) => {
        //     let task = new Task(true, false);
        //     task.status = "XB";
        //     job1.tasks.push(task);
        //     job1.tasksEndTime = moment(new Date()).subtract(4, "minutes").format("HH:mm");
        //     await jobService.checkIfJobFinishTimeNeedsToBeUpdated();
        //     expect(getTimeDiffInMinsSpy.called).toBeTruthy();
        //     done();
        // });

        // it("should return false as jobEndTime is well within the acceptable limit", async done => {
        //     job1.tasksEndTime = moment(new Date()).subtract(4, "minutes").format("HH:mm");
        //     let needsUpdate = await jobService.checkIfJobFinishTimeNeedsToBeUpdated();
        //     expect(needsUpdate).toBeFalsy();
        //     done();
        // });

        // it("should return true as the current system time is 5 mins more than jobEndTime", async done => {
        //     job1.tasksEndTime = moment(new Date()).subtract(5, "minutes").format("HH:mm");
        //     let needsUpdate = await jobService.checkIfJobFinishTimeNeedsToBeUpdated();
        //     expect(needsUpdate).toBeTruthy();
        //     done();
        // });

        // it("should return false as the jobEndTime is in line with the current system time", async done => {
        //     job1.tasksEndTime = moment(new Date()).format("HH:mm");

        //     let needsUpdate = await jobService.checkIfJobFinishTimeNeedsToBeUpdated();
        //     expect(needsUpdate).toBeFalsy();
        //     done();
        // });

        // it("should return false as the jobEndTime is 5 mins more than the current system time", async done => {
        //     job1.tasksEndTime = moment(new Date()).add(5, "minutes").format("HH:mm");

        //     let needsUpdate = await jobService.checkIfJobFinishTimeNeedsToBeUpdated();
        //     expect(needsUpdate).toBeFalsy();
        //     done();
        // });
    });

    describe("getDataStateSummary", () => {
        let job1: Job;
        let setJobNoAccessedSpy: Sinon.SinonSpy;
        beforeEach(() => {
            setJobNoAccessedSpy = sandbox.spy(jobService, "setJobNoAccessed");
            job1 = new Job();
            job1.id = "J1";
            job1.state = JobState.arrived;
            job1.tasks = [new Task(true, false), new Task(true, false)];
            jobCacheServiceStub.getJob = sandbox.stub().resolves(job1);
       });

       afterEach(() => {
        sandbox.restore();
       });

       it("should call setJobNoAccessed method if jobNotDoingReason is defined and dataStateCompletionOverrideGroup is undefined and job state is arrived", async done => {
            job1.jobNotDoingReason = JobNotDoingReason.taskNoAccessed;;
            DataStateSummary.dataStateCompletionOverrideGroup = undefined;
            job1.tasks[0].status = "NA";
            job1.tasks[0].isTaskThatSetsJobAsNoAccessed = true;
            job1.state = JobState.arrived;
            await jobService.getDataStateSummary("J1");
            expect(setJobNoAccessedSpy.called).toBeTruthy();
            expect(DataStateSummary.dataStateCompletionOverrideGroup).toBeDefined();
            done();
       });

       it("should not call setJobNoAccessed method if the job state is anyhing other than arrived", async done => {
            job1.jobNotDoingReason = JobNotDoingReason.taskNoAccessed;;
            DataStateSummary.dataStateCompletionOverrideGroup = undefined;
            job1.state = JobState.done;
            await jobService.getDataStateSummary("J1");
            expect(setJobNoAccessedSpy.called).toBeFalsy();
            done();
        });

       it("should not call setJobNoAccessed method if jobNotDoingReason and dataStateCompletionOverrideGroup are defined", async done => {
            job1.jobNotDoingReason = JobNotDoingReason.taskNoAccessed;;
            DataStateSummary.dataStateCompletionOverrideGroup = "activities";
            await jobService.getDataStateSummary("J1");
            expect(setJobNoAccessedSpy.called).toBeFalsy();
            done();
        });

        it("should not call setJobNoAccessed method if jobNotDoingReason is undefined", async done => {
            job1.jobNotDoingReason = undefined;
            await jobService.getDataStateSummary("J1");
            expect(setJobNoAccessedSpy.called).toBeFalsy();
            done();
        });
    });
});
