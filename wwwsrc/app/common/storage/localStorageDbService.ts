import { IDatabaseService } from "./IDatabaseService";
import { DatabaseSchema } from "./models/databaseSchema";
import { DatabaseSchemaStore } from "./models/databaseSchemaStore";

type Storage = {
    def: {pk: string, autoIncrement: boolean, lastAutoIncrementValue?: number},
    data: any[]
};

export class LocalStorageDbService implements IDatabaseService {

    public async create(schema: DatabaseSchema): Promise<void> {
        for (let storeSchema of schema.storeSchemas || []) {
            await this.storeCreate(schema.name, storeSchema);
        }
    }

    public async open(databaseName: string): Promise<void> {
        // noop
    }

    public async close(databaseName: string): Promise<void> {
        // noop
    }

    public async destroy(databaseName: string): Promise<void> {
        let storeNames = this.getDbStoreNames(databaseName);
        storeNames.forEach(storeName => this.storeRemove(databaseName, storeName));
    }

    public async exists(databaseName: string, storeName: string): Promise<boolean> {
        return !!this.getDbStoreNames(databaseName).length;
    }

    public async storeExists(databaseName: string, storeName: string): Promise<boolean> {
        let key = this.getKeyFromNames(databaseName, storeName);
        return !!localStorage[key];
    }

    public async storeCreate(databaseName: string, storeSchema: DatabaseSchemaStore): Promise<void> {
        let key = this.getKeyFromNames(databaseName, storeSchema.name);
        if (!localStorage[key]) {

            let freshStorage =  <Storage> {
                                    def: {
                                        pk: storeSchema.keyPath,
                                        autoIncrement: storeSchema.autoIncrement,
                                        lastAutoIncrementValue: storeSchema.autoIncrement ? -1 : undefined
                                    },
                                    data: []
                                };

            this.setStore(key, freshStorage);
        }
    }
    public async storeRemove(databaseName: string, storeName: string): Promise<void> {
        let key = this.getKeyFromNames(databaseName, storeName);
        localStorage.removeItem(key);
    }

    public async set<T>(databaseName: string, storeName: string, data: T): Promise<void> {
        await this.setAll<T>(databaseName, storeName, [data]);
    }

    public async get<T>(databaseName: string, storeName: string, indexName: string, indexValue: any): Promise<T> {
        return (await this.getAll<T>(databaseName, storeName, indexName, indexValue))[0];
    }

    public getIndexes(databaseName: string, storeName: string): DOMStringList {
        let key = this.getKeyFromNames(databaseName, storeName);
        let store = this.getStore(key);
        const { pk } = store.def;

        // in reality because we're nor really an indexedDb implementation,
        //   any field can be queried without being an index, so not sure about this...
        // maybe we store the indexes passed in during storeCreate in def and be strict about only
        //  allowing querying on these predefined indexes..
        let result = <DOMStringList>{
            length: 1,
            contains: (name: string) => name === pk,
            item: (index: number) => index === 0 ? pk : null,
        };
        result[0] = pk;

        return result;
    }

    public async getAll<T>(databaseName: string, storeName: string, indexName?: string, indexValue?: any): Promise<T[]> {
        let storeKey = this.getKeyFromNames(databaseName, storeName);
        let data = this.getStore(storeKey).data;

        return indexName
            ? data.filter(item => item[indexName] === indexValue)
            : data;
    }

    public async setAll<T>(databaseName: string, storeName: string, data: T[]): Promise<void> {
        // this applies the incoming data to the store, it does not replace the store with this set
        let key = this.getKeyFromNames(databaseName, storeName);
        let store = this.getStore(key);
        const { autoIncrement, pk, lastAutoIncrementValue } = store.def;

        let workingAutoIncrementValue = lastAutoIncrementValue;
        data.forEach((item: any) => {
            let exitingIndex = store.data.findIndex(storeItem => storeItem[pk] === item[pk]);
            if (exitingIndex === -1) {
                if (autoIncrement) {
                    item[pk] = ++workingAutoIncrementValue;
                } else if (item[pk] === null || item[pk] === undefined) {
                    throw new Error("PK must be supplied for a non-autoincrement store");
                }
                store.data.push(item);
            } else {
                store.data[exitingIndex] = item;
            }
        });
        store.def.lastAutoIncrementValue = workingAutoIncrementValue;

        this.setStore(key, store);
    }

    public async remove(databaseName: string, storeName: string, key: any): Promise<void> {
        let storeKey = this.getKeyFromNames(databaseName, storeName);
        let store = this.getStore(storeKey);
        store.data = store.data.filter(item => item[store.def.pk] !== key);
        this.setStore(storeKey, store);
    }

    public async removeAll(databaseName: string, storeName: string): Promise<void> {
        let storeKey = this.getKeyFromNames(databaseName, storeName);
        let store = this.getStore(storeKey);
        store.data = [];
        this.setStore(storeKey, store);
    }

    private getKeyFromNames(dbName: string, storeName: string): string {
        return `db:${dbName}:${storeName}`;
    }

    private getDbStoreNames(dbName: string): string[] {
        let myStoreKeys: string[] = [];

        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).indexOf(`db:${dbName}`) === 0) {
                myStoreKeys.push(localStorage.key(i).replace(`db:${dbName}:`, ""));
            }
        }
        return myStoreKeys;
    }

    private getStore(key: string): Storage {
        let storedString = localStorage[key];
        return storedString && JSON.parse(storedString);
    }

    private setStore(key: string, value: Storage): void {
        localStorage.setItem(key, JSON.stringify(value));
    }
}
