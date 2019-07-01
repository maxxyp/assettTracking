define(["require", "exports", "./models/baseException", "aurelia-logging"], function (require, exports, baseException_1, Logging) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ErrorHandler = /** @class */ (function () {
        function ErrorHandler() {
        }
        ErrorHandler.init = function (aurelia) {
            var appLogger = Logging.getLogger("appLogger");
            window.onerror = function (msg, url, line, col, error) {
                try {
                    var message = "DEVELOPMENT ERROR: " + msg + "\nurl: " + url + "\nline: " + line;
                    if (col) {
                        message += "\ncolumn: " + col;
                    }
                    if (error) {
                        message += "\nerror: " + error;
                    }
                    if (ErrorHandler.customErrorHandler) {
                        ErrorHandler.customErrorHandler(new baseException_1.BaseException(undefined, undefined, message, undefined, error));
                    }
                    else {
                        appLogger.error(message);
                        /* tslint:disable:no-console ban-functions */
                        console.error(message);
                        alert(message);
                    }
                    /* tslint:enable:no-console ban-functions */
                }
                catch (e) {
                    /* Dont want to cause another exception we will get stuck in an infinite loop */
                }
                /* Return true to suppress default error alert */
                return true;
            };
            Promise.onPossiblyUnhandledRejection(function (reason) {
                try {
                    var message = void 0;
                    if (reason instanceof baseException_1.BaseException) {
                        message = reason;
                    }
                    else {
                        var cache_1 = [];
                        /* avoid circular objects */
                        var objectJson = "";
                        if (reason.message && reason.stack) {
                            objectJson += reason.message + "\r\n" + reason.stack;
                        }
                        else {
                            objectJson = JSON.stringify(reason, function (key, value) {
                                if (typeof value === "object" && value !== null) {
                                    if (cache_1.indexOf(value) !== -1) {
                                        /* circular reference found, discard key */
                                        return;
                                    }
                                    /* circular reference found, discard key */
                                    cache_1.push(value);
                                }
                                return value;
                            });
                        }
                        message = "UNHANDLED EXCEPTION ERROR:\r\n" + objectJson;
                    }
                    if (ErrorHandler.customErrorHandler) {
                        ErrorHandler.customErrorHandler(new baseException_1.BaseException(undefined, undefined, message, undefined, undefined));
                    }
                    else {
                        appLogger.error(message);
                        /* tslint:disable:no-console ban-functions */
                        console.error(message);
                        alert(message);
                        /* tslint:enable:no-console ban-functions */
                    }
                }
                catch (e) {
                    /* Dont want to cause another exception we will get stuck in an infinite loop */
                }
            });
            return Promise.resolve(aurelia);
        };
        return ErrorHandler;
    }());
    exports.ErrorHandler = ErrorHandler;
});

//# sourceMappingURL=errorHandler.js.map
