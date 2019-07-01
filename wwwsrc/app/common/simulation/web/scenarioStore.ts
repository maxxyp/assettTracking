/// <reference path="../../../../typings/app.d.ts" />

import {IScenarioStore} from "../IScenarioStore";
import {inject} from "aurelia-dependency-injection";
import {Scenario} from "../models/scenario";
import {AssetService} from "../../core/services/assetService";
import {IAssetService} from "../../core/services/IAssetService";

@inject(AssetService)
export class ScenarioStore implements IScenarioStore {
    private _assetService: IAssetService;

    private _baseDir: string;

    constructor(assetService: IAssetService) {
        this._assetService = assetService;
    }

    public initialise(baseDir: string): Promise<void> {
        this._baseDir = baseDir;
        return Promise.resolve();
    }

    public loadScenarios() : Promise<string[]> {
        return this._assetService.loadJson<string[]>(this._baseDir  + "/scenarioList.json");
    }

    public loadScenario<T, V>(route: string): Promise<Scenario<T, V>> {
        let url = this._baseDir + "/" + route + "/scenario.json";
        url = url + "?_t=" + new Date().getTime();
        return this._assetService.loadJson<Scenario<T, V>>(url);
    }
}
