import { IRequestMaterial } from "./IRequestMaterial";
export interface IMaterialReturnRequest {
    material: IRequestMaterial;
    date: number;
    time: number;
    jobId: string;
    reason: string;
}
