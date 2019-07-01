import {ApplianceGasReadings} from "./applianceGasReadings";
import { DataStateProvider } from "./dataStateProvider";
import { DataState } from "./dataState";

export class ApplianceGasReadingMaster  extends DataStateProvider {
    public workedOnMainReadings: boolean;
    public workedOnApplianceReadings: boolean;
    public workedOnSupplementaryApplianceReadings: boolean;
    public supplementaryBurnerFitted: boolean;
    public preliminaryReadings: ApplianceGasReadings;
    public supplementaryReadings: ApplianceGasReadings;

    constructor() {
        super(DataState.dontCare, "appliances");
        this.workedOnApplianceReadings = false;
        this.workedOnMainReadings = false;
        this.workedOnSupplementaryApplianceReadings = false;
    }

    public static isTouched(readingsMaster: ApplianceGasReadingMaster) : boolean {
        let isAPreliminaryReadingTaken = readingsMaster && readingsMaster.preliminaryReadings
                && (readingsMaster.preliminaryReadings.burnerPressure !== undefined ||
                    readingsMaster.preliminaryReadings.gasRateReading !== undefined ||
                    readingsMaster.preliminaryReadings.isLpg !== undefined);

        let isASupplementaryReadingTaken = readingsMaster && readingsMaster.supplementaryReadings
                && (readingsMaster.supplementaryReadings.burnerPressure !== undefined ||
                    readingsMaster.supplementaryReadings.gasRateReading !== undefined ||
                    readingsMaster.supplementaryReadings.isLpg !== undefined);

        return isAPreliminaryReadingTaken || isASupplementaryReadingTaken;
    }
}
