import {Aurelia} from "aurelia-framework";
import {BaseException} from "./models/baseException";
import * as Logging from "aurelia-logging";

export class ErrorHandler {
    public static customErrorHandler: (error: BaseException) => void;

    public static init(aurelia: Aurelia): Promise<Aurelia> {
        let appLogger = Logging.getLogger("appLogger");
        window.onerror = (msg: string, url: string, line: number, col: number, error: Error) => {
            try {
                let message: string = "DEVELOPMENT ERROR: " + msg + "\nurl: " + url + "\nline: " + line;

                if (col) {
                    message += "\ncolumn: " + col;
                }
                if (error) {
                    message += "\nerror: " + error;
                }

                if (ErrorHandler.customErrorHandler) {
                    ErrorHandler.customErrorHandler(new BaseException(undefined, undefined, message, undefined, error));
                } else {
                    
                    appLogger.error(message);

                    /* tslint:disable:no-console ban-functions */
                    console.error(message);

                    alert(message);
                }
                /* tslint:enable:no-console ban-functions */
            } catch (e) {
                /* Dont want to cause another exception we will get stuck in an infinite loop */
            }

            /* Return true to suppress default error alert */
            return true;
        };

        Promise.onPossiblyUnhandledRejection((reason) => {
            try {
                let message: any;

                if (reason instanceof BaseException) {
                    message = reason;
                } else {
                    let cache: any[] = [];
                    /* avoid circular objects */
                    let objectJson: string = "";

                    if (reason.message && reason.stack) {
                        objectJson += reason.message + "\r\n" + reason.stack;
                    } else {
                        objectJson = JSON.stringify(reason, (key, value) => {
                            if (typeof value === "object" && value !== null) {
                                if (cache.indexOf(value) !== -1) {
                                    /* circular reference found, discard key */
                                    return;
                                }
                                /* circular reference found, discard key */
                                cache.push(value);
                            }
                            return value;
                        });
                    }

                    message = "UNHANDLED EXCEPTION ERROR:\r\n" + objectJson;
                }

                if (ErrorHandler.customErrorHandler) {
                    ErrorHandler.customErrorHandler(new BaseException(undefined, undefined, message, undefined, undefined));
                } else {
                    appLogger.error(message);

                    /* tslint:disable:no-console ban-functions */
                    console.error(message);

                    alert(message);
                    /* tslint:enable:no-console ban-functions */
                }
            } catch (e) {
                /* Dont want to cause another exception we will get stuck in an infinite loop */
            }
        });

        return Promise.resolve(aurelia);
    }
}
