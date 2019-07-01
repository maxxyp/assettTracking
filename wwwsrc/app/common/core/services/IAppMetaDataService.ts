import { IAppMetaData } from "./IAppMetaData";

export interface IAppMetaDataService {
    get: () => Promise<IAppMetaData>;
}
