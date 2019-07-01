/// <reference path="../../../typings/app.d.ts" />

import {transient, inject} from "aurelia-framework";
import {Interceptor, HttpClient} from "aurelia-http-client";
import {HttpResponseMessage} from "aurelia-http-client";
import {IHttpClient} from "./IHttpClient";
import {UrlParamService} from "./urlParamService";
import {IHttpHeader} from "./IHttpHeader";
import { ApiException } from "../resilience/apiException";

type HttpVerb = "get" | "post" | "put";
type HttpClientLookup = {[index: string]: (url: string, content?: any) => Promise<HttpResponseMessage> };

@transient()
@inject(HttpClient)
export class BasicHttpClient implements IHttpClient {

    private _httpClient: HttpClient;

    constructor(httpClient: HttpClient) {
        this._httpClient = httpClient;
    }

    public setup(options: { username: string, password: string, noCredentialsHeader: boolean, defaultQueryParams?: {[index: string]: string} }, interceptor?: Interceptor): void {
        this._httpClient.configure((config) => {
             if (!!options) {
                if (!!options.username && !!options.password) {
                    if (!!options.noCredentialsHeader) {
                        config.withHeader("Authorization", "Basic " + btoa(options.username + ":" + options.password));
                    } else {
                        config.withCredentials(true);
                        config.withLogin(options.username, options.password);
                    }
                }

                if (!!options.defaultQueryParams) {
                    config.withParams(options.defaultQueryParams);
                }
             }
             if (!!interceptor) {
                 config.withInterceptor(interceptor);
             }
        });
    }

    public fetch(url: string, request?: RequestInit): Promise<Response> {
        throw("not implemented");
    }

    public getData<T>(baseEndPoint: string, endPoint: string, params: { [id: string]: any }, breakCache?: boolean, headers?: IHttpHeader[]): Promise<T> {
        return this.buildRequest<T, T>("get", baseEndPoint, endPoint, params, undefined, headers);
    }

    public postData<T, V>(baseEndPoint: string, endPoint: string, params: { [id: string]: any }, data: T, headers?: IHttpHeader[]): Promise<V> {
        return this.buildRequest<T, V>("post", baseEndPoint, endPoint, params, data, headers);
    }

    public putData<T, V>(baseEndPoint: string, endPoint: string, params: { [id: string]: any }, data: T, headers?: IHttpHeader[]): Promise<V> {
        return this.buildRequest<T, V>("put", baseEndPoint, endPoint, params, data, headers);
    }

    private buildRequest<T, V>(verb: HttpVerb, baseEndPoint: string, endPoint: string, params: { [id: string]: any }, data?: T, headers?: IHttpHeader[]): Promise<V> {
        let endPointWithVariables: string;
        try {
            endPointWithVariables = UrlParamService.getParamEndpoint(endPoint, params);
        } catch (e) {
            return Promise.reject(e);
        }

        this._httpClient.configure(config => {
            config
                .withBaseUrl(baseEndPoint)
                .withHeader("Content-Type", "application/json");
        });

        let httpMethodLookup: HttpClientLookup = {
            "get": this._httpClient.get,
            "put": this._httpClient.put,
            "post": this._httpClient.post
        };

        if (headers) {
            this._httpClient.configure(config => {
                headers.forEach(header => {
                    config.withHeader(header.name, header.value);
                });
            }) ;
        }

        if (data && Object.keys(data).length === 0 && data.constructor === Object) {
            data = null;
        }

        return httpMethodLookup[verb].call(this._httpClient, endPointWithVariables, !!data ? JSON.stringify(data) : null)
            .then((response: HttpResponseMessage) => {
                if (response && response.response) {
                    return JSON.parse(response.response);
                } else {
                    return null;
                }
            })
            .catch((error: HttpResponseMessage) => {
                throw new ApiException(this, 
                        "buildRequest", 
                        "Status: {0}, Error response: {1}, URL: {2}", 
                        [error.statusCode, error.response.toString(), error.requestMessage.url], null, error.statusCode);
            });
    }
}
