import { IReferenceData } from "./IReferenceData";
import { IReferenceMeta } from "./IReferenceMeta";

export interface IReferenceDataGroup {
    meta: IReferenceMeta;
    data: IReferenceData;
}
