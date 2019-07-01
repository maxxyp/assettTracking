import {FftService} from "../../../../../app/hema/api/services/fftService";
import {IConfigurationService} from "../../../../../app/common/core/services/IConfigurationService";
import {IFFTService} from "../../../../../app/hema/api/services/interfaces/IFFTService";
import {IHttpClient} from "../../../../../app/common/core/IHttpClient";

import {IEngineerStatusRequest} from "../../../../../app/hema/api/models/fft/engineers/IEngineerStatusRequest";
import {IWorkListResponse} from "../../../../../app/hema/api/models/fft/engineers/worklist/IWorkListResponse";
import {IEndpointConfiguration} from "../../../../../app/common/resilience/models/IEndpointConfiguration";
import {EventAggregator} from "aurelia-event-aggregator";
import {IHttpHeaderProvider} from "../../../../../app/common/resilience/services/interfaces/IHttpHeaderProvider";
import {IStorageService} from "../../../../../app/hema/business/services/interfaces/IStorageService";
import {ResilientHttpClientFactory} from "../../../../../app/common/resilience/services/resilientHttpClientFactory";
import { WuaNetworkDiagnostics } from "../../../../../app/common/core/wuaNetworkDiagnostics";

describe("the FFTService module", () => {
    let fftService: IFFTService;
    let sandbox: Sinon.SinonSandbox;
    let apiHttpClient: IHttpClient;
    let configurationService: IConfigurationService;
    let storageStub: IStorageService;
    let fftHeaderProviderStub: IHttpHeaderProvider;
    let eventAggregatorStub: EventAggregator;
    let wuaNetworkDiagnosticsStub: WuaNetworkDiagnostics;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        configurationService = <IConfigurationService>{};
        fftHeaderProviderStub = <IHttpHeaderProvider>{};
        fftHeaderProviderStub.setStaticHeaders = sandbox.stub();
        fftHeaderProviderStub.getHeaders = sandbox.stub().resolves([]);

        let config: IEndpointConfiguration = {
            clients: [
                {
                    name: "test",
                    type: "http"
                }
            ],
            routes: [
                {
                    route: "engineer_requestwork",
                    client: "test",
                    path: "/engineer/requestwork"
                },
                {
                    route: "engineer_status",
                    client: "test",
                    path: "/engineer/status"
                },
                {
                    route: "parts_collection",
                    client: "test",
                    path: "jobs/v1/{jobId}/parts"
                },
                {
                    route: "contractor_info",
                    client: "test",
                    path: "engineers/v1/contract/{engineerId}"
                }
            ]
        };

        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.publish = sandbox.stub();

        apiHttpClient = <IHttpClient>{};
        let clientFactory = <ResilientHttpClientFactory> {
            getHttpClient: () => apiHttpClient
        }

        storageStub = <IStorageService>{};
        storageStub.getResilienceRetryPayloads = sandbox.stub().resolves(undefined);
        storageStub.setResilienceRetryPayloads = sandbox.stub().resolves(undefined);
        configurationService.getConfiguration = sandbox.stub().returns(config);

        wuaNetworkDiagnosticsStub = <WuaNetworkDiagnostics>{};
        wuaNetworkDiagnosticsStub.getDiagnostics = sandbox.stub();

        fftService = new FftService(configurationService, storageStub, eventAggregatorStub, fftHeaderProviderStub, clientFactory, wuaNetworkDiagnosticsStub);
    });

    afterEach(() => {
        sandbox.restore();
        fftService = null;
    });

    it("can be created", () => {
        expect(fftService).toBeDefined();
    });

    it("can request work", (done) => {
        apiHttpClient.putData = sandbox.stub().resolves(<IWorkListResponse>
            {
                data: {
                    list: []
                }
            });

        fftService.requestWork("1000")
            .then(() => {
                expect((wuaNetworkDiagnosticsStub.getDiagnostics as Sinon.SinonStub).called).toBe(false);
                done();
            })
            .catch((e) => fail("Exception thrown: " + e));

    });

    it("can request work fails", (done) => {
        apiHttpClient.putData = sandbox.stub().rejects({status: "400 Bad Request", error: ["Something failed"]});

        fftService.requestWork("1000")
            .then(() => fail("Should be rejected"))
            .catch((e) => {
                expect((wuaNetworkDiagnosticsStub.getDiagnostics as Sinon.SinonStub).called).toBe(true);
                done();
            });
    });

    it("can update engineerStatus", (done) => {
        let engineerId = "engineer id";
        let statusCode = "status code";

        apiHttpClient.putData = sandbox.stub().resolves(null);

        fftService.engineerStatusUpdate(engineerId, <IEngineerStatusRequest>{data: {statusCode}})
            .then(() => done())
            .catch((e) => fail("Exception thrown: " + e));
    });

    it("can update engineerStatus can fail", (done) => {
        let engineerId = "engineer id";
        let statusCode = "status code";

        apiHttpClient.putData = sandbox.stub().rejects({});

        fftService.engineerStatusUpdate(engineerId, <IEngineerStatusRequest>{data: {statusCode}})
            .then(() => done());
    });

    it("can get parts collection", done => {

        const jobId = "1";
        apiHttpClient.getData = sandbox.stub().resolves({});

        fftService.getPartsCollection(jobId).then(() => done());
    });

    it("should strip preceding zeros off engineerId", async () => {
        apiHttpClient.getData = sinon.stub().resolves({});
        await fftService.getAmIContractEngineerInfo("0000050");
        expect((<Sinon.SinonSpy> apiHttpClient.getData).called).toBeTruthy()
        let params = (<Sinon.SinonSpy> apiHttpClient.getData).args;
        expect(params[0][2].engineerId).toEqual(50);      
    });

    it("shouldn't strip any digits off engineerId", async () => {
        apiHttpClient.getData = sinon.stub().resolves({});
        await fftService.getAmIContractEngineerInfo("1111111");
        expect((<Sinon.SinonSpy> apiHttpClient.getData).called).toBeTruthy()
        let params = (<Sinon.SinonSpy> apiHttpClient.getData).args;
        expect(params[0][2].engineerId).toEqual(1111111);      
    });
});
