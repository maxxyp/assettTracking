import {inject} from "aurelia-framework";
import {Interceptor} from "aurelia-fetch-client";
import * as Logging from "aurelia-logging";
import {IScenarioLoader} from "./IScenarioLoader";
import {ScenarioLoader} from "./scenarioLoader";
import {UrlParamService} from "../core/urlParamService";
import {IHttpClient} from "../core/IHttpClient";
import {IHttpHeader} from "../core/IHttpHeader";
import { ApiException } from "../resilience/apiException";

@inject(ScenarioLoader)
export class SimulationClient implements IHttpClient {
    private _scenarioLoader: IScenarioLoader;
    private _logger: Logging.Logger;

    constructor(scenarioLoader: IScenarioLoader) {
        this._scenarioLoader = scenarioLoader;
        this._logger = Logging.getLogger("SimulationClient");
    }

    public setup(options: { username?: string, password?: string, noCredentialsHeader?: boolean, defaultQueryParams?: {[index: string]: string} }, interceptor?: Interceptor): void {
    }

    public fetch(url: string, request?: Request, interceptor?: Interceptor): Promise<Response> {
        throw("not implemented");
    }

    public getData<T>(baseEndpoint: string, endPoint: string, params: { [id: string]: any }, breakCache?: boolean, headers?: IHttpHeader[]): Promise<T> {
        return this.buildUrl(endPoint, params)
            .spread<T>((endPointWithVariables: string, hasQs: Boolean) => {
                this._logger.debug("GET => " + endPointWithVariables);
                if (headers && headers.length > 0) {
                    this._logger.debug("GET Headers => ", headers);
                }
                return this._scenarioLoader.get<T>(endPointWithVariables)
                    .then((response) => {
                        this._logger.debug("GET SUCCESS <= ", response);
                        return response;
                    })
                    .catch((error) => {
                        if (hasQs) {
                            this._logger.debug("GET ERROR (qs route doesn't exist - attempting fallback) <= ", error);
                            return this.getData(baseEndpoint, endPoint.split(/[?#]/)[0], this.omitQsKeys(params), breakCache);
                        }
                        this._logger.debug("GET ERROR <= ", error);
                        throw this.buildApiError(error, endPointWithVariables, "getData");
                    });
            });
    }

    public postData<T, V>(baseEndpoint: string, endPoint: string, params: { [id: string]: any }, data: T, headers?: IHttpHeader[]): Promise<V> {
        return this.buildUrl(endPoint, params)
            .spread<V>((endPointWithVariables: string, hasQs: Boolean) => {
                this._logger.debug("POST => " + endPointWithVariables);
                if (headers && headers.length > 0) {
                    this._logger.debug("POST Headers => ", headers);
                }
                this._logger.debug("POST PAYLOAD => ", data);
                this._logger.debug(JSON.stringify(data, null, 2));
                return this._scenarioLoader.post<T, V>(endPointWithVariables, data)
                    .then((response) => {
                        this._logger.debug("POST SUCCESS <= ", response || "Empty Response");
                        return response;
                    })
                    .catch((error) => {
                        if (hasQs) {
                            this._logger.debug("POST ERROR (qs route doesn't exist - attempting fallback) <= ", error);
                            return this.postData(baseEndpoint, endPoint.split(/[?#]/)[0], this.omitQsKeys(params), data);
                        }
                        this._logger.debug("POST ERROR <= ", error);
                        throw this.buildApiError(error, endPointWithVariables, "postData");
                    });
            });
    }

    public putData<T, V>(baseEndPoint: string, endPoint: string, params: { [id: string]: any }, data: T, headers?: IHttpHeader[]): Promise<V> {
        return this.buildUrl(endPoint, params)
            .spread<V>((endPointWithVariables: string, hasQs: Boolean) => {
                this._logger.debug("PUT => " + endPointWithVariables);
                if (headers && headers.length > 0) {
                    this._logger.debug("PUT Headers => ", headers);
                }
                this._logger.debug("PUT PAYLOAD => ", data);
                return this._scenarioLoader.put<T, V>(endPointWithVariables, data)
                    .then((response) => {
                        this._logger.debug("PUT SUCCESS <= ", response || "Empty Response");
                        return response;
                    })
                    .catch((error) => {
                        if (hasQs) {
                            this._logger.debug("PUT ERROR (qs route doesn't exist - attempting fallback) <= ", error);
                            return this.putData(baseEndPoint, endPoint.split(/[?#]/)[0], this.omitQsKeys(params), data);
                        }
                        this._logger.debug("PUT ERROR <= ", error);
                        throw this.buildApiError(error, endPointWithVariables, "putData");
                    });
            });
    }

    private buildApiError(error: {status: string, statusText: string}, endPointWithVariables: string, method: string): ApiException {
        if (!error) {
            error = {status: undefined, statusText: "Empty error object found"};
        }
        return new ApiException(this, method, "HTTP Response JSON parse error, Error: {0}, HTTP status: {1}, URL: {2}",
                            [error.statusText, error.status, endPointWithVariables], null, error.status);
    }

    private buildUrl(endPoint: string, params: {[index: string]: string}): Promise<(string|boolean)[]> {
        let endPointWithVariables: string;
        try {
            endPointWithVariables = UrlParamService.getParamEndpoint(endPoint, params);
        } catch (e) {
            return Promise.reject(e);
        }

        let hasQs = /\\?(.*)=/.test(endPointWithVariables);
        if (hasQs) {
            let parts = endPointWithVariables.split(/[?#]/);
            endPointWithVariables = parts[0] + encodeURIComponent("?" + parts[1]);
        }
        return Promise.resolve([endPointWithVariables, hasQs]);
    }

    private omitQsKeys(params: {[index: string]: string }): {[index: string]: string } {
        let omittedQsKeys: {[index: string]: string} = {};
        Object.keys(params).forEach((key) => {
            let isQsKey = key.indexOf("?") === 0;
            if (!isQsKey) {
                omittedQsKeys[key] = params[key];
            }
        });
        return omittedQsKeys;
    }
}
