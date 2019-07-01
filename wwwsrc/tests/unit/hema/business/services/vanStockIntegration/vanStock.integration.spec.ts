/* import { IConfigurationService } from "../../../../../../app/common/core/services/IConfigurationService";
import { EventAggregator } from "aurelia-event-aggregator";
import { WuaNetworkDiagnostics } from "../../../../../../app/common/core/wuaNetworkDiagnostics";
import { IHttpClient } from "../../../../../../app/common/core/IHttpClient";
import { VanStockService as VanStockApiService } from "../../../../../../app/hema/api/services/vanStockService";
import { ResilientHttpClientFactory } from "../../../../../../app/common/resilience/services/resilientHttpClientFactory";
import { IAssetService } from "../../../../../../app/common/core/services/IAssetService";
import { StorageService } from "../../../../../../app/hema/business/services/storageService";
import { HemaStorage } from "../../../../../../app/hema/core/services/hemaStorage";
import { VanStockHeaderProvider } from "../../../../../../app/hema/api/services/vanStockHeaderProvider";
import { IEngineerService } from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import { IGpsService } from "../../../../../../app/common/geo/IGpsService";
import { VanStockEngine } from "../../../../../../app/hema/business/services/vanStockEngine";
import { IMaterial } from "../../../../../../app/hema/api/models/vanStock/IMaterial";
import { IMaterialActions } from "../../../../../../app/hema/api/models/vanStock/IMaterialActions";
import { IHttpHeader } from "../../../../../../app/common/core/IHttpHeader";
import { Threading } from "../../../../../../app/common/core/threading";
import { VanStockConstants } from "../../../../../../app/hema/business/services/constants/vanStockConstants";
import { IVanStockService } from "../../../../../../app/hema/business/services/interfaces/IVanStockService";
import { VanStockService } from "../../../../../../app/hema/business/services/vanStockService";
import { IVanStockPatchFactory } from "../../../../../../app/hema/business/factories/interfaces/IVanStockPatchFactory";
import * as Logging from "aurelia-logging";
import { StorageConstants } from "../../../../../../app/hema/business/constants/storageConstants";
import { IMaterialActionDispatch } from "../../../../../../app/hema/api/models/vanStock/IMaterialActions";
import { WuaNetworkDiagnosticsConstants } from "../../../../../../app/common/core/constants/wuaNetworkDiagnosticsConstants";
import { EngineerServiceConstants } from "../../../../../../app/hema/business/services/constants/engineerServiceConstants";
import { Material } from "../../../../../../app/hema/business/models/material";
import { MaterialWithQuantities } from "../../../../../../app/hema/business/models/materialWithQuantities";
import { MaterialRequest } from "../../../../../../app/hema/business/models/materialRequest";
import { MaterialCollection } from "../../../../../../app/hema/business/models/materialCollection";
import { IMaterialHighValueTool } from "../../../../../../app/hema/api/models/vanStock/IMaterialHighValueTool";
import { IMaterialReceiptRequest } from "../../../../../../app/hema/api/models/vanStock/IMaterialReceiptRequest";
import { IMaterialReturnRequest } from "../../../../../../app/hema/api/models/vanStock/IMaterialReturnRequest";
import { IMaterialZoneUpdateRequest } from "../../../../../../app/hema/api/models/vanStock/IMaterialZoneUpdateRequest";
import { IMaterialRequestRequest } from "../../../../../../app/hema/api/models/vanStock/IMaterialRequestRequest";
import { IMaterialTransferRequest } from "../../../../../../app/hema/api/models/vanStock/IMaterialTransferRequest";
import { IMaterialConsumptionRequest } from "../../../../../../app/hema/api/models/vanStock/IMaterialConsumptionRequest";

describe("van stock", () => {
    const POLLING_INTERVAL_MINS = 5;
    const ENGINEER_ID_WMIS= "0010101";
    const ENGINEER_ID = "0010101";
    const OWNER = "BGS";
    const MATERIALS_ENDPOINT = "engineer/{engineerId}/materials";
    const ACTIONS_ENDPOINT = "engineer/{engineerId}/actions";
    const RECEIPT_ENDPOINT = "material/{materialCode}/receipt";
    const RETURN_ENDPOINT = "material/{materialCode}/return";
    const ZONE_ENDPOINT = "material/{materialCode}/zone";
    const RESERVATION_ENDPOINT = "material/{materialCode}/reservation";
    const CONSUMPTION_ENDPOINT = "material/{materialCode}/consumption";
    const TRANSFER_ENDPOINT = "material/{materialCode}/transfer";
    const HIGHVALUETOOLS_ENDPOINT = "material/hvt";

    let switchOnLogToConsole = false;
    let consoleLogCache = [];
    let flushConsoleLogCache = () => {
        consoleLogCache.length && console.log(JSON.stringify(consoleLogCache));
        consoleLogCache = [];
    };
    flushConsoleLogCache(); // stop linting from moaning about unused fn

    const material1 = <IMaterial>{
        materialCode: "1000000",
        description: "Material 1",
        quantity: 1,
        storageZone: "zone1",
        jobId: null
    };

    const material2 = <IMaterial>{
        materialCode: "2000000",
        description: "Material 2",
        quantity: 2,
        storageZone: "zone2",
        jobId: null
    };

    const dispatch1 = <IMaterialActionDispatch>{
        id: 10,
        materialCode: "3000000",
        description: "Material 3",
        quantity: 3,
        jobId: undefined,
        owner: OWNER
    };

    const dispatch2 = <IMaterialActionDispatch>{
        id: 11,
        materialCode: "4000000",
        description: "Material 4",
        quantity: 4,
        jobId: undefined,
        owner: OWNER
    };

    const highValueTool1 = <IMaterialHighValueTool> {
        materialCode: "1",
        materialDescription: "hvt1"
    };

    const highValueTool2 = <IMaterialHighValueTool> {
        materialCode: "2",
        materialDescription: "hvt2"
    };

    let sandbox: Sinon.SinonSandbox;
    let clock: Sinon.SinonFakeTimers;
    let realThreading: any;
    let realLoggingGetLogger: any;
    let vanStockApiService: VanStockApiService;
    let vanStockEngine: VanStockEngine;
    let vanStockService: IVanStockService;
    let getMaterials = async () => await vanStockService.searchLocalVanStock(99999);

    let responses: {
        materialsResponse: {
            throws: boolean,
            data: IMaterial[]
        },
        actionsResponse: {
            throws: boolean,
            data: IMaterialActions
        },
        highValueToolsResponse: {
            throws: boolean,
            data: IMaterialHighValueTool[]
        }
    } = {
        materialsResponse: {
            throws: false,
            data: []
        },
        actionsResponse: {
            throws: false,
            data: <IMaterialActions>{}
        },
        highValueToolsResponse: {
            throws: false,
            data: []
        }
    };

    let httpClient = <IHttpClient>{};

    httpClient.putData = <T, V>(baseEndpoint: string, endpoint: string, params: { [id: string]: any }, data: T,  headers?: IHttpHeader[]): Promise<V> => {
        httpCallLog.push({type:"PUT", args: {endpoint, params, data, headers}});
        // console.warn("putting", params, data);
        return Promise.resolve(<V>{});
    };

    httpClient.postData = <T, V>(baseEndpoint: string, endpoint: string, params: { [id: string]: any }, data: T,  headers?: IHttpHeader[]): Promise<V> => {
        httpCallLog.push({type:"POST", args: {endpoint, params, data, headers}});
        // console.warn("putting", params, data);
        return Promise.resolve(<V>{});
    };

    httpClient.getData = <T>(baseEndpoint: string, endpoint: string, params: { [id: string]: any }, breakCache?: boolean, headers?: IHttpHeader[]): Promise<T> => {

        let response: any;
        switch (endpoint) {
            case MATERIALS_ENDPOINT:
                response = responses.materialsResponse;
                break;
            case ACTIONS_ENDPOINT:
                response = responses.actionsResponse;
                break;
            case HIGHVALUETOOLS_ENDPOINT:
                response = responses.highValueToolsResponse;
                break;
        }

        httpCallLog.push({type:"GET", args: {endpoint, params: params || {} , response, breakCache, headers}});

        return response.throws
            ? Promise.reject("HTTP Error")
            : Promise.resolve(response.data);
    };

    let httpCallLog: {type: string, args: any}[] = [];

    let assertHttpCallPattern = (...endpoints: string[]) => {
        expect(httpCallLog.map(call => call.args.endpoint)).toEqual(endpoints);
    };

    let assertHttpCallHasBeenMade = <T>(args: {
            type: string,
            endpoint: string,
            materialCode?: string,
            engineerId?: string,
            data?: Partial<T>
        }, expectedMinCallNumber: number = 1) => {


        let areDataObjectsEqual = (dataA: Partial<T>, dataB: Partial<T>) => {
            // we are checking that all fields in A are also in B, but it doesn't matter if
            //  there are other fields in B that are not in A
            if (!dataA && !dataB) {
                return true;
            }

            const areAllTopLevelFieldsEqual = Object.keys(dataA)
                .filter(key => key !== "material")
                .every(key => dataA[key] === dataB[key]);

            if(!areAllTopLevelFieldsEqual) {
                return false;
            }

            return areDataObjectsEqual(dataA["material"], dataB["material"]);
        }

        let callHasBeenMade = httpCallLog.filter(call => call.type === args.type
                                                && call.args.endpoint === args.endpoint
                                                && call.args.params.materialCode === args.materialCode
                                                && call.args.params.engineerId === args.engineerId
                                                && areDataObjectsEqual(args.data, call.args.data)
                                            ).length === expectedMinCallNumber;

          // to give a meaningful failure report
        let report = `${args.endpoint}:${args.materialCode}:${args.engineerId}${JSON.stringify(args.data)}`
        expect(report).toBe(callHasBeenMade ? report : `found but it wasnt, or expected ${expectedMinCallNumber} instance(s) were not found`);
    }

    let updatedVanstockUpdatedEventCount = 0;
    let readUpdatedCallCount = (reset?: boolean) => {
        const count = updatedVanstockUpdatedEventCount;
        if (reset) {
            updatedVanstockUpdatedEventCount = 0;
        }
        return count;
    }

    let pollingSyncServerDelegate: () => Promise<void>;
    let startTimerSpy: Sinon.SinonSpy;
    let eventAggregator: EventAggregator;

    let awaitTilTrue = async (delegate: () => boolean | Promise<boolean>) => {
        while (!(await delegate())) {
            await Promise.delay(50);
        }
    }

    beforeAll(() => {
        realThreading = Threading;
        (<any>Threading) = {
            startTimer: (delegate: () => Promise<void>, delay: number) => {
                pollingSyncServerDelegate = delegate;
            }
        };

        startTimerSpy = sinon.spy(Threading, "startTimer");
    });

    afterAll(() => {
        (<any>Threading) = realThreading;
    });

    beforeEach(() => {
        responses.materialsResponse = {
            throws: false,
            data: []
        };
        responses.actionsResponse = {
            throws: false,
            data: <IMaterialActions>{}
        };
        responses.highValueToolsResponse = {
            throws: false,
            data: []
        };

        sandbox = sinon.sandbox.create();
        realLoggingGetLogger = Logging.getLogger;
        let consoleLog = (...args: any[]) => switchOnLogToConsole && consoleLogCache.push(args);
        (<any>Logging)["getLogger"] = (className: string) => ({
            debug:  (...args: any[]) => consoleLog(className, "debug", args),
            info:   (...args: any[]) => consoleLog(className, "info", args),
            warn:   (...args: any[]) => consoleLog(className, "warn", args),
            error:  (...args: any[]) => consoleLog(className, "error", args),
        });

        let clientFactoryStub = <ResilientHttpClientFactory> {
            getHttpClient: () => httpClient
        }

        let configServiceStub = <IConfigurationService>{};
        configServiceStub.getConfiguration = sandbox.stub().returns({
            assetTrackingSearchStaleMinutes: 17,
            assetTrackingPollingIntervalMinutes: POLLING_INTERVAL_MINS,
            assetTrackingCacheRefreshTimeHHmm: "01:00",
            clients: [
                {
                    name: "prod",
                    type: "http",
                    root: "https://endpoint"
                }
            ],
            routes:  [
                {
                    "route": "materials",
                    "path": MATERIALS_ENDPOINT,
                    "client": "prod"
                },
                {
                    "route": "actions",
                    "path": ACTIONS_ENDPOINT,
                    "client": "prod"
                },
                {
                    "route": "search",
                    "path": "material/{materialCode}",
                    "client": "prod"
                },
                {
                    "route": "zone",
                    "path": ZONE_ENDPOINT,
                    "client": "prod",
                    criticalExpiryMinutes: 720
                },
                {
                    "route": "receipt",
                    "path": RECEIPT_ENDPOINT,
                    "client": "prod",
                    criticalExpiryMinutes: 720
                },
                {
                    "route": "return",
                    "path": RETURN_ENDPOINT,
                    "client": "prod",
                    criticalExpiryMinutes: 720
                },
                {
                    "route": "reservation",
                    "path": RESERVATION_ENDPOINT,
                    "client": "prod",
                    criticalExpiryMinutes: 720
                },
                {
                    "route": "transfer",
                    "path": TRANSFER_ENDPOINT,
                    "client": "prod",
                    criticalExpiryMinutes: 720
                },
                {
                    "route": "consumption",
                    "path": CONSUMPTION_ENDPOINT,
                    "client": "prod",
                    criticalExpiryMinutes: 720
                },
                {
                    "route": "highvaluetools",
                    "path": HIGHVALUETOOLS_ENDPOINT,
                    "client": "prod"
                }
            ]
        });

        let engineerServiceStub  = <IEngineerService>{};
        let gpsServiceStub = <IGpsService>{};
        let wuaNetworkDiagnosticsStub =<WuaNetworkDiagnostics>{};

        // real stuff!
        let hemaStorage = new HemaStorage();
        let storageService = new StorageService(hemaStorage, hemaStorage);
        let vanStockHeaderProvider = new VanStockHeaderProvider(gpsServiceStub, engineerServiceStub);
        eventAggregator = new EventAggregator();

        vanStockApiService = new VanStockApiService(
            <IAssetService>{},
            configServiceStub,
            storageService,
            eventAggregator,
            vanStockHeaderProvider,
            clientFactoryStub,
            wuaNetworkDiagnosticsStub
        );

        vanStockEngine = new VanStockEngine(
            vanStockApiService,
            storageService,
            eventAggregator,
            configServiceStub
        );

        vanStockService = new VanStockService(
            vanStockApiService,
            <IVanStockPatchFactory>{},
            vanStockEngine
        )

        eventAggregator.subscribe(VanStockConstants.VANSTOCK_UPDATED, ()=> {
            updatedVanstockUpdatedEventCount += 1;
        });
    });

    afterEach(() => {
        sandbox.restore();
        for (let key in window.localStorage) {
            if (key.indexOf(StorageConstants.HEMA_STORAGE_CONTAINER) === 0) {
                window.localStorage.removeItem(key);
            }
        }
        (<any>Logging)["getLogger"] = realLoggingGetLogger;
        httpCallLog = [];
        updatedVanstockUpdatedEventCount = 0;
    });

    describe("initialisation unit tests", () => {

        it("can initialise and set up polling", async done => {

            await vanStockEngine.initialise(ENGINEER_ID_WMIS);

            // polling has been setup
            expect(typeof startTimerSpy.args[0][0] === "function").toBe(true);
            expect(startTimerSpy.args[0][1]).toBe(POLLING_INTERVAL_MINS * 60 * 1000);
            done();
        });

        it("can initialise and hit high value tools, materials and actions end points", async done => {

            responses.materialsResponse.data = [material1, material2];
            responses.actionsResponse.data.dispatchedMaterials = [dispatch1];
            responses.highValueToolsResponse.data = [highValueTool1, highValueTool2];

            await vanStockEngine.initialise(ENGINEER_ID_WMIS);

            assertHttpCallPattern(HIGHVALUETOOLS_ENDPOINT, MATERIALS_ENDPOINT, ACTIONS_ENDPOINT);

            expect((await getMaterials()).length).toBe(2);
            expect((await vanStockService.getPartsToCollect()).toCollect.length).toBe(1);
            expect((await vanStockService.getHighValueToolList(99999)).length).toBe(2);
            done();
        });

        it("can set the readiness flag", async done => {
            let readinessFlag = vanStockService.getBindableVanStockStatusFlag();
            expect(readinessFlag.isReady).toBe(false);
            await vanStockEngine.initialise(ENGINEER_ID_WMIS);
            expect(readinessFlag.isReady).toBe(true);
            done();
        });

        it("can withstand actions failing", async done => {

            responses.materialsResponse.data = [material1, material2];
            responses.actionsResponse.throws = true;
            let readinessFlag = vanStockService.getBindableVanStockStatusFlag();

            await vanStockEngine.initialise(ENGINEER_ID_WMIS);

            expect((await getMaterials()).length).toBe(2);
            expect((await vanStockService.getPartsToCollect()).toCollect.length).toBe(0);
            expect(readinessFlag.isReady).toBe(true);
            done();
        });

        it("can withstand high value tools failing", async done => {

            responses.materialsResponse.data = [material1, material2];
            responses.highValueToolsResponse.throws = true;
            responses.actionsResponse.data.dispatchedMaterials = [dispatch1];
            let readinessFlag = vanStockService.getBindableVanStockStatusFlag();

            await vanStockEngine.initialise(ENGINEER_ID_WMIS);

            expect((await getMaterials()).length).toBe(2);
            expect((await vanStockService.getPartsToCollect()).toCollect.length).toBe(1);
            expect((await vanStockService.getHighValueToolList(99999)).length).toBe(0);
            expect(readinessFlag.isReady).toBe(true);
            done();
        });

        it("will not call actions if materials fails and will indicate data is stale, and populate when the network is back", async done => {
            responses.materialsResponse.throws = true;
            let readinessFlag = vanStockService.getBindableVanStockStatusFlag();
            await vanStockEngine.initialise(ENGINEER_ID_WMIS);

            assertHttpCallPattern(HIGHVALUETOOLS_ENDPOINT, MATERIALS_ENDPOINT);
            expect(readinessFlag.isReady).toBe(false);
            expect(readUpdatedCallCount()).toBe(0);
            assertHttpCallPattern(HIGHVALUETOOLS_ENDPOINT, MATERIALS_ENDPOINT);

            responses.materialsResponse.data = [material1, material2];
            responses.materialsResponse.throws = false;

            eventAggregator.publish(WuaNetworkDiagnosticsConstants.NETWORK_STATUS_CHANGED, false); // false should not trigger logic
            await Promise.delay(100); // yuck

            expect(readinessFlag.isReady).toBe(false);
            expect(readUpdatedCallCount()).toBe(0);
            assertHttpCallPattern(HIGHVALUETOOLS_ENDPOINT, MATERIALS_ENDPOINT);

            eventAggregator.publish(WuaNetworkDiagnosticsConstants.NETWORK_STATUS_CHANGED, true); // should trigger logic
            await awaitTilTrue(() => readUpdatedCallCount() > 0);

            expect((await getMaterials()).length).toBe(2);
            expect(readinessFlag.isReady).toBe(true);
            expect(readUpdatedCallCount()).toBe(1);
            assertHttpCallPattern(HIGHVALUETOOLS_ENDPOINT, MATERIALS_ENDPOINT, MATERIALS_ENDPOINT, ACTIONS_ENDPOINT);

            eventAggregator.publish(WuaNetworkDiagnosticsConstants.NETWORK_STATUS_CHANGED, true); // false should not trigger logic as already done
            await Promise.delay(100); // yuck

            expect(readUpdatedCallCount()).toBe(1);
            assertHttpCallPattern(HIGHVALUETOOLS_ENDPOINT, MATERIALS_ENDPOINT, MATERIALS_ENDPOINT, ACTIONS_ENDPOINT);
            done();
        });

        it("will not call actions if materials fails and will indicate data is stale, and populate when next polling", async done => {
            responses.materialsResponse.throws = true;
            let readinessFlag = vanStockService.getBindableVanStockStatusFlag();
            await vanStockEngine.initialise(ENGINEER_ID_WMIS);

            responses.materialsResponse.data = [material1, material2];
            responses.materialsResponse.throws = false;

            await pollingSyncServerDelegate();

            await awaitTilTrue(() => readUpdatedCallCount() > 0);
            expect((await getMaterials()).length).toBe(2);
            expect(readinessFlag.isReady).toBe(true);
            expect(readUpdatedCallCount()).toBe(1);
            assertHttpCallPattern(HIGHVALUETOOLS_ENDPOINT, MATERIALS_ENDPOINT, MATERIALS_ENDPOINT, ACTIONS_ENDPOINT);

            await pollingSyncServerDelegate();
            expect(readUpdatedCallCount()).toBe(1);
            assertHttpCallPattern(HIGHVALUETOOLS_ENDPOINT, MATERIALS_ENDPOINT, MATERIALS_ENDPOINT, ACTIONS_ENDPOINT, ACTIONS_ENDPOINT);

            await pollingSyncServerDelegate();
            expect(readUpdatedCallCount()).toBe(1);
            assertHttpCallPattern(HIGHVALUETOOLS_ENDPOINT, MATERIALS_ENDPOINT, MATERIALS_ENDPOINT, ACTIONS_ENDPOINT, ACTIONS_ENDPOINT, ACTIONS_ENDPOINT);
            done();
        });

        it("will load from storage when restarting", async done => {
            responses.materialsResponse.data = [material1, material2];
            responses.actionsResponse.data.dispatchedMaterials = [dispatch1];
            await vanStockEngine.initialise(ENGINEER_ID_WMIS);

            assertHttpCallPattern(HIGHVALUETOOLS_ENDPOINT, MATERIALS_ENDPOINT, ACTIONS_ENDPOINT);

            await vanStockEngine.initialise(ENGINEER_ID_WMIS);

            assertHttpCallPattern(HIGHVALUETOOLS_ENDPOINT, MATERIALS_ENDPOINT, ACTIONS_ENDPOINT, ACTIONS_ENDPOINT);
            expect((await getMaterials()).map(m => m.stockReferenceId)).toEqual(["1000000", "2000000"]);
            done();
        });
    });

    describe("in-day expiry", () => {
        beforeEach(() => {
            clock = sinon.useFakeTimers();
            clock.setSystemTime(new Date("2000-01-01T00:58:00.001").getTime())
        });

        afterEach(() => {
            clock.restore();
        });

        it("can clear material and adjustments caches when the time is right!", async done => {
            responses.materialsResponse.data = [material1];
            responses.actionsResponse.data.dispatchedMaterials = [dispatch1];
            responses.highValueToolsResponse.data = [highValueTool1];

            await vanStockEngine.initialise(ENGINEER_ID_WMIS);

            assertHttpCallPattern(HIGHVALUETOOLS_ENDPOINT, MATERIALS_ENDPOINT, ACTIONS_ENDPOINT);
            expect((await getMaterials()).map(m => m.stockReferenceId)).toEqual(["1000000"]);
            expect((await vanStockService.getPartsToCollect()).toCollect.map(p => p.stockReferenceId)).toEqual(["3000000"]);
            expect((await vanStockService.getHighValueToolList(99999)).map(h => h.materialCode)).toEqual(["1"]);

            clock.setSystemTime(new Date("2000-01-01T00:59").getTime())
            await pollingSyncServerDelegate();

            assertHttpCallPattern(HIGHVALUETOOLS_ENDPOINT, MATERIALS_ENDPOINT, ACTIONS_ENDPOINT, ACTIONS_ENDPOINT);

            clock.setSystemTime(new Date("2000-01-01T01:01").getTime());
            responses.materialsResponse.data = [material2];
            responses.actionsResponse.data.dispatchedMaterials = [dispatch2];
            responses.highValueToolsResponse.data = [highValueTool2];
            await pollingSyncServerDelegate();

            assertHttpCallPattern(HIGHVALUETOOLS_ENDPOINT, MATERIALS_ENDPOINT, ACTIONS_ENDPOINT, ACTIONS_ENDPOINT, HIGHVALUETOOLS_ENDPOINT, MATERIALS_ENDPOINT, ACTIONS_ENDPOINT);
            expect((await getMaterials()).map(m => m.stockReferenceId)).toEqual(["2000000"]);
            expect((await vanStockService.getPartsToCollect()).toCollect.map(p => p.stockReferenceId)).toEqual(["4000000"]);
            expect((await vanStockService.getHighValueToolList(99999)).map(h => h.materialCode)).toEqual(["2"]);

            done();
        });

        it("can retain yesterdays parts returned", async done => {
            responses.materialsResponse.data = [material1];

            await vanStockEngine.initialise(ENGINEER_ID_WMIS);

            expect((await getMaterials()).map(m => m.stockReferenceId)).toEqual(["1000000"]);

            expect((await vanStockEngine.getReturns()).length).toBe(0);
            await vanStockEngine.registerMaterialReturn({stockReferenceId: "1000000", quantityReturned: 1, reason: "FOO"});
            expect((await vanStockEngine.getReturns()).length).toBe(1);
            expect((await vanStockEngine.getPartsToCollect()).expectedReturns.length).toBe(0);

            clock.setSystemTime(new Date("2000-01-01T00:59").getTime())
            await pollingSyncServerDelegate();

            expect((await vanStockEngine.getReturns()).length).toBe(1);
            expect((await vanStockEngine.getPartsToCollect()).expectedReturns.length).toBe(0);


            clock.setSystemTime(new Date("2000-01-01T01:01").getTime());
            responses.materialsResponse.data = [material2];

            await pollingSyncServerDelegate();

            expect((await getMaterials()).map(m => m.stockReferenceId)).toEqual(["2000000"]);
            expect((await vanStockEngine.getReturns()).length).toBe(0);
            expect((await vanStockEngine.getPartsToCollect()).expectedReturns.length).toBe(1);
            expect((await vanStockEngine.getPartsToCollect()).expectedReturns[0].stockReferenceId).toBe("1000000");

            done();
        });
    });

    describe("end of the day", () => {
        it("can hit the actions endpoint if the engineer signs off", async done => {
            await vanStockEngine.initialise(ENGINEER_ID_WMIS);
            assertHttpCallPattern(HIGHVALUETOOLS_ENDPOINT, MATERIALS_ENDPOINT, ACTIONS_ENDPOINT);

            eventAggregator.publish(EngineerServiceConstants.ENGINEER_SIGNED_ON_CHANGED, true);
            await Promise.delay(100); // yuck
            assertHttpCallPattern(HIGHVALUETOOLS_ENDPOINT, MATERIALS_ENDPOINT, ACTIONS_ENDPOINT);

            eventAggregator.publish(EngineerServiceConstants.ENGINEER_SIGNED_ON_CHANGED, false);

            await awaitTilTrue(() => httpCallLog.length > 2);
            assertHttpCallPattern(HIGHVALUETOOLS_ENDPOINT, MATERIALS_ENDPOINT, ACTIONS_ENDPOINT, ACTIONS_ENDPOINT);

            done();
        });

        it("can withstand an error on the actions endpoint during end of day", async done => {
            await vanStockEngine.initialise(ENGINEER_ID_WMIS);
            assertHttpCallPattern(HIGHVALUETOOLS_ENDPOINT, MATERIALS_ENDPOINT, ACTIONS_ENDPOINT);

            eventAggregator.publish(EngineerServiceConstants.ENGINEER_SIGNED_ON_CHANGED, true);
            await Promise.delay(100); // yuck
            assertHttpCallPattern(HIGHVALUETOOLS_ENDPOINT, MATERIALS_ENDPOINT, ACTIONS_ENDPOINT);

            responses.actionsResponse.throws = true;
            eventAggregator.publish(EngineerServiceConstants.ENGINEER_SIGNED_ON_CHANGED, false);

            await awaitTilTrue(() => httpCallLog.length > 2);

            done();
        });
    });

    describe("a daily scenario", () => {

        const expectedDateAndTime = {
            date: 20190203,
            time: 13582647
        };

        beforeEach(() => {
            clock = sinon.useFakeTimers();
            clock.setSystemTime(new Date("2019-02-03T13:58:26.476").getTime())
        });

        afterEach(() => {
            clock.restore();
        });

        let assertArray = <T>(arr: T[], tests:Partial<T>[]) => {

            if (arr.length !== tests.length) {
                expect("length of test array " + JSON.stringify(tests)).toEqual("length of target" + JSON.stringify(arr));
            }

            let notFoundTests = tests
                .filter(incomingMaterial => !arr
                        .some(exitingMaterial => Object.keys(incomingMaterial)
                            .every(key => incomingMaterial[key] === exitingMaterial[key])
                        )
                );

            expect({notFoundTests}).toEqual({notFoundTests: []});
        }

        let assertMaterials = async (...materials: Partial<MaterialWithQuantities>[]) => {
            assertArray<MaterialWithQuantities>(await getMaterials(), materials);
        };

        let assertPartsCollections = async (toCollect: Partial<Material>[], collected: Partial<MaterialCollection>[], expectedReturns: Partial<Material>[]) => {
            const partsCollections = await vanStockService.getPartsToCollect();
            assertArray<Material>(partsCollections.toCollect, toCollect);
            assertArray<MaterialCollection>(partsCollections.collected, collected);
            assertArray<Material>(partsCollections.expectedReturns, expectedReturns);
        };

        let assertOutboundReservations = async (...reservations: Partial<MaterialRequest>[]) => {
            assertArray<MaterialRequest>((await vanStockService.getMaterialRequests()).outboundMaterials, reservations);
        };

        let assertInboundReservations = async (...reservations: Partial<MaterialRequest>[]) => {
            assertArray<MaterialRequest>((await vanStockService.getMaterialRequests()).inboundMaterials, reservations);
        };

        let assertCountEventsFiredSinceLastTime = (expectedCount: number) => {
            const countEventsFired = readUpdatedCallCount(true);
            expect(countEventsFired).toBe(expectedCount);
        };

        it("can run through a day of doing stuff", async done => {
            responses.materialsResponse.data = [
                { materialCode: "1000000", description: "Material 1", quantity: 1, storageZone: "zone1", owner: OWNER, jobId: undefined },
                { materialCode: "2000000", description: "Material 2", quantity: 2, storageZone: "zone2", owner: OWNER, jobId: undefined },
                { materialCode: "3000000", description: "Material 3", quantity: 3, storageZone: "zone3", owner: OWNER, jobId: undefined },
                { materialCode: "4000000", description: "Material 3", quantity: 4, storageZone: "zone4", owner: OWNER, jobId: undefined, expectedReturnQuantity: 2 },
            ];
            await vanStockEngine.initialise(ENGINEER_ID_WMIS);
            assertCountEventsFiredSinceLastTime(1);

            await pollingSyncServerDelegate();
            assertCountEventsFiredSinceLastTime(0);

            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 1, owner: OWNER },
                { stockReferenceId: "2000000", quantity: 2, owner: OWNER },
                { stockReferenceId: "3000000", quantity: 3, owner: OWNER },
                { stockReferenceId: "4000000", quantity: 4, owner: OWNER }
            );
            await assertPartsCollections([], [], []);
            responses.actionsResponse.data.dispatchedMaterials = [
                { id: 22, materialCode: "2000000", description: "Material 2", quantity: 1, jobId: undefined, owner: OWNER, storageZone: undefined  },
                { id: 23, materialCode: "3000000", description: "Material 3", quantity: 2, jobId: undefined, owner: OWNER, storageZone: undefined  },
                { id: 24, materialCode: "4000000", description: "Material 4", quantity: 3, jobId: undefined, owner: OWNER, storageZone: undefined  },
                { id: 25, materialCode: "5000000", description: "Material 5", quantity: 5, jobId: undefined, owner: OWNER, storageZone: "zoneX"  },
                { id: 26, materialCode: "6000000", description: "Material 6", quantity: 6, jobId: "345", owner: OWNER, storageZone: undefined},
                { id: 27, materialCode: "7000000", description: "Material 7", quantity: 999, jobId: undefined, owner: OWNER, storageZone: undefined},

            ];

            await pollingSyncServerDelegate();
            assertCountEventsFiredSinceLastTime(1);
            await pollingSyncServerDelegate();
            assertCountEventsFiredSinceLastTime(0);

            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 1, quantityToBeCollected: 0 },
                { stockReferenceId: "2000000", quantity: 2, quantityToBeCollected: 1 },
                { stockReferenceId: "3000000", quantity: 3, quantityToBeCollected: 2 },
                { stockReferenceId: "4000000", quantity: 4, quantityToBeCollected: 3 }
            );
            await assertPartsCollections([
                {stockReferenceId: "2000000", quantity:1, owner: OWNER },
                {stockReferenceId: "3000000", quantity:2, owner: OWNER },
                {stockReferenceId: "4000000", quantity:3, owner: OWNER },
                {stockReferenceId: "5000000", quantity:5, owner: OWNER },
                {stockReferenceId: "6000000", quantity:6, owner: OWNER },
                {stockReferenceId: "7000000", quantity:999, owner: OWNER }
                ],
                [],
                []
            );

            // a collection record dissappears
            responses.actionsResponse.data.dispatchedMaterials = [
                { id: 22, materialCode: "2000000", description: "Material 2", quantity: 1, jobId: undefined, owner: OWNER, storageZone: undefined  },
                { id: 23, materialCode: "3000000", description: "Material 3", quantity: 2, jobId: undefined, owner: OWNER, storageZone: undefined  },
                { id: 24, materialCode: "4000000", description: "Material 4", quantity: 3, jobId: undefined, owner: OWNER, storageZone: undefined  },
                { id: 25, materialCode: "5000000", description: "Material 5", quantity: 5, jobId: undefined, owner: OWNER, storageZone: "zoneX"  },
                { id: 26, materialCode: "6000000", description: "Material 6", quantity: 6, jobId: "345", owner: OWNER, storageZone: undefined}
            ];
            await pollingSyncServerDelegate();
            assertCountEventsFiredSinceLastTime(1);
            await assertPartsCollections([
                {stockReferenceId: "2000000", quantity:1, owner: OWNER },
                {stockReferenceId: "3000000", quantity:2, owner: OWNER },
                {stockReferenceId: "4000000", quantity:3, owner: OWNER },
                {stockReferenceId: "5000000", quantity:5, owner: OWNER },
                {stockReferenceId: "6000000", quantity:6, owner: OWNER }
                ],
                [],
                []
            );

            // collect all of a pre-existing code
            await vanStockService.registerMaterialCollection({ dispatchId: 22, quantityCollected: 1});
            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 1, quantityToBeCollected: 0 },
                { stockReferenceId: "2000000", quantity: 3, quantityToBeCollected: 0 },
                { stockReferenceId: "3000000", quantity: 3, quantityToBeCollected: 2 },
                { stockReferenceId: "4000000", quantity: 4, quantityToBeCollected: 3 }
            );
            await assertPartsCollections([
                {stockReferenceId: "3000000", quantity:2},
                {stockReferenceId: "4000000", quantity:3},
                {stockReferenceId: "5000000", quantity:5},
                {stockReferenceId: "6000000", quantity:6}
            ],
            [{ stockReferenceId: "2000000", quantityCollected: 1, quantityReturned: 0}],
            []);

            await assertHttpCallHasBeenMade<IMaterialReceiptRequest>({type: "POST", endpoint: RECEIPT_ENDPOINT, materialCode: "2000000",
                data: {
                    material: {
                        materialCode: "2000000",
                        description: "Material 2",
                        engineer: ENGINEER_ID,
                        quantity: 1,
                        owner: OWNER
                    },
                    jobId: undefined,
                    receiptQuantity: 1,
                    id: 22,
                    ...expectedDateAndTime
                }
            });

            // mixed collect and return of an existing one
            await vanStockService.registerMaterialCollection({ dispatchId: 23, quantityCollected: 1 });
            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 1, quantityToBeCollected: 0  },
                { stockReferenceId: "2000000", quantity: 3, quantityToBeCollected: 0  },
                { stockReferenceId: "3000000", quantity: 4, quantityToBeCollected: 0  },
                { stockReferenceId: "4000000", quantity: 4, quantityToBeCollected: 3 }
            );
            await assertPartsCollections([
                {stockReferenceId: "4000000", quantity:3},
                {stockReferenceId: "5000000", quantity:5},
                {stockReferenceId: "6000000", quantity:6}
                ],[
                    { stockReferenceId: "2000000", quantityCollected: 1},
                    { stockReferenceId: "3000000", quantityCollected: 1}
                ],
                []
            );

            await assertHttpCallHasBeenMade<IMaterialReceiptRequest>({type: "POST", endpoint: RECEIPT_ENDPOINT, materialCode: "3000000",
                data: {
                    material: {
                        materialCode: "3000000",
                        description: "Material 3",
                        engineer: ENGINEER_ID,
                        quantity: 2,
                        owner: OWNER
                    },
                    jobId: undefined,
                    receiptQuantity: 1,
                    id: 23,
                    ...expectedDateAndTime
                }});

            // complete return of an existing one
            await vanStockService.registerMaterialCollection({ dispatchId: 24, quantityCollected: 0 });
            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 1, quantityToBeCollected: 0 },
                { stockReferenceId: "2000000", quantity: 3, quantityToBeCollected: 0 },
                { stockReferenceId: "3000000", quantity: 4, quantityToBeCollected: 0 },
                { stockReferenceId: "4000000", quantity: 4, quantityToBeCollected: 0 }
            );
            await assertPartsCollections([
                {stockReferenceId: "5000000", quantity:5},
                {stockReferenceId: "6000000", quantity:6}
            ], [
                { stockReferenceId: "2000000", quantityCollected: 1},
                { stockReferenceId: "3000000", quantityCollected: 1},
                { stockReferenceId: "4000000", quantityCollected: 0}
            ],
            []
            );


            // collect all of a new one
            await vanStockService.registerMaterialCollection({ dispatchId: 25, quantityCollected: 5});
            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 1, quantityToBeCollected: 0},
                { stockReferenceId: "2000000", quantity: 3, quantityToBeCollected: 0 },
                { stockReferenceId: "3000000", quantity: 4, quantityToBeCollected: 0 },
                { stockReferenceId: "4000000", quantity: 4, quantityToBeCollected: 0 },
                { stockReferenceId: "5000000", quantity: 5, quantityToBeCollected: 0, description: "Material 5", owner: OWNER}
            );
            await assertPartsCollections([
                {stockReferenceId: "6000000", quantity:6}
                ],[
                    { stockReferenceId: "2000000", quantityCollected: 1},
                    { stockReferenceId: "3000000", quantityCollected: 1},
                    { stockReferenceId: "4000000", quantityCollected: 0},
                    { stockReferenceId: "5000000", quantityCollected: 5}
                ],
                []
            );

            await assertHttpCallHasBeenMade<IMaterialReceiptRequest>({type: "POST", endpoint: RECEIPT_ENDPOINT, materialCode: "5000000",
                data: {
                    material: {
                        materialCode: "5000000",
                        description: "Material 5",
                        engineer: ENGINEER_ID,
                        quantity: 5,
                        owner: OWNER
                    },
                    jobId: undefined,
                    receiptQuantity: 5,
                    id: 25,
                    ...expectedDateAndTime
                }
            });

            // mixed collect and return of a new one
            await vanStockService.registerMaterialCollection({ dispatchId: 26, quantityCollected: 5 });
            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 1, quantityToBeCollected: 0 },
                { stockReferenceId: "2000000", quantity: 3, quantityToBeCollected: 0 },
                { stockReferenceId: "3000000", quantity: 4, quantityToBeCollected: 0 },
                { stockReferenceId: "4000000", quantity: 4, quantityToBeCollected: 0 },
                { stockReferenceId: "5000000", quantity: 5, quantityToBeCollected: 0 },
                { stockReferenceId: "6000000", quantity: 5, quantityToBeCollected: 0, description: "Material 6", jobId: "345" }
            );
            await assertPartsCollections([], [
                { stockReferenceId: "2000000", quantityCollected: 1},
                { stockReferenceId: "3000000", quantityCollected: 1},
                { stockReferenceId: "4000000", quantityCollected: 0},
                { stockReferenceId: "5000000", quantityCollected: 5},
                { stockReferenceId: "6000000", quantityCollected: 5}
            ],
            []);

            await assertHttpCallHasBeenMade<IMaterialReceiptRequest>({type: "POST", endpoint: RECEIPT_ENDPOINT, materialCode: "6000000",
                data: {
                    material: {
                        materialCode: "6000000",
                        description: "Material 6",
                        engineer: ENGINEER_ID,
                        quantity: 6,
                        owner: OWNER
                    },
                    jobId: "345",
                    receiptQuantity: 5,
                    id: 26,
                    ...expectedDateAndTime
                }
            });

            // zone update
            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 1 , area: "zone1"},
                { stockReferenceId: "2000000", quantity: 3 },
                { stockReferenceId: "3000000", quantity: 4 },
                { stockReferenceId: "4000000", quantity: 4 },
                { stockReferenceId: "5000000", quantity: 5 },
                { stockReferenceId: "6000000", quantity: 5 }
            );

            await vanStockService.registerMaterialZoneUpdate({ stockReferenceId: "1000000", area: "zone1.1"});

            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 1 , area: "zone1.1"},
                { stockReferenceId: "2000000", quantity: 3 },
                { stockReferenceId: "3000000", quantity: 4 },
                { stockReferenceId: "4000000", quantity: 4 },
                { stockReferenceId: "5000000", quantity: 5 },
                { stockReferenceId: "6000000", quantity: 5 }
            );

            await assertHttpCallHasBeenMade<IMaterialZoneUpdateRequest>({type: "PUT", endpoint: ZONE_ENDPOINT, materialCode: "1000000",
                data: {
                    materialCode: "1000000",
                    engineer: ENGINEER_ID,
                    storageZone: "zone1.1",
                    owner: OWNER
                }
            });

            // reservations
            responses.actionsResponse.data.reservedMaterials = [
                {   id: 31,
                    materialCode: "1000000",
                    description: "Material 1",
                    owner: OWNER,
                    quantity: 1,
                    destinationEngineerId: "9999999",
                    destinationEngineerName: "Foo Bar",
                    sourceEngineerId: ENGINEER_ID,
                    sourceEngineerName: "Me Me",
                    date: 1,
                    time: 1,
                    declined: undefined
                }
            ];

            await pollingSyncServerDelegate();
            assertCountEventsFiredSinceLastTime(1);
            await pollingSyncServerDelegate();
            assertCountEventsFiredSinceLastTime(0);

            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 1, quantityOutboundReservation: 1 },
                { stockReferenceId: "2000000", quantity: 3, quantityOutboundReservation: 0  },
                { stockReferenceId: "3000000", quantity: 4, quantityOutboundReservation: 0  },
                { stockReferenceId: "4000000", quantity: 4, quantityOutboundReservation: 0  },
                { stockReferenceId: "5000000", quantity: 5, quantityOutboundReservation: 0  },
                { stockReferenceId: "6000000", quantity: 5, quantityOutboundReservation: 0  }
            );

            await assertOutboundReservations(
                { stockReferenceId: "1000000", description: "Material 1", quantity: 1, engineerId: "9999999", engineerName: "Foo Bar", status: "PENDING" }
            );

            await assertInboundReservations();

            responses.actionsResponse.data.reservedMaterials = [
                { id: 31,
                    materialCode: "1000000",
                    description: "Material 1",
                    owner: OWNER,
                    quantity: 1,
                    destinationEngineerId: "9999999",
                    destinationEngineerName: "Foo Bar",
                    sourceEngineerId: ENGINEER_ID,
                    sourceEngineerName: "Me Me",
                    date: 1,
                    time: 1,
                    declined: undefined
                },
                { id: 32,
                    materialCode: "2000000",
                    description: "Material 2",
                    owner: OWNER,
                    quantity: 2,
                    destinationEngineerId: "9999998",
                    destinationEngineerName: "Foo Bar 2",
                    sourceEngineerId: ENGINEER_ID,
                    sourceEngineerName: "Me Me",
                    date: 1,
                    time: 1,
                    declined: undefined
                }
            ];

            await pollingSyncServerDelegate();
            assertCountEventsFiredSinceLastTime(1);
            await pollingSyncServerDelegate();
            assertCountEventsFiredSinceLastTime(0);

            await assertOutboundReservations(
                { stockReferenceId: "1000000", description: "Material 1", quantity: 1, engineerId: "9999999", engineerName: "Foo Bar", status: "PENDING" },
                { stockReferenceId: "2000000", description: "Material 2", quantity: 2, engineerId: "9999998", engineerName: "Foo Bar 2", status: "PENDING" },
            );

            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 1, quantityOutboundReservation: 1 },
                { stockReferenceId: "2000000", quantity: 3, quantityOutboundReservation: 2 },
                { stockReferenceId: "3000000", quantity: 4, quantityOutboundReservation: 0 },
                { stockReferenceId: "4000000", quantity: 4, quantityOutboundReservation: 0 },
                { stockReferenceId: "5000000", quantity: 5, quantityOutboundReservation: 0 },
                { stockReferenceId: "6000000", quantity: 5, quantityOutboundReservation: 0 }
            );

            responses.actionsResponse.data.reservedMaterials = [
                { id: 32,
                    materialCode: "2000000",
                    description: "Material 2",
                    owner: OWNER,
                    quantity: 2,
                    destinationEngineerId: "9999998",
                    destinationEngineerName: "Foo Bar 2",
                    sourceEngineerId: ENGINEER_ID,
                    sourceEngineerName: "Me Me",
                    date: 1,
                    time: 1,
                    declined: undefined
                }
            ];

            await pollingSyncServerDelegate();
            assertCountEventsFiredSinceLastTime(1);
            await pollingSyncServerDelegate();
            assertCountEventsFiredSinceLastTime(0);

            await assertOutboundReservations(
                { stockReferenceId: "1000000", description: "Material 1", quantity: 1, engineerId: "9999999", engineerName: "Foo Bar", status: "WITHDRAWN" },
                { stockReferenceId: "2000000", description: "Material 2", quantity: 2, engineerId: "9999998", engineerName: "Foo Bar 2", status: "PENDING" },
            );

            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 1, quantityOutboundReservation: 0 },
                { stockReferenceId: "2000000", quantity: 3, quantityOutboundReservation: 2 },
                { stockReferenceId: "3000000", quantity: 4, quantityOutboundReservation: 0 },
                { stockReferenceId: "4000000", quantity: 4, quantityOutboundReservation: 0 },
                { stockReferenceId: "5000000", quantity: 5, quantityOutboundReservation: 0 },
                { stockReferenceId: "6000000", quantity: 5, quantityOutboundReservation: 0 }
            );

            responses.actionsResponse.data.reservedMaterials = [
                { id: 31,
                    materialCode: "1000000",
                    description: "Material 1",
                    owner: OWNER,
                    quantity: 1,
                    destinationEngineerId: "9999999",
                    destinationEngineerName: "Foo Bar",
                    sourceEngineerId: ENGINEER_ID,
                    sourceEngineerName: "Me Me",
                    date: 1,
                    time: 1,
                    declined: undefined
                },
                { id: 32,
                    materialCode: "2000000",
                    description: "Material 2",
                    owner: OWNER,
                    quantity: 2,
                    destinationEngineerId: "9999998",
                    destinationEngineerName: "Foo Bar 2",
                    sourceEngineerId: ENGINEER_ID,
                    sourceEngineerName: "Me Me",
                    date: 1,
                    time: 1,
                    declined: undefined
                }
            ];

            await pollingSyncServerDelegate();
            assertCountEventsFiredSinceLastTime(1);
            await pollingSyncServerDelegate();
            assertCountEventsFiredSinceLastTime(0);

            await assertOutboundReservations(
                { stockReferenceId: "1000000", description: "Material 1", quantity: 1, engineerId: "9999999", engineerName: "Foo Bar", status: "PENDING" },
                { stockReferenceId: "2000000", description: "Material 2", quantity: 2, engineerId: "9999998", engineerName: "Foo Bar 2", status: "PENDING" },
            );

            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 1, quantityOutboundReservation: 1 },
                { stockReferenceId: "2000000", quantity: 3, quantityOutboundReservation: 2 },
                { stockReferenceId: "3000000", quantity: 4, quantityOutboundReservation: 0 },
                { stockReferenceId: "4000000", quantity: 4, quantityOutboundReservation: 0 },
                { stockReferenceId: "5000000", quantity: 5, quantityOutboundReservation: 0 },
                { stockReferenceId: "6000000", quantity: 5, quantityOutboundReservation: 0 }
            );

            responses.actionsResponse.data.reservedMaterials = [
                { id: 32,
                    materialCode: "2000000",
                    description: "Material 2",
                    owner: OWNER,
                    quantity: 2,
                    destinationEngineerId: "9999998",
                    destinationEngineerName: "Foo Bar 2",
                    sourceEngineerId: ENGINEER_ID,
                    sourceEngineerName: "Me Me",
                    date: 1,
                    time: 1,
                    declined: undefined
                }
            ];

            responses.actionsResponse.data.transferredMaterials = [
                { id: 31,
                    materialCode: "1000000",
                    description: "Material 1",
                    owner: OWNER,
                    quantity: 1,
                    destinationEngineerId: "9999999",
                    sourceEngineerId: ENGINEER_ID,
                    date: 1,
                    time: 1
                },
            ];

            await pollingSyncServerDelegate();
            assertCountEventsFiredSinceLastTime(1);
            await pollingSyncServerDelegate();
            assertCountEventsFiredSinceLastTime(0);

            await assertOutboundReservations(
                { stockReferenceId: "1000000", description: "Material 1", quantity: 1, engineerId: "9999999", engineerName: "Foo Bar", status: "COMPLETE" },
                { stockReferenceId: "2000000", description: "Material 2", quantity: 2, engineerId: "9999998", engineerName: "Foo Bar 2", status: "PENDING" },
            );

            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 0, quantityOutboundReservation: 0 },
                { stockReferenceId: "2000000", quantity: 3, quantityOutboundReservation: 2 },
                { stockReferenceId: "3000000", quantity: 4, quantityOutboundReservation: 0 },
                { stockReferenceId: "4000000", quantity: 4, quantityOutboundReservation: 0 },
                { stockReferenceId: "5000000", quantity: 5, quantityOutboundReservation: 0 },
                { stockReferenceId: "6000000", quantity: 5, quantityOutboundReservation: 0 }
            );

            responses.actionsResponse.data.reservedMaterials = [];

            responses.actionsResponse.data.transferredMaterials = [
                { id: 31,
                    materialCode: "1000000",
                    description: "Material 1",
                    owner: OWNER,
                    quantity: 1,
                    destinationEngineerId: "9999999",
                    sourceEngineerId: ENGINEER_ID,
                    date: 1,
                    time: 1
                },
                { id: 32,
                    materialCode: "2000000",
                    description: "Material 2",
                    owner: OWNER,
                    quantity: 2,
                    destinationEngineerId: "9999998",
                    sourceEngineerId: ENGINEER_ID,
                    date: 1,
                    time: 1
                }
            ];

            await pollingSyncServerDelegate();
            assertCountEventsFiredSinceLastTime(1);
            await pollingSyncServerDelegate();
            assertCountEventsFiredSinceLastTime(0);

            await assertOutboundReservations(
                { stockReferenceId: "1000000", description: "Material 1", quantity: 1, engineerId: "9999999", engineerName: "Foo Bar", status: "COMPLETE" },
                { stockReferenceId: "2000000", description: "Material 2", quantity: 2, engineerId: "9999998", engineerName: "Foo Bar 2", status: "COMPLETE" },
            );

            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 0, quantityOutboundReservation: 0 },
                { stockReferenceId: "2000000", quantity: 1, quantityOutboundReservation: 0 },
                { stockReferenceId: "3000000", quantity: 4, quantityOutboundReservation: 0 },
                { stockReferenceId: "4000000", quantity: 4, quantityOutboundReservation: 0 },
                { stockReferenceId: "5000000", quantity: 5, quantityOutboundReservation: 0 },
                { stockReferenceId: "6000000", quantity: 5, quantityOutboundReservation: 0 }
            );

            const reservation7id = await vanStockService.registerMaterialRequest({ stockReferenceId: "7000000", description: "Material 7", quantityRequested: 3, engineerId: "9999999", engineerName: "Foo Bar", engineerPhone: "111", owner: OWNER});

            await assertInboundReservations(
                { stockReferenceId: "7000000", description: "Material 7", quantity: 3, engineerId: "9999999", engineerName: "Foo Bar", status: "PENDING" }
            );
            await assertOutboundReservations(
                { stockReferenceId: "1000000", description: "Material 1", quantity: 1, engineerId: "9999999", engineerName: "Foo Bar", status: "COMPLETE" },
                { stockReferenceId: "2000000", description: "Material 2", quantity: 2, engineerId: "9999998", engineerName: "Foo Bar 2", status: "COMPLETE" },
            );

            assertHttpCallHasBeenMade<IMaterialRequestRequest>( {type: "POST", endpoint: RESERVATION_ENDPOINT, materialCode: "7000000",
            data: {
                material: {
                    materialCode: "7000000",
                    description: "Material 7",
                    engineer: "9999999",
                    quantity: 3,
                    owner: OWNER,
                },
                requestingEngineer: ENGINEER_ID,
                ...expectedDateAndTime
            }});

            responses.actionsResponse.data.reservedMaterials = [
                { id: 33,
                    materialCode: "7000000",
                    description: "Material 7",
                    owner: OWNER,
                    quantity: 3,
                    destinationEngineerId: ENGINEER_ID,
                    destinationEngineerName: "Me mMe",
                    sourceEngineerId: "9999999",
                    sourceEngineerName: "Foo Bar",
                    ...expectedDateAndTime,
                    declined: undefined
                }
            ];

            await pollingSyncServerDelegate();

            const reservation1id = await vanStockService.registerMaterialRequest({ stockReferenceId: "1000000", description: "Material 1", quantityRequested: 2, engineerId: "9999998", engineerName: "Foo Bar2", engineerPhone: "112", owner: OWNER});
            await assertInboundReservations(
                { stockReferenceId: "7000000", description: "Material 7", quantity: 3, engineerId: "9999999", engineerName: "Foo Bar", status: "PENDING" },
                { stockReferenceId: "1000000", description: "Material 1", quantity: 2, engineerId: "9999998", engineerName: "Foo Bar2", status: "PENDING" }
            );

            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 0, quantityInboundReservation: 2 },
                { stockReferenceId: "2000000", quantity: 1, quantityInboundReservation: 0 },
                { stockReferenceId: "3000000", quantity: 4, quantityInboundReservation: 0 },
                { stockReferenceId: "4000000", quantity: 4, quantityInboundReservation: 0 },
                { stockReferenceId: "5000000", quantity: 5, quantityInboundReservation: 0 },
                { stockReferenceId: "6000000", quantity: 5, quantityInboundReservation: 0 }
            );

            assertHttpCallHasBeenMade<IMaterialRequestRequest>( {type: "POST", endpoint: RESERVATION_ENDPOINT, materialCode: "1000000",
            data: {
                material: {
                    materialCode: "1000000",
                    description: "Material 1",
                    engineer: "9999998",
                    quantity: 2,
                    owner: OWNER,
                },
                requestingEngineer: ENGINEER_ID,
                ...expectedDateAndTime
            }});

            await pollingSyncServerDelegate();
            switchOnLogToConsole = true;
            await vanStockService.registerMaterialRequestWithdrawl({ requestId: reservation7id });

            await assertInboundReservations(
                { stockReferenceId: "7000000", description: "Material 7", quantity: 3, engineerId: "9999999", engineerName: "Foo Bar", status: "WITHDRAWN" },
                { stockReferenceId: "1000000", description: "Material 1", quantity: 2, engineerId: "9999998", engineerName: "Foo Bar2", status: "PENDING" }
            );
            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 0, quantityInboundReservation: 2 },
                { stockReferenceId: "2000000", quantity: 1, quantityInboundReservation: 0 },
                { stockReferenceId: "3000000", quantity: 4, quantityInboundReservation: 0 },
                { stockReferenceId: "4000000", quantity: 4, quantityInboundReservation: 0 },
                { stockReferenceId: "5000000", quantity: 5, quantityInboundReservation: 0 },
                { stockReferenceId: "6000000", quantity: 5, quantityInboundReservation: 0 }
            );
                // await Promise.delay(50)
            assertHttpCallHasBeenMade<IMaterialRequestRequest>( {type: "PUT", endpoint: RESERVATION_ENDPOINT, materialCode: "7000000",
            data: {
                material: {
                    materialCode: "7000000",
                    description: "Material 7",
                    engineer: "9999999",
                    quantity: 0,
                    owner: OWNER,
                },
                requestingEngineer: ENGINEER_ID,
                ...expectedDateAndTime
            }});

            await pollingSyncServerDelegate();
            await vanStockService.registerMaterialRequestWithdrawl({ requestId: reservation1id });

            await assertInboundReservations(
                { stockReferenceId: "7000000", description: "Material 7", quantity: 3, engineerId: "9999999", engineerName: "Foo Bar", status: "WITHDRAWN" },
                { stockReferenceId: "1000000", description: "Material 1", quantity: 2, engineerId: "9999998", engineerName: "Foo Bar2", status: "WITHDRAWN" }
            );
            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 0, quantityInboundReservation: 0 },
                { stockReferenceId: "2000000", quantity: 1, quantityInboundReservation: 0 },
                { stockReferenceId: "3000000", quantity: 4, quantityInboundReservation: 0 },
                { stockReferenceId: "4000000", quantity: 4, quantityInboundReservation: 0 },
                { stockReferenceId: "5000000", quantity: 5, quantityInboundReservation: 0 },
                { stockReferenceId: "6000000", quantity: 5, quantityInboundReservation: 0 }
            );

            assertHttpCallHasBeenMade<IMaterialRequestRequest>( {type: "PUT", endpoint: RESERVATION_ENDPOINT, materialCode: "1000000",
            data: {
                material: {
                    materialCode: "1000000",
                    description: "Material 1",
                    engineer: "9999998",
                    quantity: 0,
                    owner: OWNER,
                },
                requestingEngineer: ENGINEER_ID,
                ...expectedDateAndTime
            }});

            const reservation1id2 = await vanStockService.registerMaterialRequest({ stockReferenceId: "1000000", description: "Material 1", quantityRequested: 3, engineerId: "9999998", engineerName: "Foo Bar2",engineerPhone: "112", owner: OWNER});

            await assertInboundReservations(
                { stockReferenceId: "7000000", description: "Material 7", quantity: 3, engineerId: "9999999", engineerName: "Foo Bar", status: "WITHDRAWN" },
                { stockReferenceId: "1000000", description: "Material 1", quantity: 2, engineerId: "9999998", engineerName: "Foo Bar2", status: "WITHDRAWN" },
                { stockReferenceId: "1000000", description: "Material 1", quantity: 3, engineerId: "9999998", engineerName: "Foo Bar2", status: "PENDING" }
            );

            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 0, quantityInboundReservation: 3 },
                { stockReferenceId: "2000000", quantity: 1, quantityInboundReservation: 0 },
                { stockReferenceId: "3000000", quantity: 4, quantityInboundReservation: 0 },
                { stockReferenceId: "4000000", quantity: 4, quantityInboundReservation: 0 },
                { stockReferenceId: "5000000", quantity: 5, quantityInboundReservation: 0 },
                { stockReferenceId: "6000000", quantity: 5, quantityInboundReservation: 0 }
            );

            assertHttpCallHasBeenMade<IMaterialRequestRequest>( {type: "POST", endpoint: RESERVATION_ENDPOINT, materialCode: "1000000",
            data: {
                material: {
                    materialCode: "1000000",
                    description: "Material 1",
                    engineer: "9999998",
                    quantity: 3,
                    owner: OWNER,
                },
                requestingEngineer: ENGINEER_ID,
                ...expectedDateAndTime
            }});

            await pollingSyncServerDelegate();
            await vanStockService.registerMaterialRequestWithdrawl({ requestId: reservation1id2 });

            await assertInboundReservations(
                { stockReferenceId: "7000000", description: "Material 7", quantity: 3, engineerId: "9999999", engineerName: "Foo Bar", status: "WITHDRAWN" },
                { stockReferenceId: "1000000", description: "Material 1", quantity: 2, engineerId: "9999998", engineerName: "Foo Bar2", status: "WITHDRAWN" },
                { stockReferenceId: "1000000", description: "Material 1", quantity: 3, engineerId: "9999998", engineerName: "Foo Bar2", status: "WITHDRAWN" },
            );

            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 0, quantityInboundReservation: 0 },
                { stockReferenceId: "2000000", quantity: 1, quantityInboundReservation: 0 },
                { stockReferenceId: "3000000", quantity: 4, quantityInboundReservation: 0 },
                { stockReferenceId: "4000000", quantity: 4, quantityInboundReservation: 0 },
                { stockReferenceId: "5000000", quantity: 5, quantityInboundReservation: 0 },
                { stockReferenceId: "6000000", quantity: 5, quantityInboundReservation: 0 }
            );

            assertHttpCallHasBeenMade<IMaterialRequestRequest>( {type: "PUT", endpoint: RESERVATION_ENDPOINT, materialCode: "1000000",
            data: {
                material: {
                    materialCode: "1000000",
                    description: "Material 1",
                    engineer: "9999998",
                    quantity: 0,
                    owner: OWNER,
                },
                requestingEngineer: ENGINEER_ID,
                ...expectedDateAndTime
            }}, 2);

            const reservation1id3 = await vanStockService.registerMaterialRequest({ stockReferenceId: "1000000", description: "Material 1", quantityRequested: 4, engineerId: "9999998", engineerName: "Foo Bar2", engineerPhone: "112", owner: OWNER});
            const reservation7id2 = await vanStockService.registerMaterialRequest({ stockReferenceId: "7000000", description: "Material 7", quantityRequested: 7, engineerId: "9999998", engineerName: "Foo Bar2", engineerPhone: "112", owner: OWNER});

            await assertInboundReservations(
                { stockReferenceId: "7000000", description: "Material 7", quantity: 3, engineerId: "9999999", engineerName: "Foo Bar", status: "WITHDRAWN" },
                { stockReferenceId: "1000000", description: "Material 1", quantity: 2, engineerId: "9999998", engineerName: "Foo Bar2", status: "WITHDRAWN" },
                { stockReferenceId: "1000000", description: "Material 1", quantity: 3, engineerId: "9999998", engineerName: "Foo Bar2", status: "WITHDRAWN" },
                { stockReferenceId: "1000000", description: "Material 1", quantity: 4, engineerId: "9999998", engineerName: "Foo Bar2", status: "PENDING" },
                { stockReferenceId: "7000000", description: "Material 7", quantity: 7, engineerId: "9999998", engineerName: "Foo Bar2", status: "PENDING" }
            );

            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 0, quantityInboundReservation: 4 },
                { stockReferenceId: "2000000", quantity: 1, quantityInboundReservation: 0 },
                { stockReferenceId: "3000000", quantity: 4, quantityInboundReservation: 0 },
                { stockReferenceId: "4000000", quantity: 4, quantityInboundReservation: 0 },
                { stockReferenceId: "5000000", quantity: 5, quantityInboundReservation: 0 },
                { stockReferenceId: "6000000", quantity: 5, quantityInboundReservation: 0 }
            );

            await pollingSyncServerDelegate();

            await vanStockService.registerMaterialTransfer({ requestId: reservation1id3 });

            await assertInboundReservations(
                { stockReferenceId: "7000000", description: "Material 7", quantity: 3, engineerId: "9999999", engineerName: "Foo Bar", status: "WITHDRAWN" },
                { stockReferenceId: "1000000", description: "Material 1", quantity: 2, engineerId: "9999998", engineerName: "Foo Bar2", status: "WITHDRAWN" },
                { stockReferenceId: "1000000", description: "Material 1", quantity: 3, engineerId: "9999998", engineerName: "Foo Bar2", status: "WITHDRAWN" },
                { stockReferenceId: "1000000", description: "Material 1", quantity: 4, engineerId: "9999998", engineerName: "Foo Bar2", status: "COMPLETE" },
                { stockReferenceId: "7000000", description: "Material 7", quantity: 7, engineerId: "9999998", engineerName: "Foo Bar2", status: "PENDING" }
            );

            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 4, quantityInboundReservation: 0 },
                { stockReferenceId: "2000000", quantity: 1, quantityInboundReservation: 0 },
                { stockReferenceId: "3000000", quantity: 4, quantityInboundReservation: 0 },
                { stockReferenceId: "4000000", quantity: 4, quantityInboundReservation: 0 },
                { stockReferenceId: "5000000", quantity: 5, quantityInboundReservation: 0 },
                { stockReferenceId: "6000000", quantity: 5, quantityInboundReservation: 0 }
            );

            assertHttpCallHasBeenMade<IMaterialTransferRequest>( {type: "POST", endpoint: TRANSFER_ENDPOINT, materialCode: "1000000",
            data: {
                material: {
                    materialCode: "1000000",
                    description: "Material 1",
                    engineer: "9999998",
                    quantity: 4,
                    owner: OWNER,
                },
                requestingEngineer: ENGINEER_ID,
                ...expectedDateAndTime
            }});

            assertHttpCallHasBeenMade<IMaterialRequestRequest>( {type: "PUT", endpoint: RESERVATION_ENDPOINT, materialCode: "1000000",
            data: {
                material: {
                    materialCode: "1000000",
                    description: "Material 1",
                    engineer: "9999998",
                    quantity: 0,
                    owner: OWNER,
                },
                requestingEngineer: ENGINEER_ID,
                ...expectedDateAndTime
            }}, 3);

            await vanStockService.registerMaterialTransfer({ requestId: reservation7id2 });

            await assertInboundReservations(
                { stockReferenceId: "7000000", description: "Material 7", quantity: 3, engineerId: "9999999", engineerName: "Foo Bar", status: "WITHDRAWN" },
                { stockReferenceId: "1000000", description: "Material 1", quantity: 2, engineerId: "9999998", engineerName: "Foo Bar2", status: "WITHDRAWN" },
                { stockReferenceId: "1000000", description: "Material 1", quantity: 3, engineerId: "9999998", engineerName: "Foo Bar2", status: "WITHDRAWN" },
                { stockReferenceId: "1000000", description: "Material 1", quantity: 4, engineerId: "9999998", engineerName: "Foo Bar2", status: "COMPLETE" },
                { stockReferenceId: "7000000", description: "Material 7", quantity: 7, engineerId: "9999998", engineerName: "Foo Bar2", status: "COMPLETE" }
            );

            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 4, quantityInboundReservation: 0 },
                { stockReferenceId: "2000000", quantity: 1, quantityInboundReservation: 0 },
                { stockReferenceId: "3000000", quantity: 4, quantityInboundReservation: 0 },
                { stockReferenceId: "4000000", quantity: 4, quantityInboundReservation: 0 },
                { stockReferenceId: "5000000", quantity: 5, quantityInboundReservation: 0 },
                { stockReferenceId: "6000000", quantity: 5, quantityInboundReservation: 0 },
                { stockReferenceId: "7000000", quantity: 7, quantityInboundReservation: 0 }
            );

            assertHttpCallHasBeenMade<IMaterialTransferRequest>( {type: "POST", endpoint: TRANSFER_ENDPOINT, materialCode: "7000000",
            data: {
                material: {
                    materialCode: "7000000",
                    description: "Material 7",
                    engineer: "9999998",
                    quantity: 7,
                    owner: OWNER,
                },
                requestingEngineer: ENGINEER_ID,
                ...expectedDateAndTime
            }});

            assertHttpCallHasBeenMade<IMaterialRequestRequest>( {type: "PUT", endpoint: RESERVATION_ENDPOINT, materialCode: "7000000",
            data: {
                material: {
                    materialCode: "7000000",
                    description: "Material 7",
                    engineer: "9999998",
                    quantity: 0,
                    owner: OWNER,
                },
                requestingEngineer: ENGINEER_ID,
                ...expectedDateAndTime
            }}, 1);

            await vanStockService.registerMaterialConsumption( { stockReferenceId: "1000000", quantityConsumed: 2 } );

            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 2 },
                { stockReferenceId: "2000000", quantity: 1 },
                { stockReferenceId: "3000000", quantity: 4 },
                { stockReferenceId: "4000000", quantity: 4 },
                { stockReferenceId: "5000000", quantity: 5 },
                { stockReferenceId: "6000000", quantity: 5 },
                { stockReferenceId: "7000000", quantity: 7 }
            );

            assertHttpCallHasBeenMade<IMaterialConsumptionRequest>( {type: "POST", endpoint: CONSUMPTION_ENDPOINT, materialCode: "1000000",
            data: {
                material: {
                    materialCode: "1000000",
                    description: "Material 1",
                    engineer: ENGINEER_ID,
                    quantity: 2,
                    owner: OWNER,
                },
                ...expectedDateAndTime
            }});

            await vanStockService.registerMaterialConsumption( { stockReferenceId: "1000000", quantityConsumed: 1 } );

            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 1 },
                { stockReferenceId: "2000000", quantity: 1 },
                { stockReferenceId: "3000000", quantity: 4 },
                { stockReferenceId: "4000000", quantity: 4 },
                { stockReferenceId: "5000000", quantity: 5 },
                { stockReferenceId: "6000000", quantity: 5 },
                { stockReferenceId: "7000000", quantity: 7 }
            );

            assertHttpCallHasBeenMade<IMaterialConsumptionRequest>( {type: "POST", endpoint: CONSUMPTION_ENDPOINT, materialCode: "1000000",
            data: {
                material: {
                    materialCode: "1000000",
                    description: "Material 1",
                    engineer: ENGINEER_ID,
                    quantity: 1,
                    owner: OWNER,
                },
                ...expectedDateAndTime
            }});

            await vanStockService.registerMaterialReturn({ stockReferenceId: "7000000", quantityReturned: 3, reason: "foo"});

            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 1, quantityToBeReturned: 0 },
                { stockReferenceId: "2000000", quantity: 1, quantityToBeReturned: 0  },
                { stockReferenceId: "3000000", quantity: 4, quantityToBeReturned: 0  },
                { stockReferenceId: "4000000", quantity: 4, quantityToBeReturned: 0  },
                { stockReferenceId: "5000000", quantity: 5, quantityToBeReturned: 0  },
                { stockReferenceId: "6000000", quantity: 5, quantityToBeReturned: 0  },
                { stockReferenceId: "7000000", quantity: 7, quantityToBeReturned: 3  }
            );

            assertHttpCallHasBeenMade<IMaterialReturnRequest>( {type: "POST", endpoint: RETURN_ENDPOINT, materialCode: "7000000",
            data: {
                material: {
                    materialCode: "7000000",
                    description: "Material 7",
                    engineer: ENGINEER_ID,
                    quantity: 3,
                    owner: OWNER,
                },
                ...expectedDateAndTime
            }});

            const returns = await vanStockService.getReturns();
            expect(
                returns.map(ret => ({ stockReferenceId: ret.stockReferenceId, quantity: ret.quantity })))
            .toEqual(
                [{ stockReferenceId: "7000000", quantity: 3}]
            );




            done();

            // search:
            // return global search
            // return cached search
            // return cached when fresh ones errors
            // expires cache

            // /    make utility asserts descriptive of why they fail
            done();
        });

        it("can cope with job parts", async done => {

            responses.materialsResponse.data = [
                { materialCode: "1000000", description: "Material 1", quantity: 1, storageZone: "zone1", owner: OWNER, jobId: undefined },
                { materialCode: "1000000", description: "Material 1", quantity: 2, storageZone: "zone1", owner: OWNER, jobId: "1" },
                { materialCode: "1000000", description: "Material 1", quantity: 3, storageZone: "zone1", owner: OWNER, jobId: "2" },
            ];
            await vanStockEngine.initialise(ENGINEER_ID_WMIS);

            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 1, jobId: undefined },
                { stockReferenceId: "1000000", quantity: 2, jobId: "1" },
                { stockReferenceId: "1000000", quantity: 3, jobId: "2" }
            );
            await assertPartsCollections([], [], []);

            responses.actionsResponse.data.dispatchedMaterials = [
                { id: 22, materialCode: "1000000", description: "Material 1", quantity: 15, jobId: undefined, owner: OWNER, storageZone: undefined  },
                { id: 23, materialCode: "1000000", description: "Material 1", quantity: 16, jobId: "1", owner: OWNER, storageZone: undefined  },
                { id: 24, materialCode: "2000000", description: "Material 2", quantity: 21, jobId: "2", owner: OWNER, storageZone: undefined  },
                { id: 25, materialCode: "2000000", description: "Material 2", quantity: 22, jobId: undefined, owner: OWNER, storageZone: undefined  }
            ];

            await pollingSyncServerDelegate();

            await assertPartsCollections([
                {stockReferenceId: "1000000", quantity:15, jobId: undefined },
                {stockReferenceId: "1000000", quantity:16, jobId: "1" },
                {stockReferenceId: "2000000", quantity:21, jobId: "2" },
                {stockReferenceId: "2000000", quantity:22, jobId: undefined }
            ], [], []);

            await vanStockService.registerMaterialCollection({ dispatchId: 22, quantityCollected: 15});
            await vanStockService.registerMaterialCollection({ dispatchId: 23, quantityCollected: 16});
            await vanStockService.registerMaterialCollection({ dispatchId: 24, quantityCollected: 21});
            await vanStockService.registerMaterialCollection({ dispatchId: 25, quantityCollected: 22});

            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 16, jobId: undefined },
                { stockReferenceId: "1000000", quantity: 18, jobId: "1" },
                { stockReferenceId: "1000000", quantity: 3, jobId: "2" },
                { stockReferenceId: "2000000", quantity: 21, jobId: "2" },
                { stockReferenceId: "2000000", quantity: 22, jobId: undefined },
            );

            await assertPartsCollections([],
            [
                {stockReferenceId: "1000000", quantity:15, jobId: undefined },
                {stockReferenceId: "1000000", quantity:16, jobId: "1" },
                {stockReferenceId: "2000000", quantity:21, jobId: "2" },
                {stockReferenceId: "2000000", quantity:22, jobId: undefined }
            ], []);

            await assertHttpCallHasBeenMade<IMaterialReceiptRequest>({type: "POST", endpoint: RECEIPT_ENDPOINT, materialCode: "1000000",
                data: {
                    material: {
                        materialCode: "1000000",
                        description: "Material 1",
                        engineer: ENGINEER_ID,
                        quantity: 15,
                        owner: OWNER
                    },
                    jobId: undefined,
                    receiptQuantity: 15,
                    id: 22,
                    ...expectedDateAndTime
                }
            });
            await assertHttpCallHasBeenMade<IMaterialReceiptRequest>({type: "POST", endpoint: RECEIPT_ENDPOINT, materialCode: "1000000",
                data: {
                    material: {
                        materialCode: "1000000",
                        description: "Material 1",
                        engineer: ENGINEER_ID,
                        quantity: 16,
                        owner: OWNER
                    },
                    jobId: "1",
                    receiptQuantity: 16,
                    id: 23,
                    ...expectedDateAndTime
                }
            });
            await assertHttpCallHasBeenMade<IMaterialReceiptRequest>({type: "POST", endpoint: RECEIPT_ENDPOINT, materialCode: "2000000",
                data: {
                    material: {
                        materialCode: "2000000",
                        description: "Material 2",
                        engineer: ENGINEER_ID,
                        quantity: 21,
                        owner: OWNER
                    },
                    jobId: "2",
                    receiptQuantity: 21,
                    id: 24,
                    ...expectedDateAndTime
                }
            });
            await assertHttpCallHasBeenMade<IMaterialReceiptRequest>({type: "POST", endpoint: RECEIPT_ENDPOINT, materialCode: "2000000",
                data: {
                    material: {
                        materialCode: "2000000",
                        description: "Material 2",
                        engineer: ENGINEER_ID,
                        quantity: 22,
                        owner: OWNER
                    },
                    jobId: undefined,
                    receiptQuantity: 22,
                    id: 25,
                    ...expectedDateAndTime
                }
            });

            await vanStockService.registerMaterialZoneUpdate({ stockReferenceId: "1000000", area: "ZZZZZ"});
            await vanStockService.registerMaterialZoneUpdate({ stockReferenceId: "2000000", area: "YYYYY"});

            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 16, jobId: undefined, area: "ZZZZZ" },
                { stockReferenceId: "1000000", quantity: 18, jobId: "1", area: "ZZZZZ" },
                { stockReferenceId: "1000000", quantity: 3, jobId: "2", area: "ZZZZZ" },
                { stockReferenceId: "2000000", quantity: 21, jobId: "2", area: "YYYYY" },
                { stockReferenceId: "2000000", quantity: 22, jobId: undefined, area: "YYYYY" },
            );

            await assertHttpCallHasBeenMade<IMaterialZoneUpdateRequest>({type: "PUT", endpoint: ZONE_ENDPOINT, materialCode: "1000000",
                data: {
                    materialCode: "1000000",
                    engineer: ENGINEER_ID,
                    storageZone: "ZZZZZ",
                    owner: OWNER
                }
            });

            await assertHttpCallHasBeenMade<IMaterialZoneUpdateRequest>({type: "PUT", endpoint: ZONE_ENDPOINT, materialCode: "2000000",
                data: {
                    materialCode: "2000000",
                    engineer: ENGINEER_ID,
                    storageZone: "YYYYY",
                    owner: OWNER
                }
            });

            await vanStockService.registerMaterialReturn({ stockReferenceId: "1000000", quantityReturned: 3, reason: "FOO", jobId: undefined});
            await vanStockService.registerMaterialReturn({ stockReferenceId: "1000000", quantityReturned: 2, reason: "FOO1", jobId: "1"});
            await vanStockService.registerMaterialReturn({ stockReferenceId: "1000000", quantityReturned: 1, reason: "FOO2", jobId: "2"});
            await vanStockService.registerMaterialReturn({ stockReferenceId: "2000000", quantityReturned: 3, reason: "FOO3", jobId: "2"});
            await vanStockService.registerMaterialReturn({ stockReferenceId: "2000000", quantityReturned: 2, reason: "FOO4", jobId: undefined});

            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 16, jobId: undefined, area: "ZZZZZ", quantityToBeReturned: 3 },
                { stockReferenceId: "1000000", quantity: 18, jobId: "1", area: "ZZZZZ", quantityToBeReturned: 2 },
                { stockReferenceId: "1000000", quantity: 3, jobId: "2", area: "ZZZZZ", quantityToBeReturned: 1 },
                { stockReferenceId: "2000000", quantity: 21, jobId: "2", area: "YYYYY", quantityToBeReturned: 3 },
                { stockReferenceId: "2000000", quantity: 22, jobId: undefined, area: "YYYYY", quantityToBeReturned: 2 },
            );

            await assertHttpCallHasBeenMade<IMaterialReturnRequest>({type: "POST", endpoint: RETURN_ENDPOINT, materialCode: "1000000",
                data: {
                    material: {
                        materialCode: "1000000",
                        description: "Material 1",
                        engineer: ENGINEER_ID,
                        owner: OWNER,
                        quantity: 3
                    },
                    reason: "FOO",
                    jobId: undefined,
                    ...expectedDateAndTime
                }
            });

            await assertHttpCallHasBeenMade<IMaterialReturnRequest>({type: "POST", endpoint: RETURN_ENDPOINT, materialCode: "1000000",
                data: {
                    material: {
                        materialCode: "1000000",
                        description: "Material 1",
                        engineer: ENGINEER_ID,
                        owner: OWNER,
                        quantity: 2
                    },
                    reason: "FOO1",
                    jobId: "1",
                    ...expectedDateAndTime
                }
            });

            await assertHttpCallHasBeenMade<IMaterialReturnRequest>({type: "POST", endpoint: RETURN_ENDPOINT, materialCode: "1000000",
                data: {
                    material: {
                        materialCode: "1000000",
                        description: "Material 1",
                        engineer: ENGINEER_ID,
                        owner: OWNER,
                        quantity: 1
                    },
                    reason: "FOO2",
                    jobId: "2",
                    ...expectedDateAndTime
                }
            });

            await assertHttpCallHasBeenMade<IMaterialReturnRequest>({type: "POST", endpoint: RETURN_ENDPOINT, materialCode: "2000000",
                data: {
                    material: {
                        materialCode: "2000000",
                        description: "Material 2",
                        engineer: ENGINEER_ID,
                        owner: OWNER,
                        quantity: 3
                    },
                    reason: "FOO3",
                    jobId: "2",
                    ...expectedDateAndTime
                }
            });

            await assertHttpCallHasBeenMade<IMaterialReturnRequest>({type: "POST", endpoint: RETURN_ENDPOINT, materialCode: "2000000",
                data: {
                    material: {
                        materialCode: "2000000",
                        description: "Material 2",
                        engineer: ENGINEER_ID,
                        owner: OWNER,
                        quantity: 2
                    },
                    reason: "FOO4",
                    jobId: undefined,
                    ...expectedDateAndTime
                }
            });

            await vanStockService.registerMaterialConsumption({ stockReferenceId: "1000000", quantityConsumed: 3, jobId: undefined});
            await vanStockService.registerMaterialConsumption({ stockReferenceId: "1000000", quantityConsumed: 2, jobId: "1"});
            await vanStockService.registerMaterialConsumption({ stockReferenceId: "1000000", quantityConsumed: 1, jobId: "2"});
            await vanStockService.registerMaterialConsumption({ stockReferenceId: "2000000", quantityConsumed: 3, jobId: "2"});
            await vanStockService.registerMaterialConsumption({ stockReferenceId: "2000000", quantityConsumed: 2, jobId: undefined});

            await assertMaterials(
                { stockReferenceId: "1000000", quantity: 13, jobId: undefined, area: "ZZZZZ", quantityToBeReturned: 3 },
                { stockReferenceId: "1000000", quantity: 16, jobId: "1", area: "ZZZZZ", quantityToBeReturned: 2 },
                { stockReferenceId: "1000000", quantity: 2, jobId: "2", area: "ZZZZZ", quantityToBeReturned: 1 },
                { stockReferenceId: "2000000", quantity: 18, jobId: "2", area: "YYYYY", quantityToBeReturned: 3 },
                { stockReferenceId: "2000000", quantity: 20, jobId: undefined, area: "YYYYY", quantityToBeReturned: 2 },
            );

            await assertHttpCallHasBeenMade<IMaterialConsumptionRequest>({type: "POST", endpoint: CONSUMPTION_ENDPOINT, materialCode: "1000000",
                data: {
                    material: {
                        materialCode: "1000000",
                        description: "Material 1",
                        engineer: ENGINEER_ID,
                        owner: OWNER,
                        quantity: 3
                    },
                    jobId: undefined,
                    ...expectedDateAndTime
                }
            });

            await assertHttpCallHasBeenMade<IMaterialConsumptionRequest>({type: "POST", endpoint: CONSUMPTION_ENDPOINT, materialCode: "1000000",
                data: {
                    material: {
                        materialCode: "1000000",
                        description: "Material 1",
                        engineer: ENGINEER_ID,
                        owner: OWNER,
                        quantity: 2
                    },
                    jobId: "1",
                    ...expectedDateAndTime
                }
            });

            await assertHttpCallHasBeenMade<IMaterialConsumptionRequest>({type: "POST", endpoint: CONSUMPTION_ENDPOINT, materialCode: "1000000",
                data: {
                    material: {
                        materialCode: "1000000",
                        description: "Material 1",
                        engineer: ENGINEER_ID,
                        owner: OWNER,
                        quantity: 1
                    },
                    jobId: "2",
                    ...expectedDateAndTime
                }
            });

            await assertHttpCallHasBeenMade<IMaterialConsumptionRequest>({type: "POST", endpoint: CONSUMPTION_ENDPOINT, materialCode: "2000000",
                data: {
                    material: {
                        materialCode: "2000000",
                        description: "Material 2",
                        engineer: ENGINEER_ID,
                        owner: OWNER,
                        quantity: 3
                    },
                    jobId: "2",
                    ...expectedDateAndTime
                }
            });

            await assertHttpCallHasBeenMade<IMaterialConsumptionRequest>({type: "POST", endpoint: CONSUMPTION_ENDPOINT, materialCode: "2000000",
                data: {
                    material: {
                        materialCode: "2000000",
                        description: "Material 2",
                        engineer: ENGINEER_ID,
                        owner: OWNER,
                        quantity: 2
                    },
                    jobId: undefined,
                    ...expectedDateAndTime
                }
            });
            done();
        });
    });

}); */