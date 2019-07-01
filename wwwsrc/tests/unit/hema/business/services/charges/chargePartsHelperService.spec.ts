import { PartsToday } from "../../../../../../app/hema/business/models/partsToday";
import { Guid } from "../../../../../../app/common/core/guid";
import { Part } from "../../../../../../app/hema/business/models/part";
import { Task } from "../../../../../../app/hema/business/models/task";
import { IPartService } from "../../../../../../app/hema/business/services/interfaces/IPartService";
import { ChargeableTask } from "../../../../../../app/hema/business/models/charge/chargeableTask";
import { IChargePartsCatalogDependencies } from "../../../../../../app/hema/business/services/interfaces/charge/IChargePartsCatalogDependencies";
import { PartWarrantyReturn } from "../../../../../../app/hema/business/models/partWarrantyReturn";
import { PartNotUsedReturn } from "../../../../../../app/hema/business/models/partNotUsedReturn";
import { PartsBasket } from "../../../../../../app/hema/business/models/partsBasket";
import { Helper } from "../../../../unitHelpers/chargeTestHelper.spec";
import * as bignumber from "bignumber";
import { ChargePartsHelperService } from "../../../../../../app/hema/business/services/charge/chargePartsHelperService";
import { IChargePartsHelperService } from "../../../../../../app/hema/business/services/interfaces/charge/IChargePartsHelperService";
import { Activity } from "../../../../../../app/hema/business/models/activity";

const {createTask} = Helper;

describe("chargePartsHelperService", () => {

    let sandbox: Sinon.SinonSandbox;

    const chargeTypeCode = "CPO3SN1";
    let task: Task;
    let parts: Part[] = [];
    let partsToday: PartsToday = new PartsToday();
    let mockPartService: IPartService = <IPartService>{};

    let chargePartsHelperService: IChargePartsHelperService;

    let partsChargeCatalogDependencies: IChargePartsCatalogDependencies;
    let cTask: ChargeableTask;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        task = createTask("1", chargeTypeCode, "FV", "BBC", "01/10/2099 17:00", "01/10/2099 18:21", 121);
        task.isCharge = true;

        partsChargeCatalogDependencies = <IChargePartsCatalogDependencies>{};
        partsChargeCatalogDependencies.excludePartStatusPrevious = ["AP", "NU", "CP"];
        partsChargeCatalogDependencies.notUsedStatusCode = "NU";
        partsChargeCatalogDependencies.visitStatuses = ["C", "IA", "IF", "IP", "WA", "IH"];
        partsChargeCatalogDependencies.vanStockPartOrderStatus = "V";

        cTask = new ChargeableTask();
        cTask.task = task;
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("standard parts, no warranty or parts not used to be returned", () => {

        let partToOrder: Part = new Part();

        partToOrder.id = Guid.newGuid();
        partToOrder.description = "Some Part";
        partToOrder.partOrderStatus = "J";
        partToOrder.price = new bignumber.BigNumber(4900);
        partToOrder.quantity = 1;
        partToOrder.stockReferenceId = "P123456789";
        partToOrder.taskId = "1";

        parts = [];
        parts.push(partToOrder);

        beforeEach(() => {
            partsToday.parts = parts;

            mockPartService.getTodaysParts = sandbox.stub().resolves(partsToday);
            mockPartService.getPartsBasket = sandbox.stub().resolves(null);

            chargePartsHelperService = new ChargePartsHelperService(mockPartService);
        });

        it("should set parts charge", async done => {

            // act
            const taskToTest = await chargePartsHelperService.addPartsCharge(cTask, "1", true, partsChargeCatalogDependencies);

            // assert
            expect(taskToTest.partItems[0].netAmount.toNumber()).toEqual(4900);
            done();
        });

        it("should set labour charge to 0", async done => {

            // act
            const taskToTest = await chargePartsHelperService.addPartsCharge(cTask, "1", true, partsChargeCatalogDependencies);

            // assert
            expect(taskToTest.labourItem.netAmount.toNumber()).toEqual(0);
            done();
        });

        it("should calculate total cost, qty * price", async done => {

            // arrange

            partsToday = new PartsToday();
            parts = [];

            partToOrder.quantity = 2;
            parts.push(partToOrder);
            partsToday.parts = parts;

            mockPartService.getTodaysParts = sandbox.stub().resolves(partsToday);

            // act
            const taskToTest = await chargePartsHelperService.addPartsCharge(cTask, "1", true, partsChargeCatalogDependencies);

            // assert
            expect(taskToTest.partItems[0].netAmount.toNumber()).toEqual(9800);
            done();
        });
    });

    describe("parts with no charge", () => {

        let partToOrder: Part = new Part();

        beforeEach(() => {

            partToOrder.id = Guid.newGuid();
            partToOrder.description = "Some Part";
            partToOrder.partOrderStatus = "J";
            partToOrder.price = new bignumber.BigNumber(10000);
            partToOrder.quantity = 2;
            partToOrder.stockReferenceId = "P123456789";
            partToOrder.taskId = "1";
            partToOrder.warrantyReturn = undefined;
            partToOrder.notUsedReturn = undefined;

            mockPartService.getPartsBasket = sandbox.stub().resolves(null);

            partsToday = new PartsToday();
            parts = [];
        });

        it("if part in warranty should subtract from total cost", async done => {

            // arrange

            let partWarrantyReturn = new PartWarrantyReturn();
            partWarrantyReturn.isWarrantyReturn = true;
            partWarrantyReturn.quantityToClaimOrReturn = 1;
            partToOrder.warrantyReturn = partWarrantyReturn;

            parts.push(partToOrder);
            partsToday.parts = parts;

            mockPartService.getTodaysParts = sandbox.stub().resolves(partsToday);

            // act
            const taskToTest = await chargePartsHelperService.addPartsCharge(cTask, "1", true, partsChargeCatalogDependencies);
            // assert
            expect(taskToTest.partItems[0].netAmount.toNumber()).toEqual(10000);

            done();
        });

        it("if part in warranty should subtract from total cost", async done => {

            // arrange

            let partWarrantyReturn = new PartWarrantyReturn();
            partWarrantyReturn.isWarrantyReturn = true;
            partWarrantyReturn.quantityToClaimOrReturn = 1;
            partToOrder.warrantyReturn = partWarrantyReturn;
            partToOrder.quantityCharged = 2;
            partToOrder.quantity = 2;

            parts.push(partToOrder);
            partsToday.parts = parts;

            mockPartService.getTodaysParts = sandbox.stub().resolves(partsToday);

            // act
            const taskToTest = await chargePartsHelperService.addPartsCharge(cTask, "1", true, partsChargeCatalogDependencies);
            // assert
            expect(taskToTest.partItems[0].netAmount.toNumber()).toEqual(10000);
            done();
        });

        it("if part to be returned should subtract from total cost", async done => {

            // arrange

            let partNotUsedReturn = new PartNotUsedReturn();
            partNotUsedReturn.quantityToReturn = 1;
            partToOrder.notUsedReturn = partNotUsedReturn;

            parts.push(partToOrder);
            partsToday.parts = parts;

            mockPartService.getTodaysParts = sandbox.stub().resolves(partsToday);

            // act
            const taskToTest = await chargePartsHelperService.addPartsCharge(cTask, "1", true, partsChargeCatalogDependencies);
            // assert
            expect(taskToTest.partItems[0].netAmount.toNumber()).toEqual(10000);
            done();
        });
    });

    describe("van stock charge", () => {

        let partInBasket: Part = new Part();
        partInBasket.id = Guid.newGuid();
        partInBasket.description = "Some Part";
        partInBasket.price = new bignumber.BigNumber(10000);
        partInBasket.quantity = 2;
        partInBasket.stockReferenceId = "P123456789";
        partInBasket.taskId = "1";
        partInBasket.partOrderStatus = "V";

        beforeEach(() => {
            parts = [];
            parts.push(partInBasket);

            let partsBasketBusinessModel = new PartsBasket();
            partsBasketBusinessModel.partsToOrder = parts;

            mockPartService.getTodaysParts = sandbox.stub().resolves(null);
            mockPartService.getPartsBasket = sandbox.stub().resolves(partsBasketBusinessModel);
        });

        it("should update charge for part in basket if van stock", async done => {

            // act
            const taskToTest = await chargePartsHelperService.addPartsCharge(cTask, "1", true, partsChargeCatalogDependencies);

            // assert
            expect(taskToTest.partItems[0].netAmount.toNumber()).toEqual(20000);
            done();
        });
    });

    // // see DF_1654
    // describe("duplicate items from previous job CP and UP", () => {

    //     let p1, p2, p3;

    //     beforeEach(() => {

    //         // parts charge

    //         p1 = new Part();
    //         p1.status = "CP";
    //         p1.description = "Wax Sensor";
    //         p1.price = new bignumber.BigNumber(0);
    //         p1.quantity = 1;
    //         p1.stockReferenceId = "108014";
    //         p1.taskId = cTask.task.id;

    //         p2 = new Part();
    //         p2.status = "UP";
    //         p2.description = "Knob Control c/w Clip";
    //         p2.price = new bignumber.BigNumber(1224.0);
    //         p2.quantity = 1;
    //         p2.quantityCharged = 1;
    //         p2.stockReferenceId = "E76070";
    //         p2.taskId = cTask.task.id;

    //         p3 = new Part();
    //         p3.status = "UP";
    //         p3.description = "Wax Sensor";
    //         p3.price = new bignumber.BigNumber(2672.0);
    //         p3.quantity = 1;
    //         p3.quantityCharged = 0;
    //         p3.stockReferenceId = "108014";
    //         p3.taskId = cTask.task.id;

    //         let partsToday: PartsToday = new PartsToday();
    //         partsToday.parts = [p1, p2, p3];

    //         mockPartService.getTodaysParts = sandbox.stub().resolves(partsToday);
    //         mockPartService.getPartsBasket = sandbox.stub().resolves(null);

    //         chargePartsHelperService = new ChargePartsHelperService(mockPartService)
    //     });

    //     it("excludes available and not used part status", async done => {

    //         const taskToTest = await chargePartsHelperService.addPartsCharge(cTask, "1", true, partsChargeCatalogDependencies);
    //         expect(taskToTest.partItems.length).toEqual(2);
    //         const [first, second] = taskToTest.partItems;

    //         expect(first.status).toEqual("CP");
    //         expect(second.status).toEqual("UP");

    //         done();
    //     });
    // });

    // if multiple tasks with NU and CP, could get too many NU parts
    // e.g.
    //  stockReferenceID    partStatus  qty
    //  123                 NU          3
    //  123                 NU          4
    //  123                 AP          1
    //  123                 FP          5
    //  123                 FP          4

    // we maintain a dictionary of not used parts
    //  123                 7

    // we then iterate through parts, but not used is assigned multiple times
    //                                          qtyCharged
    // 123                  FP          5   7   -2
    // 123                  FP          4   7 * -3

    describe("maintain not used quantities", () => {

        let nuPart1, nuPart2, apPart, fpPart1, fpPart2;

        beforeEach(() => {

            // parts charge

            nuPart1 = new Part();
            nuPart1.status = "NU";
            nuPart1.description = "nu part 1";
            nuPart1.price = new bignumber.BigNumber(100.0);
            nuPart1.quantity = 3;
            nuPart1.stockReferenceId = "123";
            nuPart1.taskId = cTask.task.id;

            nuPart2 = new Part();
            nuPart2.status = "NU";
            nuPart2.description = "nu part 2";
            nuPart2.price = new bignumber.BigNumber(100.0);
            nuPart2.quantity = 4;
            nuPart2.stockReferenceId = "123";
            nuPart2.taskId = cTask.task.id;

            apPart = new Part();
            apPart.status = "AP";
            apPart.description = "ap part";
            apPart.price = new bignumber.BigNumber(100.0);
            apPart.quantity = 1;
            apPart.stockReferenceId = "123";
            apPart.taskId = cTask.task.id;

            fpPart1 = new Part();
            fpPart1.status = "FP";
            fpPart1.description = "fp part 1";
            fpPart1.price = new bignumber.BigNumber(100.0);
            fpPart1.quantity = 5;
            fpPart1.stockReferenceId = "123";
            fpPart1.taskId = cTask.task.id;

            fpPart2 = new Part();
            fpPart2.status = "FP";
            fpPart2.description = "fp part 2";
            fpPart2.price = new bignumber.BigNumber(100.0);
            fpPart2.quantity = 4;
            fpPart2.stockReferenceId = "123";
            fpPart2.taskId = cTask.task.id;

            let partsToday: PartsToday = new PartsToday();
            partsToday.parts = [];

            let activity1: Activity = new Activity();
            activity1.parts = [nuPart1, nuPart2, apPart, fpPart1, fpPart2];

            activity1.status = "C";
            cTask.task.activities = [activity1];

            mockPartService.getTodaysParts = sandbox.stub().resolves(partsToday);
            mockPartService.getPartsBasket = sandbox.stub().resolves(null);

            chargePartsHelperService = new ChargePartsHelperService(mockPartService)
        });

        // should be...
        // NU state = 7
        //                                  qty     qtyCharged  qtyReturn       NU state (7)
        // 123                  FP          5           0          5             2
        // 123                  FP          4           2          2            0

        it("multiple FP, NU status parts", async done => {

            const result = await chargePartsHelperService.addPartsCharge(cTask, "1", true, partsChargeCatalogDependencies);

            const {partItems} = result;
            const [p1, p2] = partItems;

            expect(partItems.length).toEqual(2);

            expect(p1.returnQty).toEqual(5);
            expect(p2.returnQty).toEqual(2);
            expect(p1.qtyCharged).toEqual(0);
            expect(p2.qtyCharged).toEqual(2);

            done();
        });

        it("reorder parts", async done => {

            const result = await chargePartsHelperService.addPartsCharge(cTask, "1", true, partsChargeCatalogDependencies);

            const {partItems} = result;
            const [p2, p1] = partItems;

            expect(partItems.length).toEqual(2);

            expect(p1.returnQty).toEqual(2);
            expect(p2.returnQty).toEqual(5);
            expect(p1.qtyCharged).toEqual(2);
            expect(p2.qtyCharged).toEqual(0);

            done();
        });

        // should be...
        // NU state = 7
        //                                  qty     qtyCharged  qtyReturn       NU state (7)
        // 123                  FP          8           1       7                   0
        // 123                  FP          7           7       0                   0

        it("calculates correct qtyReturn when more fp qty", async done => {

            fpPart1.quantity = 8;
            fpPart2.quantity = 7;

            const result = await chargePartsHelperService.addPartsCharge(cTask, "1", true, partsChargeCatalogDependencies);

            const {partItems} = result;

            const [part1, part2] = partItems;

            expect(partItems.length).toEqual(2);

            expect(part1.returnQty).toEqual(7);
            expect(part1.qtyCharged).toEqual(1);

            expect(part2.returnQty).toEqual(0);
            expect(part2.qtyCharged).toEqual(7);

            done();
        });

    });

    // should be...
    //                                  qty     qtyCharged      qtyReturn
    // 123                  UP          1                       0
    // info re. part
    // 123                  CP          1         1             1

    describe("UP and CP for same part, and previous warranty", () => {

        let  cpPart1, upPart1;

        beforeEach(() => {

            // parts charge

            cpPart1 = new Part();
            cpPart1.status = "CP";
            cpPart1.description = "Fan-105 Assy c/w Impeller 75Watt";
            cpPart1.price = new bignumber.BigNumber(0);
            cpPart1.quantity = 1;
            cpPart1.stockReferenceId = "E66527";
            cpPart1.taskId = cTask.task.id;

            upPart1 = new Part();
            upPart1.status = "UP";
            upPart1.description = "Fan-105 Assy c/w Impeller 75Watt";
            upPart1.price = new bignumber.BigNumber(10782);
            upPart1.quantity = 1;
            upPart1.quantityCharged = 0;
            upPart1.stockReferenceId = "E66527";
            upPart1.taskId = cTask.task.id;

            let partsToday: PartsToday = new PartsToday();
            partsToday.parts = [];

            let activity1: Activity = new Activity();
            activity1.parts = [cpPart1, upPart1];

            activity1.status = "C";
            cTask.task.activities = [activity1];

            mockPartService.getTodaysParts = sandbox.stub().resolves(partsToday);
            mockPartService.getPartsBasket = sandbox.stub().resolves(null);

            chargePartsHelperService = new ChargePartsHelperService(mockPartService)
        });

        it(" should calculate correct qtyToCharge and warranty ", async done => {

            const result = await chargePartsHelperService.addPartsCharge(cTask, "1", true, partsChargeCatalogDependencies);

            const {partItems} = result;
            const [partThatShouldBeNotCharged] = partItems;

            expect(partThatShouldBeNotCharged.warrantyQty).toEqual(1);
            expect(partThatShouldBeNotCharged.isWarranty).toEqual(true);
            expect(partThatShouldBeNotCharged.qtyCharged).toEqual(0);
            expect(partThatShouldBeNotCharged.returnQty).toEqual(0);
            expect(partThatShouldBeNotCharged.grossAmount.toNumber()).toEqual(0);

            done();
        });

        it("should have correct values for mutated job task", async done => {

            const beforeTask =  JSON.parse(JSON.stringify(cTask)); // spread operator cannot deep clone

            const beforeMutatedActivity = beforeTask.task.activities[0];
            const {parts: beforeMutatedParts} = beforeMutatedActivity;
            const {parts: afterMutatedParts} = cTask.task.activities[0];

            await chargePartsHelperService.addPartsCharge(cTask, "1", true, partsChargeCatalogDependencies);

            // assert before mutation

            const beforeMutatedPart = beforeMutatedParts[1];
            const {warrantyReturn: beforeMutatedWarrantyReturn} = beforeMutatedPart;
            expect(beforeMutatedWarrantyReturn.isWarrantyReturn).toBeUndefined();
            expect(beforeMutatedWarrantyReturn.quantityToClaimOrReturn).toBeUndefined();

            // after mutation

            const afterMutatedPart = afterMutatedParts[1];
            const {warrantyReturn: mutatedWarrantyReturn} = afterMutatedPart;
            expect(mutatedWarrantyReturn.isWarrantyReturn).toBe(true);
            expect(mutatedWarrantyReturn.quantityToClaimOrReturn).toEqual(1);

            done();
        });

    });

});
