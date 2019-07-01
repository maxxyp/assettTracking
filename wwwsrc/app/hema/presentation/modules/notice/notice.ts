import {BaseViewModel} from "../../models/baseViewModel";
import {ILabelService} from "../../../business/services/interfaces/ILabelService";
import {LabelService} from "../../../business/services/labelService";
import {inject} from "aurelia-dependency-injection";
import {Risk} from "../../../business/models/risk";
import {Appliance} from "../../../business/models/appliance";
import {IRiskService} from "../../../business/services/interfaces/IRiskService";
import {RiskService} from "../../../business/services/riskService";
import * as moment from "moment";
import {DialogController, DialogService} from "aurelia-dialog";
import {EventAggregator} from "aurelia-event-aggregator";
import {ObjectHelper} from "../../../../common/core/objectHelper";

@inject(LabelService, EventAggregator, DialogService, RiskService, DialogController)
export class Notice extends BaseViewModel {

    public risks: Risk[];
    public hazard: Risk;
    public hazardTitle: string;
    public appliance: Appliance;
    public jobId: string;
    public controller: DialogController;

    private _riskService: IRiskService;

    constructor(labelService: ILabelService,
                eventAggregator: EventAggregator,
                dialogService: DialogService,
                riskService: IRiskService,
                controller: DialogController) {
        super(labelService, eventAggregator, dialogService);

        this._riskService = riskService;
        this.controller = controller;

        this.risks = [];
        this.hazard = null;
        this.hazardTitle = "";
    }

    public activateAsync(params: {jobId: string}): Promise<void> {
        this.jobId = params.jobId;

        return this._riskService.getRisks(params.jobId).then(risks => {
            this.risks = risks.filter(r => r.isHazard === false);
            /* clone the object as we modify it later with label lookup, but we dont want to break original data */
            this.hazard = ObjectHelper.clone(risks.find(r => r.isHazard === true));
            if (this.hazard) {
                this.hazardTitle = this.getLabel("hazard");
            }
            this.showContent();
        });
    }

    public getYear(dt: Date): string {
        return moment(dt).format("YYYY");
    }
}
