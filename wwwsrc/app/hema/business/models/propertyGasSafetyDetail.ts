import {DataStateProvider} from "./dataStateProvider";
import {DataState} from "./dataState";

export class PropertyGasSafetyDetail extends DataStateProvider {
    public eliReading: string;
    public eliReadingReason: string;
    public safetyAdviseNoticeLeft: boolean;
    public safetyAdviseNoticeLeftReason: string;
    public gasInstallationTightnessTestDone: boolean;
    public pressureDrop: number;
    public gasMeterInstallationSatisfactory: string;
    public gasInstallationTightnessTestAndVisualInspectionOfPipeworkResult: string;

    constructor() {
        super(DataState.notVisited, "property-safety");
    }
}
