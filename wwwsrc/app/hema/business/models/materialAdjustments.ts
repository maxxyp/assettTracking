import { Guid } from "../../../common/core/guid";

export type MaterialAdjustmentStatus = "UNACKNOWLEDGED"
                                | "ACKNOWLEDGED"
                                | "DELETED_UNACKNOWLEDGED"
                                | "DELETED_ACKNOWLEDGED"
                                | "FULFILLED_UNACKNOWLEDGED"
                                | "FULFILLED_ACKNOWLEDGED"
                                // a rejection can only happen on the server, so no REJECTED_UNACKNOWLEDGED
                                | "REJECTED_ACKNOWLEDGED";

export type MaterialAdjustment = {
    id: Guid | number,
    stockReferenceId: string,
    jobId: string,
    description: string,
    quantity: number,
    engineerId: string,
    engineerName?: string,
    engineerPhone?: string,
    owner: string,
    status: MaterialAdjustmentStatus,
    reason?: string,
    date: number,
    time: number,
    area?: string,
    quantityCollected?: number,
    isUnread?: boolean,
    partnerRecordDate?: number,
    partnerRecordTime?: number,
    history?: {
        status: MaterialAdjustmentStatus,
        time: number
    }[]
};

export class MaterialAdjustmentsArrays {
    public collections: MaterialAdjustment[];

    public inboundMaterialRequests: MaterialAdjustment[];
    public outboundMaterialRequests: MaterialAdjustment[];

    public inboundMaterialTransfers: MaterialAdjustment[];
    public outboundMaterialTransfers: MaterialAdjustment[];

    public returns: MaterialAdjustment[];
    public yesterdaysReturns: MaterialAdjustment[];

    constructor(yesterDaysReturns: MaterialAdjustment[]) {
        this.collections = [];
        this.inboundMaterialRequests = [];
        this.outboundMaterialRequests = [];
        this.inboundMaterialTransfers = [];
        this.outboundMaterialTransfers = [];
        this.returns = [];
        this.yesterdaysReturns = yesterDaysReturns || [];
    }
}

export class MaterialAdjustments extends MaterialAdjustmentsArrays {

    public timestamp: number;
    public engineerId: string;

    constructor(engineerId: string, yesterDaysReturns: MaterialAdjustment[]) {
        super(yesterDaysReturns);
        this.engineerId = engineerId;
    }
}
