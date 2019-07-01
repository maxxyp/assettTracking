var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "aurelia-logging", "./scenarioLoader", "../core/urlParamService", "../resilience/apiException"], function (require, exports, aurelia_framework_1, Logging, scenarioLoader_1, urlParamService_1, apiException_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SimulationClient = /** @class */ (function () {
        function SimulationClient(scenarioLoader) {
            this._scenarioLoader = scenarioLoader;
            this._logger = Logging.getLogger("SimulationClient");
        }
        SimulationClient.prototype.setup = function (options, interceptor) {
        };
        SimulationClient.prototype.fetch = function (url, request, interceptor) {
            throw ("not implemented");
        };
        SimulationClient.prototype.getData = function (baseEndpoint, endPoint, params, breakCache, headers) {
            var _this = this;
            return this.buildUrl(endPoint, params)
                .spread(function (endPointWithVariables, hasQs) {
                _this._logger.debug("GET => " + endPointWithVariables);
                if (headers && headers.length > 0) {
                    _this._logger.debug("GET Headers => ", headers);
                }
                return _this._scenarioLoader.get(endPointWithVariables)
                    .then(function (response) {
                    _this._logger.debug("GET SUCCESS <= ", response);
                    return response;
                })
                    .catch(function (error) {
                    if (hasQs) {
                        _this._logger.debug("GET ERROR (qs route doesn't exist - attempting fallback) <= ", error);
                        return _this.getData(baseEndpoint, endPoint.split(/[?#]/)[0], _this.omitQsKeys(params), breakCache);
                    }
                    _this._logger.debug("GET ERROR <= ", error);
                    throw _this.buildApiError(error, endPointWithVariables, "getData");
                });
            });
        };
        SimulationClient.prototype.postData = function (baseEndpoint, endPoint, params, data, headers) {
            var _this = this;
            return this.buildUrl(endPoint, params)
                .spread(function (endPointWithVariables, hasQs) {
                _this._logger.debug("POST => " + endPointWithVariables);
                if (headers && headers.length > 0) {
                    _this._logger.debug("POST Headers => ", headers);
                }
                _this._logger.debug("POST PAYLOAD => ", data);
                _this._logger.debug(JSON.stringify(data, null, 2));
                return _this._scenarioLoader.post(endPointWithVariables, data)
                    .then(function (response) {
                    _this._logger.debug("POST SUCCESS <= ", response || "Empty Response");
                    return response;
                })
                    .catch(function (error) {
                    if (hasQs) {
                        _this._logger.debug("POST ERROR (qs route doesn't exist - attempting fallback) <= ", error);
                        return _this.postData(baseEndpoint, endPoint.split(/[?#]/)[0], _this.omitQsKeys(params), data);
                    }
                    _this._logger.debug("POST ERROR <= ", error);
                    throw _this.buildApiError(error, endPointWithVariables, "postData");
                });
            });
        };
        SimulationClient.prototype.putData = function (baseEndPoint, endPoint, params, data, headers) {
            var _this = this;
            return this.buildUrl(endPoint, params)
                .spread(function (endPointWithVariables, hasQs) {
                _this._logger.debug("PUT => " + endPointWithVariables);
                if (headers && headers.length > 0) {
                    _this._logger.debug("PUT Headers => ", headers);
                }
                _this._logger.debug("PUT PAYLOAD => ", data);
                return _this._scenarioLoader.put(endPointWithVariables, data)
                    .then(function (response) {
                    _this._logger.debug("PUT SUCCESS <= ", response || "Empty Response");
                    return response;
                })
                    .catch(function (error) {
                    if (hasQs) {
                        _this._logger.debug("PUT ERROR (qs route doesn't exist - attempting fallback) <= ", error);
                        return _this.putData(baseEndPoint, endPoint.split(/[?#]/)[0], _this.omitQsKeys(params), data);
                    }
                    _this._logger.debug("PUT ERROR <= ", error);
                    throw _this.buildApiError(error, endPointWithVariables, "putData");
                });
            });
        };
        SimulationClient.prototype.buildApiError = function (error, endPointWithVariables, method) {
            if (!error) {
                error = { status: undefined, statusText: "Empty error object found" };
            }
            return new apiException_1.ApiException(this, method, "HTTP Response JSON parse error, Error: {0}, HTTP status: {1}, URL: {2}", [error.statusText, error.status, endPointWithVariables], null, error.status);
        };
        SimulationClient.prototype.buildUrl = function (endPoint, params) {
            var endPointWithVariables;
            try {
                endPointWithVariables = urlParamService_1.UrlParamService.getParamEndpoint(endPoint, params);
            }
            catch (e) {
                return Promise.reject(e);
            }
            var hasQs = /\\?(.*)=/.test(endPointWithVariables);
            if (hasQs) {
                var parts = endPointWithVariables.split(/[?#]/);
                endPointWithVariables = parts[0] + encodeURIComponent("?" + parts[1]);
            }
            return Promise.resolve([endPointWithVariables, hasQs]);
        };
        SimulationClient.prototype.omitQsKeys = function (params) {
            var omittedQsKeys = {};
            Object.keys(params).forEach(function (key) {
                var isQsKey = key.indexOf("?") === 0;
                if (!isQsKey) {
                    omittedQsKeys[key] = params[key];
                }
            });
            return omittedQsKeys;
        };
        SimulationClient = __decorate([
            aurelia_framework_1.inject(scenarioLoader_1.ScenarioLoader),
            __metadata("design:paramtypes", [Object])
        ], SimulationClient);
        return SimulationClient;
    }());
    exports.SimulationClient = SimulationClient;
});

//# sourceMappingURL=simulationClient.js.map
