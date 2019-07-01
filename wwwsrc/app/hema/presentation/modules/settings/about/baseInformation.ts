import {BaseViewModel} from "../../../models/baseViewModel";
import {ILabelService} from "../../../../business/services/interfaces/ILabelService";
import {EventAggregator} from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";
import {LabelService} from "../../../../business/services/labelService";
import {inject} from "aurelia-dependency-injection";

@inject(LabelService, EventAggregator, DialogService)
export abstract class BaseInformation extends BaseViewModel {
    public isExpanded: boolean;

    constructor(labelService: ILabelService, eventAggregator: EventAggregator, dialogService: DialogService) {
        super(labelService, eventAggregator, dialogService);

        this.isExpanded = true;
    }

    public toggleExpanded() : void {
        this.isExpanded = !this.isExpanded;
    }
}
