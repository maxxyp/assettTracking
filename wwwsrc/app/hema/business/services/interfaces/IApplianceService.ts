import {Appliance} from "../../models/appliance";
import {ApplianceSafety} from "../../models/applianceSafety";
import {ApplianceElectricalSafetyDetail} from "../../models/applianceElectricalSafetyDetail";
import { ApplianceElectricalUnsafeDetail } from "../../models/applianceElectricalUnsafeDetail";
import { ApplianceOperationType } from "../../models/applianceOperationType";

export interface IApplianceService {
    getAppliances(jobID: string): Promise<Appliance[]>;
    getAppliancesForLandlordsCertificate(jobID: string): Promise<Appliance[]>;
    getAppliance(jobID: string, applianceId: string): Promise<Appliance>;
    createAppliance(jobId: string, appliance: Appliance): Promise<void>;
    deleteOrExcludeAppliance(jobId: string, applianceId: string, operation: ApplianceOperationType): Promise<void>;
    updateAppliance(jobId: string, appliance: Appliance, setIsUpdated: boolean, updateMakeAndModel: boolean): Promise<void>;
    getApplianceSafetyDetails(jobId: string, applianceId: string): Promise<ApplianceSafety>;
    saveApplianceSafetyDetails(jobId: string, applianceId: string, applianceSafety: ApplianceSafety, setIsUpdated: boolean, updateAdaptMakeAndModel: boolean): Promise<void>;
    saveElectricalSafetyDetails(jobId: string,
        applianceId: string,
        safetyDetail: ApplianceElectricalSafetyDetail,
        unsafeDetail: ApplianceElectricalUnsafeDetail,
        setIsUpdated: boolean): Promise<void>;
    getChildApplianceId(jobId: string, parentApplianceId: string): Promise<string>;
    isFullGcCode(gcCode: string): Promise<boolean>;
    replaceAppliance(jobId: string, appliance: Appliance, oldApplianceId: string): Promise<void>;
    ensureAdaptInformationIsSynced(jobId: string): Promise<void>;
}
