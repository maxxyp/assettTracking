import {inject} from "aurelia-dependency-injection";
import {EventAggregator} from "aurelia-event-aggregator";
import {SimulationConstants} from "../../../../../common/simulation/constants/simulationConstants";
import {observable} from "aurelia-binding";
import {StorageService} from "../../../../business/services/storageService";
import {IStorageService} from "../../../../business/services/interfaces/IStorageService";
import {ConfigurationService} from "../../../../../common/core/services/configurationService";
import {IConfigurationService} from "../../../../../common/core/services/IConfigurationService";
import {ITrainingModeConfiguration} from "../../../../business/services/interfaces/ITrainingModeConfiguration";
import {ISimulation} from "../../../../business/services/interfaces/ISimulation";
import {BaseViewModel} from "../../../models/baseViewModel";
import {ILabelService} from "../../../../business/services/interfaces/ILabelService";
import {DialogService} from "aurelia-dialog";
import {LabelService} from "../../../../business/services/labelService";
import {WindowHelper} from "../../../../core/windowHelper";

@inject(LabelService, EventAggregator, DialogService, ConfigurationService, StorageService)
export class SimulationPreferences extends BaseViewModel {

    public simulations: ISimulation[];

    @observable()
    public engineerId: string;

    @observable()
    public customEngineerId: string;

    private _storageService: IStorageService;
    private _pageReady: boolean;
    private _configurationService: IConfigurationService;
    private _appConfig: ITrainingModeConfiguration;

    constructor(labelService: ILabelService,
                eventAggregator: EventAggregator,
                dialogService: DialogService,
                configurationService: IConfigurationService,
                storageService: IStorageService) {
        super(labelService, eventAggregator, dialogService);

        this._storageService = storageService;
        this._configurationService = configurationService;
        this._appConfig = this._configurationService.getConfiguration<ITrainingModeConfiguration>();
        this.simulations = this._appConfig.simulation || [];
    }

    public activateAsync(): Promise<void> {
        return this._storageService.getSimulationEngineer()
            .then((engineerId) => {
                if (this.simulations && this.simulations.some(sim => sim.engineerId === engineerId)) {
                    this.engineerId = engineerId;
                } else {
                    this.customEngineerId = engineerId;
                }
                this._pageReady = true;
            });
    }

    public engineerIdChanged(newValue: string, oldValue: string): void {
        if (this._pageReady && newValue !== oldValue) {
            let simulation = this.simulations.find(sim => sim.engineerId === this.engineerId);

            this.setEngineer(simulation);
        }
    }

    public assignCustomEngineerId(): void {
        let simulation: ISimulation = {
            firstName: "Custom",
            lastName: "Engineer",
            engineerId: this.customEngineerId
        };

        this.setEngineer(simulation);
    }

    private setEngineer(simulation: ISimulation): void {
        if (simulation) {
            this._storageService.deleteEngineer()
                .then(() => this._storageService.setWorkListJobs(null))
                .then(() => this._storageService.setMaterials(null))
                .then(() => this._storageService.setMaterialAdjustments(null))
                .then(() => this._storageService.setSimulationEngineer(simulation.engineerId))
                .then(() => this._storageService.setMessages(null))
                .then(() => {
                    this._eventAggregator.publish(SimulationConstants.SIMULATION_OVERRIDE_EVENT, {
                        route: "whoami/v1",
                        data: {
                            userId: simulation.firstName.toLowerCase() + simulation.lastName.toLowerCase(),
                            attributes: [
                                {
                                    "employeeid": simulation.engineerId
                                },
                                {
                                    "givenname": simulation.firstName
                                },
                                {
                                    "sn": simulation.lastName
                                },
                                {
                                    "telephonenumber": "01234 567890"
                                }
                            ]
                        }
                    });

                    WindowHelper.reload();
                });
        }
    }
}
