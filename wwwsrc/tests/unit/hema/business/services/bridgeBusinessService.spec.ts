/// <reference path="../../../../../typings/app.d.ts" />
// import {ConsumablesBasket} from "./../../../../../app/hema/business/models/consumablesBasket";
import {IBridgeApiService} from "../../../../../app/hema/api/services/interfaces/IBridgeApiService";
import {IAdaptModel} from "../../../../../app/hema/api/models/adapt/IAdaptModel";
import {IAdaptModelAttribute} from "../../../../../app/hema/api/models/adapt/IAdaptModelAttribute";
import {IAdaptModelAttributeResponse} from "../../../../../app/hema/api/models/adapt/IAdaptModelAttributeResponse";
import {IAdaptModelResponse} from "../../../../../app/hema/api/models/adapt/IAdaptModelResponse";
import {AdaptAttributeConstants} from "../../../../../app/hema/business/services/constants/adaptAttributeConstants";
import {AdaptAvailabilityAttributeType} from "../../../../../app/hema/business/services/constants/adaptAvailabilityAttributeType";
import {ExternalApplianceAppModel} from "../../../../../app/hema/business/models/adapt/externalApplianceAppModel";
import {IJobService} from "../../../../../app/hema/business/services/interfaces/IJobService";
import {EventAggregator} from "aurelia-event-aggregator";
import {IPartFactory} from "../../../../../app/hema/business/factories/interfaces/IPartFactory";
import {JobState} from "../../../../../app/hema/business/models/jobState";
import {Threading} from "../../../../../app/common/core/threading";
import {IAdaptPartsSelectedResponse} from "../../../../../app/hema/api/models/adapt/IAdaptPartsSelectedResponse";
import {IAdaptPartSelected} from "../../../../../app/hema/api/models/adapt/IAdaptPartSelected";
import {Job} from "../../../../../app/hema/business/models/job";
import {PartFactory} from "../../../../../app/hema/business/factories/partFactory";
import * as moment from "moment";
import {IBusinessRuleService} from "../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import {JobServiceConstants} from "../../../../../app/hema/business/services/constants/jobServiceConstants";
import {IConfigurationService} from "../../../../../app/common/core/services/IConfigurationService";
import {IConsumableService} from "../../../../../app/hema/business/services/interfaces/IConsumableService";
import {QueryableBusinessRuleGroup} from "../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import {IBusinessRule} from "../../../../../app/hema/business/models/reference/IBusinessRule";
import {ICatalogService} from "../../../../../app/hema/business/services/interfaces/ICatalogService";
import {IGoodsType} from "../../../../../app/hema/business/models/reference/IGoodsType";
import * as bignumber from "bignumber";
import {IQuoteCustomerDetails} from "../../../../../app/hema/api/models/adapt/IQuoteCustomerDetails";
import {CustomerContact} from "../../../../../app/hema/business/models/customerContact";
import {Contact} from "../../../../../app/hema/business/models/contact";
import {Premises} from "../../../../../app/hema/business/models/premises";
import {Address} from "../../../../../app/hema/business/models/address";
import {AdaptBusinessServiceConstants} from "../../../../../app/hema/business/services/constants/adaptBusinessServiceConstants";
import {BridgeBusinessService} from "../../../../../app/hema/business/services/bridgeBusinessService";
import { AppConstants } from "../../../../../app/appConstants";
import { ITrainingModeConfiguration } from "../../../../../app/hema/business/services/interfaces/ITrainingModeConfiguration";

describe("the BridgeBusinessService module", () => {
    let sandbox: Sinon.SinonSandbox;
    let bridgeApiServiceStub: IBridgeApiService;
    let bridgeBusinessService: BridgeBusinessService;
    let jobBusinessServiceStub: IJobService;
    let eventAggregatorStub: EventAggregator;
    let partFactoryStub: IPartFactory;
    let businessRuleServiceStub: IBusinessRuleService;
    let configurationServiceStub: IConfigurationService;
    let businessServiceStub: IBusinessRuleService;
    let consumableServiceStub: IConsumableService;
    let catalogServiceStub: ICatalogService;
    let subscribeSpy: Sinon.SinonSpy;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        bridgeApiServiceStub = <IBridgeApiService>{};
        jobBusinessServiceStub = <IJobService>{};
        eventAggregatorStub = <EventAggregator>{};
        partFactoryStub = <IPartFactory>{};
        businessRuleServiceStub = <IBusinessRuleService>{};
        configurationServiceStub = <IConfigurationService>{};
        businessServiceStub = <IBusinessRuleService>{};
        consumableServiceStub = <IConsumableService>{};
        catalogServiceStub = <ICatalogService>{};

        catalogServiceStub.getGoodsType = sandbox.stub().resolves(null);

        subscribeSpy = eventAggregatorStub.subscribe = sandbox.stub().resolves(null);
        eventAggregatorStub.publish = sandbox.stub();

        configurationServiceStub.getConfiguration = sandbox.stub().resolves({});
        bridgeApiServiceStub.getPartsSelected = sandbox.stub().resolves(null);
        let businessRules = new QueryableBusinessRuleGroup();
        businessRules.rules = <IBusinessRule[]>[
            {id: "isPartConsumableStockReferencePrefix", rule: "C,F"}
        ];
        businessServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(businessRules);
    });

    afterEach(() => {
        // if any of the tests have kicked-off the monitoring we need to make sure it is killed
        if (bridgeBusinessService) {
            bridgeBusinessService.stopStartAdaptMonitoring(false);
        }

        sandbox.restore();
    });

    it("can be created", () => {
        bridgeBusinessService = new BridgeBusinessService(bridgeApiServiceStub, jobBusinessServiceStub, eventAggregatorStub, partFactoryStub,
            configurationServiceStub, businessServiceStub, consumableServiceStub, catalogServiceStub);
        expect(bridgeBusinessService).toBeDefined();
    });

    describe("the getApplianceInformation function", () => {

        let getModelAttributesSpy: Sinon.SinonStub;
        let getModelsSpy: Sinon.SinonStub;

        beforeEach(() => {
            // arrange

            let model: IAdaptModel = <IAdaptModel>{};
            model.imModKey = 122;
            let modelAttribute: IAdaptModelAttribute = {
                attributeType: "serviceListed",
                attributeValue: "true"
            };

            let modelResponse = <IAdaptModelResponse>{};
            modelResponse.models = [model];
            let modelAttributeResponse = <IAdaptModelAttributeResponse>{};
            modelAttributeResponse.attributes = [modelAttribute];

            getModelsSpy = sandbox.stub().resolves(modelResponse);
            getModelAttributesSpy = sandbox.stub().resolves(modelAttributeResponse);

            bridgeApiServiceStub.getModels = getModelsSpy;
            bridgeApiServiceStub.getModelAttributes = getModelAttributesSpy;

            bridgeBusinessService = new BridgeBusinessService(bridgeApiServiceStub, jobBusinessServiceStub, eventAggregatorStub, partFactoryStub,
                configurationServiceStub, businessServiceStub, consumableServiceStub, catalogServiceStub);
        });

        it("should return appliance information instance", (done) => {

            // act
            bridgeBusinessService.getApplianceInformation("1234").then((data: ExternalApplianceAppModel) => {
                // assert
                expect(data).not.toBeNull();
                done();
            }).catch((error) => {
                fail(error);
            });
        });

        it("should call api to get models", (done) => {

            // act
            bridgeBusinessService.getApplianceInformation("1234").then(() => {
                // assert
                sinon.assert.calledWith(getModelsSpy, "1234");
                done();
            }).catch((error) => {
                fail(error);
            });
        });

        it("should call api to get model attributes", (done) => {

            // act
            bridgeBusinessService.getApplianceInformation("1234").then(() => {
                // assert
                sinon.assert.calledWith(getModelAttributesSpy, 122);
                done();
            }).catch((error) => {
                fail(error);
            });
        });

        it("should throw business exception if getModelAttributes call errors", () => {

            getModelsSpy = sandbox.stub().rejects(false);
            getModelAttributesSpy = sandbox.stub().rejects(false);

            bridgeApiServiceStub.getModels = getModelsSpy;
            bridgeApiServiceStub.getModelAttributes = getModelAttributesSpy;

            bridgeBusinessService = new BridgeBusinessService(bridgeApiServiceStub, jobBusinessServiceStub, eventAggregatorStub, partFactoryStub,
                configurationServiceStub, businessServiceStub, consumableServiceStub, catalogServiceStub);

            bridgeBusinessService.getApplianceInformation("").catch(() => {

            });

        });

        afterEach(() => {
            sandbox.restore();
        });

    });

    describe("when more than one model associated to an appliance", () => {
        it("should return the description and manufacturer of the first model in the response", (done) => {
            let response: IAdaptModelResponse = <IAdaptModelResponse>{};
            response.models = [
                <IAdaptModel>{description: "foo", manufacturer: "bar"},
                <IAdaptModel>{description: "baz", manufacturer: "qux"}
            ];

            bridgeApiServiceStub.getModels = sandbox.stub().resolves(response);
            bridgeApiServiceStub.getModelAttributes = sandbox.stub().resolves([]);
            bridgeBusinessService = new BridgeBusinessService(bridgeApiServiceStub, jobBusinessServiceStub, eventAggregatorStub, partFactoryStub,
                configurationServiceStub, businessServiceStub, consumableServiceStub, catalogServiceStub);
            bridgeBusinessService.getApplianceInformation("1234").then((actual) => {
                expect(actual.description).toBe("foo");
                expect(actual.manufacturer).toBe("bar");
                done();
            });
        });
    });

    describe("when more than one model associated to an appliance, show worst case scenario", () => {

        let getModelAttributesSpy: Sinon.SinonStub;

        let slModel: IAdaptModel = <IAdaptModel>{};
        slModel.imModKey = 122;
        let wModel: IAdaptModel = <IAdaptModel>{};
        wModel.imModKey = 123;
        let rslModel: IAdaptModel = <IAdaptModel>{};
        rslModel.imModKey = 124;
        let riskModel: IAdaptModel = <IAdaptModel>{};
        riskModel.imModKey = 125;
        let ceasedModel: IAdaptModel = <IAdaptModel>{};
        ceasedModel.imModKey = 126;
        let folioModel: IAdaptModel = <IAdaptModel>{};
        folioModel.imModKey = 127;

        let slModelAttributes: IAdaptModelAttribute[] = [Object.assign({}, AdaptAttributeConstants.SERVICE_LISTED)];
        let wModelAttributes: IAdaptModelAttribute[] = [Object.assign({}, AdaptAttributeConstants.WITHDRAWN)];
        let rslModelAttributes: IAdaptModelAttribute[] = [Object.assign({}, AdaptAttributeConstants.REDUCED_PARTS_LIST)];
        let folioModelAttributes: IAdaptModelAttribute[] = [Object.assign({}, AdaptAttributeConstants.FOLIO)];
        let ceasedModelAttributes: IAdaptModelAttribute[] = [Object.assign({}, AdaptAttributeConstants.CEASED_PRODUCTION)];
        let riskModelAttributes: IAdaptModelAttribute[] = [Object.assign({}, AdaptAttributeConstants.SAFETY_NOTICE)];

        let response: IAdaptModelResponse = <IAdaptModelResponse>{}; // used by tests further down

        beforeEach(() => {

            getModelAttributesSpy = sandbox.stub();

            let response1: IAdaptModelAttributeResponse = <IAdaptModelAttributeResponse>{};
            response1.attributes = slModelAttributes;
            getModelAttributesSpy.withArgs(slModel.imModKey).resolves(response1);

            let response2: IAdaptModelAttributeResponse = <IAdaptModelAttributeResponse>{};
            response2.attributes = rslModelAttributes;
            getModelAttributesSpy.withArgs(rslModel.imModKey).resolves(response2);

            let response3: IAdaptModelAttributeResponse = <IAdaptModelAttributeResponse>{};
            response3.attributes = wModelAttributes;
            getModelAttributesSpy.withArgs(wModel.imModKey).resolves(response3);

            let response4: IAdaptModelAttributeResponse = <IAdaptModelAttributeResponse>{};
            response4.attributes = riskModelAttributes;
            getModelAttributesSpy.withArgs(riskModel.imModKey).resolves(response4);

            let response5: IAdaptModelAttributeResponse = <IAdaptModelAttributeResponse>{};
            response5.attributes = ceasedModelAttributes;
            getModelAttributesSpy.withArgs(ceasedModel.imModKey).resolves(response5);

            let response6: IAdaptModelAttributeResponse = <IAdaptModelAttributeResponse>{};
            response6.attributes = folioModelAttributes;
            getModelAttributesSpy.withArgs(folioModel.imModKey).resolves(response6);

            bridgeApiServiceStub.getModelAttributes = getModelAttributesSpy;
        });

        it("should return folio and safety if one model is folio and other risk", (done) => {

            response.models = [folioModel, riskModel];
            bridgeApiServiceStub.getModels = sandbox.stub().resolves(response);

            bridgeBusinessService = new BridgeBusinessService(bridgeApiServiceStub, jobBusinessServiceStub, eventAggregatorStub, partFactoryStub,
                configurationServiceStub, businessServiceStub, consumableServiceStub, catalogServiceStub);

            bridgeBusinessService.getApplianceInformation("1234").then((actual) => {
                expect(actual.safetyNotice).toBe(true);
                expect(actual.availabilityStatus).toBe(AdaptAvailabilityAttributeType.FOLIO);
                done();
            });
        });

        it("if all possible model attributes, correct precedence applied and reported", (done) => {
            response.models = [ceasedModel, ceasedModel, folioModel, riskModel, rslModel, slModel, wModel];
            bridgeApiServiceStub.getModels = sandbox.stub().resolves(response);

            bridgeBusinessService = new BridgeBusinessService(bridgeApiServiceStub, jobBusinessServiceStub, eventAggregatorStub, partFactoryStub,
                configurationServiceStub, businessServiceStub, consumableServiceStub, catalogServiceStub);

            bridgeBusinessService.getApplianceInformation("1234").then((actual) => {
                expect(actual.ceased).toBe(true);
                expect(actual.availabilityStatus).toEqual(AdaptAvailabilityAttributeType.FOLIO);
                expect(actual.safetyNotice).toBe(true);
                done();
            });
        });

        it("if reduced and service listed attributes, availability status should be service listed", (done) => {
            response.models = [rslModel, slModel];
            bridgeApiServiceStub.getModels = sandbox.stub().resolves(response);
            bridgeBusinessService = new BridgeBusinessService(bridgeApiServiceStub, jobBusinessServiceStub, eventAggregatorStub, partFactoryStub,
                configurationServiceStub, businessServiceStub, consumableServiceStub, catalogServiceStub);

            bridgeBusinessService.getApplianceInformation("1234").then((actual) => {
                expect(actual.availabilityStatus).toEqual(AdaptAvailabilityAttributeType.REDUCED_PARTS_LIST);
                done();
            });

        });

        it("if folio and withdrawn attributes, availability status should be folio", (done) => {

            response.models = [folioModel, wModel];
            bridgeApiServiceStub.getModels = sandbox.stub().resolves(response);
            bridgeBusinessService = new BridgeBusinessService(bridgeApiServiceStub, jobBusinessServiceStub, eventAggregatorStub, partFactoryStub,
                configurationServiceStub, businessServiceStub, consumableServiceStub, catalogServiceStub);

            bridgeBusinessService.getApplianceInformation("1234").then((actual) => {
                expect(actual.availabilityStatus).toEqual(AdaptAvailabilityAttributeType.FOLIO);
                done();
            });
        });

        it("if both models are ceased should show ceased", (done) => {
            response.models = [ceasedModel, ceasedModel];
            bridgeApiServiceStub.getModels = sandbox.stub().resolves(response);
            bridgeBusinessService = new BridgeBusinessService(bridgeApiServiceStub, jobBusinessServiceStub, eventAggregatorStub, partFactoryStub,
                configurationServiceStub, businessServiceStub, consumableServiceStub, catalogServiceStub);

            bridgeBusinessService.getApplianceInformation("1234").then((actual) => {
                expect(actual.ceased).toBe(true);
                done();
            });
        });

    });

    describe("the formatGCCode function", () => {
        beforeEach(() => {
            bridgeBusinessService = new BridgeBusinessService(bridgeApiServiceStub, jobBusinessServiceStub, eventAggregatorStub, partFactoryStub,
                configurationServiceStub, businessServiceStub, consumableServiceStub, catalogServiceStub);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("returns original gcCode if smaller than 7 chars", () => {
            let shortCode = "123456";

            let formattedCode = bridgeBusinessService.formatGCCode(shortCode);

            expect(formattedCode).toEqual(shortCode);
        });

        it("returns original gcCode if longer than 7 chars", () => {
            let longerCode = "12345678";

            let formattedCode = bridgeBusinessService.formatGCCode(longerCode);

            expect(formattedCode).toEqual(longerCode);
        });

        it("returns formatted gcCode", () => {
            let longerCode = "1234567";

            let formattedCode = bridgeBusinessService.formatGCCode(longerCode);

            expect(formattedCode).toEqual("12-345-67");
        });
    });

    describe("the initialise function", () => {
        let stopStartAdaptMonitoringSpy: Sinon.SinonSpy;

        beforeEach(() => {
            bridgeBusinessService = new BridgeBusinessService(bridgeApiServiceStub, jobBusinessServiceStub, eventAggregatorStub, partFactoryStub,
                configurationServiceStub, businessServiceStub, consumableServiceStub, catalogServiceStub);
            stopStartAdaptMonitoringSpy = bridgeBusinessService.stopStartAdaptMonitoring = sandbox.spy();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can set up a subscription to job state changed when not in training mode", done => {
            bridgeBusinessService.initialise().then(() => {
                expect(subscribeSpy.called).toBe(true);
                expect(subscribeSpy.args[0][0]).toBe(JobServiceConstants.JOB_STATE_CHANGED);
                expect(subscribeSpy.args[0][1]).toBeDefined();
                done();
            })
        });

        it("can not set up a subscription to job state changed when in training mode", done => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns(<ITrainingModeConfiguration>{trainingMode: true});
            bridgeBusinessService.initialise().then(() => {
                expect(subscribeSpy.called).toBe(false);
                done();
            });
        });

        it("can be called and call stopStartAdaptMonitoring", (done) => {
            bridgeBusinessService.initialise()
                .then(() => {
                    expect(stopStartAdaptMonitoringSpy.calledWith(true)).toBe(true);
                    done();
                })
                .catch((error) => {
                    fail("should not be here: " + error);
                    done();
                });
        });

        describe("can set up a subscription to call exportCustomerDetails", () => {
            let exportStub: Sinon.SinonSpy;
            beforeEach(() => {
                exportStub = bridgeBusinessService.exportCustomerDetails = sinon.stub().resolves(null);
            });

            it("and call exportCustomerDetails when job state changes and a job is active", done => {
                jobBusinessServiceStub.getActiveJobId = sandbox.stub().resolves("1234567");

                bridgeBusinessService.initialise()
                    .then(() => {
                        let [subscriptionKey, subscriptionHandler] = subscribeSpy.args[0];
                        expect(subscriptionKey).toBe(JobServiceConstants.JOB_STATE_CHANGED);

                        subscriptionHandler().then(() => {
                            expect(exportStub.called).toBe(true);
                            done();
                        });

                    });
            });

            it("and not call exportCustomerDetails when job state changes and a job is not active", done => {
              jobBusinessServiceStub.getActiveJobId = sandbox.stub().resolves(null);

                bridgeBusinessService.initialise()
                    .then(() => {
                        let [subscriptionKey, subscriptionHandler] = subscribeSpy.args[0];
                        expect(subscriptionKey).toBe(JobServiceConstants.JOB_STATE_CHANGED);

                        subscriptionHandler().then(() => {
                            expect(exportStub.called).toBe(false);
                            done();
                        });

                    });
            });
        });
    });

    describe("the stopStartAdaptMonitoring function", () => {
        let eventAggregator: EventAggregator = new EventAggregator();
        let _startTimer = Threading.startTimer;
        let _stopTimer = Threading.stopTimer;

        let startTimerCallback: Sinon.SinonStub;
        let stopTimerCallback: Sinon.SinonSpy;

        beforeEach(() => {
            bridgeBusinessService = new BridgeBusinessService(bridgeApiServiceStub, jobBusinessServiceStub, eventAggregator, partFactoryStub,
                configurationServiceStub, businessServiceStub, consumableServiceStub, catalogServiceStub);

            startTimerCallback = sandbox.stub();
            Threading.startTimer = (func: any, timeout: number): number => {
                startTimerCallback(func, timeout);
                func();
                return 99;
            };

            Threading.stopTimer = stopTimerCallback = sandbox.spy();

            bridgeBusinessService.monitorAdaptPartsSelectedElapsed = sandbox.stub();
        });

        afterEach(() => {
            Threading.startTimer = _startTimer;
            Threading.stopTimer = _stopTimer;
            sandbox.restore();
        });

        it("it can start monitoring if config has a polling interval", () => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns({adaptPollingInterval: 10});
            spyOn(bridgeBusinessService, "monitorAdaptPartsSelectedElapsed");

            bridgeBusinessService.stopStartAdaptMonitoring(true);

            expect(startTimerCallback.calledWith(sinon.match.any, 10)).toBe(true);
            expect(stopTimerCallback.called).toBe(false);
            expect(bridgeBusinessService.monitorAdaptPartsSelectedElapsed).toHaveBeenCalled();
        });

        it("it can not start monitoring if config has no polling interval", () => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns({});

            bridgeBusinessService.stopStartAdaptMonitoring(true);

            expect(startTimerCallback.called).toBe(false);
            expect(stopTimerCallback.called).toBe(false);
        });

        it("it can not start monitoring if config has 0 polling interval", () => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns({adaptPollingInterval: 0});

            bridgeBusinessService.stopStartAdaptMonitoring(true);

            expect(startTimerCallback.called).toBe(false);
            expect(stopTimerCallback.called).toBe(false);
        });

        it("it can stop monitoring if a monitoring timer has been started", () => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns({adaptPollingInterval: 10});
            bridgeBusinessService.stopStartAdaptMonitoring(true);
            bridgeBusinessService.stopStartAdaptMonitoring(false);

            expect(stopTimerCallback.calledWith(99)).toBe(true);
        });

        it("it can not stop monitoring if a monitoring timer has not been started", () => {
            configurationServiceStub.getConfiguration = sandbox.stub().returns({adaptPollingInterval: 10});
            bridgeBusinessService.stopStartAdaptMonitoring(false);

            expect(stopTimerCallback.called).toBe(false);
        });
    });

    describe("the monitorAdaptPartsSelectedElapsed function", () => {
        let adaptPartsSelectedResponse: IAdaptPartsSelectedResponse;

        let job: Job;
        let dateToUse: Date = new Date();
        let adaptPartSelected: IAdaptPartSelected;

        beforeEach(() => {

            adaptPartSelected = <IAdaptPartSelected>{};
            adaptPartSelected.timestamp = moment(dateToUse).toJSON();
            adaptPartSelected.description = "Washer C5";
            adaptPartSelected.price = 49;
            adaptPartSelected.stockReferenceId = "P123456789";

            adaptPartsSelectedResponse = <IAdaptPartsSelectedResponse>{};
            adaptPartsSelectedResponse.parts = [adaptPartSelected];

            job = new Job();
            job.onsiteTime = moment(dateToUse).subtract(10, "minutes").toDate();

            jobBusinessServiceStub.getActiveJobId = sandbox.stub().resolves(1);
            jobBusinessServiceStub.getJob = sandbox.stub().resolves(job);
            jobBusinessServiceStub.setJob = sandbox.stub().resolves(null);

            let partFactory = new PartFactory(businessRuleServiceStub);

            bridgeBusinessService = new BridgeBusinessService(bridgeApiServiceStub, jobBusinessServiceStub, eventAggregatorStub, partFactory,
                configurationServiceStub, businessServiceStub, consumableServiceStub, catalogServiceStub);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can be called", (done) => {
            bridgeBusinessService.monitorAdaptPartsSelectedElapsed()
                .then(() => {
                    done();
                });
        });

        it("can disable monitoring on exception", (done) => {
            let startStopSpy = sandbox.spy(bridgeBusinessService, "stopStartAdaptMonitoring");

            bridgeApiServiceStub.getPartsSelected = sandbox.stub().rejects(null);
            bridgeBusinessService.monitorAdaptPartsSelectedElapsed()
                .then(() => {
                    expect(startStopSpy.firstCall.calledWith(false));
                    done();
                });
        });

        it("can show warning on exception", (done) => {
            let publish = (<Sinon.SinonStub>eventAggregatorStub.publish)
            bridgeApiServiceStub.getPartsSelected = sandbox.stub().rejects(null);

            bridgeBusinessService.monitorAdaptPartsSelectedElapsed()
                .then(() => {
                    expect(publish.alwaysCalledWith(AppConstants.APP_TOAST_ADDED));
                    expect(publish.args[0][1].style).toEqual("warning");
                    done();
                });
        });

        it("can handle no parts", (done) => {
            bridgeApiServiceStub.getPartsSelected = sandbox.stub().resolves(null);

            bridgeBusinessService.monitorAdaptPartsSelectedElapsed()
                .then(() => {
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        it("can handle no parts list", (done) => {

            adaptPartsSelectedResponse.parts = [];
            bridgeApiServiceStub.getPartsSelected = sandbox.stub().resolves(adaptPartsSelectedResponse);

            bridgeBusinessService.monitorAdaptPartsSelectedElapsed()
                .then(() => {
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        it("can handle no job active job id", (done) => {

            jobBusinessServiceStub.getActiveJobId = sandbox.stub().resolves(null);

            bridgeBusinessService.monitorAdaptPartsSelectedElapsed()
                .then(() => {
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        it("can handle no job found", (done) => {

            jobBusinessServiceStub.getJob = sandbox.stub().resolves(null);

            bridgeBusinessService.monitorAdaptPartsSelectedElapsed()
                .then(() => {
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        it("can handle no valid parts selected", (done) => {

            job.onsiteTime = moment(dateToUse).add(2, "hours").toDate();
            jobBusinessServiceStub.getJob = sandbox.stub().resolves(job);

            bridgeBusinessService.monitorAdaptPartsSelectedElapsed()
                .then(() => {
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        it("can add parts selected to the job and publish adapt and dataState events", (done) => {

            let methodSpy: Sinon.SinonSpy = jobBusinessServiceStub.setJob = sandbox.stub().resolves(null);
            let eventAggregatorPublishSpy: Sinon.SinonSpy = eventAggregatorStub.publish = sandbox.stub();
            bridgeApiServiceStub.getPartsSelected = sandbox.stub().resolves(adaptPartsSelectedResponse);

            job.state = JobState.arrived;

            bridgeBusinessService.monitorAdaptPartsSelectedElapsed()
                .then(() => {
                    expect(methodSpy.calledOnce).toBe(true);

                    let setJobArgument: Job = methodSpy.args[0][0];
                    let partId = setJobArgument.partsDetail.partsBasket.partsToOrder[0].id;

                    expect(eventAggregatorPublishSpy.calledWith(AdaptBusinessServiceConstants.ADAPT_PARTS_SELECTED, [partId])).toBe(true);
                    expect(eventAggregatorPublishSpy.calledWith(JobServiceConstants.JOB_DATA_STATE_CHANGED)).toBe(true);
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        it("can add parts selected to the job with different price", (done) => {
            let lookedUpPartGoodsType = <IGoodsType> {
                charge: 4900
            };

            catalogServiceStub.getGoodsType = sandbox.stub().resolves(lookedUpPartGoodsType);

            let methodSpy: Sinon.SinonSpy = jobBusinessServiceStub.setJob = sandbox.stub().resolves(null);
            bridgeApiServiceStub.getPartsSelected = sandbox.stub().resolves(adaptPartsSelectedResponse);

            job.state = JobState.arrived;

            bridgeBusinessService.monitorAdaptPartsSelectedElapsed()
                .then(() => {

                    let catalogLookedUpPartPrice = lookedUpPartGoodsType.charge
                        ? new bignumber.BigNumber(lookedUpPartGoodsType.charge / 100)
                        : new bignumber.BigNumber(0);

                    let setJobArgument: Job = methodSpy.args[0][0];
                    let isCatalogPriceDifferentFromAdapt = setJobArgument.partsDetail.partsBasket.partsToOrder[0].isCatalogPriceDifferentFromAdapt;
                    let updatedPartPrice = setJobArgument.partsDetail.partsBasket.partsToOrder[0].price;

                    expect(methodSpy.calledOnce).toBe(true);
                    expect(isCatalogPriceDifferentFromAdapt).toBe(true);
                    expect(updatedPartPrice).toEqual(catalogLookedUpPartPrice);
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });


        it("can add consumables selected to basket", (done) => {

            let addConsumableSpy: Sinon.SinonSpy = consumableServiceStub.addConsumableToBasket = sandbox.stub().resolves(null);
            let saveBasketSpy: Sinon.SinonSpy = consumableServiceStub.saveBasket = sandbox.stub().resolves({});
            consumableServiceStub.getConsumablesBasket = sandbox.stub().resolves({});

            adaptPartSelected.stockReferenceId = "C123456789";           
            bridgeApiServiceStub.getPartsSelected = sandbox.stub().resolves(adaptPartsSelectedResponse);

            job.state = JobState.done;

            bridgeBusinessService.buildBusinessRules()
                .then(() => bridgeBusinessService.monitorAdaptPartsSelectedElapsed())
                .then(() => {
                    expect(saveBasketSpy.calledOnce).toBe(true);
                    expect(addConsumableSpy.calledOnce).toBe(true);
                    done();
                });
        });

        it("can not add consumables selected to the job if part is not consumable", (done) => {

            let addConsumableSpy: Sinon.SinonSpy = consumableServiceStub.addConsumableToBasket = sandbox.stub().resolves(null);
            let saveBasketSpy: Sinon.SinonSpy = consumableServiceStub.saveBasket = sandbox.stub().resolves({});
            consumableServiceStub.getConsumablesBasket = sandbox.stub().resolves({});

            adaptPartSelected.stockReferenceId = "X123456789";
            bridgeApiServiceStub.getPartsSelected = sandbox.stub().resolves(adaptPartsSelectedResponse);

            job.state = JobState.done;

            bridgeBusinessService.buildBusinessRules()
                .then(() => bridgeBusinessService.monitorAdaptPartsSelectedElapsed())
                .then(() => {
                    expect(saveBasketSpy.called).toBe(false);
                    expect(addConsumableSpy.called).toBe(false);
                    done();
                });
        });

        it("should add consumables selected to basket and publish ADAPT_PARTS_SELECTED event", (done) => {
            let addConsumableSpy: Sinon.SinonSpy = consumableServiceStub.addConsumableToBasket = sandbox.stub().resolves(null);
            consumableServiceStub.getConsumablesBasket = sandbox.stub().resolves({});
            consumableServiceStub.saveBasket = sandbox.stub().resolves({});

            adaptPartsSelectedResponse.parts.push({
                stockReferenceId: "FFFFFFF",
                timestamp: "2019-08-22T16:58:25Z",
                description: "test",
                price: 10

            });
            adaptPartsSelectedResponse.parts.push({
                stockReferenceId: "FFFFFF1",
                timestamp: "2019-08-22T16:58:25Z",
                description: "test",
                price: 11

            });
            bridgeApiServiceStub.getPartsSelected = sandbox.stub().resolves(adaptPartsSelectedResponse);

            job.state = JobState.done;

            bridgeBusinessService.buildBusinessRules()
                .then(() => bridgeBusinessService.monitorAdaptPartsSelectedElapsed())
                .then(() => {
                    expect(addConsumableSpy.called).toBe(true);
                    expect((eventAggregatorStub.publish as Sinon.SinonStub).called).toBeTruthy();                    
                    expect((eventAggregatorStub.publish as Sinon.SinonStub).args[0][0]).toEqual("ADAPT_PARTS_SELECTED");
                    expect((eventAggregatorStub.publish as Sinon.SinonStub).args[0][1].length).toEqual(2);                                      
                    done();
                });
        });
    });

    describe("export customer details for quote tool", () => {

        let job: Job;
        const jobId = "1";

        let postCustomerDetailsSpy: Sinon.SinonStub;
        let postData: IQuoteCustomerDetails;

        beforeEach((done) => {

            job = new Job();

            job.id = "jobId";

            job.contact = <Contact>{};
            job.contact.lastName = "Mr CustFirstName CustLastName";
            job.contact.title = "BillTitle";
            job.contact.workPhone = "Workcontactnumber";
            job.contact.homePhone = "Homecontactnumber";

            const billAddress = [
                "Billaddress1",
                "Billaddress2"
            ];

            job.customerContact = <CustomerContact>{};
            job.customerContact.lastName = "Mr BillFirstName BillLastName";
            job.customerContact.address = <Address>{};
            job.customerContact.address.line = billAddress;
            job.customerContact.address.premisesName = "Billhousename";
            job.customerContact.address.houseNumber = "Billhousenumber";
            job.customerContact.address.town = "Billsuburb";
            job.customerContact.address.county = "Billcity";
            job.customerContact.address.postCodeIn = "Billpostin";
            job.customerContact.address.postCodeOut ="Billpostout";

            job.premises = <Premises>{};
            job.premises.address = <Address>{};
            job.premises.address.houseNumber="Jobhousenumber";
            job.premises.address.premisesName = "Jobhousename";
            const customerAddress = [
                "Jobaddress1",
                "Jobaddress2"
            ];
            job.premises.address.line = customerAddress;
            job.premises.address.town = "Jobsuburb";
            job.premises.address.county = "Jobcity";
            job.premises.address.postCodeIn = "Jobpostin";
            job.premises.address.postCodeOut ="Jobpostout";

            jobBusinessServiceStub.getActiveJobId = sandbox.stub().resolves(1);
            jobBusinessServiceStub.getJob = sandbox.stub().resolves(job);            

            let partFactory = new PartFactory(businessRuleServiceStub);

            postCustomerDetailsSpy = sandbox.stub().resolves(true);

            bridgeApiServiceStub.postCustomerDetails = postCustomerDetailsSpy;

            bridgeBusinessService = new BridgeBusinessService(bridgeApiServiceStub, jobBusinessServiceStub, eventAggregatorStub, partFactory,
                configurationServiceStub, businessServiceStub, consumableServiceStub, catalogServiceStub);

            // second parameter set to false, otherwise will only execute if activeJobState
            bridgeBusinessService.exportCustomerDetails(jobId, false).then(() => {

                postData = postCustomerDetailsSpy.args[0][0];
                done();
            });
        });

        it ("should map WMIS no", () => {
            const {wMISnumber} = postData;
            expect(wMISnumber).toEqual("jobId");
        });

        it ("should map biller details", () => {

            const {billName} = postData;
            expect(billName).toEqual("Mr BillFirstName BillLastName");
        });


        it ("should map customer details", () => {

            const {custName} = postData;
            expect(custName).toEqual("Mr CustFirstName CustLastName");
        });

        it ("should map job address details", () => {

            const {jobhousenumber, jobhousename, jobaddress1, jobaddress2, jobcity, jobsuburb, jobpostout, jobpostin} = postData;

            expect(jobhousenumber).toEqual("Jobhousenumber");
            expect(jobhousename).toEqual("Jobhousename");
            expect(jobaddress1).toEqual("Jobaddress1");
            expect(jobaddress2).toEqual("Jobaddress2");
            expect(jobcity).toEqual("Jobcity");
            expect(jobsuburb).toEqual("Jobsuburb");
            expect(jobpostout).toEqual("Jobpostout");
            expect(jobpostin).toEqual("Jobpostin");
        });


        it ("should map bill address details", () => {

            const {billhousenumber, billhousename, billstreet1, billstreet2, billcity, billsuburb, billpostout, billpostin} = postData;

            expect(billhousenumber).toEqual("Billhousenumber");
            expect(billhousename).toEqual("Billhousename");
            expect(billstreet1).toEqual("Billaddress1");
            expect(billstreet2).toEqual("Billaddress2");
            expect(billcity).toEqual("Billcity");
            expect(billsuburb).toEqual("Billsuburb");
            expect(billpostout).toEqual("Billpostout");
            expect(billpostin).toEqual("Billpostin");
        });

        it ("should map contact numbers", () => {

            const {workcontactnumber, homecontactnumber} = postData;

            expect(workcontactnumber).toEqual("Workcontactnumber");
            expect(homecontactnumber).toEqual("Homecontactnumber");
        });


        it("should handle errors", async done => {

            const spy = eventAggregatorStub.publish = sandbox.stub();

            bridgeApiServiceStub.postCustomerDetails = sandbox.stub().rejects("500");

            await bridgeBusinessService.exportCustomerDetails(jobId, false).then(() => {

                const arg1 = spy.args[0][0];
                const arg2 = spy.args[0][1];

                expect(arg1).toEqual(AppConstants.APP_TOAST_ADDED);
                expect(arg2.content).toEqual("Could not export customer details. Check Bridge Service and Quote folder exists");

                done()

            });
        })
    });
});
