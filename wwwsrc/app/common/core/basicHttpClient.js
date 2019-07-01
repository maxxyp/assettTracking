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
define(["require", "exports", "aurelia-framework", "aurelia-http-client", "./urlParamService", "../resilience/apiException"], function (require, exports, aurelia_framework_1, aurelia_http_client_1, urlParamService_1, apiException_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BasicHttpClient = /** @class */ (function () {
        function BasicHttpClient(httpClient) {
            this._httpClient = httpClient;
        }
        BasicHttpClient.prototype.setup = function (options, interceptor) {
            this._httpClient.configure(function (config) {
                if (!!options) {
                    if (!!options.username && !!options.password) {
                        if (!!options.noCredentialsHeader) {
                            config.withHeader("Authorization", "Basic " + btoa(options.username + ":" + options.password));
                        }
                        else {
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
        };
        BasicHttpClient.prototype.fetch = function (url, request) {
            throw ("not implemented");
        };
        BasicHttpClient.prototype.getData = function (baseEndPoint, endPoint, params, breakCache, headers) {
            return this.buildRequest("get", baseEndPoint, endPoint, params, undefined, headers);
        };
        BasicHttpClient.prototype.postData = function (baseEndPoint, endPoint, params, data, headers) {
            return this.buildRequest("post", baseEndPoint, endPoint, params, data, headers);
        };
        BasicHttpClient.prototype.putData = function (baseEndPoint, endPoint, params, data, headers) {
            return this.buildRequest("put", baseEndPoint, endPoint, params, data, headers);
        };
        BasicHttpClient.prototype.buildRequest = function (verb, baseEndPoint, endPoint, params, data, headers) {
            var _this = this;
            var endPointWithVariables;
            try {
                endPointWithVariables = urlParamService_1.UrlParamService.getParamEndpoint(endPoint, params);
            }
            catch (e) {
                return Promise.reject(e);
            }
            this._httpClient.configure(function (config) {
                config
                    .withBaseUrl(baseEndPoint)
                    .withHeader("Content-Type", "application/json");
            });
            var httpMethodLookup = {
                "get": this._httpClient.get,
                "put": this._httpClient.put,
                "post": this._httpClient.post
            };
            if (headers) {
                this._httpClient.configure(function (config) {
                    headers.forEach(function (header) {
                        config.withHeader(header.name, header.value);
                    });
                });
            }
            if (data && Object.keys(data).length === 0 && data.constructor === Object) {
                data = null;
            }
            return httpMethodLookup[verb].call(this._httpClient, endPointWithVariables, !!data ? JSON.stringify(data) : null)
                .then(function (response) {
                if (response && response.response) {
                    return JSON.parse(response.response);
                }
                else {
                    return null;
                }
            })
                .catch(function (error) {
                throw new apiException_1.ApiException(_this, "buildRequest", "Status: {0}, Error response: {1}, URL: {2}", [error.statusCode, error.response.toString(), error.requestMessage.url], null, error.statusCode);
            });
        };
        BasicHttpClient = __decorate([
            aurelia_framework_1.transient(),
            aurelia_framework_1.inject(aurelia_http_client_1.HttpClient),
            __metadata("design:paramtypes", [aurelia_http_client_1.HttpClient])
        ], BasicHttpClient);
        return BasicHttpClient;
    }());
    exports.BasicHttpClient = BasicHttpClient;
});

//# sourceMappingURL=basicHttpClient.js.map
