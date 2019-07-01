import {ILabelService} from "../../../../business/services/interfaces/ILabelService";
import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";
import {LabelService} from "../../../../business/services/labelService";
import {inject} from "aurelia-dependency-injection";
import {BaseInformation} from "./baseInformation";
import {RetryPayload} from "../../../../../common/resilience/models/retryPayload";
import {ResilientServiceConstants} from "../../../../../common/resilience/constants/resilientServiceConstants";
import {InfoDialogModel} from "../../../../../common/ui/dialogs/models/infoDialogModel";
import {InformationDialog} from "./dialog/informationDialog";
import { IResilientService } from "../../../../../common/resilience/services/interfaces/IResilientService";

@inject(LabelService, EventAggregator, DialogService)
export class ResilienceInformation extends BaseInformation {
    public unsentCalls: { type: string, id: string, showDetail: boolean, payload: RetryPayload }[];
    public isRetryInProgress: boolean;
    public showRecords: boolean;
    public title: string;
    private _resilientService: IResilientService;
    private _subscription: Subscription;

    constructor(labelService: ILabelService, eventAggregator: EventAggregator, dialogService: DialogService) {
        super(labelService, eventAggregator, dialogService);
    }

    public async activateAsync(model: {service: IResilientService, title: string }) : Promise<void> {
        this._resilientService = model.service;
        this.title = model.title;
        // create the subscription only when we know labels have been loaded, otherwise we get this.getLabel(...) errors
        this._subscription = this._eventAggregator.subscribe(ResilientServiceConstants.UNSENT_PAYLOADS_UPDATES, async (val: string) => {
            if (val === this._resilientService.getConfigurationName()) {
                await this.loadPayloads();
            }
         });
        await this.loadPayloads();
    }

    public async detachedAsync() : Promise<void> {
        if (this._subscription) {
            this._subscription.dispose();
            this._subscription = undefined;
        }
    }

    public async loadPayloads() : Promise<void> {

        let unsentPayloads = ((await this._resilientService.getUnsentPayloads()) || [])
                                // we get flashing because all calls go through resilience.  If a call is fine, we
                                //  see it momentarily in the list.  So we filter out these "only one call in the list for a flash" calls.
                                .filter(((payload, _, payloads)  => payload.lastRetryTime || payloads.length > 1));

        this.unsentCalls = unsentPayloads.map(item => ({
            type: item.routeName,
            id: this.getItemRepresentativeValue(item),
            showDetail: false,
            payload: item
        }));

        this.isRetryInProgress = this._resilientService.isRetryInProgress();
    }

    public retryAll() : void {
        this._resilientService.sendAllRetryPayloads();
    }

    public showDetail(retryPayload: RetryPayload) : void {
        let vm : InfoDialogModel = new InfoDialogModel(this.getLabel("failureInformation"), retryPayload.lastFailureMessage);
        this._dialogService.open({viewModel: InformationDialog, model: vm});
    }

    private getItemRepresentativeValue(payload: RetryPayload): string {
        return payload
                && payload.params
                && Object.keys(payload.params)
                && Object.keys(payload.params).length
                && payload.params[Object.keys(payload.params)[0]];
    }
}
