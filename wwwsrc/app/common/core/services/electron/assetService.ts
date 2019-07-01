/// <reference path="../../../../../typings/app.d.ts" />

import {inject} from "aurelia-framework";
import {IAssetService} from "../IAssetService";
import {HttpClient} from "../../httpClient";
import {IHttpClient} from "../../IHttpClient";
import {PlatformHelper} from "../../platformHelper";

@inject(HttpClient)
export class AssetService implements IAssetService {
    private _httpClient: IHttpClient;

    constructor(httpClient: IHttpClient) {
        this._httpClient = httpClient;
    }

    public loadText(assetName: string): Promise<string> {
        return new Promise<string>((resolve) => {
            this._httpClient.fetch(PlatformHelper.loaderPrefix + "./assets/" + assetName)
                .then((response: Response) => response.text())
                .then((text: string) => {
                    resolve(text);
                }).catch(() => {
                    resolve(null);
                });
            });
    }

    public loadArrayBuffer(assetName: string): Promise<ArrayBuffer> {
        return new Promise<ArrayBuffer>((resolve) => {
            this._httpClient.fetch(PlatformHelper.loaderPrefix + "./assets/" + assetName)
                .then((response: Response) => response.arrayBuffer())
                .then((arrayBuffer: ArrayBuffer) => {
                    resolve(arrayBuffer);
                })
                .catch(() => {
                    resolve(null);
                });
        });
    }

    public loadJson<T>(assetName: string): Promise<T> {
        return new Promise<T>((resolve) => {
            this._httpClient.fetch(PlatformHelper.loaderPrefix + "./assets/" + assetName)
                .then((response: Response) => response.json())
                .then((json: T) => {
                    resolve(json);
                })
                .catch(() => {
                    resolve(null);
                });
        });
    }
}
