import {DataState} from "./dataState";
import {IDataStateProvider} from "./IDataStateProvider";
import {Guid} from "../../../common/core/guid";

export class DataStateProvider implements IDataStateProvider {
    public dataState: DataState;
    public dataStateGroup: string;
    public dataStateId: string;

    constructor(dataState: DataState, dataStateGroup: string) {
        this.dataState = dataState;
        this.dataStateGroup = dataStateGroup;
        this.dataStateId = Guid.newGuid();
    }
}
