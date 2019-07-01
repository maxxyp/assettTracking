import { ICustomer } from "./ICustomer";
import { IPart } from "./IPart";

export interface IPartCollectionResponse {
    data: {
        customer: ICustomer
        list: IPart [];
    };
}
