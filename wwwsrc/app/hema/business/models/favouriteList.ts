import { Part } from "./part";
import { ConsumablePart } from "./consumablePart";
export class FavouriteList {
    public favourites: (Part | ConsumablePart)[];
    constructor() {
        this.favourites = [];
    }
}
