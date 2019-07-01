/// <reference path="../../../../../typings/app.d.ts" />

import {IAssetService} from "../IAssetService";

export class AssetService implements IAssetService {
    public loadText(assetName: string): Promise<string> {
        return new Promise<string>((resolve) => {
            window.resolveLocalFileSystemURL(
                cordova.file.applicationDirectory + "www/assets/" + assetName,
                (fileEntry: FileEntry) => {
                    fileEntry.file((file: File) => {
                        let reader = new FileReader();
                        reader.onloadend = () => {
                            resolve(reader.result);
                        };
                        reader.readAsText(file);
                    }, (error: FileError) => {
                        resolve(null);
                    });
                }, (err) => {
                    resolve(null);
                });
        });
    }

    public loadArrayBuffer(assetName: string): Promise<ArrayBuffer> {
        return new Promise<ArrayBuffer>((resolve) => {
            window.resolveLocalFileSystemURL(
                cordova.file.applicationDirectory + "www/assets/" + assetName,
                (fileEntry: FileEntry) => {
                    fileEntry.file((file: File) => {
                        let reader = new FileReader();
                        reader.onloadend = () => {
                            resolve(reader.result);
                        };
                        reader.readAsArrayBuffer(file);
                    }, (error: FileError) => {
                        resolve(null);
                    });
                }, (err) => {
                    resolve(null);
                });
        });
    }

    public loadJson<T>(assetName: string): Promise<T> {
        return new Promise<T>((resolve) => {
            window.resolveLocalFileSystemURL(
                cordova.file.applicationDirectory + "www/assets/" + assetName,
                (fileEntry: FileEntry) => {
                    fileEntry.file((file: File) => {
                        let reader = new FileReader();
                        reader.onloadend = () => {
                            let jsonResponse: any = null;
                            try {
                                jsonResponse = JSON.parse(reader.result);
                            } catch (error) {
                                // handle this/log this?
                            }
                            resolve(jsonResponse);
                        };
                        reader.readAsText(file);
                    }, (error: FileError) => {
                        resolve(null);
                    });
                }, (err) => {
                    resolve(null);
                });
        });
    }
}
