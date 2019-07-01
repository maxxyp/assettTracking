/// <reference path="../../../typings/app.d.ts" />

import {transient} from "aurelia-framework";
import {IHttpClient} from "./IHttpClient";
import * as AurHttp from "aurelia-fetch-client";
import {UrlParamService} from "./urlParamService";
import {inject} from "aurelia-dependency-injection";
import {IHttpHeader} from "./IHttpHeader";
import { ApiException } from "../resilience/apiException";

type HttpVerb = "GET" | "POST" | "PUT";
const CACHE_PARAM = "?_t";
const DEFAULT_REQUEST_INIT: RequestInit = { credentials: <any>"include" };

@transient()
@inject(AurHttp.HttpClient)
export class HttpClient implements IHttpClient {

    private _httpClient: AurHttp.HttpClient;
    private _defaultQueryParams: {[index: string]: string};

    constructor(httpClient: AurHttp.HttpClient) {
        this._httpClient = httpClient;
        this._defaultQueryParams = {};
    }

    public setup(options: { defaultQueryParams?: {[index: string]: string} }, interceptor?: AurHttp.Interceptor) : void {
        if (!!options && !!options.defaultQueryParams) {
            this._defaultQueryParams = this.prefixQueryParams(options.defaultQueryParams);
        }
        if (!!interceptor) {
            this._httpClient.interceptors.push(interceptor);
        }
    }

    public fetch(url: string, request?: RequestInit): Promise<Response> {
        let req: Request = new Request(url, request || DEFAULT_REQUEST_INIT);
        return this._httpClient.fetch(req);
    }

    public getData<T>(baseEndPoint: string, endPoint: string, params: { [id: string]: any }, breakCache?: boolean, headers?: IHttpHeader[]): Promise<T> {
        if (!!breakCache) {
            params = params || {};
            params[CACHE_PARAM] = new Date().getTime();
        }
        return this.buildRequest<T, T>("GET", baseEndPoint, endPoint, params, undefined, headers);
    }

    public postData<T, V>(baseEndPoint: string, endPoint: string, params: { [id: string]: any }, data: T, headers?: IHttpHeader[]): Promise<V> {
         return this.buildRequest<T, V>("POST", baseEndPoint, endPoint, params, data, headers);
    }

    public putData<T, V>(baseEndPoint: string, endPoint: string, params: { [id: string]: any }, data: T, headers?: IHttpHeader[]): Promise<V> {
        return this.buildRequest<T, V>("PUT", baseEndPoint, endPoint, params, data, headers);
    }

    private buildRequest<T, V>(verb: HttpVerb, baseEndPoint: string, endPoint: string, params: { [id: string]: any }, data?: T, headers?: IHttpHeader[]): Promise<V> {
        params = Object.assign(params || {}, this._defaultQueryParams);
        let endPointWithVariables: string;
        try {
            endPointWithVariables =  UrlParamService.getParamEndpoint(endPoint, params);
        } catch (e) {
            return Promise.reject(e);
        }

        let requestHeaders: any = {
            "Content-Type": "application/json"
        };

        if (headers) {
            headers.forEach(header => {
               requestHeaders[header.name] = header.value;
            });
        }

        let url =  baseEndPoint + endPointWithVariables;
        return this.fetch(url, {
            method: verb,
            headers: requestHeaders,
            body: verb === "GET" ? undefined : JSON.stringify(data)
        })
        .then((response: Response) => {
            if (!response) {
                throw new ApiException(this, "processResponse", "Error - no response received: {0}, URL: {1}", ["unknown", url], null, null);
            }
            if (!(response.ok)) {
                throw new ApiException(this, "processResponse", "Error - HTTP status: {0}, URL: {1}", [response.status, url], null, response.status);
            }
            try {
                return response.json();
            } catch (err) {
                throw new ApiException(this, "processResponse", "Error - json.parse(): {0}, URL: {1}", [err.toString(), url], null, response.status);
            }

        });
    }

    private prefixQueryParams(queryParams: {[index: string]: string}): {[index: string]: string} {
        let newQueryParams: {[index: string]: string} = {};
        return Object.keys(queryParams).reduce((prev: {[index: string]: string}, key: string) => {
            prev["?" + key] = queryParams[key];
            return prev;
        }, newQueryParams);
    }
}
