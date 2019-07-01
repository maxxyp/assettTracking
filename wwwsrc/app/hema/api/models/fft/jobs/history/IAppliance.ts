import { IChirp } from "./IChirp";
import { ISafety } from "./ISafety";

export interface IAppliance {
    id: string;
    serialId: string;
    gcCode: string;
    bgInstallationIndicator: string;
    category: string;
    contractType: string;
    contractExpiryDate: string;
    applianceType: string;
    description: string;
    flueType: string;
    boilerSize: number;
    cylinderType: number;
    energyControl: string;
    locationDescription: string;
    condition: number;
    numberOfRadiators: number;
    numberOfSpecialRadiators: number;
    installationYear: number;
    systemDesignCondition: number;
    systemType: number;
    linkId: string;
    notes: string;
    safety: ISafety;
    chirp: IChirp;
}
