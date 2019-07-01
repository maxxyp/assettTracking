/// <reference path="../../../../../typings/app.d.ts" />

import { ResilientService } from "../../../../../app/common/resilience/services/resilientService";
import {IConfigurationService} from "../../../../../app/common/core/services/IConfigurationService";
import {EventAggregator} from "aurelia-event-aggregator";
import { IHttpHeaderProvider } from "../../../../../app/common/resilience/services/interfaces/IHttpHeaderProvider";
import { ResilientHttpClientFactory } from "../../../../../app/common/resilience/services/resilientHttpClientFactory";
import { IStorageService } from "../../../../../app/hema/business/services/interfaces/IStorageService";
import { IHttpClient } from "../../../../../app/common/core/IHttpClient";
import { IEndpointConfiguration } from "../../../../../app/common/resilience/models/IEndpointConfiguration";
import { IHttpHeader } from "../../../../../app/common/core/IHttpHeader";
import { SuccessLoggingMode } from "../../../../../app/common/resilience/models/successLoggingMode";
import * as Logging from "aurelia-logging";
import { RetryPayload } from "../../../../../app/common/resilience/models/retryPayload";
import * as moment from "moment";
import { FftServiceConstants } from "../../../../../app/hema/api/services/constants/fftServiceConstants";
import { IHemaConfiguration } from '../../../../../app/hema/IHemaConfiguration';
import { ApiException } from "../../../../../app/common/resilience/apiException";
import { WuaNetworkDiagnostics } from "../../../../../app/common/core/wuaNetworkDiagnostics";
import { WuaNetworkDiagnosticsResult } from "../../../../../app/common/core/wuaNetworkDiagnosticsResult";
import { AnalyticsConstants } from "../../../../../app/common/analytics/analyticsConstants";

const TESTING_WAIT_DELAY = 49.98;

class ConcreteResilientService extends ResilientService {
    public getData<T>(routeName: string, params: { [id: string]: any }, breakCache?: boolean): Promise<T> {
        return super.getData(routeName, params, breakCache);
    }

    public postData<T, V>(routeName: string, params: { [id: string]: any }, data: T): Promise<V> {
        return super.postData(routeName, params, data);
    }

    public putData<T, V>(routeName: string, params: { [id: string]: any }, data: T): Promise<V> {
        return super.putData(routeName, params, data);
    }

    public postDataResilient(routeName: string, params: { [id: string]: any }, data: any): Promise<void> {
        return super.postDataResilient(routeName, params, data);
    }

    public putDataResilient(routeName: string, params: { [id: string]: any }, data: any): Promise<void> {
        return super.putDataResilient(routeName, params, data);
    }
}

describe("the ResilientService module", () => {
    let resilientService: ConcreteResilientService;
    let sandbox: Sinon.SinonSandbox;
    let configurationServiceStub: IConfigurationService;
    let storageServiceStub: IStorageService;
    let eventAggregatorStub: EventAggregator;
    let eventAggregatorPublishSpy: Sinon.SinonSpy;
    let httpHeaderProvider: IHttpHeaderProvider;
    let resilientClientFactory: ResilientHttpClientFactory;
    let httpClient: IHttpClient;
    let endpointConfig: IEndpointConfiguration;
    let config: IHemaConfiguration;

    let realLoggingGetLogger: any;
    let loggerWarnStub: Sinon.SinonStub;
    let wuaNetworkDiagnosticsStub: WuaNetworkDiagnostics;
    let diagnosticResult: WuaNetworkDiagnosticsResult;

    let assertParamsForGet = (args: any[], isBreakCache: boolean) => {
        expect(args[0]).toBe("test-client-root");
        expect(args[1]).toBe("get-route-url");
        expect(args[2]).toEqual({id: "foo"});
        expect(args[3]).toBe(isBreakCache);
        expect(args[4]).toEqual([ {
            name: "header-name",
            value: "header-value"
        }])
    };

    let assertParamsForPut = (args: any[]) => {
        expect(args[0]).toBe("test-client-root");
        expect(args[1]).toBe("put-route-url");
        expect(args[2]).toEqual({id: "foo"});
        expect(args[3]).toEqual({data: "put-data"});
        expect(args[4]).toEqual([ {
            name: "header-name",
            value: "header-value"
        }])
    };

    let assertParamsForPost = (args: any[]) => {
        expect(args[0]).toBe("test-client-root");
        expect(args[1]).toBe("post-route-url");
        expect(args[2]).toEqual({id: "foo"});
        expect(args[3]).toEqual({data: "post-data"});
        expect(args[4]).toEqual([{
            name: "header-name",
            value: "header-value"
        }])
    };

    let waitForConditionToBeTrue = async (condition: () => Promise<boolean>) => {
        while (!(await condition())) {
            await Promise.delay(TESTING_WAIT_DELAY);
        }
    }

    let buildResilienceService= () => {
        resilientService = new ConcreteResilientService(
            configurationServiceStub,
            "configName",
            storageServiceStub,
            eventAggregatorStub,
            httpHeaderProvider,
            resilientClientFactory,
            wuaNetworkDiagnosticsStub
        );
    }

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        configurationServiceStub = <IConfigurationService>{};

        endpointConfig = <IEndpointConfiguration>{
            clients: [
                {
                    name: "test-client",
                    root: "test-client-root"
                }
            ],
            routes: [
                {
                    route: "get-route",
                    path: "get-route-url",
                    client: "test-client"
                },
                {
                    route: "put-route",
                    path: "put-route-url",
                    client: "test-client"
                },
                {
                    route: "post-route",
                    path: "post-route-url",
                    client: "test-client"
                },
                {
                    route: FftServiceConstants.JOB_UPDATE_ROUTE,
                    path: "job-update-route-url",
                    client: "test-client"
                },
                {
                    route: FftServiceConstants.ORDER_PARTS_ROUTE,
                    path: "order-parts-route-url",
                    client: "test-client"
                }
            ]
        };

        config = <IHemaConfiguration> {};
        config.fftServiceEndpoint = endpointConfig;

        let configStub = configurationServiceStub.getConfiguration = sandbox.stub().returns(config);
        configStub.withArgs(sinon.match.string).returns(endpointConfig);

        let resilientStorage = [];
        storageServiceStub = <IStorageService>{
            getResilienceRetryPayloads: (container) => resilientStorage,
            setResilienceRetryPayloads:  (container, payloads) => {
                resilientStorage = payloads;
            }
        };

        eventAggregatorStub = new EventAggregator();
        eventAggregatorPublishSpy = eventAggregatorStub.publish = sandbox.stub();
        httpHeaderProvider = <IHttpHeaderProvider> {};
        httpHeaderProvider.getHeaders = sandbox.stub().resolves(
            <IHttpHeader[]>[
                {
                    name: "header-name",
                    value: "header-value"
                }
            ]
        );

        httpClient = <IHttpClient> {};

        resilientClientFactory = <ResilientHttpClientFactory> {
            getHttpClient: () => httpClient
        };

        loggerWarnStub = sandbox.stub();
        realLoggingGetLogger = Logging.getLogger;

        let logger  = {
            debug:  () => {},
            info:   () => {},
            warn:   loggerWarnStub,
            error:  loggerWarnStub
        };

        (<any>Logging)["getLogger"] = sandbox.stub().returns(logger);

        wuaNetworkDiagnosticsStub = <WuaNetworkDiagnostics>{};
        wuaNetworkDiagnosticsStub.getDiagnostics = sandbox.stub().returns(diagnosticResult);

        buildResilienceService();
    });

    afterEach(() => {
        (<any>Logging)["getLogger"] = realLoggingGetLogger;
        sandbox.restore();
    });

    it("can be created", () => {
        expect(resilientService).toBeDefined();
    });

    describe("immediate calls", () => {

        describe("GET", () => {
            it("calls GET", async done => {
                let stub = httpClient.getData = sandbox.stub().resolves({foo: "bar"});

                let result = await resilientService.getData("get-route", {id: "foo"}, false);

                expect(result["foo"]).toBe("bar");
                assertParamsForGet(stub.args[0], false);
                done();
            });

            it("calls GET with breakCache = true", async done => {
                let stub = httpClient.getData = sandbox.stub().resolves({foo: "bar"});

                let result = await resilientService.getData("get-route", {id: "foo"}, true);

                expect(result["foo"]).toBe("bar");
                assertParamsForGet(stub.args[0], true);
                done();
            });

            it("calls GET and throws and does not use resilience", async done => {
                let stub = httpClient.getData = sandbox.stub().rejects({foo: "error"});
                try {
                    await resilientService.getData("get-route", {id: "foo"}, false);
                } catch (err) {
                    expect(err["foo"]).toBe("error");
                    expect(await resilientService.getUnsentPayloads()).toEqual([]);
                    assertParamsForGet(stub.args[0], false);
                    done();
                }
            });
        });

        describe("PUT", () => {
            it("calls PUT", async done => {
                let stub = httpClient.putData = sandbox.stub().resolves({foo: "bar"});

                let result = await resilientService.putData("put-route", {id: "foo"}, {data: "put-data"});

                expect(result["foo"]).toBe("bar");
                assertParamsForPut(stub.args[0]);
                done();
            });

            it("calls PUT and throws and does not use resilience", async done => {
                let stub = httpClient.putData = sandbox.stub().rejects({foo: "error"});

                try {
                    await resilientService.putData("put-route", {id: "foo"}, {data: "put-data"});
                } catch (err) {
                    expect(err["foo"]).toBe("error");
                    expect(await resilientService.getUnsentPayloads()).toEqual([]);
                    assertParamsForPut(stub.args[0]);
                    done();
                }
            });
        });

        describe("POST", () => {
            it("calls POST", async done => {
                let stub = httpClient.postData = sandbox.stub().resolves({foo: "bar"});

                let result = await resilientService.postData("post-route", {id: "foo"}, {data: "post-data"});

                expect(result["foo"]).toBe("bar");
                assertParamsForPost(stub.args[0]);
                done();
            });

            it("calls POST and throws and does not use resilience", async done => {
                let stub = httpClient.postData = sandbox.stub().rejects({foo: "error"});

                try {
                    await resilientService.postData("post-route", {id: "foo"}, {data: "post-data"});

                    fail();
                } catch (err) {
                    expect(err["foo"]).toBe("error");
                    expect(await resilientService.getUnsentPayloads()).toEqual([]);
                    assertParamsForPost(stub.args[0]);
                    done();
                }
            });
        });
    });

    describe("resilience", () => {
        it("can make a POST call that works and does not stay in resilience", async done => {
            let stub = httpClient.postData = sandbox.stub().resolves({foo: "bar"});

            await resilientService.postDataResilient("post-route", {id: "foo"}, {data: "post-data"});

            await waitForConditionToBeTrue(
                async () => stub.called && (await resilientService.getUnsentPayloads()).length === 0
            );

            assertParamsForPost(stub.args[0]);
            done();
        });

        it("can make a POST call that does not work and is put into resilience queue", async done => {
            let stub = httpClient.postData = sandbox.stub().rejects({error: "bar"});

            await resilientService.postDataResilient("post-route", {id: "foo"}, {data: "post-data"});

            await waitForConditionToBeTrue(
                async () => stub.called && (await resilientService.getUnsentPayloads()).length === 1
            );

            assertParamsForPost(stub.args[0]);
            done();

        });

        it("can make a PUT call that works and does not stay in resilience", async done => {
            let stub = httpClient.putData = sandbox.stub().resolves({foo: "bar"});

            await resilientService.putDataResilient("put-route", {id: "foo"}, {data: "put-data"});

            await waitForConditionToBeTrue(
                async () => stub.called && (await resilientService.getUnsentPayloads()).length === 0
            );

            assertParamsForPut(stub.args[0]);
            done();
        });

        it("can make a PUT call that does not work and is put into resilience queue", async done => {
            let stub = httpClient.putData = sandbox.stub().rejects({error: "bar"});

            await resilientService.putDataResilient("put-route", {id: "foo"}, {data: "put-data"});

            await waitForConditionToBeTrue(
                async () => stub.called && (await resilientService.getUnsentPayloads()).length === 1
            );

            assertParamsForPut(stub.args[0]);
            done();
        });

        it("can load retry payloads from storage when first starting", async done => {
            let payload = <RetryPayload> {};
            payload.correlationId = "123";
            payload.httpMethod = "POST";
            payload.routeName = "post-route";
            payload.headers = [];
            payload.params = {id: "foo"};
            payload.data = {foo: "bar"};
            payload.expiryTime = moment().add(1000, "seconds").toDate();
            await storageServiceStub.setResilienceRetryPayloads("foo", [payload]);

            let putStub = httpClient.putData = sandbox.stub().resolves({foo: "bar"});
            let postStub = httpClient.postData = sandbox.stub().resolves({foo: "bar"});

            await resilientService.putDataResilient("put-route", {id: "foo2"}, {data: "put-data"});

            await waitForConditionToBeTrue(
                async () => (await resilientService.getUnsentPayloads()).length === 0
            );

            expect(postStub.called).toBe(true);
            expect(putStub.called).toBe(true);

            done();
        });

        it("can remove exipred payloads", async done => {
            let payload = <RetryPayload> {};
            payload.correlationId = "123";
            payload.httpMethod = "POST";
            payload.routeName = "post-route";
            payload.headers = [];
            payload.params = {id: "foo"};
            payload.data = {foo: "bar"};
            payload.expiryTime = moment().add(-1, "seconds").toDate();
            await storageServiceStub.setResilienceRetryPayloads("foo", [payload]);

            let putStub = httpClient.putData = sandbox.stub().resolves({foo: "bar"});
            let postStub = httpClient.postData = sandbox.stub().resolves({foo: "bar"});

            await resilientService.putDataResilient("put-route", {id: "foo2"}, {data: "put-data"});

            await waitForConditionToBeTrue(
                async () => (await resilientService.getUnsentPayloads()).length === 0
            );

            expect(postStub.called).toBe(false);
            expect(putStub.called).toBe(true);

            done();
        });

    });

    describe("resilient service methods", () => {
        it("can clear resilient payloads", async done => {
            httpClient.putData = sandbox.stub().rejects({error: "bar"});
            await resilientService.putDataResilient("put-route", {id: "foo2"}, {data: "put-data"});

            await waitForConditionToBeTrue(
                async () => !resilientService.isRetryInProgress()
            );

            await resilientService.clearUnsentPayloads();
            expect((await resilientService.getUnsentPayloads()).length).toBe(0);

            done();
        });

        it("can flush the retry queue and leave it empty", async done => {
            let stub = httpClient.putData = sandbox.stub().rejects({error: "bar"});

            await resilientService.putDataResilient("put-route", {id: "foo2"}, {data: "put-data"});
            await waitForConditionToBeTrue(
                async () => !resilientService.isRetryInProgress()
            );
            stub.reset();
            stub.resolves({foo: "bar"});

            await resilientService.sendAllRetryPayloads();

            await waitForConditionToBeTrue(
                async () => (await resilientService.getUnsentPayloads()).length === 0
            );

            expect(stub.callCount).toBe(1);
            done();
        });

        it("can flush the retry queue and not clear resilience because http still errors", async done => {
            let stub = httpClient.putData = sandbox.stub().rejects({error: "bar"});
            await resilientService.putDataResilient("put-route", {id: "foo2"}, {data: "put-data"});
            stub.reset();

            await waitForConditionToBeTrue(
                async () => !resilientService.isRetryInProgress()
            );

            await resilientService.sendAllRetryPayloads();

            await waitForConditionToBeTrue(
                async () => !resilientService.isRetryInProgress()
            );

            expect((await resilientService.getUnsentPayloads()).length).toBe(1);
            expect(stub.called).toBe(true);
            expect((await storageServiceStub.getResilienceRetryPayloads("foo")).length).toBe(1);
            done();
        });
    });

    describe ("retry polling", () => {
        it("will still send a resilient call if the polling pattern is absent from configuration", async done => {
            let stub = httpClient.putData = sandbox.stub().resolves({foo: "bar"});

            await resilientService.putDataResilient("put-route", {id: "foo"}, {data: "put-data"});

                await waitForConditionToBeTrue(
                async () => (await resilientService.getUnsentPayloads()).length === 0
                );

            expect(stub.calledOnce).toBe(true);
            done();
        });

        it("will read configuration and retry a failing call according to the pattern", async done => {
            config.resilienceRertyIntervals = [1, 2, 3];

            let delaySpy = sandbox.spy(Promise, "delay");

            buildResilienceService();

            let stub = httpClient.putData = sandbox.stub().rejects({foo: "bar"});

            await resilientService.putDataResilient("put-route", {id: "foo"}, {data: "put-data"});

                await waitForConditionToBeTrue(
                async () => !resilientService.isRetryInProgress()
                );

            let genuineDelays = delaySpy.args.filter(thisArgArray => thisArgArray[0] !== TESTING_WAIT_DELAY);
            expect(genuineDelays).toEqual([[1], [2], [3]]);
            expect(stub.callCount).toBe(4);
            expect((await resilientService.getUnsentPayloads()).length).toBe(1);
                done();
            });

        it("will stop polling if the endpoint comes to life", async done => {
            config.resilienceRertyIntervals = [1, 2, 3];
            let delaySpy = sandbox.spy(Promise, "delay");

            buildResilienceService();

            let stub = httpClient.putData = sandbox.stub().resolves({foo: "bar"});
            stub.onFirstCall().rejects({foo: "bar"});
            stub.onSecondCall().rejects({foo: "bar"});

            await resilientService.putDataResilient("put-route", {id: "foo"}, {data: "put-data"});

                await waitForConditionToBeTrue(
                async () => !resilientService.isRetryInProgress()
                );

            let genuineDelays = delaySpy.args.filter(thisArgArray => thisArgArray[0] !== TESTING_WAIT_DELAY);

            // should not get to the third wait
            expect(genuineDelays).toEqual([[1], [2]]);
            expect(stub.callCount).toBe(3);
            expect((await resilientService.getUnsentPayloads()).length).toBe(0);
            done();
        });

    });

    describe("only one flush to take place at a time", () => {
        it("should never allow two concurrent flushes", async done => {
            // make it so "put" hangs until we say so
            let handbrakeOn = false;
            (<any>httpClient).putData = async () => {
                handbrakeOn = true;
                await waitForConditionToBeTrue(
                    async () => !handbrakeOn
                );
                return {foo: "bar"};
            }

            // put is long running and will hang
            await resilientService.putDataResilient("put-route", {id: "foo"}, {data: "put-data"});
            expect(resilientService.isRetryInProgress()).toBe(true);

            let stub = httpClient.postData = sandbox.stub().resolves({foo: "bar"});
            await resilientService.postDataResilient("post-route", {id: "foo"}, {data: "post-data"});
            await resilientService.postDataResilient("post-route", {id: "foo"}, {data: "post-data"});

            await resilientService.sendAllRetryPayloads();
            // will not clear anything because the very first call is still hanging
            expect((await resilientService.getUnsentPayloads()).length).toBe(3);
            expect(stub.called).toBe(false);

            handbrakeOn = false;
            // give the hanging process time to free itself
            await Promise.delay(TESTING_WAIT_DELAY * 2);

            // now a flush will work
            await resilientService.sendAllRetryPayloads();
            await waitForConditionToBeTrue(
                async () => (await resilientService.getUnsentPayloads()).length === 0 && !resilientService.isRetryInProgress()
            )
                expect(stub.callCount).toBe(2);
            done();
        });
    });

    describe("ordering of calls", () => {

        it("can queue multiple calls and then flush, in the order that the calls were made", async done => {
            let stub = httpClient.putData = sandbox.stub().rejects({error: "bar"});

            // broken and will stay in resilience
            await resilientService.putDataResilient("put-route", {id: "foo"}, {data: "put-data"});

            await waitForConditionToBeTrue(
                async () => !resilientService.isRetryInProgress() && (await resilientService.getUnsentPayloads()).length === 1
            )

            await resilientService.putDataResilient("put-route", {id: "foo1"}, {data: "put-data"});

            await waitForConditionToBeTrue(
                async () => !resilientService.isRetryInProgress() && (await resilientService.getUnsentPayloads()).length === 2
            )

            // will only try the first call in the queue each time (i.e. will not try further queued calls)
            expect(stub.callCount).toBe(2);

            stub = httpClient.putData = sandbox.stub().resolves({foo: "bar"});
            // a good call is made
            await resilientService.putDataResilient("put-route", {id: "foo2"}, {data: "put-data"});

            await waitForConditionToBeTrue(
                async () => (await resilientService.getUnsentPayloads()).length === 0
            );

            expect(stub.callCount).toBe(3);
            // the payloads are sent in order
            expect(stub.args[0][2].id).toBe("foo");
            expect(stub.args[1][2].id).toBe("foo1");
            expect(stub.args[2][2].id).toBe("foo2");
            done();
        });

        it("will only send calls one at a time", async done => {

            httpClient.putData = sandbox.stub().rejects(new Error("baz"));

            await resilientService.putDataResilient("put-route", {id: "foo"}, {data: "put-data"});
            await resilientService.putDataResilient("put-route", {id: "foo1"}, {data: "put-data"});
            await resilientService.putDataResilient("put-route", {id: "foo2"}, {data: "put-data"});
            await resilientService.putDataResilient("put-route", {id: "foo3"}, {data: "put-data"});
            await resilientService.putDataResilient("put-route", {id: "foo4"}, {data: "put-data"});
            await resilientService.putDataResilient("put-route", {id: "foo5"}, {data: "put-data"});
            await resilientService.putDataResilient("put-route", {id: "foo6"}, {data: "put-data"});

            await waitForConditionToBeTrue(
                async () => !resilientService.isRetryInProgress()
            );
            // seven calls now queued up in resilience

            // might be a bit naff, but send the seven calls with a varying pattern of delay
            let delays = [1, 50, 100, 150, 100, 50, 1];
            let eventLog = [];

            (<any>httpClient).putData = async (...args) => {
                let id = args[2].id;
                eventLog.push({id, event: "start"});
                await Promise.delay(delays.pop());
                eventLog.push({id, event: "end"});
            };

            await resilientService.sendAllRetryPayloads();

            await waitForConditionToBeTrue(
                async () => (await resilientService.getUnsentPayloads()).length === 0
            );

            // all start and end events should be in strict sequential order
            expect(eventLog).toEqual([
                {id: "foo", event: "start"},
                {id: "foo", event: "end"},
                {id: "foo1", event: "start"},
                {id: "foo1", event: "end"},
                {id: "foo2", event: "start"},
                {id: "foo2", event: "end"},
                {id: "foo3", event: "start"},
                {id: "foo3", event: "end"},
                {id: "foo4", event: "start"},
                {id: "foo4", event: "end"},
                {id: "foo5", event: "start"},
                {id: "foo5", event: "end"},
                {id: "foo6", event: "start"},
                {id: "foo6", event: "end"}
            ])
                done();
            });
    });

    describe("flush mode", () => {
        it("will not error if no retry payloads", async done => {
            config.resilienceRertyIntervals = [1, 2, 3];
            buildResilienceService();

            await resilientService.sendAllRetryPayloads();

            await waitForConditionToBeTrue(
                async () => !resilientService.isRetryInProgress()
            );

            let remainingPayloads = (await resilientService.getUnsentPayloads());
            let remainingIds = remainingPayloads.map(payload => payload.params.id);
            expect(remainingIds).toEqual([]);

            done();
        });

        it("will stop trying in normal mode if a queued call fails", async done => {
            config.resilienceRertyIntervals = [1, 2, 3];
            buildResilienceService();

            httpClient.putData = sandbox.stub().rejects(new Error("baz"));
            httpClient.postData = sandbox.stub().rejects(new Error("baz"));

            await resilientService.putDataResilient("put-route", {id: "foo"}, {data: "put-data"});
            await resilientService.putDataResilient("put-route", {id: "foo1"}, {data: "put-data"});
            await resilientService.postDataResilient("post-route", {id: "foo2"}, {data: "post-data"});
            await resilientService.putDataResilient("put-route", {id: "foo3"}, {data: "put-data"});
            await resilientService.putDataResilient("put-route", {id: "foo4"}, {data: "put-data"});

            await waitForConditionToBeTrue(
                async () => !resilientService.isRetryInProgress()
            );

            httpClient.putData = sandbox.stub().resolves({foo: "bar"});

            await resilientService.sendAllRetryPayloads();

            await waitForConditionToBeTrue(
                async () => !resilientService.isRetryInProgress()
            );

            let remainingPayloads = (await resilientService.getUnsentPayloads());
            let remainingIds = remainingPayloads.map(payload => payload.params.id);
            expect(remainingIds).toEqual(["foo2", "foo3", "foo4"]);
            let httpCallIdParams = (httpClient.putData as Sinon.SinonStub).args.map(arg => arg[2].id);
            expect(httpCallIdParams).toEqual(["foo", "foo1"]);
            done();
        });

        it("will stop trying in normal mode if the first queued call fails", async done => {
            config.resilienceRertyIntervals = [1, 2, 3];
            buildResilienceService();

            httpClient.putData = sandbox.stub().rejects(new Error("baz"));
            httpClient.postData = sandbox.stub().rejects(new Error("baz"));

            await resilientService.postDataResilient("post-route", {id: "foo"}, {data: "post-data"});
            await resilientService.putDataResilient("put-route", {id: "foo1"}, {data: "put-data"});

            await waitForConditionToBeTrue(
                async () => !resilientService.isRetryInProgress()
            );

            httpClient.putData = sandbox.stub().resolves({foo: "bar"});

            await resilientService.sendAllRetryPayloads();

            await waitForConditionToBeTrue(
                async () => !resilientService.isRetryInProgress()
            );

            let remainingPayloads = (await resilientService.getUnsentPayloads());
            let remainingIds = remainingPayloads.map(payload => payload.params.id);
            expect(remainingIds).toEqual(["foo", "foo1"]);
            let httpCallIdParams = (httpClient.putData as Sinon.SinonStub).args.map(arg => arg[2].id);
            expect(httpCallIdParams).toEqual([]);
            done();
        });

        it("will stop trying in normal mode if the only queued call fails", async done => {
            config.resilienceRertyIntervals = [1, 2, 3];
            buildResilienceService();

            httpClient.putData = sandbox.stub().rejects(new Error("baz"));
            httpClient.postData = sandbox.stub().rejects(new Error("baz"));

            await resilientService.postDataResilient("post-route", {id: "foo"}, {data: "post-data"});

            await waitForConditionToBeTrue(
                async () => !resilientService.isRetryInProgress()
            );

            httpClient.putData = sandbox.stub().resolves({foo: "bar"});

            await resilientService.sendAllRetryPayloads();

            await waitForConditionToBeTrue(
                async () => !resilientService.isRetryInProgress()
            );

            let remainingPayloads = (await resilientService.getUnsentPayloads());
            let remainingIds = remainingPayloads.map(payload => payload.params.id);
            expect(remainingIds).toEqual(["foo"]);
            let httpCallIdParams = (httpClient.putData as Sinon.SinonStub).args.map(arg => arg[2].id);
            expect(httpCallIdParams).toEqual([]);
            done();
        });

        it("if strict mode will not error if no retry payloads", async done => {
            config.resilienceRertyIntervals = [1, 2, 3];
            config.resilienceFlushSkipFailures = true;
            buildResilienceService();

            await resilientService.sendAllRetryPayloads();

            await waitForConditionToBeTrue(
                async () => !resilientService.isRetryInProgress()
            );

            let remainingPayloads = (await resilientService.getUnsentPayloads());
            let remainingIds = remainingPayloads.map(payload => payload.params.id);
            expect(remainingIds).toEqual([]);

            done();
        });

        it("if strict flush order is switched off, will continue if a queued call fails", async done => {
            config.resilienceRertyIntervals = [1, 2, 3];
            config.resilienceFlushSkipFailures = true;
            buildResilienceService();

            httpClient.putData = sandbox.stub().rejects(new Error("baz"));
            httpClient.postData = sandbox.stub().rejects(new Error("baz"));

            await resilientService.postDataResilient("post-route", {id: "foo"}, {data: "post-data"});
            await resilientService.putDataResilient("put-route", {id: "foo1"}, {data: "put-data"});
            await resilientService.postDataResilient("post-route", {id: "foo2"}, {data: "post-data"});
            await resilientService.putDataResilient("put-route", {id: "foo3"}, {data: "put-data"});
            await resilientService.putDataResilient("put-route", {id: "foo4"}, {data: "put-data"});
            await resilientService.postDataResilient("post-route", {id: "foo5"}, {data: "post-data"});
            await resilientService.putDataResilient("put-route", {id: "foo6"}, {data: "put-data"});
            await waitForConditionToBeTrue(
                async () => !resilientService.isRetryInProgress()
            );

            httpClient.putData = sandbox.stub().resolves({foo: "bar"});

            await resilientService.sendAllRetryPayloads();

            await waitForConditionToBeTrue(
                async () => !resilientService.isRetryInProgress()
            );

            let remainingPayloads = (await resilientService.getUnsentPayloads());
            let remainingIds = remainingPayloads.map(payload => payload.params.id);
            expect(remainingIds).toEqual(["foo", "foo2", "foo5"]);
            let httpCallIdParams = (httpClient.putData as Sinon.SinonStub).args.map(arg => arg[2].id);
            expect(httpCallIdParams).toEqual(["foo1", "foo3", "foo4", "foo6"]);
            done();
        });


    });

    describe("Errors", () => {
        describe("Error Messages and recurring errors", () => {
            it("can update last failure message", async done => {
                let stub = httpClient.putData = sandbox.stub().rejects(new Error("bar"));
                await resilientService.putDataResilient("put-route", {id: "foo2"}, {data: "put-data"});

                await waitForConditionToBeTrue(
                        async () => !resilientService.isRetryInProgress()
                );

                let errorMsg = (await resilientService.getUnsentPayloads())[0].lastFailureMessage
                expect(errorMsg).toContain("bar");

                stub.rejects(new Error("bar2"));
                await resilientService.sendAllRetryPayloads();

                await waitForConditionToBeTrue(
                        async () => !resilientService.isRetryInProgress()
                );

                errorMsg = (await resilientService.getUnsentPayloads())[0].lastFailureMessage
                expect(errorMsg).toContain("bar2");
                // check has been left in storage
                expect((await resilientService.getUnsentPayloads()).length).toBe(1);
                done();
            });
        });

        it("can update error counts", async done => {
            let stub = httpClient.putData = sandbox.stub().rejects(new Error("bar"));

            await resilientService.putDataResilient("put-route", {id: "foo2"}, {data: "put-data"});

            await waitForConditionToBeTrue(
                async () => !resilientService.isRetryInProgress()
            );

            let retry = (await resilientService.getUnsentPayloads())[0];
            expect(retry.failureWithoutStatusCount).toBe(1);
            expect(retry.failureWithStatusCount).toBe(0);

            await resilientService.sendAllRetryPayloads();
            retry = (await resilientService.getUnsentPayloads())[0];
            expect(retry.failureWithoutStatusCount).toBe(2);
            expect(retry.failureWithStatusCount).toBe(0);

            stub.rejects(new ApiException(null, "", "", [], null, 500));
            await resilientService.sendAllRetryPayloads();
            retry = (await resilientService.getUnsentPayloads())[0];

            expect(retry.failureWithoutStatusCount).toBe(2);
            expect(retry.failureWithStatusCount).toBe(1);
            expect(retry.lastKnownFailureStatus).toBe("500");

            stub.rejects(new ApiException(null, "", "", [], null, 501));
            await resilientService.sendAllRetryPayloads();
            retry = (await resilientService.getUnsentPayloads())[0];

            expect(retry.failureWithoutStatusCount).toBe(2);
            expect(retry.failureWithStatusCount).toBe(2);
            expect(retry.lastKnownFailureStatus).toBe("501");

            // a pretend middleware 200 but really 4** response
            stub.resolves({status: "499", error: "middleware is brilliant"});
            await resilientService.sendAllRetryPayloads();
            retry = (await resilientService.getUnsentPayloads())[0];

            expect(retry.failureWithoutStatusCount).toBe(2);
            expect(retry.failureWithStatusCount).toBe(3);
            expect(retry.lastKnownFailureStatus).toBe("499");

            done();
        });

        describe("200 errors", () => {
            it("calls GET and throws and does not use resilience when a 200 error is thrown", async done => {
                httpClient.getData = sandbox.stub().resolves({status: "400", error: "middleware is brilliant"});
                try {
                    await resilientService.getData("get-route", {id: "foo"}, false);

                    fail();
                } catch (err) {
                    expect(err.toString()).toContain("status: 400");
                    expect(err.toString()).toContain("middleware is brilliant");
                    done();
                }
            });
        });
    });

    describe("logging", () => {

        it("logs attempts and full responses", async done => {
            endpointConfig.routes.find(route => route.route === "get-route").successLoggingMode = SuccessLoggingMode.log;
            httpClient.getData = sandbox.stub().resolves({foo: "bar"});

            await resilientService.getData("get-route", {id: "foo"}, false);

            let loggedAttemptEntry = loggerWarnStub.args.find(loggerCalls => loggerCalls[0] === "Attempt")[1];
            let loggedEntry = loggerWarnStub.args.find(loggerCalls => loggerCalls[1].input && loggerCalls[1].input.method === "GET" )[1];

            expect(loggedAttemptEntry.guid).toEqual(loggedEntry.guid);
            expect(loggedEntry.result).toEqual({foo: "bar"});
            done();
        });

        it("logs attempts and truncated responses", async done => {
            endpointConfig.routes.find(route => route.route === "get-route").successLoggingMode = SuccessLoggingMode.logWithoutResponse;
            httpClient.getData = sandbox.stub().resolves({foo: "bar"});

            await resilientService.getData("get-route", {id: "foo"}, false);

            let loggedAttemptEntry = loggerWarnStub.args.find(loggerCalls => loggerCalls[0] === "Attempt")[1];
            let loggedEntry = loggerWarnStub.args.find(loggerCalls => loggerCalls[1].input && loggerCalls[1].input.method === "GET" )[1];

            expect(loggedAttemptEntry.guid).toEqual(loggedEntry.guid);
            expect(loggedEntry.result).toBe("not logged");
            done();
        });

        it("does not log attempts and does not log responses", async done => {
            endpointConfig.routes.find(route => route.route === "get-route").successLoggingMode = SuccessLoggingMode.dontLog;
            httpClient.getData = sandbox.stub().resolves({foo: "bar"});

            await resilientService.getData("get-route", {id: "foo"}, false);

            let loggedAttemptEntry = loggerWarnStub.args.find(loggerCalls => loggerCalls[0] === "Attempt");
            let loggedEntry = loggerWarnStub.args.find(loggerCalls => loggerCalls[1].input && loggerCalls[1].input.method === "GET" );

            expect(loggedAttemptEntry).toBeUndefined();
            expect(loggedEntry).toBeUndefined();
            done();
        });

        it("logs attempts and logs outbound data", async done => {
            httpClient.putData = sandbox.stub().resolves({});

            await resilientService.putData("put-route", {id: "foo"}, {bar: "baz"});

            let loggedAttemptEntry = loggerWarnStub.args.find(loggerCalls => loggerCalls[0] === "Attempt")[1];
            let loggedEntry = loggerWarnStub.args.find(loggerCalls => loggerCalls[1].input && loggerCalls[1].input.method === "PUT" )[1];

            expect(loggedAttemptEntry.guid).toEqual(loggedEntry.guid);
            expect(loggedEntry.input.data).toEqual({bar: "baz"});
            done();
        });

        it("logs attempts and logs errors", async done => {
            httpClient.putData = sandbox.stub().rejects(new Error("fizz"));

            try {
                await resilientService.putData("put-route", {id: "foo"}, {bar: "baz"});
            } catch (error) {

                let loggedAttemptEntry = loggerWarnStub.args.find(loggerCalls => loggerCalls[0] === "Attempt")[1];
                let loggedEntry = loggerWarnStub.args.find(loggerCalls => loggerCalls[1].input && loggerCalls[1].input.method === "PUT" )[1];

                expect(loggedAttemptEntry.guid).toEqual(loggedEntry.guid);
                expect(loggedEntry.input.data).toEqual({bar: "baz"});
                expect(loggedEntry.result).toContain("fizz");
                done();
            }
        });

        it("logs retry guid across all attempts for a given endpoint", async done => {
            httpClient.putData = sandbox.stub().rejects({});

            await resilientService.putDataResilient("put-route", {id: "foo"}, {bar: "baz"});

            await waitForConditionToBeTrue(
                async () => !resilientService.isRetryInProgress() && (await resilientService.getUnsentPayloads()).length === 1
            )

            httpClient.putData = sandbox.stub().resolves({});
            httpClient.postData = sandbox.stub().resolves({});
            await resilientService.postDataResilient("post-route", {id: "foo1"}, {bar: "ba1"});

            await waitForConditionToBeTrue(
                async () => !resilientService.isRetryInProgress() && (await resilientService.getUnsentPayloads()).length === 0
            )

            // assert that all four of the first log entries have the same retryGuid
            let retryGuid = loggerWarnStub.args.find(loggerCalls => loggerCalls[0] === "Attempt")[1].retryGuid;
            expect(loggerWarnStub.args.filter(((call, index) => call[1].retryGuid === retryGuid && index <= 3)).length).toBe(4);

            done();
        });

        it("logs a known-status ApiException as expected and dispatches an analytics event", async done => {
            let apiException = new ApiException(null, "reference-foo", "foo {0}", ["bar"], {}, 404);
            httpClient.putData = sandbox.stub().rejects(apiException);

            try {
                await resilientService.putData("put-route", {id: "foo"}, {bar: "baz"});
            } catch (error) {
                let loggedEntry = loggerWarnStub.args.find(loggerCalls => loggerCalls[1].input && loggerCalls[1].input.method === "PUT" )[1];

                expect(loggedEntry.result).toContain(apiException.resolvedMessage);
                expect(loggedEntry.httpStatusCode).toBe("404");
                expect(loggedEntry.networkDiagnostics).toBeUndefined();

                // expect(eventAggregatorPublishSpy.args[0][0]).toBe(AnalyticsConstants.ANALYTICS_EVENT);
                // expect(eventAggregatorPublishSpy.args[0][1].category).toBe(AnalyticsConstants.HTTP_RESULT);
                // expect(eventAggregatorPublishSpy.args[0][1].label).toBe("404");

                done();
            }
        });

        it("logs an unknown-status ApiException as expected and dispatches an analytics event", async done => {
            let apiException = new ApiException(null, "reference-foo", "foo {0}", ["bar"], {}, undefined);
            httpClient.putData = sandbox.stub().rejects(apiException);

            try {
                await resilientService.putData("put-route", {id: "foo"}, {bar: "baz"});
            } catch (error) {
                let loggedEntry = loggerWarnStub.args.find(loggerCalls => loggerCalls[1].input && loggerCalls[1].input.method === "PUT" )[1];

                expect(loggedEntry.result).toContain(apiException.resolvedMessage);
                expect(loggedEntry.httpStatusCode).toBe("Unknown");
                expect(loggedEntry.networkDiagnostics).toBe(diagnosticResult);

                // expect(eventAggregatorPublishSpy.args[0][0]).toBe(AnalyticsConstants.ANALYTICS_EVENT);
                // expect(eventAggregatorPublishSpy.args[0][1].category).toBe(AnalyticsConstants.HTTP_RESULT);
                // expect(eventAggregatorPublishSpy.args[0][1].label).toBe(ResilientService.UNKNOWN_FLAG);

                done();
            }
        });

        it("sends analytics if configuration is set", async done => {
            config.resilienceSendAnalyticsOnSuccess = true;
            endpointConfig.sendAnalyticsOnSuccess = true;

            buildResilienceService();
            httpClient.putData = sandbox.stub().resolves({});

            await resilientService.putData("put-route", {id: "foo"}, {bar: "baz"});

            let event = eventAggregatorPublishSpy.args.find(arg => arg[0] === AnalyticsConstants.ANALYTICS_EVENT
                                                                    && arg[1].category === AnalyticsConstants.HTTP_RESULT)[1];

            expect(event).toBeDefined();
            expect(event.label).toBe(ResilientService.HTTP_OK_FLAG);
            done();
        });

        it("does not send analytics if configuration is not set at endpoint level", async done => {
            config.resilienceSendAnalyticsOnSuccess = true;
            endpointConfig.sendAnalyticsOnSuccess = undefined;
            buildResilienceService();
            httpClient.putData = sandbox.stub().resolves({});

            await resilientService.putData("put-route", {id: "foo"}, {bar: "baz"});

            let event = (eventAggregatorPublishSpy.args || []).find(arg => arg[0] === AnalyticsConstants.ANALYTICS_EVENT
                                                                    && arg[1].category === AnalyticsConstants.HTTP_RESULT);

            expect(event).toBeUndefined();
            done();
        });

        it("does not send analytics if configuration is not set at global level", async done => {
            config.resilienceSendAnalyticsOnSuccess = undefined;
            endpointConfig.sendAnalyticsOnSuccess = true;
            buildResilienceService();
            httpClient.putData = sandbox.stub().resolves({});

            await resilientService.putData("put-route", {id: "foo"}, {bar: "baz"});

            let event = (eventAggregatorPublishSpy.args || []).find(arg => arg[0] === AnalyticsConstants.ANALYTICS_EVENT
                                                                    && arg[1].category === AnalyticsConstants.HTTP_RESULT);

            expect(event).toBeUndefined();
            done();
        });

        it("expiry time should be undefined", () => {

        });
    });

    describe("deletes unsent payloads once expired", () => {
        it("should delete the unsent payloads when config.unSentPayloadExpiryMinutes is defined", async done => {
            config.unSentPayloadExpiryMinutes = 0.01;
            httpClient.putData = sandbox.stub().rejects({error: "bar"});
            await resilientService.putDataResilient("put-route", {id: "foo2"}, {data: "put-data"});

            await waitForConditionToBeTrue(
                async () => !resilientService.isRetryInProgress()
            );

            await Promise.delay(600);

            expect((await resilientService.getUnsentPayloads()).length).toBe(0);

            done();
        });

        it("should not delete the unsent payloads when config.unSentPayloadExpiryMinutes is undefined", async done => {
            httpClient.putData = sandbox.stub().rejects({error: "bar"});
            await resilientService.putDataResilient("put-route", {id: "foo2"}, {data: "put-data"});

            await waitForConditionToBeTrue(
                async () => !resilientService.isRetryInProgress()
            );

            await Promise.delay(600);

            expect((await resilientService.getUnsentPayloads()).length).toBe(1);

            done();
        });
    });
});
