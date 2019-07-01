import {inject} from "aurelia-framework";
import {IScenarioLoader} from "./IScenarioLoader";
import {Scenario} from "./models/scenario";
import {Mutation} from "./models/mutation";
import * as tv4 from "tv4";
import * as moment from "moment";
import {ISchemaLoader} from "./ISchemaLoader";
import {SchemaLoader} from "./schemaLoader";
import {ScenarioStore} from "./scenarioStore";
import {IScenarioStore} from "./IScenarioStore";
import {Threading} from "../core/threading";
import { EventAggregator } from "aurelia-event-aggregator";
import { SimulationConstants } from "./constants/simulationConstants";
import { BrowserLocalStorage } from "../core/services/browserLocalStorage";
import { IStorage } from "../core/services/IStorage";

const { SIMULATION_OVERRIDE_EVENT, SIMULATION_OVERRIDE_STORAGE_KEY } = SimulationConstants;

@inject(SchemaLoader, ScenarioStore, EventAggregator, BrowserLocalStorage)
export class ScenarioLoader implements IScenarioLoader {
    private _scenarioStore: IScenarioStore;
    private _schemaLoader: ISchemaLoader;
    private _eventAggregator: EventAggregator;
    private _storage: IStorage;

    private _scenarioNames: string[];
    private _scenarios: { [key: string]: Scenario<any, any> };
    private _overides: { [key: string]: any };

    private _httpErrorLookup: { [key: number]: string[] };
    private _baseDir: string;

    constructor(schemaLoader: ISchemaLoader, scenarioStore: IScenarioStore, eventAggregator: EventAggregator, storage: IStorage) {
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

    public initialise(baseDir?: string): Promise<void> {
        this._baseDir = baseDir || "scenarios";

        return this._storage.get("SIM", SIMULATION_OVERRIDE_STORAGE_KEY)
            .then((data: {[index: string]: string}) => {
                this._overides = data || {};
            })
            .then(() => {
                this._eventAggregator.subscribe(SIMULATION_OVERRIDE_EVENT, (overide: any) => {
                    this._overides = {};
                    this._overides[overide.route] = overide.data;
                    this._storage.set("SIM", SIMULATION_OVERRIDE_STORAGE_KEY, this._overides);
                });
            })
            .then(() => this._scenarioStore.initialise(this._baseDir));
    }

    public listScenarios(): Promise<string[]> {
        if (this._scenarioNames) {
            return Promise.resolve(this._scenarioNames);
        }

        return this._scenarioStore.loadScenarios()
            .then((scenarioNames) => {
                if (!scenarioNames) {
                    scenarioNames = [];
                }
                this._scenarioNames = scenarioNames;
                return this._scenarioNames;
            })
            .catch(() => {
                return this._scenarioNames;
            });
    }

    public loadScenario<T, V>(route: string): Promise<Scenario<T, V>> {
        return this.fetchScenario<T, V>(route)
            .then((scenario) => {
                if (!scenario) {
                    scenario = new Scenario<T, V>();
                    scenario.status = 404;
                    scenario.statusText = ["Failed to load scenario " + route];
                }
                return scenario;
            });
    }

    public get<T>(route: string): Promise<T> {
        let delay: number = 0.5;
        let status: number = 400;
        let statusText: string[] = this._httpErrorLookup[400];

        return new Promise<T>((resolve, reject) => {
            this.fetchScenario<T, void>(route)
                .then((scenario) => {
                    let doResolve = false;
                    let response: T = undefined;
                    if (!!scenario) {
                        delay = scenario.delay || delay;
                        status = scenario.status || status;
                        statusText = scenario.statusText || statusText;

                        let retry = this.processRetry(scenario);
                        if (retry) {
                            statusText = this._httpErrorLookup[408];
                        } else if (status === 200) {
                            response = scenario.data;

                            /* If there are mutations then return the most recent one */
                            if (scenario.mutations && scenario.mutations.length > 0) {
                                let mutation = scenario.mutations[scenario.mutations.length - 1];
                                if (mutation && mutation.payload) {
                                    response = mutation.payload;
                                }
                            }
                            // clone the object so the original is not modified by other code
                            if (response) {
                                response = JSON.parse(JSON.stringify(response));
                            }

                            doResolve = true;
                        } else {
                            statusText = this._httpErrorLookup[status];
                            if (!statusText) {
                                statusText = this._httpErrorLookup[400];
                            }
                        }
                    } else {
                        statusText = ["Failed to load scenario " + route];
                    }

                    Threading.delay(() => {
                        if (doResolve) {
                            resolve(response);
                        } else {
                            reject({status, statusText});
                        }
                    }, delay * 1000);
                });
        });
    }

    public put<T, V>(route: string, data: T): Promise<V> {
        let delay: number = 0.5;
        let status: number = 400;
        let statusText: string[] = this._httpErrorLookup[status];

        return new Promise<V>((resolve, reject) => {
            this.fetchScenario<T, V>(route)
                .then((scenario) => {
                    let doResolve = false;
                    let response: V = undefined;
                    if (!!scenario) {
                        delay = scenario.delay || delay;
                        status = scenario.status || status;
                        statusText = scenario.statusText || statusText;

                        let retry = this.processRetry(scenario);
                        if (retry) {
                            statusText = this._httpErrorLookup[408];
                        } else if (status === 200 && !!data) {
                            scenario.mutations = scenario.mutations || [];
                            let mutation = new Mutation<T>();
                            mutation.timestamp = new Date();
                            mutation.payload = data;

                            scenario.mutations.push(mutation);

                            // clone the object so the original is not modified by other code
                            response = scenario.response;
                            if (response) {
                                response = JSON.parse(JSON.stringify(scenario.response));
                            }

                            doResolve = true;
                        } else {
                            statusText = this._httpErrorLookup[status];
                            if (!statusText) {
                                statusText = this._httpErrorLookup[400];
                            }
                        }
                    } else {
                        statusText = ["Failed to load scenario " + route];
                    }

                    Threading.delay(() => {
                        if (doResolve) {
                            resolve(response);
                        } else {
                            reject({status, statusText});
                        }
                    }, delay * 1000);
                });
        });
    }

    public post<T, V>(route: string, data: T): Promise<V> {
        let delay: number = 0.5;
        let status: number = 404;
        let statusText: string[] = this._httpErrorLookup[status];

        return new Promise<V>((resolve, reject) => {
            this.fetchScenario<T, V>(route)
                .then((scenario) => {
                    let doResolve = false;
                    let response: V = undefined;
                    if (!scenario) {
                        scenario = new Scenario<T, V>();
                        scenario.status = 200;
                        scenario.mutations = [];
                        this._scenarios[route] = scenario;
                    }

                    delay = scenario.delay || delay;
                    status = scenario.status || (!data ? 400 : status);
                    statusText = scenario.statusText || this._httpErrorLookup[status];

                    let retry = this.processRetry(scenario);
                    if (retry) {
                        statusText = this._httpErrorLookup[408];
                    } else if (status === 200) {
                        scenario.mutations = scenario.mutations || [];

                        let mutation = new Mutation<T>();
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
                    } else {
                        statusText = this._httpErrorLookup[status];
                        if (!statusText) {
                            statusText = this._httpErrorLookup[400];
                        }
                    }

                    Threading.delay(() => {
                        if (doResolve) {
                            resolve(response);
                        } else {
                            reject({status, statusText});
                        }
                    }, delay * 1000);
                });
        });
    }

    private fetchScenario<T, V>(route: string): Promise<Scenario<T, V>> {
        return Promise.resolve()
            .then(() => {
                if (this._scenarios[route] && this._scenarios[route].disableCache !== true) {
                    return Promise.resolve(this._scenarios[route]);
                } else {
                    return this._scenarioStore.loadScenario<T, V>(route)
                        .then((scenario) => {
                            return this.processScenario(route, scenario);
                        })
                        .catch((err) => {
                            return null;
                        });
                }
            })
            .then((scenario) => {
                if (!!scenario) {
                    let routeOveride = this._overides[route];
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

    }

    private processScenario<T, V>(route: string, scenario: Scenario<T, V>): Promise<Scenario<T, V>> {
        this._scenarios[route] = scenario;
        this.processMacros(scenario);

        if (scenario && scenario.status === 200 && scenario.dataSchemaName) {
            return this._schemaLoader.getSchema(scenario.dataSchemaName)
                       .then((schema) => {
                           if (!!scenario.data && schema) {
                               scenario.dataSchema = <any>tv4.validateResult(scenario.data, schema, true, true);
                           }
                           return scenario;
                       })
                       .catch(() => {
                           return scenario;
                       });
        } else {
            return Promise.resolve(scenario);
        }
    }

    private processRetry<T, V>(scenario: Scenario<T, V>): boolean {
        let doRetry = false;
        if (scenario.retryCount) {
            if (!scenario.retryCurrent) {
                scenario.retryCurrent = scenario.retryCount;
            } else {
                scenario.retryCurrent--;
            }
            doRetry = scenario.retryCurrent > 0;
            if (scenario.retryCurrent === 0) {
                scenario.retryCurrent = scenario.retryCount;
            }
        }
        return doRetry;
    }

    private processMacros<T, V>(scenario: Scenario<T, V>): Scenario<T, V> {
        if (scenario && scenario.data) {
            let json = JSON.stringify(scenario.data);
            json = json.replace(/@@.*?@@/gi, (match) => {
                let replacement = match.replace(/@@/gi, "");

                let parts = replacement.split(":");
                if (parts && parts.length > 0) {
                    let macroType = parts.shift();
                    switch (macroType) {
                        case "DATE":
                            replacement = this.processDate(replacement, parts);
                            break;
                        case "RANDOM":
                            replacement = this.randomInclude(replacement, parts);
                            break;
                    }
                }
                return replacement;
            });
            scenario.data = JSON.parse(json);
        }
        return scenario;
    }

    private processDate(replacement: string, parts: string[]): string {
        let dt: moment.Moment = moment();
        let format = "YYYY-MM-DD";

        if (parts.length > 0 && parts[0].length > 0) {
            format = parts[0];
        }
        if (parts.length > 1 && parts[1].length > 2) {
            let addSubstract: string = parts[1][0];
            let unitOfTime: string = parts[1][1];
            let days: number = parseInt(parts[1].substr(2), 10);
            if (!isNaN(days)) {
                if (addSubstract === "+") {
                    dt = dt.add(days, unitOfTime);
                } else {
                    dt = dt.subtract(days, unitOfTime);
                }

            }
        }
        return dt.format(format);
    }

    private randomInclude(replacement: string, parts: string[]): string {
        let text: string = "";
        let chances: number = 0.5; // chance string will be included, 0 to 1

        if (parts.length > 1 && parts[1].length > 0) {
            chances = parseFloat(parts[1]);
        }
        if (parts.length > 0 && parts[0].length > 0) {
            if (Math.random() < chances) {
                text = parts[0].toString();
            }
        }
        return text;
    }
}
