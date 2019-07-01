import {DataState} from "../../../../business/models/dataState";
import {ApplianceSafetyType} from "../../../../business/models/applianceSafetyType";

export class ApplianceViewModel {
    public dataStateId: string;
    public dataState: DataState;
    public dataStateGroup: string;

    public hasChildAppliance: boolean;
    public hasParentAppliance: boolean;
    public parentApplianceType: string;

    public isGasAppliance: boolean;
    public isCentralHeatingAppliance: boolean;
    public requiresGcCode: boolean;

    public applianceSafetyType: ApplianceSafetyType;

    public id: string;
    public serialId: string;
    public gcCode: string;
    public bgInstallationIndicator: boolean;
    public category: string;
    public contractType: string;
    public contractExpiryDate: Date;
    public applianceType: string;
    public description: string;
    public flueType: string;
    public cylinderType: string;
    public energyControl: string;
    public locationDescription: string;
    public condition: string;
    public numberOfRadiators: number;
    public numberOfSpecialRadiators: number;
    public installationYear: number;
    public systemDesignCondition: string;
    public systemType: string;
    public notes: string;
    public boilerSize: number;
    public parentId: string;
    public childId: string;
    public isInstPremAppliance: boolean;
}
