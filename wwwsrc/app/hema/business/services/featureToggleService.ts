import {IFeatureToggleService} from "./interfaces/IFeatureToggleService";
import {inject} from "aurelia-dependency-injection";
import {IMaterial} from "../../api/models/vanStock/IMaterial";
import {ResilientService} from "../../../common/resilience/services/resilientService";
import {ConfigurationService} from "../../../common/core/services/configurationService";
import {StorageService} from "./storageService";
import {EventAggregator} from "aurelia-event-aggregator";
import {ResilientHttpClientFactory} from "../../../common/resilience/services/resilientHttpClientFactory";
import {WuaNetworkDiagnostics} from "../../../common/core/wuaNetworkDiagnostics";
import {IConfigurationService} from "../../../common/core/services/IConfigurationService";
import {IStorageService} from "./interfaces/IStorageService";
import {IHttpHeaderProvider} from "../../../common/resilience/services/interfaces/IHttpHeaderProvider";
import {ApiException} from "../../../common/resilience/apiException";
import {BusinessException} from "../models/businessException";
import {VanStockHeaderProvider} from "../../api/services/vanStockHeaderProvider";
import * as Logging from "aurelia-logging";

@inject(ConfigurationService, StorageService, EventAggregator, VanStockHeaderProvider, ResilientHttpClientFactory, WuaNetworkDiagnostics)
export class FeatureToggleService extends ResilientService implements IFeatureToggleService {

    private _isAssetTrackingEnabled: boolean;
    private _initialised: boolean;

    private _storage: IStorageService;
    private _log: Logging.Logger;

    constructor(configurationService: IConfigurationService, storageService: IStorageService,
                eventAggregator: EventAggregator, headerProvider: IHttpHeaderProvider, resilientClientFactory: ResilientHttpClientFactory,
                wuaNetworkDiagnostics: WuaNetworkDiagnostics) {

        super(configurationService, "assetTrackingEndpoint", storageService, eventAggregator, headerProvider, resilientClientFactory, wuaNetworkDiagnostics);

        this._initialised = false;
        this._storage = storageService;
        this._log = Logging.getLogger("featureToggleService");
    }

    public async initialise(engineerId: string): Promise<void> {

        // prevent duplicate calls of initialise, developer should only call this once

        if (this._initialised) {
            this._log.warn("initialise should only be called once");
            return Promise.resolve();
        }

        if (engineerId === undefined || engineerId === null || engineerId === "") {
            throw new BusinessException(this, "initialise", "empty engineer id", null, null);
        }

        this._isAssetTrackingEnabled = false;
        this._initialised = true;

        try {
            // check if van stock data exists, undefined => not in local storage
            const items = await this._storage.getMaterials();

            if (items) {
                this._log.info("asset tracking materials already in local storage, asset tracking enabled!");
                this._isAssetTrackingEnabled = true;
                return Promise.resolve();
            }

            // call api

            const data = await this.getData<IMaterial[]>("materials", {engineerId: this.convertEngineerId(engineerId)});
            if (data) {
                this._log.info("asset tracking materials endpoint returned materials, asset tracking enabled!");
                this._isAssetTrackingEnabled = true;
            }
        } catch (error) {

            this._log.warn("asset tracking materials endpoint failed");
            //  no local materials data, check response of api call to get materials, 404 status implies not asset tracked

            if (error && error instanceof ApiException) {
                let statusCode = (error as ApiException).httpStatusCode;

                if (!!statusCode && statusCode.indexOf("404") >= 0) {
                    this._log.warn("materials endpoint returned 404, asset tracking disabled");
                } else {
                    this._log.error("materials endpoint error", error);
                }
            } else {
                this._log.error("problem getting materials", error);
            }
        }
    }

    public isAssetTrackingEnabled(): boolean {
        if (!this._initialised) {
            throw new BusinessException(this, "isAssetTrackingEnabled", "Initialisation has not been ran, call initialise method before calling isAssetTrackingEnabled", null, null);
        }

        return this._isAssetTrackingEnabled;
    }

    private convertEngineerId(input: string): string {
        // return parseInt((input || "").replace(/\D/g, ""), 10);
        return input;
    }
}
