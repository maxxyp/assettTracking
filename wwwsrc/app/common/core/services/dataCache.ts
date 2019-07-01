import {IStorage} from "./IStorage";

export class DataCache implements IStorage {
    private _cache: { [id: string] : any };

    constructor() {
        this._cache = {};
    }

    public get<T>(container: string, key : string) : Promise<T> {
        return new Promise<T>((resolve) => {
            let ret: T = null;
            let itemId: string = this.calcId(container, key);

            if (this._cache[itemId]) {
                ret = <T>JSON.parse(this._cache[itemId]);
            }

            resolve(ret);
        });
    }

    public set<T>(container: string, key : string, data : T) : Promise<void> {
        return new Promise<void>((resolve) => {
            let itemId: string = this.calcId(container, key);
            this._cache[itemId] = JSON.stringify(data);
            resolve();
        });
    }

    public remove(container: string, key : string) : Promise<void> {
        return new Promise<void>((resolve) => {
            let itemId: string = this.calcId(container, key);

            if (this._cache[itemId]) {
                delete this._cache[itemId];
            }
            resolve();
        });
    }

    public clear() : Promise<void> {
        return new Promise<void>((resolve) => {
            this._cache = {};
            resolve();
        });
    }

    private calcId(container: string, key : string) : string {
        return container + "." + key;
    }
}
