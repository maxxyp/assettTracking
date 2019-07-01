import {DatabaseSchemaStore} from "./databaseSchemaStore";

export class DatabaseSchema {
    public name: string;
    public version: number;
    public storeSchemas: DatabaseSchemaStore[];

    constructor(name: string, version: number, storeSchemas: DatabaseSchemaStore[]) {
        this.name = name;
        this.version = version;
        this.storeSchemas = storeSchemas;
    }
}
