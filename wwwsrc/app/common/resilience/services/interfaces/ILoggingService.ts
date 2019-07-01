import {BaseException} from "../../../core/models/baseException";

export interface ILoggingService {
    information(message: string, data: any[]) : Promise<void>;
    error(exception: BaseException) : Promise<void>;
}
