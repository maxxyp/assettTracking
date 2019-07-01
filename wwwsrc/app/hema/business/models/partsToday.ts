import {DataStateProvider} from "./dataStateProvider";
import {DataState} from "./dataState";
import {Part} from "./part";

export class PartsToday extends DataStateProvider {
    public parts: Part[];

    constructor() {
        super(DataState.notVisited, "parts");

        this.parts = [];
    }
}
