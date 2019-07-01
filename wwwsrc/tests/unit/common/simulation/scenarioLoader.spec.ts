import {IScenarioStore} from "../../../../app/common/simulation/IScenarioStore";
import {ISchemaLoader} from "../../../../app/common/simulation/ISchemaLoader";
import {IScenarioLoader} from "../../../../app/common/simulation/IScenarioLoader";
import {ScenarioLoader} from "../../../../app/common/simulation/scenarioLoader";
import { IStorage } from "../../../../app/common/core/services/IStorage";
import {Threading} from "../../../../app/common/core/threading";
import {Container} from "aurelia-dependency-injection";
import {Router} from "aurelia-router";
import { EventAggregator } from "aurelia-event-aggregator";


describe("Scenario loader", () => {
    let sandbox: Sinon.SinonSandbox;
    let scenarioStore: IScenarioStore;
    let schemaLoader: ISchemaLoader;
    let scenarioLoader: IScenarioLoader;
    let eventAggregator: EventAggregator;
    let storage: IStorage;

    let _delay = Threading.delay;
    let timerCallback = jasmine.createSpy("timerCallback");

    beforeEach(() => {
        _delay = Threading.delay;
        Threading.delay = (func: any, timeout: number): any => {
            timerCallback(func, timeout);
            func();
        };
        sandbox = sinon.sandbox.create();
        scenarioStore = <IScenarioStore>{};
        schemaLoader = <ISchemaLoader>{};
        eventAggregator = <EventAggregator>{};
        eventAggregator.subscribe = sandbox.stub();

        storage = <IStorage>{};

        storage.get = sandbox.stub().resolves(null);
        storage.set =  sandbox.stub().resolves(null);

        scenarioLoader = new ScenarioLoader(<ISchemaLoader> schemaLoader, <IScenarioStore> scenarioStore, eventAggregator, storage);

        let routerStub = <Router>{};
        routerStub.addRoute = sandbox.stub();

        sandbox.stub(Container.instance, "get").returns(routerStub);
    });

    afterEach(() => {
        Threading.delay = _delay;
        sandbox.restore();
    });

    it("can be created", () => {
        expect(scenarioLoader).toBeDefined();
    });

     it("initialise should proxy to scenario store", (done) => {
        let initialiseStub = scenarioStore.initialise = sandbox
                .stub()
                .returns(Promise.resolve());

        scenarioLoader.initialise().then(() => {
            expect(initialiseStub.calledOnce).toBeTruthy();
            done();
        });
    });

    describe("listScenarios", () => {

        let sampleJsonResponse: any = ["fakescenarioName"];
        let loadScenariosStub: Sinon.SinonStub;

        beforeEach(() => {
            loadScenariosStub = scenarioStore.loadScenarios = sandbox
                .stub()
                .returns(Promise.resolve(sampleJsonResponse));
        });

        it("should load scenario list from scenario store on first time load", (done) => {
            scenarioLoader.listScenarios().then((scenarioList) => {
                expect(loadScenariosStub.callCount).toEqual(1);
                expect(scenarioList).toEqual(sampleJsonResponse);
                done();
            });
        });

        it("should load scenario list from cache after first request", (done) => {
            scenarioLoader.listScenarios().then(() => {
                expect(loadScenariosStub.calledOnce).toEqual(true);
                scenarioLoader.listScenarios().then((scenarioList) => {
                    expect(loadScenariosStub.calledOnce).toEqual(true);
                    expect(scenarioList).toEqual(sampleJsonResponse);
                    done();
                });
            });
        });

        it("should default scenarioNames as empty array when loadScenarios returns falsy", (done) => {
            loadScenariosStub = scenarioStore.loadScenarios = sandbox
                .stub()
                .returns(Promise.resolve());

            scenarioLoader.listScenarios().then((scenarioList) => {
                expect(loadScenariosStub.callCount).toEqual(1);
                expect(scenarioList).toEqual([]);
                done();
            });
        });

        it("should default scenarioNames as null when loadScenarios throws", (done) => {
            loadScenariosStub = scenarioStore.loadScenarios = sandbox
                .stub()
                .returns(Promise.reject("some rejection"));

            scenarioLoader.listScenarios().then((scenarioList) => {
                expect(loadScenariosStub.callCount).toEqual(1);
                expect(scenarioList).toBeNull();
                done();
            });
        });

    });

    describe("loadScenario", () => {

        let sampleJsonResponse: any = {
            "fake": true
        };
        let sampleSchemaResponse: any = {
            "id": "Meta",
            "type": "object",
            "properties": {
                "services": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Service"
                    }
                }
            },
            "required": [
                "services"
            ]
        };

        let loadScenarioStub: Sinon.SinonStub;
        let getSchemaStub: Sinon.SinonStub;

        beforeEach(() => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox
                .stub()
                .returns(Promise.resolve(sampleJsonResponse));
            getSchemaStub = schemaLoader.getSchema = sandbox
                .stub()
                .returns(Promise.resolve(sampleSchemaResponse));
        });


        it("should load scenario from assets service on first time load", (done) => {
            scenarioLoader.loadScenario("testroute").then((scenario) => {
                expect(loadScenarioStub.alwaysCalledWith("testroute")).toEqual(true);
                done();
            });
        });

        it("should load scenario from cache on second invocation", (done) => {
            scenarioLoader.loadScenario("testroute").then((firstResponse) => {
                expect(firstResponse).toBeDefined();
                scenarioLoader.loadScenario("testroute").then((secondResponse) => {
                    expect(loadScenarioStub.calledOnce).toEqual(true);
                    expect(loadScenarioStub.alwaysCalledWithExactly("testroute")).toEqual(true);
                    done();
                });
            });
        });

        it("should load scenario from scenario store when first load returns undefined", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve());

            scenarioLoader.loadScenario("testroute").then((firstResponse) => {
                scenarioLoader.loadScenario("testroute").then((secondResponse) => {
                    expect(loadScenarioStub.calledTwice).toEqual(true);
                    expect(loadScenarioStub.alwaysCalledWithExactly("testroute")).toEqual(true);
                    done();
                });
            });
        });

        it("should default to a 404 scenario when scenario doesn't exist", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve());

            scenarioLoader.loadScenario("testroute").then((firstResponse) => {
                expect(loadScenarioStub.calledOnce).toEqual(true);
                expect(loadScenarioStub.alwaysCalledWithExactly("testroute")).toEqual(true);
                expect(firstResponse.status).toEqual(404);
                done();
            });
        });

        it("should attempt to load schema when scenario is a valid json response (200)", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({
                status: 200,
                dataSchemaName: "dataschema"
            }));

            scenarioLoader.loadScenario("testroute").then((scenario) => {
                expect(getSchemaStub.calledOnce).toEqual(true);
                expect(getSchemaStub.alwaysCalledWithExactly("dataschema")).toEqual(true);
                done();
            });
        });

        it("should validate the scenario data against schema", (done) => {

            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({
                status: 200,
                dataSchemaName: "dataschema",
                data: {
                    "some-fake": true
                }
            }));

            scenarioLoader.loadScenario("testroute").then((scenario) => {
                expect(getSchemaStub.calledOnce).toEqual(true);
                expect(getSchemaStub.alwaysCalledWithExactly("dataschema")).toEqual(true);
                expect(scenario.dataSchema).toBeDefined();
                done();
            });
        });


        it("should skip schema validation when getSchema throws exception", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({
                status: 200,
                dataSchemaName: "dataschema",
                data: {
                    "some-fake": true
                }
            }));

            getSchemaStub = schemaLoader.getSchema = sandbox
                .stub()
                .returns(Promise.reject("mock error"));

            scenarioLoader.loadScenario("testroute").then((scenario) => {
                expect(getSchemaStub.calledOnce).toEqual(true);
                expect(getSchemaStub.alwaysCalledWithExactly("dataschema")).toEqual(true);
                expect(scenario.dataSchema).toBeUndefined();
                done();
            });
        });

        it("should skip schema validation when scenario has status != 200", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({
                status: 400,
                dataSchemaName: "dataschema",
                data: {
                    "some-fake": true
                }
            }));

            scenarioLoader.loadScenario("testroute").then((scenario) => {
                expect(getSchemaStub.notCalled).toEqual(true);
                expect(scenario.dataSchema).toBeUndefined();
                done();
            });
        });

        it("should skip schema validation when scenario has no data schema", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({
                status: 200,
                data: {
                    "some-fake": true
                }
            }));

            scenarioLoader.loadScenario("testroute").then((scenario) => {
                expect(getSchemaStub.notCalled).toEqual(true);
                expect(scenario.dataSchema).toBeUndefined();
                done();
            });
        });

    });

    describe("get", () => {

        let sampleJsonResponse: any = {
            "status": 200
        };
        let sampleSchemaResponse: any = {
            "id": "Meta",
            "type": "object",
            "properties": {
                "services": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Service"
                    }
                }
            },
            "required": [
                "services"
            ]
        };

        let loadScenarioStub: Sinon.SinonStub;

        beforeEach(() => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox
                .stub()
                .returns(Promise.resolve(sampleJsonResponse));
            schemaLoader.getSchema = sandbox
                .stub()
                .returns(Promise.resolve(sampleSchemaResponse));
        });

        it("should get scenario from scenaro store service on first time load", (done) => {
            scenarioLoader.get("testroute").then((scenario) => {
                expect(loadScenarioStub.alwaysCalledWith("testroute")).toEqual(true);
                done();
            });
        });

        it("should get scenario from cache on second invocation", (done) => {
            scenarioLoader.get("testroute").then((firstResponse) => {
                scenarioLoader.get("testroute").then((secondResponse) => {
                    expect(loadScenarioStub.calledOnce).toEqual(true);
                    expect(loadScenarioStub.alwaysCalledWithExactly("testroute")).toEqual(true);
                    done();
                });
            });
        });


        // question this? Should this return an empty data payload or throw status text error?
        it("should return null when scenario has status 200 and no data attribute", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({
                "status": 200
            }));

            scenarioLoader.get("testroute").then((scenario) => {
                expect(scenario).toBeUndefined();
                done();
            });
        });

        it("should return a response body when status is 200 and data attribute specified", (done) => {
            let testPayload = {
                "testpayload": true
            };

            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({
                "status": 200,
                "data": testPayload
            }));

            scenarioLoader.get("testroute").then((scenario) => {
                expect(scenario).toEqual(testPayload);
                done();
            });
        });

        it("should return throw when scenario status is not 200", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({
                "status": 400
            }));

            scenarioLoader.get("testroute").catch((err) => {
                expect(err.statusText[0]).toEqual("400 Bad Request");
                done();
            });
        });

        it("should throw with 400 when scenario object has no status attribute", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({}));

            scenarioLoader.get("testroute").catch((err) => {
                expect(err.statusText[0]).toEqual("400 Bad Request");
                done();
            });
        });

        it("should default to statusText `Failed to load scenario` when asset service returns null", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve(null));

            scenarioLoader.get("testroute").catch((err) => {
                expect(err.statusText[0]).toEqual("Failed to load scenario testroute");
                done();
            });
        });

        // fetchScenario never throws. Catch is swallowed and null is returned.
        it("should default to statusText `Failed to load scenario` when asset service throws", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.reject("some rejection"));

            scenarioLoader.get("testroute").catch((err) => {
                expect(err.statusText[0]).toEqual("Failed to load scenario testroute");
                done();
            });
        });

        it("should default to statusText `400 Bad Request` when scenario object has no status attribute", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({}));

            scenarioLoader.get("testroute").catch((err) => {
                expect(err.statusText[0]).toEqual("400 Bad Request");
                done();
            });
        });

        it("should delay the response by duration expressed in the `delay` attribute in the scenario", (done) => {

            let testPayload = {
                "testpayload": true
            };

            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({
                "status": 200,
                "delay": 10, //seconds
                "data": testPayload
            }));

            scenarioLoader.get("testroute").then((scenario) => {
                expect(timerCallback).toHaveBeenCalled();
                expect(scenario).toEqual(testPayload);
                done();
            });
        });

        it ("should load original scenaro when mutation has no payload", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({
                "status": 200,
                "data": {
                    "testpayload": true
                },
                "mutations": [{ }]
            }));

            scenarioLoader.get("testroute").then((scenario) => {
                expect((<any>scenario).testpayload).toEqual(true);
                done();
            });
        });

        it ("should load the most recent mutation", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({
                "status": 200,
                "data": {
                    "testpayload": true
                },
                "mutations": [{
                    "payload": { "testpayload": 1 }
                }, {
                    "payload": { "testpayload": 2 }
                }]
            }));

            scenarioLoader.get("testroute").then((scenario) => {
                expect((<any>scenario).testpayload).toEqual(2);
                done();
            });
        });
    });

    describe("put", () => {

        let sampleJsonResponse: any = {
            "status": 200
        };
        let sampleSchemaResponse: any = {
            "id": "Meta",
            "type": "object",
            "properties": {
                "services": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Service"
                    }
                }
            },
            "required": [
                "services"
            ]
        };

        let loadScenarioStub: Sinon.SinonStub;

        beforeEach(() => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox
                .stub()
                .returns(Promise.resolve(sampleJsonResponse));
            schemaLoader.getSchema = sandbox
                .stub()
                .returns(Promise.resolve(sampleSchemaResponse));
        });

        it("should get scenario from scenaro store service on first time load", (done) => {
            scenarioLoader.put("testroute", {}).then((scenario) => {
                expect(loadScenarioStub.alwaysCalledWith("testroute")).toEqual(true);
                done();
            });
        });

        it("should get scenario from cache on second invocation", (done) => {
            scenarioLoader.put("testroute", {}).then((firstResponse) => {
                scenarioLoader.put("testroute", {}).then((secondResponse) => {
                    expect(loadScenarioStub.calledOnce).toEqual(true);
                    expect(loadScenarioStub.alwaysCalledWithExactly("testroute")).toEqual(true);
                    done();
                });
            });
        });

        it("should return null when scenario has status 200 and no data", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({
                "status": 200
            }));

            scenarioLoader.put("testroute", null).catch((err) => {
                expect(err.statusText[0]).toEqual("400 Bad Request");
                done();
            });
        });

        it("should store mutations", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({
                "status": 200,
                "data": {
                    "testpayload": true
                },
                "response": {
                    "testResponse": true
                }
            }));

            scenarioLoader.get("testroute").then((scenario) => {
                expect((<any>scenario).testpayload).toEqual(true);
                scenarioLoader.put("testroute", { "testpayload": false })
                    .then((scenario) => {
                        expect((<any>scenario).testResponse).toEqual(true);
                        scenarioLoader.get("testroute").then((scenario) => {
                            expect((<any>scenario).testpayload).toEqual(false);
                            done();
                        });
                    });
            });
        });

        it("should return throw when scenario status is not 200", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({
                "status": 400
            }));

            scenarioLoader.put("testroute", {}).catch((err) => {
                console.warn(err)
                expect(err.statusText[0]).toEqual("400 Bad Request");
                done();
            });
        });

        it("should throw with 400 when scenario object has no status attribute", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({}));

            scenarioLoader.put("testroute", {}).catch((err) => {
                expect(err.statusText[0]).toEqual("400 Bad Request");
                done();
            });
        });

        it("should default to statusText `Failed to load scenario` when scenario store returns null", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve(null));

            scenarioLoader.put("testroute", {}).catch((err) => {
                expect(err.statusText[0]).toEqual("Failed to load scenario testroute");
                done();
            });
        });

        it("should default to statusText `Failed to load scenario` when asset service throws", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.reject("some rejection"));

            scenarioLoader.put("testroute", {}).catch((err) => {
                expect(err.statusText[0]).toEqual("Failed to load scenario testroute");
                done();
            });
        });

        it("should default to statusText `400 Bad Request` when scenario object has no status attribute", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({}));

            scenarioLoader.put("testroute", {}).catch((err) => {
                expect(err.statusText[0]).toEqual("400 Bad Request");
                done();
            });
        });


        it("should delay the response by duration expressed in the `delay` attribute in the scenario", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({
                "status": 200,
                "delay": 10, //seconds
                "data": {
                    "testpayload": true
                },
                "response": {
                    "testresponse": true
                }
            }));

            scenarioLoader.put("testroute", {}).then((scenario) => {
                expect(timerCallback).toHaveBeenCalled();
                expect((<any>scenario).testresponse).toEqual(true);
                done();
            });
        });
    });

    describe("post", () => {

        let sampleJsonResponse: any = {
            "status": 200
        };
        let sampleSchemaResponse: any = {
            "id": "Meta",
            "type": "object",
            "properties": {
                "services": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Service"
                    }
                }
            },
            "required": [
                "services"
            ]
        };

        let loadScenarioStub: Sinon.SinonStub;

        beforeEach(() => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox
                .stub()
                .returns(Promise.resolve(sampleJsonResponse));
            schemaLoader.getSchema = sandbox
                .stub()
                .returns(Promise.resolve(sampleSchemaResponse));
        });

        it("should get scenario from scenaro store service on first time load", (done) => {
            scenarioLoader.post("testroute", {}).then((scenario) => {
                expect(loadScenarioStub.alwaysCalledWith("testroute")).toEqual(true);
                done();
            });
        });

        it("should get scenario from cache on second invocation", (done) => {
            scenarioLoader.post("testroute", {}).then((firstResponse) => {
                scenarioLoader.post("testroute", {}).then((secondResponse) => {
                    expect(loadScenarioStub.calledOnce).toEqual(true);
                    expect(loadScenarioStub.alwaysCalledWithExactly("testroute")).toEqual(true);
                    done();
                });
            });
        });

        it("should return undefined when scenario has status 200 but no reponse", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({
                "status": 200
            }));

            scenarioLoader.post("testroute", null).then((scenario) => {
                expect(scenario).toBeUndefined();
                done();
            });
        });

        it("should store mutations", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({
                "status": 200,
                "data": {
                    "testpayload": true
                },
                "response": {
                    "testResponse": true
                }
            }));

            scenarioLoader.get("testroute").then((scenario) => {
                expect((<any>scenario).testpayload).toEqual(true);
                scenarioLoader.post("testroute", { "testpayload": false })
                     .then((scenario) => {
                        expect((<any>scenario).testResponse).toEqual(true);
                        scenarioLoader.get("testroute").then((scenario) => {
                            expect((<any>scenario).testpayload).toEqual(false);
                            done();
                        });
                    });
            });
        });

        it("should return throw when scenario status is not 200", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({
                "status": 400
            }));

            scenarioLoader.post("testroute", {}).catch((err) => {
                expect(err.statusText[0]).toEqual("400 Bad Request");
                done();
            });
        });

        it("should throw with 404 (not found) when scenario object has no status attribute", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({}));

            scenarioLoader.post("testroute", {}).catch((err) => {
                expect(err.statusText[0]).toEqual("404 Not found");
                done();
            });
        });

        it("should create new scenario when scenario doesn't exist.", (done) => {
            let payload = { "testpayload": true };

            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve(null));

            scenarioLoader.post("testroute", payload).then((scenario) => {
                expect(scenario).toBeUndefined();
                done();
            });
        });

        it("should create new scenario when scenario store throws (assumes doesn't exist so create it)", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.reject("some rejection"));

            scenarioLoader.post("testroute", {}).then((scenario) => {
                expect(scenario).toBeUndefined();
                done();
            });
        });

        it("should default to statusText `404 Not Found` when scenario object has no status attribute", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({}));

            scenarioLoader.post("testroute", {}).catch((err) => {
                expect(err.statusText[0]).toEqual("404 Not found");
                done();
            });
        });

        it("should delay the response by duration expressed in the `delay` attribute in the scenario", (done) => {
            loadScenarioStub = scenarioStore.loadScenario = sandbox.stub().returns(Promise.resolve({
                "status": 200,
                "delay": 10, //seconds
                "data": {
                    "testpayload": true
                },
                 "response": {
                    "testresponse": true
                }
            }));

            scenarioLoader.post("testroute", {}).then((scenario) => {
                expect(timerCallback).toHaveBeenCalled();
                expect((<any>scenario).testresponse).toEqual(true);
                done();
            });
        });
    });


});
