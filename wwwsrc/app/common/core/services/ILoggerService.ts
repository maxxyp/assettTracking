import { Aurelia } from "aurelia-framework";
import { ILogConfiguration } from "./ILogConfiguration";
import { Log } from "./models/log";

export interface ILoggerService {
    initialize(aurelia: Aurelia, config: ILogConfiguration): Promise<void>;
    getLogs(): Promise<Log[]>;
}
