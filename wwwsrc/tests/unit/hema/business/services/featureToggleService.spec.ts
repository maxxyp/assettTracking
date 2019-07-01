/// <reference path="../../../../../typings/app.d.ts" />

import {IStorageService} from "../../../../../app/hema/business/services/interfaces/IStorageService";
import {FeatureToggleService} from "../../../../../app/hema/business/services/featureToggleService";
import {IHttpClient} from "../../../../../app/common/core/IHttpClient";
import {EventAggregator} from "aurelia-event-aggregator";
import {ResilientHttpClientFactory} from "../../../../../app/common/resilience/services/resilientHttpClientFactory";
import {IConfigurationService} from "../../../../../app/common/core/services/IConfigurationService";
import {IEndpointConfiguration} from "../../../../../app/common/resilience/models/IEndpointConfiguration";
import {IHttpHeaderProvider} from "../../../../../app/common/resilience/services/interfaces/IHttpHeaderProvider";
import {WuaNetworkDiagnostics} from "../../../../../app/common/core/wuaNetworkDiagnostics";
import {IFeatureToggleService} from "../../../../../app/hema/business/services/interfaces/IFeatureToggleService";
import SinonStub = Sinon.SinonStub;
import {ApiException} from "../../../../../app/common/resilience/apiException";

describe("the featureToggleService class", () => {
    let sandbox: Sinon.SinonSandbox;

    let storageServiceStub: IStorageService;
    let apiHttpClient: IHttpClient;
    let eventAggregatorStub: EventAggregator;
    let configurationService: IConfigurationService;

    let clientFactory: ResilientHttpClientFactory;
    let fftHeaderProviderStub: IHttpHeaderProvider;

    let wuaNetworkDiagnosticsStub: WuaNetworkDiagnostics;
    let featureToggleService: IFeatureToggleService;

    let getApiMaterialsDataStub: SinonStub;


    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        storageServiceStub = <IStorageService>{};
        storageServiceStub.getMaterials = sandbox.stub().resolves(undefined);
        storageServiceStub.getResilienceRetryPayloads = sandbox.stub().resolves([]);

        apiHttpClient = <IHttpClient>{};

        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.publish = sandbox.stub();

        fftHeaderProviderStub = <IHttpHeaderProvider>{};
        fftHeaderProviderStub.setStaticHeaders = sandbox.stub();
        fftHeaderProviderStub.getHeaders = sandbox.stub().resolves([]);

        wuaNetworkDiagnosticsStub = <WuaNetworkDiagnostics>{};
        wuaNetworkDiagnosticsStub.getDiagnostics = sandbox.stub();

        configurationService = <IConfigurationService>{};
        let config: IEndpointConfiguration = {
            clients: [
                {
                    name: "test",
                    type: "http"
                }
            ],
            routes: [
                {
                    route: "materials",
                    path: "engineer/{engineerId}/materials",
                    client: "test"
                }
            ]
        };
        configurationService.getConfiguration = sandbox.stub().returns(config);

        apiHttpClient = <IHttpClient>{};
        clientFactory = <ResilientHttpClientFactory>{
            getHttpClient: () => apiHttpClient
        };

        featureToggleService = new FeatureToggleService(configurationService, storageServiceStub, eventAggregatorStub, fftHeaderProviderStub, clientFactory, wuaNetworkDiagnosticsStub);

        getApiMaterialsDataStub = sandbox.stub().returns(Promise.resolve([]));

    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(featureToggleService).toBeDefined();
    });

    describe("initialise", () => {

        describe("check if empty engineer, throw exception", () => {

            it("undefined engineer id", async done => {
                try {
                    await featureToggleService.initialise(undefined);
                } catch (err) {
                    expect(err.message).toBeDefined();
                    done()
                }
            });

            it("empty engineer id", async done => {
                try {
                    await featureToggleService.initialise("");
                } catch (err) {
                    expect(err.message).toBeDefined();
                    done()
                }
            });

            it("null engineer id", async done => {
                try {
                    await featureToggleService.initialise(null);
                } catch (err) {
                    expect(err.message).toBeDefined();
                    done()
                }
            });
        });


    });

    describe("isAssetTrackingEnabled", () => {

        it("returns false when no materials in local storage db", async done => {
            await featureToggleService.initialise("0000050");
            const value = featureToggleService.isAssetTrackingEnabled();
            expect(value).toBe(false);
            done();
        });

        it("returns true when materials already exist in local storage db", async done => {

            storageServiceStub.getMaterials = sandbox.stub().resolves([]);

            await featureToggleService.initialise("0000050");
            const value = featureToggleService.isAssetTrackingEnabled();
            expect(value).toBe(true);
            done();
        });

        describe("when no materials in local storage, performs remote api call", () => {

            it("returns true if materials returned", async done => {

                getApiMaterialsDataStub = sandbox.stub().resolves([]);
                apiHttpClient.getData = getApiMaterialsDataStub;

                storageServiceStub.getMaterials = sandbox.stub().resolves(undefined);

                await featureToggleService.initialise("0000050");

                const value = featureToggleService.isAssetTrackingEnabled();
                expect(value).toBe(true);
                expect(getApiMaterialsDataStub.called).toBe(true);

                done();

            });

            it("returns false if exception thrown", async done => {

                getApiMaterialsDataStub = sandbox.stub().rejects(new ApiException(this, "foo", "bar {0}", ["baz"], {}, 500));
                apiHttpClient.getData = getApiMaterialsDataStub;

                storageServiceStub.getMaterials = sandbox.stub().resolves(undefined);

                await featureToggleService.initialise("0000050");

                const value = featureToggleService.isAssetTrackingEnabled();
                expect(value).toBe(false);
                expect(getApiMaterialsDataStub.called).toBe(true);

                done();

            });

        })


    });
});