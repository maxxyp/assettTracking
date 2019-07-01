import {ApplianceSafety} from "./applianceSafety";
import {DataStateProvider} from "./dataStateProvider";
import {DataState} from "./dataState";
import {IconDetailItem} from "../../../common/ui/elements/models/iconDetailItem";
import { ChirpCode } from "./chirpCode";
import {ApplianceSafetyType} from "./applianceSafetyType";
import { ExternalApplianceAppModel } from "./adapt/externalApplianceAppModel";

export class Appliance extends DataStateProvider {
    public id: string;

    public isCreated: boolean;
    public isUpdated: boolean;
    public isDeleted: boolean;
    public isExcluded: boolean;

    public applianceSafetyType: ApplianceSafetyType;
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
    public safety: ApplianceSafety;
    public parentId: string;
    public childId: string;
    public headerIcons: IconDetailItem [];
    public isSafetyRequired: boolean;
    public preVisitChirpCode: ChirpCode;
    public isCentralHeatingAppliance: boolean;
    public isInstPremAppliance: boolean;
    public adaptInfo: { gcCode: string, info: ExternalApplianceAppModel };

    constructor() {
        super(DataState.dontCare, "appliances");
        this.safety = new ApplianceSafety();
    }
}
