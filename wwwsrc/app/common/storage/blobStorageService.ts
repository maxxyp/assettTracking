/// <reference path="../../../typings/app.d.ts" />

import {IBlobStorageService} from "./IBlobStorageService";
import {PlatformServiceBase} from "../core/platformServiceBase";

export class BlobStorageService extends PlatformServiceBase<IBlobStorageService> implements IBlobStorageService {
    constructor() {
        super("common/storage", "BlobStorageService");
    }

    public checkInitised(storageName: string): Promise<void> {
        return this.loadModule().then(module => {
            return module.checkInitised(storageName);
        });
    }

    public initialise(storageName: string, removeExisting: boolean) : Promise<void> {
        return this.loadModule().then(module => {
            return module.initialise(storageName, removeExisting);
        });
    }

    public closedown() : Promise<void> {
        return this.loadModule().then(module => {
            return module.closedown();
        });
    }

    public write<T>(path: string, file: string, blob: T) : Promise<void> {
        return this.loadModule().then(module => {
            return module.write<T>(path, file, blob);
        });
    }

    public read<T>(path: string, file: string) : Promise<T> {
        return this.loadModule().then(module => {
            return module.read<T>(path, file);
        });
    }

    public exists(path: string, file: string) : Promise<boolean>  {
        return this.loadModule().then(module => {
            return module.exists(path, file);
        });
    }

    public size(path: string, file: string) : Promise<number>  {
        return this.loadModule().then(module => {
            return module.size(path, file);
        });
    }

    public remove(path: string, file: string) : Promise<void>  {
        return this.loadModule().then(module => {
            return module.remove(path, file);
        });
    }

    public list(path: string) : Promise<string[]>  {
        return this.loadModule().then(module => {
            return module.list(path);
        });
    }
}
