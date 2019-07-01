/// <reference path="../../../../../typings/app.d.ts" />

import { TaskItemFactory } from "../../../../../app/hema/presentation/factories/taskItemFactory";
import { ITaskItemFactory } from "../../../../../app/hema/presentation/factories/interfaces/ITaskItemFactory";
import { Job } from "../../../../../app/hema/business/models/job";
import { Task } from "../../../../../app/hema/business/models/task";
import { IChirpCode } from "../../../../../app/hema/business/models/reference/IChirpCode";
import { DataState } from "../../../../../app/hema/business/models/dataState";
import { TaskItemViewModel } from '../../../../../app/hema/presentation/modules/tasks/viewModels/taskItemViewModel';
import { IVisitActivityCode } from '../../../../../app/hema/business/models/reference/IVisitActivityCode';

describe("the taskItemFactory", () => {
    let taskFactory: ITaskItemFactory;

    beforeEach(() => {
        taskFactory = new TaskItemFactory();
    });

    it("can be created", () => {
        expect(taskFactory).toBeDefined();
    });

    describe("the createTaskItemViewModel function", () => {
        let job: Job;
        let task: Task;
        let chirpCodes: IChirpCode[];

        beforeEach(() => {
            job = new Job();
            job.id = "1234";
            task = new Task(true, true);
            task.id = "1";
            task.dataStateId = "dataStateId";
            task.dataState = DataState.dontCare;
            task.isCharge = true;
            task.orderNo = 1;
            task.applianceId = "applianceId";
            task.applianceType = "applianceType";
            task.jobType = "jobType";
            task.status = "status";
            task.workedOnCode = "workedOnCode";
            task.adviceOutcome = "adviceOutcome";
            task.adviceCode = "adviceCode";
            task.report = "report";
            task.workDuration = 1;
            task.chargeableTime = 2;
            task.activity = "activity";
            task.productGroup = "productGroup";
            task.partType = "partType";
            task.faultActionCode = "faultActionCode";
            task.isPotentiallyPartLJReportable = true;
            task.isPartLJReportable = false;
            task.isFirstVisit = true;
            task.hasMainPart = true;
            task.mainPartPartType = "mainPartPartType";
            task.showMainPartSelectedWithInvalidActivityTypeMessage = true;
            task.showMainPartSelectedWithInvalidProductGroupTypeMessage = true;
            task.showMainPartSelectedWithInvalidPartTypeMessage = true;
            task.startTime = "09:00";
            task.endTime = "10:00";
            task.adviceComment = "adviceComment";
            job.tasks = [];
            job.tasks.push(task);
        });

        it("taskId undefined, returns undefined", () => {
            let vm = taskFactory.createTaskItemViewModel(undefined, job, 1, chirpCodes);
            expect(vm === undefined).toBeTruthy();
        });

        it("no task found, returns undefined", () => {
            let vm = taskFactory.createTaskItemViewModel("1236", job, 1, chirpCodes);
            expect(vm === undefined).toBeTruthy();
        });

        it("task viewModel fields mapped", () => {
            let vm = taskFactory.createTaskItemViewModel("1", job, 1, chirpCodes);
            expect(vm).toBeDefined();
            expect(vm.dataStateId === "dataStateId").toBeTruthy();
            expect(vm.dataState === DataState.dontCare).toBeTruthy();
            expect(vm.isCharge === true).toBeTruthy();
            expect(vm.orderNo === 1).toBeTruthy();
            expect(vm.currentApplianceId === "applianceId").toBeTruthy();
            expect(vm.applianceType === "applianceType").toBeTruthy();
            expect(vm.jobType === "jobType").toBeTruthy();
            expect(vm.status === "status").toBeTruthy();
            expect(vm.workedOnCode === "workedOnCode").toBeTruthy();
            expect(vm.adviceOutcome === "adviceOutcome").toBeTruthy();
            expect(vm.adviceCode === "adviceCode").toBeTruthy();
            expect(vm.taskReport === "report").toBeTruthy();
            expect(vm.workDuration === 1).toBeTruthy();
            expect(vm.chargeableTime === 2).toBeTruthy();
            expect(vm.activity === "activity").toBeTruthy();
            expect(vm.productGroup === "productGroup").toBeTruthy();
            expect(vm.partType === "partType").toBeTruthy();
            expect(vm.faultActionCode === "faultActionCode").toBeTruthy();
            expect(vm.isPotentiallyPartLJReportable === true).toBeTruthy();
            expect(vm.isPartLJReportable === false).toBeTruthy();
            expect(vm.isFirstVisit === true).toBeTruthy();
            expect(vm.hasMainPart === true).toBeTruthy();
            expect(vm.mainPartPartType === "mainPartPartType").toBeTruthy();
            expect(vm.showMainPartSelectedWithInvalidActivityTypeMessage === true).toBeTruthy();
            expect(vm.showMainPartSelectedWithInvalidProductGroupTypeMessage === true).toBeTruthy();
            expect(vm.showMainPartSelectedWithInvalidPartTypeMessage === true).toBeTruthy();

            expect(vm.showProductGroupAndPartTypes === true).toBeTruthy();
            expect(vm.notCompletingJob === false).toBeTruthy();
            expect(vm.notCompletingTask === false).toBeTruthy();
            expect(vm.mainPartInformationRetrieved === false).toBeTruthy();
            expect(vm.chirpCodes === undefined).toBeTruthy();
            expect(vm.faultActionCodeFilteredCatalog.length === 0).toBeTruthy();
            expect(vm.partTypeFilteredCatalog.length === 0).toBeTruthy();
            expect(vm.visitActivityFilteredCatalog.length === 0).toBeTruthy();
            expect(vm.mainPartProductGroup === "").toBeTruthy();
            expect(vm.totalPreviousWorkDuration === 0).toBeTruthy();
            expect(vm.selectedChirpCode === undefined).toBeTruthy();
            expect(vm.taskTime).toBeDefined();
            expect(vm.taskTime.startTime === "09:00").toBeTruthy();
            expect(vm.taskTime.endTime === "10:00").toBeTruthy();
            expect(vm.adviceComment === "adviceComment").toBeTruthy();
        });
    });

    describe("the createTaskItemBusinessModel function", () => {
        let vm: TaskItemViewModel;

        beforeEach(() => {
            let task = new Task(true, true);
            task.id = "1";
            task.dataStateId = "dataStateId";
            task.dataState = DataState.dontCare;
            task.isCharge = true;
            task.orderNo = 1;
            task.applianceId = "applianceId";
            task.applianceType = "applianceType";
            task.jobType = "jobType";
            task.status = "status";
            task.workedOnCode = "workedOnCode";
            task.adviceOutcome = "adviceOutcome";
            task.adviceCode = "adviceCode";
            task.report = "report";
            task.workDuration = 1;
            task.chargeableTime = 2;
            task.activity = "activity";
            task.productGroup = "productGroup";
            task.partType = "partType";
            task.faultActionCode = "faultActionCode";
            task.isPotentiallyPartLJReportable = true;
            task.isPartLJReportable = false;
            task.isFirstVisit = true;
            task.hasMainPart = true;
            task.mainPartPartType = "mainPartPartType";
            task.showMainPartSelectedWithInvalidActivityTypeMessage = true;
            task.showMainPartSelectedWithInvalidProductGroupTypeMessage = true;
            task.showMainPartSelectedWithInvalidPartTypeMessage = true;
            task.startTime = "09:00";
            task.endTime = "10:00";
            let job = new Job();
            job.tasks = [];
            job.tasks.push(task);
            vm = new TaskItemViewModel("1", job, task);
            
        });

        it("task business model fields mapped", () => {
            let bm = taskFactory.createTaskItemBusinessModel(vm, "1", "");
            expect(bm).toBeDefined();
            expect(bm.orderNo === 1).toBeTruthy();
            expect(bm.applianceType === "applianceType").toBeTruthy();
            expect(bm.status === "status").toBeTruthy();
            expect(bm.workedOnCode === "workedOnCode").toBeTruthy();
            expect(bm.adviceOutcome === "adviceOutcome").toBeTruthy();
            expect(bm.adviceCode === undefined).toBeTruthy();
            expect(bm.report === "report").toBeTruthy();
            expect(bm.workDuration === 1).toBeTruthy();
            expect(bm.chargeableTime === 2).toBeTruthy();
            expect(bm.activity === "activity").toBeTruthy();
            expect(bm.productGroup === "productGroup").toBeTruthy();
            expect(bm.partType === "partType").toBeTruthy();
            expect(bm.faultActionCode === "faultActionCode").toBeTruthy();
            expect(bm.isPartLJReportable === false).toBeTruthy();
            expect(bm.isFirstVisit === true).toBeTruthy();
            expect(bm.hasMainPart === true).toBeTruthy();
            expect(bm.mainPartPartType === "mainPartPartType").toBeTruthy();
            expect(bm.showMainPartSelectedWithInvalidActivityTypeMessage === true).toBeTruthy();
            expect(bm.showMainPartSelectedWithInvalidProductGroupTypeMessage === true).toBeTruthy();
            expect(bm.showMainPartSelectedWithInvalidPartTypeMessage === true).toBeTruthy();
        });
    });

    describe("the clearViewModel function", () => {
        let vm: TaskItemViewModel;
        let task: Task;
        let firstVisitTaskCode = "activity1";

        beforeEach(() => {
            task = new Task(true, true);
            task.id = "1";
            task.dataStateId = "dataStateId";
            task.dataState = DataState.dontCare;
            task.isCharge = true;
            task.orderNo = 1;
            task.applianceId = "applianceId";
            task.applianceType = "applianceType";
            task.jobType = "jobType";
            task.status = "status";
            task.workedOnCode = "workedOnCode";
            task.adviceOutcome = "adviceOutcome";
            task.adviceCode = "adviceCode";
            task.report = "report";
            task.workDuration = 1;
            task.chargeableTime = 2;
            task.activity = "activity";
            task.productGroup = "productGroup";
            task.partType = "partType";
            task.faultActionCode = "faultActionCode";
            task.isPotentiallyPartLJReportable = true;
            task.isPartLJReportable = false;
            task.isFirstVisit = true;
            task.hasMainPart = true;
            task.mainPartPartType = "mainPartPartType";
            task.showMainPartSelectedWithInvalidActivityTypeMessage = true;
            task.showMainPartSelectedWithInvalidProductGroupTypeMessage = true;
            task.showMainPartSelectedWithInvalidPartTypeMessage = true;
            task.startTime = "09:00";
            task.endTime = "10:00";
            let job = new Job();
            job.tasks = [];
            job.tasks.push(task);
            vm = new TaskItemViewModel("1", job, task);
            
        });

        it("task business model fields mapped", () => {
            taskFactory.clearViewModel(vm, task, firstVisitTaskCode, false);
            expect(vm).toBeDefined();
            expect(vm.status === undefined).toBeTruthy();
            expect(vm.workedOnCode === undefined).toBeTruthy();
            expect(vm.activity === undefined).toBeTruthy();
            expect(vm.adviceOutcome === undefined).toBeTruthy();
            expect(vm.adviceCode === undefined).toBeTruthy();
            expect(vm.adviceComment === undefined).toBeTruthy();
            expect(vm.taskReport === undefined).toBeTruthy();
            expect(vm.chirpCodes === undefined).toBeTruthy();
            expect(vm.faultActionCode === undefined).toBeTruthy();
            expect(vm.productGroup === undefined).toBeTruthy();
            expect(vm.partType === undefined).toBeTruthy();
            expect(vm.isPartLJReportable === undefined).toBeTruthy();
            expect(vm.chargeableTime === 2).toBeTruthy();
            expect(vm.workDuration === 1).toBeTruthy();
            expect(vm.taskTime).toBeDefined();
            expect(vm.taskTime.startTime === "09:00").toBeTruthy();
            expect(vm.taskTime.endTime === "10:00").toBeTruthy();
            expect(vm.totalPreviousWorkDuration === 0).toBeTruthy();
        });

        it("should not clear few properties if its a first visit task", () => {
            vm.showProductGroupAndPartTypes = true;
            vm.activity = "activity1";
            vm.visitActivityFilteredCatalog = [<IVisitActivityCode> {visitActivityCode: "abc", visitActivityDescription: "test", partsDataRequired: ""}]
            taskFactory.clearViewModel(vm, task, firstVisitTaskCode, false);
            expect(vm).toBeDefined();
            expect(vm.activity).toEqual("activity1");
            expect(vm.visitActivityFilteredCatalog.length).toEqual(1);
            expect(vm.partTypeFilteredCatalog.length).toEqual(0);
            expect(vm.faultActionCodeFilteredCatalog.length).toEqual(0);
            expect(vm.showProductGroupAndPartTypes).toBe(true);
      });

      it("should clear the view model", () => {
            vm.activity = "activity1";
            vm.visitActivityFilteredCatalog = [<IVisitActivityCode> {visitActivityCode: "abc", visitActivityDescription: "test", partsDataRequired: ""}]
            taskFactory.clearViewModel(vm, task, firstVisitTaskCode, true);
            expect(vm).toBeDefined();
            expect(vm.status === undefined).toBeTruthy();
            expect(vm.workedOnCode === undefined).toBeTruthy();
            expect(vm.activity === undefined).toBeTruthy();
            expect(vm.adviceOutcome === undefined).toBeTruthy();
            expect(vm.adviceCode === undefined).toBeTruthy();
            expect(vm.adviceComment === undefined).toBeTruthy();
            expect(vm.taskReport === undefined).toBeTruthy();
            expect(vm.chirpCodes === undefined).toBeTruthy();
            expect(vm.faultActionCode === undefined).toBeTruthy();
            expect(vm.productGroup === undefined).toBeTruthy();
            expect(vm.partType === undefined).toBeTruthy();
            expect(vm.isPartLJReportable === undefined).toBeTruthy();
            expect(vm.chargeableTime === 2).toBeTruthy();
            expect(vm.workDuration === 1).toBeTruthy();
            expect(vm.taskTime).toBeDefined();
            expect(vm.taskTime.startTime === "09:00").toBeTruthy();
            expect(vm.taskTime.endTime === "10:00").toBeTruthy();
            expect(vm.totalPreviousWorkDuration === 0).toBeTruthy();
            expect(vm.visitActivityFilteredCatalog.length).toEqual(0);
            expect(vm.partTypeFilteredCatalog.length).toEqual(0);
            expect(vm.faultActionCodeFilteredCatalog.length).toEqual(0);
            expect(vm.showProductGroupAndPartTypes).toBe(false);
        });

    });    
});
