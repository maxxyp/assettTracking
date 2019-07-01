import { LogManager, Aurelia } from "aurelia-framework";
import { ILoggerService } from "../ILoggerService";
import { Log } from "../models/log";
import { LogHelper } from "../../logHelper";
import { ILogConfiguration } from "../ILogConfiguration";
import { AnalyticsLogAppender } from "../../../analytics/AnalyticsLogAppender";
import { Container } from "aurelia-dependency-injection";
import { FileLogAppender } from "./fileLogAppender";

export class LoggerService implements ILoggerService {

    public async initialize(aurelia: Aurelia, config: ILogConfiguration): Promise<void> {
        LogManager.addAppender(new FileLogAppender());
        LogManager.addAppender(Container.instance.get(AnalyticsLogAppender));
    }

    public getLogs(): Promise<Log[]> {
        return new Promise<Log[]>((resolve) => {
            Windows.Storage.ApplicationData.current.localFolder.createFileAsync(LogHelper.getLogFileName(new Date()), Windows.Storage.CreationCollisionOption.openIfExists)
                .then((file) => Windows.Storage.FileIO.readLinesAsync(file))
                .then((lines) => {
                    resolve(lines.map(line => {
                        let log = new Log();
                        let parts = line.split(" ");
                        log.logLevel = parts[1];
                        log.logText = line;
                        return log;
                    }));
                });
        });
    }
}
