import { inject } from "aurelia-dependency-injection";
import { ILabelService } from "../../../../business/services/interfaces/ILabelService";
import { LabelService } from "../../../../business/services/labelService";
import {BaseViewModel} from "../../../models/baseViewModel";
import {EventAggregator} from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";
import {IConfigurationService} from "../../../../../common/core/services/IConfigurationService";
import {ConfigurationService} from "../../../../../common/core/services/configurationService";
import {StorageService} from "../../../../business/services/storageService";
import {IStorageService} from "../../../../business/services/interfaces/IStorageService";
import {ITrainingModeConfiguration} from "../../../../business/services/interfaces/ITrainingModeConfiguration";
import {PlatformHelper} from "../../../../../common/core/platformHelper";

@inject(LabelService, EventAggregator, DialogService, ConfigurationService, StorageService)
export class Preferences extends BaseViewModel {
    public showSimulation: boolean;

    private _configurationService: IConfigurationService;
    private _storageService: IStorageService;
    private _appConfig: ITrainingModeConfiguration;

    constructor(labelService: ILabelService, eventAggregator: EventAggregator, dialogService: DialogService,
                configurationService: IConfigurationService, storageService: IStorageService) {
        super(labelService, eventAggregator, dialogService);

        this._configurationService = configurationService;
        this._storageService = storageService;
        this._appConfig = this._configurationService.getConfiguration<ITrainingModeConfiguration>();
    }

    public activateAsync(): Promise<any> {
        this.showSimulation = !!this._appConfig.simulation || !!PlatformHelper.isDevelopment;
        return Promise.resolve();
    }

    public canDeactivateAsync(): Promise<boolean> {
        return this._storageService.userSettingsComplete();
    }
}
