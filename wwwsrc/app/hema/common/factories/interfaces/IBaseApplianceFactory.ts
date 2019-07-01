import {Appliance as ApplianceBusinessModel} from "../../../business/models/appliance";
import {ApplianceSafetyType} from "../../../business/models/applianceSafetyType";

export interface IBaseApplianceFactory {
    calculateApplianceSafetyType(applianceType: string, engineerWorkingSector: string) : Promise<ApplianceSafetyType>;
    populateBusinessModelFields(applianceBusinessModel: ApplianceBusinessModel, engineerWorkingSector: string): Promise<void>;
}
