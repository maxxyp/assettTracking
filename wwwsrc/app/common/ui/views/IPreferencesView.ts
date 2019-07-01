/// <reference path="../../../../typings/app.d.ts" />

import {IPreferencesConsumer} from "./IPreferencesConsumer";
export interface IPreferencesView {
    validate() : Promise<boolean>;
    reset() : void;
    consumerToView(preferencesConsumer: IPreferencesConsumer) : void;
    viewToConsumer(preferencesConsumer: IPreferencesConsumer) : void;
}
