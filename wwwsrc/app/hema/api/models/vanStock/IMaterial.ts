export interface IMaterial {
    id?: number;
    materialCode: string;
    description: string;
    owner: string;
    quantity: number;
    storageZone: string;
    jobId: string;

    expectedReturnQuantity?: number;
    expectedReceiptQuantity?: number;
    reservedQuantity?: number;
}
