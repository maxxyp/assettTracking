/// <reference path="../../../../typings/app.d.ts" />

import {inject} from "aurelia-framework";
import {IConfigurationService} from "../../../common/core/services/IConfigurationService";
import {ConfigurationService} from "../../../common/core/services/configurationService";
import {IBridgeApiService} from "./interfaces/IBridgeApiService";
import {IAdaptModelAttributeResponse} from "../models/adapt/IAdaptModelAttributeResponse";
import {IAdaptModelResponse} from "../models/adapt/IAdaptModelResponse";
import {IAdaptPartsSelectedResponse} from "../models/adapt/IAdaptPartsSelectedResponse";
import {IAdaptUserSettingsResponse} from "../models/adapt/IAdaptUserSettingsResponse";
import {ResilientService} from "../../../common/resilience/services/resilientService";
import {EventAggregator} from "aurelia-event-aggregator";
import {IQuoteCustomerDetails} from "../models/adapt/IQuoteCustomerDetails";
import { StorageService } from "../../business/services/storageService";
import { IStorageService } from "../../business/services/interfaces/IStorageService";
import { ResilientHttpClientFactory } from "../../../common/resilience/services/resilientHttpClientFactory";

@inject(ConfigurationService, StorageService, EventAggregator, ResilientHttpClientFactory)
export class BridgeApiService extends ResilientService implements IBridgeApiService {
    constructor(configurationService: IConfigurationService, storageService: IStorageService, eventAggregator: EventAggregator, resilientClientFactory: ResilientHttpClientFactory) {
        super(configurationService, "adaptServiceEndpoint", storageService, eventAggregator, undefined, resilientClientFactory);
    }

    public getModels(applianceGCCode: string): Promise<IAdaptModelResponse> {
        return this.getData<IAdaptModelResponse>("models", { "gcNumber": applianceGCCode });
    }

    public getModelAttributes(modelId: number): Promise<IAdaptModelAttributeResponse> {
        return this.getData<IAdaptModelAttributeResponse>("attributes", { "modelId": modelId });
    }

    public getPartsSelected(): Promise<IAdaptPartsSelectedResponse> {
        return this.getData<IAdaptPartsSelectedResponse>("parts", null, true);
    }
    public getUserSettings(): Promise<IAdaptUserSettingsResponse> {
        return this.getData<IAdaptUserSettingsResponse>("settings", null, true);
    }
    public postCustomerDetails(quoteCustomerDetails: IQuoteCustomerDetails): Promise<void> {
      return this.postData<IQuoteCustomerDetails, void>("customerDetails", null, quoteCustomerDetails);
    }
    public getStatusOk(): Promise<void> {
        return this.getData<void>("status", null, true);
    }
    public getVersion(): Promise<string> {
        return this.getData<string>("version", null, true);
    }
}
