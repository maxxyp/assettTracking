import {DataState} from "../../../../business/models/dataState";
import {YesNoNa} from  "../../../../business/models/yesNoNa";

export class GasSafetyViewModel {
    public applianceId: string;
    public performanceTestsNotDoneReason: string;
    public applianceStripped: boolean;
    public performanceTestsNotDoneReasonForSupplementary: string;
    public supplementaryApplianceStripped: boolean;
    public didYouVisuallyCheck: boolean;
    public applianceTightness: YesNoNa;
    public chimneyInstallationAndTests: YesNoNa;
    public ventSizeConfig: boolean;
    public safetyDevice: YesNoNa;
    public isApplianceSafe: boolean;
    public toCurrentStandards: YesNoNa;
    public workedOnAppliance: boolean;
    public overrideWorkedOnAppliance: boolean;
    
    public dataStateId: string;
    public dataState: DataState;
    public dataStateGroup: string;

    public summaryPrelimLpgWarningTrigger: boolean;
    public summarySuppLpgWarningTrigger: boolean;

    public applianceMake: string;
    public applianceModel: string;
    public requestedToTest: boolean;
    public ableToTest: boolean;
}
