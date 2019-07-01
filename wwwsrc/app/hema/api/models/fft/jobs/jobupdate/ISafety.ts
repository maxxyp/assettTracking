export interface ISafety {
    riskIdentifiedAtProperty: boolean;
    gasELIReading: string;
    electricalELIReading: number;
    eliReason: string;
    consumerUnitOrFuseBoxSatisfactory: boolean;
    electricalSystemType: string;
    eliSafeAccordingToTheTableInTops: boolean;
    rcdPresent: boolean;
    safetyNoticeNotLeftReason: string;
    gasInstallationTightnessTestDone: boolean;
    pressureDrop: number;
    gasMeterInstallationSafe: string;
    jobPartLJReportable: boolean;
}
