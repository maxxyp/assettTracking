import {IApplianceSafety} from "./IApplianceSafety";
import {IReading} from "./IReading";

export interface IAppliance {
    applianceType: string;
    bgInstallationIndicator: string;
    id: string;
    installationYear: number;
    hardwareSequenceNumber: number;
    linkId: string;
    description: string;
    flueType: string;
    gcCode: string;
    locationDescription: string;
    serialId: string;
    updateMarker: string;
    condition: string;
    boilerSize: number;
    numberOfRadiators: number;
    energyControl: string;
    scmsText: string;
    contractInspectionFailedIndicator: boolean;
    systemType: string;
    systemDesignCondition: string;
    cylinderType: string;
    numberofSpecialRadiators: number;
    safety: IApplianceSafety;
    make?: string;
    model?: string;
    safetyDeviceCorrectOperation: string;
    flueFlowTest: string;
    spillageTest: string;
    requestedToTest: boolean;
    unableToTest: boolean;
    gasInstallationSoundnessTest: string;
    detailsOfAnyDefectsIdentifiedText: string;
    remedialActionTakenText: string;
    readings: IReading[];
}
