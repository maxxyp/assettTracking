import {DataState} from "../../business/models/dataState";

export class TaskSummaryViewModel {
    public id: string;
    public jobType: string;
    public applianceType: string;
    public applianceId: string;
    public applianceName: string;
    public chargeType: string;
    public supportingText: string;
    public specialRequirement: string;
    public activityCount: number;
    public visitCount: number;
    public isNewRFA: boolean;
    public isMiddlewareDoTodayTask: boolean;
    public isInCancellingStatus: boolean;

    public orderNo: number;
    public workDuration: number;
    public chargeableTime: number;
    public startTime: string;
    public endTime: string;
    public color: string;
    public chargeableTimeChanged: boolean;
    public dataState: DataState;

    public problemDesc: string;
    public applianceMake: string;
    public applianceModel: string;
    public applianceErrorCode: string;
    public applianceErrorDesc: string;
}
