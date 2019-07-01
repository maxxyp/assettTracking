import { IPart } from "./IPart";

export interface IActivity {
    date: string;
    status: string;
    chargeableTime: number;
    percentageUplift: number;
    supplementaryLabourCharge: number;
    sequence: number;
    report: string;
    workDuration: number;
    parts: IPart[];

    // not confirmed by api
    engineerName: string;
}
