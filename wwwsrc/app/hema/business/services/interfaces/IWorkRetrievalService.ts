export interface IWorkRetrievalService {
    initialise() : Promise<void>;
    stopStarRefreshWorkList(startMonitoring: boolean): void;
    sendRequestWorkAndPollWorkList(): Promise<void>;
    refreshWorkList(): Promise<void>;
}
