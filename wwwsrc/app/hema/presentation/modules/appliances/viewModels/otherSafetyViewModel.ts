import {DataState} from "../../../../business/models/dataState";
import { YesNoNa } from "../../../../business/models/yesNoNa";

export class OtherSafetyViewModel {
    public applianceId: string;
    public didYouVisuallyCheck: boolean;
    public isApplianceSafe: boolean;
    public toCurrentStandards: YesNoNa;
    public workedOnAppliance: boolean;
    public dataStateId: string;
    public dataState: DataState;
}
