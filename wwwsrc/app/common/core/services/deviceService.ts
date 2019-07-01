/// <reference path="../../../../typings/app.d.ts" />

import {PlatformServiceBase} from "../platformServiceBase";
import {IDeviceService} from "./IDeviceService";

export class DeviceService extends PlatformServiceBase<IDeviceService> implements IDeviceService {

    constructor() {
        super("common/core/services", "DeviceService");
    }

    public getDeviceId(): Promise<string> {
        return this.loadModule().then(module => {
            return module.getDeviceId();
        });
    }

    public getDeviceType(): Promise<string> {
        return this.loadModule().then(module => {
            return module.getDeviceType();
        });
    }
}
