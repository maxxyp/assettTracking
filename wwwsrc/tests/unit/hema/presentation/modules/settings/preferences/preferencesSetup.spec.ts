import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { IStorageService } from "../../../../../../../app/hema/business/services/interfaces/IStorageService";
import { ILabelService } from "../../../../../../../app/hema/business/services/interfaces/ILabelService";
import { IConfigurationService } from "../../../../../../../app/common/core/services/IConfigurationService";
import { Preferences } from "../../../../../../../app/hema/presentation/modules/settings/preferences/preferences";
import { ITrainingModeConfiguration } from "../../../../../../../app/hema/business/services/interfaces/ITrainingModeConfiguration";
import { PlatformHelper } from "../../../../../../../app/common/core/platformHelper";

export class PreferencesSetup {

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
        this.configurationServiceStub = <IConfigurationService>{};
        this.configurationServiceStub.getConfiguration = this.sandbox.stub().returns({});
    }

    /** Start the Preferences Setup promise chain here */
    public static async start(): Promise<PreferencesSetup> {
        return new PreferencesSetup();
    }

    /** End the Preferences Setup promise chain here */
    public static async getPreferences(setup: PreferencesSetup): Promise<Preferences> {
        return new Preferences(
            setup.labelServiceStub,
            setup.eaStub,
            setup.dialogServiceStub,
            setup.configurationServiceStub,
            setup.storageServiceStub);
    }

    public static async activateAsync(preferences: Preferences): Promise<Preferences> {
        await preferences.activateAsync();
        return preferences;
    }

    public static async disableDeveloperMode(setup: PreferencesSetup): Promise<PreferencesSetup> {
        PlatformHelper.isDevelopment = false;
        return setup;
    }

    public static async enableDeveloperMode(setup: PreferencesSetup): Promise<PreferencesSetup> {
        PlatformHelper.isDevelopment = true;
        return setup;
    }

    public static async setUserSettingComplete(setup: PreferencesSetup): Promise<PreferencesSetup> {
        setup.storageServiceStub.userSettingsComplete = setup.sandbox.stub().resolves(true);
        return setup;
    }

    public static async setupUserSetting(setup: PreferencesSetup): Promise<PreferencesSetup> {
        setup.storageServiceStub.getUserPatch = setup.sandbox.stub().resolves("PatchES");
        setup.storageServiceStub.getWorkingSector = setup.sandbox.stub().resolves("74L2");
        setup.storageServiceStub.getUserRegion = setup.sandbox.stub().resolves("");
        return setup;
    }

    public static async addTrainingScenarios(setup: PreferencesSetup): Promise<PreferencesSetup> {
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
