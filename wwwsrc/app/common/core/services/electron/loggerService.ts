import { LogManager, Aurelia } from "aurelia-framework";
import { ILoggerService } from "../ILoggerService";
import { Log } from "../models/log";
import { ILogConfiguration } from "../ILogConfiguration";
import { ConsoleAppender } from "aurelia-logging-console";
import { AnalyticsLogAppender } from "../../../analytics/analyticsLogAppender";
import { Container } from "aurelia-dependency-injection";

export class LoggerService implements ILoggerService {

    public async initialize(aurelia: Aurelia, config: ILogConfiguration): Promise<void> {
        LogManager.addAppender(new ConsoleAppender());
        LogManager.addAppender(Container.instance.get(AnalyticsLogAppender));
    }

    public getLogs(): Promise<Log[]> {
        return Promise.resolve([]);
    }
}
