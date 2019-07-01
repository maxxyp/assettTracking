import {DataStateProvider} from "./dataStateProvider";
import {Part} from "./part";
import {DataState} from "./dataState";

export class PartsBasket  extends DataStateProvider {
    public lastPartGatheredTime: Date;

    public partsToOrder: Part[]; // this property has the actual list of parts to order, use this when sending back to API
    public partsInBasket: Part[];

    public showAddPartManually: boolean;
    public showSearchFavourites: boolean;
    public showRemainingAddPartManuallyFields: boolean;
    public manualPartDetail: Part;

    // public partsRequired: boolean;
    public hasAtLeastOneWrongActivityStatus: boolean;

    public taskStatus: string;

    public deliverPartsToSite: boolean;
    public dataStateGroup: any;
    public partsListValidation: string;
    // public partsInBasketRequired: boolean;

    constructor() {
        super(DataState.dontCare, "parts");

        this.hasAtLeastOneWrongActivityStatus = false;

        this.partsToOrder = [];
        this.partsInBasket = [];
    }
}
