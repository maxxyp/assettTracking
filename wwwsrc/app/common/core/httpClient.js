/// <reference path="../../../typings/app.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "aurelia-fetch-client", "./urlParamService", "aurelia-dependency-injection", "../resilience/apiException"], function (require, exports, aurelia_framework_1, AurHttp, urlParamService_1, aurelia_dependency_injection_1, apiException_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CACHE_PARAM = "?_t";
    var DEFAULT_REQUEST_INIT = { credentials: "include" };
    var HttpClient = /** @class */ (function () {
        function HttpClient(httpClient) {
            this._httpClient = httpClient;
            this._defaultQueryParams = {};
        }
        HttpClient.prototype.setup = function (options, interceptor) {
            if (!!options && !!options.defaultQueryParams) {
                this._defaultQueryParams = this.prefixQueryParams(options.defaultQueryParams);
            }
            if (!!interceptor) {
                this._httpClient.interceptors.push(interceptor);
            }
        };
        HttpClient.prototype.fetch = function (url, request) {
            var req = new Request(url, request || DEFAULT_REQUEST_INIT);
            return this._httpClient.fetch(req);
        };
        HttpClient.prototype.getData = function (baseEndPoint, endPoint, params, breakCache, headers) {
            if (!!breakCache) {
                params = params || {};
                params[CACHE_PARAM] = new Date().getTime();
            }
            return this.buildRequest("GET", baseEndPoint, endPoint, params, undefined, headers);
        };
        HttpClient.prototype.postData = function (baseEndPoint, endPoint, params, data, headers) {
            return this.buildRequest("POST", baseEndPoint, endPoint, params, data, headers);
        };
        HttpClient.prototype.putData = function (baseEndPoint, endPoint, params, data, headers) {
            return this.buildRequest("PUT", baseEndPoint, endPoint, params, data, headers);
        };
        HttpClient.prototype.buildRequest = function (verb, baseEndPoint, endPoint, params, data, headers) {
            var _this = this;
            params = Object.assign(params || {}, this._defaultQueryParams);
            var endPointWithVariables;
            try {
                endPointWithVariables = urlParamService_1.UrlParamService.getParamEndpoint(endPoint, params);
            }
            catch (e) {
                return Promise.reject(e);
            }
            var requestHeaders = {
                "Content-Type": "application/json"
            };
            if (headers) {
                headers.forEach(function (header) {
                    requestHeaders[header.name] = header.value;
                });
            }
            var url = baseEndPoint + endPointWithVariables;
            return this.fetch(url, {
                method: verb,
                headers: requestHeaders,
                body: verb === "GET" ? undefined : JSON.stringify(data)
            })
                .then(function (response) {
                if (!response) {
                    throw new apiException_1.ApiException(_this, "processResponse", "Error - no response received: {0}, URL: {1}", ["unknown", url], null, null);
                }
                if (!(response.ok)) {
                    throw new apiException_1.ApiException(_this, "processResponse", "Error - HTTP status: {0}, URL: {1}", [response.status, url], null, response.status);
                }
                try {
                    return response.json();
                }
                catch (err) {
                    throw new apiException_1.ApiException(_this, "processResponse", "Error - json.parse(): {0}, URL: {1}", [err.toString(), url], null, response.status);
                }
            });
        };
        HttpClient.prototype.prefixQueryParams = function (queryParams) {
            var newQueryParams = {};
            return Object.keys(queryParams).reduce(function (prev, key) {
                prev["?" + key] = queryParams[key];
                return prev;
            }, newQueryParams);
        };
        HttpClient = __decorate([
            aurelia_framework_1.transient(),
            aurelia_dependency_injection_1.inject(AurHttp.HttpClient),
            __metadata("design:paramtypes", [AurHttp.HttpClient])
        ], HttpClient);
        return HttpClient;
    }());
    exports.HttpClient = HttpClient;
});

//# sourceMappingURL=httpClient.js.map
