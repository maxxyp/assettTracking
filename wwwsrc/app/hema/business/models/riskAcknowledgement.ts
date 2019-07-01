import { DataStateProvider } from "./dataStateProvider";
import { DataState } from "./dataState";

export class RiskAcknowledgement extends DataStateProvider {
    public messageRead: boolean;

    constructor() {
        super(DataState.invalid, "risks");
        this.messageRead = false;
    }

}
