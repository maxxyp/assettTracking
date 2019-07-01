import {IJob} from "../../../api/models/fft/jobs/IJob";
import {IJobHistory} from "../../../api/models/fft/jobs/history/IJobHistory";
import {Job} from "../../models/job";
import {IJobUpdate} from "../../../api/models/fft/jobs/jobupdate/IJobUpdate";
import {Engineer} from "../../models/engineer";
import { IWorkListItem } from "../../../api/models/fft/engineers/worklist/IWorkListItem";
import { IPartCollectionResponse } from "../../../api/models/fft/jobs/parts/IPartCollectionResponse";
import { JobPartsCollection } from "../../models/jobPartsCollection";

export interface IJobFactory {
    createJobBusinessModel(worklistItem: IWorkListItem, jobApiModel: IJob, jobHistoryApiModel: IJobHistory): Promise<Job>;
    createJobApiModel(jobBusinessModel: Job, engineer: Engineer, originalJobBusinessModel: Job): Promise<IJobUpdate>;
    getJobStatusCode(job: Job) : Promise<string>;
    createPartCollectionBusinessModel(worklistItem: IWorkListItem, partApiModel: IPartCollectionResponse): JobPartsCollection;
}
