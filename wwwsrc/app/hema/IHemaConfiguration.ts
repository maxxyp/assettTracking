import {IEndpointConfiguration} from "../common/resilience/models/IEndpointConfiguration";

export interface IHemaConfiguration {
    applicationTitle: string;
    applicationBadge: string;
    organisationId: string;
    applicationId: string;

    fftServiceEndpoint: IEndpointConfiguration;
    whoAmIServiceEndpoint: IEndpointConfiguration;
    adaptServiceEndpoint: IEndpointConfiguration;
    assetTrackingEndpoint: IEndpointConfiguration;

    activeDirectoryRoles: string[];
    workListPostRequestWorkPollingIntervals: number[]; // time in milliseconds
    workListPollingInterval: number; // time in milliseconds
    worklistAlwaysGetAllJobs: boolean;
    adaptPollingInterval: number; // time in milliseconds
    adaptLaunchUri: string;
    alwaysAllowSignOff: boolean;
    maxDaysArchiveRetrival: number;
    logLevel: string;
    logJobOnEverySave: boolean;
    resilienceRertyIntervals: number[];
    whoAmITimeoutRetries: number;
    whoAmITimeoutMs: number;
    resilienceSendAnalyticsOnSuccess: boolean;
    resilienceFlushSkipFailures?: boolean;
    unSentPayloadExpiryMinutes?: number;
    maxLogFileAgeDays: number;
}
