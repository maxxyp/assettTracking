import { inject } from "aurelia-framework";
import { BaseViewModel } from "../../models/baseViewModel";
import { ConsumableService } from "../../../business/services/consumableService";
import { IConsumableService } from "../../../business/services/interfaces/IConsumableService";
import { ConsumablesBasket as ConsumablePartsBasket } from "../../../business/models/consumablesBasket";
import { ConsumablePart } from "../../../business/models/consumablePart";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { LabelService } from "../../../business/services/labelService";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import * as moment from "moment";
@inject(LabelService, EventAggregator, DialogService, ConsumableService)
export class ConsumablesHistory extends BaseViewModel {
    public consumablesBasket: ConsumablePartsBasket;
    public consumableService: IConsumableService;
    constructor(
        labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        consumableService: IConsumableService) {
        super(labelService, eventAggregator, dialogService);
        this.consumableService = consumableService;
    }
    public activateAsync(): Promise<any> {
        this.consumablesBasket = new ConsumablePartsBasket();
        return this.consumableService.clearOldOrders(60).then(() => {
            this.consumableService.getConsumablesBasket().then(partsBasket => {
                partsBasket.partsInBasket.forEach(part => {
                    part.dateAdded = moment(part.dateAdded).format("YYYY-MM-DD");
                });
                this.consumablesBasket = partsBasket;
                this.showContent();
            });
        });

    }
    public reOrder(partItem: ConsumablePart): void {
        // mark confimed that a reorder part item quantity from order-history will always be one - defect DF_1350
        // quantity can be changed in the consumable-basket view before placing an order.
        let part = <ConsumablePart> {            
            referenceId: partItem.referenceId,
            description: partItem.description,
            quantity: 1
        };
        
        this.consumableService.addConsumableToBasket(part);
    }
}
