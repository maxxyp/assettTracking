/// <reference path="../../../../typings/app.d.ts" />

import {inject} from "aurelia-framework";
import {ScenarioLoader} from "../scenarioLoader";
import {IScenarioLoader} from "../IScenarioLoader";

@inject(ScenarioLoader)
export class ScenarioList {
    public scenarios: string[];
    private _scenarioLoader: IScenarioLoader;

    constructor(scenarioLoader: IScenarioLoader) {
        this._scenarioLoader = scenarioLoader;
    }

    public attached(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._scenarioLoader.listScenarios()
                .then((scenarios) => {
                    this.scenarios = scenarios;
                    resolve();
                });
        });
    }

    public paramName(scenario: string) : string {
        return scenario.replace(/\//g, "_");
    }
}
