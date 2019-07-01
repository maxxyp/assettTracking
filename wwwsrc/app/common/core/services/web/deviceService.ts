/// <reference path="../../../../../typings/app.d.ts" />

import {IDeviceService} from "../IDeviceService";
import {Guid} from "../../guid";

export class DeviceService implements IDeviceService {
    private _id: string;

    constructor() {
    }

    public getDeviceId(): Promise<string> {
        if (!this._id) {
            this._id = window.localStorage.getItem("uniqueDeviceId");

            if (!this._id) {
                this._id = Guid.newGuid();
                window.localStorage.setItem("uniqueDeviceId", this._id);
            }
        }

        return Promise.resolve(this._id);
    }

    public getDeviceType(): Promise<string> {
        return Promise.resolve(navigator.userAgent);
    }
}
