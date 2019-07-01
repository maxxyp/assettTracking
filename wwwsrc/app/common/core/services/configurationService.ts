/// <reference path="../../../../typings/app.d.ts" />

import {IConfigurationService} from "./IConfigurationService";
import {PlatformServiceBase} from "../platformServiceBase";
import { BaseException } from "../models/baseException";

export class ConfigurationService extends PlatformServiceBase<IConfigurationService> implements IConfigurationService {

    constructor() {
        super("common/core/services", "ConfigurationService");
    }

    public getConfiguration<T>(childName?: string): T {
        return this._service.getConfiguration<T>(childName);
    }

    public load<T>(): Promise<T> {
        return this.loadModule().then(module => {
            return module.load<T>();
        });
    }

    public overrideSettings(settings: {[key: string]: any}): void {
        if (!this._service || !this._service.getConfiguration()) {
            throw new BaseException(this, "ConfigurationService", "Overriding configuration settings before the base configuration is loaded", [], null);
        }
        return this._service.overrideSettings(settings);
    }
}
