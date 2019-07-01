import {DataStateProvider} from "./dataStateProvider";
import {DataState} from "./dataState";
import { YesNoNa } from "./yesNoNa";

export class ApplianceOtherSafety extends DataStateProvider {

    public workedOnAppliance: boolean;
    public visuallyCheckRelight: boolean;
    public isApplianceSafe: boolean;
    public toCurrentStandards: YesNoNa;

    constructor() {
        super(DataState.dontCare, "appliances");
    }
}
