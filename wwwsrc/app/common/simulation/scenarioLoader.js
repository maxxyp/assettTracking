var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "./models/scenario", "./models/mutation", "tv4", "moment", "./schemaLoader", "./scenarioStore", "../core/threading", "aurelia-event-aggregator", "./constants/simulationConstants", "../core/services/browserLocalStorage"], function (require, exports, aurelia_framework_1, scenario_1, mutation_1, tv4, moment, schemaLoader_1, scenarioStore_1, threading_1, aurelia_event_aggregator_1, simulationConstants_1, browserLocalStorage_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SIMULATION_OVERRIDE_EVENT = simulationConstants_1.SimulationConstants.SIMULATION_OVERRIDE_EVENT, SIMULATION_OVERRIDE_STORAGE_KEY = simulationConstants_1.SimulationConstants.SIMULATION_OVERRIDE_STORAGE_KEY;
    var ScenarioLoader = /** @class */ (function () {
        function ScenarioLoader(schemaLoader, scenarioStore, eventAggregator, storage) {
            this._scenarioStore = scenarioStore;
            this._schemaLoader = schemaLoader;
            this._eventAggregator = eventAggregator;
            this._storage = storage;
            this._scenarioNames = null;
            this._scenarios = {};
            this._overides = {};
            this._httpErrorLookup = {
                400: ["400 Bad Request"],
                404: ["404 Not found"],
                408: ["408 Request Timeout"],
                500: ["500 Server Error"]
            };
        }
        ScenarioLoader.prototype.initialise = function (baseDir) {
            var _this = this;
            this._baseDir = baseDir || "scenarios";
            return this._storage.get("SIM", SIMULATION_OVERRIDE_STORAGE_KEY)
                .then(function (data) {
                _this._overides = data || {};
            })
                .then(function () {
                _this._eventAggregator.subscribe(SIMULATION_OVERRIDE_EVENT, function (overide) {
                    _this._overides = {};
                    _this._overides[overide.route] = overide.data;
                    _this._storage.set("SIM", SIMULATION_OVERRIDE_STORAGE_KEY, _this._overides);
                });
            })
                .then(function () { return _this._scenarioStore.initialise(_this._baseDir); });
        };
        ScenarioLoader.prototype.listScenarios = function () {
            var _this = this;
            if (this._scenarioNames) {
                return Promise.resolve(this._scenarioNames);
            }
            return this._scenarioStore.loadScenarios()
                .then(function (scenarioNames) {
                if (!scenarioNames) {
                    scenarioNames = [];
                }
                _this._scenarioNames = scenarioNames;
                return _this._scenarioNames;
            })
                .catch(function () {
                return _this._scenarioNames;
            });
        };
        ScenarioLoader.prototype.loadScenario = function (route) {
            return this.fetchScenario(route)
                .then(function (scenario) {
                if (!scenario) {
                    scenario = new scenario_1.Scenario();
                    scenario.status = 404;
                    scenario.statusText = ["Failed to load scenario " + route];
                }
                return scenario;
            });
        };
        ScenarioLoader.prototype.get = function (route) {
            var _this = this;
            var delay = 0.5;
            var status = 400;
            var statusText = this._httpErrorLookup[400];
            return new Promise(function (resolve, reject) {
                _this.fetchScenario(route)
                    .then(function (scenario) {
                    var doResolve = false;
                    var response = undefined;
                    if (!!scenario) {
                        delay = scenario.delay || delay;
                        status = scenario.status || status;
                        statusText = scenario.statusText || statusText;
                        var retry = _this.processRetry(scenario);
                        if (retry) {
                            statusText = _this._httpErrorLookup[408];
                        }
                        else if (status === 200) {
                            response = scenario.data;
                            /* If there are mutations then return the most recent one */
                            if (scenario.mutations && scenario.mutations.length > 0) {
                                var mutation = scenario.mutations[scenario.mutations.length - 1];
                                if (mutation && mutation.payload) {
                                    response = mutation.payload;
                                }
                            }
                            // clone the object so the original is not modified by other code
                            if (response) {
                                response = JSON.parse(JSON.stringify(response));
                            }
                            doResolve = true;
                        }
                        else {
                            statusText = _this._httpErrorLookup[status];
                            if (!statusText) {
                                statusText = _this._httpErrorLookup[400];
                            }
                        }
                    }
                    else {
                        statusText = ["Failed to load scenario " + route];
                    }
                    threading_1.Threading.delay(function () {
                        if (doResolve) {
                            resolve(response);
                        }
                        else {
                            reject({ status: status, statusText: statusText });
                        }
                    }, delay * 1000);
                });
            });
        };
        ScenarioLoader.prototype.put = function (route, data) {
            var _this = this;
            var delay = 0.5;
            var status = 400;
            var statusText = this._httpErrorLookup[status];
            return new Promise(function (resolve, reject) {
                _this.fetchScenario(route)
                    .then(function (scenario) {
                    var doResolve = false;
                    var response = undefined;
                    if (!!scenario) {
                        delay = scenario.delay || delay;
                        status = scenario.status || status;
                        statusText = scenario.statusText || statusText;
                        var retry = _this.processRetry(scenario);
                        if (retry) {
                            statusText = _this._httpErrorLookup[408];
                        }
                        else if (status === 200 && !!data) {
                            scenario.mutations = scenario.mutations || [];
                            var mutation = new mutation_1.Mutation();
                            mutation.timestamp = new Date();
                            mutation.payload = data;
                            scenario.mutations.push(mutation);
                            // clone the object so the original is not modified by other code
                            response = scenario.response;
                            if (response) {
                                response = JSON.parse(JSON.stringify(scenario.response));
                            }
                            doResolve = true;
                        }
                        else {
                            statusText = _this._httpErrorLookup[status];
                            if (!statusText) {
                                statusText = _this._httpErrorLookup[400];
                            }
                        }
                    }
                    else {
                        statusText = ["Failed to load scenario " + route];
                    }
                    threading_1.Threading.delay(function () {
                        if (doResolve) {
                            resolve(response);
                        }
                        else {
                            reject({ status: status, statusText: statusText });
                        }
                    }, delay * 1000);
                });
            });
        };
        ScenarioLoader.prototype.post = function (route, data) {
            var _this = this;
            var delay = 0.5;
            var status = 404;
            var statusText = this._httpErrorLookup[status];
            return new Promise(function (resolve, reject) {
                _this.fetchScenario(route)
                    .then(function (scenario) {
                    var doResolve = false;
                    var response = undefined;
                    if (!scenario) {
                        scenario = new scenario_1.Scenario();
                        scenario.status = 200;
                        scenario.mutations = [];
                        _this._scenarios[route] = scenario;
                    }
                    delay = scenario.delay || delay;
                    status = scenario.status || (!data ? 400 : status);
                    statusText = scenario.statusText || _this._httpErrorLookup[status];
                    var retry = _this.processRetry(scenario);
                    if (retry) {
                        statusText = _this._httpErrorLookup[408];
                    }
                    else if (status === 200) {
                        scenario.mutations = scenario.mutations || [];
                        var mutation = new mutation_1.Mutation();
                        if (!!data) {
                            mutation.timestamp = new Date();
                            mutation.payload = data;
                            scenario.mutations.push(mutation);
                        }
                        // clone the object so the original is not modified by other code
                        response = scenario.response;
                        if (response) {
                            response = JSON.parse(JSON.stringify(scenario.response));
                        }
                        doResolve = true;
                    }
                    else {
                        statusText = _this._httpErrorLookup[status];
                        if (!statusText) {
                            statusText = _this._httpErrorLookup[400];
                        }
                    }
                    threading_1.Threading.delay(function () {
                        if (doResolve) {
                            resolve(response);
                        }
                        else {
                            reject({ status: status, statusText: statusText });
                        }
                    }, delay * 1000);
                });
            });
        };
        ScenarioLoader.prototype.fetchScenario = function (route) {
            var _this = this;
            return Promise.resolve()
                .then(function () {
                if (_this._scenarios[route] && _this._scenarios[route].disableCache !== true) {
                    return Promise.resolve(_this._scenarios[route]);
                }
                else {
                    return _this._scenarioStore.loadScenario(route)
                        .then(function (scenario) {
                        return _this.processScenario(route, scenario);
                    })
                        .catch(function (err) {
                        return null;
                    });
                }
            })
                .then(function (scenario) {
                if (!!scenario) {
                    var routeOveride = _this._overides[route];
                    if (!!routeOveride) {
                        scenario.data = Object.assign(scenario.data, routeOveride);
                    }
                }
                return scenario;
            });
            // if (this._scenarios[route]) {
            //     return Promise.resolve(this._scenarios[route]);
            // }
            // return this._scenarioStore.loadScenario<T, V>(route)
            //            .then((scenario) => {
            //                return this.processScenario(route, scenario);
            //            })
            //            .catch((err) => {
            //                return null;
            //            });
        };
        ScenarioLoader.prototype.processScenario = function (route, scenario) {
            this._scenarios[route] = scenario;
            this.processMacros(scenario);
            if (scenario && scenario.status === 200 && scenario.dataSchemaName) {
                return this._schemaLoader.getSchema(scenario.dataSchemaName)
                    .then(function (schema) {
                    if (!!scenario.data && schema) {
                        scenario.dataSchema = tv4.validateResult(scenario.data, schema, true, true);
                    }
                    return scenario;
                })
                    .catch(function () {
                    return scenario;
                });
            }
            else {
                return Promise.resolve(scenario);
            }
        };
        ScenarioLoader.prototype.processRetry = function (scenario) {
            var doRetry = false;
            if (scenario.retryCount) {
                if (!scenario.retryCurrent) {
                    scenario.retryCurrent = scenario.retryCount;
                }
                else {
                    scenario.retryCurrent--;
                }
                doRetry = scenario.retryCurrent > 0;
                if (scenario.retryCurrent === 0) {
                    scenario.retryCurrent = scenario.retryCount;
                }
            }
            return doRetry;
        };
        ScenarioLoader.prototype.processMacros = function (scenario) {
            var _this = this;
            if (scenario && scenario.data) {
                var json = JSON.stringify(scenario.data);
                json = json.replace(/@@.*?@@/gi, function (match) {
                    var replacement = match.replace(/@@/gi, "");
                    var parts = replacement.split(":");
                    if (parts && parts.length > 0) {
                        var macroType = parts.shift();
                        switch (macroType) {
                            case "DATE":
                                replacement = _this.processDate(replacement, parts);
                                break;
                            case "RANDOM":
                                replacement = _this.randomInclude(replacement, parts);
                                break;
                        }
                    }
                    return replacement;
                });
                scenario.data = JSON.parse(json);
            }
            return scenario;
        };
        ScenarioLoader.prototype.processDate = function (replacement, parts) {
            var dt = moment();
            var format = "YYYY-MM-DD";
            if (parts.length > 0 && parts[0].length > 0) {
                format = parts[0];
            }
            if (parts.length > 1 && parts[1].length > 2) {
                var addSubstract = parts[1][0];
                var unitOfTime = parts[1][1];
                var days = parseInt(parts[1].substr(2), 10);
                if (!isNaN(days)) {
                    if (addSubstract === "+") {
                        dt = dt.add(days, unitOfTime);
                    }
                    else {
                        dt = dt.subtract(days, unitOfTime);
                    }
                }
            }
            return dt.format(format);
        };
        ScenarioLoader.prototype.randomInclude = function (replacement, parts) {
            var text = "";
            var chances = 0.5; // chance string will be included, 0 to 1
            if (parts.length > 1 && parts[1].length > 0) {
                chances = parseFloat(parts[1]);
            }
            if (parts.length > 0 && parts[0].length > 0) {
                if (Math.random() < chances) {
                    text = parts[0].toString();
                }
            }
            return text;
        };
        ScenarioLoader = __decorate([
            aurelia_framework_1.inject(schemaLoader_1.SchemaLoader, scenarioStore_1.ScenarioStore, aurelia_event_aggregator_1.EventAggregator, browserLocalStorage_1.BrowserLocalStorage),
            __metadata("design:paramtypes", [Object, Object, aurelia_event_aggregator_1.EventAggregator, Object])
        ], ScenarioLoader);
        return ScenarioLoader;
    }());
    exports.ScenarioLoader = ScenarioLoader;
});

//# sourceMappingURL=scenarioLoader.js.map
