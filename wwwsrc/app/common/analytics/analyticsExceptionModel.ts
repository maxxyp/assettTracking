import { Guid } from "../core/guid";
import * as moment from "moment";
import { AnalyticsConstants } from "./analyticsConstants";

// make sure NO sensitive information is placed here
export class AnalyticsExceptionModel {
    public readonly id: string;
    public readonly code: string;
    public readonly detail: any[];
    public readonly timestamp: string;
    public readonly isFatal: boolean;
    public loggerId: string;

    constructor(code: string, isFatal: boolean = false, ...detail: any[]) {
        this.id = Guid.newGuid();
        this.code = code;
        this.detail = detail;
        this.isFatal = isFatal;
        this.timestamp = moment().format(AnalyticsConstants.DATE_TIME_FORMAT);
    }
}
