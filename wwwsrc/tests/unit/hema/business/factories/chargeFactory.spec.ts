/// <reference path="../../../../../typings/app.d.ts" />

import { IBusinessRuleService } from "../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { ChargeFactory } from "../../../../../app/hema/business/factories/chargeFactory";
import { ITask as TaskApiUpdateModel } from "../../../../../app/hema/api/models/fft/jobs/jobupdate/ITask";
import { ChargeableTask } from "../../../../../app/hema/business/models/charge/chargeableTask";
import * as bignumber from "bignumber";
import { Task } from "../../../../../app/hema/business/models/task";
import { ChargeableLabourItem } from "../../../../../app/hema/business/models/charge/chargeableLabourItem";
import { ICatalogService } from "../../../../../app/hema/business/services/interfaces/ICatalogService";
import { PrimeSubCharge } from "../../../../../app/hema/business/models/charge/primeSubCharge";
import { QueryableBusinessRuleGroup } from "../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import { IChargeType } from "../../../../../app/hema/business/models/reference/IChargeType";

describe("the ChargeFactory module", () => {
    let chargeFactory: ChargeFactory;
    let sandbox: Sinon.SinonSandbox;
    let businessRuleServiceStub: IBusinessRuleService;
    let taskApiModels: TaskApiUpdateModel [];
    let chargeableTasks: ChargeableTask [];
    let queryableRuleGroup = <QueryableBusinessRuleGroup>{};
    let catalogServiceStub: ICatalogService;

    let taskApiModel: TaskApiUpdateModel;
    let chargeableTask: ChargeableTask;

    function bNum(val: number): bignumber.BigNumber {
        return new bignumber.BigNumber(val);
    }

    beforeEach(() => {

        catalogServiceStub = <ICatalogService>{};

        sandbox = sinon.sandbox.create();

        businessRuleServiceStub = <IBusinessRuleService>{};

        let getBusinessRuleStub = queryableRuleGroup.getBusinessRule = sandbox.stub();
        let getBusinessRuleListStub = queryableRuleGroup.getBusinessRuleList = sandbox.stub();

        getBusinessRuleStub.withArgs("noDiscountCode").returns("XXX");
        getBusinessRuleListStub.withArgs("incompleteStatuses").returns(["IA", "IH", "IF", "IP"]);

        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(queryableRuleGroup);

        const chargeType = <IChargeType>{
            vatCode: "D"
        };

        catalogServiceStub.getChargeType = sandbox.stub().resolves(chargeType);

        chargeFactory = new ChargeFactory(businessRuleServiceStub, catalogServiceStub);
        taskApiModels = [];
        chargeableTasks = [];

        taskApiModel = <TaskApiUpdateModel>{};
        chargeableTask = new ChargeableTask();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(chargeFactory).toBeDefined();
    });

    it("returns task api model when no charge data", done => {

        taskApiModel = <TaskApiUpdateModel>{};
        taskApiModel.chargeType = "someChargeType";

        let taskApiModel2 = <TaskApiUpdateModel>{};
        taskApiModel2.chargeType = "someChargeType";

        // assume two tasks, but 0 zero chargeable tasks, e.g. both tasks have been cancelled
        taskApiModels = [taskApiModel, taskApiModel2];

        chargeableTasks = [];

        // expect first task to be flagged as prime, second defaults to non-prime

        chargeFactory.createChargeApiModel(chargeableTasks, taskApiModels)
            .then(result => {
                expect(result).toBeDefined();
                expect(result[0].subsequentJobIndicator).toBe(false);
                expect(result[0].vatCode).toBe('D');
                expect(result[0].vatAmount).toBe(0);
                expect(result[0].chargeExcludingVAT).toBe(0);

                expect(result[1].subsequentJobIndicator).toBe(true);
                expect(result[1].vatCode).toBe('D');
                expect(result[1].vatAmount).toBe(0);
                expect(result[1].chargeExcludingVAT).toBe(0);
                done();
            });
    });

    it("defaults chargeExcludingVat to 0", done => {

        let task = new Task(false, false);
        task.id = "999";

        chargeableTask.task = task;
        chargeableTask.task.isCharge = false;

        taskApiModel.id = "999";
        taskApiModel.chargeType = "someChargeType";

        taskApiModels = [taskApiModel];
        chargeableTasks = [chargeableTask];

        chargeFactory.createChargeApiModel(chargeableTasks, taskApiModels)
            .then(results => {
                expect(results[0].chargeExcludingVAT).toBe(0);
                done();
            });
    });

    describe("maps chargeableMain to taskUpdateApi", () => {

        beforeEach(() => {

            chargeableTask.vat = new bignumber.BigNumber(20);
            chargeableTask.vatCode = "D";

            let task = new Task(false, false);
            task.id = "999";

            chargeableTask.task = task;
            chargeableTask.task.isCharge = true;

            taskApiModel.id = "999";
            taskApiModel.chargeType = "someChargeType";
        });

        describe("parts charge", () => {

            beforeEach(() => {
                chargeableTask.addPartItem("part", bNum(10), false, false, 10, 5, "stockReferenceId", 1, 2);

                taskApiModels = [taskApiModel];
                chargeableTasks = [chargeableTask];
            });

            it("should map chargeExcludingVAT", done => {

                chargeFactory.createChargeApiModel(chargeableTasks, taskApiModels)
                    .then(result => {
                        expect(result[0].chargeExcludingVAT).toEqual(1000);
                        done();
                    });
            });

            it("should map VAT related fields", done => {
                chargeFactory.createChargeApiModel(chargeableTasks, taskApiModels)
                    .then(results => {
                        const [result] = results;
                        expect(result.vatAmount).toEqual(200);
                        expect(result.vatCode).toEqual("D");
                        done();
                    });
            });

            it("should map default values for labour related fields", done => {
                chargeFactory.createChargeApiModel(chargeableTasks, taskApiModels)
                    .then(result => {
                        expect(result[0].standardLabourChargeIndicator).toEqual(false);
                        done();
                    });
            });

            it("should map discount code and amount", done => {

                chargeableTask.discountCode = "D";
                chargeableTask.discountAmount = new bignumber.BigNumber(10);
                chargeFactory.createChargeApiModel(chargeableTasks, taskApiModels)
                    .then(results => {
                        const [result] = results;
                        expect(result.discountCode).toEqual("D");
                        expect(result.discountAmount).toEqual(1000);
                        done();
                    });
            });

            it("should map set discount code to undefined if special no discount value", done => {

                chargeableTask.discountCode = "XXX";
                chargeableTask.discountAmount = new bignumber.BigNumber(10);
                chargeFactory.createChargeApiModel(chargeableTasks, taskApiModels)
                    .then(results => {
                        const [result] = results;
                        expect(result.discountCode).toBeUndefined();
                        expect(result.discountAmount).toEqual(1000);
                        done();
                    });
            });

            it("should map undefined discount code and amount", done => {

                chargeableTask.discountCode = undefined;
                chargeableTask.discountAmount = undefined;
                chargeFactory.createChargeApiModel(chargeableTasks, taskApiModels)
                    .then(results => {
                        const [result] = results;
                        expect(result.discountCode).toBeUndefined();
                        expect(result.discountAmount).toBeUndefined();
                        done();
                    });
            });

            it("should set zero vat for a non chargeable task and undefined for discountcode", done => {
                chargeableTask.task.isCharge = false;
                taskApiModel.chargeType = "SLONONE";

                chargeFactory.createChargeApiModel(chargeableTasks, taskApiModels)
                    .then(results => {
                        const [result] = results;
                        expect(result.vatAmount).toEqual(0);
                        expect(result.chargeExcludingVAT).toEqual(0);
                        expect(result.vatCode).toEqual("D");
                        expect(result.discountCode).toBeUndefined();
                        done();
                    });
            });

            it("should set isSubsequent for no charge tasks", done => {
                chargeableTask.task.isCharge = false;
                chargeableTask.isSubsequent = false;
                chargeFactory.createChargeApiModel(chargeableTasks, taskApiModels)
                    .then(results => {
                        const [result] = results;
                        expect(result.subsequentJobIndicator).toEqual(false);
                        done();
                    });
            });

            // in example where all tasks are non chargeable then we need to flag at least one item as prime, chargesService
            // will not create any chargableTasks, so we do it as factory level. This is an api requirement.

            it("should set subsequentJobIndicator status to false for first item if all true", done => {
                chargeableTask.task.isCharge = false;
                chargeableTask.isSubsequent = true;

                const chargeableTask2 = Object.assign({}, chargeableTask);
                const taskApiModel2 = Object.assign({}, taskApiModel);

                chargeFactory.createChargeApiModel([chargeableTask, chargeableTask2], [taskApiModel, taskApiModel2])
                    .then(results => {
                        const [first, second] = results;
                        expect(first.subsequentJobIndicator).toEqual(false);
                        expect(second.subsequentJobIndicator).toEqual(true);
                        done();
                    });
            });

            // in this instance we have calculated a prime status, should retain that
            it("should retain subsequentJobIndicator if already set from previous calculations", done => {
                chargeableTask.task.isCharge = false;
                chargeableTask.isSubsequent = true;

                let taskApiModel2 = Object.assign({}, taskApiModel);
                taskApiModel2.id = "222";

                let task2 = new Task(false, false);
                task2.isCharge = true;
                task2.id = "222";

                let chargeableTask2 = new ChargeableTask();
                chargeableTask2.vat = new bignumber.BigNumber(20);
                chargeableTask2.vatCode = "D";
                chargeableTask2.task = task2;
                chargeableTask2.labourItem.netAmount = new bignumber.BigNumber(82.5);
                chargeableTask2.labourItem.chargePair.primeCharge = new bignumber.BigNumber(82.5);

                chargeableTask2.isSubsequent = false;
                chargeableTask2.task = task2;

                chargeFactory.createChargeApiModel([chargeableTask, chargeableTask2], [taskApiModel, taskApiModel2])
                    .then(results => {
                        const [first, second] = results;
                        expect(first.subsequentJobIndicator).toEqual(true);
                        expect(second.subsequentJobIndicator).toEqual(false);
                        done();
                    });
            });

            it("should set subsequentJobIndicator status to false if single item and initially not prime", done => {
                chargeableTask.task.isCharge = false;
                chargeableTask.isSubsequent = true;
                chargeFactory.createChargeApiModel(chargeableTasks, taskApiModels)
                    .then(results => {
                        const [result] = results;
                        expect(result.subsequentJobIndicator).toEqual(false);
                        done();
                    });
            });

            it("should define total labour charge as net amount", done => {

                chargeableTask.labourItem.netAmount = new bignumber.BigNumber(10);
                chargeableTask.labourItem.vat = new bignumber.BigNumber(20);

                chargeFactory.createChargeApiModel(chargeableTasks, taskApiModels)
                    .then(result => {
                        expect(result[0].totalLabourCharged).toEqual(1000);
                        done();
                    });
            });
        });
    });

    describe("generate charges in pence for task update api model", () => {
        let chargeableTask = new ChargeableTask();

        beforeEach(() => {

            let task = new Task(false, false);
            task.id = "999";

            chargeableTask.vat = new bignumber.BigNumber(20);
            chargeableTask.vatCode = "D";
            chargeableTask.task = task;
            chargeableTask.task.isCharge = true;

            chargeableTask.labourItem.netAmount = new bignumber.BigNumber(82.5);
            chargeableTask.labourItem.chargePair.primeCharge = new bignumber.BigNumber(82.5);
            chargeableTask.labourItem.vat = new bignumber.BigNumber(200);
            chargeableTask.vat = new bignumber.BigNumber(200);
            chargeableTask.discountAmount = new bignumber.BigNumber(24.75);

            taskApiModel.id = task.id;
            taskApiModel.chargeType = "someChargeType";

            taskApiModels = [taskApiModel];
            chargeableTasks = [chargeableTask];

        });

        it("applies correct values for labour tasks", (done) => {

            chargeFactory.createChargeApiModel(chargeableTasks, taskApiModels)
                .then(results => {

                    const [result] = results;

                    expect(result.chargeExcludingVAT).toEqual(5775); // expect discount to be applied
                    expect(result.vatAmount).toEqual(11550); // expect vat to be applied AFTER discount
                    expect(result.totalLabourCharged).toEqual(8250);
                    expect(result.discountAmount).toEqual(2475);
                    done();
                });
        });

        it("applies correct values for labour tasks", (done) => {

            chargeableTask.labourItem = new ChargeableLabourItem();
            chargeableTask.addPartItem("", new bignumber.BigNumber(99), false, false, 1, 1, "", 0, 0);

            chargeFactory.createChargeApiModel(chargeableTasks, taskApiModels).then(results => {

                const [result] = results;

                expect(result.chargeExcludingVAT).toEqual(7425); // expect discount to be applied
                expect(result.vatAmount).toEqual(14850); // expect vat to be applied AFTER discount
                expect(result.totalLabourCharged).toEqual(0);
                done();
            });

        });

    });

    describe("map task with no charges at all", () => {

        it("generates vat code and zero charge", (done) => {

            taskApiModel.chargeType = "someChargeType";

            taskApiModels = [taskApiModel];
            chargeableTasks = [];

            chargeFactory.createChargeApiModel(chargeableTasks, taskApiModels).then(results => {
                const [result] = results;
                expect(result.chargeExcludingVAT).toEqual(0);
                expect(result.vatAmount).toEqual(0);
                expect(result.vatCode).toEqual('D');
                done();
            });
        });
    });

    describe("maps new tasks", () => {
        // see DF_1577, new tasks not being added to charges on job update, becuase taskId is null, should use fieldTaskId
        it("maps when taskId empty, isNewRFA and searches by fieldTaskId", (done) => {

            const id = "123456789";
            const fieldTaskId = "abc";

            let task = new Task(false, true);
            task.id = id;

            chargeableTask.task = task;
            chargeableTask.task.isCharge = true;
            chargeableTask.task.fieldTaskId = fieldTaskId;

            chargeableTask.labourItem = new ChargeableLabourItem();
            chargeableTask.labourItem.chargePair = new PrimeSubCharge(0, 0);
            chargeableTask.labourItem.netAmount = new bignumber.BigNumber(82.5);
            chargeableTask.labourItem.chargePair.primeCharge = new bignumber.BigNumber(82.5);
            chargeableTask.labourItem.vat = new bignumber.BigNumber(200);
            chargeableTask.vat = new bignumber.BigNumber(200);
            chargeableTask.discountAmount = new bignumber.BigNumber(24.75);

            taskApiModel.id = undefined;
            taskApiModel.fieldTaskId = fieldTaskId;
            taskApiModel.chargeType = "someChargeType";

            //if newRFA should search by FieldTaskId and use Task.getFieldTaskId to do so

            chargeFactory.createChargeApiModel([chargeableTask], [taskApiModel]).then(results => {
                expect(results[0].chargeExcludingVAT).toEqual(5775); // expect discount to be applied after
                done();
            });
        });
    });

    // see DF_1674
    describe("incomplete status IA, IF, IH or IP", () => {

        const id = "123456789";
        const fieldTaskId = "abc";
        let task: Task;

        beforeEach(() => {
            task = new Task(false, false);

            chargeableTask.task = task;

            chargeableTask.labourItem = new ChargeableLabourItem();
            chargeableTask.labourItem.chargePair = new PrimeSubCharge(0, 0);
            chargeableTask.labourItem.netAmount = new bignumber.BigNumber(82.5);
            chargeableTask.labourItem.chargePair.primeCharge = new bignumber.BigNumber(82.5);
            chargeableTask.labourItem.vat = new bignumber.BigNumber(200);
            chargeableTask.vat = new bignumber.BigNumber(200);
            chargeableTask.discountAmount = new bignumber.BigNumber(24.75);

            taskApiModel.chargeType = "someChargeType";
            taskApiModel.id = id;
        });

        it("should not send any charge data at all", (done) => {

            //if newRFA should search by FieldTaskId and use Task.getFieldTaskId to do so

            task.id = id;
            task.fieldTaskId = undefined;
            task.isCharge = true;
            task.status = "IH";

            taskApiModel.id = id;
            taskApiModel.status = "IH";

            chargeFactory.createChargeApiModel([chargeableTask], [taskApiModel]).then(results => {
                expect(results[0].chargeExcludingVAT).toBeUndefined();
                expect(results[0].vatAmount).toBeUndefined();
                expect(results[0].vatCode).toBeUndefined();
                expect(results[0].discountAmount).toBeUndefined();
                expect(results[0].discountCode).toBeUndefined();
                expect(results[0].subsequentJobIndicator).toBeUndefined();
                expect(results[0].supplementaryLabourChargeTotal).toBeUndefined();
                expect(results[0].standardPartsPriceCharged).toBeUndefined();

                done();
            });
        });

        it("should not send any charge data at all (new task)", (done) => {

            task.id = undefined;
            task.isCharge = true;
            task.isNewRFA = true;
            task.fieldTaskId = fieldTaskId;
            task.status = "IH";

            taskApiModel.fieldTaskId = fieldTaskId;
            taskApiModel.status = "IH";

            chargeFactory.createChargeApiModel([chargeableTask], [taskApiModel]).then(results => {
                expect(results[0].chargeExcludingVAT).toBeUndefined();
                expect(results[0].vatAmount).toBeUndefined();
                expect(results[0].vatCode).toBeUndefined();
                expect(results[0].discountAmount).toBeUndefined();
                expect(results[0].discountCode).toBeUndefined();
                expect(results[0].subsequentJobIndicator).toBeUndefined();
                expect(results[0].supplementaryLabourChargeTotal).toBeUndefined();
                expect(results[0].standardPartsPriceCharged).toBeUndefined();

                done();
            });
        })

    })

    describe("correct values for SAP", () => {

        const id = "123456789";
        let task: Task;

        beforeEach(() => {
            task = new Task(false, false);

            chargeableTask.task = task;

            chargeableTask.labourItem = new ChargeableLabourItem();
            chargeableTask.labourItem.chargePair = new PrimeSubCharge(0, 0);
            chargeableTask.labourItem.netAmount = new bignumber.BigNumber(82.5);
            chargeableTask.labourItem.chargePair.primeCharge = new bignumber.BigNumber(82.5);
            chargeableTask.labourItem.vat = new bignumber.BigNumber(200);
            chargeableTask.labourItem.isFixed = false;
            chargeableTask.vat = new bignumber.BigNumber(200);
            chargeableTask.discountAmount = new bignumber.BigNumber(24.75);

            taskApiModel.chargeType = "someChargeType";
            taskApiModel.id = id;

            task.id = id;
            task.fieldTaskId = id;
            task.isCharge = true;
            task.status = "C";
        });

        describe("set standardLabourChargeIndicator", () => {

            it("should set true if labour charge and fixed price", async done => {
                chargeableTask.labourItem.isFixed = true;
                const [taskUpdateApiModel] = await chargeFactory.createChargeApiModel([chargeableTask], [taskApiModel]);
                expect(taskUpdateApiModel.standardLabourChargeIndicator).toBe(true);
                done();
            });

            it("should set false if labour charge and not fixed price", async done => {
                const [taskUpdateApiModel] = await chargeFactory.createChargeApiModel([chargeableTask], [taskApiModel]);
                expect(taskUpdateApiModel.standardLabourChargeIndicator).toBe(false);
                done();
            });

            it("should set false if no labour charge", async done => {
                chargeableTask.labourItem = undefined;
                const [taskUpdateApiModel] = await chargeFactory.createChargeApiModel([chargeableTask], [taskApiModel]);
                expect(taskUpdateApiModel.standardLabourChargeIndicator).toBeUndefined();
                done();
            });
        });

        // very important, SAP expects the net amount NOT gross!
        it("should populate totalLabourCharged with net price, i.e. EXCLUDING VAT", async done => {
            const [taskUpdateApiModel] = await chargeFactory.createChargeApiModel([chargeableTask], [taskApiModel]);
            expect(taskUpdateApiModel.totalLabourCharged).toBe(8250);
            expect(taskUpdateApiModel.chargeExcludingVAT).toBe(5775); // discount applied
            expect(taskUpdateApiModel.vatAmount).toBe(11550); // vat applied 11.55
            done();
        });

        it("should never populate standardPartsPriceCharge if partsItemCharge", async done => {
            chargeableTask.addPartItem("part", bNum(10), false, false, 10, 5, "stockReferenceId", 1, 2);
            const [taskUpdateApiModel] = await chargeFactory.createChargeApiModel([chargeableTask], [taskApiModel]);
            expect(taskUpdateApiModel.standardPartsPriceCharged).toBeUndefined();
            done();
        });

        it("should never populate supplementaryLabourChargeTotal, it is redundant", async done => {
            const [taskUpdateApiModel] = await chargeFactory.createChargeApiModel([chargeableTask], [taskApiModel]);
            expect(taskUpdateApiModel.supplementaryLabourChargeTotal).toBeUndefined();
            done();
        });
    });
});
