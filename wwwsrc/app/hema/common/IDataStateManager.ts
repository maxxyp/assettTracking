import { Job } from "../business/models/job";
import { Appliance } from "../business/models/appliance";

export interface IDataStateManager {
    updateAppliancesDataState(job: Job): Promise<void>;
    updateApplianceDataState(appliance: Appliance, job: Job): Promise<void>;
    updatePropertySafetyDataState(job: Job): void;
}
