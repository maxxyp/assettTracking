/// <reference path="../../../../../../typings/app.d.ts" />
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { BrowserHistory } from "aurelia-history-browser";
import {Container} from "aurelia-dependency-injection";
import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import { IJobService } from "../../../../../../app/hema/business/services/interfaces/IJobService";
import { IEngineerService } from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import { IValidationService } from "../../../../../../app/hema/business/services/interfaces/IValidationService";
import { IBusinessRuleService } from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { ICatalogService } from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import { IApplianceService } from "../../../../../../app/hema/business/services/interfaces/IApplianceService";
import { IAnimationService } from "../../../../../../app/common/ui/services/IAnimationService";
import { IConfigurationService } from "../../../../../../app/common/core/services/IConfigurationService";
import { IAppLauncher } from "../../../../../../app/common/core/services/IAppLauncher";
import {ApplianceMain} from "../../../../../../app/hema/presentation/modules/appliances/applianceMain";
import {RouterConfiguration, Router, NavigationInstruction, NavigationInstructionInit} from "aurelia-router";
import {IPageService} from "../../../../../../app/hema/presentation/services/interfaces/IPageService";

describe("the applianceMain module ", () => {
    let sandbox: Sinon.SinonSandbox;
    let jobServiceStub: IJobService;
    let engineerServiceStub: IEngineerService;

    let labelServiceStub: ILabelService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let validationServiceStub: IValidationService;
    let businessRuleServiceStub: IBusinessRuleService;
    let catalogServiceStub: ICatalogService;
    let applianceServiceStub: IApplianceService;
    let animationServiceStub: IAnimationService;
    let configurationServiceStub: IConfigurationService;
    let appLauncherStub: IAppLauncher;
    let history: BrowserHistory;
    let pageServiceStub: IPageService;
    let applianceMain: ApplianceMain;
    let getLastVisitedPageSpy: Sinon.SinonSpy;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.subscribe = sandbox.stub();
        jobServiceStub = <IJobService>{};
        jobServiceStub.isJobEditable = sandbox.stub().resolves(true);
        engineerServiceStub = <IEngineerService>{};
        engineerServiceStub.isWorking = sandbox.stub().resolves(true);
        pageServiceStub = <IPageService> {};
        getLastVisitedPageSpy = pageServiceStub.getLastVisitedPage = sandbox.stub().returns("gas-safety");
        history = <BrowserHistory>{};
        applianceServiceStub = <IApplianceService> {};
        appLauncherStub = <IAppLauncher> {};
        animationServiceStub = <IAnimationService>{};
        configurationServiceStub = <IConfigurationService> {};        
        applianceMain = new ApplianceMain(labelServiceStub, jobServiceStub, engineerServiceStub, eventAggregatorStub, dialogServiceStub, validationServiceStub, businessRuleServiceStub, catalogServiceStub, 
            applianceServiceStub, animationServiceStub, appLauncherStub, configurationServiceStub, pageServiceStub);

    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(applianceMain).toBeDefined();
    });

    it("should confiure router", () => {
        let router: Router = new Router(new Container(), history);
        let routerConfiguration: RouterConfiguration = new RouterConfiguration();
        var setupChildRoutesSpy = sandbox.spy(applianceMain, "setupChildRoutes");
        applianceMain.configureRouter(routerConfiguration, router);
        routerConfiguration.exportToRouter(router);
        router.configure(routerConfiguration);
        applianceMain.canEdit = true;
        applianceMain.attached();
        expect(applianceMain.router).toBeDefined();
        expect(router.routes.length > 0).toBeTruthy();
        expect(setupChildRoutesSpy.called).toBeTruthy();
        expect(router.routes[0].redirect).toEqual("appliance-details");
    });

    it("should default route be set to gas-safety", () => {
        let router: Router = new Router(new Container(), history);
        let routerConfiguration: RouterConfiguration = new RouterConfiguration();
        let navigationInstruction = new NavigationInstruction(<NavigationInstructionInit> {params: {}});
        navigationInstruction.params = {applianceId: "111"};
        applianceMain.configureRouter(routerConfiguration, router, undefined, undefined, navigationInstruction);
        routerConfiguration.exportToRouter(router);
        router.configure(routerConfiguration);
        expect(router.routes[0].redirect).toEqual("gas-safety");
        expect(getLastVisitedPageSpy.called).toBeTruthy();
    });
});
