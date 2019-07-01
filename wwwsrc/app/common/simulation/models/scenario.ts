import {Mutation} from "./mutation";
import {Schema} from "./schema";

export class Scenario<T, V> {
    public status: number;
    public statusText: string[];
    public data: T;
    public dataSchemaName: string;
    public dataSchema: Schema;
    public delay: number;
    public retryCount: number;
    public retryCurrent: number;
    public mutations: Mutation<T>[];
    public disableCache: boolean;

    public response: V;
    public responseSchemaName: string;
    public responseSchema: Schema;
}
