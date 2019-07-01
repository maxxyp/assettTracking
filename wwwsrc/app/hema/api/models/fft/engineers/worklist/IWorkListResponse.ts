import { IWorkListResponseData } from "./IWorkListResponseData";
import { IMeta } from "../../IMeta";

export interface IWorkListResponse {
    meta: IMeta;
    data: IWorkListResponseData;
}
