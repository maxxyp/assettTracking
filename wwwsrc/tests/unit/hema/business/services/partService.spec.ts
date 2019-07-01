/// <reference path="../../../../../typings/app.d.ts" />

import { IPartService } from "../../../../../app/hema/business/services/interfaces/IPartService";
import { PartService } from "../../../../../app/hema/business/services/partService";
import { IJobService } from "../../../../../app/hema/business/services/interfaces/IJobService";
import { BusinessException } from "../../../../../app/hema/business/models/businessException";
import { Job } from "../../../../../app/hema/business/models/job";
import { Task } from "../../../../../app/hema/business/models/task";
import { Appliance } from "../../../../../app/hema/business/models/appliance";
import { Part } from "../../../../../app/hema/business/models/part";
import { Activity } from "../../../../../app/hema/business/models/activity";
import { WarrantyEstimate } from "../../../../../app/hema/business/models/warrantyEstimate";
import { PartWarrantyReturn } from "../../../../../app/hema/business/models/partWarrantyReturn";
import { PartNotUsedReturn } from "../../../../../app/hema/business/models/partNotUsedReturn";

import { WarrantyEstimateType } from "../../../../../app/hema/business/models/warrantyEstimateType";

import { PartsDetail } from "../../../../../app/hema/business/models/partsDetail";
import { Guid } from "../../../../../app/common/core/guid";
import { PartsBasket } from "../../../../../app/hema/business/models/partsBasket";
import { ICatalogService } from "../../../../../app/hema/business/services/interfaces/ICatalogService";
import { IBusinessRuleService } from "../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { QueryableBusinessRuleGroup } from "../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";

import * as moment from "moment";
import * as bignumber from "bignumber";

import { DataState } from "../../../../../app/hema/business/models/dataState";
import { IGoodsType } from "../../../../../app/hema/business/models/reference/IGoodsType";
import { IGoodsItemStatus } from "../../../../../app/hema/business/models/reference/IGoodsItemStatus";

describe("the PartService class", () => {
    let sandbox: Sinon.SinonSandbox;
    let partService: IPartService;
    let jobServiceStub: IJobService;
    let catalogServiceStub: ICatalogService;
    let businessRuleServiceStub: IBusinessRuleService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        jobServiceStub = <IJobService>{};
        catalogServiceStub = <ICatalogService>{};

        businessRuleServiceStub = <IBusinessRuleService>{};
        let queryableRuleGroup = <QueryableBusinessRuleGroup>{};

        let getBusinessRuleStub = queryableRuleGroup.getBusinessRule = sandbox.stub();
        getBusinessRuleStub.withArgs("defaultPartWarrantyWeeks").returns(52);
        getBusinessRuleStub.withArgs("defaultApplianceWarrantyWeeks").returns(260);
        getBusinessRuleStub.withArgs("doTodayActivityStatus").returns("D");
        getBusinessRuleStub.withArgs("toBeFittedPartStatus").returns("F");
        getBusinessRuleStub.withArgs("notFittedIndicator").returns("N");

        getBusinessRuleStub.withArgs("goodsTypeDateFmt").returns("YYYY-MM-DD");
        getBusinessRuleStub.withArgs("activityCompleteStatus").returns("C");

        getBusinessRuleStub.withArgs("vanPartsInBasket").returns("V");
        getBusinessRuleStub.withArgs("orderPartStatuses").returns("IP,WA");
        getBusinessRuleStub.withArgs("vanStockStatuses").returns("WA,C,IA,IF");

        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(queryableRuleGroup);

        partService = new PartService(jobServiceStub, catalogServiceStub, businessRuleServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(partService).toBeDefined();
    });

    describe("the partsBasket function", () => {
        beforeEach(() => {

        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can handle no job found", (done) => {
            jobServiceStub.getJob = sandbox.stub().resolves(null);

            partService.getPartsBasket("1")
                .then(() => {
                    fail("Should not be here");
                    done();
                })
                .catch((error) => {
                    expect(error instanceof BusinessException).toBe(true);
                    done();
                });
        });

        it("can return partsBasket", (done) => {
            let job = new Job();
            job.partsDetail = new PartsDetail();
            job.partsDetail.partsBasket = new PartsBasket();
            jobServiceStub.getJob = sandbox.stub().resolves(job);

            partService.getPartsBasket("1")
                .then((partsBasket) => {
                    expect(partsBasket).toBeDefined();
                    done();
                })
                .catch(() => {
                    fail("Should not be here");
                    done();
                });
        });
    });

    describe("the savePartsBasket function", () => {
        beforeEach(() => {

        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can handle no job found", (done) => {
            jobServiceStub.getJob = sandbox.stub().resolves(null);

            partService.savePartsBasket("1", null)
                .then(() => {
                    fail("Should not be here");
                    done();
                })
                .catch((error) => {
                    expect(error instanceof BusinessException).toBe(true);
                    done();
                });
        });

        it("can save parts basket with no previous parts basket", (done) => {
            let partToOrder: Part = new Part();
            partToOrder.id = Guid.newGuid();

            let job = new Job();
            job.partsDetail = null;

            let newPartToAdd: Part = new Part();
            newPartToAdd.id = Guid.newGuid();
            newPartToAdd.description = "New Part";
            newPartToAdd.partOrderStatus = "J";
            newPartToAdd.price = new bignumber.BigNumber(49);
            newPartToAdd.quantity = 1;
            newPartToAdd.stockReferenceId = "P123456789";
            newPartToAdd.taskId = "1";

            let task = new Task(true, false);
            task.activity = "ACT";
            task.productGroup = "PG";
            task.partType = "PT";
            task.id = "1";
            task.status = undefined;
            job.tasks = [task];

            let newPartsBasket: PartsBasket = new PartsBasket();
            newPartsBasket.partsToOrder = [newPartToAdd];

            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let methodSpy: Sinon.SinonSpy = jobServiceStub.setJob = sandbox.stub().resolves(null);

            partService.savePartsBasket("1", newPartsBasket)
                .then(() => {
                    expect(methodSpy.calledOnce).toBe(true);
                    expect(methodSpy.args[0][0].partsDetail).toBeDefined();
                    expect(methodSpy.args[0][0].partsDetail.partsBasket.partsToOrder.length).toBe(1);
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        it("can save parts basket and update existing part", (done) => {
            let partToOrder: Part = new Part();
            partToOrder.id = Guid.newGuid();
            partToOrder.description = "Some Part";
            partToOrder.partOrderStatus = "J";
            partToOrder.price = new bignumber.BigNumber(49);
            partToOrder.quantity = 1;
            partToOrder.stockReferenceId = "P123456789";
            partToOrder.taskId = "1";

            let job = new Job();
            job.partsDetail = new PartsDetail();
            job.partsDetail.partsBasket = new PartsBasket();
            job.partsDetail.partsBasket.partsToOrder = [partToOrder];

            let newPartToAdd: Part = new Part();
            newPartToAdd.id = partToOrder.id;
            newPartToAdd.description = "Some Part";
            newPartToAdd.partOrderStatus = "J";
            newPartToAdd.price = new bignumber.BigNumber(49);
            newPartToAdd.quantity = 2;
            newPartToAdd.stockReferenceId = "P123456789";
            newPartToAdd.taskId = "1";

            let task = new Task(true, false);
            task.activity = "ACT";
            task.productGroup = "PG";
            task.partType = "PT";
            task.id = "1";
            task.status = undefined;
            job.tasks = [task];

            let newPartsBasket: PartsBasket = new PartsBasket();
            newPartsBasket.partsToOrder = [newPartToAdd];

            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let methodSpy: Sinon.SinonSpy = jobServiceStub.setJob = sandbox.stub().resolves(null);

            partService.savePartsBasket("1", newPartsBasket)
                .then(() => {
                    expect(methodSpy.calledOnce).toBe(true);
                    expect(methodSpy.args[0][0].partsDetail).toBeDefined();
                    expect(methodSpy.args[0][0].partsDetail.partsBasket.partsToOrder.length).toBe(1);
                    expect(methodSpy.args[0][0].partsDetail.partsBasket.partsToOrder[0].quantity).toBe(2);
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        it("can save part basket", (done) => {
            let partToOrder: Part = new Part();
            partToOrder.id = Guid.newGuid();

            let job = new Job();
            job.partsDetail = new PartsDetail();
            job.partsDetail.partsBasket = new PartsBasket();
            job.partsDetail.partsBasket.partsToOrder = [partToOrder];

            let newPartToAdd: Part = new Part();
            newPartToAdd.id = Guid.newGuid();
            newPartToAdd.description = "New Part";
            newPartToAdd.partOrderStatus = "J";
            newPartToAdd.price = new bignumber.BigNumber(49);
            newPartToAdd.quantity = 1;
            newPartToAdd.stockReferenceId = "P123456789";
            newPartToAdd.taskId = "1";

            let task = new Task(true, false);
            task.activity = "ACT";
            task.productGroup = "PG";
            task.partType = "PT";
            task.id = "1";
            task.status = undefined;
            job.tasks = [task];

            let newPartsBasket: PartsBasket = new PartsBasket();
            newPartsBasket.partsToOrder = [partToOrder, newPartToAdd];

            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let methodSpy: Sinon.SinonSpy = jobServiceStub.setJob = sandbox.stub().resolves(null);

            partService.savePartsBasket("1", newPartsBasket)
                .then((partsDetail) => {
                    expect(partsDetail).toBeDefined();
                    expect(methodSpy.calledOnce).toBe(true);
                    expect(methodSpy.args[0][0].partsDetail.partsBasket.partsToOrder.length).toBe(2);
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        it("can save part basket and clear out the tasks for main part", (done) => {
            let partToOrder: Part = new Part();
            partToOrder.id = Guid.newGuid();

            let job = new Job();
            job.partsDetail = new PartsDetail();
            job.partsDetail.partsBasket = new PartsBasket();
            job.partsDetail.partsBasket.partsToOrder = [partToOrder];

            let task = new Task(true, false);
            task.activity = "ACT";
            task.productGroup = "PG";
            task.partType = "PT";
            task.id = "1";
            task.status = undefined;
            job.tasks = [task];

            let newPartToAdd: Part = new Part();
            newPartToAdd.id = Guid.newGuid();
            newPartToAdd.description = "New Part";
            newPartToAdd.partOrderStatus = "J";
            newPartToAdd.price = new bignumber.BigNumber(49);
            newPartToAdd.quantity = 1;
            newPartToAdd.stockReferenceId = "P123456789";
            newPartToAdd.taskId = "1";
            newPartToAdd.isMainPart = true;

            let newPartsBasket: PartsBasket = new PartsBasket();
            newPartsBasket.partsToOrder = [partToOrder, newPartToAdd];

            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let methodSpy: Sinon.SinonSpy = jobServiceStub.setJob = sandbox.stub().resolves(null);

            partService.savePartsBasket("1", newPartsBasket)
                .then((partsDetail) => {
                    expect(partsDetail).toBeDefined();
                    expect(methodSpy.calledOnce).toBe(true);
                    expect(methodSpy.args[0][0].partsDetail.partsBasket.partsToOrder.length).toBe(2);
                    expect(methodSpy.args[0][0].tasks[0].activity).toBeUndefined();
                    expect(methodSpy.args[0][0].tasks[0].productGroup).toBeUndefined();
                    expect(methodSpy.args[0][0].tasks[0].partType).toBeUndefined();
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        it("can save part basket and clear out the tasks for main part and set datastate to not visited", (done) => {
            let partToOrder: Part = new Part();
            partToOrder.id = Guid.newGuid();

            let job = new Job();
            job.partsDetail = new PartsDetail();
            job.partsDetail.partsBasket = new PartsBasket();
            job.partsDetail.partsBasket.partsToOrder = [partToOrder];

            let task = new Task(true, false);
            task.activity = "ACT";
            task.productGroup = "PG";
            task.partType = "PT";
            task.dataState = DataState.valid;
            task.id = "1";
            task.status = undefined;
            job.tasks = [];
            job.tasks.push(task);

            let newPartToAdd: Part = new Part();
            newPartToAdd.id = Guid.newGuid();
            newPartToAdd.description = "New Part";
            newPartToAdd.partOrderStatus = "J";
            newPartToAdd.price = new bignumber.BigNumber(49);
            newPartToAdd.quantity = 1;
            newPartToAdd.stockReferenceId = "P123456789";
            newPartToAdd.taskId = "1";
            newPartToAdd.isMainPart = true;

            let newPartsBasket: PartsBasket = new PartsBasket();
            newPartsBasket.partsToOrder = [partToOrder, newPartToAdd];

            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let methodSpy: Sinon.SinonSpy = jobServiceStub.setJob = sandbox.stub().resolves(null);

            partService.savePartsBasket("1", newPartsBasket)
                .then((partsDetail) => {
                    expect(partsDetail).toBeDefined();
                    expect(methodSpy.calledOnce).toBe(true);
                    expect(methodSpy.args[0][0].partsDetail.partsBasket.partsToOrder.length).toBe(2);
                    expect(methodSpy.args[0][0].tasks[0].activity).toBeUndefined();
                    expect(methodSpy.args[0][0].tasks[0].productGroup).toBeUndefined();
                    expect(methodSpy.args[0][0].tasks[0].partType).toBeUndefined();
                    expect(methodSpy.args[0][0].tasks[0].dataState).toBe(DataState.notVisited);
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        //     it("should partsbasket datastate be invalid", (done) => {
        //         let partToOrder: Part = new Part();
        //         partToOrder.id = Guid.newGuid();

        //         let job = new Job();
        //         job.partsDetail = new PartsDetail();
        //         job.partsDetail.partsBasket = new PartsBasket();

        //         let newPartToAdd: Part = new Part();
        //         newPartToAdd.id = Guid.newGuid();
        //         newPartToAdd.description = "New Part";
        //         newPartToAdd.partOrderStatus = "J";
        //         newPartToAdd.price = new bignumber.BigNumber(49);
        //         newPartToAdd.quantity = 1;
        //         newPartToAdd.stockReferenceId = "P123456789";
        //         newPartToAdd.taskId = "1";

        //         let newPartsBasket: PartsBasket = new PartsBasket();
        //         newPartsBasket.partsToOrder = [partToOrder, newPartToAdd];
        //         newPartsBasket.dataState = DataState.valid;

        //         let task = new Task(true, false);
        //         task.status = "C";
        //         task.id = "1";
        //         job.tasks = [task];

        //         jobServiceStub.getJob = sandbox.stub().resolves(job);
        //         let methodSpy: Sinon.SinonSpy = jobServiceStub.setJob = sandbox.stub().resolves(null);

        //         partService.savePartsBasket("1", newPartsBasket, [])
        //             .then((partsDetail) => {
        //                 expect(partsDetail).toBeDefined();
        //                 expect(methodSpy.calledOnce).toBe(true);
        //                 expect(methodSpy.args[0][0].partsDetail.partsBasket.partsToOrder.length).toBe(3);
        //                 expect(job.partsDetail.partsBasket.dataState).toBe(DataState.invalid);
        //                 done();
        //             })
        //             .catch((error) => {
        //                 fail("Should not be here: " + error);
        //                 done();
        //             });
    });

    //     it("should partsbasket datastate be valid", (done) => {
    //         let partToOrder: Part = new Part();
    //         partToOrder.id = Guid.newGuid();

    //         let job = new Job();
    //         job.partsDetail = new PartsDetail();
    //         job.partsDetail.partsBasket = new PartsBasket();

    //         let newPartToAdd: Part = new Part();
    //         newPartToAdd.id = Guid.newGuid();
    //         newPartToAdd.description = "New Part";
    //         newPartToAdd.partOrderStatus = "V";
    //         newPartToAdd.price = new bignumber.BigNumber(49);
    //         newPartToAdd.quantity = 1;
    //         newPartToAdd.stockReferenceId = "P123456789";
    //         newPartToAdd.taskId = "1";

    //         let newPartsBasket: PartsBasket = new PartsBasket();
    //         newPartsBasket.partsToOrder = [partToOrder, newPartToAdd];
    //         newPartsBasket.dataState = DataState.valid;

    //         let task = new Task(true, false);
    //         task.status = "C";
    //         task.id = "1";
    //         job.tasks = [task];

    //         jobServiceStub.getJob = sandbox.stub().resolves(job);
    //         let methodSpy: Sinon.SinonSpy = jobServiceStub.setJob = sandbox.stub().resolves(null);

    //         partService.savePartsBasket("1", newPartsBasket, [])
    //             .then((partsDetail) => {
    //                 expect(partsDetail).toBeDefined();
    //                 expect(methodSpy.calledOnce).toBe(true);
    //                 expect(methodSpy.args[0][0].partsDetail.partsBasket.partsToOrder.length).toBe(3);
    //                 expect(job.partsDetail.partsBasket.dataState).toBe(DataState.valid);
    //                 done();
    //             })
    //             .catch((error) => {
    //                 fail("Should not be here: " + error);
    //                 done();
    //             });
    //     });
    // });

    describe("getPartWarrantyEstimate", () => {

        let job: Job;
        let partCatalogs: IGoodsType[];

        beforeEach(() => {

            let toFitPartStatus = <IGoodsItemStatus>{
                status: "F",
                goodsItemNotFindIndicator: "N"
            };

            let fittedStatus = <IGoodsItemStatus>{
                status: "N",
                goodsItemNotFindIndicator: "Y"
            };

            // fitted statuses
            catalogServiceStub.getGoodsItemStatuses = sandbox.stub().resolves([toFitPartStatus, fittedStatus]);

            // mock parts catalog
            partCatalogs = <IGoodsType[]>[
                {
                    productGroupCode: "A",
                    partTypeCode: "X",
                    warrantyPeriod: 53,
                    goodsTypeStartDate: moment().add(1, "day").format("YYYY-MM-DD"),
                    goodsTypeEndDate: moment().add(2, "day").format("YYYY-MM-DD")
                },
                {
                    productGroupCode: "A",
                    partTypeCode: "X"
                },
                {
                    productGroupCode: "B",
                    partTypeCode: "Y"
                }
            ];

            let stub = sandbox.stub();

            catalogServiceStub.getGoodsType = stub;

            stub.withArgs("001").returns(Promise.resolve(partCatalogs[0]));
            stub.withArgs("002").returns(Promise.resolve(partCatalogs[1]));
            stub.withArgs("003").returns(Promise.resolve(partCatalogs[2]));

            job = <Job>{
                id: "101",
                tasks: [
                    <Task>{
                        id: "201",
                        applianceId: "301",
                        activities: [
                            <Activity>{
                                parts: [
                                    <Part>{
                                        stockReferenceId: "001",
                                        status: "N",
                                        taskId: "101"
                                    }
                                ]
                            }
                        ]
                    }
                ],
                history: {
                    appliances: [
                        <Appliance>{
                            id: "301",
                            installationYear: 1990,
                            applianceType: "X"
                        },
                        <Appliance>{
                            id: "302",
                            installationYear: 1991,
                            applianceType: "Y"
                        }
                    ],
                    tasks: [
                        <Task>{
                            id: "211",
                            applianceId: "301",
                            activities: [
                                <Activity>{
                                    date: moment().add(-1, "day").toDate(),
                                    parts: [
                                        <Part>{
                                            stockReferenceId: "001",
                                            status: "N",
                                            taskId: "211"
                                        },
                                        <Part>{
                                            stockReferenceId: "002",
                                            status: "N",
                                            taskId: "211"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            };
            jobServiceStub.getJob = sandbox.stub().resolves(job);

            partService = new PartService(jobServiceStub, catalogServiceStub, businessRuleServiceStub);
        });

        it("can call getPartWarrantyEstimate and find part not in warranty", done => {
            partService.getPartWarrantyEstimate("101", "001", "201").then(estimate => {
                expect(estimate.isInWarranty).toBe(false);
                expect(estimate.warrantyEstimateType).toBe(WarrantyEstimateType.notInWarranty);
                done();
            });
        });

        it("can call getPartWarrantyEstimate and find part in warranty due to appliance install", done => {
            job.history.appliances[0].installationYear = moment().year();
            partService.getPartWarrantyEstimate("101", "001", "201").then(estimate => {
                expect(estimate.isInWarranty).toBe(true);
                expect(estimate.warrantyEstimateType).toBe(WarrantyEstimateType.applianceInstallationDate);
                expect(estimate.warrantyPeriodWeeks).toBe(260);
                done();
            });
        });

        it("can call getPartWarrantyEstimate and get correct appliance install date", done => {
            let year = moment().year();
            job.history.appliances[0].installationYear = year;
            partService.getPartWarrantyEstimate("101", "001", "201").then(estimate => {
                expect(estimate.lastFittedDate).toEqual(moment(`${year}-12-31`).toDate());
                done();
            });
        });

        it("can call getPartWarrantyEstimate and find part in warranty due to exact same part previous install date", done => {
            job.history.tasks[0].activities[0].parts[0].status = "F";
            partService.getPartWarrantyEstimate("101", "001", "201").then(estimate => {
                expect(estimate.isInWarranty).toBe(true);
                expect(estimate.warrantyEstimateType).toBe(WarrantyEstimateType.samePartInstallationDate);
                expect(estimate.warrantyPeriodWeeks).toBe(52);
                done();
            });
        });

        it("can call getPartWarrantyEstimate and find part in warranty due to equivalent part previous install date", done => {
            job.history.tasks[0].activities[0].parts[1].status = "F";
            partService.getPartWarrantyEstimate("101", "001", "201").then(estimate => {
                expect(estimate.isInWarranty).toBe(true);
                expect(estimate.warrantyEstimateType).toBe(WarrantyEstimateType.equivalentPartInstallationDate);
                expect(estimate.warrantyPeriodWeeks).toBe(52);
                done();
            });
        });

        it("can call getPartWarrantyEstimate and get part-specific warranty period", done => {
            job.history.appliances[0].installationYear = moment().year();
            job.history.tasks[0].activities[0].parts[0].status = "F";
            partCatalogs[0].goodsTypeStartDate = moment().add(-1, "day").format("YYYY-MM-DD");
            partService.getPartWarrantyEstimate("101", "001", "201").then(estimate => {
                expect(estimate.isInWarranty).toBe(true);
                expect(estimate.warrantyEstimateType).toBe(WarrantyEstimateType.samePartInstallationDate);
                expect(estimate.warrantyPeriodWeeks).toBe(53);
                done();
            });
        });

        it("can call getPartWarrantyEstimate and get part-specific warranty period of zero weeks", done => {
            job.history.appliances[0].installationYear = moment().year();
            partCatalogs[0].goodsTypeStartDate = moment().add(-1, "day").format("YYYY-MM-DD");
            partCatalogs[0].warrantyPeriod = 0;
            partService.getPartWarrantyEstimate("101", "001", "201").then(estimate => {
                expect(estimate.isInWarranty).toBe(false);
                expect(estimate.warrantyEstimateType).toBe(WarrantyEstimateType.doesNotHaveWarranty);
                expect(estimate.warrantyPeriodWeeks).toBe(0);
                done();
            });
        });

        it("can call getPartWarrantyEstimate and get fitted-part-based warranty period in preference to all other types", done => {
            job.history.appliances[0].installationYear = moment().year();
            job.history.tasks[0].activities[0].parts[0].status = "F";
            job.history.tasks[0].activities[0].parts[1].status = "F";
            partCatalogs[0].goodsTypeStartDate = moment().add(-1, "day").format("YYYY-MM-DD");
            partService.getPartWarrantyEstimate("101", "001", "201").then(estimate => {
                expect(estimate.isInWarranty).toBe(true);
                expect(estimate.warrantyEstimateType).toBe(WarrantyEstimateType.samePartInstallationDate);
                expect(estimate.warrantyPeriodWeeks).toBe(53);
                done();
            });
        });

        it("can call getPartWarrantyEstimate when goodsTypeEndDate is empty string", done => {
            job.history.appliances[0].installationYear = moment().year();
            job.history.tasks[0].activities[0].parts[0].status = "F";
            job.history.tasks[0].activities[0].parts[1].status = "F";
            partCatalogs[0].goodsTypeStartDate = moment().add(-1, "day").format("YYYY-MM-DD");
            partCatalogs[0].goodsTypeEndDate = "";

            partService.getPartWarrantyEstimate("101", "001", "201").then(estimate => {
                expect(estimate.isInWarranty).toBe(true);
                expect(estimate.warrantyEstimateType).toBe(WarrantyEstimateType.samePartInstallationDate);
                expect(estimate.warrantyPeriodWeeks).toBe(53);
                done();
            });
        });
    });

    describe("getTodaysParts", () => {

        it("can call getTodaysParts and attach estimates to parts", done => {
            let part = <Part>{
                stockReferenceId: "1",
                taskId: "2",
                status: "F"
            };

            let job = <Job>{
                tasks: [
                    <Task>{
                        activities: [
                            <Activity>{
                                status: "D",
                                parts: [
                                    part
                                ]
                            }
                        ]
                    },
                ],
                partsDetail: {
                    partsToday: {
                        parts: [
                            part
                        ]
                    }
                }
            };

            jobServiceStub.getJob = sandbox.stub().resolves(job);

            let warrantyEstimate = <WarrantyEstimate>{};

            let getWarrantySpy: Sinon.SinonSpy = partService.getPartWarrantyEstimate = sandbox.stub().resolves(warrantyEstimate);

            partService.getTodaysParts("001").then(parts => {
                expect(getWarrantySpy.calledWith("001", "1", "2")).toBe(true);
                expect(part.warrantyEstimate).toBe(warrantyEstimate);
                done();
            });
        });

        it("can call getTodaysParts and get parts", done => {
            let part1 = <Part>{ status: "F" };
            let part2 = <Part>{ status: "F" };
            let part3 = <Part>{ status: "F" };
            let part4 = <Part>{ status: "F" };

            let job = <Job>{
                tasks: [
                    <Task>{
                        activities: [
                            <Activity>{
                                status: "D",
                                parts: [
                                    part1,
                                    part2
                                ]
                            },
                            <Activity>{
                                status: "D",
                                parts: [
                                    part3
                                ]
                            }
                        ]
                    },
                    <Task>{
                        activities: [
                            <Activity>{
                                status: "D",
                                parts: [
                                    part4
                                ]
                            }
                        ]
                    }
                ],
                partsDetail: {
                    partsToday: {
                        parts: [
                            part1,
                            part2,
                            part3,
                            part4
                        ]
                    }
                }
            };
            jobServiceStub.getJob = sandbox.stub().resolves(job);

            partService.getPartWarrantyEstimate = sandbox.stub().resolves(<WarrantyEstimate>{});

            partService.getTodaysParts("001").then(parts => {
                expect(parts.parts).toEqual([part1, part2, part3, part4]);
                done();
            });
        });

        it("can handle no job found", (done) => {
            jobServiceStub.getJob = sandbox.stub().resolves(null);

            partService.getTodaysParts("1")
                .then(() => {
                    fail("Should not be here");
                    done();
                })
                .catch((error) => {
                    expect(error instanceof BusinessException).toBe(true);
                    done();
                });
        });
    });

    describe("save todays parts", () => {
        it("can save set todays parts warranty and notUsed properties and save job", done => {

            let id1 = <Guid>{},
                id2 = <Guid>{};

            let part1 = <Part>{
                id: id1,
                status: "F"
            };
            let part2 = <Part>{
                id: id2,
                status: "F"
            };

            let job = <Job>{
                partsDetail: {
                    partsToday: {
                        parts: [
                            part1,
                            part2
                        ]
                    }
                }
            };

            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let saveSpy: Sinon.SinonSpy = jobServiceStub.setJob = sandbox.stub().resolves(null);

            let incomingPart1WarrantyReturn = <PartWarrantyReturn>{};

            let incomingPart2NotUsedReturn = <PartNotUsedReturn>{};

            partService.saveTodaysPartsReturns("001", DataState.invalid, [
                { partId: id1, warrantyReturn: incomingPart1WarrantyReturn, notusedReturn: undefined },
                { partId: id2, warrantyReturn: undefined, notusedReturn: incomingPart2NotUsedReturn }
            ])
                .then(() => {
                    expect(job.partsDetail.partsToday.parts[0].warrantyReturn).toBe(incomingPart1WarrantyReturn);
                    expect(job.partsDetail.partsToday.parts[0].notUsedReturn).toBeUndefined();
                    expect(job.partsDetail.partsToday.parts[1].notUsedReturn).toBe(incomingPart2NotUsedReturn);
                    expect(job.partsDetail.partsToday.parts[1].warrantyReturn).toBeUndefined();
                    expect(job.partsDetail.partsToday.dataState).toBe(DataState.invalid);

                    expect(saveSpy.calledWith(job)).toBe(true);
                    done();
                });
        });

        it("can handle no job found", (done) => {
            jobServiceStub.getJob = sandbox.stub().resolves(null);

            partService.saveTodaysPartsReturns("1", DataState.invalid, [])
                .then(() => {
                    fail("Should not be here");
                    done();
                })
                .catch((error) => {
                    expect(error instanceof BusinessException).toBe(true);
                    done();
                });
        });
    });

    describe("getFittedParts", () => {
        it("can call getFittedParts, returns fitted parts", done => {
            let job: Job;
            job = <Job>{
                id: "101",
                tasks: [
                    <Task>{
                        id: "201",
                        applianceId: "301",
                        activities: [
                            <Activity>{
                                parts: [
                                    <Part>{
                                        stockReferenceId: "001",
                                        status: "F",
                                        taskId: "101"
                                    }
                                ]
                            }
                        ]
                    }
                ],
                history: {
                    tasks: [
                        <Task>{
                            id: "211",
                            applianceId: "301",
                            activities: [
                                <Activity>{
                                    date: moment().add(-1, "day").toDate(),
                                    parts: [
                                        <Part>{
                                            stockReferenceId: "001",
                                            status: "F",
                                            taskId: "211"
                                        },
                                        <Part>{
                                            stockReferenceId: "002",
                                            status: "N",
                                            taskId: "211"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            };
            catalogServiceStub.getGoodsItemStatuses = sandbox.stub().resolves([<IGoodsItemStatus>{
                status: "F",
                goodsItemNotFindIndicator: "N"
            }, <IGoodsItemStatus>{
                status: "N",
                goodsItemNotFindIndicator: "Y"
            }]);

            jobServiceStub.getJob = sandbox.stub().resolves(job);
            partService.getFittedParts("101").then(parts => {
                expect(parts.length).toBe(2);
                done();
            });
        });

        it("can call getFittedParts, returns no fitted parts", done => {
            let job: Job;
            job = <Job>{
                id: "101",
                tasks: [
                    <Task>{
                        id: "201",
                        applianceId: "301",
                        activities: [
                            <Activity>{
                                parts: [
                                    <Part>{
                                        stockReferenceId: "001",
                                        status: "C",
                                        taskId: "101"
                                    }
                                ]
                            }
                        ]
                    }
                ],
                history: {
                    tasks: [
                        <Task>{
                            id: "211",
                            applianceId: "301",
                            activities: [
                                <Activity>{
                                    date: moment().add(-1, "day").toDate(),
                                    parts: [
                                        <Part>{
                                            stockReferenceId: "001",
                                            status: "D",
                                            taskId: "211"
                                        },
                                        <Part>{
                                            stockReferenceId: "002",
                                            status: "D",
                                            taskId: "211"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            };
            catalogServiceStub.getGoodsItemStatuses = sandbox.stub().resolves([{
                gdsIteStatusCode: "F",
                gdsIteNotFtdInd: "N"
            }, {
                gdsIteStatusCode: "N",
                gdsIteNotFtdInd: "Y"
            }]);

            jobServiceStub.getJob = sandbox.stub().resolves(job);
            partService.getFittedParts("101").then(parts => {
                expect(parts.length === 0).toBe(true);
                done();
            });
        });

        it("can call getFittedParts has no history, returns no fitted parts", done => {
            let job: Job;
            job = <Job>{
                id: "101",
                tasks: [
                    <Task>{
                        id: "201",
                        applianceId: "301",
                        activities: [
                            <Activity>{
                                parts: [
                                    <Part>{
                                        stockReferenceId: "001",
                                        status: "C",
                                        taskId: "101"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };
            catalogServiceStub.getGoodsItemStatuses = sandbox.stub().resolves([{
                gdsIteStatusCode: "F",
                gdsIteNotFtdInd: "N"
            }, {
                gdsIteStatusCode: "N",
                gdsIteNotFtdInd: "Y"
            }]);

            jobServiceStub.getJob = sandbox.stub().resolves(job);
            partService.getFittedParts("101").then(parts => {
                expect(parts.length === 0).toBe(true);
                done();
            });
        });

        it("can call getFittedParts has no job, throws", done => {
            catalogServiceStub.getGoodsItemStatuses = sandbox.stub().resolves([{
                gdsIteStatusCode: "F",
                gdsIteNotFtdInd: "N"
            }, {
                gdsIteStatusCode: "N",
                gdsIteNotFtdInd: "Y"
            }]);

            jobServiceStub.getJob = sandbox.stub().resolves(null);
            partService.getFittedParts("101")
                .then(() => {
                    fail("Should not be here");
                    done();
                })
                .catch((error) => {
                    expect(error instanceof BusinessException).toBe(true);
                    done();
                });
        });

        it("should return 3 fitted parts", done => {
            let job: Job;
            job = <Job>{
                id: "101",
                tasks: [
                    <Task>{
                        id: "201",
                        applianceId: "301",
                        status: "C",
                        activities: [
                            <Activity>{
                                "status": "C",
                                parts: [
                                    <Part>{
                                        stockReferenceId: "001",
                                        status: "F",
                                        taskId: "201"
                                    }
                                ]
                            }
                        ]
                    }
                ],
                history: {
                    tasks: [
                        <Task>{
                            id: "211",
                            applianceId: "301",
                            activities: [
                                <Activity>{
                                    date: moment().add(-1, "day").toDate(),
                                    parts: [
                                        <Part>{
                                            stockReferenceId: "001",
                                            status: "F",
                                            taskId: "211"
                                        },
                                        <Part>{
                                            stockReferenceId: "002",
                                            status: "F",
                                            taskId: "211"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            };
            catalogServiceStub.getGoodsItemStatuses = sandbox.stub().resolves([<IGoodsItemStatus>{
                status: "F",
                goodsItemNotFindIndicator: "N"
            }, <IGoodsItemStatus>{
                status: "N",
                goodsItemNotFindIndicator: "Y"
            }]);

            jobServiceStub.getJob = sandbox.stub().resolves(job);
            partService.getFittedParts("101").then(parts => {
                expect(parts.length).toBe(3);
                done();
            });
        });
    });

    describe("the getMainPartForTask function", () => {
        beforeEach(() => {

        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can handle no job found", (done) => {
            jobServiceStub.getJob = sandbox.stub().resolves(null);

            partService.getMainPartForTask("1", "1")
                .then(() => {
                    fail("Should not be here");
                    done();
                })
                .catch((error) => {
                    expect(error instanceof BusinessException).toBe(true);
                    done();
                });
        });

        it("can return no main part", (done) => {
            let partToOrder: Part = new Part();
            partToOrder.id = 1;
            partToOrder.taskId = "2";

            let partToOrder2: Part = new Part();
            partToOrder2.id = 2;
            partToOrder.taskId = "2";

            let job = new Job();
            job.partsDetail = new PartsDetail();
            job.partsDetail.partsBasket = new PartsBasket();
            job.partsDetail.partsBasket.partsToOrder = [partToOrder, partToOrder2];

            jobServiceStub.getJob = sandbox.stub().resolves(job);

            partService.getMainPartForTask("1", "1")
                .then((mainPart) => {
                    expect(mainPart).toBeNull();
                    done();
                })
                .catch(() => {
                    fail("Should not be here");
                    done();
                });
        });

        it("can return no main part for task", (done) => {
            let partToOrder: Part = new Part();
            partToOrder.id = 1;
            partToOrder.taskId = "1";

            let partToOrder2: Part = new Part();
            partToOrder2.id = 2;
            partToOrder.taskId = "2";

            let job = new Job();
            job.partsDetail = new PartsDetail();
            job.partsDetail.partsBasket = new PartsBasket();
            job.partsDetail.partsBasket.partsToOrder = [partToOrder, partToOrder2];

            jobServiceStub.getJob = sandbox.stub().resolves(job);

            partService.getMainPartForTask("1", "1")
                .then((mainPart) => {
                    expect(mainPart).toBeNull();
                    done();
                })
                .catch(() => {
                    fail("Should not be here");
                    done();
                });
        });

        it("can return main part for task", (done) => {
            let partToOrder: Part = new Part();
            partToOrder.id = 1;
            partToOrder.taskId = "1";
            partToOrder.isMainPart = true;

            let partToOrder2: Part = new Part();
            partToOrder2.id = 2;
            partToOrder.taskId = "1";

            let job = new Job();
            job.partsDetail = new PartsDetail();
            job.partsDetail.partsBasket = new PartsBasket();
            job.partsDetail.partsBasket.partsToOrder = [partToOrder, partToOrder2];

            jobServiceStub.getJob = sandbox.stub().resolves(job);

            partService.getMainPartForTask("1", "1")
                .then((mainPart) => {
                    expect(mainPart).toBeDefined();
                    expect(mainPart.id).toBe(1);
                    expect(mainPart.isMainPart).toBe(true);
                    done();
                })
                .catch(() => {
                    fail("Should not be here");
                    done();
                });
        });
    });

    describe("the clearMainPartForTask function", () => {
        beforeEach(() => {

        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can handle no job found", (done) => {
            jobServiceStub.getJob = sandbox.stub().resolves(null);

            partService.clearMainPartForTask("1", "1")
                .then(() => {
                    fail("Should not be here");
                    done();
                })
                .catch((error) => {
                    expect(error instanceof BusinessException).toBe(true);
                    done();
                });
        });

        it("can handle no main part for task", (done) => {
            let partToOrder: Part = new Part();
            partToOrder.id = 1;
            partToOrder.taskId = "1";

            let partToOrder2: Part = new Part();
            partToOrder2.id = 2;
            partToOrder.taskId = "1";

            let job = new Job();
            job.partsDetail = new PartsDetail();
            job.partsDetail.partsBasket = new PartsBasket();
            job.partsDetail.partsBasket.partsToOrder = [partToOrder, partToOrder2];

            jobServiceStub.getJob = sandbox.stub().resolves(job);

            let methodSpy: Sinon.SinonSpy = jobServiceStub.setJob = sandbox.stub().resolves(null);

            partService.clearMainPartForTask("1", "1")
                .then(() => {
                    expect(methodSpy.notCalled).toBe(true);
                    done();
                })
                .catch(() => {
                    fail("Should not be here");
                    done();
                });
        });

        it("can clear the main part for task", (done) => {
            let partToOrder: Part = new Part();
            partToOrder.id = 1;
            partToOrder.taskId = "1";
            partToOrder.isMainPart = true;

            let partToOrder2: Part = new Part();
            partToOrder2.id = 2;
            partToOrder.taskId = "1";

            let job = new Job();
            job.partsDetail = new PartsDetail();
            job.partsDetail.partsBasket = new PartsBasket();
            job.partsDetail.partsBasket.partsToOrder = [partToOrder, partToOrder2];

            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let methodSpy: Sinon.SinonSpy = jobServiceStub.setJob = sandbox.stub().resolves(null);

            partService.clearMainPartForTask("1", "1")
                .then(() => {
                    expect(methodSpy.calledOnce).toBe(true);
                    expect(methodSpy.args[0][0].partsDetail.partsBasket.partsToOrder[0].isMainPart).toBe(false);
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

    });

    describe("check parts validity status", () => {
        let partToOrder: Part = new Part();
        partToOrder.id = 1;
        partToOrder.taskId = "1";
        partToOrder.partOrderStatus = "O";

        let partToOrder2: Part = new Part();
        partToOrder2.id = 2;
        partToOrder.taskId = "1";
        partToOrder.partOrderStatus = "O";

        let job = new Job();
        job.partsDetail = new PartsDetail();
        job.partsDetail.partsBasket = new PartsBasket();
        job.id = "1";

        let task = new Task(true, false);
        task.activity = "ACT";
        task.productGroup = "PG";
        task.partType = "PT";
        task.id = "1";

        // parts basket is empty, so should require parts
        it("check 'parts required status' requires parts", (done) => {
            task.status = "IP";
            job.tasks = [task];
            job.partsDetail.partsBasket.partsInBasket = [partToOrder, partToOrder2];
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            jobServiceStub.setJob = sandbox.stub().resolves(undefined);

            partService.setPartsRequiredForTask(job.id)
                .then((validity) => {
                    expect(validity).toBe(true);
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        it("allows van stock", (done) => {
            task.status = "IA";
            job.tasks = [task];
            partToOrder.partOrderStatus = "V";
            partToOrder2.partOrderStatus = "V";
            job.partsDetail.partsBasket.partsToOrder = [partToOrder, partToOrder2];
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            jobServiceStub.setJob = sandbox.stub().resolves(undefined);

            partService.setPartsRequiredForTask(job.id)
                .then((validity) => {
                    // basket is valid, but were returning a false to not show message
                    expect(validity).toBe(false);
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        it("allows Wait Advice status when parts in basket", (done) => {
            task.status = "WA";
            job.tasks = [task];
            job.partsDetail.partsBasket.partsInBasket = [partToOrder, partToOrder2];
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            jobServiceStub.setJob = sandbox.stub().resolves(undefined);

            partService.setPartsRequiredForTask(job.id)
                .then((validity) => {
                    expect(validity).toBe(false);
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        it("allows Wait Advice status when parts not in basket", (done) => {
            task.status = "WA";
            job.tasks = [task];
            job.partsDetail.partsBasket.partsInBasket = [];
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            jobServiceStub.setJob = sandbox.stub().resolves(undefined);

            partService.setPartsRequiredForTask(job.id)
                .then((validity) => {
                    expect(validity).toBe(false);
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        it("doesn't allow any other status when parts in basket", (done) => {
            task.status = "WA";
            job.tasks = [task];
            job.partsDetail.partsBasket.partsInBasket = [partToOrder, partToOrder2];
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            jobServiceStub.setJob = sandbox.stub().resolves(undefined);

            partService.setPartsRequiredForTask(job.id)
                .then((validity) => {
                    expect(validity).toBe(false);
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        it("doesn't allow any other status when parts not in basket", (done) => {
            task.status = "WA";
            job.tasks = [task];
            job.partsDetail.partsBasket.partsToOrder = [];
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            jobServiceStub.setJob = sandbox.stub().resolves(undefined);

            partService.setPartsRequiredForTask(job.id)
                .then((validity) => {
                    expect(validity).toBe(false);
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });
    });

    describe("deletePartsAssociatedWithTask method", () => {
        let partToOrder1: Part = new Part();
        partToOrder1.id = 1;
        partToOrder1.taskId = "1";
        partToOrder1.partOrderStatus = "O";

        let partToOrder2: Part = new Part();
        partToOrder2.id = 2;
        partToOrder2.taskId = "2";
        partToOrder2.partOrderStatus = "V";

        let job = new Job();
        job.partsDetail = new PartsDetail();
        job.partsDetail.partsBasket = new PartsBasket();
        job.id = "1";

        let task1 = new Task(true, false);
        task1.activity = "ACT";
        task1.productGroup = "PG";
        task1.partType = "PT";
        task1.id = "1";
        task1.status = "IP";

        let task2 = new Task(true, false);
        task2.activity = "BK";
        task2.productGroup = "GAS";
        task2.partType = "PT";
        task2.id = "2";
        task2.status = "C";

        it("partToOrder2 should be removed from the partsToOrder array and partsbasket should turn amber", async (done) => {
            job.tasks = [task1, task2];
            job.partsDetail.partsBasket.partsToOrder = [partToOrder1, partToOrder2];
            job.partsDetail.partsBasket.dataState = DataState.invalid;
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            jobServiceStub.setJob = sandbox.stub().resolves(undefined);

            await partService.deletePartsAssociatedWithTask(job.id, "2");
            expect(job.partsDetail.partsBasket.partsToOrder.length).toBe(1);
            expect(job.partsDetail.partsBasket.partsToOrder.some(p => p.taskId === "2")).toBeFalsy();
            expect(job.partsDetail.partsBasket.dataState).toBe(DataState.notVisited);
            done();
        });

        it("partToOrder2 should be removed from the partsToOrder and partsbasket should turn red", async (done) => {
            job.tasks = [task1, task2];
            task1.status = "C";
            job.partsDetail.partsBasket.partsToOrder = [partToOrder1, partToOrder2];
            job.partsDetail.partsBasket.dataState = DataState.notVisited;
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            jobServiceStub.setJob = sandbox.stub().resolves(undefined);

            await partService.deletePartsAssociatedWithTask(job.id, "2");
            expect(job.partsDetail.partsBasket.partsToOrder.length).toBe(1);
            expect(job.partsDetail.partsBasket.partsToOrder.some(p => p.taskId === "2")).toBeFalsy();
            expect(job.partsDetail.partsBasket.dataState).toBe(DataState.invalid);
            done();
        });

        it("partToOrder3 should be removed from the partsToOrder array and partsbasket should turn amber", async (done) => {
            let task3 = new Task(true, false);
            task3.activity = "BK";
            task3.productGroup = "GAS";
            task3.partType = "PT";
            task3.id = "3";
            task3.status = "C";

            let partToOrder3: Part = new Part();
            partToOrder3.id = 3;
            partToOrder3.taskId = "3";
            partToOrder3.partOrderStatus = "V";

            partToOrder1.partOrderStatus = "V";
            task1.status = "C";
            job.tasks = [task1, task2, task3];
            job.partsDetail.partsBasket.partsToOrder = [partToOrder1, partToOrder2, partToOrder3];
            job.partsDetail.partsBasket.dataState = DataState.invalid;
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            jobServiceStub.setJob = sandbox.stub().resolves(undefined);

            await partService.deletePartsAssociatedWithTask(job.id, "3");
            expect(job.partsDetail.partsBasket.partsToOrder.length).toBe(2);
            expect(job.partsDetail.partsBasket.partsToOrder.some(p => p.taskId === "3")).toBeFalsy();
            expect(job.partsDetail.partsBasket.dataState).toBe(DataState.notVisited);
            done();
        });

        it("partsBasket is undefined", async (done) => {
            let task3 = new Task(true, false);
            task3.activity = "BK";
            task3.productGroup = "GAS";
            task3.partType = "PT";
            task3.id = "3";
            task3.status = "C";

            task1.status = "C";
            job.tasks = [task1, task2, task3];
            job.partsDetail.partsBasket = undefined;;
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let methodSpy: Sinon.SinonSpy = jobServiceStub.setJob = sandbox.stub().resolves(undefined);

            await partService.deletePartsAssociatedWithTask(job.id, "3");
            expect(job.partsDetail.partsBasket).toBeUndefined();
            expect(methodSpy.called).toBeFalsy();
            done();
        });

        it("partsToOrder is undefined, should not change partsBasket data state", async (done) => {
            let task3 = new Task(true, false);
            task3.activity = "BK";
            task3.productGroup = "GAS";
            task3.partType = "PT";
            task3.id = "3";
            task3.status = "C";

            task1.status = "C";
            job.tasks = [task1, task2, task3];
            job.partsDetail = new PartsDetail();
            job.partsDetail.partsBasket = new PartsBasket();
            job.partsDetail.partsBasket.partsToOrder = undefined;
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let methodSpy: Sinon.SinonSpy = jobServiceStub.setJob = sandbox.stub().resolves(undefined);

            await partService.deletePartsAssociatedWithTask(job.id, "3");
            expect(job.partsDetail.partsBasket.dataState).toBe(DataState.dontCare);
            expect(methodSpy.called).toBeFalsy();
            done();
        });
    });
});
