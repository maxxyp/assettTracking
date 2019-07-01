import { IListObject } from "./IListObject";

export interface IListObjectResponse {
    data: {
        listObjects: IListObject[]
    };
}
