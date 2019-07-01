/// <reference path="../../../../../typings/app.d.ts" />

import { PartFactory } from "../../../../../app/hema/business/factories/partFactory";
import { PartsDetail } from "../../../../../app/hema/business/models/partsDetail";
import { PartsBasket } from "../../../../../app/hema/business/models/partsBasket";
import { PartsToday } from "../../../../../app/hema/business/models/partsToday";
import { Part } from "../../../../../app/hema/business/models/part";
import { Task } from "../../../../../app/hema/business/models/task";
import { PartWarrantyReturn } from "../../../../../app/hema/business/models/partWarrantyReturn";
import { IBusinessRuleService } from "../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { IAdaptPartSelected } from "../../../../../app/hema/api/models/adapt/IAdaptPartSelected";
import * as bignumber from "bignumber";
import { QueryableBusinessRuleGroup } from "../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import { Job } from "../../../../../app/hema/business/models/job";
import { Visit } from "../../../../../app/hema/business/models/visit";

describe("the PartFactory module", () => {
    let partFactory: PartFactory;
    let sandbox: Sinon.SinonSandbox;

    let partsDetail: PartsDetail;
    let partsBasket: PartsBasket;
    let part1: Part;
    let part2: Part;
    let task: Task;
    let job: Job;

    let businessRuleServiceStub: IBusinessRuleService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        part1 = new Part();
        part1.taskId = "1";
        part1.price = new bignumber.BigNumber(1.99);
        part1.quantityCharged = 1;
        part1.description = "Part 1";
        part1.quantity = 1;
        part1.stockReferenceId = "1";

        part2 = new Part();
        part2.taskId = "1357337001001";
        part2.price = new bignumber.BigNumber(2.99);
        part2.quantityCharged = 2;
        part2.description = "Part 2";
        part2.quantity = 2;
        part2.stockReferenceId = "2";
        part2.partOrderStatus = "V";

        partsBasket = new PartsBasket();
        partsBasket.partsToOrder = [part1, part2];
        partsDetail = <PartsDetail> {partsBasket: partsBasket};

        task = <Task> {
            id: "1357337001001",
            isCharge: true,
            status: "C"
        };

        businessRuleServiceStub = <IBusinessRuleService>{};
        let getQueryableBusinessRuleGroupStub = businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves({
            getBusinessRule: sandbox.stub().returns("")
        });

        let todaysPartsBusinessRuleGroup = <QueryableBusinessRuleGroup>{};

        let todaysPartsBusinessRulesStub = todaysPartsBusinessRuleGroup.getBusinessRule = sandbox.stub();
        todaysPartsBusinessRulesStub.withArgs("defaultPartWarrantyWeeks").returns(52);
        todaysPartsBusinessRulesStub.withArgs("doTodayActivityStatus").returns("D");
        todaysPartsBusinessRulesStub.withArgs("toBeFittedPartStatus").returns("FP");
        todaysPartsBusinessRulesStub.withArgs("notFittedIndicator").returns("N");
        todaysPartsBusinessRulesStub.withArgs("defaultApplianceWarrantyWeeks").returns(260);
        todaysPartsBusinessRulesStub.withArgs("partVanStockStatus").returns("V");
        todaysPartsBusinessRulesStub.withArgs("personalSourceCategory").returns("P");

        getQueryableBusinessRuleGroupStub.withArgs("todaysParts").resolves(todaysPartsBusinessRuleGroup);

        let partFactoryBusinessRuleGroup = <QueryableBusinessRuleGroup>{};

        let partFactoryBusinessRules = partFactoryBusinessRuleGroup.getBusinessRule = sandbox.stub();
        partFactoryBusinessRules.withArgs("partOrderStatus").returns("O");
        partFactoryBusinessRules.withArgs("partVanStockStatus").returns("V");
        partFactoryBusinessRules.withArgs("partsDescriptionLength").returns(100);

        getQueryableBusinessRuleGroupStub.withArgs("partFactory").resolves(partFactoryBusinessRuleGroup);

        let chargeServiceBusinessRuleGroup = <QueryableBusinessRuleGroup>{};

        let chargeServiceBusinessRules = chargeServiceBusinessRuleGroup.getBusinessRuleList = sandbox.stub();
        chargeServiceBusinessRules.withArgs("visitStatuses").returns(["C","IA","IF","IP","WA","IH"]);
        chargeServiceBusinessRules.withArgs("excludePartStatusPrevious").returns(["AP","NU","CP"]);

        getQueryableBusinessRuleGroupStub.withArgs("chargeService").resolves(chargeServiceBusinessRuleGroup);

        partFactory = new PartFactory(businessRuleServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(partFactory).toBeDefined();
    });

    describe("the createPartBusinessModelFromAdaptApiModel function", () => {
        it("can create part business model", () => {
            let timestamp: string = new Date().toDateString();

            let adaptApiPartModel: IAdaptPartSelected = <IAdaptPartSelected>{};
            adaptApiPartModel.timestamp = timestamp;
            adaptApiPartModel.description = "This is a part description";
            adaptApiPartModel.price = 1099;
            adaptApiPartModel.stockReferenceId = "S123456789";

            let businessModel = partFactory.createPartBusinessModelFromAdaptApiModel(adaptApiPartModel);

            expect(businessModel).toBeDefined();
            expect(businessModel.id).toBeDefined();
            expect(businessModel.description).toBe(adaptApiPartModel.description);
            expect(businessModel.quantity).toBe(1);
            expect(businessModel.stockReferenceId).toBe(adaptApiPartModel.stockReferenceId);
            expect(businessModel.price.toNumber()).toBe(adaptApiPartModel.price / 100);
            expect(businessModel.partOrderStatus).toBe("O");
        });
    });

    describe("the createPartsChargedApiModelsFromBusinessModels function", () => {

        it("should create parts charged api model", (done) => {
            part2.quantity = 8;
            partFactory.createPartsChargedApiModelsFromBusinessModels(task, partsDetail, true)
                .then((partsCharged) => {
                    expect(partsCharged.length).toBeGreaterThan(0);
                    expect(partsCharged[0].charge).toBe(299);
                    expect(partsCharged[0].quantityUsed).toBe(8);
                    expect(partsCharged[0].quantityCharged).toBe(8);
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        });

        it("should map correct charge qty for an unused return", (done) => {

            part2.quantity = 8;
            part2.notUsedReturn.quantityToReturn = 3;

            partFactory.createPartsChargedApiModelsFromBusinessModels(task, partsDetail, true)
                .then((partsCharged) => {
                    expect(partsCharged.length).toEqual(1);
                    expect(partsCharged[0].quantityUsed).toEqual(5);
                    expect(partsCharged[0].quantityCharged).toEqual(5);
                    done();
                });
        });

        it("should map correct charge qty for all unused return", (done) => {

            part2.quantity = 8;
            part2.notUsedReturn.quantityToReturn = 8;

            partFactory.createPartsChargedApiModelsFromBusinessModels(task, partsDetail, true)
                .then((partsCharged) => {
                    expect(partsCharged.length).toEqual(0);
                    done();
                });
        });

        it("should map correct charge qty for a warranty return", (done) => {

            part2.quantity = 8;
            part2.warrantyReturn.quantityToClaimOrReturn = 3;
            part2.warrantyReturn.isWarrantyReturn = true;

            partFactory.createPartsChargedApiModelsFromBusinessModels(task, partsDetail, true)
                .then((partsCharged) => {
                    expect(partsCharged.length).toEqual(1);
                    expect(partsCharged[0].quantityUsed).toEqual(8);
                    expect(partsCharged[0].quantityCharged).toEqual(5);
                    done();
                });
        });

        it("should map correct charge qty for all warranty returned", (done) => {

            part2.quantity = 8;
            part2.warrantyReturn.quantityToClaimOrReturn = 8;
            part2.warrantyReturn.isWarrantyReturn = true;

            partFactory.createPartsChargedApiModelsFromBusinessModels(task, partsDetail, true)
                .then((partsCharged) => {
                    expect(partsCharged.length).toEqual(0);
                    done();
                });
        });

        it("should map correct used qty for unused and warranty returns", (done) => {

            part2.quantity = 8;
            part2.warrantyReturn.quantityToClaimOrReturn = 3;
            part2.warrantyReturn.isWarrantyReturn = true;
            part2.notUsedReturn.quantityToReturn = 1;

            partsBasket = new PartsBasket();
            partsBasket.partsToOrder = [part2];
            partsDetail = <PartsDetail> {partsBasket: partsBasket};

            partFactory.createPartsChargedApiModelsFromBusinessModels(task, partsDetail, true)
                .then((partsCharged) => {
                    expect(partsCharged.length).toEqual(1);
                    expect(partsCharged[0].quantityUsed).toEqual(7);
                    expect(partsCharged[0].quantityCharged).toEqual(4);
                    done();
                });
        });

        it("should map correct used qty for all unused and warranty returns", (done) => {

            part2.quantity = 8;
            part2.warrantyReturn.quantityToClaimOrReturn = 7;
            part2.warrantyReturn.isWarrantyReturn = true;
            part2.notUsedReturn.quantityToReturn = 1;

            partsBasket = new PartsBasket();
            partsBasket.partsToOrder = [part2];
            partsDetail = <PartsDetail> {partsBasket: partsBasket};

            partFactory.createPartsChargedApiModelsFromBusinessModels(task, partsDetail, true)
                .then((partsCharged) => {
                    expect(partsCharged.length).toEqual(0);
                    done();
                });
        });

        it("should not create parts charged api model if parts should not be charged for on this task chargetype", (done) => {
            partFactory.createPartsChargedApiModelsFromBusinessModels(task, partsDetail, false)
                .then((partsCharged) => {
                    expect(partsCharged.length).toBe(0);
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        });

    });

    describe("the createPartsUsedApiModelsFromBusinessModels function", () => {
        it("can create parts used api models with p source category", (done) => {
            partsDetail.partsBasket.partsToOrder.push(part2);

            partFactory.createPartsUsedApiModelsFromBusinessModels(task, partsDetail, true)
                .then((partsUsed) => {
                    expect(partsUsed.length).toBe(2);
                    expect(partsUsed[1].sourceCategory).toBe("P");
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });

        });

        it("shouldn't have any item in parts used array", (done) => {
            partsDetail.partsBasket.partsToOrder.push(part2);
            partsDetail.partsToday = new PartsToday();
            part1.warrantyReturn.isWarrantyReturn = false;
            partsDetail.partsToday.parts = [part1];

            partFactory.createPartsUsedApiModelsFromBusinessModels(task, partsDetail, true)
                .then((partsUsed) => {
                    expect(partsUsed.length).toBe(2);
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        });

        it("should map correct charge qty", (done) => {

            part2.quantity = 8;

            partsBasket = new PartsBasket();
            partsBasket.partsToOrder = [part2];
            partsDetail = <PartsDetail> {partsBasket: partsBasket};

            partFactory.createPartsUsedApiModelsFromBusinessModels(task, partsDetail, true)
                .then((partsUsed) => {
                    expect(partsUsed.length).toEqual(1);
                    expect(partsUsed[0].quantityUsed).toEqual(8);
                    expect(partsUsed[0].quantityCharged).toEqual(8);
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        });

        it("should map correct charge qty for a non-chargeable charge type", (done) => {

            part2.quantity = 8;

            partsBasket = new PartsBasket();
            partsBasket.partsToOrder = [part2];
            partsDetail = <PartsDetail> {partsBasket: partsBasket};

            partFactory.createPartsUsedApiModelsFromBusinessModels(task, partsDetail, false)
                .then((partsUsed) => {
                    expect(partsUsed.length).toEqual(1);
                    expect(partsUsed[0].quantityUsed).toEqual(8);
                    expect(partsUsed[0].quantityCharged).toEqual(0);
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        });

        // see DF_1567
        it("should map correct charge qty for warranty return", (done) => {

            part2.quantity = 8;
            part2.warrantyReturn.quantityToClaimOrReturn = 3;
            part2.warrantyReturn.isWarrantyReturn = true;

            partsBasket = new PartsBasket();
            partsBasket.partsToOrder = [part2];
            partsDetail = <PartsDetail> {partsBasket: partsBasket};

            partFactory.createPartsUsedApiModelsFromBusinessModels(task, partsDetail, true)
                .then((partsUsed) => {
                    expect(partsUsed.length).toEqual(1);
                    expect(partsUsed[0].quantityUsed).toEqual(8);
                    expect(partsUsed[0].quantityCharged).toEqual(5);
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        });

        it("should map correct charge qty for all warranty return", (done) => {

            part2.quantity = 8;
            part2.warrantyReturn.quantityToClaimOrReturn = 8;
            part2.warrantyReturn.isWarrantyReturn = true;

            partsBasket = new PartsBasket();
            partsBasket.partsToOrder = [part2];
            partsDetail = <PartsDetail> {partsBasket: partsBasket};

            partFactory.createPartsUsedApiModelsFromBusinessModels(task, partsDetail, true)
                .then((partsUsed) => {
                    expect(partsUsed.length).toEqual(1);
                    expect(partsUsed[0].quantityUsed).toEqual(8);
                    expect(partsUsed[0].quantityCharged).toEqual(0);
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        });

        it("should map correct used qty for notused return", (done) => {

            part2.quantity = 8;
            part2.notUsedReturn.quantityToReturn = 1;

            partsBasket = new PartsBasket();
            partsBasket.partsToOrder = [part2];
            partsDetail = <PartsDetail> {partsBasket: partsBasket};

            partFactory.createPartsUsedApiModelsFromBusinessModels(task, partsDetail, true)
                .then((partsUsed) => {
                    expect(partsUsed.length).toEqual(1);
                    expect(partsUsed[0].quantityUsed).toEqual(7);
                    expect(partsUsed[0].quantityCharged).toEqual(7);
                    done();
                });
        });

        it("should map correct used qty for all returned", (done) => {

            part2.quantity = 8;
            part2.notUsedReturn.quantityToReturn = 8;

            partsBasket = new PartsBasket();
            partsBasket.partsToOrder = [part2];
            partsDetail = <PartsDetail> {partsBasket: partsBasket};

            partFactory.createPartsUsedApiModelsFromBusinessModels(task, partsDetail, true)
                .then((partsUsed) => {
                    expect(partsUsed.length).toEqual(0);
                    done();
                });
        });

        it("should map correct used qty for mixed not used return and warranty return ", (done) => {

            part2.quantity = 8;
            part2.warrantyReturn.quantityToClaimOrReturn = 3;
            part2.warrantyReturn.isWarrantyReturn = true;
            part2.notUsedReturn.quantityToReturn = 1;

            partsBasket = new PartsBasket();
            partsBasket.partsToOrder = [part2];
            partsDetail = <PartsDetail> {partsBasket: partsBasket};

            partFactory.createPartsUsedApiModelsFromBusinessModels(task, partsDetail, true)
                .then((partsUsed) => {
                    expect(partsUsed.length).toEqual(1);
                    expect(partsUsed[0].quantityUsed).toEqual(7);
                    expect(partsUsed[0].quantityCharged).toEqual(4);
                    done();
                });
        });

        it("should map correct used qty for mixed all not used return and warranty return ", (done) => {

            part2.quantity = 8;
            part2.warrantyReturn.quantityToClaimOrReturn = 3;
            part2.warrantyReturn.isWarrantyReturn = true;
            part2.notUsedReturn.quantityToReturn = 5;

            partsBasket = new PartsBasket();
            partsBasket.partsToOrder = [part2];
            partsDetail = <PartsDetail> {partsBasket: partsBasket};

            partFactory.createPartsUsedApiModelsFromBusinessModels(task, partsDetail, true)
                .then((partsUsed) => {
                    expect(partsUsed.length).toEqual(1);
                    expect(partsUsed[0].quantityUsed).toEqual(3);
                    expect(partsUsed[0].quantityCharged).toEqual(0);
                    done();
                });
        });

        it("should create parts used for a non-parts-chargeable charge type", done => {
            part2.quantity = 8;
            part2.warrantyReturn.quantityToClaimOrReturn = 2;
            part2.warrantyReturn.isWarrantyReturn = true;
            part2.notUsedReturn.quantityToReturn = 5;

            partsBasket = new PartsBasket();
            partsBasket.partsToOrder = [part2];
            partsDetail = <PartsDetail> {partsBasket: partsBasket};

            partFactory.createPartsUsedApiModelsFromBusinessModels(task, partsDetail, false)
                .then((partsUsed) => {
                    expect(partsUsed.length).toEqual(1);
                    expect(partsUsed[0].quantityUsed).toEqual(3);
                    expect(partsUsed[0].quantityCharged).toEqual(0);
                    done();
                });
        })

        it("should map charge to pence for partsBasket", (done) => {

            partsBasket = new PartsBasket();
            partsBasket.partsToOrder = [part2];

            partsDetail = <PartsDetail> {partsBasket: partsBasket};

            partFactory.createPartsUsedApiModelsFromBusinessModels(task, partsDetail, true)
                .then((partsUsed) => {
                    expect(partsUsed.length).toBe(1);
                    expect(partsUsed[0].charge).toBe(299);
                    done();
                })
        });
    });

    describe("the createPartsOrderedForTask function", () => {

        beforeEach(() => {
            job = <Job>{};

            task = <Task>{};
            task.id = "1";
            task.fieldTaskId = Task.getFieldTaskId(task.id);
            task.isCharge = true;

            part1 = <Part> {
                taskId: "1",
                price: new bignumber.BigNumber(10.56),
                quantity: 1,
                stockReferenceId: "357552",
                partOrderStatus: "O",
                description: "Gasket - Cover Plate",
                isPriorityPart: true
            };

            part2 = <Part> {
                taskId: "1",
                price: new bignumber.BigNumber(8.14),
                quantity: 1,
                stockReferenceId: "407219",
                partOrderStatus: "O",
                description: "Stud M8 x 27 Screw",
                isPriorityPart: false
            };

            partsBasket = new PartsBasket();
            partsBasket.partsToOrder = [part1, part2];
            partsDetail = <PartsDetail> {partsBasket: partsBasket};

            job.visit = <Visit>{id: "123"};
            job.partsDetail = partsDetail;
            job.tasks = [task];
        });

        it("can create parts ordered for task", (done) => {

            partFactory.createPartsOrderedForTask(job)
                .then((partsOrdered) => {
                    expect(partsOrdered.tasks.length === 1).toBeTruthy();
                    expect(partsOrdered.tasks[0].parts.length === 2).toBeTruthy();
                    expect(partsOrdered.tasks[0].parts[0].charge === 1056).toBeTruthy();
                    expect(partsOrdered.tasks[0].parts[0].description === "Gasket - Cover Plate").toBeTruthy();
                    expect(partsOrdered.tasks[0].parts[0].priority).toBeTruthy();
                    expect(partsOrdered.tasks[0].parts[0].quantity === 1).toBeTruthy();
                    expect(partsOrdered.tasks[0].parts[0].stockReferenceId === "357552").toBeTruthy();
                    expect(partsOrdered.tasks[0].parts[0].visitId).toBe("123");
                    expect(partsOrdered.tasks[0].parts[1].charge === 814).toBeTruthy();
                    expect(partsOrdered.tasks[0].parts[1].description === "Stud M8 x 27 Screw").toBeTruthy();
                    expect(partsOrdered.tasks[0].parts[1].priority).toBeFalsy();
                    expect(partsOrdered.tasks[0].parts[1].quantity === 1).toBeTruthy();
                    expect(partsOrdered.tasks[0].parts[1].stockReferenceId === "407219").toBeTruthy();
                    expect(partsOrdered.tasks[0].parts[1].visitId).toBe("123");
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });

        });

        describe("appropriate record ids", () => {
            it("can set task id for a WMIS-generated task", done => {
                job.tasks[0].isNewRFA = false;
                partFactory.createPartsOrderedForTask(job).then(partsOrdered => {
                    expect(partsOrdered.tasks[0].id).toBe("1");
                    expect(partsOrdered.tasks[0].fieldTaskId).toBeUndefined();
                    done();
                });
            });

            it("can set task id for a field app-generated task", done => {
                job.tasks[0].isNewRFA = true;
                partFactory.createPartsOrderedForTask(job).then(partsOrdered => {
                    expect(partsOrdered.tasks[0].fieldTaskId).toBe("00000001");
                    expect(partsOrdered.tasks[0].id).toBeUndefined();
                    done();
                });
            });

        });
    });

    describe("createPartsClaimedUnderWarrantyApiModelsFromBusinessModels method", () => {
        beforeEach(() => {
            job = <Job>{};

            task = <Task>{};
            task.id = "1";
            task.isCharge = true;

            part1 = <Part> {
                taskId: "1",
                price: new bignumber.BigNumber(10.56),
                quantity: 1,
                stockReferenceId: "357552",
                description: "Gasket - Cover Plate",
                isPriorityPart: true,
                partOrderStatus: "V",
                warrantyReturn: <PartWarrantyReturn> {
                    isWarrantyReturn: true,
                    quantityToClaimOrReturn: 1,
                    removedPartStockReferenceId: "1212",
                    reasonForClaim: "test"
                }
            };
        });

        it("should create partsToReturn model and partsToReturn.stockReferenceId be 1212", (done) => {
            partsBasket = new PartsBasket();
            partsBasket.partsToOrder = [part1];
            partsDetail = <PartsDetail> {partsBasket: partsBasket};

            partFactory.createPartsClaimedUnderWarrantyApiModelsFromBusinessModels(task, partsDetail).then(partsToReturn => {
                expect(partsToReturn[0].quantityClaimed).toBe(1);
                expect(partsToReturn[0].stockReferenceId).toBe("1212");
                done();
            });
        });

        it("should partsToReturn.stockReferenceId be 357552", (done) => {
            part1.warrantyReturn.removedPartStockReferenceId = "357552";
            let partsToday = <PartsToday> {
                parts: [part1]
            }
            partsDetail = <PartsDetail> {partsToday: partsToday};

            partFactory.createPartsClaimedUnderWarrantyApiModelsFromBusinessModels(task, partsDetail).then(partsToReturn => {
                expect(partsToReturn[0].quantityClaimed).toBe(1);
                expect(partsToReturn[0].stockReferenceId).toBe("357552");
                done();
            });
        })

    });
});
