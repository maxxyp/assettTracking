/// <reference path="../../../../typings/app.d.ts" />

import {IScenarioStore} from "../IScenarioStore";
import {Scenario} from "../models/scenario";
import {LocalStorageService} from "../../storage/wua/localStorageService";
import {PlatformHelper} from "../../core/platformHelper";
import {AssetService} from "../../core/services/assetService";
import {IAssetService} from "../../core/services/IAssetService";
import {inject} from "aurelia-dependency-injection";

@inject(AssetService)
export class ScenarioStore implements IScenarioStore {
    private _assetService: IAssetService;
    private _localStorageService: LocalStorageService;
    private _fallback: boolean;
    private _baseDir: string;

    constructor(assetService: IAssetService) {
        this._assetService = assetService;
        this._fallback = false;
    }

    public initialise(baseDir: string): Promise<void> {
        this._baseDir = baseDir;

        return new Promise<void>((resolve, reject) => {
            if (PlatformHelper.isMobile()) {
                Windows.Storage.KnownFolders.removableDevices.getFoldersAsync()
                    .then((folders) => {
                        if (!this._localStorageService && folders && folders.length > 0) {
                            this._localStorageService = new LocalStorageService(folders[0]);
                            this._localStorageService.initialise("Documents\\" +
                                Windows.ApplicationModel.Package.current.displayName + "\\" + this._baseDir, false)
                                .then(() => {
                                    this.tryLoadScenarios().then(() => {
                                        resolve();
                                    });
                                });
                        } else {
                            this._fallback = true;
                            resolve();
                        }
                    }, (error) => {
                        this._fallback = true;
                        resolve();
                    });
            } else {
                this._localStorageService =
                    new LocalStorageService(Windows.Storage.ApplicationData.current.localFolder);

                this._localStorageService.initialise(this._baseDir, false).then(() => {
                    this.tryLoadScenarios().then(() => {
                        resolve();
                    });
                })
                    .catch(() => {
                        this._fallback = true;
                        resolve();
                    });
            }
        });
    }

    public loadScenarios() : Promise<string[]> {
        return this._fallback ?
            this._assetService.loadJson<string[]>(this._baseDir + "/scenarioList.json") :
            this._localStorageService.read<string[]>("", "scenarioList.json");
    }

    public loadScenario<T, V>(route: string): Promise<Scenario<T, V>> {
        route = decodeURI(route);
        return  this._fallback ?
            this._assetService.loadJson<Scenario<T, V>>(this._baseDir + "/" + route + "/scenario.json") :
            this._localStorageService.read<Scenario<T, V>>(route, "scenario.json");
    }

    private tryLoadScenarios() : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this.loadScenarios()
                    .then((scenarios) => {
                        if (scenarios && scenarios.length > 0) {
                            resolve();
                        } else {
                            this._fallback = true;
                            resolve();
                        }
                    }).catch(() => {
                    this._fallback = true;
                    resolve();
                });
            } catch (e) {
                this._fallback = true;
                resolve();
            }
        });
    }
}
