
import { FftService } from "../../../../../../app/hema/api/services/fftService";
import { IConfigurationService } from "../../../../../../app/common/core/services/IConfigurationService";
import { IStorageService } from "../../../../../../app/hema/business/services/interfaces/IStorageService";
import { IHttpHeaderProvider } from "../../../../../../app/common/resilience/services/interfaces/IHttpHeaderProvider";
import { EventAggregator } from "aurelia-event-aggregator";
import { IHttpClient } from "../../../../../../app/common/core/IHttpClient";
import { WorkRetrievalService } from "../../../../../../app/hema/business/services/workRetrievalService";
import { IEngineerService } from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import { IBusinessRuleService } from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { IJobFactory } from "../../../../../../app/hema/business/factories/interfaces/IJobFactory";
import { IApplianceService } from "../../../../../../app/hema/business/services/interfaces/IApplianceService";
import { IJobCacheService } from "../../../../../../app/hema/business/services/interfaces/IJobCacheService";
import { IMessageService } from "../../../../../../app/hema/business/services/interfaces/IMessageService";
import { Engineer } from "../../../../../../app/hema/business/models/engineer";
import * as Logging from "aurelia-logging";
import { IHttpHeader } from "../../../../../../app/common/core/IHttpHeader";
import { IWorkListResponse } from "../../../../../../app/hema/api/models/fft/engineers/worklist/IWorkListResponse";
import { IGetJobResponse } from "../../../../../../app/hema/api/models/fft/jobs/IGetJobResponse";
import { IHistoryResponse } from "../../../../../../app/hema/api/models/fft/jobs/history/IHistoryResponse";
import { Job } from "../../../../../../app/hema/business/models/job";
import { WorkRetrievalTracker } from "../../../../../../app/hema/business/services/workRetrievalTracker";
import { IHemaConfiguration } from "../../../../../../app/hema/IHemaConfiguration";
import { JobState } from "../../../../../../app/hema/business/models/jobState";
import { ToastManager } from "../../../../../../app/common/ui/elements/toastManager";
import { WorkRetrievalRequestingStatus } from "../../../../../../app/hema/business/services/workRetrievalRequestingStatus";
import { ResilientHttpClientFactory } from "../../../../../../app/common/resilience/services/resilientHttpClientFactory";
import { IWorkListItem } from "../../../../../../app/hema/api/models/fft/engineers/worklist/IWorkListItem";
import { JobPartsCollection } from "../../../../../../app/hema/business/models/jobPartsCollection";
import { IPartCollectionResponse } from "../../../../../../app/hema/api/models/fft/jobs/parts/IPartCollectionResponse";
import { WuaNetworkDiagnostics } from "../../../../../../app/common/core/wuaNetworkDiagnostics";

describe("workRetrievalService integration", () => {

    let sandbox: Sinon.SinonSandbox;
    let worklistConfigurationServiceStub: IConfigurationService;
    let workRetrievalService: WorkRetrievalService;
    let eventAggregator: EventAggregator;
    let tracker: WorkRetrievalTracker;
    let wuaNetworkDiagnosticsStub: WuaNetworkDiagnostics;

    // let consoleLog = (...args: any[]) => console.log(args.map(arg => JSON.stringify(arg)));
    let consoleWarn = (...args: any[]) => console.warn(args.map(arg => JSON.stringify(arg)));

    let eventLog: {type: string, args: any}[] = [];
    let registerEvent = (type: string, args: any) => {
        eventLog.push({type, args});
    };

    let httpClient = <IHttpClient>{};

    httpClient.putData = <T, V>(baseEndpoint: string, endpoint: string, params: { [id: string]: any }, data: T,  headers?: IHttpHeader[]): Promise<V> => {
        let response = extractHttpResponse({endpoint, id: params.jobId});
        registerEvent("PUT", {endpoint, params, data});

        if (response.throws) {
            return Promise.reject("HTTP Error");
        }
        return Promise.resolve(<V>{});
    };

    httpClient.getData = <T>(baseEndpoint: string, endpoint: string, params: { [id: string]: any }, breakCache?: boolean, headers?: IHttpHeader[]): Promise<T> => {
        let response = extractHttpResponse({endpoint, id: params.jobId});
        registerEvent("GET", {endpoint, params, response, breakCache});

        return response.throws
            ? Promise.reject("HTTP Error")
            : Promise.resolve(response.data);
    };


    let httpCache: {endpoint: string, id?: string, throws?: boolean, data?: {}}[] = [];

    let waitForHttpCacheToEventuallyClear = async () => {
        while (httpCache.length) {
            await Promise.delay(50);
        }
    };

    let queueAnHttpResponse = (httpResponse: {endpoint: string, id?: string, throws?: boolean, data?: {}}) => {
        httpCache.push(httpResponse);
    };

    let queueJobsHttpResponses = (...jobIds: string[]) => {
        jobIds.forEach(id => {
            queueAnHttpResponse({endpoint: "{jobId}", id, data: <IGetJobResponse>{ meta: { }, data: { job: { visit: {id: "v" + id} } } }});
            queueAnHttpResponse({endpoint: "{jobId}/history", id, data: <IHistoryResponse>{ data: {} }})
            queueAnHttpResponse({endpoint: "{jobId}/status", id});
        });
    }

    let queueJobPartCollectionHttpResponses = (...jobIds: string[]) => {
        jobIds.forEach(id => {
            queueAnHttpResponse({endpoint: "{jobId}/parts", id, data: <IPartCollectionResponse>{
                data: {
                    customer: {firstName: "", middleName: "", title: "mr", lastName: "lastName", address: []},
                    list: [{stockReferenceId: "1", description: "desc", quantity: "2"}]
                }
            }});
        });
    }

    let queueAWorklistHttpResponse = (modifiedTimestamp: string, jobs: {id: string, timestamp: string, workType: "job" | "partsCollection", isJunkTob?: boolean}[] ): void => {
        queueAnHttpResponse({endpoint: "worklist", data: <IWorkListResponse>{
            meta: { modifiedTimestamp},
            data:{
                memoList: [],
                list: jobs.map(job => ({
                    id: job.id,
                    workType: job.workType,
                    status: job.isJunkTob
                            ? "xxx"
                            : job.workType === "job" ? "allocated" : "collect",
                    timestamp: job.timestamp
                }))
               }
        }});
    };

    let extractHttpResponse = (httpResponse: {endpoint: string, id?: string}) => {
        let foundIndex = httpCache.findIndex(response => response.endpoint === httpResponse.endpoint && response.id === httpResponse.id);
        if (foundIndex !== -1) {
            return httpCache.splice(foundIndex, 1)[0];
        }
        consoleWarn("Integration test asking for a response which has not been queued", httpResponse);
        expect(httpResponse).toBe("in the cache but it wasn't"); // an unplanned call has been made
        throw "error";
    }

    let jobCacheServiceStub = <IJobCacheService>{};
    let jobCache = [];
    jobCacheServiceStub.getWorkListJobs = () => Promise.resolve(jobCache);
    jobCacheServiceStub.setWorkListJobs = (jobs) => {
        jobCache = jobs;
        return Promise.resolve();
    };
    jobCacheServiceStub.existsALiveJobNotInWorklist = () => Promise.resolve(false);

    let getCachedLiveJobs = () => jobCache.filter(job => job.position !== -1).sort((a, b) => +a.position - +b.position);

    let partsCollectionCache = [];
    jobCacheServiceStub.getPartsCollections = () => Promise.resolve(partsCollectionCache);
    jobCacheServiceStub.setPartsCollections = (partsCollections) => {
        partsCollectionCache = partsCollections;
        return Promise.resolve();
    };

    let getCachedPartsCollections = () => partsCollectionCache.filter(job => job.position !== -1).sort((a, b) => +a.position - +b.position);

    let jobFailureCache = [];
    jobCacheServiceStub.getWorkListJobApiFailures = () => Promise.resolve(jobFailureCache);
    jobCacheServiceStub.setWorkListJobApiFailures = (failures) => {
        jobFailureCache = failures;
        return Promise.resolve();
    }
    let getCachedFailures = () => jobFailureCache.map(failure => ({id: failure.id, position: failure.position}));

    let reset = () => {
        httpCache = [];
        jobCache = [];
        partsCollectionCache = [];
        jobFailureCache = [];
        eventLog = [];
    };

    let realLoggingGetLogger: any;

    beforeEach(async () => {
        reset();

        sandbox = sinon.sandbox.create();

        let configServiceStub = <IConfigurationService>{};
        configServiceStub.getConfiguration = sandbox.stub().returns({
            workListPostRequestWorkPollingIntervals: [0, 1],
            workListPollingInterval: 0,
            clients: [
                {
                    name: "prod",
                    type: "http",
                    root: "https://endpoint"
                }
            ],
            routes: [
                {
                  route: "engineer_requestwork",
                  client: "prod",
                  path: "requestwork", //engineers/v1/{engineerId}/requestwork,
                  routeRetryCount: 0
                },
                {
                  route: "engineer_worklist",
                  client: "prod",
                  path: "worklist", //engineers/v1/{engineerId}/worklist
                  routeRetryCount: 0
                },
                {
                  route: "job",
                  client: "prod",
                  path: "{jobId}", //jobs/v1/{jobId}
                  routeRetryCount: 0
                },
                {
                  route: "job_history",
                  client: "prod",
                  path: "{jobId}/history", //jobs/v1/{jobId}/history
                  routeRetryCount: 0
                },
                {
                  route: "job_status",
                  path: "{jobId}/status", //jobs/v1/{jobId}/status
                  client: "prod"
                },
                {
                  route: "parts_collection",
                  path: "{jobId}/parts", //jobs/v1/{jobId}/parts
                  client: "prod"
                }
              ]
        });

        let storageServiceStub = <IStorageService>{};
        storageServiceStub.getResilienceRetryPayloads = sandbox.stub().resolves([]);
        storageServiceStub.setResilienceRetryPayloads = sandbox.stub().resolves(undefined);

        let fftHeaderProviderStub = <IHttpHeaderProvider>{};
        fftHeaderProviderStub.getHeaders = sandbox.stub().resolves([]);

        eventAggregator = <EventAggregator>{};
        eventAggregator.subscribe = sandbox.stub();
        eventAggregator.publish = sandbox.stub();

        let clientFactory = <ResilientHttpClientFactory> {
            getHttpClient: () => httpClient
        }

        wuaNetworkDiagnosticsStub = <WuaNetworkDiagnostics>{};
        wuaNetworkDiagnosticsStub.getDiagnostics = sandbox.stub();

        let fftService = new FftService(configServiceStub, storageServiceStub, eventAggregator, fftHeaderProviderStub, clientFactory, wuaNetworkDiagnosticsStub);

        realLoggingGetLogger = Logging.getLogger;
        // (<any>Logging)["getLogger"] = sandbox.stub().returns({
        //     debug:  consoleLog,
        //     info:   consoleLog,
        //     warn:   consoleLog,
        //     error:  consoleLog
        // });

        workRetrievalService
        let engineerServiceStub = <IEngineerService>{};
        engineerServiceStub.getCurrentEngineer = sandbox.stub().resolves(<Engineer>{
            isSignedOn: true
        });

        let businessRuleService = <IBusinessRuleService>{};
        businessRuleService.getRuleGroup = sandbox.stub().resolves({
            statusTaskAcknowledged: "00",
            workTypeJob: "job",
            statusAllocated: "allocated",
            workTypePartsCollection: "partsCollection",
            statusToCollect: "collect"
        });

        let messageServiceStub = <IMessageService>{};
        messageServiceStub.updateMessages = sandbox.stub();

        let applianceServiceStub = <IApplianceService>{};
        applianceServiceStub.ensureAdaptInformationIsSynced = sandbox.stub().resolves(undefined);

        let jobFactoryStub = <IJobFactory>{};
        jobFactoryStub.getJobStatusCode = () => Promise.resolve("");
        jobFactoryStub.createJobBusinessModel = ( worklistItem, job, history) => {
            return Promise.resolve(<Job>{ id: worklistItem.id, wmisTimestamp: worklistItem.timestamp});
        };

        jobFactoryStub.createPartCollectionBusinessModel = (worklistItem: IWorkListItem,
                                                            partApiModel: IPartCollectionResponse) =>
            <JobPartsCollection>{ id: worklistItem.id, wmisTimestamp: worklistItem.timestamp};

        let origDelay = Promise.delay
        sandbox.stub(Promise, "delay", (delay: number) => {
            registerEvent("DELAY", delay);
            return origDelay(delay);
        });

        worklistConfigurationServiceStub = <IConfigurationService>{};
        worklistConfigurationServiceStub.getConfiguration = sandbox.stub().returns({});
        tracker = new WorkRetrievalTracker(worklistConfigurationServiceStub);

        let toastManagerStub = <ToastManager> {};
        toastManagerStub.closeToast = sandbox.stub();

        workRetrievalService = new WorkRetrievalService(
            engineerServiceStub, fftService, businessRuleService, jobFactoryStub,
            jobCacheServiceStub, eventAggregator, messageServiceStub, configServiceStub,
            tracker, toastManagerStub);

        await workRetrievalService.initialise();
    });

    afterEach(() => {
        (<any>Logging)["getLogger"] = realLoggingGetLogger;
        sandbox.restore();
    });

    describe("requesting work - first run of the day", () => {
        it("will retrieve the first worklist of the day when the initial pre-request worklist retrieval throws (as is usually the case)", async done => {
            queueAnHttpResponse({endpoint: "worklist", throws: true});
            queueAnHttpResponse({endpoint: "requestwork"});
            queueAWorklistHttpResponse("w1", [
                {id :"2", timestamp: "j2", workType: "job"},
                {id :"2", timestamp: "p2", workType: "partsCollection"}, // a parts collection for a job in the list
                {id :"3", timestamp: "p3", workType: "partsCollection"}, // a parts collection for a job not yet in the list
                {id :"1", timestamp: "j1", workType: "job"}
            ]);
            queueJobsHttpResponses("1", "2");
            queueJobPartCollectionHttpResponses("2", "3");

            await workRetrievalService.sendRequestWorkAndPollWorkList();

            expect(getCachedLiveJobs()).toEqual([{id: "2", wmisTimestamp: "j2", position: 0}, {id: "1", wmisTimestamp: "j1", position: 3}]);
            expect(getCachedPartsCollections()).toEqual([{id: "2", wmisTimestamp: "p2", position: 1}, {id: "3", wmisTimestamp: "p3", position: 2}]);
            expect(tracker.requestingStatus).toBe(WorkRetrievalRequestingStatus.notRequesting);
            // expect((eventAggregator.publish as Sinon.SinonStub).calledWith(WorkRetrievalServiceConstants.REQUEST_WORK_LIST_FAILED)).toBe(false);
            done();
        });

        it("will retrieve the first worklist of the day when the expected initial pre-request worklist retrieval throws with a pretend 404", async done => {
            queueAnHttpResponse({endpoint: "worklist", data: {status: "404", "error": "foo"}});
            queueAnHttpResponse({endpoint: "requestwork"});
            queueAWorklistHttpResponse("w1", [{id :"2", timestamp: "j2", workType: "job"}, {id :"1", timestamp: "j1", workType: "job"}]);
            queueJobsHttpResponses("1", "2");

            await workRetrievalService.sendRequestWorkAndPollWorkList();

            expect(getCachedLiveJobs()).toEqual([{id: "2", wmisTimestamp: "j2", position: 0}, {id: "1", wmisTimestamp: "j1", position: 1}]);
            expect(tracker.requestingStatus).toBe(WorkRetrievalRequestingStatus.notRequesting);
            // expect((eventAggregator.publish as Sinon.SinonStub).calledWith(WorkRetrievalServiceConstants.REQUEST_WORK_LIST_FAILED)).toBe(false);
            done();
        });

        it("will retrieve the first worklist of the day when the expected initial pre-request worklist actually responds (user is restarting app half way through the day)", async done => {
            queueAWorklistHttpResponse("w1", [{id :"2", timestamp: "j2", workType: "job"}, {id :"1", timestamp: "j1", workType: "job"}]);
            queueAnHttpResponse({endpoint: "requestwork"});
            // will poll twice
            queueAWorklistHttpResponse("w1", [{id :"2", timestamp: "j2", workType: "job"}, {id :"1", timestamp: "j1", workType: "job"}]);
            queueAWorklistHttpResponse("w1", [{id :"2", timestamp: "j2", workType: "job"}, {id :"1", timestamp: "j1", workType: "job"}]);
            queueJobsHttpResponses("1", "2");

            await workRetrievalService.sendRequestWorkAndPollWorkList();
            expect(tracker.requestingStatus).toBe(WorkRetrievalRequestingStatus.notRequesting);
            expect(getCachedLiveJobs()).toEqual([{id: "2", wmisTimestamp: "j2", position: 0}, {id: "1", wmisTimestamp: "j1", position: 1}]);
            done();
        });

        it("will report a failure if request work endpoint is offline", async done => {
            queueAnHttpResponse({endpoint: "worklist", throws: true});
            queueAnHttpResponse({endpoint: "requestwork", throws: true});

            await workRetrievalService.sendRequestWorkAndPollWorkList();
            expect(tracker.requestingStatus).toBe(WorkRetrievalRequestingStatus.notRequesting);
            expect(getCachedLiveJobs()).toEqual([]);
            // expect((eventAggregator.publish as Sinon.SinonStub).calledWith(WorkRetrievalServiceConstants.REQUEST_WORK_LIST_FAILED)).toBe(true);
            done();
        });

        it("will report a failure if worklist endpoint is offline", async done => {
            queueAnHttpResponse({endpoint: "worklist", throws: true});
            queueAnHttpResponse({endpoint: "requestwork"});
            queueAnHttpResponse({endpoint: "worklist", throws: true});
            queueAnHttpResponse({endpoint: "worklist", throws: true});
            await workRetrievalService.sendRequestWorkAndPollWorkList();
            expect(tracker.lastFailedTime).toBeDefined();
            expect(tracker.requestingStatus).toBe(WorkRetrievalRequestingStatus.notRequesting);
            expect(getCachedLiveJobs()).toEqual([]);
            // expect((eventAggregator.publish as Sinon.SinonStub).calledWith(WorkRetrievalServiceConstants.REQUEST_WORK_LIST_FAILED)).toBe(true);
            done();
        });

        it("will poll past an temporary worklist endpoint 404", async done => {
            queueAnHttpResponse({endpoint: "worklist", throws: true});
            queueAnHttpResponse({endpoint: "requestwork"});
            queueAnHttpResponse({endpoint: "worklist", throws: true});
            queueAWorklistHttpResponse("w1", [{id :"2", timestamp: "j2", workType: "job"}]);
            queueJobsHttpResponses("2");
            await workRetrievalService.sendRequestWorkAndPollWorkList();
            expect(tracker.requestingStatus).toBe(WorkRetrievalRequestingStatus.notRequesting);
            expect(tracker.lastFailedTime).toBeUndefined();
            expect(getCachedLiveJobs()).toEqual([{id: "2", wmisTimestamp: "j2", position: 0}]);
            // expect((eventAggregator.publish as Sinon.SinonStub).calledWith(WorkRetrievalServiceConstants.REQUEST_WORK_LIST_FAILED)).toBe(true);
            done();
        });

        it("an initial get worklist without a request for work will still bring jobs down", async done => {
            queueAWorklistHttpResponse("w1", [{id :"2", timestamp: "j2", workType: "job"}, {id :"1", timestamp: "j1", workType: "job"}]);
            queueJobsHttpResponses("1", "2");

            await workRetrievalService.refreshWorkList();
            expect(tracker.requestingStatus).toBe(WorkRetrievalRequestingStatus.notRequesting);
            expect(getCachedLiveJobs()).toEqual([{id: "2", wmisTimestamp: "j2", position: 0}, {id: "1", wmisTimestamp: "j1", position: 1}]);
            done();
        });
    });

    describe("request work and polling", () => {
        it("will poll and retrieve a new worklist", async done => {
            queueAnHttpResponse({endpoint: "worklist", throws: true});
            queueAnHttpResponse({endpoint: "requestwork"});
            queueAWorklistHttpResponse("w1", [
                {id :"2", timestamp: "j2", workType: "job"},
                {id :"2", timestamp: "p2", workType: "partsCollection"},
                {id :"1", timestamp: "j1", workType: "job"}
            ]);
            queueJobsHttpResponses("1", "2");
            queueJobPartCollectionHttpResponses("2");

            await workRetrievalService.sendRequestWorkAndPollWorkList();

            queueAnHttpResponse({endpoint: "requestwork"});
            queueAWorklistHttpResponse("w1", [
                {id :"2", timestamp: "j2", workType: "job"},
                {id :"2", timestamp: "p2", workType: "partsCollection"},
                {id :"1", timestamp: "j1", workType: "job"}
            ]);
            // now the worklist timestamp changes
            queueAWorklistHttpResponse("w2", [
                {id :"3", timestamp: "j3", workType: "job"},
                {id :"4", timestamp: "p4", workType: "partsCollection"},
                {id :"2", timestamp: "j2", workType: "job"},
            ]);
            queueJobsHttpResponses("2", "3");
            queueJobPartCollectionHttpResponses("4");

            await workRetrievalService.sendRequestWorkAndPollWorkList();
            expect(tracker.requestingStatus).toBe(WorkRetrievalRequestingStatus.notRequesting);
            expect(getCachedLiveJobs()).toEqual([{id: "3", wmisTimestamp: "j3", position: 0}, {id: "2", wmisTimestamp: "j2", position: 2}]);
            expect(getCachedPartsCollections()).toEqual([{id: "4", wmisTimestamp: "p4", position: 1}]);
            done();
        });

        it("will retrieve a worklist that just contains partsCollections", async done => {
            queueAnHttpResponse({endpoint: "worklist", throws: true});
            queueAnHttpResponse({endpoint: "requestwork"});
            queueAWorklistHttpResponse("w1", [
                {id :"1", timestamp: "p1", workType: "partsCollection"},
                {id :"2", timestamp: "p2", workType: "partsCollection"},

            ]);
            queueJobPartCollectionHttpResponses("1", "2");
            await workRetrievalService.sendRequestWorkAndPollWorkList();
            expect(tracker.requestingStatus).toBe(WorkRetrievalRequestingStatus.notRequesting);
            expect(getCachedLiveJobs()).toEqual([]);
            expect(getCachedPartsCollections()).toEqual([{id: "1", wmisTimestamp: "p1", position: 0}, {id: "2", wmisTimestamp: "p2", position: 1}]);
            done();
        });

        it("will stop polling if worklist changes", async done => {
            queueAnHttpResponse({endpoint: "worklist", throws: true});
            queueAnHttpResponse({endpoint: "requestwork"});
            queueAWorklistHttpResponse("w1", [{id :"2", timestamp: "j2", workType: "job"}, {id :"1", timestamp: "j1", workType: "job"}]);
            queueJobsHttpResponses("1", "2");

            await workRetrievalService.sendRequestWorkAndPollWorkList();

            queueAnHttpResponse({endpoint: "requestwork"});
            queueAWorklistHttpResponse("w2", [{id :"3", timestamp: "j3", workType: "job"}, {id :"2", timestamp: "j2", workType: "job"}]);
            queueJobsHttpResponses("2", "3");
            queueAWorklistHttpResponse("w3", [{id :"SHOULD_NOT_GET_THIS", timestamp: "SHOULD_NOT_GET_THIS", workType: "job"}, {id :"Y", timestamp: "YY", workType: "job"}]);

            await workRetrievalService.sendRequestWorkAndPollWorkList();
            expect(getCachedLiveJobs()).toEqual([{id: "3", wmisTimestamp: "j3", position: 0}, {id: "2", wmisTimestamp: "j2", position: 1}]);
            expect(tracker.requestingStatus).toBe(WorkRetrievalRequestingStatus.notRequesting);
            done();
        });
    });

    describe("worklist changes", () => {
        it("will adjust worklist throughout the day when in 'only get changed jobs' mode", async done => {
            queueAWorklistHttpResponse("w1", [{id :"2", timestamp: "j2", workType: "job"}, {id :"1", timestamp: "j1", workType: "job"}]);
            queueJobsHttpResponses("1", "2");
            await workRetrievalService.refreshWorkList();
            expect(getCachedLiveJobs()).toEqual([{id: "2", wmisTimestamp: "j2", position: 0}, {id: "1", wmisTimestamp: "j1", position: 1}]);

            // no change in worklist
            queueAWorklistHttpResponse("w1", [{id :"2", timestamp: "j2", workType: "job"}, {id :"1", timestamp: "j1", workType: "job"}]);
            await workRetrievalService.refreshWorkList();
            expect(getCachedLiveJobs()).toEqual([{id: "2", wmisTimestamp: "j2", position: 0}, {id: "1", wmisTimestamp: "j1", position: 1}]);

            // reorder worklist
            queueAWorklistHttpResponse("w2", [{id :"1", timestamp: "j1", workType: "job"}, {id :"2", timestamp: "j2", workType: "job"}]);
            await workRetrievalService.refreshWorkList();
            expect(getCachedLiveJobs()).toEqual([{id: "1", wmisTimestamp: "j1", position: 0}, {id: "2", wmisTimestamp: "j2", position: 1}]);

            // add a partsCollection
            queueAWorklistHttpResponse("w2.1", [{id :"1", timestamp: "p1", workType: "partsCollection"}, {id :"1", timestamp: "j1", workType: "job"}, {id :"2", timestamp: "j2", workType: "job"}]);
            queueJobPartCollectionHttpResponses("1");
            await workRetrievalService.refreshWorkList();
            expect(getCachedLiveJobs()).toEqual([{id: "1", wmisTimestamp: "j1", position: 1}, {id: "2", wmisTimestamp: "j2", position: 2}]);
            expect(getCachedPartsCollections()).toEqual([{id: "1", wmisTimestamp: "p1", position: 0}])

            // change a partsCollections position
            queueAWorklistHttpResponse("w2.2", [{id :"1", timestamp: "j1", workType: "job"}, {id :"1", timestamp: "p1", workType: "partsCollection"}, {id :"2", timestamp: "j2", workType: "job"}]);
            await workRetrievalService.refreshWorkList();
            expect(getCachedLiveJobs()).toEqual([{id: "1", wmisTimestamp: "j1", position: 0}, {id: "2", wmisTimestamp: "j2", position: 2}]);
            expect(getCachedPartsCollections()).toEqual([{id: "1", wmisTimestamp: "p1", position: 1}])

            // remove a partsCollections
            queueAWorklistHttpResponse("w2.3", [{id :"1", timestamp: "j1", workType: "job"}, {id :"2", timestamp: "j2", workType: "job"}]);
            await workRetrievalService.refreshWorkList();
            expect(getCachedLiveJobs()).toEqual([{id: "1", wmisTimestamp: "j1", position: 0}, {id: "2", wmisTimestamp: "j2", position: 1}]);
            expect(getCachedPartsCollections()).toEqual([])

            // remove a job
            queueAWorklistHttpResponse("w3", [{id :"2", timestamp: "j2", workType: "job"}]);
            await workRetrievalService.refreshWorkList();
            expect(getCachedLiveJobs()).toEqual([{id: "2", wmisTimestamp: "j2", position: 0}]);

            // readd a job
            queueAWorklistHttpResponse("w4", [{id :"1", timestamp: "j1", workType: "job"}, {id :"2", timestamp: "j2", workType: "job"}]);
            queueJobsHttpResponses("1");
            await workRetrievalService.refreshWorkList();
            expect(getCachedLiveJobs()).toEqual([{id: "1", wmisTimestamp: "j1", position: 0}, {id: "2", wmisTimestamp: "j2", position: 1}]);
            await waitForHttpCacheToEventuallyClear(); // check that it has asked for job 1 again

            // add a fresh job
            queueAWorklistHttpResponse("w5", [{id :"1", timestamp: "j1", workType: "job"}, {id :"2", timestamp: "j2", workType: "job"}, {id :"3", timestamp: "j3", workType: "job"}]);
            queueJobsHttpResponses("3");
            await workRetrievalService.refreshWorkList();
            expect(getCachedLiveJobs()).toEqual([
                {id: "1", wmisTimestamp: "j1", position: 0},
                {id: "2", wmisTimestamp: "j2", position: 1},
                {id: "3", wmisTimestamp: "j3", position: 2},
            ]);

            // completely change worklist
            queueAWorklistHttpResponse("w6", [{id :"4", timestamp: "j4", workType: "job"}, {id :"5", timestamp: "j5", workType: "job"}]);
            queueJobsHttpResponses("4", "5");
            await workRetrievalService.refreshWorkList();
            expect(getCachedLiveJobs()).toEqual([{id: "4", wmisTimestamp: "j4", position: 0}, {id: "5", wmisTimestamp: "j5", position: 1}]);

            // update a job within the worklist
            queueAWorklistHttpResponse("w7", [{id :"4", timestamp: "j4.1", workType: "job"}, {id :"5", timestamp: "j5", workType: "job"}]);
            queueJobsHttpResponses("4");
            await workRetrievalService.refreshWorkList();
            expect(getCachedLiveJobs()).toEqual([{id: "4", wmisTimestamp: "j4.1", position: 0}, {id: "5", wmisTimestamp: "j5", position: 1}]);
            await waitForHttpCacheToEventuallyClear(); // check that it has asked for job 4 again

            // cancel an en-route job, the job should be disappear from the list on the subsequent wroklist retrieval
            let jobToEnRoute: Job = getCachedLiveJobs().find(job => job.id === "4")            ;
            jobToEnRoute.state = JobState.enRoute;
            queueAWorklistHttpResponse("w8", [{id :"4", timestamp: "j4.2", workType: "job", isJunkTob: true}, {id :"5", timestamp: "j5", workType: "job"}]);
            await workRetrievalService.refreshWorkList();
            await waitForHttpCacheToEventuallyClear();
            expect(getCachedLiveJobs()).toEqual([{id: "5", wmisTimestamp: "j5", position: 0}]);

            // a job is removed from the worklist
            let setJobsSpy = spyOn(jobCacheServiceStub, "setWorkListJobs");

            // a dry run to make sure that we do not set jobs if jobCacheService.existsALiveJobNotInWorklist returns false
            queueAWorklistHttpResponse("w8", [{id :"4", timestamp: "j4.2", workType: "job", isJunkTob: true}, {id :"5", timestamp: "j5", workType: "job"}]);
            await workRetrievalService.refreshWorkList();
            await waitForHttpCacheToEventuallyClear();
            expect(setJobsSpy.calls.count()).toBe(0);

            jobCacheServiceStub.existsALiveJobNotInWorklist = () => Promise.resolve(true);
            queueAWorklistHttpResponse("w8", [{id :"4", timestamp: "j4.2", workType: "job", isJunkTob: true}, {id :"5", timestamp: "j5", workType: "job"}]);

            await workRetrievalService.refreshWorkList();
            await waitForHttpCacheToEventuallyClear();
            // even though we have no change in worklist, we still expect for retrieval completion to happen because we have
            //  our stranded en-routed job.  This will mean that jobCacheService.existsALiveJobNotInWorklist returns true.
            expect(setJobsSpy.calls.count()).toBe(1);
            jobCacheServiceStub.existsALiveJobNotInWorklist = () => Promise.resolve(false);
            expect(tracker.requestingStatus).toBe(WorkRetrievalRequestingStatus.notRequesting);
            done();
        });

        it("will adjust worklist throughout the day when in 'always get all jobs' mode", async done => {
            worklistConfigurationServiceStub.getConfiguration = sandbox.stub().returns(<IHemaConfiguration>{worklistAlwaysGetAllJobs: true});

            queueAWorklistHttpResponse("w1", [{id :"2", timestamp: "j2", workType: "job"}, {id :"1", timestamp: "j1", workType: "job"}]);
            queueJobsHttpResponses("1", "2");
            await workRetrievalService.refreshWorkList();
            expect(getCachedLiveJobs()).toEqual([{id: "2", wmisTimestamp: "j2", position: 0}, {id: "1", wmisTimestamp: "j1", position: 1}]);

            // no change in worklist
            queueAWorklistHttpResponse("w1", [{id :"2", timestamp: "j2", workType: "job"}, {id :"1", timestamp: "j1", workType: "job"}]);
            await workRetrievalService.refreshWorkList();
            await waitForHttpCacheToEventuallyClear();

            // a change in worklist - all jobs are retrieved
            queueAWorklistHttpResponse("w2", [{id :"2", timestamp: "j2", workType: "job"}, {id :"1", timestamp: "j1", workType: "job"}, {id :"3", timestamp: "j3", workType: "job"}]);
            queueJobsHttpResponses("1", "2", "3");
            await workRetrievalService.refreshWorkList();
            await waitForHttpCacheToEventuallyClear();
            expect(tracker.requestingStatus).toBe(WorkRetrievalRequestingStatus.notRequesting);
            done();
        });

    });

    describe("failures", () => {
        it("will cope with job failures", async done => {

            queueAWorklistHttpResponse("w1", [{id :"2", timestamp: "j2", workType: "job"}, {id :"1", timestamp: "j1", workType: "job"}]);
            queueJobsHttpResponses("1", "2");
            await workRetrievalService.refreshWorkList();

            expect(getCachedLiveJobs()).toEqual([{id: "2", wmisTimestamp: "j2", position: 0}, {id: "1", wmisTimestamp: "j1", position: 1}]);

            // a new job fails
            queueAWorklistHttpResponse("w2", [{id :"2", timestamp: "j2", workType: "job"}, {id :"3", timestamp: "j3", workType: "job"}, {id :"1", timestamp: "j1", workType: "job"}]);
            queueAnHttpResponse({endpoint: "{jobId}", id: "3", throws: true });
            queueAnHttpResponse({endpoint: "{jobId}/history", id: "3", data: <IHistoryResponse>{ data: {} }})
            await workRetrievalService.refreshWorkList();

            expect(getCachedLiveJobs()).toEqual([{id: "2", wmisTimestamp: "j2", position: 0}, {id: "1", wmisTimestamp: "j1", position: 2}]);
            expect(getCachedFailures()).toEqual([{id: "3", position: 1}]);

            // ... check no breaking cache
            expect(eventLog.filter(log => log.type === "GET" && log.args.breakCache).length).toBe(0);

            // job heals itself
            queueAWorklistHttpResponse("w2", [{id :"2", timestamp: "j2", workType: "job"}, {id :"3", timestamp: "j3", workType: "job"}, {id :"1", timestamp: "j1", workType: "job"}]);
            queueJobsHttpResponses("3");
            await workRetrievalService.refreshWorkList();
            expect(getCachedLiveJobs()).toEqual([
                {id: "2", wmisTimestamp: "j2", position: 0},
                {id: "3", wmisTimestamp: "j3", position: 1},
                {id: "1", wmisTimestamp: "j1", position: 2}
            ]);

            expect(getCachedFailures()).toEqual([]);
            await waitForHttpCacheToEventuallyClear();

            // ... check cache was broken on previously failed job
            expect(eventLog.filter(log => log.type === "GET"
                                && log.args.endpoint === "{jobId}"
                                && log.args.params.jobId === "3"
                                && log.args.breakCache ).length).toBe(1);
            expect(eventLog.filter(log => log.type === "GET"
                                && log.args.endpoint === "{jobId}/history"
                                && log.args.params.jobId === "3"
                                && log.args.breakCache ).length).toBe(1);

            eventLog = [];

             // a new job with a partsCollection fails
             queueAWorklistHttpResponse("w2.1", [
                 {id :"2", timestamp: "j2", workType: "job"},
                 {id :"3", timestamp: "j3.01", workType: "job"},
                 {id :"3", timestamp: "p3", workType: "partsCollection"},
                 {id :"1", timestamp: "j1", workType: "job"}
                ]);
             queueJobPartCollectionHttpResponses("3");
             queueAnHttpResponse({endpoint: "{jobId}", id: "3", throws: true });
             queueAnHttpResponse({endpoint: "{jobId}/history", id: "3", data: <IHistoryResponse>{ data: {} }})
             await workRetrievalService.refreshWorkList();

             expect(getCachedLiveJobs()).toEqual([
                 {id: "2", wmisTimestamp: "j2", position: 0},
                 {id: "1", wmisTimestamp: "j1", position: 3}
                ]);
             expect(getCachedPartsCollections()).toEqual([{id :"3", wmisTimestamp: "p3", position: 2}]);
             expect(getCachedFailures()).toEqual([{id: "3", position: 1}]);

             // ... check no breaking cache
             expect(eventLog.filter(log => log.type === "GET" && log.args.breakCache).length).toBe(0);

             // job heals itself
             queueAWorklistHttpResponse("w2.1", [
                 {id :"2", timestamp: "j2", workType: "job"},
                 {id :"3", timestamp: "j3.01", workType: "job"},
                 {id :"3", timestamp: "p3", workType: "partsCollection"},
                 {id :"1", timestamp: "j1", workType: "job"}
                ]);
             queueJobsHttpResponses("3");
             await workRetrievalService.refreshWorkList();
             expect(getCachedLiveJobs()).toEqual([
                 {id: "2", wmisTimestamp: "j2", position: 0},
                 {id: "3", wmisTimestamp: "j3.01", position: 1},
                 {id: "1", wmisTimestamp: "j1", position: 3}
             ]);
             expect(getCachedPartsCollections()).toEqual([{id :"3", wmisTimestamp: "p3", position: 2}]);
             expect(getCachedFailures()).toEqual([]);
             await waitForHttpCacheToEventuallyClear();

             // ... check cache was broken on previously failed job
             expect(eventLog.filter(log => log.type === "GET"
                                 && log.args.endpoint === "{jobId}"
                                 && log.args.params.jobId === "3"
                                 && log.args.breakCache ).length).toBe(1);
             expect(eventLog.filter(log => log.type === "GET"
                                 && log.args.endpoint === "{jobId}/history"
                                 && log.args.params.jobId === "3"
                                 && log.args.breakCache ).length).toBe(1);

             eventLog = [];

            // a job updates itself
            queueAWorklistHttpResponse("w3", [{id :"2", timestamp: "j2", workType: "job"}, {id :"3", timestamp: "j3.1", workType: "job"}, {id :"1", timestamp: "j1", workType: "job"}]);
            queueJobsHttpResponses("3");
            await workRetrievalService.refreshWorkList();

            // ... check no breaking cache when the job was retrieved again
            expect(eventLog.filter(log => log.type === "GET" && log.args.breakCache).length).toBe(0);
            await waitForHttpCacheToEventuallyClear();

            // an existing job fails
            queueAWorklistHttpResponse("w4", [{id :"2", timestamp: "j2.1", workType: "job"}, {id :"3", timestamp: "j3.1", workType: "job"}, {id :"1", timestamp: "j1", workType: "job"}]);
            queueAnHttpResponse({endpoint: "{jobId}", id: "2", throws: true});
            queueAnHttpResponse({endpoint: "{jobId}/history", id: "2", data: <IHistoryResponse>{ data: {} }})
            await workRetrievalService.refreshWorkList();
            expect(getCachedLiveJobs()).toEqual([{id :"3", wmisTimestamp: "j3.1", position: 1}, {id :"1", wmisTimestamp: "j1", position: 2}]);
            expect(getCachedFailures()).toEqual([{id: "2", position: 0}]);
            await waitForHttpCacheToEventuallyClear();

            // job heals itself
            queueAWorklistHttpResponse("w4", [{id :"2", timestamp: "j2.1", workType: "job"}, {id :"3", timestamp: "j3.1", workType: "job"}, {id :"1", timestamp: "j1", workType: "job"}]);
            queueJobsHttpResponses("2");
            await workRetrievalService.refreshWorkList();

            expect(getCachedLiveJobs()).toEqual([{id :"2", wmisTimestamp: "j2.1", position: 0}, {id :"3", wmisTimestamp: "j3.1", position: 1}, {id :"1", wmisTimestamp: "j1", position: 2}]);
            expect(getCachedFailures()).toEqual([]);
            await waitForHttpCacheToEventuallyClear();

            // a new job fails on history
            queueAWorklistHttpResponse("w5", [{id :"3", timestamp: "j3.1", workType: "job"}, {id :"4", timestamp: "j4", workType: "job"}]);
            queueAnHttpResponse({endpoint: "{jobId}", id: "4", data: <IGetJobResponse>{ meta: { }, data: { job: { visit: {id: "v4"} } } }});
            queueAnHttpResponse({endpoint: "{jobId}/history", id: "4", throws: true});
            await workRetrievalService.refreshWorkList();

            expect(getCachedLiveJobs()).toEqual([{id :"3", wmisTimestamp: "j3.1", position: 0}]);
            expect(getCachedFailures()).toEqual([{id: "4", position: 1}]);
            await waitForHttpCacheToEventuallyClear();

            // job heals itself
            queueAWorklistHttpResponse("w5", [{id :"3", timestamp: "j3.1", workType: "job"}, {id :"4", timestamp: "j4", workType: "job"}]);
            queueJobsHttpResponses("4");
            await workRetrievalService.refreshWorkList();

            expect(getCachedLiveJobs()).toEqual([{id :"3", wmisTimestamp: "j3.1", position: 0}, {id: "4", wmisTimestamp: "j4", position: 1}]);
            expect(getCachedFailures()).toEqual([]);
            await waitForHttpCacheToEventuallyClear();

            // ... check cache was broken on previously failed job
            expect(eventLog.filter(log => log.type === "GET"
                && log.args.endpoint === "{jobId}"
                && log.args.params.jobId === "4"
                && log.args.breakCache ).length).toBe(1);
            expect(eventLog.filter(log => log.type === "GET"
                && log.args.endpoint === "{jobId}/history"
                && log.args.params.jobId === "4"
                && log.args.breakCache ).length).toBe(1);

            eventLog = [];
            expect(tracker.requestingStatus).toBe(WorkRetrievalRequestingStatus.notRequesting);
            done();
        });

        it("copes with a broken worklist", async done => {
            queueAWorklistHttpResponse("w1", [{id :"1", timestamp: "j1", workType: "job"}]);
            queueJobsHttpResponses("1");

            await workRetrievalService.refreshWorkList();

            expect(getCachedLiveJobs()).toEqual([{id: "1", wmisTimestamp: "j1", position: 0}]);
            await waitForHttpCacheToEventuallyClear();

            // worklist breaks
            queueAnHttpResponse({endpoint: "worklist", throws: true});

            await workRetrievalService.refreshWorkList();

            expect(getCachedLiveJobs()).toEqual([{id: "1", wmisTimestamp: "j1", position: 0}]);
            await waitForHttpCacheToEventuallyClear();

            // worklist heals
            queueAWorklistHttpResponse("w2", [{id :"1", timestamp: "j1", workType: "job"}, {id :"2", timestamp: "j2", workType: "job"}]);
            queueJobsHttpResponses("2");

            await workRetrievalService.refreshWorkList();

            expect(getCachedLiveJobs()).toEqual([{id: "1", wmisTimestamp: "j1", position: 0}, {id: "2", wmisTimestamp: "j2", position: 1}]);
            await waitForHttpCacheToEventuallyClear();

            // ... check cache was broken
            expect(eventLog.filter(log => log.type === "GET"
                && log.args.endpoint === "worklist"
                && log.args.breakCache ).length).toBe(1);
            expect(tracker.requestingStatus).toBe(WorkRetrievalRequestingStatus.notRequesting);
            done();
        });
    });

});