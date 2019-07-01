/// <reference path="../../../../typings/app.d.ts" />

import {IStorage} from "../../core/services/IStorage";

export class SecureStorage implements IStorage {

    constructor() {
    }

    public get<T>(container: string, key: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {

            let localSettings: Windows.Storage.ApplicationDataContainer =
                Windows.Storage.ApplicationData.current.localSettings;
            if (this.calcId(container, key).length > 0) {
                let localSettingsValue: string = localSettings.values.lookup(this.calcId(container, key));

                if (localSettingsValue) {

                    let data: Windows.Storage.Streams.IBuffer = Windows.Security.Cryptography.
                        CryptographicBuffer.decodeFromBase64String(localSettingsValue);

                    this.decryptData(data)
                        .then((result) => {
                            return <T>result;
                        })
                        .then((getResult) => {
                            resolve(getResult);
                        })
                        .catch((error) => {
                            reject(null);
                        });
                } else {
                    resolve(null);
                }
            } else {
                resolve(null);
            }
        });
    }

    public set<T>(container: string, key: string, data: T): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            let getEncryptedData: string;
            if (data !== null) {
                this.encryptData(data).then((result) => {

                    getEncryptedData = Windows.Security.Cryptography.
                        CryptographicBuffer.encodeToBase64String(result);
                    if (this.calcId(container, key).length > 0 && getEncryptedData.length > 0) {
                        Windows.Storage.ApplicationData.current.localSettings.values.
                            insert(this.calcId(container, key), getEncryptedData);
                    }
                })
                    .then(() => {
                        resolve();
                    }).catch((error: any) => {
                        reject(error);
                    });
            } else {
                reject("data is null");
            }
        });
    }

    public remove(container: string, key: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Windows.Storage.ApplicationData.current.localSettings.values.remove(this.calcId(container, key));
            resolve();
        });
    }

    public clear(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Windows.Storage.ApplicationData.current.localSettings.values.clear();
            resolve();
        });
    }

    private calcId(container: string, key: string): string {
        return container + "_" + key;
    }

    private encryptData<T>(data: T): Promise<Windows.Storage.Streams.IBuffer> {
        return new Promise<Windows.Storage.Streams.IBuffer>((resolve, reject) => {
            if (data) {
                let strMsg: string = JSON.stringify(data);
                let strDescriptor: string = "LOCAL=user";

                let provider = new Windows.Security.Cryptography.DataProtection.DataProtectionProvider(strDescriptor);

                let buffMsg = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(strMsg,
                    Windows.Security.Cryptography.BinaryStringEncoding.utf8);

                provider.protectAsync(buffMsg).done((result) => {
                    resolve(result);
                }, (err) => {
                    reject(err);
                });
            } else {
                reject();
            }
        });
    }

    private decryptData<T>(data: Windows.Storage.Streams.IBuffer): Promise<T> {
        return new Promise<T>((resolve, reject) => {

            let provider = new Windows.Security.Cryptography.DataProtection.DataProtectionProvider();
            if (data) {
                provider.unprotectAsync(data).done((result) => {
                    let resultString = Windows.Security.Cryptography.CryptographicBuffer.convertBinaryToString(
                        Windows.Security.Cryptography.BinaryStringEncoding.utf8, result);

                    let binaryToStringData = <T>JSON.parse(resultString);

                    resolve(binaryToStringData);
                }, (err) => {
                    reject(err);
                });
            } else {
                reject();
            }
        });
    }
}
