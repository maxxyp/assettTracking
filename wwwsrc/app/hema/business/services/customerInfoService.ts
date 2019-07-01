import {IConfigurationService} from "../../../common/core/services/IConfigurationService";
import {ILabelService} from "./interfaces/ILabelService";
import {ICustomerInfoService} from "./interfaces/ICustomerInfoService";
import {LabelService} from "./labelService";
import {ConfigurationService} from "../../../common/core/services/configurationService";
import {inject} from "aurelia-dependency-injection";
import {ICustomerInfoConfiguration} from "./interfaces/ICustomerInfoConfiguration";
import {AppIntegrationRegistry} from "../../../common/core/services/appIntegrationRegistry";
import {IAppIntegrationRegistry} from "../../../common/core/services/IAppIntegrationRegistry";
import { DateHelper } from "../../core/dateHelper";

const DEFAULT_REOPEN_EXPIRY: number = 30;

@inject(ConfigurationService, AppIntegrationRegistry, LabelService)
export class CustomerInfoService implements ICustomerInfoService {

    private _customerInfoAutoLaunch: boolean;
    private _customerInfoReOpenExpiryMinutes: number;

    private _appIntegrationRegistry: IAppIntegrationRegistry;
    private _labelService: ILabelService;

    private _lastInvocations: { [index: string]: number };

    constructor(configurationService: IConfigurationService, appIntegrationRegistry: IAppIntegrationRegistry, labelService: ILabelService) {
        let config = configurationService.getConfiguration<ICustomerInfoConfiguration>();

        this._customerInfoReOpenExpiryMinutes = config.customerInfoReOpenExpiryMinutes || DEFAULT_REOPEN_EXPIRY;
        this._customerInfoAutoLaunch = config.customerInfoAutoLaunch || false;

        this._appIntegrationRegistry = appIntegrationRegistry;
        this._labelService = labelService;
        this._lastInvocations = {};
    }

    public async openAppIfNotVisited(premisesId: string, force?: boolean): Promise<void> {
        if (!this._customerInfoAutoLaunch) {
            return;
        }

        let lastInvocation = this._lastInvocations[premisesId];

        if (force
            || !lastInvocation
            || DateHelper.getTimestampMs() >= lastInvocation + (this._customerInfoReOpenExpiryMinutes * 60 * 1000)
        ) {
            return this.launchCustomerInfo(premisesId);
        }
    }

    public async openApp(premisesId: string): Promise<void> {
        return this.launchCustomerInfo(premisesId);
    }

    public registerCustomerTipsCallback(callback: (premisesId: string) => void): { dispose: () => void } {
        return this._appIntegrationRegistry.customerInfo.subscribe.customerTipsComplete(callback);
    }

    private async launchCustomerInfo(premisesId: string): Promise<void> {
        let labels = await this._labelService.getGroup("customerInfoService");
        let returnToAppText = labels && labels.customerInfoReturnToApp;
        this._appIntegrationRegistry.customerInfo.navigateTo.premises(premisesId, {
            returnUri: true,
            returnUriText: returnToAppText,
            fullScreen: true
        });
        this._lastInvocations[premisesId] = DateHelper.getTimestampMs();
    }
}
