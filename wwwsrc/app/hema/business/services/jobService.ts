/// <reference path="../../../../typings/app.d.ts" />
import * as Logging from "aurelia-logging";
import { inject } from "aurelia-framework";
import { IJobService } from "./interfaces/IJobService";
import { FftService } from "../../api/services/fftService";
import { IFFTService } from "../../api/services/interfaces/IFFTService";
import { Job } from "../models/job";
import { BusinessException } from "../models/businessException";
import { StateMachine } from "./stateMachine/stateMachine";
import { JobState } from "../models/jobState";
import { State } from "./stateMachine/state";
import { EventAggregator } from "aurelia-event-aggregator";
import { DataStateSummary } from "../models/dataStateSummary";
import { WorkRetrievalServiceConstants } from "./constants/workRetrievalServiceConstants";
import { IJobStatusRequest } from "../../api/models/fft/jobs/status/IJobStatusRequest";
import { JobServiceConstants } from "./constants/jobServiceConstants";
import { IEngineerService } from "./interfaces/IEngineerService";
import { EngineerService } from "./engineerService";
import { IJobFactory } from "../factories/interfaces/IJobFactory";
import { JobFactory } from "../factories/jobFactory";
import { DateHelper } from "../../core/dateHelper";
import { IJobCacheService } from "./interfaces/IJobCacheService";
import { JobCacheService } from "./jobCacheService";
import { ICatalogService } from "./interfaces/ICatalogService";
import { CatalogService } from "./catalogService";
import { IBusinessRuleService } from "../services/interfaces/IBusinessRuleService";
import { BusinessRuleService } from "../services/businessRuleService";
import { IPartFactory } from "../factories/interfaces/IPartFactory";
import { PartFactory } from "../factories/partFactory";
import { ArchiveService } from "./archiveService";
import { IArchiveService } from "./interfaces/IArchiveService";
import { IPartsOrderedRequest } from "../../api/models/fft/jobs/orderparts/IPartsOrderedRequest";
import { IJobUpdateRequest } from "../../api/models/fft/jobs/jobupdate/IJobUpdateRequest";
import { JobApiFailure } from "../models/jobApiFailure";
import { QueryableBusinessRuleGroup } from "../models/businessRules/queryableBusinessRuleGroup";
import { DataState } from "../models/dataState";
import { TaskBusinessRuleHelper } from "../models/businessRules/taskBusinessRuleHelper";
import { JobNotDoingReason } from "../models/jobNotDoingReason";
import * as moment from "moment";
import { JobPartsCollection } from "../models/jobPartsCollection";
import { Threading } from "../../../common/core/threading";
import { ObjectHelper } from "../../../common/core/objectHelper";
import { VanStockService } from "./vanStockService";
import { IVanStockService } from "./interfaces/IVanStockService";
import { IJobUpdate } from "../../api/models/fft/jobs/jobupdate/IJobUpdate";
import { IPartsOrderedTasks } from "../../api/models/fft/jobs/orderparts/IPartsOrderedTasks";
import { FeatureToggleService } from "./featureToggleService";
import { IFeatureToggleService } from "./interfaces/IFeatureToggleService";
import { AppConstants } from "../../../appConstants";
import { IToastItem } from "../../../common/ui/elements/models/IToastItem";
import { Guid } from "../../../common/core/guid";

@inject(EngineerService, FftService, JobFactory, JobCacheService, EventAggregator, CatalogService, BusinessRuleService,
    PartFactory, ArchiveService, VanStockService, FeatureToggleService)
export class JobService implements IJobService {
    private _engineerService: IEngineerService;
    private _fftService: IFFTService;
    private _jobFactory: IJobFactory;
    private _jobCacheService: IJobCacheService;
    private _eventAggregator: EventAggregator;
    private _businessRuleService: IBusinessRuleService;
    private _partFactory: IPartFactory;
    private _archiveService: IArchiveService;
    private _vanStockService: IVanStockService;
    private _featureToggleService: IFeatureToggleService;

    private _stateMachine: StateMachine<JobState>;

    private _logger: Logging.Logger;
    private _isReVisitTabsAlreadyDone: boolean;

    constructor(engineerService: IEngineerService,
        fftService: IFFTService,
        jobFactory: IJobFactory,
        jobCacheService: IJobCacheService,
        eventAggregator: EventAggregator,
        catalogService: ICatalogService,
        businessRuleService: IBusinessRuleService,
        partFactory: IPartFactory,
        archiveService: IArchiveService,
        vanStockService: IVanStockService,
        featureToggleService: IFeatureToggleService) {

        this._engineerService = engineerService;
        this._fftService = fftService;
        this._jobFactory = jobFactory;
        this._jobCacheService = jobCacheService;
        this._eventAggregator = eventAggregator;
        this._businessRuleService = businessRuleService;
        this._partFactory = partFactory;
        this._archiveService = archiveService;
        this._vanStockService = vanStockService;
        this._featureToggleService = featureToggleService;

        this._stateMachine = new StateMachine<JobState>([
            new State(JobState.idle, "Idle", [JobState.enRoute]),
            new State(JobState.enRoute, "Go en-route", [JobState.arrived, JobState.deSelect]),
            new State(JobState.deSelect, "De-select", [JobState.enRoute]),
            new State(JobState.arrived, "Arrive", [JobState.complete]),
            new State(JobState.complete, "Complete", [JobState.done]),
            new State(JobState.done, "Done", [])
        ]);
        this._logger = Logging.getLogger("JobService");
        this._isReVisitTabsAlreadyDone = false;
    }

    public getJobsToDo(): Promise<Job[]> {
        return this._jobCacheService.getJobsToDo();
    }

    public getWorkListJobApiFailures(): Promise<JobApiFailure[]> {
        return this._jobCacheService.getWorkListJobApiFailures();
    }

    public getPartsCollections(): Promise<JobPartsCollection[]> {
        return this._jobCacheService.getPartsCollections();
    }

    public async completePartsCollections(): Promise<void> {
        let partsCollections = await this.getPartsCollections() || [];
        partsCollections.forEach(partsCollection => partsCollection.done = true);
        await this._jobCacheService.setPartsCollections(partsCollections);
    }

    public getJob(id: string): Promise<Job> {
        return this._jobCacheService.getJob(id);
    }

    public setJob(job: Job): Promise<void> {
        return this._jobCacheService.setJob(job);
    }

    public getActiveJobId(): Promise<string> {
        return this.getActiveJob()
            .then(activeJob => {
                return activeJob ? activeJob.id : null;
            });
    }

    public isJobEditable(jobId: string): Promise<boolean> {
        return this.getJob(jobId)
            .then(job => {
                return job ? job.state === JobState.arrived : false;
            });
    }

    public areAllJobsDone(): Promise<boolean> {
        return this.getJobsToDo()
            .then(jobs => {
                if (jobs && jobs.length > 0) {
                    let res = jobs.some(j => j.state !== JobState.done);
                    return !res;
                } else {
                    return true;
                }
            });
    }

    public getJobState(jobId: string): Promise<State<JobState>> {
        return this.getJob(jobId)
            .then((job) => {
                if (job) {
                    return this._stateMachine.lookupState(job.state);
                } else {
                    throw new BusinessException(this, "getJobState.notFound", "Job not found '{0}'", [jobId], null);
                }
            });
    }

    public getJobTargetStates(jobId: string): Promise<State<JobState>[]> {
        return this.getJob(jobId)
            .then((job) => {
                if (job) {
                    return this._stateMachine.getTargetStates(job.state);
                } else {
                    throw new BusinessException(this, "getJobTargetStates.notFound", "Job not found '{0}'", [jobId], null);
                }
            });
    }

    public async setJobState(jobId: string, newState: JobState): Promise<void> {
        const job = await this.getJob(jobId);

        if (!this._stateMachine.trySetState(job.state, newState)) {
            throw new BusinessException(this, "setJobState.trySetState", "Unable to set the state to '{0}' for job '{1}'", [newState, jobId], null);
        }

        job.state = newState;

        switch (job.state) {
            case JobState.idle:
                job.onsiteTime = new Date();
                break;

            case JobState.arrived:
                job.onsiteTime = new Date();
                job.completionTime = null;
                let taskItemRuleGroup = await this._businessRuleService.getQueryableRuleGroup("taskItem");
                const intervalInMinutes: number = taskItemRuleGroup.getBusinessRule<number>("intervalInMinutes");
                this.initTaskTimes(job, intervalInMinutes);
                break;

            case JobState.enRoute:
                job.enrouteTime = new Date();
                job.onsiteTime = null;
                job.completionTime = null;
                break;

            case JobState.deSelect:
                job.cancellationTime = new Date();
                job.onsiteTime = null;
                job.completionTime = null;
                job.state = JobState.idle;
                break;

            case JobState.complete:
                job.completionTime = new Date();
                /* if the job has been completed then we will post the data back with no status update
                    so return the state machine to idle
                    */
                job.state = JobState.done;
                break;
        }
        return this.jobCompletion(job, job.state === JobState.done);
    }

    public getDataStateSummary(jobId: string): Promise<DataStateSummary> {
        return this.getJob(jobId)
            .then((job) => {
                // dataStateCompletionOverrideGroup not getting updated when relaunching the app (set activity status to noaccess and relaunch the app)
                // the below code fixes the data state issue
                let p = Promise.resolve();
                if (!!job.jobNotDoingReason && !DataStateSummary.dataStateCompletionOverrideGroup && job.state === JobState.arrived) {
                    p = this.setJobNoAccessed(job);
                }

                return p.then(() => {
                    return new DataStateSummary(job);
                });
            })
            .catch(() => {
                return null;
            });
    }

    public requiresAppointment(jobId: string): Promise<boolean> {
        return this._businessRuleService.getQueryableRuleGroup("taskItem")
            .then((ruleGroup: QueryableBusinessRuleGroup) => {
                let visitStatuses: string[] = ruleGroup.getBusinessRuleList<string>("appointmentRequiredActivityStatus");
                return this.getJob(jobId).then((job) => {
                    if (!job) {
                        return false;
                    }
                    for (let i: number = 0; i < job.tasks.length; i++) {
                        if (job.tasks[i] && job.tasks[i].status) {
                            if (visitStatuses.indexOf(job.tasks[i].status) > -1) { // found
                                if (!job.appointment) {
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                });
            });
    }

    public async setJobNoAccessed(job: Job): Promise<void> {

        let isATaskSetAsNoAccessed = job.tasks.some(task => task.isTaskThatSetsJobAsNoAccessed);
        let areAllTasksSetAsCancelled = job.tasks.every(task => task.isNotDoingTask);

        let areTasksSayingWeAreNoAccessed = isATaskSetAsNoAccessed || areAllTasksSetAsCancelled;

        let isTransitionIntoNoAccess = areTasksSayingWeAreNoAccessed;
        let isTransitionOutOfNoAccess = job.jobNotDoingReason && !areTasksSayingWeAreNoAccessed;

        if (isTransitionIntoNoAccess && isATaskSetAsNoAccessed) {
            let noAccessingTask = job.tasks.find(task => task.isTaskThatSetsJobAsNoAccessed);
            let otherTasks = job.tasks.filter(task => task !== noAccessingTask);

            otherTasks.forEach(otherTask => {
                otherTask.status = noAccessingTask.status;
                otherTask.dataState = DataState.dontCare;
            });

            job.cancellationTime = new Date();
        }

        if (isTransitionOutOfNoAccess) {
            let taskBusinessRules = await this._businessRuleService.getRuleGroup("taskItem");
            let remainingNoAccessStatusTasks = job.tasks.filter(task => TaskBusinessRuleHelper.isNotDoingJobStatus(taskBusinessRules, task.status));
            remainingNoAccessStatusTasks.forEach(task => {
                task.status = undefined;
                task.dataState = DataState.notVisited;
            });
        }

        job.jobNotDoingReason = isATaskSetAsNoAccessed ? JobNotDoingReason.taskNoAccessed
            : areAllTasksSetAsCancelled ? JobNotDoingReason.allTasksCancelled
                : undefined;

        if (job.jobNotDoingReason) {
            DataStateSummary.dataStateCompletionOverrideGroup = "activities";
        } else {
            DataStateSummary.clearDataStateCompletionOverrideGroup();
        }
    }

    public async checkIfJobFinishTimeNeedsToBeUpdated(): Promise<boolean> {
        let job = await this.getActiveJob();
        let businessRules = await this._businessRuleService.getQueryableRuleGroup("jobService");
        let jobDoingStatuses: string = businessRules.getBusinessRule<string>("jobDoingStatuses");

        let activeTasks = job.tasks.filter(task => jobDoingStatuses.indexOf(task.status) > -1);
        if (activeTasks.length) {
            const jobEndTimeInDate = DateHelper.getDate(activeTasks[activeTasks.length - 1].endTime);
            const durationDiffInMins: number = DateHelper.getTimeDiffInMins(new Date(), jobEndTimeInDate);

            return durationDiffInMins >= JobServiceConstants.JOB_FINISH_TIME_DIFF_MAX_IN_MINS;
        }
        return false;
    }

    private initTaskTimes(job: Job, intervalInMinutes: number): void {
        job.tasks.forEach((task, index, tasks) => {
            task.startTime = index === 0
                                ?  moment(job.onsiteTime)
                                    .format("HH:mm")
                                : tasks[index - 1].endTime;
            task.endTime = moment(task.startTime, "HH:mm")
                            .add(intervalInMinutes, "minutes")
                            .format("HH:mm");
            task.workDuration = intervalInMinutes;
            task.chargeableTime = intervalInMinutes;
        });
    }

    private getActiveJob(): Promise<Job> {
        return this.getJobsToDo()
            .then(jobs => jobs && jobs.find(job => Job.isActive(job)));
    }

    private async jobCompletion(job: Job, isFullCompletion: boolean): Promise<void> {

        const jobFactoryBusinessRules = await this._businessRuleService.getQueryableRuleGroup("jobFactory");
        const engineer = await this._engineerService.getCurrentEngineer();
        let canThisJobBeCompleted: boolean = true;
        const everyTaskIsVo = job.tasks
           .every(task => task.status === jobFactoryBusinessRules.getBusinessRule<string>("NotVisitedOtherActivityStatus"));

        const buildJobStatusUpdateRequest = async () => {
            try {
                const statusCode = await this._jobFactory.getJobStatusCode(job);
                if (!statusCode) {
                    // only hit API if we have transitioned to a "real" status code, not "internal working" etc
                    return undefined;
                }

                const reason = statusCode === jobFactoryBusinessRules.getBusinessRule<string>("statusNoVisit")
                    ? job.tasks.filter(task => task.status === jobFactoryBusinessRules.getBusinessRule<string>("NotVisitedOtherActivityStatus")
                        && task.report)
                    [0].report || ""
                    : "";

                return <IJobStatusRequest>{
                    data: {
                        timestamp: DateHelper.toJsonDateTimeString(new Date()),
                        statusCode,
                        jobId: job.id,
                        visitId: job.visit && job.visit.id,
                        reason
                    }
                };
            } catch (error) {
                this._logger.error("Error building job status update", error && error.toString());
                return undefined;
            }
        };

        const buildPartsOrderRequest = async () => {
            try {
                // see DF_1826, cancelled or no access jobs should not send parts
                const request = !job.jobNotDoingReason && await this._partFactory.createPartsOrderedForTask(job);
                return request && request.tasks && request.tasks.length
                    ? request
                    : undefined;
            } catch (error) {
                this._logger.error("Error building job parts order update", error && error.toString());
                return undefined;
            }
        };

        const buildJobUpdateRequest = async () => {
            try {
                if (everyTaskIsVo) {
                    return undefined;
                }
                const originalJob = (await this._jobCacheService.getWorkListJobs())
                    .find(o => job.id === o.id);
                let jobUpdate = await this._jobFactory.createJobApiModel(job, engineer, originalJob);
                // if a funky string came down to us in the original job then lets keep it
                let stringsToRetain = ObjectHelper.getAllStringsFromObject(originalJob);
                ObjectHelper.sanitizeObjectStringsForJobUpdate(jobUpdate, stringsToRetain);
                return jobUpdate;
            } catch (error) {
                this._logger.error("Error building job update", error);                
                canThisJobBeCompleted = false;                   
                return undefined;             
            }
        };

        const buildMaterialConsumedRequest = async () => {
            try {
                return !!this._featureToggleService.isAssetTrackingEnabled() && !job.jobNotDoingReason ?
                    await this._partFactory.getPartsConsumedOnJob(job) : undefined;
            } catch (error) {
                this._logger.error("Error building material consumption request", error && error.toString());
                return undefined;
            }
        };

        const sendJobStatusUpdate = async (request: IJobStatusRequest) => {
            this._logger.info("jobStatusUpdate", { data: request });
            await this._fftService.jobStatusUpdate(job.id, request);
        };

        const sendPartsRequest = async (request: IPartsOrderedTasks) => {
            this._logger.info("partsOrder", { data: request });
            await this._fftService.orderPartsForJob(job.id, <IPartsOrderedRequest>{ data: request });
        };

        const sendJobUpdate = async (request: IJobUpdate) => {
            this._logger.info("jobUpdate", { data: request });
            await this._fftService.updateJob(job.id, <IJobUpdateRequest>{ data: request });
            this._eventAggregator.publish(JobServiceConstants.JOB_COMPLETED, request);
        };

        const sendMaterialConsumption = async (partsConsumed: { stockReferenceId: string, quantityConsumed: number, isVanStock: boolean }[]) => {
            try {
                if (!!partsConsumed.length) {
                    partsConsumed.forEach(async part => await this._vanStockService.registerMaterialConsumption({
                        stockReferenceId: part.stockReferenceId,
                        quantityConsumed: part.quantityConsumed,
                        jobId: part.isVanStock ? undefined : job.id
                    }));
                }
            } catch (error) {
                this._logger.error("material consumption call failed", error && error.toSting());
            }
        };

        const sendMaterialReturn = async (jobUpdate: IJobUpdate) => {
            try {
                if (!this._featureToggleService.isAssetTrackingEnabled() || !!job.jobNotDoingReason) {
                    return;
                }

                const returnedParts = (jobUpdate && jobUpdate.job && jobUpdate.job.tasks || [])
                    .map(task => task && task.partsNotUsed || [])
                    .reduce((acc, curr) => [...acc, ...curr], [])
                    .map(part => ({
                        stockReferenceId: part.stockReferenceId,
                        quantityReturned: part.quantityNotUsed,
                        jobId: job.id,
                        reason: part.reasonCode
                    }));

                returnedParts.forEach(async part => await this._vanStockService.registerMaterialReturn(part));
            } catch (error) {
                this._logger.error("material return call failed", error && error.toSting());
            }
        };

        const saveJob = async () => {
            this._logger.info("saving job");
            await this._jobCacheService.setJob(job);
        };

        const publishJobStateChangedEvent = () => {
            this._eventAggregator.publish(JobServiceConstants.JOB_STATE_CHANGED);
        };

        const saveArchive = async () => {
            await this._archiveService.addUpdateJobState(job, engineer, JobState.complete);
        };

        const sendEventsAndResetDataState = async (jobUpdate: IJobUpdate) => {
            DataStateSummary.clearDataStateCompletionOverrideGroup();
            this._eventAggregator.publish(JobServiceConstants.JOB_COMPLETION_REFRESH, true);
            let businessRules = await this._businessRuleService.getQueryableRuleGroup("jobService");
            let delay = businessRules.getBusinessRule<number>("jobCompleteRefreshDelayMs") || 5000;
            Threading.delay(() => this._eventAggregator.publish(WorkRetrievalServiceConstants.REQUEST_WORK_AND_REFRESH_WORK_LIST), delay);
            this._isReVisitTabsAlreadyDone = false;
        };

        // keep these as close to each other as possible, basically build eveything and send it at the end
        const jobStatusUpdateRequest = await buildJobStatusUpdateRequest();
        if (!isFullCompletion) {
            if (jobStatusUpdateRequest) {
                await sendJobStatusUpdate(jobStatusUpdateRequest);
                saveJob();
                publishJobStateChangedEvent();
            }
            return;
        }

        const partsReqeust = await buildPartsOrderRequest();
        const jobUpdateRequest = await buildJobUpdateRequest();

        if (canThisJobBeCompleted) {
            if (jobStatusUpdateRequest) {
                await sendJobStatusUpdate(jobStatusUpdateRequest);
            }
    
            if (partsReqeust) {
                await sendPartsRequest(partsReqeust);
            }
    
            if (jobUpdateRequest) {
                await sendJobUpdate(jobUpdateRequest);
                await sendMaterialReturn(jobUpdateRequest);
            }
    
            const materialConsumedRequest = await buildMaterialConsumedRequest();
            if (materialConsumedRequest) {
                await sendMaterialConsumption(materialConsumedRequest);
            }
    
            // keep save immediatley after we want to know that we have put stuff into resilience before setting the job as done
            await saveJob();
            await saveArchive();
            publishJobStateChangedEvent();
            await sendEventsAndResetDataState(jobUpdateRequest);
        } else {
            let content: string = (!this._isReVisitTabsAlreadyDone)
                    ? "We have detected an issue completing this job."
                    + " Please revisit all the pages/tabs to ensure if the forms have been filled in correctly and then press Complete button again to retry job completion."
                    : "We have detected an issue sending this job back to WMIS. So please contact help desk for the further assitance and support";

            this._eventAggregator.publish(AppConstants.APP_TOAST_ADDED, <IToastItem>{
                    id: Guid.newGuid(),
                    title: "Job completion",
                    style: "danger",
                    content,
                    autoDismiss: false,
                    dismissTime: 0
                });
            this._isReVisitTabsAlreadyDone = true;
            // setting job back to arrived status
            job.state = JobState.arrived;
            // this is just close the job completion progress modal popup.
            this._eventAggregator.publish(JobServiceConstants.JOB_COMPLETION_REFRESH, false);  
            // this would set requestedState in state button back to arrived.          
            publishJobStateChangedEvent();
        }       
    }
}
