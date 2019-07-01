import { IAppMetaDataService } from "../IAppMetaDataService";
import { IAppMetaData } from "../IAppMetaData";

export class AppMetaDataService implements IAppMetaDataService {
    public get(): Promise<IAppMetaData> {
        let packageInfo = Windows.ApplicationModel.Package.current;
        let version = packageInfo.id.version;

        return Promise.resolve<IAppMetaData>({
            appName: packageInfo.id.name,
            appId: packageInfo.id.familyName,
            appVersion: `${version.major}.${version.minor},${version.revision},${version.build}`,
            appInstallerId: packageInfo.id.publisherId,
            env: window.appBuildType
        });
    } 
}
