/// <reference path="../../../../../../typings/app.d.ts" />

import { TaskMain } from "../../../../../../app/hema/presentation/modules/tasks/taskMain";
import { ITaskService } from "../../../../../../app/hema/business/services/interfaces/ITaskService";
import { IJobService } from "../../../../../../app/hema/business/services/interfaces/IJobService";
import { Task } from "../../../../../../app/hema/business/models/task";
import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import { EventAggregator } from "aurelia-event-aggregator";
import { DataStateSummary } from "../../../../../../app/hema/business/models/dataStateSummary";
import { IEngineerService } from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import { DialogService } from "aurelia-dialog";
import { IValidationService } from "../../../../../../app/hema/business/services/interfaces/IValidationService";
import { IBusinessRuleService } from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { ICatalogService } from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import { IAnimationService } from "../../../../../../app/common/ui/services/IAnimationService";
import { ITaskFactory } from "../../../../../../app/hema/presentation/factories/interfaces/ITaskFactory";
import { Job } from "../../../../../../app/hema/business/models/job";
import {Container} from "aurelia-dependency-injection";
import { BrowserHistory } from "aurelia-history-browser";
import {RouterConfiguration, Router, NavigationInstruction, NavigationInstructionInit} from "aurelia-router";
import {IPageService} from "../../../../../../app/hema/presentation/services/interfaces/IPageService";

describe("the TaskMain module", () => {
    let taskMain: TaskMain;
    let sandbox: Sinon.SinonSandbox;
    let jobServiceStub: IJobService;
    let taskServiceStub: ITaskService;
    let labelServiceStub: ILabelService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let routerStub: Router;
    let routerConfigurationStub: RouterConfiguration;
    let engineerServiceStub: IEngineerService;
    let validationServiceStub: IValidationService;
    let businessRuleServiceStub: IBusinessRuleService;
    let catalogServiceStub: ICatalogService;
    let animationServiceStub: IAnimationService;
    let taskFactoryStub: ITaskFactory;
    let pageServiceStub: IPageService;
    let getLastVisitedPageSpy: Sinon.SinonSpy;
    let history = <BrowserHistory>{};

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        jobServiceStub = <IJobService>{};
        jobServiceStub.getDataStateSummary = sandbox.stub().resolves(new DataStateSummary(null));
        jobServiceStub.getJob = sandbox.stub().resolves({});

        taskServiceStub = <ITaskService>{};

        routerConfigurationStub = <RouterConfiguration>{};
        routerConfigurationStub.map = sandbox.stub();

        routerStub = <Router>{};
        routerStub.navigation = [];
        routerStub.navigateToRoute = sandbox.stub();

        engineerServiceStub = <IEngineerService>{};
        engineerServiceStub.isWorking = sandbox.stub().resolves(true);

        labelServiceStub = <ILabelService>{};
        labelServiceStub.getGroup = sinon.stub().returns(Promise.resolve({}));

        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.subscribe = sandbox.stub();
        eventAggregatorStub.publish = sandbox.stub();

        dialogServiceStub = <DialogService>{};

        catalogServiceStub = <ICatalogService>{};
        validationServiceStub = <IValidationService>{};
        validationServiceStub.build = sandbox.stub().resolves([]);
        businessRuleServiceStub = <IBusinessRuleService>{};
        animationServiceStub = <IAnimationService>{};
        taskFactoryStub = <ITaskFactory>{};
        taskFactoryStub.createTaskSummaryViewModel = sandbox.stub().returns(undefined);

        businessRuleServiceStub.getRuleGroup = sandbox.stub().resolves(null);

        pageServiceStub = <IPageService> {};
        getLastVisitedPageSpy = pageServiceStub.getLastVisitedPage = sandbox.stub().returns("previous-activities");
       
        taskMain = new TaskMain(jobServiceStub, engineerServiceStub, taskServiceStub, labelServiceStub, eventAggregatorStub,
            dialogServiceStub, validationServiceStub, businessRuleServiceStub, catalogServiceStub, animationServiceStub, taskFactoryStub, pageServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(taskMain).toBeDefined();
    });

    it("can call configureRouter", () => {
        let mapSpy = routerConfigurationStub.map = sandbox.spy();

        taskMain.configureRouter(routerConfigurationStub, routerStub);

        expect(mapSpy.called).toBe(true);
    });

    it("should default route be set to previous-activities", () => {
        let router: Router = new Router(new Container(), history);
        let routerConfiguration: RouterConfiguration = new RouterConfiguration();
        let navigationInstruction = new NavigationInstruction(<NavigationInstructionInit> {params: {}});
        navigationInstruction.params = {taskId: "111"};
        taskMain.configureRouter(routerConfiguration, router, undefined, undefined, navigationInstruction);
        routerConfiguration.exportToRouter(router);
        router.configure(routerConfiguration);
        expect(router.routes[0].redirect).toEqual("previous-activities");
        expect(getLastVisitedPageSpy.called).toBeTruthy();
    });

    describe("activateAsync", () => {
        beforeEach(() => {
            taskMain.configureRouter(routerConfigurationStub, routerStub);
        });

        it("can call activateAsync and show view", (done) => {
            let taskIds: string[] = ["1", "2", "3"];
            let tasks: Task[] = [<Task>{ id: "1" }, <Task>{ id: "2" }, <Task>{ id: "3" }];

            jobServiceStub.getJob = sandbox.stub().resolves(Promise.resolve(taskIds));
            taskServiceStub.getTasksAndCompletedTasks = sandbox.stub().resolves(Promise.resolve(tasks));
            taskServiceStub.getTaskItem = sandbox.stub().resolves(Promise.resolve(tasks[1]));

            let showContentSpy = sandbox.spy(taskMain, "showContent");

            taskMain.activateAsync({ jobId: "0", taskId: "1" }).then(() => {
                // expect(taskMain.taskIds).toBe(taskIds);
                expect(showContentSpy.called).toBe(true);
                done();
            });
        });

        it("can call activateAsync and show error when load job throws", (done) => {
            taskServiceStub.getTasksAndCompletedTasks = sandbox.stub().returns(Promise.reject(null));

            taskMain.activateAsync({ jobId: "0", taskId: "1" })
                .then(() => {
                    fail("should not have succeeded");
                    done();
                })
                .catch(() => {
                    done();
                });
        });
    });

    describe("isDoTodayTask", () => {
        let tasks;
        let job;

        beforeEach(() => {
            tasks = [<Task>{ id: "1", isMiddlewareDoTodayTask: true }, <Task>{ id: "2", isMiddlewareDoTodayTask: false }];
            job = <Job>{ tasks: tasks };

            jobServiceStub.getJob = sandbox.stub().resolves(Promise.resolve(job));
            taskServiceStub.getTasksAndCompletedTasks = sandbox.stub().resolves(Promise.resolve(tasks));
            taskServiceStub.getTaskItem = sandbox.stub().resolves(Promise.resolve(tasks[1]));
            taskMain.configureRouter(routerConfigurationStub, routerStub);
        });

        it("should be true", (done) => {
            taskMain.activateAsync({ jobId: "0", taskId: "1" })
                .then(() => {
                    expect(taskMain.isDoTodayTask).toBe(true);
                    done();
                });
        });

        it("should be false", (done) => {
            taskMain.activateAsync({ jobId: "0", taskId: "2" })
                .then(() => {
                    expect(taskMain.isDoTodayTask).toBe(false);
                    done();
                });
        });
    });

    describe("changeApplianceType method", () => {
        let eventStub: MouseEvent;

        beforeEach(() => {
            taskMain.configureRouter(routerConfigurationStub, routerStub);
        });

        it("should call showInfo method thrice", () => {
            eventStub = <MouseEvent>{};
            eventStub.stopPropagation = sandbox.stub();      
            let navigateToRouteSpy = routerStub.navigateToRoute = sandbox.spy();      
            taskMain.changeApplianceType(eventStub);
            expect(navigateToRouteSpy.calledOnce).toBeTruthy();
        });
    });
});
