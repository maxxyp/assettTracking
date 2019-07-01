/// <reference path="../../../../../typings/app.d.ts" />

import {IAssetService} from "../IAssetService";
import {PlatformHelper} from "../../platformHelper";

export class AssetService implements IAssetService {

    public loadText(assetName: string): Promise<string> {
        return new Promise<string>((resolve) => {
            Windows.ApplicationModel.Package.current.installedLocation
                   .getFileAsync(PlatformHelper.wwwRoot() + "\\assets\\" + assetName.replace(/\//g, "\\")).then(
                (fileInFolder) => {
                    Windows.Storage.FileIO.readBufferAsync(fileInFolder).then(
                        (buffer) => {
                            let dataReader = Windows.Storage.Streams.DataReader.fromBuffer(buffer);
                            resolve(dataReader.readString(buffer.length));
                        },
                        (error) => {
                            resolve(null);
                        }
                    );
                },
                (error) => {
                    resolve(null);
                }
            );
        });
    }

    public loadArrayBuffer(assetName: string): Promise<ArrayBuffer> {
        return new Promise<ArrayBuffer>((resolve) => {
            Windows.ApplicationModel.Package.current.installedLocation
                   .getFileAsync(PlatformHelper.wwwRoot() + "\\assets\\" + assetName.replace(/\//g, "\\")).then(
                (fileInFolder) => {
                    Windows.Storage.FileIO.readBufferAsync(fileInFolder).then(
                        (buffer) => {
                            let dataReader = Windows.Storage.Streams.DataReader.fromBuffer(buffer);
                            let arr = new Array(buffer.length);
                            dataReader.readBytes(arr);
                            resolve(new Int8Array(arr));
                        },
                        (error) => {
                            resolve(null);
                        }
                    );
                },
                (error) => {
                    resolve(null);
                }
            );
        });
    }

    public loadJson<T>(assetName: string): Promise<T> {
        return new Promise<T>((resolve) => {
            Windows.ApplicationModel.Package.current.installedLocation
                   .getFileAsync(PlatformHelper.wwwRoot() + "\\assets\\" + assetName.replace(/\//g, "\\")).then(
                (fileInFolder) => {
                    Windows.Storage.FileIO.readBufferAsync(fileInFolder).then(
                        (buffer) => {
                            let jsonData: any = null;
                            let dataReader = Windows.Storage.Streams.DataReader.fromBuffer(buffer);
                            try {
                                jsonData = JSON.parse(dataReader.readString(buffer.length));
                            } catch (err) {
                                // handle catch?
                            }
                            resolve(jsonData);
                        },
                        (error) => {
                            resolve(null);
                        }
                    );
                },
                (error) => {
                    resolve(null);
                }
            );
        });
    }
}
