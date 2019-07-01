import {IPartOrdered} from "./IPartOrdered";

export interface IPartsOrderedForTask {
    id: string;
    fieldTaskId: string;
    deliverToSite: boolean;

    parts: IPartOrdered[];
}
