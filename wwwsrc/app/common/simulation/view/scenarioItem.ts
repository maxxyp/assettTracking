/// <reference path="../../.././../typings/app.d.ts" />

import {inject} from "aurelia-framework";
import {ScenarioLoader} from "../scenarioLoader";
import {IScenarioLoader} from "../IScenarioLoader";
import {Scenario} from "../models/scenario";

@inject(ScenarioLoader)
export class ScenarioItem {
    public scenarioName: string;
    public scenario: Scenario<any, any>;
    private _scenarioLoader: IScenarioLoader;

    constructor(scenarioLoader: IScenarioLoader) {
        this._scenarioLoader = scenarioLoader;
    }

    public activate(params: { scenario: string }): Promise<void> {
        this.scenarioName = params.scenario.replace(/\_/g, "\/");
        return this._scenarioLoader.loadScenario(this.scenarioName)
            .then((scenario) => {
                this.scenario = scenario;
            });
    }
}
