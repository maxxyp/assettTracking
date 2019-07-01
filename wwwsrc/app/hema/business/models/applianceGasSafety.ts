import {DataStateProvider} from "./dataStateProvider";
import {DataState} from "./dataState";
import {YesNoNa} from  "./yesNoNa";

export class ApplianceGasSafety extends DataStateProvider {

    public visuallyCheckRelight: boolean;
    public ventilationSafe: boolean;
    public installationSafe: YesNoNa;
    public installationTightnessTestSafe: YesNoNa;
    public summaryPrelimLpgWarningTrigger: boolean;
    public summarySuppLpgWarningTrigger: boolean;
    public performanceTestsNotDoneReason: string;
    public applianceStripped: boolean;
    public performanceTestsNotDoneReasonForSupplementary: string;
    public supplementaryApplianceStripped: boolean;    
    public safetyDevice: YesNoNa;
    public isApplianceSafe: boolean;
    public toCurrentStandards: YesNoNa;
    public workedOnAppliance: boolean;
    public overrideWorkedOnAppliance: boolean;
    public chimneyInstallationAndTests: YesNoNa;

    public applianceMake: string;
    public applianceModel: string;
    public requestedToTest: boolean;
    public ableToTest: boolean;

    constructor() {
        super(DataState.dontCare, "appliances");
    }
}
