import {ObjectHelper} from "../objectHelper";

export class BaseException {
    public context: string;
    public reference: string;
    public message: string;
    public parameters: any[];
    public data: any;
    public stackTrace: string[];

    public innerException: BaseException;

    constructor(context: any, reference: string, message: string, parameters: any[], data: any) {
        this.context = ObjectHelper.getClassName(context);
        this.reference = reference;
        this.message = message;
        this.parameters = parameters;

        if (data instanceof BaseException) {
            this.innerException = data;
        } else {
            this.data = data;
        }

        let stack: string = "";
        if (this.data && this.data.stack) {
            stack = this.data.stack;
        } else {
            stack = new Error("").stack;
        }

        if (stack) {
            this.stackTrace = stack.split("\n");

            if (stack.length > 3) {
                this.stackTrace = this.stackTrace.slice(3);
            }
        }
    }

    public static exceptionToStringInternal(baseException: BaseException) : string {
        let parts: string[] = [];

        if (baseException.context && baseException.reference) {
            parts.push(ObjectHelper.getClassName(baseException.context) + "::" + baseException.reference);
        }
        if (baseException.message) {
            parts.push(BaseException.substituteParameters(baseException.message, baseException.parameters));
        }

        if (baseException.data) {
            if (baseException.data.message) {
                parts.push(baseException.data.message);
            } else {
                parts.push(JSON.stringify(baseException.data));
            }
        }

        if (baseException.stackTrace) {
            baseException.stackTrace.forEach(st => {
                parts.push(st);
            });
        }

        if (baseException.innerException) {
            parts.push("-----------------------------------------------------------------");
            parts.push(this.exceptionToStringInternal(baseException.innerException));
        }

        return parts.join("\r\n\r\n");
    }

    public static substituteParameters(message: string, parameters: any[]) : string {
        return message && parameters ? message.replace(/{(\d+)}/g, (match, idx) => {
            return parameters[idx];
        }) : message;
    }

    public get resolvedMessage(): string {
        let message: string = " ";
        try {
            let exception: any = this;
            while (exception && exception instanceof BaseException) {
                let typedException = <BaseException>exception;
                message += BaseException.substituteParameters(typedException.message, typedException.parameters) + " ";
                exception = exception.innerException;
            }
        } catch (err) {

        }
        return message;
    }

    public toString() : string {
        return BaseException.exceptionToStringInternal(this);
    }
}
