import { Part } from "../../models/part";
import { ConsumablePart } from "../../models/consumablePart";
import { FavouriteList } from "../../models/favouriteList";
export interface IFavouriteService {
    addFavouritePart(favouriteItem: Part): Promise<void>;
    addFavouriteConsumablePart(favouriteItem: ConsumablePart): Promise<void>;
    removeFavourite(index: number): Promise<void>;
    reOrder(favouriteItem: Part | ConsumablePart, isPart: boolean): Promise<void>;
    getFavouritesList(): Promise<FavouriteList>;
}
