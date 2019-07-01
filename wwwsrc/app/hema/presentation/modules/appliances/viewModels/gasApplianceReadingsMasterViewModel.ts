import { GasApplianceReadingViewModel } from "./gasApplianceReadingViewModel";
import { DataState } from "../../../../business/models/dataState";
export class GasApplianceReadingsMasterViewModel {
    public workedOnMainReadings: boolean;
    public workedOnPreliminaryPerformanceReadings: boolean;
    public workedOnSupplementaryPerformanceReadings: boolean;
    public supplementaryBurnerFitted: boolean;

    public preliminaryReadings: GasApplianceReadingViewModel;
    public supplementaryReadings: GasApplianceReadingViewModel;
    public dataState: DataState;
    public dataStateId: string;

    constructor() {
        this.dataState = DataState.dontCare;
    }
}
