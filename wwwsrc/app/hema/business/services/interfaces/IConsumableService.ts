import { ConsumablesBasket } from "../../models/consumablesBasket";
import { ConsumablePart } from "../../models/consumablePart";
export interface IConsumableService {
    getConsumablesBasket(): Promise<ConsumablesBasket>; 
    removeConsumableFromBasket(stockReferenceId: string): Promise<ConsumablesBasket> ;
    addConsumableToBasket(part: ConsumablePart): Promise<ConsumablesBasket>;
    placeOrder(consumablesPartsBasket: ConsumablesBasket): Promise<ConsumablesBasket>;
    saveBasket(basket: ConsumablesBasket): Promise<void>;
    addFavourite(part: ConsumablePart): Promise<ConsumablesBasket>; 
    removeFavourite(itemIndex: number): Promise<ConsumablesBasket>;
    orderItemCount(): Promise<number>;
    clearOldOrders(daysOld: number): Promise<ConsumablesBasket>;
}
