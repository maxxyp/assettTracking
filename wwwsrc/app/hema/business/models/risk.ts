import {DataStateProvider} from "./dataStateProvider";
import {DataState} from "./dataState";

export class Risk extends DataStateProvider {

    public id: string;
    public isCreated: boolean;
    public isUpdated: boolean;
    public isDeleted: boolean;

    public reason: string;
    public report: string;
    public isHazard: boolean;
    public date: Date;

    constructor() {
        super(DataState.notVisited, "risks");
    }
}
