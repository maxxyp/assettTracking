import { inject } from "aurelia-dependency-injection";
import { Analytics } from "./analytics";
import { IAnalyticsService } from "./IAnalyticsService";
import { Logger, Appender } from "aurelia-logging";
import { AnalyticsExceptionModel } from "./analyticsExceptionModel";

@inject(Analytics)
export class AnalyticsLogAppender implements Appender {

    private _analytics: IAnalyticsService;

    constructor(analytics: IAnalyticsService) {
        this._analytics = analytics;
    }

    public debug(logger: Logger, ...rest: any[]): void {
    }

    public info(logger: Logger, ...rest: any[]): void {
    }

    public warn(logger: Logger, ...rest: any[]): void {
    }

    // find the object which is of type AnalyticsExceptionModel
    // if any exception happens during the execution of the following,
    // just swallow it.
    public error(logger: Logger, ...rest: any[]): void {
        try {
            if (logger && rest) {
                let exception: AnalyticsExceptionModel = rest.find(x => typeof x === "object" && x instanceof AnalyticsExceptionModel);
                if (exception) {
                    exception.loggerId = logger.id;
                    this._analytics.exception(JSON.stringify(exception), exception.isFatal);
                    return;
                }
            }
            return;
        } catch {
            // do nothing
        }
    }

}
