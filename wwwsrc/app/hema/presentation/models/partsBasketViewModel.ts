import {Part} from "../../business/models/part";
import {DataState} from "../../business/models/dataState";

export class PartsBasketViewModel {

    public lastPartGatheredTime: Date;
    public partsToOrder: Part[]; // this property has the actual list of parts to order, use this when sending back to API
    public partsInBasket: Part[];
    public showAddPartManually: boolean;
    public showRemainingAddPartManuallyFields: boolean;
    public manualPartDetail: Part;
    public deliverPartsToSite: boolean;
    // public partsRequired: boolean; 
    public hasAtLeastOneWrongActivityStatus: boolean;
    // public taskStatus: string;
    public partsListValidation: string;
    // public partsInBasketRequired: boolean;

    public dataState: DataState;
    public dataStateId: string;

    constructor() {
        this.hasAtLeastOneWrongActivityStatus = false;

        this.partsToOrder = [];
        this.partsInBasket = [];
    }
}
