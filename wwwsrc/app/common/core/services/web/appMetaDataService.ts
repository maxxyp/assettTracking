import { IAppMetaDataService } from "../IAppMetaDataService";
import { IAppMetaData } from "../IAppMetaData";
import { IAssetService } from "../IAssetService";
import { AboutData } from "../../../ui/views/models/aboutData";
import { inject } from "aurelia-framework";
import { AssetService } from "../assetService";

@inject(AssetService)
export class AppMetaDataService implements IAppMetaDataService {

    private _assetService: IAssetService;

    constructor(assetService: IAssetService) {
        this._assetService = assetService;
    }

    public get(): Promise<IAppMetaData> {
        return this._assetService.loadJson<AboutData>("about.json")
            .then(aboutData => {
                return {
                    appName: aboutData.name,
                    appId: aboutData.name,
                    appVersion: window.appVersion,
                    appInstallerId: aboutData.name,
                    env: window.appBuildType
                };
            });
    } 
}
