import {IStorage} from "../../../common/core/services/IStorage";
import {ISynchronousStorage} from "../../../common/core/services/ISynchronousStorage";

export class HemaStorage implements IStorage, ISynchronousStorage {
    public get<T>(container: string, key : string) : Promise<T> {
            let ret: T = undefined;
            let data: string = window.localStorage.getItem(this.calcId(container, key));
            if (data) {
                try {
                    ret = <T>JSON.parse(data);
                } catch (e) {
                    return Promise.reject(e);
                }
            }
            return Promise.resolve(ret);
    }

    public set<T>(container: string, key : string, data : T) : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (data === undefined || data === null) {
                window.localStorage.removeItem(this.calcId(container, key));
            } else {
                window.localStorage.setItem(this.calcId(container, key), JSON.stringify(data));
            }
            resolve();
        });
    }

    public getSynchronous<T>(container: string, key : string) : T {
        let data: string = window.localStorage.getItem(this.calcId(container, key));
        return data ? <T>JSON.parse(data) : undefined;
    }

    public setSynchronous<T>(container: string, key : string, data : T) : void {
        if (data === undefined || data === null) {
            window.localStorage.removeItem(this.calcId(container, key));
        } else {
            window.localStorage.setItem(this.calcId(container, key), JSON.stringify(data));
        }
    }

    public remove(container: string, key : string) : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            window.localStorage.removeItem(this.calcId(container, key));
            resolve();
        });
    }

    public clear() : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const archiveKey = "db:archive:archive"; // horrible kludge
            const archive = window.localStorage.getItem(archiveKey);
            window.localStorage.clear();
            if (archive) {
                window.localStorage.setItem(archiveKey, archive);
            }
            resolve();
        });
    }

    private calcId(container: string, key : string) : string {
        return container + "_" + key;
    }
}
