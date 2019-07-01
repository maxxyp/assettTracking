import {YesNoNa} from "../yesNoNa";
import {OperatingValueUnits} from "./operatingValueUnits";

export class LandlordSafetyCertificateAppliance {
    public id: string;
    public location: string;
    public type: string;
    public make: string;
    public model: string;
    public flueType: string;

    public operatingValue: number;
    public operatingValueUnits: OperatingValueUnits;

    public safetyDeviceCorrectOperation: YesNoNa;
    public ventilationSatisfactory: YesNoNa;
    public flueFlowTest: YesNoNa;
    public spillageTest: YesNoNa;
    public visualConditionOfFlueAndTerminationSatisfactory: YesNoNa;
    public applianceSafe: boolean;
    public requestedToTest: boolean;
    public unableToTest: boolean;
}
