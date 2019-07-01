import { inject } from "aurelia-dependency-injection";
import { StorageService } from "../../../../business/services/storageService";
import { IStorageService } from "../../../../business/services/interfaces/IStorageService";
import { ApplicationSettings } from "../../../../business/models/applicationSettings";
import { ILabelService } from "../../../../business/services/interfaces/ILabelService";
import { LabelService } from "../../../../business/services/labelService";
import { observable } from "aurelia-binding";
import { BaseViewModel } from "../../../models/baseViewModel";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";

@inject(LabelService, EventAggregator, DialogService, StorageService)
export class DisplayPreferences extends BaseViewModel {

    @observable
    public toastSelectedPosition: number;

    @observable
    public toastDelay: number;
    public toastScreenPositions: { code: number, position: string }[];
    public appSettings: ApplicationSettings;
    public toastTimeValues: { timeInSecond: number, description: string }[];

    @observable
    public dropdownType: number;
    public dropdownTypeValues: { code: number, description: string }[];

    @observable
    public sound: number;
    public dropdownSoundNotificationValues: {code: number, description: string }[];

    private _storage: IStorageService;

    constructor(labelService: ILabelService, eventAggregator: EventAggregator, dialogService: DialogService, storage: IStorageService) {
        super(labelService, eventAggregator, dialogService);

        this.appSettings = <ApplicationSettings>{};
        this._storage = storage;
    }

    public activateAsync(): Promise<any> {

        this.toastScreenPositions = [];
        this.toastScreenPositions.push({ code: 1, position: "Top Centre" });
        this.toastScreenPositions.push({ code: 2, position: "Top Left" });
        this.toastScreenPositions.push({ code: 3, position: "Top Right" });
        this.toastScreenPositions.push({ code: 4, position: "Bottom Centre" });
        this.toastScreenPositions.push({ code: 5, position: "Bottom Left" });
        this.toastScreenPositions.push({ code: 6, position: "Bottom Right" });

        this.toastTimeValues = [];
        this.toastTimeValues.push({ timeInSecond: 1, description: "1 Second" });
        this.toastTimeValues.push({ timeInSecond: 2, description: "2 Seconds" });
        this.toastTimeValues.push({ timeInSecond: 3, description: "3 Seconds" });
        this.toastTimeValues.push({ timeInSecond: 5, description: "5 Seconds" });
        this.toastTimeValues.push({ timeInSecond: 7, description: "7 Seconds" });
        this.toastTimeValues.push({ timeInSecond: 10, description: "10 Seconds" });

        this.dropdownTypeValues = [];
        this.dropdownTypeValues.push({ code: 1, description: "Normal" });
        this.dropdownTypeValues.push({ code: 2, description: "Smash Buttons" });

        this.dropdownSoundNotificationValues = [];
        this.dropdownSoundNotificationValues.push({code: 1, description: "Off"});
        this.dropdownSoundNotificationValues.push({code: 2, description: "On"});

        return this._storage.getAppSettings()
            .then((settings) => {
                this.appSettings = settings;
                this.dropdownType = this.appSettings.dropdownType;
                this.toastDelay = this.appSettings.notificationDisplayTime;
                this.toastSelectedPosition = this.appSettings.notificationPosition;
                this.sound = this.appSettings.soundEnabled ? 2 : 1;
            });
    }

    public toastDelayChanged(newValue: number, oldValue: number): void {
        this.appSettings.notificationDisplayTime = newValue;
        this._storage.setAppSettings(this.appSettings);
    }

    public toastSelectedPositionChanged(newValue: number, oldValue: number): void {
        this.appSettings.notificationPosition = newValue;
        this._storage.setAppSettings(this.appSettings);
    }

    public dropdownTypeChanged(newValue: number, oldValue: number): void {
        this.appSettings.dropdownType = newValue;
        this._storage.setAppSettings(this.appSettings);
    }

    public soundChanged(newValue: number, oldValue: number): void {
        this.appSettings.soundEnabled = newValue === 2;
        this._storage.setAppSettings(this.appSettings);
    }
}
