import {Address} from "./address";
export class CustomerContact {
    public id: string;
    public password: string;
    public initials: string;
    public title: string;
    public firstName: string;
    public middleName: string;
    public lastName: string;
    public homePhone: string;
    public workPhone: string;
    public address: Address;
}