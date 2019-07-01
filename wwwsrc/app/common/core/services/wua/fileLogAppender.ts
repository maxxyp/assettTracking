import { Appender } from "aurelia-logging";
import { Log } from "../models/log";
import { LogLevel } from "../constants/logLevel";
import { DateHelper } from "../../dateHelper";

export class FileLogAppender implements Appender {

    private _logBuffer: Log[];
    private _isWriting: boolean;

    constructor() {
        this._logBuffer = [];
    }

    public debug(meta: { id: string }, ...rest: any[]): Log {
        return this.log(LogLevel.DEBUG, meta, rest);
    }

    public info(meta: { id: string }, ...rest: any[]): Log {
        return this.log(LogLevel.INFO, meta, rest);
    }

    public warn(meta: { id: string }, ...rest: any[]): Log {
        return this.log(LogLevel.WARN, meta, rest);
    }

    public error(meta: { id: string }, ...rest: any[]): Log {
        return this.log(LogLevel.ERROR, meta, rest);
    }

    private getLogFileName(date: Date): string {
        return "log-" + DateHelper.toJsonDateString(date) + ".txt";
    }

    private log(logLevel: LogLevel, meta: { id: string }, rest: any[]): Log {
        let time = DateHelper.toJsonDateTimeString(new Date());
        let log = new Log();
        log.logLevel = logLevel || LogLevel.NONE;
        log.logText = time + "\t" + log.logLevel + "\t[" + meta.id + "]\t" + (rest || []).reduce((prev, curr) => prev + " " + JSON.stringify(curr || ""), "");

        this.logToFile(log);
        return log;
    }

    private logToFile(log: Log): void {
        try {
            this._logBuffer.push(log);
            if (!this._isWriting) {
                this._isWriting = true;

                let logFragment = this._logBuffer.reduce((prev, curr) => prev + " " + curr.logText + "\r\n", "");
                this._logBuffer = [];

                Windows.Storage.ApplicationData.current.localFolder.createFileAsync(this.getLogFileName(new Date()), Windows.Storage.CreationCollisionOption.openIfExists)
                    .then((file) => Windows.Storage.FileIO.appendTextAsync(file, logFragment))
                    .then(
                        (success) => {
                            this._isWriting = false;
                        },
                        (error) => {
                            // from development, it *looks* like the logs have still been written to file even if an error is thrown
                            this._isWriting = false;
                        }
                    );
            }
        } catch (err) {
            this._logBuffer = [];
        }
    }
}
