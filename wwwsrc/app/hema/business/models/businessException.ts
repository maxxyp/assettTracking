import {BaseException} from "../../../common/core/models/baseException";

export class BusinessException extends BaseException {
    constructor(context: any, reference: string, message: string, parameters: any[], data: any) {
        super(context, reference, message, parameters, data);
    }
}
