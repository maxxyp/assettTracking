/// <reference path="../../../typings/app.d.ts" />

import { DatabaseSchema } from "./models/databaseSchema";
import { DatabaseSchemaStore } from "./models/databaseSchemaStore";

export interface IDatabaseService {
    create(schema: DatabaseSchema): Promise<void>;
    open(databaseName: string): Promise<void>;
    close(databaseName: string): Promise<void>;
    destroy(databaseName: string): Promise<void>;
    exists(databaseName: string, storeName: string): Promise<boolean>;

    storeExists(databaseName: string, storeName: string): Promise<boolean>;
    storeCreate(databaseName: string, storeSchema: DatabaseSchemaStore): Promise<void>;
    storeRemove(databaseName: string, storeName: string): Promise<void>;

    set<T>(databaseName: string, storeName: string, data: T): Promise<void>;
    get<T>(databaseName: string, storeName: string, indexName: string, indexValue: any): Promise<T>;
    getIndexes(databaseName: string, storeName: string): DOMStringList;

    getAll<T>(databaseName: string, storeName: string, indexName?: string, indexValue?: any): Promise<T[]>;
    setAll<T>(databaseName: string, storeName: string, data: T[]): Promise<void>;

    remove(databaseName: string, storeName: string, key: any): Promise<void>;
    removeAll(databaseName: string, storeName: string): Promise<void>;
}
