import { BaseInformation } from "./baseInformation";
import { inject } from "aurelia-framework";
import { AssetService } from "../../../../../common/core/services/assetService";
import { IAssetService } from "../../../../../common/core/services/IAssetService";
import { ILabelService } from "../../../../business/services/interfaces/ILabelService";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { LabelService } from "../../../../business/services/labelService";

@inject(LabelService, EventAggregator, DialogService, AssetService)
export class ReleaseNotes extends BaseInformation  {
    public releaseNotesHtml: string;
    private _assetService: IAssetService;

    constructor(labelService: ILabelService, eventAggregator: EventAggregator, dialogService: DialogService, assetService: IAssetService) {
        super(labelService, eventAggregator, dialogService);
        this._assetService = assetService;
    }

    public async activateAsync(): Promise<void> {
        this.releaseNotesHtml = await this._assetService.loadText("document_templates/release-notes.html");
    }
}
