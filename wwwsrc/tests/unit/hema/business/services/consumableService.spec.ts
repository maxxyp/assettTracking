/// <reference path="../../../../../typings/app.d.ts" />

import { ConsumableService } from "../../../../../app/hema/business/services/consumableService";
import { IFFTService } from "../../../../../app/hema/api/services/interfaces/IFFTService";
import { EventAggregator } from "aurelia-event-aggregator";
import { IEngineerService } from "../../../../../app/hema/business/services/interfaces/IEngineerService";
import { IStorageService } from "../../../../../app/hema/business/services/interfaces/IStorageService";
import { ConsumablesBasket as ConsumablePartsBasket } from "../../../../../app/hema/business/models/consumablesBasket";
import { ConsumablePart } from "../../../../../app/hema/business/models/consumablePart";
import { Engineer } from "../../../../../app/hema/business/models/engineer";
import * as moment from "moment";

describe("the consumableService module ", () => {
    let consumableService: ConsumableService;
    let engineerServiceStub: IEngineerService;
    let iFFTServiceStub: IFFTService;
    let storageServiceStub: IStorageService;
    let eventAggregatorStub: EventAggregator;
    let basket: ConsumablePartsBasket;
    let engineer: Engineer;

    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        engineer = new Engineer();
        engineer.id = "11111111";
        basket = new ConsumablePartsBasket();
        basket.partsInBasket = [];
        basket.partsInBasket.push(new ConsumablePart("1234", "test item", 100));
        basket.favourites = [];
        basket.favourites.push(new ConsumablePart("12345", "test favourite item", 1));
        sandbox = sinon.sandbox.create();
        storageServiceStub = <IStorageService>{};
        iFFTServiceStub = <IFFTService>{};
        engineerServiceStub = <IEngineerService>{};
        eventAggregatorStub = <EventAggregator>{};
        storageServiceStub.getConsumablePartsBasket = sandbox.stub().returns(Promise.resolve(basket));
        storageServiceStub.setConsumablePartsBasket = sandbox.stub().returns(Promise.resolve());
        engineerServiceStub.getCurrentEngineer = sandbox.stub().returns(Promise.resolve(engineer));
        iFFTServiceStub.orderConsumables = sandbox.stub().returns(Promise.resolve());
        eventAggregatorStub.publish = sandbox.stub();
        consumableService = new ConsumableService(storageServiceStub, iFFTServiceStub, engineerServiceStub, eventAggregatorStub)
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(consumableService).toBeDefined();
    });
    it("can fetch  basket", (done) => {
        consumableService.getConsumablesBasket()
            .then((partsBasket) => {
                expect(partsBasket).toBeDefined();
                expect(partsBasket.favourites.length).toEqual(1);
                expect(partsBasket.partsInBasket.length).toEqual(1);
                done();
            })
            .catch((error) => {
                fail("error: " + error);
                done();
            });
    });
    it(" order can be placed", (done) => {
        consumableService.placeOrder(basket)
            .then((basket) => {
                expect(basket.partsInBasket.filter(p => p.sent === true).length).toEqual(1);
                done();
            })
            .catch((error) => {
                fail("error: " + error);
                done();
            });
    });
    it(" order item can be removed", (done) => {
        consumableService.removeConsumableFromBasket("1234")
            .then((basket) => {
                expect(basket.partsInBasket.filter(p => p.sent === true).length).toEqual(0);
                done();
            })
            .catch((error) => {
                fail("error: " + error);
                done();
            });
    });
    it(" order item can be added", (done) => {
        consumableService.addConsumableToBasket(new ConsumablePart("123456", "added test part", 10))
            .then((basket) => {
                expect(basket.partsInBasket.filter(p => p.sent === false).length).toEqual(2);
                done();
            })
            .catch((error) => {
                fail("error: " + error);
                done();
            });
    });
    it(" same order item can be added inceasing quantity", (done) => {
        consumableService.addConsumableToBasket(new ConsumablePart("1234", "test item", 100))
            .then((basket) => {
                expect(basket.partsInBasket[0].quantity).toEqual(200);
                done();
            })
            .catch((error) => {
                fail("error: " + error);
                done();
            });
    });
    it(" favouite can be added", (done) => {
        consumableService.addFavourite(new ConsumablePart("1234567", "another fave item", 1))
            .then((basket) => {
                expect(basket.favourites.length).toEqual(2);
                done();
            })
            .catch((error) => {
                fail("error: " + error);
                done();
            });
    });
    it(" same favouite can't be added", (done) => {
        consumableService.addFavourite(new ConsumablePart("12345", "test favourite item", 1))
            .then((basket) => {
                expect(basket.favourites.length).toEqual(1);
                done();
            })
            .catch((error) => {
                fail("error: " + error);
                done();
            });
    });
    it(" favouite can be removed", (done) => {
        consumableService.removeFavourite(0)
            .then((basket) => {
                expect(basket.favourites.length).toEqual(0);
                done();
            })
            .catch((error) => {
                fail("error: " + error);
                done();
            });
    });
    it(" order count", (done) => {
        consumableService.orderItemCount()
            .then((orderCount) => {
                expect(basket.favourites.length).toEqual(1);
                done();
            })
            .catch((error) => {
                fail("error: " + error);
                done();
            });
    });
});

describe(" Old orders", () => {
    let consumableService: ConsumableService;
    let engineerServiceStub: IEngineerService;
    let iFFTServiceStub: IFFTService;
    let storageServiceStub: IStorageService;
    let eventAggregatorStub: EventAggregator;
    let basket: ConsumablePartsBasket;

    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        basket = new ConsumablePartsBasket();
        let oldDate = moment().add(-61, 'days').format("YYYY-MM-DD");
        let newDate = moment().add(-59, 'days').format("YYYY-MM-DD");
        basket.partsInBasket.push({
            dateAdded: oldDate,
            referenceId: "123",
            description: " Old Order",
            quantity: 1,
            deleted: false,
            sent: true,
            favourite: false
        });
        basket.partsInBasket.push({
            dateAdded: newDate,
            referenceId: "1234",
            description: " Old Order 2",
            quantity: 1,
            deleted: false,
            sent: true,
            favourite: false
        });
        basket.partsInBasket.push({
            dateAdded: newDate,
            referenceId: "12345",
            description: " New Order",
            quantity: 1,
            deleted: false,
            sent: false,
            favourite: false
        });
        sandbox = sinon.sandbox.create();
        storageServiceStub = <IStorageService>{};
        iFFTServiceStub = <IFFTService>{};
        engineerServiceStub = <IEngineerService>{};
        eventAggregatorStub = <EventAggregator>{};
        storageServiceStub.getConsumablePartsBasket = sandbox.stub().returns(Promise.resolve(basket));
        storageServiceStub.setConsumablePartsBasket = sandbox.stub().returns(Promise.resolve());
        consumableService = new ConsumableService(storageServiceStub, iFFTServiceStub, engineerServiceStub, eventAggregatorStub)
    });

    afterEach(() => {
        sandbox.restore();
    });

    it(" remove old orders", (done) => {
        consumableService.clearOldOrders(60)
            .then((basket) => {
                expect(basket.partsInBasket.length).toEqual(2);
                done();
            })
            .catch((error) => {
                fail("error: " + error);
                done();
            });
    });
});

describe("the consumableService module defensive", () => {
    let consumableService: ConsumableService;
    let engineerServiceStub: IEngineerService;
    let iFFTServiceStub: IFFTService;
    let storageServiceStub: IStorageService;
    let eventAggregatorStub: EventAggregator;
    let basket: ConsumablePartsBasket;

    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        basket = new ConsumablePartsBasket();
        sandbox = sinon.sandbox.create();
        storageServiceStub = <IStorageService>{};
        iFFTServiceStub = <IFFTService>{};
        engineerServiceStub = <IEngineerService>{};
        eventAggregatorStub = <EventAggregator>{};
        storageServiceStub.getConsumablePartsBasket = sandbox.stub().returns(Promise.resolve(basket));
        consumableService = new ConsumableService(storageServiceStub, iFFTServiceStub, engineerServiceStub, eventAggregatorStub)
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can fetch undefined basket", (done) => {
        consumableService.getConsumablesBasket()
            .then((partsBasket) => {
                expect(partsBasket).toBeDefined();
                expect(partsBasket.favourites.length).toEqual(0);
                expect(partsBasket.partsInBasket.length).toEqual(0);
                done();
            })
            .catch((error) => {
                fail("error: " + error);
                done();
            });
    });
});