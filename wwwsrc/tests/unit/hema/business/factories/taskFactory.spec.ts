/// <reference path="../../../../../typings/app.d.ts" />
import { TaskFactory } from "../../../../../app/hema/business/factories/taskFactory";
import { ITask as TaskApiModel } from "../../../../../app/hema/api/models/fft/jobs/ITask";
import { IActivity as ActivityApiModel } from "../../../../../app/hema/api/models/fft/jobs/IActivity";
import { IPart as PartApiModel } from "../../../../../app/hema/api/models/fft/jobs/IPart";
import { DateHelper } from "../../../../../app/hema/core/dateHelper";
import { IPartFactory } from "../../../../../app/hema/business/factories/interfaces/IPartFactory";
import { IBusinessRuleService } from "../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { QueryableBusinessRuleGroup } from "../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import { ICatalogService } from "../../../../../app/hema/business/services/interfaces/ICatalogService";
import { Task } from "../../../../../app/hema/business/models/task";
import { Job } from "../../../../../app/hema/business/models/job";
import { JobNotDoingReason } from "../../../../../app/hema/business/models/jobNotDoingReason";
import { IChargeType } from "../../../../../app/hema/business/models/reference/IChargeType";
import SinonFakeTimers = Sinon.SinonFakeTimers;

describe("the TaskFactory module", () => {
    let taskFactory: TaskFactory;
    let sandbox: Sinon.SinonSandbox;
    let taskApiModel: TaskApiModel;

    let businessRuleServiceStub: IBusinessRuleService;
    let catalogServiceStub: ICatalogService;
    let partFactoryStub: IPartFactory;
    let clock: SinonFakeTimers;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        businessRuleServiceStub = <IBusinessRuleService>{};

        let ruleGroup = <QueryableBusinessRuleGroup>{};
        ruleGroup.getBusinessRuleList = sandbox.stub().returns([]);
        ruleGroup.getBusinessRuleList = sandbox.stub().withArgs("taskNotRequriedDuration").returns(["VO","XB","XC","NA"]);
        ruleGroup.getBusinessRuleList = sandbox.stub().withArgs("middlewareDoTodayStatuses").returns(["D"]);
        ruleGroup.getBusinessRule = sandbox.stub().returns("");

        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(ruleGroup);
        catalogServiceStub = <ICatalogService>{};
        partFactoryStub = <IPartFactory>{};

        taskFactory = new TaskFactory(partFactoryStub, businessRuleServiceStub, catalogServiceStub);
        taskApiModel = <TaskApiModel>{};

        clock = sinon.useFakeTimers(new Date("2017-09-12").getTime());
    });

    afterEach(() => {
        sandbox.restore();
        clock.restore();
    });

    it("can be created", () => {
        expect(taskFactory).toBeDefined();
    });

    it("can create business model", done => {
        taskFactory.createTaskBusinessModel(taskApiModel, null, true)
            .then(taskBusinessModel => {
                expect(taskBusinessModel).toBeDefined();
                done();
            });
    });

    it("can map the whole thing", done => {
        taskApiModel.id = "id";
        taskApiModel.jobType = "jobType";
        taskApiModel.applianceType = "applianceType";
        taskApiModel.applianceId = "applianceId";
        taskApiModel.chargeType = "chargeType";
        taskApiModel.status = "foobar";

        let activityApiModel = <ActivityApiModel>{};

        activityApiModel.date = "2016-06-13";
        activityApiModel.engineerName = "engineerName";
        activityApiModel.report = "report";
        activityApiModel.status = "c";
        activityApiModel.chargeableTime = 10;
        activityApiModel.workDuration = 5;

        let partApiModel = <PartApiModel>{};
        partApiModel.status = "status";
        partApiModel.description = "description";
        partApiModel.quantity = 1234;
        partApiModel.stockReferenceId = "stockReferenceId";

        activityApiModel.parts = [partApiModel];
        taskApiModel.activities = [activityApiModel];
        taskFactory.createTaskBusinessModel(taskApiModel, null, true)
            .then(taskBusinessModel => {
                expect(taskBusinessModel.id).toBe("id");
                expect(taskBusinessModel.jobType).toBe("jobType");
                expect(taskBusinessModel.applianceType).toBe("applianceType");
                expect(taskBusinessModel.applianceId).toBe("applianceId");
                expect(taskBusinessModel.chargeType).toBe("chargeType");

                expect(taskBusinessModel.activities.length).toBe(1);
                expect(taskBusinessModel.activities[0].date).toEqual(DateHelper.fromJsonDateString("2016-06-13"));
                expect(taskBusinessModel.activities[0].status).toBe("c");
                expect(taskBusinessModel.activities[0].engineerName).toBe("engineerName");
                expect(taskBusinessModel.activities[0].report).toBe("report");
                expect(taskBusinessModel.activities[0].workDuration).toBe(5);
                expect(taskBusinessModel.activities[0].chargeableTime).toBe(10);

                expect(taskBusinessModel.activities[0].parts.length).toBe(1);
                expect(taskBusinessModel.activities[0].parts[0].status).toBe("status");
                expect(taskBusinessModel.activities[0].parts[0].description).toBe("description");
                expect(taskBusinessModel.activities[0].parts[0].quantity).toBe(1234);
                expect(taskBusinessModel.activities[0].parts[0].stockReferenceId).toBe("stockReferenceId");

                done();
            });
    });

    it("can map previous activities for tasks", done => {

        taskApiModel.id = "id";
        taskApiModel.jobType = "jobType";
        taskApiModel.applianceType = "applianceType";
        taskApiModel.applianceId = "applianceId";
        taskApiModel.chargeType = "chargeType";
        taskApiModel.sequence = 4;

        // simulate multiple activities, i.e. activities for a given task

        let activityApiModelOne = <ActivityApiModel>{};

        activityApiModelOne.date = "2016-06-13";
        activityApiModelOne.status = "status0";
        activityApiModelOne.engineerName = "engineer0";
        activityApiModelOne.report = "report0";
        activityApiModelOne.sequence = 1;

        let activityApiModelTwo = <ActivityApiModel>{};

        activityApiModelTwo.date = "2016-06-14";
        activityApiModelTwo.status = "status1";
        activityApiModelTwo.engineerName = "engineer1";
        activityApiModelTwo.report = "report1";
        activityApiModelTwo.sequence = 2;

        let activityApiModelThree = <ActivityApiModel>{};

        activityApiModelThree.date = "2016-06-15";
        activityApiModelThree.status = "status2";
        activityApiModelThree.engineerName = "engineer2";
        activityApiModelThree.report = "report2";
        activityApiModelThree.sequence = 3;

        // current activity

        let activityApiModelFour = <ActivityApiModel>{};

        activityApiModelFour.date = "2016-06-15";
        activityApiModelFour.status = "D";
        activityApiModelFour.engineerName = "engineer3";
        activityApiModelFour.report = "report3";
        activityApiModelFour.sequence = 4;

        taskApiModel.activities = [];
        taskApiModel.activities.push(activityApiModelOne);
        taskApiModel.activities.push(activityApiModelTwo);
        taskApiModel.activities.push(activityApiModelThree);
        taskApiModel.activities.push(activityApiModelFour);

        taskFactory.createTaskBusinessModel(taskApiModel, null, true)
            .then(taskBusinessModel => {
                expect(taskBusinessModel.previousVisits).toBeDefined();
                expect(taskBusinessModel.previousVisits.length).toBe(3);

                expect(taskBusinessModel.previousVisits[0].date).toEqual("2016-06-13");
                expect(taskBusinessModel.previousVisits[0].status).toEqual("status0");
                expect(taskBusinessModel.previousVisits[0].engineerName).toEqual("engineer0");
                expect(taskBusinessModel.previousVisits[0].report).toEqual("report0");

                expect(taskBusinessModel.previousVisits[1].date).toEqual("2016-06-14");
                expect(taskBusinessModel.previousVisits[1].status).toEqual("status1");
                expect(taskBusinessModel.previousVisits[1].engineerName).toEqual("engineer1");
                expect(taskBusinessModel.previousVisits[1].report).toEqual("report1");

                expect(taskBusinessModel.previousVisits[2].date).toEqual("2016-06-15");
                expect(taskBusinessModel.previousVisits[2].status).toEqual("status2");
                expect(taskBusinessModel.previousVisits[2].engineerName).toEqual("engineer2");
                expect(taskBusinessModel.previousVisits[2].report).toEqual("report2");
                done();
            });
    });

    describe("createTaskApiModel", () => {

        beforeEach(() => {
            partFactoryStub.createPartsChargedApiModelsFromBusinessModels
                = partFactoryStub.createPartsUsedApiModelsFromBusinessModels
                = partFactoryStub.createPartsNotUsedApiModelsFromBusinessModels
                = partFactoryStub.createPartsClaimedUnderWarrantyApiModelsFromBusinessModels
                = sandbox.stub().resolves(null);

            catalogServiceStub.getActivityComponentVisitStatuses = sandbox.stub().resolves(null);
            catalogServiceStub.getChargeType = sandbox.stub().resolves(<IChargeType>{ chargePartsIndicator: "Y" })
        });

        it("can set time and activity fields for a non-No Accessed job", done => {
            let task = <Task>{};
            task.workDuration = 10;
            task.chargeableTime = 5;
            task.workedOnCode = "A";
            task.activity = "B";
            task.faultActionCode = "C";
            task.chirpCodes = ["ABCD", "EFG"];
            task.report = "ALL GOOD";

            taskFactory.createTaskApiModel(task, <Job>{
                tasks: [task]
            })
                .then(apiModel => {
                    expect(apiModel.workDuration).toBe(10);
                    expect(apiModel.chargeableTime).toBe(5);
                    expect(apiModel.workedOnCode).toBe("A");
                    expect(apiModel.visitActivityCode).toBe("B");
                    expect(apiModel.faultActionCode).toBe("C");
                    expect(apiModel.report).toBe("ABCD EFG ALL GOOD");
                    done();
                })
                .catch((error) => {
                    fail("should not be here: " + error);
                });
        });

        it("can set time fields to undefined and not set activity fields for a No Accessed job", done => {
            let task = <Task>{};
            task.status = "NA";
            task.workDuration = 10;
            task.chargeableTime = 5;
            task.workedOnCode = "A";
            task.activity = "B";
            task.faultActionCode = "C";
            task.adviceCode = "test";
            task.adviceComment = "test";
            task.startTime = "10:00";
            task.endTime = "11:00";
            task.chirpCodes = ["test"];
            task.report = "test";
            task.adviceOutcome = "test";
            task.isTaskThatSetsJobAsNoAccessed = true;
            task.isNotDoingTask = false;

            taskFactory.createTaskApiModel(task, <Job>{
                tasks: [task],
                jobNotDoingReason: JobNotDoingReason.taskNoAccessed
            })
                .then(apiModel => {
                    expect(apiModel.workDuration).toBe(0);
                    expect(apiModel.chargeableTime).toBe(0);
                    expect(apiModel.workedOnCode).toBeUndefined();
                    expect(apiModel.visitActivityCode).toBeUndefined();
                    expect(apiModel.faultActionCode).toBeUndefined();
                    expect(apiModel.energyAdviceCategoryCode).toBeUndefined();
                    expect(apiModel.energyEfficiencyOutcome).toBeUndefined();
                    expect(apiModel.energyEfficiencyAdviceComments).toBeUndefined();
                    expect(apiModel.report).toBe("test");
                    expect(apiModel.componentEndTime).not.toBeUndefined();
                    expect(apiModel.componentStartTime).not.toBeUndefined();
                    done();
                })
                .catch((error) => {
                    fail("should not be here: " + error);
                });
        });

        it("should create task api model and set the activity fields", done => {
            let task = <Task>{};
            task.workDuration = 10;
            task.chargeableTime = 5;
            task.workedOnCode = "A";
            task.activity = "B";
            task.faultActionCode = "C";
            task.adviceCode = "test";
            task.adviceComment = "test";
            task.startTime = "10:00";
            task.endTime = "11:00";
            task.chirpCodes = ["1AAA1"];
            task.report = "test";
            task.adviceOutcome = "test";
            task.status = "C";
            task.isNotDoingTask = false;
            task.isTaskThatSetsJobAsNoAccessed = false;

            taskFactory.createTaskApiModel(task, <Job>{
                tasks: [task],
                jobNotDoingReason: undefined
            })
                .then(apiModel => {
                    expect(apiModel.workDuration).toBe(10);
                    expect(apiModel.chargeableTime).toBe(5);
                    expect(apiModel.workedOnCode).toBe("A");
                    expect(apiModel.visitActivityCode).toBe("B");
                    expect(apiModel.faultActionCode).toBe("C");
                    expect(apiModel.energyAdviceCategoryCode).toBe("test");
                    expect(apiModel.energyEfficiencyOutcome).toBe("test");
                    expect(apiModel.energyEfficiencyAdviceComments).toBe("test");
                    expect(apiModel.report).toBe("1AAA1 test");
                    expect(apiModel.componentEndTime).not.toBeUndefined();
                    expect(apiModel.componentStartTime).not.toBeUndefined();
                    done();
                })
                .catch((error) => {
                    fail("should not be here: " + error);
                });
        });

        it("task status XB, can set time fields to undefined and not set activity fields for a cancelled job", done => {
            let task = <Task>{};
            task.workDuration = 10;
            task.chargeableTime = 5;
            task.workedOnCode = "A";
            task.activity = "B";
            task.faultActionCode = "C";
            task.adviceCode = "test";
            task.adviceComment = "test";
            task.startTime = "10:00";
            task.endTime = "11:00";
            task.chirpCodes = ["test"];
            task.report = "test";
            task.adviceOutcome = "test";
            task.isTaskThatSetsJobAsNoAccessed = false;
            task.isNotDoingTask = true;
            task.status = "XB";

            taskFactory.createTaskApiModel(task, <Job>{
                tasks: [task],
                jobNotDoingReason: undefined
            })
                .then(apiModel => {
                    expect(apiModel.workDuration).toBe(0);
                    expect(apiModel.chargeableTime).toBe(0);
                    expect(apiModel.workedOnCode).toBeUndefined();
                    expect(apiModel.visitActivityCode).toBeUndefined();
                    expect(apiModel.faultActionCode).toBeUndefined();
                    expect(apiModel.energyAdviceCategoryCode).toBeUndefined();
                    expect(apiModel.energyEfficiencyOutcome).toBeUndefined();
                    expect(apiModel.energyEfficiencyAdviceComments).toBeUndefined();
                    expect(apiModel.report).toBe("test");
                    expect(apiModel.componentEndTime).not.toBeUndefined();
                    expect(apiModel.componentStartTime).not.toBeUndefined();
                    done();
                })
                .catch((error) => {
                    fail("should not be here: " + error);
                });
        });

        it("task status XC, can set time fields to undefined", done => {
            let task = <Task>{};
            task.workDuration = 10;
            task.chargeableTime = 5;
            task.isTaskThatSetsJobAsNoAccessed = false;
            task.isNotDoingTask = true;
            task.status = "XC";

            taskFactory.createTaskApiModel(task, <Job>{
                tasks: [task],
                jobNotDoingReason: undefined
            })
                .then(apiModel => {
                    expect(apiModel.workDuration).toBe(0);
                    expect(apiModel.chargeableTime).toBe(0);
                    done();
                })
                .catch((error) => {
                    fail("should not be here: " + error);
                });
        });

        it("task status VO, can set time fields to undefined", done => {
            let task = <Task>{};
            task.workDuration = 10;
            task.chargeableTime = 5;
            task.isTaskThatSetsJobAsNoAccessed = false;
            task.isNotDoingTask = true;
            task.status = "VO";

            taskFactory.createTaskApiModel(task, <Job>{
                tasks: [task],
                jobNotDoingReason: undefined
            })
                .then(apiModel => {
                    expect(apiModel.workDuration).toBe(0);
                    expect(apiModel.chargeableTime).toBe(0);
                    done();
                })
                .catch((error) => {
                    fail("should not be here: " + error);
                });
        });
    });
});
