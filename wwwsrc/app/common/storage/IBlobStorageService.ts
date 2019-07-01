/// <reference path="../../../typings/app.d.ts" />

export interface IBlobStorageService {
    initialise(storageName: string, removeExisting: boolean) : Promise<void>;
    closedown() : Promise<void>;

    write<T>(path: string, file: string, blob: T) : Promise<void>;
    read<T>(path: string, file: string) : Promise<T>;
    exists(path: string, file: string) : Promise<boolean>;
    size(path: string, file: string) : Promise<number>;
    remove(path: string, file: string) : Promise<void>;

    list(path: string) : Promise<string[]>;

    checkInitised(storageName: string): Promise<void>;    
}
