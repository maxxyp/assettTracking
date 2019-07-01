/// <reference path="../../../../../typings/app.d.ts" />
import {BridgeApiService} from "../../../../../app/hema/api/services/bridgeApiService";
import {IConfigurationService} from "../../../../../app/common/core/services/IConfigurationService";
import SinonStub = Sinon.SinonStub;
import {IHttpClient} from "../../../../../app/common/core/IHttpClient";
import {IEndpointConfiguration} from "../../../../../app/common/resilience/models/IEndpointConfiguration";
import {EventAggregator} from "aurelia-event-aggregator";
import {IQuoteCustomerDetails} from "../../../../../app/hema/api/models/adapt/IQuoteCustomerDetails";
import { IStorageService } from "../../../../../app/hema/business/services/interfaces/IStorageService";
import { ResilientHttpClientFactory } from "../../../../../app/common/resilience/services/resilientHttpClientFactory";

describe("the BridgeApiService module", () => {
    let sandbox: Sinon.SinonSandbox;
    let bridgeApiService: BridgeApiService;
    let getDataStub: SinonStub;
    let apiHttpClient: IHttpClient;
    let storageStub: IStorageService;
    let eventAggregatorStub: EventAggregator;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        let configurationService: IConfigurationService = <IConfigurationService>{};
        let config: IEndpointConfiguration = {
            clients: [
                {
                    name: "test",
                    type: "http"
                }
            ],
            routes: [
                {
                    route: "models",
                    client: "test",
                    path: "adapt/models/{gcNumber}",
                },
                {
                    route: "attributes",
                    client: "test",
                    path: "adapt/attributes/{modelId}",
                },
                {
                    route: "customerDetails",
                    client: "test",
                    path: "quote/customerDetails",
                },
            ]
        };

        apiHttpClient = <IHttpClient>{};

        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.publish = sandbox.stub();


        storageStub = <IStorageService>{};
        storageStub.getResilienceRetryPayloads = sandbox.stub().resolves([]);

        configurationService.getConfiguration = sandbox.stub().returns(config);

        apiHttpClient = <IHttpClient>{};
        let clientFactory = <ResilientHttpClientFactory> {
            getHttpClient: () => apiHttpClient
        }
        bridgeApiService = new BridgeApiService(configurationService, storageStub,  eventAggregatorStub, clientFactory);

        getDataStub = sandbox.stub().returns(Promise.resolve(""));

    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(bridgeApiService).toBeDefined();
    });

    describe("the Adapt calls", () => {
        beforeEach(() => {
        });

        afterEach(() => {
            sandbox.restore();
        });

        describe("getModels", () => {
            it("resolves", (done) => {
                apiHttpClient.getData = getDataStub;

                bridgeApiService.getModels("99-999-99")
                    .then((adaptModel) => {
                        expect(adaptModel).not.toBeNull();
                        done();
                    });
            });

            it("calls correct api resource", (done) => {
                apiHttpClient.getData = getDataStub;

                bridgeApiService.getModels("99-999-99")
                    .then(() => {
                        expect(getDataStub.getCall(0).args[1]).toEqual("adapt/models/{gcNumber}");
                        done();
                    });
            });

            it("passes in correct parameter", (done) => {
                apiHttpClient.getData = getDataStub;

                bridgeApiService.getModels("99-999-99")
                    .then(() => {
                        expect(getDataStub.getCall(0).args[2]).toEqual({"gcNumber": "99-999-99"});
                        done();
                    });
            });

        });

        describe("getModelAttributes", () => {
            it("resolves", (done) => {
                apiHttpClient.getData = getDataStub;

                bridgeApiService.getModelAttributes(6341)
                    .then((adaptModel) => {
                        expect(adaptModel).not.toBeNull();
                        done();
                    });
            });

            it("calls correct api resource", (done) => {
                apiHttpClient.getData = getDataStub;

                bridgeApiService.getModelAttributes(6341)
                    .then(() => {
                        expect(getDataStub.getCall(0).args[1]).toEqual("adapt/attributes/{modelId}");
                        done();
                    });
            });

            it("passes in correct parameter", (done) => {
                apiHttpClient.getData = getDataStub;

                bridgeApiService.getModelAttributes(6341)
                    .then(() => {
                        expect(getDataStub.getCall(0).args[2]).toEqual({"modelId": 6341});
                        done();
                    });
            });

        });

        it("will catch error on getModels", (done) => {
            apiHttpClient.getData = sandbox.stub().rejects("error");
            bridgeApiService.getModels("99-999-99").catch((err) => {
                expect(err).toBeDefined();
                done();
            });
        });

        it("will catch error on getModelAttributes", (done) => {
            apiHttpClient.getData = sandbox.stub().rejects("error");
            bridgeApiService.getModelAttributes(1234).catch((err) => {
                expect(err).toBeDefined();
                done();
            });
        });

    });

    describe("postCustomerDetails", () => {
        let postDataStub: SinonStub;
        let customerDetails = <IQuoteCustomerDetails> {};
        customerDetails.jobcity = "city";

        beforeEach(() => {
            postDataStub = sandbox.stub().returns(Promise.resolve(true));
            apiHttpClient.postData = postDataStub;
        });

        afterEach(() => {
            sandbox.restore();
        });

        describe("postCustomerDetails", () => {
            it("resolves", (done) => {

                bridgeApiService.postCustomerDetails(customerDetails)
                    .then((response) => {
                        expect(response).not.toBeNull();
                        console.log(postDataStub.getCall(0).args);
                        done();
                    });
            });

            it("calls correct api resource", (done) => {

                bridgeApiService.postCustomerDetails(customerDetails)
                    .then(() => {
                        expect(postDataStub.getCall(0).args[1]).toEqual("quote/customerDetails");
                        done();
                    });
            });

            it("passes in correct parameter", (done) => {

                bridgeApiService.postCustomerDetails(customerDetails)
                    .then(() => {
                        expect(postDataStub.getCall(0).args[3]).toEqual({jobcity: "city" });
                        done();
                    });
            });

        });

        it("will catch error on getModels", (done) => {
            apiHttpClient.getData = sandbox.stub().rejects("error");
            bridgeApiService.getModels("99-999-99").catch((err) => {
                expect(err).toBeDefined();
                done();
            });
        });

    });

});
