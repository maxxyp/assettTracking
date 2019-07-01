import { IRequestMaterial } from "./IRequestMaterial";
export interface IMaterialReceiptRequest {
    material: IRequestMaterial;
    date: number;
    time: number;
    receiptQuantity: number;
    id: number;
    jobId: string;
}
