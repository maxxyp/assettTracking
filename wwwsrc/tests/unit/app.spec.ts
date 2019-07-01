/// <reference path="../../typings/app.d.ts" />

import { EventAggregator } from "aurelia-event-aggregator";
import { BrowserHistory } from "aurelia-history-browser";
import {ConfigurationService} from "../../app/common/core/services/configurationService";
import {PlatformHelper} from "../../app/common/core/platformHelper";
import {App} from "../../app/app";
import {Router} from "aurelia-router";
import {RouterConfiguration} from "aurelia-router";
import {Container} from "aurelia-dependency-injection";
import {IEngineerService} from "../../app/hema/business/services/interfaces/IEngineerService";
import {IStorageService} from "../../app/hema/business/services/interfaces/IStorageService";
import {About} from "../../app/common/ui/views/about";
import {IConsumableService} from "../../app/hema/business/services/interfaces/IConsumableService";
import {IMessageService} from "../../app/hema/business/services/interfaces/IMessageService";
import { IJobCacheService } from "../../app/hema/business/services/interfaces/IJobCacheService";
import { JobLoggingHelper } from "../../app/hema/business/models/jobLoggingHelper";
import {IPageService} from "../../app/hema/presentation/services/interfaces/IPageService";
import { IFeatureToggleService } from "../../app/hema/business/services/interfaces/IFeatureToggleService";
import { IFFTService } from "../../app/hema/api/services/interfaces/IFFTService";
import { IVanStockService as IVanStockServiceApi } from "../../app/hema/api/services/interfaces/IVanStockService";
import {ISoundService} from "../../app/common/ui/services/ISoundService";
import {INotificationService} from "../../app/hema/business/services/interfaces/INotificationService";

describe("the App module", () => {
    let sandbox: Sinon.SinonSandbox;
    let configurationService: ConfigurationService;
    let history: BrowserHistory;
    let app: App;
    let engineerServiceStub = <IEngineerService>{};
    let storageServiceStub = <IStorageService>{};
    let aboutStub = <About>{};
    let eaStub: EventAggregator;
    let consumableServiceStub = <IConsumableService>{};
    let messageServiceStub = <IMessageService>{};
    let jobCacheServiceStub = <IJobCacheService>{};
    let jobLoggingHelper = <JobLoggingHelper>{};
    let pageServiceStub = <IPageService>{};
    let userSettingsCompleteSpy: Sinon.SinonSpy;
    let featureToggleServiceStub: IFeatureToggleService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        // stub container so concrete AppInit is not created (for another test)
        sandbox.stub(Container.instance, "get").returns({});
        configurationService = new ConfigurationService();
        configurationService.getConfiguration = sandbox.stub().returns({});
        eaStub = new EventAggregator();
        // eaStub.subscribe = sandbox.stub();
        consumableServiceStub.orderItemCount = sandbox.stub().returns(new Promise<number>((resolve, reject) => {
            resolve(2);
        }));
        messageServiceStub.unreadCount = 3;
        history = <BrowserHistory>{};

        aboutStub.addViewModel = sandbox.stub();

        userSettingsCompleteSpy = storageServiceStub.userSettingsComplete = sandbox.stub().resolves(true);

        PlatformHelper.isSource = true;

        pageServiceStub.addOrUpdateLastVisitedPage = sandbox.stub();

        featureToggleServiceStub = <IFeatureToggleService>{};
        featureToggleServiceStub.isAssetTrackingEnabled = sandbox.stub().returns(false);

        app = new App(configurationService, eaStub, engineerServiceStub, storageServiceStub, aboutStub,
            jobCacheServiceStub, jobLoggingHelper, pageServiceStub, featureToggleServiceStub, <IFFTService>{}, <IVanStockServiceApi>{}, <ISoundService>{}, <INotificationService>{});
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(app).toBeDefined();
    });

    it("can configure a router and show router", async (done) => {
        let router: Router = new Router(new Container(), history);
        let routerConfiguration: RouterConfiguration = new RouterConfiguration();
        routerConfiguration.addPipelineStep = sandbox.stub();
        await app.configureRouter(routerConfiguration, router);
        expect(app.router).toBeDefined();
        routerConfiguration.exportToRouter(router);
        router.configure(routerConfiguration);
        expect(router.routes.length > 0).toBeTruthy();
        done();
    });

    it("should landing page be equal to customers page", async (done) => {
        let router: Router = new Router(new Container(), history);
        let routerConfiguration: RouterConfiguration = new RouterConfiguration();
        await app.configureRouter(routerConfiguration, router);
        routerConfiguration.exportToRouter(router);
        router.configure(routerConfiguration);
        expect(router.routes.length > 0).toBeTruthy();
        expect(userSettingsCompleteSpy.called).toBeTruthy();
        expect(router.routes[0].redirect).toEqual("customers");
        done();
    });

    it("should landing page be equal to settings page", async (done) => {
        userSettingsCompleteSpy = storageServiceStub.userSettingsComplete = sandbox.stub().resolves(false);
        let router: Router = new Router(new Container(), history);
        let routerConfiguration: RouterConfiguration = new RouterConfiguration();
        await app.configureRouter(routerConfiguration, router);
        routerConfiguration.exportToRouter(router);
        router.configure(routerConfiguration);
        expect(router.routes.length > 0).toBeTruthy();
        expect(userSettingsCompleteSpy.called).toBeTruthy();
        expect(router.routes[0].redirect).toEqual("settings");
        done();
    });
});
