/// <reference path="../../../../../typings/app.d.ts" />

import {IDeviceService} from "../IDeviceService";

export class DeviceService implements IDeviceService {
    private _id: string;

    constructor() {
    }

    public getDeviceId(): Promise<string> {
        if (!this._id) {
            if (Windows.Foundation.Metadata.ApiInformation.isTypePresent("Windows.System.Profile.HardwareIdentification")) {
                let token = Windows.System.Profile.HardwareIdentification.getPackageSpecificToken(null);
                if (token && token.id) {
                    this._id = Windows.Security.Cryptography.CryptographicBuffer.encodeToBase64String(token.id);
                    this._id = this.base64EncodeUrl(this._id);
                }
            }
        }
        return Promise.resolve(this._id);
    }

    public getDeviceType(): Promise<string> {
        let deviceType: string = "";

        let clientDeviceInformation = new Windows.Security.ExchangeActiveSyncProvisioning.EasClientDeviceInformation();

        if (clientDeviceInformation) {
            deviceType = clientDeviceInformation.systemProductName;
        }

        return Promise.resolve(deviceType);
    }

    private base64EncodeUrl(str: string): string {
        return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/\=+$/, "");
    }
}
