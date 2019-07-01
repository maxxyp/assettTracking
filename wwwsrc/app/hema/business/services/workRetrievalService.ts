import * as Logging from "aurelia-logging";
import { IWorkRetrievalService } from "./interfaces/IWorkRetrievalService";
import { Job } from "../models/job";
import { JobApiFailure } from "../models/jobApiFailure";
import { EngineerService } from "./engineerService";
import { inject } from "aurelia-dependency-injection";
import { IEngineerService } from "./interfaces/IEngineerService";
import { IFFTService } from "../../api/services/interfaces/IFFTService";
import { FftService } from "../../api/services/fftService";
import { JobFactory } from "../factories/jobFactory";
import { EventAggregator } from "aurelia-event-aggregator";
import { IJobFactory } from "../factories/interfaces/IJobFactory";
import { BusinessException } from "../models/businessException";
import { IJobCacheService } from "./interfaces/IJobCacheService";
import { JobCacheService } from "./jobCacheService";
import { ObjectHelper } from "../../../common/core/objectHelper";
import { WorkRetrievalServiceConstants } from "./constants/workRetrievalServiceConstants";
import { BusinessRuleService } from "./businessRuleService";
import { IBusinessRuleService } from "./interfaces/IBusinessRuleService";
import { StringHelper } from "../../../common/core/stringHelper";
import { IJob } from "../../api/models/fft/jobs/IJob";
import { IJobHistory } from "../../api/models/fft/jobs/history/IJobHistory";
import { IMessageService } from "./interfaces/IMessageService";
import { MessageService } from "./messageService";
import { IJobStatusRequest } from "../../api/models/fft/jobs/status/IJobStatusRequest";
import { DateHelper } from "../../core/dateHelper";
import { IWorkListResponse } from "../../api/models/fft/engineers/worklist/IWorkListResponse";
import { IWorkListResponseData } from "../../api/models/fft/engineers/worklist/IWorkListResponseData";
import { IConfigurationService } from "../../../common/core/services/IConfigurationService";
import { ConfigurationService } from "../../../common/core/services/configurationService";
import { IHemaConfiguration } from "../../IHemaConfiguration";
import { Threading } from "../../../common/core/threading";
import { IToastItem } from "../../../common/ui/elements/models/IToastItem";
import { Guid } from "../../../common/core/guid";
import { AppConstants } from "../../../appConstants";
import { UiConstants } from "../../../common/ui/elements/constants/uiConstants";
import { BaseException } from "../../../common/core/models/baseException";
import { IWorkListItem } from "../../api/models/fft/engineers/worklist/IWorkListItem";
import { WorkRetrievalTracker } from "./workRetrievalTracker";
import { JobPartsCollection } from "../models/jobPartsCollection";
import { ToastManager } from "../../../common/ui/elements/toastManager";
import { IPartCollectionResponse } from "../../api/models/fft/jobs/parts/IPartCollectionResponse";
import { AnalyticsExceptionModel } from "../../../common/analytics/analyticsExceptionModel";
import { AnalyticsExceptionCodeConstants } from "../../../common/analytics/analyticsExceptionCodeConstants";
import {SoundConstants} from "./constants/soundConstants";

type PollingResults = {
    jobs: Job[],
    failures: JobApiFailure[],
    removed: Job[],
    newJobs: string[]
};
type RetrievalResults = {
    jobs: Job[],
    partsCollections: JobPartsCollection[],
    failures: JobApiFailure[],
    okItems: IWorkListItem[],
    failedItems: IWorkListItem[]
};
type UpdatedBusinessModels = {
    currentJobs: Job[],
    removedJobs: Job[],
    newJobs: string[],
    currentPartsCollections: JobPartsCollection[],
    removedPartsCollections: JobPartsCollection[]
};

@inject(EngineerService, FftService, BusinessRuleService, JobFactory, JobCacheService, EventAggregator, MessageService, ConfigurationService, WorkRetrievalTracker, ToastManager)
export class WorkRetrievalService implements IWorkRetrievalService {
    private _engineerService: IEngineerService;
    private _fftService: IFFTService;
    private _businessRuleService: IBusinessRuleService;
    private _jobFactory: IJobFactory;
    private _jobCacheService: IJobCacheService;
    private _eventAggregator: EventAggregator;
    private _messageService: IMessageService;
    private _configurationService: IConfigurationService;
    private _logger: Logging.Logger;

    private _businessRules: { [key: string]: any };

    private _workListPostRequestWorkPollingIntervals: number[];
    private _workListPollingInterval: number;

    private _refreshWorkListTimerId: number;
    private _activeToastItem: IToastItem;
    private _tracker: WorkRetrievalTracker;
    private _toastManager: ToastManager;

    constructor(engineerService: IEngineerService,
        fftService: IFFTService,
        businessRuleService: IBusinessRuleService,
        jobFactory: IJobFactory,
        jobCacheService: IJobCacheService,
        eventAggregator: EventAggregator,
        messageService: IMessageService,
        configurationService: IConfigurationService,
        workRetrievalTracker: WorkRetrievalTracker,
        toastManager: ToastManager) {
        this._engineerService = engineerService;
        this._fftService = fftService;
        this._businessRuleService = businessRuleService;
        this._jobFactory = jobFactory;
        this._jobCacheService = jobCacheService;
        this._eventAggregator = eventAggregator;

        this._logger = Logging.getLogger("WorkRetrievalService");

        this._messageService = messageService;
        this._configurationService = configurationService;

        this._refreshWorkListTimerId = -1;

        this._eventAggregator.subscribe(WorkRetrievalServiceConstants.REQUEST_WORK_AND_REFRESH_WORK_LIST, () => this.sendRequestWorkAndPollWorkList());
        this._eventAggregator.subscribe(WorkRetrievalServiceConstants.REFRESH_WORK_LIST, () => this.refreshWorkList());

        this._eventAggregator.subscribe(UiConstants.TOAST_REMOVED, () => { this._activeToastItem = undefined; });

        this._tracker = workRetrievalTracker;
        this._toastManager = toastManager;
    }

    public async initialise(): Promise<void> {
        let hemaConfiguration = this._configurationService.getConfiguration<IHemaConfiguration>();

        this._workListPostRequestWorkPollingIntervals = hemaConfiguration.workListPostRequestWorkPollingIntervals;
        this._workListPollingInterval = hemaConfiguration.workListPollingInterval;

        let rulesGroup = await this._businessRuleService.getRuleGroup(StringHelper.toCamelCase(ObjectHelper.getClassName(this)));

        this._businessRules = rulesGroup;
        this.stopStarRefreshWorkList(true);
    }

    public stopStarRefreshWorkList(startMonitoring: boolean): void {
        let isPollingSwitchedOn = !!this._workListPollingInterval;

        if (startMonitoring && isPollingSwitchedOn) {
            this._refreshWorkListTimerId = Threading.startTimer(() => this.refreshWorkList(), this._workListPollingInterval);
        } else {
            if (this._refreshWorkListTimerId !== -1) {
                Threading.stopTimer(this._refreshWorkListTimerId);
                this._refreshWorkListTimerId = -1;
            }
        }
    }

    public sendRequestWorkAndPollWorkList(): Promise<void> {
        this._tracker.setShouldRequestWorkOnNextCall(true);
        return this.refreshWorkList();
    }

    public async refreshWorkList(): Promise<void> {
        if (this._tracker.requestingStatus) {
            this.logProgress("getWorkListAlreadyInProgress");
            return;
        }
        await this.getWorkList();
        this._eventAggregator.publish(WorkRetrievalServiceConstants.REFRESH_START_STOP);
    }

    private getIntervals(): number[] {
        return this._tracker.shouldRequestWorkOnNextCall()
            ? [...this._workListPostRequestWorkPollingIntervals]
            // for conventional poll, just one immediate hit (at the moment)
            : [0];
    }

    private async getWorkList(): Promise<void> {

        let engineer = await this._engineerService.getCurrentEngineer();
        let canGetWorklist = engineer && engineer.isSignedOn && engineer.status === undefined;
        if (!canGetWorklist) {
            this.logProgress("getWorkListWhenNotWorking");
            return;
        }

        let intervals = this.getIntervals();

        this.logProgress("getWorkList");

        this._tracker.startRequesting();
        this._eventAggregator.publish(WorkRetrievalServiceConstants.REFRESH_START_STOP);
        try {
            if (this._tracker.shouldRequestWorkOnNextCall()) {
                await this.requestWork(engineer.id);
            }

            let pollResults = await this.pollWorklist(engineer.id, intervals);

            this.logProgress("getWorkListComplete");
            if (pollResults) {
                await this.notify(pollResults.failures, pollResults.removed, pollResults.newJobs);
            }

        } catch (err) {
            this.logError("getWorkList", "getWorkListError", err);
        }
    }

    private async requestWork(engineerId: string): Promise<void> {
        this.logProgress("requestWork");
        /*
           On the very first requestForWork of the day, we need to know what the prior workList identifier is
           so that we know when to stop polling after the requestForWork, i.e. stop polling once the identifier coming back changes.
           So in this case, make a workList call first...
       */
        if (!this._tracker.isWorkListIdentifierKnown()) {
            try {
                let response = await this._fftService.getWorkList(engineerId);
                this.registerNewWorkList(response, true);
            } catch (err) {
                // ... but we have seen from the API it may or may not throw a 404 if we ask for worklist before a request for work.
                this.logError("preRequestForWorkWorkListRequest", "preRequestForWorkWorkListRequest", err);
                this._tracker.registerFailedWorklist(true);
            }
        }

        try {
            await this._fftService.requestWork(engineerId);
            this.logProgress("requestWorkComplete");
            this._tracker.setShouldRequestWorkOnNextCall(false);
        } catch (err) {
            this._tracker.failedRequestWork();
            this.logError("requestWork", "requestWorkError", err);
            // if the requestForWork call fails, it will be requested next time as we do not set the flag
            throw new BusinessException(this, "requestWork", "An error has occurred requesting work", [], err);
        }
    }

    private async pollWorklist(engineerId: string, pollIntervals: number[]): Promise<PollingResults> {
        if (!(pollIntervals && pollIntervals.length)) {
            this.logProgress("pollWorklistUnchanged");
            this._tracker.registerUnchangedWorklist();
            return null;
        }

        try {
            let thisInterval = pollIntervals.shift();
            this.logProgress("pollWorklist", "waiting for " + thisInterval + "ms");
            await Promise.delay(thisInterval);

            let breakCache = this._tracker.hasWorklistFailedPreviously();
            this.logProgress("requestWorkList", engineerId, { breakCache });

            let response: IWorkListResponse;
            try {
                response = await this._fftService.getWorkList(engineerId, breakCache);
            } catch (error) {
                this._tracker.registerFailedWorklist(true);
                if (!(pollIntervals && pollIntervals.length)) {
                    throw error;
                } else {
                    this.logProgress("pollWorklistRetry");
                    return await this.pollWorklist(engineerId, pollIntervals);
                }
            }

            this._tracker.deregisterFailedWorklist();
            this.logProgress("returnedWorkList", JSON.stringify(response));

            // make sure we await the promises here so that this catch handler picks up any errors
            return await this.shouldCompleteWorkListRetrieval(response, pollIntervals)
                ? await this.completeWorklistRetrieval(response)
                : await this.pollWorklist(engineerId, pollIntervals);

        } catch (err) {
            this._tracker.registerFailedWorklist(false);
            this.logError("pollWorklist", "pollWorklisterror", err);
            throw new BusinessException(this, "pollWorklist", "An error has occurred retrieving workList", [], err);
        }
    }

    private async completeWorklistRetrieval(workListResponse: IWorkListResponse): Promise<PollingResults> {
        try {
            this.logProgress("completeWorklistRetrieval");
            this.processWorkListMessages(workListResponse.data);
            this.logProgress("completeWorklistRetrieval - finished messages");

            let allLiveItems = this.getLiveWorklistItems(workListResponse.data.list);
            let itemsToRetrieve = allLiveItems.filter(item => this._tracker.shouldRetrieveItem(item));
            let retrievalResults = await this.retrieveItemsOrErrors(itemsToRetrieve);

            let updatedModels = await this.appendAndUpdateBusinessModels(retrievalResults, allLiveItems);
            this.setPositions(allLiveItems, updatedModels.currentJobs, updatedModels.currentPartsCollections, retrievalResults.failures);

            await Promise.all([
                this._jobCacheService.setWorkListJobs(updatedModels.currentJobs),
                this._jobCacheService.setPartsCollections(updatedModels.currentPartsCollections),
                this._jobCacheService.setWorkListJobApiFailures(retrievalResults.failures)
            ]);

            this._logger.debug("registeringjob", {
                retrievedOk: [...retrievalResults.jobs, ...retrievalResults.partsCollections].map(item => item.id),
                retrievalError: retrievalResults.failures.map(job => job.id)
            });

            this.registerNewWorkList(workListResponse, false);
            this._tracker.registerItems(retrievalResults.okItems, retrievalResults.failedItems, allLiveItems);

            return {
                jobs: updatedModels.currentJobs,
                newJobs: updatedModels.newJobs,
                failures: retrievalResults.failures,
                removed: updatedModels.removedJobs
            };

        } catch (err) {
            this.logError("completeWorklistRetrieval", "completeWorklistRetrievalError", err);
            throw new BusinessException(this, "completeWorklistRetrieval", "A job-specific error has occurred", [], err);
        }
    }

    private async appendAndUpdateBusinessModels(retrievalResults: RetrievalResults, allLiveItems: IWorkListItem[]): Promise<UpdatedBusinessModels> {
        let {jobs, partsCollections, failures} = retrievalResults;

        this.logProgress("storeWorkList",
            jobs && jobs.map(item => item && item.id),
            partsCollections && partsCollections.map(item => item.id)
        );

        let handleRemovedItems = <T extends {id: string, position: number}>(currentItems: T[], workType: string): T[] => {
            let removedItems: T[] = [];

            // position = -1 means the job will be ignored by business code
            currentItems.forEach(item => {
                // if the job is no longer in the worklist remove it
                if (!allLiveItems.some(liveItem => liveItem.id === item.id && liveItem.workType === workType)) {
                    item.position = -1;
                    removedItems.push(item);
                }
                // if a previously healthy job has errored remove it
                if (failures.some(failedJob => failedJob.id === item.id && failedJob.workType === workType)) {
                    item.position = -1;
                }
            });
            return removedItems;
        };

        let handleNewOrUpdatedJobs = <T extends {id: string, position: number}>(currentItems: T[], incomingItems: T[], newItems: string []) => {

            incomingItems.forEach(incomingItem => {

                let idx = currentItems.findIndex(item => item.id === incomingItem.id);

                if (idx >= 0) {
                    currentItems[idx] = incomingItem;
                } else {
                    currentItems.push(incomingItem);
                    newItems.push(incomingItem.id);
                }
            });
        };

        let currentJobs = await this._jobCacheService.getWorkListJobs() || [];
        let removedJobs = handleRemovedItems(currentJobs, "job");
        let newPartsCollections: string [] = [];
        let newJobs: string [] = [];

        handleNewOrUpdatedJobs(currentJobs, jobs, newJobs);

        let currentPartsCollections: JobPartsCollection[] = await this._jobCacheService.getPartsCollections() || [];
        let removedPartsCollections = handleRemovedItems(currentPartsCollections, "partsCollection");
        handleNewOrUpdatedJobs(currentPartsCollections, partsCollections, newPartsCollections);

        // for (let job of jobs) {
        //     // eventually Howard wants a status acknowledgment for partsCollections too,
        //     //  but only jobs at the moment
        //     await this.sendJobStatusAcknowledged(job.id, job.visit && job.visit.id);
        // }

        return {currentJobs, newJobs, removedJobs, currentPartsCollections, removedPartsCollections};
    }

    private setPositions(allLiveItems: IWorkListItem[], jobs: Job[], partsCollections: JobPartsCollection[], failures: JobApiFailure[]): void {
        allLiveItems.forEach((liveItem, index) => {
            let job = (liveItem.workType === "job") && jobs.find(item => item.id === liveItem.id);
            if (job && job.position !== -1) {
                job.position = index;
                return;
            }
            let partsCollection = (liveItem.workType === "partsCollection") && partsCollections.find(item => item.id === liveItem.id);
            if (partsCollection && partsCollection.position !== -1) {
                partsCollection.position = index;
                return;
            }
            let apiFailure = failures.find(item => item.id === liveItem.id && item.workType === liveItem.workType);
            if (apiFailure && apiFailure.position !== -1) {
                apiFailure.position = index;
            }
        });
    }

    private processWorkListMessages(workListResponseData: IWorkListResponseData): void {
        this.logProgress("processMessages");
        if (workListResponseData && workListResponseData.memoList) {
            this._messageService.updateMessages(workListResponseData.memoList);
        }
    }

    private async retrieveItemsOrErrors(itemsToRetrieve: IWorkListItem[]): Promise<RetrievalResults> {
        this.logProgress("requestJobs", itemsToRetrieve && itemsToRetrieve.map(item => item && item.id));

        let jobItems = itemsToRetrieve.filter(item => this.isWorklistItemLiveJob(item));
        let partsCollectionItems = itemsToRetrieve.filter(item => this.isWorklistItemLivePartsCollection(item));
        try {
            let [jobsAndErrors, partCollectionsAndErrors] = await Promise.all([
                Promise.map(jobItems, worklistItem => this.getWorklistJobOrError(worklistItem)),
                Promise.map(partsCollectionItems, worklistItem => this.getWorklistPartsCollectionOrError(worklistItem))
            ]);

            let jobs = jobsAndErrors
                .filter(item => !item.isError);

            let partsCollections = partCollectionsAndErrors
                .filter(item => !item.isError);

            let failures = [...jobsAndErrors, ...partCollectionsAndErrors]
                .filter(item => item.isError);

            return {
                    jobs: jobs.map(item => <Job>item.data),
                    partsCollections: partsCollections.map(item => <JobPartsCollection>item.data),
                    failures: failures.map(item => <JobApiFailure>item.data),
                    okItems: [
                        ...jobs.map(item => item.worklistItem),
                        ...partsCollections.map(item => item.worklistItem)
                    ],
                    failedItems: failures.map(item => item.worklistItem)
                };
        } catch (err) {
            this.logError("retrieveWorkListJobsOrErrors", "retrieveWorkListJobsOrErrorsError", err);
            throw new BusinessException(this, "getWorkListJobs", "An error has occurred getting all worklist jobs", [], err);
        }
    }

    private async getWorklistJobOrError(worklistItem: IWorkListItem): Promise<{ isError: boolean, data: Job | JobApiFailure, worklistItem: IWorkListItem }> {
        this.logProgress("getWorklistItem", worklistItem.id);

        try {
            let [jobApiModel, jobApiHistory] = await Promise.all([
                this.getWorklistJob(worklistItem),
                this.getWorklistJobHistory(worklistItem)
            ]);

            await this.sendJobStatusAcknowledged(worklistItem.id, jobApiModel.visit && jobApiModel.visit.id);

            let job = await this._jobFactory.createJobBusinessModel(worklistItem, jobApiModel, jobApiHistory);
            this.logProgress("returnedJobAndJobHistory");

            return { isError: false, data: job, worklistItem };
        } catch (err) {
            this.logError("getWorklistItemOrError", "getWorklistItemOrErrorError", err);
            return { isError: true, data: <JobApiFailure>{id: worklistItem.id, workType: "job"}, worklistItem };
        }
    }

    private async getWorklistPartsCollectionOrError(worklistItem: IWorkListItem): Promise<{ isError: boolean, data: JobPartsCollection | JobApiFailure, worklistItem: IWorkListItem }> {

        try {
            const partApiModel = await this.getPartCollection(worklistItem);
            const partCollectionJob = await this._jobFactory.createPartCollectionBusinessModel(worklistItem, partApiModel);

            this.logProgress("returnedPartCollection");

            return {isError: false, data: partCollectionJob, worklistItem};
        } catch (err) {
            this.logError("getWorkListPartsCollectionOrError", "getWorkListPartsCollectionOrError", err);
            return { isError: true, data: <JobApiFailure>{id: worklistItem.id, workType: "partsCollection"}, worklistItem };
        }
    }

    private async getWorklistJob(worklistItem: IWorkListItem): Promise<IJob> {
        let jobId = worklistItem.id;
        let breakCache = this._tracker.hasItemFailedPreviously(worklistItem);
        this.logProgress("requestJobRecord", jobId, { breakCache });

        try {
            let job = await this._fftService.getJob(jobId, breakCache);
            if (!job) {
                throw new BusinessException(this, "getWorklistJob", "Empty job '{0}' from API", [jobId], null);
            }
            return job;
        } catch (err) {
            throw new BusinessException(this, "getWorklistJob", "Getting job '{0}' from API", [jobId], err);
        }

    }

    private async getWorklistJobHistory(worklistItem: IWorkListItem): Promise<IJobHistory> {
        let jobId = worklistItem.id;
        let breakCache = this._tracker.hasItemFailedPreviously(worklistItem);
        this.logProgress("requestJobHistory", jobId, { breakCache });

        try {
            let jobHistory = await this._fftService.getJobHistory(jobId, breakCache);
            if (!jobHistory) {
                throw new BusinessException(this, "getWorklistJobHistory", "Empty jobHistory '{0}' from API", [jobId], null);
            }

            return jobHistory;
        } catch (err) {
            throw new BusinessException(this, "getWorklistJobHistory", "Getting job history '{0}' from API", [jobId], err);
        }
    }

    private async getPartCollection(worklistItem: IWorkListItem): Promise<IPartCollectionResponse> {
        const jobId = worklistItem.id;
        let breakCache = this._tracker.hasItemFailedPreviously(worklistItem);
        this.logProgress("requestPartsCollection", jobId, {breakCache });

        try {
            let partCollection = await this._fftService.getPartsCollection(jobId, breakCache);

            if (!partCollection) {
                throw new BusinessException(this, "getPartsCollection", "Empty partsCollection '{0}' from API", [jobId], null);
            }

            return partCollection;
        } catch (err) {
            throw new BusinessException(this, "getPartsCollection", "Empty partsCollection '{0}' from API", [jobId], err);
        }
    }

    private async shouldCompleteWorkListRetrieval(workListResponse: IWorkListResponse, intervals: number[]): Promise<boolean> {
        if (this._tracker.hasWorklistFailedPreviously()) {
            return true;
        }

        let newTimestamp = this.getTimeStamp(workListResponse);
        let hasTimestampChanged = newTimestamp !== this._tracker.getLastKnownModifiedTimestamp();
        this.logProgress("comparingBeforeAndAfterTimestamps", [this._tracker.getLastKnownModifiedTimestamp(), newTimestamp, "has changed?: " + hasTimestampChanged]);
        if (hasTimestampChanged) {
            return true;
        }

        //  if there are jobs in the response, and this is our first call, but we are not detecting a change in workList,
        //   lets still show the engineer the jobs we have.
        let isEndOfPollingVeryFirstRequestForWork = intervals.length === 0
            && this._tracker.isFirstRequestForWorkOfTheDay()
            && workListResponse && workListResponse.data && workListResponse.data.list && !!workListResponse.data.list.length;
        if (isEndOfPollingVeryFirstRequestForWork) {
            return true;
        }

        let isAPreviouslyFailedJobInWorkList = workListResponse && workListResponse.data && workListResponse.data.list
            && workListResponse.data.list.some(workListItem => this._tracker.hasItemFailedPreviously(workListItem));
        if (isAPreviouslyFailedJobInWorkList) {
            return true;
        }

        let isAJobInTodoThatIsNotInWorklist = await this._jobCacheService.existsALiveJobNotInWorklist();
        if (isAJobInTodoThatIsNotInWorklist) {
            return true;
        }

        return false;
    }

    private isWorklistItemLiveJob(worklistItem: IWorkListItem): boolean {
        return worklistItem.workType === ObjectHelper.getPathValue(this._businessRules, "workTypeJob")
        && worklistItem.status === ObjectHelper.getPathValue(this._businessRules, "statusAllocated");
    }

    private isWorklistItemLivePartsCollection(worklistItem: IWorkListItem): boolean {
        return worklistItem.workType === ObjectHelper.getPathValue(this._businessRules, "workTypePartsCollection")
        && worklistItem.status === ObjectHelper.getPathValue(this._businessRules, "statusToCollect");
    }

    private getLiveWorklistItems(list: IWorkListItem[]): IWorkListItem[] {

        return list
            .filter(worklistItem => this.isWorklistItemLiveJob(worklistItem) || this.isWorklistItemLivePartsCollection(worklistItem));
    }

    private registerNewWorkList(workListResponse: IWorkListResponse, isOnlyForTracking: boolean): void {
        let newTimestamp = this.getTimeStamp(workListResponse);
        this.logProgress("registerNewTimestamp", newTimestamp);
        this._tracker.registerNewWorklist(newTimestamp, isOnlyForTracking);
    }

    private getTimeStamp(workListResponse: IWorkListResponse): string {
        return workListResponse && workListResponse.meta && workListResponse.meta.modifiedTimestamp
            ? workListResponse.meta.modifiedTimestamp
            : undefined;
    }

    private logProgress(step: string, ...rest: any[]): void {
        this._logger.info(step, rest);
    }

    private logError(reference: string, message: string, err: any): void {
        let errorString = err ? err.toString() : "no-error";

        let analyticsMsg = (err instanceof BaseException)
            ? message + " " + (<BaseException>err).resolvedMessage
            : message + " " + errorString;

        let analyticsModel = new AnalyticsExceptionModel(AnalyticsExceptionCodeConstants.WORK_RETRIVAL_SERVICE, false, analyticsMsg);
        this._logger.error(`${reference} - ${message}`, analyticsModel, errorString);
    }

    private async notify(failures: JobApiFailure[], removed: Job[], newItems: string []): Promise<void> {

        let messages: string[] = [];
        let autoDismiss: boolean = true;

        if (removed && removed.length) {
            let liveJobs = await this._jobCacheService.getJobsToDo();
            let liveJob = liveJobs.find(job => Job.isActive(job));
            let liveJobId = liveJob && liveJob.id;

            if (liveJobId && removed.some(removedJob => removedJob.id === liveJobId)) {
                messages.push(`The job you are working on (${liveJobId}) has been cancelled!`);
            }

            let removedTodoJobs = removed.filter(removedJob => removedJob.id !== liveJobId
                && !liveJobs.some(job => job.id === removedJob.id));
            if (removedTodoJobs.length) {
                messages.push(`${removedTodoJobs.length} of todays job(s) have been removed from your worklist.`);
            }
            autoDismiss = false;
        }

        if (failures && failures.length) {
            let jobList = failures.map(failure => failure.id).join(", ");
            messages.push(`Failed to load job(s) ${jobList} in the latest work list.`);
        }

        if (messages.length) {
            this.notifyToast("Worklist Update Issue: " + ["Worklist Update Issue: ", ...messages].join("\n"), undefined, autoDismiss);
        }

        if (newItems && newItems.length) {
            // new jobs identified, notify via sound
            this._eventAggregator.publish(SoundConstants.NOTIFICATION_SOUND, 2);
        }
    }

    private notifyToast(content: string, details?: string, autoDismiss?: boolean): void {
        if (this._activeToastItem) {
            this._toastManager.closeToast(this._activeToastItem);
        } else {
            let toast = <IToastItem>{
                id: Guid.newGuid(),
                title: "Work List Retrieval Problem",
                style: "warning",
                autoDismiss: autoDismiss
            };
            toast.content = new Date().toLocaleTimeString() + " :" + content;
            toast.toastAction = details && { details };
            this._eventAggregator.publish(AppConstants.APP_TOAST_ADDED, toast);
            this._activeToastItem = toast;
        }
    }

    private async sendJobStatusAcknowledged(jobId: string, visitId: string): Promise<void> {
        let rulesGroup = await this._businessRuleService.getRuleGroup("jobFactory");

        const ruleGroupKey = "statusTaskAcknowledged";

        let ackJobReceivedStatus = <IJobStatusRequest>{
            data: {
                jobId,
                reason: null,
                statusCode: rulesGroup[ruleGroupKey],
                timestamp: DateHelper.toJsonDateTimeString(new Date()),
                visitId
            }
        };

        return this._fftService.jobStatusUpdate(jobId, ackJobReceivedStatus);
    }
}
