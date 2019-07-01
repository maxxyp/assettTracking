import {IAppliance as ApplianceApiModel} from "../../../api/models/fft/jobs/history/IAppliance";
import {IAppliance as ApplianceUpdateApiModel} from "../../../api/models/fft/jobs/jobupdate/IAppliance";
import {Appliance as ApplianceBusinessModel} from "../../models/appliance";
import { Job } from "../../models/job";
import { IBaseApplianceFactory } from "../../../common/factories/interfaces/IBaseApplianceFactory";

export interface IApplianceFactory extends IBaseApplianceFactory {
    createApplianceApiModel(job: Job, originalJob: Job, applianceBusinessModel: ApplianceBusinessModel, applianceIdToSequenceMap: {[guid: string]: number}): Promise<ApplianceUpdateApiModel>;
    createApplianceBusinessModel(applianceApiModel: ApplianceApiModel, job: Job, engineerWorkingSector: string): Promise<ApplianceBusinessModel>;
}
