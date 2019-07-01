/// <reference path="../../../../../../typings/app.d.ts" />

import {AppInit} from "../../../../../../app/hema/presentation/modules/initialisation/appInit";
import {IReferenceDataService} from "../../../../../../app/hema/business/services/interfaces/IReferenceDataService";
import {EventAggregator} from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";
import {IBridgeBusinessService} from "../../../../../../app/hema/business/services/interfaces/IBridgeBusinessService";
import {IEngineerService} from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import {IWorkRetrievalService} from "../../../../../../app/hema/business/services/interfaces/IWorkRetrievalService";
import {IConfigurationService} from "../../../../../../app/common/core/services/IConfigurationService";
import {IStorageService} from "../../../../../../app/hema/business/services/interfaces/IStorageService";
import {IDeviceService} from "../../../../../../app/common/core/services/IDeviceService";
import {IHttpHeaderProvider} from "../../../../../../app/common/resilience/services/interfaces/IHttpHeaderProvider";
import {IArchiveService} from "../../../../../../app/hema/business/services/interfaces/IArchiveService";
import { IMessageService } from "../../../../../../app/hema/business/services/interfaces/IMessageService";
import { IAnalyticsService } from "../../../../../../app/common/analytics/IAnalyticsService";
import { ToastPosition } from "../../../../../../app/common/ui/elements/models/toastPosition";
import {IEndpointConfiguration} from "../../../../../../app/common/resilience/models/IEndpointConfiguration";
import {IEndpointRouteConfiguration} from "../../../../../../app/common/resilience/models/IEndpointRouteConfiguration";
import {Configuration} from "../../../../../../app/configuration";
import {ICatalogService} from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import { IAuthenticationService } from "../../../../../../app/hema/business/services/interfaces/IAuthenticationService";
import { Engineer } from "../../../../../../app/hema/business/models/engineer";
import { BaseException } from "../../../../../../app/common/core/models/baseException";
import * as Logging from "aurelia-logging";
import { IWhoAmI } from "../../../../../../app/hema/api/models/fft/whoAmI/IWhoAmI";
import {IFeatureToggleService} from "../../../../../../app/hema/business/services/interfaces/IFeatureToggleService";
import { IVanStockEngine } from "../../../../../../app/hema/business/services/interfaces/IVanStockEngine";
import { IndexedDatabaseService } from "../../../../../../app/common/storage/indexedDatabaseService";
import { IHttpHelper } from "../../../../../../app/common/core/IHttpHelper";
import { PlatformHelper } from "../../../../../../app/common/core/platformHelper";
import { LogHelper } from "../../../../../../app/common/core/logHelper";
import { IAppLauncher } from "../../../../../../app/common/core/services/IAppLauncher";

describe("the AppInit module", () => {
    let sandbox: Sinon.SinonSandbox;
    let appInit: AppInit;
    let referenceDataSerivce: IReferenceDataService;
    let eaStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let adaptBusinessServiceStub: IBridgeBusinessService;
    let engineerServiceStub: IEngineerService;
    let workRetrievalServiceStub: IWorkRetrievalService;
    let configurationServiceStub: IConfigurationService;
    let storageServiceStub: IStorageService;
    let deviceServiceStub: IDeviceService;
    let fftHeaderProviderStub: IHttpHeaderProvider;
    let archiveServiceStub: IArchiveService;
    let messageServiceStub: IMessageService;
    let analyticsServiceStub: IAnalyticsService;
    let appSettingsSpy: Sinon.SinonStub;
    let catalogServiceStub: ICatalogService;
    let authenticationServiceStub: IAuthenticationService;
    let loggingSpy: Sinon.SinonSpy;
    let realLoggingGetLogger: any;
    let featureToggleServiceStub: IFeatureToggleService;
    let vanStockEngineStub: IVanStockEngine
    let indexedDBService: IndexedDatabaseService;
    let httpHelperStub: IHttpHelper;
    let appLauncherSetub: IAppLauncher;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        referenceDataSerivce = <IReferenceDataService>{};
        referenceDataSerivce.getVersions = sandbox.stub().returns(null);
        referenceDataSerivce.getItems = sandbox.stub().resolves(null);

        fftHeaderProviderStub = <IHttpHeaderProvider>{};
        fftHeaderProviderStub.setStaticHeaders = sandbox.stub();
        fftHeaderProviderStub.getHeaders = sandbox.stub().resolves([]);

        eaStub = <EventAggregator>{};
        eaStub.subscribe = sandbox.stub();
        eaStub.subscribeOnce = sandbox.stub();
        eaStub.publish = sandbox.stub().returns(Promise.resolve());

        dialogServiceStub = <DialogService>{};
        adaptBusinessServiceStub = <IBridgeBusinessService>{};
        engineerServiceStub = <IEngineerService>{};

        workRetrievalServiceStub = <IWorkRetrievalService>{};
        configurationServiceStub = <IConfigurationService>{};
        storageServiceStub = <IStorageService>{};

        archiveServiceStub = <IArchiveService>{};
        archiveServiceStub.initialise = sandbox.stub().resolves(undefined);
        archiveServiceStub.migrate = sandbox.stub().resolves(undefined);

        messageServiceStub = <IMessageService>{};
        messageServiceStub.initialise = sandbox.stub().resolves(undefined);

        analyticsServiceStub = <IAnalyticsService>{};
        analyticsServiceStub.initialize = sandbox.stub().resolves(undefined);
        analyticsServiceStub.setUserId = sandbox.stub();

        deviceServiceStub = <IDeviceService>{};
        deviceServiceStub.getDeviceId = sandbox.stub().resolves("111");
        deviceServiceStub.getDeviceType = sandbox.stub().resolves("TEST");

        appSettingsSpy = sandbox.stub().resolves(null);
        storageServiceStub.setAppSettings = appSettingsSpy;
        storageServiceStub.getAppSettings = sandbox.stub().resolves({});
        storageServiceStub.getLastSuccessfulSyncTime = sandbox.stub().resolves(9999);
        storageServiceStub.setLastSuccessfulSyncTime = sandbox.stub().resolves(null);

        configurationServiceStub.getConfiguration = sandbox.stub().returns({});

        referenceDataSerivce.initialise = sandbox.stub().returns(Promise.resolve());
        adaptBusinessServiceStub.initialise = sandbox.stub().returns(Promise.resolve());

        engineerServiceStub.getCurrentEngineer = sandbox.stub().resolves(<Engineer>{});
        engineerServiceStub.initialise = sandbox.stub().resolves(null);

        engineerServiceStub.overrideEngineerId = sandbox.stub().resolves({id: "1111111"});
        workRetrievalServiceStub.initialise = sandbox.stub().returns(Promise.resolve());

        featureToggleServiceStub = <IFeatureToggleService>{};
        featureToggleServiceStub.initialise = sandbox.stub().returns(Promise.resolve());

        catalogServiceStub = <ICatalogService>{};
        catalogServiceStub.loadConsumables = sandbox.stub().resolves(Promise.resolve());

        authenticationServiceStub = <IAuthenticationService>{};
        authenticationServiceStub.authenticate = sandbox.stub().resolves({});

        vanStockEngineStub = <IVanStockEngine>{};

        appLauncherSetub = <IAppLauncher> {};
        appLauncherSetub.launchApplication = sandbox.stub();

        realLoggingGetLogger = Logging.getLogger;
        loggingSpy = sandbox.spy();
        (<any>Logging)["getLogger"] = sandbox.stub().returns({
            debug:  loggingSpy,
            info:   loggingSpy,
            warn:   loggingSpy,
            error:  loggingSpy
        });

        indexedDBService = <IndexedDatabaseService>{};

        httpHelperStub = <IHttpHelper> {};
        httpHelperStub.intialise = sandbox.stub();

        appInit = new AppInit(
            referenceDataSerivce,
            eaStub,
            dialogServiceStub,
            adaptBusinessServiceStub,
            engineerServiceStub,
            workRetrievalServiceStub,
            configurationServiceStub,
            storageServiceStub,
            deviceServiceStub,
            fftHeaderProviderStub,
            archiveServiceStub,
            messageServiceStub,
            analyticsServiceStub,
            catalogServiceStub,
            authenticationServiceStub,
            indexedDBService,
            featureToggleServiceStub,
            vanStockEngineStub,
            httpHelperStub,
            appLauncherSetub);
    });

    afterEach(() => {
        (<any>Logging)["getLogger"] = realLoggingGetLogger;
        sandbox.restore();
    });

    it("can be created", () => {
        expect(appInit).toBeDefined();
    });

    it("attachedAsync initialises reference data", done => {
        appInit.attachedAsync(). then(() => {
            expect((referenceDataSerivce.initialise as Sinon.SinonStub).called).toBe(true);
            done();
        });
    });

    it("attachedAsync initialises feature toggle service", done => {
        appInit.attachedAsync(). then(() => {
            expect((featureToggleServiceStub.initialise as Sinon.SinonStub).called).toBe(true);
            done();
        });
    });

    it("attachedAsync loads consumables", done => {
        appInit.attachedAsync(). then(() => {
            expect((catalogServiceStub.loadConsumables as Sinon.SinonStub).called).toBe(true);
            done();
        });
    });

    describe("overrideEngineerId", () => {
        it("should call engineerService.overrideEngineerId method", done => {
            appInit.attachedAsync(). then(() => {
                expect((engineerServiceStub.overrideEngineerId as Sinon.SinonStub).called).toBe(true);
                done();
            });
        });

        it("should not call engineerService.overrideEngineerId method when training mode is enabled", done => {
            let configuration = new Configuration();
            configuration.trainingMode = true;
            configurationServiceStub.getConfiguration =  sandbox.stub().returns(configuration);

            appInit.attachedAsync(). then(() => {
                expect((engineerServiceStub.overrideEngineerId as Sinon.SinonStub).called).toBe(false);
                done();
            });
        })
    });

    describe("with no saved application settings", () => {

        beforeEach(() => {
            storageServiceStub.getAppSettings = sandbox.stub().resolves({});
        });

        it("and no supplied defaults, uses sensible defaults", (done) => {

            configurationServiceStub.getConfiguration = sandbox.stub().returns({});

            appInit.attachedAsync().then(() => {
                let results = appSettingsSpy.args[0][0];
                expect(results.dropdownType).toEqual(1);
                expect(results.notificationDisplayTime).toEqual(5);
                expect(results.notificationPosition).toEqual(ToastPosition.bottomcenter);
                expect(results.minItemsToCategoriseSmashButtons).toEqual(-1);
                done();
            });
        });

        it("and with supplied defaults, uses those supplied defaults", (done) => {

            configurationServiceStub.getConfiguration = sandbox.stub().returns({
                notificationPosition: 6,
                notificationDisplayTime: 6,
                dropdownType: 6,
                minItemsToCategoriseSmashButtons: 16
            });

            appInit.attachedAsync().then(() => {
                let results = appSettingsSpy.args[0][0];
                expect(results.dropdownType).toEqual(6);
                expect(results.notificationDisplayTime).toEqual(6);
                expect(results.notificationPosition).toEqual(6);
                expect(results.minItemsToCategoriseSmashButtons).toEqual(16);
                done();
            });
        });


    });

    describe("with saved application settings", () => {

        beforeEach(() => {
            storageServiceStub.getAppSettings = sandbox.stub().resolves({
                notificationPosition: 7,
                notificationDisplayTime: 7,
                dropdownType: 7,
                minItemsToCategoriseSmashButtons: 17
            });
        });

        it("and no supplied defaults, uses saved settings", (done) => {

            configurationServiceStub.getConfiguration = sandbox.stub().returns({});

            appInit.attachedAsync().then(() => {
                let results = appSettingsSpy.args[0][0];
                expect(results.dropdownType).toEqual(7);
                expect(results.notificationDisplayTime).toEqual(7);
                expect(results.notificationPosition).toEqual(7);
                expect(results.minItemsToCategoriseSmashButtons).toEqual(17);
                done();
            });
        });

        it("and with supplied defaults, uses saved settings", (done) => {

            configurationServiceStub.getConfiguration = sandbox.stub().returns({
                notificationPosition: 6,
                notificationDisplayTime: 6,
                dropdownType: 6,
                minItemsToCategoriseSmashButtons: 16
            });

            appInit.attachedAsync().then(() => {
                let results = appSettingsSpy.args[0][0];
                expect(results.dropdownType).toEqual(7);
                expect(results.notificationDisplayTime).toEqual(7);
                expect(results.notificationPosition).toEqual(7);
                expect(results.minItemsToCategoriseSmashButtons).toEqual(17);
                done();
            });
        });

    });

    describe("Training mode in production", () => {
        let setEngineerSpy: Sinon.SinonSpy;
        let getSimulationEngineerSpy: Sinon.SinonSpy;
        let configuration;

        beforeEach(() => {
            setEngineerSpy = storageServiceStub.setEngineer = sandbox.stub();
            configurationServiceStub.getConfiguration = sandbox.stub().returns({});
            getSimulationEngineerSpy = storageServiceStub.getSimulationEngineer = sandbox.stub().resolves("0000001");

            configuration = new Configuration();
            configuration.trainingMode = true;
            let route = <IEndpointRouteConfiguration> {
                "route": "whoAmI",
                "path": "whoami/v1",
                "client": "prod"
            };
            configuration.whoAmIServiceEndpoint = <IEndpointConfiguration> {routes : [route]};
            configurationServiceStub.getConfiguration =  sandbox.stub().returns(configuration);
        });

        it("should call storageService setEngineer method passing engineer object as a parameter that contains the simulation Engineerid as engineerid", async (done) => {
            await appInit.attachedAsync();
            expect(setEngineerSpy.calledWith({id: "0000001"})).toBeTruthy();
            expect(getSimulationEngineerSpy.called).toBeTruthy();
            done();
        });

        it("should not call storageService getSimulationEngineer and setEngineer method", async (done) => {
            configuration.trainingMode = false;
            await appInit.attachedAsync();
            expect(setEngineerSpy.notCalled).toBeTruthy();
            expect(getSimulationEngineerSpy.notCalled).toBeTruthy();
            done();
        });

        // todo need to est why?
        // it("should not call storageService getSimulationEngineer and setEngineer method for traning mode other non-prod env", async (done) => {
        //     configuration.trainingMode = true;
        //     let route = <IEndpointRouteConfiguration> {
        //         "route": "whoAmI",
        //         "path": "whoami/v1",
        //         "client": "simulation"
        //     };
        //     configuration.whoAmIServiceEndpoint = <IEndpointConfiguration> {routes : [route]};
        //     await appInit.attachedAsync();
        //     expect(setEngineerSpy.notCalled).toBeTruthy();
        //     expect(getSimulationEngineerSpy.notCalled).toBeTruthy();
        //     done();
        // });
    });

    describe("overriding configuration settings", () => {
        let overrideStub: Sinon.SinonStub;
        beforeEach(() => {
            overrideStub = configurationServiceStub.overrideSettings = sandbox.stub();
        });

        it("can leave configuration settings alone if no overrides", async done => {
            await appInit.attachedAsync();
            expect(overrideStub.called).toBe(false);
            done();
        });

        it("can overrides configsettings from refernce data", async done => {
            referenceDataSerivce.getItems = sandbox.stub().resolves([
                { key: "foo", value: "bar" }
            ]);

            await appInit.attachedAsync();
            expect(overrideStub.args[0][0]).toEqual({foo: "bar"});
            done();
        });
    });

    describe("errors", () => {
        let exception = new BaseException(null, "reference", "foo {0} {1}", ["bar", "baz"], null);

        describe("error messages", () => {
            it("sets error for non-BaseException exceptions", async done => {
                authenticationServiceStub.authenticate = sandbox.stub().rejects(new Error("foo"));
                expect(appInit.error).toBeFalsy();
                await appInit.attachedAsync();

                expect(appInit.error).toBe("Error: foo");
                done();

            });

            it("sets error for BaseException exceptions", async done => {
                authenticationServiceStub.authenticate = sandbox.stub().rejects(exception);
                expect(appInit.error).toBeFalsy();
                await appInit.attachedAsync();
                expect(appInit.error).toBe(exception.resolvedMessage);
                done();

            });
        });

        describe("auth errors", ()=> {

            let actAndAssert = async (shouldIsAuthBeSet: boolean, done: () => {}) => {
                // baseline check
                expect(appInit.isAuthError).toBeFalsy();

                // act
                await appInit.attachedAsync();

                // assert
                let errorMessage = loggingSpy.args[loggingSpy.args.length - 1][2];
                expect(errorMessage).toBe(exception.toString());
                expect(appInit.error).toBe(exception.resolvedMessage);
                expect(appInit.isAuthError).toBe(shouldIsAuthBeSet);
                done();
            }

            describe("auth errors", () => {
                it ("sets auth error if getCurrentEngineer throws", async done => {
                    engineerServiceStub.getCurrentEngineer = sandbox.stub().rejects(exception);
                    await actAndAssert(true, done);
                });

                it ("sets auth error if analytics service throws", async done => {
                    analyticsServiceStub.initialize = sandbox.stub().rejects(exception);
                    await actAndAssert(true, done);
                });

                it ("sets auth error if authenticate throws", async done => {
                    authenticationServiceStub.authenticate = sandbox.stub().rejects(exception);
                    await actAndAssert(true, done);
                });

                it ("sets auth error if engineer initialise throws", async done => {
                    engineerServiceStub.initialise = sandbox.stub().rejects(exception);
                    await actAndAssert(true, done);
                });

                it ("sets auth error if override engineer throws", async done => {
                    engineerServiceStub.overrideEngineerId = sandbox.stub().rejects(exception);
                    await actAndAssert(true, done);
                });
            });

            describe("non auth errors", ()=> {
                it ("does not set auth error if initialiseApplicationSettings throws", async done => {
                    storageServiceStub.getAppSettings = sandbox.stub().rejects(exception);
                    await actAndAssert(false, done);
                });

                it ("does not set auth error if set static headers throws", async done => {
                    fftHeaderProviderStub.setStaticHeaders = sandbox.stub().throws(exception);
                    await actAndAssert(false, done);
                });

                it ("does not set auth error if referenceDataServices throws", async done => {
                    referenceDataSerivce.initialise = sandbox.stub().rejects(exception);
                    await actAndAssert(false, done);
                });

                it ("does not set auth error if loadConsumables throws", async done => {
                    catalogServiceStub.loadConsumables = sandbox.stub().rejects(exception);
                    await actAndAssert(false, done);
                });

                it ("does not set auth error if adaptBusinessService throws", async done => {
                    adaptBusinessServiceStub.initialise = sandbox.stub().rejects(exception);
                    await actAndAssert(false, done);
                });

                it ("does not set auth error if workRetrievalService throws", async done => {
                    workRetrievalServiceStub.initialise = sandbox.stub().rejects(exception);
                    await actAndAssert(false, done);
                });

                it ("does not set auth error if archiveService throws", async done => {
                    archiveServiceStub.initialise = sandbox.stub().rejects(exception);
                    await actAndAssert(false, done);
                });

                it ("does not set auth error if messageServiceStub throws", async done => {
                    messageServiceStub.initialise = sandbox.stub().rejects(exception);
                    await actAndAssert(false, done);
                });
            });

        });

        describe("authorisation sequence", () => {
            it("calls authentication service when user is not already signed on", async done => {
                engineerServiceStub.getCurrentEngineer = sandbox.stub().resolves(<Engineer>{isSignedOn: false});
                await appInit.attachedAsync();

                expect((authenticationServiceStub.authenticate as Sinon.SinonStub).args[0][1]).toBe(false);
                done();
            });

            it("calls authentication service when user is already signed on", async done => {
                engineerServiceStub.getCurrentEngineer = sandbox.stub().resolves(<Engineer>{isSignedOn: true});
                await appInit.attachedAsync();

                expect((authenticationServiceStub.authenticate as Sinon.SinonStub).args[0][1]).toBe(true);
                done();
            });

            it("passes authenticationResult to engneerService initialisation", async done => {
                let result = <IWhoAmI>{};
                authenticationServiceStub.authenticate = sandbox.stub().resolves({hasWhoAmISucceeded: true, result});

                await appInit.attachedAsync();

                expect((engineerServiceStub.initialise as Sinon.SinonStub).args[0]).toEqual([true, result]);
                done();
            });
        });

        describe("clearing logs", () => {
            let configuration, clearDownLogsSpy;
            beforeEach(() => {
                configuration = new Configuration();
                configuration.trainingMode = true;
                configuration.maxLogFileAgeDays = 40;
                let route = <IEndpointRouteConfiguration> {
                    "route": "whoAmI",
                    "path": "whoami/v1",
                    "client": "dev"
                };
                configuration.whoAmIServiceEndpoint = <IEndpointConfiguration> {routes : [route]};
                configurationServiceStub.getConfiguration =  sandbox.stub().returns(configuration);
                featureToggleServiceStub.isAssetTrackingEnabled = sandbox.stub().returns(false);
                clearDownLogsSpy = sandbox.spy(LogHelper, "clearDownLogs");
            });

            it("shouldn't call LogHelper.clearDownLogs method for non-wua environment", async done => {
                sandbox.stub(PlatformHelper, "getPlatform").returns("web");
                await appInit.attachedAsync();

                expect(clearDownLogsSpy.called).toBeFalsy();              
                done();
            });

            it("should call LogHelper.clearDownLogs method for wua environment", async done => {
                sandbox.stub(PlatformHelper, "getPlatform").returns("wua");
                await appInit.attachedAsync();

                expect(clearDownLogsSpy.called).toBeTruthy();
                expect(clearDownLogsSpy.args[0][0]).toEqual(40);
                done();
            });
        });
    });
});
