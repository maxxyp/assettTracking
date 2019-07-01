/// <reference path="../../../../typings/app.d.ts" />

export interface IAssetService {
    loadText(assetName: string): Promise<string>;
    loadArrayBuffer(assetName: string): Promise<ArrayBuffer>;
    loadJson<T>(assetName: string): Promise<T>;
}
