import {DataStateProvider} from "./dataStateProvider";
import {DataState} from "./dataState";

export class ApplianceElectricalSafetyDetail extends DataStateProvider {
    public electricalApplianceType: string;  // e,m,w

    public mainEarthChecked: string;
    public gasBondingChecked: string;
    public waterBondingChecked: string;
    public otherBondingChecked: string;
    public supplementaryBondingOrFullRcdProtectionChecked: string;
    public ringContinuityReadingDone: string;

    public leInsulationResistance: number;
    public showLeInsulationResistanceReasonWhyNot: boolean;
    public leInsulationResistanceReasonWhyNot: string;

    public neInsulationResistance: number;
    public showNeInsulationResistanceReasonWhyNot: boolean;
    public neInsulationResistanceReasonWhyNot: string;

    public lnInsulationResistance: number;
    public showLnInsulationResistanceReasonWhyNot: boolean;
    public lnInsulationResistanceReasonWhyNot: string;

    public systemType: string;
    public finalEliReadingDone: boolean;
    public finalEliReading: number;
    public readingSafeAccordingToTops: boolean;
    public isRcdPresent: boolean;

    public circuitRcdRcboProtected: string;
    public rcdTripTimeReading: number;
    public rcboTripTimeReading: number;
    public applianceEarthContinuityReadingDone: boolean;
    public applianceEarthContinuityReading: number;

    public isApplianceHardWired: boolean;
    public mcbFuseRating: string;
    public showMcbFuseRatingReasonWhyNot: boolean;
    public mcbFuseRatingReasonWhyNot: string;

    public applianceFuseRating: string;
    public showApplianceFuseRatingReasonWhyNot: boolean;
    public applianceFuseRatingReasonWhyNot: string;

    public isPartP: boolean;
    public partPReason: string;

    public workedOnLightingCircuit: boolean;
    public cpcInLightingCircuitOk: boolean;

    public installationSatisfactory: boolean;

    public microwaveLeakageReading: number;
    public showMicrowaveLeakageReadingReasonWhyNot: boolean;
    public microwaveLeakageReadingReasonWhyNot: string;

    public applianceSafe: boolean;
    public applianceInstallationSatisfactory: boolean;

    constructor() {
        super(DataState.dontCare, "appliances");
    }

    public static isTouched(applianceElectricalSafetyDetail: ApplianceElectricalSafetyDetail): boolean {
        // these are the fundamental properties that are always set that do not really indicate if the user has touched this record
        let propertiesToIgnore = ["systemType", "electricalApplianceType", "dataState", "dataStateGroup", "dataStateId"];

        let propertiesToCheck = Object.getOwnPropertyNames(applianceElectricalSafetyDetail)
                                    .filter(prop => propertiesToIgnore.indexOf(prop) === -1);

        return propertiesToCheck.some(prop => (<any>applianceElectricalSafetyDetail)[prop] !== undefined);
    }
}
