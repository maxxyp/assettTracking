import {BaseException} from "../core/models/baseException";

export class ApiException extends BaseException {
    public readonly httpStatusCode: string;
    constructor(context: any, reference: string, message: string, parameters: any[], data: any, httpStatusCode?: string | number) {
        super(context, reference, message, parameters, data);
        // if we have been given an httpStatusCode, force it to a string
        this.httpStatusCode = httpStatusCode !== undefined && httpStatusCode !== null
                                ? httpStatusCode + ""
                                : undefined;
    }
}
