import { IRequestMaterial } from "./IRequestMaterial";
export interface IMaterialRequestRequest {
    material: IRequestMaterial;
    requestingEngineer: string;
    date: number;
    time: number;
}
