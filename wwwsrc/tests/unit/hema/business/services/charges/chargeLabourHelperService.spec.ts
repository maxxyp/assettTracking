import { Helper } from "../../../../unitHelpers/chargeTestHelper.spec";
import { ChargeLabourHelperService } from "../../../../../../app/hema/business/services/charge/chargeLabourHelperService";
import { ICatalogService } from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import { IAreaChargeRules } from "../../../../../../app/hema/business/models/reference/IAreaChargeRules";
import { IJcChargeRules } from "../../../../../../app/hema/business/models/reference/IJcChargeRules";
import { IPrimeChargeInterval } from "../../../../../../app/hema/business/models/reference/IPrimeChargeInterval";
import { ISubsqntChargeInterval } from "../../../../../../app/hema/business/models/reference/ISubsqntChargeInterval";
import { ChargeableTask } from "../../../../../../app/hema/business/models/charge/chargeableTask";
import { IChargeLabourCatalogDependencies } from "../../../../../../app/hema/business/services/interfaces/charge/IChargeLabourCatalogDependencies";
import * as moment from "moment";
import * as bignumber from "bignumber";

const {createTask, createChargeType, createJcChargeRule, createTaskActivity, createLabourChargeRuleCode, createPrimeChargeInterval} = Helper;

describe("chargeLabourHelperService", () => {

    let sandbox: Sinon.SinonSandbox;
    let chargeLabourHelperService: ChargeLabourHelperService;
    let cTask: ChargeableTask;

    const chargeTypeCode = "NCHNONE";
    const vatCode = "D";
    let mockCatalogService: ICatalogService;
    let areaChargeRules: IAreaChargeRules [];
    let jobChargeRules: IJcChargeRules [];

    let primeChargeIntervals: IPrimeChargeInterval [];
    let subsequentChargeIntervals: ISubsqntChargeInterval [];

    let catalogDependancies: IChargeLabourCatalogDependencies;

    const END_DATE = moment().add(1, "day").format("YYYY-MM-DD");

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        areaChargeRules = [];
        jobChargeRules = [];
        primeChargeIntervals = [];
        subsequentChargeIntervals = [];

        cTask = new ChargeableTask();
        cTask.task = createTask("1", chargeTypeCode, "1Z", "EWR", "17:00", "17:30", 30);
        cTask.vat = new bignumber.BigNumber(200);
        cTask.vatCode = "D";

        let chargeType = createChargeType(chargeTypeCode, "NO CHARGE-NONE", vatCode, "N", "N");

        let item = createJcChargeRule("1", "1Z", "EWR", "NCH", "NONE", "2007-03-21", END_DATE, null, "N");
        jobChargeRules.push(item);

        mockCatalogService = <ICatalogService> {};
        mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);
        mockCatalogService.getChargeType = sandbox.stub().resolves(chargeType);
        mockCatalogService.getJCChargeRules = sandbox.stub().resolves(jobChargeRules);

        chargeLabourHelperService = new ChargeLabourHelperService(mockCatalogService);

        catalogDependancies = <IChargeLabourCatalogDependencies>{};
        catalogDependancies.fixedLabourChargeCurrencyUnit = 1;
        catalogDependancies.tieredLabourChargeCurrencyUnit = 0.01;
        catalogDependancies.primeChargeIntervals = [];
        catalogDependancies.subChargeIntervals = [];
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("no labour charge", () => {

        it("should apply no charge", async done => {

            // act
            const task = await chargeLabourHelperService.calculateLabourCharge(cTask, jobChargeRules[0], catalogDependancies);

            // assert
            expect(task).toBeDefined();
            expect(task.labourItem.netAmount.toNumber()).toEqual(0);
            done();
        });

        it("should get correct vat rate for given task start time", async done => {

            const task = await chargeLabourHelperService.calculateLabourCharge(cTask, jobChargeRules[0], catalogDependancies);

            // assert
            expect(task.vat.toNumber()).toEqual(200);
            done();
        });

    });

    describe("fixed labour prime charge", () => {

        let chargeRule: IJcChargeRules;

        beforeEach(() => {

            const chargeTypeCode = "SLO1S";

            cTask.task = createTask("1", chargeTypeCode, "AS", "SLC", "17:00", "17:30", 30);

            // let chargeType = createChargeType(chargeTypeCode, "STD LAB ONLY-1S", "D", "Y", "N");

            chargeRule = createJcChargeRule("1", "AS", "SLC", "SLO", "1S", "2007-09-24", END_DATE, null, "Y", 112.34, 112.34);

        });

        it("should apply fixed charge", async done => {

            // act
            const task = await chargeLabourHelperService.calculateLabourCharge(cTask, chargeRule, catalogDependancies);

            // assert
            expect(task).toBeDefined();

            assertLabourCharge(task, 112.34);

            done();
        });

        it("should not set an error charge on successful calculation", async done => {

            // act
            const task = await chargeLabourHelperService.calculateLabourCharge(cTask, chargeRule, catalogDependancies);

            // assert
            expect(task.error).toEqual(false);
            expect(task.errorDescription).toEqual("");
            done();
        });

    });

    describe("fixed labour subsequent charge", () => {

        let chargeRule: IJcChargeRules;

        beforeEach(() => {

            const chargeTypeCode = "SLO1S";

            cTask.task = createTask("1", chargeTypeCode, "AS", "SLC", "01/10/2099 17:00", "01/10/2099 17:30", 30);

            let chargeType = createChargeType(chargeTypeCode, "STD LAB ONLY-1S", "D", "y", "N");

            chargeRule = createJcChargeRule("1", "AS", "SLC", "SLO", "1S", "2007-09-24", END_DATE, null, "N", 112.34, 112.35);
            jobChargeRules.push(chargeRule);

            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves(areaChargeRules);
            mockCatalogService.getChargeType = sandbox.stub().resolves(chargeType);
            mockCatalogService.getJCChargeRules = sandbox.stub().resolves(jobChargeRules);
        });

        it("should apply fixed charge", async done => {

            // act
            const task = await chargeLabourHelperService.calculateLabourCharge(cTask, chargeRule, catalogDependancies);

            // assert
            expect(task).toBeDefined();

            assertLabourCharge(task, 112.34, 112.35);

            done();
        });
    });

    describe("tiered charging", () => {

        describe("multi tiered labour charge", () => {

            let chargeRule: IJcChargeRules;

            beforeEach(() => {

                const chargeTypeCode = "SLONONE";

                let task = createTask("1", chargeTypeCode, "ER", "EWR", "01/10/2099 17:00", "01/10/2099 17:30", 30);
                let activity = createTaskActivity("2016-10-18", "IP", 46);
                task.activities.push(activity);

                let chargeType = createChargeType(chargeTypeCode, "STD LAB ONLY-NONE", "D", "Y", "N");

                chargeRule = createJcChargeRule("3632", "ER", "EWR", "SLO", "NONE", "2012-11-15", END_DATE, "3N", "Y");
                jobChargeRules.push(chargeRule);

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

                catalogDependancies.primeChargeIntervals = primeChargeIntervals;
            });

            it("should calculate correct charge, where two intervals", async done => {

                cTask.task.chargeableTime = 76;

                // act
                const task = await chargeLabourHelperService.calculateLabourCharge(cTask, chargeRule, catalogDependancies);

                // assert
                expect(task).toBeDefined();

                assertLabourCharge(task, 44.4, 0);

                done();
            });


            it("should set error if prime charge interval missing", async done => {

                // no prime charge intervals returned
                mockCatalogService.getPrimeChargeIntervals = sandbox.stub().resolves([]);

                catalogDependancies.primeChargeIntervals = [];
                const task = await chargeLabourHelperService.calculateLabourCharge(cTask, chargeRule, catalogDependancies);
                const chargePair = task.labourItem.chargePair;

                // assert

                expect(chargePair.primeCharge.toNumber()).toEqual(0);
                expect(chargePair.noPrimeChargesFound).toBe(true);
                done();
            });

            it("should set error if subsequent charge interval missing", async done => {

                // use subsequent charge
                let chargeRuleMissingSub = createJcChargeRule("3632", "ER", "EWR", "SLO", "NONE", "2012-11-15", END_DATE, "3N", "N");
                jobChargeRules = [chargeRuleMissingSub];

                mockCatalogService.getSubsequentChargeIntervals = sandbox.stub().resolves([]);

                const task = await chargeLabourHelperService.calculateLabourCharge(cTask, chargeRuleMissingSub, catalogDependancies);

                const chargePair = task.labourItem.chargePair;
                // assert
                expect(chargePair.subsequentCharge.toNumber()).toEqual(0);
                expect(chargePair.noSubsequentChargesFound).toBe(true);
                done();
            });

            it("should set primeCharge = 0, noPrimeChargesFound = false if jcChargeRule.standardLabourChargeSubs is 0", async done => {

                let chargeRuleMissingSub = createJcChargeRule("3632", "ER", "EWR", "SLO", "NONE", "2012-11-15", END_DATE, "", "N", 0, 0);
                jobChargeRules = [chargeRuleMissingSub];

                mockCatalogService.getSubsequentChargeIntervals = sandbox.stub().resolves([]);

                const task = await chargeLabourHelperService.calculateLabourCharge(cTask, chargeRuleMissingSub, catalogDependancies);

                const chargePair = task.labourItem.chargePair;
                // assert
                expect(chargePair.primeCharge.toNumber()).toEqual(0);
                expect(chargePair.noPrimeChargesFound).toBe(false);                
                done();
            });

            it("should set subsequentCharge = 0, noSubsequentChargesFound = false if jcChargeRule.standardLabourChargeSubs is 0", async done => {

                let chargeRuleMissingSub = createJcChargeRule("3632", "ER", "EWR", "SLO", "NONE", "2012-11-15", END_DATE, "", "N", 16.50, 0);
                jobChargeRules = [chargeRuleMissingSub];

                mockCatalogService.getSubsequentChargeIntervals = sandbox.stub().resolves([]);

                const task = await chargeLabourHelperService.calculateLabourCharge(cTask, chargeRuleMissingSub, catalogDependancies);

                const chargePair = task.labourItem.chargePair;
                // assert
                expect(chargePair.subsequentCharge.toNumber()).toEqual(0);
                expect(chargePair.noSubsequentChargesFound).toBe(false);                 
                done();
            });

            it("should set noSubsequentChargesFound to true if jcChargeRule.standardLabourChargeSubs is undefined", async done => {

                let chargeRuleMissingSub = createJcChargeRule("3632", "ER", "EWR", "SLO", "NONE", "2012-11-15", END_DATE, "", "N", 16.50, undefined);
                jobChargeRules = [chargeRuleMissingSub];

                mockCatalogService.getSubsequentChargeIntervals = sandbox.stub().resolves([]);

                const task = await chargeLabourHelperService.calculateLabourCharge(cTask, chargeRuleMissingSub, catalogDependancies);

                const chargePair = task.labourItem.chargePair;
                // assert
                expect(chargePair.noSubsequentChargesFound).toBe(true);                 
                done();
            });

            it("should set noSubsequentChargesFound to true if jcChargeRule.standardLabourChargeSubs is null", async done => {

                let chargeRuleMissingSub = createJcChargeRule("3632", "ER", "EWR", "SLO", "NONE", "2012-11-15", END_DATE, "", "N", 16.50, null);
                jobChargeRules = [chargeRuleMissingSub];

                mockCatalogService.getSubsequentChargeIntervals = sandbox.stub().resolves([]);

                const task = await chargeLabourHelperService.calculateLabourCharge(cTask, chargeRuleMissingSub, catalogDependancies);

                const chargePair = task.labourItem.chargePair;
                // assert
                expect(chargePair.noSubsequentChargesFound).toBe(true);                 
                done();
            });
        });

        /**
         * Please refer to doc 4N Labour Charge rule for further background on this test
         */

        describe("3 tier pricing model, using labour code 4N example", () => {

            let chargeRule: IJcChargeRules;

            beforeEach(() => {

                let chargeType = createChargeType("SLONONE", "STD LAB ONLY-NONE", "D", "Y", "N");

                 chargeRule = createJcChargeRule("3632", "XL", "WH", "SLO", "NONE", "2013-01-21", END_DATE, "4N", "Y");

                let labourChargeRuleCode = createLabourChargeRuleCode("4N", 6583, 30, 6583, 30);

                let pci1 = createPrimeChargeInterval("1", "4N", 1, 90, 90, 10000);
                let pci2 = createPrimeChargeInterval("2", "4N", 2, 1, 1, 17500);
                let pci3 = createPrimeChargeInterval("3", "4N", 3, 99, 9999, 0);

                primeChargeIntervals.push(pci1);
                primeChargeIntervals.push(pci2);
                primeChargeIntervals.push(pci3);

                catalogDependancies.primeChargeIntervals = primeChargeIntervals;

                mockCatalogService.getChargeType = sandbox.stub().resolves(chargeType);
                mockCatalogService.getJCChargeRules = sandbox.stub().resolves(jobChargeRules);
                mockCatalogService.getPrimeChargeIntervals = sandbox.stub().resolves(primeChargeIntervals);
                mockCatalogService.getSubsequentChargeIntervals = sandbox.stub().resolves(subsequentChargeIntervals);
                mockCatalogService.getLabourChargeRule = sandbox.stub().resolves(labourChargeRuleCode);
            });


            /*
             just charged within min period of 30 minutes, min charge 6583, don"t go into any interval
             */

            it("should calculate correct charge, where no interval applied, only min charge (because <=30 minutes)", async done => {

                // arrange
                cTask.task =  createTask("1", "SLONONE", "XL", "WH", "01/10/2099 17:00", "01/10/2099 17:30", 30);

                let activity = createTaskActivity("2016-10-2018", "IP", 0);
                cTask.task.activities.push(activity);

                chargeLabourHelperService = new ChargeLabourHelperService(mockCatalogService);

                const task = await chargeLabourHelperService.calculateLabourCharge(cTask, chargeRule, catalogDependancies);

                // assert

                assertLabourCharge(task, 65.83, 0);

                done();
            });

            /*
             So total of 31 minutes
             Min charge is 6583
             min period is 30 minutes, so we are in the first tier by 1 minute only
             the tier 1 is charged at 10000
             so expect total to be 10000 + 6583 = 16583
             */
            it("should calculate correct charge, where first interval applied, lower limit of boundary (31 minutes charge)", async done => {

                // arrange
                cTask.task =  createTask("1", "SLONONE", "XL", "WH", "01/10/2099 17:00", "01/10/2099 17:31", 31);
                let activity = createTaskActivity("2016-10-2018", "IP", 0);
                cTask.task.activities.push(activity);

                // act
                let chargeRule = createJcChargeRule("3632", "ER", "EWR", "SLO", "NONE", "2012-11-15", END_DATE, "3N", "N");
                const task = await chargeLabourHelperService.calculateLabourCharge(cTask, chargeRule, catalogDependancies);

                // assert
                assertLabourCharge(task, 165.83, 0);
                done();
            });

            /**
             *  we are only 60 minutes into the first tier which is up to 90 minutes,
             *  so still charge 16583
             */
            it("should calculate correct charge, where first interval applied, upper limit of boundary (120 minutes charge)", async done => {

                // arrange

                cTask.task = createTask("1", "SLONONE", "XL", "WH", "01/10/2099 17:00", "01/10/2099 18:20", 120);
                let activity = createTaskActivity("2016-10-2018", "IP", 0);
                cTask.task.activities.push(activity);

                // act
                let chargeRule = createJcChargeRule("3632", "ER", "EWR", "SLO", "NONE", "2012-11-15", END_DATE, "3N", "N");
                const task = await chargeLabourHelperService.calculateLabourCharge(cTask, chargeRule, catalogDependancies);

                // assert
                assertLabourCharge(task, 165.83, 0);

                done();
            });

            /**
             *  So 120 minutes applied
             *  30 minutes min period and charge @6583
             *  121-30 = 91 minutes, 90 minutes tier 1 charged @10000
             *  1 minute charged at tier 2 @17500
             *  total = 10000 + 6583 + 17500 = 34083
             */
            it("should calculate correct charge, where 2nd interval applied, upper limit of boundary (120 minutes charge)", async done => {

                // arrange

                cTask.task = createTask("1", "SLONONE", "XL", "WH", "01/10/2099 17:00", "01/10/2099 18:21", 121);
                let activity = createTaskActivity("2016-10-2018", "IP", 0);
                cTask.task.activities.push(activity);

                // act
                let chargeRule = createJcChargeRule("3632", "ER", "EWR", "SLO", "NONE", "2012-11-15", END_DATE, "3N", "N");
                chargeRule.standardLabourChargePrime
                const task = await chargeLabourHelperService.calculateLabourCharge(cTask, chargeRule, catalogDependancies);

                // assert
                assertLabourCharge(task, 340.83, 0);

                done();
            });
        });
    });
});


function assertLabourCharge(task: ChargeableTask, expectedPrimeCharge: number, expectedSubCharge?: number) {

    if (expectedSubCharge === undefined) {
        expectedSubCharge = expectedPrimeCharge
    }

    const {labourItem} = task;
    const {chargePair} = labourItem;
    const {primeCharge, subsequentCharge} = chargePair;

    expect(primeCharge.toNumber()).toEqual(expectedPrimeCharge);
    expect(subsequentCharge.toNumber()).toEqual(expectedSubCharge);
}