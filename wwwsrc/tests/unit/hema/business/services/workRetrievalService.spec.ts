/// <reference path="../../../../../typings/app.d.ts" />

import {WorkRetrievalService} from "../../../../../app/hema/business/services/workRetrievalService";
import {IEngineerService} from "../../../../../app/hema/business/services/interfaces/IEngineerService";
import {IMessageService} from "../../../../../app/hema/business/services/interfaces/IMessageService";
import {IFFTService} from "../../../../../app/hema/api/services/interfaces/IFFTService";
import {IJobCacheService} from "../../../../../app/hema/business/services/interfaces/IJobCacheService";
import {IConfigurationService} from "../../../../../app/common/core/services/IConfigurationService";
import {EventAggregator} from "aurelia-event-aggregator";
import {IJobFactory} from "../../../../../app/hema/business/factories/interfaces/IJobFactory";
import {IBusinessRuleService} from "../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import {QueryableBusinessRuleGroup} from "../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import {Engineer} from "../../../../../app/hema/business/models/engineer";
import {IJob} from "../../../../../app/hema/api/models/fft/jobs/IJob";
import {IJobHistory} from "../../../../../app/hema/api/models/fft/jobs/history/IJobHistory";
import {Job} from "../../../../../app/hema/business/models/job";
import {IHemaConfiguration} from "../../../../../app/hema/IHemaConfiguration";
import { IWorkListItem } from "../../../../../app/hema/api/models/fft/engineers/worklist/IWorkListItem";
import { Threading } from "../../../../../app/common/core/threading";
import { WorkRetrievalTracker } from "../../../../../app/hema/business/services/workRetrievalTracker";
import { JobPartsCollection } from "../../../../../app/hema/business/models/jobPartsCollection";
import { ToastManager } from "../../../../../app/common/ui/elements/toastManager";
import { WorkRetrievalRequestingStatus } from "../../../../../app/hema/business/services/workRetrievalRequestingStatus";
import { IPartCollectionResponse } from "../../../../../app/hema/api/models/fft/jobs/parts/IPartCollectionResponse";

describe("the workRetrievalService class", () => {
    let sandbox: Sinon.SinonSandbox;

    let fftServiceStub: IFFTService;
    let jobCacheServiceStub: IJobCacheService;
    let engineerServiceStub: IEngineerService;
    let eventAggregatorStub: EventAggregator;
    let jobFactoryStub: IJobFactory;
    let businessRulesServiceStub: IBusinessRuleService;
    let messageServiceStub: IMessageService;
    let configurationServiceStub: IConfigurationService;
    let workRetrievalService: WorkRetrievalService;
    let apiJob: IJob;
    let jobStatusUpdateSpy: Sinon.SinonSpy;
    let requestWorkSpy: Sinon.SinonSpy;

    let getWorklistStub: Sinon.SinonStub;
    let getJobStub: Sinon.SinonStub;
    let configObject: IHemaConfiguration;
    let tracker: WorkRetrievalTracker;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        engineerServiceStub = <IEngineerService>{};

        messageServiceStub = <IMessageService>{};
        messageServiceStub.updateMessages = sandbox.stub();

        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.subscribe = sandbox.stub();
        eventAggregatorStub.publish = sandbox.stub();

        jobFactoryStub = <IJobFactory>{};
        jobFactoryStub.getJobStatusCode = sandbox.stub().resolves(null);

        jobFactoryStub.createJobBusinessModel = (worklistItem: IWorkListItem, apiModel: IJob, apiHistoryModel: IJobHistory) => {
            let job = <Job>{ id: worklistItem.id, visit: {}};
            job.visit.id = apiModel.visit.id;
            job.wmisTimestamp = worklistItem.timestamp;
            return Promise.resolve(job);
        };

        jobFactoryStub.createPartCollectionBusinessModel = (worklistItem: IWorkListItem,
                                                            partApiModel: IPartCollectionResponse) =>
              <JobPartsCollection>{ id: worklistItem.id, wmisTimestamp: "2"};

        apiJob = <IJob>{ visit: { id: "2" }};

        fftServiceStub = <IFFTService>{};
        getWorklistStub =  fftServiceStub.getWorkList = sandbox.stub()
        jobStatusUpdateSpy = fftServiceStub.jobStatusUpdate = sandbox.stub().resolves(null);
        getJobStub = fftServiceStub.getJob = sandbox.stub().resolves(apiJob);
        fftServiceStub.getJobHistory = sandbox.stub().resolves(<IJobHistory>{});
        requestWorkSpy = fftServiceStub.requestWork = sandbox.stub().resolves(undefined);
        const apiJobPartCollection = <IPartCollectionResponse>{data:{}};
        fftServiceStub.getPartsCollection = sandbox.stub().resolves(apiJobPartCollection);

        let storageJobs: Job[] = [];
        jobCacheServiceStub = <IJobCacheService>{};
        jobCacheServiceStub.getWorkListJobs = sandbox.stub().resolves(storageJobs);
        jobCacheServiceStub.setWorkListJobs = (jobs) => {
            storageJobs = jobs;
            return Promise.resolve();
        };
        jobCacheServiceStub.setWorkListJobApiFailures = sandbox.stub();

        let storagePartsCollections: JobPartsCollection[] = [];
        jobCacheServiceStub.getPartsCollections = sandbox.stub().resolves(storagePartsCollections);
        jobCacheServiceStub.setPartsCollections = (partsCollections) => {
            storagePartsCollections = partsCollections;
            return Promise.resolve();
        };

        let ruleGroup = <QueryableBusinessRuleGroup>{};
        ruleGroup.getBusinessRuleList = sandbox.stub().returns([]);

        businessRulesServiceStub = <IBusinessRuleService>{};
        let businessRules: { [key: string]: any } = {
            "statusTaskAcknowledged": "00",
            "workTypeJob": "Y",
            "statusAllocated": "X",
            "workTypePartsCollection": "y",
            "statusToCollect": "x"
        };

        businessRulesServiceStub.getRuleGroup = sandbox.stub().resolves(businessRules);

        engineerServiceStub.getCurrentEngineer = sandbox.stub().resolves(<Engineer>{ isSignedOn: true });

        configurationServiceStub = <IConfigurationService>{};

        configObject = <IHemaConfiguration>{
            workListPostRequestWorkPollingIntervals: [0, 0],
            workListPollingInterval: 0
        };

        configurationServiceStub.getConfiguration = sandbox.stub().returns(configObject);

        let toastManagerStub = <ToastManager> {};
        toastManagerStub.closeToast = sandbox.stub();

        tracker = new WorkRetrievalTracker(configurationServiceStub);

        workRetrievalService = new WorkRetrievalService(engineerServiceStub,
            fftServiceStub, businessRulesServiceStub, jobFactoryStub, jobCacheServiceStub, eventAggregatorStub,
            messageServiceStub, configurationServiceStub,
            tracker, toastManagerStub);
    });

    afterEach(() => {
        workRetrievalService.stopStarRefreshWorkList(false);
        sandbox.restore();
    });

    it("can be called", () => {
        expect(workRetrievalService).toBeDefined();
    });

    describe("initialise and stopStarRefreshWorkList", () => {

        it("initialise can start and stop worklist polling", async done => {

            let threadingStartStub = Threading.startTimer = sandbox.stub().returns(987654321);
            let threadingStopSpy = Threading.stopTimer = sandbox.spy();
            let refreshSpy = workRetrievalService.refreshWorkList = sandbox.spy();
            configObject.workListPollingInterval = 123456;

            // initialise behaviour
            await workRetrievalService.initialise();

            threadingStartStub.args[0][0]();
            expect(threadingStartStub.called).toBe(true);
            expect(threadingStartStub.args[0][1]).toBe(123456);
            expect(refreshSpy.called).toBe(true);

            // stop behaviour
            workRetrievalService.stopStarRefreshWorkList(false);

            expect(threadingStopSpy.args[0][0]).toBe(987654321)

            done();
        });

    });

    describe("request for work", () => {

        beforeEach(() => {
            getWorklistStub.onFirstCall().returns(Promise.resolve({
                meta: {
                    modifiedTimestamp: "foo"
                },
                data: {
                    memolist: [],
                    list: [{id: "1", status: "X", workType: "Y"}]
                }
            }));
        });

        it("should request work and get a baseline timestamp only when one does not exist", async done => {
            await workRetrievalService.initialise();
            await workRetrievalService.sendRequestWorkAndPollWorkList();
            // called twice, once to establish a base timestamp and once for the actual poll
            expect(getWorklistStub.callCount).toBe(2);
            await workRetrievalService.sendRequestWorkAndPollWorkList();
            // only one more worklist poll this time (not the baseline one as we should have a timestamp)
            expect(getWorklistStub.callCount).toBe(3);
            expect(tracker.requestingStatus).toBe(WorkRetrievalRequestingStatus.notRequesting);
            done();
        });

        it("should not do anything if the engineer is not working", async done => {
            await workRetrievalService.initialise();
            engineerServiceStub.getCurrentEngineer = sandbox.stub().resolves(<Engineer>{ isSignedOn: true, status: "foo" });
            await workRetrievalService.sendRequestWorkAndPollWorkList();
            expect(getWorklistStub.called).toBe(false);
            done();
        });

        it("should not leave the status as requesting if requestwork throws (eg the user is offline)", async done => {
            await workRetrievalService.initialise();
            getWorklistStub = fftServiceStub.getWorkList = sandbox.stub().rejects(undefined);
            fftServiceStub.requestWork = sandbox.stub().rejects(undefined);
            await workRetrievalService.sendRequestWorkAndPollWorkList();
            // called twice, once to establish a base timestamp and once for the actual poll
            expect(getWorklistStub.callCount).toBe(1); // only the preflight worklist request is made
            expect(tracker.requestingStatus).toBe(WorkRetrievalRequestingStatus.notRequesting);
            done();
        });

        it("should cope if worklist response errors the first time during polling i.e. it should poll beyond 404s", done => {

            getWorklistStub.onFirstCall().throws();
            getWorklistStub.onSecondCall().throws();

            getWorklistStub.onThirdCall().returns(Promise.resolve({
                meta: {
                    modifiedTimestamp: "foo"
                },
                data: {
                    memolist: [],
                    list: [{id: "1", status: "X", workType: "Y", timestamp:"xxx"}]
                }
            }));

            workRetrievalService.initialise()
            .then(() => workRetrievalService.sendRequestWorkAndPollWorkList())
            .then(() => {
                expect(getJobStub.called).toBe(true);
                expect(getJobStub.args[0][0]).toBe("1");
                expect(tracker.requestingStatus).toBe(WorkRetrievalRequestingStatus.notRequesting);
                done();
            });
        });
    });

    describe("refreshWorkList", () => {

        describe("retrieving jobs", () => {

            beforeEach(() => {
                getWorklistStub.onFirstCall().returns(Promise.resolve({
                    meta: {
                        modifiedTimestamp: "foo"
                    },
                    data: {
                        memolist: [],
                        list: [
                            {id: "1", status: "X", workType: "Y", timestamp: "1"},
                            {id: "2", status: "x", workType: "y", timestamp: "1"}
                        ]
                    }
                }));

                getWorklistStub.onSecondCall().returns(Promise.resolve({
                    meta: {
                        modifiedTimestamp: "bar"
                    },
                    data: {
                        memolist: [],
                        list: [
                            {id: "1", status: "X", workType: "Y", timestamp: "2" },
                            {id: "2", status: "x", workType: "y", timestamp: "2"}
                        ]
                    }
                }));
            });

             it("should place new jobs and partsCollection in storage", (done) => {
                workRetrievalService.initialise()
                .then(() => workRetrievalService.refreshWorkList())
                .then(() => jobCacheServiceStub.getWorkListJobs())
                .then((storedJobs) => {
                    expect(storedJobs.length).toBe(1);
                    expect(storedJobs[0].id).toBe("1");
                })
                .then(() => jobCacheServiceStub.getPartsCollections())
                .then((partsCollections) => {
                    expect(partsCollections.length).toBe(1);
                    expect(partsCollections[0].id).toBe("2");
                    expect(tracker.requestingStatus).toBe(WorkRetrievalRequestingStatus.notRequesting);
                    done();
                });
            });

            it("should place a new job in storage and be able to update the job on a subsequent call", (done) => {
                workRetrievalService.initialise()
                .then(() => workRetrievalService.refreshWorkList())
                .then(() => jobCacheServiceStub.getWorkListJobs())
                .then((storedJobs) => {
                    expect(storedJobs.length).toBe(1);
                    expect(storedJobs[0].id).toBe("1");
                    expect(storedJobs[0].visit.id).toBe("2");
                    expect(jobStatusUpdateSpy.calledOnce).toBe(true);
                    // update the job in WMIS
                    apiJob.visit.id = "3";
                })
                .then(() => workRetrievalService.refreshWorkList())
                .then(() => jobCacheServiceStub.getWorkListJobs())
                .then((storedJobs) => {
                    expect(storedJobs.length).toBe(1);
                    expect(storedJobs[0].id).toBe("1");
                    expect(storedJobs[0].visit.id).toBe("3");
                    expect(jobStatusUpdateSpy.calledTwice).toBe(true);
                })
                .then(() => jobCacheServiceStub.getPartsCollections())
                .then((partsCollections) => {
                    expect(partsCollections.length).toBe(1);
                    expect(partsCollections[0].wmisTimestamp).toBe("2");
                    expect(tracker.requestingStatus).toBe(WorkRetrievalRequestingStatus.notRequesting);
                    done();
                });
            });

        });

        describe("refreshWorkList calls", () => {

            beforeEach(() => {
                getWorklistStub.onFirstCall().returns(Promise.resolve({
                    meta: {
                        modifiedTimestamp: "foo"
                    },
                    data: {
                        memolist: [], list: []
                    }
                }));
            });

            it("should not request work on a refresh worklist call", (done) => {
                workRetrievalService.initialise()
                .then(() => workRetrievalService.refreshWorkList())
                .then(() => {
                    expect(requestWorkSpy.called).toBe(false);
                    expect(tracker.requestingStatus).toBe(WorkRetrievalRequestingStatus.notRequesting);
                    done();
                });
            });

        });

        describe("completing worklist retrieval", () => {

            it("should retrieve the jobs from a new worklist", done => {

                getWorklistStub.onFirstCall().returns(Promise.resolve({
                    meta: {
                        modifiedTimestamp: "foo"
                    },
                    data: {
                        memolist: [],
                        list: [{id: "1", status: "X", workType: "Y", timestamp:"xxx"}]
                    }
                }));

                getWorklistStub.onSecondCall().returns(Promise.resolve({
                    meta: {
                        modifiedTimestamp: "bar"
                    },
                    data: {
                        memolist: [],
                        list: [{id: "2", status: "X", workType: "Y", timestamp:"zzz" }]
                    }
                }));

                workRetrievalService.initialise()
                .then(() => workRetrievalService.refreshWorkList())
                .then(() => {
                    expect(getJobStub.called).toBe(true);
                    expect(getJobStub.args[0][0]).toBe("1");
                    getJobStub.reset();
                })
                .then(() => workRetrievalService.refreshWorkList())
                .then(() => {
                    expect(getJobStub.called).toBe(true);
                    expect(getJobStub.args[0][0]).toBe("2");
                    expect(tracker.requestingStatus).toBe(WorkRetrievalRequestingStatus.notRequesting);
                    done();
                });
            });

            it("should not retrieve the jobs from an unchanged worklist", done => {

                getWorklistStub.returns(Promise.resolve({
                    meta: {
                        modifiedTimestamp: "foo"
                    },
                    data: {
                        memolist: [],
                        list: [{id: "1", status: "X", workType: "Y", timestamp:"xxx"}]
                    }
                }));

                workRetrievalService.initialise()
                .then(() => workRetrievalService.refreshWorkList())
                .then(() => {
                    expect(getJobStub.called).toBe(true);
                    expect(getJobStub.args[0][0]).toBe("1");
                    getJobStub.reset();
                })
                .then(() => workRetrievalService.refreshWorkList())
                .then(() => {
                    expect(getJobStub.called).toBe(false);
                    expect(tracker.requestingStatus).toBe(WorkRetrievalRequestingStatus.notRequesting);
                    done();
                });
            });

            it("should retrieve the jobs from an unchanged worklist when previous job call has errored", done => {

                getWorklistStub.returns(Promise.resolve({
                    meta: {
                        modifiedTimestamp: "foo"
                    },
                    data: {
                        memolist: [],
                        list: [{id: "1", status: "X", workType: "Y", timestamp:"xxx"}]
                    }
                }));

                getJobStub.withArgs("1").rejects({});

                workRetrievalService.initialise()
                .then(() => workRetrievalService.refreshWorkList())
                .then(() => {
                    expect(getJobStub.called).toBe(true);
                    expect(getJobStub.args[0][0]).toBe("1");
                    getJobStub.reset();
                })
                .then(() => workRetrievalService.refreshWorkList())
                .then(() => {
                    expect(getJobStub.called).toBe(true);
                    // expect(getJobStub.args[0][0]).toBe("1");
                    expect(tracker.requestingStatus).toBe(WorkRetrievalRequestingStatus.notRequesting);
                    done();
                });
            });

        });
    });
});
