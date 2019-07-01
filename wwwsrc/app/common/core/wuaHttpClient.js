var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "./urlParamService", "../resilience/apiException", "./httpHelper"], function (require, exports, aurelia_framework_1, urlParamService_1, apiException_1, httpHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CONTENT_TYPE = "application/json";
    // this client has implicit NTLM authentication providing the 'Enterprise Authentication' capability is enabled in the app's manifest file.
    var WuaHttpClient = /** @class */ (function () {
        function WuaHttpClient(httpHelper) {
            this._defaultQueryParams = {};
            this._httpHelper = httpHelper;
        }
        WuaHttpClient.prototype.setup = function (options) {
            if (!!options && !!options.defaultQueryParams) {
                this._defaultQueryParams = this.prefixQueryParams(options.defaultQueryParams);
            }
        };
        WuaHttpClient.prototype.fetch = function (url, request) {
            throw new Error("Fetch not implemented");
        };
        WuaHttpClient.prototype.getData = function (baseEndPoint, endPoint, params, breakCache, headers) {
            return this.buildRequest(Windows.Web.Http.HttpMethod.get, baseEndPoint, endPoint, params, undefined, headers, breakCache);
        };
        WuaHttpClient.prototype.putData = function (baseEndPoint, endPoint, params, data, headers) {
            return this.buildRequest(Windows.Web.Http.HttpMethod.put, baseEndPoint, endPoint, params, data, headers);
        };
        WuaHttpClient.prototype.postData = function (baseEndPoint, endPoint, params, data, headers) {
            return this.buildRequest(Windows.Web.Http.HttpMethod.post, baseEndPoint, endPoint, params, data, headers);
        };
        WuaHttpClient.prototype.buildRequest = function (method, baseEndPoint, endPoint, params, data, headers, breakCache) {
            var _this = this;
            params = Object.assign(params || {}, this._defaultQueryParams);
            var endPointWithVariables;
            try {
                endPointWithVariables = urlParamService_1.UrlParamService.getParamEndpoint(endPoint, params);
            }
            catch (e) {
                return Promise.reject(e);
            }
            var req = new Windows.Web.Http.HttpRequestMessage();
            req.method = method;
            var uri = baseEndPoint + endPointWithVariables;
            req.requestUri = new Windows.Foundation.Uri(uri);
            if (data) {
                req.content = new Windows.Web.Http.HttpStringContent(JSON.stringify(data), Windows.Storage.Streams.UnicodeEncoding.utf8, CONTENT_TYPE);
            }
            if (headers) {
                headers.forEach(function (header) {
                    req.headers.append(header.name, header.value);
                });
            }
            var protocolFilter = new Windows.Web.Http.Filters.HttpBaseProtocolFilter();
            protocolFilter.cacheControl.readBehavior = !!breakCache
                ? Windows.Web.Http.Filters.HttpCacheReadBehavior.mostRecent
                : Windows.Web.Http.Filters.HttpCacheReadBehavior.default;
            protocolFilter.automaticDecompression = true;
            return new Promise(function (resolve, reject) {
                if (_this._httpHelper.isSuspendingEventFired) {
                    reject(new apiException_1.ApiException(_this, "buildRequest", "This call cannot be sent as the suspend is just gone into suspending state", [], undefined, null));
                }
                var request = new Windows.Web.Http.HttpClient(protocolFilter).sendRequestAsync(req);
                request.done(function (resp) {
                    _this.processResponse(resp, uri)
                        .then(function (res) { return resolve(res); })
                        .catch(function (err) { return reject(err); });
                }, function (error) {
                    reject(new apiException_1.ApiException(_this, "buildRequest", "HTTP error thrown by wuaHttpClient HttpClient.sendRequestAsync", [], error, null));
                });
            });
        };
        WuaHttpClient.prototype.processResponse = function (resp, uri) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                resp.content.readAsStringAsync()
                    .done(function (returnValue) {
                    if (resp.statusCode === 200 || resp.statusCode === 201) {
                        try {
                            var response = returnValue ? JSON.parse(returnValue) : "";
                            resolve(response);
                        }
                        catch (jsonParseError) {
                            reject(new apiException_1.ApiException(_this, "processResponse", "HTTP Response JSON parse error, HTTP status: {0}, Error: {1}, URL: {2}", [resp.statusCode, jsonParseError, uri], returnValue, null));
                        }
                    }
                    else {
                        reject(new apiException_1.ApiException(_this, "processResponse", "Error - HTTP status: {0}, URL: {1}", [resp.statusCode, uri], returnValue, resp.statusCode));
                    }
                }, function (readAsStringAsyncError) {
                    reject(new apiException_1.ApiException(_this, "processResponse", "HTTP Response read string error, HTTP status: {0}, Error: {1}, URL: {2}", [resp.statusCode, readAsStringAsyncError, uri], null, null));
                });
            });
        };
        WuaHttpClient.prototype.prefixQueryParams = function (queryParams) {
            var newQueryParams = {};
            return Object.keys(queryParams).reduce(function (prev, key) {
                prev["?" + key] = queryParams[key];
                return prev;
            }, newQueryParams);
        };
        WuaHttpClient = __decorate([
            aurelia_framework_1.transient(),
            aurelia_framework_1.inject(httpHelper_1.HttpHelper),
            __metadata("design:paramtypes", [Object])
        ], WuaHttpClient);
        return WuaHttpClient;
    }());
    exports.WuaHttpClient = WuaHttpClient;
});

//# sourceMappingURL=wuaHttpClient.js.map
