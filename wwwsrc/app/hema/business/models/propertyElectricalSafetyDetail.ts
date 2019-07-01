import {DataStateProvider} from "./dataStateProvider";
import {DataState} from "./dataState";

export class PropertyElectricalSafetyDetail extends DataStateProvider {
    public eliReading: number;
    public noEliReadings: boolean;
    public eliReadingReason: string;
    public consumerUnitSatisfactory: boolean;
    public systemType: string;
    public rcdPresent: string;
    public eliSafeAccordingToTops: boolean;

    constructor() {
        super(DataState.notVisited, "property-safety");
    }
}
