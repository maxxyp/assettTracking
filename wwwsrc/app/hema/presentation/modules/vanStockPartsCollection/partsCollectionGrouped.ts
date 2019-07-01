import {inject} from "aurelia-dependency-injection";
import {LabelService} from "../../../business/services/labelService";
import {EventAggregator} from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";
import {BaseViewModel} from "../../models/baseViewModel";
import {ILabelService} from "../../../business/services/interfaces/ILabelService";
import {PartCollectionItemViewModel} from "./viewModels/partCollectionItemViewModel";
import { Material } from "../../../business/models/material";

@inject(LabelService, EventAggregator, DialogService)
export class PartsCollectionGrouped extends BaseViewModel {

    public VANSTOCK_ID: string;

    public groups: { [jobId: string]: PartCollectionItemViewModel [] };
    public returns: Material[];
    public groupNames: string[];
    public myVanAreas: string[];

    constructor(labelService: ILabelService,
                eventAggregator: EventAggregator,
                dialogService: DialogService) {

        super(labelService, eventAggregator, dialogService);

        this.VANSTOCK_ID = "VANSTOCK_ID";
        this.groups = {};
        this.groupNames = [];
    }

    public activateAsync(params: { parts: PartCollectionItemViewModel [], returns: Material[], myVanAreas: string []}): Promise<void> {

        if (!params) {
            return Promise.resolve();
        }

        const {parts, myVanAreas} = params;

        parts.forEach(m => {

            const {jobId: groupId = this.VANSTOCK_ID} = m; // undefined job id means van stock item

            if (this.groups[groupId]) {
                this.groups[groupId].push(m);
            } else {
                this.groups[groupId] = [m];
            }
        });

        this.groupNames =  Object.keys(this.groups);
        this.myVanAreas = myVanAreas;
        this.returns = params.returns;

        return Promise.resolve();
    }

}
