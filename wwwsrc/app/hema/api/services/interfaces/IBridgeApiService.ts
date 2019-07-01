/// <reference path="../../../../../typings/app.d.ts" />

import {IAdaptModelResponse} from "../../models/adapt/IAdaptModelResponse";
import {IAdaptModelAttributeResponse} from "../../models/adapt/IAdaptModelAttributeResponse";
import {IAdaptPartsSelectedResponse} from "../../models/adapt/IAdaptPartsSelectedResponse";
import {IAdaptUserSettingsResponse} from "../../models/adapt/IAdaptUserSettingsResponse";
import {IResilientService} from "../../../../common/resilience/services/interfaces/IResilientService";
import {IQuoteCustomerDetails} from "../../models/adapt/IQuoteCustomerDetails";

export interface IBridgeApiService extends IResilientService {
    getModels(applianceGCCode: string) : Promise<IAdaptModelResponse>;
    getModelAttributes(modelId: number) : Promise<IAdaptModelAttributeResponse>;
    getPartsSelected() : Promise<IAdaptPartsSelectedResponse>;
    getUserSettings(): Promise<IAdaptUserSettingsResponse>;
    postCustomerDetails(quoteCustomerDetails: IQuoteCustomerDetails): Promise<void>;
    getStatusOk(): Promise<void>;
    getVersion(): Promise<string>;
}
