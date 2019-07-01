import { ILabelService } from "../../../../business/services/interfaces/ILabelService";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { LabelService } from "../../../../business/services/labelService";
import { inject } from "aurelia-dependency-injection";
import { BaseInformation } from "./baseInformation";
import {IFeatureToggleService} from "../../../../business/services/interfaces/IFeatureToggleService";
import {FeatureToggleService} from "../../../../business/services/featureToggleService";

@inject(LabelService, EventAggregator, DialogService, FeatureToggleService)
export class FeatureToggle extends BaseInformation {
    public platform: string;
    public isExpanded: boolean;

    private _assetTrackingIsEnabled: boolean;
    private _featureToggleService: IFeatureToggleService;

    constructor(labelService: ILabelService, eventAggregator: EventAggregator, dialogService: DialogService,
                featureToggleService: IFeatureToggleService) {
        super(labelService, eventAggregator, dialogService);

        this._featureToggleService = featureToggleService;
        this.isExpanded = false;
    }

    public async activateAsync(): Promise<void> {
        this._assetTrackingIsEnabled = this._featureToggleService.isAssetTrackingEnabled();
    }

    public get assetTrackingIsEnabled() : boolean {
        return this._assetTrackingIsEnabled;
    }

}
