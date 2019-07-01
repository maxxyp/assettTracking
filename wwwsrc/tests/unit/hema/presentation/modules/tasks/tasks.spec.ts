/// <reference path="../../../../../../typings/app.d.ts" />

import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { Router } from "aurelia-router";

import { DataState } from "../../../../../../app/hema/business/models/dataState";
import { Task as TaskBusinessModel } from "../../../../../../app/hema/business/models/task";
import { TaskFactory } from "../../../../../../app/hema/presentation/factories/taskFactory";
import { Tasks } from "../../../../../../app/hema/presentation/modules/tasks/tasks";

import { IBusinessRuleService } from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { ICatalogService } from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import { IEngineerService } from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import { IJobService } from "../../../../../../app/hema/business/services/interfaces/IJobService";
import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import { ITaskService } from "../../../../../../app/hema/business/services/interfaces/ITaskService";
import { IValidationService } from "../../../../../../app/hema/business/services/interfaces/IValidationService";
import { QueryableBusinessRuleGroup } from "../../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import { Job } from "../../../../../../app/hema/business/models/job";
import { ChargeServiceConstants } from "../../../../../../app/hema/business/services/constants/chargeServiceConstants";
import * as noUiSlider from "noUiSlider";
import { Threading } from "../../../../../../app/common/core/threading";
import { JobServiceConstants } from '../../../../../../app/hema/business/services/constants/jobServiceConstants';

// todo lots of missing tests that need uncommenting

describe("the Tasks module", () => {
    let tasks: Tasks;
    let labelServiceStub: ILabelService;
    let sandbox: Sinon.SinonSandbox;
    let taskServiceStub: ITaskService;
    let engineerServiceStub: IEngineerService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let taskFactory: TaskFactory;
    let jobServiceStub: IJobService;
    let validationServiceStub: IValidationService;
    let businessRuleServiceStub: IBusinessRuleService;
    let catalogServiceStub: ICatalogService;
    let routerStub: Router;
    let queryableRuleGroup = <QueryableBusinessRuleGroup>{};
    let job: Job;
    let eaSpy: Sinon.SinonStub;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        taskServiceStub = <ITaskService>{};
        jobServiceStub = <IJobService>{};
        job = <Job>{};
        job.id = "job1";
        job.tasks = [];
        let task1 = new TaskBusinessModel(true, false);
        task1.id = "1";
        task1.jobType = "job";
        task1.applianceType = "dishwasher";
        task1.applianceId = "12345";
        task1.chargeType = "chargeable job";
        task1.supportingText = "something";
        task1.specialRequirement = "so special";
        task1.activities = [];
        task1.sequence = 1;
        task1.dataState = DataState.valid;
        job.tasks.push(task1);

        let task2 = new TaskBusinessModel(true, false);
        task2.id = "2";
        task2.jobType = "job";
        task2.applianceType = "cooker";
        task2.applianceId = "657487";
        task2.chargeType = "chargeable job";
        task2.supportingText = "something";
        task2.specialRequirement = "so special";
        task2.activities = [];
        task2.sequence = 2;
        task2.dataState = DataState.valid;
        job.tasks.push(task2);
        jobServiceStub.getJob = sandbox.stub().resolves(job);
        taskFactory = new TaskFactory();
        labelServiceStub = <ILabelService>{};
        engineerServiceStub = <IEngineerService>{};
        eventAggregatorStub = <EventAggregator>{};
        dialogServiceStub = <DialogService>{};
        eventAggregatorStub.subscribe = sinon.stub();
        eventAggregatorStub.publish = sinon.stub();
        catalogServiceStub = <ICatalogService>{};
        validationServiceStub = <IValidationService>{};
        businessRuleServiceStub = <IBusinessRuleService>{};
        routerStub = <Router>{};

        let getBusinessRuleListStub = queryableRuleGroup.getBusinessRuleList = sandbox.stub();
        getBusinessRuleListStub.withArgs("notDoingTaskStatuses").returns(["XB", "XC", "CX"]);
        let getBusinessRuleStub = queryableRuleGroup.getBusinessRule = sandbox.stub();
        getBusinessRuleStub.withArgs("intervalInMinutes").returns(1);
        getBusinessRuleStub.withArgs("notDoingJobStatuses").returns("NA,VO");
        getBusinessRuleStub.withArgs("notDoingTaskStatuses").returns("XB,XC");
        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(queryableRuleGroup);

        tasks = new Tasks(
            taskServiceStub, jobServiceStub, engineerServiceStub,
            routerStub, taskFactory,
            labelServiceStub, eventAggregatorStub, dialogServiceStub,
            validationServiceStub, businessRuleServiceStub, catalogServiceStub);

        tasks.jobId = "10001";

        tasks.getLabel = sandbox.stub().returns("");

    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(tasks).toBeDefined();
    });

    it("can navigate to task", () => {
        let methodSpy: Sinon.SinonSpy = routerStub.navigateToRoute = sandbox.stub();
        tasks.navigateToTask("1");
        expect(methodSpy.calledOnce).toBe(true);
    });

    it("can show content", (done) => {
        let taskList: TaskBusinessModel[] = [];

        let task1 = new TaskBusinessModel(true, false);
        task1.id = "1";
        task1.jobType = "job";
        task1.applianceType = "dishwasher";
        task1.applianceId = "12345";
        task1.chargeType = "chargeable job";
        task1.supportingText = "something";
        task1.specialRequirement = "so special";
        task1.activities = [];
        task1.sequence = 1;
        task1.dataState = DataState.valid;

        let task2 = new TaskBusinessModel(true, false);
        task2.id = "2";
        task2.jobType = "job";
        task2.applianceType = "cooker";
        task2.applianceId = "657487";
        task2.chargeType = "chargeable job";
        task2.supportingText = "something";
        task2.specialRequirement = "so special";
        task2.activities = [];
        task2.sequence = 2;
        task2.dataState = DataState.valid;

        taskList.push(task1);
        taskList.push(task2);

        taskServiceStub.getTasksAndCompletedTasks = sandbox.stub().withArgs(tasks.jobId).resolves(taskList);

        let taskModel1 = taskFactory.createTaskSummaryViewModel(task1);
        let taskModel2 = taskFactory.createTaskSummaryViewModel(task2);

        tasks.activateAsync()
            .then(() => {
                expect(tasks.tasks.length).toBe(2);
                expect(tasks.tasks[0].id).toEqual(taskModel1.id);
                expect(tasks.tasks[0].jobType).toEqual(taskModel1.jobType);
                expect(tasks.tasks[0].applianceType).toEqual(taskModel1.applianceType);
                expect(tasks.tasks[0].applianceId).toEqual(taskModel1.applianceId);
                expect(tasks.tasks[0].chargeType).toEqual(taskModel1.chargeType);
                expect(tasks.tasks[0].supportingText).toEqual(taskModel1.supportingText);
                expect(tasks.tasks[0].specialRequirement).toEqual(taskModel1.specialRequirement);
                expect(tasks.tasks[0].activityCount).toEqual(taskModel1.activityCount);
                expect(tasks.tasks[0].dataState).toEqual(taskModel1.dataState);

                expect(tasks.tasks[1].id).toEqual(taskModel2.id);
                expect(tasks.tasks[1].jobType).toEqual(taskModel2.jobType);
                expect(tasks.tasks[1].applianceType).toEqual(taskModel2.applianceType);
                expect(tasks.tasks[1].applianceId).toEqual(taskModel2.applianceId);
                expect(tasks.tasks[1].chargeType).toEqual(taskModel2.chargeType);
                expect(tasks.tasks[1].supportingText).toEqual(taskModel2.supportingText);
                expect(tasks.tasks[1].specialRequirement).toEqual(taskModel2.specialRequirement);
                expect(tasks.tasks[1].activityCount).toEqual(taskModel2.activityCount);
                expect(tasks.tasks[1].dataState).toEqual(taskModel2.dataState);
                done();
            });
    });

    it("reloadTasks, loadCustomerBusinessRules, showContent called", (done) => {
        let taskList: TaskBusinessModel[] = [];

        let task1 = new TaskBusinessModel(true, false);
        task1.id = "1";
        task1.jobType = "job";
        task1.applianceType = "dishwasher";
        task1.applianceId = "12345";
        task1.chargeType = "chargeable job";
        task1.supportingText = "something";
        task1.specialRequirement = "so special";
        task1.activities = [];
        task1.sequence = 1;
        task1.dataState = DataState.valid;

        let task2 = new TaskBusinessModel(true, false);
        task2.id = "2";
        task2.jobType = "job";
        task2.applianceType = "cooker";
        task2.applianceId = "657487";
        task2.chargeType = "chargeable job";
        task2.supportingText = "something";
        task2.specialRequirement = "so special";
        task2.activities = [];
        task2.sequence = 2;
        task2.dataState = DataState.valid;

        taskList.push(task1);
        taskList.push(task2);

        taskServiceStub.getTasksAndCompletedTasks = sandbox.stub().withArgs(tasks.jobId).resolves(taskList);

        let showContentSpy: Sinon.SinonSpy = sandbox.spy(tasks, "showContent");
        let loadCustomBusinessRulesSpy: Sinon.SinonSpy = sandbox.spy(tasks, "loadCustomBusinessRules");
        let reloadTasksSpy: Sinon.SinonSpy = sandbox.spy(tasks, "reloadTasks");

        eaSpy = eventAggregatorStub.subscribe = sandbox.stub();


        tasks.activateAsync()
            .then(() => {
                expect(reloadTasksSpy.calledOnce).toBeTruthy();
                expect(loadCustomBusinessRulesSpy.calledOnce).toBeTruthy();
                expect(showContentSpy.calledOnce).toBeTruthy();
                expect(eaSpy.calledWith(JobServiceConstants.JOB_STATE_CHANGED)).toBe(true);
                done();
            });
    });

    describe("attachedAsync", () => {        
        it("dont complete until tasks are loaded", (done) => {
            tasks.tasks = [];
            tasks.showTimeSlider = false;
            let destroyAndCreateSliderSpy: Sinon.SinonSpy = sandbox.spy(tasks, "destroyAndCreateSlider");
            tasks.attachedAsync().then(() => {
                expect(destroyAndCreateSliderSpy.calledOnce).toBeTruthy();
                done();
            })            
        });
    });

    describe("save", () => {

        let task1, task2;
        let taskList: TaskBusinessModel[];

        beforeEach(() => {
            taskList = [];

            task1 = new TaskBusinessModel(true, false);
            task1.id = "1";
            task1.jobType = "job";
            task1.applianceType = "dishwasher";
            task1.applianceId = "12345";
            task1.chargeType = "chargeable job";
            task1.supportingText = "something";
            task1.specialRequirement = "so special";
            task1.activities = [];
            task1.sequence = 1;
            task1.dataState = DataState.valid;

            task2 = new TaskBusinessModel(true, false);
            task2.id = "2";
            task2.jobType = "job";
            task2.applianceType = "cooker";
            task2.applianceId = "657487";
            task2.chargeType = "chargeable job";
            task2.supportingText = "something";
            task2.specialRequirement = "so special";
            task2.activities = [];
            task2.sequence = 2;
            task2.dataState = DataState.valid;

            taskList.push(task1);
            taskList.push(task2);

            taskServiceStub.getTasksAndCompletedTasks = sandbox.stub().withArgs(tasks.jobId).resolves(taskList);

        });

        it("calls charge service update on save if time changed", async done => {
            const publishStub = eventAggregatorStub.publish = sandbox.stub();
            tasks.canEdit = true;
            tasks.showTimeSlider = true;

            job.onsiteTime = new Date();
            await tasks.activateAsync();
            await tasks.attachedAsync();
            tasks.tasks[0].chargeableTimeChanged = true;
            await tasks.save();

            expect(publishStub.calledWith(ChargeServiceConstants.CHARGE_UPDATE_START, tasks.jobId)).toBe(true);

            done();

        });

    });

    describe("destroyAndCreateSlider", () => {
        let task1, task2, task3;
        let taskList: TaskBusinessModel[];
        let createSpy, div, destroyAndCreateSliderSpy;

        beforeEach(() => {
            taskList = [];

            task1 = new TaskBusinessModel(true, false);
            task1.id = "1";
            task1.isMiddlewareDoTodayTask = "D";
            task1.activities = [];
            task1.startTime = "10:00";
            task1.endTime = "10:40";

            task2 = new TaskBusinessModel(true, false);
            task2.id = "2";
            task2.isMiddlewareDoTodayTask = "D";
            task2.activities = [];
            task2.startTime = "10:40";
            task2.endTime = "11:20";

            task3 = new TaskBusinessModel(true, false);
            task3.id = "3";
            task3.isMiddlewareDoTodayTask = "D";
            task3.activities = [];
            task3.startTime = "11:20";
            task3.endTime = "12:00";

            taskList.push(task1);
            taskList.push(task2);
            taskList.push(task3);

            taskServiceStub.getTasksAndCompletedTasks = sandbox.stub().resolves(taskList);
            taskServiceStub.deleteTask = sandbox.stub().resolves(Promise.resolve());
            taskServiceStub.updateTaskTimes = sandbox.stub().resolves(Promise.resolve());

            job.tasks = taskList;
            job.id = "001";
            job.onsiteTime = new Date();
            jobServiceStub.getJob = sandbox.stub().resolves(job);

            createSpy = sandbox.spy(noUiSlider, "create");

            destroyAndCreateSliderSpy = sandbox.spy(tasks, "destroyAndCreateSlider");

            div = document.createElement("DIV");
            document.body.appendChild(div);
            tasks.tasktimes = div;

            tasks.canEdit = true;
            tasks.showConfirmation = sandbox.stub().resolves(true);
        });

        it("showTimeSlider should be false", async done => {
            job.onsiteTime = undefined;
            await tasks.activateAsync();
            expect(tasks.showTimeSlider).toBe(false);
            done();
        });

        it("showTimeSlider should be true", async done => {
            await tasks.activateAsync();
            expect(tasks.showTimeSlider).toBe(true);
            done();
        });

        it("the silder should be created during tasks page load", async done => {
            await tasks.activateAsync();
            await tasks.attachedAsync();
            expect(tasks.showTimeSlider).toBe(true);
            expect(tasks.slider).not.toBeUndefined();
            expect(createSpy.called).toBeTruthy();
            const arg = createSpy.args[0];
            expect(arg[1].start).toEqual([40, 80]);
            expect(arg[1].range).toEqual({ min: 0, max: 120 });
            let elem = tasks.tasktimes.querySelectorAll(".noUi-connect");
            expect(elem.length).toBe(3);
            expect(destroyAndCreateSliderSpy.called).toBeTruthy();
            done();
        });

        it("the silder should be destroyed and recreated when startTime is changed", async done => {
            let startTimeChangedSpy = sandbox.spy(tasks, "startTimeChanged");
            await tasks.activateAsync();
            await tasks.attachedAsync();
            expect(tasks.showTimeSlider).toBe(true);
            expect(tasks.slider).not.toBeUndefined();
            expect(createSpy.called).toBeTruthy();
            expect(destroyAndCreateSliderSpy.called).toBeTruthy();
            let arg = createSpy.args[0];
            expect(arg[1].start).toEqual([40, 80]);
            let destroySpy = sandbox.spy(tasks.slider, "destroy");
            destroyAndCreateSliderSpy.reset();
            createSpy.reset();
            tasks.startTime = "10:10";
            Threading.delay(() => {
                expect(startTimeChangedSpy.called).toBeTruthy();
                expect(destroyAndCreateSliderSpy.called).toBeTruthy();
                expect(destroySpy.called).toBeTruthy();
                expect(createSpy.called).toBeTruthy();
                arg = createSpy.args[0];
                expect(arg[1].start).toEqual([30, 70]);
                expect(arg[1].range).toEqual({ min: 0, max: 110 });
                expect(tasks.tasks[0].chargeableTimeChanged).toBeTruthy();
                done();
            }, 500);
        });

        it("the silder should be destroyed and recreated when endTime is changed", async done => {
            let endTimeChangedSpy = sandbox.spy(tasks, "endTimeChanged");
            await tasks.activateAsync();
            await tasks.attachedAsync();
            expect(tasks.showTimeSlider).toBe(true);
            expect(tasks.slider).not.toBeUndefined();
            expect(createSpy.called).toBeTruthy();
            expect(destroyAndCreateSliderSpy.called).toBeTruthy();
            let arg = createSpy.args[0];
            expect(arg[1].start).toEqual([40, 80]);
            let destroySpy = sandbox.spy(tasks.slider, "destroy");
            destroyAndCreateSliderSpy.reset();
            createSpy.reset();
            tasks.endTime = "11:40";
            Threading.delay(() => {
                expect(endTimeChangedSpy.called).toBeTruthy();
                expect(destroyAndCreateSliderSpy.called).toBeTruthy();
                expect(destroySpy.called).toBeTruthy();
                expect(createSpy.called).toBeTruthy();
                arg = createSpy.args[0];
                expect(arg[1].start).toEqual([40, 80]);
                expect(arg[1].range).toEqual({ min: 0, max: 100 });
                done();
            }, 500);
        });

        it("the silder should be destroyed and recreated when a task is deleted", async done => {
            tasks.getLabel = sandbox.stub()
                .withArgs("objectName").returns("testname")
                .withArgs("confirmation").returns("confirmation");

            tasks.getParameterisedLabel = sandbox.stub().returns("deleteQuestion");
            tasks.showConfirmation = sandbox.stub().resolves({ wasCancelled: false });

            await tasks.activateAsync();
            await tasks.attachedAsync();
            expect(tasks.showTimeSlider).toBe(true);
            expect(tasks.slider).not.toBeUndefined();
            expect(createSpy.called).toBeTruthy();
            expect(destroyAndCreateSliderSpy.called).toBeTruthy();
            let arg = createSpy.args[0];
            expect(arg[1].start).toEqual([40, 80]);
            let destroySpy = sandbox.spy(tasks.slider, "destroy");
            destroyAndCreateSliderSpy.reset();
            createSpy.reset();
            taskList.splice(2, 1);
            await tasks.deleteTask(new MouseEvent("test"), task3);
            expect(destroyAndCreateSliderSpy.called).toBeTruthy();
            expect(destroySpy.called).toBeTruthy();
            expect(createSpy.called).toBeTruthy();
            arg = createSpy.args[0];
            expect(arg[1].start).toEqual([40]);
            expect(arg[1].range).toEqual({ min: 0, max: 80 });
            let elem = tasks.tasktimes.querySelectorAll(".noUi-connect");
            expect(elem.length).toBe(2);
            done();
        });
    });

    describe("deleteTask", () => {
        let task1, task2, task3;
        let taskList: TaskBusinessModel[];
        let taskListSecondCall: TaskBusinessModel[];
        let div;

        beforeEach(() => {
            taskList = [];
            taskListSecondCall = [];

            task1 = new TaskBusinessModel(true, false);
            task1.id = "1";
            task1.isMiddlewareDoTodayTask = "D";
            task1.activities = [];
            task1.startTime = "10:00";
            task1.endTime = "10:40";

            task2 = new TaskBusinessModel(true, false);
            task2.id = "2";
            task2.isMiddlewareDoTodayTask = "D";
            task2.activities = [];
            task2.startTime = "10:40";
            task2.endTime = "11:20";

            task3 = new TaskBusinessModel(true, false);
            task3.id = "3";
            task3.isMiddlewareDoTodayTask = "D";
            task3.activities = [];
            task3.startTime = "11:20";
            task3.endTime = "12:00";

            taskListSecondCall.push(task1);
            taskList.push(task1);
            taskListSecondCall.push(task2);
            taskList.push(task2);
            taskList.push(task3);

            let getTasksAndCompletedTasksStub = taskServiceStub.getTasksAndCompletedTasks = sandbox.stub();

            getTasksAndCompletedTasksStub.onFirstCall().resolves(taskListSecondCall);
            getTasksAndCompletedTasksStub.onSecondCall().resolves(taskListSecondCall);
            taskServiceStub.deleteTask = sandbox.stub().resolves(Promise.resolve());
            taskServiceStub.updateTaskTimes = sandbox.stub().resolves(Promise.resolve());

            job.tasks = taskList;
            job.id = "001";
            job.onsiteTime = new Date();
            jobServiceStub.getJob = sandbox.stub().resolves(job);

            div = document.createElement("DIV");
            document.body.appendChild(div);
            tasks.tasktimes = div;

            tasks.canEdit = true;
            tasks.showDeleteConfirmation = sandbox.stub().resolves(true);

        });

        it("should delete task", async done => {
            tasks.getLabel = sandbox.stub()
                .withArgs("objectName").returns("loadingPleaseWait");

            tasks.getParameterisedLabel = sandbox.stub().returns("loadingPleaseWait");
            tasks.showConfirmation = sandbox.stub().resolves({ wasCancelled: false });
            const publishStub = eventAggregatorStub.publish = sandbox.stub();
            let event: MouseEvent = {} as MouseEvent;
            event.stopPropagation = sandbox.stub();


            await tasks.activateAsync();
            await tasks.deleteTask(event, task3);
            expect(tasks.tasks.length === 2).toBeTruthy();
            expect(tasks.tasks[0].chargeableTimeChanged).toBeFalsy();
            expect(tasks.tasks[1].chargeableTimeChanged).toBeFalsy();
            expect(publishStub.calledWith(ChargeServiceConstants.CHARGE_UPDATE_START, tasks.jobId)).toBe(true);
            done();
        });

        it("should call methods in right sequence", async (done) => {
            tasks.getLabel = sandbox.stub()
                .withArgs("objectName").returns("loadingPleaseWait");

            tasks.getParameterisedLabel = sandbox.stub().returns("loadingPleaseWait");
            tasks.showConfirmation = sandbox.stub().resolves({ wasCancelled: false });
            const publishStub = eventAggregatorStub.publish = sandbox.stub();
            let event: MouseEvent = {} as MouseEvent;
            event.stopPropagation = sandbox.stub();
            let showBusySpy: Sinon.SinonSpy = sandbox.spy(tasks, "showBusy");
            let saveModelSpy: Sinon.SinonSpy = sandbox.spy(tasks, "saveModel");
            let reloadTasksSpy: Sinon.SinonSpy = sandbox.spy(tasks, "reloadTasks");
            let showContentSpy: Sinon.SinonSpy = sandbox.spy(tasks, "showContent");
            let destroyAndCreateSliderSpy: Sinon.SinonSpy = sandbox.spy(tasks, "destroyAndCreateSlider");
            let setChargeTimeChangeTriggerSpy: Sinon.SinonSpy = sandbox.spy(tasks, "setChargeTimeChangeTrigger");

            await tasks.activateAsync();
            await tasks.deleteTask(event, task3);
            
            sinon.assert.callOrder(showBusySpy, saveModelSpy, reloadTasksSpy, showContentSpy, destroyAndCreateSliderSpy, setChargeTimeChangeTriggerSpy, publishStub);
        
            done();
        });
    });
});
