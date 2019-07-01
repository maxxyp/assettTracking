import { Job } from "../models/job";
import * as Logging from "aurelia-logging";
import { ObjectHelper } from "../../../common/core/objectHelper";
import { AnalyticsExceptionModel } from "../../../common/analytics/analyticsExceptionModel";
import { AnalyticsExceptionCodeConstants } from "../../../common/analytics/analyticsExceptionCodeConstants";

export class JobSanityCheckService {

    private _logger: Logging.Logger;

    constructor() {
        this._logger = Logging.getLogger(ObjectHelper.getClassName(this));

    }

    /*
        In field trial we are getting junk from WMIS - e.g. job documents with missing details.
        This code should be removed when we no longer see this happening.
    */
    public isBadlyFormed(job: Job): { isBadlyFormed: boolean, reason?: string } {

        let badlyFormed = (reason: string) => {
            const message = `Badly formed job with jobId ${job.id} : ${reason}`;
            this._logger.error(message, new AnalyticsExceptionModel(AnalyticsExceptionCodeConstants.BADLY_FORMED_JOB, false, message));

            return { isBadlyFormed: true, reason };
        };

        if (!(job.tasks || []).length) {
            return badlyFormed("no activities for today.");
        }

        return { isBadlyFormed: false };
    }
}
