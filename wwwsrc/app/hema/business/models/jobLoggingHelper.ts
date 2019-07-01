import { Job } from "./job";
import { ObjectHelper } from "../../../common/core/objectHelper";

export class JobLoggingHelper {

    public lastLoggedJob: Job;

    public prepareLoggableJob(jobModel: Job): Job | "Not changed" {

        // take a clone of the jobModel
        let job: Job = JSON.parse(JSON.stringify(jobModel, (key, val) => {
            // as we clone, lets get rid of the dataState guids - these get updated even when the user
            //  is not editing data, so would give false positive changes
            return key === "dataStateId" ? undefined : val;
        }));

        // clear parts of the business model that do not change
        job.customerContact = undefined;
        job.customerAddress = undefined;
        job.premises = undefined;
        job.contact = undefined;
        job.visit = undefined;
        job.tasksNotToday = undefined;

        if (job.history) {
            job.history.tasks =  undefined;
        }

        if (job.charge && job.charge.tasks) {
            job.charge.tasks.forEach(task => task.task = undefined);
        }

        if (job.partsDetail) {
            const {partsBasket} = job.partsDetail;
            if (partsBasket) {
                if (partsBasket.manualPartDetail) {
                    partsBasket.manualPartDetail.patchVanStockEngineers = undefined;
                }

                if (partsBasket.partsInBasket) {
                    partsBasket.partsInBasket.forEach(part => part.patchVanStockEngineers = undefined);
                }
                if (partsBasket.partsToOrder) {
                    partsBasket.partsToOrder.forEach(part => part.patchVanStockEngineers = undefined);
                }
            }
            if (job.partsDetail.partsToday && job.partsDetail.partsToday.parts) {
                job.partsDetail.partsToday.parts.forEach(part => part.patchVanStockEngineers = undefined);
            }
        }

        if (ObjectHelper.isComparable(job, this.lastLoggedJob)) {
            return "Not changed";
        } else {
            this.lastLoggedJob = job;
            return job;
        }
    }
}
