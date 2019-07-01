var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "aurelia-logging", "../models/retryPayload", "../../core/guid", "moment", "../constants/resilientServiceConstants", "../../core/objectHelper", "../models/successLoggingMode", "../apiException", "../../analytics/analyticsConstants"], function (require, exports, Logging, retryPayload_1, guid_1, moment, resilientServiceConstants_1, objectHelper_1, successLoggingMode_1, apiException_1, analyticsConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ResilientService = /** @class */ (function () {
        function ResilientService(configurationService, configurationName, storageService, eventAggregator, httpHeaderProvider, resilientHttpClientFactory, wuaNetworkDiagnostics) {
            this._configurationName = configurationName;
            this._storageService = storageService;
            this._eventAggregator = eventAggregator;
            this._httpHeaderProvider = httpHeaderProvider;
            this._logger = Logging.getLogger("ResilientService");
            this._resilientHttpClientFactory = resilientHttpClientFactory;
            this._wuaNetworkDiagnostics = wuaNetworkDiagnostics;
            this._configurationService = configurationService;
            this._endpointConfiguration = this._configurationService.getConfiguration(configurationName);
            if (!this._endpointConfiguration) {
                throw new Error("Missing endpoint configuration " + configurationName);
            }
        }
        ResilientService.prototype.getUnsentPayloads = function () {
            return Promise.resolve(this.getPayloadsReference());
        };
        ResilientService.prototype.clearUnsentPayloads = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this._payloads = [];
                    this.commitRetryPayloads();
                    return [2 /*return*/];
                });
            });
        };
        ResilientService.prototype.sendAllRetryPayloads = function () {
            return this.flushRetryQueue();
        };
        ResilientService.prototype.isRetryInProgress = function () {
            return this._isRetryInProgress;
        };
        ResilientService.prototype.isInternetConnected = function () {
            return !!this._wuaNetworkDiagnostics && this._wuaNetworkDiagnostics.isInternetConnected();
        };
        ResilientService.prototype.getConfigurationName = function () {
            return this._configurationName;
        };
        ResilientService.prototype.getData = function (routeName, params, breakCache) {
            return this.makeImmediateCall("GET", routeName, params, null, breakCache);
        };
        ResilientService.prototype.postData = function (routeName, params, data) {
            return this.makeImmediateCall("POST", routeName, params, data);
        };
        ResilientService.prototype.putData = function (routeName, params, data) {
            return this.makeImmediateCall("PUT", routeName, params, data);
        };
        ResilientService.prototype.postDataResilient = function (routeName, params, data) {
            return this.makeQueuedCall("POST", routeName, params, data);
        };
        ResilientService.prototype.putDataResilient = function (routeName, params, data) {
            return this.makeQueuedCall("PUT", routeName, params, data);
        };
        ResilientService.prototype.makeImmediateCall = function (httpMethod, routeName, params, data, breakCache) {
            var _this = this;
            objectHelper_1.ObjectHelper.sanitizeObjectStringsForHttp(data);
            var p = this._httpHeaderProvider
                ? this._httpHeaderProvider.getHeaders(routeName)
                : Promise.resolve([]);
            return p
                .then(function (headers) { return _this.sendPayload(httpMethod, routeName, headers, params, null, data, breakCache); })
                .then(function (result) {
                _this.flushRetryQueue(); // do not wait on this promise
                return result;
            })
                .catch(function (error) {
                _this._logger.warn("Error", { routeName: routeName, input: { method: "GET", params: params, breakCache: breakCache }, error: error });
                throw error;
            });
        };
        ResilientService.prototype.makeQueuedCall = function (httpMethod, routeName, params, data, breakCache) {
            var _this = this;
            objectHelper_1.ObjectHelper.sanitizeObjectStringsForHttp(data);
            var p = this._httpHeaderProvider
                ? this._httpHeaderProvider.getHeaders(routeName)
                : Promise.resolve([]);
            return p
                .then(function (headers) {
                var retryPayload = _this.buildRetryPayload(httpMethod, routeName, headers, params, data);
                _this.addNewRetryPayload(retryPayload);
            })
                .then(function () {
                /* do not wait on this promise as we do not want to make any subsequent business
                    logic to wait for the flushing to complete - it may take a loooong time */
                _this.flushRetryQueue();
            });
        };
        ResilientService.prototype.sendPayload = function (httpMethod, routeName, headers, params, retryGuid, data, breakCache) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var guid, routeConfig, clientConfig, root, path, successLoggingMode, inputLoggingParams, startTime, config, resilienceSendAnalyticsOnSuccess, resolveHttpMethodAndSend, result, elapsedTimeMs, logObject, exception_1, elapsedTimeMs, httpStatusCode, errorMessage, apiException, networkDiagnostics, logObject;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            guid = guid_1.Guid.newGuid();
                            routeConfig = this._endpointConfiguration.routes.find(function (route) { return route.route === routeName; });
                            clientConfig = this._endpointConfiguration.clients.find(function (client) { return client.name === routeConfig.client; });
                            root = clientConfig.root;
                            path = routeConfig.path;
                            successLoggingMode = routeConfig.successLoggingMode || successLoggingMode_1.SuccessLoggingMode.log;
                            inputLoggingParams = { method: httpMethod, root: root, path: path, params: params, breakCache: breakCache, headers: headers, data: data };
                            config = this._configurationService.getConfiguration();
                            resilienceSendAnalyticsOnSuccess = config.resilienceSendAnalyticsOnSuccess;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            resolveHttpMethodAndSend = function () {
                                var httpClient = _this._resilientHttpClientFactory.getHttpClient(clientConfig);
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
                            if (successLoggingMode !== successLoggingMode_1.SuccessLoggingMode.dontLog) {
                                this._logger.warn("Attempt", { guid: guid, retryGuid: retryGuid });
                            }
                            startTime = Date.now();
                            return [4 /*yield*/, resolveHttpMethodAndSend()];
                        case 2:
                            result = _a.sent();
                            if (result && result.status && result.error) {
                                throw new apiException_1.ApiException(this, "sendPayload", "Middleware 200 error - status: {0}, error - {1}", [result.status, result.error], result, result.status);
                            }
                            elapsedTimeMs = Date.now() - startTime;
                            if (resilienceSendAnalyticsOnSuccess && this._endpointConfiguration.sendAnalyticsOnSuccess) {
                                this.sendAnalytics(routeName, ResilientService.HTTP_OK_FLAG, elapsedTimeMs);
                            }
                            logObject = {
                                guid: guid,
                                routeName: routeName,
                                input: inputLoggingParams,
                                result: result,
                                retryGuid: retryGuid,
                                elapsedTimeMs: elapsedTimeMs
                            };
                            switch (successLoggingMode) {
                                case successLoggingMode_1.SuccessLoggingMode.log:
                                    this._logger.warn("Success", logObject);
                                    break;
                                case successLoggingMode_1.SuccessLoggingMode.logWithoutResponse:
                                    logObject.result = "not logged";
                                    this._logger.warn("Success", logObject);
                                    break;
                                default:
                                    break;
                            }
                            return [2 /*return*/, result];
                        case 3:
                            exception_1 = _a.sent();
                            elapsedTimeMs = Date.now() - startTime;
                            exception_1 = exception_1 || ResilientService.UNKNOWN_FLAG;
                            httpStatusCode = void 0;
                            errorMessage = exception_1.toString();
                            if (exception_1 instanceof apiException_1.ApiException) {
                                apiException = exception_1;
                                httpStatusCode = apiException.httpStatusCode;
                                errorMessage = apiException.reference + ": " + apiException.resolvedMessage;
                            }
                            networkDiagnostics = (!httpStatusCode && this._wuaNetworkDiagnostics)
                                ? this._wuaNetworkDiagnostics.getDiagnostics()
                                : undefined;
                            if (networkDiagnostics) {
                                httpStatusCode = ResilientService.HTTP_FAILED_FLAG + "-" + networkDiagnostics.connection;
                            }
                            httpStatusCode = httpStatusCode || ResilientService.UNKNOWN_FLAG;
                            if (this._configurationName === "whoAmIServiceEndpoint") {
                                this.sendAnalytics(routeName, httpStatusCode, elapsedTimeMs);
                            }
                            logObject = {
                                guid: guid,
                                routeName: routeName,
                                input: inputLoggingParams,
                                result: errorMessage,
                                retryGuid: retryGuid,
                                elapsedTimeMs: elapsedTimeMs,
                                httpStatusCode: httpStatusCode,
                                networkDiagnostics: networkDiagnostics
                            };
                            this._logger.error("Error", logObject);
                            throw exception_1;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ResilientService.prototype.sendAnalytics = function (routeName, httpStatusCode, elapsedTimeMs) {
            this._eventAggregator.publish(analyticsConstants_1.AnalyticsConstants.ANALYTICS_EVENT, {
                category: analyticsConstants_1.AnalyticsConstants.HTTP_RESULT,
                action: routeName,
                label: httpStatusCode,
                metric: elapsedTimeMs
            });
        };
        ResilientService.prototype.buildRetryPayload = function (httpMethod, routeName, headers, params, data) {
            var retryPayload = new retryPayload_1.RetryPayload();
            retryPayload.correlationId = guid_1.Guid.newGuid();
            retryPayload.createdTime = new Date();
            retryPayload.httpMethod = httpMethod;
            retryPayload.routeName = routeName;
            retryPayload.headers = headers;
            retryPayload.params = params;
            retryPayload.data = data;
            var config = this._configurationService.getConfiguration();
            var unSentPayloadExpiryMinutes = config.unSentPayloadExpiryMinutes;
            if (!!unSentPayloadExpiryMinutes && unSentPayloadExpiryMinutes > 0) {
                retryPayload.expiryTime = moment().add(unSentPayloadExpiryMinutes, "minutes").toDate();
            }
            retryPayload.lastFailureMessage = "";
            retryPayload.failureWithoutStatusCount = 0;
            retryPayload.failureWithStatusCount = 0;
            return retryPayload;
        };
        ResilientService.prototype.flushRetryQueue = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var config, retryIntervals, resilienceFlushSkipFailures, getPayload, pollingRetryAPayload, nextIndexToPick, payload, isSuccess;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            config = this._configurationService.getConfiguration();
                            retryIntervals = config.resilienceRertyIntervals || [];
                            resilienceFlushSkipFailures = config.resilienceFlushSkipFailures;
                            // if the user is at (say) the end of day, and there is a particular call that is permanently
                            //  not working, all subsequent calls we also be blocked. isHardFlush will flush as normal but continue
                            //  on through the queue regardless if each or any call 500s etc.
                            if (this._isRetryInProgress) {
                                return [2 /*return*/];
                            }
                            this._isRetryInProgress = true;
                            getPayload = function (index) {
                                // rather than take a local snapshot of payloads, it's probably better to keep accessing
                                //  the underlying payloads via this.getUnsentPayloads() because this.retryPayload directly
                                //  updates the underlying storage to e.g. splice out successful records.  If we had a local
                                //  copy we'd have to duplicate that logic.
                                var payloads = _this.getPayloadsReference();
                                return payloads
                                    && (payloads.length >= index + 1)
                                    && { index: index, payload: payloads[index] };
                            };
                            pollingRetryAPayload = function (retryPayload) { return __awaiter(_this, void 0, void 0, function () {
                                var retryDurations, isSuccess, delay;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            retryDurations = retryIntervals.slice().reverse();
                                            _a.label = 1;
                                        case 1:
                                            if (!true) return [3 /*break*/, 4];
                                            return [4 /*yield*/, this.retryPayload(retryPayload)];
                                        case 2:
                                            isSuccess = _a.sent();
                                            if (isSuccess) {
                                                return [2 /*return*/, true];
                                            }
                                            delay = retryDurations.pop();
                                            if (delay === undefined) {
                                                // there are no more intervals left to wait so break out
                                                return [3 /*break*/, 4];
                                            }
                                            return [4 /*yield*/, Promise.delay(delay)];
                                        case 3:
                                            _a.sent();
                                            return [3 /*break*/, 1];
                                        case 4: return [2 /*return*/, false];
                                    }
                                });
                            }); };
                            nextIndexToPick = 0;
                            _a.label = 1;
                        case 1:
                            if (!true) return [3 /*break*/, 3];
                            payload = getPayload(nextIndexToPick);
                            if (!payload) {
                                return [3 /*break*/, 3];
                            }
                            return [4 /*yield*/, pollingRetryAPayload(payload.payload)];
                        case 2:
                            isSuccess = _a.sent();
                            if (isSuccess) {
                                // all good, so just loop and take from the top of the queue again
                            }
                            else {
                                if (resilienceFlushSkipFailures) {
                                    // failed, but we are not going to let the top retry payload block the rest
                                    nextIndexToPick += 1;
                                }
                                else {
                                    // failed and we need to block to ensure payloads always go out in order
                                    return [3 /*break*/, 3];
                                }
                            }
                            return [3 /*break*/, 1];
                        case 3:
                            this._isRetryInProgress = false;
                            // one more call to allow subscribers to detect the end of the global retry
                            this._eventAggregator.publish(resilientServiceConstants_1.ResilientServiceConstants.UNSENT_PAYLOADS_UPDATES, this._configurationName);
                            return [2 /*return*/];
                    }
                });
            });
        };
        ResilientService.prototype.retryPayload = function (retryPayload) {
            return __awaiter(this, void 0, void 0, function () {
                var err_1, statusCode;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            retryPayload.isRetrying = true;
                            retryPayload.lastFailureMessage = "";
                            this.saveChangedRetryPayload(retryPayload);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.sendPayload(retryPayload.httpMethod, retryPayload.routeName, retryPayload.headers, retryPayload.params, retryPayload.correlationId, retryPayload.data)];
                        case 2:
                            _a.sent();
                            this.removeSuccessfulRetryPayload(retryPayload);
                            return [2 /*return*/, true];
                        case 3:
                            err_1 = _a.sent();
                            retryPayload.isRetrying = false;
                            retryPayload.lastFailureMessage = err_1 && err_1.toString();
                            retryPayload.lastRetryTime = new Date();
                            statusCode = err_1 && err_1.httpStatusCode;
                            if (statusCode) {
                                retryPayload.lastKnownFailureStatus = statusCode;
                                retryPayload.failureWithStatusCount += 1;
                            }
                            else {
                                retryPayload.failureWithoutStatusCount += 1;
                            }
                            this.saveChangedRetryPayload(retryPayload);
                            return [2 /*return*/, false];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ResilientService.prototype.addNewRetryPayload = function (retryPayload) {
            var payloads = this.getPayloadsReference();
            payloads.push(retryPayload);
            this.commitRetryPayloads();
        };
        ResilientService.prototype.removeSuccessfulRetryPayload = function (retryPayload) {
            var payloads = this.getPayloadsReference();
            var payloadIndexToRemove = payloads.findIndex(function (payload) { return payload.correlationId === retryPayload.correlationId; });
            if (payloadIndexToRemove !== -1) {
                payloads.splice(payloadIndexToRemove, 1);
                this.commitRetryPayloads();
            }
        };
        ResilientService.prototype.saveChangedRetryPayload = function (retryPayload) {
            var payloads = this.getPayloadsReference();
            var payloadIndexToSave = payloads.findIndex(function (payload) { return payload.correlationId === retryPayload.correlationId; });
            if (payloadIndexToSave !== -1) {
                payloads[payloadIndexToSave] = retryPayload;
                this.commitRetryPayloads();
            }
        };
        ResilientService.prototype.getPayloadsReference = function () {
            // if we had an initialise event/method, then we'd be able to simplyfy all of this
            if (!this._payloads) {
                this._payloads = [];
                var resiliencePayloads = this._storageService.getResilienceRetryPayloads(this._configurationName.toUpperCase()) || [];
                if (resiliencePayloads.length) {
                    // if we have payloads in storage when we are starting the app for the first time, reset any retrying flags set as true
                    resiliencePayloads.forEach(function (payload) { return payload.isRetrying = false; });
                    this._payloads = resiliencePayloads.concat(this._payloads);
                    this.commitRetryPayloads();
                }
            }
            var timeNow = new Date().getTime();
            var haveExpiredPayloads = this._payloads.some(function (retryPayload) { return !!retryPayload.expiryTime && retryPayload.expiryTime.getTime() < timeNow; });
            if (haveExpiredPayloads) {
                this._payloads = this._payloads.filter(function (retryPayload) { return !!retryPayload.expiryTime && retryPayload.expiryTime.getTime() >= timeNow; });
                this.commitRetryPayloads();
            }
            return this._payloads;
        };
        ResilientService.prototype.commitRetryPayloads = function () {
            this._storageService.setResilienceRetryPayloads(this._configurationName.toUpperCase(), this._payloads);
            this._eventAggregator.publish(resilientServiceConstants_1.ResilientServiceConstants.UNSENT_PAYLOADS_UPDATES, this._configurationName);
        };
        ResilientService.UNKNOWN_FLAG = "Unknown";
        ResilientService.HTTP_OK_FLAG = "OK";
        ResilientService.HTTP_FAILED_FLAG = "Failed";
        return ResilientService;
    }());
    exports.ResilientService = ResilientService;
});

//# sourceMappingURL=resilientService.js.map
