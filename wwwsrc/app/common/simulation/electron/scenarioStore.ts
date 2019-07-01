/// <reference path="../../../../typings/app.d.ts" />

import {IScenarioStore} from "../IScenarioStore";
import {inject} from "aurelia-dependency-injection";
import {Scenario} from "../models/scenario";
import {AssetService} from "../../core/services/assetService";
import {IAssetService} from "../../core/services/IAssetService";

@inject(AssetService)
export class ScenarioStore implements IScenarioStore {
    private _assetService: IAssetService;

    constructor(assetService: IAssetService) {
        this._assetService = assetService;
    }

    public initialise(baseDir: string): Promise<void> {
        return Promise.resolve();
    }

    public loadScenarios() : Promise<string[]> {
        return this._assetService.loadJson<string[]>("scenarios/scenarioList.json");
    }

    public loadScenario<T, V>(route: string): Promise<Scenario<T, V>> {
        return this._assetService.loadJson<Scenario<T, V>>("scenarios/" + route + "/scenario.json");
    }
}
