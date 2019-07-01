import {BaseException} from "../../core/models/baseException";

export class LoggingEntry {
    public type: "error" | "information";
    public date: number;
    public message: string;
    public data: any[];
    public exception: BaseException;
}
