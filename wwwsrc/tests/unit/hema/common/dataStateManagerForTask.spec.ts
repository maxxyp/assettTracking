/// <reference path="../../../../typings/app.d.ts" />

import {DataStateManager} from "../../../../app/hema/common/dataStateManager";
import { IBusinessRuleService } from "../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { ICatalogService } from "../../../../app/hema/business/services/interfaces/ICatalogService";
import { Appliance } from "../../../../app/hema/business/models/appliance";
import { Job } from '../../../../app/hema/business/models/job';
import { Task } from '../../../../app/hema/business/models/task';
import { QueryableBusinessRuleGroup } from "../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import { IObjectType } from '../../../../app/hema/business/models/reference/IObjectType';
import { ApplianceSafetyType } from '../../../../app/hema/business/models/applianceSafetyType';
import { DataState } from "../../../../app/hema/business/models/dataState";
import { IDataStateManager } from "../../../../app/hema/common/IDataStateManager";

describe("the dataStateManager", () => {

    let sandbox: Sinon.SinonSandbox;
    let dataStateManager: IDataStateManager;
    let businessRuleServiceStub: IBusinessRuleService;
    let catalogServiceStub: ICatalogService;
    let queryableRuleGroup = <QueryableBusinessRuleGroup>{};
    let getBusinessRuleStub: Sinon.SinonStub;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        getBusinessRuleStub = queryableRuleGroup.getBusinessRule = sandbox.stub();
        let getBusinessRuleListStub = queryableRuleGroup.getBusinessRuleList = sandbox.stub();
        getBusinessRuleListStub.withArgs("notDoingTaskStatuses").returns(["XB", "XC"]);
        getBusinessRuleStub.withArgs("applianceSafetyNotRequiredIndicator").returns("Y");
        businessRuleServiceStub = <IBusinessRuleService>{};
        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(queryableRuleGroup);
        catalogServiceStub = <ICatalogService>{};
        let applianceObjectType: IObjectType = <IObjectType>{};
        applianceObjectType.applianceSafetyNotRequiredIndicator = "Y";
        catalogServiceStub.getObjectType = sandbox.stub().resolves(undefined);
        dataStateManager = new DataStateManager(businessRuleServiceStub, catalogServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("the updateApplianceDataState function", () => {
        beforeEach(() => {

        });

        afterEach(() => {

        });

        describe("Non Landlord job", () => {
            describe("when linking a gas appliance to a task", () => {
                beforeEach(() => {

                });

                afterEach(() => {

                });

                it("Task status is D, appliance state is notVisited, safety state is notVisited", (done) => {
                    let appliance: Appliance = new Appliance();
                    let job: Job = new Job();
                    job.isLandlordJob = false;
                    appliance.id = "app1";
                    appliance.applianceSafetyType = ApplianceSafetyType.gas;
                    job.tasks = [];
                    let task = new Task(true, false);
                    task.applianceId = "app1";
                    task.status = "D";
                    job.tasks.push(task);
                    dataStateManager.updateApplianceDataState(appliance, job).then(() => {
                        expect(appliance.dataState === DataState.notVisited);
                        expect(appliance.safety.applianceGasSafety.dataState === DataState.notVisited);
                        done();
                    });
                });

                it("Task status is XB, appliance state is dontCare, safety state is dontCare", (done) => {
                    let appliance: Appliance = new Appliance();
                    let job: Job = new Job();
                    job.isLandlordJob = false;
                    appliance.id = "app1";
                    appliance.applianceSafetyType = ApplianceSafetyType.gas;
                    job.tasks = [];
                    let task = new Task(true, false);
                    task.applianceId = "app1";
                    task.status = "XB";
                    job.tasks.push(task);
                    dataStateManager.updateApplianceDataState(appliance, job).then(() => {
                        expect(appliance.dataState === DataState.dontCare);
                        expect(appliance.safety.applianceGasSafety.dataState === DataState.dontCare);
                        done();
                    });
                });

                it("Task status is XC, appliance state is dontCare, safety state is dontCare", (done) => {
                    let appliance: Appliance = new Appliance();
                    let job: Job = new Job();
                    job.isLandlordJob = false;
                    appliance.id = "app1";
                    appliance.applianceSafetyType = ApplianceSafetyType.gas;
                    job.tasks = [];
                    let task = new Task(true, false);
                    task.applianceId = "app1";
                    task.status = "XC";
                    job.tasks.push(task);
                    dataStateManager.updateApplianceDataState(appliance, job).then(() => {
                        expect(appliance.dataState === DataState.dontCare);
                        expect(appliance.safety.applianceGasSafety.dataState === DataState.dontCare);
                        done();
                    });
                });
            });

            describe("when linking an electrical appliance to a task", () => {
                beforeEach(() => {

                });

                afterEach(() => {

                });

                it("Task status is D, appliance state is notVisited, safety state is notVisited", (done) => {
                    let appliance: Appliance = new Appliance();
                    let job: Job = new Job();
                    job.isLandlordJob = false;
                    appliance.id = "app1";
                    appliance.applianceSafetyType = ApplianceSafetyType.electrical;
                    job.tasks = [];
                    let task = new Task(true, false);
                    task.applianceId = "app1";
                    task.status = "D";
                    job.tasks.push(task);
                    dataStateManager.updateApplianceDataState(appliance, job).then(() => {
                        expect(appliance.dataState === DataState.notVisited);
                        expect(appliance.safety.applianceGasSafety.dataState === DataState.notVisited);
                        done();
                    });
                });

                it("Task status is XB, appliance state is dontCare, safety state is dontCare", (done) => {
                    let appliance: Appliance = new Appliance();
                    let job: Job = new Job();
                    job.isLandlordJob = false;
                    appliance.id = "app1";
                    appliance.applianceSafetyType = ApplianceSafetyType.electrical;
                    job.tasks = [];
                    let task = new Task(true, false);
                    task.applianceId = "app1";
                    task.status = "XB";
                    job.tasks.push(task);
                    dataStateManager.updateApplianceDataState(appliance, job).then(() => {
                        expect(appliance.dataState === DataState.dontCare);
                        expect(appliance.safety.applianceGasSafety.dataState === DataState.dontCare);
                        done();
                    });
                });

                it("Task status is XC, appliance state is dontCare, safety state is dontCare", (done) => {
                    let appliance: Appliance = new Appliance();
                    let job: Job = new Job();
                    job.isLandlordJob = false;
                    appliance.id = "app1";
                    appliance.applianceSafetyType = ApplianceSafetyType.electrical;
                    job.tasks = [];
                    let task = new Task(true, false);
                    task.applianceId = "app1";
                    task.status = "XC";
                    job.tasks.push(task);
                    dataStateManager.updateApplianceDataState(appliance, job).then(() => {
                        expect(appliance.dataState === DataState.dontCare);
                        expect(appliance.safety.applianceGasSafety.dataState === DataState.dontCare);
                        done();
                    });
                });
            });

            describe("when linking other appliance to a task", () => {
                beforeEach(() => {

                });

                afterEach(() => {

                });

                it("Task status is D, appliance state is notVisited, safety state is notVisited", (done) => {
                    let appliance: Appliance = new Appliance();
                    let job: Job = new Job();
                    job.isLandlordJob = false;
                    appliance.id = "app1";
                    appliance.applianceSafetyType = ApplianceSafetyType.other;
                    job.tasks = [];
                    let task = new Task(true, false);
                    task.applianceId = "app1";
                    task.status = "D";
                    job.tasks.push(task);
                    dataStateManager.updateApplianceDataState(appliance, job).then(() => {
                        expect(appliance.dataState === DataState.notVisited);
                        expect(appliance.safety.applianceGasSafety.dataState === DataState.notVisited);
                        done();
                    });
                });

                it("Task status is XB, appliance state is dontCare, safety state is dontCare", (done) => {
                    let appliance: Appliance = new Appliance();
                    let job: Job = new Job();
                    job.isLandlordJob = false;
                    appliance.id = "app1";
                    appliance.applianceSafetyType = ApplianceSafetyType.other;
                    job.tasks = [];
                    let task = new Task(true, false);
                    task.applianceId = "app1";
                    task.status = "XB";
                    job.tasks.push(task);
                    dataStateManager.updateApplianceDataState(appliance, job).then(() => {
                        expect(appliance.dataState === DataState.dontCare);
                        expect(appliance.safety.applianceGasSafety.dataState === DataState.dontCare);
                        done();
                    });
                });

                it("Task status is XC, appliance state is dontCare, safety state is dontCare", (done) => {
                    let appliance: Appliance = new Appliance();
                    let job: Job = new Job();
                    job.isLandlordJob = false;
                    appliance.id = "app1";
                    appliance.applianceSafetyType = ApplianceSafetyType.other;
                    job.tasks = [];
                    let task = new Task(true, false);
                    task.applianceId = "app1";
                    task.status = "XC";
                    job.tasks.push(task);
                    dataStateManager.updateApplianceDataState(appliance, job).then(() => {
                        expect(appliance.dataState === DataState.dontCare);
                        expect(appliance.safety.applianceGasSafety.dataState === DataState.dontCare);
                        done();
                    });
                });
            });

            describe("when un-linking a gas appliance to a task", () => {
                beforeEach(() => {

                });

                afterEach(() => {

                });

                it("Task status is D, appliance state is dontCare, safety state is dontCare", (done) => {
                    let appliance: Appliance = new Appliance();
                    let job: Job = new Job();
                    job.isLandlordJob = false;
                    appliance.id = "app1";
                    appliance.applianceSafetyType = ApplianceSafetyType.gas;
                    job.tasks = [];
                    let task = new Task(true, false);
                    task.status = "D";
                    job.tasks.push(task);
                    dataStateManager.updateApplianceDataState(appliance, job).then(() => {
                        expect(appliance.dataState === DataState.dontCare);
                        expect(appliance.safety.applianceGasSafety.dataState === DataState.dontCare);
                        done();
                    });
                });

                it("Task status is XB, appliance state is dontCare, safety state is dontCare", (done) => {
                    let appliance: Appliance = new Appliance();
                    let job: Job = new Job();
                    job.isLandlordJob = false;
                    appliance.id = "app1";
                    appliance.applianceSafetyType = ApplianceSafetyType.gas;
                    job.tasks = [];
                    let task = new Task(true, false);
                    task.status = "XB";
                    job.tasks.push(task);
                    dataStateManager.updateApplianceDataState(appliance, job).then(() => {
                        expect(appliance.dataState === DataState.dontCare);
                        expect(appliance.safety.applianceGasSafety.dataState === DataState.dontCare);
                        done();
                    });
                });

                it("Task status is XC, appliance state is dontCare, safety state is dontCare", (done) => {
                    let appliance: Appliance = new Appliance();
                    let job: Job = new Job();
                    job.isLandlordJob = false;
                    appliance.id = "app1";
                    appliance.applianceSafetyType = ApplianceSafetyType.gas;
                    job.tasks = [];
                    let task = new Task(true, false);
                    task.status = "XC";
                    job.tasks.push(task);
                    dataStateManager.updateApplianceDataState(appliance, job).then(() => {
                        expect(appliance.dataState === DataState.dontCare);
                        expect(appliance.safety.applianceGasSafety.dataState === DataState.dontCare);
                        done();
                    });
                });
            });

            describe("when un-linking an electrical appliance to a task", () => {
                beforeEach(() => {

                });

                afterEach(() => {

                });

                it("Task status is D, appliance state is dontCare, safety state is dontCare", (done) => {
                    let appliance: Appliance = new Appliance();
                    let job: Job = new Job();
                    job.isLandlordJob = false;
                    appliance.id = "app1";
                    appliance.applianceSafetyType = ApplianceSafetyType.electrical;
                    job.tasks = [];
                    let task = new Task(true, false);
                    task.status = "D";
                    job.tasks.push(task);
                    dataStateManager.updateApplianceDataState(appliance, job).then(() => {
                        expect(appliance.dataState === DataState.dontCare);
                        expect(appliance.safety.applianceGasSafety.dataState === DataState.dontCare);
                        done();
                    });
                });

                it("Task status is XB, appliance state is dontCare, safety state is dontCare", (done) => {
                    let appliance: Appliance = new Appliance();
                    let job: Job = new Job();
                    job.isLandlordJob = false;
                    appliance.id = "app1";
                    appliance.applianceSafetyType = ApplianceSafetyType.electrical;
                    job.tasks = [];
                    let task = new Task(true, false);
                    task.status = "XB";
                    job.tasks.push(task);
                    dataStateManager.updateApplianceDataState(appliance, job).then(() => {
                        expect(appliance.dataState === DataState.dontCare);
                        expect(appliance.safety.applianceGasSafety.dataState === DataState.dontCare);
                        done();
                    });
                });

                it("Task status is XC, appliance state is dontCare, safety state is dontCare", (done) => {
                    let appliance: Appliance = new Appliance();
                    let job: Job = new Job();
                    job.isLandlordJob = false;
                    appliance.id = "app1";
                    appliance.applianceSafetyType = ApplianceSafetyType.electrical;
                    job.tasks = [];
                    let task = new Task(true, false);
                    task.status = "XC";
                    job.tasks.push(task);
                    dataStateManager.updateApplianceDataState(appliance, job).then(() => {
                        expect(appliance.dataState === DataState.dontCare);
                        expect(appliance.safety.applianceGasSafety.dataState === DataState.dontCare);
                        done();
                    });
                });
            });

            describe("when un-linking an other appliance to a task", () => {
                beforeEach(() => {

                });

                afterEach(() => {

                });

                it("Task status is D, appliance state is dontCare, safety state is dontCare", (done) => {
                    let appliance: Appliance = new Appliance();
                    let job: Job = new Job();
                    job.isLandlordJob = false;
                    appliance.id = "app1";
                    appliance.applianceSafetyType = ApplianceSafetyType.other;
                    job.tasks = [];
                    let task = new Task(true, false);
                    task.status = "D";
                    job.tasks.push(task);
                    dataStateManager.updateApplianceDataState(appliance, job).then(() => {
                        expect(appliance.dataState === DataState.dontCare);
                        expect(appliance.safety.applianceGasSafety.dataState === DataState.dontCare);
                        done();
                    });
                });

                it("Task status is XB, appliance state is dontCare, safety state is dontCare", (done) => {
                    let appliance: Appliance = new Appliance();
                    let job: Job = new Job();
                    job.isLandlordJob = false;
                    appliance.id = "app1";
                    appliance.applianceSafetyType = ApplianceSafetyType.other;
                    job.tasks = [];
                    let task = new Task(true, false);
                    task.status = "XB";
                    job.tasks.push(task);
                    dataStateManager.updateApplianceDataState(appliance, job).then(() => {
                        expect(appliance.dataState === DataState.dontCare);
                        expect(appliance.safety.applianceGasSafety.dataState === DataState.dontCare);
                        done();
                    });
                });

                it("Task status is XC, appliance state is dontCare, safety state is dontCare", (done) => {
                    let appliance: Appliance = new Appliance();
                    let job: Job = new Job();
                    job.isLandlordJob = false;
                    appliance.id = "app1";
                    appliance.applianceSafetyType = ApplianceSafetyType.other;
                    job.tasks = [];
                    let task = new Task(true, false);
                    task.status = "XC";
                    job.tasks.push(task);
                    dataStateManager.updateApplianceDataState(appliance, job).then(() => {
                        expect(appliance.dataState === DataState.dontCare);
                        expect(appliance.safety.applianceGasSafety.dataState === DataState.dontCare);
                        done();
                    });
                });
            });
        });
    });
});
