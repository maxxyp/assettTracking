import { PlatformServiceBase } from "../platformServiceBase";
import { ILoggerService } from "./ILoggerService";
import { Aurelia, LogManager } from "aurelia-framework";
import { ILogConfiguration } from "./ILogConfiguration";
import { LogLevel } from "./constants/logLevel";
import { Log } from "./models/log";

// interface for managing logging.
// responisble to loading platform specific log appenders to be found in /wua /ios
export class LoggerService extends PlatformServiceBase<ILoggerService> implements ILoggerService {

    constructor() {
        super("common/core/services", "LoggerService");
    }

    public initialize(aurelia: Aurelia, config: ILogConfiguration): Promise<void> {
        this.setLogLevel(config.logLevel);
        return this.loadModule()
            .then((module) => module.initialize(aurelia, config));
    }

    public getLogs(): Promise<Log[]> {
        return this.loadModule().then((module) => {
            return module.getLogs();
        });
    }

    private setLogLevel(logLevel: string): void {
        if (logLevel) {
            switch (logLevel) {
                case LogLevel.DEBUG:
                    LogManager.setLevel(LogManager.logLevel.debug);
                    break;
                case LogLevel.INFO:
                    LogManager.setLevel(LogManager.logLevel.info);
                    break;
                case LogLevel.WARN:
                    LogManager.setLevel(LogManager.logLevel.warn);
                    break;
                case LogLevel.ERROR:
                    LogManager.setLevel(LogManager.logLevel.error);
                    break;
                default:
                    LogManager.setLevel(LogManager.logLevel.info);
                    break;
            }
        }
    }
}
