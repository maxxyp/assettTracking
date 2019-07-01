import { IRequestMaterial } from "./IRequestMaterial";
export interface IMaterialTransferRequest {
    material: IRequestMaterial;
    requestingEngineer: string;
    date: number;
    time: number;
}
