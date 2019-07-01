/// <reference path="../../../typings/app.d.ts" />

import {IScenarioStore} from "./IScenarioStore";
import {Scenario} from "./models/scenario";
import {PlatformServiceBase} from "../core/platformServiceBase";

export class ScenarioStore extends PlatformServiceBase<IScenarioStore> implements IScenarioStore {
    constructor() {
        super("common/simulation", "ScenarioStore");
    }

    public initialise(baseDir: string): Promise<void> {
        return this.loadModule().then(module => {
           return module.initialise(baseDir);
        });
    }

    public loadScenarios() : Promise<string[]> {
        return this.loadModule().then(module => {
            return module.loadScenarios();
        });
    }

    public loadScenario<T, V>(route: string): Promise<Scenario<T, V>> {
        return this.loadModule().then(module => {
            return module.loadScenario<T, V>(route);
        });
    }
}
