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
import {PartsMain} from "../../../../../../app/hema/presentation/modules/parts/partsMain";
import {RouterConfiguration, Router} from "aurelia-router";
import {IPageService} from "../../../../../../app/hema/presentation/services/interfaces/IPageService";

describe("the partsMain module ", () => {
    let sandbox: Sinon.SinonSandbox;
    let jobServiceStub: IJobService;
    let engineerServiceStub: IEngineerService;

    let labelServiceStub: ILabelService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let validationServiceStub: IValidationService;
    let businessRuleServiceStub: IBusinessRuleService;
    let catalogServiceStub: ICatalogService;
    let partsMain: PartsMain;
    let history: BrowserHistory;
    let pageServiceStub: IPageService;
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
        getLastVisitedPageSpy = pageServiceStub.getLastVisitedPage = sandbox.stub().returns(undefined);
        history = <BrowserHistory>{};
        partsMain = new PartsMain(labelServiceStub, jobServiceStub, engineerServiceStub, eventAggregatorStub, dialogServiceStub,
                                        validationServiceStub, businessRuleServiceStub, catalogServiceStub, pageServiceStub);

    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(partsMain).toBeDefined();
    });

    it("should confiure router", () => {
        let router: Router = new Router(new Container(), history);
        let routerConfiguration: RouterConfiguration = new RouterConfiguration();
        var setupChildRoutesSpy = sandbox.spy(partsMain, "setupChildRoutes");
        partsMain.configureRouter(routerConfiguration, router);
        routerConfiguration.exportToRouter(router);
        router.configure(routerConfiguration);
        partsMain.canEdit = true;
        partsMain.attached();
        expect(partsMain.router).toBeDefined();
        expect(router.routes.length > 0).toBeTruthy();
        expect(setupChildRoutesSpy.called).toBeTruthy();        
    });

    it("should navigate to todays-parts route", () => {
        let router: Router = new Router(new Container(), history);
        let routerConfiguration: RouterConfiguration = new RouterConfiguration();
        partsMain.configureRouter(routerConfiguration, router);
        routerConfiguration.exportToRouter(router);
        router.configure(routerConfiguration);
        expect(partsMain.router.routes[0].redirect).toEqual("todays-parts");
        expect(getLastVisitedPageSpy.called).toBeTruthy();
    });

    it("should navigate to parts-basket route", () => {
        getLastVisitedPageSpy = pageServiceStub.getLastVisitedPage = sandbox.stub().returns("parts-basket");
        let router: Router = new Router(new Container(), history);
        let routerConfiguration: RouterConfiguration = new RouterConfiguration();
        partsMain.configureRouter(routerConfiguration, router);
        routerConfiguration.exportToRouter(router);
        router.configure(routerConfiguration);
        expect(router.routes[0].redirect).toEqual("parts-basket");
        expect(getLastVisitedPageSpy.called).toBeTruthy();
    });
});
