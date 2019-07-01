import {IHemaConfiguration} from "./hema/IHemaConfiguration";
import {IEndpointConfiguration} from "./common/resilience/models/IEndpointConfiguration";
import {IReferenceDataConfiguration} from "./hema/business/services/interfaces/IReferenceDataConfiguration";
import { ICustomerInfoConfiguration } from "./hema/business/services/interfaces/ICustomerInfoConfiguration";
import { IAnalyticsConfiguration } from "./common/analytics/IAnalyticsConfiguration";
import { ISimulation } from "./hema/business/services/interfaces/ISimulation";
import { ITrainingModeConfiguration } from "./hema/business/services/interfaces/ITrainingModeConfiguration";
import { IVanStockConfiguration } from "./hema/business/services/interfaces/IVanStockConfiguration";

export class Configuration implements IHemaConfiguration,
    IReferenceDataConfiguration,
    ICustomerInfoConfiguration,
    IAnalyticsConfiguration,
    ITrainingModeConfiguration,
    IVanStockConfiguration {
    public applicationBadge: string;
    public applicationTitle: string;
    public organisationId: string;
    public applicationId: string;

    public fftServiceEndpoint: IEndpointConfiguration;
    public whoAmIServiceEndpoint: IEndpointConfiguration;
    public adaptServiceEndpoint: IEndpointConfiguration;
    public assetTrackingEndpoint: IEndpointConfiguration;

    public activeDirectoryRoles: string[];
    public workListPostRequestWorkPollingIntervals: number[];
    public workListPollingInterval: number;
    public worklistAlwaysGetAllJobs: boolean;
    public adaptPollingInterval: number;

    public adaptLaunchUri: string;
    public alwaysAllowSignOff: boolean;

    public referenceDataStaleMinutes: number;
    public targetReferenceDataTypes: string[];
    public maxDaysArchiveRetrival: number;
    public logLevel: string;
    public maxLogFileAgeDays: number;

    public customerInfoAutoLaunch: boolean;
    public customerInfoReOpenExpiryMinutes: number;

    public analyticsTrackingId: string;
    public analyticsEnabled: boolean;
    public logGeoLocation: boolean;

    public simulation: ISimulation[];
    public trainingMode: boolean;
    public logJobOnEverySave: boolean;

    public resilienceRertyIntervals: number[];
    public whoAmITimeoutRetries: number;
    public whoAmITimeoutMs: number;
    public resilienceSendAnalyticsOnSuccess: boolean;
    public resilienceFlushSkipFailures?: boolean;

    public assetTrackingSearchStaleMinutes: number;
    public assetTrackingPollingIntervalMinutes: number;
    public assetTrackingCacheRefreshTimeHHmm: string;
    public assetTrackingActivePollingPattern: number[];
}
