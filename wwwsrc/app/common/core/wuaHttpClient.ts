
import {transient, inject} from "aurelia-framework";
import { IHttpClient } from "./IHttpClient";
import { UrlParamService } from "./urlParamService";
import { IHttpHeader } from "./IHttpHeader";
import { ApiException } from "../resilience/apiException";
import { HttpHelper } from "./httpHelper";
import { IHttpHelper } from "./IHttpHelper";

const CONTENT_TYPE: string = "application/json";

// this client has implicit NTLM authentication providing the 'Enterprise Authentication' capability is enabled in the app's manifest file.

@transient()
@inject(HttpHelper)
export class WuaHttpClient implements IHttpClient {

    private _defaultQueryParams: {[index: string]: string};
    private _httpHelper: IHttpHelper;

    constructor(httpHelper: IHttpHelper) {
        this._defaultQueryParams = {};
        this._httpHelper = httpHelper;
    }

    public setup(options: { defaultQueryParams?: {[index: string]: string} }) : void {
        if (!!options && !!options.defaultQueryParams) {
            this._defaultQueryParams = this.prefixQueryParams(options.defaultQueryParams);
        }
    }

    public fetch(url: string, request?: RequestInit): Promise<Response> {
        throw new Error("Fetch not implemented");
    }

    public getData<T>(baseEndPoint: string, endPoint: string, params: { [id: string]: any }, breakCache?: boolean, headers?: IHttpHeader[]): Promise<T> {
        return this.buildRequest<T, T>(Windows.Web.Http.HttpMethod.get, baseEndPoint, endPoint, params, undefined, headers, breakCache);
    }

    public putData<T, V>(baseEndPoint: string, endPoint: string, params: { [id: string]: any }, data: T, headers?: IHttpHeader[]): Promise<V> {
        return this.buildRequest<T, V>(Windows.Web.Http.HttpMethod.put, baseEndPoint, endPoint, params, data, headers);
    }

    public postData<T, V>(baseEndPoint: string, endPoint: string, params: { [id: string]: any }, data: T, headers?: IHttpHeader[]): Promise<V> {
        return this.buildRequest<T, V>(Windows.Web.Http.HttpMethod.post, baseEndPoint, endPoint, params, data, headers);
    }

    private buildRequest<T, V>(method: Windows.Web.Http.HttpMethod, baseEndPoint: string, endPoint: string,
        params: { [id: string]: any }, data: T, headers?: IHttpHeader[], breakCache?: boolean): Promise<V> {

        params = Object.assign(params || {}, this._defaultQueryParams);

        let endPointWithVariables: string;
        try {
            endPointWithVariables =  UrlParamService.getParamEndpoint(endPoint, params);
        } catch (e) {
            return Promise.reject(e);
        }

        let req = new Windows.Web.Http.HttpRequestMessage();
        req.method = method;
        let uri = baseEndPoint + endPointWithVariables;
        req.requestUri = new Windows.Foundation.Uri(uri);
        if (data) {
            req.content = new Windows.Web.Http.HttpStringContent(JSON.stringify(data), Windows.Storage.Streams.UnicodeEncoding.utf8, CONTENT_TYPE);
        }

        if (headers) {
            headers.forEach(header => {
                req.headers.append(header.name, header.value);
            });
        }

        let protocolFilter = new Windows.Web.Http.Filters.HttpBaseProtocolFilter();
        protocolFilter.cacheControl.readBehavior = !!breakCache
                ? Windows.Web.Http.Filters.HttpCacheReadBehavior.mostRecent
                : Windows.Web.Http.Filters.HttpCacheReadBehavior.default;
        protocolFilter.automaticDecompression = true;

        return new Promise<V>((resolve, reject) => {
            if (this._httpHelper.isSuspendingEventFired) {
                reject(new ApiException(this, "buildRequest", "This call cannot be sent as the suspend is just gone into suspending state", [], undefined, null));
            }

            const request = new Windows.Web.Http.HttpClient(protocolFilter).sendRequestAsync(req);

            request.done((resp: Windows.Web.Http.HttpResponseMessage) => {
                this.processResponse<V>(resp, uri)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            }, (error: any) => {
                reject(new ApiException(this, "buildRequest", "HTTP error thrown by wuaHttpClient HttpClient.sendRequestAsync", [], error, null));
            });
        });
    }

    private processResponse<T>(resp: Windows.Web.Http.HttpResponseMessage, uri: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            resp.content.readAsStringAsync()
                .done((returnValue: string) => {
                    if (resp.statusCode === 200 || resp.statusCode === 201) {
                        try {
                            let response = returnValue ? JSON.parse(returnValue) : "";
                            resolve(response);
                        } catch (jsonParseError) {
                            reject(new ApiException(this, "processResponse", "HTTP Response JSON parse error, HTTP status: {0}, Error: {1}, URL: {2}",
                                                        [resp.statusCode, jsonParseError, uri], returnValue, null));
                        }
                    } else {
                        reject(new ApiException(this, "processResponse", "Error - HTTP status: {0}, URL: {1}", [resp.statusCode, uri], returnValue, resp.statusCode));
                    }
                }, (readAsStringAsyncError: any) => {
                    reject(new ApiException(this, "processResponse", "HTTP Response read string error, HTTP status: {0}, Error: {1}, URL: {2}",
                                                        [resp.statusCode, readAsStringAsyncError, uri], null, null));
                });
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
