/// <reference path="../../../../../../typings/app.d.ts" />

import { DialogService } from "aurelia-dialog";
import { Charges } from "../../../../../../app/hema/presentation/modules/charges/charges";
import { IJobService } from "../../../../../../app/hema/business/services/interfaces/IJobService";
import { IEngineerService } from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { IValidationService } from "../../../../../../app/hema/business/services/interfaces/IValidationService";
import { IBusinessRuleService } from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { ICatalogService } from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import { BindingEngine, PropertyObserver } from "aurelia-binding";
import { IChargesFactory } from "../../../../../../app/hema/presentation/factories/interfaces/IChargesFactory";
import { IChargeService } from "../../../../../../app/hema/business/services/interfaces/charge/IChargeService";
import { ChargeTaskViewModel } from "../../../../../../app/hema/presentation/modules/charges/viewModels/chargeTaskViewModel";
import { Charge } from "../../../../../../app/hema/business/models/charge/charge";
import { DataState } from "../../../../../../app/hema/business/models/dataState";
import { ChargeableTask } from "../../../../../../app/hema/business/models/charge/chargeableTask";
import { Task } from "../../../../../../app/hema/business/models/task";
import * as bignumber from "bignumber";
import { ChargesFactory } from "../../../../../../app/hema/presentation/factories/chargesFactory";
import * as moment from "moment";
import { IDiscount } from "../../../../../../app/hema/business/models/reference/IDiscount";
import { IChargeOption } from "../../../../../../app/hema/business/models/reference/IChargeOption";
import { IChargeDispute } from "../../../../../../app/hema/business/models/reference/IChargeDispute";
import { QueryableBusinessRuleGroup } from "../../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import { ChargeMainViewModel } from "../../../../../../app/hema/presentation/modules/charges/viewModels/chargeMainViewModel";
import { IChargeCatalogHelperService } from "../../../../../../app/hema/business/services/interfaces/charge/IChargeCatalogHelperService";
import { ChargeItemPartViewModel } from "../../../../../../app/hema/presentation/modules/charges/viewModels/chargeItemPartViewModel";
import { IGoodsItemStatus } from "../../../../../../app/hema/business/models/reference/IGoodsItemStatus";

describe("the Charges module", () => {
    let sandbox: Sinon.SinonSandbox;
    let charges: Charges;
    let jobServiceStub: IJobService;
    let engineerServiceStub: IEngineerService;
    let labelServiceStub: ILabelService;
    let eventAggregatorStub: EventAggregator;
    let validationServiceStub: IValidationService;
    let businessRulesServiceStub: IBusinessRuleService;
    let catalogServiceStub: ICatalogService;
    let dialogServiceStub: DialogService;
    let chargesFactoryStub: IChargesFactory;
    let chargeServiceStub: IChargeService;
    let showContentSpy: Sinon.SinonSpy;
    let bindingEngineStub: BindingEngine;
    let chargeCatalogHelperStub: IChargeCatalogHelperService;
    let areChargesUptoDateSpy: Sinon.SinonSpy;

    function bNum(val: number): bignumber.BigNumber {
        return new bignumber.BigNumber(val);
    }

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        dialogServiceStub = <DialogService>{};
        jobServiceStub = <IJobService>{};
        engineerServiceStub = <IEngineerService>{};
        labelServiceStub = <ILabelService>{};
        eventAggregatorStub = <EventAggregator>{};
        validationServiceStub = <IValidationService>{};
        businessRulesServiceStub = <IBusinessRuleService>{};
        catalogServiceStub = <ICatalogService>{};
        chargesFactoryStub = new ChargesFactory();
        chargeServiceStub = <IChargeService>{};
        chargeCatalogHelperStub = <IChargeCatalogHelperService>{};

        let propertyObserverStub = <PropertyObserver>{};
        propertyObserverStub.subscribe = sandbox.spy();

        bindingEngineStub = <BindingEngine>{};
        bindingEngineStub.propertyObserver = sandbox.stub().returns(propertyObserverStub);

        let discounts: IDiscount[] = [];
        let discount: IDiscount = <IDiscount>{};
        discount.discountCode = "A12";
        discount.discountDescription = "Description A1";
        discount.discountStartDate = moment().format("DD-MMM-YY");
        discount.discountEndDate = moment().format("DD-MMM-YY");
        discounts.push(discount);

        catalogServiceStub.getDiscounts = sandbox.stub().resolves(discounts);

        chargeCatalogHelperStub.getValidDiscounts = sandbox.stub().resolves(discounts);

        let cOptions: IChargeOption[] = [];
        let opt: IChargeOption = <IChargeOption>{};
        opt.id = "A1";
        opt.description = "Description A1";
        cOptions.push(opt);

        catalogServiceStub.getChargeOptions = sandbox.stub().resolves(cOptions);

        let cDisputes: IChargeDispute[] = [];

        let cDispt: IChargeDispute = <IChargeDispute>{};
        cDispt.id = "A1";
        cDispt.description = "Description A1";
        cDisputes.push(cDispt);

        catalogServiceStub.getChargeDisputes = sandbox.stub().resolves(cDisputes);

        catalogServiceStub.getGoodsItemStatuses = sandbox.stub().resolves([]);

        engineerServiceStub.isWorking = sandbox.stub().resolves(true);

        let queryableRuleGroup = <QueryableBusinessRuleGroup>{};

        let getBusinessRuleStub = queryableRuleGroup.getBusinessRule = sandbox.stub();

        getBusinessRuleStub.withArgs("noDiscountCode").returns("NODISCOUNT");
        getBusinessRuleStub.withArgs("complaintCategoryBillingQuery").returns("BQ");
        getBusinessRuleStub.withArgs("complaintActionCategoryCharge").returns("D");
        getBusinessRuleStub.withArgs("fittedPartStatusCode").returns("FP");

        businessRulesServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(queryableRuleGroup);

        validationServiceStub.build = sandbox.stub().resolves([]);

        let subscription: Subscription = <Subscription>{};
        eventAggregatorStub.subscribe = sandbox.stub().resolves(subscription);
        eventAggregatorStub.publish = sandbox.stub();

        charges = new Charges(labelServiceStub, eventAggregatorStub, dialogServiceStub, engineerServiceStub, jobServiceStub, validationServiceStub,
            businessRulesServiceStub, catalogServiceStub, chargesFactoryStub, chargeServiceStub, bindingEngineStub, chargeCatalogHelperStub);
        charges.showContent = showContentSpy = sandbox.spy();

        chargeServiceStub.areChargesUptoDate = areChargesUptoDateSpy = sandbox.stub().returns(true);
        chargeServiceStub.loadCharges = sandbox.stub().resolves(null);
        chargeServiceStub.applyCharges = sandbox.stub().resolves(null);
        chargeServiceStub.updateTotals = sandbox.stub();
        chargeServiceStub.applyDiscountToTask = sandbox.stub().resolves(null);
        charges.labels = {
            "objectName": "objectName",
            "noChargesWarning": "noChargesWarning",
            "discountTextLabel": "discountTextLabel",
            "Charges": "Charges",
            "nodiscount": "NO DISCOUNT",
            "warranty": "warranty",
            "return": "return",
            "parts": "parts",
            "errorTitle": "errorTitle",
            "errorDescription": "errorDescription",
            "previousChargeApplianceConfirm": "",
            "previousChargeApplianceMessage": "",
            "previous": "previous activity",
            "minutes": "minutes",
            "minute": "minute"
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(charges).toBeDefined();
    });

    describe("the activateAsync", () => {
        it("no charges, activated", (done) => {
            charges.activateAsync({jobId: "1234", applianceId: "5678"}).then(() => {
                expect(showContentSpy.calledOnce).toBeTruthy();
                expect(charges.viewModel).toBeDefined();
                done();
            });
        });


        it("no cached charges, ", (done) => {
            chargeServiceStub.loadCharges = sandbox.stub().resolves(null);
            let charge: Charge = new Charge();
            charge.complaintActionCategoryCharge = "1";
            charge.chargeOption = "1";
            charge.chargeTotal = new bignumber.BigNumber(1);
            charge.dataState = DataState.valid;
            charge.dataStateGroup = "dg";
            charge.dataStateId = "1";
            charge.discountAmount = new bignumber.BigNumber(1);
            charge.jobId = "1";
            charge.netTotal = new bignumber.BigNumber(1);
            charge.remarks = "remarks";
            charge.totalVatAmount = new bignumber.BigNumber(1);
            charge.tasks = [];
            let chargeableTask = new ChargeableTask();
            chargeableTask.chargeDescription = "desc";
            chargeableTask.isLabourCharge = false;
            chargeableTask.isPartsCharge = false;
            chargeableTask.vat = new bignumber.BigNumber(0);
            chargeableTask.vatCode = "D";
            chargeableTask.task = <Task>{};

            chargeableTask.addPartItem("description", bNum(0), false, false, 1, 1, "", 0, 0);

            charge.tasks.push(chargeableTask);
            chargeServiceStub.applyCharges = sandbox.stub().resolves(charge);
            charges.activateAsync({jobId: "1234", applianceId: "5678"}).then(() => {
                expect(charges.viewModel.chargeTotal.toNumber()).toEqual(1);
                expect(charges.viewModel.tasks[0].vat.toNumber()).toEqual(0);
                expect(charges.viewModel.tasks[0].vatCode).toEqual("D");
                done();
            });
        });
    });

    it("toggleItem, show", () => {
        let task = new ChargeTaskViewModel();
        task.show = false;
        charges.toggleItem(task);
        expect(task.show).toBeTruthy();
    });

    it("should flag true for discountGreaterThanAmount if no vat and net total less than discount amount", () => {
        charges.viewModel = new ChargeMainViewModel();
        charges.viewModel.tasks = [];

        const task = new ChargeTaskViewModel();
        task.discountAmount = new bignumber.BigNumber(101);
        task.netTotal = new bignumber.BigNumber(100);
        task.vat = new bignumber.BigNumber(0);

        charges.viewModel.tasks.push(task);

        expect(task.discountGreaterThanAmount).toBe(true);
    });

    it("should flag true for discountGreaterThanAmount if  vat and net total less than discount amount", () => {
        charges.viewModel = new ChargeMainViewModel();
        charges.viewModel.tasks = [];

        const task = new ChargeTaskViewModel();
        task.discountAmount = new bignumber.BigNumber(60);
        task.netTotal = new bignumber.BigNumber(41.56);
        task.vat = new bignumber.BigNumber(200);

        charges.viewModel.tasks.push(task);

        expect(task.discountGreaterThanAmount).toBe(true);
    });

    it("should flag false for discountGreaterThanAmount if no discount", () => {
        charges.viewModel = new ChargeMainViewModel();
        charges.viewModel.tasks = [];

        const task = new ChargeTaskViewModel();
        task.discountAmount = undefined;
        task.netTotal = new bignumber.BigNumber(100);
        task.vat = new bignumber.BigNumber(0);

        charges.viewModel.tasks.push(task);

        expect(task.discountGreaterThanAmount).toBe(false);
    });

    it("should not complaint category on save if no charge dispute", (done) => {

        charges.viewModel = new ChargeMainViewModel();
        charges.viewModel.chargeComplaintActionCategory = undefined;

        charges.save().then(() => {
            expect(charges.viewModel.chargeReasonCode).toBeUndefined();
            done();
        });
    });

    it("should set complaint category on save if charge dispute", (done) => {

        charges.viewModel = new ChargeMainViewModel();
        charges.viewModel.chargeComplaintActionCategory = "D";

        charges.save().then(() => {
            expect(charges.viewModel.chargeReasonCode).toEqual("BQ");
            done();
        });
    });

    it("should set vat and vat code on save", (done) => {

        charges.viewModel = new ChargeMainViewModel();
        charges.viewModel.tasks = [];
        let t = new ChargeTaskViewModel();
        t.vat = new bignumber.BigNumber(0);
        t.vatCode = "D";
        charges.viewModel.tasks.push(t);

        charges.save().then(() => {
            expect(charges.viewModel.tasks[0].vatCode).toEqual("D");
            expect(charges.viewModel.tasks[0].vat.toNumber()).toEqual(0);
            done();
        });
    });

    describe("part description", () => {

        beforeEach(() => {
        });

        it("sets correct charge type description for part", () => {
            let part = new ChargeItemPartViewModel();
            const result = charges.getPartItemDescription(part);
            expect(result).toEqual("parts ");
        });

        it("sets correct charge type description for part from previous activity", (done) => {
            let part = new ChargeItemPartViewModel();
            part.isFromPreviousActivity = true;
            part.status = "UP";

            let item: IGoodsItemStatus = <IGoodsItemStatus>{};
            item.status = "UP";
            item.description = "VAN STOCK";

            catalogServiceStub.getGoodsItemStatuses = sandbox.stub().resolves([item]);

            charges.activateAsync({jobId: "1", applianceId: "1"}).then(() => {
                const result = charges.getPartItemDescription(part);
                expect(result).toEqual("parts  - previous activity van stock");
                done();
            })
        });

        it("sets correct charge type description for part warranty and returnable", () => {
            let part = new ChargeItemPartViewModel();
            part.isFromPreviousActivity = false;
            part.warrantyQty = 1;
            part.isWarranty = true;
            part.returnQty = 1;
            part.isReturn = true;
            const result = charges.getPartItemDescription(part);
            expect(result).toEqual("parts  - x1 warranty, x1 return");
        });
    });

    it("checks charge loading state before deactivating", () => {

        charges.canDeactivateAsync().then(() => {
            expect(areChargesUptoDateSpy.calledOnce).toBe(true);
        });
    })

    it("should return totalChargableTime as 30", () => {
        let task: Task = <Task> {
            chargeableTime: 30,
            previousVisits: []
        };

        let output = charges.getTotalChargableTime(task);
        const res = "30 minutes";
        expect(output).toEqual(res);
    });

    it("should sum up previous visits ChargableTime and return 65", () => {
        let task: Task = <Task> {
            chargeableTime: 30,
            previousVisits: [{
                chargeableTime: 20,
                status: "IA"
            }, {
                chargeableTime: 15,
                status: "IP"
            }]
        };

        let output = charges.getTotalChargableTime(task);
        const res = "65 minutes";
        expect(output).toEqual(res);
    });

    it("should return 0 if charableTime is undefined", () => {
        let task: Task = <Task> {
            previousVisits: []
        };
        let output = charges.getTotalChargableTime(task);
        const res = "0 minute";
        expect(output).toEqual(res);
    });
});
