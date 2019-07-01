/// <reference path="../../../../typings/app.d.ts" />
import * as Logging from "aurelia-logging";
import { IEndpointConfiguration } from "../models/IEndpointConfiguration";
import { IConfigurationService } from "../../core/services/IConfigurationService";
import { RetryPayload } from "../models/retryPayload";
import { Guid } from "../../core/guid";
import { IResilientService } from "./interfaces/IResilientService";
import * as moment from "moment";
import { EventAggregator } from "aurelia-event-aggregator";
import { ResilientServiceConstants } from "../constants/resilientServiceConstants";
import { IHttpHeader } from "../../core/IHttpHeader";
import { IHttpHeaderProvider } from "./interfaces/IHttpHeaderProvider";
import { ObjectHelper } from "../../core/objectHelper";
import { IStorageService } from "../../../hema/business/services/interfaces/IStorageService";
import { SuccessLoggingMode } from "../models/successLoggingMode";
import { ResilientHttpClientFactory } from "./resilientHttpClientFactory";
import { ApiException } from "../apiException";
import { IHemaConfiguration } from "../../../hema/IHemaConfiguration";
import { WuaNetworkDiagnostics } from "../../core/wuaNetworkDiagnostics";
import { AnalyticsConstants } from "../../analytics/analyticsConstants";
import { IAnalyticsEvent } from "../../analytics/IAnalyticsEvent";

type HttpMethod = "GET" | "POST" | "PUT";

export abstract class ResilientService implements IResilientService {
    public static UNKNOWN_FLAG: string = "Unknown";
    public static HTTP_OK_FLAG: string = "OK";
    public static HTTP_FAILED_FLAG: string = "Failed";

    private _configurationName: string;
    private _endpointConfiguration: IEndpointConfiguration;

    private _eventAggregator: EventAggregator;
    private _httpHeaderProvider: IHttpHeaderProvider;
    private _storageService: IStorageService;
    private _logger: Logging.Logger;
    private _resilientHttpClientFactory: ResilientHttpClientFactory;
    private _wuaNetworkDiagnostics: WuaNetworkDiagnostics;
    private _payloads: RetryPayload[];
    private _isRetryInProgress: boolean;
    private _configurationService: IConfigurationService;

    constructor(configurationService: IConfigurationService,
        configurationName: string,
        storageService: IStorageService,
        eventAggregator: EventAggregator,
        httpHeaderProvider: IHttpHeaderProvider,
        resilientHttpClientFactory: ResilientHttpClientFactory,
        wuaNetworkDiagnostics?: WuaNetworkDiagnostics) {
        this._configurationName = configurationName;
        this._storageService = storageService;        
        this._eventAggregator = eventAggregator;
        this._httpHeaderProvider = httpHeaderProvider;
        this._logger = Logging.getLogger("ResilientService");
        this._resilientHttpClientFactory = resilientHttpClientFactory;
        this._wuaNetworkDiagnostics = wuaNetworkDiagnostics;
        this._configurationService = configurationService;

        this._endpointConfiguration = this._configurationService.getConfiguration<IEndpointConfiguration>(configurationName);
        if (!this._endpointConfiguration) {
            throw new Error("Missing endpoint configuration " + configurationName);
        }
    }

    public getUnsentPayloads(): Promise<RetryPayload[]> {
        return Promise.resolve(this.getPayloadsReference());
    }

    public async clearUnsentPayloads(): Promise<void> {
        this._payloads = [];
        this.commitRetryPayloads();
    }

    public sendAllRetryPayloads(): Promise<void> {
        return this.flushRetryQueue();
    }

    public isRetryInProgress(): boolean {
        return this._isRetryInProgress;
    }

    public isInternetConnected(): boolean {
        return !!this._wuaNetworkDiagnostics && this._wuaNetworkDiagnostics.isInternetConnected();
    }

    public getConfigurationName(): string {
        return this._configurationName;
    }

    protected getData<T>(routeName: string, params: { [id: string]: any }, breakCache?: boolean): Promise<T> {
        return this.makeImmediateCall<void, T>("GET", routeName, params, null, breakCache);
    }

    protected postData<T, V>(routeName: string, params: { [id: string]: any }, data: T): Promise<V> {
        return this.makeImmediateCall<T, V>("POST", routeName, params, data);
    }

    protected putData<T, V>(routeName: string, params: { [id: string]: any }, data: T): Promise<V> {
        return this.makeImmediateCall<T, V>("PUT", routeName, params, data);
    }

    protected postDataResilient(routeName: string, params: { [id: string]: any }, data: any): Promise<void> {
        return this.makeQueuedCall("POST", routeName, params, data);
    }

    protected putDataResilient(routeName: string, params: { [id: string]: any }, data: any): Promise<void> {
        return this.makeQueuedCall("PUT", routeName, params, data);
    }

    private makeImmediateCall<T, V>(httpMethod: HttpMethod, routeName: string, params: { [id: string]: any }, data?: T, breakCache?: boolean): Promise<V> {

        ObjectHelper.sanitizeObjectStringsForHttp(data);

        let p = this._httpHeaderProvider
            ? this._httpHeaderProvider.getHeaders(routeName)
            : Promise.resolve([]);

        return p
            .then(headers => this.sendPayload(httpMethod, routeName, headers, params, null, data, breakCache))
            .then(result => {
                this.flushRetryQueue(); // do not wait on this promise
                return result;
            })
            .catch((error) => {
                this._logger.warn("Error", { routeName, input: { method: "GET", params, breakCache }, error });
                throw error;
            });
    }

    private makeQueuedCall(httpMethod: HttpMethod, routeName: string, params: { [id: string]: any }, data?: any, breakCache?: boolean): Promise<any> {

        ObjectHelper.sanitizeObjectStringsForHttp(data);

        let p = this._httpHeaderProvider
            ? this._httpHeaderProvider.getHeaders(routeName)
            : Promise.resolve([]);

        return p
            .then(headers => {
                let retryPayload = this.buildRetryPayload(httpMethod, routeName, headers, params, data);
                this.addNewRetryPayload(retryPayload);
            })
            .then(() => {
                /* do not wait on this promise as we do not want to make any subsequent business
                    logic to wait for the flushing to complete - it may take a loooong time */
                this.flushRetryQueue();
            });
    }

    private async sendPayload(httpMethod: HttpMethod, routeName: string,
        headers: IHttpHeader[], params: { [id: string]: any }, retryGuid: Guid, data?: any, breakCache?: boolean): Promise<any> {
        let guid = Guid.newGuid();

        let routeConfig = this._endpointConfiguration.routes.find(route => route.route === routeName);
        let clientConfig = this._endpointConfiguration.clients.find(client => client.name === routeConfig.client);
        let { root } = clientConfig;
        let { path } = routeConfig;

        let successLoggingMode = routeConfig.successLoggingMode || SuccessLoggingMode.log; // default to full logging
        let inputLoggingParams: any = { method: httpMethod, root, path, params, breakCache, headers, data };
        let startTime: number;

        const config = this._configurationService.getConfiguration<IHemaConfiguration>();
        const resilienceSendAnalyticsOnSuccess = config.resilienceSendAnalyticsOnSuccess;
        try {
            let resolveHttpMethodAndSend = (): Promise<any> => {
                let httpClient = this._resilientHttpClientFactory.getHttpClient(clientConfig);
                switch (httpMethod) {
                    case "GET":
                        return httpClient.getData(root, path, params, breakCache, headers);
                    case "POST":
                        return httpClient.postData(root, path, params, data, headers);
                    case "PUT":
                        return httpClient.putData(root, path, params, data, headers);
                    default:
                        throw "Unknown HttpMethod verb: " + httpMethod;
                }
            };

            if (successLoggingMode !== SuccessLoggingMode.dontLog) {
                this._logger.warn("Attempt", { guid, retryGuid });
            }

            startTime = Date.now();
            let result = await resolveHttpMethodAndSend();

            if (result && result.status && result.error) {
                throw new ApiException(this, "sendPayload", "Middleware 200 error - status: {0}, error - {1}",
                    [result.status, result.error], result, result.status);
            }

            let elapsedTimeMs = Date.now() - startTime;

            if (resilienceSendAnalyticsOnSuccess && this._endpointConfiguration.sendAnalyticsOnSuccess) {
                this.sendAnalytics(routeName, ResilientService.HTTP_OK_FLAG, elapsedTimeMs);
            }

            let logObject = {
                guid,
                routeName,
                input: inputLoggingParams,
                result,
                retryGuid,
                elapsedTimeMs
            };

            switch (successLoggingMode) {
                case SuccessLoggingMode.log:
                    this._logger.warn("Success", logObject);
                    break;
                case SuccessLoggingMode.logWithoutResponse:
                    logObject.result = "not logged";
                    this._logger.warn("Success", logObject);
                    break;
                default:
                    break;
            }

            return result;

        } catch (exception) {
            let elapsedTimeMs = Date.now() - startTime;
            exception = exception || ResilientService.UNKNOWN_FLAG;

            let httpStatusCode;
            let errorMessage = exception.toString();

            if (exception instanceof ApiException) {
                let apiException = <ApiException>exception;
                httpStatusCode = apiException.httpStatusCode;
                errorMessage = `${apiException.reference}: ${apiException.resolvedMessage}`;
            }

            // if we have not got an httpStatusCode then we may be having network issues (i.e. a response as not received), so gather info
            let networkDiagnostics = (!httpStatusCode && this._wuaNetworkDiagnostics)
                ? this._wuaNetworkDiagnostics.getDiagnostics()
                : undefined;

            if (networkDiagnostics) {
                httpStatusCode = ResilientService.HTTP_FAILED_FLAG + "-" + networkDiagnostics.connection;
            }

            httpStatusCode = httpStatusCode || ResilientService.UNKNOWN_FLAG;

            if (this._configurationName === "whoAmIServiceEndpoint") {
                this.sendAnalytics(routeName, httpStatusCode, elapsedTimeMs);
            }

            let logObject = {
                guid,
                routeName,
                input: inputLoggingParams,
                result: errorMessage,
                retryGuid,
                elapsedTimeMs,
                httpStatusCode,
                networkDiagnostics
            };

            this._logger.error("Error", logObject);
            throw exception;
        }
    }

    private sendAnalytics(routeName: string, httpStatusCode: string, elapsedTimeMs: number): void {
        this._eventAggregator.publish(AnalyticsConstants.ANALYTICS_EVENT, <IAnalyticsEvent>{
            category: AnalyticsConstants.HTTP_RESULT,
            action: routeName,
            label: httpStatusCode,
            metric: elapsedTimeMs
        });
    }

    private buildRetryPayload(httpMethod: HttpMethod, routeName: string, headers: IHttpHeader[], params: { [id: string]: any }, data: any): RetryPayload {
        let retryPayload: RetryPayload = new RetryPayload();
        retryPayload.correlationId = Guid.newGuid();
        retryPayload.createdTime = new Date();
        retryPayload.httpMethod = httpMethod;
        retryPayload.routeName = routeName;
        retryPayload.headers = headers;
        retryPayload.params = params;
        retryPayload.data = data;

        const config = this._configurationService.getConfiguration<IHemaConfiguration>();
        const unSentPayloadExpiryMinutes = config.unSentPayloadExpiryMinutes;

        if (!!unSentPayloadExpiryMinutes && unSentPayloadExpiryMinutes > 0) {
            retryPayload.expiryTime = moment().add(unSentPayloadExpiryMinutes, "minutes").toDate();
        }    

        retryPayload.lastFailureMessage = "";
        retryPayload.failureWithoutStatusCount = 0;
        retryPayload.failureWithStatusCount = 0;

        return retryPayload;
    }

    private async flushRetryQueue(): Promise<void> {
        const config = this._configurationService.getConfiguration<IHemaConfiguration>();
        const retryIntervals = config.resilienceRertyIntervals || [];
        const resilienceFlushSkipFailures =  config.resilienceFlushSkipFailures;
        // if the user is at (say) the end of day, and there is a particular call that is permanently
        //  not working, all subsequent calls we also be blocked. isHardFlush will flush as normal but continue
        //  on through the queue regardless if each or any call 500s etc.
        if (this._isRetryInProgress) {
            return;
        }
        this._isRetryInProgress = true;

        let getPayload = (index: number) => {
            // rather than take a local snapshot of payloads, it's probably better to keep accessing
            //  the underlying payloads via this.getUnsentPayloads() because this.retryPayload directly
            //  updates the underlying storage to e.g. splice out successful records.  If we had a local
            //  copy we'd have to duplicate that logic.
            let payloads = this.getPayloadsReference();
            return payloads
                && (payloads.length >= index + 1)
                && { index, payload: payloads[index] };
        };

        let pollingRetryAPayload = async (retryPayload: RetryPayload): Promise<boolean> => {            
            let retryDurations = [...retryIntervals].reverse(); // reverse so we pop from the start

            while (true) {
                let isSuccess = await this.retryPayload(retryPayload);
                if (isSuccess) {
                    return true;
                }

                let delay = retryDurations.pop();
                if (delay === undefined) {
                    // there are no more intervals left to wait so break out
                    break;
                }

                await Promise.delay(delay);
            }
            return false;
        };

        let nextIndexToPick = 0;
        while (true) {
            let payload = getPayload(nextIndexToPick);
            if (!payload) {
                break;
            }

            let isSuccess = await pollingRetryAPayload(payload.payload);
            if (isSuccess) {
                // all good, so just loop and take from the top of the queue again
            } else {
                if (resilienceFlushSkipFailures) {
                    // failed, but we are not going to let the top retry payload block the rest
                    nextIndexToPick += 1;
                } else {
                    // failed and we need to block to ensure payloads always go out in order
                    break;
                }
            }
        }

        this._isRetryInProgress = false;
        // one more call to allow subscribers to detect the end of the global retry
        this._eventAggregator.publish(ResilientServiceConstants.UNSENT_PAYLOADS_UPDATES, this._configurationName);
    }

    private async retryPayload(retryPayload: RetryPayload): Promise<boolean> {
        retryPayload.isRetrying = true;
        retryPayload.lastFailureMessage = "";
        this.saveChangedRetryPayload(retryPayload);

        try {
            await this.sendPayload(retryPayload.httpMethod,
                retryPayload.routeName,
                retryPayload.headers,
                retryPayload.params,
                retryPayload.correlationId,
                retryPayload.data);
            this.removeSuccessfulRetryPayload(retryPayload);
            return true;
        } catch (err) {
            retryPayload.isRetrying = false;
            retryPayload.lastFailureMessage = err && err.toString();
            retryPayload.lastRetryTime = new Date();
            let statusCode = err && (err as ApiException).httpStatusCode;
            if (statusCode) {
                retryPayload.lastKnownFailureStatus = statusCode;
                retryPayload.failureWithStatusCount += 1;
            } else {
                retryPayload.failureWithoutStatusCount += 1;
            }
            this.saveChangedRetryPayload(retryPayload);
            return false;
        }
    }

    private addNewRetryPayload(retryPayload: RetryPayload): void {
        let payloads = this.getPayloadsReference();
        payloads.push(retryPayload);
        this.commitRetryPayloads();
    }

    private removeSuccessfulRetryPayload(retryPayload: RetryPayload): void {
        let payloads = this.getPayloadsReference();
        let payloadIndexToRemove = payloads.findIndex(payload => payload.correlationId === retryPayload.correlationId);
        if (payloadIndexToRemove !== -1) {
            payloads.splice(payloadIndexToRemove, 1);
            this.commitRetryPayloads();
        }
    }

    private saveChangedRetryPayload(retryPayload: RetryPayload): void {
        let payloads = this.getPayloadsReference();
        let payloadIndexToSave = payloads.findIndex(payload => payload.correlationId === retryPayload.correlationId);
        if (payloadIndexToSave !== -1) {
            payloads[payloadIndexToSave] = retryPayload;
            this.commitRetryPayloads();
        }
    }

    private getPayloadsReference(): RetryPayload[] {
        // if we had an initialise event/method, then we'd be able to simplyfy all of this
        if (!this._payloads) {
            this._payloads = [];

            let resiliencePayloads = this._storageService.getResilienceRetryPayloads(this._configurationName.toUpperCase()) || [];
            if (resiliencePayloads.length) {
                // if we have payloads in storage when we are starting the app for the first time, reset any retrying flags set as true
                resiliencePayloads.forEach(payload => payload.isRetrying = false);
                this._payloads = [...resiliencePayloads, ...this._payloads];
                this.commitRetryPayloads();
            }
        }

        let timeNow = new Date().getTime();
        let haveExpiredPayloads = this._payloads.some(retryPayload => !!retryPayload.expiryTime && retryPayload.expiryTime.getTime() < timeNow);
        if (haveExpiredPayloads) {
            this._payloads = this._payloads.filter(retryPayload => !!retryPayload.expiryTime && retryPayload.expiryTime.getTime() >= timeNow);
            this.commitRetryPayloads();
        }

        return this._payloads;
    }

    private commitRetryPayloads(): void {
        this._storageService.setResilienceRetryPayloads(this._configurationName.toUpperCase(), this._payloads);
        this._eventAggregator.publish(ResilientServiceConstants.UNSENT_PAYLOADS_UPDATES, this._configurationName);
    }
}
