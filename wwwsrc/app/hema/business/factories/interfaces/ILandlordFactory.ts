import {Engineer} from "../../models/engineer";
import {Job} from "../../models/job";
import {Appliance} from "../../models/appliance";

import {LandlordSafetyCertificate as LandlordSafetyCertificateBusinessModel} from "../../models/landlord/landlordSafetyCertificate";
import {LandlordSafetyCertificateAppliance as LandlordSafetyCertificateApplianceBusinessModel} from "../../models/landlord/landlordSafetyCertificateAppliance";
import {LandlordSafetyCertificateDefect as LandlordSafetyCertificateDefectBusinessModel} from "../../models/landlord/landlordSafetyCertificateDefect";
import {LandlordSafetyCertificateResult as LandlordSafetyCertificateResultBusinessModel} from "../../models/landlord/landlordSafetyCertificateResult";
import {QueryableBusinessRuleGroup} from "../../models/businessRules/queryableBusinessRuleGroup";
import {PropertySafety} from "../../models/propertySafety";
import { ISafetyAction } from "../../models/reference/ISafetyAction";

export interface ILandlordFactory {
    createLandlordSafetyCertificate(job: Job, engineer: Engineer, businessRules: QueryableBusinessRuleGroup, appliances: Appliance[])
        : Promise<LandlordSafetyCertificateBusinessModel>;

    createLandlordSafetyCertificateAppliance(appliance: Appliance, businessRules: QueryableBusinessRuleGroup)
        : Promise<LandlordSafetyCertificateApplianceBusinessModel>;

    createLandlordSafetyCertificateDefect(appliance: Appliance, businessRules: QueryableBusinessRuleGroup, safetyActions: ISafetyAction[])
        : LandlordSafetyCertificateDefectBusinessModel;

    createLandlordSafetyCertificateResult(propertySafety: PropertySafety, businessRules: QueryableBusinessRuleGroup, safetyActions: ISafetyAction[])
        : LandlordSafetyCertificateResultBusinessModel;
}
