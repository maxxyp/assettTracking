import {IGetJobData} from "./IGetJobData";
import { IMeta } from "../IMeta";

export interface IGetJobResponse {
    meta: IMeta;
    data: IGetJobData;
}
