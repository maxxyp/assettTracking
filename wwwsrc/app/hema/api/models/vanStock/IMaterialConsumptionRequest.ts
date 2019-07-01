import { IRequestMaterial } from "./IRequestMaterial";
export interface IMaterialConsumptionRequest {
    material: IRequestMaterial;
    jobId: string;
    date: number;
    time: number;
}
