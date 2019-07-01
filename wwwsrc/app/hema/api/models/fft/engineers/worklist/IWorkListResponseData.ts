import { IWorkListItem } from "./IWorkListItem";
import { IWorkListMemo } from "./IWorkListMemo";

export interface IWorkListResponseData {
    list: IWorkListItem[];
    memoList: IWorkListMemo[];
}
