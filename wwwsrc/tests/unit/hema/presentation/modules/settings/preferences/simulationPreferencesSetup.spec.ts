import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { IStorageService } from "../../../../../../../app/hema/business/services/interfaces/IStorageService";
import { ILabelService } from "../../../../../../../app/hema/business/services/interfaces/ILabelService";
import { IConfigurationService } from "../../../../../../../app/common/core/services/IConfigurationService";
import { ITrainingModeConfiguration } from "../../../../../../../app/hema/business/services/interfaces/ITrainingModeConfiguration";
import { SimulationPreferences } from "../../../../../../../app/hema/presentation/modules/settings/preferences/simulationPreferences";

export class SimulationPreferencesSetup {

    public sandbox: Sinon.SinonSandbox;
    public labelServiceStub: ILabelService;
    public eaStub: EventAggregator;
    public dialogServiceStub: DialogService;
    public storageServiceStub: IStorageService;
    public configurationServiceStub: IConfigurationService;

    constructor() {
        this.sandbox = sinon.sandbox.create();
        this.labelServiceStub = <ILabelService>{};
        this.eaStub = <EventAggregator>{};
        this.dialogServiceStub = <DialogService>{};
        this.storageServiceStub = <IStorageService>{};
        this.storageServiceStub.getSimulationEngineer = this.sandbox.stub().resolves(undefined);
        this.configurationServiceStub = <IConfigurationService>{};
        this.configurationServiceStub.getConfiguration = this.sandbox.stub().returns({});
    }

    /** Start the Preferences Setup promise chain here */
    public static async start(): Promise<SimulationPreferencesSetup> {
        return new SimulationPreferencesSetup();
    }

    /** End the Preferences Setup promise chain here */
    public static async getPreferences(setup: SimulationPreferencesSetup): Promise<SimulationPreferences> {
        return new SimulationPreferences(
            setup.labelServiceStub,
            setup.eaStub,
            setup.dialogServiceStub,
            setup.configurationServiceStub,
            setup.storageServiceStub);
    }

    public static async activate(preferences: SimulationPreferences): Promise<SimulationPreferences> {
        await preferences.activateAsync();
        return preferences;
    }

    public static async addSimulatedEngineerToStorage(setup: SimulationPreferencesSetup, engineerId: string): Promise<SimulationPreferencesSetup> {
        setup.storageServiceStub.getSimulationEngineer = setup.sandbox.stub().resolves(engineerId);
        return setup;
    }

    public static async addTrainingScenarios(setup: SimulationPreferencesSetup): Promise<SimulationPreferencesSetup> {
        let simulation: ITrainingModeConfiguration = {
            simulation: [{
                engineerId: "1111111",
                firstName: "Joe",
                lastName: "Blogs"
            },
            {
                engineerId: "2222222",
                firstName: "Jane",
                lastName: "Doe"
            }],
            trainingMode: true
        };
        setup.configurationServiceStub.getConfiguration = setup.sandbox.stub().returns(simulation);
        return setup;
    }
}
