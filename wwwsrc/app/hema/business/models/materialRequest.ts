import { Guid } from "../../../common/core/guid";
export type MaterialRequestStatus =
    "PENDING"
    | "WITHDRAWN"
    | "COMPLETE"
    | "REJECTED";

export class MaterialRequest {
    public id: Guid | number;
    public stockReferenceId: string;
    public description: string;
    public quantity: number;
    public owner: string;
    public engineerId: string;
    public engineerName: string;
    public engineerPhone: string;
    public status: MaterialRequestStatus;
    public isSyncedToServer: boolean;
    public date: number;
    public time: number;
    public isUnread: boolean;
}
