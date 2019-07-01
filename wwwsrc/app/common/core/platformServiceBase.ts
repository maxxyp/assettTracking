/// <reference path="../../../typings/app.d.ts" />

import {PlatformHelper} from "../../common/core/platformHelper";
import {Container} from "aurelia-dependency-injection";

export class PlatformServiceBase<T> {
    protected _service: T;
    private _serviceFolder: string;
    private _serviceName: string;

    constructor(serviceFolder: string, serviceName: string) {
        this._serviceFolder = serviceFolder;
        this._serviceName = serviceName;
        this._service = null;
    }

    public setService(service: T) : void {
        this._service = service;
    }

    public loadModule(): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            if (this._service) {
                resolve(this._service);
            } else {
                PlatformHelper.loadModule(this._serviceFolder, this.toCamelCase(this._serviceName))
                  .then((module: any) => {
                        this._service = Container.instance.invoke(module[this._serviceName]);
                        resolve(this._service);
                    })
                    .catch(() => {
                        reject(null);
                    });
            }
        });
    }

    private toCamelCase(name: string): string {
        return name.substr(0, 1).toLowerCase() + name.substr(1);
    }
}
