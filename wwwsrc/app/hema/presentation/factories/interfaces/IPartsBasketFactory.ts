import {PartsBasket as PartsBasketBusinessModel} from "../../../business/models/partsBasket";
import {PartsBasketViewModel} from "../../models/partsBasketViewModel";

export interface IPartsBasketFactory {

    createPartsBasketViewModel(partsBasket: PartsBasketBusinessModel): PartsBasketViewModel;
}
