import { IAddress } from "./IAddress";

export interface ICustomer {
    id: string;
    password: string;
    initials: string;
    title: string;
    firstName: string;
    middleName: string;
    lastName: string;
    homePhone: string;
    workPhone: string;
    address: IAddress;
}
