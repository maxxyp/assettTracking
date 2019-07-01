import { ReferenceVersion } from "../../models/reference/referenceVersion";
import { IListObject } from "../../../api/models/fft/reference/IListObject";
import { IReferenceIndex } from "../../../api/models/fft/reference/IReferenceIndex";
export interface IReferenceDataService {
    initialise(): Promise<void>;
    shouldUserRefreshReferenceData(): Promise<boolean>;

    getItems<T>(storeName: string, indexName: string, indexValue: any): Promise<T[]>;
    getItem<T>(storeName: string, indexName: string, indexValue: any): Promise<T>;

    clear(): Promise<void>;

    getVersions(): ReferenceVersion[];

    generateCleanRemoteIndex(listObjects: IListObject[]): IReferenceIndex[];
}
