import { inject } from "aurelia-framework";
import { ConsumablesBasket } from "../models/consumablesBasket";
import { ConsumablePart } from "../models/consumablePart";
import { IConsumableService } from "./interfaces/IConsumableService";
import { IStorageService } from "./interfaces/IStorageService";
import { StorageService } from "./storageService";
import { FftService } from "../../api/services/fftService";
import { IFFTService } from "../../api/services/interfaces/IFFTService";
import { IConsumable } from "../../api/models/fft/engineers/IConsumable";
import { IEngineerService } from "./interfaces/IEngineerService";
import { EngineerService } from "./engineerService";
import { Engineer } from "../models/engineer";
import { EventAggregator } from "aurelia-event-aggregator";
import { ConsumableServiceConstants } from "./constants/consumableServiceConstants";
import * as moment from "moment";
import {IOrderConsumablesRequest} from "../../api/models/fft/engineers/IOrderConsumablesRequest";
import {IOrderConsumables} from "../../api/models/fft/engineers/IOrderConsumables";
@inject(StorageService, FftService, EngineerService, EventAggregator)
export class ConsumableService implements IConsumableService {
    private _storageService: IStorageService;
    private _fftService: IFFTService;
    private _engineerService: IEngineerService;
    private _eventAggregator: EventAggregator;

    constructor(
        storageService: IStorageService,
        fftService: IFFTService,
        engineerService: IEngineerService,
        eventAggregator: EventAggregator) {
        this._storageService = storageService;
        this._fftService = fftService;
        this._engineerService = engineerService;
        this._eventAggregator = eventAggregator;
    }

    public getConsumablesBasket(): Promise<ConsumablesBasket> {
        return this._storageService.getConsumablePartsBasket().then((basket) => {
            if (basket) {
                basket.partsInBasket = basket.partsInBasket.sort((a: any, b: any) => {
                    return (a.dateAdded <= b.dateAdded ? 1 : -1);
                });
                return basket;
            } else {
                return new ConsumablesBasket();
            }
        });
    }
    public placeOrder(consumablesPartsBasket: ConsumablesBasket): Promise<ConsumablesBasket> {
        let engineer: Engineer;
        let consumablesOrderItems: ConsumablePart[];
        let orderItems: IConsumable[] = [];
        return this._engineerService.getCurrentEngineer()
            .then((signedOnEngineer: Engineer) => {
                engineer = signedOnEngineer;
            }).then(() => {
                consumablesOrderItems = consumablesPartsBasket.partsInBasket.filter((part) => part.sent === false);
                consumablesOrderItems.forEach(item => {
                    orderItems.push(<IConsumable>{ stockReferenceId: item.referenceId, quantityOrdered: item.quantity });
                });

                let orderConsumables = <IOrderConsumables> {
                    engineerId: engineer.id,
                    consumables: orderItems
                };

                let orderConsumablesRequest = <IOrderConsumablesRequest> {
                    data: orderConsumables
                };

                // order comsumables is a critical packet so always returns success. failed packets are queued. so no need to wait for the promise to resolve.
                this._fftService.orderConsumables(engineer.id, orderConsumablesRequest);
                consumablesPartsBasket = this.setProcessedOrderItemsToSent(consumablesPartsBasket);
                this._eventAggregator.publish(ConsumableServiceConstants.CONSUMABLE_ADDED, 0);
                this.saveBasket(consumablesPartsBasket);
                return consumablesPartsBasket;
            });

    }
    public removeConsumableFromBasket(referenceId: string): Promise<ConsumablesBasket> {
        return this.getConsumablesBasket().then(basket => {
            let existingBasketPart = basket.partsInBasket.find(a => a.referenceId === referenceId && a.sent === false);
            if (existingBasketPart) {
                basket.partsInBasket.splice(basket.partsInBasket.indexOf(existingBasketPart), 1);
            }
            this.saveBasket(basket);
            this.orderItemCount().then((total) => this._eventAggregator.publish(ConsumableServiceConstants.CONSUMABLE_ADDED, total));
            return basket;
        });
    }

    public addConsumableToBasket(part: ConsumablePart): Promise<ConsumablesBasket> {
        return this.getConsumablesBasket().then(basket => {
            // check to see if the part exists already and is not deleted or sent
            let foundPart = basket.partsInBasket.findIndex(basketPart => basketPart.referenceId === part.referenceId && basketPart.sent === false && basketPart.deleted === false);
            if (foundPart > - 1) {
                // found..  add to it
                basket.partsInBasket[foundPart].quantity = basket.partsInBasket[foundPart].quantity + part.quantity;
            } else {
                // no part found just push to basket
                basket.partsInBasket.push(new ConsumablePart(part.referenceId, part.description, part.quantity));
            }
            this.saveBasket(basket);
            this.orderItemCount().then((total) => this._eventAggregator.publish(ConsumableServiceConstants.CONSUMABLE_ADDED, total));
            return basket;
        });

    }

    public saveBasket(basket: ConsumablesBasket): Promise<void> {
        return this._storageService.setConsumablePartsBasket(basket);
    }
    public addFavourite(part: ConsumablePart): Promise<ConsumablesBasket> {
        return this.getConsumablesBasket().then(basket => {
            let foundPart = basket.favourites.findIndex(basketPart => basketPart.referenceId === part.referenceId);
            if (foundPart === - 1) {
                basket.favourites.push(part);
                this.saveBasket(basket);
            }
            return basket;
        });
    }

    public removeFavourite(itemIndex: number): Promise<ConsumablesBasket> {
        return this.getConsumablesBasket().then(basket => {
            basket.favourites.splice(itemIndex, 1);
            this.saveBasket(basket);
            return basket;
        });

    }
    public orderItemCount(): Promise<number> {
        let total: number = 0;
        return this.getConsumablesBasket().then(basket => {
            basket.partsInBasket.filter((p) => p.sent === false).forEach((part) => {
                total += part.quantity;
            });
            return total;
        });
    }

    public clearOldOrders(daysOld: number): Promise<ConsumablesBasket> {
        let today: number = new Date().getTime();
        let remainder: number;
        return this.getConsumablesBasket().then(basket => {
            let filteredParts: ConsumablePart[] = basket.partsInBasket.filter((pib) => {
                let dateAdded: Date = moment(pib.dateAdded).toDate();
                remainder = today - dateAdded.getTime();
                remainder = remainder / (1000 * 60 * 60 * 24);
                if ((remainder < daysOld && pib.sent === true) || pib.sent === false) {
                    return true;
                } else {
                    return false;
                }
            });
            basket.partsInBasket = filteredParts;
            this.saveBasket(basket);
            return basket;
        });
    }
    private setProcessedOrderItemsToSent(basket: ConsumablesBasket): ConsumablesBasket {
        for (let i: number = 0; i < basket.partsInBasket.length; i++) {
            basket.partsInBasket[i].sent = true;
            basket.partsInBasket[i].favourite = false;
        }
        return basket;
    }
}
