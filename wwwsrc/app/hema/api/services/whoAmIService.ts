/// <reference path="../../../../typings/app.d.ts" />

import {inject} from "aurelia-framework";
import {IConfigurationService} from "../../../common/core/services/IConfigurationService";
import {ConfigurationService} from "../../../common/core/services/configurationService";
import {IWhoAmI} from "../models/fft/whoAmI/IWhoAmI";
import {IWhoAmIService} from "./interfaces/IWhoAmIService";
import {ResilientService} from "../../../common/resilience/services/resilientService";
import {EventAggregator} from "aurelia-event-aggregator";
import { StorageService } from "../../business/services/storageService";
import { IStorageService } from "../../business/services/interfaces/IStorageService";
import { ResilientHttpClientFactory } from "../../../common/resilience/services/resilientHttpClientFactory";
import { WuaNetworkDiagnostics } from "../../../common/core/wuaNetworkDiagnostics";

@inject(ConfigurationService, StorageService, EventAggregator, ResilientHttpClientFactory, WuaNetworkDiagnostics)
export class WhoAmIService extends ResilientService implements IWhoAmIService {
    constructor(configurationService: IConfigurationService, storageService: IStorageService, eventAggregator: EventAggregator, resilientClientFactory: ResilientHttpClientFactory,
        wuaNetworkDiagnostics: WuaNetworkDiagnostics) {
        super(configurationService, "whoAmIServiceEndpoint", storageService, eventAggregator, undefined, resilientClientFactory, wuaNetworkDiagnostics);
    }

    public whoAmI(attributes: string[], roles: string[]): Promise<IWhoAmI> {
        return this.getData<any>("whoAmI", { "?attributes": attributes.join(","), "?roles": roles.join(",")});
    }
}
