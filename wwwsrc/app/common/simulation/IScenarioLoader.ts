import {Scenario} from "./models/scenario";
export interface IScenarioLoader {
   initialise(baseDir?: string): Promise<void>;
   listScenarios() : Promise<string[]>;

   loadScenario<T, V>(route: string): Promise<Scenario<T, V>>;

   get<T>(route: string) : Promise<T>;
   put<T, V>(route: string, data: T) : Promise<V>;
   post<T, V>(route: string, data: T) : Promise<V>;
}
