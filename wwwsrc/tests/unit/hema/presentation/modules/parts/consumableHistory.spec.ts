/// <reference path="../../../../../../typings/app.d.ts" />
import { ConsumablesHistory } from "../../../../../../app/hema/presentation/modules/parts/consumablesHistory";
import { ConsumablesBasket as ConsumablePartsBasket } from "../../../../../../app/hema/business/models/consumablesBasket";
import { ConsumablePart } from "../../../../../../app/hema/business/models/consumablePart";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import { IConsumableService } from "../../../../../../app/hema/business/services/interfaces/IConsumableService";

describe("the TodaysParts module ", () => {
    let consumablesHistory: ConsumablesHistory;
    let sandbox: Sinon.SinonSandbox;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let consumablesService: IConsumableService;
    let labelServiceStub: ILabelService;
    let basket: ConsumablePartsBasket;

    let addToConsumablesStub: Sinon.SinonStub;
    let consumablePart: ConsumablePart;

    beforeEach(() => {
        consumablesService = <IConsumableService>{};
        sandbox = sinon.sandbox.create();
        basket = <ConsumablePartsBasket>{};

        consumablePart = <ConsumablePart> {
            referenceId: "123",
            quantity: 4,
            description: "test part",
            dateAdded: "01-01-2017",
            deleted: false,
            sent: true,
            favourite: false
        };
        basket.partsInBasket =[consumablePart];

        consumablesService.getConsumablesBasket = sandbox.stub().resolves(basket);

        consumablesService.clearOldOrders = sandbox.stub().resolves([]);

        addToConsumablesStub = consumablesService.addConsumableToBasket = sandbox.stub().resolves([]);

        consumablesHistory = new ConsumablesHistory (labelServiceStub, eventAggregatorStub, dialogServiceStub, consumablesService);        
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should be defined", () => {
        expect(consumablesHistory).toBeDefined();
    });

    describe("activateAsync method", () => {
        it("should consumableHistory.consumablesBasket length be equal to 1", (done) => {
            consumablesHistory.activateAsync().then(() => {
                expect(consumablesHistory.consumablesBasket.partsInBasket.length).toBe(1);
                done();
            });
        });
    });

    describe("reOrder method", () => {
        it("should reorder part quantity be equal to 1", () => {
            consumablesHistory.reOrder(consumablePart);
            expect(addToConsumablesStub.alwaysCalledWith(
                <ConsumablePart>{
                        referenceId: consumablePart.referenceId,
                        quantity: 1,
                        description: consumablePart.description
                    }
            )).toEqual(true);
                                  
        });
    });
});
