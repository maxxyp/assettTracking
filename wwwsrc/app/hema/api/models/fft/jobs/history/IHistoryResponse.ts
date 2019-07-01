import {IMeta} from "../../IMeta";
import {IJobHistory} from "./IJobHistory";

export interface IHistoryResponse {
    meta: IMeta;
    data: IJobHistory;
}
