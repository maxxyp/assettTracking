import {IWhoAmIAttributes} from "./IWhoAmIAttributes";

export interface IWhoAmI {
    userid: string;
    attributes: IWhoAmIAttributes[];
    roles: string[];
}
