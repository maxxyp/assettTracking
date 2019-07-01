import {DatabaseSchemaStoreIndex} from "./databaseSchemaStoreIndex";

export class DatabaseSchemaStore {
    public name: string;
    public keyPath: string;
    public autoIncrement: boolean;
    public indexes: DatabaseSchemaStoreIndex[];

    constructor(name: string, keyPath: string, autoIncrement: boolean, indexes: DatabaseSchemaStoreIndex[]) {
        this.name = name;
        this.keyPath = keyPath;
        this.autoIncrement = autoIncrement;
        this.indexes = indexes;
    }
}
