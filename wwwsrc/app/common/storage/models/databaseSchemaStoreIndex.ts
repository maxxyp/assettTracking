export class DatabaseSchemaStoreIndex {
    public name: string;
    public keyPath: string | string[];
    public unique: boolean;

    constructor(name: string, keyPath: string | string[], unique: boolean) {
        this.name = name;
        this.keyPath = keyPath;
        this.unique = unique;
    }
}
