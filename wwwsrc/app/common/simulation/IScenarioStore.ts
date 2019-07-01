import {Scenario} from "./models/scenario";

export interface IScenarioStore {
   initialise(baseDir: string): Promise<void>;
   loadScenarios() : Promise<string[]>;
   loadScenario<T, V>(route: string): Promise<Scenario<T, V>>;
}
