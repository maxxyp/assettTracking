export class GasApplianceReadingViewModel {

    public burnerPressure: number;
    public gasRateReading: number;
    public isLpg: boolean;

    public readingFirstRatio: number;
    public readingFirstCO: number;
    public readingFirstCO2: number;
    public readingMaxRatio: number;
    public readingMaxCO: number;
    public readingMaxCO2: number;
    public readingMinRatio: number;
    public readingMinCO: number;
    public readingMinCO2: number;
    public readingFinalRatio: number;
    public readingFinalCO: number;
    public readingFinalCO2: number;

    public burnerPressureUnsafe: boolean;
    public gasReadingUnsafe: boolean;
    public finalRatioUnsafe: boolean;
    public askIfLpg: boolean;
    public showWarningFirstRatio: boolean;
    public isUnsafeReadings: boolean;    
}
