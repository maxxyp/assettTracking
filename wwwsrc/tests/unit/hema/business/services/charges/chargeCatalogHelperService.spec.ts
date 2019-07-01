import { IChargeCatalogHelperService } from "../../../../../../app/hema/business/services/interfaces/charge/IChargeCatalogHelperService";
import { IDiscount } from "../../../../../../app/hema/business/models/reference/IDiscount";
import * as moment from "moment";
import { ICatalogService } from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import { ChargeCatalogHelperService } from "../../../../../../app/hema/business/services/charge/chargeCatalogHelperService";
import { IStorageService } from "../../../../../../app/hema/business/services/interfaces/IStorageService";
import { Helper } from "../../../../unitHelpers/chargeTestHelper.spec";
import {IChargeType} from "../../../../../../app/hema/business/models/reference/IChargeType";

describe("chargeCatalogHelperService", () => {

    let sandbox: Sinon.SinonSandbox;
    let chargeCatalogHelper: IChargeCatalogHelperService;
    let mockCatalogService: ICatalogService;
    let mockStorageService: IStorageService;

    const dateFormat = "YYYY-MM-DD";
    const chargeMethodCodeLength = 3;

    const TODAY_DATE = "2017-01-01";
    const END_DATE = "2099-01-01";

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        mockCatalogService = <ICatalogService> {};
        mockStorageService = <IStorageService>{};
        mockStorageService.getUserRegion = sandbox.stub().resolves("1");

        const today = moment(TODAY_DATE).toDate();
        jasmine.clock().mockDate(today);
    });

    afterEach(() => {
        sandbox.restore();
        jasmine.clock().uninstall();
    });

    describe("valid discount codes", () => {

        let discountCodes = [];

        const futureDate = moment().add(1, 'day').format('YYYY-MM-DD');
        // const expiredDate = moment().add(-10, 'day').format('YYYY-MM-DD');

        beforeEach(() => {
            discountCodes = [];
        });


        it("should return discount with empty string end dates", () => {

            let discountCode1 = <IDiscount> {};
            discountCode1.discountEndDate = "";
            discountCode1.discountStartDate = "2016-03-14";

            let discountCode2 = <IDiscount> {};
            discountCode2.discountEndDate = "";
            discountCode2.discountStartDate = "2016-03-14";

            discountCodes.push(discountCode1);
            discountCodes.push(discountCode2);

            mockCatalogService.getDiscounts = sandbox.stub().resolves(discountCodes);

            chargeCatalogHelper = new ChargeCatalogHelperService(mockCatalogService, mockStorageService);

            const discounts = chargeCatalogHelper.getValidDiscounts(discountCodes);

            expect(discounts.length).toEqual(2);
        });

        it("should return discount within date range", () => {

            let discountCode1 = <IDiscount> {};
            discountCode1.discountEndDate = futureDate;
            discountCode1.discountStartDate = "2016-03-14";

            let discountCode2 = <IDiscount> {};
            discountCode2.discountEndDate = futureDate;
            discountCode2.discountStartDate = "2016-03-14";

            discountCodes.push(discountCode1);
            discountCodes.push(discountCode2);

            mockCatalogService.getDiscounts = sandbox.stub().resolves(discountCodes);

            chargeCatalogHelper = new ChargeCatalogHelperService(mockCatalogService, mockStorageService);

            const discounts = chargeCatalogHelper.getValidDiscounts(discountCodes);
            expect(discounts.length).toEqual(2);

        });


        it("should return no discounts outside of date range", () => {

            let discountCode1 = <IDiscount> {};
            discountCode1.discountStartDate = "2016-03-14";
            discountCode1.discountEndDate = "2016-12-31";


            let discountCode2 = <IDiscount> {};
            discountCode2.discountStartDate = "2016-03-14";
            discountCode2.discountEndDate = "2016-12-31";

            discountCodes.push(discountCode1);
            discountCodes.push(discountCode2);

            mockCatalogService.getDiscounts = sandbox.stub().resolves(discountCodes);

            const discounts = chargeCatalogHelper.getValidDiscounts(discountCodes);

            expect(discounts.length).toEqual(0);
        });
    });

    describe("get vat code", () => {

    });

    describe("get charge rules", () => {

        it("returns single charge rule", async done => {

            const jobType = "IB";
            const applianceType = "CIR";
            const chargeType = "NCH2API";

            let item = Helper.createJcChargeRule("1", "IB", "CIR", "NCH", "2API", "2007-03-21", END_DATE, null, "N");

            mockCatalogService.getJCChargeRules = sandbox.stub().resolves([item]);

            let acr1 = Helper.createAreaChargeRule("IB", "CIR", "2API", "2016-11-01", END_DATE, "1", item.chargeRuleSequence);
            mockCatalogService.getAreaChargeRules = sandbox.stub().resolves([acr1]);

            chargeCatalogHelper = new ChargeCatalogHelperService(mockCatalogService, mockStorageService);

            const chargeRule = await chargeCatalogHelper.getJobCodeChargeRule(jobType, applianceType, chargeType, dateFormat, chargeMethodCodeLength);

            expect(chargeRule).toEqual(item);

            done();
        });

        it("find the correct charge rule for given date", () => {

        });


        describe("getChargeTypesByApplianceJob", () => {

            beforeEach(() => {
                let item = Helper.createJcChargeRule("1", "IB", "CIR", "NCH", "2API", "2007-03-21", END_DATE, null, "N");
                let item2 = Helper.createJcChargeRule("2", "IB", "CIR", "NCH", "2API", "2007-03-21", END_DATE, null, "N");

                const chargeType = <IChargeType>{};
                chargeType.chargeType = "NCH2API";

                mockCatalogService.getJCChargeRules = sandbox.stub().resolves([item, item2]);
                mockCatalogService.getChargeTypes = sandbox.stub().resolves([chargeType]);

            });

            it("can find charge types for given appliance and job type", async done => {

                chargeCatalogHelper = new ChargeCatalogHelperService(mockCatalogService, mockStorageService);

                const jobType = "IB";
                const applianceType = "CIR";
                // const chargeType = "NCH2API";

                const result = await chargeCatalogHelper.getChargeTypesByApplianceJob(jobType, applianceType, dateFormat, chargeMethodCodeLength);

                expect(result[0].chargeType).toEqual("NCH2API");

                done();
            });

            it("throws error if charge type not found", async done => {

                mockCatalogService.getJCChargeRules = sandbox.stub().resolves([]);

                chargeCatalogHelper = new ChargeCatalogHelperService(mockCatalogService, mockStorageService);

                const jobType = "IB";
                const applianceType = "CIR";

                try {
                    await chargeCatalogHelper.getChargeTypesByApplianceJob(jobType, applianceType, dateFormat, chargeMethodCodeLength);
                } catch (err) {
                    expect(err.message).toEqual("no charge rules found for appliance IB and job type CIR");
                    done()

                }
            });

        });

        describe("finds area charge rule by location if multiple charge rules", () => {

            const jobType = "IB";
            const applianceType = "CIR";
            const chargeType = "SLO2API";

            let item = Helper.createJcChargeRule("1", "IB", "CIR", "SLO", "2API", "2007-03-21", END_DATE, null, "N", 100);
            item.chargeRuleSequence = 1;

            let item2 = Helper.createJcChargeRule("1", "IB", "CIR", "SLO", "2API", "2007-03-21", END_DATE, null, "N", 101);
            item2.chargeRuleSequence = 2;

            // let areaChargeRulesStub = mockCatalogService.getAreaChargeRules = sandbox.stub();
            let itemACR = Helper.createAreaChargeRule("IB", "CIR", "2API", "2007-03-21", END_DATE, "1", 1);
            let item2ACR = Helper.createAreaChargeRule("IB", "CIR", "2API", "2007-03-21", END_DATE, "2", 2);

            beforeEach(() => {

                mockCatalogService.getAreaChargeRules = sandbox.stub().resolves([itemACR, item2ACR]);

                mockCatalogService.getJCChargeRules = sandbox.stub()
                    .withArgs("IB", "CIR").resolves([item, item2]);
            });

            it("finds area charge rule by region 1", async done => {

                mockStorageService.getUserRegion = sandbox.stub().resolves("1");

                chargeCatalogHelper = new ChargeCatalogHelperService(mockCatalogService, mockStorageService);

                const chargeRule = await
                    chargeCatalogHelper.getJobCodeChargeRule(jobType, applianceType, chargeType, dateFormat, chargeMethodCodeLength);

                expect(chargeRule).toEqual(item);

                done();
            });

            it("finds area charge rule by region 2", async done => {

                mockStorageService.getUserRegion = sandbox.stub().resolves("2");

                chargeCatalogHelper = new ChargeCatalogHelperService(mockCatalogService, mockStorageService);

                const chargeRule = await
                    chargeCatalogHelper.getJobCodeChargeRule(jobType, applianceType, chargeType, dateFormat, chargeMethodCodeLength);

                expect(chargeRule).toEqual(item2);

                done();
            });

            it("raises exception if no region set", async done => {

                mockStorageService.getUserRegion = sandbox.stub().resolves(undefined);

                chargeCatalogHelper = new ChargeCatalogHelperService(mockCatalogService, mockStorageService);

                try {
                    await chargeCatalogHelper.getJobCodeChargeRule(jobType, applianceType, chargeType, dateFormat, chargeMethodCodeLength);
                } catch (exception) {
                    expect(exception.message).toEqual("No region found. Check it has been set in preferences");
                    done();
                }

            });

        });

        // see DF_1881, when creating a new task charge dependant on region
        describe("finds area charge rule by location if single charge rule", () => {

            const jobType = "SA";
            const applianceType = "INS";
            const chargeType = "NCH";
            const contractType = 'NONE';
            const chargeContractType = `${chargeType}${contractType}`;
            const region = "3";

            let item = Helper.createJcChargeRule("1", jobType, applianceType, chargeType, contractType, "2007-03-21", END_DATE, null, "N", null);
            item.chargeRuleSequence = 1;

            let itemACR = Helper.createAreaChargeRule(jobType, applianceType, contractType, "2007-03-21", END_DATE, region, 1);

            beforeEach(() => {

                mockCatalogService.getAreaChargeRules = sandbox.stub().resolves([itemACR]);

                mockCatalogService.getJCChargeRules = sandbox.stub()
                    .withArgs(jobType, applianceType).resolves([item]);
            });

            it("finds area correct region", async done => {

                mockStorageService.getUserRegion = sandbox.stub().resolves(region);

                chargeCatalogHelper = new ChargeCatalogHelperService(mockCatalogService, mockStorageService);

                const chargeRule = await
                    chargeCatalogHelper.getJobCodeChargeRule(jobType, applianceType, chargeContractType, dateFormat, chargeMethodCodeLength);

                expect(chargeRule).toEqual(item);

                done();
            });

            it("returns empty area charge code if invalid region", async done => {

                const wrongRegion = "5";

                mockStorageService.getUserRegion = sandbox.stub().resolves(wrongRegion);

                chargeCatalogHelper = new ChargeCatalogHelperService(mockCatalogService, mockStorageService);

                try {
                    await chargeCatalogHelper.getJobCodeChargeRule(jobType, applianceType, chargeContractType, dateFormat, chargeMethodCodeLength);
                } catch (ex) {
                    expect(ex.message).toEqual("could not locate area charge rule");
                }

                done();
            });

        });

    });

});