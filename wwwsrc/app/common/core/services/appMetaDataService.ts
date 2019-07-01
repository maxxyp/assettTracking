import { PlatformServiceBase } from "../platformServiceBase";
import { IAppMetaDataService } from "./IAppMetaDataService";
import { IAppMetaData } from "./IAppMetaData";

export class AppMetaDataService extends PlatformServiceBase<IAppMetaDataService> implements IAppMetaDataService {
    
    constructor() {
        super("common/core/services", "AppMetaDataService");
    }

    public get(): Promise<IAppMetaData> {
        return this.loadModule().then((module) => {
            return module.get();
        });
    }    
}
