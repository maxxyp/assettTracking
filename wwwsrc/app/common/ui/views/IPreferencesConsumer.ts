/// <reference path="../../../../typings/app.d.ts" />

import {IStorage} from "../../core/services/IStorage";

export interface IPreferencesConsumer {
    load(storage: IStorage) : Promise<any>;
    save(storage: IStorage) : Promise<any>;
}
