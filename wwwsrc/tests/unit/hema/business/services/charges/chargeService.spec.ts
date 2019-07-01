/// <reference path="../../../../../../typings/app.d.ts" />

import { ChargeService } from "../../../../../../app/hema/business/services/charge/chargeService";
import { IJobService } from "../../../../../../app/hema/business/services/interfaces/IJobService";
import { ICatalogService } from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import { Job } from "../../../../../../app/hema/business/models/job";
import { Task } from "../../../../../../app/hema/business/models/task";
import { Activity } from "../../../../../../app/hema/business/models/activity";
import { IPartService } from "../../../../../../app/hema/business/services/interfaces/IPartService";
import { Part } from "../../../../../../app/hema/business/models/part";
import { Guid } from "../../../../../../app/common/core/guid";
import { IBusinessRuleService } from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { PartsToday } from "../../../../../../app/hema/business/models/partsToday";
import { QueryableBusinessRuleGroup } from "../../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import { EventAggregator } from "aurelia-event-aggregator";
import { Charge } from "../../../../../../app/hema/business/models/charge/charge";
import { ChargeableTask } from "../../../../../../app/hema/business/models/charge/chargeableTask";
import { IVat } from "../../../../../../app/hema/business/models/reference/IVat";
import { IPrimeChargeInterval } from "../../../../../../app/hema/business/models/reference/IPrimeChargeInterval";
import { ISubsqntChargeInterval } from "../../../../../../app/hema/business/models/reference/ISubsqntChargeInterval";
import { IJcChargeRules } from "../../../../../../app/hema/business/models/reference/IJcChargeRules";
import { IStorageService } from "../../../../../../app/hema/business/services/interfaces/IStorageService";
import { IAreaChargeRules } from "../../../../../../app/hema/business/models/reference/IAreaChargeRules";
import { IDiscount } from "../../../../../../app/hema/business/models/reference/IDiscount";
import { IActivityCmpnentVstStatus } from "../../../../../../app/hema/business/models/reference/IActivityCmpnentVstStatus";
import { History } from "../../../../../../app/hema/business/models/history";
import { ChargeServiceConstants } from "../../../../../../app/hema/business/services/constants/chargeServiceConstants";
import { JobServiceConstants } from "../../../../../../app/hema/business/services/constants/jobServiceConstants";
import { DataState } from "../../../../../../app/hema/business/models/dataState";
import { ChargeCatalogHelperService } from "../../../../../../app/hema/business/services/charge/chargeCatalogHelperService";
import { ChargePartsHelperService } from "../../../../../../app/hema/business/services/charge/chargePartsHelperService";
import { IChargePartsHelperService } from "../../../../../../app/hema/business/services/interfaces/charge/IChargePartsHelperService";
import { ChargeLabourHelperService } from "../../../../../../app/hema/business/services/charge/chargeLabourHelperService";
import { IChargeLabourHelperService } from "../../../../../../app/hema/business/services/interfaces/charge/IChargeLabourHelperService";
import { Helper } from "../../../../unitHelpers/chargeTestHelper.spec";
import * as moment from "moment";
import * as bignumber from "bignumber";

const {
    createChargeType, createAreaChargeRule, createJcChargeRule, createTask, createSubsqntChargeInterval,
    createLabourChargeRuleCode, createPrimeChargeInterval, createTaskActivity
} = Helper;

/**
 * These act more like integration test for charges, for lower level tests refer to chargeLabourHelperService and
 * ChargePartsHelperServiec
 */
describe("the ChargeService module", () => {

    let sandbox: Sinon.SinonSandbox;
    let chargeService: ChargeService;

    let mockJobService: IJobService = <IJobService>{};
    let mockCatalogService: ICatalogService = <ICatalogService>{};
    let mockStorageService: IStorageService = <IStorageService>{};
    let mockPartService: IPartService = <IPartService>{};
    let mockBusinessRuleService: IBusinessRuleService = <IBusinessRuleService>{};
    let getBusinessRuleStub: Sinon.SinonStub;

    let job: Job;
    let areaChargeRules: IAreaChargeRules [];
    let jobChargeRules: IJcChargeRules[];
    let primeChargeIntervals: IPrimeChargeInterval[];
    let subsequentChargeIntervals: ISubsqntChargeInterval[];

    let eaStub: EventAggregator = <EventAggregator>{};
    let setJobSpy: Sinon.SinonSpy;

    let queryableRuleGroup = <QueryableBusinessRuleGroup>{};

    let chargeCatalogHelper: ChargeCatalogHelperService;
    let chargePartsHelperService: IChargePartsHelperService;
    let chargeLabourHelperService: IChargeLabourHelperService;

    const TODAY_DATE = "2017-01-01";
    const END_DATE = "2099-01-01";

    function bNum(val: number): bignumber.BigNumber {
        return new bignumber.BigNumber(val);
    }

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        const today = moment(TODAY_DATE).toDate();
        jasmine.clock().mockDate(today);

        job = new Job();
        job.tasks = [];
        job.tasksNotToday = [];

        areaChargeRules = [];
        jobChargeRules = [];
        primeChargeIntervals = [];
        subsequentChargeIntervals = [];

        // mock vat rate catalog

        let vatRates: IVat[] = [];
        let vatRate = <IVat>{};
        vatRate.vatCode = "D";
        vatRate.vatRate = 175;
        vatRate.vatStartDate = "1996-01-01";
        vatRate.vatEndDate = "2008-03-31";

        let vatRate2 = <IVat>{};
        vatRate2.vatCode = "D";
        vatRate2.vatRate = 200;
        vatRate2.vatStartDate = "2008-04-01";
        vatRate2.vatEndDate = ""; // latest

        vatRates.push(vatRate);
        vatRates.push(vatRate2);

        mockCatalogService.getVats = sandbox.stub().resolves(vatRates);

        let statusDone = <IActivityCmpnentVstStatus>{};
        statusDone.status = "D";
        statusDone.jobStatusCategory = "D";

        let statusComplete = <IActivityCmpnentVstStatus>{};
        statusComplete.status = "C";
        statusComplete.jobStatusCategory = "C";

        let statusCompleteCancelled = <IActivityCmpnentVstStatus>{};
        statusCompleteCancelled.status = "CX";
        statusCompleteCancelled.jobStatusCategory = "C";

        let statusIncomplete = <IActivityCmpnentVstStatus>{};
        statusIncomplete.status = "IZ";
        statusIncomplete.jobStatusCategory = "I";

        let statusFurtherVisitRequired = <IActivityCmpnentVstStatus>{};
        statusFurtherVisitRequired.status = "IF";
        statusFurtherVisitRequired.jobStatusCategory = "I";

        let statusNoAccess = <IActivityCmpnentVstStatus>{};
        statusNoAccess.status = "NA";
        statusNoAccess.jobStatusCategory = "N";

        let statusNotVisited = <IActivityCmpnentVstStatus>{};
        statusNotVisited.status = "VO";
        statusNotVisited.jobStatusCategory = "V";

        let statusCancelled = <IActivityCmpnentVstStatus>{};
        statusCancelled.status = "XB";
        statusCancelled.jobStatusCategory = "X";

        let statusCancelled2 = <IActivityCmpnentVstStatus>{};
        statusCancelled2.status = "XC";
        statusCancelled2.jobStatusCategory = "X";

        let statusArray: IActivityCmpnentVstStatus[] = [];
        statusArray.push(statusDone);
        statusArray.push(statusComplete);
        statusArray.push(statusCompleteCancelled);
        statusArray.push(statusIncomplete);
        statusArray.push(statusNoAccess);
        statusArray.push(statusNotVisited);
        statusArray.push(statusCancelled);
        statusArray.push(statusCancelled2);
        statusArray.push(statusFurtherVisitRequired);

        mockCatalogService.getActivityComponentVisitStatuses = sandbox.stub().resolves(statusArray);

        const discount = <IDiscount>{};

        discount.discountCode = "fakeTenPercent";
        discount.discountValue = 10;
        discount.discountCategory = "P";
        discount.discountEndDate = "";

        mockCatalogService.getDiscounts = sandbox.stub().resolves([discount]);

        getBusinessRuleStub = queryableRuleGroup.getBusinessRule = sandbox.stub();

        getBusinessRuleStub.withArgs("chargeRulesDateFormat").returns("YYYY-MM-DD");

        getBusinessRuleStub.withArgs("partsCurrencyUnit").returns(0.01);
        getBusinessRuleStub.withArgs("tieredLabourChargeCurrencyUnit").returns(0.01);
        getBusinessRuleStub.withArgs("fixedPriceQuotationCurrencyUnit").returns(0.01);
        getBusinessRuleStub.withArgs("fixedLabourChargeCurrencyUnit").returns(1);

        getBusinessRuleStub.withArgs("discountFixedCode").returns("F");
        getBusinessRuleStub.withArgs("discountPercentageCode").returns("P");
        getBusinessRuleStub.withArgs("noDiscountCode").returns("NODISCOUNT");

        getBusinessRuleStub.withArgs("fmtDiscountEffective").returns("YYYY-MM-DD");
        getBusinessRuleStub.withArgs("fmtDiscountExpiration").returns("YYYY-MM-DD");
        getBusinessRuleStub.withArgs("chargeMethodCodeLength").returns(3);
        getBusinessRuleStub.withArgs("vanStockPartOrderStatus").returns("V");
        getBusinessRuleStub.withArgs("notUsedStatusCode").returns("NU");

        let getBusinessRuleListStub = queryableRuleGroup.getBusinessRuleList = sandbox.stub();
        getBusinessRuleListStub.withArgs("incompleteVisitStatus").returns(["IF", "IA", "IZ", "QP", "IH", "IP", "WA", "PD"]);
        getBusinessRuleListStub.withArgs("chargeStatusCatCodes").returns(["D", "C", "I"]);
        getBusinessRuleListStub.withArgs("zeroChargeStatusCatCodes").returns(["IC", "N", "V"]);
        getBusinessRuleListStub.withArgs("visitStatuses").returns(["C", "IA", "IF", "IP", "WA", "IH"]);
        getBusinessRuleListStub.withArgs("excludePartStatusPrevious").returns(["AP", "NU"]);
        getBusinessRuleListStub.withArgs("excludeChargeStatusCatCode").returns(["X"]);

        mockBusinessRuleService.getQueryableRuleGroup = sandbox.stub().resolves(queryableRuleGroup);

        let partsToday: PartsToday = new PartsToday();
        partsToday.parts = [];

        mockPartService.getTodaysParts = sandbox.stub().resolves(partsToday);
        mockPartService.getPartsBasket = sandbox.stub().resolves(null);

        eaStub.subscribe = sandbox.stub();

        mockStorageService.getUserRegion = sandbox.stub().resolves("1");

        mockCatalogService.getPrimeChargeIntervals = sandbox.stub().resolves([]);
        mockCatalogService.getSubsequentChargeIntervals = sandbox.stub().resolves([]);

        chargeCatalogHelper = new ChargeCatalogHelperService(mockCatalogService, mockStorageService);
        chargePartsHelperService = new ChargePartsHelperService(mockPartService);
        chargeLabourHelperService = new ChargeLabourHelperService(mockCatalogService);

        chargeService = new ChargeService(mockJobService, mockCatalogService,
            mockBusinessRuleService, eaStub, chargeCatalogHelper, chargePartsHelperService, chargeLabourHelperService);
    });

    afterEach(() => {
        sandbox.restore();
        jasmine.clock().uninstall();
    });

    it("can be created", () => {
        expect(chargeService).toBeDefined();
    });

    // want to make sure that calling chargeService.applyCharges with a jobId, updates and calculates correct totals
    describe("calculates totals and set charges for given job", () => {

        const chargeTypeCode = "SLO1S";
        let task = createTask("1", chargeTypeCode, "AS", "SLC", "17:00", "17:30", 30);
        let chargeRule = createJcChargeRule("1", "AS", "SLC", "SLO", "1S", "2007-09-24", END_DATE, null, "Y", 100, 100);
        chargeRule.chargeRuleSequence = 1;

        beforeEach(() => {
            let chargeType = createChargeType(chargeTypeCode, "STD LAB ONLY-1S", "D", "Y", "N");

            jobChargeRules.push(chargeRule);

            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);
            mockCatalogService.getChargeType = sandbox.stub().resolves(chargeType);
            mockCatalogService.getJCChargeRules = sandbox.stub().resolves(jobChargeRules);

            const discount = <IDiscount>{};
            discount.discountCode = "fakeTenPercent";
            discount.discountValue = 10;
            discount.discountCategory = "P";
            discount.discountEndDate = "";

            mockCatalogService.getDiscounts = sandbox.stub().resolves([discount]);

            let acr1 = createAreaChargeRule("AS", "SLC", "1S", "2016-11-01", END_DATE, "1", chargeRule.chargeRuleSequence);
            areaChargeRules.push(acr1);
        });

        it("should return totals when calling applyCharges", async done => {

            job.tasks.push(task);
            mockJobService.getJob = sandbox.stub().resolves(job);

            const model = await chargeService.applyCharges(job.id);

            expect(model).toBeDefined();
            expect(model.chargeTotal.toNumber()).toEqual(120);
            expect(model.grossTotal.toNumber()).toEqual(120);
            expect(model.netTotal.toNumber()).toEqual(100);
            expect(model.totalVatAmount.toNumber()).toEqual(20);
            expect(model.discountAmount.toNumber()).toEqual(0);
            done();
        });

        it("should return totals and apply discount when calling applyCharges", async done => {

            task.discountCode = "fakeTenPercent";
            task.id = "1";
            job.tasks.push(task);

            // discount applied before
            job.charge = new Charge();
            job.charge.tasks = [];
            let ct = new ChargeableTask();

            ct.discountCode = task.discountCode;
            ct.task = task;
            job.charge.tasks.push(ct);

            mockJobService.getJob = sandbox.stub().resolves(job);

            const model = await chargeService.applyCharges("3344");
            expect(model).toBeDefined();
            expect(model.tasks[0].netTotal.toNumber()).toEqual(90); // expect discount to be applied on net total (100 -10)
            expect(model.chargeTotal.toNumber()).toEqual(108);
            expect(model.grossTotal.toNumber()).toEqual(108);
            expect(model.netTotal.toNumber()).toEqual(90);
            expect(model.totalVatAmount.toNumber()).toEqual(18); // vat to be applied post discount (20% of 90)
            expect(model.discountAmount.toNumber()).toEqual(10); // discount on net amount
            done();
        });
    });

    describe("error handling", () => {

        const chargeTypeCode = "SLO1S";

        beforeEach(() => {

            let task = createTask("1", chargeTypeCode, "XB", "CHB", "17:00", "17:30", 30);

            job.tasks.push(task);
            mockJobService.getJob = sandbox.stub().resolves(job);

            let item = createJcChargeRule("1", "XB", "CHB", "SLO", "1S", "2007-09-24", END_DATE, "5N", "Y", 112.34, 112.34, 0);
            let item2 = createJcChargeRule("2", "XB", "CHB", "SLO", "1S", "2007-09-24", END_DATE, "5N", "Y", 112.34, 112.34, 1);

            jobChargeRules.push(item);
            jobChargeRules.push(item2);

        });

        it("should set error property on task if no job charge type received from catalog table", async done => {
            // arrange

            mockCatalogService.getChargeType = sandbox.stub().resolves(null);
            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);
            mockCatalogService.getJCChargeRules = sandbox.stub().resolves(jobChargeRules);

            // act
            const chargeableMain = await chargeService.applyCharges("1");
            const chargeableTasks = chargeableMain.tasks;

            // assert
            expect(chargeableTasks).toBeDefined();
            expect(chargeableTasks[0].error).toEqual(true);
            expect(chargeableTasks[0].errorDescription).toEqual("charge type SLO1S not found in catalog data");
            done();
        });

        it("should set error property on task if no job charge rules from catalog table", async done => {
            // arrange

            let chargeType = createChargeType(chargeTypeCode, "STD LAB ONLY-1S", "D", "Y", "N");
            mockCatalogService.getChargeType = sandbox.stub().resolves(chargeType);
            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);
            mockCatalogService.getJCChargeRules = sandbox.stub().resolves([]);

            // act
            const chargeableMain = await chargeService.applyCharges("1");

            const chargeableTasks = chargeableMain.tasks;

            // assert
            expect(chargeableTasks).toBeDefined();
            expect(chargeableTasks[0].error).toEqual(true);
            expect(chargeableTasks[0].errorDescription).toEqual("job code charge rules not found in catalog data");

            done();
        });

        it("should set error property on task if no job area rules from catalog table", async done => {
            // arrange

            let chargeType = createChargeType(chargeTypeCode, "STD LAB ONLY-1S", "D", "Y", "N");
            mockCatalogService.getChargeType = sandbox.stub().resolves(chargeType);
            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves([]);
            mockCatalogService.getJCChargeRules = sandbox.stub().resolves(jobChargeRules);

            // act
            const chargeableMain = await chargeService.applyCharges("1");

            const chargeableTasks = chargeableMain.tasks;

            // assert
            expect(chargeableTasks).toBeDefined();
            expect(chargeableTasks[0].error).toEqual(true);
            expect(chargeableTasks[0].errorDescription).toEqual("job code charge rules not found in catalog data");

            done();
        });

        it("should set error property on task if no job standard labour prime charge found", async done => {
            // arrange

            let chargeType = createChargeType(chargeTypeCode, "STD LAB ONLY-1S", "D", "Y", "N");
            mockCatalogService.getChargeType = sandbox.stub().resolves(chargeType);

            let item = createJcChargeRule("2", "XB", "CHB", "SLO", "1S", "2007-09-24", END_DATE, "", "Y", null, 112.34, 1);

            let acr1 = createAreaChargeRule("XB", "CHB", "1S", "2016-11-01", END_DATE, "1", item.chargeRuleSequence);
            areaChargeRules.push(acr1);

            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

            mockCatalogService.getJCChargeRules = sandbox.stub().resolves([item]);

            // act
            const chargeableMain = await chargeService.applyCharges("1");

            const chargeableTasks = chargeableMain.tasks;

            // assert
            expect(chargeableTasks).toBeDefined();
            expect(chargeableTasks[0].labourItem.chargePair.noPrimeChargesFound).toEqual(true);
            expect(chargeableTasks[0].error).toEqual(true);
            expect(chargeableTasks[0].errorDescription).toEqual("no prime charge found for standard labour");

            done();
        });

        it("should set error property on task if labour charge rule code not found", async done => {
            // arrange

            const areaChargeRulesA: IAreaChargeRules [] = [];

            let acr1 = createAreaChargeRule("XB", "CHB", "1S", "2016-11-16", END_DATE, "1", 1);
            let acr2 = createAreaChargeRule("XB", "CHB", "1S", "2016-11-16", END_DATE, "2", 2);

            areaChargeRulesA.push(acr1);
            areaChargeRulesA.push(acr2);

            mockCatalogService.getChargeType = sandbox.stub().resolves(chargeTypeCode);
            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRulesA);
            mockCatalogService.getJCChargeRules = sandbox.stub().resolves(jobChargeRules);
            mockCatalogService.getLabourChargeRule = sandbox.stub().resolves(null);

            // act
            const chargeableMain = await chargeService.applyCharges("1");

            const chargeableTasks = chargeableMain.tasks;

            // assert
            expect(chargeableTasks).toBeDefined();
            expect(chargeableTasks[0].error).toEqual(true);
            expect(chargeableTasks[0].errorDescription).toEqual("labour charge rule 5N not found in catalogData");

            done();

        });

        describe("parts basket errors", () => {

            const chargeTypeCode = "CPO3SN1";
            let task: Task;
            let parts: Part[] = [];
            let partsToday: PartsToday = new PartsToday();

            beforeEach(() => {

                let chargeType = createChargeType(chargeTypeCode, "CHG PARTS ONLY-3SN1", "D", "N", "Y");

                let item = createJcChargeRule("1", "FV", "BBC", "CPO", "3NS1", "2013-01-21", END_DATE, "", "N");
                jobChargeRules.push(item);

                mockCatalogService.getChargeType = sandbox.stub().resolves(chargeType);
                mockCatalogService.getJCChargeRules = sandbox.stub().resolves(jobChargeRules);

                task = createTask("1", chargeTypeCode, "FV", "BBC", "01/10/2099 17:00", "01/10/2099 18:21", 121);

                job.tasks = [task];
                mockJobService.getJob = sandbox.stub().resolves(job);
            });

            it("should log error on chargeableTask when getTodaysParts fails", async done => {
                partsToday.parts = parts;

                mockPartService.getTodaysParts = sandbox.stub().rejects({});
                mockPartService.getPartsBasket = sandbox.stub().resolves(null);

                // act
                const chargeableMain = await chargeService.applyCharges("1");

                const chargeableTasks = chargeableMain.tasks;

                // assert
                expect(chargeableTasks[0].error).toEqual(true);
                expect(chargeableTasks[0].errorDescription).toEqual("failed to calculate charges");

                done();
            });

            it("should log error on chargeableTask when getPartsBasket fails", async done => {
                partsToday.parts = parts;

                mockPartService.getTodaysParts = sandbox.stub().resolves(partsToday);
                mockPartService.getPartsBasket = sandbox.stub().rejects({});

                // act
                const chargeableMain = await chargeService.applyCharges("1");

                const chargeableTasks = chargeableMain.tasks;

                // assert
                expect(chargeableTasks[0].error).toEqual(true);
                expect(chargeableTasks[0].errorDescription).toEqual("failed to calculate charges");

                done();
            });

        });

// two tasks in this job, both tiered, one is prime and one is subsequent
        describe("prime and subsequent charge errors for tiered pricing tasks", () => {

            let task1: Task;
            let task2: Task;

            beforeEach(() => {
                const chargeTypeCode = "SLONONE";

                task1 = createTask("1", chargeTypeCode, "XL", "CHB", "01/10/2099 17:00", "01/10/2099 17:30", 30);
                task2 = createTask("2", chargeTypeCode, "XL", "BBC", "01/10/2099 17:00", "01/10/2099 17:30", 30);

                const activity = createTaskActivity("2016-10-18", "IP", 0);
                task1.activities.push(activity);

                const chargeType = createChargeType(chargeTypeCode, "STD LAB ONLY-NONE", "D", "Y", "N");

                let item1 = createJcChargeRule("1", "XL", "CHB", "SLO", "NONE", "2012-11-15", END_DATE, "4L", "N", null, null);
                let item2 = createJcChargeRule("1", "XL", "BBC", "SLO", "NONE", "2012-11-15", END_DATE, "4L", "N", null, null);

                item1.chargeRuleSequence = 12345;
                item2.chargeRuleSequence = 56768;

                const labourChargeRuleCode = createLabourChargeRuleCode("4L", 7417, 30, 7417, 30);

                primeChargeIntervals = [];
                subsequentChargeIntervals = [];

                const acr1 = createAreaChargeRule("XL", "CHB", "NONE", "2016-11-01", END_DATE, "1", item1.chargeRuleSequence);
                const acr2 = createAreaChargeRule("XL", "BBC", "NONE", "2016-11-01", END_DATE, "1", item2.chargeRuleSequence);

                mockCatalogService.getAreaChargeRules = sandbox.stub()
                    .withArgs("XL","1").resolves([acr1,acr2]);

                mockCatalogService.getChargeType = sandbox.stub().resolves(chargeType);

                let getJCChargeRulesStub = mockCatalogService.getJCChargeRules = sandbox.stub();
                getJCChargeRulesStub
                    .withArgs("XL", "CHB").resolves([item1])
                    .withArgs("XL", "BBC").resolves([item2]);

                mockCatalogService.getJCChargeRules = getJCChargeRulesStub;

                mockCatalogService.getLabourChargeRule = sandbox.stub().resolves(labourChargeRuleCode);
                mockCatalogService.getSubsequentChargeIntervals = sandbox.stub().resolves(subsequentChargeIntervals);
            });

            // in this scenario the first task we can get the prime charge, the second task we cannot get the sub charge
            it("should set error property to true if subsequent charge interval not found", async done => {

                let pci1 = createPrimeChargeInterval("1", "4L", 1, 90, 90, 12499);
                let pci2 = createPrimeChargeInterval("1", "4L", 2, 1, 1, 18334);
                let pci3 = createPrimeChargeInterval("1", "4L", 3, 99, 9999, 0);

                primeChargeIntervals.push(pci1);
                primeChargeIntervals.push(pci2);
                primeChargeIntervals.push(pci3);

                mockCatalogService.getPrimeChargeIntervals = sandbox.stub().resolves(primeChargeIntervals);

                job.tasks = [task1, task2];

                mockJobService.getJob = sandbox.stub().resolves(job);

                // act
                const chargeableMain = await chargeService.applyCharges("1");

                const chargeableTasks = chargeableMain.tasks;

                // assert

                expect(chargeableTasks[0].labourItem.chargePair.primeCharge.toNumber()).toEqual(74.17);
                expect(chargeableTasks[0].labourItem.chargePair.subsequentCharge.toNumber()).toEqual(0);
                expect(chargeableTasks[0].labourItem.chargePair.noSubsequentChargesFound).toBe(true);

                expect(chargeableTasks[1].labourItem.chargePair.primeCharge.toNumber()).toEqual(74.17);
                expect(chargeableTasks[1].labourItem.chargePair.subsequentCharge.toNumber()).toEqual(0);
                expect(chargeableTasks[1].labourItem.chargePair.noSubsequentChargesFound).toBe(true);

                expect(chargeableTasks[1].error).toBe(true);
                done();
            });

            // in this scenario the first task we cannot get the prime charge
            it("should set error property to true if prime charge interval not found", async done => {

                job.tasks = [];
                job.tasks.push(task1);

                mockJobService.getJob = sandbox.stub().resolves(job);

                mockCatalogService.getPrimeChargeIntervals = sandbox.stub().resolves(primeChargeIntervals);

                // act
                const chargeableMain = await chargeService.applyCharges("1");

                const chargeableTasks = chargeableMain.tasks;

                // assert

                expect(chargeableTasks[0].labourItem.chargePair.primeCharge.toNumber()).toEqual(0);
                expect(chargeableTasks[0].labourItem.chargePair.subsequentCharge.toNumber()).toEqual(0);
                expect(chargeableTasks[0].labourItem.chargePair.noPrimeChargesFound).toBe(true);

                expect(chargeableTasks[0].error).toBe(true);
                done();
            });

            // in this scenario, we may have missing subsequent charges, but because there are two prime jobs
            // with valid prime charge intervals we can carry on, only if a subsequent charge was required, and at
            // that, missing subsequent charges, should we report an error
            it("should set error property to false if no subsequent charge, but ok becuase two prime jobs", async done => {

                let item1 = createJcChargeRule("1", "XL", "CHB", "SLO", "NONE", "2012-11-15", END_DATE, "4L", "Y", null, null);
                let item2 = createJcChargeRule("1", "XL", "BBC", "SLO", "NONE", "2012-11-15", END_DATE, "4L", "Y", null, null);
                item1.chargeRuleSequence = 12345;
                item2.chargeRuleSequence = 56768;

                let getJCChargeRulesStub = mockCatalogService.getJCChargeRules = sandbox.stub();
                getJCChargeRulesStub
                    .withArgs("XL", "CHB").resolves([item1])
                    .withArgs("XL", "BBC").resolves([item2]);

                let pci1 = createPrimeChargeInterval("1", "4L", 1, 90, 90, 12499);
                let pci2 = createPrimeChargeInterval("1", "4L", 2, 1, 1, 18334);
                let pci3 = createPrimeChargeInterval("1", "4L", 3, 99, 9999, 0);

                primeChargeIntervals.push(pci1);
                primeChargeIntervals.push(pci2);
                primeChargeIntervals.push(pci3);

                mockCatalogService.getPrimeChargeIntervals = sandbox.stub().resolves(primeChargeIntervals);

                job.tasks = [];
                job.tasks.push(task1);
                job.tasks.push(task2);

                mockJobService.getJob = sandbox.stub().resolves(job);

                // act
                const chargeableMain = await chargeService.applyCharges("1");

                const chargeableTasks = chargeableMain.tasks;

                // assert

                expect(chargeableTasks[0].labourItem.chargePair.primeCharge.toNumber()).toEqual(74.17);
                expect(chargeableTasks[0].labourItem.chargePair.subsequentCharge.toNumber()).toEqual(0);
                expect(chargeableTasks[0].labourItem.chargePair.noSubsequentChargesFound).toBe(true);

                expect(chargeableTasks[1].labourItem.chargePair.primeCharge.toNumber()).toEqual(74.17);
                expect(chargeableTasks[1].labourItem.chargePair.subsequentCharge.toNumber()).toEqual(0);
                expect(chargeableTasks[1].labourItem.chargePair.noSubsequentChargesFound).toBe(true);

                expect(chargeableTasks[1].error).toBe(false);
                done();
            });
        });


        // two tasks in this job, standard labour charges, one is prime and one is subsequent
        describe("prime and subsequent charge errors for fixed pricing tasks", () => {

            let task1: Task;
            let task2: Task;

            beforeEach(() => {
                const chargeTypeCode = "SLONONE";

                task1 = createTask("1", chargeTypeCode, "XL", "CHB", "01/10/2099 17:00", "01/10/2099 17:30", 30);
                task2 = createTask("2", chargeTypeCode, "XL", "BBC", "01/10/2099 17:00", "01/10/2099 17:30", 30);

                const activity = createTaskActivity("2016-10-18", "IP", 0);
                task1.activities.push(activity);

                const chargeType = createChargeType(chargeTypeCode, "STD LAB ONLY-NONE", "D", "Y", "N");

                const item1 = createJcChargeRule("1", "XL", "CHB", "SLO", "NONE", "2012-1-15", END_DATE, "", "Y", null, 10, 1);
                const item2 = createJcChargeRule("2", "XL", "BBC", "SLO", "NONE", "2012-11-15", END_DATE, "", "N", 10, null, 2);
                item1.chargeRuleSequence = 12345;
                item2.chargeRuleSequence = 56789;

                mockCatalogService.getChargeType = sandbox.stub().resolves(chargeType);

                let getJCChargeRulesStub = mockCatalogService.getJCChargeRules = sandbox.stub();
                getJCChargeRulesStub
                    .withArgs("XL", "CHB").resolves([item1])
                    .withArgs("XL", "BBC").resolves([item2]);

                let acr1 = createAreaChargeRule("XL", "CHB", "NONE", "2016-11-01", END_DATE, "1", item1.chargeRuleSequence);
                let acr2 = createAreaChargeRule("XL", "BBC", "NONE", "2016-11-01", END_DATE, "1", item2.chargeRuleSequence);
                areaChargeRules.push(acr1);
                areaChargeRules.push(acr2);

                mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);
            });

            // in this scenario two tasks where we cannot get the prime charge for first, and sub for second
            it("should set error property to true if prime charge not found", async done => {

                job.tasks = [];
                job.tasks.push(task1);
                job.tasks.push(task2);

                mockJobService.getJob = sandbox.stub().resolves(job);

                // act
                const chargeableMain = await chargeService.applyCharges("1");

                const chargeableTasks = chargeableMain.tasks;

                // assert

                expect(chargeableTasks[0].labourItem.chargePair.primeCharge.toNumber()).toEqual(0);
                expect(chargeableTasks[0].labourItem.chargePair.subsequentCharge.toNumber()).toEqual(10);
                expect(chargeableTasks[0].labourItem.chargePair.noPrimeChargesFound).toBe(true);
                expect(chargeableTasks[0].error).toBe(true);

                expect(chargeableTasks[1].labourItem.chargePair.primeCharge.toNumber()).toEqual(10);
                expect(chargeableTasks[1].labourItem.chargePair.subsequentCharge.toNumber()).toEqual(0);
                expect(chargeableTasks[1].labourItem.chargePair.noSubsequentChargesFound).toBe(true);
                expect(chargeableTasks[1].error).toBe(true);

                done();
            });

            // in this scenario there is only one task, with a missing sub charge, but since it is only one it will use prime
            it("should set error property to false if no sub charge, but uses prime charge since only task", async done => {

                job.tasks = [];
                job.tasks.push(task2);

                mockJobService.getJob = sandbox.stub().resolves(job);

                // act
                const chargeableMain = await chargeService.applyCharges("1");

                const chargeableTasks = chargeableMain.tasks;

                // assert

                expect(chargeableTasks[0].error).toBe(false);

                done();
            });
        });

        // two tasks in this job, one task is prime, second is sub prime, complete seco
        describe("prime and subsequent charge errors for fixed pricing tasks", () => {

            let task1: Task;
            let task2: Task;

            beforeEach(() => {
                const chargeTypeCode = "SLONONE";

                task1 = createTask("1", chargeTypeCode, "XL", "CHB", "01/10/2099 17:00", "01/10/2099 17:30", 30);
                task2 = createTask("2", chargeTypeCode, "XL", "BBC", "01/10/2099 17:00", "01/10/2099 17:30", 30);

                const activity = createTaskActivity("2016-10-18", "IP", 0);
                task1.activities.push(activity);

                const chargeType = createChargeType(chargeTypeCode, "STD LAB ONLY-NONE", "D", "Y", "N");
                mockCatalogService.getChargeType = sandbox.stub().resolves(chargeType);

                let item1 = createJcChargeRule("1", "XL", "CHB", "SLO", "NONE", "2012-1-15", END_DATE, "", "Y", null, 10, 1);
                let item2 = createJcChargeRule("2", "XL", "BBC", "SLO", "NONE", "2012-11-15", END_DATE, "", "N", 10, null, 2);
                item1.chargeRuleSequence = 12345;
                item2.chargeRuleSequence = 56789;

                let getJCChargeRulesStub = mockCatalogService.getJCChargeRules = sandbox.stub();
                getJCChargeRulesStub
                    .withArgs("XL", "CHB").resolves([item1])
                    .withArgs("XL", "BBC").resolves([item2]);

                let acr1 = createAreaChargeRule("XL", "CHB", "NONE", "2016-11-01", END_DATE, "1", item1.chargeRuleSequence);
                let acr2 = createAreaChargeRule("XL", "BBC", "NONE", "2016-11-01", END_DATE, "1", item2.chargeRuleSequence);

                areaChargeRules.push(acr1);
                areaChargeRules.push(acr2);

                mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);
            });

            // in this scenario two tasks where we cannot get the prime charge for first, and sub for second
            it("should set error property to true if prime charge not found", async done => {

                job.tasks = [];
                job.tasks.push(task1);
                job.tasks.push(task2);

                mockJobService.getJob = sandbox.stub().resolves(job);

                // act
                const chargeableMain = await chargeService.applyCharges("1");

                const chargeableTasks = chargeableMain.tasks;

                // assert

                expect(chargeableTasks[0].labourItem.chargePair.primeCharge.toNumber()).toEqual(0);
                expect(chargeableTasks[0].labourItem.chargePair.subsequentCharge.toNumber()).toEqual(10);
                expect(chargeableTasks[0].labourItem.chargePair.noPrimeChargesFound).toBe(true);
                expect(chargeableTasks[0].error).toBe(true);

                expect(chargeableTasks[1].labourItem.chargePair.primeCharge.toNumber()).toEqual(10);
                expect(chargeableTasks[1].labourItem.chargePair.subsequentCharge.toNumber()).toEqual(0);
                expect(chargeableTasks[1].labourItem.chargePair.noSubsequentChargesFound).toBe(true);
                expect(chargeableTasks[1].error).toBe(true);

                done();
            });

            // in this scenario there is only one task, with a missing sub charge, but since it is only one it will use prime
            it("should set error property to false if no sub charge, but uses prime charge since only task", async done => {

                job.tasks = [];
                job.tasks.push(task2);

                mockJobService.getJob = sandbox.stub().resolves(job);

                // act
                const chargeableMain = await chargeService.applyCharges("1");

                const chargeableTasks = chargeableMain.tasks;

                // assert

                expect(chargeableTasks[0].error).toBe(false);

                done();
            });
        });

    });

    describe("labour charge integration tests", () => {

        describe("fixed labour prime charge", () => {

            it("should set parts charge to 0", async done => {

                // act
                const chargeableMain = await chargeService.applyCharges("1");

                const chargeableTasks = chargeableMain.tasks;

                // assert
                expect(chargeableTasks[0].partItems[0].netAmount.toNumber()).toEqual(0);
                done();
            });
        });


        describe("tiered charging", () => {

            describe("multi tiered labour charge", () => {

                beforeEach(() => {

                    const chargeTypeCode = "SLONONE";

                    let task = createTask("1", chargeTypeCode, "ER", "EWR", "01/10/2099 17:00", "01/10/2099 17:30", 30);
                    let activity = createTaskActivity("2016-10-18", "IP", 46);
                    task.activities.push(activity);

                    job.tasks.push(task);
                    mockJobService.getJob = sandbox.stub().resolves(job);

                    let chargeType = createChargeType(chargeTypeCode, "STD LAB ONLY-NONE", "D", "Y", "N");

                    let item = createJcChargeRule("3632", "ER", "EWR", "SLO", "NONE", "2012-11-15", END_DATE, "3N", "Y");
                    jobChargeRules.push(item);

                    let labourChargeRuleCode = createLabourChargeRuleCode("3N", 2044, 30, 2044, 30);

                    let pci1 = createPrimeChargeInterval("42", "3N", 1, 15, 30, 458);
                    let pci2 = createPrimeChargeInterval("43", "3N", 2, 15, 9999, 740);

                    primeChargeIntervals.push(pci1);
                    primeChargeIntervals.push(pci2);

                    mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);
                    mockCatalogService.getChargeType = sandbox.stub().resolves(chargeType);
                    mockCatalogService.getJCChargeRules = sandbox.stub().resolves(jobChargeRules);
                    mockCatalogService.getPrimeChargeIntervals = sandbox.stub().resolves(primeChargeIntervals);
                    mockCatalogService.getSubsequentChargeIntervals = sandbox.stub().resolves(subsequentChargeIntervals);

                    mockCatalogService.getLabourChargeRule = sandbox.stub().resolves(labourChargeRuleCode);
                });

                it("should handle empty task start time, and return 0 zero charge", async done => {

                    job.tasks[0].startTime = undefined;

                    mockJobService.getJob = sandbox.stub().resolves(job);

                    // act
                    const chargeableMain = await chargeService.applyCharges("1");

                    const chargeableTasks = chargeableMain.tasks;

                    // assert

                    expect(chargeableTasks).toBeDefined();
                    expect(chargeableTasks.length).toEqual(1);
                    expect(chargeableTasks[0].labourItem.netAmount.toNumber()).toEqual(0);
                    done();
                });

            });

            // simulate minimum charge job, where there exists a two charges rules for an appliance and charge type code,
            // which rule to choose should be determined by the location
            // mock a london and non london region
            // should choose the correct charge rule code
            describe("multi tiered labour charge, with charges in different locations, i.e. area codes", () => {

                beforeEach(() => {

                    const chargeTypeCode = "SLONONE";
                    const cr5N = "5N";
                    const cr5L = "5L";

                    let task = createTask("1", chargeTypeCode, "XB", "CHB", "17:00", "17:10", 10);

                    let activity = createTaskActivity("2016-10-18", "IP", 0);
                    task.activities.push(activity);

                    job.tasks.push(task);
                    mockJobService.getJob = sandbox.stub().resolves(job);

                    let chargeType = createChargeType(chargeTypeCode, "STD LAB ONLY-NONE", "D", "Y", "N");

                    let chargeRule5N = createJcChargeRule("1", "XB", "CHB", "SLO", "NONE", "2012-11-15", END_DATE, cr5N, "Y");
                    let chargeRule5L = createJcChargeRule("2", "XB", "CHB", "SLO", "NONE", "2012-11-15", END_DATE, cr5L, "Y");
                    const chgRuleSeq5N = 45369;
                    const chgRuleSeq5L = 45370; // london charge
                    chargeRule5N.chargeRuleSequence = chgRuleSeq5N;
                    chargeRule5L.chargeRuleSequence = chgRuleSeq5L; // london charge
                    jobChargeRules.push(chargeRule5N);
                    jobChargeRules.push(chargeRule5L);

                    let labourChargeRule5N = createLabourChargeRuleCode(cr5N, 5925, 30, 5925, 30);
                    let labourChargeRule5L = createLabourChargeRuleCode(cr5L, 6675, 30, 6675, 30); // london charge minimum

                    let pc5N1 = createPrimeChargeInterval("42", cr5N, 1, 90, 90, 9000);
                    let pc5N2 = createPrimeChargeInterval("43", cr5N, 2, 1, 1, 15750);
                    let pc5N3 = createPrimeChargeInterval("44", cr5N, 3, 99, 9999, 0);

                    let pc5L1 = createPrimeChargeInterval("45", cr5L, 1, 90, 90, 11250);
                    let pc5L2 = createPrimeChargeInterval("46", cr5L, 2, 1, 1, 16500);
                    let pc5L3 = createPrimeChargeInterval("47", cr5L, 3, 99, 9999, 0);

                    primeChargeIntervals.push(pc5N1);
                    primeChargeIntervals.push(pc5N2);
                    primeChargeIntervals.push(pc5N3);
                    primeChargeIntervals.push(pc5L1);
                    primeChargeIntervals.push(pc5L2);
                    primeChargeIntervals.push(pc5L3);

                    let acr1 = createAreaChargeRule("XB", "CHB", "NONE", "2016-11-01", END_DATE, "1", chgRuleSeq5N);
                    let acr2 = createAreaChargeRule("XB", "CHB", "NONE", "2016-11-01", END_DATE, "2", chgRuleSeq5N);
                    let acr7 = createAreaChargeRule("XB", "CHB", "NONE", "2016-11-01", END_DATE, "7", chgRuleSeq5L); // london region

                    areaChargeRules.push(acr1);
                    areaChargeRules.push(acr2);
                    areaChargeRules.push(acr7);

                    mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);
                    mockCatalogService.getChargeType = sandbox.stub().resolves(chargeType);
                    mockCatalogService.getJCChargeRules = sandbox.stub().resolves(jobChargeRules);
                    mockCatalogService.getPrimeChargeIntervals = sandbox.stub().resolves(primeChargeIntervals);
                    mockCatalogService.getSubsequentChargeIntervals = sandbox.stub().resolves(subsequentChargeIntervals);

                    let getLabourChargeRuleStub = mockCatalogService.getLabourChargeRule = sandbox.stub();

                    getLabourChargeRuleStub.withArgs(cr5N).resolves(labourChargeRule5N)
                        .withArgs(cr5L).resolves(labourChargeRule5L);
                });

                it("should calculate using correct charge rule, where region is London", async done => {

                    mockStorageService.getUserRegion = sandbox.stub().resolves("7");

                    // act
                    const chargeableMain = await chargeService.applyCharges("1");

                    const chargeableTasks = chargeableMain.tasks;

                    // assert

                    expect(chargeableTasks).toBeDefined();
                    expect(chargeableTasks.length).toEqual(1);
                    expect(chargeableTasks[0].labourItem.netAmount.toNumber()).toEqual(66.75); // london charge
                    done();
                });

                it("should calculate using correct charge rule, where region is not London", async done => {

                    mockStorageService.getUserRegion = sandbox.stub().resolves("1");

                    // act
                    const chargeableMain = await chargeService.applyCharges("1");

                    const chargeableTasks = chargeableMain.tasks;

                    // assert

                    expect(chargeableTasks).toBeDefined();
                    expect(chargeableTasks.length).toEqual(1);
                    expect(chargeableTasks[0].labourItem.netAmount.toNumber()).toEqual(59.25);
                    done();
                });
            });

        });
    });

    describe("prime and subsequent charge logic", () => {

        // use HU as example
        let standardLabour1Task = createTask("2", "SLO2SIS", "SD", "CHB", "01/10/2016 17:00", "01/10/2016 17:30", 30);
        let standardLabour2Task = createTask("3", "SLO2SIS", "FF", "CHB", "01/10/2016 17:00", "01/10/2016 17:30", 30);
        let standardLabour3Task = createTask("3", "SLO2SIS", "FG", "CHB", "01/10/2016 17:00", "01/10/2016 17:30", 30);

        let tieredJobTask = createTask("1", "ALP1S", "HU", "CHB", "01/10/2016 17:00", "01/10/2016 20:00", 180);

        beforeEach(() => {

            let chargeType = createChargeType("SLO2SIS", "SOME CHARGE TYPE THAT CHARGE FOR LABOUR", "D", "Y", "N");

            let sl1 = createJcChargeRule("3632", "SD", "CHB", "SLO", "2SIS", "2011-01-04", END_DATE, "", "N", 41.67, 41.66);
            let sl2 = createJcChargeRule("3633", "FF", "CHB", "SLO", "2SIS", "2012-03-22", END_DATE, "", "Y", 82.5, 82.5);
            let sl3 = createJcChargeRule("3633", "FG", "CHB", "SLO", "2SIS", "2012-03-22", END_DATE, "", "Y", 81.5, 80.5);
            let t1 = createJcChargeRule("3634", "HU", "CHB", "ALP", "1S", "2012-01-23", END_DATE, "H2", "N");

            sl1.chargeRuleSequence = 12345;
            sl2.chargeRuleSequence = 56789;
            sl3.chargeRuleSequence = 33333;
            t1.chargeRuleSequence = 44444;

            let labourChargeRuleCode = createLabourChargeRuleCode("H2", 7405, 45, 1447, 15);

            let pci1 = createPrimeChargeInterval("1", "H2", 1, 15, 9999, 1447);
            let sci1 = createSubsqntChargeInterval("1", "H2", 1, 15, 9999, 1447);

            primeChargeIntervals.push(pci1);
            subsequentChargeIntervals.push(sci1);

            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);
            mockCatalogService.getChargeType = sandbox.stub().resolves(chargeType);
            mockCatalogService.getLabourChargeRule = sandbox.stub().resolves(labourChargeRuleCode);

            mockCatalogService.getPrimeChargeIntervals = sandbox.stub().resolves(primeChargeIntervals);
            mockCatalogService.getSubsequentChargeIntervals = sandbox.stub().resolves(subsequentChargeIntervals);

            let getJCChargeRulesStub = mockCatalogService.getJCChargeRules = sandbox.stub();

            getJCChargeRulesStub
                .withArgs("SD", "CHB").resolves([sl1])
                .withArgs("FF", "CHB").resolves([sl2])
                .withArgs("FG", "CHB").resolves([sl3])
                .withArgs("HU", "CHB").resolves([t1]);

            let acr1 = createAreaChargeRule("SD", "CHB", "2SIS", "2016-11-01", END_DATE, "1", sl1.chargeRuleSequence);
            let acr2 = createAreaChargeRule("FF", "CHB", "2SIS", "2016-11-01", END_DATE, "1", sl2.chargeRuleSequence);
            let acr3 = createAreaChargeRule("FG", "CHB", "2SIS", "2016-11-01", END_DATE, "1", sl3.chargeRuleSequence);
            let acr4 = createAreaChargeRule("HU", "CHB", "1S", "2016-11-01", END_DATE, "1", t1.chargeRuleSequence);

            areaChargeRules.push(acr1);
            areaChargeRules.push(acr2);
            areaChargeRules.push(acr3);
            areaChargeRules.push(acr4);

            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);
        });

        /**
         * For each labour item a prime and sub charge should be calculated
         */

        it("should calculate both prime and sub charges", async done => {

            job.tasks.push(standardLabour1Task);
            mockJobService.getJob = sandbox.stub().resolves(job);

            const chargeableMain = await chargeService.applyCharges("2");

            const chargeableTasks = chargeableMain.tasks;

            const chargePair = chargeableTasks[0].labourItem.chargePair;
            // assert
            expect(chargePair.primeCharge.toNumber()).toEqual(41.67);
            expect(chargePair.subsequentCharge.toNumber()).toEqual(41.66);
            done();
        });

        /**
         * If only one task, will mark as prime if it is not already
         */

        it("should use prime charge if only task in job, assign net amount to prime charge", async done => {
            job.tasks.push(standardLabour1Task);

            mockJobService.getJob = sandbox.stub().resolves(job);

            const chargeableMain = await chargeService.applyCharges("2");

            const chargeableTasks = chargeableMain.tasks;
            const chargePair = chargeableTasks[0].labourItem.chargePair;

            expect(chargeableTasks[0].labourItem.netAmount).toEqual(chargePair.primeCharge);
            expect(chargeableTasks[0].isSubsequent).toEqual(false);

            // assert
            done();
        });

        /**
         * In this case you have two tasks, only one task  has prime indicator assigned from the job charge rules
         * the rest of the tasks, irrespective of charge, higher or lower, should use the sub charge rate
         */

        it("should use correct charges if prime already set from charge rules", async done => {

            // arrange

            job.tasks.push(standardLabour1Task);
            job.tasks.push(standardLabour2Task); // this task is set as prime from job charge rule table
            mockJobService.getJob = sandbox.stub().resolves(job);

            const chargeableMain = await chargeService.applyCharges("2");
            const chargeableTasks = chargeableMain.tasks;
            const chargePair0 = chargeableTasks[0].labourItem.chargePair;
            const chargePair1 = chargeableTasks[1].labourItem.chargePair;

            // assert

            expect(chargeableTasks[0].labourItem.netAmount).toEqual(chargePair0.subsequentCharge);
            expect(chargeableTasks[0].isSubsequent).toEqual(true);

            expect(chargeableTasks[1].labourItem.netAmount).toEqual(chargePair1.primeCharge); //should be prime
            expect(chargeableTasks[1].isSubsequent).toEqual(false);

            done();
        });

        /**
         * Given there is a list of chargeable items non of which have prime job indicator set, we should be able to pick through each one assign prime and sub
         * depending on the most expensive item. Set net amount.
         */

        it("should mark most expensive task as prime if none of the tasks has a prime indicator already set", async done => {

            job.tasks.push(standardLabour1Task); // no prime job indicator
            job.tasks.push(tieredJobTask); // no prime job indicator
            mockJobService.getJob = sandbox.stub().resolves(job);

            const chargeableMain = await chargeService.applyCharges("2");
            const chargeableTasks = chargeableMain.tasks;

            const chargePair0 = chargeableTasks[0].labourItem.chargePair;
            const chargePair1 = chargeableTasks[1].labourItem.chargePair;

            expect(chargeableTasks[0].labourItem.netAmount).toEqual(chargePair0.subsequentCharge);
            expect(chargeableTasks[1].labourItem.netAmount).toEqual(chargePair1.primeCharge); // should be most expensive

            done();
        });

        /**
         * In this case, albeit rare, more than one task has a prime job indicator set
         */

        it("should not apply the most expensive prime job rule if more than one prime job", async done => {

            job.tasks.push(standardLabour2Task); // has prime job indicator
            job.tasks.push(standardLabour3Task); // has prime job indicator
            mockJobService.getJob = sandbox.stub().resolves(job);

            const chargeableMain = await chargeService.applyCharges("2");
            const chargeableTasks = chargeableMain.tasks;

            const chargePair0 = chargeableTasks[0].labourItem.chargePair;
            const chargePair1 = chargeableTasks[1].labourItem.chargePair;

            expect(chargeableTasks[0].labourItem.netAmount).toEqual(chargePair0.primeCharge); // should be prime
            expect(chargeableTasks[1].labourItem.netAmount).toEqual(chargePair1.primeCharge); // should be prime

            done();
        });

        it("applies subsequent charge for second task when first task parts only and prime, second task tiered job with labour and parts  and non-prime", async done => {

            let task = createTask("1", "CPO2SM", "IB", "CHB", "15/02/2017 17:00", "01/10/2099 17:30", 30);
            let activity = createTaskActivity("2016-10-18", "IP", 0);
            task.activities.push(activity);

            let task2 = createTask("1", "ALP2SM", "HU", "CHB", "15/02/2017 17:00", "01/10/2099 17:30", 30);
            let activity2 = createTaskActivity("2016-10-18", "IP", 0);
            task2.activities.push(activity2);

            job.tasks.push(task);
            job.tasks.push(task2);

            mockJobService.getJob = sandbox.stub().resolves(job);

            let chargeTypeCPO2SM = createChargeType("CPO2SM", "CHG PARTS ONLY-2SM", "D", "N", "Y");
            let chargeTypeALP2SM = createChargeType("ALP2SM", "ALL LAB & PARTS-2SM", "D", "Y", "Y");

            let chargeRuleIbCHB = createJcChargeRule("399", "IB", "CHB", "CPO", "2SM", "1996-01-01", "2099-12-31", "", "Y"); // PARTS ONLY NON PRIME
            let chargeRuleHuCHB = createJcChargeRule("32533", "HU", "CHB", "ALP", "2SM", "2010-11-08", "2099-12-31", "H3", "N"); //PARTS + LABOUR, TIER CHARGE

            chargeRuleIbCHB.chargeRuleSequence = 12345;
            chargeRuleHuCHB.chargeRuleSequence = 56789;

            let labourChargeRuleCode = createLabourChargeRuleCode("H3", 8256, 30, 1447, 30);

            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

            let getChargeTypeStub = mockCatalogService.getChargeType = sandbox.stub();
            getChargeTypeStub
                .withArgs("CPO2SM").resolves(chargeTypeCPO2SM)
                .withArgs("ALP2SM").resolves(chargeTypeALP2SM);

            let getJCChargeRulesStub = mockCatalogService.getJCChargeRules = sandbox.stub();

            getJCChargeRulesStub
                .withArgs("IB", "CHB").resolves([chargeRuleIbCHB])
                .withArgs("HU", "CHB").resolves([chargeRuleHuCHB]);

            let pci1 = createPrimeChargeInterval("1", "H3", 1, 15, 9999, 1447);
            let sci1 = createSubsqntChargeInterval("1", "H3", 1, 15, 9999, 1447);

            mockCatalogService.getPrimeChargeIntervals = sandbox.stub().resolves([pci1]);
            mockCatalogService.getSubsequentChargeIntervals = sandbox.stub().resolves([sci1]);

            mockCatalogService.getLabourChargeRule = sandbox.stub().resolves(labourChargeRuleCode);

            let acr1 = createAreaChargeRule("IB", "CHB", "2SM", "2016-11-01", END_DATE, "1", chargeRuleIbCHB.chargeRuleSequence);
            let acr2 = createAreaChargeRule("HU", "CHB", "2SM", "2016-11-01", END_DATE, "1", chargeRuleHuCHB.chargeRuleSequence);
            areaChargeRules.push(acr1);
            areaChargeRules.push(acr2);

            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

            // act
            const chargeableMain = await chargeService.applyCharges("1");

            const chargeableTasks = chargeableMain.tasks;

            // assert
            expect(chargeableTasks[1].labourItem.netAmount.toNumber()).toEqual(14.47);
            done();
        });

        it("one prime and one non prime task, the prime task has no sub charge, but should not show error (since using prime charge anyway)", async done => {

            let task = createTask("1", "SLONONE", "XR", "BBF", "15/02/2017 17:00", "01/10/2099 17:30", 30);
            let activity = createTaskActivity("2016-10-18", "IP", 0);
            task.activities.push(activity);

            let task2 = createTask("2", "SLONONE", "EV", "EWR", "15/02/2017 17:00", "01/10/2099 17:30", 30);
            let activity2 = createTaskActivity("2016-10-18", "IP", 0);
            task2.activities.push(activity2);

            job.tasks.push(task);
            job.tasks.push(task2);

            mockJobService.getJob = sandbox.stub().resolves(job);

            let chargeTypeSLONONE = createChargeType("SLONONE", "STD LAB ONLY-NONE", "D", "Y", "N");

            let chargeRuleXrBBF = createJcChargeRule("1", "XR", "BBF", "SLO", "NONE", "1996-01-01", END_DATE, "4L", "Y"); // Tier, Labour, PRIME
            let chargeRuleEvEWR = createJcChargeRule("2", "EV", "EWR", "SLO", "NONE", "2010-11-08", END_DATE, "", "N", 157.5, 157.5); // Standard, Labour, NON-PRIME
            chargeRuleXrBBF.chargeRuleSequence = 12345;
            chargeRuleEvEWR.chargeRuleSequence = 56789;

            let labourChargeRuleCode = createLabourChargeRuleCode("4L", 7417, 30, 7417, 30);

            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

            let getChargeTypeStub = mockCatalogService.getChargeType = sandbox.stub();
            getChargeTypeStub.withArgs("SLONONE").resolves(chargeTypeSLONONE);

            let getJCChargeRulesStub = mockCatalogService.getJCChargeRules = sandbox.stub();

            getJCChargeRulesStub
                .withArgs("XR", "BBF").resolves([chargeRuleXrBBF])
                .withArgs("EV", "EWR").resolves([chargeRuleEvEWR]);

            let pci1 = createPrimeChargeInterval("1", "4L", 1, 15, 9999, 12499);
            let pci2 = createPrimeChargeInterval("2", "4L", 2, 1, 1, 18334);
            let pci3 = createPrimeChargeInterval("3", "4L", 3, 99, 9999, 0);

            mockCatalogService.getPrimeChargeIntervals = sandbox.stub().resolves([pci1, pci2, pci3]);
            mockCatalogService.getSubsequentChargeIntervals = sandbox.stub().resolves([]);
            mockCatalogService.getLabourChargeRule = sandbox.stub().resolves(labourChargeRuleCode);

            let acr1 = createAreaChargeRule("XR", "BBF", "NONE", "2016-11-01", END_DATE, "1", chargeRuleXrBBF.chargeRuleSequence);
            let acr2 = createAreaChargeRule("EV", "EWR", "NONE", "2016-11-01", END_DATE, "1", chargeRuleEvEWR.chargeRuleSequence);
            areaChargeRules.push(acr1);
            areaChargeRules.push(acr2);

            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

            // act
            const chargeableMain = await chargeService.applyCharges("1");

            const chargeableTasks = chargeableMain.tasks;

            // assert
            expect(chargeableTasks[0].error).toBe(false);
            expect(chargeableTasks[1].error).toBe(false);
            done();
        });

        it("return first task as prime when 3 non-chargeable tasks, all non-prime", async done => {

            let task = createTask("1", "NCH3SIS", "AS", "BBF", "15/02/2017 17:00", "01/10/2099 17:30", 30);
            let activity = createTaskActivity("2016-10-18", "IP", 0);
            task.activities.push(activity);

            let task2 = createTask("2", "NCH1S", "AS", "FRE", "15/02/2017 17:00", "01/10/2099 17:30", 30);
            let activity2 = createTaskActivity("2016-10-18", "IP", 0);
            task2.activities.push(activity2);

            let task3 = createTask("3", "NCH2E1L", "IB", "CHB", "15/02/2017 17:00", "01/10/2099 17:30", 30);
            let activity3 = createTaskActivity("2016-10-18", "IP", 0);
            task2.activities.push(activity3);

            job.tasks.push(task);
            job.tasks.push(task2);
            job.tasks.push(task3);

            mockJobService.getJob = sandbox.stub().resolves(job);

            let chargeTypeNCH3SISCPO2SM = createChargeType("NCH3SIS", "XYZ", "D", "Y", "N");
            let chargeTypeNCH1S = createChargeType("NCH1S", "XYZ", "D", "Y", "Y");
            let chargeTypeNCH2E1L = createChargeType("NCH2E1L", "XYZ", "D", "Y", "Y");

            let chargeRuleAsBBF = createJcChargeRule("333", "AS", "BBF", "NCH", "3SIS", "1996-01-01", "2099-12-31", "", "N");
            let chargeRuleAsfRE = createJcChargeRule("444", "AS", "FRE", "NCH", "1S", "2010-11-08", "2099-12-31", "", "N");
            let chargeRuleIbChb = createJcChargeRule("555", "IB", "CHB", "NCH", "2E1L", "2010-11-08", "2099-12-31", "", "N");

            chargeRuleAsBBF.chargeRuleSequence = 11111;
            chargeRuleAsfRE.chargeRuleSequence = 22222;
            chargeRuleIbChb.chargeRuleSequence = 33333;

            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

            let getChargeTypeStub = mockCatalogService.getChargeType = sandbox.stub();
            getChargeTypeStub
                .withArgs("NCH3SIS").resolves(chargeTypeNCH3SISCPO2SM)
                .withArgs("NCH1S").resolves(chargeTypeNCH1S)
                .withArgs("NCH2E1L").resolves(chargeTypeNCH2E1L);

            let getJCChargeRulesStub = mockCatalogService.getJCChargeRules = sandbox.stub();

            getJCChargeRulesStub
                .withArgs("AS", "BBF").resolves([chargeRuleAsBBF])
                .withArgs("AS", "FRE").resolves([chargeRuleAsfRE])
                .withArgs("IB", "CHB").resolves([chargeRuleIbChb]);

            let acr1 = createAreaChargeRule("AS", "BBF", "3SIS", "2016-11-01", END_DATE, "1", chargeRuleAsBBF.chargeRuleSequence);
            let acr2 = createAreaChargeRule("AS", "FRE", "1S", "2016-11-01", END_DATE, "1", chargeRuleAsfRE.chargeRuleSequence);
            let acr3 = createAreaChargeRule("IB", "CHB", "2E1L", "2016-11-01", END_DATE, "1", chargeRuleIbChb.chargeRuleSequence);

            areaChargeRules.push(acr1);
            areaChargeRules.push(acr2);
            areaChargeRules.push(acr3);

            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

            // act
            const chargeableMain = await chargeService.applyCharges("1");

            const chargeableTasks = chargeableMain.tasks;

            // assert
            expect(chargeableTasks[0].isSubsequent).toEqual(false);
            expect(chargeableTasks[1].isSubsequent).toEqual(true);
            expect(chargeableTasks[2].isSubsequent).toEqual(true);

            done();
        });

        it("returns correct prime task if 3 non-chargeable tasks, but one is prime", async done => {

            let task = createTask("1", "NCH3SIS", "AS", "BBF", "15/02/2017 17:00", "01/10/2099 17:30", 30);
            let activity = createTaskActivity("2016-10-18", "IP", 0);
            task.activities.push(activity);

            let task2 = createTask("2", "NCH1S", "AS", "FRE", "15/02/2017 17:00", "01/10/2099 17:30", 30);
            let activity2 = createTaskActivity("2016-10-18", "IP", 0);
            task2.activities.push(activity2);

            let task3 = createTask("3", "NCH2E1L", "IB", "CHB", "15/02/2017 17:00", "01/10/2099 17:30", 30);
            let activity3 = createTaskActivity("2016-10-18", "IP", 0);
            task2.activities.push(activity3);

            job.tasks.push(task);
            job.tasks.push(task2);
            job.tasks.push(task3);

            mockJobService.getJob = sandbox.stub().resolves(job);

            let chargeTypeNCH3SISCPO2SM = createChargeType("NCH3SIS", "XYZ", "D", "Y", "N");
            let chargeTypeNCH1S = createChargeType("NCH1S", "XYZ", "D", "Y", "Y");
            let chargeTypeNCH2E1L = createChargeType("NCH2E1L", "XYZ", "D", "Y", "Y");

            let chargeRuleAsBBF = createJcChargeRule("333", "AS", "BBF", "NCH", "3SIS", "1996-01-01", "2099-12-31", "", "N");
            let chargeRuleAsfRE = createJcChargeRule("444", "AS", "FRE", "NCH", "1S", "2010-11-08", "2099-12-31", "", "Y");
            let chargeRuleIbChb = createJcChargeRule("555", "IB", "CHB", "NCH", "2E1L", "2010-11-08", "2099-12-31", "", "N");

            chargeRuleAsBBF.chargeRuleSequence = 11111;
            chargeRuleAsfRE.chargeRuleSequence = 22222;
            chargeRuleIbChb.chargeRuleSequence = 33333;

            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

            let getChargeTypeStub = mockCatalogService.getChargeType = sandbox.stub();
            getChargeTypeStub
                .withArgs("NCH3SIS").resolves(chargeTypeNCH3SISCPO2SM)
                .withArgs("NCH1S").resolves(chargeTypeNCH1S)
                .withArgs("NCH2E1L").resolves(chargeTypeNCH2E1L);

            let getJCChargeRulesStub = mockCatalogService.getJCChargeRules = sandbox.stub();

            getJCChargeRulesStub
                .withArgs("AS", "BBF").resolves([chargeRuleAsBBF])
                .withArgs("AS", "FRE").resolves([chargeRuleAsfRE])
                .withArgs("IB", "CHB").resolves([chargeRuleIbChb]);

            let acr1 = createAreaChargeRule("AS", "BBF", "3SIS", "2016-11-01", END_DATE, "1", chargeRuleAsBBF.chargeRuleSequence);
            let acr2 = createAreaChargeRule("AS", "FRE", "1S", "2016-11-01", END_DATE, "1", chargeRuleAsfRE.chargeRuleSequence);
            let acr3 = createAreaChargeRule("IB", "CHB", "2E1L", "2016-11-01", END_DATE, "1", chargeRuleIbChb.chargeRuleSequence);

            areaChargeRules.push(acr1);
            areaChargeRules.push(acr2);
            areaChargeRules.push(acr3);

            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

            // act
            const chargeableMain = await chargeService.applyCharges("1");

            const chargeableTasks = chargeableMain.tasks;

            // assert
            expect(chargeableTasks[0].isSubsequent).toEqual(true);
            expect(chargeableTasks[1].isSubsequent).toEqual(false);
            expect(chargeableTasks[2].isSubsequent).toEqual(true);

            done();
        });

        it("returns first task as prime if 3 non-chargeable tasks", async done => {

            let task = createTask("1", "NCH3SIS", "AS", "BBF", "15/02/2017 17:00", "01/10/2099 17:30", 30);
            let activity = createTaskActivity("2016-10-18", "IP", 0);
            task.activities.push(activity);

            let task2 = createTask("2", "NCH1S", "AS", "FRE", "15/02/2017 17:00", "01/10/2099 17:30", 30);
            let activity2 = createTaskActivity("2016-10-18", "IP", 0);
            task2.activities.push(activity2);

            let task3 = createTask("3", "NCH2E1L", "IB", "CHB", "15/02/2017 17:00", "01/10/2099 17:30", 30);
            let activity3 = createTaskActivity("2016-10-18", "IP", 0);
            task2.activities.push(activity3);

            job.tasks.push(task);
            job.tasks.push(task2);
            job.tasks.push(task3);

            mockJobService.getJob = sandbox.stub().resolves(job);

            let chargeTypeNCH3SISCPO2SM = createChargeType("NCH3SIS", "XYZ", "D", "Y", "N");
            let chargeTypeNCH1S = createChargeType("NCH1S", "XYZ", "D", "Y", "Y");
            let chargeTypeNCH2E1L = createChargeType("NCH2E1L", "XYZ", "D", "Y", "Y");

            let chargeRuleAsBBF = createJcChargeRule("333", "AS", "BBF", "NCH", "3SIS", "1996-01-01", "2099-12-31", "", "N");
            let chargeRuleAsfRE = createJcChargeRule("444", "AS", "FRE", "NCH", "1S", "2010-11-08", "2099-12-31", "", "N");
            let chargeRuleIbChb = createJcChargeRule("555", "IB", "CHB", "NCH", "2E1L", "2010-11-08", "2099-12-31", "", "N");
            chargeRuleAsBBF.chargeRuleSequence = 11111;
            chargeRuleAsfRE.chargeRuleSequence = 22222;
            chargeRuleIbChb.chargeRuleSequence = 33333;

            let getChargeTypeStub = mockCatalogService.getChargeType = sandbox.stub();
            getChargeTypeStub
                .withArgs("NCH3SIS").resolves(chargeTypeNCH3SISCPO2SM)
                .withArgs("NCH1S").resolves(chargeTypeNCH1S)
                .withArgs("NCH2E1L").resolves(chargeTypeNCH2E1L);

            let getJCChargeRulesStub = mockCatalogService.getJCChargeRules = sandbox.stub();

            getJCChargeRulesStub
                .withArgs("AS", "BBF").resolves([chargeRuleAsBBF])
                .withArgs("AS", "FRE").resolves([chargeRuleAsfRE])
                .withArgs("IB", "CHB").resolves([chargeRuleIbChb]);

            let acr1 = createAreaChargeRule("AS", "BBF", "3SIS", "2016-11-01", END_DATE, "1", chargeRuleAsBBF.chargeRuleSequence);
            let acr2 = createAreaChargeRule("AS", "FRE", "1S", "2016-11-01", END_DATE, "1", chargeRuleAsfRE.chargeRuleSequence);
            let acr3 = createAreaChargeRule("IB", "CHB", "2E1L", "2016-11-01", END_DATE, "1", chargeRuleIbChb.chargeRuleSequence);

            areaChargeRules.push(acr1);
            areaChargeRules.push(acr2);
            areaChargeRules.push(acr3);

            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

            // act
            const chargeableMain = await chargeService.applyCharges("1");

            const chargeableTasks = chargeableMain.tasks;

            // assert
            expect(chargeableTasks[0].isSubsequent).toEqual(false);
            expect(chargeableTasks[1].isSubsequent).toEqual(true);
            expect(chargeableTasks[2].isSubsequent).toEqual(true);

            done();
        });

        it("sets chargeable task to prime when 1 chargeable and 2 non-chargeable", async done => {

            let task = createTask("1", "NCH2E1I", "AS", "BBF", "15/02/2017 17:00", "01/10/2099 17:30", 30);
            let activity = createTaskActivity("2016-10-18", "IP", 0);
            task.activities.push(activity);

            let task2 = createTask("2", "NCH2E1I", "AS", "FRE", "15/02/2017 17:00", "01/10/2099 17:30", 30);
            let activity2 = createTaskActivity("2016-10-18", "IP", 0);
            task2.activities.push(activity2);

            let task3 = createTask("3", "SLO2EF", "IB", "CHB", "15/02/2017 17:00", "01/10/2099 17:30", 30);
            let activity3 = createTaskActivity("2016-10-18", "IP", 0);
            task3.isCharge = true; //factory would populate this
            task2.activities.push(activity3);

            job.tasks.push(task);
            job.tasks.push(task2);
            job.tasks.push(task3);

            mockJobService.getJob = sandbox.stub().resolves(job);

            let chargeTypeNCH2E1I = createChargeType("NCH2E1I", "XYZ", "D", "N", "N"); // , BE, FFR
            let chargeTypeSLO2EF = createChargeType("SLO2EF", "XYZ", "D", "Y", "N"); // KF, FFR,

            let chargeRuleBeFFR = createJcChargeRule("333", "BE", "FFR", "NCH", "2E1I", "1996-01-01", "2099-12-31", "", "N");
            let chargeRuleBeFRI = createJcChargeRule("444", "BE", "FRI", "NCH", "2E1I", "2010-11-08", "2099-12-31", "", "N");
            let chargeRuleKfFFR = createJcChargeRule("555", "KF", "FFR", "SLO", "2EF", "2010-11-08", "2099-12-31", "", "N");

            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

            let getChargeTypeStub = mockCatalogService.getChargeType = sandbox.stub();
            getChargeTypeStub
                .withArgs("NCH2E1I").resolves(chargeTypeNCH2E1I)
                .withArgs("SLO2EF").resolves(chargeTypeSLO2EF);

            let getJCChargeRulesStub = mockCatalogService.getJCChargeRules = sandbox.stub();

            getJCChargeRulesStub
                .withArgs("BE", "FFR").resolves([chargeRuleBeFFR])
                .withArgs("BE", "FRI").resolves([chargeRuleBeFRI])
                .withArgs("KF", "FFR").resolves([chargeRuleKfFFR]);

            // act
            const chargeableMain = await chargeService.applyCharges("1");

            const chargeableTasks = chargeableMain.tasks;

            // assert

            expect(chargeableTasks[0].isSubsequent).toEqual(true);
            // in the original defect these were not defined
            expect(chargeableTasks[1].isSubsequent).toEqual(true);
            expect(chargeableTasks[2].isSubsequent).toEqual(false); // chargeable task

            done();
        });

        it("retains sub charge status if already prime calculated from completed tasks, second visit", async done => {

            let task = createTask("1", "ALP3SIS", "HU", "CHB", "15/02/2017 17:00", "01/10/2099 17:30", 30);
            task.status = "D";
            let activity = createTaskActivity("2016-10-18", "D", 0);
            task.isCharge = true; //factory would populate this
            task.activities.push(activity);
            task.isMiddlewareDoTodayTask = true;

            let task2 = createTask("2", "NCH1S", "AS", "FRE", "15/02/2017 17:00", "01/10/2099 17:30", 30);
            task2.status = "C";
            let activity2 = createTaskActivity("2016-10-18", "C", 5);
            task2.isCharge = false; //factory would populate this
            task2.isMiddlewareDoTodayTask = false;
            task2.activities.push(activity2);

            let task3 = createTask("3", "SLO2API", "SD", "HOB", "15/02/2017 17:00", "01/10/2099 17:30", 30);
            task3.status = "C";
            let activity3 = createTaskActivity("2016-10-18", "C", 5);
            task3.isCharge = true; //factory would populate this
            task3.activities.push(activity3);
            task3.isMiddlewareDoTodayTask = false;

            job.tasks.push(task);
            job.tasksNotToday = [task2, task3];
            mockJobService.getJob = sandbox.stub().resolves(job);

            let chargeTypeALP3SIS = createChargeType("ALP3SIS", "XYZ", "D", "Y", "Y"); // , BE, FFR
            let chargeTypeNCH1S = createChargeType("NCH1S", "XYZ", "D", "N", "N"); // KF, FFR,
            let chargeTypeSLO2API = createChargeType("SLO2API", "XYZ", "D", "Y", "N"); // KF, FFR,

            let chargeRuleHuChb = createJcChargeRule("333", "HU", "CHB", "ALP", "3SIS", "1996-01-01", "2099-12-31", "H3", "N");
            let chargeRuleAsFre = createJcChargeRule("444", "AS", "FRE", "NCH", "1S", "2010-11-08", "2099-12-31", "", "Y");
            let chargeRuleSdHob = createJcChargeRule("555", "SD", "HOB", "SLO", "2API", "2010-11-08", "2099-12-31", "", "N");
            chargeRuleHuChb.chargeRuleSequence = 11111;
            chargeRuleAsFre.chargeRuleSequence = 22222;
            chargeRuleSdHob.chargeRuleSequence = 33333;

            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

            let getChargeTypeStub = mockCatalogService.getChargeType = sandbox.stub();
            getChargeTypeStub
                .withArgs("ALP3SIS").resolves(chargeTypeALP3SIS)
                .withArgs("NCH1S").resolves(chargeTypeNCH1S)
                .withArgs("SLO2API").resolves(chargeTypeSLO2API);

            let getJCChargeRulesStub = mockCatalogService.getJCChargeRules = sandbox.stub();

            getJCChargeRulesStub
                .withArgs("HU", "CHB").resolves([chargeRuleHuChb])
                .withArgs("AS", "FRE").resolves([chargeRuleAsFre])
                .withArgs("SD", "HOB").resolves([chargeRuleSdHob]);

            let labourChargeRuleCode = createLabourChargeRuleCode("H3", 8256, 30, 1447, 30);

            let pci1 = createPrimeChargeInterval("1", "H3", 1, 45, 9999, 8256);
            let sci1 = createSubsqntChargeInterval("1", "H3", 1, 15, 9999, 1447);

            mockCatalogService.getPrimeChargeIntervals = sandbox.stub().resolves([pci1]);
            mockCatalogService.getSubsequentChargeIntervals = sandbox.stub().resolves([sci1]);
            mockCatalogService.getLabourChargeRule = sandbox.stub().resolves(labourChargeRuleCode);

            let acr1 = createAreaChargeRule("HU", "CHB", "3SIS", "2016-11-01", END_DATE, "1", chargeRuleHuChb.chargeRuleSequence);
            let acr2 = createAreaChargeRule("AS", "FRE", "1S", "2016-11-01", END_DATE, "1", chargeRuleAsFre.chargeRuleSequence);
            let acr3 = createAreaChargeRule("SD", "HOB", "2API", "2016-11-01", END_DATE, "1", chargeRuleSdHob.chargeRuleSequence);

            areaChargeRules.push(acr1);
            areaChargeRules.push(acr2);
            areaChargeRules.push(acr3);

            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

            // act
            const chargeableMain = await chargeService.applyCharges("1");
            const chargeableTasks = chargeableMain.tasks;

            // assert

            expect(chargeableTasks.length).toEqual(1);
            expect(chargeableTasks[0].isSubsequent).toBe(true);
            expect(chargeableTasks[0].labourItem.netAmount.toNumber()).toEqual(14.47);
            done();
        });

        // see DF_1761
        // two tasks, where one is set to IF and the other is set to C
        it("set task to prime if other task is set to incomplete status", async done => {

            let task = createTask("1", "ALP2FIS", "HU", "BBF", "15/02/2017 17:00", "01/10/2099 17:30", 0);
            let task2 = createTask("2", "ALP3FI1", "HU", "CHB", "15/02/2017 17:00", "01/10/2099 17:30", 0);

            let activity = createTaskActivity("2016-10-18", "D", 5);
            let activity2 = createTaskActivity("2016-10-18", "D", 5);

            task.status = "C";
            task2.status = "IF";

            task.activities.push(activity);
            task2.activities.push(activity2);

            job.tasks = [task, task2];
            mockJobService.getJob = sandbox.stub().resolves(job);

            let chargeTypeALP2FIS = createChargeType("ALP2FIS", "BBF", "D", "Y", "Y"); // , HU, BBF
            let chargeTypeALP3FI1 = createChargeType("ALP3FI1", "CHB", "D", "Y", "Y"); // , HU, CHB

            let chargeRuleHuBbf = createJcChargeRule("333", "HU", "BBF", "ALP", "2FIS", "1996-01-01", "2099-12-31", "H2", "N");
            let chargeRuleHuChb = createJcChargeRule("333", "HU", "CHB", "ALP", "3FI1", "1996-01-01", "2099-12-31", "H2", "N");
            chargeRuleHuBbf.chargeRuleSequence = 12345;
            chargeRuleHuChb.chargeRuleSequence = 56789;

            let getChargeTypeStub = mockCatalogService.getChargeType = sandbox.stub();
            getChargeTypeStub
                .withArgs("ALP2FIS").resolves(chargeTypeALP2FIS)
                .withArgs("ALP3FI1").resolves(chargeTypeALP3FI1);

            let getJCChargeRulesStub = mockCatalogService.getJCChargeRules = sandbox.stub();

            getJCChargeRulesStub
                .withArgs("HU", "BBF").resolves([chargeRuleHuBbf])
                .withArgs("HU", "CHB").resolves([chargeRuleHuChb]);

            let labourChargeRuleCode = createLabourChargeRuleCode("H2", 8256, 30, 1447, 30);
            let pci1 = createPrimeChargeInterval("1", "H2", 1, 45, 9999, 8256);
            let sci1 = createSubsqntChargeInterval("1", "H2", 1, 15, 9999, 1447);

            mockCatalogService.getPrimeChargeIntervals = sandbox.stub().resolves([pci1]);
            mockCatalogService.getSubsequentChargeIntervals = sandbox.stub().resolves([sci1]);

            mockCatalogService.getLabourChargeRule = sandbox.stub().resolves(labourChargeRuleCode);

            let acr1 = createAreaChargeRule("HU", "BBF", "2FIS", "2016-11-01", END_DATE, "1", chargeRuleHuBbf.chargeRuleSequence);
            let acr2 = createAreaChargeRule("HU", "CHB", "3FI1", "2016-11-01", END_DATE, "1", chargeRuleHuChb.chargeRuleSequence);

            areaChargeRules.push(acr1);
            areaChargeRules.push(acr2);

            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

            // act
            const chargeableMain = await chargeService.applyCharges(job.id);
            const {tasks} = chargeableMain;

            // assert

            expect(tasks.length).toEqual(2);
            expect(tasks[0].isSubsequent).toBe(false);
            expect(tasks[0].labourItem.netAmount.toNumber()).toEqual(82.56);
            expect(tasks[1].isSubsequent).toBe(true);
            expect(tasks[1].labourItem.netAmount.toNumber()).toEqual(0);

            done();
        });

        // see DF_1771
        // sub is set instead of prime
        it("uses prime charge status if already no charge non-prime calculated from completed tasks, second visit", async done => {

            let task = createTask("1", "ALP2SIS", "HU", "WAW", "15/02/2017 17:00", "01/10/2099 17:30", 0);
            let task2 = createTask("2", "NCHNONE", "RB", "CHB", "15/02/2017 17:00", "01/10/2099 17:30", 0);

            let activity = createTaskActivity("2016-10-18", "IA", 5);
            let activity2 = createTaskActivity("2016-10-18", "C", 5);

            task.status = "D";
            task.isMiddlewareDoTodayTask = true;

            task2.status = "C";
            task2.isCharge = false;
            task2.isMiddlewareDoTodayTask = false;

            task.activities.push(activity);
            task2.activities.push(activity2);

            job.tasks = [task];
            job.tasksNotToday = [task2];

            mockJobService.getJob = sandbox.stub().resolves(job);

            let chargeTypeALP2SIS = createChargeType("ALP2SIS", "WAW", "D", "Y", "Y"); // , HU, WAW
            let chargeTypeNCHNONE = createChargeType("NCHNONE", "CHB", "D", "Y", "Y"); // , RB, CHB

            let chargeRuleHuWaw = createJcChargeRule("333", "HU", "WAW", "ALP", "2SIS", "1996-01-01", "2099-12-31", "H2", "N");
            let chargeRuleRbChb = createJcChargeRule("333", "RB", "CHB", "NCH", "NONE", "1996-01-01", "2099-12-31", "", "N");
            chargeRuleHuWaw.chargeRuleSequence = 12345;
            chargeRuleRbChb.chargeRuleSequence = 56789;

            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

            let getChargeTypeStub = mockCatalogService.getChargeType = sandbox.stub();
            getChargeTypeStub
                .withArgs("ALP2SIS").resolves(chargeTypeALP2SIS)
                .withArgs("NCHNONE").resolves(chargeTypeNCHNONE);

            let getJCChargeRulesStub = mockCatalogService.getJCChargeRules = sandbox.stub();

            getJCChargeRulesStub
                .withArgs("HU", "WAW").resolves([chargeRuleHuWaw])
                .withArgs("RB", "CHB").resolves([chargeRuleRbChb]);

            let labourChargeRuleCode = createLabourChargeRuleCode("H2", 8256, 30, 1447, 30);
            let pci1 = createPrimeChargeInterval("1", "H2", 1, 45, 9999, 8256);
            let sci1 = createSubsqntChargeInterval("1", "H2", 1, 15, 9999, 1447);

            mockCatalogService.getPrimeChargeIntervals = sandbox.stub().resolves([pci1]);
            mockCatalogService.getSubsequentChargeIntervals = sandbox.stub().resolves([sci1]);

            mockCatalogService.getLabourChargeRule = sandbox.stub().resolves(labourChargeRuleCode);

            let acr1 = createAreaChargeRule("HU", "WAW", "2SIS", "2016-11-01", END_DATE, "1", chargeRuleHuWaw.chargeRuleSequence);
            let acr2 = createAreaChargeRule("RB", "CHB", "NONE", "2016-11-01", END_DATE, "1", chargeRuleRbChb.chargeRuleSequence);

            areaChargeRules.push(acr1);
            areaChargeRules.push(acr2);

            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);


            // act
            const chargeableMain = await chargeService.applyCharges(job.id);
            const {tasks} = chargeableMain;

            // assert

            expect(tasks.length).toEqual(1);
            expect(tasks[0].isSubsequent).toBe(false);
            expect(tasks[0].labourItem.netAmount.toNumber()).toEqual(82.56);
            // expect(tasks[1].isSubsequent).toBe(true);
            // expect(tasks[1].labourItem.netAmount.toNumber()).toEqual(0);
            done();
        });

        // see DF_1775
        // prime is set instead of sub

        describe("multi-visit labour charge scenarios, with different prime and sub indicators", () => {
            it("scenario 1 two tiered charges", async done => {

                const chargeCode1 = "ALP";
                const chargeMethod1 = "2SIS";
                const chargeType1 = `${chargeCode1}${chargeMethod1}`;
                const jobType1 = "HU";
                const appType1 = "WAW";

                const chargeCode2 = "ALF";
                const chargeMethod2 = "3ST";
                const chargeType2 = `${chargeCode2}${chargeMethod2}`;
                const jobType2 = "GU";
                const appType2 = "CHB";

                let task = createTask("1", chargeType1, jobType1, appType1, "15/02/2017 17:00", "01/10/2099 17:30", 0);
                let task2 = createTask("2", chargeType2, jobType2, appType2, "15/02/2017 17:00", "01/10/2099 17:30", 0);

                let activity = createTaskActivity("2016-10-18", "D", 5);
                let activity2 = createTaskActivity("2016-10-18", "D", 5);

                task.status = "C";
                task.isMiddlewareDoTodayTask = false;
                task.activities.push(activity);

                task2.status = "D";
                task2.isMiddlewareDoTodayTask = true;
                task2.activities.push(activity2);

                job.tasksNotToday = [task];
                job.tasks = [task2];

                mockJobService.getJob = sandbox.stub().resolves(job);

                let chargeTypeALP2SIS = createChargeType(chargeType1, appType1, "D", "Y", "Y"); // , HU, WAW
                let chargeTypeALF3ST = createChargeType(chargeType2, appType2, "D", "Y", "N"); // , RB, CHB

                let chargeRuleHuWaw = createJcChargeRule("333", jobType1, appType1, chargeCode1, chargeMethod1, "1996-01-01", "2099-12-31", "", "Y");
                let chargeRuleGuChb = createJcChargeRule("333", jobType2, appType2, chargeCode2, chargeMethod2, "1996-01-01", "2099-12-31", "H2", "N");
                chargeRuleHuWaw.chargeRuleSequence = 12345;
                chargeRuleGuChb.chargeRuleSequence = 56789;

                mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

                let getChargeTypeStub = mockCatalogService.getChargeType = sandbox.stub();
                getChargeTypeStub
                    .withArgs(chargeType1).resolves(chargeTypeALP2SIS)
                    .withArgs(chargeType2).resolves(chargeTypeALF3ST);

                let getJCChargeRulesStub = mockCatalogService.getJCChargeRules = sandbox.stub();

                getJCChargeRulesStub
                    .withArgs(jobType1, appType1).resolves([chargeRuleHuWaw])
                    .withArgs(jobType2, appType2).resolves([chargeRuleGuChb]);

                let labourChargeRuleCode = createLabourChargeRuleCode("H2", 8256, 30, 1447, 30);
                let pci1 = createPrimeChargeInterval("1", "H2", 1, 45, 9999, 8256);
                let sci1 = createSubsqntChargeInterval("1", "H2", 1, 15, 9999, 1447);

                mockCatalogService.getPrimeChargeIntervals = sandbox.stub().resolves([pci1]);
                mockCatalogService.getSubsequentChargeIntervals = sandbox.stub().resolves([sci1]);

                mockCatalogService.getLabourChargeRule = sandbox.stub().resolves(labourChargeRuleCode);

                let acr1 = createAreaChargeRule(jobType1, appType1, chargeMethod1, "2016-11-01", END_DATE, "1", chargeRuleHuWaw.chargeRuleSequence);
                let acr2 = createAreaChargeRule(jobType2, appType2, chargeMethod2, "2016-11-01", END_DATE, "1", chargeRuleGuChb.chargeRuleSequence);

                areaChargeRules.push(acr1);
                areaChargeRules.push(acr2);

                mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

                // act
                const chargeableMain = await chargeService.applyCharges(job.id);
                const {tasks} = chargeableMain;

                // assert

                expect(tasks.length).toEqual(1);
                expect(tasks[0].isSubsequent).toBe(true);
                expect(tasks[0].labourItem.netAmount.toNumber()).toEqual(14.47);
                // expect(tasks[1].isSubsequent).toBe(true);
                // expect(tasks[1].labourItem.netAmount.toNumber()).toEqual(0);
                done();
            });

            it("scenario 2 using standard labour charge", async done => {

                const chargeCode1 = "SLO";
                const chargeMethod1 = "2FI1";
                const chargeType1 = `${chargeCode1}${chargeMethod1}`;
                const jobType1 = "CK";
                const appType1 = "CHB";

                const chargeCode2 = "ALP";
                const chargeMethod2 = "1S";
                const chargeType2 = `${chargeCode2}${chargeMethod2}`;
                const jobType2 = "HU";
                const appType2 = "WAU";

                let task = createTask("1", chargeType1, jobType1, appType1, "15/02/2017 17:00", "01/10/2099 17:30", 0);
                let task2 = createTask("2", chargeType2, jobType2, appType2, "15/02/2017 17:00", "01/10/2099 17:30", 0);

                let activity = createTaskActivity("2016-10-18", "D", 5);
                let activity2 = createTaskActivity("2016-10-18", "D", 5);

                task.status = "C";
                task.isMiddlewareDoTodayTask = false;
                task.activities.push(activity);
                task.chargeableTime = 1;

                task2.status = "D";
                task2.isMiddlewareDoTodayTask = true;
                task2.activities.push(activity2);

                job.tasksNotToday = [task];
                job.tasks = [task2];

                mockJobService.getJob = sandbox.stub().resolves(job);

                let chargeTypeALP2SIS = createChargeType(chargeType1, appType1, "D", "Y", "Y"); // , HU, WAW
                let chargeTypeALF3ST = createChargeType(chargeType2, appType2, "D", "Y", "N"); // , RB, CHB

                let chargeRuleHuWaw = createJcChargeRule("333", jobType1, appType1, chargeCode1, chargeMethod1, "1996-01-01", "2099-12-31", "", "N", 82.5, 82.5);
                let chargeRuleGuChb = createJcChargeRule("333", jobType2, appType2, chargeCode2, chargeMethod2, "1996-01-01", "2099-12-31", "H2", "N");
                chargeRuleHuWaw.chargeRuleSequence = 12345;
                chargeRuleGuChb.chargeRuleSequence = 56789;

                mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

                let getChargeTypeStub = mockCatalogService.getChargeType = sandbox.stub();
                getChargeTypeStub
                    .withArgs(chargeType1).resolves(chargeTypeALP2SIS)
                    .withArgs(chargeType2).resolves(chargeTypeALF3ST);

                let getJCChargeRulesStub = mockCatalogService.getJCChargeRules = sandbox.stub();

                getJCChargeRulesStub
                    .withArgs(jobType1, appType1).resolves([chargeRuleHuWaw])
                    .withArgs(jobType2, appType2).resolves([chargeRuleGuChb]);

                let labourChargeRuleCode = createLabourChargeRuleCode("H2", 8256, 30, 1447, 30);
                let pci1 = createPrimeChargeInterval("1", "H2", 1, 45, 9999, 8256);
                let sci1 = createSubsqntChargeInterval("1", "H2", 1, 15, 9999, 1447);

                mockCatalogService.getPrimeChargeIntervals = sandbox.stub().resolves([pci1]);
                mockCatalogService.getSubsequentChargeIntervals = sandbox.stub().resolves([sci1]);

                mockCatalogService.getLabourChargeRule = sandbox.stub().resolves(labourChargeRuleCode);

                let acr1 = createAreaChargeRule(jobType1, appType1, chargeMethod1, "2016-11-01", END_DATE, "1", chargeRuleHuWaw.chargeRuleSequence);
                let acr2 = createAreaChargeRule(jobType2, appType2, chargeMethod2, "2016-11-01", END_DATE, "1", chargeRuleGuChb.chargeRuleSequence);

                areaChargeRules.push(acr1);
                areaChargeRules.push(acr2);

                mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

                // act
                const chargeableMain = await chargeService.applyCharges(job.id);
                const {tasks} = chargeableMain;

                // assert

                expect(tasks.length).toEqual(1);

                expect(tasks[0].isSubsequent).toBe(true);
                expect(tasks[0].labourItem.netAmount.toNumber()).toEqual(14.47);
                expect(tasks[0].task.status).toEqual("D");

                done();
            });

            it("scenario 3 , two completed (No Charge and Charge) and one to do today all non-prime", async done => {

                const chargeCode1 = "NCH";
                const chargeMethod1 = "2FI1";
                const chargeType1 = `${chargeCode1}${chargeMethod1}`;
                const jobType1 = "FV";
                const appType1 = "WAU";

                const chargeCode2 = "ALP";
                const chargeMethod2 = "2API";
                const chargeType2 = `${chargeCode2}${chargeMethod2}`;
                const jobType2 = "HU";
                const appType2 = "WH";

                const chargeCode3 = "CPO";
                const chargeMethod3 = "NONE";
                const chargeType3 = `${chargeCode3}${chargeMethod3}`;
                const jobType3 = "IA";
                const appType3 = "COD";

                let task = createTask("1", chargeType1, jobType1, appType1, "15/02/2017 17:00", "01/10/2099 17:30", 0);
                let task2 = createTask("2", chargeType2, jobType2, appType2, "15/02/2017 17:00", "01/10/2099 17:30", 30);
                let task3 = createTask("3", chargeType3, jobType3, appType3, "15/02/2017 17:00", "01/10/2099 17:30", 0);

                let activity = createTaskActivity("2016-10-18", "D", 50);
                let activity2 = createTaskActivity("2016-10-18", "D", 30);
                let activity3 = createTaskActivity("2016-10-18", "D", 30);

                task.status = "C";
                task.isMiddlewareDoTodayTask = false;
                task.activities.push(activity);

                task2.status = "D";
                task2.isMiddlewareDoTodayTask = true;
                task2.activities.push(activity2);
                task2.chargeableTime =31;

                task3.status = "C";
                task3.isMiddlewareDoTodayTask = false;
                task3.activities.push(activity3);

                job.tasksNotToday = [task, task2];
                job.tasks = [task3];

                mockJobService.getJob = sandbox.stub().resolves(job);

                let chargeTypeNCH2FI1 = createChargeType(chargeType1, appType1, "D", "N", "N"); // , FV, WAU
                let chargeTypeALP2API = createChargeType(chargeType2, appType2, "D", "Y", "Y"); // , HU, WH
                let chargeTypeCPONONE = createChargeType(chargeType3, appType3, "D", "N", "Y"); // , IA, CPO

                let chargeRuleFvWau = createJcChargeRule("333", jobType1, appType1, chargeCode1, chargeMethod1, "1996-01-01", "2099-12-31", "", "N");
                chargeRuleFvWau.chargeRuleSequence = 1;

                let chargeRuleHuWh = createJcChargeRule("333", jobType2, appType2, chargeCode2, chargeMethod2, "1996-01-01", "2099-12-31", "H2", "N");
                chargeRuleHuWh.chargeRuleSequence = 2;

                let chargeRuleCpoNone = createJcChargeRule("333", jobType3, appType3, chargeCode3, chargeMethod3, "1996-01-01", "2099-12-31", "", "N");
                chargeRuleCpoNone.chargeRuleSequence = 3;

                mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

                let getChargeTypeStub = mockCatalogService.getChargeType = sandbox.stub();
                getChargeTypeStub
                    .withArgs(chargeType1).resolves(chargeTypeNCH2FI1)
                    .withArgs(chargeType2).resolves(chargeTypeALP2API)
                    .withArgs(chargeType3).resolves(chargeTypeCPONONE);

                let getJCChargeRulesStub = mockCatalogService.getJCChargeRules = sandbox.stub();

                getJCChargeRulesStub
                    .withArgs(jobType1, appType1).resolves([chargeRuleFvWau])
                    .withArgs(jobType2, appType2).resolves([chargeRuleHuWh])
                    .withArgs(jobType3, appType3).resolves([chargeRuleCpoNone]);

                let labourChargeRuleCode = createLabourChargeRuleCode("H2", 8256, 30, 1447, 30);
                let pci1 = createPrimeChargeInterval("1", "H2", 1, 45, 9999, 8256);
                let sci1 = createSubsqntChargeInterval("1", "H2", 1, 15, 9999, 1447);

                mockCatalogService.getPrimeChargeIntervals = sandbox.stub().resolves([pci1]);
                mockCatalogService.getSubsequentChargeIntervals = sandbox.stub().resolves([sci1]);
                mockCatalogService.getLabourChargeRule = sandbox.stub().resolves(labourChargeRuleCode);

                let acr1 = createAreaChargeRule(jobType1, appType1, chargeMethod1, "2016-11-01", END_DATE, "1", chargeRuleFvWau.chargeRuleSequence);
                let acr2 = createAreaChargeRule(jobType2, appType2, chargeMethod2, "2016-11-01", END_DATE, "1", chargeRuleHuWh.chargeRuleSequence);
                let acr3 = createAreaChargeRule(jobType2, appType2, chargeMethod2, "2016-11-01", END_DATE, "1", chargeRuleCpoNone.chargeRuleSequence);

                areaChargeRules.push(acr1);
                areaChargeRules.push(acr2);
                areaChargeRules.push(acr3);

                mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

                // act
                const chargeableMain = await chargeService.applyCharges(job.id);
                const {tasks} = chargeableMain;

                // assert

                expect(tasks.length).toEqual(1);
                expect(tasks[0].isSubsequent).toBe(true);
                expect(tasks[0].labourItem.netAmount.toNumber()).toEqual(57.88);
                expect(tasks[0].task.status).toEqual("D");

                done();
            });

        });

    });

    describe("fixed price charge override from WMIS", () => {

        const chargeTypeCode = "SLO1S";

        beforeEach(() => {

            let task = createTask("1", chargeTypeCode, "AS", "SLC", "01/10/2099 17:00", "01/10/2099 17:30", 30);
            task.fixedPriceQuotationAmount = 100;

            job.tasks.push(task);
            mockJobService.getJob = sandbox.stub().resolves(job);

            let chargeType = createChargeType(chargeTypeCode, "STD LAB ONLY-1S", "D", "y", "N");

            let item = createJcChargeRule("1", "AS", "SLC", "SLO", "1S", "2007-09-24", END_DATE, null, "N", 112.34, 112.35);
            jobChargeRules.push(item);

            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);
            mockCatalogService.getChargeType = sandbox.stub().resolves(chargeType);
            mockCatalogService.getJCChargeRules = sandbox.stub().resolves(jobChargeRules);

            let acr1 = createAreaChargeRule("AS", "SLC", "1S", "2016-11-01", END_DATE, "1", item.chargeRuleSequence);
            areaChargeRules.push(acr1);

            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

        });

        it("should override charge with fixedPriceQuotation amount", async done => {

            // act
            const chargeableMain = await chargeService.applyCharges("1");
            const chargeableTasks = chargeableMain.tasks;

            // assert
            expect(chargeableTasks).toBeDefined();
            expect(chargeableTasks.length).toEqual(1);
            expect(chargeableTasks[0].partItems.length).toEqual(1);
            expect(chargeableTasks[0].labourItem.netAmount.toNumber()).toEqual(0);
            expect(chargeableTasks[0].fixedPriceQuotationAmount.toNumber()).toEqual(1);
            done();
        });

        it("should set to prime is only task", async done => {

            // act
            const chargeableMain = await chargeService.applyCharges("1");
            const chargeableTasks = chargeableMain.tasks;

            // assert
            expect(chargeableTasks).toBeDefined();
            expect(chargeableTasks[0].isSubsequent).toBe(false);

            done();
        });

        it("should set to prime/subsequent from charge rules when another non-fixed price task", async done => {

            let task = createTask("1", "ALP3SIS", "HU", "CHB", "15/02/2017 17:00", "01/10/2099 17:30", 30);
            task.status = "D";
            let activity = createTaskActivity("2016-10-18", "D", 0);
            task.isCharge = true; //factory would populate this
            task.activities.push(activity);

            let task2 = createTask("2", "NCH1S", "AS", "FRE", "15/02/2017 17:00", "01/10/2099 17:30", 30);
            task2.status = "D";
            let activity2 = createTaskActivity("2016-10-18", "D", 5);
            task2.isCharge = false; //factory would populate this
            task2.activities.push(activity2);

            let task3 = createTask("3", "SLO2API", "SD", "HOB", "15/02/2017 17:00", "01/10/2099 17:30", 30);
            task3.status = "D";
            let activity3 = createTaskActivity("2016-10-18", "D", 5);
            task3.isCharge = true; //factory would populate this
            task3.activities.push(activity3);
            task3.fixedPriceQuotationAmount = 1000;

            job.tasks = [task, task2, task3];
            mockJobService.getJob = sandbox.stub().resolves(job);

            let chargeTypeALP3SIS = createChargeType("ALP3SIS", "A", "D", "Y", "Y"); // , BE, FFR
            let chargeTypeNCH1S = createChargeType("NCH1S", "B", "D", "N", "N"); // KF, FFR,
            let chargeTypeSLO2API = createChargeType("SLO2API", "C", "D", "Y", "N"); // KF, FFR,

            let chargeRuleHuChb = createJcChargeRule("333", "HU", "CHB", "ALP", "3SIS", "1996-01-01", "2099-12-31", "H3", "N");
            let chargeRuleAsFre = createJcChargeRule("444", "AS", "FRE", "NCH", "1S", "2010-11-08", "2099-12-31", "", "Y");
            let chargeRuleSdHob = createJcChargeRule("555", "SD", "HOB", "SLO", "2API", "2010-11-08", "2099-12-31", "", "N");

            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

            let getChargeTypeStub = mockCatalogService.getChargeType = sandbox.stub();
            getChargeTypeStub
                .withArgs("ALP3SIS").resolves(chargeTypeALP3SIS)
                .withArgs("NCH1S").resolves(chargeTypeNCH1S)
                .withArgs("SLO2API").resolves(chargeTypeSLO2API);

            let getJCChargeRulesStub = mockCatalogService.getJCChargeRules = sandbox.stub();

            getJCChargeRulesStub
                .withArgs("HU", "CHB").resolves([chargeRuleHuChb])
                .withArgs("AS", "FRE").resolves([chargeRuleAsFre])
                .withArgs("SD", "HOB").resolves([chargeRuleSdHob]);

            let labourChargeRuleCode = createLabourChargeRuleCode("H3", 8256, 30, 1447, 30);

            let pci1 = createPrimeChargeInterval("1", "H3", 1, 45, 9999, 8256);
            let sci1 = createSubsqntChargeInterval("1", "H3", 1, 15, 9999, 1447);

            mockCatalogService.getPrimeChargeIntervals = sandbox.stub().resolves([pci1]);
            mockCatalogService.getSubsequentChargeIntervals = sandbox.stub().resolves([sci1]);
            mockCatalogService.getLabourChargeRule = sandbox.stub().resolves(labourChargeRuleCode);

            // act
            const chargeableMain = await chargeService.applyCharges("1");
            const chargeableTasks = chargeableMain.tasks;

            // assert
            expect(chargeableTasks[2].fixedPriceQuotationAmount.toNumber()).toEqual(10);
            expect(chargeableTasks[2].isSubsequent).toEqual(true);

            done();
        });

        // DF_1788
        it("DF_1788 should not set non-fixed task to prime if fixed is prime and non-fixed task is non-prime", async done => {

            let task = createTask("1", "EXSGNI2", "LD", "FRE", "15/02/2017 17:00", "01/10/2099 17:30", 30);
            task.status = "D";
            let activity = createTaskActivity("2016-10-18", "D", 0);
            task.isCharge = true; //factory would populate this
            task.activities.push(activity);
            task.fixedPriceQuotationAmount = 14000;

            let task2 = createTask("2", "ALPCNI1", "HU", "CHB", "15/02/2017 17:00", "01/10/2099 17:30", 30);
            task2.status = "D";
            let activity2 = createTaskActivity("2016-10-18", "D", 5);
            task2.isCharge = false; //factory would populate this
            task2.activities.push(activity2);

            job.tasks = [task, task2];
            mockJobService.getJob = sandbox.stub().resolves(job);

            let chargeTypeALPCNI1 = createChargeType("ALPCNI1", "A", "D", "Y", "Y"); // , BE, FFR
            let chargeTypeEXSGNI2 = createChargeType("EXSGNI2", "B", "D", "N", "N"); // KF, FFR,

            let chargeRuleLdFre = createJcChargeRule("444", "LD", "FRE", "EXS", "GNI2", "2010-11-08", "2099-12-31", "", "Y"); //prime
            let chargeRuleHuChb = createJcChargeRule("333", "HU", "CHB", "ALP", "CNI1", "1996-01-01", "2099-12-31", "H3", "N");

            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

            let getChargeTypeStub = mockCatalogService.getChargeType = sandbox.stub();
            getChargeTypeStub
                .withArgs("ALPCNI1").resolves(chargeTypeALPCNI1)
                .withArgs("EXSGNI2").resolves(chargeTypeEXSGNI2);

            let getJCChargeRulesStub = mockCatalogService.getJCChargeRules = sandbox.stub();

            getJCChargeRulesStub
                .withArgs("LD", "FRE").resolves([chargeRuleLdFre])
                .withArgs("HU", "CHB").resolves([chargeRuleHuChb]);

            let labourChargeRuleCode = createLabourChargeRuleCode("H3", 8256, 30, 1447, 30);

            let pci1 = createPrimeChargeInterval("1", "H3", 1, 45, 9999, 8256);
            let sci1 = createSubsqntChargeInterval("1", "H3", 1, 15, 9999, 1447);

            mockCatalogService.getPrimeChargeIntervals = sandbox.stub().resolves([pci1]);
            mockCatalogService.getSubsequentChargeIntervals = sandbox.stub().resolves([sci1]);
            mockCatalogService.getLabourChargeRule = sandbox.stub().resolves(labourChargeRuleCode);

            // act
            const chargeableMain = await chargeService.applyCharges("1");
            const chargeableTasks = chargeableMain.tasks;

            // assert
            expect(chargeableTasks[0].isSubsequent).toEqual(false);
            expect(chargeableTasks[1].isSubsequent).toEqual(true);

            done();
        });

    });

    describe("parts charge", () => {

        const chargeTypeCode = "CPO3SN1";
        let task: Task;

        beforeEach(() => {

            let chargeType = createChargeType(chargeTypeCode, "CHG PARTS ONLY-3SN1", "D", "N", "Y");

            let item = createJcChargeRule("1", "FV", "BBC", "CPO", "3NS1", "2013-01-21", END_DATE, "", "N");
            jobChargeRules.push(item);

            mockCatalogService.getChargeType = sandbox.stub().resolves(chargeType);
            mockCatalogService.getJCChargeRules = sandbox.stub().resolves(jobChargeRules);

            task = createTask("1", chargeTypeCode, "FV", "BBC", "01/10/2099 17:00", "01/10/2099 18:21", 121);
            task.isCharge = true;
        });

        describe("calling getCharges with multiple tasks; no charge, tiered labour, fixed labour and parts charge", () => {

            const vatCode = "D";
            const noChargeTypeCode = "NCHNONE";
            const tieredChargeTypeCode = "SLONONE";
            const fixedChargeTypeCode = "SLO1S";
            const partsChargeTypeCode = "CPO3SN1";

            beforeEach(() => {

                // no charge
                let noChargeType = createChargeType(chargeTypeCode, "NO CHARGE-NONE", vatCode, "N", "N");
                let noChargeTask = createTask("1", noChargeTypeCode, "1Z", "EWR", "01/10/2099 17:00", "01/10/2099 17:30", 30);
                noChargeTask.isCharge = false;
                let noChargeFieldActivityChargeType = createJcChargeRule("1", "1Z", "EWR", "NCH", "NONE", "2007-03-21", "31-DEC-2050", null, "N");
                noChargeFieldActivityChargeType.chargeRuleSequence = 111111;
                let acr1 = Helper.createAreaChargeRule("1Z", "EWR", "NONE", "2016-11-01", END_DATE, "1", noChargeFieldActivityChargeType.chargeRuleSequence);

                // tiered charge
                let tieredChargeType = createChargeType(tieredChargeTypeCode, "STD LAB ONLY-NONE", vatCode, "Y", "N");
                let tieredChargeTask = createTask("2", tieredChargeTypeCode, "ER", "EWR", "01/10/2099 17:00", "01/10/2099 20:00", 180);
                tieredChargeTask.isCharge = true;
                let tieredFieldActivityChargeType = createJcChargeRule("3632", "ER", "EWR", "SLO", "NONE", "2012-11-15", "2050-12-31", "3N", "Y");
                tieredFieldActivityChargeType.chargeRuleSequence = 22222;
                let acr2 = Helper.createAreaChargeRule("ER", "EWR", "NONE", "2016-11-01", END_DATE, "1", tieredFieldActivityChargeType.chargeRuleSequence);

                // let activity = createTaskActivity("2016-10-18", "IP", 0);
                // tieredChargeTask.activities.push(activity);
                let labourChargeRuleCode = createLabourChargeRuleCode("3N", 2044, 30, 2044, 30);

                let pci1 = createPrimeChargeInterval("42", "3N", 1, 15, 30, 458);
                let pci2 = createPrimeChargeInterval("43", "3N", 2, 15, 9999, 740);

                primeChargeIntervals.push(pci1);
                primeChargeIntervals.push(pci2);

                // fixed charge
                let fixedChargeType = createChargeType(fixedChargeTypeCode, "STD LAB ONLY-1S", vatCode, "Y", "N");
                let fixedLabourChargeTask = createTask("3", fixedChargeTypeCode, "AS", "SLC", "01/10/2099 17:00", "01/10/2099 17:30", 30);
                let fixedActivityChargeType = createJcChargeRule("1", "AS", "SLC", "SLO", "1S", "2007-09-24", END_DATE, null, "N", 112.34, 112.34);
                fixedActivityChargeType.chargeRuleSequence = 33333;
                let acr3 = Helper.createAreaChargeRule("AS", "SLC", "1S", "2016-11-01", END_DATE, "1", fixedActivityChargeType.chargeRuleSequence);
                // parts charge

                let partsChargeType = createChargeType(partsChargeTypeCode, "CHG PARTS ONLY-3SN1", vatCode, "N", "Y");
                let partsChargeTask = createTask("4", partsChargeTypeCode, "FV", "BBC", "01/10/2099 17:00", "01/10/2099 18:21", 180);
                partsChargeTask.isCharge = true;
                let partsFieldActivityChargeType = createJcChargeRule("1", "FV", "BBC", "CPO", "3NS1", "2013-01-21", END_DATE, "", "N");
                partsFieldActivityChargeType.chargeRuleSequence = 44444;
                let acr4 = Helper.createAreaChargeRule("FV", "BBC", "3NS1", "2016-11-01", END_DATE, "1", partsFieldActivityChargeType.chargeRuleSequence);

                let parts: Part[] = [];
                let partsToday: PartsToday = new PartsToday();
                let partToOrder: Part = new Part();

                partToOrder.id = Guid.newGuid();
                partToOrder.description = "Some Part";
                partToOrder.partOrderStatus = "J";
                partToOrder.price = new bignumber.BigNumber(4900);
                partToOrder.quantity = 1;
                partToOrder.stockReferenceId = "P123456789";
                partToOrder.taskId = "4";

                parts.push(partToOrder);
                partsToday.parts = parts;

                mockPartService.getTodaysParts = sandbox.stub().resolves(partsToday);
                mockPartService.getPartsBasket = sandbox.stub().resolves(null);

                //add tasks
                job.tasks.push(noChargeTask);
                job.tasks.push(tieredChargeTask);
                job.tasks.push(fixedLabourChargeTask);
                job.tasks.push(partsChargeTask);

                mockJobService.getJob = sandbox.stub().resolves(job);

                // mock catalog
                jobChargeRules.push(noChargeFieldActivityChargeType);
                jobChargeRules.push(tieredFieldActivityChargeType);
                jobChargeRules.push(fixedActivityChargeType);
                jobChargeRules.push(partsFieldActivityChargeType);

                mockCatalogService.getChargeType = sandbox.stub()
                    .withArgs(noChargeTypeCode).resolves(noChargeType)
                    .withArgs(tieredChargeTypeCode).resolves(tieredChargeType)
                    .withArgs(fixedChargeTypeCode).resolves(fixedChargeType)
                    .withArgs(partsChargeTypeCode).resolves(partsChargeType);

                mockCatalogService.getLabourChargeRule = sandbox.stub().resolves(labourChargeRuleCode);
                mockCatalogService.getJCChargeRules = sandbox.stub().resolves(jobChargeRules);
                mockCatalogService.getPrimeChargeIntervals = sandbox.stub().resolves(primeChargeIntervals);
                mockCatalogService.getSubsequentChargeIntervals = sandbox.stub().resolves(subsequentChargeIntervals);
                mockCatalogService.getAreaChargeRules = sandbox.stub().resolves([acr1, acr2, acr3, acr4]);


            });

            it("should contain 4 items", async done => {

                // act
                const chargeableMain = await chargeService.applyCharges("1");

                // assert
                expect(chargeableMain.tasks.length).toEqual(4);
                done();
            });

            it("should set correct charges and totals, entire job example", async done => {

                // act
                const chargeableMain = await chargeService.applyCharges("1");
                const chargeableTasks = chargeableMain.tasks;

                // assert
                //no charge
                expect(chargeableTasks[0].partItems[0].netAmount.toNumber()).toEqual(0); // no parts charge
                expect(chargeableTasks[0].labourItem.netAmount.toNumber()).toEqual(0);

                // tiered
                expect(chargeableTasks[1].partItems[0].netAmount.toNumber()).toEqual(0); // no parts charge
                expect(chargeableTasks[1].labourItem.netAmount.toNumber()).toEqual(88.80); // uses prime charge

                // fixed labour
                expect(chargeableTasks[2].partItems[0].netAmount.toNumber()).toEqual(0); // no parts charge
                expect(chargeableTasks[2].labourItem.netAmount.toNumber()).toEqual(112.34);
                expect(chargeableTasks[2].labourItem.isFixed).toBe(true);
                expect(chargeableTasks[2].fixedPriceAmount.toNumber()).toBe(112.34);

                // parts
                expect(chargeableTasks[3].partItems[0].netAmount.toNumber()).toEqual(4900);
                expect(chargeableTasks[3].labourItem.netAmount.toNumber()).toEqual(0); // no labour charge
                expect(chargeableTasks[3].labourItem.isFixed).toBe(false);
                expect(chargeableTasks[3].fixedPriceAmount.toNumber()).toBe(0);

                done();
            });
        });

        describe("previous activity with charge", () => {

            const vatCode = "D";
            let partsChargeTask;
            let activity;
            let part;

            beforeEach(() => {

                // parts charge
                const partsChargeTypeCode = "ALP2SIM";
                let partsChargeType = createChargeType(partsChargeTypeCode, "CHG PARTS ONLY-2SIM", vatCode, "N", "Y");
                let partsFieldActivityChargeType = createJcChargeRule("1", "HU", "BBF", "ALP", "2SIM", "2013-01-21", END_DATE, "", "N");

                let partsToday: PartsToday = new PartsToday();
                partsToday.parts = [];

                partsChargeTask = createTask("4", partsChargeTypeCode, "HU", "BBF", "01/10/2099 17:00", "01/10/2099 18:21", 180);

                mockPartService.getTodaysParts = sandbox.stub().resolves(partsToday);
                mockPartService.getPartsBasket = sandbox.stub().resolves(null);

                mockCatalogService.getChargeType = sandbox.stub()
                    .withArgs(partsChargeTypeCode).resolves(partsChargeType);
                mockCatalogService.getJCChargeRules = sandbox.stub().resolves([partsFieldActivityChargeType]);

                let acr1 = createAreaChargeRule("HU", "BBF", "2SIM", "2016-11-01", END_DATE, "1", partsFieldActivityChargeType.chargeRuleSequence);
                areaChargeRules.push(acr1);
                mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

                activity = createTaskActivity("2017-08-17", "IA", 30);

                part = new Part();
                part.status = "UP";
                part.description = "Wax Sensor";
                part.price = new bignumber.BigNumber(100.0);
                part.quantity = 4;
                part.quantityCharged = 2;
                part.stockReferenceId = "108014";
                part.taskId = partsChargeTask.id;

                partsChargeTask.activities = [activity];
                partsChargeTask.isCharge = true;

                //add tasks
                job.tasks.push(partsChargeTask);

                mockJobService.getJob = sandbox.stub().resolves(job);
            });

            it("excludes parts charge when status NOT another visit reqd", async done => {

                activity.parts = [part];
                activity.status = "XC"; //cancelled status, anything other than IA

                partsChargeTask.activities = [activity];

                //add tasks
                job.tasks.push(partsChargeTask);

                mockJobService.getJob = sandbox.stub().resolves(job);

                // act
                const chargeableMain = await chargeService.applyCharges("1");
                // assert
                const chargeableTasks = chargeableMain.tasks;
                expect(chargeableTasks[0].partItems[0].netAmount.toNumber()).toEqual(0);
                done();
            });

            it("excludes parts charge if no parts", async done => {

                activity.parts = [];
                activity.status = "IA"; //cancelled status, anything other than IA

                // act
                const chargeableMain = await chargeService.applyCharges("1");
                // assert
                const chargeableTasks = chargeableMain.tasks;
                expect(chargeableTasks[0].partItems[0].netAmount.toNumber()).toEqual(0);
                done();
            });
        });

        describe("loadCharges", () => {

            it("job doesnt have changes, returns null", async done => {
                let job = new Job();
                mockJobService.getJob = sandbox.stub().resolves(job);
                const model = await chargeService.loadCharges("3344");
                expect(model).toBeNull();
                done();
            });

            it("job has changes, returns changes", async done => {
                let job = new Job();
                job.charge = new Charge();
                job.charge.tasks = [];
                let ct = new ChargeableTask();
                ct.vat = new bignumber.BigNumber(20);
                ct.vatCode = "A";
                job.charge.tasks.push(ct);

                job.charge.discountAmount = new bignumber.BigNumber(123);
                mockJobService.getJob = sandbox.stub().resolves(job);

                const model = await chargeService.loadCharges("3344");
                expect(model).toBeDefined();
                expect(model.discountAmount.toNumber()).toEqual(123);
                expect(model.tasks[0].vat.toNumber()).toEqual(20);
                expect(model.tasks[0].vatCode).toEqual("A");
                done();
            });

            describe("saveCharges", () => {

                it("job saved!", async done => {
                    let chargeableMain = new Charge();
                    chargeableMain.jobId = "job1";
                    mockJobService.setJob = sandbox.stub().resolves(undefined);
                    mockJobService.setJob = setJobSpy = sandbox.spy();
                    await chargeService.saveCharges(chargeableMain);
                    expect(setJobSpy.calledOnce).toBeTruthy();
                    done();
                });
            });

            it("areChargesUptoDate, is upto date", () => {
                let result = chargeService.areChargesUptoDate();
                expect(result).toBeTruthy();
            });

            describe("updateTotals", () => {

                let task: ChargeableTask;
                let chargeableMain: Charge;

                beforeEach(() => {

                    chargeableMain = new Charge();
                    chargeableMain.tasks = [];

                    task = new ChargeableTask();
                    let t = new Task(false, false);
                    task.vat = new bignumber.BigNumber(200);
                    t.id = "1";
                    task.task = t;
                });

                it("charge, without discount, netValue, chargeValue updated", () => {
                    task.addPartItem("", bNum(1), false, false, 1, 1, "", 0, 0);
                    task.discountAmount = undefined;
                    chargeableMain.tasks.push(task);

                    chargeService.updateTotals(chargeableMain);

                    expect(chargeableMain.netTotal.toNumber()).toEqual(1);
                    expect(chargeableMain.chargeTotal.toNumber()).toEqual(1.2);
                    expect(chargeableMain.totalVatAmount.toNumber()).toEqual(0.2);
                });

                it("charge, with discount excluding VAT, netValue, chargeValue updated", () => {
                    chargeableMain.tasks = [];

                    task.addPartItem("", bNum(100), false, false, 1, 1, "", 0, 0);
                    task.discountAmount = new bignumber.BigNumber(10);

                    chargeableMain.tasks.push(task);
                    chargeService.updateTotals(chargeableMain);

                    expect(chargeableMain.netTotal.toNumber()).toEqual(90);
                    expect(chargeableMain.chargeTotal.toNumber()).toEqual(108);
                    expect(chargeableMain.totalVatAmount.toNumber()).toEqual(18);
                });
            });

            describe("applyDiscount", () => {

                let task: ChargeableTask;
                let chargeableMain: Charge;

                beforeEach(() => {

                    chargeableMain = new Charge();
                    chargeableMain.tasks = [];

                    task = new ChargeableTask();
                    let t = new Task(false, false);
                    task.vat = new bignumber.BigNumber(200);
                    t.id = "1";
                    task.task = t;
                });

                it("no discount applied", () => {

                    task.addPartItem("", bNum(1), false, false, 1, 1, "", 0, 0);
                    chargeableMain.tasks.push(task);

                    chargeService.applyDiscountToTask(task, [], 'P', 'F', 'NODISCOUNT');

                    expect(task.netTotal.toNumber()).toEqual(1);
                    expect(task.grossTotal.toNumber()).toEqual(1.2);

                });

                it("with 10% discount applied", () => {

                    task.addPartItem("", bNum(100), false, false, 1, 1, "", 0, 0);
                    task.discountCode = "fakeTenPercent";
                    task.vat = new bignumber.BigNumber(200);


                    const discount = <IDiscount>{};
                    discount.discountCode = "fakeTenPercent";
                    discount.discountValue = 10;
                    discount.discountCategory = "P";
                    discount.discountEndDate = "";

                    chargeService.applyDiscountToTask(task, [discount], 'P', 'F', 'NODISCOUNT');

                    expect(task.discountAmount.toNumber()).toEqual(10);
                    expect(task.grossTotal.toNumber()).toEqual(108);
                });

                it("with 100% discount applied", () => {

                    task.addPartItem("", bNum(10), false, false, 1, 1, "", 0, 0);
                    task.discountCode = "fakeTwelvePounds";
                    task.vat = new bignumber.BigNumber(200);

                    const discount = <IDiscount>{};
                    discount.discountCode = "fakeTwelvePounds";
                    discount.discountValue = 1200;
                    discount.discountCategory = "F";
                    discount.discountEndDate = "";

                    mockCatalogService.getDiscounts = sandbox.stub().resolves([discount]);

                    chargeService.applyDiscountToTask(task, [discount], 'P', 'F', 'NODISCOUNT');

                    expect(task.discountAmount.toNumber()).toEqual(12); // 12 pounds
                    expect(task.grossTotal.toNumber()).toEqual(0);
                });

                it("with 10 GBP discount applied", () => {

                    task.addPartItem("", bNum(100), false, false, 1, 1, "", 0, 0);
                    task.discountCode = "fakeTenPounds";
                    task.vat = new bignumber.BigNumber(200);

                    const discount = <IDiscount>{};
                    discount.discountCode = "fakeTenPounds";
                    discount.discountValue = 1000;
                    discount.discountCategory = "F";
                    discount.discountEndDate = "";

                    mockCatalogService.getDiscounts = sandbox.stub().resolves([discount]);

                    chargeService.applyDiscountToTask(task, [discount], 'P', 'F', 'NODISCOUNT');
                    expect(task.grossTotal.toNumber()).toEqual(108);
                    expect(task.discountAmount.toNumber()).toEqual(10);
                });

                it("with discount greater than amount totals 0", () => {

                    task.addPartItem("", bNum(10), false, false, 1, 1, "", 0, 0);
                    task.discountCode = "fakeTenThousandPounds";

                    const discount = <IDiscount>{};
                    discount.discountCode = "fakeTenThousandPounds";
                    discount.discountValue = 100000;
                    discount.discountCategory = "F";
                    discount.discountEndDate = "";

                    mockCatalogService.getDiscounts = sandbox.stub().resolves([discount]);

                    chargeService.applyDiscountToTask(task, [discount], 'P', 'F', 'NODISCOUNT');
                    expect(task.grossTotal.toNumber()).toEqual(0);
                    expect(task.discountAmount.toNumber()).toEqual(1000);

                });

                /**
                 * related to defect, so scenario is: apply 50% discount, apply another discount after,
                 * wrong discount amount calculated
                 */

                it("applies correct discount after multiple changes", () => {

                    task.vat = new bignumber.BigNumber(250);
                    task.addPartItem("", bNum(16583), false, false, 1, 1, "", 0, 0);

                    const fiftyPercentDiscount = <IDiscount>{};
                    fiftyPercentDiscount.discountCode = "50p";
                    fiftyPercentDiscount.discountValue = 50;
                    fiftyPercentDiscount.discountCategory = "P";
                    fiftyPercentDiscount.discountEndDate = "";

                    const fifteenPercentDiscount = <IDiscount>{};
                    fifteenPercentDiscount.discountCode = "15p";
                    fifteenPercentDiscount.discountValue = 15;
                    fifteenPercentDiscount.discountCategory = "P";
                    fifteenPercentDiscount.discountEndDate = "";

                    const discounts = [fiftyPercentDiscount, fifteenPercentDiscount];
                    mockCatalogService.getDiscounts = sandbox.stub().resolves([fiftyPercentDiscount, fifteenPercentDiscount]);

                    task.discountCode = "15p";
                    chargeService.applyDiscountToTask(task, discounts, 'P', 'F', 'NODISCOUNT');
                    task.discountCode = "50p";
                    chargeService.applyDiscountToTask(task, discounts, 'P', 'F', 'NODISCOUNT');

                    expect(task.grossTotal.toNumber()).toEqual(10364.38);
                    expect(task.discountAmount.toNumber()).toEqual(8291.50);
                });

            });

            describe("rounding", () => {

                let task: ChargeableTask;
                let chargeableMain: Charge;

                beforeEach(() => {

                    chargeableMain = new Charge();
                    chargeableMain.tasks = [];

                    task = new ChargeableTask();
                    let t = new Task(false, false);
                    task.vat = new bignumber.BigNumber(200);
                    t.id = "1";
                    task.task = t;
                });

                it("rounds to two decimal places and uses those rounded amounts to calculate total", () => {

                    let fixedTask1 = new ChargeableTask();
                    fixedTask1.fixedPriceQuotationAmount = new bignumber.BigNumber(408.996);

                    let fixedTask2 = new ChargeableTask();
                    fixedTask2.fixedPriceQuotationAmount = new bignumber.BigNumber(78.996);

                    chargeableMain.tasks.push(fixedTask1);
                    chargeableMain.tasks.push(fixedTask2);

                    chargeService.updateTotals(chargeableMain);

                    expect(chargeableMain.chargeTotal.toNumber()).toEqual(488);
                });

            });

        });

        describe("apply charges based on task status", () => {

            let task = createTask("1", "SLO1S", "AS", "SLC", "17:00", "17:30", 30);
            let task2 = createTask("2", "SLO1S", "AT", "SLC", "17:00", "17:30", 30);

            let chargeType = createChargeType("SLO1S", "STD LAB ONLY-1S", "D", "Y", "N");

            let item = createJcChargeRule("1", "AS", "SLC", "SLO", "1S", "2007-09-24", END_DATE, null, "Y", 80, 40);
            let item2 = createJcChargeRule("2", "AT", "SLC", "SLO", "1S", "2007-09-24", END_DATE, null, "N", 20, 10);
            item.chargeRuleSequence = 12345;
            item.chargeRuleSequence = 56789;

            beforeEach(() => {
                mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);
                mockCatalogService.getChargeType = sandbox.stub().resolves(chargeType);

                jobChargeRules.push(item);
                jobChargeRules.push(item2);

                let getJCChargeRulesStub = mockCatalogService.getJCChargeRules = sandbox.stub();

                getJCChargeRulesStub
                    .withArgs("AS", "SLC").resolves([item])
                    .withArgs("AT", "SLC").resolves([item2]);

                let acr1 = createAreaChargeRule("AS", "SLC", "1S", "2016-11-01", END_DATE, "1", item.chargeRuleSequence);
                let acr2 = createAreaChargeRule("AT", "SLC", "1S", "2016-11-01", END_DATE, "1", item2.chargeRuleSequence);

                areaChargeRules.push(acr1);
                areaChargeRules.push(acr2);

                mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

            });

            it("should charge if completed task", async done => {
                // arrange

                task.status = "D";//done, today
                task2.status = "CX"; // complete/cancelled ==> category complete

                job.tasks = [];
                job.tasks.push(task);
                job.tasks.push(task2);

                mockJobService.getJob = sandbox.stub().resolves(job);

                // act
                const chargeableMain = await chargeService.applyCharges("1");

                const chargeableTasks = chargeableMain.tasks;

                // assert
                expect(chargeableTasks[0].labourItem.netAmount.toNumber()).toEqual(80);
                expect(chargeableTasks[1].labourItem.netAmount.toNumber()).toEqual(10);
                expect(chargeableMain.netTotal.toNumber()).toEqual(90);
                done();
            });

            it("should be zero charge if incomplete task", async done => {
                // arrange

                task.status = "D"; //done, today
                task2.status = "IZ"; // incomplete

                job.tasks = [];
                job.tasks.push(task);
                job.tasks.push(task2);

                mockJobService.getJob = sandbox.stub().resolves(job);

                // act
                const chargeableMain = await chargeService.applyCharges("1");
                const chargeableTasks = chargeableMain.tasks;

                // assert
                expect(chargeableTasks[0].labourItem.netAmount.toNumber()).toEqual(80);
                // expect(chargeableTasks[1]).toBeUndefined();
                expect(chargeableMain.netTotal.toNumber()).toEqual(80);
                done();
            });

            it("should be zero charge if no access", async done => {
                // arrange

                task.status = "D"; //done, today
                task2.status = "NA"; // no access

                job.tasks = [];
                job.tasks.push(task);
                job.tasks.push(task2);

                mockJobService.getJob = sandbox.stub().resolves(job);

                // act
                const chargeableMain = await chargeService.applyCharges("1");

                const chargeableTasks = chargeableMain.tasks;

                // assert
                expect(chargeableTasks[0].labourItem.netAmount.toNumber()).toEqual(80);
                expect(chargeableTasks[1].labourItem.netAmount.toNumber()).toEqual(0);
                expect(chargeableMain.netTotal.toNumber()).toEqual(80);
                done();
            });

            it("should be zero charge if not visited", async done => {
                // arrange

                task.status = "D"; //done, today
                task2.status = "VO"; // not visited

                job.tasks = [];
                job.tasks.push(task);
                job.tasks.push(task2);

                mockJobService.getJob = sandbox.stub().resolves(job);

                // act
                const chargeableMain = await chargeService.applyCharges("1");

                const chargeableTasks = chargeableMain.tasks;

                // assert
                expect(chargeableTasks[0].labourItem.netAmount.toNumber()).toEqual(80);
                expect(chargeableTasks[1].labourItem.netAmount.toNumber()).toEqual(0);
                expect(chargeableMain.netTotal.toNumber()).toEqual(80);
                done();
            });

            it("should exclude charge if cancelled ", async done => {
                // arrange

                task.status = "D"; //cancelled
                task2.status = "D"; // done today
                task.isMiddlewareDoTodayTask = true;

                job.tasks = [];
                job.tasks.push(task);
                job.tasks.push(task2);

                mockJobService.getJob = sandbox.stub().resolves(job);

                // act
                const chargeableMain = await chargeService.applyCharges("1");

                const chargeableTasks = chargeableMain.tasks;

                // assert
                expect(chargeableTasks.length).toEqual(2);
                expect(chargeableTasks[0].labourItem.netAmount.toNumber()).toEqual(80);
                expect(chargeableMain.netTotal.toNumber()).toEqual(90);

                done();
            });

            it("should exclude charge if no status ", async done => {
                // arrange

                task.status = undefined; //cancelled

                job.tasks = [];
                job.tasks.push(task);

                mockJobService.getJob = sandbox.stub().resolves(job);

                // act
                const chargeableMain = await chargeService.applyCharges("1");

                const chargeableTasks = chargeableMain.tasks;

                // assert
                expect(chargeableTasks.length).toEqual(0);
                done();
            });

        });

        describe("check if previous task there is a charge", () => {

            let task = createTask("1", "3SIS", "OD", "BBF", "17:00", "17:30", 30);
            let task2 = createTask("2", "3SIS", "OD", "BBF", "17:00", "17:30", 30);

            task.isCharge = true;
            task.isCharge = true;

            let previousTask = <Task>{};

            beforeEach(() => {

                job.tasks = [];

                job.history = <History>{};
                job.history.tasks = [];

                previousTask.id = "1";
                previousTask.activities = [];
            });

            it("returns false if previous visit, no matching appliances in last 12 months", () => {

                previousTask.applianceType = "CHB";

                job.tasks.push(task);
                job.tasks.push(task2);

                const activity = <Activity>{};
                activity.date = moment(new Date()).subtract(11, "months").toDate();
                previousTask.activities.push(activity);
                job.history.tasks.push(previousTask);

                const result = ChargeService.previousChargeSameAppliance(job, 12);

                expect(result).toBe(false);
            });

            it("returns true if previous visit, matching appliances in last 12 months", () => {

                previousTask.applianceType = "BBF";

                job.tasks.push(task);
                job.tasks.push(task2);

                const activity = <Activity>{};
                activity.date = moment(new Date()).subtract(11, "months").toDate();
                previousTask.activities.push(activity);
                job.history.tasks.push(previousTask);

                const result = ChargeService.previousChargeSameAppliance(job, 12);

                expect(result).toBe(true);
            });

            it("returns false if previous visit, matching appliances but before 12 months", () => {

                previousTask.applianceType = "BBF";

                job.tasks.push(task);
                job.tasks.push(task2);

                const activity = <Activity>{};
                activity.date = moment(new Date()).subtract(13, "months").toDate();
                previousTask.activities.push(activity);
                job.history.tasks.push(previousTask);

                const result = ChargeService.previousChargeSameAppliance(job, 12);

                expect(result).toBe(false);
            });

            it("retains previous charge isConfirmed state", async done => {

                previousTask.applianceType = "BBF";

                job.tasks.push(task);
                // job.tasks.push(task2);

                // assume that the job had some charges calculated
                job.charge = new Charge();
                job.charge.previousChargeSameApplianceConfirmed = true;
                job.charge.tasks = [];

                const chargeableTask = new ChargeableTask();
                chargeableTask.task = task;

                job.charge.tasks.push(chargeableTask);

                const activity = <Activity>{};
                activity.date = moment(new Date()).subtract(11, "months").toDate();
                previousTask.activities.push(activity);
                job.history.tasks.push(previousTask);

                mockJobService.getJob = sandbox.stub().resolves(job);
                mockCatalogService.getChargeType = sandbox.stub().resolves(task.chargeType);

                // act - should retain the charge, so doesn't keep asking for confirmation of warning message
                const chargeableMain = await chargeService.applyCharges("1");
                expect(chargeableMain.previousChargeSameApplianceConfirmed).toBe(true);
                done();
            });
        });

        describe("setting datastate to visitRequired if charge changed, and dontCare if no charge", () => {

            const chargeTypeCode = "SLO1S";
            let task = createTask("1", chargeTypeCode, "AS", "SLC", "17:00", "17:30", 30);
            let publishSpy: Sinon.SinonStub;
            let subscribeSpy: Sinon.SinonStub;

            let ea = <EventAggregator>{};

            beforeEach(() => {

                publishSpy = sandbox.stub();
                subscribeSpy = sandbox.stub();

                let chargeType = createChargeType(chargeTypeCode, "STD LAB ONLY-1S", "D", "Y", "N");

                let item = createJcChargeRule("1", "AS", "SLC", "SLO", "1S", "2007-09-24", END_DATE, null, "Y", 100, 100);
                jobChargeRules.push(item);

                mockCatalogService.getChargeType = sandbox.stub().resolves(chargeType);
                mockCatalogService.getJCChargeRules = sandbox.stub().resolves(jobChargeRules);

                let acr1 = createAreaChargeRule("AS", "SLC", "1S", "2016-11-01", END_DATE, "1", item.chargeRuleSequence);
                areaChargeRules.push(acr1);

                mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

                const discount = <IDiscount>{};
                discount.discountCode = "fakeTenPercent";
                discount.discountValue = 10;
                discount.discountCategory = "P";
                discount.discountEndDate = "";

                mockCatalogService.getDiscounts = sandbox.stub().resolves([discount]);

                job.id = "1";
                job.tasks.push(task);
                job.charge = new Charge();

                mockJobService.getJob = sandbox.stub().resolves(job);
                mockJobService.setJob = sandbox.stub().resolves(Promise.resolve());

                ea.publish = publishSpy;
                ea.subscribe = subscribeSpy;

                chargeService = new ChargeService(mockJobService, mockCatalogService, mockBusinessRuleService, ea,
                    chargeCatalogHelper, chargePartsHelperService, chargeLabourHelperService);
            });

            // defect was raised where, if we are in parts or activities, any changes require a datastate change,
            // change should only happen if genuine change

            it("if charge change updates data state", async done => {

                task.workDuration = 45;
                task.isCharge = true;
                ea.publish(ChargeServiceConstants.CHARGE_UPDATE_START, job.id);

                const delegate: (x: string) => Promise<void> = subscribeSpy.args[0][1];

                delegate(job.id).then(() => {
                    expect(publishSpy.args[0][0]).toEqual(ChargeServiceConstants.CHARGE_UPDATE_START);
                    expect(publishSpy.args[1][0]).toEqual(JobServiceConstants.JOB_DATA_STATE_CHANGED);
                    expect(publishSpy.args[2][0]).toEqual(ChargeServiceConstants.CHARGE_UPDATE_COMPLETED);
                    expect(job.charge.dataState).toEqual(DataState.notVisited);
                    done();
                });
            });

            it("if no charge change does not update data state", async done => {

                task.isCharge = false;

                ea.publish(ChargeServiceConstants.CHARGE_UPDATE_START, job.id);

                const delegate: (x: string) => Promise<void> = subscribeSpy.args[0][1];

                delegate(job.id).then(() => {
                    expect(publishSpy.args[0][0]).toEqual(ChargeServiceConstants.CHARGE_UPDATE_START);
                    expect(publishSpy.args[1][0]).toEqual(ChargeServiceConstants.CHARGE_UPDATE_COMPLETED);
                    expect(publishSpy.args[2][0]).toEqual(JobServiceConstants.JOB_DATA_STATE_CHANGED);
                    expect(job.charge.dataState).toEqual(DataState.dontCare);

                    done();
                });

            });
        });

        describe("previously fitted parts", () => {

            describe("previous activity with charge, 5 items, some chargeable, one not", () => {

                const vatCode = "D";
                let partsChargeTask;
                let activity;
                let p, p1, p2, p3, p4, p5;

                beforeEach(() => {

                    // parts charge
                    const partsChargeTypeCode = "ALP3SIS";
                    let partsChargeType = createChargeType(partsChargeTypeCode, "CHG PARTS ONLY-2SIM", vatCode, "N", "Y");
                    let partsFieldActivityChargeRule = createJcChargeRule("1", "HU", "CHB", "ALP", "3SIS", "2013-01-21", END_DATE, "", "N");

                    let partsToday: PartsToday = new PartsToday();
                    partsToday.parts = [];

                    partsChargeTask = createTask("4", partsChargeTypeCode, "HU", "CHB", "01/10/2099 17:00", "01/10/2099 18:21", 180);

                    mockPartService.getTodaysParts = sandbox.stub().resolves(partsToday);
                    mockPartService.getPartsBasket = sandbox.stub().resolves(null);

                    mockCatalogService.getChargeType = sandbox.stub()
                        .withArgs(partsChargeTypeCode).resolves(partsChargeType);
                    mockCatalogService.getJCChargeRules = sandbox.stub().resolves([partsFieldActivityChargeRule]);

                    let acr1 = createAreaChargeRule("HU", "CHB", "3SIS", "2016-11-01", END_DATE, "1", partsFieldActivityChargeRule.chargeRuleSequence);
                    areaChargeRules.push(acr1);
                    mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

                    activity = createTaskActivity("2017-08-17", "IA", 30);

                    p = new Part();
                    p.status = "CP";
                    p.description = undefined;
                    p.price = new bignumber.BigNumber(0);
                    p.quantity = 1;
                    p.quantityCharged = undefined;
                    p.stockReferenceId = "E41243";
                    p.taskId = partsChargeTask.id;

                    p1 = new Part();
                    p1.status = "UP";
                    p1.description = "Fan";
                    p1.price = new bignumber.BigNumber(10782.0);
                    p1.quantity = 1;
                    p1.quantityCharged = 1;
                    p1.stockReferenceId = "E66527";
                    p1.taskId = partsChargeTask.id;

                    p2 = new Part();
                    p2.status = "UP";
                    p2.description = "New part one";
                    p2.price = new bignumber.BigNumber(350.0);
                    p2.quantity = 1;
                    p2.quantityCharged = 1;
                    p2.stockReferenceId = "123456";
                    p2.taskId = partsChargeTask.id;

                    p3 = new Part();
                    p3.status = "UP";
                    p3.description = "New part two";
                    p3.price = new bignumber.BigNumber(1500.0);
                    p3.quantity = 1;
                    p3.quantityCharged = 1;
                    p3.stockReferenceId = "452143";
                    p3.taskId = partsChargeTask.id;

                    p4 = new Part();
                    p4.status = "UP";
                    p4.description = "New part three";
                    p4.price = new bignumber.BigNumber(93.0);
                    p4.quantity = 1;
                    p4.quantityCharged = 1;
                    p4.stockReferenceId = "147554";
                    p4.taskId = partsChargeTask.id;

                    p5 = new Part();
                    p5.status = "UP";
                    p5.description = "New part four";
                    p5.price = new bignumber.BigNumber(950.0);
                    p5.quantity = 1;
                    p5.quantityCharged = 1;
                    p5.stockReferenceId = "E41242";
                    p5.taskId = partsChargeTask.id;

                    partsChargeTask.activities = [activity];
                    partsChargeTask.isCharge = true;

                    //add tasks
                    job.tasks.push(partsChargeTask);

                    mockJobService.getJob = sandbox.stub().resolves(job);
                });

                it("includes parts charge when status another visit reqd, and van stock item", async done => {

                    activity.parts = [p, p1, p2, p3, p4, p5];
                    partsChargeTask.activities = [activity];

                    // act
                    const chargeableMain = await chargeService.applyCharges("1");
                    // assert
                    const chargeableTasks = chargeableMain.tasks;
                    expect(chargeableTasks[0].partItems.length).toEqual(6);

                    const [part, part1, part2, part3, part4, part5] = chargeableTasks[0].partItems;
                    expect(part.netAmount.toNumber()).toEqual(0);
                    expect(part1.netAmount.toNumber()).toEqual(10782);
                    expect(part2.netAmount.toNumber()).toEqual(350);
                    expect(part3.netAmount.toNumber()).toEqual(1500);
                    expect(part4.netAmount.toNumber()).toEqual(93);
                    expect(part5.netAmount.toNumber()).toEqual(950);
                    done();
                });

                it("sets isFromPreviousActivity flag to true on part item", async done => {
                    activity.parts = [p, p1, p2, p3, p4, p5];
                    partsChargeTask.activities = [activity];

                    // act
                    const chargeableMain = await chargeService.applyCharges("1");
                    // assert

                    const [task] = chargeableMain.tasks;
                    const [part1, part2] = task.partItems;

                    expect(part1.isFromPreviousActivity).toBe(true);
                    expect(part2.isFromPreviousActivity).toBe(true);

                    done();
                });

                it("sets parts charge to 0 for non-chargeable task, but  previous status another visit reqd, and van stock item", async done => {

                    const vatCode = "D";
                    let activity;
                    // parts charge
                    const partsChargeTypeCode = "NCHNONE";
                    let partsChargeType = createChargeType(partsChargeTypeCode, "NO CHARGe", vatCode, "N", "N");
                    let partsFieldActivityChargeType = createJcChargeRule("1", "HU", "CHB", "NCH", "3SIS", "2013-01-21", END_DATE, "", "N");
                    let partsToday: PartsToday = new PartsToday();
                    partsToday.parts = [];
                    let partsChargeTask1 = createTask("4", partsChargeTypeCode, "HU", "CHB", "01/10/2099 17:00", "01/10/2099 18:21", 180);

                    mockPartService.getTodaysParts = sandbox.stub().resolves(partsToday);
                    mockPartService.getPartsBasket = sandbox.stub().resolves(null);
                    mockCatalogService.getChargeType = sandbox.stub()
                        .withArgs(partsChargeTypeCode).resolves(partsChargeType);
                    mockCatalogService.getJCChargeRules = sandbox.stub().resolves([partsFieldActivityChargeType]);

                    activity = createTaskActivity("2017-08-17", "IA", 30);

                    p1 = new Part();
                    p1.status = "UP";
                    p1.description = "Fan";
                    p1.price = new bignumber.BigNumber(10782.0);
                    p1.quantity = 1;
                    p1.quantityCharged = 1;
                    p1.stockReferenceId = "E66527";
                    p1.taskId = partsChargeTask1.id;

                    p2 = new Part();
                    p2.status = "UP";
                    p2.description = "Fan";
                    p2.price = new bignumber.BigNumber(10782.0);
                    p2.quantity = 1;
                    p2.quantityCharged = 1;
                    p2.stockReferenceId = "E66527";
                    p2.taskId = partsChargeTask1.id;

                    activity.parts = [p1, p2];
                    partsChargeTask1.activities = [activity];

                    //add tasks
                    job.tasks.push(partsChargeTask1);

                    mockJobService.getJob = sandbox.stub().resolves(job);

                    // act
                    const chargeableMain = await chargeService.applyCharges("1");
                    // assert

                    const task = chargeableMain.tasks[1];
                    const [part] = task.partItems;

                    expect(part.netAmount.toNumber()).toBe(0);
                    expect(task.partItems.length).toBe(2);
                    expect(chargeableMain.tasks.length).toBe(2);
                    done();
                });
            });

            // see DF_1611
            it("excludes today's parts charge if standard labour charge task", async done => {

                const vatCode = "D";

                const noChargeTypeCode = "NCH2API";
                const tieredChargeTypeCode = "SLONONE";

                // task 1
                let task1 = createTask("1301387001001", noChargeTypeCode, "IB", "CIR", "01/10/2099 17:00", "01/10/2099 18:21", 180);
                task1.status = "C";
                task1.sequence = 1;
                let activity1 = createTaskActivity("2017-09-08", "C", 5);
                activity1.parts = [];
                task1.isCharge = false;

                // task 2
                let task2 = createTask("1301387001002", tieredChargeTypeCode, "XR", "CIR", "01/10/2099 17:00", "01/10/2099 18:21", 180);
                task2.status = "D";
                task2.sequence = 2;

                let activity2 = createTaskActivity("2017-09-08", "IP", 5);
                let activity3 = createTaskActivity("2017-08-17", "D", 30);

                let part = new Part();
                part.status = "AP";
                part.description = "Timer Mechanical EMT 2 TOTE";
                part.price = new bignumber.BigNumber(2838.0);
                part.quantity = 1;
                part.quantityCharged = 1;
                part.stockReferenceId = "555123";
                part.taskId = task2.id;

                activity2.parts = [part];
                activity3.parts = [part];

                task2.activities = [activity2, activity3];
                task2.isCharge = true;

                //add tasks
                job.tasks = [task1, task2];

                mockJobService.getJob = sandbox.stub().resolves(job);

                // no charge
                let noChargeType = createChargeType(noChargeTypeCode, "NO CHARGE-NONE", vatCode, "N", "N");
                let noChargeFieldActivityChargeType = createJcChargeRule("1", "IB", "CIR", "NCH", "2API", "2007-03-21", "31-DEC-2050", null, "N");

                // tiered charge
                let tieredChargeType = createChargeType(tieredChargeTypeCode, "STD LAB ONLY-NONE", vatCode, "Y", "N");
                let tieredFieldActivityChargeType = createJcChargeRule("3632", "XR", "CIR", "SLO", "NONE", "2012-11-15", "2050-12-31", "3N", "Y");

                // mock catalog
                jobChargeRules.push(noChargeFieldActivityChargeType);
                jobChargeRules.push(tieredFieldActivityChargeType);

                mockCatalogService.getChargeType = sandbox.stub()
                    .withArgs(noChargeTypeCode).resolves(noChargeType)
                    .withArgs(tieredChargeTypeCode).resolves(tieredChargeType);

                mockCatalogService.getJCChargeRules = sandbox.stub().resolves(jobChargeRules);
                mockCatalogService.getPrimeChargeIntervals = sandbox.stub().resolves(primeChargeIntervals);
                mockCatalogService.getSubsequentChargeIntervals = sandbox.stub().resolves(subsequentChargeIntervals);

                let partsToday: PartsToday = new PartsToday();
                partsToday.parts = [part];
                mockPartService.getTodaysParts = sandbox.stub().resolves(partsToday);

                // act
                const chargeableMain = await chargeService.applyCharges("1");
                // assert
                const chargeableTasks = chargeableMain.tasks;
                expect(chargeableTasks[1].netTotal.toNumber()).toEqual(0);
                expect(chargeableMain.netTotal.toNumber()).toEqual(0);
                done();
            });

            // parts only charge task (e.g. CPO)
            // first visit - 2 parts are ordered
            // second visit - the 2 parts are in today's ordered
            // of those 1 of those is NOT in warranty, 1 is NOT used
            // in addition 1 part added to vanstock, and 2 ordered (NOT in vanstock)
            // set status to another visit required
            //
            // what we expect
            // in total we have 5 parts (2 todays order, 1 vanstock, 2 ordered)
            // 1 today's ordered charged, 1 vanstock
            //
            // what we expect
            // in the charges we expect not used part not be calculated (be nice to show) - this works
            // the van stock from previous activties parts required status IP is shown in charges - this fails

            describe("complex scenario multiple visits, previous fitted parts ordered, not used, warranty, and vanstock", () => {

                const vatCode = "D";
                let partsChargeTask;
                let p1, p2, p3, p4, p5, p6, p7, p8, p9, p10;

                beforeEach(() => {

                    // parts charge
                    const partsChargeTypeCode = "ALP3SIS";
                    let partsChargeType = createChargeType(partsChargeTypeCode, "CHG PARTS ONLY-2SIM", vatCode, "N", "Y");
                    let partsFieldActivityChargeRule = createJcChargeRule("1", "HU", "BBF", "ALP", "3SIS", "2013-01-21", END_DATE, "", "N");

                    partsChargeTask = createTask("4", partsChargeTypeCode, "HU", "BBF", "01/10/2099 17:00", "01/10/2099 18:21", 180);

                    mockCatalogService.getChargeType = sandbox.stub()
                        .withArgs(partsChargeTypeCode).resolves(partsChargeType);
                    mockCatalogService.getJCChargeRules = sandbox.stub().resolves([partsFieldActivityChargeRule]);

                    let acr1 = createAreaChargeRule("HU", "BBF", "3SIS", "2016-11-01", END_DATE, "1", partsFieldActivityChargeRule.chargeRuleSequence);
                    areaChargeRules.push(acr1);
                    mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

                    p1 = new Part();
                    p1.status = "AP";
                    p1.description = "Filter - Fan Oven Element";
                    p1.price = new bignumber.BigNumber(2756);
                    p1.quantity = 1;
                    p1.quantityCharged = 1;
                    p1.stockReferenceId = "E51256";
                    p1.taskId = partsChargeTask.id;

                    p2 = new Part();
                    p2.status = "AP";
                    p2.description = "Filter - Fan Oven Element";
                    p2.price = new bignumber.BigNumber(2120.0);
                    p2.quantity = 1;
                    p2.quantityCharged = 1;
                    p2.stockReferenceId = "E17712";
                    p2.taskId = partsChargeTask.id;

                    let firstVisitActivity = createTaskActivity("2017-08-17", "IP", 30);
                    firstVisitActivity.parts = [p1, p2];

                    p3 = new Part();
                    p3.status = "FP";
                    p3.description = "Filter - Fan Oven Element";
                    p3.price = new bignumber.BigNumber(2756.0);
                    p3.quantity = 1;
                    p3.quantityCharged = 1;
                    p3.stockReferenceId = "E51256";
                    p3.taskId = partsChargeTask.id;

                    p4 = new Part();
                    p4.status = "FP";
                    p4.description = "Filter - Fan Oven Element";
                    p4.price = new bignumber.BigNumber(2120.0);
                    p4.quantity = 1;
                    p4.quantityCharged = 1;
                    p4.stockReferenceId = "E17712";
                    p4.taskId = partsChargeTask.id;

                    p5 = new Part();
                    p5.status = "NU";
                    p5.price = new bignumber.BigNumber(0);
                    p5.quantity = 1;
                    p5.stockReferenceId = "E17712";
                    p5.taskId = partsChargeTask.id;

                    p6 = new Part();
                    p6.status = "AP";
                    p6.description = "Feet - Wire Rack - High";
                    p6.price = new bignumber.BigNumber(187.0);
                    p6.quantity = 1;
                    p6.quantityCharged = 1;
                    p6.stockReferenceId = "H58005";
                    p6.taskId = partsChargeTask.id;

                    p7 = new Part();
                    p7.status = "AP";
                    p7.description = "Motor - 3 Wire - 348 Type";
                    p7.price = new bignumber.BigNumber(9077.0);
                    p7.quantity = 1;
                    p7.quantityCharged = 1;
                    p7.stockReferenceId = "648041";
                    p7.taskId = partsChargeTask.id;

                    p8 = new Part();
                    p8.status = "UP";
                    p8.description = "Shelf - Wire";
                    p8.price = new bignumber.BigNumber(1330.0);
                    p8.quantity = 1;
                    p8.quantityCharged = 1;
                    p8.stockReferenceId = "779850";
                    p8.taskId = partsChargeTask.id;

                    let secondVisitActivity = createTaskActivity("2017-08-17", "IP", 30);
                    secondVisitActivity.parts = [p3, p4, p5, p6, p7, p8];

                    p9 = new Part();
                    p9.status = "FP";
                    p9.description = "Feet - Wire Rack - High";
                    p9.price = new bignumber.BigNumber(187.0);
                    p9.quantity = 1;
                    p9.quantityCharged = 1;
                    p9.stockReferenceId = "H58005";
                    p9.taskId = partsChargeTask.id;

                    p10 = new Part();
                    p10.status = "FP";
                    p10.description = "Motor - 3 Wire - 348 Type";
                    p10.price = new bignumber.BigNumber(9077.0);
                    p10.quantity = 1;
                    p10.quantityCharged = 1;
                    p10.stockReferenceId = "648041";
                    p10.taskId = partsChargeTask.id;

                    // let currentActivity = createTaskActivity("2017-08-17", "D", 30);
                    // currentActivity.parts = [p8, p9];

                    let partsToday: PartsToday = new PartsToday();
                    partsToday.parts = [p9, p10];
                    mockPartService.getTodaysParts = sandbox.stub().resolves(partsToday);
                    partsChargeTask.activities = [firstVisitActivity, secondVisitActivity];
                    partsChargeTask.isCharge = true;

                    //add task
                    job.tasks.push(partsChargeTask);

                    mockJobService.getJob = sandbox.stub().resolves(job);

                });

                it("excludes available and not used part status", async done => {
                    const charges = await chargeService.applyCharges("1");
                    expect(charges.tasks[0].partItems.length).toEqual(5);
                    done();
                });

                // in the example data there is a NU part, look for that stock item, and subtract its quantity from

                it("decrements quantity charged when not used part and sets return quantity when not used (NU) previous part", async done => {
                    const charges = await chargeService.applyCharges("1");
                    const [task] = charges.tasks;
                    const {partItems} = task;
                    const partNotUsed = partItems.find(p => p.stockReferenceId === "E17712" && p.status === "FP");
                    expect(partNotUsed.qtyCharged).toEqual(0);
                    expect(partNotUsed.returnQty).toEqual(1);
                    done();
                });
            });

            describe("previous activity with charge, 5 items, some chargeable, one not", () => {

                const vatCode = "D";
                let partsChargeTask;
                let activity;
                let p, p1, p2, p3, p4, p5;

                beforeEach(() => {

                    // parts charge
                    const partsChargeTypeCode = "ALP3SIS";
                    let partsChargeType = createChargeType(partsChargeTypeCode, "CHG PARTS ONLY-2SIM", vatCode, "N", "Y");
                    let partsFieldActivityChargeRule = createJcChargeRule("1", "HU", "BBF", "ALP", "3SIS", "2013-01-21", END_DATE, "", "N");

                    let partsToday: PartsToday = new PartsToday();
                    partsToday.parts = [];

                    partsChargeTask = createTask("4", partsChargeTypeCode, "HU", "BBF", "01/10/2099 17:00", "01/10/2099 18:21", 180);

                    mockPartService.getTodaysParts = sandbox.stub().resolves(partsToday);
                    mockPartService.getPartsBasket = sandbox.stub().resolves(null);

                    mockCatalogService.getChargeType = sandbox.stub()
                        .withArgs(partsChargeTypeCode).resolves(partsChargeType);
                    mockCatalogService.getJCChargeRules = sandbox.stub().resolves([partsFieldActivityChargeRule]);

                    let acr1 = createAreaChargeRule("HU", "BBF", "3SIS", "2016-11-01", END_DATE, "1", partsFieldActivityChargeRule.chargeRuleSequence);
                    areaChargeRules.push(acr1);
                    mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

                    activity = createTaskActivity("2017-08-17", "IA", 30);

                    p = new Part();
                    p.status = "CP";
                    p.description = undefined;
                    p.price = new bignumber.BigNumber(0);
                    p.quantity = 1;
                    p.quantityCharged = undefined;
                    p.stockReferenceId = "E41243";
                    p.taskId = partsChargeTask.id;

                    p1 = new Part();
                    p1.status = "UP";
                    p1.description = "Fan";
                    p1.price = new bignumber.BigNumber(10782.0);
                    p1.quantity = 1;
                    p1.quantityCharged = 1;
                    p1.stockReferenceId = "E66527";
                    p1.taskId = partsChargeTask.id;

                    p2 = new Part();
                    p2.status = "UP";
                    p2.description = "New part one";
                    p2.price = new bignumber.BigNumber(350.0);
                    p2.quantity = 1;
                    p2.quantityCharged = 1;
                    p2.stockReferenceId = "123456";
                    p2.taskId = partsChargeTask.id;

                    p3 = new Part();
                    p3.status = "UP";
                    p3.description = "New part two";
                    p3.price = new bignumber.BigNumber(1500.0);
                    p3.quantity = 1;
                    p3.quantityCharged = 1;
                    p3.stockReferenceId = "452143";
                    p3.taskId = partsChargeTask.id;

                    p4 = new Part();
                    p4.status = "UP";
                    p4.description = "New part three";
                    p4.price = new bignumber.BigNumber(93.0);
                    p4.quantity = 1;
                    p4.quantityCharged = 1;
                    p4.stockReferenceId = "147554";
                    p4.taskId = partsChargeTask.id;

                    p5 = new Part();
                    p5.status = "UP";
                    p5.description = "New part four";
                    p5.price = new bignumber.BigNumber(950.0);
                    p5.quantity = 1;
                    p5.quantityCharged = 1;
                    p5.stockReferenceId = "E41242";
                    p5.taskId = partsChargeTask.id;

                    partsChargeTask.activities = [activity];
                    partsChargeTask.isCharge = true;

                    //add tasks
                    job.tasks.push(partsChargeTask);

                    mockJobService.getJob = sandbox.stub().resolves(job);

                });

                it("includes parts charge when status another visit reqd, and van stock item", async done => {

                    activity.parts = [p, p1, p2, p3, p4, p5];
                    partsChargeTask.activities = [activity];

                    // act
                    const chargeableMain = await chargeService.applyCharges("1");
                    // assert
                    const chargeableTasks = chargeableMain.tasks;
                    expect(chargeableTasks[0].partItems.length).toEqual(6);

                    const [part, part1, part2, part3, part4, part5] = chargeableTasks[0].partItems;
                    expect(part.netAmount.toNumber()).toEqual(0);
                    expect(part1.netAmount.toNumber()).toEqual(10782);
                    expect(part2.netAmount.toNumber()).toEqual(350);
                    expect(part3.netAmount.toNumber()).toEqual(1500);
                    expect(part4.netAmount.toNumber()).toEqual(93);
                    expect(part5.netAmount.toNumber()).toEqual(950);
                    done();
                });

                it("sets isFromPreviousActivity flag to true on part item", async done => {
                    activity.parts = [p, p1, p2, p3, p4, p5];
                    partsChargeTask.activities = [activity];

                    // act
                    const chargeableMain = await chargeService.applyCharges("1");
                    // assert

                    const [task] = chargeableMain.tasks;
                    const [part1, part2] = task.partItems;

                    expect(part1.isFromPreviousActivity).toBe(true);
                    expect(part2.isFromPreviousActivity).toBe(true);

                    done();
                });

                it("sets parts charge to 0 for non-chargeable task, but  previous status another visit reqd, and van stock item", async done => {

                    const vatCode = "D";
                    let activity;
                    // parts charge
                    const partsChargeTypeCode = "NCHNONE";
                    let partsChargeType = createChargeType(partsChargeTypeCode, "NO CHARGe", vatCode, "N", "N");
                    let partsFieldActivityChargeType = createJcChargeRule("1", "HU", "CHB", "NCH", "3SIS", "2013-01-21", END_DATE, "", "N");
                    let partsToday: PartsToday = new PartsToday();
                    partsToday.parts = [];
                    let partsChargeTask1 = createTask("4", partsChargeTypeCode, "HU", "CHB", "01/10/2099 17:00", "01/10/2099 18:21", 180);

                    mockPartService.getTodaysParts = sandbox.stub().resolves(partsToday);
                    mockPartService.getPartsBasket = sandbox.stub().resolves(null);
                    mockCatalogService.getChargeType = sandbox.stub()
                        .withArgs(partsChargeTypeCode).resolves(partsChargeType);
                    mockCatalogService.getJCChargeRules = sandbox.stub().resolves([partsFieldActivityChargeType]);

                    activity = createTaskActivity("2017-08-17", "IA", 30);

                    p1 = new Part();
                    p1.status = "UP";
                    p1.description = "Fan";
                    p1.price = new bignumber.BigNumber(10782.0);
                    p1.quantity = 1;
                    p1.quantityCharged = 1;
                    p1.stockReferenceId = "E66527";
                    p1.taskId = partsChargeTask1.id;

                    p2 = new Part();
                    p2.status = "UP";
                    p2.description = "Fan";
                    p2.price = new bignumber.BigNumber(10782.0);
                    p2.quantity = 1;
                    p2.quantityCharged = 1;
                    p2.stockReferenceId = "E66527";
                    p2.taskId = partsChargeTask1.id;

                    activity.parts = [p1, p2];
                    partsChargeTask1.activities = [activity];

                    //add tasks
                    job.tasks.push(partsChargeTask1);

                    mockJobService.getJob = sandbox.stub().resolves(job);

                    // act
                    const chargeableMain = await chargeService.applyCharges("1");
                    // assert

                    const task = chargeableMain.tasks[1];
                    const [part] = task.partItems;

                    expect(part.netAmount.toNumber()).toBe(0);
                    expect(task.partItems.length).toBe(2);
                    expect(chargeableMain.tasks.length).toBe(2);
                    done();
                });
            });

            // see DF_1611
            it("excludes today's parts charge if standard labour charge task", async done => {

                const vatCode = "D";

                const noChargeTypeCode = "NCH2API";
                const tieredChargeTypeCode = "SLONONE";

                // task 1
                let task1 = createTask("1301387001001", noChargeTypeCode, "IB", "CIR", "01/10/2099 17:00", "01/10/2099 18:21", 180);
                task1.status = "C";
                task1.sequence = 1;
                let activity1 = createTaskActivity("2017-09-08", "C", 5);
                activity1.parts = [];
                task1.isCharge = false;

                // task 2
                let task2 = createTask("1301387001002", tieredChargeTypeCode, "XR", "CIR", "01/10/2099 17:00", "01/10/2099 18:21", 180);
                task2.status = "D";
                task2.sequence = 2;

                let activity2 = createTaskActivity("2017-09-08", "IP", 5);
                let activity3 = createTaskActivity("2017-08-17", "D", 30);

                let part = new Part();
                part.status = "AP";
                part.description = "Timer Mechanical EMT 2 TOTE";
                part.price = new bignumber.BigNumber(2838.0);
                part.quantity = 1;
                part.quantityCharged = 1;
                part.stockReferenceId = "555123";
                part.taskId = task2.id;

                activity2.parts = [part];
                activity3.parts = [part];

                task2.activities = [activity2, activity3];
                task2.isCharge = true;

                //add tasks
                job.tasks = [task1, task2];

                mockJobService.getJob = sandbox.stub().resolves(job);

                // no charge
                let noChargeType = createChargeType(noChargeTypeCode, "NO CHARGE-NONE", vatCode, "N", "N");
                let noChargeFieldActivityChargeType = createJcChargeRule("1", "IB", "CIR", "NCH", "2API", "2007-03-21", "31-DEC-2050", null, "N");

                // tiered charge
                let tieredChargeType = createChargeType(tieredChargeTypeCode, "STD LAB ONLY-NONE", vatCode, "Y", "N");
                let tieredFieldActivityChargeType = createJcChargeRule("3632", "XR", "CIR", "SLO", "NONE", "2012-11-15", "2050-12-31", "3N", "Y");

                // mock catalog
                jobChargeRules.push(noChargeFieldActivityChargeType);
                jobChargeRules.push(tieredFieldActivityChargeType);

                mockCatalogService.getChargeType = sandbox.stub()
                    .withArgs(noChargeTypeCode).resolves(noChargeType)
                    .withArgs(tieredChargeTypeCode).resolves(tieredChargeType);

                mockCatalogService.getJCChargeRules = sandbox.stub().resolves(jobChargeRules);
                mockCatalogService.getPrimeChargeIntervals = sandbox.stub().resolves(primeChargeIntervals);
                mockCatalogService.getSubsequentChargeIntervals = sandbox.stub().resolves(subsequentChargeIntervals);

                let partsToday: PartsToday = new PartsToday();
                partsToday.parts = [part];
                mockPartService.getTodaysParts = sandbox.stub().resolves(partsToday);

                // act
                const chargeableMain = await chargeService.applyCharges("1");
                // assert
                const chargeableTasks = chargeableMain.tasks;
                expect(chargeableTasks[1].netTotal.toNumber()).toEqual(0);
                expect(chargeableMain.netTotal.toNumber()).toEqual(0);
                done();
            });

            // see DF
            // parts only charge task (e.g. CPO)

            // first visit - 2 parts are ordered

            // second visit - the 2 parts are in today's ordered

            // of those 1 of those is NOT in warranty, 1 is NOT used
            // in addition 1 part added to vanstock, and 2 ordered (NOT in vanstock)
            // set status to another visit required
            //
            // what we expect
            // in total we have 5 parts (2 todays order, 1 vanstock, 2 ordered)
            // 1 today's ordered charged, 1 vanstock
            //
            // what we expect
            // in the charges we expect not used part not be calculated (be nice to show) - this works
            // the van stock from previous activties parts required status IP is shown in charges - this fails

            describe("complex scenario multiple visits, previous fitted parts ordered, not used, warranty, and vanstock", () => {

                const vatCode = "D";
                let partsChargeTask;
                let p1, p2, p3, p4, p5, p6, p7, p8, p9, p10;

                beforeEach(() => {

                    // parts charge
                    const partsChargeTypeCode = "ALP3SIS";
                    let partsChargeType = createChargeType(partsChargeTypeCode, "CHG PARTS ONLY-2SIM", vatCode, "N", "Y");
                    let partsFieldActivityChargeRule = createJcChargeRule("1", "HU", "BBF", "ALP", "3SIS", "2013-01-21", END_DATE, "", "N");

                    partsChargeTask = createTask("4", partsChargeTypeCode, "HU", "BBF", "01/10/2099 17:00", "01/10/2099 18:21", 180);

                    mockCatalogService.getChargeType = sandbox.stub()
                        .withArgs(partsChargeTypeCode).resolves(partsChargeType);
                    mockCatalogService.getJCChargeRules = sandbox.stub().resolves([partsFieldActivityChargeRule]);

                    let acr1 = createAreaChargeRule("HU", "BBF", "3SIS", "2016-11-01", END_DATE, "1", partsFieldActivityChargeRule.chargeRuleSequence);
                    areaChargeRules.push(acr1);
                    mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);

                    p1 = new Part();
                    p1.status = "AP";
                    p1.description = "Filter - Fan Oven Element";
                    p1.price = new bignumber.BigNumber(2756);
                    p1.quantity = 1;
                    p1.quantityCharged = 1;
                    p1.stockReferenceId = "E51256";
                    p1.taskId = partsChargeTask.id;

                    p2 = new Part();
                    p2.status = "AP";
                    p2.description = "Filter - Fan Oven Element";
                    p2.price = new bignumber.BigNumber(2120.0);
                    p2.quantity = 1;
                    p2.quantityCharged = 1;
                    p2.stockReferenceId = "E17712";
                    p2.taskId = partsChargeTask.id;

                    let firstVisitActivity = createTaskActivity("2017-08-17", "IP", 30);
                    firstVisitActivity.parts = [p1, p2];

                    p3 = new Part();
                    p3.status = "FP";
                    p3.description = "Filter - Fan Oven Element";
                    p3.price = new bignumber.BigNumber(2756.0);
                    p3.quantity = 1;
                    p3.quantityCharged = 1;
                    p3.stockReferenceId = "E51256";
                    p3.taskId = partsChargeTask.id;

                    p4 = new Part();
                    p4.status = "FP";
                    p4.description = "Filter - Fan Oven Element";
                    p4.price = new bignumber.BigNumber(2120.0);
                    p4.quantity = 1;
                    p4.quantityCharged = 1;
                    p4.stockReferenceId = "E17712";
                    p4.taskId = partsChargeTask.id;

                    p5 = new Part();
                    p5.status = "NU";
                    p5.price = new bignumber.BigNumber(0);
                    p5.quantity = 1;
                    p5.stockReferenceId = "E17712";
                    p5.taskId = partsChargeTask.id;

                    p6 = new Part();
                    p6.status = "AP";
                    p6.description = "Feet - Wire Rack - High";
                    p6.price = new bignumber.BigNumber(187.0);
                    p6.quantity = 1;
                    p6.quantityCharged = 1;
                    p6.stockReferenceId = "H58005";
                    p6.taskId = partsChargeTask.id;

                    p7 = new Part();
                    p7.status = "AP";
                    p7.description = "Motor - 3 Wire - 348 Type";
                    p7.price = new bignumber.BigNumber(9077.0);
                    p7.quantity = 1;
                    p7.quantityCharged = 1;
                    p7.stockReferenceId = "648041";
                    p7.taskId = partsChargeTask.id;

                    p8 = new Part();
                    p8.status = "UP";
                    p8.description = "Shelf - Wire";
                    p8.price = new bignumber.BigNumber(1330.0);
                    p8.quantity = 1;
                    p8.quantityCharged = 1;
                    p8.stockReferenceId = "779850";
                    p8.taskId = partsChargeTask.id;

                    let secondVisitActivity = createTaskActivity("2017-08-17", "IP", 30);
                    secondVisitActivity.parts = [p3, p4, p5, p6, p7, p8];

                    p9 = new Part();
                    p9.status = "FP";
                    p9.description = "Feet - Wire Rack - High";
                    p9.price = new bignumber.BigNumber(187.0);
                    p9.quantity = 1;
                    p9.quantityCharged = 1;
                    p9.stockReferenceId = "H58005";
                    p9.taskId = partsChargeTask.id;

                    p10 = new Part();
                    p10.status = "FP";
                    p10.description = "Motor - 3 Wire - 348 Type";
                    p10.price = new bignumber.BigNumber(9077.0);
                    p10.quantity = 1;
                    p10.quantityCharged = 1;
                    p10.stockReferenceId = "648041";
                    p10.taskId = partsChargeTask.id;

                    // let currentActivity = createTaskActivity("2017-08-17", "D", 30);
                    // currentActivity.parts = [p8, p9];

                    let partsToday: PartsToday = new PartsToday();
                    partsToday.parts = [p9, p10];
                    mockPartService.getTodaysParts = sandbox.stub().resolves(partsToday);
                    partsChargeTask.activities = [firstVisitActivity, secondVisitActivity];
                    partsChargeTask.isCharge = true;

                    //add task
                    job.tasks.push(partsChargeTask);

                    mockJobService.getJob = sandbox.stub().resolves(job);

                });

                it("excludes available and not used part status", async done => {
                    const charges = await chargeService.applyCharges("1");
                    expect(charges.tasks[0].partItems.length).toEqual(5);
                    done();
                });

                // in the example data there is a NU part, look for that stock item, and subtract its quantity from

                it("decrements quantity charged when not used part and sets return quantity when not used (NU) previous part", async done => {
                    const charges = await chargeService.applyCharges("1");

                    const [task] = charges.tasks;
                    const {partItems} = task;
                    const partNotUsed = partItems.find(p => p.stockReferenceId === "E17712" && p.status === "FP");
                    expect(partNotUsed.qtyCharged).toEqual(0);
                    expect(partNotUsed.returnQty).toEqual(1);
                    done();
                })
            });
        });

        describe("edge cases - defects identified", () => {

            // want to make sure that calling chargeService.applyCharges with a jobId, updates and calculates correct totals
            describe("calculates totals and set charges for given job", () => {

                const chargeTypeCode = "SLO1S";
                const task = createTask("1", chargeTypeCode, "AS", "SLC", "17:00", "17:30", 30);
                let chargeRule = createJcChargeRule("1", "AS", "SLC", "SLO", "1S", "2007-09-24", END_DATE, null, "Y", 100, 100);
                chargeRule.chargeRuleSequence = 45369;

                beforeEach(() => {
                    let chargeType = createChargeType(chargeTypeCode, "STD LAB ONLY-1S", "D", "Y", "N");

                    jobChargeRules.push(chargeRule);

                    mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);
                    mockCatalogService.getChargeType = sandbox.stub().resolves(chargeType);
                    mockCatalogService.getJCChargeRules = sandbox.stub().resolves(jobChargeRules);

                    const discount = <IDiscount>{};
                    discount.discountCode = "fakeTenPercent";
                    discount.discountValue = 10;
                    discount.discountCategory = "P";
                    discount.discountEndDate = "";

                    mockCatalogService.getDiscounts = sandbox.stub().resolves([discount]);

                    let activity = createTaskActivity("2016-10-18", "IP", 0);
                    task.activities.push(activity);

                    let acr1 = createAreaChargeRule("AS", "SLC", "1S", "2016-11-01", END_DATE, "1", chargeRule.chargeRuleSequence);
                    areaChargeRules.push(acr1);
                    mockCatalogService.getChargeType = sandbox.stub().resolves(chargeType);

                });

                it("should return totals when calling applyCharges", async done => {

                    job.tasks.push(task);
                    mockJobService.getJob = sandbox.stub().resolves(job);

                    const model = await chargeService.applyCharges("3344");
                    expect(model).toBeDefined();

                    expect(model.chargeTotal.toNumber()).toEqual(120);
                    expect(model.grossTotal.toNumber()).toEqual(120);
                    expect(model.netTotal.toNumber()).toEqual(100);
                    expect(model.totalVatAmount.toNumber()).toEqual(20);
                    expect(model.discountAmount.toNumber()).toEqual(0);
                    done();
                });


                it("should return totals and apply discount when calling applyCharges", async done => {

                    task.discountCode = "fakeTenPercent";
                    task.id = "1";
                    job.tasks.push(task);

                    // discount applied before
                    job.charge = new Charge();
                    job.charge.tasks = [];
                    let ct = new ChargeableTask();

                    ct.discountCode = task.discountCode;
                    ct.task = task;
                    job.charge.tasks.push(ct);

                    mockJobService.getJob = sandbox.stub().resolves(job);

                    const model = await chargeService.applyCharges("3344");
                    expect(model).toBeDefined();

                    expect(model.tasks[0].netTotal.toNumber()).toEqual(90);

                    expect(model.chargeTotal.toNumber()).toEqual(108);
                    expect(model.grossTotal.toNumber()).toEqual(108);
                    expect(model.netTotal.toNumber()).toEqual(90);
                    expect(model.totalVatAmount.toNumber()).toEqual(18);
                    expect(model.discountAmount.toNumber()).toEqual(10);
                    done();
                });

            });

            describe("prior date vat codes", () => {

                const chargeTypeCode = "SLO1S";

                const createVatCode = (code: string, rate: number, startDate: string, endDate: string = ""): IVat => {
                    let vat = <IVat>{};
                    vat.vatCode = code;
                    vat.vatRate = rate;
                    vat.vatStartDate = startDate;
                    vat.vatEndDate = endDate;
                    return vat;
                };

                let vatCodes = [];
                vatCodes.push(createVatCode("D", 150, "2008-12-01", "2009-12-31"));
                vatCodes.push(createVatCode("D", 175, "1996-01-01", "2008-11-30"));
                vatCodes.push(createVatCode("D", 200, "2011-01-04", "2017-05-14"));
                vatCodes.push(createVatCode("D", 250, "2017-05-15", "2099-12-30"));

                beforeEach(() => {

                    let chargeType = createChargeType(chargeTypeCode, "STD LAB ONLY-1S", "D", "Y", "N");

                    let item = createJcChargeRule("1", "AS", "SLC", "SLO", "1S", "2007-09-24", END_DATE, null, "Y", 100, 100);
                    jobChargeRules.push(item);

                    mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);
                    mockCatalogService.getChargeType = sandbox.stub().resolves(chargeType);
                    mockCatalogService.getJCChargeRules = sandbox.stub().resolves(jobChargeRules);
                    mockCatalogService.getVats = sandbox.stub().resolves(vatCodes);
                });

                it("should use latest vat code when task date lies within start and end date", async done => {

                    let task = createTask("1", chargeTypeCode, "FV", "BBC", "2099-10-01 17:00", "2099-10-01 18:21", 121);

                    job.tasks.push(task);
                    mockJobService.getJob = sandbox.stub().resolves(job);

                    const data = await chargeService.applyCharges(job.id);
                    expect(data.tasks[0].vatCode).toEqual("D");
                    expect(data.tasks[0].vat.toNumber()).toEqual(250);

                    done();
                });

                it("should use latest vat code, i.e. empty vat end date", async done => {

                    vatCodes.push(createVatCode("D", 500, "2100-01-01", ""));

                    let task = createTask("1", chargeTypeCode, "FV", "BBC", "2100-01-01 17:00", "2100-01-01 18:21", 121);

                    job.tasks.push(task);
                    mockJobService.getJob = sandbox.stub().resolves(job);

                    const data = await chargeService.applyCharges(job.id);
                    expect(data.tasks[0].vatCode).toEqual("D");
                    expect(data.tasks[0].vat.toNumber()).toEqual(500);

                    done();
                });
            });

        });
    });

});

