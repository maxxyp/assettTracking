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
import {PropertySafetyMain} from "../../../../../../app/hema/presentation/modules/propertySafety/propertySafetyMain";
import {RouterConfiguration, Router} from "aurelia-router";
import { PropertySafetyType } from "../../../../../../app/hema/business/models/propertySafetyType";
import {JobState} from "../../../../../../app/hema/business/models/jobState";
import {Job} from "../../../../../../app/hema/business/models/job";
import {History} from "../../../../../../app/hema/business/models/history";
import { Task } from "../../../../../../app/hema/business/models/task";
import { ApplianceSafetyType } from "../../../../../../app/hema/business/models/applianceSafetyType";
import {IPageService} from "../../../../../../app/hema/presentation/services/interfaces/IPageService";

describe("PropertySafetyMain module ", () => {

    class PropertySafetyMainClass extends PropertySafetyMain {
        public stateChanged() : Promise<void> {
            return super.stateChanged();
        }
    }

    let sandbox: Sinon.SinonSandbox;
    let jobServiceStub: IJobService;
    let engineerServiceStub: IEngineerService;
    let labelServiceStub: ILabelService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let validationServiceStub: IValidationService;
    let businessRuleServiceStub: IBusinessRuleService;
    let catalogServiceStub: ICatalogService;
    let propertySafetyMain: PropertySafetyMainClass;
    let history: BrowserHistory;
    let router: Router = new Router(new Container(), history);
    let routerConfiguration: RouterConfiguration = new RouterConfiguration();
    let job: Job;
    let pageServiceStub: IPageService;
    let getLastVisitedPageSpy: Sinon.SinonSpy;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.subscribe = sandbox.stub();
        jobServiceStub = <IJobService>{};
        job = new Job();
        job.tasks = [<Task>{applianceId: "1"}];
        job.history = <History> {
            appliances:[{id: "1", applianceSafetyType: ApplianceSafetyType.gas}]
        };
        job.propertySafetyType = PropertySafetyType.gas;
        jobServiceStub.getJob = sandbox.stub().resolves(job);
        engineerServiceStub = <IEngineerService>{};
        engineerServiceStub.isWorking = sandbox.stub().resolves(true);
        history = <BrowserHistory>{};
        pageServiceStub = <IPageService> {};
        getLastVisitedPageSpy = pageServiceStub.getLastVisitedPage = sandbox.stub().returns("previous-detail");

        propertySafetyMain = new PropertySafetyMainClass(labelServiceStub, jobServiceStub, engineerServiceStub, eventAggregatorStub, dialogServiceStub,
                                                        validationServiceStub, businessRuleServiceStub, catalogServiceStub, pageServiceStub);

    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(propertySafetyMain).toBeDefined();
    });

    it("should confiure router", () => {
        var setupChildRoutesSpy = sandbox.spy(propertySafetyMain, "setupChildRoutes");
        propertySafetyMain.configureRouter(routerConfiguration, router);
        routerConfiguration.exportToRouter(router);
        router.configure(routerConfiguration);
        expect(propertySafetyMain.router).toBeDefined();
        expect(router.routes.length > 0).toBeTruthy();
        expect(setupChildRoutesSpy.called).toBeTruthy();
    });

    it("should call pageservice getLastVisitedPage method and navigate to previous-detail route", () => {
        propertySafetyMain.configureRouter(routerConfiguration, router);
        routerConfiguration.exportToRouter(router);
        router.configure(routerConfiguration);
        expect(router.routes[2].redirect).toEqual("previous-detail");
        expect(getLastVisitedPageSpy.called).toBeTruthy();
    });

    it("should load model", (done) => {
        var loadModelSpy = sandbox.spy(propertySafetyMain, "loadModel");
        var showContentelSpy = sandbox.spy(propertySafetyMain, "showContent");
        propertySafetyMain.configureRouter(routerConfiguration, router);
        routerConfiguration.exportToRouter(router);
        router.configure(routerConfiguration);
        propertySafetyMain.activateAsync({jobId: "111"}).then(() => {
            expect(propertySafetyMain.propertySafetyType).toBe(PropertySafetyType.gas);
            expect(loadModelSpy.called).toBeTruthy();
            expect(showContentelSpy.called).toBeTruthy();
            done();
        });
    });

    it("should load model for an electrical engineer even with a gas job", (done) => {
        var loadModelSpy = sandbox.spy(propertySafetyMain, "loadModel");
        var showContentelSpy = sandbox.spy(propertySafetyMain, "showContent");
        propertySafetyMain.configureRouter(routerConfiguration, router);
        routerConfiguration.exportToRouter(router);
        router.configure(routerConfiguration);
        job.propertySafetyType = PropertySafetyType.electrical;
        propertySafetyMain.activateAsync({jobId: "111"}).then(() => {
            expect(propertySafetyMain.propertySafetyType).toBe(PropertySafetyType.electrical);
            expect(loadModelSpy.called).toBeTruthy();
            expect(showContentelSpy.called).toBeTruthy();
            done();
        });
    });

    describe("stateChanged method", () => {
        it("should redirect to gas property detail page", (done) => {
            propertySafetyMain.configureRouter(routerConfiguration, router);
            routerConfiguration.exportToRouter(router);
            router.configure(routerConfiguration);
            let navigateToRoute = router.navigateToRoute = sandbox.stub().returns(true);
            job.state = JobState.done;
            propertySafetyMain.activateAsync({jobId: "111"}).then(() => {
                propertySafetyMain.canEdit = false;
                propertySafetyMain.stateChanged().then(() => {
                    expect(navigateToRoute.calledWith("current-detail-gas")).toBeDefined();
                    done();
                });
            });
        });

        it("should redirect to electrical property detail page", (done) => {
            propertySafetyMain.configureRouter(routerConfiguration, router);
            routerConfiguration.exportToRouter(router);
            router.configure(routerConfiguration);
            let navigateToRoute = router.navigateToRoute = sandbox.stub().returns(true);
            job.state = JobState.done;
            propertySafetyMain.activateAsync({jobId: "111"}).then(() => {
                propertySafetyMain.canEdit = false;
                propertySafetyMain.stateChanged().then(() => {;
                    expect(navigateToRoute.calledWith("current-detail-electrical")).toBeDefined();
                    done();
                });
            });
        });

        it("should redirect to previous property detail page", (done) => {
            propertySafetyMain.configureRouter(routerConfiguration, router);
            routerConfiguration.exportToRouter(router);
            router.configure(routerConfiguration);
            let navigateToRoute = router.navigateToRoute = sandbox.stub().returns(true);
            job.state = JobState.idle;
            propertySafetyMain.activateAsync({jobId: "111"}).then(() => {
                propertySafetyMain.canEdit = false;
                propertySafetyMain.stateChanged().then(() => {;
                    expect(navigateToRoute.calledWith("previous-detail")).toBeDefined();
                    done();
                });
            });
        });

        it("should redirect to gas property detail page when canEdit = true and job state = arrived", (done) => {
            let navigateToRoute = router.navigateToRoute = sandbox.stub().returns(true);
            propertySafetyMain.configureRouter(routerConfiguration, router);
            routerConfiguration.exportToRouter(router);
            router.configure(routerConfiguration);
            job.state = JobState.arrived;
            propertySafetyMain.activateAsync({jobId: "111"}).then(() => {
                propertySafetyMain.canEdit = true;
                propertySafetyMain.stateChanged().then(() => {
                    expect(navigateToRoute.calledWith("current-detail-gas")).toBeDefined();
                    done();
                });
            });
        });
    });
});

