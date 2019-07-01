/// <reference path="../../../../../../typings/app.d.ts" />
import { ConsumablesBasket } from "../../../../../../app/hema/presentation/modules/parts/consumablesBasket";
import { ConsumablesBasket as ConsumablePartsBasket } from "../../../../../../app/hema/business/models/consumablesBasket";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import { IJobService } from "../../../../../../app/hema/business/services/interfaces/IJobService";
import { IConsumableService } from "../../../../../../app/hema/business/services/interfaces/IConsumableService";
import { IEngineerService } from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import { IValidationService } from "../../../../../../app/hema/business/services/interfaces/IValidationService";
import { IBusinessRuleService } from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { ICatalogService } from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import { IConsumableType } from "../../../../../../app/hema/business/models/reference/IConsumableType";
import { IFavouriteService } from "../../../../../../app/hema/business/services/interfaces/IFavouriteService";
import { ConsumablePart } from "../../../../../../app/hema/business/models/consumablePart";
import {AdaptBusinessServiceConstants} from "../../../../../../app/hema/business/services/constants/adaptBusinessServiceConstants";
import {ValidationRule} from "../../../../../../app/hema/business/services/validation/validationRule";

describe("the ConsumablesBasket module ", () => {
    let consumablesBasket: ConsumablesBasket;
    let sandbox: Sinon.SinonSandbox;
    let jobServiceStub: IJobService;
    let engineerServiceStub: IEngineerService;
    let labelServiceStub: ILabelService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let validationServiceStub: IValidationService;
    let businessRuleServiceStub: IBusinessRuleService;
    let catalogServiceStub: ICatalogService;
    let consumablesServiceStub: IConsumableService;
    let favouriteServiceStub: IFavouriteService;
    let basket: ConsumablePartsBasket;
    let addConsumableToBasketSpy: Sinon.SinonStub;
    beforeEach(() => {
        consumablesServiceStub = <IConsumableService>{};
        favouriteServiceStub = <IFavouriteService>{};
        sandbox = sinon.sandbox.create();
        basket = <ConsumablePartsBasket>{};
        eventAggregatorStub = new EventAggregator();
        catalogServiceStub = <ICatalogService>{};
        validationServiceStub = <IValidationService>{};

        favouriteServiceStub.addFavouriteConsumablePart = sandbox.stub().returns(Promise.resolve(basket));        
        catalogServiceStub.getConsumables = sandbox.stub().resolves([]);
        validationServiceStub.build = sandbox.stub().resolves(undefined);

        consumablesServiceStub.clearOldOrders = sandbox.stub().resolves(undefined);

        let businessRuleGroup = {
            "consumableStockRefIdPrefixRule": "[^W|^D|^F|^T|^C]"
        };
        businessRuleServiceStub = <IBusinessRuleService> {};
        businessRuleServiceStub.getRuleGroup = sandbox.stub().resolves(businessRuleGroup);

        basket.partsInBasket =[];
        consumablesBasket = new ConsumablesBasket(
            jobServiceStub, engineerServiceStub, labelServiceStub, eventAggregatorStub, dialogServiceStub,
            validationServiceStub, businessRuleServiceStub, catalogServiceStub, consumablesServiceStub, favouriteServiceStub);
        consumablesServiceStub.getConsumablesBasket = sandbox.stub().returns(Promise.resolve(basket));
        addConsumableToBasketSpy = consumablesServiceStub.addConsumableToBasket = sandbox.stub().returns(Promise.resolve(basket));
        consumablesBasket.selectedConsumableItem =  <IConsumableType>{};
        consumablesBasket.selectedConsumableItem.stockReferenceId = "123";
        consumablesBasket.selectedConsumableItem.consumableTypeDescription = "My Part";
        consumablesBasket.selectedConsumableQuantity = 1;

        let rule1: ValidationRule = new ValidationRule();
        rule1.property = "manualConsumablePartRef";
        rule1.maxLength = 6;
        consumablesBasket.validationRules["manualConsumablePartRef"] = rule1;
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(consumablesBasket).toBeDefined();
    });

    describe("addConsumable method", () => {
        beforeEach(() => {
            consumablesBasket.checkAllRules = sandbox.stub().resolves(true);
        });

        it("clear on add a consumable", async (done) => {
            await consumablesBasket.addConsumable();
            expect(consumablesBasket.selectedConsumable).toBeUndefined();
            expect(consumablesBasket.selectedConsumableQuantity).toEqual(1);
            done();
        });

        it ("should add a consumable when the values are manually entered", async (done) => {
            consumablesBasket.showManual = true;
            consumablesBasket.manualConsumablePartRef = "testid";
            consumablesBasket.manualConsumablePartDescription = "test description";
            consumablesBasket.manualConsumablePartQuantity = 2;
            await consumablesBasket.addConsumable();
            expect(addConsumableToBasketSpy.calledWith(new ConsumablePart("TESTID", "test description", 2))).toBeTruthy();
            done();
        });

        it ("should add a consumable when the part is chosen from the part search dropdown", async (done) => {
            consumablesBasket.showManual = false;
            consumablesBasket.selectedConsumableItem.stockReferenceId = "testid";
            consumablesBasket.selectedConsumableItem.consumableTypeDescription = "test description";
            consumablesBasket.selectedConsumableQuantity = 2;
            await consumablesBasket.addConsumable();
            expect(addConsumableToBasketSpy.calledWith(new ConsumablePart("TESTID", "test description", 2))).toBeTruthy();
            done();
        });
    });

    it ("should clear on canceling manual part order", () => {
        consumablesBasket.showManual = true;
        consumablesBasket.manualConsumablePartRef = "test";
        consumablesBasket.manualConsumablePartDescription = "test";
        consumablesBasket.manualConsumablePartQuantity = 2;
        consumablesBasket.hideManualAdd();
        expect(consumablesBasket.showManual).toBe(false);
        expect(consumablesBasket.manualConsumablePartRef).toBeUndefined();
        expect(consumablesBasket.manualConsumablePartDescription).toBeUndefined();
        expect(consumablesBasket.manualConsumablePartQuantity).toEqual(1);
    });

    it ("should add a consumable when adapt parts selected event is triggered", done => {
        basket.partsInBasket.push({
            referenceId: "FFFFFFF",
            quantity: 1,
            description: "test",
            sent: false,
            dateAdded: "2019-08-22T16:58:25Z",
            favourite: false,
            deleted: false
        });
        basket.partsInBasket.push({
            referenceId: "FFFFFF1",
            quantity: 1,
            description: "test",
            sent: false,
            dateAdded: "2019-08-22T16:58:25Z",
            favourite: false,
            deleted: false
        });
        basket.partsInBasket.push({
            referenceId: "FFFFFF2",
            quantity: 1,
            description: "test",
            sent: true,
            dateAdded: "2019-08-22T16:58:25Z",
            favourite: false,
            deleted: false
        });

        consumablesBasket.activateAsync()
            .then(() => {
                eventAggregatorStub.publish(AdaptBusinessServiceConstants.ADAPT_PARTS_SELECTED, ["FFFFFFF", "FFFFFF1"]);
                expect(consumablesBasket.consumablesBasket.partsInBasket.filter(p => p.sent === false).length).toBe(2);
                expect(consumablesBasket.noRecords).toBeFalsy();
                done();
            })

    });

    describe("manualConsumablePartRefChanged method", () => {
        beforeEach(() => {
            consumablesBasket.checkAllRules = sandbox.stub().resolves(true);
        });

        it("isConsumableValid should be set to false if the length of the entered manualConsumablePartRef is less than 6 digits", async done => {
            await consumablesBasket.activateAsync();
            consumablesBasket.showManual = true;
            consumablesBasket.manualConsumablePartDescription = "desc";
            consumablesBasket.manualConsumablePartRef = "121";
            consumablesBasket.manualConsumablePartRefChanged("121", undefined);
            expect(consumablesBasket.isConsumableValid).toBeFalsy();
            done();
        });

        it("isConsumableValid should be set to false if the entered manualConsumablePartRef is invalid", async done => {
            await consumablesBasket.activateAsync();
            consumablesBasket.showManual = true;
            consumablesBasket.manualConsumablePartDescription = "desc";
            consumablesBasket.manualConsumablePartRef = "121525";
            consumablesBasket.manualConsumablePartRefChanged("121525", undefined);
            expect(consumablesBasket.isConsumableValid).toBeFalsy();
            done();
        });

        it("isConsumableValid should be set to true if the entered manualConsumablePartRef is valid", async done => {
            await consumablesBasket.activateAsync();
            consumablesBasket.showManual = true;
            consumablesBasket.manualConsumablePartDescription = "desc";
            consumablesBasket.manualConsumablePartRef = "T21525";
            consumablesBasket.manualConsumablePartRefChanged("W21525", undefined);
            expect(consumablesBasket.isConsumableValid).toBeTruthy();
            done();
        });
    });

    describe("manualConsumablePartDescriptionChanged method", () => {
        beforeEach(() => {
            consumablesBasket.checkAllRules = sandbox.stub().resolves(true);
        });

        it("isConsumableValid should be set to false if manualConsumablePartDescriptionChanged is undefined", async done => {
            await consumablesBasket.activateAsync();
            consumablesBasket.showManual = true;
            consumablesBasket.manualConsumablePartDescription = undefined;
            consumablesBasket.manualConsumablePartRef = "W21525";
            consumablesBasket.manualConsumablePartDescriptionChanged(undefined, undefined);
            expect(consumablesBasket.isConsumableValid).toBeFalsy();
            done();
        });

        it("isConsumableValid should be set to false if manualConsumablePartDescriptionChanged is empty", async done => {
            await consumablesBasket.activateAsync();
            consumablesBasket.showManual = true;
            consumablesBasket.manualConsumablePartDescription = "";
            consumablesBasket.manualConsumablePartRef = "D21525";
            consumablesBasket.manualConsumablePartDescriptionChanged("", undefined);
            expect(consumablesBasket.isConsumableValid).toBeFalsy();
            done();
        });

        it("isConsumableValid should be set to true", async done => {
            await consumablesBasket.activateAsync();
            consumablesBasket.showManual = true;
            consumablesBasket.manualConsumablePartDescription = "desc";
            consumablesBasket.manualConsumablePartRef = "T21525";
            consumablesBasket.manualConsumablePartDescriptionChanged("", undefined);
            expect(consumablesBasket.isConsumableValid).toBeTruthy();
            done();
        });
    });
});
