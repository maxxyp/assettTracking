/// <reference path="../../../typings/app.d.ts" />

import { IDatabaseService } from "./IDatabaseService";
import { DatabaseSchema } from "./models/databaseSchema";
import { DatabaseSchemaStore } from "./models/databaseSchemaStore";
import { ArrayHelper } from "../core/arrayHelper";

export class IndexedDatabaseService implements IDatabaseService {
    private _db: { [key: string]: IDBDatabase };
    private _isCompoundAvailable: boolean;

    constructor() {
        this._db = {};
        // 20413 - window.navigator.userAgent.indexOf("Edge") is unreliable in production,
        //  leading to an Edge-based instance attempting to use compound indexes => goes bang
        this._isCompoundAvailable = false; // window.navigator.userAgent.indexOf("Edge") < 0;
    }

    public create(schema: DatabaseSchema): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let request = window.indexedDB.open(schema.name, schema.version);
            request.onupgradeneeded = () => {
                this._db[schema.name] = request.result;

                if (schema.storeSchemas) {
                    for (let i = 0; i < schema.storeSchemas.length; i++) {
                        if (this._db[schema.name].objectStoreNames.contains(schema.storeSchemas[i].name)) {
                            this._db[schema.name].deleteObjectStore(schema.storeSchemas[i].name);
                        }

                        let store = this._db[schema.name].createObjectStore(schema.storeSchemas[i].name, {
                            keyPath: schema.storeSchemas[i].keyPath,
                            autoIncrement: schema.storeSchemas[i].autoIncrement
                        });

                        if (schema.storeSchemas[i].indexes) {
                            for (let j = 0; j < schema.storeSchemas[i].indexes.length; j++) {
                                let isCompound = ArrayHelper.isArray(schema.storeSchemas[i].indexes[j].keyPath);

                                if (!isCompound || (isCompound && this._isCompoundAvailable)) {
                                    store.createIndex(schema.storeSchemas[i].indexes[j].name,
                                        schema.storeSchemas[i].indexes[j].keyPath,
                                        { unique: schema.storeSchemas[i].indexes[j].unique }
                                    );
                                }
                            }
                        }
                    }
                }
            };

            request.onsuccess = () => {
                this._db[schema.name] = request.result;
                resolve();
            };

            request.onerror = (ev: ErrorEvent) => {
                reject(ev.message);
            };

        });
    }

    public open(databaseName: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let request = window.indexedDB.open(databaseName);
            request.onsuccess = () => {
                this._db[databaseName] = request.result;
                resolve();
            };
            request.onerror = (ev: ErrorEvent) => {
                reject(ev.message);
            };
        });
    }

    public close(databaseName: string): Promise<void> {
        if (this._db === null && this._db[databaseName]) {
            return Promise.reject("Database must be open to close it");
        }

        return new Promise<void>((resolve, reject) => {
            this._db[databaseName].close();
            this._db[databaseName] = null;
            resolve();
        });
    }

    public destroy(databaseName: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let request = window.indexedDB.deleteDatabase(databaseName);
            request.onsuccess = () => {
                resolve();
            };
            request.onerror = (ev: ErrorEvent) => {
                reject("Database:" + databaseName + "\n" + ev.message);
            };
            request.onblocked = () => {
                reject("Database:" + databaseName + "\n" + "The database operation is blocked, probably because it is locked by another browser tab");
            };
        });
    }

    public exists(databaseName: string, storeName: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let dbExists: boolean = true;
            let request = window.indexedDB.open(storeName);

            request.onupgradeneeded = (e: any) => {
                e.target.transaction.abort();
                dbExists = false;
                resolve(dbExists);
            };

            request.onsuccess = () => {
                this._db[databaseName] = request.result;
                resolve(dbExists);
            };

            request.onerror = (ev: ErrorEvent) => {
                reject("Store:" + storeName + "\n" + ev.message);
            };
        });
    }

    public storeExists(databaseName: string, storeName: string): Promise<boolean> {
        return Promise.resolve(this._db[databaseName].objectStoreNames.contains(storeName));
    }

    public storeCreate(databaseName: string, databaseSchemaStore: DatabaseSchemaStore): Promise<void> {
        if (this._db === null && this._db[databaseName] === null) {
            return Promise.reject("Database must be open to create store '" + databaseSchemaStore.name + "'");
        }

        return new Promise<void>((resolve, reject) => {
            let version: number = this._db[databaseName].version;
            let name = this._db[databaseName].name;

            this._db[databaseName].close();
            this._db[databaseName] = null;

            version++;

            let request = window.indexedDB.open(name, version);

            request.onupgradeneeded = () => {
                this._db[databaseName] = request.result;

                if (this._db[databaseName].objectStoreNames.contains(databaseSchemaStore.name)) {
                    this._db[databaseName].deleteObjectStore(databaseSchemaStore.name);
                }

                let store = this._db[databaseName].createObjectStore(databaseSchemaStore.name, {
                    keyPath: databaseSchemaStore.keyPath,
                    autoIncrement: databaseSchemaStore.autoIncrement
                });

                if (databaseSchemaStore.indexes) {
                    for (let j = 0; j < databaseSchemaStore.indexes.length; j++) {
                        let isCompound = ArrayHelper.isArray(databaseSchemaStore.indexes[j].keyPath);

                        if (!isCompound || (isCompound && this._isCompoundAvailable)) {
                            store.createIndex(databaseSchemaStore.indexes[j].name,
                                databaseSchemaStore.indexes[j].keyPath,
                                { unique: databaseSchemaStore.indexes[j].unique }
                            );
                        }
                    }
                }
            };

            request.onsuccess = () => {
                this._db[databaseName] = request.result;
                resolve();
            };

            request.onerror = (ev: ErrorEvent) => {
                reject(ev.message);
            };
        });
    }

    public storeRemove(databaseName: string, storeName: string): Promise<void> {
        if (this._db === null && this._db[databaseName] === null) {
            return Promise.reject("Database must be open to remove a store '" + storeName + "'");
        }

        return new Promise<void>((resolve, reject) => {
            let version: number = this._db[databaseName].version;
            let name = this._db[databaseName].name;

            this._db[databaseName].close();
            this._db[databaseName] = null;

            version++;

            let request = window.indexedDB.open(name, version);

            request.onupgradeneeded = () => {
                this._db[databaseName] = request.result;

                if (this._db[databaseName].objectStoreNames.contains(storeName)) {
                    this._db[databaseName].deleteObjectStore(storeName);
                }
            };

            request.onsuccess = () => {
                this._db[databaseName] = request.result;
                resolve();
            };

            request.onerror = (ev: ErrorEvent) => {
                reject(ev.message);
            };
        });
    }

    public set<T>(databaseName: string, storeName: string, data: T): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let trans: IDBTransaction = this._db[databaseName].transaction(storeName, "readwrite");
            let store: IDBObjectStore = trans.objectStore(storeName);

            let request = store.put(data);
            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (ev: ErrorEvent) => {
                reject("Store:" + storeName + "\n" + ev.message);
            };
        });
    }

    public get<T>(databaseName: string, storeName: string, indexName: string, indexValues: any[]): Promise<T> {
        return this.getAll<T>(databaseName, storeName, indexName, indexValues)
            .then((values) => {
                return values && values.length > 0 ? values[0] : undefined;
            });
    }

    public getIndexes(databaseName: string, storeName: string): DOMStringList {

        let trans: IDBTransaction = this._db[databaseName].transaction(storeName, "readonly");
        let store: IDBObjectStore = trans.objectStore(storeName);

        return store.indexNames;
    }

    public getAll<T>(databaseName: string, storeName: string, indexName?: string, indexValue?: any): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            let trans: IDBTransaction = this._db[databaseName].transaction(storeName, "readonly");
            let store: IDBObjectStore = trans.objectStore(storeName);

            let request: IDBRequest;
            let compoundIndexes = indexName && indexName.split("_");
            let compoundLookup = false;

            /* is this a compound index that we cant use directly ? */
            if (compoundIndexes && compoundIndexes.length > 1 && !this._isCompoundAvailable) {
                /* this is a compound index so indexValue must be an array so use
                this first entry for lookup and then filter on the rest in the results */

                let index: IDBIndex = store.index(compoundIndexes[0]);
                let rangeTest: IDBKeyRange = IDBKeyRange.only(indexValue[0]);
                request = index.openCursor(rangeTest);
                compoundLookup = true;
            } else {

                let rangeTest: IDBKeyRange;
                if (indexValue) {
                    rangeTest = IDBKeyRange.only(indexValue);
                }

                if (indexName) {
                    let index: IDBIndex = store.index(indexName);
                    if (rangeTest) {
                        request = index.openCursor(rangeTest);
                    } else {
                        request = index.openCursor();
                    }
                } else {
                    if (rangeTest) {
                        request = store.openCursor(rangeTest);
                    } else {
                        request = store.openCursor();
                    }
                }
            }

            let items: T[] = [];

            request.onsuccess = () => {
                let cursor: IDBCursorWithValue = request.result;
                if (cursor) {
                    if (compoundLookup) {
                        let matches = true;
                        for (let i = 1; i < indexValue.length && matches; i++) {
                            if (cursor.value[compoundIndexes[i]] !== indexValue[i]) {
                                matches = false;
                            }
                        }
                        if (matches) {
                            items.push(cursor.value);
                        }
                    } else {
                        items.push(cursor.value);
                    }
                    cursor.continue();
                }
            };

            trans.oncomplete = () => {
                resolve(items);
            };

            request.onerror = (ev: ErrorEvent) => {
                reject("Store:" + storeName + "\n" + ev.message);
            };
        });
    }

    public setAll<T>(databaseName: string, storeName: string, data: T[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let trans: IDBTransaction = this._db[databaseName].transaction(storeName, "readwrite");
            let store: IDBObjectStore = trans.objectStore(storeName);

            let idx = 0;
            if (data && data.length > 0) {

                let putNext = () => {
                    if (idx < data.length) {
                        let request = store.put(data[idx]);
                        request.onsuccess = putNext;
                        request.onerror = (ev: ErrorEvent) => {
                            reject("Store:" + storeName + "\n" + ev.message);
                        };
                        idx++;
                    } else {
                        resolve();
                    }
                };

                putNext();
            } else {
                resolve();
            }
        });
    }

    public remove(databaseName: string, storeName: string, key: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let trans: IDBTransaction = this._db[databaseName].transaction(storeName, "readwrite");
            let store: IDBObjectStore = trans.objectStore(storeName);

            let request = store.delete(key);
            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (ev: ErrorEvent) => {
                reject("Store:" + storeName + "\n" + ev.message);
            };
        });
    }

    public removeAll(databaseName: string, storeName: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let trans: IDBTransaction = this._db[databaseName].transaction(storeName, "readwrite");
            let store: IDBObjectStore = trans.objectStore(storeName);

            let request = store.clear();
            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (ev: ErrorEvent) => {
                reject("Store:" + storeName + "\n" + ev.message);
            };
        });
    }

}
