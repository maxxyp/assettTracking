import {DataState} from "./dataState";

export interface IDataStateProvider {
    dataState: DataState;
    dataStateGroup: string;
    dataStateId: string;
}
