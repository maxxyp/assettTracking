/// <reference path="../../../../typings/app.d.ts" />

import {IAssetService} from "./IAssetService";
import {PlatformServiceBase} from "../platformServiceBase";

export class AssetService extends PlatformServiceBase<IAssetService> implements IAssetService {

    constructor() {
        super("common/core/services", "AssetService");
    }

    public loadText(assetName: string): Promise<string> {
        return this.loadModule().then(module => {
            return module.loadText(assetName);
        });
    }

    public loadArrayBuffer(assetName: string): Promise<ArrayBuffer> {
        return this.loadModule().then(module => {
            return module.loadArrayBuffer(assetName);
        });
    }

    public loadJson<T>(assetName: string): Promise<T> {
        return this.loadModule().then(module => {
            return module.loadJson<T>(assetName);
        });
    }
}
