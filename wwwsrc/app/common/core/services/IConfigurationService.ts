/// <reference path="../../../../typings/app.d.ts" />

export interface IConfigurationService {
    getConfiguration<T>(childName?: string): T;

    load<T>(): Promise<T>;

    overrideSettings(settings: {[key: string]: any}): void;
}
