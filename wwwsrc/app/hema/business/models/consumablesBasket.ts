import { ConsumablePart } from "./consumablePart";
export class ConsumablesBasket {
    public lastPartGatheredTime: Date;
    public partsInBasket: ConsumablePart[];
    public favourites: ConsumablePart[];
    constructor() {
        this.favourites = [];
        this.partsInBasket = [];
    }
}
