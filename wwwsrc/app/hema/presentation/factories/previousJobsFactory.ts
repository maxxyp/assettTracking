import { inject } from "aurelia-framework";
import { IPreviousJobsFactory } from "./interfaces/IPreviousJobsFactory";
import { Job as JobBusinessModel } from "../../business/models/job";
import { PreviousJobViewModel } from "../modules/previousJobs/viewModels/previousJobViewModel";
import * as moment from "moment";
import { ArrayHelper } from "../../../common/core/arrayHelper";
import { DateHelper } from "../../core/dateHelper";
import { Task } from "../../business/models/task";
import { IBusinessRuleService } from "../../business/services/interfaces/IBusinessRuleService";
import { BusinessRuleService } from "../../business/services/businessRuleService";

/**
 * The objective of this view model is to 'group' the tasks received from the api into their respective worklist
 * The grouping is achieved by taking the first 10 characters from the task id
 *
 * The other job is to establish the job date, this is derived by getting the earliest visit from all the tasks
 */

@inject(BusinessRuleService)
export class PreviousJobsFactory implements IPreviousJobsFactory {

    private _businessRuleService: IBusinessRuleService;

    constructor(businessRuleService: IBusinessRuleService) {
        this._businessRuleService = businessRuleService;
    }

    public createPreviousJobsViewModel(job: JobBusinessModel): Promise<PreviousJobViewModel[]> {
        let previousJobsLookup: { [id: string]: PreviousJobViewModel; } = {};
        let previousJobs: PreviousJobViewModel[] = [];
       
        return this._businessRuleService.getQueryableRuleGroup("previousJobsFactory").then(jobFactoryRuleGroup => {
            const previousJobsAllowedInMonths = jobFactoryRuleGroup.getBusinessRule<number>("previousJobsAllowedInMonths");
            let oldestAllowed: Date = moment(new Date()).subtract(previousJobsAllowedInMonths, "months").toDate();

            return this._businessRuleService.getQueryableRuleGroup("chargeService").then(ruleGroup => {

                const noChargePrefix = ruleGroup.getBusinessRule<string>("noChargePrefix");

                if (job && job.history && job.history.tasks) {

                    job.history.tasks.forEach(task => {
                        let visitDates: Date[] = task.activities
                            .map(a => a.date ? new Date(<any>a.date) : null)
                            .filter(d => d instanceof Date);

                        let mostRecent: Date = null;
                        if (visitDates.length > 0) {
                            mostRecent = new Date(Math.max.apply(null, visitDates));
                        }

                        let jobId = task.id.substring(0, 10);
                        if (previousJobsLookup[jobId]) {
                            previousJobsLookup[jobId].tasks.push(task);

                            if (DateHelper.isDate(previousJobsLookup[jobId].date) && DateHelper.isValidDate(previousJobsLookup[jobId].date) && previousJobsLookup[jobId].date < mostRecent) {
                                previousJobsLookup[jobId].date = mostRecent;
                            }

                        } else {
                            previousJobsLookup[jobId] = new PreviousJobViewModel(jobId, mostRecent, undefined, [task]); // undefined because we are populating description later
                        }
                    });

                    for (let jobId in previousJobsLookup) {
                        previousJobs.push(previousJobsLookup[jobId]);
                    }

                    let jobs = ArrayHelper.sortByColumnDescending(previousJobs, "date");
                    previousJobs = [];

                    for (let i = 0; i < jobs.length; i++) {
                        // a single job can contain many tasks
                        // populating description in a way so it contains details of every task

                        // earlier it was displayed with 2 Years and later it changed to last 10 visits. 
                        // as per the new request in part of this incident - INC09871740, It changed to display the previous visits for last 60 Months (5 Years) irrespective of the visits.

                        let isNewerThanLimit = jobs[i].date && jobs[i].date >= oldestAllowed;
                        if (isNewerThanLimit) {

                            jobs[i].isCharge = jobs[i].tasks.some(t => Task.isChargeableTask(t.chargeType, noChargePrefix));

                            previousJobs.push(jobs[i]);
                        }
                    }
                }
                return previousJobs;
            });
        });
    }
}
