export interface IStorage {
    get<T>(container: string, key: string): Promise<T>;

    set<T>(container: string, key: string, data: T) : Promise<void>;

    remove(container: string, key: string) : Promise<void>;

    clear(): Promise<void>;
}
