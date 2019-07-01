import { IStorage } from "./IStorage";

export class BrowserLocalStorage implements IStorage {

    constructor() {
    }

    public get<T>(container: string, key : string) : Promise<T> {
        return new Promise<T>((resolve, reject) => {
            let ret: T = null;
            let data: string = window.localStorage.getItem(this.calcId(container, key));
            if (data) {
                ret = <T>JSON.parse(data);
            }
            resolve(ret);
        });
    }

    public set<T>(container: string, key : string, data : T) : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            window.localStorage.setItem(this.calcId(container, key), JSON.stringify(data));
            resolve();
        });
    }

    public remove(container: string, key : string) : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            window.localStorage.removeItem(this.calcId(container, key));
            resolve();
        });
    }

    public clear() : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            window.localStorage.clear();
            resolve();
        });
    }

    private calcId(container: string, key : string) : string {
        return container + "_" + key;
    }
}
