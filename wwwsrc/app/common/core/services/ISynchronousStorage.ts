
export interface ISynchronousStorage {
    setSynchronous<T>(container: string, key: string, data: T) : void;
    getSynchronous<T>(container: string, key: string): T;
}
